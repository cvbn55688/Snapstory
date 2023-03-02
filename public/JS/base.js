const header = document.querySelector("header");
const headerTitle = document.querySelector(".tittle p");
const headerNav = document.querySelector(".nav");
const headerNavSpan = document.querySelectorAll(".nav span");
const searchBar = document.querySelector(".serch-bar input");
const searchBarContainer = document.querySelector(".serch-bar");
const searchTable = document.querySelector(".search-table");
const searchTableUl = document.querySelector(".search-user");
const searchImg = document.querySelector(".search-header");
const homePage = document.querySelector(".home-page");
const homePageImg = document.querySelector(".home-page img");
const inboxPage = document.querySelector(".inbox-page");
const inboxPageImg = document.querySelector(".inbox-page img");
const postButton = document.querySelector(".post");
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
const previewImageContainer = document.querySelector(
  ".preview-image-container"
);
const previewDotContainer = document.querySelector(".dot");
const postPreviewPreviousArrow = document.querySelector(".previous-arrow");
const postPreviewNextArrow = document.querySelector(".next-arrow");
const postTitle = document.querySelector(".post-title");
const postNextStep = document.querySelector(".next-step");
const postUndo = document.querySelector(".undo");
const postMessage = document.querySelector(".post-message");
const postMessageTextarea = document.querySelector(".user-message-textarea");
const postHeader1 = document.querySelector(".post-header");
const postUndo2 = document.querySelector(".undo-2");
const postNextStep2 = document.querySelector(".next-step-2");
const postUploadLoading = document.querySelector(".post-header img");
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
const notificationNoData = document.querySelector(".notification-no-data");
const postHashTag = document.querySelector(".post-hashtag");
const postHashTagInput = document.querySelector(".post-hashtag-div input");
const postHashTagTable = document.querySelector(".hashtag-search-talbe");
const postHashTagUl = document.querySelector(".hashtag-search-talbe ul");
const postHashTagLodingImg = document.querySelector(
  ".hashtag-search-loadingImg"
);
const hashTagContainer = document.querySelector(".hashtag-container");
const postMessageTagTable = document.querySelector(".post-message-tag");
const postMessageTagUl = document.querySelector(".post-message-tag ul");
const postMessageTagLoadimg = document.querySelector(
  ".tag-name-search-loadingImg"
);
const vTime = `?v=${new Date().getTime()}`;

let historicalSearch = window.localStorage.getItem("historicalSearch");
let notificationCount = 0;

searchImg.addEventListener("click", () => {
  setTimeout(() => {
    searchBar.focus();
    searchBar.setAttribute("placeholder", "搜尋");
  }, 1);

  searchBarContainer.style.display = "flex";

  searchBar.addEventListener("blur", () => {
    searchBarContainer.style.display = "none";
  });
});

