const mongoose = require("mongoose");
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

mongoose
  .connect(envData.mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
  })
  .then(() => {
    console.log("Connect to MongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

const memberSchema = new mongoose.Schema({
  account: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  headImg: {
    type: String,
    default:
      "https://d1vscilbhjiukl.cloudfront.net/snapstory/post/1666857417.png",
  },
});

const PostSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  imageUrl: String,
  content: String,
  comments: [
    {
      userID: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
      content: String,
    },
  ],
  likes: [
    {
      userID: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
      username: String,
    },
  ],
});

const Member = mongoose.model("Member", memberSchema);
const Post = mongoose.model("Post", PostSchema);

class model {
  async signup(data) {
    if (data.account == "" || data.username == "" || data.password == "") {
      return { ok: false, mes: "帳號、用戶名稱、密碼皆不可空白", status: 400 };
    }
    let account = data.account;
    let username = data.username;
    let password = data.password;

    let result = await Member.findOne({ account: account }).then((data) => {
      if (data == null) {
        const member = new Member({
          account: account,
          username: username,
          password: password,
        });

        return member
          .save()
          .then(() => {
            console.log("have been saveed into DB");
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
  }

  async signin(data) {
    if (data.account == "" || data.password == "") {
      return { ok: false, mes: "帳號、密碼不可空白", status: 400 };
    }
    let account = data.account;
    let password = data.password;

    let result = await Member.findOne({
      $and: [{ account: account }, { password: password }],
    })
      .then((data) => {
        if (data != null) {
          return { ok: true, mes: "登入成功", data: data, status: 200 };
        } else {
          return { ok: false, mes: "帳號或密碼錯誤", status: 400 };
        }
      })
      .catch((error) => {
        console.log(error);
        return { ok: false, mes: error, status: 500 };
      });
    return result;
  }

  async uploadPost(userID, base64Img, message) {
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
    const post = new Post({
      userID: userID,
      imageUrl: imgUrl,
      content: message,
    });
    return await post
      .save()
      .then(() => {
        console.log("have been saveed into DB");
        return { ok: true, status: 200 };
      })
      .catch((e) => {
        console.log(e);
        return { ok: false, status: 500 };
      });
  }

  async getIndexData() {
    let result = await Post.find()
      .sort({ _id: -1 })
      .populate("userID")
      .populate("comments.userID")
      .exec();
    return result;
  }

  async likePost(username, userID, postID) {
    let result = Post.updateOne(
      { _id: postID },
      {
        $push: {
          likes: { userID: userID, username: username },
        },
      }
    )
      .then((mes) => {
        return { ok: true, mes: mes, status: 200 };
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
        return { ok: true, mes: mes, status: 200 };
      })
      .catch((err) => {
        return { ok: false, mes: err, status: 500 };
      });
    return result;
  }

  async checkUserLike(username, postID) {
    let result = Post.findOne({ _id: postID })
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
    return result;
  }

  async newComment(postID, userID, newComment) {
    try {
      let result = Post.updateOne(
        { _id: postID },
        {
          $push: {
            comments: {
              userID: userID,
              content: newComment,
            },
          },
        }
      ).then((mes) => {
        console.log(mes);
        if (mes.modifiedCount == 1) {
          return { ok: true, status: 200 };
        } else {
          return { ok: false, status: 500 };
        }
      });
      return result;
    } catch (error) {
      console.log(error);
      return { ok: false, status: 500, mes: error };
    }
  }
}

module.exports = model;

// Post.find()
//   .sort({ _id: -1 })
//   .populate("userID")
//   .populate({ path: "comments.userID", model: "Member" })
//   .then((mes) => {
//     console.log(mes);
//   });

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
