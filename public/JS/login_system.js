const loginSection = document.querySelector(".login");
const sighupSection = document.querySelector(".signup");
const showSignup = document.querySelector(".signup-button");
const showLogin = document.querySelector(".login-button");
const loginAccountInput = document.querySelector(".login-account");
const loginPasswordInput = document.querySelector(".login-password");
const signupAccountInput = document.querySelector(".signup-account");
const signupUsernameInput = document.querySelector(".user-name");
const sugnupPasswordInput = document.querySelector(".signup-password");
const loginSubmitButton = document.querySelector(".login-submit");
const signupSubmitButton = document.querySelector(".signup-submit");
const loginContainer = document.querySelector(".login-container");
const signupContainer = document.querySelector(".signup-container");

function createErrorMes(mes, container, style) {
  let errorMes = document.createElement("p");
  errorMes.textContent = mes;
  errorMes.classList.add(style);
  errorMes.style.color = "red";
  container.appendChild(errorMes);
}

showSignup.addEventListener("click", () => {
  loginSection.style.display = "none";
  sighupSection.style.display = "flex";
});

showLogin.addEventListener("click", () => {
  loginSection.style.display = "flex";
  sighupSection.style.display = "none";
});

signupSubmitButton.addEventListener("click", () => {
  let errorMesCheck = document.querySelector(".signup-error");
  if (errorMesCheck != null) {
    errorMesCheck.remove();
  }
  if (
    signupAccountInput.value == "" ||
    signupUsernameInput.value == "" ||
    sugnupPasswordInput.value == ""
  ) {
    createErrorMes(
      "帳號、用戶名稱、密碼皆不可空白",
      signupContainer,
      "signup-error"
    );
    return;
  }
  fetch(`/signup`, {
    method: "POST",
    body: JSON.stringify({
      account: signupAccountInput.value,
      username: signupUsernameInput.value,
      password: sugnupPasswordInput.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data.ok == false) {
        createErrorMes(data.mes, signupContainer, "signup-error");
      } else {
        alert("註冊成功");
        login(signupAccountInput.value, sugnupPasswordInput.value);
      }
    });
});

loginSubmitButton.addEventListener("click", () => {
  let errorMesCheck = document.querySelector(".login-error");
  if (errorMesCheck != null) {
    errorMesCheck.remove();
  }
  if (loginAccountInput.value == "" || loginPasswordInput.value == "") {
    createErrorMes("帳號、密碼不可空白", loginContainer, "login-error");
    return;
  }
  login(loginAccountInput.value, loginPasswordInput.value);
});

function login(account, password) {
  fetch(`/signin`, {
    method: "PUT",
    body: JSON.stringify({
      account: account,
      password: password,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data.ok == false) {
        createErrorMes(data.mes, loginContainer, "login-error");
      } else {
        location.href = "/";
      }
    });
}
