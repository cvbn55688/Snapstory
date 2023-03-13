const articleContainer = document.querySelector(".article-container");
const postBlacksreenIndex = document.querySelector(
  ".show-post-blacksreen-index"
);
const closePostButtonIndex = document.querySelector(".close-post-button-index");
closePostButtonIndex.src = "/image/x.png";

function createPost(
  postID,
  userID,
  userName,
  headerImg,
  postImgUrlArr,
  posterMessage,
  comments,
  likes,
  time,
  hashtagArr,
  currentUserID
) {
  let date = new Date(time);
  let postData = {
    postID,
    postImg: postImgUrlArr[0],
    poster: { userID, userName, headerImg },
  };

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
  newPosterHeaderImg.src = headerImg + vTime;
  newPoster.appendChild(newPosterHeaderImg);
  newPosterHeaderImg.addEventListener("click", () => {
    location.href = `/personal/${userID}`;
  });

  let posterName = document.createElement("p");
  posterName.classList.add("poster-name");
  posterName.textContent = userName;
  newPoster.appendChild(posterName);
  posterName.addEventListener("click", () => {
    location.href = `/personal/${userID}`;
  });

  let postDots = document.createElement("img");
  postDots.classList.add("post-dots");
  postDots.src = "/image/dots.png";
  // newPoster.appendChild(postDots);

  let newContent = document.createElement("section");
  newContent.classList.add("content");
  newPostContainer.appendChild(newContent);

  let newPostPreviousArrow = document.createElement("img");
  newPostPreviousArrow.src = "/image/leftArrow.png";
  newPostPreviousArrow.classList.add("post-previous-arrow");
  newContent.appendChild(newPostPreviousArrow);

  let newPostnextArrow = document.createElement("img");
  newPostnextArrow.src = "/image/rightArrow.png";
  newPostnextArrow.classList.add("post-next-arrow");
  newContent.appendChild(newPostnextArrow);

  let newPostDots = document.createElement("div");
  newPostDots.classList.add("post-dots");
  newContent.appendChild(newPostDots);

  let imageHeights = [];
  if (postImgUrlArr.length == 1) {
    let newPostImg = document.createElement("img");
    newPostImg.classList.add("post-img");
    newPostImg.src = postImgUrlArr;
    newContent.appendChild(newPostImg);
    newPostImg.addEventListener("load", () => {
      imageHeights.push(newPostImg.height);
      newContent.style.height = Math.max(...imageHeights) + "px";
    });
  } else {
    newPostPreviousArrow.style.display = "block";
    newPostnextArrow.style.display = "block";
    newPostDots.style.display = "flex";
    postImgUrlArr.forEach((postImgUrl) => {
      let newPostImg = document.createElement("img");
      newPostImg.classList.add("post-img");
      newPostImg.src = postImgUrl;
      newContent.appendChild(newPostImg);
      newPostImg.addEventListener("load", () => {
        imageHeights.push(newPostImg.height);
        newContent.style.height = Math.max(...imageHeights) + "px";
      });

      let newPicDot = document.createElement("div");
      newPicDot.classList.add("pic-dot");
      newPostDots.appendChild(newPicDot);

      let PostImg = Array.from(newContent.childNodes).slice(3);
      let PicDot = newPostDots.childNodes;
      if (PostImg.length === postImgUrlArr.length) {
        changePicOrder(PostImg, PicDot, newPostPreviousArrow, newPostnextArrow);
      }
    });
  }

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
  // newMessage.addEventListener("click", (e) => {
  //   createParticularPost(postID);
  // });

  let newShare = document.createElement("img");
  newShare.src = "/image/share.png";
  newShare.classList.add("share-index");
  newUserInteracte.appendChild(newShare);
  newShare.addEventListener("click", () => {
    sharePost(postData);
  });

  let userLike = document.createElement("div");
  userLike.classList.add("user-likes");
  newComment.appendChild(userLike);
  userLike.addEventListener("click", () => {
    getPostLike(postID);
  });

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
  rediectToPersonalPage(newPosterName, userID);

  let newPosterMessage = document.createElement("span");
  newPosterMessage.textContent = posterMessage;
  newPostMessageDiv.appendChild(newPosterMessage);

  if (comments.length != 0) {
    let newCommentAmount = document.createElement("div");
    newCommentAmount.classList.add("comment-amount");
    newPostMessageDiv.appendChild(newCommentAmount);

    let newCommentAmountP = document.createElement("p");
    newCommentAmountP.textContent = "查看全部" + comments.length + "則留言";
    newCommentAmount.appendChild(newCommentAmountP);

    newCommentAmount.addEventListener("click", (e) => {
      postBlacksreenIndex.style.display = "flex";
      newPostTable.style.display = "flex";
      document.addEventListener("click", closeBlackScreen);
    });
  }

  let newPostTime = document.createElement("p");
  newPostTime.classList.add("post-time");
  newPostTime.textContent = timeDifference(date);
  newPostMessageDiv.appendChild(newPostTime);

  //5454564
  let newPostTable = document.createElement("div");
  newPostTable.classList.add("post-table");
  newPostTable.setAttribute("id", postID);
  postBlacksreenIndex.appendChild(newPostTable);

  let newPostImageContainer = document.createElement("div");
  newPostImageContainer.classList.add("post-image-container");
  newPostTable.appendChild(newPostImageContainer);

  let newShowPostPreviousArrow = document.createElement("img");
  newShowPostPreviousArrow.src = "/image/leftArrow.png";
  newShowPostPreviousArrow.classList.add("show-post-previous-arrow");
  newPostImageContainer.appendChild(newShowPostPreviousArrow);

  let newShowPostnextArrow = document.createElement("img");
  newShowPostnextArrow.src = "/image/rightArrow.png";
  newShowPostnextArrow.classList.add("show-post-next-arrow");
  newPostImageContainer.appendChild(newShowPostnextArrow);

  let newShowPostDots = document.createElement("div");
  newShowPostDots.classList.add("show-post-dots");
  newPostImageContainer.appendChild(newShowPostDots);

  if (postImgUrlArr.length == 1) {
    let newPostImg = document.createElement("img");
    newPostImg.classList.add("show-post-image");
    newPostImg.src = postImgUrlArr;
    newPostImageContainer.appendChild(newPostImg);
  } else {
    newShowPostPreviousArrow.style.display = "block";
    newShowPostnextArrow.style.display = "block";
    newShowPostDots.style.display = "flex";
    postImgUrlArr.forEach((postImgUrl) => {
      let newPostImg = document.createElement("img");
      newPostImg.classList.add("show-post-image");
      newPostImg.src = postImgUrl;
      newPostImageContainer.appendChild(newPostImg);

      let newPicDot = document.createElement("div");
      newPicDot.classList.add("show-pic-dot");
      newShowPostDots.appendChild(newPicDot);

      let PostImg = Array.from(newPostImageContainer.childNodes).slice(3);
      let PicDot = newShowPostDots.childNodes;

      if (PostImg.length === postImgUrlArr.length) {
        changePicOrder(
          PostImg,
          PicDot,
          newShowPostPreviousArrow,
          newShowPostnextArrow
        );
      }
    });
  }

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
  newPosterHeaderImgPost.src = headerImg + vTime;
  newPosterTitle.appendChild(newPosterHeaderImgPost);
  rediectToPersonalPage(newPosterHeaderImgPost, userID);

  let newPosterContent = document.createElement("div");
  newPosterContent.classList.add("poster-content");
  newPosterTitle.appendChild(newPosterContent);

  let newPosterNameP = document.createElement("p");
  newPosterNameP.classList.add("poster-name");
  newPosterNameP.textContent = userName;
  newPosterContent.appendChild(newPosterNameP);
  rediectToPersonalPage(newPosterNameP, userID);

  let newPosterMessageP = document.createElement("p");
  newPosterMessageP.classList.add("poster-message");
  newPosterMessageP.textContent = posterMessage;
  newPosterContent.appendChild(newPosterMessageP);

  let newDots = document.createElement("img");
  newDots.classList.add("dots");
  newDots.src = "/image/dots.png";
  // newPosterTitle.appendChild(newDots);

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
  newSharePost.addEventListener("click", () => {
    sharePost(postData);
  });

  let newHashtagContainer = document.createElement("div");
  newHashtagContainer.classList.add("hashtag-container-post");
  newPostInteract.appendChild(newHashtagContainer);

  let newHashtagUl = document.createElement("ul");
  newHashtagContainer.appendChild(newHashtagUl);

  hashtagArr.forEach((hashtag) => {
    let newHashtagLi = document.createElement("li");
    newHashtagLi.textContent = "#" + hashtag;
    newHashtagUl.appendChild(newHashtagLi);

    newHashtagLi.addEventListener("click", () => {
      location.href = `/tags/${hashtag}`;
    });
  });

  let newPostLiker = document.createElement("div");
  newPostLiker.classList.add("post-liker");
  newPostInteractContainerSection.appendChild(newPostLiker);

  let newLikeAmountPost = document.createElement("span");
  newLikeAmountPost.classList.add("like-amount-post");
  newLikeAmountPost.textContent = likes.length + "個讚";
  newPostLiker.appendChild(newLikeAmountPost);
  newLikeAmountPost.addEventListener("click", () => {
    getPostLike(postID);
  });

  let newShowPostTime = document.createElement("span");
  newShowPostTime.classList.add("show-post-time");
  newShowPostTime.textContent = timeDifference(date);
  newPostLiker.appendChild(newShowPostTime);

  let newLeaveCommentContainerSection = document.createElement("section");
  newLeaveCommentContainerSection.classList.add("leave-comment-container");
  commentContainer.appendChild(newLeaveCommentContainerSection);

  let newTagSearchTable = document.createElement("div");
  newTagSearchTable.classList.add("tagSearch");
  newLeaveCommentContainerSection.appendChild(newTagSearchTable);

  let tagSearchLoadingImg = document.createElement("img");
  tagSearchLoadingImg.classList.add("tagSearch-Table-loading-image");
  tagSearchLoadingImg.src = "/image/loading.gif";
  newTagSearchTable.appendChild(tagSearchLoadingImg);

  let tagSearchUl = document.createElement("ul");
  newTagSearchTable.appendChild(tagSearchUl);

  let newLeaveComment = document.createElement("input");
  newLeaveComment.classList.add("leave-comment");
  newLeaveCommentContainerSection.appendChild(newLeaveComment);

  let newSubmitComment = document.createElement("button");
  newSubmitComment.classList.add("submit-comment");
  newSubmitComment.textContent = "發佈";
  newLeaveCommentContainerSection.appendChild(newSubmitComment);

  newMessage.addEventListener("click", (e) => {
    postBlacksreenIndex.style.display = "flex";
    newPostTable.style.display = "flex";
    document.addEventListener("click", closeBlackScreen);
  });
  closePostButtonIndex.addEventListener("click", () => {
    postBlacksreenIndex.style.display = "none";
    newPostTable.style.display = "none";
  });

  function closeBlackScreen(e) {
    if (e.target.classList.contains("show-post-blacksreen-index")) {
      postBlacksreenIndex.style.display = "none";
      newPostTable.style.display = "none";
      document.removeEventListener("click", closeBlackScreen);
    }
  }

  likePostIndex(
    postID,
    newHeart,
    newContent,
    newPostHeart,
    newHeartPost,
    newLikeAmount,
    likes.length,
    newLikeAmountPost
  );

  submitCommentIndex(
    newUl,
    postID,
    newLeaveComment,
    newSubmitComment,
    currentUserID
  );
  createCommentIndex(
    postID,
    newLeaveComment,
    newUl,
    comments,
    currentUserID,
    newTagSearchTable,
    tagSearchUl,
    tagSearchLoadingImg
  );
  newMessagePost.addEventListener("click", () => {
    newLeaveComment.focus();
  });

  newLeaveComment.addEventListener("input", () => {
    // console.log(newLeaveComment.value.slice(-1));
    if (newLeaveComment.value.slice(-1) == "@") {
      openTagTable(
        newTagSearchTable,
        tagSearchUl,
        tagSearchLoadingImg,
        newLeaveComment
      );
    } else if (newLeaveComment.value.slice(-1) == " ") {
      newTagSearchTable.style.display = "none";
    }
  });
}

