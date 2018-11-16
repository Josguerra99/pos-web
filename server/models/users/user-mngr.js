const con = require("../../database/db-con");
const mysql = require("mysql");

let userMngr = {};

userMngr.checkUser = (user_name, pass, nit_negocio, callback) => {
  if (nit_negocio == "") nit_negocio = -1;
  if (con) {
    con.query(
      "SET @valid=0; SET @role='None'; CALL check_user(?,?,@valid,@role,?); SELECT @valid,@role; ",
      [user_name, pass, nit_negocio],
      (err, rows) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, rows[3][0]);
        }
      }
    );
  }
};
userMngr.getUsers = (nit_negocio, callback) => {
  if (con) {
    con.query(
      "SELECT user_name,pass FROM Usuario WHERE NIT_negocio = ?; ",
      [nit_negocio],
      (err, rows) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

userMngr.getNegocioInfo = (nit_negocio, callback) => {
  if (con) {
    con.query(
      "SELECT Nombre,Denominacion,Direccion,juridico,pequeno FROM Negocio WHERE NIT = ?; ",
      [nit_negocio],
      (err, rows) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

userMngr.addUser = (user_name, pass, nit_negocio, callback) => {
  if (con) {
    con.query(
      "INSERT Usuario(user_name,pass,role,NIT_negocio) VALUES(?,?,'PUBLIC',?); ",
      [user_name, pass, nit_negocio],
      (err, rows) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

userMngr.editUser = (user_name, pass, nit_negocio, oldUserName, callback) => {
  if (con) {
    con.query(
      "UPDATE Usuario SET user_name=?,pass=? WHERE NIT_negocio=? AND user_name=?; ",
      [user_name, pass, nit_negocio, oldUserName],
      (err, rows) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

userMngr.addNegocio = (data, callback) => {
  const nit = data.negocio.nit;
  const nombre = data.negocio.nombre;
  const direccion = data.negocio.direccion;
  const denominacion = data.negocio.denominacion;
  const pequeno = data.negocio.pequeno;
  const juridico = data.negocio.juridico;

  const user = data.comprador.user;
  const pass = data.comprador.pass;

  if (con) {
    con.getConnection((error, connection) => {
      connection.beginTransaction(function(err) {
        if (err) {
          console.log(err);
          callback(err, null);
          return;
        }

        connection.query(
          "INSERT INTO Negocio(NIT,Nombre,Denominacion,Direccion,pequeno,juridico) VALUES(?,?,?,?,?,?)",
          [nit, nombre, denominacion, direccion, pequeno, juridico],
          (err, rows) => {
            if (err) {
              connection.rollback(function() {
                callback(err, null);
                return;
              });
            }
            connection.query(
              "INSERT INTO Helper(nit_negocio,transaccion) VALUES(?,0)",
              [nit],
              (err, rows) => {
                if (err) {
                  con.rollback(function() {
                    callback(err, null);
                    return;
                  });
                }
                connection.query(
                  "INSERT INTO Cliente(NIT,nit_negocio,nombre,direccion) VALUES('CF',?,'-','-')",
                  [nit],
                  (err, rows) => {
                    if (err) {
                      con.rollback(function() {
                        callback(err, null);
                        return;
                      });
                    }
                    connection.query(
                      "INSERT INTO Usuario(user_name,pass,role,NIT_negocio) VALUES(?,?,?,?)",
                      [user, pass, "ADMIN", nit],
                      (err, rows) => {
                        if (err) {
                          con.rollback(function() {
                            callback(err, null);
                            return;
                          });
                        }
                        var computadorasQuery = "";
                        data.computadoras.forEach(element => {
                          computadorasQuery +=
                            "INSERT INTO Computadora(codigo,nit_negocio,num) VALUES (" +
                            mysql.escape(element.id) +
                            "," +
                            mysql.escape(nit) +
                            "," +
                            mysql.escape(element.num) +
                            "); ";
                        });
                        connection.query(computadorasQuery, [], (err, rows) => {
                          if (err) {
                            con.rollback(function() {
                              callback(err, null);
                              return;
                            });
                          }
                          connection.commit(function(err) {
                            if (err) {
                              con.rollback(function() {
                                callback(err, null);
                                return;
                              });
                            }
                            console.log(
                              "Negocio " +
                                nit +
                                " " +
                                nombre +
                                " ingresado exitosamente"
                            );
                            callback(null, null);

                            //con.end();
                          });
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    });
  }
};

module.exports = userMngr;
