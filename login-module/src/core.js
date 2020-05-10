import constants from './constants'
import { WebAuth } from 'auth0-js'
import Quiz from './quiz'
import Enrollment from './enrollment'
import Certificate from './certificate'

export default class GraphAcademyCore {
	constructor(options = {}) {
		this.options = { ...constants.DEFAULT_OPTIONS, ...options }
		const hasRequiredOptions = this.hasRequiredOptions(options)
		if (!hasRequiredOptions) {
			console.log(`required params missing - one of ${constants.REQUIRED_OPTIONS.join(', ')}`)
			return
		}
		this.webAuth = new WebAuth({
			clientID: 'hoNo6B00ckfAoFVzPTqzgBIJHFHDnHYu',
			domain: 'login.neo4j.com',
			redirectUri: `${window.location.origin}/accounts/login`,
			audience: 'neo4j://accountinfo/',
			scope: 'read:account-info openid email profile user_metadata',
			responseType: 'token id_token'
		})
		const { stage, trainingClassName } = this.options;
		this.certificate = new Certificate(trainingClassName, stage)
		this.enrollment = new Enrollment(trainingClassName, stage)
		this.quiz = new Quiz(trainingClassName, stage)
	}

	hasRequiredOptions(options) {
		return constants.REQUIRED_OPTIONS.every(item => options[item])
	}

	async checkSession() {
		const { options, webAuth } = this
		return new Promise((resolve, reject) => {
			webAuth.checkSession({}, async (err, result) => {
				if (err) {
					delete this.authResult
					if (options.loginRedirectUrl) {
						this.redirectToLogin()
					}
					return reject(err)
				}
				this.authResult = result
				resolve(result)
			})
		})
	}

	async enrollStudentInClass (firstName, lastName) {
		const accessToken = await this.getAccessToken();
		return this.enrollment.enrollStudentInClass(firstName, lastName, accessToken)
	}

	logout() {
		const { options } = this
		const logoutOptions = {}
		if (options.logoutOptions && options.logoutOptions.shouldRedirect) {
			logoutOptions.redirectTo = options.redirectOnLogout
		}
		this.webAuth.logout(logoutOptions)
	}

	redirectToLogin() {
		const { options } = this
		return window.location.href = options.loginRedirectUrl
	}

	async getAccessToken () {
		let accessToken
		if (this.authResult && this.authResult.accessToken) {
			accessToken = this.authResult.accessToken
		} else {
			const authResult = await this.checkSession()
			accessToken = authResult.accessToken
		}
		return accessToken
	}
}
