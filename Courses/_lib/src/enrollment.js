/* global auth0, geoip2, Intercom */
window.intercomSettings = {
  app_id: 'dt0ig5ab',
  hide_default_launcher: true
};

(function ($) {
  var location = window.location
  var siteUrl = location.href
  var backendBaseUrl = "{{API_BASE_URL}}"
  var trainingName = window.trainingClassName
  // 2020-05-22 - temporary default value to ease the migration
  var trainingCourseUrl = window.trainingCourseUrl || (location.origin + location.pathname + 'part-0/' + location.search + location.hash)

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

  function enrollStudentInClass(firstName, lastName, accessToken) {
    var data = {
      className: trainingName,
      firstName: firstName,
      lastName: lastName
    }
    return $.ajax({
      type: 'POST',
      url: backendBaseUrl + '/setClassEnrollment',
      contentType: 'application/json',
      dataType: 'json',
      async: true,
      data: JSON.stringify(data),
      headers: {
        'Authorization': accessToken
      }
    })
  }

  var country = null
  var state = null
  if (typeof geoip2 !== 'undefined' && typeof geoip2.city === 'function') {
    geoip2.city(function (geoipResponse) {
      country = geoipResponse.country.names.en
      if (geoipResponse.subdivisions.length > 0) {
        // state = geoipResponse.subdivisions[0].iso_code
        state = geoipResponse.subdivisions[0].names.en
      }
    }, function (error) {
      console.log('Unable to locate user with geoip2', error)
    })
  } else {
    console.log('geoip2 is not available, unable to get the country and state of the user')
  }
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
      console.info('User is not authenticated', err)
    } else if (authResult && authResult.accessToken) {
      // we're authenticated!
      accessToken = authResult.accessToken
      var userInfo = authResult.idTokenPayload
      var givenName = userInfo.given_name || null
      if (userInfo) {
        try {
          window.Intercom('update', {
            app_id: window.intercomSettings.app_id,
            name: userInfo.name,
            email: userInfo.email,
            user_id: userInfo.sub,
            hide_default_launcher: true
          })
        } catch (err) {
          console.error('Unable to update Intercom', err)
        }
      }
      getEnrollmentForClass(accessToken)
        .then(function (response) {
          if (response['enrolled']) {
            if (givenName) {
              $(".custom-form-header").html("<p>Welcome " + givenName + "</p>")
            } else {
              $(".custom-form-header").html("<p>Welcome</p>")
            }
            $('.btn-login').replaceWith($('.btn-continue'))
            $('.reg-logout').show()
          } else {
            $('#reg-form').show()
            $('#reg-start').hide()
            $('#logout').show()
            $('.reg-logout').show()

            MktoForms2.whenReady(function (form) {
              var prefillFields = {
                "FirstName": userInfo.given_name,
                "LastName": userInfo.family_name,
                "Email": userInfo.email,
                "Country": country
              }
              if (country == "United States" || country == "Canada") {
                prefillFields["State"] = state
              }
              //pass our prefillFields objects into the form.vals method to fill our fields
              form.vals(prefillFields)
            })
          }
        }, function (jqXHR, textStatus, error) {
          console.error('Unable to get enrollment', error)
        })
    }
  })

  $('[data-action="logout"]').click(function (_) {
    record_event('GRAPH_ACADEMY_LOGOUT')
    window.location = "https://neo4j.com/accounts/logout/?targetUrl=" + encodeURIComponent(siteUrl)
  })
  $('.btn-login').click(function (e) {
    record_event('GRAPH_ACADEMY_LOGIN')
    window.location = "https://neo4j.com/accounts/login-b/?targetUrl=" + encodeURIComponent(siteUrl)
  })
  $('.btn-continue').click(function (e) {
    window.location = trainingCourseUrl
  })

  var record_event = function (event, meta = {}) {
    if (event == null) return;

    // Sending event to Google Analytics via GTM Datalayer
    if (window.dataLayer) {
      dataLayer.push({
        'event': 'virtualEvent',
        'eventCategory': 'training',
        'eventAction': event,
        'eventLabel': meta.course
      });
    }

    Intercom('trackEvent', event, { component: 'training', ...meta })
  }

  if (typeof MktoForms2 !== 'undefined') {
    MktoForms2.loadForm("//go.neo4j.com", "710-RRC-335", 1422, function (form) {
      $('button[type=submit]').text('Enroll in Course')
      $('#LastName').parent().append("<p><i>Name above used to generate Certificate<br />of Completion</i></p>")
      $("#mktoForm_1422").css("width", "260px")
      $(".mktoLogicalField.mktoCheckboxList.mktoHasWidth").css("width", "280px")
      $("select#Country").change(function () {
        $(".mktoLogicalField.mktoCheckboxList.mktoHasWidth").css("width", "280px")
      })

      //Add an onSuccess handler
      form.onSuccess(function (values, _) {
        // FIXME: unsafe, accessToken can be undefined!
        enrollStudentInClass(values['FirstName'], values['LastName'], accessToken).done(function () {
          record_event('GRAPH_ACADEMY_REGISTER', { course: trainingName })
          window.location = trainingCourseUrl
        })
        return false
      })
    })
  } else {
    $("#reg-form").html("<p style='font-size:17px; text-align:center; color:red;'>Sorry, something has gone wrong. Some browser features like Firefox's Enhanced Tracking Protection prevent the training from working properly. Please try a different browser or turn of ETP.</p>")
  }
})($);

(function () {
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
