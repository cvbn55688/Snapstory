// function createNotificationLi(
//     func,
//     likerHeadImg,
//     likername,
//     likernotificationMes,
//     notificationTime,
//     postImg
//   ) {
//     let newNotificationLi = document.createElement("li");
//     notificationUl.prepend(newNotificationLi);

//     let newNotificationHeadImg = document.createElement("img");
//     newNotificationHeadImg.src = likerHeadImg;
//     newNotificationLi.appendChild(newNotificationHeadImg);

//     let newNotificationMesContainer = document.createElement("div");
//     newNotificationMesContainer.classList.add("notification-mes-container");
//     newNotificationLi.appendChild(newNotificationMesContainer);

//     let notificationMes;
//     if (func == "comment") {
//       notificationMes = "留言回應了:";
//     } else if (func == "like") {
//       notificationMes = "喜歡你的貼文!";
//     } else if (func == "tag") {
//       notificationMes = "在此貼文標記了你!";
//     } else if (func == "follow") {
//       notificationMes = "追隨了你!";
//     }

//     let newNotificationMesMain = document.createElement("p");
//     newNotificationMesMain.classList.add("notification-message-main");
//     newNotificationMesMain.textContent = likername + notificationMes;
//     newNotificationMesContainer.appendChild(newNotificationMesMain);

//     let newNotificationMesSecond = document.createElement("p");
//     newNotificationMesSecond.classList.add("notification-message-second");
//     newNotificationMesSecond.textContent = likernotificationMes;
//     newNotificationMesContainer.appendChild(newNotificationMesSecond);

//     let newNotificationTime = document.createElement("span");
//     newNotificationTime.classList.add("notification-time");
//     newNotificationTime.textContent = timeDifference(notificationTime);
//     newNotificationMesSecond.appendChild(newNotificationTime);

//     let newNotificationImgContainer = document.createElement("div");
//     newNotificationImgContainer.classList.add("notification-img-preview");
//     newNotificationLi.appendChild(newNotificationImgContainer);

//     let newNotificationImg = document.createElement("img");
//     if (func != "follow") {
//       newNotificationImg.src = postImg;
//       newNotificationImgContainer.appendChild(newNotificationImg);
//     }
//   }

//   function getNotification() {
//     fetch(`/getNotification`, {
//       method: "GET",
//     })
//       .then(function (response) {
//         return response.json();
//       })
//       .then(function (data) {
//         if (data.ok == true) {
//           data = data.data;
//           notifications = data.notifications;
//           if (data.status == "1") {
//             heartImg.src = "../image/heart5.png";
//           } else {
//             notificationCount++;
//           }
//           notifications.forEach((notification) => {
//             createNotificationLi(
//               notification.func,
//               notification.sendUserId.headImg,
//               notification.sendUserId.username,
//               notification.notificationMessage,
//               notification.time,
//               notification.postImg
//             );
//           });
//         }
//       });
//   }

//   function sendNotice(
//     // TargetItem,
//     func,
//     sendUserName,
//     sendUserId,
//     sendUserImg,
//     sendMessage,
//     notificationTime,
//     targetUserId,
//     postImg
//   ) {
//     if (sendUserId == targetUserId) {
//       return;
//     }
//     ws.send(
//       JSON.stringify({
//         fuc: func,
//         name: sendUserName,
//         sendUserImg,
//         id: sendUserId,
//         postImg: postImg,
//         message: sendMessage,
//         time: notificationTime,
//         targetId: targetUserId,
//       })
//     );

//     fetch(`/uploadNotification`, {
//       method: "POST",
//       body: JSON.stringify({
//         fuc: func,
//         sendUserId,
//         postImg: postImg,
//         message: sendMessage,
//         time: notificationTime,
//         targetId: targetUserId,
//       }),
//       headers: {
//         "Content-type": "application/json; charset=UTF-8",
//       },
//     })
//       .then(function (response) {
//         return response.json();
//       })
//       .then(function (data) {
//         console.log(data);
//       });
//   }
