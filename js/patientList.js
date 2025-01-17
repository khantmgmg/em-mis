import * as functions from "./functions.js";

var finaldata = {};

export async function execute() {
  functions.showOverlay("Loading data ..................");

  const sdate = document.getElementById("sdate").value;
  const edate = document.getElementById("edate").value;
  // const rpMth = document.getElementById("rpMth").value;
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
      console.log(overlay);
      let overlayInfo = document.getElementById("overlay-info");
      console.log(overlayInfo);
      overlayInfo.innerHTML = infoText;
    } else {
      cnt = false;
    }
  }
  console.log(ptData);
  let orgUnitData = JSON.parse(localStorage.getItem("orgUnits"));
  // console.log(orgUnitData);
  ptData.forEach((tei) => {
    let trackedEntity = tei["trackedEntity"];
    let enrollments = tei["enrollments"];
    enrollments.forEach((enrollment) => {
      let enrollmentId = enrollment["enrollment"];
      let events = enrollment["events"];
      events.forEach((event) => {
        if (event["programStage"] == "hYyB7FUS5eR") {
          // console.log(event);
          event["enrollment"] = enrollmentId;
          event["trackedEntity"] = trackedEntity;
          event["attributes"] = enrollment["attributes"];
          let orgUnit = event["orgUnit"];
          // console.log(orgUnit);
          // console.log(orgUnitData[orgUnit]);
          // console.log(orgUnitData[orgUnit]);
          let township =
            orgUnitData[orgUnit]["parent"]["parent"]["parent"]["name"];
          let stateRegion =
            orgUnitData[orgUnit]["parent"]["parent"]["parent"]["parent"][
              "parent"
            ]["name"];
          let eventId = event["event"];
          let occurredAt = event["occurredAt"];
          let reportingMonth = occurredAt.substring(0, 7);
          if (!(reportingMonth in finaldata)) {
            finaldata[reportingMonth] = {};
          }
          let dataValues = event["dataValues"];

          let organization = "";
          let personCode = "";
          let cblMth = "";
          let cblYr = "";
          let cblPage = "";

          for (let i = 0; i < dataValues.length; i++) {
            let dataValue = dataValues[i];
            if (dataValue["dataElement"] == "AS3g1pCXG7z") {
              personCode = dataValue["value"];
            } else if (dataValue["dataElement"] == "n3Bkq0yjIa7") {
              cblMth = dataValue["value"];
            } else if (dataValue["dataElement"] == "mHmqOLqzXB2") {
              cblYr = dataValue["value"];
            } else if (dataValue["dataElement"] == "m7sW6eVhXqz") {
              cblPage = dataValue["value"];
            } else if (dataValue["dataElement"] == "WEHuBflDeJM") {
              organization = dataValue["value"];
            }
          }
          let cblPeriod = `${cblMth}-${cblYr}`;
          // console.log(`${personCode} - ${cblPeriod} - ${cblPage}`);
          if (!(organization in finaldata[reportingMonth])) {
            finaldata[reportingMonth][organization] = {};
          }

          if (!(stateRegion in finaldata[reportingMonth][organization])) {
            finaldata[reportingMonth][organization][stateRegion] = {};
          }

          if (
            !(township in finaldata[reportingMonth][organization][stateRegion])
          ) {
            finaldata[reportingMonth][organization][stateRegion][township] = {};
          }

          if (
            !(
              personCode in
              finaldata[reportingMonth][organization][stateRegion][township]
            )
          ) {
            finaldata[reportingMonth][organization][stateRegion][township][
              personCode
            ] = {};
          }
          // console.log(Object.keys(finaldata[reportingMonth]));
          if (
            !(
              cblPeriod in
              finaldata[reportingMonth][organization][stateRegion][township][
                personCode
              ]
            )
          ) {
            finaldata[reportingMonth][organization][stateRegion][township][
              personCode
            ][cblPeriod] = {};
          }
          // console.log(Object.keys(finaldata[reportingMonth][personCode]));
          if (
            !(
              cblPage in
              finaldata[reportingMonth][organization][stateRegion][township][
                personCode
              ][cblPeriod]
            )
          ) {
            finaldata[reportingMonth][organization][stateRegion][township][
              personCode
            ][cblPeriod][cblPage] = [];
          }
          // console.log(Object.keys(finaldata[reportingMonth][personCode][cblPeriod]));
          // console.log(finaldata[reportingMonth][personCode][cblPeriod][cblPage]);
          finaldata[reportingMonth][organization][stateRegion][township][
            personCode
          ][cblPeriod][cblPage].push(event);
        }
      });
    });
  });

  finaldata = functions.sortJson(finaldata);
  Object.keys(finaldata).forEach((mth) => {
    Object.keys(finaldata[mth]).forEach((org) => {
      Object.keys(finaldata[mth][org]).forEach((stateRegion) => {
        Object.keys(finaldata[mth][org][stateRegion]).forEach((township) => {
          finaldata[mth][org][stateRegion][township] = functions.sortJson(
            finaldata[mth][org][stateRegion][township]
          );
        });
        finaldata[mth][org][stateRegion] = functions.sortJson(
          finaldata[mth][org][stateRegion]
        );
      });
      finaldata[mth][org] = functions.sortJson(finaldata[mth][org]);
    });
    finaldata[mth] = functions.sortJson(finaldata[mth]);
  });
  // console.log(finaldata);
  let htmlData = document.getElementById("data");
  htmlData.innerHTML = "";
  let formDiv = document.createElement("form");
  formDiv.style.fontSize = "0.85em";
  let mainRowDiv = document.createElement("div");
  mainRowDiv.className = "row";

  let rpMthCol = createSelectBox(
    "rpMth",
    "Reporting period",
    "callFromPatientList('rpMthChange');"
  );

  let orgCol = createSelectBox(
    "org",
    "Organization",
    "callFromPatientList('orgChange');"
  );
  let srCol = createSelectBox(
    "sr",
    "State/Region",
    "callFromPatientList('srChange');"
  );
  let tspCol = createSelectBox(
    "tsp",
    "Township",
    "callFromPatientList('tspChange');"
  );

  let personCodeCol = createSelectBox(
    "personCode",
    "Person code",
    "callFromPatientList('personCodeChange');"
  );
  let cblPeriodCol = createSelectBox(
    "cblPeriod",
    "Carbonless period",
    "callFromPatientList('cblPeriodChange');"
  );
  let cblPageCol = createSelectBox(
    "cblPage",
    "Carbonless page",
    "callFromPatientList('cblPageChange');"
  );

  mainRowDiv.appendChild(rpMthCol);
  mainRowDiv.appendChild(orgCol);
  mainRowDiv.appendChild(srCol);
  mainRowDiv.appendChild(tspCol);
  mainRowDiv.appendChild(personCodeCol);
  mainRowDiv.appendChild(cblPeriodCol);
  mainRowDiv.appendChild(cblPageCol);
  formDiv.appendChild(mainRowDiv);
  htmlData.appendChild(formDiv);

  let rpMthSelect = document.getElementById("rpMth");
  rpMthSelect.innerHTML = "";
  let rpMths = Object.keys(finaldata);
  rpMths.forEach((rpMth) => {
    let rpMthOption = document.createElement("option");
    rpMthOption.value = rpMth;
    rpMthOption.innerText = rpMth;
    rpMthSelect.appendChild(rpMthOption);
  });
  functions.hideOverlay();
}

