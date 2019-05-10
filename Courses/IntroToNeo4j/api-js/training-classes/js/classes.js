function logTrainingView() {
  var id_token = Cookies.get("com.neo4j.accounts.idToken");
  return $.ajax
  ({
    type: "POST",
    url: "https://nmae7t4ami.execute-api.us-east-1.amazonaws.com/prod/logTrainingView",
    contentType: "application/json",
    dataType: 'json',
    async: true,
    data: JSON.stringify(
      { "className": "online-training-1",
        "partName": $(".quiz").first().attr("id").replace("quiz","part")
      }),
    headers: {
      "Authorization": id_token
    }
  });
}

jQuery(document).ready(function () {
  if (Cookies.get("com.neo4j.accounts.idToken")) { 
    // we're authenticated
    // could check expiration of token, but not critical for this app
    // still need to check quiz status
    logTrainingView().then(
      function() {
        return getQuizStatus();
      }
    );
  } else {
    window.location = "https://neo4j.com/accounts/login/?targetUrl=" + encodeURI(window.location.href);
  }
});
