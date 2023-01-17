const searchBar = document.querySelector(".serch-bar input");
const homePage = document.querySelector(".home-page");
const homePageImg = document.querySelector(".home-page img");
const inboxPage = document.querySelector(".inbox-page");
const inboxPageImg = document.querySelector(".inbox-page img");
const postButtonImg = document.querySelector(".post img");
const heart = document.querySelector(".heart");
const heartImg = document.querySelector(".heart img");

searchBar.addEventListener("focus", () => {
  searchBar.style.backgroundImage = "none";
});

searchBar.addEventListener("blur", () => {
  if (searchBar.value == "") {
    searchBar.style.backgroundImage = "url('../image/search.png')";
  }
});

homePage.addEventListener("click", () => {
  document.location.href = "/";
});

inboxPage.addEventListener("click", () => {
  document.location.href = "/inbox";
});

postButtonImg.addEventListener("click", () => {
  homePageImg.src = "../image/home.png";
  inboxPageImg.src = "../image/message.png";
  heartImg.src = "../image/heart.png";
  postButtonImg.src = "../image/post2.png";
});

heart.addEventListener("click", () => {
  homePageImg.src = "../image/home.png";
  inboxPageImg.src = "../image/message.png";
  heartImg.src = "../image/heart2.png";
  postButtonImg.src = "../image/post.png";
});