export function rpMthChange() {
  let rpMth = document.getElementById("rpMth").value;
  let orgSelect = document.getElementById("org");
  let srSelect = document.getElementById("sr");
  let tspSelect = document.getElementById("tsp");
  let personCodeSelect = document.getElementById("personCode");
  let cblPeriodSelect = document.getElementById("cblPeriod");
  let cblPageSelect = document.getElementById("cblPage");
  orgSelect.innerHTML = "";
  srSelect.innerHTML = "";
  tspSelect.innerHTML = "";
  personCodeSelect.innerHTML = "";
  cblPeriodSelect.innerHTML = "";
  cblPageSelect.innerHTML = "";
  let orgs = Object.keys(finaldata[rpMth]);
  orgs.forEach((org) => {
    let orgOption = document.createElement("option");
    orgOption.value = org;
    orgOption.innerText = org;
    orgSelect.appendChild(orgOption);
  });
}

export function orgChange() {
  let rpMth = document.getElementById("rpMth").value;
  let org = document.getElementById("org").value;
  let srSelect = document.getElementById("sr");
  let tspSelect = document.getElementById("tsp");
  let personCodeSelect = document.getElementById("personCode");
  let cblPeriodSelect = document.getElementById("cblPeriod");
  let cblPageSelect = document.getElementById("cblPage");
  srSelect.innerHTML = "";
  tspSelect.innerHTML = "";
  personCodeSelect.innerHTML = "";
  cblPeriodSelect.innerHTML = "";
  cblPageSelect.innerHTML = "";
  let keys = Object.keys(finaldata[rpMth][org]);
  keys.forEach((key) => {
    let opt = document.createElement("option");
    opt.value = key;
    opt.innerText = key;
    srSelect.appendChild(opt);
  });
}

