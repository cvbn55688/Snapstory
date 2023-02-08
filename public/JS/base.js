const searchBar = document.querySelector(".serch-bar input");
const searchTable = document.querySelector(".search-table");
const searchTableUl = document.querySelector(".search-user");
const homePage = document.querySelector(".home-page");
const homePageImg = document.querySelector(".home-page img");
const inboxPage = document.querySelector(".inbox-page");
const inboxPageImg = document.querySelector(".inbox-page img");
const postButtonImg = document.querySelector(".post img");
const heart = document.querySelector(".heart");
const heartImg = document.querySelector(".heart img");
const personal = document.querySelector(".personal");
const personalImg = document.querySelector(".personal img");
const showPost = document.querySelector(".show-post");
const postContainer = document.querySelector(".posting");
const postLeaveButton = document.querySelector(".post-leave-img");
const postImageInput = document.querySelector(".post-image");
const postingArea = document.querySelector(".posting-area");
const postCutting = document.querySelector(".cutting");
const preveiwImageContainer = document.querySelector(
  ".preveiw-image-container"
);
const postPreveiw = document.querySelector(".preveiw");
const postTitle = document.querySelector(".post-title");
const postNextStep = document.querySelector(".next-step");
const postUndo = document.querySelector(".undo");
const postMessage = document.querySelector(".post-message");
const postMessageTextarea = document.querySelector(".user-message-textarea");
const postHeader1 = document.querySelector(".post-header");
const postUndo2 = document.querySelector(".undo-2");
const postNextStep2 = document.querySelector(".next-step-2");
const postHr = document.querySelector(".post-hr");
const postCancel = document.querySelector(".cancel-container");
const cancelButton = document.querySelector(".cancel-button");
const notCancelButton = document.querySelector(".ont-cancel-button");
const searchBarLoadingImg = document.querySelector(".search-input img");
const searchTableLoadImg = document.querySelector(
  ".search-Table-loading-image"
);
const searchShowHistory = document.querySelector(".show-history");
const clearHistory = document.querySelector(".clear-history");
const searchNoData = document.querySelector(".search-no-data");
const historyNoData = document.querySelector(".histiry-no-data");
const notificationTable = document.querySelector(".notification-table");
const notificationUl = document.querySelector(".notification-ul");
const notificationNoData = document.querySelector(".notification-no-data");
let historicalSearch = window.localStorage.getItem("historicalSearch");
let notificationCount = 0;

function rediectToPersonalPage(container, targetName) {
  container.addEventListener("click", () => {
    location.href = `/personal/${targetName}`;
  });
}

function websocketConnect() {
  let url = "ws://localhost:8000";
  let ws = new WebSocket(url);

  ws.addEventListener("open", function () {
    console.log("連結建立成功。");
  });

  ws.addEventListener("message", function (e) {
    let data = JSON.parse(e.data);
    let time = new Date().getTime();
    createNotificationLi(
      data.funcChoice,
      data.senderImg,
      data.sendername,
      data.message,
      time,
      data.postImg,
      data.postID
    );
    heartImg.src = "../image/heart5.png";
    notificationCount = 0;
    notificationNoData.style.display = "none";
  });
  return ws;
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
          console.log(notification);
          if (notification.func == "follow") {
            imageUrl = null;
            post = null;
          } else {
            imageUrl = notification.postID.imageUrl;
            post = notification.postID._id;
          }

          createNotificationLi(
            notification.func,
            notification.sendUserId.headImg,
            notification.sendUserId.username,
            notification.notificationMessage,
            notification.time,
            imageUrl,
            post
          );
        });
      }
    });
}

function createNotificationLi(
  func,
  likerHeadImg,
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
  newNotificationLi.appendChild(newNotificationHeadImg);
  newNotificationHeadImg.addEventListener("mousedown", () => {
    rediectToPersonalPage(newNotificationHeadImg, likername);
  });

  let newNotificationMesContainer = document.createElement("div");
  newNotificationMesContainer.classList.add("notification-mes-container");
  newNotificationLi.appendChild(newNotificationMesContainer);

  let notificationMes;
  if (func == "comment") {
    notificationMes = "留言回應了:";
  } else if (func == "like") {
    notificationMes = "喜歡你的貼文!";
  } else if (func == "tag") {
    notificationMes = "在此貼文標記了你!";
  } else if (func == "follow") {
    notificationMes = "追隨了你!";
  }

  let newNotificationMesMain = document.createElement("p");
  newNotificationMesMain.classList.add("notification-message-main");
  newNotificationMesMain.textContent = likername + notificationMes;
  newNotificationMesContainer.appendChild(newNotificationMesMain);

  let newNotificationMesSecond = document.createElement("p");
  newNotificationMesSecond.classList.add("notification-message-second");
  newNotificationMesSecond.textContent = likernotificationMes;
  newNotificationMesContainer.appendChild(newNotificationMesSecond);

  let newNotificationTime = document.createElement("span");
  newNotificationTime.classList.add("notification-time");
  newNotificationTime.textContent = timeDifference(notificationTime);
  newNotificationMesSecond.appendChild(newNotificationTime);

  let newNotificationImgContainer = document.createElement("div");
  newNotificationImgContainer.classList.add("notification-img-preview");
  newNotificationLi.appendChild(newNotificationImgContainer);

  let newNotificationImg = document.createElement("img");
  if (func != "follow") {
    newNotificationImg.src = postImg;
    newNotificationImgContainer.appendChild(newNotificationImg);
    newNotificationLi.addEventListener("click", () => {
      createParticularPost(postID);
    });
  }
}

