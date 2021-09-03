"user strict";
var mysql = require("mysql");
//local mysql db connection
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '',
  database: 'project_1',
  multipleStatements: true,
  charset: "utf8mb4_unicode_ci",
  connectionLimit : 100, 
});
connection.connect(function (err) {
  if (err != null) {
    console.log("Database Not Connected");
  } else {
    console.log("Database Connected!");
  }
});
module.exports = connection;