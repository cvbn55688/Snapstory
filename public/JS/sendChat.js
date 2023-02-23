const sendChatBlackScreen = document.querySelector(
  ".show-send-chat-blacksreen"
);
const sendChatClose = document.querySelector(".close-send-chat-button");
const sendChatTargetInput = document.querySelector(".send-chat-search input");
const sendChatSearchUl = document.querySelector(".send-chat-search-user");
const sendChatTargetUl = document.querySelector(".send-chat-to-user");
const sendCharSearchLoading = document.querySelector(".send-chat-loading");
const sendChatSearchPlease = document.querySelector(".send-chat-please");
const sendChatSearchNoData = document.querySelector(".send-chat-no-data");
const sendChatMessageInput = document.querySelector(".send-chat-meesage input");
const sendChatMessageSubmit = document.querySelector(".chat-send");
const sendChatMessageLoading = document.querySelector(".chat-loading");
const chatUnreadMessage = document.querySelector(".unread-message");
const socket = io();
let sharePostData;
let unread = 0;

function getUnreadMessage() {
  fetch(`/getUnreadMessage`, {
    method: "GET",
  })
    .then(function (response) {
      if (response.status == 400) {
        location.href = "/login";
        return;
      }
      return response.json();
    })
    .then(function (data) {
      let userID = data.userID;
      data = data.data;
      data.forEach((messageData) => {
        messageData.messages.forEach((contentData) => {
          if (contentData.receiver == userID && contentData.read == false) {
            console.log(contentData);
            unread++;
          }
        });
      });
      if (unread != 0) {
        chatUnreadMessage.textContent = unread;
        chatUnreadMessage.style.display = "block";
      }
    });
}

function listenPrivateMessage() {
  if (location.pathname != "/inbox") {
    socket.on("private message", (data) => {
      console.log(data);
    });
  }
}

function openSendChatTable(target) {
  sendChatBlackScreen.style.display = "flex";
  sendChatClose.addEventListener("click", () => {
    sendChatBlackScreen.style.display = "none";
    sharePostData;
  });
  if (target != null) {
    createSencChatTarget(target);
  }
}

function searchChatUser() {
  sendChatTargetInput.addEventListener("input", () => {
    sendCharSearchLoading.style.display = "block";
    sendChatSearchPlease.style.display = "none";
    sendChatSearchNoData.style.display = "none";
    let sendChatSearchLi = document.querySelectorAll(
      ".send-chat-search-user li"
    );
    sendChatSearchLi.forEach((li) => {
      li.remove();
    });
  });
  sendChatTargetInput.addEventListener(
    "input",
    debounce(() => {
      if (sendChatTargetInput.value != "") {
        searchUser(sendChatTargetInput.value).then((data) => {
          let userDatas = data.data;
          if (userDatas.length == 0) {
            sendChatSearchNoData.style.display = "block";
          } else {
            createChatSearchLi(userDatas);
          }
        });
      } else {
        sendChatSearchPlease.style.display = "block";
      }
      sendCharSearchLoading.style.display = "none";
    }, 1000)
  );
}

function createChatSearchLi(userDatas) {
  userDatas.forEach((userData) => {
    let newChatSearchLi = document.createElement("li");
    sendChatSearchUl.appendChild(newChatSearchLi);

    let newChatSearchImg = document.createElement("img");
    newChatSearchImg.src = userData.headImg;
    newChatSearchLi.appendChild(newChatSearchImg);

    let newChatSearchName = document.createElement("span");
    newChatSearchName.textContent = userData.username;
    newChatSearchLi.appendChild(newChatSearchName);

    newChatSearchLi.addEventListener("click", () => {
      createSencChatTarget(userData);
    });
  });
}

function createSencChatTarget(userData) {
  let newTargetLi = document.createElement("li");
  newTargetLi.id = userData._id;
  sendChatTargetUl.appendChild(newTargetLi);

  let newTargetName = document.createElement("p");
  newTargetName.textContent = userData.username;
  newTargetLi.appendChild(newTargetName);

  let newTargetClose = document.createElement("img");
  newTargetClose.src = "/image/close2.png";
  newTargetLi.appendChild(newTargetClose);

  newTargetClose.addEventListener("click", () => {
    newTargetLi.remove();
  });
}

async function uploadChatData(targetID, message, isPost) {
  return fetch(`/uploadChatData`, {
    method: "POST",
    body: JSON.stringify({
      targetID,
      message,
      isPost,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });
}

function sendChatMessage(sharePostData) {
  let targetsLi = sendChatTargetUl.childNodes;
  let submitValue = sendChatMessageInput.value;
  console.log(sharePostData);
  if (submitValue == "" && sharePostData == undefined) {
    alert("請輸入要傳送的訊息");
  } else if (targetsLi.length != 0) {
    targetsLi.forEach((li) => {
      let targetID = li.id;
      if (sharePostData != undefined) {
        socket.emit("private message", {
          targetID,
          message: sharePostData,
          mestype: "post",
        });
        uploadChatData(targetID, JSON.stringify(sharePostData), true).then(
          (data) => {
            if (data.ok) {
              li.remove();
            } else {
              alert("傳送失敗!請再試一次");
              location.reload();
            }
          }
        );
      }

      if (submitValue != "") {
        socket.emit("private message", {
          targetID,
          message: submitValue,
          mestype: "text",
        });
        uploadChatData(targetID, submitValue, false).then((data) => {
          if (data.ok) {
            li.remove();
          } else {
            alert("傳送失敗!請再試一次");
            location.reload();
          }
        });
      }
    });
    alert("傳送成功!!");
    sendChatMessageInput.value = "";
    sendChatBlackScreen.style.display = "none";
    sendChatMessageLoading.style.display = "none";
    sendChatMessageSubmit.style.display = "block";
    if ((location.pathname = "/innbox")) {
      location.reload();
    }
  } else {
    alert("請選擇至少一位用戶");
  }
}

function sharePost(postData) {
  openSendChatTable();
  sharePostData = postData;
}

sendChatMessageSubmit.addEventListener("click", () => {
  console.log(sharePostData);
  sendChatMessageLoading.style.display = "block";
  sendChatMessageSubmit.style.display = "none";
  if (sharePostData != undefined) {
    sendChatMessage(sharePostData);
  } else {
    sendChatMessage();
  }
  //
});

// sendChatMessageInput.addEventListener("keypress", (eve) => {
//   if (eve.key == "Enter") {
//     console.log(sharePostData);

// sendChatMessage();
// }
// });

searchChatUser();
listenPrivateMessage();
getUnreadMessage();
