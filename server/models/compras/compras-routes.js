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

    console.log(req.body.parcial);

    Compras.addCompra(
      req.session.nit_negocio,
      req.body.detalle,
      req.body.total,
      req.body.parcial,
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
  });

  app.get("/api/getCompraParcial", (req, res) => {
    if (
      !req.session.role ||
      (req.session.role !== "ADMIN" && req.session.role !== "PUBLIC")
    ) {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }

    var resp = {};

    Compras.getParcial(req.session.nit_negocio, (err, data) => {
      if (err) {
        res.status(500).send([
          {
            "@err": 1,
            message: "Error al traer la compra parcial"
          }
        ]);
      } else {
        if (data.length <= 0) {
          res.status(200).send([]);
          return;
        }

        resp.compra = data[0];

        Compras.getDetalleParcial(
          req.session.nit_negocio,
          data[0]["cod"],
          (err1, data1) => {
            if (err1) {
              res.status(500).send([
                {
                  "@err": 1,
                  message: "Error al traer la compra parcial"
                }
              ]);
            } else {
              resp.detalle = data1;
              res.status(200).send(resp);
            }
          }
        );
      }
    });
  });
};
