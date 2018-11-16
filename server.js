// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
/*require("babel-register")({
  presets: ["env"]
});*/

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const SessionMngr = require("./server/models/user-session");

//Midlewares

app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    secret: "super-top-secret-tengo-que-quitarlo-de-aqui-:'v a",
    resave: false,
    saveUninitialized: true
  })
);

require("./server/models/inventory/inventory-routes")(app);
require("./server/models/facturacion/facturacion-routes")(app);
require("./server/models/compras/compras-routes")(app);
require("./server/models/transacciones/transaccion-routes")(app);
require("./server/models/resoluciones/resoluciones-routes")(app);
require("./server/models/users/user-routes")(app);
require("./server/models/computadoras/computadora-routes")(app);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.get("/", (req, res) => {
  res.send("Backend :D");
});

//Cambiar puento dinamicamente
const port = process.env.PORT || 3001;
var server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

var io = require("socket.io")(server);

io.on("connection", socket => {
  console.log(socket.id);

  socket.on("ADD_FACTURA", function(data) {
    io.emit("RECEIVE_FACTURA", data);
  });
});

process.on("uncaughtException", function(err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});