function sendNotice(
  // TargetItem,
  func,
  sendUserName,
  sendUserId,
  sendUserImg,
  sendMessage,
  notificationTime,
  targetUserId,
  postImg,
  postID
) {
  if (sendUserId == targetUserId) {
    return;
  }
  ws.send(
    JSON.stringify({
      fuc: func,
      name: sendUserName,
      sendUserImg,
      id: sendUserId,
      postImg: postImg,
      message: sendMessage,
      time: notificationTime,
      targetId: targetUserId,
      postID,
    })
  );

  fetch(`/uploadNotification`, {
    method: "POST",
    body: JSON.stringify({
      fuc: func,
      sendUserId,
      postImg: postImg,
      message: sendMessage,
      time: notificationTime,
      targetId: targetUserId,
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
      console.log(data);
    });
}

function timeDifference(date) {
  const now = new Date();
  const difference = now - date;
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (difference < minute) {
    return "剛剛";
  } else if (difference < hour) {
    return Math.floor(difference / minute) + "分鐘前";
  } else if (difference < day) {
    return Math.floor(difference / hour) + "小時前";
  } else {
    return Math.floor(difference / day) + "天前";
  }
}

function getHistoricalData() {
  try {
    historicalSearch = window.localStorage.getItem("historicalSearch");
    let historicalSearchArray = historicalSearch.split(",");
    historicalSearchArray.forEach((search) => {
      if (search == "") {
        return;
      }
      let searchHistorical = search.split(";");
      let searchHistoricalName = searchHistorical[0];
      let searchHistoricalImg = searchHistorical[1];
      createSearchLi(searchHistoricalImg, searchHistoricalName);
    });
  } catch {
    historyNoData.style.display = "flex";
  }
}

function debounce(func, delay) {
  // timeout 初始值
  let timeout = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timeout);

    timeout = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}

function checkPathIcon() {
  if (location.pathname == "/") {
    homePageImg.src = "../image/home2.png";
  }
  if (location.pathname == "/inbox") {
    inboxPageImg.src = "../image/message2.png";
  }
}

function changeIcon(targetIcon) {
  let icons = ["homePageImg", "inboxPageImg", "heartImg", "postButtonImg"];
  icons.forEach((icon) => {
    if (icon == "homePageImg" && icon != targetIcon) {
      homePageImg.src = "../image/home.png";
    } else if (icon == "inboxPageImg" && icon != targetIcon) {
      inboxPageImg.src = "../image/message.png";
    } else if (icon == "heartImg" && icon != targetIcon) {
      heartImg.src = "../image/heart.png";
    } else if (icon == "postButtonImg" && icon != targetIcon) {
      postButtonImg.src = "../image/post.png";
    }
  });
}

function createSearchLi(headImg, username) {
  let searchUserLi = document.createElement("li");
  searchTableUl.appendChild(searchUserLi);

  let searchUserHeadImg = document.createElement("img");
  searchUserHeadImg.src = headImg;
  searchUserLi.appendChild(searchUserHeadImg);

  let searchUsername = document.createElement("span");
  searchUsername.textContent = username;
  searchUserLi.appendChild(searchUsername);

  searchUserLi.addEventListener("mousedown", () => {
    if (historicalSearch == null) {
      window.localStorage.setItem("historicalSearch", username + ";" + headImg);
    } else {
      let historicalSearchArray = historicalSearch.split(",");
      Array.prototype.remove = function (value) {
        var index = this.indexOf(value);
        if (index !== -1) {
          this.splice(index, 1);
        }
      };

      historicalSearchArray.remove(username + ";" + headImg);

      window.localStorage.setItem(
        "historicalSearch",
        username + ";" + headImg + "," + historicalSearchArray
      );
    }
    location.href = `/personal/${username}`;
  });
}

function searchBarFuction() {
  searchBar.addEventListener("focus", () => {
    searchBar.style.backgroundImage = "none";
    searchTable.style.display = "flex";
    let searchLi = document.querySelectorAll(".search-user li");
    if (searchBar.value == "") {
      searchLi.forEach((li) => {
        searchTableUl.removeChild(li);
      });
      getHistoricalData();
    }
  });

  clearHistory.addEventListener("mousedown", () => {
    setTimeout(() => {
      searchBar.style.backgroundImage = "none";
      searchTable.style.display = "flex";
      searchBar.focus();
      searchBar.placeholder = "搜尋";
      window.localStorage.clear();
      let searchLi = document.querySelectorAll(".search-user li");
      searchLi.forEach((li) => {
        searchTableUl.removeChild(li);
      });
      historyNoData.style.display = "flex";
    }, 1);
  });

  searchBar.addEventListener("blur", () => {
    if (searchBar.value == "") {
      searchBar.style.backgroundImage = "url('../image/search.png')";
      searchBarLoadingImg.style.display = "none";
      searchTable.style.display = "none";
    }
  });

  searchBar.addEventListener("input", () => {
    let searchLi = document.querySelectorAll(".search-user li");
    searchLi.forEach((li) => {
      searchTableUl.removeChild(li);
    });
    searchShowHistory.style.display = "none";
    searchBarLoadingImg.style.display = "flex";
    searchTableLoadImg.style.display = "flex";
    searchNoData.style.display = "none";
    historyNoData.style.display = "none";
  });
  searchBar.addEventListener(
    "input",
    debounce(() => {
      if (searchBar.value == "") {
        searchShowHistory.style.display = "flex";
        searchBarLoadingImg.style.display = "none";
        searchTableLoadImg.style.display = "none";
        getHistoricalData();
        return;
      }
      searchUser(searchBar.value).then((data) => {
        let searchDataArray = data.data;
        if (searchDataArray.length == 0) {
          searchBarLoadingImg.style.display = "none";
          searchTableLoadImg.style.display = "none";
          searchNoData.style.display = "flex";
        }
        searchDataArray.forEach((userData) => {
          createSearchLi(userData.headImg, userData.username);
          searchBarLoadingImg.style.display = "none";
          searchTableLoadImg.style.display = "none";
        });
      });
    }, 1500)
  );
}

async function searchUser(searchValue) {
  return fetch(`/userSearch/${searchValue}`, {
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
      return data;
    });
}

function openTagTable(table, ul, loadingImg, input) {
  let closestAt;
  let text;
  input.addEventListener("input", function checkTagInput() {
    table.style.display = "flex";
    loadingImg.style.display = "flex";
    let cursorPos = input.selectionStart;
    text = input.value;
    closestAt = text.lastIndexOf("@", cursorPos - 1);
    ul.childNodes.forEach((li) => {
      li.remove();
    });
    if (
      text.slice(-1) == " " ||
      text.slice(-1) == "@" ||
      text == "" ||
      closestAt == -1
    ) {
      table.style.display = "none";
      input.removeEventListener("input", debounceSearchTagName);
      input.removeEventListener("input", checkTagInput);
    }
  });

  let debounceSearchTagName = debounce(() => {
    searchTagName();
  }, 200);
  input.addEventListener("input", debounceSearchTagName);
  function searchTagName() {
    ul.childNodes.forEach((li) => {
      li.remove();
    });
    let tagName = text.substring(closestAt).split(" ")[0].replace("@", "");

    if (tagName != "") {
      console.log(closestAt);
      console.log(tagName);
      searchUser(tagName).then((data) => {
        console.log(data);
        data.data.forEach((user) => {
          console.log(user);
          let newSearchLi = document.createElement("li");
          ul.appendChild(newSearchLi);

          let newsearchUserImage = document.createElement("img");
          newsearchUserImage.src = user.headImg;
          newSearchLi.appendChild(newsearchUserImage);

          let newSearchName = document.createElement("span");
          newSearchName.textContent = user.username;
          newSearchLi.appendChild(newSearchName);

          newSearchLi.addEventListener("click", () => {
            input.value = input.value.replace(
              `@${tagName}`,
              `@${user.username} `
            );
            table.style.display = "none";
            input.focus();
          });
        });
        loadingImg.style.display = "none";
      });
    }
  }
}

function headerIconFuction() {
  homePage.addEventListener("click", () => {
    let origin = document.location.origin;
    if (document.location.href == origin + "/") {
      changeIcon("homePageImg");
      homePageImg.src = "../image/home2.png";
    } else {
      document.location.href = "/";
    }
  });

  inboxPage.addEventListener("click", () => {
    let origin = document.location.origin;
    if (document.location.href == origin + "/inbox") {
      changeIcon("inboxPageImg");
      inboxPageImg.src = "../image/message2.png";
    } else {
      document.location.href = "/inbox";
    }
  });

  postButtonImg.addEventListener("click", (e) => {
    changeIcon("postButtonImg");
    postButtonImg.src = "../image/post2.png";
    showPost.style.display = "flex";
  });

  postLeaveButton.addEventListener("click", () => {
    postCancel.style.display = "flex";
    cancelButton.addEventListener("click", () => {
      location.href = location.pathname;
    });
    notCancelButton.addEventListener("click", () => {
      postCancel.style.display = "none";
    });
  });

  let heartCount = 0;
  heart.addEventListener("click", () => {
    if (heartCount == 0) {
      changeIcon("heartImg");
      heartImg.src = "../image/heart2.png";
      notificationTable.style.display = "block";
      heartCount++;
      if (notificationCount == 0) {
        fetch(`/changeNotificationStatus`, {
          method: "POST",
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data);
            notificationCount++;
          });
      }
    } else {
      checkPathIcon();
      heartImg.src = "../image/heart.png";
      notificationTable.style.display = "none";
      heartCount--;
    }
  });

  postImageInput.addEventListener("change", (eve) => {
    let imageFile = eve.target.files[0];
    let reader = new FileReader();
    console.log(postImageInput.value);
    setTimeout(() => {
      postImageInput.value = "";
    }, 100);
    let base64Img;
    reader.readAsDataURL(imageFile);
    reader.addEventListener("load", () => {
      base64Img = reader.result;
      postingArea.style.display = "none";
      postCutting.style.display = "flex";
      postPreveiw.src = base64Img;
      postTitle.textContent = "預覽";
      postNextStep.style.display = "flex";
      postUndo.style.display = "flex";
      postUndo.addEventListener("click", handelPostUndo);
      postNextStep.addEventListener("click", handelPostNextStep);
    });

    function handelPostUndo() {
      postingArea.style.display = "flex";
      postCutting.style.display = "none";
      postPreveiw.src = "";
      postTitle.textContent = "選擇圖片";
      postNextStep.style.display = "none";
      postUndo.style.display = "none";
      postUndo.removeEventListener("click", handelPostUndo);
      postNextStep.removeEventListener("click", handelPostNextStep);
    }

    function handelPostNextStep() {
      postPreveiw.style.animation = "postImageMove 0.7s forwards";
      postUndo.style.display = "none";
      postUndo2.style.display = "flex";
      postNextStep.style.display = "none";
      postNextStep2.style.display = "flex";

      postHr.style.display = "block";

      postTitle.textContent = "建立新貼文";
      postCutting.style.padding = "20px";
      postCutting.style.height = "330px";
      preveiwImageContainer.style.height = "330px";
      postMessage.style.display = "flex";

      postNextStep2.addEventListener("click", uploadPost);
      postUndo2.addEventListener("click", handelPostUndo2);
    }

    function handelPostUndo2() {
      postPreveiw.style.animation = "";
      postUndo.style.display = "flex";
      postUndo2.style.display = "none";
      postNextStep.style.display = "flex";
      postNextStep2.style.display = "none";
      postCutting.style.padding = "none";
      postCutting.style.height = "580px";
      preveiwImageContainer.style.height = "550px";
      postMessage.style.display = "none";
      postHr.style.display = "none";
      postNextStep2.removeEventListener("click", uploadPost);
      postUndo2.removeEventListener("click", handelPostUndo2);
    }

    function uploadPost() {
      fetch(`/uploadPost`, {
        method: "POST",
        body: JSON.stringify({
          base64Img: base64Img,
          message: postMessageTextarea.value,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.ok == true) {
            alert("上傳成功");
            location.reload();
          }
        });
    }
  });
}

async function checkLonin() {
  return await fetch(`/checkLogin`, {
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
      if (data.ok == false) {
        return;
      }
      data = data.data;
      personalImg.src = data.headImg;
      personalImg.addEventListener("click", () => {
        location.href = `/personal/${data.name}`;
      });

      let userData = { fuc: 0, name: data.name, id: data.userID };
      ws.send(JSON.stringify(userData));
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}
const ws = websocketConnect();
checkLonin();
checkPathIcon();
searchBarFuction();
headerIconFuction();
getNotification();

function test(val, val2) {
  console.log(val, val2);
}
test(12);
