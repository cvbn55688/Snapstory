const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const engine = require("ejs-locals");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", engine);
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/inbox", (req, res) => {
  res.render("inbox");
});

app.listen(3000, () => {
  console.log("server is running");
});
