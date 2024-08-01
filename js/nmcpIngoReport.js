import * as functions from "./functions.js";
var finalData = {};

export function populateTsp(){
	let assignedOrgUnits = localStorage.getItem("assignedOrgUnits").split(";");
	let orgUnitVillageList = JSON.parse(localStorage.getItem("villageList"));
	let sltOpts = [];
	assignedOrgUnits.forEach(assignedOrgUnit => {
		Object.keys(orgUnitVillageList).forEach(sr => {
			Object.keys(orgUnitVillageList[sr]["children"]).forEach(tsp => {
				let tspId = orgUnitVillageList[sr]["children"][tsp]["id"];
				let tspName = orgUnitVillageList[sr]["children"][tsp]["name"];
				if (tspId == assignedOrgUnit){
					sltOpts.push({"id": tspId, "name": tspName});
				}
			})
		})
	})
	let tspSlt = document.getElementById("slttsp");
	sltOpts.forEach(sltOpt => {
		let opt = document.createElement("option");
		opt.value = sltOpt["id"];
		opt.innerHTML = sltOpt["name"];
		tspSlt.appendChild(opt);
	})
}

export async function execute() {
	functions.showOverlay("Loading data ..................");
	const sltTsp = document.getElementById("slttsp").value;
	const sdate = document.getElementById("sdate").value;
	const edate = document.getElementById("edate").value;
	const domain = localStorage.getItem("domain");
	const token = localStorage.getItem("token");
	const headers = functions.generateHeaders(token);
	// const assignedOrgUnits = localStorage.getItem("assignedOrgUnits");
	const url = `${domain}/api/tracker/trackedEntities.json?enrollmentEnrolledAfter=${sdate}&enrollmentEnrolledBefore=${edate}&program=qDkgAbB5Jlk&orgUnit=${sltTsp}&ouMode=DESCENDANTS&fields=trackedEntity,enrollments[enrollment,attributes[attribute,displayName,value],events[event,status,orgUnit,orgUnitName,occurredAt,programStage,dataValues[dataElement,value]]]&totalPages=true&pageSize=1000`;
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
		"<1yr": {
			testM: 0,
			testF: 0,
			PFM: 0,
			PFF: 0,
			PVM: 0,
			PVF: 0,
			MIXM: 0,
			MIXF: 0,
			POSM: 0,
			POSF: 0,
		},
		"1-4yr": {
			testM: 0,
			testF: 0,
			PFM: 0,
			PFF: 0,
			PVM: 0,
			PVF: 0,
			MIXM: 0,
			MIXF: 0,
			POSM: 0,
			POSF: 0,
		},
		"5-9yr": {
			testM: 0,
			testF: 0,
			PFM: 0,
			PFF: 0,
			PVM: 0,
			PVF: 0,
			MIXM: 0,
			MIXF: 0,
			POSM: 0,
			POSF: 0,
		},
		"10-14yr": {
			testM: 0,
			testF: 0,
			PFM: 0,
			PFF: 0,
			PVM: 0,
			PVF: 0,
			MIXM: 0,
			MIXF: 0,
			POSM: 0,
			POSF: 0,
		},
		">15yr": {
			testM: 0,
			testF: 0,
			PFM: 0,
			PFF: 0,
			PVM: 0,
			PVF: 0,
			MIXM: 0,
			MIXF: 0,
			POSM: 0,
			POSF: 0,
		},
		total: {
			testM: 0,
			testF: 0,
			PFM: 0,
			PFF: 0,
			PVM: 0,
			PVF: 0,
			MIXM: 0,
			MIXF: 0,
			POSM: 0,
			POSF: 0,
		},
		preg: {
			testM: 0,
			testF: 0,
			PFM: 0,
			PFF: 0,
			PVM: 0,
			PVF: 0,
			MIXM: 0,
			MIXF: 0,
			POSM: 0,
			POSF: 0,
		},
	};

	let orgUnitData = JSON.parse(localStorage.getItem("orgUnits"));
	let storagePapProviderList = JSON.parse(localStorage.getItem("papProviderList"));
	let storagePapMmwVsIcmv = JSON.parse(localStorage.getItem("papMMWvsICMV"));
	let storagePapVillageList = JSON.parse(localStorage.getItem("papVillageList"));
	try{
		ptData.forEach((tei) => {
			let enrollments = tei["enrollments"];
			enrollments.forEach((enrollment) => {
				let sex = "";
				let attributes = enrollment["attributes"];
				attributes.forEach((attribute) => {
					if (attribute["attribute"] == "oindugucx72") {
						// print(`Sex: ${attribute["value"]}`)
						sex = attribute["value"].substring(0, 1);
					}
				});
	
				let events = enrollment["events"];
				events.forEach((event) => {
					if (event["programStage"] == "hYyB7FUS5eR") {
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
						// console.log(event);
						if (providerAbb != "T" && providerAbb != "G" && providerAbb != "P" && providerAbb != "R") {
							if (providerAbb == "M") {
								finalPersonCode = storagePapMmwVsIcmv[personCode];
								let icmvCode = `${finalPersonCode}01`;
								let icmvCodeAbb = icmvCode.substring(3, 4);
								providerVillageCode = storagePapProviderList[icmvCodeAbb][icmvCode]["Assigned_village_code"];
							} else if (providerAbb == "V" || providerAbb == "W" || providerAbb == "O") {
								finalPersonCode = personCode.substring(0, 7);
								providerVillageCode = storagePapProviderList[providerAbb][personCode]["Assigned_village_code"];
							}
	
							Object.keys(orgUnitData).forEach((orgUnitId) => {
								let orgUnitVillageCode = orgUnitData[orgUnitId]["code"];
								if (orgUnitVillageCode == providerVillageCode) {
									orgUnit = orgUnitId;
								}
								// switch (orgUnitVillageCode) {
								// 	case providerVillageCode:
								// 		orgUnit = orgUnitId;
								// 		break;
								// }
							});
	
							// console.log(orgUnitData[orgUnit]);
							vill = orgUnitData[orgUnit]["name"];
							sc = orgUnitData[orgUnit]["parent"]["name"];
							rhc = orgUnitData[orgUnit]["parent"]["parent"]["name"];
							township = orgUnitData[orgUnit]["parent"]["parent"]["parent"]["name"];
							stateRegion = orgUnitData[orgUnit]["parent"]["parent"]["parent"]["parent"]["parent"]["name"];
						} else {
							orgUnit = providerLocation;
							try {
								vill = orgUnitData[orgUnit]["name"];
								sc = orgUnitData[orgUnit]["parent"]["name"];
								rhc = orgUnitData[orgUnit]["parent"]["parent"]["name"];
								township = orgUnitData[orgUnit]["parent"]["parent"]["parent"]["name"];
								stateRegion = orgUnitData[orgUnit]["parent"]["parent"]["parent"]["parent"]["parent"]["name"];
							} catch {
								let tspAbb = personCode.substring(0, 3);
								// console.log(tspAbb);
								let storagePapTspList = JSON.parse(localStorage.getItem("papTspList"));
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
						console.log(`${finalPersonCode}, ${personCode}, ${providerVillageCode}, ${orgUnit}, ${stateRegion}, ${township}, ${rhc}, ${sc}, ${vill}`);
						// console.log(`${stateRegion}, ${township}, ${rhc}, ${sc}, ${vill}`);
						cblPeriod = cblPeriod.toISOString();
						cblPeriod = cblPeriod.substring(0, 7);
						if (!(stateRegion in finalData)) {
							finalData[stateRegion] = {};
							finalData[stateRegion]["total"] = deepCopy(dataTemplate);
						}
						if (!(township in finalData[stateRegion])) {
							finalData[stateRegion][township] = {};
							finalData[stateRegion][township]["total"] = deepCopy(dataTemplate);
						}
						if (!(cblPeriod in finalData[stateRegion][township])) {
							finalData[stateRegion][township][cblPeriod] = {};
							finalData[stateRegion][township][cblPeriod]["total"] = deepCopy(dataTemplate);
						}
	
						let finalPersonCodeAbb = finalPersonCode.substring(3, 4);
						let finalPersonCodeAbbKey = "";
						switch (finalPersonCodeAbb) {
							case "V":
								finalPersonCodeAbbKey = "ICMV";
								break;
							case "W":
								finalPersonCodeAbbKey = "ICMV";
								break;
							case "T":
								finalPersonCodeAbbKey = "Mobile";
								break;
							case "G":
								finalPersonCodeAbbKey = "Private";
								break;
							case "O":
								finalPersonCodeAbbKey = "Private";
								break;
							default:
								finalPersonCodeAbbKey = "Other";
								break;
						}
						if (!(finalPersonCodeAbbKey in finalData[stateRegion][township][cblPeriod])) {
							finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey] = {};
							finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey]["total"] = deepCopy(dataTemplate);
						}
	
						if (!(finalPersonCode in finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey])) {
							finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode] = {};
							finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["icmvCode"] = finalPersonCode;
							finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["stateRegion"] = stateRegion;
							finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["township"] = township;
							finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["rhc"] = rhc;
							finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["sc"] = sc;
							finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["vill"] = vill;
							finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["data"] = deepCopy(dataTemplate);
						}
						let srTotal = finalData[stateRegion]["total"];
						let tspTotal = finalData[stateRegion][township]["total"];
						let periodTotal = finalData[stateRegion][township][cblPeriod]["total"];
						let providerTypeTotal = finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey]["total"];
						let dataContent = finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["data"];
						dataContent[ageGroup][`test${sex}`] += 1;
						dataContent["total"][`test${sex}`] += 1;
						periodTotal[ageGroup][`test${sex}`] += 1;
						periodTotal["total"][`test${sex}`] += 1;
						providerTypeTotal[ageGroup][`test${sex}`] += 1;
						providerTypeTotal["total"][`test${sex}`] += 1;
						tspTotal[ageGroup][`test${sex}`] += 1;
						tspTotal["total"][`test${sex}`] += 1;
						srTotal[ageGroup][`test${sex}`] += 1;
						srTotal["total"][`test${sex}`] += 1;
	
						if (preg == "Y") {
							dataContent["preg"][`test${sex}`] += 1;
							periodTotal["preg"][`test${sex}`] += 1;
							providerTypeTotal["preg"][`test${sex}`] += 1;
							if (testResult != "Negative") {
								dataContent["preg"][`${testResult}${sex}`] += 1;
								dataContent["preg"][`POS${sex}`] += 1;
								periodTotal["preg"][`${testResult}${sex}`] += 1;
								periodTotal["preg"][`POS${sex}`] += 1;
								providerTypeTotal["preg"][`${testResult}${sex}`] += 1;
								providerTypeTotal["preg"][`POS${sex}`] += 1;
								tspTotal["preg"][`${testResult}${sex}`] += 1;
								tspTotal["preg"][`POS${sex}`] += 1;
								srTotal["preg"][`${testResult}${sex}`] += 1;
								srTotal["preg"][`POS${sex}`] += 1;
							}
						}
						if (testResult != "Negative") {
							dataContent[ageGroup][`${testResult}${sex}`] += 1;
							dataContent[ageGroup][`POS${sex}`] += 1;
							dataContent["total"][`${testResult}${sex}`] += 1;
							dataContent["total"][`POS${sex}`] += 1;
							
							periodTotal[ageGroup][`${testResult}${sex}`] += 1;
							periodTotal[ageGroup][`POS${sex}`] += 1;
							periodTotal["total"][`${testResult}${sex}`] += 1;
							periodTotal["total"][`POS${sex}`] += 1;
							
							providerTypeTotal[ageGroup][`${testResult}${sex}`] += 1;
							providerTypeTotal[ageGroup][`POS${sex}`] += 1;
							providerTypeTotal["total"][`${testResult}${sex}`] += 1;
							providerTypeTotal["total"][`POS${sex}`] += 1;
							
							tspTotal[ageGroup][`${testResult}${sex}`] += 1;
							tspTotal[ageGroup][`POS${sex}`] += 1;
							tspTotal["total"][`${testResult}${sex}`] += 1;
							tspTotal["total"][`POS${sex}`] += 1;
							
							srTotal[ageGroup][`${testResult}${sex}`] += 1;
							srTotal[ageGroup][`POS${sex}`] += 1;
							srTotal["total"][`${testResult}${sex}`] += 1;
							srTotal["total"][`POS${sex}`] += 1;
						}
					}
				});
			});
		});
	
		console.log(finalData);
		let selectBoxes = document.getElementById("data");
		selectBoxes.appendChild(functions.createSelectBox("sr", "State/Region", "callFromModule('srChange');"));
		selectBoxes.appendChild(functions.createSelectBox("tsp", "Township", "callFromModule('tspChange');"));
		selectBoxes.appendChild(functions.createSelectBox("cblPeriod", "Carbonless period", "callFromModule('cblPeriodChange');"));
		selectBoxes.appendChild(functions.createSelectBox("provider", "Provider type", "callFromModule('providerChange');"));
	
		let srInput = document.getElementById("sr");
		Object.keys(finalData).forEach((finalDataSr) => {
			let srOpt = document.createElement("option");
			srOpt.value = finalDataSr;
			srOpt.innerHTML = finalDataSr;
			srInput.appendChild(srOpt);
		});
	}
	catch{
		alert("Somethin strange happened duing preparing the dataset. Maybe inconsistent data between MIS data and google sheet village list and provider list.\nPlease contact central MEL team for further instruction and bug fixes.")
	}

	functions.hideOverlay();
}

