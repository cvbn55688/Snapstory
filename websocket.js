const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8000 });
let clients = new Map();
// let clientId = 0;

function heartbeat() {
  this.isAlive = true;
}

function websocketStart() {
  server.on("connection", (socket) => {
    // console.log("Client connected");
    let userId;
    socket.on("message", (message) => {
      let funcChoice = JSON.parse(message).fuc;
      let userName = JSON.parse(message).name;
      userId = JSON.parse(message).id;
      clients.set(userId, socket);
      if (funcChoice == 0) {
        // console.log(`已設定${userName}的userID:${userId}`);
      } else {
        sendMessageToClient(
          funcChoice,
          JSON.parse(message).id,
          userName,
          JSON.parse(message).sendUserImg,
          JSON.parse(message).postImg,
          JSON.parse(message).message,
          JSON.parse(message).time,
          JSON.parse(message).targetId,
          JSON.parse(message).postID
        );
      }
    });

    socket.on("pong", heartbeat);

    socket.on("close", () => {
      // console.log(`Client disconnected with id ${userId}`);
      clients.delete(userId);
    });

    const interval = setInterval(() => {
      server.clients.forEach((socket) => {
        if (socket.isAlive == false) {
          // console.log(`Client disconnected with id ${userId}`);
          clients.delete(userId);
          return socket.terminate();
        }
        socket.isAlive = false;
        socket.ping();
      });
    }, 30000); // 每 30 秒發送一次心跳訊息

    //   let clients = server.clients;
    // console.log(clients, "asdasdasdasdasdasdasd====");
    // socket.on("message", function incoming(message) {
    //   console.log(JSON.parse(message));
    //   socket.send(JSON.stringify("已收到訊息")); //這個會回傳給使用者本人
    //   clients.forEach((client) => {
    //     client.send(JSON.stringify("已收到訊息")); //這會回傳給所有使用者
    //   });
    // });

    // socket.on("close", () => {
    //   console.log(`Client disconnected `);
    // });
  });
}

function sendMessageToClient(
  funcChoice,
  senderId,
  sendername,
  senderImg,
  postImg,
  message,
  time,
  toUserId,
  postID
) {
  const socket = clients.get(toUserId);
  let data = {
    funcChoice,
    senderId,
    sendername,
    senderImg,
    postImg,
    message,
    time,
    postID,
  };
  if (socket) {
    socket.send(JSON.stringify(data));
  } else {
    console.log(`Client with id ${toUserId} not found`);
  }
}

module.exports.start = websocketStart;
