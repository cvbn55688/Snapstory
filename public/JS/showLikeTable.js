const likeBlackscreen = document.querySelector(".like-blackscreen");
const postLikeTable = document.querySelector(".post-like-table");
const likeClose = document.querySelector(".like-close");

function getPostLike(postID) {
  console.log(postID);
  fetch(`/getParticularPost?postID=${postID}`, {
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
        likeBlackscreen.style.display = "flex";

        let newLikeUl = document.createElement("ul");
        newLikeUl.classList.add("like-ul");
        postLikeTable.appendChild(newLikeUl);

        data.postData.likes.forEach((liker) => {
          console.log(liker);
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

        likeClose.addEventListener("click", () => {
          newLikeUl.remove();
          likeBlackscreen.style.display = "none";
        });
      }
    });
}