export function srChange() {
	let srInput = document.getElementById("sr");
	let tspInput = document.getElementById("tsp");
	let cblPeriodInput = document.getElementById("cblPeriod");
	let providerInput = document.getElementById("provider");
	tspInput.innerHTML = "";
	cblPeriodInput.innerHTML = "";
	providerInput.innerHTML = "";
	let srValue = srInput.value;
	let srJson = finalData[srValue];
	Object.keys(srJson).forEach((tsp) => {
		if (tsp != "total"){
			let tspOpt = document.createElement("option");
			tspOpt.value = tsp;
			tspOpt.innerHTML = tsp;
			tspInput.appendChild(tspOpt);
		}
	});
}

export function tspChange() {
	let srInput = document.getElementById("sr");
	let tspInput = document.getElementById("tsp");
	let cblPeriodInput = document.getElementById("cblPeriod");
	let providerInput = document.getElementById("provider");
	cblPeriodInput.innerHTML = "";
	providerInput.innerHTML = "";
	let srValue = srInput.value;
	let tspValue = tspInput.value;
	let tspJson = finalData[srValue][tspValue];
	Object.keys(tspJson).forEach((cblPeriod) => {
		if (cblPeriod != "total"){
			let cblPeriodOpt = document.createElement("option");
			cblPeriodOpt.value = cblPeriod;
			cblPeriodOpt.innerHTML = cblPeriod;
			cblPeriodInput.appendChild(cblPeriodOpt);
		}
	});
}

