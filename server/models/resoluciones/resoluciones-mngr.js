const con = require("../../database/db-con");
const FilterMngr = require("../filters-mngr");

let resolucionMngr = {};

resolucionMngr.getResolucionReplace = (doc, nit_negocio, callback) => {
  if (con) {
    con.query(
      "SELECT Num, Actual, Fin FROM Resolucion WHERE Documento=? AND nit_negocio=? AND Activo=TRUE AND Actual<Fin AND  DATE(NOW()) < DATE_ADD(fechaIngreso, INTERVAL 2 YEAR)",
      [doc, nit_negocio],
      (err, rows) => {
        if (err) {
          console.log("Error al intentar extraer la resolucion");
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

resolucionMngr.addResolucion = (
  num,
  serie,
  inicio,
  fin,
  documento,
  nit,
  fecha,
  callback
) => {
  if (con) {
    con.query(
      "SET @err=0; CALL add_resolucion(?,?,?,?,?,?,?,@err); SELECT @err;",
      [num, serie, inicio, fin, documento, nit, fecha],
      (err, rows) => {
        if (err) {
          //Nunca entrara aqui ya que el procedimiento es el que maneja los errores
          console.log("Error ingresando la resolucion");
        } else {
          callback(null, rows[2][0]);
        }
      }
    );
  }
};

resolucionMngr.getActiva = (doc, nit_negocio, callback) => {
  if (con) {
    con.query(
      "SELECT Num, Serie,Inicio,Fin,Actual,Fecha,Activo FROM Resolucion WHERE Documento=? AND nit_negocio=? AND Activo=TRUE AND  DATE(NOW()) < DATE_ADD(fechaIngreso, INTERVAL 2 YEAR)  AND Actual<Fin  ",
      [doc, nit_negocio],
      (err, rows) => {
        if (err) {
          console.log("Error al intentar extraer la resolucion");
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

resolucionMngr.getResoluciones = (nit_negocio, filters, callback) => {
  if (con) {
    const whereQuery = FilterMngr.createFilter(filters);
    con.query(
      "SELECT Num, Serie,Inicio,Fin,Actual,Fecha,Documento, Activo FROM Resolucion WHERE  nit_negocio=? AND " +
        whereQuery,
      [nit_negocio],
      (err, rows) => {
        if (err) {
          console.log("Error al intentar extraer las resoluciones");
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

module.exports = resolucionMngr;