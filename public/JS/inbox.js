const chatInputDiv = document.querySelector(".submit-caht");
const chatInput = document.querySelector(".submit-caht input");
const chatInputSubmit = document.querySelector(".submit-caht img");
const chatMainZone = document.querySelector(".chat-main-zone ul");
const chatSelectUl = document.querySelector(".chat-select ul");
const chatNoData = document.querySelector(".chat-select p");
const chatTargetImg = document.querySelector(".chat-target-name img");
const chatTargetName = document.querySelector(".chat-target-name p");
const newSendChat = document.querySelector(".new-send-chat");
const newSendChatButton = document.querySelector(".new-send-chat-button");
const newSendChatButtonImg = document.querySelector(".user-inbox-name img");
const userInboxName = document.querySelector(".user-inbox-name p");
let chatTargetID;
let targetInRoom = false;
let nowUserID;
let joinRoom;
let chatPage = 0;
let oldestChatID;

newSendChatButton.addEventListener("click", () => {
  openSendChatTable();
});
newSendChatButtonImg.addEventListener("click", () => {
  openSendChatTable();
});

socket.on("both in room", (data) => {
  if (data.both == true) {
    targetInRoom = true;
  } else {
    targetInRoom = false;
  }
});

function socketJoinRoom(room, isJoin) {
  let func;

  if (isJoin == true) {
    func = "join room";
    // console.log(room, "join");
  } else {
    func = "leave room";
    // console.log(room, "leave");
  }
  socket.emit(func, {
    room,
  });
}

function getChatMember() {
  fetch(`/api/chat/members`, {
    method: "get",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.ok) {
        let userData = data.userData;
        let chatMembers = data.data;
        nowUserID = userData.userID;
        userInboxName.textContent = userData.name;
        if (chatMembers == null) {
          chatNoData.style.display = "block";
        }
        createChatSelectLi(chatMembers, userData.userID);
        // listenPrivateMessageInbox();

        socket.on("private message", (data) => {
          if (data.from == chatTargetID) {
            createChatLi(data.mes, "chat-target", data.mesType);
            changeLiSort("inside", data.from);
          } else {
            changeLiSort("receive", data.from);
          }
        });
        submitChat();
      }
    });
}

function changeLiSort(func, targetID) {
  let targetUserLi = document.getElementById(targetID);
  let targetUserUnreadCount = targetUserLi.querySelector(".chat-select-unread");
  if (func == "receive") {
    targetUserUnreadCount.textContent =
      Number(targetUserUnreadCount.textContent) + 1;
    targetUserUnreadCount.style.display = "block";
    chatUnreadMessage.style.display = "block";
    chatUnreadMessage.textContent = Number(chatUnreadMessage.textContent) + 1;
  }

  chatSelectUl.prepend(targetUserLi);
}

function submitChat() {
  chatInputSubmit.addEventListener("click", () => {
    sendChat(nowUserID, chatTargetID, chatInput.value);
    chatInput.value = "";
  });
  chatInput.addEventListener("keypress", (eve) => {
    if (eve.key == "Enter") {
      sendChat(nowUserID, chatTargetID, chatInput.value);
      chatInput.value = "";
    }
  });
}

function getChatData(targetID) {
  fetch(
    `/api/chat/room/${targetID}?page=${chatPage}&oldestChatID=${oldestChatID}`,
    {
      method: "get",
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let chatDatas = data.data.messages;

      createHistoryChatLi(chatDatas, targetID);
      chatMainZone.scrollTop = chatMainZone.scrollHeight;
      oldestChatID = chatDatas[0]._id;
      chatPage = data.nextPage;
    });
}

function chatDataInfinity() {
  chatMainZone.addEventListener("scroll", () => {
    if (chatMainZone.scrollTop == 0 && chatMainZone.scrollHeight > 475) {
      if (chatPage != null) {
        getChatData(chatTargetID);
      }
    }
  });
}

