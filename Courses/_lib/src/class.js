/* global $ */
var API_BASE_URL = "{{API_BASE_URL}}"

function getClassCertificate(accessToken) {
  return $.ajax
  ({
    type: "POST",
    url: API_BASE_URL + "/genClassCertificate",
    contentType: "application/json",
    dataType: 'json',
    async: true,
    data: JSON.stringify({
      "className": window.trainingClassName
    }),
    headers: {
      "Authorization": accessToken
    }
  })
}

function getEnrollmentForClass(accessToken) {
  return $.ajax
  ({
    type: "GET",
    url: API_BASE_URL + "/getClassEnrollment?className=" + window.trainingClassName,
    async: true,
    headers: {
      "Authorization": accessToken
    }
  })
}

function enrollStudentInClass(firstName, lastName, accessToken) {
  return $.ajax
  ({
    type: "POST",
    url: API_BASE_URL + "/setClassEnrollment",
    contentType: "application/json",
    dataType: 'json',
    async: true,
    data: JSON.stringify({
      "className": window.trainingClassName,
      "firstName": firstName,
      "lastName": lastName
    }),
    headers: {
      "Authorization": accessToken
    }
  })
}
