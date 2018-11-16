const con = require("../../database/db-con");

const FilterMngr = require("../filters-mngr");

const mysql = require("mysql");
let transaccionMngr = {};

transaccionMngr.getTransacciones = (nit_negocio, filters, callback) => {
  if (con) {
    const whereQuery = FilterMngr.createFilter(filters);
    con.query(
      "SELECT T.Num as ntransaccion, T.documento,T.correlativo, R.Serie AS serie, T.monto, T.fecha,T.tipo FROM Transaccion AS T  " +
        " INNER JOIN Resolucion AS R ON T.nRes=R.Num AND R.nit_negocio=T.nit_negocio " +
        " WHERE T.nit_negocio=? AND  " +
        whereQuery +
        " ORDER BY T.Num DESC;",
      [nit_negocio],
      (err, rows) => {
        if (err) {
          console.log(
            "Error al intentar extraer las transacciones {" + err + "}"
          );
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

module.exports = transaccionMngr;
