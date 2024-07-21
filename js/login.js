import * as functions from "./functions.js";

export async function execute() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const token = functions.generateToken(username, password);
  functions.login(token);
}
