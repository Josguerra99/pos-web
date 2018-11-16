const con = require("../../database/db-con");

const mysql = require("mysql");
let facturacionMngr = {};

facturacionMngr.addCliente = (
  nit_negocio,
  nit_cliente,
  nombre,
  direccion,
  callback
) => {
  if (nit_cliente === "CF") {
    nombre = "-";
    direccion = "-";
  }
  if (con) {
    con.query(
      //SET @valid=0; SET @role='None'; SET @nit_negocio=null; CALL check_user(?,?,@valid,@role,@nit_negocio); SELECT @valid,@role,@nit_negocio;
      "CALL add_cliente(?,?,?,?);",
      [nit_negocio, nit_cliente, nombre, direccion],
      (err, rows) => {
        if (err) {
          console.log("No se pudo agregar el cliente " + err);
        }
        callback(err, rows);
      }
    );
  }
};

facturacionMngr.getCliente = (nit_negocio, nit_cliente, callback) => {
  if (con) {
    con.query(
      "SELECT nombre,direccion FROM Cliente WHERE NIT=? AND nit_negocio=?",
      [nit_cliente, nit_negocio],
      (err, rows) => {
        if (err) {
          console.log("No se pudo obtener el cliente: " + err);
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

facturacionMngr.addFactura = (
  nit_negocio,
  cliente,
  detalle,
  total,
  computadora,
  callback
) => {
  if (con) {
    con.getConnection((error, connection) => {
      connection.beginTransaction(function(err) {
        if (err) {
          console.log(err);
          callback(err, null);
          throw err;
        }

        connection.query(
          "SET @ntransaccion=-1; CALL add_factura(?,?,?,?,@ntransaccion); SELECT @ntransaccion;",
          [nit_negocio, cliente.nit, total, computadora],
          (err, rows) => {
            if (err) {
              connection.rollback(() => {
                console.log("Error al intentar agregar el factura " + err);
                callback(err, null);
                throw err;
              });
            }
            const ntransaccion = parseInt(
              rows[rows.length - 1][0]["@ntransaccion"]
            );

            var detalleQuery = "";
            detalle.forEach(element => {
              detalleQuery +=
                "CALL add_detalle(" +
                mysql.escape(element.codigo) +
                "," +
                mysql.escape(element.cantidad) +
                "," +
                mysql.escape(ntransaccion) +
                "," +
                mysql.escape(nit_negocio) +
                ");";
            });

            connection.query(detalleQuery, [], (err, rows) => {
              if (err) {
                connection.rollback(() => {
                  console.log("Error al intentar agregar el detalle " + err);
                  callback(err, null);
                  throw err;
                });
              } else {
                connection.commit(err => {
                  if (err) {
                    connection.rollback(function() {
                      callback(err, null);
                      throw err;
                    });
                  }

                  callback(null, ntransaccion);
                });
              }
            });
          }
        );
      });
    });
  }
};

facturacionMngr.getFacturaData = (nit_negocio, ntransaccion, callback) => {
  if (con) {
    con.query(
      "SELECT F.NumTransaccion AS ntransaccion," +
        " N.NIT AS nit_negocio, N.Nombre AS nombre_negocio, N.Denominacion AS denominacion_negocio, N.Direccion AS direccion_negocio, N.pequeno AS pequeno, " +
        " C.NIT AS nit_cliente, C.nombre AS nombre_cliente, C.direccion AS direccion_cliente, " +
        " T.correlativo AS nFactura, T.fecha AS fecha,T.monto AS total,T.idComputadora AS computadora, " +
        " R.Num AS nResolucion,R.Serie AS serie, concat_ws('',R.Inicio,' al ',R.Fin) AS rango, R.Fecha as fechaResolucion " +
        " FROM Factura AS F  " +
        " INNER JOIN Negocio AS N ON N.NIT=F.nit_negocio  " +
        " INNER JOIN Cliente AS C ON C.NIT=F.nit_cliente AND C.nit_negocio=F.nit_negocio " +
        " INNER JOIN Transaccion AS T ON T.Num=F.NumTransaccion AND T.nit_negocio=F.nit_negocio " +
        " INNER JOIN Resolucion AS R ON T.nRes=R.Num AND T.nit_negocio=R.nit_negocio " +
        " WHERE F.NumTransaccion=? AND F.nit_negocio=?;",
      [ntransaccion, nit_negocio],
      (err, rows) => {
        if (err) {
          console.log("Error al intentar traer las facturas ");
        }
        callback(err, rows);
      }
    );
  }
};

facturacionMngr.getFacturas = (nit_negocio, callback) => {
  if (con) {
    con.query(
      "SELECT F.NumTransaccion, T.correlativo,F.nit_cliente,T.monto,T.fecha FROM Factura AS F " +
        " INNER JOIN Transaccion AS T ON T.Num=F.NumTransaccion AND T.nit_negocio=F.nit_negocio" +
        " INNER JOIN Resolucion AS R ON R.Num = T.nRes AND R.nit_negocio=F.nit_negocio" +
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

facturacionMngr.getDetalle = (nit_negocio, ntransaccion, callback) => {
  if (con) {
    con.query(
      "SELECT D.idProducto AS codigo,T1.codigoBarras,T1.producto AS producto,D.cantidad AS cantidad,D.precioUnitarioVenta AS precioUnitario,D.precioUnitarioVenta*D.cantidad AS precioVenta FROM Detalle AS D " +
        " INNER JOIN " +
        " ( " +
        " SELECT inv.id AS id,inv.codigo AS codigoBarras,concat_ws('',marca.marca,' ',nombre.nombre,' ',descripcion.descripcion,' ',presentacion.presentacion,' ',inv.unidades,' unidad(es)') AS producto FROM Inventario AS inv " +
        " INNER JOIN ProductoMarca As marca ON inv.idMarca=marca.idMarca" +
        " INNER JOIN ProductoNombre As nombre ON inv.idNombre=nombre.idNombre " +
        " INNER JOIN ProductoPresentacion As presentacion ON inv.idPresentacion=presentacion.idPresentacion " +
        " INNER JOIN ProductoDescripcion As descripcion ON inv.idDescripcion=descripcion.idDescripcion WHERE inv.nit_negocio=? " +
        " ) AS T1 ON T1.id=D.idProducto  " +
        " WHERE D.nit_negocio=? AND D.NumTransaccion=? ORDER BY T1.id ASC; ",
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

module.exports = facturacionMngr;
