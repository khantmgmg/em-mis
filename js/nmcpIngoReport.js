import * as functions from "./functions.js";
var finalData = {};
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
		},
	};

	let orgUnitData = JSON.parse(localStorage.getItem("orgUnits"));
	let storagePapProviderList = JSON.parse(localStorage.getItem("papProviderList"));
	let storagePapMmwVsIcmv = JSON.parse(localStorage.getItem("papMMWvsICMV"));
	let storagePapVillageList = JSON.parse(localStorage.getItem("papVillageList"));
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
					console.log(event);
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
							switch (orgUnitVillageCode) {
								case providerVillageCode:
									orgUnit = orgUnitId;
									break;
							}
						});
						console.log(`${finalPersonCode}, ${personCode}, ${providerVillageCode}, ${orgUnit}`);
						console.log(orgUnitData[orgUnit]);
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
					cblPeriod = cblPeriod.toISOString();
					cblPeriod = cblPeriod.substring(0, 7);
					if (!(stateRegion in finalData)) {
						finalData[stateRegion] = {};
					}
					if (!(township in finalData[stateRegion])) {
						finalData[stateRegion][township] = {};
					}
					if (!(cblPeriod in finalData[stateRegion][township])) {
						finalData[stateRegion][township][cblPeriod] = {};
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
					}

					if (!(finalPersonCode in finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey])) {
						finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode] = dataTemplate;
						finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["icmvCode"] = finalPersonCode;
						finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["stateRegion"] = stateRegion;
						finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["township"] = township;
						finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["rhc"] = rhc;
						finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["sc"] = sc;
						finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["vill"] = vill;
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
					let dataContent = finalData[stateRegion][township][cblPeriod][finalPersonCodeAbbKey][finalPersonCode]["data"];
					dataContent[ageGroup][`test${sex}`] += 1;
					dataContent["total"][`test${sex}`] += 1;

					if (preg == "Y") {
						dataContent["preg"][`test${sex}`] += 1;
						if (testResult != "Negative") {
							dataContent["preg"][`${testResult}${sex}`] += 1;
							dataContent["preg"][`POS${sex}`] += 1;
						}
					}
					if (testResult != "Negative") {
						dataContent[ageGroup][`${testResult}${sex}`] += 1;
						dataContent[ageGroup][`POS${sex}`] += 1;
						dataContent["total"][`${testResult}${sex}`] += 1;
						dataContent["total"][`POS${sex}`] += 1;
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
		let tspOpt = document.createElement("option");
		tspOpt.value = tsp;
		tspOpt.innerHTML = tsp;
		tspInput.appendChild(tspOpt);
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
		let cblPeriodOpt = document.createElement("option");
		cblPeriodOpt.value = cblPeriod;
		cblPeriodOpt.innerHTML = cblPeriod;
		cblPeriodInput.appendChild(cblPeriodOpt);
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
	Object.keys(cblJson).forEach((provider) => {
		let providerOpt = document.createElement("option");
		providerOpt.value = provider;
		providerOpt.innerHTML = provider;
		providerInput.appendChild(providerOpt);
	});
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
	Object.keys(finalData[srValue][tspValue][cblPeriodValue][providerValue]).forEach((providerCode) => {
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
	});

	let reportData = document.getElementById("reportdata");
	reportData.innerHTML = "";
	printData = functions.sortJson(printData);
	let srno = 1;
	Object.keys(printData).forEach((pRhc) => {
		let rhcName = pRhc;
		printData[pRhc] = functions.sortJson(printData[pRhc]);
		Object.keys(printData[pRhc]).forEach((pSc) => {
			let scName = pSc;
			printData[pRhc][pSc] = functions.sortJson(printData[pRhc][pSc]);
			Object.keys(printData[pRhc][pSc]).forEach((pVill) => {
				let villName = pVill;
				printData[pRhc][pSc][pVill] = functions.sortJson(printData[pRhc][pSc][pVill]);
				Object.keys(printData[pRhc][pSc][pVill]).forEach((pIcmv) => {
					let icmvCode = pIcmv;
					let pData = printData[pRhc][pSc][pVill][pIcmv];
					let descRow = document.createElement("tr");
					descRow.className = "align-middle";
					let srnoCell = createDescCell(srno, "text-center");
					let srCell = createDescCell(srValue, "text-left");
					let tspCell = createDescCell(tspValue, "text-left");
					let rhcCell = createDescCell(pRhc, "text-left");
					let scCell = createDescCell(pSc, "text-left");
					let villCell = createDescCell(pVill, "text-left");
					let providerCodeCell = createDescCell(pIcmv, "text-left");
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
					descRow.appendChild(srnoCell);
					descRow.appendChild(srCell);
					descRow.appendChild(tspCell);
					descRow.appendChild(rhcCell);
					descRow.appendChild(scCell);
					descRow.appendChild(villCell);
					descRow.appendChild(providerCodeCell);
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
					reportData.appendChild(descRow);
					reportData.appendChild(row1to4);
					reportData.appendChild(row5to9);
					reportData.appendChild(row10to14);
					reportData.appendChild(rowMt15);
					reportData.appendChild(rowTotal);
					reportData.appendChild(rowPreg);
					srno += 1;
				});
			});
		});
	});
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
	cell.className = "text-left";
	cell.innerHTML = text;
	return cell;
}

function createDataCell(value, boldText = false) {
	let cell = document.createElement("td");
	cell.className = boldText ? "text-end fw-bold" : "text-end";
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
