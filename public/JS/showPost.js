const postBlacksreen = document.querySelector(".show-post-blacksreen");
const closePostButton = document.querySelector(".close-post-button");

function rediectToPersonalPage(container, targetName) {
  container.addEventListener("click", () => {
    location.href = `/personal/${targetName}`;
  });
}

function createPostShow(
  postId,
  postImgUrl,
  headerImg,
  userName,
  posterMessage,
  comments,
  likes,
  newPostCard,
  time
) {
  let date = new Date(time);

  let newPostTable = document.createElement("div");
  newPostTable.classList.add("post-table");
  newPostTable.setAttribute("id", postId);
  postBlacksreen.appendChild(newPostTable);

  let newPostImageContainer = document.createElement("div");
  newPostImageContainer.classList.add("post-image-container");
  newPostTable.appendChild(newPostImageContainer);

  let newPostImage = document.createElement("img");
  newPostImage.classList.add("post-image");
  newPostImage.src = postImgUrl;
  newPostImageContainer.appendChild(newPostImage);

  let commentContainer = document.createElement("div");
  commentContainer.classList.add("comment-container");
  newPostTable.appendChild(commentContainer);

  let newPosterSection = document.createElement("section");
  newPosterSection.classList.add("poster");
  commentContainer.appendChild(newPosterSection);

  let newPosterTitle = document.createElement("div");
  newPosterTitle.classList.add("poster-title");
  newPosterSection.appendChild(newPosterTitle);

  let newPosterHeaderImgPost = document.createElement("img");
  newPosterHeaderImgPost.classList.add("poster-header-img-post");
  newPosterHeaderImgPost.src = headerImg;
  newPosterTitle.appendChild(newPosterHeaderImgPost);
  rediectToPersonalPage(newPosterHeaderImgPost, userName);

  let newPosterContent = document.createElement("div");
  newPosterContent.classList.add("poster-content");
  newPosterTitle.appendChild(newPosterContent);

  let newPosterNameP = document.createElement("p");
  newPosterNameP.classList.add("poster-name");
  newPosterNameP.textContent = userName;
  newPosterContent.appendChild(newPosterNameP);
  rediectToPersonalPage(newPosterNameP, userName);

  let newPosterMessageP = document.createElement("p");
  newPosterMessageP.classList.add("poster-messag");
  newPosterMessageP.textContent = posterMessage;
  newPosterContent.appendChild(newPosterMessageP);

  let newDots = document.createElement("img");
  newDots.classList.add("dots");
  newDots.src = "/image/dots.png";
  newPosterTitle.appendChild(newDots);

  let newCommentSection = document.createElement("section");
  newCommentSection.classList.add("comment");
  commentContainer.appendChild(newCommentSection);

  let newUl = document.createElement("ul");
  newCommentSection.appendChild(newUl);
  // console.log(comments);

  let newPostInteractContainerSection = document.createElement("section");
  newPostInteractContainerSection.classList.add("post-interact-container");
  commentContainer.appendChild(newPostInteractContainerSection);

  let newPostInteract = document.createElement("div");
  newPostInteract.classList.add("post-interact");
  newPostInteractContainerSection.appendChild(newPostInteract);

  let newHeartPost = document.createElement("img");
  newHeartPost.src = "/image/heart.png";
  newHeartPost.classList.add("heart-post");
  newPostInteract.appendChild(newHeartPost);

  let newMessagePost = document.createElement("img");
  newMessagePost.src = "/image/message.png";
  newMessagePost.classList.add("messagge-post");
  newPostInteract.appendChild(newMessagePost);

  let newSharePost = document.createElement("img");
  newSharePost.src = "/image/share.png";
  newSharePost.classList.add("share-post");
  newPostInteract.appendChild(newSharePost);

  let newPostLiker = document.createElement("div");
  newPostLiker.classList.add("post-liker");
  newPostInteractContainerSection.appendChild(newPostLiker);

  let newLikeAmountPost = document.createElement("span");
  newLikeAmountPost.classList.add("like-amount-post");
  newLikeAmountPost.textContent = likes.length + "個讚";
  newPostLiker.appendChild(newLikeAmountPost);

  let newPostTime = document.createElement("span");
  newPostTime.classList.add("show-post-time");
  newPostTime.textContent = timeDifference(date);
  newPostLiker.appendChild(newPostTime);

  let newLeaveCommentContainerSection = document.createElement("section");
  newLeaveCommentContainerSection.classList.add("leave-comment-container");
  commentContainer.appendChild(newLeaveCommentContainerSection);

  let newLeaveComment = document.createElement("input");
  newLeaveComment.classList.add("leave-comment");
  newLeaveCommentContainerSection.appendChild(newLeaveComment);

  let newSubmitComment = document.createElement("button");
  newSubmitComment.classList.add("submit-comment");
  newSubmitComment.textContent = "發佈";
  newLeaveCommentContainerSection.appendChild(newSubmitComment);

  newPostCard.addEventListener("click", (e) => {
    postBlacksreen.style.display = "flex";
    newPostTable.style.display = "flex";
    closePostButton.addEventListener("click", () => {
      postBlacksreen.style.display = "none";
      newPostTable.style.display = "none";
    });
  });

  likePost(postId, newHeartPost, likes.length, newLikeAmountPost);

  submitComment(newUl, postId, newLeaveComment, newSubmitComment);
  createComment(newUl, comments);
  newMessagePost.addEventListener("click", () => {
    newLeaveComment.focus();
  });
}