export function cblPeriodChange() {
	let srInput = document.getElementById("sr");
	let tspInput = document.getElementById("tsp");
	let cblPeriodInput = document.getElementById("cblPeriod");
	let providerInput = document.getElementById("provider");
	providerInput.innerHTML = "";
	let srValue = srInput.value;
	let tspValue = tspInput.value;
	let cblPeriodValue = cblPeriodInput.value;
	let cblJson = finalData[srValue][tspValue][cblPeriodValue];
	let srno = 1;
	let reportData = document.getElementById("reportdata");
	let reportHeading = document.getElementById("reportheading");
	reportData.innerHTML = "";
	reportHeading.innerHTML = "";
	generateHeading(true);
	Object.keys(cblJson).forEach((provider) => {
		if (provider != "total"){
			let providerOpt = document.createElement("option");
			providerOpt.value = provider;
			providerOpt.innerHTML = provider;
			providerInput.appendChild(providerOpt);
			let dataBlock = createDataBlock(false, 0, 0, cblJson[provider]["total"], srno, srValue, tspValue, provider);
			Array.from(dataBlock.children).forEach(child => {
				reportData.appendChild(child);
			})
			srno += 1;
		}
	});
	let grandTotal = cblJson["total"];
	let grandTotalBlock = createDataBlock(true, 7, 4, grandTotal);
	Array.from(grandTotalBlock.children).forEach(gtChild => {
		reportData.appendChild(gtChild);
	})
}

