const con = require("../database/db-con");

let userMngr = {};

userMngr.getUsers = (user_name, pass, callback) => {
  if (con) {
    con.query(
      "SET @valid=0; SET @role='None'; SET @nit_negocio=null; CALL check_user(?,?,@valid,@role,@nit_negocio); SELECT @valid,@role,@nit_negocio; ",
      [user_name, pass],
      (err, rows) => {
        if (err) {
          throw err;
        } else {
          callback(null, rows[4][0]);
        }
      }
    );
  }
};

module.exports = userMngr;
