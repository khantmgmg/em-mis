import * as funcs from "../js/functions.js";

function execute() {
  // Usage example:
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const domain = document.getElementById("host").value;
  const url = `${domain}/api/me`;

  const token = funcs.generateToken(username, password);
  const headers = funcs.generateHeaders(token);

  funcs
    .makeGetRequest(url, headers)
    .then((data) => {
      console.log(data);
      document.getElementById(
        "data"
      ).innerText = `${token} ||| ${data["name"]}`;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("headers", headers);
      sessionStorage.setItem("user", data["name"]);
    })
    .catch((error) => {
      console.error("Request failed", error);
      alert("Domain or Username or password incorrect");
    });
}
