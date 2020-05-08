export default {
	getApiBaseUrl: (stage) => {
		return `https://nmae7t4ami.execute-api.us-east-1.amazonaws.com/${stage || 'prod'}`;
	},
	auth0Options: {
		configurationBaseUrl: 'https://cdn.auth0.com',
		allowedConnections: ['google-oauth2', 'linkedin', 'twitter', 'Username-Password-Authentication'],
		additionalSignUpFields: [
			{
				name: 'first_name',
				placeholder: 'First Name'
			},
			{
				name: 'last_name',
				placeholder: 'Last Name'
			}
		],
		closable: false,
		languageDictionary: {
			signUpTerms: "I agree to the <a href='https://neo4j.com/terms/online-trial-agreement/' style='text-decoration: underline' target='_blank'>terms of service</a> of Neo4j."
		},
		mustAcceptTerms: true,
		auth: {
			redirect: true,
			redirectUrl: `${window.location.origin}/accounts/login`,
			responseType: 'token id_token',
			audience: 'neo4j://accountinfo/',
			params: {
				scope: 'read:account-info write:account-info openid email profile user_metadata'
			}
		}
	},
	classStates: {
		loggedIn: 'graph-academy-for-logged-in',
		notLoggedIn: 'graph-academy-for-not-logged-in'
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