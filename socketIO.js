const io = require("socket.io");
let onlineUsers = new Map();

function socketIOserver(server) {
  const socketServer = io(server);
  socketServer.on("connection", function (socket) {
    let userID;
    /*監聽登入事件*/
    socket.on("join web", function (data) {
      userID = data.userID;
      console.log(data.username + " connected socket io");
      onlineUsers.set(userID, socket);
      socket.emit("connectionSuccess", {
        success: true,
        message: "歡迎加入！連線成功",
        ID: userID,
      });
    });

    socket.on("private message", function (data) {
      try {
        const targetSocket = onlineUsers.get(data.targetID);
        if (targetSocket) {
          targetSocket.emit("private message", {
            from: userID,
            mes: data.message,
            mesType: data.mesType,
          });
        }
      } catch (err) {
        console.log(`notice error: `, err);
      }
    });

    socket.on("join room", function (room) {
      room = room.room;
      console.log(`User ${userID} joined room ${room}`);
      socket.join(room);
      console.log(socketServer.sockets.adapter.rooms[room]);
      let roomUsers = socketServer.sockets.adapter.rooms[room].length;

      if (roomUsers == 2) {
        socketServer.in(room).emit("both in room", { both: true });
      }
    });

    socket.on("leave room", function (room) {
      room = room.room;
      console.log(`User ${userID} left room ${room}`);
      socketServer.in(room).emit("both in room", { both: false });
      socket.leave(room);
    });

    socket.on("notice message", function (data) {
      console.log(data, "in io");
      noticeMessage(data);
    });

    socket.on("disconnect", () => {
      if (userID) {
        onlineUsers.delete(userID);
        console.log(userID + " disconnected");
      }
    });
  });
}

function noticeMessage(data) {
  console.log(data, "in ioioioio");
  let targetSocket = onlineUsers.get(data.targetUserID);
  if (targetSocket) {
    targetSocket.emit("notice message", data);
  } else {
    console.log(`Client with id ${data.targetUserID} not found`);
  }
}

module.exports.start = socketIOserver;
