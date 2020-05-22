export default {
  getApiBaseUrl: (stage) => stage === 'dev' ? 'https://9niagofhzb.execute-api.us-east-1.amazonaws.com/dev' 
                                            : 'https://nmae7t4ami.execute-api.us-east-1.amazonaws.com/prod'
}
