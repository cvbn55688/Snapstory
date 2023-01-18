const e = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
let envData = process.env;

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

const Member = mongoose.model("Member", memberSchema);

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
}

module.exports = model;
