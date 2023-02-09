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
const websocket = require("./websocket.js");
websocket.start();

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

app.post("/signup", async (req, res) => {
  let signupData = await controller.signup(req.body);
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
  if (req.cookies.JWTtoken == undefined) {
    res.status(400).json({ ok: false, data: "使用者未登入" });
  } else {
    let page = req.query.page;
    let postData = await controller.getIndexData(page);
    res.status(200).json({ postData });
  }
});

app.get("/getParticularPost", async (req, res) => {
  if (req.cookies.JWTtoken == undefined) {
    res.status(400).json({ ok: false, data: "使用者未登入" });
  } else {
    let postID = req.query.postID;
    let postData = await controller.getParticularPost(postID);
    res.status(200).json({ postData });
  }
});

app.get("/checkLogin", async (req, res) => {
  let loginCookie = req.cookies.JWTtoken;
  let loginData = await controller.checkLogin(loginCookie);
  res.status(loginData.status).json({ ok: loginData.ok, data: loginData.data });
});

app.post("/uploadPost", async (req, res) => {
  let userData = jwtDecode(req.cookies.JWTtoken);
  // let userID = userData.userID;
  let username = userData.name;
  let userHeadImg = userData.headImg;
  let uploadData = await controller.uploadPost(userData, req.body);
  res.status(200).json({ ok: true, uploadData, username, userHeadImg });
});

app.put("/uploadHashtag", async (req, res) => {
  if (req.cookies.JWTtoken == undefined) {
    res.status(400).json({ ok: false, data: "使用者未登入" });
  }
  let hashtagName = req.body.hashtagName;
  let postID = req.body.postID;
  console.log(hashtagName, postID);
  let uploadData = await controller.uploadHashtag(hashtagName, postID);
  res.status(200).json({ ok: true, uploadData });
});

app.post("/likePost", async (req, res) => {
  if (req.cookies.JWTtoken == undefined) {
    res.status(400).json({ ok: false, data: "使用者未登入" });
  }

  let userData = jwtDecode(req.cookies.JWTtoken);
  let userID = userData.userID;
  let username = userData.name;
  let userHeadImg = userData.headImg;
  let postID = req.body.postID;

  if (req.body.dislike != true) {
    let likeData = await controller.likePost(
      username,
      userID,
      postID,
      userHeadImg
    );
    if (likeData.ok == true) {
      res.status(200).json({
        ok: true,
        like: true,
        data: {
          liker: username,
          likerID: userID,
          postID: postID,
          targetUserID: likeData.mes.userID,
          postImg: likeData.mes.imageUrl,
        },
        likeData,
      });
    } else {
      res.status(500).json({ ok: false, data: likeData.mes });
    }
  } else {
    let likeData = await controller.dislikePost(username, userID, postID);
    if (likeData.ok == true) {
      res
        .status(200)
        .json({ ok: true, like: false, data: username + " dislike " + postID });
    } else {
      res.status(500).json({ ok: false, data: likeData.mes });
    }
  }
});

app.post("/checkUserLike", async (req, res) => {
  let userData = jwtDecode(req.cookies.JWTtoken);
  let userID = userData.userID;
  let username = userData.name;
  let postID = req.body.postID;

  let checkData = await controller.checkUserLike(username, postID);
  res.status(200).json({ ok: true, data: checkData });
});

app.post("/newComment", async (req, res) => {
  let userData = jwtDecode(req.cookies.JWTtoken);
  let userID = userData.userID;
  let username = userData.name;
  let headImg = userData.headImg;
  let postID = req.body.postID;
  let newComment = req.body.comment;
  let commentData = await controller.newComment(postID, userID, newComment);
  if (commentData.ok != false) {
    console.log(commentData, "留言回傳資訊");
    res.status(200).json({
      ok: true,
      data: {
        username,
        userID,
        headImg,
        postID,
        targetUserID: commentData.mes.userID,
        newComment,
        postImg: commentData.mes.imageUrl,
      },
      commentData,
    });
  } else {
    res.status(500).json({ ok: false, data: { error: commentData.mes } });
  }
});

