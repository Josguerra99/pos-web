const con = require("../../database/db-con");
const mysql = require("mysql");

let computadorMngr = {};

computadorMngr.getComputadoras = (nit_negocio, callback) => {
  if (con) {
    con.query(
      "SELECT codigo,num,registrada FROM Computadora WHERE nit_negocio=? ORDER BY num ASC; ",
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

computadorMngr.getComputadoraCookie = (nit_negocio, req) => {
  const name = "computer_" + nit_negocio;
  if (req.cookies[name] != undefined) {
    return req.cookies[name].num;
  } else {
    return null;
  }
};

computadorMngr.registerComputadora = (nit_negocio, codigo, callback) => {
  if (con) {
    con.query(
      "UPDATE Computadora SET registrada=TRUE  WHERE nit_negocio=? AND codigo=?; ",
      [nit_negocio, codigo],
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

module.exports = computadorMngr;
