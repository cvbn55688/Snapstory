const io = require("socket.io");
// const socketServer = io(server);
let onlineUsers = new Map();

function socketIOserver(server) {
  const socketServer = io(server);
  socketServer.on("connection", function (socket) {
    let userID;
    /*監聽登入事件*/
    socket.on("join", function (data) {
      userID = data.userID;
      console.log(userID + " connected");
      onlineUsers.set(userID, socket);
      socket.emit("connectionSuccess", {
        success: true,
        message: "歡迎加入！連線成功",
        ID: userID,
      });
    });

    socket.on("private message", function (data) {
      const targetSocket = onlineUsers.get(data.targetID);
      if (targetSocket) {
        targetSocket.emit("private message", {
          from: userID,
          mes: data.message,
        });
      }
      // console.log("setsetest");
    });

    // socket.on("private message", ({ to, message }) => {
    //   const targetSocket = onlineUsers[to];
    //   if (targetSocket) {
    //     targetSocket.emit("private message", {
    //       from: socket.username,
    //       message,
    //     });
    //   }
    // });

    socket.on("disconnect", () => {
      // console.log("user disconnected");
      // const userID = socket.userID;
      // console.log(onlineUsers.get(userID));
      if (userID) {
        onlineUsers.delete(userID);
        console.log(userID + " disconnected");
      }
    });
  });
}

module.exports.start = socketIOserver;
