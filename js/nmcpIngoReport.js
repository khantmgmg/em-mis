import * as functions from "./functions.js";

export async function execute() {
  functions.showOverlay("Loading data ..................");

  const sdate = document.getElementById("sdate").value;
  const edate = document.getElementById("edate").value;
  const domain = localStorage.getItem("domain");
  const token = localStorage.getItem("token");
  const headers = functions.generateHeaders(token);
  const assignedOrgUnits = localStorage.getItem("assignedOrgUnits");
  const url = `${domain}/api/tracker/trackedEntities.json?enrollmentEnrolledAfter=${sdate}&enrollmentEnrolledBefore=${edate}&program=qDkgAbB5Jlk&orgUnit=${assignedOrgUnits}&ouMode=DESCENDANTS&fields=trackedEntity,enrollments[enrollment,attributes[attribute,displayName,value],events[event,status,orgUnit,orgUnitName,occurredAt,programStage,dataValues[dataElement,value]]]&totalPages=true&pageSize=100`;
  let cnt = true;
  let ptData = [];
  let page = 1;
  let loadedData = 0;

  while (cnt) {
    let teiUrl = `${url}&page=${page}`;
    console.log(teiUrl);
    let teis = await functions.makeGetRequest(teiUrl, headers);
    if (teis["instances"].length > 0) {
      let totalData = teis["total"];
      let dataLength = Number(teis["pageSize"]);
      ptData = ptData.concat(teis["instances"]);
      page = page + 1;
      loadedData = loadedData + dataLength;
      let infoText = `Info: Loading patient data.... (${loadedData} of ${totalData} loaded)`;
      let overlay = document.getElementById("overlay");
      //   console.log(overlay);
      let overlayInfo = document.getElementById("overlay-info");
      //   console.log(overlayInfo);
      overlayInfo.innerHTML = infoText;
    } else {
      cnt = false;
    }
  }
  console.log(ptData);

  let dataTemplate = {
    icmvCode: "",
    stateRegion: "",
    township: "",
    rhc: "",
    sc: "",
    vill: "",
    data: {
      "<1yr": {
        testMale: 0,
        testFemale: 0,
        pfMale: 0,
        pfFemale: 0,
        pvMale: 0,
        pvFemale: 0,
        mixMale: 0,
        mixFemale: 0,
        totalMale: 0,
        totalFemale: 0,
      },
      "1-4yr": {
        testMale: 0,
        testFemale: 0,
        pfMale: 0,
        pfFemale: 0,
        pvMale: 0,
        pvFemale: 0,
        mixMale: 0,
        mixFemale: 0,
        totalMale: 0,
        totalFemale: 0,
      },
      "5-9yr": {
        testMale: 0,
        testFemale: 0,
        pfMale: 0,
        pfFemale: 0,
        pvMale: 0,
        pvFemale: 0,
        mixMale: 0,
        mixFemale: 0,
        totalMale: 0,
        totalFemale: 0,
      },
      "10-14yr": {
        testMale: 0,
        testFemale: 0,
        pfMale: 0,
        pfFemale: 0,
        pvMale: 0,
        pvFemale: 0,
        mixMale: 0,
        mixFemale: 0,
        totalMale: 0,
        totalFemale: 0,
      },
      ">15yr": {
        testMale: 0,
        testFemale: 0,
        pfMale: 0,
        pfFemale: 0,
        pvMale: 0,
        pvFemale: 0,
        mixMale: 0,
        mixFemale: 0,
        totalMale: 0,
        totalFemale: 0,
      },
      total: {
        testMale: 0,
        testFemale: 0,
        pfMale: 0,
        pfFemale: 0,
        pvMale: 0,
        pvFemale: 0,
        mixMale: 0,
        mixFemale: 0,
        totalMale: 0,
        totalFemale: 0,
      },
      preg: {
        testMale: 0,
        testFemale: 0,
        pfMale: 0,
        pfFemale: 0,
        pvMale: 0,
        pvFemale: 0,
        mixMale: 0,
        mixFemale: 0,
        totalMale: 0,
        totalFemale: 0,
      },
    },
  };

  let finalData = {};
  let orgUnitData = JSON.parse(localStorage.getItem("orgUnits"));
  let storagePapProviderList = JSON.parse(
    localStorage.getItem("papProviderList")
  );
  let storagePapMmwVsIcmv = JSON.parse(localStorage.getItem("papMMWvsICMV"));
  let storagePapVillageList = JSON.parse(
    localStorage.getItem("papVillageList")
  );
  ptData.forEach((tei) => {
    let enrollments = tei["enrollments"];
    enrollments.forEach((enrollment) => {
      let sex = "";
      let attributes = enrollment["attributes"];
      attributes.forEach((attribute) => {
        if (attribute["attribte"] == "oindugucx72") {
          sex = attribute["value"].substring(0, 1);
        }
      });

      let events = enrollment["events"];
      events.forEach((event) => {
        let orgUnit = "";
        let cblMth = "";
        let cblYr = "";
        let personCode = "";
        let providerLocation = "";
        let ageGroup = "";
        let preg = "";
        let testResult = "";
        let vill = "";
        let sc = "";
        let rhc = "";
        let township = "";
        let stateRegion = "";

        let dataValues = event["dataValues"];
        dataValues.forEach((dataValue) => {
          let deId = dataValue["dataElement"];
          switch (deId) {
            case "vGxpKVMkmaW":
              testResult = dataValue["value"];
              break;
            case "n3Bkq0yjIa7":
              cblMth = dataValue["value"];
              break;
            case "mHmqOLqzXB2":
              cblYr = dataValue["value"];
              break;
            case "AS3g1pCXG7z":
              personCode = dataValue["value"];
              break;
            case "oeXoBvaL8B8":
              providerLocation = dataValue["value"];
              break;
            case "LMdJwJW68yO":
              preg = dataValue["value"].substring(0, 1);
              break;
            case "ECVGASvuHV3":
              let ptAge = Number(dataValue["value"]);
              if (ptAge >= 15) {
                ageGroup = ">15yr";
              } else if (ptAge >= 10) {
                ageGroup = "10-14yr";
              } else if (ptAge >= 5) {
                ageGroup = "5-9yr";
              } else if (ptAge >= 1) {
                ageGroup = "1-4yr";
              } else {
                ageGroup = "<1yr";
              }
              break;
          }
        });
        let cblPeriod = new Date(`${cblMth}-${cblYr} UTC`);

        let providerAbb = personCode.substring(3, 4);
        let providerVillageCode = "";
        let finalPersonCode = "";
        console.log(`${personCode}`);
        console.log(event);
        if (
          providerAbb != "T" &&
          providerAbb != "G" &&
          providerAbb != "P" &&
          providerAbb != "R"
        ) {
          if (providerAbb == "M") {
            finalPersonCode = storagePapMmwVsIcmv[personCode];
            let icmvCode = `${finalPersonCode}01`;
            let icmvCodeAbb = icmvCode.substring(3, 4);
            providerVillageCode =
              storagePapProviderList[icmvCodeAbb][icmvCode][
                "Assigned_village_code"
              ];
          } else if (
            providerAbb == "V" ||
            providerAbb == "W" ||
            providerAbb == "O"
          ) {
            finalPersonCode = personCode.substring(0, 7);
            providerVillageCode =
              storagePapProviderList[providerAbb][personCode][
                "Assigned_village_code"
              ];
          }

          Object.keys(orgUnitData).forEach((orgUnitId) => {
            let orgUnitVillageCode = orgUnitData[orgUnitId]["code"];
            switch (orgUnitVillageCode) {
              case providerVillageCode:
                orgUnit = orgUnitId;
                break;
            }
          });
          console.log(
            `${finalPersonCode}, ${personCode}, ${providerVillageCode}, ${orgUnit}`
          );
          console.log(orgUnitData[orgUnit]);
          vill = orgUnitData[orgUnit]["name"];
          sc = orgUnitData[orgUnit]["parent"]["name"];
          rhc = orgUnitData[orgUnit]["parent"]["parent"]["name"];
          township = orgUnitData[orgUnit]["parent"]["parent"]["parent"]["name"];
          stateRegion =
            orgUnitData[orgUnit]["parent"]["parent"]["parent"]["parent"][
              "parent"
            ]["name"];
        } else {
          orgUnit = providerLocation;
          try {
            vill = orgUnitData[orgUnit]["name"];
            sc = orgUnitData[orgUnit]["parent"]["name"];
            rhc = orgUnitData[orgUnit]["parent"]["parent"]["name"];
            township =
              orgUnitData[orgUnit]["parent"]["parent"]["parent"]["name"];
            stateRegion =
              orgUnitData[orgUnit]["parent"]["parent"]["parent"]["parent"][
                "parent"
              ]["name"];
          } catch {
            let tspAbb = personCode.substring(0, 3);
            // console.log(tspAbb);
            let storagePapTspList = JSON.parse(
              localStorage.getItem("papTspList")
            );
            Object.keys(storagePapTspList).forEach((tsp) => {
              if (tsp["TSPABB"] == tspAbb) {
                stateRegion = tsp["StateRegion"];
                township = tsp["Township"];
                rhc = "Not defined";
                sc = "Not defined";
                vill = "Not defined";
              }
            });
          }
        }

        cblPeriod = cblPeriod.toISOString().substring(0, 7);
        if (!(cblPeriod in finalData)) {
          finalData[cblPeriod] = {};
        }
        if (!(finalPersonCode in finalData[cblPeriod])) {
          finalData[cblPeriod][finalPersonCode] = dataTemplate;
          finalData[cblPeriod][finalPersonCode]["icmvCode"] = finalPersonCode;
          finalData[cblPeriod][finalPersonCode]["stateRegion"] = stateRegion;
          finalData[cblPeriod][finalPersonCode]["township"] = township;
          finalData[cblPeriod][finalPersonCode]["rhc"] = rhc;
          finalData[cblPeriod][finalPersonCode]["sc"] = sc;
          finalData[cblPeriod][finalPersonCode]["vill"] = vill;
        }
        console.log({
          personCode: finalPersonCode,
          finalPersonCode: personCode,
          stateRegion: stateRegion,
          township: township,
          rhc: rhc,
          sc: sc,
          vill: vill,
          cblPeriod: cblPeriod,
          sex: sex,
          preg: preg,
          testResult: testResult,
          ageGroup: ageGroup,
        });
      });
    });
  });
  functions.hideOverlay();
}
