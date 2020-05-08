import Axios from 'axios';
import to from 'await-to-js';
import constants from './constants';

export default {
	async getClassCertificate(trainingClassName, accessToken, stage) {
		const body = {
			"className": trainingClassName,
		}
		const [err, response] = await to(Axios.post(constants.getApiBaseUrl(stage) + `/genClassCertificate`, JSON.stringify(body), {
			headers: {
				"Authorization": accessToken,
				"Accept": 'application/json, text/javascript, */*; q=0.01',
				'Content-Type': 'application/json',
			}
		}))
		return [err, response];
	}
}