/**Data base connection**/
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  database: "posdb",
  user: "root",
  password: "",
  multipleStatements: true
});
module.exports = con;
