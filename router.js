const express = require("express");
const router = express.Router();
const jwtDecode = require("jwt-decode");
const controllerJS = require("./controller");
const controller = new controllerJS();

router.post("/signup", async (req, res) => {
  try {
    let signupData = await controller.signup(req.body);
    if (signupData.status == 200) {
      res.status(signupData.status).json(signupData);
    } else {
      res.status(signupData.status).json(signupData);
    }
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.put("/signin", async (req, res) => {
  try {
    let signinData = await controller.signin(req.body);
    if (signinData.status == 200) {
      res
        .cookie("JWTtoken", signinData.token, { httpOnly: true })
        .status(signinData.status)
        .json(signinData);
    } else {
      res.status(signinData.status).json(signinData);
    }
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.delete("/logout", async (req, res) => {
  console.log("test");
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, mes: "使用者未登入" });
    }
    res
      .status(200)
      .clearCookie("JWTtoken")
      .json({ ok: true, mes: "已刪除cookie" });
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.get("/getData", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, mes: "使用者未登入" });
    } else {
      let page = req.query.page;
      let userData = jwtDecode(req.cookies.JWTtoken);
      let postData = await controller.getIndexData(page, userData);
      res.status(postData.status).json(postData);
    }
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.get("/getParticularPost", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, mes: "使用者未登入" });
    } else {
      let postID = req.query.postID;
      let userData = jwtDecode(req.cookies.JWTtoken);
      let postData = await controller.getParticularPost(postID, userData);
      res.status(postData.status).json(postData);
    }
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.get("/checkLogin", async (req, res) => {
  try {
    let loginCookie = req.cookies.JWTtoken;
    let loginData = await controller.checkLogin(loginCookie);
    res.status(loginData.status).json(loginData);
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.post("/uploadPost", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, mes: "使用者未登入" });
    }
    let userData = jwtDecode(req.cookies.JWTtoken);
    let result = await controller.uploadPost(userData, req.body);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.patch("/updatePost", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, mes: "使用者未登入" });
    }
    let userData = jwtDecode(req.cookies.JWTtoken);
    let result = await controller.updatePost(userData, req.body);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.delete("/deletePost", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, mes: "使用者未登入" });
    }
    let userData = jwtDecode(req.cookies.JWTtoken);
    let result = await controller.deletePost(userData, req.body);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.put("/uploadHashtag", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    }
    let hashtagName = req.body.hashtagName;
    let postID = req.body.postID;
    let result = await controller.uploadHashtag(hashtagName, postID);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.delete("/deleteHashtag", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    }
    let hashtagName = req.body.hashtagName;
    let postID = req.body.postID;
    let result = await controller.deleteHashtag(hashtagName, postID);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.post("/likePost", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    }

    let userData = jwtDecode(req.cookies.JWTtoken);
    let postID = req.body.postID;
    let dislike = req.body.dislike;

    let result = await controller.likePost(userData, postID, dislike);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.post("/checkUserLike", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    }
    let userData = jwtDecode(req.cookies.JWTtoken);
    let postID = req.body.postID;
    let result = await controller.checkUserLike(userData, postID);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.post("/newComment", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    }
    let userData = jwtDecode(req.cookies.JWTtoken);
    let postID = req.body.postID;
    let newComment = req.body.comment;
    let result = await controller.newComment(postID, userData, newComment);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.patch("/updateComment", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    }
    let userData = jwtDecode(req.cookies.JWTtoken);
    let result = await controller.updateComment(userData, req.body);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.get("/getUserPost/:userID", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    } else {
      let userData = jwtDecode(req.cookies.JWTtoken);
      let result = await controller.getUserPost(req.params.userID, userData);
      res.status(result.status).json(result);
    }
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.get("/getTagsPost/:tags", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    } else {
      let userData = jwtDecode(req.cookies.JWTtoken);
      let result = await controller.getTagsPost(userData, req.params.tags);
      res.status(result.status).json(result);
    }
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.put("/followFans", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    }
    let fanData = jwtDecode(req.cookies.JWTtoken);
    let followedUserID = req.body.followedUser;
    let followOrUnfollow = req.body.follow;
    let result = await controller.followFans(
      fanData,
      followedUserID,
      followOrUnfollow
    );
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.get("/userSearch/:searchValue", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    } else {
      let result = await controller.userSeacher(req.params.searchValue);
      res.status(result.status).json(result);
    }
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.get("/tagSearch/:searchValue", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    } else {
      let result = await controller.tagSeacher(req.params.searchValue);
      res.status(result.status).json(result);
    }
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.post("/uploadNotification", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    } else {
      let notificationData = await controller.uploadNotification(req.body);
      res.status(notificationData.status).json(notificationData);
    }
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.get("/getNotification", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    } else {
      let userData = jwtDecode(req.cookies.JWTtoken);
      let notificationData = await controller.getNotification(userData);
      res.status(notificationData.status).json(notificationData);
    }
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

router.post("/changeNotificationStatus", async (req, res) => {
  try {
    if (req.cookies.JWTtoken == undefined) {
      res.status(400).json({ ok: false, data: "使用者未登入" });
    } else {
      let userData = jwtDecode(req.cookies.JWTtoken);
      let notificationData = await controller.changeNotificationStatus(
        userData
      );
      res.status(notificationData.status).json(notificationData);
    }
  } catch (error) {
    res.status(500).json({ ok: false, mes: error });
  }
});

module.exports = router;
