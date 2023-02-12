const target = document.querySelector(".intersectionDetection");
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
          post.userID.username,
          post.userID.headImg,
          post.imageUrl,
          post.content,
          post.comments,
          post.likes,
          post.time,
          post.hashtags
        );
        // console.log(post);
      });
      page = data.nextPage;
      observer.observe(target);
    });
}

getData();