function rediectToPersonalPage(container, targetID) {
  container.addEventListener("click", () => {
    location.href = `/personal/${targetID}`;
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
      let searchHistoricalFunc = searchHistorical[2];
      let searchHistoricalUserID = searchHistorical[3];
      createSearchLi(
        searchHistoricalFunc,
        searchHistoricalImg,
        searchHistoricalName,
        searchHistoricalUserID
      );
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

function createSearchLi(func, headImg, searchValue, userID) {
  let searchUserLi = document.createElement("li");
  searchTableUl.appendChild(searchUserLi);

  let searchUserHeadImg = document.createElement("img");
  searchUserHeadImg.src = headImg + vTime;
  searchUserLi.appendChild(searchUserHeadImg);

  let searchUsername = document.createElement("span");
  searchUsername.textContent = searchValue;
  searchUserLi.appendChild(searchUsername);

  searchUserLi.addEventListener("mousedown", () => {
    if (func == "personal") {
      location.href = `/personal/${userID}`;
      if (historicalSearch == null) {
        window.localStorage.setItem(
          "historicalSearch",
          searchValue + ";" + headImg + ";" + func + ";" + userID
        );
      } else {
        let historicalSearchArray = historicalSearch.split(",");
        Array.prototype.remove = function (value) {
          let index = this.indexOf(value);
          if (index !== -1) {
            this.splice(index, 1);
          }
        };

        historicalSearchArray.remove(
          searchValue + ";" + headImg + ";" + func + ";" + userID
        );

        window.localStorage.setItem(
          "historicalSearch",
          searchValue +
            ";" +
            headImg +
            ";" +
            func +
            ";" +
            userID +
            "," +
            historicalSearchArray
        );
      }
    } else if (func == "hashtag") {
      location.href = `/tags/${searchValue}`;
      if (historicalSearch == null) {
        window.localStorage.setItem(
          "historicalSearch",
          searchValue + ";" + headImg + ";" + func
        );
      } else {
        let historicalSearchArray = historicalSearch.split(",");
        Array.prototype.remove = function (value) {
          var index = this.indexOf(value);
          if (index !== -1) {
            this.splice(index, 1);
          }
        };

        historicalSearchArray.remove(searchValue + ";" + headImg + ";" + func);

        window.localStorage.setItem(
          "historicalSearch",
          searchValue + ";" + headImg + ";" + func + "," + historicalSearchArray
        );
      }
    }
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
      if (searchBar.value.slice(0, 1) != "#") {
        searchUser(searchBar.value).then((data) => {
          let searchDataArray = data.data;
          if (searchDataArray.length == 0) {
            searchBarLoadingImg.style.display = "none";
            searchTableLoadImg.style.display = "none";
            searchNoData.style.display = "flex";
          }
          searchDataArray.forEach((userData) => {
            createSearchLi(
              "personal",
              userData.headImg,
              userData.username,
              userData._id,
              null
            );
            searchBarLoadingImg.style.display = "none";
            searchTableLoadImg.style.display = "none";
          });
        });
      } else {
        if (searchBar.value.replace("#", "") == "") {
          searchShowHistory.style.display = "flex";
          searchBarLoadingImg.style.display = "none";
          searchTableLoadImg.style.display = "none";
          getHistoricalData();
          return;
        }
        searchTags(searchBar.value.replace("#", "")).then((data) => {
          let searchDataArray = data.data;
          // console.log(searchDataArray);
          if (searchDataArray.length == 0) {
            searchBarLoadingImg.style.display = "none";
            searchTableLoadImg.style.display = "none";
            searchNoData.style.display = "flex";
          } else {
            searchDataArray.forEach((tagData) => {
              searchBarLoadingImg.style.display = "none";
              searchTableLoadImg.style.display = "none";

              let tagName = tagData.tagName;
              let tagAmount = tagData.posts.length;
              let tagImg = "/image/hashtag2.png";
              createSearchLi("hashtag", tagImg, tagName);
              // console.log(tagName, tagAmount);
            });
          }
        });
      }
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

async function searchTags(searchValue) {
  // console.log(searchValue);
  return fetch(`/tagSearch/${searchValue}`, {
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
  input.addEventListener("input", checkTagInput);
  function checkTagInput() {
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
  }

  let debounceSearchTagName = debounce(() => {
    searchTagName();
  }, 500);
  input.addEventListener("input", debounceSearchTagName);
  function searchTagName() {
    ul.childNodes.forEach((li) => {
      li.remove();
    });
    let tagName = text.substring(closestAt).split(" ")[0].replace("@", "");

    if (tagName != "") {
      searchUser(tagName).then((data) => {
        // console.log(data);
        data.data.forEach((user) => {
          // console.log(user);
          let newSearchLi = document.createElement("li");
          ul.appendChild(newSearchLi);

          let newsearchUserImage = document.createElement("img");
          newsearchUserImage.src = user.headImg;
          newSearchLi.appendChild(newsearchUserImage);

          let newSearchName = document.createElement("span");
          newSearchName.textContent = user.username;
          newSearchLi.appendChild(newSearchName);

          newSearchLi.addEventListener("click", () => {
            cursorPos = input.selectionStart;
            // console.log(closestAt, cursorPos);

            input.value =
              input.value.slice(0, closestAt) +
              `@${user.username} ` +
              input.value.slice(cursorPos);
            table.style.display = "none";
            input.focus();
            input.removeEventListener("input", debounceSearchTagName);
            input.removeEventListener("input", checkTagInput);
            if (cursorPos == closestAt + 1) {
              input.addEventListener("input", checkTagInput);
            }
          });
        });
        loadingImg.style.display = "none";
      });
    }
  }
}

postHashTagInput.addEventListener("input", () => {
  postHashTagUl.childNodes.forEach((li) => {
    li.remove();
  });
  postHashTagTable.style.display = "flex";
  postHashTagLodingImg.style.display = "flex";
  if (postHashTagInput.value == "") {
    postHashTagTable.style.display = "none";
  }
});
postHashTagInput.addEventListener(
  "input",
  debounce(() => {
    let searchValue = postHashTagInput.value.replace("#", "");
    if (searchValue != "") {
      searchTags(searchValue).then((data) => {
        if (data.data.length == 0) {
          let newHashtagLi = document.createElement("li");
          newHashtagLi.textContent = "#" + searchValue;
          postHashTagUl.appendChild(newHashtagLi);

          let newHashtagSpan = document.createElement("span");
          newHashtagSpan.classList.add("hashtag-post-amount");
          newHashtagSpan.textContent = "創建此標籤";
          newHashtagLi.appendChild(newHashtagSpan);

          newHashtagLi.addEventListener("click", () => {
            createHashtagLi(searchValue);
            postHashTagTable.style.display = "none";
          });
        } else {
          let hashTagArr = data.data;
          hashTagArr.forEach((hashtagData) => {
            // console.log(hashtagData);

            let newHashtagLi = document.createElement("li");
            newHashtagLi.textContent = "#" + hashtagData.tagName;
            postHashTagUl.appendChild(newHashtagLi);

            let newHashtagSpan = document.createElement("span");
            newHashtagSpan.classList.add("hashtag-post-amount");
            newHashtagSpan.textContent =
              "共" + hashtagData.posts.length + "篇文章";
            newHashtagLi.appendChild(newHashtagSpan);

            newHashtagLi.addEventListener("click", () => {
              createHashtagLi(hashtagData.tagName);
              postHashTagTable.style.display = "none";
            });
          });
        }
      });
    }

    postHashTagLodingImg.style.display = "none";
  }, 1500)
);

function createHashtagLi(hashtagName) {
  let newhashtagLi = document.createElement("li");
  newhashtagLi.classList.add("hashtags-li");
  newhashtagLi.textContent = "#" + hashtagName;
  hashTagContainer.appendChild(newhashtagLi);

  let newhashtagCloseImg = document.createElement("img");
  newhashtagCloseImg.src = "/image/close2.png";
  newhashtagLi.appendChild(newhashtagCloseImg);

  newhashtagCloseImg.addEventListener("click", () => {
    newhashtagLi.remove();
  });
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

  function closeBlackScreen(e) {
    if (e.target.classList.contains("show-post")) {
      postCancel.style.display = "flex";
      cancelButton.addEventListener("click", () => {
        showPost.style.display = "none";
        location.reload();
      });
      notCancelButton.addEventListener("click", () => {
        postCancel.style.display = "none";
      });
    }
  }

  postButton.addEventListener("click", (e) => {
    changeIcon("postButtonImg");
    postButtonImg.src = "../image/post2.png";
    showPost.style.display = "flex";

    document.addEventListener("click", closeBlackScreen);
  });

  postLeaveButton.addEventListener("click", () => {
    postCancel.style.display = "flex";
    cancelButton.addEventListener("click", () => {
      location.reload();
    });
    notCancelButton.addEventListener("click", () => {
      postCancel.style.display = "none";
    });
  });

  let heartCount = 0;
  heart.addEventListener("click", () => {
    // console.log(heartCount);
    if (heartCount == 0) {
      heartCount++;
      changeIcon("heartImg");

      let ct = 0;
      document.addEventListener("click", closeNoticeTable);
      function closeNoticeTable(e) {
        ct++;
        if (!e.target.classList.contains("notice-click") && ct > 1) {
          checkPathIcon();
          heartImg.src = "../image/heart.png";
          notificationTable.style.animation = "closeNotice 1s forwards";
          header.style.animation = "showHeader 1s forwards";
          headerNav.style.width = "100%";
          headerTitle.style.opacity = "1";
          searchBar.style.opacity = "1";
          headerNavSpan.forEach((span) => {
            span.style.display = "block";
          });
          document.removeEventListener("click", closeNoticeTable);
          heartCount--;
        }
      }

      heartImg.src = "../image/heart2.png";
      notificationTable.style.display = "block";
      notificationTable.style.animation = "showNotice 1s forwards";
      header.style.animation = "closeHeader 0.7s forwards";
      // headerNav.style.width = "auto";
      headerTitle.style.opacity = "0";
      searchBar.style.opacity = "0";
      headerNavSpan.forEach((span) => {
        span.style.display = "none";
      });

      if (notificationCount == 0) {
        fetch(`/changeNotificationStatus`, {
          method: "POST",
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            // console.log(data);
            notificationCount++;
          });
      }
    } else {
      checkPathIcon();
      heartImg.src = "../image/heart.png";
      notificationTable.style.animation = "closeNotice 1s forwards";
      header.style.animation = "showHeader 1s forwards";
      headerNav.style.width = "100%";
      headerTitle.style.opacity = "1";
      searchBar.style.display = "flex";
      headerNavSpan.forEach((span) => {
        span.style.display = "block";
      });
    }
  });

  postImageInput.addEventListener("change", inputLoad);
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
      data = data.decoded;
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}

checkLonin().then((data) => {
  personalImg.src = data.headImg + `?v=${new Date().getTime()}`;
  personal.addEventListener("click", () => {
    location.href = `/personal/${data.userID}`;
  });

  let userData = { fuc: 0, name: data.name, id: data.userID };

  setTimeout(() => {
    socket.emit("join web", { userID: data.userID, username: data.name });
    socket.on("connectionSuccess", (data) => {
      // console.log(data);
      socketGetNotice();
    });
  }, 1000);
});

getNotification();
checkPathIcon();
searchBarFuction();
headerIconFuction();