export function providerChange() {
	let srInput = document.getElementById("sr");
	let tspInput = document.getElementById("tsp");
	let cblPeriodInput = document.getElementById("cblPeriod");
	let providerInput = document.getElementById("provider");
	let srValue = srInput.value;
	let tspValue = tspInput.value;
	let cblPeriodValue = cblPeriodInput.value;
	let providerValue = providerInput.value;
	let printData = {};
	console.log(finalData[srValue][tspValue][cblPeriodValue][providerValue]);
	Object.keys(finalData[srValue][tspValue][cblPeriodValue][providerValue]).forEach((providerCode) => {
		if (providerCode != "total"){
			let tmpData = finalData[srValue][tspValue][cblPeriodValue][providerValue][providerCode];
			let rhc = tmpData["rhc"];
			let sc = tmpData["sc"];
			let vill = tmpData["vill"];
			let icmvCode = tmpData["icmvCode"];
			let data = tmpData["data"];
			if (!(rhc in printData)) {
				printData[rhc] = {};
			}
			if (!(sc in printData[rhc])) {
				printData[rhc][sc] = {};
			}
			if (!(vill in printData[rhc][sc])) {
				printData[rhc][sc][vill] = {};
			}
			if (!(icmvCode in printData[rhc][sc][vill])) {
				printData[rhc][sc][vill][icmvCode] = data;
			} else {
				console.log(`Duplicate data found: ${icmvCode}`);
			}
			console.log(printData);
		}
	});

	let reportData = document.getElementById("reportdata");
	let reportHeading = document.getElementById("reportheading");
	reportData.innerHTML = "";
	reportHeading.innerHTML = "";
	generateHeading(false);
	printData = functions.sortJson(printData);
	let srno = 1;
	Object.keys(printData).forEach((pRhc) => {
		printData[pRhc] = functions.sortJson(printData[pRhc]);
		Object.keys(printData[pRhc]).forEach((pSc) => {
			printData[pRhc][pSc] = functions.sortJson(printData[pRhc][pSc]);
			Object.keys(printData[pRhc][pSc]).forEach((pVill) => {
				printData[pRhc][pSc][pVill] = functions.sortJson(printData[pRhc][pSc][pVill]);
				Object.keys(printData[pRhc][pSc][pVill]).forEach((pIcmv) => {
					let pData = printData[pRhc][pSc][pVill][pIcmv];
					let blockData = createDataBlock(false, 0, 0, pData, srno, srValue, tspValue, pRhc, pSc, pVill, pIcmv);
					Array.from(blockData.children).forEach(child => {
						reportData.appendChild(child);
					})
					srno += 1;
				});
			});
		});
	});
	let grandTotal = finalData[srValue][tspValue][cblPeriodValue][providerValue]["total"];
	let gtBlock = createDataBlock(true, 7 , 7, grandTotal);
	Array.from(gtBlock.children).forEach(gtChild => {
		reportData.appendChild(gtChild);
	})
}

