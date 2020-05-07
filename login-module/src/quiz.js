import constants from './constants';
import Axios from 'axios';
import to from 'await-to-js';

export default {
	async getQuizStatus(trainingClassName, accessToken) {
		return $.ajax
			({
				type: "GET",
				url: constants.API_BASE_URL + "/getQuizStatus?className=" + trainingClassName,
				contentType: "application/json",
				dataType: 'json',
				async: true,
				headers: {
					"Authorization": accessToken
				}
			});
	},

	async postQuizStatus(passed, failed, trainingClassName, accessToken) {
		return $.ajax
			({
				type: "POST",
				url: constants.API_BASE_URL + "/setQuizStatus",
				contentType: "application/json",
				dataType: 'json',
				async: true,
				data: JSON.stringify(
					{
						"className": trainingClassName,
						"passed": passed,
						"failed": failed
					}),
				headers: {
					"Authorization": accessToken
				}
			});
	},

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