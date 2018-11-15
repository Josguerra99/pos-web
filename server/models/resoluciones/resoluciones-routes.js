const Resoluciones = require("./resoluciones-mngr");
const HistorialResoluciones = require("../../reports/historialResoluciones");

module.exports = function(app) {
  /*Errores de respuesta -1 no autorizado, 0 no hay errores y 1 hubo errores en la transaccion*/
  app.post("/api/add_resolucion", (req, res) => {
    var resjson = [{ "@err": 1 }];
    //Comprobamos la sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      resjson = [{ "@err": -1 }];
      res.status(401).send(resjson);
      return;
    }
    Resoluciones.addResolucion(
      req.body.num,
      req.body.serie,
      req.body.inicio,
      req.body.fin,
      req.body.documento,
      req.session.nit_negocio,
      req.body.fecha,
      (err, data) => {
        if (err) {
          res.status(500).send(resjson);
        } else {
          resjson.message = "Resolucion agregada exitosamente";
          res.status(200).send(data);
        }
      }
    );
  });

  app.get("/api/resolucion_activa", (req, res) => {
    //Comporbar sesion
    if (
      !req.session.role ||
      (req.session.role !== "ADMIN" && req.session.role !== "PUBLIC")
    ) {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    Resoluciones.getActiva(
      req.query.doc,
      req.session.nit_negocio,
      (err, data) => {
        if (err) {
          res
            .status(500)
            .send([
              { "@err": 1, message: "Error al traer datos de la resolucion" }
            ]);
        } else {
          res.status(200).send(data);
        }
      }
    );
  });

  app.get("/api/getReplaceResolucion", (req, res) => {
    if (!req.session.role || req.session.role !== "ADMIN") {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }

    Resoluciones.getResolucionReplace(
      req.query.doc,
      req.session.nit_negocio,
      (err, data) => {
        if (err) {
          res
            .status(500)
            .send([
              { "@err": 1, message: "Error al traer datos de la resolucion" }
            ]);
        } else {
          res.status(200).send(data);
        }
      }
    );
  });

  app.post("/api/getResoluciones", (req, res) => {
    //Comporbar sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    Resoluciones.getResoluciones(
      req.session.nit_negocio,
      req.body.filters,
      (err, data) => {
        if (err) {
          res
            .status(500)
            .send([
              { "@err": 1, message: "Error al traer datos de la resolucion" }
            ]);
        } else {
          res.status(200).send(data);
        }
      }
    );
  });

  app.post("/api/reports/historialResoluciones", (req, res) => {
    if (!req.session.role || req.session.role !== "ADMIN") {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }

    HistorialResoluciones.createContent(req.session, req.body.data);
    HistorialResoluciones.print(response => {
      res.setHeader("Content-Type", "application/pdf");
      res.send(response); // Buffer data
    });
  });
};
