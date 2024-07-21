asdf();
async function asdf() {
  let url =
    "https://sheets.googleapis.com/v4/spreadsheets/1P5rOO0aKGxFwVBkF-VABtUV3qKwqnMvO9ACZQkkTQWA/values:batchGet?majorDimension=ROWS&ranges=All_villages!A1:G&ranges=All_provider!A1:S&ranges=MMW_vs_ICMV!A1:B&valueRenderOption=FORMATTED_VALUE&key=AIzaSyBr-MJnnuCiH2eaQRivEFNdnSm6gwTbHo8";
  // let villagesUrl =
  //   "https://sheets.googleapis.com/v4/spreadsheets/1P5rOO0aKGxFwVBkF-VABtUV3qKwqnMvO9ACZQkkTQWA/values/All_villages!A1:G?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&key=AIzaSyBr-MJnnuCiH2eaQRivEFNdnSm6gwTbHo8";
  let response = await getDataFromGS(url);
  // let villages = await getDataFromGS(villagesUrl);
  let providers = "";
  let villages = "";
  let mmwIcmv = "";
  response = response["valueRanges"];
  response.forEach((data) => {
    if (data["range"].includes("All_villages")) {
      villages = data["values"];
    } else if (data["range"].includes("All_provider")) {
      providers = data["values"];
    } else if (data["range"].includes("MMW_vs_ICMV")) {
      mmwIcmv = data["values"];
    }
  });

  mmwIcmv = LOL2LOD(mmwIcmv);
  console.log(mmwIcmv);
  // providers = providers["values"];
  providers = LOL2LOD(providers);
  console.log(providers);
  // villages = villages["values"];
  villages = LOL2LOD(villages);
  console.log(villages);

  let finalMMWList = {};
  mmwIcmv.forEach((mmw) => {
    finalMMWList[mmw["MMW code"]] =
      mmw["Provider post code that MMW report to"];
  });

  let finalVillageList = {};
  villages.forEach((village) => {
    if (village["Village_Code"] != "") {
      let stateRegion = village["State_Region"];
      stateRegion = stateRegion
        .replace("Northern ", "")
        .replace("Southern ", "");
      let township = village["Township"];
      let rhc = village["RHC_Name"];
      let sc = village["Sub-center_Name"];
      let vill = village["Name_of_Village"];
      if (!(stateRegion in finalVillageList)) {
        finalVillageList[stateRegion] = {};
      }
      if (!(township in finalVillageList[stateRegion])) {
        finalVillageList[stateRegion][township] = {};
      }

      finalVillageList[stateRegion][township][village["Village_Code"]] = {
        Village_Code: village["Village_Code"],
        State_Region: stateRegion,
        Township: township,
        RHC_Name: rhc,
        "Sub-center_Name": sc,
        Name_of_Village: vill,
      };
    }
  });

  let finalProviderList = {};
  providers.forEach((provider) => {
    if (provider["Person_Code"] && provider["Person_Code"] != "") {
      let providerAbb = provider["Person_Code"].charAt(3);
      if (!(providerAbb in finalProviderList)) {
        finalProviderList[providerAbb] = {};
      }
      let assignedVillage = provider["Assigned_village_code"];
      if (assignedVillage != "") {
        let sr = provider["State_Region"];
        sr = sr.replace("Northern ", "").replace("Southern ", "");
        let tsp = provider["Township"];
        let tspVillageList = finalVillageList[sr][tsp];
        if (assignedVillage in tspVillageList) {
          provider["Assigned_RHC"] =
            tspVillageList[assignedVillage]["RHC_Name"];
          provider["Assigned_SC"] =
            tspVillageList[assignedVillage]["Sub-center_Name"];
          provider["Assigned_village_name"] =
            tspVillageList[assignedVillage]["Name_of_Village"];
        } else {
          console.log(
            `${provider["Person_Code"]} | ${assignedVillage} | village not found`
          );
          console.log(provider);
        }
      }
      finalProviderList[providerAbb][provider["Person_Code"]] = provider;
    }
  });
  localStorage.setItem("papVillageList", JSON.parse(finalVillageList));
  localStorage.setItem("papProviderList", JSON.parse(finalProviderList));
  localStorage.setItem("papMMWvsICMV", JSON.parse(finalMMWList));
  console.log(finalVillageList);
  console.log(finalProviderList);
  console.log(finalMMWList);
}

function LOL2LOD(data) {
  const headers = data[0];
  // Convert rows to JSON objects
  const jsonData = data.slice(1).map((row) => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  return jsonData;
}
async function getDataFromGS(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
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
