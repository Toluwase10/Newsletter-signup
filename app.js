
const express = require('express');
const bodyParser = require('body-parser');
// const request = require('request');
const https = require('https');

var app = express();
var port = 3000;

//the express server parses the form data
app.use(bodyParser.urlencoded({extended: true}));

//the express server serves static files like css and images
app.use(express.static("public"));

//the express server sends the signup page when the root file is being accessed
app.get("/", function(request, response){
  response.sendFile(__dirname + "/signup.html");
});

//the express server retrieves the form data
app.post("/", function(req, res){
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.emailAddress;

  //data to be sent to Mailchimp server
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  };

  //convert javascript object in the constant data to a JSON string
  const jsonData = JSON.stringify(data);
  const url = "https://us2.api.mailchimp.com/3.0/lists/7f0da30a57";
  const options = {
    method: "POST",
    headers: {
      Authorization: "auth 100e316fe9f80932aeff85c07646c4f9-us2"
    },
  };

  var request = https.request(url, options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(event) {
      console.log(JSON.parse(event));
    });
  });

  request.on("error", function(event) {
    console.log("Problem with request: " + event);
  })

  // write data to request body
  request.write(jsonData);
  request.end();
});


//redirect failure page to the home page
app.post("/failure", function(req, res){
  res.redirect("/");
});

//redirect success page to the home page
app.post("/success", function(req, res){
  res.redirect("/");
});

//wait for a connection on a dynamic port or on port 3000
app.listen(process.env.PORT || port, function(){
  console.log("Server is running on port " + port);
});
