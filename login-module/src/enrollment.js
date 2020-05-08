import constants from './constants';
import Axios from 'axios';
import to from 'await-to-js';

export default class GraphAcademyEnrollment {

	constructor(trainingClassName, stage) {
		this.trainingClassName = trainingClassName
		this.apiBaseUrl = constants.getApiBaseUrl(stage)
	}

	async getEnrollmentForClass(accessToken) {
		const [err, response] = await to(Axios.get(this.apiBaseUrl + `/getClassEnrollment?className=${this.trainingClassName}`, {
			headers: {
				"Authorization": accessToken,
				"Accept": 'application/json, text/javascript, */*; q=0.01',
				'Content-Type': 'application/json',
			}
		}))
		return [err, response];
	}

	async enrollStudentInClass(firstName, lastName, accessToken) {
		const body = {
			"className": this.trainingClassName,
			"firstName": firstName,
			"lastName": lastName
		}
		const [err, response] = await to(Axios.post(this.apiBaseUrl + `/setClassEnrollment`, JSON.stringify(body), {
			headers: {
				"Authorization": accessToken,
				"Accept": 'application/json, text/javascript, */*; q=0.01',
				'Content-Type': 'application/json',
			}
		}))
		return [err, response];
	}
}
