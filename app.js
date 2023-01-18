const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const engine = require("ejs-locals");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
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
  res.status(200).json({ ok: true, data: "data" });
});

app.get("/checkLogin", async (req, res) => {
  let loginCookie = req.cookies.JWTtoken;
  let loginData = await controller.checkLogin(loginCookie);
  res.status(loginData.status).json({ ok: loginData.ok, data: loginData.data });
});

app.listen(3000, () => {
  console.log("server is running");
});
