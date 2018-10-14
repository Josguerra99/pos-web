const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

const SessionMngr = require("./server/models/user-session");
//Midlewares
app.use(bodyParser.json());

app.use(
  session({
    secret: "super-top-secret-tengo-que-quitarlo-de-aqui-:'v",
    resave: false,
    saveUninitialized: true
  })
);

//Cambiar puento dinamicamente
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.get("/", (req, res) => {
  res.send("Backend :D");
});

///---------------Autenticacion

const User = require("./server/models/user-mngr");

app.post("/api/authenticate_user", (req, res) => {
  User.getUsers(req.body.user_name, req.body.pass, (err, data) => {
    if (!err && data["@valid"] === 1 && data["@role"] != "None") {
      req.session.user = req.body.user_name;
      req.session.role = data["@role"];
      req.session.nit_negocio = data["@nit_negocio"];
      res.status(200).send(req.session);
    } else {
      if (req.session) req.session.destroy();
      res.status(200).send("Unauthorized");
    }
  });
});
///---------------Autenticacion

app.get("/api/admin-home", (req, res) => {
  if (req.session && req.session.user && req.session.role === "ADMIN") {
    return res.status(200).send(":D");
  }
  return res.status(401).send();
});
