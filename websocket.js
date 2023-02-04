const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8000 });
let clients = new Map();
// let clientId = 0;

function websocketStart() {
  server.on("connection", (socket) => {
    console.log("Client connected");

    // let data = { name: "August", blog: "Let's Write" };
    // setTimeout(function () {
    //   socket.send(JSON.stringify(data));
    // }, 3000);

    // const id = clientId++;

    // console.log(`Client connected with id ${id}`);
    let userId;
    socket.on("message", (message) => {
      let funcChoice = JSON.parse(message).fuc;
      let userName = JSON.parse(message).name;
      userId = JSON.parse(message).id;
      clients.set(userId, socket);
      if (funcChoice == 0) {
        console.log(`已設定${userName}的userID:${userId}`);
      } else {
        sendMessageToClient(
          funcChoice,
          JSON.parse(message).id,
          userName,
          JSON.parse(message).sendUserImg,
          JSON.parse(message).postImg,
          JSON.parse(message).message,
          JSON.parse(message).time,
          JSON.parse(message).targetId
        );
      }
    });

    socket.on("close", () => {
      console.log(`Client disconnected with id ${userId}`);
      clients.delete(userId);
    });

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
  toUserId
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
  };
  if (socket) {
    socket.send(JSON.stringify(data));
  } else {
    console.log(`Client with id ${toUserId} not found`);
  }
}

module.exports.start = websocketStart;
