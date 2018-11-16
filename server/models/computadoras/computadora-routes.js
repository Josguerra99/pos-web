const Computadora = require("./computadora-mngr");
const con = require("../../database/db-con");

module.exports = function(app) {
  app.get("/api/getComputadoras", (req, res) => {
    //Comporbar sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      var resjson = {
        "@err": -1,
        message: "No autorizado"
      };
      res.status(401).send(resjson);
      return;
    }
    Computadora.getComputadoras(req.session.nit_negocio, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send({
          "@err": 1,
          message: "Error al obtener computadoras"
        });
      } else {
        res.status(200).send({
          "@err": 0,
          message: "Computadoras obtenidas exitosamente",
          data
        });
      }
    });
  });

  app.get("/api/getComputadora", (req, res) => {
    //Comporbar sesion
    if (
      !req.session.role ||
      (req.session.role !== "ADMIN" && req.session.role !== "PUBLIC")
    ) {
      var resjson = {
        "@err": -1,
        message: "No autorizado"
      };
      res.status(401).send(resjson);
      return;
    }
    var num = Computadora.getComputadoraCookie(req.session.nit_negocio, req);
    if (num === null) {
      res.status(200).send({
        "@err": 100,
        message: "Esta computadora no esta registrada",
        num
      });
    } else {
      res.status(200).send({
        "@err": 0,
        message: "Computadora registrada",
        num
      });
    }
  });

  app.post("/api/registerComputadora", (req, res) => {
    //Comporbar sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      var resjson = {
        "@err": -1,
        message: "No autorizado"
      };
      res.status(401).send(resjson);
      return;
    }
    Computadora.registerComputadora(
      req.session.nit_negocio,
      req.body.codigo,
      (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send({
            "@err": 1,
            message: "Error al registrar computadora"
          });
        } else {
          //Creamos la cookie
          var expireDate = new Date(
            new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 10
          );

          res
            .cookie(
              "computer_" + req.session.nit_negocio.toString(),
              { num: req.body.num, codigo: req.body.codigo },
              {
                maxAge: expireDate
              }
            )
            .send({
              "@err": 0,
              message: "Computadoras registrada"
            });
        }
      }
    );
  });
};
