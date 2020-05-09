import backend from './backend';
import Axios from 'axios';
import to from 'await-to-js';

export default class GraphAcademyQuiz {

	constructor(trainingClassName, stage) {
		this.trainingClassName = trainingClassName
		this.apiBaseUrl = backend.getApiBaseUrl(stage)
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

	gradeQuiz(theQuiz, quizesStatus) {
		const moduleName = theQuiz.attr("id");
		let quizSuccess = true;

		if (quizesStatus.passed.indexOf(moduleName) > -1) {
			return true;
		}

		theQuiz.find("h3").css("color", "#525865");

		theQuiz.find(".required-answer").each(function () {
			if (!$(this).prev(":checkbox").prop("checked")) {
				$(this).closest(".ulist").siblings("h3").css("color", "red");
				quizSuccess = false;
			}
		});
		theQuiz.find(".false-answer").each(function () {
			if ($(this).prev(":checkbox").prop("checked")) {
				$(this).closest(".ulist").siblings("h3").css("color", "red");
				quizSuccess = false;
			}
		});
		return quizSuccess;
	}
}
