const con = require("../../database/db-con");

const mysql = require("mysql");
let comprasMngr = {};

comprasMngr.addCompra = (nit_negocio, detalle, total, parcial, callback) => {
  if (con) {
    con.getConnection((error, connection) => {
      connection.beginTransaction(function(err) {
        if (err) {
          connectionsole.log(err);
          callback(err, null);
          return;
        }

        connection.query(
          "SET @codCompra=-1; CALL add_compra(?,?,?,@codCompra); SELECT @codCompra;",
          [nit_negocio, total, parcial],
          (err, rows) => {
            if (err) {
              con.rollback(() => {
                console.log(
                  "Error al intentar agregar el coso de compra  " + err
                );
                callback(err, null);
                return;
              });
            }
            //console.log(rows);
            const codCompra = parseInt(rows[rows.length - 1][0]["@codCompra"]);

            var detalleQuery = "";
            detalle.forEach(element => {
              detalleQuery +=
                "CALL add_detalleCompra(" +
                mysql.escape(element.codigo) +
                "," +
                mysql.escape(codCompra) +
                "," +
                mysql.escape(element.cantidad) +
                "," +
                mysql.escape(element.precio) +
                "," +
                mysql.escape(nit_negocio) +
                ");";
            });

            connection.query(detalleQuery, [], (err, rows) => {
              if (err) {
                connection.rollback(() => {
                  console.log(
                    "Error al intentar agregar el detalle de compra " + err
                  );
                  callback(err, null);
                  return;
                });
              } else {
                connection.commit(err => {
                  if (err) {
                    connection.rollback(function() {
                      callback(err, null);
                      return;
                    });
                  }

                  callback(null, null);
                });
              }
            });
          }
        );
      });
    });
  }
};

comprasMngr.getFactura = (nit_negocio, callback) => {
  if (con) {
    con.query(
      "SELECT F.NumTransaccion, T.correlativo,F.nit_cliente,T.monto,T.fecha FROM Factura AS F " +
        " INNER JOIN Transaccion AS T ON T.Num=F.NumTransaccion " +
        " INNER JOIN Resolucion AS R ON R.Num = T.nRes" +
        " WHERE F.nit_negocio=? ORDER BY T.Num DESC",
      [nit_negocio],
      (err, rows) => {
        if (err) {
          console.log("Error al intentar traer las facturas ");
        }
        callback(err, rows);
      }
    );
  }
};

comprasMngr.getParcial = (nit_negocio, callback) => {
  if (con) {
    con.query(
      "SELECT cod,fecha,monto FROM Compra WHERE parcial=TRUE AND nit_negocio= ?; ",
      [nit_negocio],
      (err, rows) => {
        if (err) {
          console.log("Error al intentar traer compra parcial \n" + err);
        }
        callback(err, rows);
      }
    );
  }
};

comprasMngr.getDetalleParcial = (nit_negocio, codCompra, callback) => {
  if (con) {
    con.query(
      "SELECT cod,idProducto,codigoCompra,cantidad,precioUnitarioCompra FROM DetalleCompra WHERE codigoCompra=? AND nit_negocio=? ",
      [codCompra, nit_negocio],
      (err, rows) => {
        if (err) {
          console.log("Error al intentar traer el detalle : " + err);
        }
        callback(err, rows);
      }
    );
  }
};

module.exports = comprasMngr;
