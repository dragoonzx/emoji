console.log("Server-side code running");
const express = require("express");
var http = require("http");
var https = require("https");
var redirectToHTTPS = require("express-http-to-https").redirectToHTTPS;
var fs = require("fs");
var cors = require("cors");
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// serve files from the public directory

var privateKey = fs.readFileSync("keys/historymaxtest.key", "utf8");
var certificate = fs.readFileSync("keys/historymaxtest.crt", "utf8");

var credentials = { key: privateKey, cert: certificate };

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

app.use(redirectToHTTPS([/historymaxtest.ru:(\d{4})/], [/\/insecure/], 301));

app.use(express.static(__dirname + "/public"));

app.use(cors());

// serve the homepage
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

httpsServer.listen(443, () => console.log("server is listening safely"));
httpServer.listen(80, () => console.log("server is listening"));
