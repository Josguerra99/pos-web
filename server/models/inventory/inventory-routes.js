const Inventario = require("./inventory-mngr");

module.exports = function(app) {
  /**INVENTARIO */
  app.get("/api/getInventoryHelper", (req, res) => {
    //Comporbar sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    Inventario.getItem(req.session.nit_negocio, req.query.type, (err, data) => {
      if (err) {
        res
          .status(500)
          .send([
            { "@err": 1, message: "Error al traer datos de " + req.query.type }
          ]);
      } else {
        res.status(200).send(data);
      }
    });
  });

  app.get("/api/getInventory", (req, res) => {
    //Comporbar sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    Inventario.getInventory(req.session.nit_negocio, (err, data) => {
      if (err) {
        res
          .status(500)
          .send([
            { "@err": 1, message: "Error al traer datos del inventario" }
          ]);
      } else {
        res.status(200).send(data);
      }
    });
  });

  app.post("/api/addInventoryHelper", (req, res) => {
    var resjson = [{ "@err": 1 }];
    //Comprobamos la sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      resjson = [{ "@err": -1 }];
      res.status(401).send(resjson[0]);
      return;
    }
    Inventario.insertItem(
      req.session.nit_negocio,
      req.body.type,
      req.body.name,
      (err, data) => {
        if (err) {
          res.status(500).send(data);
        } else {
          resjson.message = "Agregada exitosamente";
          res.status(200).send(data);
        }
      }
    );
  });

  app.post("/api/addInventory", (req, res) => {
    var resjson = [{ "@err": 1 }];
    //Comprobamos la sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      resjson = [{ "@err": -1 }];
      res.status(401).send(resjson[0]);
      return;
    }
    Inventario.addInventory(
      req.session.nit_negocio,
      req.body.codigo,
      req.body.idMarca,
      req.body.idNombre,
      req.body.idDescripcion,
      req.body.idPresentacion,
      req.body.unidades,
      req.body.precioActual,
      (err, data) => {
        if (err) {
          res.status(500).send(data);
        } else {
          res.status(200).send(data);
        }
      }
    );
  });

  app.post("/api/editInventoryHelper", (req, res) => {
    var resjson = [{ "@err": 1 }];
    //Comprobamos la sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      resjson = [{ "@err": -1 }];
      res.status(401).send(resjson[0]);
      return;
    }
    Inventario.editItem(
      req.body.type,
      req.body.id,
      req.body.name,
      (err, data) => {
        if (err) {
          res.status(500).send(data);
        } else {
          resjson.message = "Editada exitosamente";
          res.status(200).send(data);
        }
      }
    );
  });

  app.post("/api/editInventory", (req, res) => {
    var resjson = [{ "@err": 1 }];
    //Comprobamos la sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      resjson = [{ "@err": -1 }];
      res.status(401).send(resjson[0]);
      return;
    }

    Inventario.editInventory(
      req.body.idMarca,
      req.body.idNombre,
      req.body.idDescripcion,
      req.body.idPresentacion,
      req.body.unidades,
      req.body.precioActual,
      req.body.id,
      req.body.codigo,
      (err, data) => {
        if (err) {
          res.status(500).send(data);
        } else {
          res.status(200).send(data);
        }
      }
    );
  });

  app.get("/api/getInventoryFact", (req, res) => {
    //Comporbar sesion
    if (
      !req.session.role ||
      (req.session.role !== "ADMIN" && req.session.role !== "PUBLIC")
    ) {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    Inventario.getInventoryFact(req.session.nit_negocio, (err, data) => {
      if (err) {
        res
          .status(500)
          .send([
            { "@err": 1, message: "Error al traer datos del inventario" }
          ]);
      } else {
        res.status(200).send(data);
      }
    });
  });
};
