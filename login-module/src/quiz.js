import constants from './constants';
import Axios from 'axios';
import to from 'await-to-js';

export default class GraphAcademyQuiz {
	async getQuizStatus(trainingClassName, accessToken, stage) {
		const [err, response] = await to(Axios.get(constants.getApiBaseUrl(stage) + `/getQuizStatus?className=${trainingClassName}`, {
			headers: {
				'Authorization': accessToken,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}))
		return [err, response];
	}

	async postQuizStatus(passed, failed, trainingClassName, accessToken, stage) {
		const body = {
			"className": trainingClassName,
			"passed": passed,
			"failed": failed
		}
		const [err, response] = await to(Axios.post(constants.getApiBaseUrl(stage) + `/setQuizStatus`, JSON.stringify(body), {
			headers: {
				'Authorization': accessToken,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}))
		return [err, response];
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
