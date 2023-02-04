const articleContainer = document.querySelector(".article-container");
const postBlacksreen = document.querySelector(".show-post-blacksreen");
const closePostButton = document.querySelector(".close-post-button");

function rediectToPersonalPage(container, targetName) {
  container.addEventListener("click", () => {
    location.href = `/personal/${targetName}`;
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
        checkLonin().then(function (senderData) {
          console.log(senderData);
          sendNotice(
            "like",
            data.data.liker,
            data.data.likerID,
            senderData.headImg,
            null,
            "剛剛",
            data.data.targetUserID,
            data.data.postImg
          );
        });
      }
    });
}

function likePost(
  postId,
  newHeart,
  newContent,
  newPostHeart,
  newHeartPost,
  newLikeAmount,
  likesAmount,
  newLikeAmountPost
) {
  let isLike = 0;
  let touchTime = 0;

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
      if (response.status == 400) {
        location.href = "/login";
        return;
      }
      return response.json();
    })
    .then(function (data) {
      if (data.data != 0) {
        isLike = 1;
        newHeart.src = "/image/heart3.png";
        newHeartPost.src = "/image/heart3.png";

        newLikeAmount.textContent = likesAmount;
        newLikeAmountPost.textContent = likesAmount + "個讚";
      }
      newHeartPost.addEventListener("click", () => {
        if (isLike == 0) {
          newHeart.src = "/image/heart3.png";
          newHeartPost.src = "/image/heart3.png";

          if (data.data != 0) {
            newLikeAmount.textContent = likesAmount;
            newLikeAmountPost.textContent = likesAmount + "個讚";
          } else {
            newLikeAmount.textContent = likesAmount + 1;
            newLikeAmountPost.textContent = likesAmount + 1 + "個讚";
          }

          fetchLikePost(postId, false);
          newPostHeart.style.display = "flex";
          setTimeout(() => {
            newPostHeart.style.display = "none";
          }, 1000);
          isLike++;
        } else {
          newHeart.src = "/image/heart.png";
          newHeartPost.src = "/image/heart.png";

          if (data.data != 0) {
            newLikeAmount.textContent = likesAmount - 1;
            newLikeAmountPost.textContent = likesAmount - 1 + "個讚";
          } else {
            newLikeAmount.textContent = likesAmount;
            newLikeAmountPost.textContent = likesAmount + "個讚";
          }

          fetchLikePost(postId, true);
          isLike--;
        }
      });
      newHeart.addEventListener("click", () => {
        if (isLike == 0) {
          newHeart.src = "/image/heart3.png";
          newHeartPost.src = "/image/heart3.png";

          if (data.data != 0) {
            newLikeAmount.textContent = likesAmount;
            newLikeAmountPost.textContent = likesAmount + "個讚";
          } else {
            newLikeAmount.textContent = likesAmount + 1;
            newLikeAmountPost.textContent = likesAmount + 1 + "個讚";
          }

          fetchLikePost(postId, false);
          newPostHeart.style.display = "flex";
          setTimeout(() => {
            newPostHeart.style.display = "none";
          }, 1000);
          isLike++;
        } else {
          newHeart.src = "/image/heart.png";
          newHeartPost.src = "/image/heart.png";

          if (data.data != 0) {
            newLikeAmount.textContent = likesAmount - 1;
            newLikeAmountPost.textContent = likesAmount - 1 + "個讚";
          } else {
            newLikeAmount.textContent = likesAmount;
            newLikeAmountPost.textContent = likesAmount + "個讚";
          }

          fetchLikePost(postId, true);
          isLike--;
        }
      });

      newContent.addEventListener("click", () => {
        if (touchTime == 0) {
          touchTime = new Date().getTime();
        } else {
          if (new Date().getTime() - touchTime < 800) {
            if (isLike == 0) {
              newHeart.src = "/image/heart3.png";
              newHeartPost.src = "/image/heart3.png";

              if (data.data != 0) {
                newLikeAmount.textContent = likesAmount;
                newLikeAmountPost.textContent = likesAmount + "個讚";
              } else {
                newLikeAmount.textContent = likesAmount + 1;
                newLikeAmountPost.textContent = likesAmount + 1 + "個讚";
              }

              fetchLikePost(postId, false);
              newPostHeart.style.display = "flex";
              setTimeout(() => {
                newPostHeart.style.display = "none";
              }, 1000);
              isLike++;
            } else {
              newHeart.src = "/image/heart.png";
              newHeartPost.src = "/image/heart.png";

              if (data.data != 0) {
                newLikeAmount.textContent = likesAmount - 1;
                newLikeAmountPost.textContent = likesAmount - 1 + "個讚";
              } else {
                newLikeAmount.textContent = likesAmount;
                newLikeAmountPost.textContent = likesAmount + "個讚";
              }

              fetchLikePost(postId, true);
              isLike--;
            }
            touchTime = 0;
          } else {
            touchTime = new Date().getTime();
          }
        }
      });
    });
}

