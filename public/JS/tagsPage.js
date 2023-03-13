const tagsInfoHeadImg = document.querySelector(".tags-info-headImg");
const tagsName = document.querySelector(".tags-name");
const tagsPostsSection = document.querySelector(".tags-posts");
const tagsPostsAmount = document.querySelector(".post-amount");
const followButton = document.querySelector(".follow");
const unfollowButton = document.querySelector(".isfollowed");
const followLoading = document.querySelector(".follow img");
const settagsData = document.querySelector(".set-tags-data");
const isfollowedButton = document.querySelector(".isfollowed");
const noPostDiv = document.querySelector(".no-post");

function loadPostImg(postArray) {
  tagsPostsAmount.textContent = postArray.length;
  postArray.forEach((post) => {
    // console.log(post);
    let newPostCard = document.createElement("a");
    newPostCard.classList.add("post-card");
    tagsPostsSection.prepend(newPostCard);

    let newPostCardImg = document.createElement("img");
    newPostCardImg.src = post.postID.imageUrl[0];
    newPostCard.appendChild(newPostCardImg);

    newPostCard.addEventListener("click", () => {
      createParticularPost(post.postID._id);
    });
  });
}

function getTagsData() {
  fetch(`/api/${location.pathname.split("/")[2]}`, {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      if (data.ok == true) {
        if (data.data == null) {
          noPostDiv.style.display = "flex";
          return;
        }
        tagsPosts = data.data.posts;
        // console.log(tagsPosts);
        loadPostImg(tagsPosts);
        tagsInfoHeadImg.src =
          tagsPosts[tagsPosts.length - 1].postID.imageUrl[0];
        tagsName.textContent = "#" + data.data.tagName;
        // checkLonin().then(function (data) {
        //   if (tagsData._id == data.tagsID) {
        //     followButton.style.display = "none";
        //     sendMessageButton.style.display = "none";
        //     settagsData.style.display = "flex";
        //   }
        // });
        // followButton.addEventListener("click", () => {
        //   followLoading.style.display = "flex";
        //   follow(tagsData._id, fansAmount.textContent, true);
        // });
        // unfollowButton.addEventListener("click", () => {
        //   let ensureUnfollow = confirm("確定要退追？");
        //   if (ensureUnfollow == true) {
        //     followLoading.style.display = "flex";
        //     follow(tagsData._id, fansAmount.textContent, false);
        //   }
        // });
      }
    });
}

getTagsData();
