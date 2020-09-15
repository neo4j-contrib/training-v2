/* global $, auth0, CodeMirror */
window.intercomSettings = {
  app_id: 'dt0ig5ab',
  hide_default_launcher: true
}

document.addEventListener('DOMContentLoaded', function () {
  var stage = "{{STAGE}}"
  var backendBaseUrl = "{{API_BASE_URL}}"
  var localStoragePrefixKey = window.trainingLocalStoragePrefixKey
  var quizCount = window.trainingQuizCount
  var quizStatusLocalStorageKey = stage ? localStoragePrefixKey + stage + '.quizes' : localStoragePrefixKey + '.quizes'
  var trainingName = window.trainingClassName
  var siteUrl = window.location
  var enrollmentUrl = window.trainingEnrollmentUrl

  function getQuizStatus(accessToken) {
    return $.ajax({
      type: 'GET',
      url: backendBaseUrl + '/getQuizStatus?className=' + trainingName,
      contentType: 'application/json',
      dataType: 'json',
      async: true,
      headers: {
        'Authorization': accessToken
      }
    })
  }

  function setQuizStatus(passed, failed, accessToken) {
    var data = {
      'className': window.trainingClassName,
      'passed': passed,
      'failed': failed
    }
    return $.ajax({
      type: 'POST',
      url: backendBaseUrl + '/setQuizStatus',
      contentType: 'application/json',
      dataType: 'json',
      async: true,
      data: JSON.stringify(data),
      headers: {
        'Authorization': accessToken
      }
    })
  }

  function getClassCertificate(accessToken) {
    return $.ajax({
      type: 'POST',
      url: backendBaseUrl + '/genClassCertificate',
      contentType: 'application/json',
      dataType: 'json',
      async: true,
      data: JSON.stringify({ 'className': trainingName }),
      headers: {
        'Authorization': accessToken
      }
    })
  }

  function getEnrollmentForClass(accessToken) {
    return $.ajax({
      type: 'GET',
      url: backendBaseUrl + '/getClassEnrollment?className=' + trainingName,
      async: true,
      headers: {
        'Authorization': accessToken
      }
    })
  }

  function gradeQuiz(theQuiz) {
    var quizName = theQuiz.attr("id")
    var quizSuccess = true
    if (quizName in currentQuizStatus && currentQuizStatus[quizName]) {
      return true
    }
    theQuiz.find("h3").css("color", "#525865")
    theQuiz.find(".required-answer").each(function () {
      if (!$(this).prev(":checkbox").prop("checked")) {
        $(this).closest(".ulist").siblings("h3").css("color", "red")
        quizSuccess = false
      }
    })
    theQuiz.find(".false-answer").each(function () {
      if ($(this).prev(":checkbox").prop("checked")) {
        $(this).closest(".ulist").siblings("h3").css("color", "red")
        quizSuccess = false
      }
    })
    currentQuizStatus[quizName] = quizSuccess
    return quizSuccess
  }

  function updateProgressIndicators(quizStatus) {
    var passedArray = []
    var failedArray = []
    for (var quizName in quizStatus) {
      const $quizItemProgress = $('#' + quizName + '-progress');
      $quizItemProgress.removeClass('fa-circle-thin')
      $quizItemProgress.removeClass('fa-close')
      $quizItemProgress.removeClass('fa-check')
      if (quizStatus[quizName]) {
        passedArray.push(quizName)
        $('#menu-' + quizName + ' .fa-stack').css('color', 'green')
        $('#menu-' + quizName + ' .fa-stack-1x').html('<span class="fa fa-check" style="padding-top: 6px"></span>')
        $quizItemProgress.css('color', 'green')
        $quizItemProgress.addClass('fa-check')
      } else {
        failedArray.push(quizName)
        $quizItemProgress.css('color', 'red')
        $quizItemProgress.addClass('fa-close')
      }
    }
    const $quizesResult = $('#quizes-result')
    if (passedArray.length == quizCount) {
      $quizesResult.html('<p>All quizes taken successfully.</p>')
    } else {
      $quizesResult.html('<p>Some quizes not answered successfully. Return to course modules by clicking on the numbers  in the navigation at the top of the page.</p>')
    }
    return { passed: passedArray, failed: failedArray }
  }

  var logout = function () {
    // todo: use a temporary URL during the Auth0 migration (notice the "login-b" instead of "login")
    //window.location = 'http://neo4j.com/accounts/login/?targetUrl=' + encodeURIComponent(siteUrl)
    window.location = 'http://neo4j.com/accounts/login-b/?targetUrl=' + encodeURIComponent(siteUrl)
  }

  // events
  $('.next-section').click(function (event) {
    event.preventDefault()

    var hrefSuccess = event.target.href
    var quizSuccess = gradeQuiz($(".quiz").first())
    if (quizSuccess) {
      $("#submit-message").remove()
    } else {
      $(".next-section").before("<div id='submit-message'><p id='submit-message'><span style='color: red'>Please correct errors</span> in quiz responses above to continue.  Questions with incorrect responses are highlighted in <span style='color: red'>red</span>.</p></div>");
      $("#submit-message").append("<div class='paragraph'><a href='" + hrefSuccess + "'>Click here</a> if you wish to advance to next section without passing the quiz.</div>")
    }

    // update indicators
    currentQuizStatus = updateProgressIndicators(currentQuizStatus)
    setQuizStatus(currentQuizStatus['passed'], currentQuizStatus['failed'], accessToken)
      .then(() => {
        window.localStorage.setItem(quizStatusLocalStorageKey, JSON.stringify(currentQuizStatus))
        if (quizSuccess) {
          document.location = hrefSuccess
        }
      }, function (jqXHR, textStatus, error) {
        // question: what should we do? display an error message to the user?
        console.error('Unable to update quiz status', error)
      })
  })

  const $quizProgress = $(".quiz-progress")
  $quizProgress.find("li").css("cssText", "list-style-image: none !important")
  $quizProgress.find("li i").addClass("fa")
  $quizProgress.find("li i").addClass("fa-li")
  $quizProgress.find("li i").addClass("fa-circle-thin")

  // initial state
  var currentQuizStatus
  var quizStatus = window.localStorage.getItem(quizStatusLocalStorageKey)
  if (quizStatus) {
    currentQuizStatus = JSON.parse(quizStatus)
    updateProgressIndicators(currentQuizStatus)
  } else {
    currentQuizStatus = {
      failed: [],
      passed: []
    }
  }

  if (typeof trainingPartName !== 'undefined') {
    var webAuth = new auth0.WebAuth({
      clientID: 'hoNo6B00ckfAoFVzPTqzgBIJHFHDnHYu',
      domain: 'login.neo4j.com',
      redirectUri: window.location.origin + '/accounts/login-b',
      audience: 'neo4j://accountinfo/',
      scope: 'read:account-info openid email profile user_metadata',
      responseType: 'token id_token'
    })
    var accessToken
    webAuth.checkSession({}, function (err, authResult) {
      if (err) {
        console.error('User is not authenticated', err)
        logout()
      } else if (authResult && authResult.accessToken) {
        // we're authenticated!
        accessToken = authResult.accessToken
        // get the enrollment status
        getEnrollmentForClass(accessToken)
          .then(function (data) {
            if (data) {
              if (data.enrolled === false) {
                // you should be enrolled, redirect to the enrollment page!
                window.location = enrollmentUrl
              }
            }
          }, function (jqXHR, textStatus, error) {
            console.error('Unable to get enrollment', error)
          })
        // get the current quiz status from the server
        getQuizStatus(accessToken)
          .then(function (response) {
            var quizStatus = response['quizStatus']
            if (quizStatus) {
              var quizesStatusL = {}
              var failed = quizStatus['failed']
              var passed = quizStatus['passed']
              var untried = quizStatus['untried']
              for (var i in failed) {
                quizesStatusL[failed[i]] = false
              }
              for (var i in passed) {
                quizesStatusL[passed[i]] = true
              }
              for (var i in untried) {
                quizesStatusL[untried[i]] = null
              }
              window.localStorage.setItem(quizStatusLocalStorageKey, JSON.stringify(quizesStatusL))
              var quizesStatus = quizesStatusL
              updateProgressIndicators(quizesStatus)
              var currentPageQuizStatus = quizesStatus[$(".quiz").attr("id")]
              if (currentPageQuizStatus) {
                $("#_grade_quiz_and_continue h3").text("Quiz successfully submitted.")
                $(".quiz").hide()
                $(".next-section").unbind("click")
                $(".next-section").click(function (event) {
                  document.location = event.target.href
                })
              }
            } else {
              console.warn('Unable to update the current quiz status, response from the server is empty', response)
            }
          }, function (jqXHR, textStatus, error) {
            console.error('Unable to get quiz status', error)
          })
        var certificateResultElement = $('#cert-result')
        if (certificateResultElement) {
          certificateResultElement.html("<i>... Checking for certificate ...</i>");
          getClassCertificate(accessToken)
            .then(function (value) {
              if ('url' in value) {
                certificateResultElement.html("<a href=\"" + value['url'] + "\">Download Certificate</a>");
              } else {
                certificateResultElement.html("Certificate not available yet.  Did you complete the quizzes at the end of each section?");
              }
            }, function (jqXHR, textStatus, error) {
              console.error('Unable to get certificate', error)
            })
        }
        var userInfo = authResult.idTokenPayload;
        if (window.intercomSettings && window.intercomSettings.app_id && userInfo) {
          try {
            Intercom('update', {
              app_id: window.intercomSettings.app_id,
              name: userInfo.name,
              email: userInfo.email,
              user_id: userInfo.sub,
              hide_default_launcher: true
            })
          } catch (err) {
            console.error('Unable to call Intercom with user info', err)
          }
        }
      } else {
        console.warn('Unable to get the access token from the authentication result', authResult)
      }
    })
  }

  // Yelp dataset
  const yelpDatasetAgreementElement = document.getElementById('yelp-dataset-agreement')
  const yelpCreateSandboxLinkElement = document.getElementById('yelp-create-sandbox-link')

  if (yelpDatasetAgreementElement && yelpCreateSandboxLinkElement) {
    const neo4jYelpAgreement = localStorage.getItem('neo4j.yelp-agreement')
    if (neo4jYelpAgreement === 'read-agreed') {
      yelpDatasetAgreementElement.style.display = 'none'
    } else {
      const originalHref = yelpCreateSandboxLinkElement.getAttribute('href')
      yelpCreateSandboxLinkElement.setAttribute('href', 'javascript:void(0)')
      yelpCreateSandboxLinkElement.setAttribute('target', '_self')
      const focusAgreementElementEvent = function () {
        const top = yelpDatasetAgreementElement.getBoundingClientRect().top + window.pageYOffset - 140
        window.scrollTo({ top: top, behavior: 'smooth' })
        yelpDatasetAgreementElement.classList.add('has-focus')
        setTimeout(function() {
          yelpDatasetAgreementElement.classList.remove('has-focus')
        }, 2000)
      }
      yelpCreateSandboxLinkElement.addEventListener('click', focusAgreementElementEvent)
      // checkbox
      const yelpDatasetAgreementInputCheckboxElement = document.createElement('input')
      yelpDatasetAgreementInputCheckboxElement.type = 'checkbox'
      yelpDatasetAgreementInputCheckboxElement.id = 'yelp-dataset-agreement-check'
      // label
      const yelpDatasetAgreementLabelElement = document.createElement('label')
      yelpDatasetAgreementLabelElement.innerHTML = '&nbsp;I have read and agree to the Dataset License'
      yelpDatasetAgreementLabelElement.setAttribute('for', 'yelp-dataset-agreement-check')
      // accept button
      const continueButtonElement = document.createElement('button')
      continueButtonElement.type = 'button'
      continueButtonElement.innerText = 'Continue'
      continueButtonElement.addEventListener('click', function (_) {
        if (yelpDatasetAgreementInputCheckboxElement.checked) {
          localStorage.setItem('neo4j.yelp-agreement', 'read-agreed')
          yelpCreateSandboxLinkElement.removeEventListener('click', focusAgreementElementEvent)
          yelpCreateSandboxLinkElement.setAttribute('target', '_blank')
          yelpCreateSandboxLinkElement.setAttribute('href', originalHref)
          yelpDatasetAgreementElement.style.display = 'none'
        }
      })
      const paragraphElement = document.createElement('p')
      paragraphElement.appendChild(yelpDatasetAgreementInputCheckboxElement)
      paragraphElement.appendChild(yelpDatasetAgreementLabelElement)
      paragraphElement.appendChild(continueButtonElement)
      yelpDatasetAgreementElement.appendChild(paragraphElement)
    }
  }
})