function createCommentIndex(
  postID,
  input,
  newUl,
  comments,
  currentUserID,
  table,
  ul,
  loadingImg
) {
  comments.forEach((comment) => {
    let date = new Date(comment.time);
    let commentUserID = comment.userID._id;

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
    newUserHeaderImg.src = comment.userID.headImg + vTime;
    newUserMainContent.appendChild(newUserHeaderImg);
    rediectToPersonalPage(newUserHeaderImg, comment.userID._id);

    let newContentArea = document.createElement("div");
    newContentArea.classList.add("content-area");
    newUserMainContent.appendChild(newContentArea);

    let newUserNameContentArea = document.createElement("span");
    newUserNameContentArea.classList.add("user-name-content-area");
    newUserNameContentArea.textContent = comment.userID.username;
    newContentArea.appendChild(newUserNameContentArea);
    rediectToPersonalPage(newUserNameContentArea, comment.userID._id);

    let newUserCommentContentArea = document.createElement("span");
    newUserCommentContentArea.classList.add("user-comment-content-area");
    newUserCommentContentArea.textContent = comment.content;
    newContentArea.appendChild(newUserCommentContentArea);

    let newEditCommentDiv = document.createElement("div");
    newEditCommentDiv.classList.add("edit-comment");
    newContentArea.appendChild(newEditCommentDiv);

    let newEditCommentInput = document.createElement("input");
    newEditCommentInput.classList.add("edit-comment-input");
    newEditCommentDiv.appendChild(newEditCommentInput);

    let newEditCommentSubmmit = document.createElement("p");
    newEditCommentSubmmit.classList.add("edit-comment-submmit");
    newEditCommentSubmmit.textContent = "完成";
    newEditCommentDiv.appendChild(newEditCommentSubmmit);

    let newOtherFunction = document.createElement("div");
    newOtherFunction.classList.add("other-function");
    newContentArea.appendChild(newOtherFunction);

    let newCommentTime = document.createElement("span");
    newCommentTime.classList.add("comment-time");
    newCommentTime.textContent = timeDifference(date);
    newOtherFunction.appendChild(newCommentTime);

    let newReply = document.createElement("span");
    newReply.classList.add("reply");
    newReply.textContent = "回覆";
    newOtherFunction.appendChild(newReply);
    newReply.addEventListener("click", () => {
      input.value = `@${comment.userID.username} `;
      input.focus();
    });
    if (commentUserID == currentUserID) {
      let newCommentDots = document.createElement("img");
      newCommentDots.classList.add("comment-dots");
      newCommentDots.src = "/image/dots2.png";
      newOtherFunction.appendChild(newCommentDots);

      function handleCommentEdit() {
        editComment(
          postID,
          comment._id,
          newUserCommentContentArea,
          newEditCommentDiv,
          newEditCommentInput,
          newEditCommentSubmmit,
          newUserCommentLi
        );
      }
      newCommentDots.addEventListener("click", handleCommentEdit);
    }

    newEditCommentInput.addEventListener("input", () => {
      // console.log(newLeaveComment.value.slice(-1));
      if (newEditCommentInput.value.slice(-1) == "@") {
        openTagTable(table, ul, loadingImg, newEditCommentInput);
      } else if (newEditCommentInput.value.slice(-1) == " ") {
        table.style.display = "none";
      }
    });
  });
}

