const userInfoHeadImg = document.querySelector(".user-info-headImg");
const userAccount = document.querySelector(".user-account");
const userPostsSection = document.querySelector(".user-posts");
const userPostsAmount = document.querySelector(".post-amount");
const followButton = document.querySelector(".follow");
const sendMessageButton = document.querySelector(".message");
const setUserData = document.querySelector(".set-user-data");

function loadPostImg(postArray, userData) {
  userPostsAmount.textContent = postArray.length;
  postArray.forEach((post) => {
    let newPostCard = document.createElement("a");
    newPostCard.classList.add("post-card");
    userPostsSection.appendChild(newPostCard);

    let newPostCardImg = document.createElement("img");
    newPostCardImg.src = post.imageUrl;
    newPostCard.appendChild(newPostCardImg);

    createPostShow(
      post._id,
      post.imageUrl,
      userData.headImg,
      userData.username,
      post.content,
      post.comments,
      post.likes,
      newPostCard
    );
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
        let userData = data.data.user;
        console.log(userData);
        userInfoHeadImg.src = userData.headImg;
        userAccount.textContent = userData.username;
        userPosts = data.data.posts;
        loadPostImg(userPosts, userData);

        checkLonin().then(function (data) {
          if (userData._id == data.userID) {
            followButton.style.display = "none";
            sendMessageButton.style.display = "none";
          } else {
            setUserData.style.display = "none";
          }
        });
      }
    });
}

getUserData();