function createDataBlock(grandTotal = false, gttrowSpan = 7, gttcolSpan = 7, pData, srNo = "defaultSrNo", stateRegion = "defaultSr", township = "defaultTownship", rhc = "defaultRhc", sc = "defaultSc", vill = "defaultVill", pCode = "defaultPcode"){
	let block = document.createElement("table");

	let descRow = document.createElement("tr");
	descRow.className = "align-middle";

	if (grandTotal){
		let gtTd = document.createElement("td");
		gtTd.rowSpan = gttrowSpan;
		gtTd.colSpan = gttcolSpan;
		gtTd.className = "text-center px-1 py-1";
		gtTd.innerHTML = "Grand total";
		descRow.appendChild(gtTd);
	}
	else{
		if (srNo != "" && srNo != null && srNo != "defaultSrNo"){
			let srnoCell = createDescCell(srNo, "text-center px-1 py-1");
			descRow.appendChild(srnoCell);
		}
		
		if (stateRegion != "" && stateRegion != null && stateRegion != "defaultSr"){
			let srCell = createDescCell(stateRegion, "text-left px-1 py-1");
			descRow.appendChild(srCell);
		}
		
		if (township != "" && township != null && township != "defaultTownship"){
			let tspCell = createDescCell(township, "text-left px-1 py-1");
			descRow.appendChild(tspCell);
		}
	
		if (rhc != "" && rhc != null && rhc != "defaultRhc"){
			let rhcCell = createDescCell(rhc, "text-left px-1 py-1");
			descRow.appendChild(rhcCell);
		}
	
		if (sc != "" && sc != null && sc != "defaultSc"){
			let scCell = createDescCell(sc, "text-left px-1 py-1");
			descRow.appendChild(scCell);
		}
		
		if (vill != "" && vill != null && vill != "defaultVill"){
			let villCell = createDescCell(vill, "text-left px-1 py-1");
			descRow.appendChild(villCell);
		}
		
		if (pCode != "" && pCode != null && pCode != "defaultPcode"){
			let providerCodeCell = createDescCell(pCode, "text-left px-1 py-1");
			descRow.appendChild(providerCodeCell);
		}
	}

	let ageGroupCell = createAgeGroupCell("<1");
	let u1TestM = createDataCell(pData["<1yr"]["testM"]);
	let u1TestF = createDataCell(pData["<1yr"]["testF"]);
	let u1PfM = createDataCell(pData["<1yr"]["PFM"]);
	let u1PfF = createDataCell(pData["<1yr"]["PFF"]);
	let u1PvM = createDataCell(pData["<1yr"]["PVM"]);
	let u1PvF = createDataCell(pData["<1yr"]["PVF"]);
	let u1MixM = createDataCell(pData["<1yr"]["MIXM"]);
	let u1MixF = createDataCell(pData["<1yr"]["MIXF"]);
	let u1PosM = createDataCell(pData["<1yr"]["POSM"]);
	let u1PosF = createDataCell(pData["<1yr"]["POSF"]);
	let u1GttM = createDataCell(pData["<1yr"]["testM"]);
	let u1GttF = createDataCell(pData["<1yr"]["testF"]);
	let u1GtpM = createDataCell(pData["<1yr"]["POSM"]);
	let u1GtpF = createDataCell(pData["<1yr"]["POSF"]);
	descRow.appendChild(ageGroupCell);
	descRow.appendChild(u1TestM);
	descRow.appendChild(u1TestF);
	descRow.appendChild(u1PfM);
	descRow.appendChild(u1PfF);
	descRow.appendChild(u1PvM);
	descRow.appendChild(u1PvF);
	descRow.appendChild(u1MixM);
	descRow.appendChild(u1MixF);
	descRow.appendChild(u1PosM);
	descRow.appendChild(u1PosF);
	descRow.appendChild(u1GttM);
	descRow.appendChild(u1GttF);
	descRow.appendChild(u1GtpM);
	descRow.appendChild(u1GtpF);
	let row1to4 = createDataRow("1-4 Year", pData["1-4yr"]);
	let row5to9 = createDataRow("5-9 Year", pData["5-9yr"]);
	let row10to14 = createDataRow("10-14 Year", pData["10-14yr"]);
	let rowMt15 = createDataRow("15 Years and above", pData[">15yr"]);
	let rowTotal = createDataRow("Total", pData["total"], true);
	let rowPreg = createDataRow("Pregnant Women", pData["preg"]);
	block.appendChild(descRow);
	block.appendChild(row1to4);
	block.appendChild(row5to9);
	block.appendChild(row10to14);
	block.appendChild(rowMt15);
	block.appendChild(rowTotal);
	block.appendChild(rowPreg);
	return block;
}


