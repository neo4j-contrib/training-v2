var quizesStatus = {};
$(".quiz-progress").find("li").css("cssText", "list-style-image: none !important");
$(".quiz-progress").find("li i").addClass("fa");
$(".quiz-progress").find("li i").addClass("fa-li");
$(".quiz-progress").find("li i").addClass("fa-circle-thin");


$('.next-section').click(function(event) {
  var hrefSuccess = event.target.href;
  var quizSuccess = gradeQuiz($(".quiz").first()); // gradeQuiz($( this ).closest(".quiz"));
  event.preventDefault();
  if (quizSuccess) {
    $("#submit-message").remove();
  } else {
    $("#_next_section").find(":first").after("<div id='submit-message'><h3 id='submit-message' style='color: red'>Please correct errors in questions above to continue.</h3></div>");
    $("#submit-message").append("<div class='paragraph'><a href='" + hrefSuccess + "'>Click here</a> if you wish to advance to next section without passing the quiz.</div>")
  }
  updateResponse = updateQuizStatus();
  postQuizStatus(updateResponse['passed'], updateResponse['failed']).then(
    function() { 
      if (quizSuccess) {
        document.location = hrefSuccess;
      }
    }
  );
});

function gradeQuiz(theQuiz) {
  var quizName = theQuiz.attr("id");
  var quizSuccess = true;

  if ( quizName in quizesStatus && quizesStatus[quizName] ) {
    return true;
  } 

  theQuiz.find("h3").css("color", "#525865");
  
  theQuiz.find(".required-answer").each(function() {
    if (! $( this ).prev(":checkbox").prop("checked")  ) {
      $( this ).closest(".ulist").prev("h3").css("color", "red");
      quizSuccess = false;
    }
  });
  theQuiz.find(".false-answer").each(function() {
    if ( $( this ).prev(":checkbox").prop("checked")  ) {
      $( this ).closest(".ulist").prev("h3").css("color", "red");
      quizSuccess = false;
    }
  });
  quizesStatus[ quizName ] = quizSuccess;
  return quizSuccess;
};

function postQuizStatus(passed, failed) {
  var id_token = Cookies.get("com.neo4j.accounts.idToken");
  return $.ajax
  ({
    type: "POST",
    url: "https://nmae7t4ami.execute-api.us-east-1.amazonaws.com/prod/setQuizStatus",
    contentType: "application/json",
    dataType: 'json',
    async: true,
    data: JSON.stringify(
      { "className": "online-training-1",
        "passed": passed,
        "failed": failed
      }),
    headers: {
      "Authorization": id_token
    }
  });
}

function getQuizStatusRemote() {
  var id_token = Cookies.get("com.neo4j.accounts.idToken");
  return $.ajax
  ({
    type: "GET",
    url: "https://nmae7t4ami.execute-api.us-east-1.amazonaws.com/prod/getQuizStatus?className=online-training-1",
    contentType: "application/json",
    dataType: 'json',
    async: true,
    headers: {
      "Authorization": id_token
    }
  });
}

function updateQuizStatus() {
  passedArray = []
  failedArray = []
  for (quizName in quizesStatus) {
    $("#" + quizName + "-progress").removeClass("fa-circle-thin");
    $("#" + quizName + "-progress").removeClass("fa-close");
    $("#" + quizName + "-progress").removeClass("fa-check");

    if (quizesStatus[quizName]) {
      passedArray.push(quizName);
      $("#" + quizName + "-progress").css("color", "green");
      $("#" + quizName + "-progress").addClass("fa-check");
    } else {
      failedArray.push(quizName);
      $("#" + quizName + "-progress").css("color", "red");
      $("#" + quizName + "-progress").addClass("fa-close");
    }
  }
  return { "passed": passedArray, "failed": failedArray };
}

function getQuizStatus() {
  return getQuizStatusRemote().then( function( value ) { 
    failed = value['quizStatus']['failed'];
    passed = value['quizStatus']['passed'];
    for (i in failed) {
      quizesStatus[ failed[i] ] = false;
    }
    for (i in passed) {
      quizesStatus[ passed[i] ] = true;
    }
    updateQuizStatus();
    currentQuizStatus = quizesStatus[ $(".quiz").attr("id") ];
    if (currentQuizStatus) {
      $(".quiz").hide();
    }
    return true;
  }, function() {
    return false;
  } );
}
