/**Data base connection**/
const mysql = require("mysql");

const con = mysql.createPool({
  host: "sql9.freemysqlhosting.net",
  database: "sql9261239",
  user: "sql9261239",
  password: "Rb2JzKiQ2P",
  multipleStatements: true
});

/*
const con = mysql.createPool({
  connectionLimit: 30,
  host: "localhost",
  database: "posdb",
  user: "root",
  password: "",
  multipleStatements: true
});
*/
module.exports = con;