function createDescCell(text, cellClass) {
	let cell = document.createElement("td");
	cell.rowSpan = 7;
	cell.className = cellClass;
	cell.innerHTML = text;
	return cell;
}

function createAgeGroupCell(text) {
	let cell = document.createElement("td");
	cell.className = "text-left px-1 py-1";
	cell.innerHTML = text;
	return cell;
}

function createDataCell(value, boldText = false) {
	let cell = document.createElement("td");
	cell.className = boldText ? "text-end fw-bold px-1 py-1" : "text-end px-1 py-1";
	cell.innerHTML = value;
	return cell;
}

function createDataRow(ageGpText, data, boldText = false) {
	let row = document.createElement("tr");
	let ageGroupCell = createAgeGroupCell(ageGpText);
	let testM = createDataCell(data["testM"], boldText);
	let testF = createDataCell(data["testF"], boldText);
	let pfM = createDataCell(data["PFM"], boldText);
	let pfF = createDataCell(data["PFF"], boldText);
	let pvM = createDataCell(data["PVM"], boldText);
	let pvF = createDataCell(data["PVF"], boldText);
	let mixM = createDataCell(data["MIXM"], boldText);
	let mixF = createDataCell(data["MIXF"], boldText);
	let posM = createDataCell(data["POSM"], boldText);
	let posF = createDataCell(data["POSF"], boldText);
	let gttM = createDataCell(data["testM"], boldText);
	let gttF = createDataCell(data["testF"], boldText);
	let gtpM = createDataCell(data["POSM"], boldText);
	let gtpF = createDataCell(data["POSF"], boldText);
	row.appendChild(ageGroupCell);
	row.appendChild(testM);
	row.appendChild(testF);
	row.appendChild(pfM);
	row.appendChild(pfF);
	row.appendChild(pvM);
	row.appendChild(pvF);
	row.appendChild(mixM);
	row.appendChild(mixF);
	row.appendChild(posM);
	row.appendChild(posF);
	row.appendChild(gttM);
	row.appendChild(gttF);
	row.appendChild(gtpM);
	row.appendChild(gtpF);
	return row;
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}


