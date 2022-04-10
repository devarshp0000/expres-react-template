require("dotenv").config();
const express = require("express");
const app = express();

const morgan = require("morgan");
const path = require("path");

app.use(morgan("tiny"));

app.use(express.static("../client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
});

process.on("uncaughtException", (err) => {
  console.log(err);
});
app.listen(process.env.PORT, () => {
  console.log(`server started on url: http://localhost:${process.env.PORT}/`);
});