function createPost(
  postId,
  userName,
  headerImg,
  postImgUrl,
  posterMessage,
  comments,
  likes,
  time
) {
  let date = new Date(time);

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
  newPosterHeaderImg.addEventListener("click", () => {
    location.href = `/personal/${userName}`;
  });

  let posterName = document.createElement("p");
  posterName.classList.add("poster-name");
  posterName.textContent = userName;
  newPoster.appendChild(posterName);
  posterName.addEventListener("click", () => {
    location.href = `/personal/${userName}`;
  });

  let postDots = document.createElement("img");
  postDots.classList.add("post-dots");
  postDots.src = "/image/dots.png";
  newPoster.appendChild(postDots);

  let newContent = document.createElement("section");
  newContent.classList.add("content");
  newPostContainer.appendChild(newContent);

  let newPostImg = document.createElement("img");
  newPostImg.classList.add("post-img");
  newPostImg.src = postImgUrl;
  newContent.appendChild(newPostImg);

  let newPostHeart = document.createElement("img");
  newPostHeart.classList.add("post-heart");
  newPostHeart.src = "/image/heart3.png";
  newContent.appendChild(newPostHeart);

  let newComment = document.createElement("section");
  newComment.classList.add("comment");
  newPostContainer.appendChild(newComment);

  let newUserInteracte = document.createElement("div");
  newUserInteracte.classList.add("user-interacte");
  newComment.appendChild(newUserInteracte);

  let newHeart = document.createElement("img");
  newHeart.src = "/image/heart.png";
  newHeart.classList.add("heart-index");
  newUserInteracte.appendChild(newHeart);

  let newMessage = document.createElement("img");
  newMessage.src = "/image/message.png";
  newMessage.classList.add("messagge-index");
  newUserInteracte.appendChild(newMessage);

  let newShare = document.createElement("img");
  newShare.src = "/image/share.png";
  newShare.classList.add("share-index");
  newUserInteracte.appendChild(newShare);

  let userLike = document.createElement("div");
  userLike.classList.add("user-likes");
  newComment.appendChild(userLike);

  let newLikeAmount = document.createElement("span");
  newLikeAmount.classList.add("like-amount");
  newLikeAmount.textContent = likes.length;
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

  let newPostTime = document.createElement("p");
  newPostTime.classList.add("post-time");
  newPostTime.textContent = timeDifference(date);
  newPostMessageDiv.appendChild(newPostTime);

  //5454564
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
  newLikeAmountPost.textContent = "123" + "個讚";
  newPostLiker.appendChild(newLikeAmountPost);

  let newShowPostTime = document.createElement("span");
  newShowPostTime.classList.add("show-post-time");
  newShowPostTime.textContent = timeDifference(date);
  newPostLiker.appendChild(newShowPostTime);

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

  newMessage.addEventListener("click", (e) => {
    postBlacksreen.style.display = "flex";
    newPostTable.style.display = "flex";
    closePostButton.addEventListener("click", () => {
      postBlacksreen.style.display = "none";
      newPostTable.style.display = "none";
    });
  });

  likePost(
    postId,
    newHeart,
    newContent,
    newPostHeart,
    newHeartPost,
    newLikeAmount,
    likes.length,
    newLikeAmountPost
  );

  submitComment(newUl, postId, newLeaveComment, newSubmitComment);
  createComment(newUl, comments);
  newMessagePost.addEventListener("click", () => {
    newLeaveComment.focus();
  });
}

function getData() {
  fetch(`/getData`, {
    method: "GET",
  })
    .then(function (response) {
      if (response.status == 400) {
        location.href = "/login";
        return;
      }
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
          post._id,
          post.userID.username,
          post.userID.headImg,
          post.imageUrl,
          post.content,
          post.comments,
          post.likes,
          post.time
        );
        // console.log(post);
      });
    });
}

// function checkLonin() {
//   fetch(`/checkLogin`, {
//     method: "GET",
//   })
//     .then(function (response) {
//       if (response.status == 400) {
//         location.href = "/login";
//         return;
//       }
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//     });
// }

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
            "comment",
            data.username,
            data.userID,
            data.headImg,
            data.newComment,
            "剛剛",
            data.targetUserID,
            data.postImg
          );
          commentInput.value = "";
        } else {
          alert("上傳失敗");
        }
      });
  });
}

// async function getUserInfo() {
//   let userInfo = await checkLonin();
//   console.log(userInfo);
// }

getData();
// getUserInfo();
