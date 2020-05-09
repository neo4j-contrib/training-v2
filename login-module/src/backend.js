export default {
	getApiBaseUrl: (stage) => {
		return `https://nmae7t4ami.execute-api.us-east-1.amazonaws.com/${stage || 'prod'}`;
	}
}