function createChatSelectLi(chatMembers, userID) {
  chatMembers.forEach((chatMember) => {
    let chatTarget;
    if (chatMember.members[0]._id != userID) {
      chatTarget = chatMember.members[0];
    } else {
      chatTarget = chatMember.members[1];
    }

    let newChatLi = document.createElement("li");
    newChatLi.classList.add("chat-select-target");
    newChatLi.id = chatTarget._id;
    chatSelectUl.appendChild(newChatLi);

    let newChatTargetHead = document.createElement("img");
    newChatTargetHead.src = chatTarget.headImg + vTime;
    newChatLi.setAttribute("hold", "false");
    newChatLi.appendChild(newChatTargetHead);

    let newChatTargetName = document.createElement("p");
    newChatTargetName.textContent = chatTarget.username;
    newChatLi.appendChild(newChatTargetName);

    let newUnreadMessage;
    let newUnreadCount = 0;

    chatMember.messages.forEach((contentData) => {
      if (contentData.receiver == userID) {
        newUnreadCount++;
      }
    });
    newUnreadMessage = document.createElement("p");
    newUnreadMessage.classList.add("chat-select-unread");

    newUnreadMessage.textContent = newUnreadCount;
    newChatLi.appendChild(newUnreadMessage);
    if (newUnreadCount != 0) {
      newUnreadMessage.style.display = "block";
    }

    newChatLi.addEventListener("click", () => {
      if (newChatLi.getAttribute("hold") == "false") {
        let holdingLi = document.querySelector("li[hold='true']");
        if (holdingLi != null) {
          holdingLi.setAttribute("hold", "false");
        }
        newChatLi.setAttribute("hold", "true");
        chatTargetImg.style.display = "block";
        chatInputDiv.style.display = "flex";
        newSendChat.style.display = "none";
        chatUnreadMessage.textContent =
          Number(chatUnreadMessage.textContent) -
          Number(newUnreadMessage.textContent);
        newUnreadMessage.textContent = 0;
        newUnreadMessage.style.display = "none";
        if (chatUnreadMessage.textContent == 0) {
          chatUnreadMessage.style.display = "none";
        }
        chatTargetImg.src = chatTarget.headImg + vTime;
        chatTargetName.textContent = chatTarget.username;
        chatTargetID = chatTarget._id;
        if (joinRoom != undefined) {
          socketJoinRoom(joinRoom, false);
        }
        joinRoom = chatMember._id;
        chatPage = 0;
        oldestChatID;
        socketJoinRoom(joinRoom, true);
        getChatData(chatTargetID);
        updateUnreadStatus(chatTargetID);
        rediectToPersonalPage(chatTargetImg, chatTargetID);
        rediectToPersonalPage(chatTargetName, chatTargetID);
        let chatLi = document.querySelectorAll(".chat-main-zone ul li");
        chatLi.forEach((li) => {
          li.remove();
        });
      }
    });
  });
}

function updateUnreadStatus(targetID) {
  fetch(`/api/chat/unread`, {
    method: "PUT",
    body: JSON.stringify({
      targetID,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
    });
}

function createChatLi(message, className, mesType) {
  if (mesType != "post") {
    let newChatLi = document.createElement("li");
    newChatLi.classList.add(className);
    chatMainZone.appendChild(newChatLi);

    let newChatP = document.createElement("p");
    newChatP.textContent = message;
    newChatLi.appendChild(newChatP);
  } else {
    if (typeof message == "string") {
      message = JSON.parse(message);
    }

    let newChatLi = document.createElement("li");
    newChatLi.classList.add(className);
    newChatLi.classList.add("share-post");
    chatMainZone.appendChild(newChatLi);

    let newSharePostContainer = document.createElement("div");
    newSharePostContainer.classList.add("share-post-mes-container");
    newChatLi.appendChild(newSharePostContainer);

    let newShareUser = document.createElement("div");
    newShareUser.classList.add("share-user");
    newSharePostContainer.appendChild(newShareUser);

    let newShareUserHead = document.createElement("img");
    newShareUserHead.src = message.poster.headerImg + vTime;
    newShareUser.appendChild(newShareUserHead);

    let newShareUserName = document.createElement("p");
    newShareUserName.textContent = message.poster.userName;
    newShareUser.appendChild(newShareUserName);

    let newSharePostImg = document.createElement("img");
    newSharePostImg.src = message.postImg;
    newSharePostContainer.appendChild(newSharePostImg);

    let newShareClick = document.createElement("div");
    newShareClick.classList.add("share-click-text");
    newSharePostContainer.appendChild(newShareClick);

    let newShareP = document.createElement("p");
    newShareP.textContent = "點擊檢視文章";
    newShareP.classList.add("share-click");
    newShareClick.appendChild(newShareP);

    newSharePostContainer.addEventListener("click", () => {
      createParticularPost(message.postID);
    });
  }

  // chatMainZone.scrollTop = chatMainZone.scrollHeight;
}

function sendChat(userID, targetID, message) {
  if (message != "") {
    socket.emit("private message", {
      userID,
      targetID,
      message,
    });
    createChatLi(message, "chat-user", "text");
    uploadChatData(targetID, message, false, targetInRoom);
    changeLiSort("send", targetID);
  }
}

function createHistoryChatLi(chatDatas, targetID) {
  chatDatas.forEach((chatData) => {
    let senderID = chatData.sender._id;
    let mesType = chatData.mesType;
    if (senderID == targetID) {
      createChatLi(chatData.content, "chat-target", mesType);
    } else {
      createChatLi(chatData.content, "chat-user", mesType);
    }
  });
}

getChatMember();
chatDataInfinity();
