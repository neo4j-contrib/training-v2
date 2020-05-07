import constants from './constants';
import Axios from 'axios';
import to from 'await-to-js';

export default {
	async getEnrollmentForClass(trainingClassName, accessToken) {
		console.log(accessToken);
		const [err, response] = await to(Axios.get(constants.API_BASE_URL + `/getClassEnrollment?className=${trainingClassName}`, {
			headers: {
				"Authorization": accessToken,
				"Accept": 'application/json, text/javascript, */*; q=0.01',
				'Content-Type': 'application/json',
			}
		}))
		return [err, response];
	},

	async enrollStudentInClass(firstName, lastName, trainingClassName, accessToken) {
		const body = {
			"className": trainingClassName,
			"firstName": firstName,
			"lastName": lastName
		}
		const [err, response] = await to(Axios.post(constants.API_BASE_URL + `/setClassEnrollment`, JSON.stringify(body), {
			headers: {
				"Authorization": accessToken,
				"Accept": 'application/json, text/javascript, */*; q=0.01',
				'Content-Type': 'application/json',
			}
		}))
		return [err, response];
	}
}