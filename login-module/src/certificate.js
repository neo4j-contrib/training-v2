import Axios from 'axios';
import to from 'await-to-js';
import constants from './constants';

export default class GraphAcademyCertificate {

	constructor(trainingClassName, stage) {
		this.trainingClassName = trainingClassName
		this.apiBaseUrl = constants.getApiBaseUrl(stage)
	}

	async getClassCertificate(accessToken) {
		const body = {
			"className": this.trainingClassName,
		}
		const [err, response] = await to(Axios.post(this.apiBaseUrl + `/genClassCertificate`, JSON.stringify(body), {
			headers: {
				"Authorization": accessToken,
				"Accept": 'application/json, text/javascript, */*; q=0.01',
				'Content-Type': 'application/json',
			}
		}))
		return [err, response];
	}
}
