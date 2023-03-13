const likeBlackscreen = document.querySelector(".like-blackscreen");
const postLikeTable = document.querySelector(".post-like-table");
const likeClose = document.querySelector(".like-close");

function getPostLike(postID) {
  likeBlackscreen.style.display = "flex";

  // console.log(postID);
  fetch(`/api/post/${postID}`, {
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
      if (data.ok) {
        let newLikeUl = document.createElement("ul");
        newLikeUl.classList.add("like-ul");
        postLikeTable.appendChild(newLikeUl);

        data.postData.likes.forEach((liker) => {
          // console.log(liker);
          let newLi = document.createElement("li");
          newLikeUl.appendChild(newLi);
          rediectToPersonalPage(newLi, liker.userID._id);

          let newLikerImg = document.createElement("img");
          newLikerImg.src = liker.userID.headImg;
          newLi.appendChild(newLikerImg);

          let newLikerName = document.createElement("p");
          newLikerName.textContent = liker.userID.username;
          newLi.appendChild(newLikerName);
        });

        document.addEventListener("click", closeBlackScreen);

        function closeBlackScreen(e) {
          if (e.target.classList.contains("like-blackscreen")) {
            newLikeUl.remove();
            likeBlackscreen.style.display = "none";
            document.removeEventListener("click", closeBlackScreen);
          }
        }

        likeClose.addEventListener("click", () => {
          newLikeUl.remove();
          likeBlackscreen.style.display = "none";
        });
      }
    });
}
