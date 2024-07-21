import * as functions from "./functions.js";
import * as orgUnit from "./orgUnit.js";

export async function execute() {
  let overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  // Usage example:
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  // const domain = document.getElementById("host").value;
  const domain = "https://mis.pmi-em.org";
  const url = `${domain}/api/me?fields=id,name,userGroups,organisationUnits[id,name,level,parent[id,name,parent[id,name,parent]]]`;

  const token = functions.generateToken(username, password);
  const headers = functions.generateHeaders(token);

  try {
    const data = await functions.makeGetRequest(url, headers);
    console.log(data);
    document.getElementById("data").innerText = `${token} ||| ${data["name"]}`;
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
  overlay.style.display = "none";
}