export function srChange() {
  let rpMth = document.getElementById("rpMth").value;
  let org = document.getElementById("org").value;
  let sr = document.getElementById("sr").value;
  let tspSelect = document.getElementById("tsp");
  let personCodeSelect = document.getElementById("personCode");
  let cblPeriodSelect = document.getElementById("cblPeriod");
  let cblPageSelect = document.getElementById("cblPage");
  tspSelect.innerHTML = "";
  personCodeSelect.innerHTML = "";
  cblPeriodSelect.innerHTML = "";
  cblPageSelect.innerHTML = "";
  let keys = Object.keys(finaldata[rpMth][org][sr]);
  keys.forEach((key) => {
    let opt = document.createElement("option");
    opt.value = key;
    opt.innerText = key;
    tspSelect.appendChild(opt);
  });
}

export function tspChange() {
  let rpMth = document.getElementById("rpMth").value;
  let org = document.getElementById("org").value;
  let sr = document.getElementById("sr").value;
  let tsp = document.getElementById("tsp").value;
  let personCodeSelect = document.getElementById("personCode");
  let cblPeriodSelect = document.getElementById("cblPeriod");
  let cblPageSelect = document.getElementById("cblPage");
  personCodeSelect.innerHTML = "";
  cblPeriodSelect.innerHTML = "";
  cblPageSelect.innerHTML = "";
  let keys = Object.keys(finaldata[rpMth][org][sr][tsp]);
  keys.forEach((key) => {
    let opt = document.createElement("option");
    opt.value = key;
    opt.innerText = key;
    personCodeSelect.appendChild(opt);
  });
}

export function personCodeChange() {
  let ptData = document.getElementById("ptData");
  ptData.innerHTML = "";
  let rpMth = document.getElementById("rpMth").value;
  let org = document.getElementById("org").value;
  let sr = document.getElementById("sr").value;
  let tsp = document.getElementById("tsp").value;
  let personCode = document.getElementById("personCode").value;
  let cblPeriodSelect = document.getElementById("cblPeriod");
  let cblPageSelect = document.getElementById("cblPage");
  cblPeriodSelect.innerHTML = "";
  cblPageSelect.innerHTML = "";
  let cblPeriods = Object.keys(finaldata[rpMth][org][sr][tsp][personCode]);
  cblPeriods.forEach((cblPeriod) => {
    let cblPeriodOption = document.createElement("option");
    cblPeriodOption.value = cblPeriod;
    cblPeriodOption.innerText = cblPeriod;
    cblPeriodSelect.appendChild(cblPeriodOption);

    let cblPages = Object.keys(
      finaldata[rpMth][org][sr][tsp][personCode][cblPeriod]
    );
    cblPages.forEach((cblPage) => {
      let jsonData =
        finaldata[rpMth][org][sr][tsp][personCode][cblPeriod][cblPage];
      loadPatientData(jsonData);
    });
  });
}

