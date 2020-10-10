// Helper function to call MS Graph API endpoint 
// using authorization bearer token scheme
function callMSGraph(endpoint, token, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    console.log('request made to Graph API at: ' + new Date().toString());
    console.log(options)
    console.log(headers)

    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => callback(response, endpoint))
        .catch(error => console.log(error));
}
function callAWS(endpoint, token, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        withCredentials: true,
        mode: 'cors',
        headers: headers
    };

    console.log('request made to AWS API at: ' + new Date().toString());

    window.fetch(endpoint, options)
        .then(response => response.text())
        .then(response => callback(response, endpoint))
        .catch(error => console.log(error));
}

function setCookie(token, callback) {

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({

    // either IdentityPoolId or IdentityId is required
    // See the IdentityPoolId param for AWS.CognitoIdentity.getID (linked below)
    // See the IdentityId param for AWS.CognitoIdentity.getCredentialsForIdentity
    // or AWS.CognitoIdentity.getOpenIdToken (linked below)
    IdentityPoolId: 'ap-southeast-2:b457261f-087a-4e66-9ddc-990a3a468404',
  
    // optional, only necessary when the identity pool is not configured
    // to use IAM roles in the Amazon Cognito Console
    // See the RoleArn param for AWS.STS.assumeRoleWithWebIdentity (linked below)
    //RoleArn: 'arn:aws:iam::1234567890:role/MYAPP-CognitoIdentity',
  
    // optional tokens, used for authenticated login
    // See the Logins param for AWS.CognitoIdentity.getID (linked below)
    Logins: {
      'sts.windows.net/3bd5c5ea-f8c3-48c8-9b7f-7311242d43ac': token
    },
  
    // optional name, defaults to web-identity
    // See the RoleSessionName param for AWS.STS.assumeRoleWithWebIdentity (linked below)
    RoleSessionName: 'web',
  
    // optional, only necessary when application runs in a browser
    // and multiple users are signed in at once, used for caching
    //LoginId: 'example@gmail.com'
  
  });

  var lambda = new AWS.Lambda({region: 'ap-southeast-2', apiVersion: '2015-03-31'});
  var params = {
      FunctionName : 'setcookie-SetCookieFunction-1T0OQHXSZS3DM',
      InvocationType : 'RequestResponse',
      LogType : 'None'
  };
  lambda.invoke(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
          else {    
            console.log(data);           // successful response
            let response = JSON.parse(data.Payload);
            let cookies = JSON.parse(response.body);
            let cookiesarray = Object.entries(cookies);
            console.log(cookiesarray);
            cookiesarray.forEach(element => {
              console.log('set element ' + element[0] + ' to '+element[1]);
              document.cookie = element[0]+"="+element[1]+";Path=/; Secure";
            });
          }

          /*
          data = {
           Payload: <Binary String>, 
           StatusCode: 200
          }
          */
        });
  console.log('request made to setCookie at: ' + new Date().toString());

}
