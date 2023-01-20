const articleContainer = document.querySelector(".article-container");

function createPost(userName, headerImg, postImgUrl, posterMessage) {
  let newArticle = document.createElement("article");
  articleContainer.appendChild(newArticle);

  let newPostContainer = document.createElement("div");
  newPostContainer.classList.add("container");
  newArticle.appendChild(newPostContainer);

  let newPoster = document.createElement("section");
  newPoster.classList.add("poster");
  newPostContainer.appendChild(newPoster);

  let newPosterHeaderImg = document.createElement("img");
  newPosterHeaderImg.classList.add("poster-header-img");
  newPosterHeaderImg.src = headerImg;
  newPoster.appendChild(newPosterHeaderImg);

  let posterName = document.createElement("p");
  posterName.classList.add("poster-name");
  posterName.textContent = userName;
  newPoster.appendChild(posterName);

  let newContent = document.createElement("section");
  newContent.classList.add("content");
  newPostContainer.appendChild(newContent);

  let newPostImg = document.createElement("img");
  newPostImg.classList.add("post-img");
  newPostImg.src = postImgUrl;
  newContent.appendChild(newPostImg);

  let newComment = document.createElement("section");
  newComment.classList.add("comment");
  newPostContainer.appendChild(newComment);

  let newUserInteracte = document.createElement("div");
  newUserInteracte.classList.add("user-interacte");
  newComment.appendChild(newUserInteracte);

  let newHeart = document.createElement("img");
  newHeart.src = "/image/heart.png";
  newUserInteracte.appendChild(newHeart);

  let newMessage = document.createElement("img");
  newMessage.src = "/image/message.png";
  newUserInteracte.appendChild(newMessage);

  let newShare = document.createElement("img");
  newShare.src = "/image/share.png";
  newUserInteracte.appendChild(newShare);

  let userLike = document.createElement("div");
  userLike.classList.add("user-likes");
  newComment.appendChild(userLike);

  let newLikeAmount = document.createElement("span");
  newLikeAmount.classList.add("like-amount");
  newLikeAmount.textContent = "123";
  userLike.appendChild(newLikeAmount);

  let newLikeSpan = document.createElement("span");
  newLikeSpan.textContent = "個人喜歡這則貼文";
  userLike.appendChild(newLikeSpan);

  let newPostMessageDiv = document.createElement("div");
  newPostMessageDiv.classList.add("post-message");
  newComment.appendChild(newPostMessageDiv);

  let newPosterName = document.createElement("span");
  newPosterName.classList.add("poster-name");
  newPosterName.textContent = userName;
  newPostMessageDiv.appendChild(newPosterName);

  let newPosterMessage = document.createElement("span");
  newPosterMessage.textContent = posterMessage;
  newPostMessageDiv.appendChild(newPosterMessage);
}

function getData() {
  fetch(`/getData`, {
    method: "GET",
  })
    .then(function (response) {
      if (response.status != 200) {
        alert("讀取失敗");
        return;
      }
      return response.json();
    })
    .then(function (data) {
      if (data.ok != true) {
        console.log("讀取失敗");
        return;
      }
      let postsDataArray = data.data;
      postsDataArray.forEach((post) => {
        createPost(
          post.userID.username,
          post.userID.headImg,
          post.imageUrl,
          post.content
        );
      });
    });
}

function checkLonin() {
  fetch(`/checkLogin`, {
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
      console.log(data);
    });
}

checkLonin();
getData();
