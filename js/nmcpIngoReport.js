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
        console.log(overlay);
        let overlayInfo = document.getElementById("overlay-info");
        console.log(overlayInfo);
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
                totalFemale: 0
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
                totalFemale: 0
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
                totalFemale: 0
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
                totalFemale: 0
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
                totalFemale: 0
            },
            "total": {
                testMale: 0,
                testFemale: 0,
                pfMale: 0,
                pfFemale: 0,
                pvMale: 0,
                pvFemale: 0,
                mixMale: 0,
                mixFemale: 0,
                totalMale: 0,
                totalFemale: 0
            },
            "preg": {
                testMale: 0,
                testFemale: 0,
                pfMale: 0,
                pfFemale: 0,
                pvMale: 0,
                pvFemale: 0,
                mixMale: 0,
                mixFemale: 0,
                totalMale: 0,
                totalFemale: 0
            }
        }
    }



    finalData = {};
    let orgUnitData = JSON.parse(localStorage.getItem("orgUnits"));
    let storagePapProviderList = JSON.parse(localStorage.getItem("papProviderList"));
    let storagePapMmwVsIcmv = JSON.parse(localStorage.getItem("papMMWvsICMV"));
    let storagePapVillageList = JSON.parse(localStorage.getItem("papVillageList"));
    ptData.forEach(tei => {
        let enrollments = tei["enrollments"];
        enrollments.forEach((enrollment) => {

            let events = enrollment["events"];
            events.forEach((event) => {   
                let orgUnit = "";
                let cblMth = "";
                let cblYr = "";
                let personCode = "";
                let providerLocation = "";
                let ageGroup = "";
                let preg = "";
                let sex = "";
                
                let dataValues = event["dataValues"];
                dataValues.forEach(dataValue => {
                    let deId = dataValue["dataElement"];
                    switch (deId){
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
                        case "ECVGASvuHV3":
                            let ptAge = Number(dataValue["value"]);
                            if (ptAge >= 15){
                                ageGroup = ">15yr";
                            }
                            else if (ptAge >= 10){
                                ageGroup = "10-14yr";
                            }
                            else if (ptAge >= 5){
                                ageGroup = "5-9yr";
                            }
                            else if (ptAge >= 1){
                                ageGroup = "1-4yr";
                            }
                            else{
                                ageGroup = "<1yr";
                            }
                            break;
                    }
                })
                let cblPeriod = new Date(`${cblMth}-${cblYr} UTC`);

                let providerAbb = personCode.substring(3,4);
                let providerVillageCode = "";
                let finalPersonCode = "";
                if (providerAbb != "T" && providerAbb != "G" && providerAbb != "P" && providerAbb != "R"){
                    if (providerAbb == "M"){
                        finalPersonCode = storagePapMmwVsIcmv[personCode];
                        let icmvCode = `${finalPersonCode}01`;
                        let icmvCodeAbb = icmvCode.substring(3,4);
                        providerVillageCode = storagePapProviderList[icmvCodeAbb][icmvCode]["Assigned_village_code"];
                    }
                    else if (providerAbb == "V" || providerAbb == "W" || providerAbb == "O"){
                        finalPersonCode = personCode.substring(0,6);
                        providerVillageCode = storagePapProviderList[providerAbb][personCode]["Assigned_village_code"];
                    }
                    
                    orgUnitData.forEach(orgUnitId => {
                        let orgUnitVillageCode = orgUnitData[orgUnitId]["code"];
                        switch (orgUnitVillageCode){
                            case providerVillageCode:
                                orgUnit = orgUnitId;
                                break;
                        }
                    })
                }
                else{
                    orgUnit = providerLocation;
                }

                let vill = orgUnitData[orgunit]["name"];
                let sc = orgUnitData[orgunit]["parent"]["name"];
                let rhc = orgUnitData[orgunit]["parent"]["parent"]["name"];         
                let township = orgUnitData[orgUnit]["parent"]["parent"]["parent"]["name"];
                let stateRegion = orgUnitData[orgUnit]["parent"]["parent"]["parent"]["parent"]["parent"]["name"];

                cblPeriod = cblPeriod.toISOString().substring(0,7);
                if (!(cblPeriod in finalData)){
                    finalData[cblPeriod] = {}
                }
                if (!(finalPersonCode in finalData[cblPeriod])){
                    finalData[cblPeriod][finalPersonCode] = dataTemplate;
                    finalData[cblPeriod][finalPersonCode]["icmvCode"] = finalPersonCode;
                    finalData[cblPeriod][finalPersonCode]["stateRegion"] = stateRegion;
                    finalData[cblPeriod][finalPersonCode]["township"] = township;
                    finalData[cblPeriod][finalPersonCode]["rhc"] = rhc;
                    finalData[cblPeriod][finalPersonCode]["sc"] = sc;
                    finalData[cblPeriod][finalPersonCode]["vill"] = vill;
                }



                
                
                
            })
        })
    })
}