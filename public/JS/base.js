const searchBar = document.querySelector(".serch-bar input");
const homePage = document.querySelector(".home-page");
const homePageImg = document.querySelector(".home-page img");
const inboxPage = document.querySelector(".inbox-page");
const inboxPageImg = document.querySelector(".inbox-page img");
const postButtonImg = document.querySelector(".post img");
const heart = document.querySelector(".heart");
const heartImg = document.querySelector(".heart img");
const personal = document.querySelector(".personal");
const personalImg = document.querySelector(".personal img");
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
const postHeader1 = document.querySelector(".post-header");

const postUndo2 = document.querySelector(".undo-2");
const postNextStep2 = document.querySelector(".next-step-2");
const postHr = document.querySelector(".post-hr");
const postCancel = document.querySelector(".cancel-container");
const cancelButton = document.querySelector(".cancel-button");
const notCancelButton = document.querySelector(".ont-cancel-button");
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
  postCancel.style.display = "flex";
  cancelButton.addEventListener("click", () => {
    location.href = location.pathname;
  });
  notCancelButton.addEventListener("click", () => {
    postCancel.style.display = "none";
  });
});

heart.addEventListener("click", () => {
  changeIcon("heartImg");
  heartImg.src = "../image/heart2.png";
});

postImageInput.addEventListener("change", (eve) => {
  let imageFile = eve.target.files[0];
  let reader = new FileReader();

  reader.addEventListener("load", () => {
    let base64Img = reader.result;
    postingArea.style.display = "none";
    postCutting.style.display = "flex";
    postPreveiw.src = base64Img;
    postTitle.textContent = "裁切";
    postNextStep.style.display = "flex";
    postUndo.style.display = "flex";

    postUndo.addEventListener("click", () => {
      postingArea.style.display = "flex";
      postCutting.style.display = "none";
      postPreveiw.src = "";
      postTitle.textContent = "選擇圖片";
      postNextStep.style.display = "none";
      postUndo.style.display = "none";
    });

    postNextStep.addEventListener("click", () => {
      postUndo.style.display = "none";
      postUndo2.style.display = "flex";
      postNextStep.style.display = "none";
      postNextStep2.style.display = "flex";

      postUndo2.addEventListener("click", () => {
        postUndo.style.display = "flex";
        postUndo2.style.display = "none";
        postNextStep.style.display = "flex";
        postNextStep2.style.display = "none";
        postCutting.style.padding = "none";
        postCutting.style.height = "580px";
        postMessage.style.display = "none";
        postHr.style.display = "none";
      });

      postHr.style.display = "block";

      postTitle.textContent = "建立新貼文";
      postCutting.style.padding = "20px";
      postCutting.style.height = "auto";
      postMessage.style.display = "flex";

      postNextStep2.addEventListener("click", () => {
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

async function checkLonin() {
  return await fetch(`/checkLogin`, {
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
      if (data.ok == false) {
        return;
      }
      data = data.data;
      personalImg.src = data.headImg;
      personalImg.addEventListener("click", () => {
        location.href = `/personal/${data.name}`;
      });
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}

checkLonin();
