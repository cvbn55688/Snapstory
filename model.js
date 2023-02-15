require("dotenv").config();
const envData = process.env;
const cloudFront = envData.cloudFront;
const aws_access_key_id = envData.aws_access_key_id;
const aws_secret_access_key = envData.aws_secret_access_key;
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: aws_access_key_id,
  secretAccessKey: aws_secret_access_key,
});
const { Member, Post, Notification, Tag } = require("./schema.js");

class model {
  async signup(data) {
    if (data.account == "" || data.username == "" || data.password == "") {
      return { ok: false, mes: "帳號、用戶名稱、密碼皆不可空白", status: 400 };
    }
    let account = data.account;
    let username = data.username;
    let password = data.password;

    try {
      let result = await Member.findOne({ account: account }).then((data) => {
        if (data == null) {
          const member = new Member({
            account: account,
            username: username,
            password: password,
          });

          return member
            .save()
            .then((mes) => {
              console.log("have been saveed into DB");
              let notification = new Notification({
                userID: mes._id,
                status: "0",
                notifications: [],
              });
              notification.save().then((mes) => {
                console.log(mes);
              });
              return { ok: true, mes: "註冊成功", status: 200 };
            })
            .catch((e) => {
              console.log(e);
              return { ok: false, mes: e, status: 500 };
            });
        } else {
          return { ok: false, mes: "此帳號已被註冊", status: 400 };
        }
      });
      console.log(result);
      return result;
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async signin(account, password) {
    let result = await Member.findOne({
      $and: [{ account: account }, { password: password }],
    })
      .then((data) => {
        if (data != null) {
          return { ok: true, status: 200, mes: "登入成功", data };
        } else {
          return { ok: false, status: 400, mes: "帳號或密碼錯誤" };
        }
      })
      .catch((error) => {
        console.log(error);
        return { ok: false, status: 500, mes: error };
      });
    return result;
  }

  async uploadPost(userID, imagesArr, message, hashtagArr) {
    try {
      let imageUrlArr = [];
      async function uploadS3(base64ImgArr) {
        for (let base64Img of base64ImgArr) {
          let time = new Date().getTime();
          let imageData = base64Img;
          let imgType = base64Img.split(";")[0].split("/")[1];
          let imageBuffer = Buffer.from(
            imageData.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );
          await s3.upload(
            {
              Bucket: "mywebsiteforwehelp",
              Key: `snapstory/post/${time}`,
              Body: imageBuffer,
              ContentEncoding: "base64",
              ContentType: `image/${imgType}`,
            },
            (error, data) => {
              if (error) {
                console.log(error);
              }
            }
          );
          let imgUrl = `https://${cloudFront}/snapstory/post/${time}`;
          imageUrlArr.push(imgUrl);
        }
      }
      await uploadS3(imagesArr);

      const post = new Post({
        userID: userID,
        imageUrl: imageUrlArr,
        time: new Date(),
        content: message,
        hashtags: hashtagArr,
      });
      return await post
        .save()
        .then((data) => {
          console.log("have been saveed into DB");
          console.log(data);
          return { ok: true, status: 200, data };
        })
        .catch((e) => {
          console.log(e);
          return { ok: false, mes: e, status: 500 };
        });
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async uploadHashtag(hashtagName, postID) {
    try {
      let result = await Tag.updateOne(
        { tagName: hashtagName },
        { $push: { posts: { postID: postID } } },
        { upsert: true }
      ).exec();
      return { ok: true, status: 200, result };
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async getIndexData(page) {
    try {
      let nextPage;
      let result = await Post.find()
        .sort({ _id: -1 })
        .skip(6 * Number(page))
        .limit(7)
        .populate({ path: "userID", select: "-password" })
        .populate({ path: "comments.userID", select: "-password" })
        .populate({ path: "likes.userID", select: "-password" })
        .exec();
      if (result.length == 7) {
        nextPage = Number(page) + 1;
        result.pop();
      } else {
        nextPage = null;
      }
      return { ok: true, nextPage, result };
    } catch (error) {
      return { ok: false, mes: error };
    }
  }

  async getParticularPost(postID) {
    try {
      let result = await Post.findOne({ _id: postID })
        .populate({ path: "userID", select: "-password" })
        .populate({ path: "comments.userID", select: "-password" })
        .populate({ path: "likes.userID", select: "-password" })
        .exec();
      return { ok: true, result };
    } catch (error) {
      return { ok: false, mes: error, status: 500 };
    }
  }

  async likePost(username, userID, postID, userHeadImg) {
    let result = Post.findOneAndUpdate(
      { _id: postID },
      {
        $push: {
          likes: { userID, username, headImg: userHeadImg },
        },
      }
    )
      .populate("likes.userID")
      .then((mes) => {
        return { ok: true, mes, status: 200 };
      })
      .catch((err) => {
        return { ok: false, mes: err, status: 500 };
      });
    return result;
  }

  async dislikePost(username, userID, postID) {
    let result = Post.updateOne(
      { _id: postID },
      {
        $pull: {
          likes: { userID: userID },
        },
      }
    )
      .then((mes) => {
        return { ok: true, mes, status: 200 };
      })
      .catch((err) => {
        return { ok: false, mes: err, status: 500 };
      });
    return result;
  }

  async checkUserLike(username, postID) {
    try {
      let result = await Post.findOne({ _id: postID })
        .select({
          likes: {
            $elemMatch: {
              username: username,
            },
          },
        })
        .then((mes) => {
          return mes.likes.length;
        });
      return { ok: true, result };
    } catch (error) {
      return { ok: false, mes: error };
    }
  }

  async newComment(postID, userID, newComment) {
    try {
      let time = new Date();
      let result = Post.findOneAndUpdate(
        { _id: postID },
        {
          $push: {
            comments: {
              userID: userID,
              content: newComment,
              time,
            },
          },
        },
        { new: true }
      ).then((mes) => {
        console.log(mes);
        return { ok: true, status: 200, mes };
      });
      return result;
    } catch (error) {
      console.log(error);
      return { ok: false, status: 500, mes: error };
    }
  }

  async updateComment(userID, postID, updateCommentID, updateComment) {
    try {
      let time = new Date();
      let result = await Post.updateOne(
        {
          _id: postID,
          "comments._id": updateCommentID,
        },
        { $set: { "comments.$.content": updateComment } }
      ).then((mes) => {
        return { ok: true, status: 200, mes };
      });
      return result;
    } catch (error) {
      console.log(error);
      return { ok: false, status: 500, mes: error };
    }
  }

  async deleteComment(postID, updateCommentID) {
    try {
      let time = new Date();
      let result = await Post.updateOne(
        { _id: postID },
        {
          $pull: {
            comments: { _id: updateCommentID },
          },
        }
      ).then((mes) => {
        return { ok: true, status: 200, mes };
      });
      return result;
    } catch (error) {
      console.log(error);
      return { ok: false, status: 500, mes: error };
    }
  }

  async getUserPost(userID, fanId) {
    try {
      let user = await Member.findOne({ _id: userID })
        .populate("fans.userID")
        .populate("following.userID")
        .exec();
      let posts = await Post.find({ userID: user._id })
        .sort({ _id: -1 })
        // .limit(12)
        .populate("comments.userID")
        .exec();
      let isMatchFan = await Member.findOne({
        _id: user._id,
      }).then((member) => {
        let matchingFan = member.fans.filter((fan) => {
          return fan.userID == fanId;
        });
        return matchingFan;
      });
      if (isMatchFan.length == 1) {
        isMatchFan = true;
      }
      return { ok: true, posts, user, isMatchFan };
    } catch (error) {
      console.log(error);
      return { ok: false, status: 500, mes: error };
    }
  }

  async getTagsPost(tagsname) {
    try {
      let posts = await Tag.findOne({ tagName: tagsname })
        .populate("posts.postID")
        .exec();
      return { ok: true, posts };
    } catch (error) {
      return { ok: false, mes: error };
    }
  }

  async followFans(fan, followedUser) {
    try {
      let pushFans = await Member.findOneAndUpdate(
        { _id: followedUser },
        {
          $push: {
            fans: { userID: fan },
          },
        }
      ).exec();

      let pushFollower = await Member.findOneAndUpdate(
        { _id: fan },
        {
          $push: {
            following: { userID: followedUser },
          },
        }
      ).exec();
      return { ok: true, data: { pushFans, pushFollower } };
    } catch (error) {
      console.log(error);
      return { ok: false, status: 500, mes: error };
    }
  }

  async unfollowFans(fan, unfollowedUser) {
    try {
      let pullFans = await Member.findOneAndUpdate(
        { _id: unfollowedUser },
        {
          $pull: {
            fans: { userID: fan },
          },
        }
      ).exec();

      let pullFollower = await Member.findOneAndUpdate(
        { _id: fan },
        {
          $pull: {
            following: { userID: unfollowedUser },
          },
        }
      ).exec();
      return { ok: true, data: pullFans };
    } catch (error) {
      console.log(error);
      return { ok: false, status: 500, mes: error };
    }
  }

  async userSeacher(searchValue) {
    try {
      let result = await Member.find(
        {
          username: { $regex: searchValue },
        },
        { password: 0 }
      ).exec();
      return { ok: true, result };
    } catch (error) {
      return { ok: false, status: 500, mes: error };
    }
  }

  async tagSeacher(searchValue) {
    try {
      let result = await Tag.find({ tagName: { $regex: searchValue } })
        .populate("posts.postID")
        .exec();
      return { ok: true, result };
    } catch (error) {
      return { ok: false, status: 500, mes: error };
    }
  }

  async uploadNotification(notificationData) {
    try {
      let time = new Date().getTime();
      let notification = await Notification.updateOne(
        { userID: notificationData.targetId },
        {
          $set: { status: "1" },
          $push: {
            notifications: {
              func: notificationData.fuc,
              sendUserId: notificationData.sendUserId,
              notificationMessage: notificationData.message,
              time: time,
              postImg: notificationData.postImg,
              postID: notificationData.postID,
            },
          },
        }
      ).exec();
      return { ok: true, status: 200, mes: "upload success" };
    } catch (error) {
      return { ok: false, status: 500, mes: error };
    }
  }

  async getNotification(userID) {
    try {
      let result = await Notification.findOne({
        userID: userID,
      })
        .populate({ path: "notifications.sendUserId", select: "-password" })
        .populate("notifications.postID")
        .exec();
      if (result.notifications.length == 20) {
        Notification.updateOne(
          { userID: userID },
          {
            $pop: { notifications: -1 },
          }
        ).then((mes) => {
          console.log(mes);
        });
      }
      return { ok: true, result };
    } catch (error) {
      return { ok: false, mes: error };
    }
  }

  async changeNotificationStatus(userID) {
    try {
      let result = await Notification.updateOne(
        {
          userID: userID,
        },
        { status: "0" }
      ).exec();
      console.log(result);
      return { ok: true, result };
    } catch (error) {
      console.log(error);
      return { ok: false, mes: error };
    }
  }
}

module.exports = model;
let time = new Date();
// Post.findOne(
//   { _id: "63e98c88325041fd6d7cccfa" },
//   {
//     $set: {
//       comments: {
//         _id: "63eb5b699715db9de409f0e4",
//         userID: "63c76d88d55533e391061346",
//         content: "修改後留言part22",
//         time,
//       },
//     },
//   }
// ).then((mes) => {
//   console.log(mes);
// });

// Post.find({ _id: "63df3b6883f9f1265b5fc875" }).then((posts) => {
//   console.log(posts);
// });

// Tag.updateOne(
//   { tagName: "anime" },
//   { $push: { posts: { postID: "63cae12e8d7e4f7cf4d273b3" } } },
//   { upsert: true }
// ).then((res) => {
//   console.log(res);
// });

// Tag.findOne({ tagName: "anime" })
//   .populate("posts.postID")
//   .then((data) => {
//     console.log(data.posts[0]);
//   });

// Notification.updateOne(
//   { userID: "63ceb9f42bcaf0a79ea85c58" },
//   {
//     $pop: { notifications: -1 },
//   }
// ).then((mes) => {
//   console.log(mes);
// });

// Notification.find().then((mes) => {
//   mes.forEach((notice) => {
//     console.log(notice);
//     notice.notifications = [];
//     notice.save();
//   });
// });

// Member.find({ _id: "63ceb9f42bcaf0a79ea85c58" }).populate("fans.userID").exec();

// Member.findOne({ _id: "63c76db4a1c5e35742e4195d" }).then((mes) => {
//   console.log(mes);
// });

// Member.updateOne(
//   { _id: "63c76d88d55533e391061346" },
//   {
//     $push: {
//       fans: { userID: "63ceb9f42bcaf0a79ea85c58" },
//     },
//   }
// ).then((mes) => {
//   console.log(mes);
// });

// Post.findOne({ _id: "63c8a87602bd142311bee613" })
//   .populate("comments.userID")
//   .exec((err, post) => {
//     console.log(post.comments);
//   });

// Post.updateOne(
//   { _id: "63c8a87602bd142311bee613" },
//   {
//     $set: {
//       comments: {
//         _id: "63c8b62eeb0bf5c1a97aebad",
//         userID: "63c76d88d55533e391061346",
//         content: "修改後留言",
//       },
//     },
//   }
// ).then((mes) => {
//   console.log(mes);
// });

// Post.updateOne(
//   { _id: "63d72503ed783de92a834985" },
//   {
//     $set: { time: "Thu Jan 29 2023 21:34:03 GMT+0800 (台北標準時間)" },
//   }
// ).exec();
