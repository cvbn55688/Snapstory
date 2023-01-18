function getData() {
  fetch(`/getData`, {
    method: "GET",
  })
    .then(function (response) {
      if (response.status != 200) {
        alert("讀取失敗");
        return;
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function checkLonin() {
  fetch(`/checkLogin`, {
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
      console.log(data);
    });
}

checkLonin();
getData();
