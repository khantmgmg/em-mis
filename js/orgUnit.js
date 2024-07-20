async function checkOrgUnit() {
  const currentDate = new Date();
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const toRefreshDate = tomorrowDate.toISOString().split("T")[0];
  console.log("Tomorrow's Date:", toRefreshDate);

  const localToRefreshDate = localStorage.getItem("OrgUnitToRefreshDate");
  if (!localToRefreshDate || localToRefreshDate !== toRefreshDate) {
    const finalOrgUnit = await getOrgUnit();
    localStorage.setItem("orgUnits", JSON.stringify(finalOrgUnit));
    localStorage.setItem("OrgUnitToRefreshDate", toRefreshDate);
    return true;
  }
  return false;
}

async function getOrgUnit() {
  const domain = localStorage.getItem("domain");
  const token = localStorage.getItem("token");
  const headers = generateHeaders(token);
  const url = `${domain}/api/organisationUnits?fields=id,name,parent[id,name,parent[id,name,parent[id,name,parent[id,name,parent[id,name]]]]]&filter=level:eq:7&&totalPages=true&pageSize=500`;
  let cnt = true;
  let orgUnitData = [];
  let page = 1;
  while (cnt) {
    let finalUrl = `${url}&page=${page}`;
    console.log(finalUrl);
    const orgUnits = await makeGetRequest(finalUrl, headers);
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
