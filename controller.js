require("dotenv").config();
const jwt = require("jsonwebtoken");
const modelJS = require("./model");
const Model = new modelJS();
const envData = process.env;
const JWTsecret = envData.jwtKey;
const redis = require("redis");
const passwordLimit = /^[a-zA-Z0-9]+$/;

const client = redis.createClient({
  host: envData.host_name,
  port: 6379,
});
client.connect();

client.on("connect", function () {
  console.log("Redis client connected");
});

client.on("error", function (err) {
  console.log("Something went wrong " + err);
});

async function searchRedis(searcchValue) {
  let userDatas = [];
  let result = await client.keys(`${searcchValue}*`);
  for (let userdata of result) {
    await client.get(userdata).then((dt) => {
      userDatas.push(dt);
    });
  }
  return userDatas;
}

class controller {
  async signup(data) {
    try {
      if (data.account == "" || data.username == "" || data.password == "") {
        return {
          ok: false,
          mes: "帳號、用戶名稱、密碼皆不可空白",
          status: 400,
        };
      } else if (data.password.value < 8) {
        return {
          ok: false,
          mes: "密碼不可少於8個字",
          status: 400,
        };
      } else if (!passwordLimit.test(data.password)) {
        return {
          ok: false,
          mes: "密碼只得包含數字和英文",
          status: 400,
        };
      }
      let result = await Model.signup(data);

      if (result.ok == true) {
        let redisData = {
          _id: result.data._id,
          username: result.data.username,
          headImg: result.data.headImg,
        };
        try {
          client.set(
            `${result.data.username}:${result.data._id}`,
            JSON.stringify(redisData)
          );
        } catch (err) {
          console.log(err);
        }

        return { ok: true, status: 200, mes: result.mes };
      } else if (result.status == 400) {
        return { ok: false, status: 400, mes: result.mes };
      } else {
        return { ok: false, status: 500, mes: result.mes };
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
        return {
          ok: true,
          status: 200,
          mes: result.mes,
          token: token,
          data: result,
        };
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

  async getUserFansFollower(userData) {
    try {
      let userID = userData.userID;
      let result = await Model.getUserFansFollower(userID);
      if (result.ok) {
        return { ok: true, data: result.result, status: 200 };
      } else {
        return { ok: false, data: result.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async uploadPost(userData, postData) {
    try {
      let userID = userData.userID;
      let username = userData.name;
      let userHeadImg = userData.headImg;
      let result = await Model.uploadPost(
        userID,
        postData.base64ImgArr,
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

  async updatePost(userData, postData) {
    try {
      let userID = userData.userID;
      let username = userData.name;
      let userHeadImg = userData.headImg;
      let postID = postData.postID;
      let originImageArr = postData.originImageArr;
      let imagesArr = postData.imagesArr;
      let postMes = postData.postMes;
      let postHashtagArr = postData.hashtagArr;
      let reload = postData.reload;
      let result = await Model.updatePost(
        postID,
        originImageArr,
        imagesArr,
        postMes,
        postHashtagArr,
        reload
      );
      if (result.ok) {
        return {
          ok: true,
          result: result.data,
          status: 200,
        };
      } else {
        return { ok: true, mes: result.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async deletePost(userData, postData) {
    try {
      let userID = userData.userID;
      let username = userData.name;
      let userHeadImg = userData.headImg;
      let postID = postData.postID;
      let postImgUrlArr = postData.postImgUrlArr;
      let postHashtagArr = postData.hashtagArr;
      let result = await Model.deletePost(
        postID,
        postImgUrlArr,
        postHashtagArr
      );
      if (result.ok) {
        return {
          ok: true,
          result: result.data,
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

  async deleteHashtag(hashtagName, postID) {
    let result = await Model.deleteHashtag(hashtagName, postID);
    if (result.ok) {
      return { ok: true, result: result.result, status: 200 };
    } else {
      return { ok: false, mes: result.mes, status: 500 };
    }
  }

  async getIndexData(page, userData) {
    if (!/^\d+$/.test(page)) {
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
          currentUserData: userData,
        };
      } else {
        return { ok: false, mes: postData.mes };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async getParticularPost(postID, userData) {
    try {
      let postData = await Model.getParticularPost(postID);
      if (postData.ok) {
        return {
          ok: true,
          postData: postData.result,
          currentUserData: userData,
          status: 200,
        };
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
      let userID = userData.userID;
      let result = await Model.checkUserLike(userID, postID);
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

  async updateComment(userData, commentData) {
    try {
      let userID = userData.userID;
      let username = userData.name;
      let headImg = userData.headImg;
      let postID = commentData.postID;
      let func = commentData.func;
      let updateCommentID = commentData.commentID;
      if (func == "edit") {
        let updateComment = commentData.comment;
        let result = await Model.updateComment(
          userData,
          postID,
          updateCommentID,
          updateComment
        );
        if (result.ok) {
          return { ok: true, mes: result.mes, status: 200 };
        } else {
          return { ok: false, mes: result.mes, status: 500 };
        }
      } else if (func == "delete") {
        let result = await Model.deleteComment(postID, updateCommentID);
        if (result.ok) {
          return { ok: true, mes: result.mes, status: 200 };
        } else {
          return { ok: false, mes: result.mes, status: 500 };
        }
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async getUserPost(userID, fanData) {
    try {
      let fanId = fanData.userID;
      let result = await Model.getUserPost(userID, fanId);
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

  async updateUserData(editData, userData) {
    try {
      let userID = userData.userID;
      let username = userData.name;
      let editUserID = editData.userID;
      let editNewUsername = editData.newUsername;
      let editNewUserProfile = editData.newUserProfile;
      let editNewHeadImg = editData.newUserHeadImg;
      let headImgReload = editData.headimgReload;
      if (userID == editUserID) {
        let result = await Model.updateUserData(
          userID,
          editNewUsername,
          editNewUserProfile,
          editNewHeadImg,
          headImgReload
        );
        if (result.ok) {
          let redisData = {
            _id: userID,
            username: editNewUsername,
            headImg: result.headImgAM,
          };
          try {
            client
              .rename(`${username}:${userID}`, `${editNewUsername}:${userID}`)
              .then(() => {
                client.set(
                  `${editNewUsername}:${userID}`,
                  JSON.stringify(redisData)
                );
              });
          } catch (err) {
            console.log(err);
          }

          let payload = {
            name: editNewUsername,
            userID: userID,
            headImg: result.headImgAM,
          };
          let token = jwt.sign(payload, JWTsecret);
          return {
            ok: true,
            result: result.result,
            token,
            status: 200,
          };
        } else {
          return { ok: false, mes: result.mes, status: 500 };
        }
      } else {
        return { ok: false, data: "使用者錯誤", status: 401 };
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
      let searchData;
      try {
        let redisRes = await searchRedis(searchValue);
        if (redisRes.length == 0) {
          searchData = await Model.userSeacher(searchValue);
        } else {
          searchData = { ok: true, result: redisRes.map(JSON.parse) };
        }
      } catch (err) {
        searchData = { ok: true, result: redisRes.map(JSON.parse) };
        console.log(err);
      }

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

  async getChatMember(userData) {
    try {
      let userID = userData.userID;
      let result = await Model.getChatMember(userID);
      if (result.ok) {
        return { ok: true, data: result.result, userData, status: 200 };
      } else {
        return { ok: false, data: result.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async getChatData(userData, targetID, query) {
    try {
      let userID = userData.userID;
      let page = query.page;
      let oldestChatID = query.oldestChatID;
      let result = await Model.getChatData(
        userID,
        targetID,
        page,
        oldestChatID
      );
      if (result.ok) {
        return {
          ok: true,
          data: result.result,
          nextPage: result.nextPage,
          status: 200,
        };
      } else {
        return { ok: false, data: result.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async uploadChatData(userData, chatData) {
    try {
      let userID = userData.userID;
      let targetID = chatData.targetID;
      let message = chatData.message;
      let isPost = chatData.isPost;
      let targetInRoom = chatData.targetInRoom;
      let result = await Model.uploadChatData(
        userID,
        targetID,
        message,
        isPost,
        targetInRoom
      );
      if (result.ok) {
        return { ok: true, data: result.result, status: 200 };
      } else {
        return { ok: false, data: result.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async getUnreadMessage(userData) {
    try {
      let userID = userData.userID;
      let result = await Model.getUnreadMessage(userID);
      if (result.ok) {
        return { ok: true, data: result.result, userID, status: 200 };
      } else {
        return { ok: false, data: result.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async updateUnreadStatus(userData, targetID) {
    try {
      let userID = userData.userID;
      let result = await Model.updateUnreadStatus(userID, targetID);
      if (result.ok) {
        return { ok: true, data: result.result, userID, status: 200 };
      } else {
        return { ok: false, data: result.mes, status: 500 };
      }
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }
}

module.exports = controller;