export function cblPeriodChange() {
  let ptData = document.getElementById("ptData");
  ptData.innerHTML = "";
  let rpMth = document.getElementById("rpMth").value;
  let org = document.getElementById("org").value;
  let sr = document.getElementById("sr").value;
  let tsp = document.getElementById("tsp").value;
  let personCode = document.getElementById("personCode").value;
  let cblPeriod = document.getElementById("cblPeriod").value;
  let cblPageSelect = document.getElementById("cblPage");
  cblPageSelect.innerHTML = "";
  let cblPages = Object.keys(
    finaldata[rpMth][org][sr][tsp][personCode][cblPeriod]
  );
  cblPages.forEach((cblPage) => {
    let cblPageOptions = document.createElement("option");
    cblPageOptions.value = cblPage;
    cblPageOptions.innerText = cblPage;
    cblPageSelect.appendChild(cblPageOptions);
    let jsonData =
      finaldata[rpMth][org][sr][tsp][personCode][cblPeriod][cblPage];
    loadPatientData(jsonData);
  });
}

export function cblPageChange() {
  let ptData = document.getElementById("ptData");
  ptData.innerHTML = "";
  let rpMth = document.getElementById("rpMth").value;
  let org = document.getElementById("org").value;
  let sr = document.getElementById("sr").value;
  let tsp = document.getElementById("tsp").value;
  let personCode = document.getElementById("personCode").value;
  let cblPeriod = document.getElementById("cblPeriod").value;
  let cblPage = document.getElementById("cblPage").value;
  let jsonData = finaldata[rpMth][org][sr][tsp][personCode][cblPeriod][cblPage];
  loadPatientData(jsonData);
}

function loadPatientData(jsonData) {
  const domain = localStorage.getItem("domain");
  let ptData = document.getElementById("ptData");
  jsonData.forEach((idata) => {
    let srno = "";
    let testDate = "";
    let ptName = "";
    let ptAge = "";
    let ptAddress = "";
    let ptPopType = "";
    let ptSex = "";
    let ptPreg = "";
    let testResult = "";
    let ptHe = "";
    let permanentAddr = "";
    let url = "";
    console.log(idata);
    //console.log("asdf");
    let attributes = idata["attributes"];
    let dataValues = idata["dataValues"];
    let orgUnitName = idata["orgUnitName"];
    url = `${domain}/dhis-web-tracker-capture/index.html#/dashboard?tei=${idata["trackedEntity"]}&program=qDkgAbB5Jlk&ou=${idata["orgUnit"]}`;
    attributes.forEach((attribute) => {
      switch (attribute["attribute"]) {
        case "PFpmOsgBCif":
          ptName = attribute["value"];
          break;
        case "oindugucx72":
          ptSex = attribute["value"];
          break;
        case "XN0145qZ7kH":
          permanentAddr = attribute["value"];
          break;
      }
    });
    dataValues.forEach((dataValue) => {
      switch (dataValue["dataElement"]) {
        case "pgULUzbdazk":
          srno = dataValue["value"];
          break;
        case "GMiQykxracx":
          testDate = dataValue["value"];
          break;
        case "ECVGASvuHV3":
          ptAge = dataValue["value"];
          break;
        case "LMdJwJW68yO":
          ptPreg = dataValue["value"];
          break;
        case "vGxpKVMkmaW":
          testResult = dataValue["value"];
          break;
        case "k2YknESEta5":
          ptPopType = dataValue["value"];
          break;
        case "zLujJOxAcri":
          ptHe = dataValue["value"];
          break;
      }
    });
    if (orgUnitName.includes("side township")) {
      ptAddress = `${permanentAddr} (${orgUnitName})`;
    } else {
      ptAddress = orgUnitName;
    }
    console.log(
      `${srno}, ${testDate}, ${ptName}, ${ptAge}, ${ptAddress}, ${ptSex}, ${ptPreg}, ${testResult}`
    );
    ptSex = ptSex != "" ? ptSex.charAt(0) : "";
    ptPreg = ptPreg != "" ? ptPreg.charAt(0) : "";
    ptHe = ptHe != "" ? ptHe.charAt(0) : "";
    ptPopType = ptPopType != "" ? ptPopType.charAt(0) : "";
    let ptRowDiv = createPatientRowDiv(
      srno,
      testDate,
      ptName,
      ptAge,
      ptAddress,
      ptPopType,
      ptSex,
      ptPreg,
      testResult,
      ptHe
    );
    let urlDiv = document.createElement("div");
    urlDiv.className = "col-1";
    let urlA = document.createElement("a");
    urlA.href = url;
    urlA.target = "_blank";
    let aSmall = document.createElement("small");
    aSmall.innerHTML = "Go to MIS";
    urlA.appendChild(aSmall);
    urlDiv.append(urlA);
    ptRowDiv.append(urlDiv);
    ptData.appendChild(ptRowDiv);
  });
}

