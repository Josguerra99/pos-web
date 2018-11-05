const Compras = require("./compras-mngr");

module.exports = function(app) {
  /**INVENTARIO */

  app.post("/api/addCompra", (req, res) => {
    if (
      !req.session.role ||
      (req.session.role !== "ADMIN" && req.session.role !== "PUBLIC")
    ) {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }

    Compras.addCompra(
      req.session.nit_negocio,
      req.body.detalle,
      req.body.total,
      (err, data) => {
        if (err) {
          res.status(500).send([
            {
              "@err": 1,
              message: "Error al tratar de ingresar compra"
            }
          ]);
        } else {
          res.status(200).send({
            "@err": 0,
            message: "Datos insertados exitosamente "
          });
        }
      }
    );
  }); /*

  app.post("/api/getDetalle", (req, res) => {
    if (
      !req.session.role ||
      (req.session.role !== "ADMIN" && req.session.role !== "PUBLIC")
    ) {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    Compras.getDetalle(
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
  });*/
};
