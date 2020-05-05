import constants from './constants';
import Axios from 'axios';
import to from 'await-to-js';
import Auth0Lock from 'auth0-lock';

var STAGE = "prod";
var API_BASE_URL = `https://nmae7t4ami.execute-api.us-east-1.amazonaws.com/${STAGE}`;

window.GraphAcademyLogin = class GraphAcademyLogin {
	constructor(options = {}) {
		console.log('constructor called');
		console.log(constants.auth0Options);
		if (!Auth0Lock || typeof Auth0Lock !== 'function') return;
		this.lock = new Auth0Lock('hoNo6B00ckfAoFVzPTqzgBIJHFHDnHYu', 'login.neo4j.com', constants.auth0Options);
		this.options = options;
		this.checkSession(options.callback);
	}

	checkSession(cb) {
		console.log('Here');
		this.handleHtmlOnState('checkingSession');
		this.lock.checkSession({}, async (err, result) => {
			console.log(err, result);
			if (result) {
				this.isLoggedIn = true;
				this.authResult = result;
				const enrollment = await this.getEnrollmentForClass();
				console.log(enrollment);
				if (this.callback && typeof this.callback === 'function') this.callback()
			} else {
				this.isLoggedIn = false;
			}
			if (err && this.options.loginRedirectUrl) {
				this.redirectToLogin();
			}
			this.handleHtmlOnState(result ? 'loggedIn' : 'notLoggedIn');
			if (cb && typeof cb === 'function') cb(err, result);
		})
	}

	handleHtmlOnState(state = null) {
		console.log('Doing change state');
		const showIfLoggedIn = document.getElementsByClassName(this.options.classStates['loggedIn']) || [];
		const notShowIfLoggedIn = document.getElementsByClassName(this.options.classStates['notLoggedIn']) || [];
		const showIfCheckingSession = document.getElementsByClassName(this.options.classStates['checkingSession']) || [];

		switch (state) {
			case 'loggedIn':
				for (let item of showIfLoggedIn) {
					item.style.display = 'inherit';
				}
				for (let item of notShowIfLoggedIn) {
					item.style.display = 'none';
				}
				for (let item of showIfCheckingSession) {
					item.style.display = 'none';
				}
				break;

			case 'notLoggedIn':
				for (let item of showIfLoggedIn) {
					item.style.display = 'none';
				}
				for (let item of notShowIfLoggedIn) {
					item.style.display = 'inherit';
				}
				for (let item of showIfCheckingSession) {
					item.style.display = 'none';
				}
				break;

			case 'checkingSession':
				for (let item of showIfLoggedIn) {
					item.style.display = 'none';
				}
				for (let item of notShowIfLoggedIn) {
					item.style.display = 'none';
				}
				for (let item of showIfCheckingSession) {
					item.style.display = 'inherit';
				}
				break;

			default:
				break;
		}
	}

	logout() {
		const logoutOptions = {};
		if (this.options.logoutOptions && this.options.logoutOptions.shouldRedirect) logoutOptions.redirectTo = this.options.redirectOnLogout;
		this.lock.logout(logoutOptions);
		this.handleHtmlOnState('notLoggedIn');
	}

	redirectToLogin() {
		return window.location.href = this.options.loginRedirectUrl;
	}

	async getClassCertificate() {
		const body = {
			"className": this.options.trainingClassName,
		}
		const [err, response] = await to(Axios.post(API_BASE_URL + `/genClassCertificate`, JSON.stringify(body), {
			headers: {
				"Authorization": this.authResult.accessToken,
				"Accept": 'application/json, text/javascript, */*; q=0.01',
				'Content-Type': 'application/json',
			}
		}))
		return [err, response];
	}

	async getEnrollmentForClass() {
		const [err, response] = await to(Axios.get(API_BASE_URL + `/getClassEnrollment?className=${this.options.trainingClassName}`, {
			headers: {
				"Authorization": this.authResult.accessToken,
				"Accept": 'application/json, text/javascript, */*; q=0.01',
				'Content-Type': 'application/json',
			}
		}))
		return [err, response];
	}

	async enrollStudentInClass(firstName, lastName) {
		const body = {
			"className": this.options.trainingClassName,
			"firstName": firstName,
			"lastName": lastName
		}
		const [err, response] = await to(Axios.post(API_BASE_URL + `/setClassEnrollment`, JSON.stringify(body), {
			headers: {
				"Authorization": this.authResult.accessToken,
				"Accept": 'application/json, text/javascript, */*; q=0.01',
				'Content-Type': 'application/json',
			}
		}))
		return [err, response];
	}

	// logTrainingView() {
	// 	return $.ajax
	// 		({
	// 			type: "POST",
	// 			url: API_BASE_URL + "/logTrainingView",
	// 			contentType: "application/json",
	// 			dataType: 'json',
	// 			async: true,
	// 			data: JSON.stringify(
	// 				{
	// 					"className": window.trainingClassName,
	// 					"partName": window.trainingPartName || 'uknown'
	// 				}),
	// 			headers: {
	// 				"Authorization": this.authResult.accessToken
	// 			}
	// 		});
	// }

}