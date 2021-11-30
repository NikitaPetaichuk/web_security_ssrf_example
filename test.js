const request = require('request');

request.post(
    'http://localhost:3000/api/load_url',
    {json: {url: 'file:///etc/passwd'}},
    function (error, response) {
        if (error) {
            console.log("Error while sending request");
        } else if (response.statusCode === 200) {
            console.log("The application is unsecure!");
        } else {
            console.log("The application is safe");
        }
    }
);