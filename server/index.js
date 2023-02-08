require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000;

const morgan = require("morgan");
const path = require("path");

app.use(express.json());
app.use(cookieParser());

app.use(morgan("tiny"));

process.on("uncaughtException", (err) => {
  console.log(err);
});
app.listen(PORT, () => {
  console.log(`server started on url: http://localhost:${PORT}/`);
});

const { authRouter, cartRouter } = require("./routers");

const { checkAuth } = require("./middlewares");

app.use("/api/auth", authRouter);
app.use("/api/carts", checkAuth, cartRouter);

app.use(express.static(path.resolve(__dirname, "..", "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
});
