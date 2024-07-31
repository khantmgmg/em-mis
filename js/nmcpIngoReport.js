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
					if (!(finalPersonCode in finalData[stateRegion][township][cblPeriod])) {
						finalData[stateRegion][township][cblPeriod][finalPersonCode] = dataTemplate;
						finalData[stateRegion][township][cblPeriod][finalPersonCode]["icmvCode"] = finalPersonCode;
						finalData[stateRegion][township][cblPeriod][finalPersonCode]["stateRegion"] = stateRegion;
						finalData[stateRegion][township][cblPeriod][finalPersonCode]["township"] = township;
						finalData[stateRegion][township][cblPeriod][finalPersonCode]["rhc"] = rhc;
						finalData[stateRegion][township][cblPeriod][finalPersonCode]["sc"] = sc;
						finalData[stateRegion][township][cblPeriod][finalPersonCode]["vill"] = vill;
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
					let dataContent = finalData[stateRegion][township][cblPeriod][finalPersonCode]["data"];
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
	selectBoxes.appendChild(functions.createSelectBox("sr", "State/Region", "srChange();"));
	selectBoxes.appendChild(functions.createSelectBox("tsp", "Township", "tspChange();"));
	selectBoxes.appendChild(functions.createSelectBox("cblPeriod", "Carbonless period", "cblPeriodChange();"));

	let srInput = document.getElementById("sr");
	Object.keys(finalData).forEach((finalDataSr) => {
		let srOpt = document.createElement("option");
		srOpt.value = finalDataSr;
		srOpt.innerHTML = finalDataSr;
		srInput.appendChild(srOpt);
	});

	functions.hideOverlay();
}

function srChange() {
	let srInput = document.getElementById("sr");
	let tspInput = document.getElementById("tsp");
	let cblPeriodInput = document.getElementById("cblPeriod");
	tspInput.innerHTML = "";
	cblPeriodInput.innerHTML = "";
	let srValue = srInput.value();
	let srJson = finalData[srValue];
	Object.keys(srJson).forEach((tsp) => {
		let tspOpt = document.createElement("option");
		tspOpt.value = tsp;
		tspOpt.innerHTML = tsp;
		tspInput.appendChild(tspOpt);
	});
}

function tspChange() {
	let srInput = document.getElementById("sr");
	let tspInput = document.getElementById("tsp");
	let cblPeriodInput = document.getElementById("cblPeriod");
	cblPeriodInput.innerHTML = "";
	let srValue = srInput.value();
	let tspValue = tspInput.value();
	let tspJson = finalData[srValue][tspValue];
	Object.keys(tspJson).forEach((cblPeriod) => {
		let cblPeriodOpt = document.createElement("option");
		cblPeriodOpt.value = cblPeriod;
		cblPeriodOpt.innerHTML = cblPeriod;
		cblPeriodInput.appendChild(cblPeriodOpt);
	});
}

function cblPeriodChange() {
	console.log("CBL change");
}
