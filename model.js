const mongoose = require("mongoose");
require("dotenv").config();
let envData = process.env;
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
    }).then((data) => {
      if (data != null) {
        return { ok: true, mes: "登入成功", data: data, status: 200 };
      } else {
        return { ok: false, mes: "帳號或密碼錯誤", status: 400 };
      }
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
    await s3.upload({
      Bucket: "mywebsiteforwehelp",
      Key: `snapstory/post/${time}`,
      Body: imageBuffer,
      ContentEncoding: "base64",
      ContentType: `image/${imgType}`,
    });
    console.log("done");
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
}

module.exports = model;