function generateHeading(tspLevel = false){
	let reportHeading = document.getElementById("reportheading");

	let row1 = document.createElement("tr");
	let row2 = document.createElement("tr");
	let row3 = document.createElement("tr");
	row1.className = "text-center";
	row2.className = "text-center";
	row3.className = "text-center";
	let srnoCell = createHeadCell("Sr", "align-middle", 3, null);
	row1.appendChild(srnoCell);
	let srCell = createHeadCell("State / Region", "align-middle", 3, null);
	row1.appendChild(srCell);
	let tspnoCell = createHeadCell("Township", "align-middle", 3, null);
	row1.appendChild(tspnoCell);

	if (tspLevel){
		let providerTypeCell = createHeadCell ("Provider type", "align-middle", 3, null);
		row1.appendChild(providerTypeCell)
	}
	else{
		let rhcCell = createHeadCell("RHC", "align-middle", 3, null);
		row1.appendChild(rhcCell);
		let scCell = createHeadCell("Subcenter", "align-middle", 3, null);
		row1.appendChild(scCell);
		let villCell = createHeadCell("Village", "align-middle", 3, null);
		row1.appendChild(villCell);
		let providerCell = createHeadCell("Provider code", "align-middle", 3, null);
		row1.appendChild(providerCell);
	}
	let ageGpCell = createHeadCell("Age group", "align-middle", 3, null);
	row1.appendChild(ageGpCell);
	let rdtCell = createHeadCell("RDT", "align-middle", null, 10);
	row1.appendChild(rdtCell);
	let rdtMicroCell = createHeadCell("RDT + Microscopy", "align-middle", null, 4);
	row1.appendChild(rdtMicroCell);

	let testCell = createHeadCell("Total exam", "align-middle", null, 2);
	row2.appendChild(testCell);
	let pfCell = createHeadCell("Pf", "align-middle", null, 2);
	row2.appendChild(pfCell);
	let pvCell = createHeadCell("Pv/Non-Pf", "align-middle", null, 2);
	row2.appendChild(pvCell);
	let mixCell = createHeadCell("Mix", "align-middle", null, 2);
	row2.appendChild(mixCell);
	let posCell = createHeadCell("Total positive", "align-middle", null, 2);
	row2.appendChild(posCell);
	let gttCell = createHeadCell("Grand Total Exam", "align-middle", null, 2);
	row2.appendChild(gttCell);
	let gtpCell = createHeadCell("Grand Total Positive", "align-middle", null, 2);
	row2.appendChild(gtpCell);

	let maleCell1 = createHeadCell("Male", "align-middle", null, null);
	let femaleCell1 = createHeadCell("Female", "align-middle", null, null);
	let maleCell2 = createHeadCell("Male", "align-middle", null, null);
	let femaleCell2 = createHeadCell("Female", "align-middle", null, null);
	let maleCell3 = createHeadCell("Male", "align-middle", null, null);
	let femaleCell3 = createHeadCell("Female", "align-middle", null, null);
	let maleCell4 = createHeadCell("Male", "align-middle", null, null);
	let femaleCell4 = createHeadCell("Female", "align-middle", null, null);
	let maleCell5 = createHeadCell("Male", "align-middle", null, null);
	let femaleCell5 = createHeadCell("Female", "align-middle", null, null);
	let maleCell6 = createHeadCell("Male", "align-middle", null, null);
	let femaleCell6 = createHeadCell("Female", "align-middle", null, null);
	let maleCell7 = createHeadCell("Male", "align-middle", null, null);
	let femaleCell7 = createHeadCell("Female", "align-middle", null, null);
	row3.appendChild(maleCell1);
	row3.appendChild(femaleCell1);
	row3.appendChild(maleCell2);
	row3.appendChild(femaleCell2);
	row3.appendChild(maleCell3);
	row3.appendChild(femaleCell3);
	row3.appendChild(maleCell4);
	row3.appendChild(femaleCell4);
	row3.appendChild(maleCell5);
	row3.appendChild(femaleCell5);
	row3.appendChild(maleCell6);
	row3.appendChild(femaleCell6);
	row3.appendChild(maleCell7);
	row3.appendChild(femaleCell7);

	reportHeading.appendChild(row1);
	reportHeading.appendChild(row2);
	reportHeading.appendChild(row3);
}

function createHeadCell(text, hClass = null, hRowSpan = null, hColSpan = null){
	let th = document.createElement("th");
	th.innerHTML = text;
	th.className = hClass;
	if (hRowSpan != null){
		th.rowSpan = hRowSpan;
	}
	if (hColSpan != null){
		th.colSpan = hColSpan;
	}
	return th;
}