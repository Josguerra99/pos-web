const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Backend :D");
});

//Cambiar puento dinamicamente
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
