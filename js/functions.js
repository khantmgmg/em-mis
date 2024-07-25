import * as orgUnit from "./orgUnit.js";

export function generateToken(username, password) {
  // Concatenate username and password with a colon
  const credentials = `${username}:${password}`;
  // Encode the credentials using base64
  const encodedCredentials = btoa(credentials);
  return encodedCredentials;
}

export function generateHeaders(token) {
  // Construct the Authorization header value
  const authHeader = `Basic ${token}`;
  // Construct headers object
  const headers = {
    "Content-Type": "application/json",
    Authorization: authHeader,
  };
  return headers;
}

export async function makePostRequest(url, payload, headers) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function makeGetRequest(url, headers) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export function sortJson(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((accumulator, currentValue) => {
      accumulator[currentValue] = obj[currentValue];
      return accumulator;
    }, {});
}

export function showOverlay(displayText) {
  let overlayDiv = document.getElementById("overlay");
  if (!overlayDiv) {
    let overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.zIndex = "1000";
    overlay.style.fontSize = "5em";
    overlay.style.display = "block";
    overlay.className = "align-items-center";

    let overlaySubDiv = document.createElement("div");
    overlaySubDiv.className =
      "bg-secondary text-white mx-5 my-5 px-5 py-5 text-center align-items-center";

    let text = document.createElement("b");
    // text.innerHTML = "Building the app ..................";
    text.innerHTML = displayText;

    let info = document.createElement("p");
    info.id = "overlay-info";

    overlaySubDiv.appendChild(text);
    overlaySubDiv.appendChild(info);
    overlay.appendChild(overlaySubDiv);
    document.body.appendChild(overlay);
  } else {
    overlayDiv.style.display = "block";
  }
}

export function hideOverlay() {
  let overlayDiv = document.getElementById("overlay");
  if (overlayDiv) {
    overlayDiv.style.display = "none";
  }
}

export async function login(token) {
  showOverlay("Building the app ..................");
  const domain = "https://mis.pmi-em.org";
  const url = `${domain}/api/me?fields=id,name,userGroups,organisationUnits[id,name,level,parent[id,name,parent[id,name,parent]]]`;
  const headers = generateHeaders(token);
  try {
    const data = await makeGetRequest(url, headers);
    console.log(data);
    // document.getElementById("data").innerText = `${token} ||| ${data["name"]}`;
    localStorage.setItem("domain", domain);
    localStorage.setItem("token", token);
    localStorage.setItem("user", data["name"]);
    let orgUnits = data["organisationUnits"];
    let userGroups = data["userGroups"];

    let assignedOrgUnits = [];
    let userOrganization = [];
    // let userStateRegion = [];
    let userTownship = {};

    userGroups.forEach((userGroupId) => {
      switch (userGroupId["id"]) {
        case "AJkMB5yx3f5":
          userOrganization.push("ARC");
          break;
        case "NjMTtW44JhN":
          userOrganization.push("MHAA");
          break;
        case "t8PvIf1oOTY":
          userOrganization.push("MNMA");
          break;
        case "qrH57OmaOPN":
          userOrganization.push("SCH");
          break;
        case "B9lJ9eGHtp1":
          userOrganization.push("URC");
          break;
      }
    });

    orgUnits.forEach((orgUnit) => {
      assignedOrgUnits.push(orgUnit["id"]);
      if (orgUnit["level"] == "4") {
        if (!(orgUnit["parent"]["parent"]["name"] in userTownship)) {
          userTownship[orgUnit["parent"]["parent"]["name"]] = [];
        }
        userTownship[orgUnit["parent"]["parent"]["name"]].push(orgUnit["name"]);
      }
    });
    Object.keys(userTownship).forEach((sr) => {
      userTownship[sr] = [...new Set(userTownship[sr])]; // removing the township duplicated values
    });
    userOrganization = [...new Set(userOrganization)]; // removing the duplicated values
    userOrganization = userOrganization.join(",");

    console.log(`User townships: ${userTownship}`);

    localStorage.setItem("assignedOrgUnits", assignedOrgUnits.join(";"));
    localStorage.setItem("userTownship", JSON.stringify(userTownship));
    localStorage.setItem("userOrg", userOrganization);

    const orgUnitLoaded = await orgUnit.checkOrgUnit();
    console.log(`OrgUnitLoaded: ${orgUnitLoaded}`);
    if (orgUnitLoaded) {
      window.location.href = "./";
    }
  } catch (error) {
    console.error("Request failed", error);
    alert("Domain or Username or password incorrect");
  }
  hideOverlay();
}
