
# Graph Academy Login

The login script for GraphAcademy resides in a S3 bucket `cdn.graphacademy.neo4j.com`.
The production built file is accessible via a public url - https://s3.amazonaws.com/cdn.graphacademy.neo4j.com/dist/login-prod.js

##  Description
The idea for this module is to eliminate to call `quizes.js` and `classes.js`
 and have everything in one place. This module combines Auth, Quiz, Enrollment and Classes related function.

By using the following code
```js
const graphAcademy = new GraphAcademyLogin({
	loginRedirectUrl: "..../data-science/",
	trainingClassName: "datascience",
	enrollmentUrl: "..../data-science/",
});

graphAcademy.checkSession((err, result) => {
	if(result){
		// do something
	}
});
```
## What does `checkSession` do?
ToDo: rename `checkSession` to something appopriate

The `checkSession` function does more than what the name suggests. It does this -

* Check if the user is logged in
	* If not, and `loginRedirectUrl` is set, redirect the user.
	* If yes, get enrollment status for the user
		* if not enrolled, redirect to `enrollmentUrl`
		* if enrolled and is not `courseLandingPage`
			* Get the quiz status
			* Handle QUIZ related DOM manipulation which includes
				* If summary page, display the quiz result (whethr or not all quizes have successfully taken) and attempt to fetch the certificate.
				* Attaches click event handler to the `Continue` button
					* If the quiz has already been taken, button takes to next module
					* If the quiz has not been taken, then button grades the quiz, and if pass, update the quiz status in DB and then move to the next module
				* Update the header menu to show `check icon` for quizes successfully taken

## Class Definition
#### class: `GraphAcademyLogin`
#### constructor params: option (object)
\* required
| key | type | description |
| -- | -- | -- |
| `trainingClassName` *| string | name of the training class
| `classStates` | object <br/> `{loggedIn: 'only-logged-in',notLoggedIn: 'only-not-logged-in',checkingSession: 'only-checking-session',}` | HTML class name to show/hide during differnt user state |
| `loginRedirectUrl` | string | URL to redirect to if the user is not logged (the redirect happens if the `auth0.checkSession()` returns `err`)
| `logoutOptions` | object<br/> `{shouldRedirect: bool, redirectTo: 'URL'}` | whether or not to automatically redirect when `logout()` function is called
| `enrollmentUrl` * | string | URL to redirect to if the user is not enrolled (only redirects if the value is passed)
| `isCourseLandingPage` | bool | if `true` does not manipulate quiz related DOM. To be set to `true` for course enrollment page

#### Code Example
```
const login = new GraphAcademyLogin({
        trainingClassName: "_testing_4.0-intro-neo4j",
        classStates: {
			loggedIn: 'only-logged-in',
          	notLoggedIn: 'only-not-logged-in',
	        checkingSession: 'only-checking-session',
        },
        loginRedirectUrl: 'https://neo4j.com/graphacademy/intro-4.0',
        logoutOptions: {
			shouldRedirect: true,
			redirectTo: 'https://neo4j.com/graphacademy/intro-4.0'
		}
      });
```

## Class Methods
The following methods are avaiable on `GraphAcademyLogin` class.

| Method Name | Params | Return |Description |
| -- | -- | -- | -- |
| `checkSession` | function |  |Checks with Auth0 if the current user is logged in. Accepts a callback function and passes `err` and `result` to it
| `logout` | | |logs the current user out |
| `getEnrollmentForClass` | |\<Promise\>| returns the enrollment of the current user in the class 
| `enrollStudentInClass` | `firstName`, `lastName` | \<Promise\>| Enrolls the current user to the class
| `getClassCertificate` | | \<Promise\>|Get the class certificate for the current user

## Class Properties
The following properties are avaiable on the class instance -

| key | type | description
|--|--|--|
|`enrollment`|object|the enrollment of the user for the `trainingClassName`
|`quizStatus`|object|the quiz status of the user fot the `trainingClassName`
|`currentModule`|string (eg: `module-1`) | name of the current module. Feteched by calling `$(".quiz").attr("id");`. So if the quiz does not exist for a module, the value will be null
|`quizModuleCount`|int|total number of modules that have a quiz
|`currentModuleQuizStatus`|string `enum["passed","failed","untried"]`|the quiz status of the current module

Most of these values are used internally by the module and the page itself might not need it. Its listed here mostly for doucmentation purpose

## Deployment
Deploy to aws bucket using `npm run deploy`