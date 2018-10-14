const con = require("../database/db-con");

let session_mngr = {};

session_mngr.getSessionSecret = () => {
  if (con) {
    con.query("SELECT * FROM session_secret;", (err, rows) => {
      if (err) {
        throw err;
      } else {
        return rows[0];
      }
    });
  }
};

module.exports = session_mngr;
