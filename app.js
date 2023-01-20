require("dotenv").config();
const envData = process.env;
const express = require("express");
const jwtDecode = require("jwt-decode");
const app = express();
const bodyParser = require("body-parser");
const engine = require("ejs-locals");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));
app.engine("ejs", engine);
app.set("views", "./views");
app.set("view engine", "ejs");

const controllerJS = require("./controller");
const controller = new controllerJS();

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  console.log(req.user);
  res.render("login");
});

app.get("/inbox", (req, res) => {
  res.render("inbox");
});

app.post("/signup", async (req, res) => {
  let signupData = await controller.signup(req.body);
  console.log(signupData);
  if (signupData.status == 200) {
    res.status(200).json({ ok: true, mes: signupData.mes });
  } else {
    res.status(signupData.status).json({ ok: false, error: signupData.mes });
  }
});

app.put("/signin", async (req, res) => {
  let signinData = await controller.signin(req.body);
  if (signinData.status == 200) {
    res
      .cookie("JWTtoken", signinData.token, { httpOnly: true })
      .status(200)
      .json({ ok: true, mes: signinData.mes });
  } else {
    res.status(signinData.status).json({ ok: false, error: signinData.mes });
  }
});

app.get("/getData", async (req, res) => {
  let postData = await controller.getIndexData();
  res.status(200).json({ ok: true, data: postData });
});

app.get("/checkLogin", async (req, res) => {
  let loginCookie = req.cookies.JWTtoken;
  let loginData = await controller.checkLogin(loginCookie);
  res.status(loginData.status).json({ ok: loginData.ok, data: loginData.data });
});

app.post("/uploadPost", async (req, res) => {
  let userData = jwtDecode(req.cookies.JWTtoken);

  let uploadData = await controller.uploadPost(userData, req.body);
  console.log(uploadData);
  res.status(200).json({ ok: true, data: uploadData });
});

app.listen(3000, () => {
  console.log("server is running");
});
