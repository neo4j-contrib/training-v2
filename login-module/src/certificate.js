import to from 'await-to-js'
import 'whatwg-fetch'
import backend from './backend'

export default class GraphAcademyCertificate {

	constructor(trainingClassName, stage) {
		this.trainingClassName = trainingClassName
		this.apiBaseUrl = backend.getApiBaseUrl(stage)
	}

	async getClassCertificate(accessToken) {
		const body = {
			className: this.trainingClassName
		}
		const [err, response] = await to(fetch(`${this.apiBaseUrl}/genClassCertificate`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: accessToken
				},
				body: JSON.stringify(body)
			})
			.then((response) => backend.checkHttpStatus(response))
			.then((response) => response.json()))
		return [err, response]
	}
}
