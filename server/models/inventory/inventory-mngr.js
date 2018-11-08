const con = require("../../database/db-con");

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

inventoryMngr.getInventory = (nit_negocio, callback) => {
  if (con) {
    con.query(
      "  SELECT id,codigo, idMarca, idPresentacion, idNombre, idDescripcion, stock, unidades, precioActual FROM Inventario WHERE nit_negocio = ? AND activo=TRUE; ",
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
          callback(err, { "@err": 1 });
        } else {
          callback(null, { "@err": 0 });
        }
      }
    );
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
          callback(err, { "@err": 1 });
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
    con.query(
      "INSERT INTO ?? (nit_negocio,??) VALUES (?,?) ",
      [element.tableName, element.name, nit_negocio, name],
      (err, rows) => {
        if (err) {
          console.log("Error al intentar ingresar " + type + ", ya existe?");
          callback(err, { "@err": 1 });
        } else {
          callback(null, { "@err": 0 });
        }
      }
    );
  }
};

inventoryMngr.getItem = (nit_negocio, type, callback) => {
  if (con) {
    const element = getItemValues(type);
    con.query(
      "SELECT ??, ?? FROM ?? WHERE nit_negocio = ? AND activo=True ORDER BY ?? DESC; ",
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
