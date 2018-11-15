const Facturacion = require("./facturacion-mngr");

const Factura = require("../../reports/factura");

module.exports = function(app) {
  app.post("/api/reports/factura", (req, res) => {
    if (
      !req.session.role ||
      (req.session.role !== "ADMIN" && req.session.role !== "PUBLIC")
    ) {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }

    Facturacion.getFacturaData(
      req.session.nit_negocio,
      req.query.ntransaccion,
      (err, data) => {
        if (err) {
          res.status(500).send([
            {
              "@err": 1,
              message: "Error al traer las factura " + err
            }
          ]);
        } else {
          Facturacion.getDetalle(
            req.session.nit_negocio,
            req.query.ntransaccion,
            (err, detalle) => {
              if (err) {
                res.status(500).send([
                  {
                    "@err": 1,
                    message: "Error al traer el detalle" + err
                  }
                ]);
              } else {
                console.log(detalle);
                Factura.createContent(data[0], detalle);
                Factura.print(response => {
                  res.setHeader("Content-Type", "application/pdf");
                  res.send(response); // Buffer data
                });
              }
            }
          );
        }
      }
    );
  });

  /**INVENTARIO */
  app.get("/api/getCliente", (req, res) => {
    if (
      !req.session.role ||
      (req.session.role !== "ADMIN" && req.session.role !== "PUBLIC")
    ) {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    Facturacion.getCliente(
      req.session.nit_negocio,
      req.query.nit,
      (err, data) => {
        if (err) {
          res.status(500).send([
            {
              "@err": 1,
              message: "Error al traer datos del cliente " + req.query.nit
            }
          ]);
        } else {
          res.status(200).send(data);
        }
      }
    );
  });

  app.get("/api/getFacturaData", (req, res) => {
    if (
      !req.session.role ||
      (req.session.role !== "ADMIN" && req.session.role !== "PUBLIC")
    ) {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    Facturacion.getFacturaData(
      req.session.nit_negocio,
      req.query.ntransaccion,
      (err, data) => {
        if (err) {
          res.status(500).send([
            {
              "@err": 1,
              message: "Error al traer las factura " + err
            }
          ]);
        } else {
          res.status(200).send(data);
        }
      }
    );
  });

  app.post("/api/getFacturas", (req, res) => {
    if (
      !req.session.role ||
      (req.session.role !== "ADMIN" && req.session.role !== "PUBLIC")
    ) {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    Facturacion.getFacturas(req.session.nit_negocio, (err, data) => {
      if (err) {
        res.status(500).send([
          {
            "@err": 1,
            message: "Error al traer las facturas"
          }
        ]);
      } else {
        res.status(200).send(data);
      }
    });
  });

  app.post("/api/addFactura", (req, res) => {
    if (
      !req.session.role ||
      (req.session.role !== "ADMIN" && req.session.role !== "PUBLIC")
    ) {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    Facturacion.addCliente(
      req.session.nit_negocio,
      req.body.cliente.nit,
      req.body.cliente.nombre,
      req.body.cliente.direccion,

      (err, data) => {
        if (!err) {
          Facturacion.addFactura(
            req.session.nit_negocio,
            req.body.cliente,
            req.body.detalle,
            req.body.total,
            (err, data) => {
              if (err) {
                res.status(500).send([
                  {
                    "@err": 1,
                    message: "Error al tratar de ingresar factura"
                  }
                ]);
              } else {
                res.status(200).send({
                  "@err": 0,
                  message: "Datos insertados exitosamente ",
                  ntransaccion: data
                });
              }
            }
          );
        } else {
          res.status(500).send([
            {
              "@err": 1,
              message: "Error al tratar de ingresar cliente"
            }
          ]);
        }
      }
    );
  });

  app.post("/api/getDetalle", (req, res) => {
    if (
      !req.session.role ||
      (req.session.role !== "ADMIN" && req.session.role !== "PUBLIC")
    ) {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    Facturacion.getDetalle(
      req.session.nit_negocio,
      req.body.ntransaccion,
      (err, data) => {
        if (err) {
          res.status(500).send([
            {
              "@err": 1,
              message: "Error al traer el detalle"
            }
          ]);
        } else {
          res.status(200).send(data);
        }
      }
    );
  });
};
