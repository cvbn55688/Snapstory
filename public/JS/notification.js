const notificationUl = document.querySelector(".notification-ul");
const notificationLoading = document.querySelector(".notification-loading");
function createNotificationLi(
  func,
  likerHeadImg,
  likerID,
  likername,
  likernotificationMes,
  notificationTime,
  postImg,
  postID
) {
  let newNotificationLi = document.createElement("li");
  notificationUl.prepend(newNotificationLi);

  let newNotificationHeadImg = document.createElement("img");
  newNotificationHeadImg.src = likerHeadImg;
  newNotificationHeadImg.classList.add("notice-click");
  newNotificationLi.appendChild(newNotificationHeadImg);
  newNotificationHeadImg.addEventListener("mousedown", () => {
    rediectToPersonalPage(newNotificationHeadImg, likerID);
  });

  let newNotificationMesContainer = document.createElement("div");
  newNotificationMesContainer.classList.add("notification-mes-container");
  newNotificationMesContainer.classList.add("notice-click");
  newNotificationLi.appendChild(newNotificationMesContainer);

  let notificationMes;
  if (func == "comment") {
    notificationMes = "留言回應了:";
  } else if (func == "like") {
    notificationMes = "喜歡你的貼文!";
  } else if (func == "tag") {
    notificationMes = "在此貼文留言標記了你!";
  } else if (func == "follow") {
    notificationMes = "追隨了你!";
  } else if (func == "postTag") {
    notificationMes = "在此貼文標記了你!";
  }

  let newNotificationMesMain = document.createElement("p");
  newNotificationMesMain.classList.add("notification-message-main");
  newNotificationMesMain.classList.add("notice-click");
  newNotificationMesMain.textContent = likername + notificationMes;
  newNotificationMesContainer.appendChild(newNotificationMesMain);

  let newNotificationMesSecond = document.createElement("p");
  newNotificationMesSecond.classList.add("notification-message-second");
  newNotificationMesSecond.classList.add("notice-click");
  newNotificationMesSecond.textContent = likernotificationMes;
  newNotificationMesContainer.appendChild(newNotificationMesSecond);

  let newNotificationTime = document.createElement("span");
  newNotificationTime.classList.add("notification-time");
  newNotificationTime.classList.add("notice-click");
  newNotificationTime.textContent = timeDifference(notificationTime);
  newNotificationMesSecond.appendChild(newNotificationTime);

  let newNotificationImgContainer = document.createElement("div");
  newNotificationImgContainer.classList.add("notification-img-preview");
  newNotificationImgContainer.classList.add("notice-click");
  newNotificationLi.appendChild(newNotificationImgContainer);

  let newNotificationImg = document.createElement("img");
  if (func != "follow") {
    newNotificationImg.src = postImg[0];
    newNotificationImg.classList.add("notice-click");
    newNotificationImgContainer.appendChild(newNotificationImg);
    newNotificationLi.addEventListener("click", () => {
      createParticularPost(postID);
    });
  } else {
    newNotificationLi.classList.add("notice-click");
  }
}

function socketGetNotice() {
  socket.on("notice message", function (data) {
    let postImg;
    if (data.func != "follow") {
      postImg = [data.postImg];
    }

    createNotificationLi(
      data.func,
      data.senderImg,
      data.senderID,
      data.senderName,
      data.message,
      new Date().getTime(),
      postImg,
      data.postID
    );
    heartImg.src = "../image/heart5.png";
    notificationCount = 0;
    notificationNoData.style.display = "none";
  });
}

function getNotification() {
  fetch(`/getNotification`, {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.ok == true) {
        // console.log(data);
        data = data.data;
        notifications = data.notifications;
        if (data.status == "1") {
          heartImg.src = "../image/heart5.png";
        } else {
          notificationCount++;
        }
        if (notifications.length == 0) {
          notificationNoData.style.display = "flex";
        }
        notifications.forEach((notification) => {
          let imageUrl;
          let post;
          if (notification.func == "follow") {
            imageUrl = null;
            post = null;
          } else {
            try {
              imageUrl = notification.postID.imageUrl;
              post = notification.postID._id;
            } catch (err) {
              return;
            }
          }

          createNotificationLi(
            notification.func,
            notification.sendUserId.headImg,
            notification.sendUserId._id,
            notification.sendUserId.username,
            notification.notificationMessage,
            notification.time,
            imageUrl,
            post
          );
        });
        notificationLoading.style.display = "none";
      }
    });
}

function sendNotice(
  func,
  senderName,
  senderID,
  senderImg,
  sendMessage,
  notificationTime,
  targetUserID,
  postImg,
  postID
) {
  if (senderID == targetUserID) {
    return;
  }
  let postImgUrl;
  if (postImg != null || postImg != undefined) {
    postImgUrl = postImg[0];
  }

  let sendData = {
    func: func,
    senderName,
    senderImg,
    senderID,
    postImg: postImgUrl,
    message: sendMessage,
    time: notificationTime,
    targetUserID,
    postID,
  };
  socket.emit("notice message", sendData);

  fetch(`/uploadNotification`, {
    method: "POST",
    body: JSON.stringify({
      func,
      senderID,
      postImg: postImgUrl,
      message: sendMessage,
      time: notificationTime,
      targetID: targetUserID,
      postID,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //   console.log(data);
    });
}
