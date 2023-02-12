const jwt = require("jsonwebtoken");
const modelJS = require("./model");
const Model = new modelJS();
require("dotenv").config();
const envData = process.env;
const JWTsecret = envData.jwtKey;

class controller {
  async signup(data) {
    try {
      let returnStatus = await Model.signup(data);
      console.log(returnStatus);
      if (returnStatus.ok == true) {
        return { ok: true, status: 200, mes: returnStatus.mes };
      } else if (returnStatus.status == 400) {
        return { ok: false, status: 400, mes: returnStatus.mes };
      } else {
        return { ok: false, status: 500, mes: returnStatus.mes };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async signin(data) {
    try {
      let account = data.account;
      let password = data.password;
      if (account == "" || password == "") {
        return { ok: false, status: 400, mes: "帳號、密碼不可空白" };
      }

      let result = await Model.signin(account, password);
      if (result.ok) {
        let payload = {
          account: result.data.account,
          name: result.data.username,
          userID: result.data._id,
          headImg: result.data.headImg,
        };
        let token = jwt.sign(payload, JWTsecret);
        return { ok: true, status: 200, mes: result.mes, token: token };
      } else if (result.status == 400) {
        return { ok: false, status: 400, mes: result.mes };
      } else {
        return { ok: false, status: 500, mes: result.mes };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async checkLogin(token) {
    if (token != undefined) {
      return jwt.verify(token, JWTsecret, (err, decoded) => {
        if (err) {
          console.log(err);
          return { ok: false, status: 400, mes: "登入錯誤" };
        } else {
          return { ok: true, status: 200, decoded };
        }
      });
    } else {
      return { ok: false, status: 400, mes: "使用者未登入" };
    }
  }

  async uploadPost(userData, postData) {
    try {
      let userID = userData.userID;
      let username = userData.name;
      let userHeadImg = userData.headImg;
      let result = await Model.uploadPost(
        userID,
        postData.base64Img,
        postData.message,
        postData.hashtagArr
      );
      if (result.ok) {
        return {
          ok: true,
          result: result.data,
          username,
          userHeadImg,
          status: 200,
        };
      } else {
        return { ok: true, mes: result.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async uploadHashtag(hashtagName, postID) {
    let result = await Model.uploadHashtag(hashtagName, postID);
    if (result.ok) {
      return { ok: true, result: result.result, status: 200 };
    } else {
      return { ok: false, mes: result.mes, status: 500 };
    }
  }

  async getIndexData(page) {
    if (!/^\d+$/.test(page)) {
      console.log("testestest");
      return { ok: false, status: 400 };
    }
    try {
      let postData = await Model.getIndexData(page);
      if (postData.ok) {
        return {
          ok: true,
          status: 200,
          nextPage: postData.nextPage,
          data: postData.result,
        };
      } else {
        return { ok: false, mes: postData.mes };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async getParticularPost(postID) {
    try {
      let postData = await Model.getParticularPost(postID);
      if (postData.ok) {
        return { ok: true, postData: postData.result, status: 200 };
      } else {
        return { ok: false, mes: error, status: 400 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async likePost(userData, postID, dislike) {
    try {
      let userID = userData.userID;
      let username = userData.name;
      let userHeadImg = userData.headImg;

      if (dislike != true) {
        let result = await Model.likePost(
          username,
          userID,
          postID,
          userHeadImg
        );
        if (result.ok) {
          let data = {
            liker: username,
            likerID: userID,
            postID: postID,
            targetUserID: result.mes.userID,
            postImg: result.mes.imageUrl,
          };
          return { ok: true, like: true, data, status: 200 };
        }
      } else {
        let result = await Model.dislikePost(username, userID, postID);
        if (result.ok) {
          return {
            ok: true,
            like: false,
            data: username + " dislike " + postID,
            status: 200,
          };
        }
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async checkUserLike(userData, postID) {
    try {
      let username = userData.name;
      let result = await Model.checkUserLike(username, postID);
      if (result.ok) {
        return { ok: true, data: result.result, status: 200 };
      } else {
        return { ok: true, mes: result.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async newComment(postID, userData, newComment) {
    try {
      let userID = userData.userID;
      let username = userData.name;
      let headImg = userData.headImg;
      let result = await Model.newComment(postID, userID, newComment);
      if (result.ok) {
        let data = {
          username,
          userID,
          headImg,
          postID,
          targetUserID: result.mes.userID,
          newComment,
          postImg: result.mes.imageUrl,
        };
        return { ok: true, data, result, status: 200 };
      } else {
        return { ok: false, mes: result.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async getUserPost(username, userData) {
    try {
      let fanId = userData.userID;
      let result = await Model.getUserPost(username, fanId);
      if (result.ok) {
        let data = {
          posts: result.posts,
          user: result.user,
          isMatchFan: result.isMatchFan,
        };
        return {
          ok: true,
          data,
          status: 200,
        };
      } else {
        return { ok: false, mes: result.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async getTagsPost(userData, tagsname) {
    try {
      let result = await Model.getTagsPost(tagsname);
      if (result.ok) {
        return { ok: true, data: result.posts, status: 200 };
      } else {
        return { ok: false, data: result.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async followFans(fanData, followedUserID, followOrUnfollow) {
    try {
      let fanID = fanData.userID;
      let fanname = fanData.name;
      let fanHeadImg = fanData.headImg;
      let fansData = { fanID, fanname, fanHeadImg };
      console.log(fanData, fansData);
      if (followOrUnfollow) {
        let followData = await Model.followFans(fanID, followedUserID);
        if (followData.ok) {
          return {
            ok: true,
            followData,
            followedUserID,
            fansData,
            follow: true,
            status: 200,
          };
        } else {
          return { ok: false, data: followData.mes, status: 500 };
        }
      } else {
        let unfollowData = await Model.unfollowFans(fanID, followedUserID);
        if (unfollowData.ok) {
          return {
            ok: true,
            unfollowData,
            fansData,
            follow: false,
            status: 200,
          };
        } else {
          return { ok: false, data: unfollowData.mes, status: 500 };
        }
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async userSeacher(searchValue) {
    try {
      if (searchValue == "") {
        return { ok: true, data: null, status: 200 };
      }
      let searchData = await Model.userSeacher(searchValue);
      if (searchData.ok) {
        return { ok: true, data: searchData.result, status: 200 };
      } else {
        return { ok: false, data: searchData.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async tagSeacher(searchValue) {
    try {
      if (searchValue == "") {
        return { ok: true, data: null, status: 200 };
      }
      let searchData = await Model.tagSeacher(searchValue);
      if (searchData.ok) {
        return { ok: true, data: searchData.result, status: 200 };
      } else {
        return { ok: false, data: searchData.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async uploadNotification(notification) {
    try {
      let notificationData = await Model.uploadNotification(notification);
      if (notificationData.ok) {
        return { ok: true, data: notificationData, status: 200 };
      } else {
        return { ok: false, mes: notificationData.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async getNotification(userData) {
    try {
      let userID = userData.userID;
      let notificationData = await Model.getNotification(userID);
      if (notificationData.ok) {
        return { ok: true, data: notificationData.result, status: 200 };
      } else {
        return { ok: false, data: notificationData.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async changeNotificationStatus(userData) {
    try {
      let userID = userData.userID;
      let notificationStatus = await Model.changeNotificationStatus(userID);
      if (notificationStatus.ok) {
        return { ok: true, data: notificationStatus.result, status: 200 };
      } else {
        return { ok: false, data: notificationStatus.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }
}

module.exports = controller;
