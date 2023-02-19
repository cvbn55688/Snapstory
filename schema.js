const mongoose = require("mongoose");
require("dotenv").config();
const envData = process.env;

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
      "https://d1vscilbhjiukl.cloudfront.net/snapstory/profile_picture/user.png",
  },
  profile: String,
  fans: [
    {
      userID: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    },
  ],

  following: [
    {
      userID: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    },
  ],
});

const PostSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  imageUrl: [String],
  content: String,
  time: String,
  comments: [
    {
      userID: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
      content: String,
      time: String,
    },
  ],
  likes: [
    {
      userID: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
      username: String,
      headImg: String,
    },
  ],
  hashtags: [String],
});

const NotificationSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  status: String,
  notifications: [
    {
      func: String,
      sendUserId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
      notificationMessage: String,
      time: String,
      postImg: String,
      postID: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    },
  ],
});

const TagsSchema = new mongoose.Schema({
  tagName: String,
  posts: [
    {
      postID: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    },
  ],
});

const Member = mongoose.model("Member", memberSchema);
const Post = mongoose.model("Post", PostSchema);
const Notification = mongoose.model("Notification", NotificationSchema);
const Tag = mongoose.model("Tag", TagsSchema);

module.exports = {
  Member,
  Post,
  Notification,
  Tag,
};
