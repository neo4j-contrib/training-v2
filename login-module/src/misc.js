export default {
	handleHtmlOnState(state = null, options) {
		const showIfLoggedIn = document.getElementsByClassName(options.classStates['loggedIn']) || [];
		const notShowIfLoggedIn = document.getElementsByClassName(options.classStates['notLoggedIn']) || [];
		const showIfCheckingSession = document.getElementsByClassName(options.classStates['checkingSession']) || [];

		switch (state) {
			case 'loggedIn':
				for (let item of showIfLoggedIn) {
					item.style.display = 'inherit';
				}
				for (let item of notShowIfLoggedIn) {
					item.style.display = 'none';
				}
				for (let item of showIfCheckingSession) {
					item.style.display = 'none';
				}
				break;

			case 'notLoggedIn':
				for (let item of showIfLoggedIn) {
					item.style.display = 'none';
				}
				for (let item of notShowIfLoggedIn) {
					item.style.display = 'inherit';
				}
				for (let item of showIfCheckingSession) {
					item.style.display = 'none';
				}
				break;

			case 'checkingSession':
				for (let item of showIfLoggedIn) {
					item.style.display = 'none';
				}
				for (let item of notShowIfLoggedIn) {
					item.style.display = 'none';
				}
				for (let item of showIfCheckingSession) {
					item.style.display = 'inherit';
				}
				break;

			default:
				break;
		}
	}
}