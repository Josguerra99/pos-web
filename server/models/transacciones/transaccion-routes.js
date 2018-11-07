const Transacciones = require("./transaccion-mngr");

module.exports = function(app) {
  /**INVENTARIO */
  app.post("/api/getTransacciones", (req, res) => {
    if (!req.session.role || req.session.role !== "ADMIN") {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    Transacciones.getTransacciones(
      req.session.nit_negocio,
      req.body.filters,
      (err, data) => {
        if (err) {
          res.status(500).send([
            {
              "@err": 1,
              message: "Error al traer las transacciones " + err
            }
          ]);
        } else {
          res.status(200).send(data);
        }
      }
    );
  });
};
