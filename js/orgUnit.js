import * as functions from "./functions.js";
import * as gs from "./gs.js";

export async function checkOrgUnit() {
  const currentDate = new Date();
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const toRefreshDate = tomorrowDate.toISOString().split("T")[0];
  console.log("Tomorrow's Date:", toRefreshDate);

  const localToRefreshDate = localStorage.getItem("OrgUnitToRefreshDate");
  if (!localToRefreshDate || localToRefreshDate !== toRefreshDate) {
    const finalOrgUnit = await getOrgUnit();
    let villageJson = orgUnitToVillageList(finalOrgUnit);
    localStorage.setItem("orgUnits", JSON.stringify(finalOrgUnit));
    localStorage.setItem("OrgUnitToRefreshDate", toRefreshDate);
    localStorage.setItem("villageList", JSON.stringify(villageJson));
    await gs.syncGs();
    return true;
  }
  return false;
}

export async function getOrgUnit() {
  const domain = localStorage.getItem("domain");
  const token = localStorage.getItem("token");
  const headers = functions.generateHeaders(token);
  const url = `${domain}/api/organisationUnits?fields=id,name,code,parent[id,name,parent[id,name,parent[id,name,parent[id,name,parent[id,name]]]]]&filter=level:eq:7&&totalPages=true&pageSize=500`;
  let cnt = true;
  let orgUnitData = [];
  let page = 1;
  while (cnt) {
    let finalUrl = `${url}&page=${page}`;
    console.log(finalUrl);
    const orgUnits = await functions.makeGetRequest(finalUrl, headers);
    if (orgUnits["organisationUnits"].length > 0) {
      orgUnitData = orgUnitData.concat(orgUnits["organisationUnits"]);
      page = page + 1;
    } else {
      cnt = false;
    }
  }
  const finalOrgUnit = {};
  orgUnitData.forEach((orgUnit) => {
    finalOrgUnit[orgUnit["id"]] = orgUnit;
  });
  return finalOrgUnit;
}

export function orgUnitToVillageList(orgunit) {
  let villageJson = {};
  let villageIds = Object.keys(orgunit);
  villageIds.forEach((villageId) => {
    let scName = orgunit[villageId]["parent"]["name"];
    let scId = orgunit[villageId]["parent"]["id"];
    let rhcName = orgunit[villageId]["parent"]["parent"]["name"];
    let rhcId = orgunit[villageId]["parent"]["parent"]["id"];
    let tspName = orgunit[villageId]["parent"]["parent"]["parent"]["name"];
    let tspId = orgunit[villageId]["parent"]["parent"]["parent"]["id"];
    let srName =
      orgunit[villageId]["parent"]["parent"]["parent"]["parent"]["parent"][
        "name"
      ];
    let srId =
      orgunit[villageId]["parent"]["parent"]["parent"]["parent"]["parent"][
        "id"
      ];

    if (!(`${srName}` in villageJson)) {
      villageJson[`${srName}`] = { id: srId, name: srName, children: {} };
    }

    if (!(`${tspName}` in villageJson[`${srName}`]["children"])) {
      villageJson[`${srName}`]["children"][`${tspName}`] = {
        id: tspId,
        name: tspName,
        children: {},
      };
    }

    if (
      !(
        `${rhcName}-${rhcId}` in
        villageJson[`${srName}`]["children"][`${tspName}`]["children"]
      )
    ) {
      villageJson[`${srName}`]["children"][`${tspName}`]["children"][
        `${rhcName}-${rhcId}`
      ] = { id: rhcId, name: rhcName, children: {} };
    }

    if (
      !(
        `${scName}-${scId}` in
        villageJson[`${srName}`]["children"][`${tspName}`]["children"][
          `${rhcName}-${rhcId}`
        ]["children"]
      )
    ) {
      villageJson[`${srName}`]["children"][`${tspName}`]["children"][
        `${rhcName}-${rhcId}`
      ]["children"][`${scName}-${scId}`] = {
        id: scId,
        name: scName,
        children: {},
      };
    }

    let villageName = orgunit[villageId]["name"];
    let villageCode =
      "code" in orgunit[villageId] ? orgunit[villageId]["code"] : "";
    villageJson[`${srName}`]["children"][`${tspName}`]["children"][
      `${rhcName}-${rhcId}`
    ]["children"][`${scName}-${scId}`]["children"][
      `${villageName}-${villageId}`
    ] = {
      id: villageId,
      name: villageName,
      code: villageCode,
    };
  });
  console.log(villageJson);
  Object.keys(villageJson).forEach((sr) => {
    Object.keys(villageJson[sr]["children"]).forEach((tsp) => {
      Object.keys(villageJson[sr]["children"][tsp]["children"]).forEach(
        (rhc) => {
          Object.keys(
            villageJson[sr]["children"][tsp]["children"][rhc]["children"]
          ).forEach((sc) => {
            villageJson[sr]["children"][tsp]["children"][rhc]["children"][sc][
              "children"
            ] = functions.sortJson(
              villageJson[sr]["children"][tsp]["children"][rhc]["children"][sc][
                "children"
              ]
            );
          });
          villageJson[sr]["children"][tsp]["children"][rhc]["children"] =
            functions.sortJson(
              villageJson[sr]["children"][tsp]["children"][rhc]["children"]
            );
        }
      );
      villageJson[sr]["children"][tsp]["children"] = functions.sortJson(
        villageJson[sr]["children"][tsp]["children"]
      );
    });
    villageJson[sr]["children"] = functions.sortJson(
      villageJson[sr]["children"]
    );
  });
  villageJson = functions.sortJson(villageJson);
  return villageJson;
}
