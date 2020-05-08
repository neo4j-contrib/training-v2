import 'whatwg-fetch'
import backend from './backend'

export default class GraphAcademyQuiz {
  constructor (trainingClassName, stage) {
    this.trainingClassName = trainingClassName
    this.apiBaseUrl = backend.getApiBaseUrl(stage)
  }

  async getQuizStatus (accessToken) {
    return fetch(`${this.apiBaseUrl}/getQuizStatus?className=${this.trainingClassName}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken
        }
      })
      .then((response) => backend.checkHttpStatus(response))
      .then((response) => response.json())
  }

  async postQuizStatus (passed, failed, accessToken) {
    return fetch(`${this.apiBaseUrl}/setQuizStatus`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken
        },
        body: JSON.stringify({
          className: trainingClassName,
          passed,
          failed
        })
      })
      .then((response) => backend.checkHttpStatus(response))
      .then((response) => response.json())
  }
}
