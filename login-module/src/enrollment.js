import to from 'await-to-js'
import 'whatwg-fetch'
import backend from './backend'

export default class GraphAcademyEnrollment {
	constructor(trainingClassName, stage) {
		this.trainingClassName = trainingClassName
		this.apiBaseUrl = backend.getApiBaseUrl(stage)
	}

	async getEnrollmentForClass(accessToken) {
		const [err, response] = await to(fetch(`${this.apiBaseUrl}/getClassEnrollment?className=${this.trainingClassName}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: accessToken
				}
			})
			.then((response) => backend.checkHttpStatus(response))
			.then((response) => response.json()))
		return [err, response]
	}

	async enrollStudentInClass(firstName, lastName, accessToken) {
		const body = {
			className: this.trainingClassName,
			firstName,
			lastName
		}
		const [err, response] = await to(fetch(`${this.apiBaseUrl}/setClassEnrollment`,
			{
				method: 'POST',
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
