
# Graph Academy Login

The login script for GraphAcademy resides in a S3 bucket `cdn.graphacademy.neo4j.com`.
The production built file is accessible via a public url - https://s3.amazonaws.com/cdn.graphacademy.neo4j.com/dist/login-prod.js

## Class Definition
#### class: `GraphAcademyLogin`
#### constructor params: option (object)
| key | type | description |
| -- | -- | -- |
| `trainingClassName`| string | name of the training class
| `classStates` | object <br/> `{loggedIn: 'only-logged-in',notLoggedIn: 'only-not-logged-in',checkingSession: 'only-checking-session',}` | HTML class name to show/hide during differnt user state |
| `loginRedirectUrl` | string | URL to redirect to if the user is not logged (the redirect happens if the `auth0.checkSession()` returns `err`)
| `logoutOptions` | object<br/> `{shouldRedirect: bool, redirectTo: 'URL'}` | whether or not to automatically redirect when `logout()` function is called

#### Code Example
```js
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
})
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

## Code Examples

```js
const user = new GraphAcademyLogin(options);

user.checkSession((err, result) => {
    if (result) {
        // do stuff if when the user is logged in
        user.getEnrollment()
	  .then([err, respone]) {
              //do things after you get enrollment
          }	
    } else {
        // do stuff if the user is not logged in
    }
})

user.logout()
```

## Deployment
Deploy to aws bucket using `npm run deploy`
