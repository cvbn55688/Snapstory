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
      postData.message,
      postData.hashtagArr
    );
    return uploadReturn;
  }

  async uploadHashtag(hashtagName, postID) {
    let hashtagData = await Model.uploadHashtag(hashtagName, postID);
    return hashtagData;
  }

  async getIndexData(page) {
    let postData = await Model.getIndexData(page);
    if (postData.ok) {
      return { ok: true, nextPage: postData.nextPage, data: postData.data };
    } else {
      return { ok: false, error: postData.mes };
    }
  }

  async getParticularPost(postID) {
    let postData = await Model.getParticularPost(postID);
    return postData;
  }

  async likePost(username, userID, postID, userHeadImg) {
    let likeData = await Model.likePost(username, userID, postID, userHeadImg);
    console.log(likeData);
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

  async getUserPost(username, fanId) {
    let userPostData = await Model.getUserPost(username, fanId);
    return userPostData;
  }

  async getTagsPost(tagsname) {
    let userPostData = await Model.getTagsPost(tagsname);
    return userPostData;
  }

  async followFans(fan, followedUser) {
    let followData = await Model.followFans(fan, followedUser);
    return followData;
  }

  async unfollowFans(fan, unfollowedUser) {
    let unfollowData = await Model.unfollowFans(fan, unfollowedUser);
    return unfollowData;
  }

  async userSeacher(searchValue) {
    let searchData = await Model.userSeacher(searchValue);
    return searchData;
  }

  async tagSeacher(searchValue) {
    let searchData = await Model.tagSeacher(searchValue);
    return searchData;
  }

  async uploadNotification(notification) {
    let notificationData = await Model.uploadNotification(notification);
    return notificationData;
  }

  async getNotification(userID) {
    let notificationData = await Model.getNotification(userID);
    return notificationData;
  }

  async changeNotificationStatus(userID) {
    let notificationStatus = await Model.changeNotificationStatus(userID);
    return notificationStatus;
  }
}

module.exports = controller;
