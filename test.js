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
  headImg: {
    type: String,
    default:
      "https://d1vscilbhjiukl.cloudfront.net/snapstory/post/1666857417.png",
  },
});

const Member = mongoose.model("Member", memberSchema);

// Member.find().then((data) => {
//   console.log(data);
// });

// const member = new Member({
//   account: "ccc",
//   username: "ccc",
//   password: "ccc",
// });

// member
//   .save()
//   .then(() => {
//     console.log("have been saveed into DB");
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// Member.updateMany(
//   {},
//   {
//     headImg:
//       "https://d1vscilbhjiukl.cloudfront.net/snapstory/post/1666857417.png",
//   }
// ).then((mes) => {
//   console.log(mes);
// });

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

const Post = mongoose.model("Post", PostSchema);
// const post = new Post({
//   userID: "63c76d88d55533e391061346",
//   imageUrl:
//     "https://d1vscilbhjiukl.cloudfront.net/snapstory/post/1666857417.png",
//   content: "測試測試2",
//   comments: [
//     {
//       userID: "63c76db4a1c5e35742e4195d",
//       content: "留言測試2",
//     },
//   ],
// });

// post
//   .save()
//   .then(() => {
//     console.log("have been saveed into DB");
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// Post.updateOne(
//   { _id: "63c8a87602bd142311bee613" },
//   {
//     $push: {
//       comments: { userID: "63c76d88d55533e391061346", content: "qqqqqqq" },
//     },
//   }
// ).then((mes) => {
//   console.log(mes);
// });

// Post.updateOne(
//   { _id: "63c8a87602bd142311bee613" },
//   {
//     $set: {
//       comments: {
//         _id: "63c8b62eeb0bf5c1a97aebad",
//         userID: "63c76d88d55533e391061346",
//         content: "修改修改再修改",
//       },
//     },
//   }
// ).then((mes) => {
//   console.log(mes);
// });

// Post.updateOne(
//   { _id: "63c8a87602bd142311bee613" },
//   {
//     $pull: {
//       comments: { _id: "63c8b62eeb0bf5c1a97aebad" },
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

// Post.findOne({ _id: "63c8a87602bd142311bee613" }).then((data) => {
//   console.log(data);
// });

// Post.aggregate(
//   [
//     {
//       $lookup: {
//         from: "member",
//         localField: "userID",
//         foreignField: "_id",
//         as: "user",
//       },
//     },
//   ],
//   (err, res) => {
//     console.log(res);
//   }
// );
