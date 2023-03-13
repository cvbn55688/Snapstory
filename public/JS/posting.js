function inputLoad(eve) {
  let imageFiles = Array.from(eve.target.files);
  setTimeout(() => {
    postImageInput.value = "";
  }, 100);
  let imageArr = [];
  if (imageFiles.length > 5) {
    alert("只能上傳五張圖片!!");
    return;
  }
  let isPass = true;
  imageFiles.forEach((data) => {
    if (data.size > 1024 * 1024 * 2) {
      alert("一張圖片不得超過2mb!!");
      isPass = false;
      return;
    }
  });

  if (isPass) {
    imageFiles.forEach((data) => {
      let reader = new FileReader();
      reader.readAsDataURL(data);
      reader.addEventListener("load", () => {
        imageArr.push(reader.result);
        let newImg = document.createElement("img");
        newImg.src = reader.result;
        newImg.classList.add("preview");
        previewImageContainer.appendChild(newImg);

        let newDotDiv = document.createElement("div");
        newDotDiv.classList.add("preview-dot");
        previewDotContainer.appendChild(newDotDiv);

        let previewImgs = document.querySelectorAll(".preview");
        let previewDot = document.querySelectorAll(".preview-dot");
        if (previewImgs.length === imageFiles.length) {
          changePicOrder(
            previewImgs,
            previewDot,
            postPreviewPreviousArrow,
            postPreviewNextArrow
          );
        }
      });
      if (imageFiles.length > 1) {
        postPreviewPreviousArrow.style.display = "block";
        postPreviewNextArrow.style.display = "block";
        previewDotContainer.style.display = "flex";
      }
      postingArea.style.display = "none";
      postCutting.style.display = "flex";
      postTitle.textContent = "預覽";
      postNextStep.style.display = "flex";
      postUndo.style.display = "flex";
      postUndo.addEventListener("click", handelPostUndo);
      postNextStep.addEventListener("click", handelPostNextStep);
    });
  }

  function handelPostUndo() {
    let previewImgs = document.querySelectorAll(".preview");
    let previewDot = document.querySelectorAll(".preview-dot");
    previewImgs.forEach((img) => {
      img.remove();
    });
    previewDot.forEach((dot) => {
      dot.remove();
    });
    postPreviewPreviousArrow.style.display = "none";
    postPreviewNextArrow.style.display = "none";
    // previewDotContainer.style.display = "none";
    postingArea.style.display = "flex";
    postCutting.style.display = "none";
    postTitle.textContent = "選擇圖片";
    postNextStep.style.display = "none";
    postUndo.style.display = "none";
    postUndo.removeEventListener("click", handelPostUndo);
    postNextStep.removeEventListener("click", handelPostNextStep);
  }

  function handelPostNextStep() {
    previewImageContainer.style.animation = "postImageMove 0.7s forwards";
    postHashTag.style.display = "block";
    postHashTag.style.animation = "showTable 0.8s forwards";
    postPreviewPreviousArrow.style.display = "none";
    postPreviewNextArrow.style.display = "none";
    previewDotContainer.style.display = "none";
    postUndo.style.display = "none";
    postUndo2.style.display = "flex";
    postNextStep.style.display = "none";
    postNextStep2.style.display = "flex";
    postTitle.textContent = "建立新貼文";
    postCutting.style.padding = "20px";
    postCutting.style.height = "330px";
    postCutting.style.overflow = "unset";
    previewImageContainer.style.height = "330px";
    postMessage.style.display = "flex";
    postMessage.style.animation = "showTable 0.8s forwards";
    postMessageTextarea.addEventListener("input", () => {
      // console.log(newLeaveComment.value.slice(-1));
      if (postMessageTextarea.value.slice(-1) == "@") {
        openTagTable(
          postMessageTagTable,
          postMessageTagUl,
          postMessageTagLoadimg,
          postMessageTextarea
        );
      } else if (postMessageTextarea.value.slice(-1) == " ") {
        postMessageTagTable.style.display = "none";
      }
    });
    // openHashtagTable();
    postNextStep2.addEventListener("click", uploadPost);
    postUndo2.addEventListener("click", handelPostUndo2);
  }

  function handelPostUndo2() {
    if (imageFiles.length > 1) {
      postPreviewPreviousArrow.style.display = "block";
      postPreviewNextArrow.style.display = "block";
      previewDotContainer.style.display = "flex";
    }
    previewImageContainer.style.animation = "";
    postHashTag.style.animation = "";
    postHashTag.style.display = "none";
    postUndo.style.display = "flex";
    postUndo2.style.display = "none";
    postNextStep.style.display = "flex";
    postNextStep2.style.display = "none";
    postCutting.style.padding = "none";
    postCutting.style.height = "580px";
    postCutting.style.overflow = "hidden";
    previewImageContainer.style.height = "550px";
    postMessage.style.display = "none";
    postHr.style.display = "none";
    postNextStep2.removeEventListener("click", uploadPost);
    postUndo2.removeEventListener("click", handelPostUndo2);
  }

  function uploadPost() {
    postNextStep2.style.display = "none";
    postUploadLoading.style.display = "block";
    let postHashtag = document.querySelectorAll(".hashtags-li");
    let postHashtagArr = [];
    postHashtag.forEach((hashtag) => {
      postHashtagArr.push(hashtag.innerText.replace("#", ""));
    });
    fetch(`/api/post`, {
      method: "POST",
      body: JSON.stringify({
        base64ImgArr: imageArr,
        message: postMessageTextarea.value,
        hashtagArr: postHashtagArr,
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
          let tagNameArr = postMessageTextarea.value.match(/@\w+/g);
          if (tagNameArr != null) {
            tagNameArr.forEach((tagName) => {
              searchUser(tagName.replace(/@/, "")).then((tagData) => {
                let tagedUserID = tagData.data[0]._id;
                setTimeout(() => {
                  sendNotice(
                    "postTag",
                    data.username,
                    data.result.userID,
                    data.userHeadImg,
                    null,
                    "剛剛",
                    tagedUserID,
                    data.result.imageUrl,
                    data.result._id
                  );
                }, 1);
              });
            });
          }
          postHashtagArr.forEach((hashtagName) => {
            // console.log(hashtagName);
            uploadHashtag(hashtagName, data.result._id);
          });

          alert("上傳成功");
          location.reload();
        } else {
          alert("上傳失敗");
          postNextStep2.style.display = "flex";
          postUploadLoading.style.display = "none";
        }
      });
  }
}

function changePicOrder(value, dots, previousArrow, nextArrow) {
  let current = 0;
  dots[current].style.backgroundColor = "#000000";
  function nextPic() {
    value[current].style.animation = "hideRight 0.25s forwards";
    value[current >= value.length - 1 ? 0 : current + 1].style.animation =
      "showRight 0.25s forwards";
    dots[current].style.backgroundColor = "#ffffff";
    if (current < value.length - 1) {
      current++;
      dots[current].style.backgroundColor = "#000000";
    } else {
      current = 0;
      dots[current].style.backgroundColor = "#000000";
    }
  }
  function preciousPic() {
    value[current].style.animation = "hideLeft  0.25s forwards";
    value[current > 0 ? current - 1 : value.length - 1].style.animation =
      "showLeft 0.25s forwards";
    dots[current].style.backgroundColor = "#ffffff";
    if (current > 0) {
      current--;
      dots[current].style.backgroundColor = "#000000";
    } else {
      current = value.length - 1;
      dots[current].style.backgroundColor = "#000000";
    }
  }
  previousArrow.addEventListener("click", (event) => {
    event.stopPropagation();
    preciousPic();
  });
  nextArrow.addEventListener("click", (event) => {
    event.stopPropagation();
    nextPic();
  });
}

function uploadHashtag(hashtagName, postID) {
  fetch(`/api/post/hashtag`, {
    method: "POST",
    body: JSON.stringify({
      hashtagName,
      postID,
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
    });
}

function deleteHashtag(hashtagName, postID) {
  fetch(`/api/post/hashtag`, {
    method: "DELETE",
    body: JSON.stringify({
      hashtagName,
      postID,
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
    });
}
