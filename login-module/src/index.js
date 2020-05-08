import { WebAuth } from 'auth0-js'
import Certificate from './certificate'
import Quiz from './quiz'
import Enrollment from './enrollment'

window.GraphAcademy = class GraphAcademy {
  constructor (options = {}) {
    const defaultOptions = {
      stage: 'prod',
      trainingClassName: null
    }
    this.requiredOptions = ['trainingClassName', 'stage']
    this.options = { ...defaultOptions, ...options }
    const hasRequiredOptions = this.hasRequiredOptions(this.options)
    if (!hasRequiredOptions) {
      throw new Error(`required params - one of ${this.requiredOptions.join(', ')} is missing`)
    }
    this.webAuth = new WebAuth({
      clientID: 'hoNo6B00ckfAoFVzPTqzgBIJHFHDnHYu',
      domain: 'login.neo4j.com',
      redirectUri: `${window.location.origin}/accounts/login`,
      audience: 'neo4j://accountinfo/',
      scope: 'read:account-info openid email profile user_metadata',
      responseType: 'token id_token'
    })
    this.enrollment = new Enrollment(options.trainingClassName, options.stage)
    this.quiz = new Quiz(options.trainingClassName, options.stage)
    this.certificate = new Certificate(options.trainingClassName, options.stage)
  }

  hasRequiredOptions (options) {
    return this.requiredOptions.every(item => options[item])
  }

  async checkSession () {
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
        if (result) {
          this.authResult = result
        }
        resolve(result)
      })
    })
  }

  async enrollStudentInClass (firstName, lastName) {
    return await this.enrollment.enrollStudentInClass(firstName, lastName, await this._getAccessToken())
  }

  logout () {
    const { options } = this
    const logoutOptions = {}
    if (options.logoutRedirectUrl) {
      logoutOptions.returnTo = options.logoutRedirectUrl
    }
    this.webAuth.logout(logoutOptions)
  }

  redirectToLogin () {
    const { options } = this
    return window.location.href = options.loginRedirectUrl
  }

  async _getAccessToken () {
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