app.get("/getUserPost/:username", async (req, res) => {
  if (req.cookies.JWTtoken == undefined) {
    res.status(400).json({ ok: false, data: "使用者未登入" });
  } else {
    let userData = jwtDecode(req.cookies.JWTtoken);
    let fanId = userData.userID;
    let userPostData = await controller.getUserPost(req.params.username, fanId);
    res.status(200).json({ ok: true, data: userPostData });
  }
});

app.get("/getTagsPost/:tags", async (req, res) => {
  if (req.cookies.JWTtoken == undefined) {
    res.status(400).json({ ok: false, data: "使用者未登入" });
  } else {
    let userData = jwtDecode(req.cookies.JWTtoken);
    let tagPostID = await controller.getTagsPost(req.params.tags);
    res.status(200).json({ ok: true, data: tagPostID });
  }
});

app.put("/followFans", async (req, res) => {
  if (req.cookies.JWTtoken == undefined) {
    res.status(400).json({ ok: false, data: "使用者未登入" });
  }
  let userData = jwtDecode(req.cookies.JWTtoken);
  let userID = userData.userID;
  let username = userData.name;
  let userHeadImg = userData.headImg;
  let fansData = { userID, username, userHeadImg };
  if (req.body.follow == true) {
    let followedUserID = req.body.followedUser;
    let followData = await controller.followFans(userID, followedUserID);
    console.log(followData);
    res.status(200).json({
      ok: true,
      status: 200,
      followData,
      followedUserID,
      fansData,
      follow: true,
    });
  } else {
    let unfollowedUser = req.body.followedUser;
    let unfollowData = await controller.unfollowFans(userID, unfollowedUser);
    res
      .status(200)
      .json({ ok: true, status: 200, unfollowData, fansData, follow: false });
  }
});

app.get("/userSearch/:searchValue", async (req, res) => {
  if (req.cookies.JWTtoken == undefined) {
    res.status(400).json({ ok: false, data: "使用者未登入" });
  } else {
    if (req.params.searchValue == "") {
      res.status(200).json({ ok: true, data: null });
    } else {
      let searchData = await controller.userSeacher(req.params.searchValue);
      console.log(searchData);
      res.status(200).json({ ok: true, data: searchData });
    }
  }
});

app.get("/tagSearch/:searchValue", async (req, res) => {
  if (req.cookies.JWTtoken == undefined) {
    res.status(400).json({ ok: false, data: "使用者未登入" });
  } else {
    if (req.params.searchValue == "") {
      console.log("test");
      res.status(200).json({ ok: true, data: null });
    } else {
      let searchData = await controller.tagSeacher(req.params.searchValue);
      console.log(searchData);
      res.status(200).json({ ok: true, data: searchData });
    }
  }
});

app.post("/uploadNotification", async (req, res) => {
  if (req.cookies.JWTtoken == undefined) {
    res.status(400).json({ ok: false, data: "使用者未登入" });
  } else {
    let notificationData = await controller.uploadNotification(req.body);
    res.status(200).json({ ok: true, data: notificationData });
  }
});

app.get("/getNotification", async (req, res) => {
  if (req.cookies.JWTtoken == undefined) {
    res.status(400).json({ ok: false, data: "使用者未登入" });
  } else {
    let userData = jwtDecode(req.cookies.JWTtoken);
    let userID = userData.userID;
    let notificationData = await controller.getNotification(userID);
    res.status(200).json(notificationData);
  }
});

app.post("/changeNotificationStatus", async (req, res) => {
  if (req.cookies.JWTtoken == undefined) {
    res.status(400).json({ ok: false, data: "使用者未登入" });
  } else {
    let userData = jwtDecode(req.cookies.JWTtoken);
    let userID = userData.userID;
    let notificationData = await controller.changeNotificationStatus(userID);
    res.status(200).json(notificationData);
  }
});

app.listen(3000, () => {
  console.log("server is running");
});
