import * as funcs from "./functions.js";
// function generateToken(username, password) {
//   // Concatenate username and password with a colon
//   const credentials = `${username}:${password}`;
//   // Encode the credentials using base64
//   const encodedCredentials = btoa(credentials);
//   return encodedCredentials;
// }

// function generateHeaders(token) {
//   // Construct the Authorization header value
//   const authHeader = `Basic ${token}`;
//   // Construct headers object
//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: authHeader,
//   };
//   return headers;
// }

// async function makePostRequest(url, payload, headers) {
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: headers,
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// }

// async function makeGetRequest(url, headers) {
//   try {
//     const response = await fetch(url, {
//       method: "GET",
//       headers: headers,
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// }

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
