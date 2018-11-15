const con = require("../../database/db-con");
const FilterMngr = require("../filters-mngr");

let inventoryMngr = {};

inventoryMngr.getInventoryFact = (nit_negocio, callback) => {
  if (con) {
    con.query(
      "SELECT id,codigo,concat_ws('',nombre.nombre,' ',marca.marca,' ',descripcion.descripcion,' ',presentacion.presentacion,' ',inv.unidades,' unidad(es)') AS producto, inv.precioActual FROM Inventario AS inv " +
        " INNER JOIN ProductoMarca As marca ON inv.idMarca=marca.idMarca" +
        " INNER JOIN ProductoNombre As nombre ON inv.idNombre=nombre.idNombre" +
        " INNER JOIN ProductoPresentacion As presentacion ON inv.idPresentacion=presentacion.idPresentacion" +
        " INNER JOIN ProductoDescripcion As descripcion ON inv.idDescripcion=descripcion.idDescripcion WHERE inv.nit_negocio=? AND inv.activo=True;",
      [nit_negocio],
      (err, rows) => {
        if (err) {
          console.log("Error al intentar extraer el inventario " + err);
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

inventoryMngr.getInventory = (nit_negocio, filters, callback) => {
  if (con) {
    const whereQuery = FilterMngr.createFilter(filters);
    con.query(
      "  SELECT id,codigo, idMarca, idPresentacion, idNombre, idDescripcion, stock, unidades, precioActual FROM Inventario WHERE nit_negocio = ? AND activo=TRUE AND " +
        whereQuery,
      [nit_negocio],
      (err, rows) => {
        if (err) {
          console.log("Error al intentar extraer el inventario");
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

inventoryMngr.addInventory = (
  nit_negocio,
  codigo,
  idMarca,
  idNombre,
  idDescripcion,
  idPresentacion,
  unidades,
  precioActual,
  callback
) => {
  if (con) {
    con.beginTransaction(function(err) {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }

      con.query(
        "SELECT COUNT(*) AS c1 FROM Inventario WHERE nit_negocio=? AND idMarca=? AND idNombre=? AND idDescripcion=? AND idPresentacion=? AND unidades=? AND activo=TRUE; " +
          "SELECT COUNT(*) AS c2 FROM Inventario WHERE nit_negocio=? AND codigo=? AND activo=TRUE;",
        [
          nit_negocio,
          idMarca,
          idNombre,
          idDescripcion,
          idPresentacion,
          unidades,
          nit_negocio,
          codigo
        ],
        (err, rows) => {
          if (err) {
            con.rollback(() => {
              console.log("Error al intentar ingresar inventario : \n" + err);
              callback(err, null);
              return;
            });
          }
          const c1 = parseInt(rows[0][0]["c1"]);
          const c2 = parseInt(rows[1][0]["c2"]);

          if (c1 >= 1 || c2 >= 1) {
            con.commit(err => {
              if (err) {
                con.rollback(function() {
                  callback(err, null);
                  return;
                });
              }
              const errCode = c1 >= 1 ? 100 : 101;
              callback(null, {
                "@err": errCode,
                message: "Nombre repetido"
              });
            });
            return;
          }
          con.query(
            "  INSERT INTO Inventario(nit_negocio,codigo,idMarca,idNombre,idDescripcion,idPresentacion,unidades,precioActual) VALUES (?,?,?,?,?,?,?,?) ",
            [
              nit_negocio,
              codigo,
              idMarca,
              idNombre,
              idDescripcion,
              idPresentacion,
              unidades,
              precioActual
            ],
            (err, rows) => {
              if (err) {
                console.log("Error al intentar inentario : \n" + err);
                callback(err, { "@err": 1 });
                return;
              } else {
                con.commit(err => {
                  if (err) {
                    con.rollback(function() {
                      callback(err, null);
                      return;
                    });
                  }
                  callback(null, { "@err": 0 });
                });
              }
            }
          );
        }
      );
    });
  }
};

inventoryMngr.editInventory = (
  idMarca,
  idNombre,
  idDescripcion,
  idPresentacion,
  unidades,
  precioActual,
  id,
  codigo,
  callback
) => {
  if (con) {
    con.query(
      "CALL edit_inventory(?,?,?,?,?,?,?,?)",
      [
        id,
        idMarca,
        idNombre,
        idDescripcion,
        idPresentacion,
        unidades,
        precioActual,
        codigo
      ],
      (err, rows) => {
        //console.log(rows);
        if (err) {
          console.log(
            "Error intentando actualizar registro del inventario \n" + err
          );
          callback(err, { "@err": 100 });
        } else {
          console.log("Inventario actualizado exitosamente");
          callback(null, { "@err": 0 });
        }
      }
    );
  }
};
/********
 * Las tablas son muy parecidas asi que mejor hago un helper
 * para cambiarlo dinamicamente
 */

getItemValues = type => {
  var element = {};
  if (type === "MARCA") {
    element.idName = "idMarca";
    element.name = "marca";
    element.tableName = "ProductoMarca";
    element.editName = "edit_marca";
  }
  if (type === "NOMBRE") {
    element.idName = "idNombre";
    element.name = "nombre";
    element.tableName = "ProductoNombre";
    element.editName = "edit_nombre";
  }
  if (type === "DESCRIPCION") {
    element.idName = "idDescripcion";
    element.name = "descripcion";
    element.tableName = "ProductoDescripcion";
    element.editName = "edit_descripcion";
  }
  if (type === "PRESENTACION") {
    element.idName = "idPresentacion";
    element.name = "presentacion";
    element.tableName = "ProductoPresentacion";
    element.editName = "edit_presentacion";
  }
  return element;
};

inventoryMngr.insertItem = (nit_negocio, type, name, callback) => {
  if (con) {
    const element = getItemValues(type);

    con.beginTransaction(function(err) {
      if (err) {
        console.log(err);
        callback(err, null);
        return;
      }

      con.query(
        "SELECT COUNT(*) AS c FROM ?? WHERE nit_negocio=? AND activo=TRUE AND  ??=?;",
        [element.tableName, nit_negocio, element.name, name],
        (err, rows) => {
          if (err) {
            con.rollback(() => {
              console.log("Error al intentar ingresar " + type + " : \n" + err);
              callback(err, null);
              return;
            });
          }
          const c = parseInt(rows[0]["c"]);

          if (c >= 1) {
            con.commit(err => {
              if (err) {
                con.rollback(function() {
                  callback(err, null);
                  return;
                });
              }
              callback(null, {
                "@err": 100,
                message: "Nombre repetido"
              });
            });
            return;
          }

          con.query(
            "INSERT INTO ?? (nit_negocio,??) VALUES (?,?) ",
            [element.tableName, element.name, nit_negocio, name],
            (err, rows) => {
              if (err) {
                console.log(
                  "Error al intentar ingresar " + type + " : \n" + err
                );
                callback(err, { "@err": 1 });
                return;
              } else {
                con.commit(err => {
                  if (err) {
                    con.rollback(function() {
                      callback(err, null);
                      return;
                    });
                  }
                  callback(null, { "@err": 0 });
                });
              }
            }
          );
        }
      );
    });
  }
};

inventoryMngr.getItem = (nit_negocio, type, filters, callback) => {
  if (con) {
    const element = getItemValues(type);
    const whereQuery = FilterMngr.createFilter(filters);
    con.query(
      "SELECT ??, ?? FROM ?? WHERE nit_negocio = ? AND activo=True AND" +
        whereQuery +
        " ORDER BY ?? DESC ",
      [
        element.idName,
        element.name,
        element.tableName,
        nit_negocio,
        element.idName
      ],
      (err, rows) => {
        if (err) {
          console.log(
            "Error al intentar extraer " + type + " de los productos"
          );
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

//INSERT INTO ProductoMarca(nit_negocio,marca) VALUES (nit_negocio,marca);
//UPDATE ProductoMarca SET activo=FALSE WHERE idMarca=id;

inventoryMngr.editItem = (type, id, name, callback) => {
  if (con) {
    const element = getItemValues(type);
    con.query("CALL ?? (?,?); ", [element.editName, id, name], (err, rows) => {
      if (err) {
        callback(err, { "@err": 1 });
      } else {
        callback(null, { "@err": 0 });
      }
    });
  }
};

module.exports = inventoryMngr;
