var quizesStatus = {};
$(".quiz-progress").find("li").css("cssText", "list-style-image: none !important");
$(".quiz-progress").find("li i").addClass("fa");
$(".quiz-progress").find("li i").addClass("fa-li");
$(".quiz-progress").find("li i").addClass("fa-circle-thin");

quizesCookie = window.localStorage.getItem('com.neo4j.graphacademy.intro-v2.quizes');
if (quizesCookie) {
  quizesStatus = JSON.parse(quizesCookie);
  updateQuizStatus();
}


$('.next-section').click(function(event) {
  event.preventDefault();

  var hrefSuccess = event.target.href;
  var quizSuccess = gradeQuiz($(".quiz").first()); // gradeQuiz($( this ).closest(".quiz"));
  if (quizSuccess) {
    $("#submit-message").remove();
  } else {
    $(".next-section").before("<div id='submit-message'><p id='submit-message'><span style='color: red'>Please correct errors</span> in quiz responses above to continue.  Questions with incorrect responses are highlighted in <span style='color: red'>red</span>.</p></div>");
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
      $( this ).closest(".ulist").siblings("h3").css("color", "red");
      quizSuccess = false;
    }
  });
  theQuiz.find(".false-answer").each(function() {
    if ( $( this ).prev(":checkbox").prop("checked")  ) {
      $( this ).closest(".ulist").siblings("h3").css("color", "red");
      quizSuccess = false;
    }
  });
  quizesStatus[ quizName ] = quizSuccess;
  return quizSuccess;
};

function postQuizStatus(passed, failed) {
  const id_token = window.localStorage.getItem("com.neo4j.accounts.idToken");
  return $.ajax
  ({
    type: "POST",
    url: "https://nmae7t4ami.execute-api.us-east-1.amazonaws.com/prod/setQuizStatus",
    contentType: "application/json",
    dataType: 'json',
    async: true,
    data: JSON.stringify(
      { "className": window.trainingClassName,
        "passed": passed,
        "failed": failed
      }),
    headers: {
      "Authorization": id_token
    }
  });
}

function getQuizStatusRemote() {
  var id_token = window.localStorage.getItem("com.neo4j.accounts.idToken");
  return $.ajax
  ({
    type: "GET",
    url: "https://nmae7t4ami.execute-api.us-east-1.amazonaws.com/prod/getQuizStatus?className=" + window.trainingClassName,
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
      $('#menu-' + quizName + ' .fa-stack').css('color', 'green');
      $('#menu-' + quizName + ' .fa-stack-1x').html('<span class="fa fa-check" style="padding-top: 6px"></span>');
      $("#" + quizName + "-progress").css("color", "green");
      $("#" + quizName + "-progress").addClass("fa-check");
    } else {
      failedArray.push(quizName);
      $("#" + quizName + "-progress").css("color", "red");
      $("#" + quizName + "-progress").addClass("fa-close");
    }
  }
  if (passedArray.length == 7) {
    $('#module-8').find('#quizes-result').html("<p>All quizes taken successfully.</p>");
  } else {
    $('#module-8').find('#quizes-result').html("<p>Some quizes not answered successfully.  Return to course modules by clicking on the numbers  in the navigation at the top of the page.</p>");
  }
  return { "passed": passedArray, "failed": failedArray };
}

function getQuizStatus() {
  return getQuizStatusRemote().then( function( value ) { 
    quizesStatusL = {};
    failed = value['quizStatus']['failed'];
    passed = value['quizStatus']['passed'];
    untried = value['quizStatus']['untried'];
    for (i in failed) {
      quizesStatusL[ failed[i] ] = false;
    }
    for (i in passed) {
      quizesStatusL[ passed[i] ] = true;
    }
    for (i in untried) {
      quizesStatusL[ untried[i] ] = null;
    }
    window.localStorage.setItem('com.neo4j.graphacademy.intro-v2.quizes', JSON.stringify(quizesStatusL) );
    quizesStatus = quizesStatusL;
    updateQuizStatus();
    currentQuizStatus = quizesStatus[ $(".quiz").attr("id") ];
    if (currentQuizStatus) {
      $("#_grade_quiz_and_continue h3").text("Quiz successfully submitted.");
      $(".quiz").hide();
      $(".next-section").unbind("click");
      $(".next-section").click(function(event) {
        document.location = event.target.href;
        return false;
      });
    }
    return true;
  }, function() {
    return false;
  } );
}


