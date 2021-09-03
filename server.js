const express = require("express");
const bodyParser = require("body-parser");

var sql = require("./db")

app = express();
port = 5555;
app.listen(port,()=>{
console.log("::::::::::::::::: | Project: project_1 | :::::::::::::");
console.log("Date: " + new Date());
console.log("Api server started on: " + port);
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = require(".//appRoute");

routes(app);