//

$('.admonitionblock.note').find('.icon').html('NOTE')
$('.admonitionblock.warning').find('.icon').html('WARNING')
$('.admonitionblock.information').find('.icon').html('INFO')

var isBlock = /^(p|li|div|h\\d|pre|blockquote|td)$/

function textContent(node, out) {
  if (node.nodeType == 3) {
    return out.push(node.nodeValue)
  }
  for (var ch = node.firstChild; ch; ch = ch.nextSibling) {
    textContent(ch, out)
    if (isBlock.test(node.nodeType)) {
      out.push("\n")
    }
  }
}

CodeMirror.colorize = function (collection, defaultMode) {
  if (!collection) {
    collection = document.body.getElementsByTagName("pre");
  }

  for (var i = 0; i < collection.length; ++i) {
    var syntax = false;
    var node = collection[i];
    var mode = node.getAttribute("data-lang") || defaultMode;
    if (mode == "cypher-syntax") {
      syntax = true;
      mode = "cypher";
    }
    if (!mode) continue;

    var text = [];
    textContent(node, text);
    node.innerHTML = "";
    CodeMirror.runMode(text.join(""), mode, node);

    node.className += " cm-s-default";
    if (syntax) {
      node.className += " cypher-syntax";
    }
  }
}

$(document).ready(function () {
  if (CodeMirror.colorize) {
    CodeMirror.colorize(document.body.getElementsByTagName("pre"), 'cypher');
  }
  Intercom('trackEvent', 'PAGE_VIEW', { course: window.trainingClassName, module: trainingPartIndex })
})

// Intercom
;(function () {
  var w = window;
  var ic = w.Intercom;
  if (typeof ic === "function") {
    ic('reattach_activator');
    ic('update', window.intercomSettings);
  } else {
    var d = document;
    var i = function () {
      i.c(arguments)
    };
    i.q = [];
    i.c = function (args) {
      i.q.push(args)
    };
    w.Intercom = i;

    function l() {
      var s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://widget.intercom.io/widget/' + window.intercomSettings.app_id;
      var x = d.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    }

    if (w.attachEvent) {
      w.attachEvent('onload', l);
    } else {
      w.addEventListener('load', l, false);
    }
  }
})()
