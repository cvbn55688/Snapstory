const userInfoHeadImg = document.querySelector(".user-info-headImg");
const userAccount = document.querySelector(".user-account");
const userPostsSection = document.querySelector(".user-posts");
const userPostsAmount = document.querySelector(".post-amount");
const followButton = document.querySelector(".follow");
const unfollowButton = document.querySelector(".isfollowed");
const followLoading = document.querySelector(".follow img");
const sendMessageButton = document.querySelector(".message");
const setUserData = document.querySelector(".set-user-data");
const fansAmount = document.querySelector(".fans");
const followingAmount = document.querySelector(".following");
const fansAmountContainer = document.querySelector(".fans-amount-container");
const followingAmountContainer = document.querySelector(
  ".following-amount-container"
);
const isfollowedButton = document.querySelector(".isfollowed");
const noPostDiv = document.querySelector(".no-post");
const fullBlackScreen = document.querySelector(".full-screen");
const fansTable = document.querySelector(".fans-table");
const followingTable = document.querySelector(".following-table");
const fansUl = document.querySelector(".fans-ul");
const followingUl = document.querySelector(".following-ul");
const fansClose = document.querySelector(".fans-close");
const followingClose = document.querySelector(".following-close");
const logoutButton = document.querySelector(".logout");

function closeFanFollowTable(closeButton, ul, table) {
  closeButton.addEventListener("click", () => {
    fullBlackScreen.style.display = "none";
    table.style.display = "none";
  });
}

function createFansFollowingLi(dataArray, table, ul) {
  let oldLi = document.querySelectorAll(".following-ul li");
  oldLi.forEach((li) => {
    li.remove();
  });
  let oldLiFans = document.querySelectorAll(".fans-ul li");
  oldLiFans.forEach((li) => {
    li.remove();
  });
  fullBlackScreen.style.display = "flex";
  table.style.display = "flex";
  dataArray.forEach((userData) => {
    let fanName = userData.userID.username;
    let fanID = userData.userID._id;
    let fanHeadImg = userData.userID.headImg;

    let newLi = document.createElement("li");
    ul.appendChild(newLi);

    let newHeagimg = document.createElement("img");
    newHeagimg.src = fanHeadImg;
    newLi.appendChild(newHeagimg);

    let newName = document.createElement("span");
    newName.textContent = fanName;
    newLi.appendChild(newName);

    // newLi.addEventListener("click", () => {
    //   location.href = `/personal/${fanName}`;
    // });
    rediectToPersonalPage(newLi, fanID);
  });
}

function loadPostImg(postArray, userData) {
  userPostsAmount.textContent = postArray.length;
  postArray.forEach((post) => {
    let newPostCard = document.createElement("a");
    newPostCard.classList.add("post-card");
    userPostsSection.appendChild(newPostCard);

    let newPostCardImg = document.createElement("img");
    newPostCardImg.src = post.imageUrl[0];
    newPostCard.appendChild(newPostCardImg);

    newPostCard.addEventListener("click", () => {
      createParticularPost(post._id);
    });
  });
}

function getUserData() {
  fetch(`/getUserPost/${location.pathname.split("/")[2]}`, {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.ok == true) {
        if (data.data.isMatchFan == true) {
          isfollowedButton.style.display = "flex";
          followButton.style.display = "none";
        }
        let userData = data.data.user;
        userInfoHeadImg.src = userData.headImg;
        userAccount.textContent = userData.username;
        fansAmount.textContent = userData.fans.length;
        followingAmount.textContent = userData.following.length;
        userPosts = data.data.posts;
        if (userPosts.length == 0) {
          noPostDiv.style.display = "flex";
        }
        loadPostImg(userPosts, userData);

        checkLonin().then(function (data) {
          if (userData._id == data.userID) {
            followButton.style.display = "none";
            sendMessageButton.style.display = "none";
            setUserData.style.display = "flex";
            logoutButton.style.display = "flex";
            logoutButton.addEventListener("click", () => {
              let yes = confirm("確定要登出?");
              if (yes) {
                fetch(`/logout`, {
                  method: "DELETE",
                  body: JSON.stringify({
                    userID: data.userID,
                  }),
                  headers: {
                    "Content-type": "application/json; charset=UTF-8",
                  },
                })
                  .then(function (response) {
                    if (response.status == 200) {
                      alert("已成功登出");
                      location.href = "/login";
                      return;
                    }
                    return response.json();
                  })
                  .then(function (data) {
                    console.log(data);
                  });
              }
            });
          }
        });
        followButton.addEventListener("click", () => {
          followLoading.style.display = "flex";
          follow(userData._id, fansAmount.textContent, true);
        });
        unfollowButton.addEventListener("click", () => {
          let ensureUnfollow = confirm("確定要退追？");
          if (ensureUnfollow == true) {
            followLoading.style.display = "flex";
            follow(userData._id, fansAmount.textContent, false);
          }
        });
        fansAmountContainer.addEventListener("click", () => {
          let fansArray = userData.fans;
          createFansFollowingLi(fansArray, fansTable, fansUl);
        });
        followingAmountContainer.addEventListener("click", () => {
          let followingArray = userData.following;
          createFansFollowingLi(followingArray, followingTable, followingUl);
        });
      }
    });
}
function follow(followedUser, fansAmountText, followTrue) {
  fetch(`/followFans`, {
    method: "PUT",
    body: JSON.stringify({
      follow: followTrue,
      followedUser: followedUser,
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
      if (data.ok == true && data.follow == true) {
        isfollowedButton.style.display = "flex";
        followButton.style.display = "none";
        followLoading.style.display = "none";
        fansAmount.textContent = Number(fansAmountText) + 1;
        sendNotice(
          "follow",
          data.fansData.fanname,
          data.fansData.fanID,
          data.fansData.fanHeadImg,
          null,
          "剛剛",
          data.followedUserID,
          null,
          null
        );
      } else if (data.ok == true && data.follow == false) {
        isfollowedButton.style.display = "none";
        followButton.style.display = "flex";
        followLoading.style.display = "none";
        fansAmount.textContent = Number(fansAmountText) - 1;
      }
    });
}

getUserData();
closeFanFollowTable(fansClose, fansUl, fansTable);
closeFanFollowTable(followingClose, followingUl, followingTable);
