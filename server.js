require("dotenv").config();
const envData = process.env;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const engine = require("ejs-locals");
const cookieParser = require("cookie-parser");
const router = require("./router");
const websocket = require("./websocket.js");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));
app.engine("ejs", engine);
app.set("views", "./views");
app.set("view engine", "ejs");
websocket.start();

app.use("/", router);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/inbox", (req, res) => {
  res.render("inbox");
});

app.get("/personal/:user", (req, res) => {
  res.render("userPage");
});

app.get("/tags/:tagsName", (req, res) => {
  res.render("tagsPage");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is listening on port 3000");
});