function submitCommentIndex(
  newUl,
  postID,
  commentInput,
  commentSubmitButton,
  currentUserID
) {
  commentSubmitButton.addEventListener("click", () => {
    if (commentInput.value == "") {
      return;
    }
    fetch(`/api/post/comments`, {
      method: "POST",
      body: JSON.stringify({
        postID: postID,
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
          // console.log(data);
          let commentID = data.result.mes.comments.pop()._id;
          data = data.data;
          let comments = [
            {
              content: commentInput.value,
              userID: {
                headImg: data.headImg,
                username: data.username,
                _id: data.userID,
              },
              time: new Date(),
              _id: commentID,
            },
          ];
          let tagNameArr = commentInput.value.match(/@\w+/g);
          if (tagNameArr != null) {
            tagNameArr.forEach((tagName) => {
              searchUser(tagName.replace(/@/, "")).then((tagData) => {
                // console.log(tagData);
                let tagedUserID = tagData.data[0]._id;
                sendNotice(
                  "tag",
                  data.username,
                  data.userID,
                  data.headImg,
                  data.newComment,
                  "剛剛",
                  tagedUserID,
                  data.postImg,
                  postID
                );
              });
            });
          }

          createCommentIndex(
            postID,
            commentInput,
            newUl,
            comments,
            currentUserID
          );
          sendNotice(
            "comment",
            data.username,
            data.userID,
            data.headImg,
            data.newComment,
            "剛剛",
            data.targetUserID,
            data.postImg,
            postID
          );
          commentInput.value = "";
        } else {
          alert("上傳失敗");
        }
      });
  });
}

function fetchLikePostIndex(postID, dislike, likeUl) {
  fetch(`/api/post/like`, {
    method: "PUT",
    body: JSON.stringify({
      postID: postID,
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
      // console.log(data);
      if (data.like == true) {
        checkLonin().then(function (senderData) {
          sendNotice(
            "like",
            data.data.liker,
            data.data.likerID,
            senderData.headImg,
            null,
            "剛剛",
            data.data.targetUserID,
            data.data.postImg,
            postID
          );
        });
      }
    });
}

function likePostIndex(
  postID,
  newHeart,
  newContent,
  newPostHeart,
  newHeartPost,
  newLikeAmount,
  likesAmount,
  newLikeAmountPost,
  likeUl
) {
  let isLike = 0;
  let touchTime = 0;

  fetch(`/api/post/${postID}/likes`, {
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

          fetchLikePostIndex(postID, false, likeUl);
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

          fetchLikePostIndex(postID, true, likeUl);
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

          fetchLikePostIndex(postID, false);
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

          fetchLikePostIndex(postID, true);
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

              fetchLikePostIndex(postID, false);
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

              fetchLikePostIndex(postID, true);
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
