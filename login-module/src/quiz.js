import constants from './constants';
import Axios from 'axios';
import to from 'await-to-js';

export default class GraphAcademyQuiz {

	constructor(trainingClassName, stage) {
		this.trainingClassName = trainingClassName
		this.apiBaseUrl = constants.getApiBaseUrl(stage)
	}

	async getQuizStatus(accessToken) {
		return $.ajax
			({
				type: "GET",
				url: this.apiBaseUrl + "/getQuizStatus?className=" + this.trainingClassName,
				contentType: "application/json",
				dataType: 'json',
				async: true,
				headers: {
					"Authorization": accessToken
				}
			});
	}

	async postQuizStatus(passed, failed, accessToken) {
		return $.ajax
			({
				type: "POST",
				url: this.apiBaseUrl + "/setQuizStatus",
				contentType: "application/json",
				dataType: 'json',
				async: true,
				data: JSON.stringify(
					{
						"className": this.trainingClassName,
						"passed": passed,
						"failed": failed
					}),
				headers: {
					"Authorization": accessToken
				}
			});
	}
}
