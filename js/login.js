import * as functions from "./functions.js";

export async function execute() {
  //   let overlay = document.getElementById("overlay");
  //   overlay.style.display = "block";
  // Usage example:
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  // const domain = document.getElementById("host").value;

  const token = functions.generateToken(username, password);
  const headers = functions.generateHeaders(token);
  functions.login();
}
