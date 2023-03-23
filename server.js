var express = require("express");
var app = express();
var http = require("http").Server(app);
var path = require("path");
var port = process.env.PORT || 3000;
var port = 8000;

app.use(express.static(path.join(__dirname, "public")));

app.use("*", function (req, res, next) {
  res.redirect("/");
});

http.listen(port, function () {
  console.log("Open your browser on http://localhost:" + port);
});
