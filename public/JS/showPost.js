const postBlacksreen = document.querySelector(".show-post-blacksreen");
const closePostButton = document.querySelector(".close-post-button");

// function rediectToPersonalPage(container, targetName) {
//   container.addEventListener("click", () => {
//     location.href = `/personal/${targetName}`;
//   });
// }

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
