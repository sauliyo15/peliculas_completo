'use strict';

const express = require('express');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const  path = require("path");
;
let app = express();
let  http = require("http").Server(app);

let port = process.env.PORT || 8000;


// Redirect HTTP to HTTPS,
app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

app.use(express.static(path.join(__dirname, "public")));

app.use("*", function (req, res, next) {
  res.redirect("/");
});

http.listen(port, function () {
  console.log("Open your browser on http://localhost:" + port);
});
