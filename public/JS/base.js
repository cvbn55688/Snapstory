const searchBar = document.querySelector(".serch-bar input");
const homePage = document.querySelector(".home-page");
const homePageImg = document.querySelector(".home-page img");
const inboxPage = document.querySelector(".inbox-page");
const inboxPageImg = document.querySelector(".inbox-page img");
const postButtonImg = document.querySelector(".post img");
const heart = document.querySelector(".heart");
const heartImg = document.querySelector(".heart img");
const showPost = document.querySelector(".show-post");
const postContainer = document.querySelector(".posting");
const postLeaveButton = document.querySelector(".post-leave-img");
const postImageInput = document.querySelector(".post-image");
const postingArea = document.querySelector(".posting-area");
const postCutting = document.querySelector(".cutting");
const postPreveiw = document.querySelector(".preveiw");
const postTitle = document.querySelector(".post-title");
const postNextStep = document.querySelector(".next-step");
const postUndo = document.querySelector(".undo");
const postMessage = document.querySelector(".post-message");
const postMessageTextarea = document.querySelector(".user-message-textarea");
// const postTextarea = document.querySelector(".")
// const preveiwImageContainer = document.querySelector(
//   ".preveiw-image-container"
// );
// const previewContainer = document.querySelector(".preview-container");
// const previewPostImg = document.querySelector(".preview-post-img");

function changeIcon(targetIcon) {
  let icons = ["homePageImg", "inboxPageImg", "heartImg", "postButtonImg"];
  icons.forEach((icon) => {
    if (icon == "homePageImg" && icon != targetIcon) {
      homePageImg.src = "../image/home.png";
    } else if (icon == "inboxPageImg" && icon != targetIcon) {
      inboxPageImg.src = "../image/message.png";
    } else if (icon == "heartImg" && icon != targetIcon) {
      heartImg.src = "../image/heart.png";
    } else if (icon == "postButtonImg" && icon != targetIcon) {
      postButtonImg.src = "../image/post.png";
    }
  });
}

searchBar.addEventListener("focus", () => {
  searchBar.style.backgroundImage = "none";
});

searchBar.addEventListener("blur", () => {
  if (searchBar.value == "") {
    searchBar.style.backgroundImage = "url('../image/search.png')";
  }
});

homePage.addEventListener("click", () => {
  let origin = document.location.origin;
  if (document.location.href == origin + "/") {
    changeIcon("homePageImg");
    homePageImg.src = "../image/home2.png";
  } else {
    document.location.href = "/";
  }
});

inboxPage.addEventListener("click", () => {
  let origin = document.location.origin;
  if (document.location.href == origin + "/inbox") {
    changeIcon("inboxPageImg");
    inboxPageImg.src = "../image/message2.png";
  } else {
    document.location.href = "/inbox";
  }
});

postButtonImg.addEventListener("click", (e) => {
  changeIcon("postButtonImg");
  postButtonImg.src = "../image/post2.png";
  showPost.style.display = "flex";
});

postLeaveButton.addEventListener("click", () => {
  showPost.style.display = "none";
  if (document.location.pathname == "/") {
    changeIcon("homePageImg");
    homePageImg.src = "../image/home2.png";
  } else {
    changeIcon("inboxPageImg");
    inboxPageImg.src = "../image/message2.png";
  }
});

heart.addEventListener("click", () => {
  changeIcon("heartImg");
  heartImg.src = "../image/heart2.png";
});

postImageInput.addEventListener("change", (eve) => {
  let imageFile = eve.target.files[0];
  let reader = new FileReader();
  console.log("Test");

  reader.addEventListener("load", () => {
    let base64Img = reader.result;
    postingArea.style.display = "none";
    postCutting.style.display = "flex";
    postPreveiw.src = base64Img;
    postTitle.textContent = "裁切";
    postNextStep.style.display = "flex";
    postUndo.style.display = "flex";

    // postUndo.addEventListener("click", () => {
    //   console.log("test");
    //   postingArea.style.display = "flex";
    //   postCutting.style.display = "none";
    //   postPreveiw.src = "";
    //   postTitle.textContent = "建立新貼文";
    //   postNextStep.style.display = "none";
    //   postUndo.style.display = "none";
    // });

    postNextStep.addEventListener("click", () => {
      // preveiwImageContainer.style.display = "none";
      // previewContainer.style.display = "flex";
      // previewPostImg.style.src = base64Img;
      // postContainer.style.width = "780px";
      // postCutting.style.display = "grid";
      // postCutting.style.gridTemplateColumns = "2fr 1fr";

      let newHr = document.createElement("hr");
      postContainer.appendChild(newHr);

      postTitle.textContent = "建立新貼文";
      postCutting.style.padding = "20px";
      postCutting.style.height = "auto";
      postMessage.style.display = "flex";
      postNextStep.textContent = "建立";

      postNextStep.addEventListener("click", () => {
        fetch(`/uploadPost`, {
          method: "POST",
          body: JSON.stringify({
            base64Img: base64Img,
            message: postMessageTextarea.value,
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
              alert("上傳成功");
              location.reload();
            }
          });
      });
    });
  });

  reader.readAsDataURL(imageFile);
});
