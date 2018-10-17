const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const SessionMngr = require("./server/models/user-session");
//Midlewares

app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.json());

app.use(
  session({
    secret: "super-top-secret-tengo-que-quitarlo-de-aqui-:'v",
    resave: false,
    saveUninitialized: true
  })
);

///---------------Autenticacion

const User = require("./server/models/user-mngr");

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
  User.getUsers(req.body.user_name, req.body.pass, (err, data) => {
    if (!err && data["@valid"] === 1 && data["@role"] != "None") {
      req.session.user = req.body.user_name;
      req.session.role = data["@role"];
      req.session.nit_negocio = data["@nit_negocio"];
      req.session.authorized = true;
      res.status(200).send(getSessionValues(req.session));
    } else {
      if (req.session) req.session.destroy();
      res.status(200).send(getSessionValues(req.session));
    }
  });
});

app.get("/api/get_session", (req, res) => {
  res.status(200).send(getSessionValues(req.session));
});

///---------------Autenticacion

///---------------Resoliciones

const Resoluciones = require("./server/models/resoluciones-mngr");
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
  if (!req.session.role || req.session.role !== "ADMIN") {
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

app.get("/api/getResoluciones", (req, res) => {
  //Comporbar sesion
  if (!req.session.role || req.session.role !== "ADMIN") {
    var resjson = [{ "@err": -1, message: "No autorizado" }];
    res.status(401).send(resjson);
    return;
  }
  Resoluciones.getResoluciones(req.session.nit_negocio, (err, data) => {
    if (err) {
      res
        .status(500)
        .send([
          { "@err": 1, message: "Error al traer datos de la resolucion" }
        ]);
    } else {
      res.status(200).send(data);
    }
  });
});

///---------------Resoliciones

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

//Cambiar puento dinamicamente
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.get("/", (req, res) => {
  res.send("Backend :D");
});
process.on("uncaughtException", function(err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});
