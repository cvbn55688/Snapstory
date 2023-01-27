const jwt = require("jsonwebtoken");
const modelJS = require("./model");
const Model = new modelJS();
require("dotenv").config();
const envData = process.env;
const JWTsecret = envData.jwtKey;
class controller {
  async signup(data) {
    let returnStatus = await Model.signup(data);
    console.log(returnStatus);
    if (returnStatus.ok == true) {
      return { ok: true, status: 200, mes: returnStatus.mes };
    } else if (returnStatus.status == 400) {
      return { ok: false, status: 400, mes: returnStatus.mes };
    } else {
      return { ok: false, status: 500, mes: returnStatus.mes };
    }
  }

  async signin(data) {
    let returnStatus = await Model.signin(data);
    if (returnStatus.ok == true) {
      let payload = {
        account: returnStatus.data.account,
        name: returnStatus.data.username,
        userID: returnStatus.data._id,
        headImg: returnStatus.data.headImg,
      };
      let token = jwt.sign(payload, JWTsecret);
      return { ok: true, status: 200, mes: returnStatus.mes, token: token };
    } else if (returnStatus.status == 400) {
      return { ok: false, status: 400, mes: returnStatus.mes };
    } else {
      return { ok: false, status: 500, mes: returnStatus.mes };
    }
  }

  async checkLogin(token) {
    if (token != undefined) {
      return jwt.verify(token, JWTsecret, (err, decoded) => {
        if (err) {
          console.log(err);
          return { ok: false, status: 400, data: "登入錯誤" };
        } else {
          console.log(decoded);
          return { ok: true, status: 200, data: decoded };
        }
      });
    } else {
      return { ok: false, status: 400, data: "使用者未登入" };
    }
  }

  async uploadPost(userData, postData) {
    let userID = userData.userID;
    let uploadReturn = await Model.uploadPost(
      userID,
      postData.base64Img,
      postData.message
    );
    return uploadReturn;
  }

  async getIndexData() {
    let postData = await Model.getIndexData();
    // console.log(postData);
    return postData;
  }

  async likePost(username, userID, postID) {
    let likeData = await Model.likePost(username, userID, postID);
    return likeData;
  }

  async dislikePost(username, userID, postID) {
    let likeData = await Model.dislikePost(username, userID, postID);
    return likeData;
  }

  async checkUserLike(username, postID) {
    let checkData = await Model.checkUserLike(username, postID);
    return checkData;
  }

  async newComment(postID, userID, newComment) {
    let commentData = await Model.newComment(postID, userID, newComment);
    return commentData;
  }
}

module.exports = controller;
