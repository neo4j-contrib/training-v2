import { WebAuth } from 'auth0-js'
import Quiz from './quiz'
import Enrollment from './enrollment'
import Certificate from './certificate'

function validateOptions(options, requiredOptions, defaultOptions) {
	const opts = { ...defaultOptions, ...options }
	const hasRequiredOptions = requiredOptions.every(item => opts[item])
	if (!hasRequiredOptions) {
		throw new Error(`required option missing - one of ${requiredOptions.join(', ')}`)
	}
	return opts
}

class GraphAcademyServices {
	constructor(options = {}) {
		const requiredOptions = ['trainingClassName', 'enrollmentUrl', 'authResult']
		this.options = validateOptions(options, requiredOptions, {})
		const { stage, trainingClassName, authResult } = this.options
		this.authResult = authResult
		this.certificate = new Certificate(trainingClassName, stage)
		this.enrollment = new Enrollment(trainingClassName, stage)
		this.quiz = new Quiz(trainingClassName, stage)
	}

	async enrollStudentInClass (firstName, lastName) {
		return this.enrollment.enrollStudentInClass(firstName, lastName, this.getAccessToken())
	}

	async getEnrollmentForClass() {
		return this.enrollment.getEnrollmentForClass(this.getAccessToken())
	}

	async getQuizStatus() {
		return this.quiz.getQuizStatus(this.getAccessToken())
	}

	async getClassCertificate() {
		return this.certificate.getClassCertificate(this.getAccessToken())
	}

	async postQuizStatus(passed, failed) {
		return this.quiz.postQuizStatus(passed, failed, this.getAccessToken())
	}

	getAccessToken () {
		return this.authResult.accessToken
	}
}

export default class GraphAcademyCore {
	constructor(options = {}) {
		const requiredOptions = ['trainingClassName', 'enrollmentUrl']
		const defaultOptions = {
			stage: 'prod',
			trainingClassName: null,
			enrollmentUrl: null,
		}
		this.options = validateOptions(options, requiredOptions, defaultOptions)
		this.webAuth = new WebAuth({
			clientID: 'hoNo6B00ckfAoFVzPTqzgBIJHFHDnHYu',
			domain: 'login.neo4j.com',
			redirectUri: `${window.location.origin}/accounts/login`,
			audience: 'neo4j://accountinfo/',
			scope: 'read:account-info openid email profile user_metadata',
			responseType: 'token id_token'
		})
	}

	async login() {
		const { options, webAuth } = this
		return new Promise((resolve, _) => {
			webAuth.checkSession({}, async (err, result) => {
				if (err) {
					return resolve([err, null])
				}
				if (result && result.accessToken) {
					options.authResult = result
					return resolve([null, new GraphAcademyServices(options)])
				}
				return resolve([new Error('Invalid authentication result'), result])
			})
		})
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
}
