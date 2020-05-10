import constants from './constants';
import GraphAcademyCore from './core';
import Quiz from './quiz';
import Enrollment from './enrollment';
import Certificate from './certificate';
import misc from './misc';

window.GraphAcademyLogin = class GraphAcademyLogin {
	constructor(options = {}) {
		this.options = { ...constants.DEFAULT_OPTIONS, ...options };
		const hasRequiredOptions = this.hasRequiredOptions(this.options);
		if (!hasRequiredOptions) {
			console.log(`required params missing - one of ${constants.REQUIRED_OPTIONS.join(', ')}`);
			return;
		}
		this.core = new GraphAcademyCore(this.options);
		this.certificate = new Certificate(this.options.trainingClassName, this.options.stage)
		this.enrollment = new Enrollment(this.options.trainingClassName, this.options.stage)
		this.quiz = new Quiz(this.options.trainingClassName, this.options.stage)
		// User data
		this.quizesStatus = [];
		this.enrollmentStatus = [];
		this.currentModule = '';
		this.quizModuleCount = null;
		this.currentModuleQuizStatus = null;
	}

	hasRequiredOptions(options) {
		return constants.REQUIRED_OPTIONS.every(item => options[item]);
	}

	async checkSession(cb) {
		const { options, core } = this;
		misc.handleHtmlOnState('checkingSession', options);
		try {
			const result = await core.checkSession();
			if (result) {
				const accessToken = result.accessToken;
				// Handle enrollment
				const [err, enrollmentResponse] = await this.enrollment.getEnrollmentForClass(accessToken);
				if (enrollmentResponse.status === 200) {
					this.enrollmentStatus = enrollmentResponse.data;
				}

				if (!this.enrollmentStatus.enrolled && options.enrollmentUrl) {
					window.location.href = options.enrollmentUrl;
				}

				if (!options.isCourseLandingPage && this.enrollmentStatus.enrolled) {
					if (this.enrollmentStatus.enrolled) await this.handleQuizSetup();
				}

				// Hanlde callback
				if (this.callback && typeof this.callback === 'function') this.callback()
			}

			misc.handleHtmlOnState(result ? 'loggedIn' : 'notLoggedIn', options);
			if (cb && typeof cb === 'function') cb(err, result);
		} catch (e) {
			console.error('Unable to check session', e);
		}
	}

	async enrollStudentInClass(firstName, lastName) {
		const { core, enrollment } = this;
		const accessToken = await core.getAccessToken();
		return await enrollment.enrollStudentInClass(firstName, lastName, accessToken);
	}

	async handleQuizSetup() {
		const { core, quiz } = this;
		const accessToken = await core.getAccessToken();
		const value = await quiz.getQuizStatus(accessToken);
		this.quizesStatus = value['quizStatus'];
		this.currentModule = $(".quiz").attr("id");
		this.currentModuleQuizStatus = this.quizesStatus.passed.indexOf(this.currentModule) > -1 ? 'passed' : 'failed';
		if (this.quizesStatus.untried.indexOf(this.currentModule) > -1) this.currentModuleQuizStatus = 'untried';
		this.quizModuleCount = this.quizesStatus.passed.length + this.quizesStatus.failed.length + this.quizesStatus.untried.length;

		await this.handleSummaryPageHtml();
		this.attachQuizSubmit();
		await this.updateQuizRelateHtml();
	}

	attachQuizSubmit() {
		$('.next-section').click(async (event) => {
			event.preventDefault();
			const quizElement = $(".quiz").first();
			const hrefSuccess = event.target.href;

			// If the module does not have quiz, then quizElement does not exist
			if (!quizElement.length === 0) {
				document.location = hrefSuccess;
				return;
			}

			const { core, quizesStatus, quiz } = this;
			const quizSuccess = quiz.gradeQuiz(quizElement, quizesStatus);

			if (quizSuccess) {
				$("#submit-message").remove();
				// Move current module from failed/untried to passed
				const index = quizesStatus[this.currentModuleQuizStatus].indexOf(this.currentModule);
				quizesStatus[this.currentModuleQuizStatus].splice(index, 1);
				quizesStatus.passed.push(this.currentModule);
			} else {
				$(".next-section").before("<div id='submit-message'><p id='submit-message'><span style='color: red'>Please correct errors</span> in quiz responses above to continue.  Questions with incorrect responses are highlighted in <span style='color: red'>red</span>.</p></div>");
				$("#submit-message").append("<div class='paragraph'><a href='" + hrefSuccess + "'>Click here</a> if you wish to advance to next section without passing the quiz.</div>")
			}

			const { passed, failed } = quizesStatus;
			const accessToken = await core.getAccessToken();
			quiz.postQuizStatus(passed, failed, accessToken).then(
				function () {
					if (quizSuccess) {
						document.location = hrefSuccess;
					}
				}
			);
		});
	}

	async updateQuizRelateHtml() {
		const { quizesStatus } = this;
		for (let index in quizesStatus.passed) {
			const moduleName = quizesStatus.passed[index];
			$('#menu-' + moduleName + ' .fa-stack').css('color', 'green');
			$('#menu-' + moduleName + ' .fa-stack-1x').html('<span class="fa fa-check" style="padding-top: 6px"></span>');

			$("#" + moduleName + "-progress").removeClass("fa-circle-thin");
			$("#" + moduleName + "-progress").removeClass("fa-close");
			$("#" + moduleName + "-progress").removeClass("fa-check");

			$("#" + moduleName + "-progress").css("color", "green");
			$("#" + moduleName + "-progress").addClass("fa-check");
		}

		for (let index in quizesStatus.failed) {
			const moduleName = quizesStatus.failed[index];
			$("#" + moduleName + "-progress").removeClass("fa-circle-thin");
			$("#" + moduleName + "-progress").removeClass("fa-close");
			$("#" + moduleName + "-progress").removeClass("fa-check");

			$("#" + moduleName + "-progress").css("color", "red");
			$("#" + moduleName + "-progress").addClass("fa-close");
		}

		// If the current quiz is passed, clicking on continue wil take to next page.
		const isCurrentQuizPass = this.currentModuleQuizStatus === 'passed';
		if (isCurrentQuizPass) {
			$("#_grade_quiz_and_continue h3").text("Quiz successfully submitted.");
			$(".quiz").hide();
			$(".next-section").unbind("click");
			$(".next-section").click(function (event) {
				document.location = event.target.href;
				return false;
			});
		}
	}

	async handleSummaryPageHtml() {
		const { quizesStatus, quizModuleCount, core } = this;
		// Only into effect on the last page of the course
		if (quizesStatus.passed.length === quizModuleCount) {
			$('#quizes-result').html("<p>All quizes taken successfully.</p>");
		} else {
			$('#quizes-result').html("<p>Some quizes not answered successfully.  Return to course modules by clicking on the numbers  in the navigation at the top of the page.</p>");
		}

		const certificateElement = $('#cert-result');
		if (certificateElement.length) {
			certificateElement.html("<i>... Checking for certificate ...</i>");
			const accessToken = await core.getAccessToken();
			const [err, result] = await this.certificate.getClassCertificate(accessToken);
			if (result && result.data && result.data.url) {
				$('#cert-result').html("<a href=\"" + result.data['url'] + "\">Download Certificate</a>");
			} else {
				$('#cert-result').html("Certificate not available yet.  Did you complete the quizzes at the end of each section?");
			}
		}
	}

	logout() {
		this.core.logout();
		misc.handleHtmlOnState('notLoggedIn', this.options);
	}

	redirectToLogin() {
		this.core.redirectToLogin();
	}
}
