const User = require("./user-mngr");
const con = require("../../database/db-con");
module.exports = function(app) {
  function getSessionValues(session) {
    var ses = { authorized: false };
    if (!session || !session.user) {
      ses = { authorized: false };
    } else {
      ses = {
        user: session.user,
        role: session.role,
        nit_negocio: session.nit_negocio,
        authorized: session.authorized
      };
    }
    return ses;
  }

  app.post("/api/authenticate_user", (req, res) => {
    User.checkUser(
      req.body.user_name,
      req.body.pass,
      req.body.nit_negocio,
      (err, data) => {
        if (!err && data["@valid"] === 1 && data["@role"] != "None") {
          req.session.user = req.body.user_name;
          req.session.role = data["@role"];
          req.session.nit_negocio = req.body.nit_negocio;
          req.session.authorized = true;
          res.status(200).send(getSessionValues(req.session));
        } else {
          if (req.session) req.session.destroy();
          res.status(200).send(getSessionValues(req.session));
        }
      }
    );
  });

  app.post("/api/logout", (req, res) => {
    if (req.session) req.session.destroy();
    res.status(200).send("Log out exitoso");
  });

  app.get("/api/getUsers", (req, res) => {
    //Comporbar sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    User.getUsers(req.session.nit_negocio, (err, data) => {
      if (err) {
        consolse.log(err);
        res
          .status(500)
          .send([{ "@err": 1, message: "Error al traer los usuarios" }]);
      } else {
        res.status(200).send(data);
      }
    });
  });

  app.post("/api/addUser", (req, res) => {
    //Comporbar sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    User.addUser(
      req.body.user_name,
      req.body.pass,
      req.session.nit_negocio,
      (err, data) => {
        if (err) {
          console.log(err);
          res
            .status(500)
            .send({ "@err": 100, message: "Error al agregar usuario" });
        } else {
          res
            .status(200)
            .send({ "@err": 0, message: "Usuario agregado exitosamente" });
        }
      }
    );
  });

  app.post("/api/editUser", (req, res) => {
    //Comporbar sesion
    if (!req.session.role || req.session.role !== "ADMIN") {
      var resjson = [{ "@err": -1, message: "No autorizado" }];
      res.status(401).send(resjson);
      return;
    }
    User.editUser(
      req.body.user_name,
      req.body.pass,
      req.session.nit_negocio,
      req.body.oldUserName,
      (err, data) => {
        if (err) {
          console.log(err);
          res
            .status(500)
            .send({ "@err": 100, message: "Error al editar usuario" });
        } else {
          res
            .status(200)
            .send({ "@err": 0, message: "Usuario editado exitosamente" });
        }
      }
    );
  });

  app.get("/api/get_session", (req, res) => {
    res.status(200).send(getSessionValues(req.session));
  });

  app.post("/api/addNegocio", (req, res) => {
    User.addNegocio(req.body.data, (err, data) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .send({ "@err": 1, message: "Error al agregar negocio" });
      } else {
        res
          .status(200)
          .send({ "@err": 0, message: "Negocio agregado exitosamente" });
      }
    });
  });
};
