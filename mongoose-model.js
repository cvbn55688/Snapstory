// const mongoose = require("mongoose");
// require("dotenv").config();
// let envData = process.env;

// mongoose
//   .connect(envData.mongodbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     maxPoolSize: 10,
//   })
//   .then(() => {
//     console.log("Connect to MongoDB");
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// const memberSchema = new mongoose.Schema({
//   account: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });

// const Member = mongoose.model("Member", memberSchema);

// module.exports = commentModel;
