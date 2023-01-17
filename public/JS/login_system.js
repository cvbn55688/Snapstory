const loginSection = document.querySelector(".login");
const sighupSection = document.querySelector(".signup");

const showSignup = document.querySelector(".signup-button");
const showLogin = document.querySelector(".login-button");

showSignup.addEventListener("click", () => {
  loginSection.style.display = "none";
  sighupSection.style.display = "flex";
});

showLogin.addEventListener("click", () => {
  loginSection.style.display = "flex";
  sighupSection.style.display = "none";
});