function createPatientRowDiv(
  srno,
  testDate,
  ptName,
  ptAge,
  ptAddress,
  ptPopType,
  ptSex,
  ptPreg,
  testResult,
  ptHe
) {
  let ptRowDiv = document.createElement("div");
  switch (testResult) {
    case "PF":
      ptRowDiv.className =
        "row border rounded px-1 py-1 mx-1 my-1 align-items-center bg-danger";
      ptRowDiv.style = "--bs-bg-opacity: .3;";
      break;
    case "PV":
      ptRowDiv.className =
        "row border rounded px-1 py-1 mx-1 my-1 align-items-center bg-success";
      ptRowDiv.style = "--bs-bg-opacity: .3;";
      break;
    case "MIX":
      ptRowDiv.className =
        "row border rounded px-1 py-1 mx-1 my-1 align-items-center bg-primary";
      ptRowDiv.style = "--bs-bg-opacity: .3;";
      break;
    default:
      ptRowDiv.className =
        "row border rounded px-1 py-1 mx-1 my-1 align-items-center";
      break;
  }

  let colSrno = createPatientDataCellDiv(
    srno,
    "col text-center",
    "max-width:4%; font-size:0.75em"
  );
  let colTestDate = createPatientDataCellDiv(testDate, "col-1 text-end", "font-size:0.75em");
  let colPtName = createPatientDataCellDiv(ptName, "col-2 text-start", "font-size:0.75em");
  let colPtAge = createPatientDataCellDiv(
    ptAge,
    "col text-end",
    "max-width:4%; font-size:0.75em"
  );
  let colPtAddress = createPatientDataCellDiv(
    ptAddress,
    "col-2 text-start",
    "font-size:0.75em"
  );
  let colPtPopType = createPatientDataCellDiv(
    ptPopType,
    "col-1 text-center",
    "font-size:0.75em"
  );
  let colPtSex = createPatientDataCellDiv(ptSex, "col-1 text-center", "font-size:0.75em");
  let colPtPreg = createPatientDataCellDiv(ptPreg, "col-1 text-center", "font-size:0.75em");
  let colTestResult = createPatientDataCellDiv(
    testResult,
    "col-1 text-center",
    "font-size:0.75em"
  );
  let colPtHe = createPatientDataCellDiv(ptHe, "col-1 text-center", "font-size:0.75em");

  ptRowDiv.appendChild(colSrno);
  ptRowDiv.appendChild(colTestDate);
  ptRowDiv.appendChild(colPtName);
  ptRowDiv.appendChild(colPtAge);
  ptRowDiv.appendChild(colPtAddress);
  ptRowDiv.appendChild(colPtPopType);
  ptRowDiv.appendChild(colPtSex);
  ptRowDiv.appendChild(colPtPreg);
  ptRowDiv.appendChild(colTestResult);
  ptRowDiv.appendChild(colPtHe);
  return ptRowDiv;
}

function createPatientDataCellDiv(info, classname, style) {
  let ptDataCellDiv = document.createElement("div");
  ptDataCellDiv.className = classname;
  ptDataCellDiv.style = style;
  ptDataCellDiv.innerHTML = info;
  //   ptDataCellDiv.innerText = info;
  return ptDataCellDiv;
}

function createSelectBox(id, labelText, jsFunction) {
  let col = document.createElement("div");
  col.className = "col p-1";
  let label = document.createElement("label");
  label.for = id;
  label.id = `label_${id}`;
  label.className = "row form-label mx-1 my-0 px-1 py-0";
  label.innerText = labelText;
  let select = document.createElement("select");
  select.id = id;
  select.size = 7;
  select.className = "row form-select mx-1 my-0 px-1 py-0";
  select.style.fontSize = "0.85em";
  select.setAttribute("onChange", jsFunction);
  let blankOpt = document.createElement("option");
  blankOpt.value = "";
  blankOpt.innerText = "";
  blankOpt.style.fontSize = "0.85em";
  col.appendChild(label);
  col.appendChild(select);
  return col;
}
