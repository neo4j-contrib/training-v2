export default {
	getApiBaseUrl: (stage) => {
		return `https://nmae7t4ami.execute-api.us-east-1.amazonaws.com/${stage || 'prod'}`;
	},
	DEFAULT_OPTIONS: {
		stage: 'prod',
		trainingClassName: null,
		classStates: {},
		isCourseLandingPage: false,
		enrollmentUrl: null,
	},
	REQUIRED_OPTIONS: ['trainingClassName', 'enrollmentUrl'],
}