function createComment(newUl, comments) {
  comments.forEach((comment) => {
    let newUserCommentLi = document.createElement("li");
    newUserCommentLi.classList.add("user-comment-li");
    newUl.prepend(newUserCommentLi);

    let newUserCommentContent = document.createElement("div");
    newUserCommentContent.classList.add("user-comment-content");
    newUserCommentLi.appendChild(newUserCommentContent);

    let newUserMainContent = document.createElement("div");
    newUserMainContent.classList.add("user-main-content");
    newUserCommentContent.appendChild(newUserMainContent);

    let newUserHeaderImg = document.createElement("img");
    newUserHeaderImg.classList.add("user-headerImg");
    newUserHeaderImg.src = comment.userID.headImg;
    newUserMainContent.appendChild(newUserHeaderImg);
    rediectToPersonalPage(newUserHeaderImg, comment.userID.username);

    let newContentArea = document.createElement("div");
    newContentArea.classList.add("content-area");
    newUserMainContent.appendChild(newContentArea);

    let newUserNameContentArea = document.createElement("span");
    newUserNameContentArea.classList.add("user-name-content-area");
    newUserNameContentArea.textContent = comment.userID.username;
    newContentArea.appendChild(newUserNameContentArea);
    rediectToPersonalPage(newUserNameContentArea, comment.userID.username);

    let newUserCommentContentArea = document.createElement("span");
    newUserCommentContentArea.classList.add("user-comment-content-area");
    newUserCommentContentArea.textContent = comment.content;
    newContentArea.appendChild(newUserCommentContentArea);

    let newOtherFunction = document.createElement("div");
    newOtherFunction.classList.add("other-function");
    newContentArea.appendChild(newOtherFunction);

    let newCommentTime = document.createElement("span");
    newCommentTime.classList.add("comment-time");
    newCommentTime.textContent = "1天";
    newOtherFunction.appendChild(newCommentTime);

    let newReply = document.createElement("span");
    newReply.classList.add("reply");
    newReply.textContent = "回覆";
    newOtherFunction.appendChild(newReply);
  });
}

function submitComment(newUl, postId, commentInput, commentSubmitButton) {
  commentSubmitButton.addEventListener("click", () => {
    fetch(`/newComment`, {
      method: "POST",
      body: JSON.stringify({
        postID: postId,
        comment: commentInput.value,
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
          data = data.data;
          let comments = [
            {
              content: commentInput.value,
              userID: { headImg: data.headImg, username: data.username },
            },
          ];
          createComment(newUl, comments);
          sendNotice(
            data.username,
            data.userID,
            data.username +
              "對你的貼文" +
              data.postID +
              "留言：" +
              commentInput.value,
            data.targetUserID
          );
          commentInput.value = "";
        } else {
          alert("上傳失敗");
        }
      });
  });
}

function fetchLikePost(postId, dislike) {
  fetch(`/likePost`, {
    method: "POST",
    body: JSON.stringify({
      postID: postId,
      dislike: dislike,
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
      if (data.like == true) {
        sendNotice(
          data.data.liker,
          data.data.likerID,
          data.data.liker + "喜歡你的貼文" + data.data.postID,
          data.data.targetUserID
        );
      }
    });
}

function likePost(postId, newHeartPost, likesAmount, newLikeAmountPost) {
  let isLike = 0;

  fetch(`/checkUserLike`, {
    method: "POST",
    body: JSON.stringify({
      postID: postId,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.data != 0) {
        isLike = 1;
        newHeartPost.src = "/image/heart3.png";
        newLikeAmountPost.textContent = likesAmount + "個讚";
      }
      newHeartPost.addEventListener("click", () => {
        if (isLike == 0) {
          newHeartPost.src = "/image/heart3.png";

          if (data.data != 0) {
            newLikeAmountPost.textContent = likesAmount + "個讚";
          } else {
            newLikeAmountPost.textContent = likesAmount + 1 + "個讚";
          }

          fetchLikePost(postId, false);
          isLike++;
        } else {
          newHeartPost.src = "/image/heart.png";

          if (data.data != 0) {
            newLikeAmountPost.textContent = likesAmount - 1 + "個讚";
          } else {
            newLikeAmountPost.textContent = likesAmount + "個讚";
          }

          fetchLikePost(postId, true);
          isLike--;
        }
      });
    });
}
