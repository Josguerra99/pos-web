const con = require("../../database/db-con");

const mysql = require("mysql");
let comprasMngr = {};

comprasMngr.addCompra = (nit_negocio, detalle, total, callback) => {
  if (con) {
    con.beginTransaction(function(err) {
      if (err) {
        console.log(err);
        callback(err, null);
        throw err;
      }

      con.query(
        "SET @codCompra=-1; CALL add_compra(?,?,@codCompra); SELECT @codCompra;",
        [nit_negocio, total],
        (err, rows) => {
          if (err) {
            con.rollback(() => {
              console.log("Error al intentar agregar la factura  " + err);
              callback(err, null);
              throw err;
            });
          }
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

          con.query(detalleQuery, [], (err, rows) => {
            if (err) {
              con.rollback(() => {
                console.log(
                  "Error al intentar agregar el detalle de compra " + err
                );
                callback(err, null);
                throw err;
              });
            } else {
              con.commit(err => {
                if (err) {
                  con.rollback(function() {
                    callback(err, null);
                    throw err;
                  });
                }

                callback(null, null);
              });
            }
          });
        }
      );
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

comprasMngr.getDetalle = (nit_negocio, ntransaccion, callback) => {
  if (con) {
    con.query(
      "SELECT D.codigoProducto,T1.producto,D.cantidad,D.precioUnitarioVenta,D.precioUnitarioVenta*D.cantidad AS precioVenta FROM Detalle AS D " +
        " INNER JOIN " +
        " ( " +
        " SELECT codigo,concat_ws('',marca.marca,' ',nombre.nombre,' ',descripcion.descripcion,' ',presentacion.presentacion,' ',inv.unidades,' unidad(es)') AS producto FROM Inventario AS inv " +
        " INNER JOIN ProductoMarca As marca ON inv.idMarca=marca.idMarca " +
        " INNER JOIN ProductoNombre As nombre ON inv.idNombre=nombre.idNombre " +
        " INNER JOIN ProductoPresentacion As presentacion ON inv.idPresentacion=presentacion.idPresentacion " +
        " INNER JOIN ProductoDescripcion As descripcion ON inv.idDescripcion=descripcion.idDescripcion WHERE inv.nit_negocio=? " +
        " ) AS T1 ON T1.codigo=D.codigoProducto " +
        " WHERE D.nit_negocio=? AND D.NumTransaccion=? ORDER BY T1.codigo ASC; ",
      [nit_negocio, nit_negocio, ntransaccion],
      (err, rows) => {
        if (err) {
          console.log("Error al intentar traer el detalle ");
        }
        callback(err, rows);
      }
    );
  }
};

module.exports = comprasMngr;
