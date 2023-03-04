const target = document.querySelector(".intersectionDetection");
const fansUl = document.querySelector(".fans-ul");
const followerUl = document.querySelector(".follower-ul");
const noFans = document.querySelector(".fans-ul p");
const noFollower = document.querySelector(".follower-ul p");
let page = 0;
const callback = (entries) => {
  if (entries[0].isIntersecting) {
    observer.unobserve(target);
    if (page != null) {
      getData();
    } else {
      observer.unobserve(target);
    }
  }
};
const observer = new IntersectionObserver(callback, {
  threshold: 0.8,
});

function getData() {
  fetch(`/getData?page=${page}`, {
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
          post.userID._id,
          post.userID.username,
          post.userID.headImg,
          post.imageUrl,
          post.content,
          post.comments,
          post.likes,
          post.time,
          post.hashtags,
          data.currentUserData.userID
        );
        // console.log(post);
      });
      page = data.nextPage;
      observer.observe(target);
    });
}

function createFansFollowerLi(ul, userData) {
  let newLi = document.createElement("li");
  ul.appendChild(newLi);

  let newHeadImg = document.createElement("img");
  newHeadImg.src = userData.userID.headImg;
  newLi.appendChild(newHeadImg);

  let newUsername = document.createElement("span");
  newUsername.textContent = userData.userID.username;
  newLi.appendChild(newUsername);

  rediectToPersonalPage(newLi, userData.userID._id);
}

function getUserDatas() {
  fetch(`/getUserFansFollower`, {
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
      let fansArr = data.data.fans;
      let followingArr = data.data.following;

      if (fansArr.length != 0) {
        fansArr.forEach((fan) => {
          createFansFollowerLi(fansUl, fan);
        });
      } else {
        noFans.style.display = "block";
      }

      if (followingArr.length != 0) {
        followingArr.forEach((follower) => {
          createFansFollowerLi(followerUl, follower);
        });
      } else {
        noFollower.style.display = "block";
      }
    });
}

getData();
getUserDatas();
