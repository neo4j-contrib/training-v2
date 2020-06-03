export default {
	getApiBaseUrl: (stage) => stage === 'dev' ? 'https://9niagofhzb.execute-api.us-east-1.amazonaws.com/dev'
		: 'https://nmae7t4ami.execute-api.us-east-1.amazonaws.com/prod',
	checkHttpStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response
		} else {
			const error = new Error(response.statusText)
			error.response = response
			throw error
		}
	}
}
