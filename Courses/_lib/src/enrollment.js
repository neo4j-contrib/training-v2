/* global WebAuth, geoip2, Intercom */
(function () {
  var siteUrl = window.location
  var trainingLogoutEvent = window.trainingLogoutEvent
  var trainingLoginEvent = window.trainingLoginEvent
  var trainingRegisterEvent = window.trainingRegisterEvent
  var trainingRegisterEventDetail = window.trainingRegisterEventDetail

  class GraphAcademy {
    constructor(options = {}) {
      if (!WebAuth) {
        throw new Error('WebAuth is not available, cannot proceed.')
      }
      this.webAuth = new WebAuth({
        clientID: 'hoNo6B00ckfAoFVzPTqzgBIJHFHDnHYu',
        domain: 'login.neo4j.com',
        redirectUri: `${window.location.origin}/accounts/login`,
        audience: 'neo4j://accountinfo/',
        scope: 'read:account-info openid email profile user_metadata',
        responseType: 'token id_token'
      })
      this.options = options
    }

    checkSession(cb) {
      this.webAuth.checkSession({}, async (err, result) => {
        if (result) {
          this.authResult = result
        } else {
          delete this.authResult
        }
        if (err && this.options.loginRedirectUrl) {
          window.location.href = this.options.loginRedirectUrl
        }
        if (cb && typeof cb === 'function') {
          cb(err, result)
        }
      })
    }

    logout() {
      const { options } = this
      const logoutOptions = {}
      if (options.logoutRedirectUrl) {
        logoutOptions.redirectTo = options.logoutRedirectUrl
      }
      this.webAuth.logout(logoutOptions)
    }
  }

  var country = null
  var state = null
  if (geoip2) {
    geoip2.city(function (geoipResponse) {
      country = geoipResponse.country.names.en
      if (geoipResponse.subdivisions.length > 0) {
        // state = geoipResponse.subdivisions[0].iso_code
        state = geoipResponse.subdivisions[0].names.en
      }
    }, function (error) {
      console.log("Unable to locate user with geoip2", error)
    })
  }

  const graphAcademy = new GraphAcademy({
    loginRedirectUrl: "https://neo4j.com/accounts/login/?targetUrl=" + siteUrl,
    logoutRedirectUrl: "https://neo4j.com/accounts/logout/?targetUrl=" + siteUrl
  })

  $(document).ready(function () {
    graphAcademy.checkSession((err, result) => {
      if (result) {
        var userInfo = result.idTokenPayload
        var givenName = userInfo.given_name || null
        if (userInfo) {
          try {
            window.Intercom('update', {
              app_id: 'dt0ig5ab',
              name: userInfo.name,
              email: userInfo.email,
              user_id: userInfo.sub,
              hide_default_launcher: true
            })
          } catch (err) {
            console.error('Unable to update Intercom', err)
          }
        }
        getEnrollmentForClass(result.accessToken).done(function (data, textStatus, jqXHR) {
          if (data['enrolled']) {
            if (givenName) {
              $(".custom-form-header").html("<p>Welcome " + givenName + "</p>")
            } else {
              $(".custom-form-header").html("<p>Welcome</p>")
            }
            $('.btn-login').replaceWith($('.btn-continue'))
            $('.reg-logout').show()
          } else {
            $('#online_training').remove()
            $(".small-2").addClass("medium-offset-4")
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
        })
      } else {
        // Do whatever if not logged in
      }
    })
  })

  $('[data-action="logout"]').click(function (_) {
    record_event('training', trainingLogoutEvent)
    graphAcademy.logout()
  })
  $('.btn-login').click(function (e) {
    record_event('training', trainingLoginEvent)
    window.location = "https://neo4j.com/accounts/login/?targetUrl=" + siteUrl
  })
  $('.btn-continue').click(function (e) {
    window.location = siteUrl + 'part-0/'
  })

  var gcSendEvent = function (component, eventText, eventDetail) {
    try {
      if (typeof ga === 'function' && typeof ga.getAll === 'function' && typeof (ga.getAll()) === 'object' && ga.getAll().hasOwnProperty('length') && ga.getAll().length > 0) {
        var tracker = ga.getAll()[0].get('name')
        if (tracker) {
          ga(tracker + '.send', 'event', { 'eventCategory': component, 'eventAction': eventText, 'eventLabel': eventDetail })
          console.log("GA sent event.")
        } else {
          setTimeout(function () {
            gcSendEvent(component, eventText, eventDetail)
          }, 1000)
        }
      } else {
        console.log("No GA. Setting timeout.")
        setTimeout(function () {
          gcSendEvent(component, eventText, eventDetail)
        }, 750)
      }
    } catch (error) {
      console.error(error)
    }
  }

  var record_event = function (component, eventText, eventDetail) {
    if (eventDetail == null) {
      eventDetail = ""
    }
    gcSendEvent('send', component, eventText, eventDetail)
    Intercom('trackEvent', component + '-' + eventText, { "detail": eventDetail })
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
        // FIXME: unsafe, authResult can be undefined!
        enrollStudentInClass(values['FirstName'], values['LastName'], graphAcademy.authResult.accessToken).done(function () {
          record_event('training', trainingRegisterEvent)
          gcSendEvent('online_training', 'register', trainingRegisterEventDetail)
          window.location = siteUrl + 'part-0/'
        })
        return false
      })
    })
  } else {
    $("#reg-form").html("<p style='font-size:17px; text-align:center; color:red;'>Sorry, something has gone wrong. Some browser features like Firefox's Enhanced Tracking Protection prevent the training from working properly. Please try a different browser or turn of ETP.</p>")
  }
}())

window.intercomSettings = {
  app_id: "dt0ig5ab",
  hide_default_launcher: true
}

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
      s.src = 'https://widget.intercom.io/widget/dt0ig5ab';
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
