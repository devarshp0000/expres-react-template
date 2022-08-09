require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const morgan = require("morgan");
const path = require("path");

app.use(morgan("tiny"));

app.use(express.static(path.resolve(__dirname, "..", "client", "build")));
app.get("*", (req, res) => {
  if(req.path === '/private'){
    console.log('------------Protected Route---------');
  }
  res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
});

process.on("uncaughtException", (err) => {
  console.log(err);
});
app.listen(PORT, () => {
  console.log(`server started on url: http://localhost:${PORT}/`);
});
