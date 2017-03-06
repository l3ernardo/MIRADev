/**************************************************************************************************
*
* MIRA Web field calculation codes
* Date: 25 August 2016
* By: genonms@ph.ibm.com
*
*/

var param = require('./class-parameter.js');
var util = require('./class-utility.js');
var opMetric = require('./class-opmetric.js');
var q  = require("q");
var performanceTab = require('./class-performanceoverview.js');

var calculatefield = {
	//** Additional calculations for asmt Audits & Reviews tab (BU Country, IMT, IOT)
	createAuditsReviewsSupportDocs: function(doc) {
		try {
			//Create a copy of asmtsdocs so other processes that change it won't interfere with AU's list of Assessments
			doc[0].AuditsReviewsAssessments = JSON.parse(JSON.stringify(doc[0].asmtsdocs));
			//Create a copy of AU Docs so other processes that change it won't interfere with AU's list of Assessable Units
			if (doc[0].ParentDocSubType == "BU Country" || doc[0].ParentDocSubType == "Global Process") {
				doc[0].AuditsReviewsAssessableUnits = JSON.parse(JSON.stringify(doc[0].AUDocs));
			}
			else {
				doc[0].AuditsReviewsAssessableUnits = JSON.parse(JSON.stringify(doc[0].AUDocsObj));
			}
			if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transform") {
				//Create a copy of the asmt CRM docs (GTS use only) for BU Country
				doc[0].AuditsReviewsCRMDocs = JSON.parse(JSON.stringify(doc[0].asmtsdocsCRM));
				//Create a copy of the asmt IS Delivery docs (GTS use only) for BU Country
				doc[0].AuditsReviewsISDeliveryDocs = JSON.parse(JSON.stringify(doc[0].asmtsdocsDelivery));
			}
		}
		catch(e){
      console.log("[class-fieldcalc][createAuditsReviewsSupportDocs] - " + e.stack);
		}
	},
	// adding empty Test View Data Only
	addTestViewData: function(colnum, rownum) {
		var vwData = [];
		var col = [];
		for (var i = 0; i < colnum; i++) {
			col.push("");
		}
		var listdata = {col};
		for (var i = 0; i < rownum; i++) {
			vwData.push(listdata);
		}
		return vwData;
	},
	addTestViewDataPadding: function(obj, colnum, rownum) {
		var col = [];
		if (obj.length > 0) {
			for (var i = 0; i < rownum; i++) {
				obj.push({});
				for (var prop in obj[0]) {
					if (obj[0].hasOwnProperty(prop)) {
						obj[(obj.length-1)][prop] = "";
					}
				}
			}
		}
	},
	// adding empty Test View Data Only
	getRatingCategory: function(rating, ratingPrev) {
		var ratingCat;
		if (rating == "Sat") {
			if (ratingPrev == "Marg" || ratingPrev == "Unsat")
			ratingCat = "Sat &#9650;";
			else
			ratingCat = "Sat &#61;";
		} else if (rating == "Marg") {
			if (ratingPrev == "Unsat")
			ratingCat = "Marg &#9650;";
			else if (ratingPrev == "Sat")
			ratingCat = "Marg &#9660;";
			else
			ratingCat = "Marg &#61;";
		} else if (rating == "Unsat") {
			if (ratingPrev == "Sat" || ratingPrev == "Marg")
			ratingCat = "Unsat &#9660;";
			else
			ratingCat = "Unsat &#61;";
		} else if (rating == "Exempt") {
			ratingCat = "Exempt";
		} else {
			ratingCat = "NR";
		}
		return ratingCat;
	},

	getPrev4Qtrs: function(currentQtr) {
		var p4Qtrs = [];
		var current = currentQtr.split("Q");
		var prevYr = current[0]-1;
		switch (current[1]) {
			case "1":
			p4Qtrs.push(prevYr1+" Q1");
			p4Qtrs.push(prevYr+" Q2");
			p4Qtrs.push(prevYr+" Q3");
			p4Qtrs.push(prevYr+" Q4");
			break;
			case "2":
			p4Qtrs.push(prevYr+" Q2");
			p4Qtrs.push(prevYr+" Q3");
			p4Qtrs.push(prevYr+" Q4");
			p4Qtrs.push(current[0]+" Q1");
			break;
			case "3":
			p4Qtrs.push(prevYr+" Q3");
			p4Qtrs.push(prevYr+" Q4");
			p4Qtrs.push(current[0]+" Q1");
			p4Qtrs.push(current[0]+" Q2");
			break;
			case "4":
			p4Qtrs.push(prevYr+" Q4");
			p4Qtrs.push(current[0]+" Q1");
			p4Qtrs.push(current[0]+" Q2");
			p4Qtrs.push(current[0]+" Q3");
			break;
		}
		return p4Qtrs;
	},

	getPrevQtr: function(currentQtr) {
		var prevQtr;
		var current = currentQtr.split("Q");
		var prevYr = current[0]-1;
		switch (current[1]) {
			case "1":
			prevQtr = prevYr+" Q4";
			break;
			case "2":
			prevQtr = current[0]+" Q1";
			break;
			case "3":
			prevQtr = current[0]+" Q2";
			break;
			case "4":
			prevQtr = current[0]+" Q3";
			break;
		}
		return prevQtr;
	},

	getCUMaxScore: function(CUSize) {
		var CUMaxScore;
		if (CUSize == "") {
			CUMaxScore = "";
		} else if (CUSize == "Large") {
			CUMaxScore = 9;
		} else if (CUSize == "Medium") {
			CUMaxScore = 3;
		} else if (CUSize == "Small") {
			CUMaxScore = 1;
		} else {
			CUMaxScore = 0;
		}
		return CUMaxScore;
	},

	getCUScore: function(arrating, cumaxscore) {
		if(cumaxscore == "") return "";
		var ratingscore;
		var cuscore;
		if (arrating == "Sat") {
			ratingscore = 1;
		} else if (arrating == "Marg") {
			ratingscore = 0.75;
		} else {
			ratingscore = 0;
		}
		cuscore = ratingscore * cumaxscore
		return cuscore;
	},

	getCompMIRABusinessUnit: function(doc) {
		var MIRABusinessUnit;
		switch (doc.compntType) {
			case "openIssue":
			case "sampledCountry":
			case "PPR":
			case "controlSample":
				if (doc.BUPARENT == "BSU300000027") {
					MIRABusinessUnit = "GBS";
				}
				else if ((doc.BUPARENT == "BSU300000028" && doc.GPPARENT == "GPC100000114") || (doc.CUCategory == "GTS TRANSFORMATION" || doc.CUCategory == "GTS Transf. Hybrid")) {
					MIRABusinessUnit = "GTS Transformation";
				}
				else {
					MIRABusinessUnit = "GTS";
				}
				break;
			case "countryControls":
				if (doc.BUPARENT == "BSU300000027") {
					MIRABusinessUnit = "GBS";
				}
				else if (doc.BUPARENT == "BSU300000028" && doc.GPPARENT == "GPC100000114") {
					MIRABusinessUnit = "GTS Transformation";
				}
				else {
					MIRABusinessUnit = "GTS";
				}
				break;
			default:
				MIRABusinessUnit = "";
		}
		return MIRABusinessUnit;
	},

	getProcessCategory: function(processID, doc) {
		var processCategory = "Operational";
		try{
			if(doc[0].KCProcessOPS !== undefined) {
				for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
					if(doc[0].KCProcessOPS[j].name == undefined){
						for(var y= 0; y<doc[0].KCProcessOPS[j].members.length; y++){
							if(processID == doc[0].KCProcessOPS[j].members[y].id) {
								processCategory = "Operational";
								break;
							}
						}
						if (doc[0].processCategory !== undefined) break;
					}
					else{
						if(processID == doc[0].KCProcessOPS[j].id) {
							processCategory = "Operational";
							break;
						}
					}
				}
			}
			if(doc[0].processCategory == undefined && doc[0].KCProcessFIN !== undefined) {
				for (var j = 0; j < doc[0].KCProcessFIN.length; j++) {
					if(doc[0].KCProcessFIN[j].name == undefined){
						for(var y= 0; y<doc[0].KCProcessFIN[j].members.length; y++){
							if(processID == doc[0].KCProcessFIN[j].members[y].id) {
								processCategory = "Financial";
								break;
							}
						}
						if (doc[0].processCategory !== undefined) break;
					}
					else{
						if (processID == doc[0].KCProcessFIN[j].id) {
							processCategory = "Financial";
							break;
						}
					}
				}
			}
		}
		catch(e){
			console.log("[fieldcalc][getProcessCategory] - " + e.stack)
		}
		finally{
			return processCategory;
		}
	},

	/* Calculates CatP, CatCU, BusinessUnitOLD, ShowEA ... etc */
	getDocParams: function(req, db, doc) {
		var deferred = q.defer();
		try{

			/* Calculate for Instance Design Specifics and parameters*/
			var lParams = [];

			// Get Parameters for Assessable Units
			if (doc[0].DocType == "Assessable Unit") {
				if (doc[0].MIRABusinessUnit == "GTS") {
					// GTS Assessable Unit Doc Parameters
					if (doc[0].DocSubType == "Controllable Unit") {
						doc[0].CatCU = "";
						lParams = ['CRMCU','GTSInstanceDesign'];
					} else if (doc[0].DocSubType == "Country Process" || doc[0].DocSubType == "Global Process") {
						doc[0].CatP = "";
						lParams = ['CRMProcess','DeliveryProcess','GTSInstanceDesign','EAProcess'];
					} else if (doc[0].DocSubType == "BU Country" || doc[0].DocSubType == "BU IMT" || doc[0].DocSubType == "BU IOT") {
						lParams = ['CRMProcess','DeliveryProcess','CRMCU'];
					} else {
						lParams = ['GTSInstanceDesign'];
					}
				} else if (doc[0].MIRABusinessUnit == "GBS") {
					// GBS Assessable Unit Doc Parameters
					lParams.push('GBSInstanceDesign');
				} else {
					// GTS Transformation Assessable Unit Doc Parameters
				}
				//Pushing these parameters so they can be used as attributes
				lParams.push('DeliveryCU');
				lParams.push('AuditCUIS');
				lParams.push('AuditCUOTHER');
			}
			// Get Parameters for Assessments
			else {
				doc[0].AuditCUISObj = {};
				doc[0].AuditCUOTHERObj = {};
				if (doc[0].MIRABusinessUnit == "GTS") {
					// GTS Assessment Doc Parameters
					if (doc[0].ParentDocSubType == "Controllable Unit") {
						doc[0].CatCU = "";
						lParams = ['CRMCU','GTSInstanceDesign'];
					} else if (doc[0].ParentDocSubType == "Country Process" || doc[0].ParentDocSubType == "Global Process") {
						doc[0].CatP = "";
						lParams = ['CRMProcess','DeliveryProcess','GTSInstanceDesign','EAProcess'];
					} else if (doc[0].ParentDocSubType == "BU Country" || doc[0].ParentDocSubType == "BU IMT" || doc[0].ParentDocSubType == "BU IOT") {
						lParams = ['CRMProcess','DeliveryProcess','CRMCU'];
					} else {
						lParams = ['GTSInstanceDesign'];
					}
					if (doc[0].ParentDocSubType == "Controllable Unit" || doc[0].ParentDocSubType == "Business Unit" || doc[0].ParentDocSubType == "BU Reporting Group" || doc[0].ParentDocSubType == "BU IOT" || doc[0].ParentDocSubType == "BU IMT" || doc[0].ParentDocSubType == "BU Country" || doc[0].ParentDocSubType == "Account") {
						// For Testing Tab Dynamic tables in the Rollup Assessments
						lParams.push('GTSRollupProcessesOPS');
						lParams.push('GTSRollupProcessesFIN');
					}
					//Pushing these parameters so they can be used as attributes
					lParams.push('DeliveryCU');
					lParams.push('AuditCUIS');
					lParams.push('AuditCUOTHER');
				}
				else if (doc[0].MIRABusinessUnit == "GBS") {
					// GBS Assessment Doc Parameters
					lParams.push('GBSInstanceDesign');
					if (doc[0].ParentDocSubType == "Controllable Unit" || doc[0].ParentDocSubType == "Business Unit" || doc[0].ParentDocSubType == "BU Reporting Group" || doc[0].ParentDocSubType == "BU IOT" || doc[0].ParentDocSubType == "BU IMT" || doc[0].ParentDocSubType == "BU Country" || doc[0].ParentDocSubType == "Account") {
						// For Testing Tab Dynamic tables in the Rollup Assessments
						lParams.push('GBSRollupProcessesOPS');
						lParams.push('GBSRollupProcessesFIN');
					}
				}
				else {
					// GTS Transformation Assessment Doc Parameters
				}

				// For Operational Metric Parameters of Assessments
				var opMetricKey = opMetric.getOpMetricKeys(doc,lParams);

			}
			lParams.push('MargThresholdPercent');
			lParams.push('UnsatThresholdPercent');

			param.getListParams(db, lParams).then(function(dataParam) {
				if (doc[0].MIRABusinessUnit == "GTS") {
					doc[0].CRMProcessObj = {};
					doc[0].DeliveryProcessObj = {};
					doc[0].CRMCUObj = {};
					doc[0].DeliveryCUObj = {};
				}
				if(dataParam.status==200 & !dataParam.error) {
					if (dataParam.parameters.CRMProcess) {
						for (var j = 0; j < dataParam.parameters.CRMProcess[0].options.length; ++j) {
							if (doc[0].GlobalProcess == dataParam.parameters.CRMProcess[0].options[j].name) doc[0].CatP = "CRM";
							if (doc[0].MIRABusinessUnit == "GTS") doc[0].CRMProcessObj[dataParam.parameters.CRMProcess[0].options[j].name] = true;
						}
						if (doc[0].MIRABusinessUnit == "GTS") {
							doc[0].CRMProcess = dataParam.parameters.CRMProcess;
						}
					}
					if (dataParam.parameters.DeliveryProcess) {
						for (var j = 0; j < dataParam.parameters.DeliveryProcess[0].options.length; ++j) {
							if (doc[0].GlobalProcess == dataParam.parameters.DeliveryProcess[0].options[j].name) doc[0].CatP = "Delivery";
							if (doc[0].MIRABusinessUnit == "GTS") doc[0].DeliveryProcessObj[dataParam.parameters.DeliveryProcess[0].options[j].name] = true;
						}
						if (doc[0].MIRABusinessUnit == "GTS") {
							doc[0].DeliveryProcess = dataParam.parameters.DeliveryProcess;
						}
					}
					if (dataParam.parameters.CRMCU) {
						for (var j = 0; j < dataParam.parameters.CRMCU[0].options.length; ++j) {
							if (doc[0].Category == dataParam.parameters.CRMCU[0].options[j].name) doc[0].CatCU = "CRM";
							if (doc[0].MIRABusinessUnit == "GTS") doc[0].CRMCUObj[dataParam.parameters.CRMCU[0].options[j].name] = true;
						}
						if (doc[0].MIRABusinessUnit == "GTS") {
							doc[0].CRMCU = dataParam.parameters.CRMCU;
						}
					}
					if (dataParam.parameters.DeliveryCU) {
						for (var j = 0; j < dataParam.parameters.DeliveryCU[0].options.length; ++j) {
							if (doc[0].Category == dataParam.parameters.DeliveryCU[0].options[j].name) doc[0].CatCU = "Delivery";
							if (doc[0].MIRABusinessUnit == "GTS") doc[0].DeliveryCUObj[dataParam.parameters.DeliveryCU[0].options[j].name] = true;
						}
						if (doc[0].MIRABusinessUnit == "GTS") {
							doc[0].DeliveryCU = dataParam.parameters.DeliveryCU;
						}
						doc[0].CUCatList = dataParam.parameters.DeliveryCU[0].options;
					}
					if (dataParam.parameters.AuditCUIS){
						doc[0].AuditCUIS = dataParam.parameters.AuditCUIS;
						for (var j = 0; j < dataParam.parameters.AuditCUIS[0].options.length; ++j) {
							doc[0].CUCatList.push(dataParam.parameters.AuditCUIS[0].options[j]);
							if (doc[0].DocType == "Assessment") {
								doc[0].AuditCUISObj[dataParam.parameters.AuditCUIS[0].options[j]] = true;
							}
						}
					}
					console.log(doc[0].AuditCUISObj);
					if (dataParam.parameters.AuditCUOTHER) {
						doc[0].AuditCUOTHER = dataParam.parameters.AuditCUOTHER;
						for (var j = 0; j < dataParam.parameters.AuditCUOTHER[0].options.length; ++j) {
							doc[0].CUCatList.push(dataParam.parameters.AuditCUOTHER[0].options[j]);
							if (doc[0].DocType == "Assessment") {
								doc[0].AuditCUOTHERObj[dataParam.parameters.AuditCUOTHER[0].options[j]] = true;
							}
						}
						console.log(doc[0].AuditCUOTHERObj);
						doc[0].CUCatList.sort(function(a, b){
					    var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
					    if (nameA < nameB) //sort string ascending
					      return -1
					    if (nameA > nameB)
					      return 1
					    return 0 //default return value (no sorting)
					  });
					}
					if (dataParam.parameters.ProcessCatFIN) {
						doc[0].ProcessCategory = "OPS";
						for (var j = 0; j < dataParam.parameters.ProcessCatFIN[0].options.length; ++j) {
							if (doc[0].GPWWBCITKey == dataParam.parameters.ProcessCatFIN[0].options[j].name)
								doc[0].ProcessCategory = "FIN";
						}
					}
					if (dataParam.parameters.GBSRollupProcessesOPS) {
						doc[0].KCProcessOPS = dataParam.parameters.GBSRollupProcessesOPS[0].options;
					}
					if (dataParam.parameters.GBSRollupProcessesFIN) {
						doc[0].KCProcessFIN = dataParam.parameters.GBSRollupProcessesFIN[0].options;
					}
					if (dataParam.parameters.GTSRollupProcessesOPS) {
						doc[0].KCProcessOPS = dataParam.parameters.GTSRollupProcessesOPS[0].options;
					}
					if (dataParam.parameters.GTSRollupProcessesFIN) {
						doc[0].KCProcessFIN = dataParam.parameters.GTSRollupProcessesFIN[0].options;
					}
					if (dataParam.parameters.MargThresholdPercent) {
						doc[0].MargThresholdPercent = dataParam.parameters.MargThresholdPercent[0].options[0].name;
					}
					if (dataParam.parameters.UnsatThresholdPercent) {
						doc[0].UnsatThresholdPercent = dataParam.parameters.UnsatThresholdPercent[0].options[0].name;
					}

					// Get Operational Metrics
					if (dataParam.parameters[opMetricKey]) {
						opMetric.getOpMetrics(doc,dataParam,opMetricKey,req);
					}
					if (doc[0].DocSubType == "Country Process" && dataParam.parameters.EAProcess && doc[0].GPWWBCITKey != undefined && dataParam.parameters.EAProcess.indexOf(doc[0].GPWWBCITKey) != -1 ) {
						doc[0].ShowEA = 1;
					}
					// evaluate BusinessUnitOLD formula
					if (dataParam.parameters.GTSInstanceDesign) doc[0].BusinessUnitOLD = eval(dataParam.parameters.GTSInstanceDesign[0].options[0].name);
					if (dataParam.parameters.GBSInstanceDesign) doc[0].BusinessUnitOLD = eval(dataParam.parameters.GBSInstanceDesign[0].options[0].name);

					if(doc[0].KCProcessFIN != undefined) doc[0].KCProcessFINSCT = JSON.parse(JSON.stringify(doc[0].KCProcessFIN));
          else doc[0].KCProcessFINSCT = [];
          if(doc[0].KCProcessOPS != undefined) doc[0].KCProcessOPSSCT = JSON.parse(JSON.stringify(doc[0].KCProcessOPS));
          else doc[0].KCProcessOPSSCT = [];

					deferred.resolve(doc);
				} else {
					console.log("[class-fieldcalc][getDocParams][getListParams] - " + dataParam.error);
					deferred.reject({"status": 500, "error": dataParam.error});
				}
			}).catch(function(err) {
				console.log("[class-fieldcalc][getDocParams][getListParams] - " + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			console.log("[class-fieldcalc][getDocParams] - " + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	getCurrentAsmt: function(db, doc) {
		var deferred = q.defer();

		try {

			// Get cuurent quarter assessment
			var asmt = {
				selector:{
					"_id": {"$gt":0},
					"key": "Assessment",
					"AUStatus": "Active",
					"ParentDocSubType": doc[0].DocSubType,
					"WWBCITKey": doc[0].WWBCITKey,
					"CurrentPeriod": doc[0].CurrentPeriod
				}
			};
			db.find(asmt).then(function(asmtdata) {
				deferred.resolve({"status": 200, "doc": asmtdata.body.docs[0]});
			}).catch(function(err) {
				console.log("[class-fieldcalc][getCurrentAsmt] - " + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});

		} catch(e) {

			console.log("[class-fieldcalc][getCurrentAsmt] - " + e.stack);
			deferred.reject({"status": 500, "error": e.stack});

		}

		return deferred.promise;
	},

	/* Gets Constituent assesments of assessable unit */
	getAssessments: function(db, doc, req) {
		var deferred = q.defer();
		try {
			switch (doc[0].ParentDocSubType) {
				case "Global Process":
				var asmts = {
					selector : {
						"_id": {"$gt":0},
						"BusinessUnit": doc[0].BusinessUnit,
						"$or": [
							//Getting all country process and controllable unit assessment
							{"$and": [{"key": "Assessment"},{"AUStatus": "Active"},{"ParentDocSubType": "Country Process"},{"CurrentPeriod": doc[0].CurrentPeriod},{"GPWWBCITKey": doc[0].WWBCITKey} ]},
							{"$and": [{"key": "Assessment"},{"AUStatus": "Active"},{"ParentDocSubType": "Controllable Unit"},{"CurrentPeriod": doc[0].CurrentPeriod},{"RelevantGPs":{"$elemMatch" :  {"$eq": doc[0].GlobalProcess }}} ]},
							//Getting all  Country Process  assessable units
							{"$and": [{"key": "Assessable Unit"},{"Status": "Active"},{"DocSubType": "Country Process"},{"CurrentPeriod": doc[0].CurrentPeriod},{"GPPARENT":doc[0].WWBCITKey} ]},
							//Getting allcontrollable units  assessable units
							{"$and": [{"key": "Assessable Unit"},{"Status": "Active"},{"DocSubType": "Controllable Unit"},{"CurrentPeriod": doc[0].CurrentPeriod},{"RelevantGPs":{"$elemMatch" :  {"$eq":  doc[0].GlobalProcess }}} ]}
						]}
					};
					break;
				case "BU Country":
				var asmts = {
					selector : {
						"_id": {"$gt":0},
						"BusinessUnit": doc[0].BusinessUnit,
						"$or": [
							//Getting all country process and controllable unit assessment
							{"$and": [{"key": "Assessment"},{"AUStatus": "Active"},{"ParentDocSubType": {"$in":["Country Process", "Controllable Unit"]}},{"CurrentPeriod": doc[0].CurrentPeriod},{"Country": doc[0].Country} ]},
							//Getting all controllable units assessable units
							{"$and": [{"key": "Assessable Unit"},{"Status": "Active"},{"DocSubType": "Controllable Unit"},{"CurrentPeriod": doc[0].CurrentPeriod},{"parentid":doc[0].parentid} ]},
							//Getting all Country Process assessable units
							{"$and": [{"key": "Assessable Unit"},{"Status": "Active"},{"DocSubType": "Country Process"},{"CurrentPeriod": doc[0].CurrentPeriod},{"Country": doc[0].Country} ]}
						]}
					};
					break;
					case "BU IMT":
					var asmts = {
						selector:{
							"_id": {"$gt":0},
							"BusinessUnit": doc[0].BusinessUnit,
							"CurrentPeriod": req.session.quarter,
							"Status": "Active",
							"$or":
							[
								//{"$and": [{"DocSubType":"BU Country"},{"parentid":doc[0].parentid},{"ExcludeGeo":{"$ne": "Yes"}}]},
								{"$and": [{"DocSubType":"BU Country"},{"key": "Assessable Unit"}]},
								{"$and": [{"DocSubType":"Controllable Unit"},{"parentid":doc[0].parentid},{"key": "Assessable Unit"}]},
								{"$and": [{"DocSubType":"Country Process"},{"IMT":doc[0].IMTName},{"key": "Assessable Unit"}]}
								//{"$and": [{"DocSubType": "Controllable Unit"},{"ParentDocSubType": "BU IMT"}{"parentid":doc[0].parentid}]},

						]//or
					}};
					break;
					case "BU IOT":
					var CountryCodes = [];
					var countriesCode = {};
					for (var i = 0; i < global.hierarchy.IOT.length; i++) {
						if(global.hierarchy.IOT[i].name == doc[0].IOT){
							for (var j = 0; j < global.hierarchy.IOT[i].IMTs.length; j++) {
								//global.hierarchy.countries[global.hierarchy.IMT[global.hierarchy.IOT[i].IMTs[j]][j]].id
								for (var k = 0; k < global.hierarchy.IMT[global.hierarchy.IOT[i].IMTs[j]].length; k++) {
									CountryCodes.push(global.hierarchy.countries[global.hierarchy.IMT[global.hierarchy.IOT[i].IMTs[j]][k]].id);
									countriesCode[global.hierarchy.countries[global.hierarchy.IMT[global.hierarchy.IOT[i].IMTs[j]][k]].id] = true;
								}
							}
						}
					}
					var asmts = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"BusinessUnit": doc[0].BusinessUnit,
							"CurrentPeriod": req.session.quarter,
							"Status": "Active",
							"$or":
							[
								{"$and": [{"DocSubType":{"$in":["BU IMT","Controllable Unit"]}},{"parentid":doc[0].parentid}]},
								{"$and": [{"DocSubType":"Country Process"},{"IOT":doc[0].IOT}]},
								{"$and": [{"DocSubType":"BU Reporting Group"},{"_id":{"$in":doc[0].RGRollup.split(",")}}]},
								//{"$and": [{"DocSubType":"BU Country"},{"_id":{"$in":doc[0].BUCountryIOT.split(",")}},{"ExcludeGeo":{"$ne": "Yes"}}]}
								{"$and": [{"DocSubType":"BU Country"},{"Country": {"$in":CountryCodes}}]}
						]//or
					}};
					break;
					case "BU Reporting Group":
					var asmts = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessment",
							"AUStatus": "Active",
							"CurrentPeriod": req.session.quarter,
							"BRGMembership": {"$regex": "(?i)"+doc[0]._id+"(?i)"}
						}
					};
					break;
					case "Business Unit":
					var asmts = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessment",
							"AUStatus": "Active",
							"CurrentPeriod": req.session.quarter,
							// "BusinessUnit": doc[0].BusinessUnit,
							"BusinessUnit": "testing only, replace this with the commented line above in IT8",
							"ParentDocSubType":{"$in":["Controllable Unit","Country Process","Global Process","BU IOT"]}
						}
					};
					break;
					case "Controllable Unit":
					var asmts = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessment",
							"AUStatus": "Active",
							"CurrentPeriod": req.session.quarter,
							"$or": [
								{ "$and": [{"ParentDocSubType": "Country Process"},{"AssessableUnitName":{"$in":doc[0].RelevantCPs}}] },
								{ "$and": [{"ParentDocSubType": "Account"}, {"grandparentid": doc[0].parentid}] }
							]
						}
					};
					break;
					case "Country Process":
					var asmts = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessment",
							"AUStatus": "Active",
							"CurrentPeriod": req.session.quarter,
							"$or": [
								{ "$and": [{"ParentDocSubType": "Controllable Unit"},{"WWBCITKey":{"$in":doc[0].CURelevant}}] }
							]
						}
					};
					break;
			}
			db.find(asmts).then(function(asmtsdata) {
				// Populate View Data
				switch (doc[0].ParentDocSubType) {
					case "Global Process":

						doc[0].asmtsdocs = [];
						doc[0].auditableAUIds = [];
						var asmtsdocs = asmtsdata.body.docs;
						var CUassunits = [];
						var CUauditables = {};
						var CUCRMables = {};
						var CPauditables = {};
						var CPassmts = {};
						doc[0].AUDocs = {};
						// For Current Quarter Country Process Defect Rate Exceptions
						doc[0].CPDRException = [];
						// For CP Financial Process Defect Rates that are Marg counter
						var margCPDRFin = 0;
						// For CP Financial Process Defect Rates that are Unsat counter
						var unsatCPDRFin = 0;
						// For CP Operational Process Defect Rates that are Marg counter
						var margCPDROps = 0;
						// For CP Operationa Process Defect Rates that are Unsat counter
						var unsatCPDROps = 0;

						if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit) {
							doc[0].asmtsdocsCRM = [];
							doc[0].asmtsdocsDelivery = [];
						}
						for (var i = 0; i < asmtsdocs.length; ++i) {
							if (asmtsdocs[i].key == "Assessment"){
								doc[0].asmtsdocs.push(asmtsdocs[i]);
								//asmtsdocs[i].Type = "Country Process";
								CPassmts[asmtsdocs[i].parentid] = asmtsdocs[i];
								if (doc[0].MIRABusinessUnit == "GTS") {
									if(doc[0].CRMProcessObj[asmtsdocs[i].GPWWBCITKey]){
										asmtsdocs[i].catP = "CRM";
										doc[0].asmtsdocsCRM.push(asmtsdocs[i])
									}else if(doc[0].DeliveryProcessObj[asmtsdocs[i].GPWWBCITKey]){
										asmtsdocs[i].catP = "Delivery";
										doc[0].asmtsdocsDelivery.push(asmtsdocs[i])
									}else {
										doc[0].asmtsdocs.pop();
										//console.log("GP not found: "+ asmtsdocs[i].GPWWBCITKey);
									}
								}
								// Get Current Quarter Country Process Defect Rate Exceptions
								if ( asmtsdocs[i].ParentDocSubType == "Country Process") {
									// Format Defect Rate
									asmtsdocs[i].AUDefectRate = parseInt(asmtsdocs[i].AUDefectRate).toFixed(1);
									if (asmtsdocs[i].AUDefectRate == 0) {
										asmtsdocs[i].AUDefectRate = parseInt(asmtsdocs[i].AUDefectRate).toFixed(0);
									}
									// Get RAGStatus and if Marg or Unsat, push to list of Current Quarter Country Process Defect Rate Exception
									asmtsdocs[i].processCategory = calculatefield.getProcessCategory(asmtsdocs[i].GPWWBCITKey, doc);
									if (asmtsdocs[i].AUDefectRate >= doc[0].UnsatThresholdPercent) {
										asmtsdocs[i].RAGStatus = "Unsat";
										doc[0].CPDRException.push(asmtsdocs[i]);
										if (asmtsdocs[i].processCategory == "Financial") {
											unsatCPDRFin += 1;
										}else {
											unsatCPDROps += 1;
										}
									} else if (asmtsdocs[i].AUDefectRate < doc[0].MargThresholdPercent) {
										asmtsdocs[i].RAGStatus = "Sat";
									} else {
										asmtsdocs[i].RAGStatus = "Marg";
										doc[0].CPDRException.push(asmtsdocs[i]);
										if (asmtsdocs[i].processCategory == "Financial") {
											margCPDRFin += 1;
										}else {
											margCPDROps += 1;
										}
									}
								}
							}
							else if (asmtsdocs[i].key == "Assessable Unit"){
								doc[0].AUDocs[asmtsdocs[i]["_id"]] = asmtsdocs[i];
								if (asmtsdocs[i].DocSubType == "Controllable Unit") {
									CUassunits.push(asmtsdocs[i]);
									if(asmtsdocs[i].AuditableFlag == "Yes"){
										doc[0].auditableAUIds.push(asmtsdocs[i]._id);
										CUauditables[asmtsdocs[i]["_id"]] = asmtsdocs[i];
									}
									if (doc[0].MIRABusinessUnit == "GTS") {
										if(doc[0].CRMCUObj[asmtsdocs[i].Category]){
											CUCRMables[asmtsdocs[i]["_id"]] = true;
										}else if(doc[0].DeliveryCUObj[asmtsdocs[i].Category]){
											CUCRMables[asmtsdocs[i]["_id"]] = false;
										}else{
											CUassunits.pop();
											//console.log("CU category not found: "+ asmtsdocs[i].Category);
										}
									}
								}
								else{
									if(asmtsdocs[i].AuditableFlag == "Yes"){
										doc[0].auditableAUIds.push(asmtsdocs[i]._id);
										CPauditables[asmtsdocs[i]["_id"]] = asmtsdocs[i];
									}
								}
							}
						}
						// For CP Defect Rate Exceptions
						doc[0].margCPDRFin = margCPDRFin;
						doc[0].unsatCPDRFin = unsatCPDRFin;
						doc[0].margCPDROps = margCPDROps;
						doc[0].unsatCPDROps = unsatCPDROps;
						for(var key in CPauditables){
							CPassmts[key].CUSize = CPauditables[key].CUSize
							CPassmts[key].CUMaxScore = calculatefield.getCUMaxScore(CPassmts[key].CUSize);
							CPassmts[key].CUScore = calculatefield.getCUScore(CPassmts[key].PeriodRating, CPassmts[key].CUMaxScore);
							doc[0].AUData.push(CPassmts[key]);
						}
						var $or = [];
						for(var i = 0; i < CUassunits.length; i++){
							$or.push({parentid: CUassunits[i]["_id"]});
						}
						var tmpQuery = {
							selector : {
								"_id": {"$gt":0},
								"key": "Assessment",
								"AUStatus": "Active",
								"ParentDocSubType": "Controllable Unit",
								"CurrentPeriod": doc[0].CurrentPeriod,
								$or
							}
						};
						db.find(tmpQuery).then(function(asmts) {
							doc[0].asmtsdocs = doc[0].asmtsdocs.concat(asmts.body.docs);
							for (var i = 0; i < asmts.body.docs.length; i++) {
								if(CUauditables[asmts.body.docs[i].parentid]){

									asmts.body.docs[i].CUSize = CUauditables[asmts.body.docs[i].parentid].CUSize
									asmts.body.docs[i].CUMaxScore = calculatefield.getCUMaxScore(asmts.body.docs[i].CUSize);
									asmts.body.docs[i].CUScore = calculatefield.getCUScore(asmts.body.docs[i].PeriodRating, asmts.body.docs[i].CUMaxScore);
									if(CUauditables[asmts.body.docs[i].parentid].Portfolio == "Yes") {
										asmts.body.docs[i].Type = "Portfolio CU";
									}else{
										asmts.body.docs[i].Type = "Standalone CU";
									}
									doc[0].AUData.push(asmts.body.docs[i]);
								}
								if (doc[0].MIRABusinessUnit == "GTS") {
									if(CUCRMables[asmts.body.docs[i].parentid]) {
										asmts.body.docs[i].catP = "CRM";
										doc[0].asmtsdocsCRM.push(asmts.body.docs[i]);
									}else{
										asmts.body.docs[i].catP = "Delivery";
										doc[0].asmtsdocsDelivery.push(asmts.body.docs[i]);
									}
								}
							}
							//** Additional calculations for BU Country's asmt Audits & Reviews tab
							//For Audits & Reviews
							calculatefield.createAuditsReviewsSupportDocs(doc);
							//Successful resolve
							deferred.resolve({"status": 200, "doc": doc});
						}).catch(function(err) {
							console.log("[class-fieldcalc][getAssessments] - " + err.error.reason);
							deferred.reject({"status": 500, "error": err.error.reason});
						});




						break;
					case "BU IOT":
						// doc[0].AUDocs = asmtsdata.body.docs;
						doc[0].AUDocs = [];
						var unitdocs = asmtsdata.body.docs;
						doc[0].auditableAUIds = [];
						doc[0].ExcludedCountryNames = [];
						doc[0].ExcludedCountryIDs = [];
						doc[0].AUDocsObj = {};
						doc[0].AUAuditables = {};
						doc[0].AUCountries = [];
						doc[0].AsmtCountries = [];
						doc[0].asmtsdocsObj = {};
						doc[0].asmtsdocsDelivery = [];
						doc[0].asmtsdocsCRM = [];
						// For Current Quarter Country Process Defect Rate Exceptions
						doc[0].CPDRException = [];
						// For CP Financial Process Defect Rates that are Marg counter
						var margCPDRFin = 0;
						// For CP Financial Process Defect Rates that are Unsat counter
						var unsatCPDRFin = 0;
						// For CP Operational Process Defect Rates that are Marg counter
						var margCPDROps = 0;
						// For CP Operationa Process Defect Rates that are Unsat counter
						var unsatCPDROps = 0;

						var CRMables = {};
						var Deliveryables = {};
						var $or = [];
						var IDsForCus = [];
						for(var i = 0; i < unitdocs.length; i++){
							// $or.push({parentid: doc[0].AUDocs[i]["_id"]});
							// doc[0].AUDocsObj[doc[0].AUDocs[i]["_id"]] = doc[0].AUDocs[i];
							if (unitdocs[i].DocSubType == "BU Country" && unitdocs[i].ExcludeGeo !== undefined  && unitdocs[i].ExcludeGeo ==  "Yes") {
								doc[0].ExcludedCountryNames.push(util.resolveGeo(unitdocs[i].Country,"Country",req));
								doc[0].ExcludedCountryIDs.push(unitdocs[i].Country);
							} else {
								if (unitdocs[i].DocSubType != "BU Country") {
									$or.push({parentid: unitdocs[i]["_id"]});
									doc[0].AUDocsObj[unitdocs[i]["_id"]] = unitdocs[i];
									doc[0].AUDocs.push(unitdocs[i]);
								}
								if (unitdocs[i].DocSubType == "BU Country" ) {
									$or.push({parentid: unitdocs[i]["_id"]});
									doc[0].AUDocsObj[unitdocs[i]["_id"]] = unitdocs[i];
									doc[0].AUDocs.push(unitdocs[i]);
									IDsForCus.push(unitdocs[i]["_id"]);
								}
								if (unitdocs[i].DocSubType == "BU IMT") {
									IDsForCus.push(unitdocs[i]["_id"]);
								}
							}
							if(unitdocs[i].DocSubType == "Country Process" || unitdocs[i].DocSubType == "Controllable Unit"){
								if(unitdocs[i].AuditableFlag == "Yes"){
									doc[0].AUAuditables[unitdocs[i]["_id"]] = unitdocs[i];
								}
							}

							if (doc[0].MIRABusinessUnit == "GTS") {
								if(unitdocs[i].DocSubType == "Country Process"){
									if(doc[0].CRMProcessObj[unitdocs[i].GPPARENT]){
										CRMables[unitdocs[i]["_id"]] = true;
									}else if(doc[0].DeliveryProcessObj[unitdocs[i].GPPARENT]){
										Deliveryables[unitdocs[i]["_id"]] = true;
									}else{
										$or.pop();
										delete doc[0].AUDocsObj[unitdocs[i]["_id"]];
										console.log("CP category not found: "+ unitdocs[i].GPPARENT);
									}
								}else if(unitdocs[i].DocSubType == "Controllable Unit"){
									if(doc[0].CRMCUObj[unitdocs[i].Category]){
										CRMables[unitdocs[i]["_id"]] = true;
									}else if(doc[0].DeliveryCUObj[unitdocs[i].Category]){
										Deliveryables[unitdocs[i]["_id"]] = true;
									}else{
										//$or.pop();
										//delete doc[0].AUDocsObj[unitdocs[i]["_id"]];
										//console.log("CU category not found: "+ unitdocs[i].Category);
									}
								}else if(unitdocs[i].DocSubType == "BU Country" && unitdocs[i].parentid == doc[0].parentid && unitdocs[i].ExcludeGeo !== undefined  && unitdocs[i].ExcludeGeo !=  "Yes"){
									doc[0].AUCountries.push(unitdocs[i]);
								}
							}
						}
						//Bringing second level - Roll Up
						var tmpQuery = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"CurrentPeriod": doc[0].CurrentPeriod,
							"Status": "Active",
							"DocSubType":"Controllable Unit",
							"parentid":{"$in":IDsForCus}
					}
				};
						db.find(tmpQuery).then(function(asmts) {
							var unitdocs = asmts.body.docs;
							for (var i = 0; i < unitdocs.length; i++) {
								$or.push({parentid: unitdocs[i]["_id"]});
								doc[0].AUDocsObj[unitdocs[i]["_id"]] = unitdocs[i];
								doc[0].AUDocs.push(unitdocs[i]);
								if(unitdocs[i].AuditableFlag != undefined && unitdocs[i].AuditableFlag == "Yes"){
									doc[0].auditableAUIds.push(unitdocs[i]._id);
									doc[0].AUAuditables[unitdocs[i]["_id"]] = unitdocs[i];
								}
								if (doc[0].MIRABusinessUnit == "GTS") {
									if(doc[0].CRMCUObj[unitdocs[i].Category]){
										CRMables[unitdocs[i]["_id"]] = true;
									}else if(doc[0].DeliveryCUObj[unitdocs[i].Category]){
										Deliveryables[unitdocs[i]["_id"]] = true;
									}else{
										//$or.pop();
										//delete doc[0].AUDocsObj[unitdocs[i]["_id"]];
										//console.log("CU category not found: "+ unitdocs[i].Category);
									}
								}
							}
						//END OF SECOND LEVEL DATA - ROLL UP
						var tmpQuery = {
							selector : {
								"_id": {"$gt":0},
								"key": "Assessment",
								"AUStatus": "Active",
								"ParentDocSubType":{"$in":["Country Process","Controllable Unit","BU Country"]},
								"CurrentPeriod": doc[0].CurrentPeriod,
								$or
							}
						};
						db.find(tmpQuery).then(function(asmts) {
							doc[0].asmtsdocs = asmts.body.docs;
							for (var i = 0; i < doc[0].asmtsdocs.length; i++) {
									//DATA RPTG Country Testing
									if ( doc[0].asmtsdocs[i].ParentDocSubType == "Country Process") {
										// Format Defect Rate
										doc[0].asmtsdocs[i].AUDefectRate = parseInt(doc[0].asmtsdocs[i].AUDefectRate).toFixed(1);
										if (doc[0].asmtsdocs[i].AUDefectRate == 0) {
											doc[0].asmtsdocs[i].AUDefectRate = parseInt(doc[0].asmtsdocs[i].AUDefectRate).toFixed(0);
										}
										// Get RAGStatus and if Marg or Unsat, push to list of Current Quarter Country Process Defect Rate Exception
										doc[0].asmtsdocs[i].processCategory = calculatefield.getProcessCategory(doc[0].asmtsdocs[i].GPWWBCITKey, doc);
										if (doc[0].asmtsdocs[i].AUDefectRate >= doc[0].UnsatThresholdPercent) {
											doc[0].asmtsdocs[i].RAGStatus = "Unsat";
											doc[0].CPDRException.push(doc[0].asmtsdocs[i]);
											if (doc[0].asmtsdocs[i].processCategory == "Financial") {
												unsatCPDRFin += 1;
											}else {
												unsatCPDROps += 1;
											}
										} else if (doc[0].asmtsdocs[i].AUDefectRate < doc[0].MargThresholdPercent) {
											doc[0].asmtsdocs[i].RAGStatus = "Sat";
										} else {
											doc[0].asmtsdocs[i].RAGStatus = "Marg";
											doc[0].CPDRException.push(doc[0].asmtsdocs[i]);
											if (doc[0].asmtsdocs[i].processCategory == "Financial") {
												margCPDRFin += 1;
											}else {
												margCPDROps += 1;
											}
										}
									}

								//END OF DATA RPTG Country Testing
								doc[0].asmtsdocsObj[doc[0].asmtsdocs[i]["_id"]] = doc[0].asmtsdocs[i];
								if(doc[0].AUAuditables[doc[0].asmtsdocs[i].parentid]){
									doc[0].asmtsdocs[i].CUSize = doc[0].AUDocsObj[doc[0].asmtsdocs[i].parentid].CUSize
									doc[0].asmtsdocs[i].CUMaxScore = calculatefield.getCUMaxScore(doc[0].asmtsdocs[i].CUSize);
									//doc[0].asmtsdocs[i].CUScore = calculatefield.getCUScore(doc[0].AUDocsObj[doc[0].asmtsdocs[i].parentid].PeriodRating, doc[0].asmtsdocs[i].CUMaxScore);
									doc[0].asmtsdocs[i].CUScore = calculatefield.getCUScore(doc[0].asmtsdocs[i].PeriodRating, doc[0].asmtsdocs[i].CUMaxScore);
									doc[0].AUData.push(doc[0].asmtsdocs[i]);
								}
								if (doc[0].MIRABusinessUnit == "GTS") {
									if(CRMables[doc[0].asmtsdocs[i].parentid]){
										doc[0].asmtsdocs[i].catP = "CRM";
										doc[0].asmtsdocsCRM.push(doc[0].asmtsdocs[i]);
									}else	if(Deliveryables[doc[0].asmtsdocs[i].parentid]){
										doc[0].asmtsdocs[i].catP = "Delivery";
										doc[0].asmtsdocsDelivery.push(doc[0].asmtsdocs[i]);
									}else{
										doc[0].asmtsdocs[i].catP = "(Not Categorized)";
									}
								}
							}
							//For Audits & Reviews
							calculatefield.createAuditsReviewsSupportDocs(doc);
							//Successful resolve
							deferred.resolve({"status": 200, "doc": doc});
						}).catch(function(err) {
							console.log("[class-fieldcalc][getAssessments] - " + err.error.reason);
							deferred.reject({"status": 500, "error": err.error.reason});
						});
						}).catch(function(err) {
							console.log("[class-fieldcalc][getAssessments] - " + err.error.reason);
							deferred.reject({"status": 500, "error": err.error.reason});
						});
						break;
					case "BU IMT":
					// doc[0].AUDocs = asmtsdata.body.docs;
						doc[0].auditableAUIds = [];
						doc[0].AUDocs = [];
						var unitdocs = asmtsdata.body.docs;
						doc[0].ExcludedCountryNames = [];
						doc[0].ExcludedCountryIDs = [];
						doc[0].AUDocsObj = {};
						doc[0].AUAuditables = {};
						doc[0].AUCountries = [];
						doc[0].AsmtCountries = [];
						doc[0].asmtsdocsObj = {};
						doc[0].asmtsdocsDelivery = [];
						doc[0].asmtsdocsCRM = [];
						// For Current Quarter Country Process Defect Rate Exceptions
						doc[0].CPDRException = [];
						// For CP Financial Process Defect Rates that are Marg counter
						var margCPDRFin = 0;
						// For CP Financial Process Defect Rates that are Unsat counter
						var unsatCPDRFin = 0;
						// For CP Operational Process Defect Rates that are Marg counter
						var margCPDROps = 0;
						// For CP Operationa Process Defect Rates that are Unsat counter
						var unsatCPDROps = 0;

						var CRMables = {};
						var Deliveryables = {};
						var $or = [];
						var countriesID = [];
						for(var i = 0; i < unitdocs.length; i++){
							//Used to find all IMT's Auditable Units ID
							if (unitdocs[i].key == "Assessable Unit"){
								if(unitdocs[i].AuditableFlag == "Yes"){
										doc[0].auditableAUIds.push(unitdocs[i]._id);
								}
							}
							if (unitdocs[i].DocSubType == "BU Country" && unitdocs[i].ExcludeGeo !== undefined  && unitdocs[i].ExcludeGeo ==  "Yes") {
								doc[0].ExcludedCountryNames.push(util.resolveGeo(unitdocs[i].Country,"Country",req));
								doc[0].ExcludedCountryIDs.push(unitdocs[i].Country);
							} else {
								if (unitdocs[i].DocSubType != "BU Country") {
									$or.push({parentid: unitdocs[i]["_id"]});
									doc[0].AUDocsObj[unitdocs[i]["_id"]] = unitdocs[i];
									doc[0].AUDocs.push(unitdocs[i]);
								}
								if (unitdocs[i].DocSubType == "BU Country" && unitdocs[i].parentid == doc[0].parentid) {
									$or.push({parentid: unitdocs[i]["_id"]});
									doc[0].AUDocsObj[unitdocs[i]["_id"]] = unitdocs[i];
									doc[0].AUDocs.push(unitdocs[i]);
									countriesID.push(unitdocs[i]["_id"]);
								}
							}
							if(unitdocs[i].DocSubType == "Country Process" || unitdocs[i].DocSubType == "Controllable Unit"){
								if(unitdocs[i].AuditableFlag != undefined && unitdocs[i].AuditableFlag == "Yes"){
									doc[0].AUAuditables[unitdocs[i]["_id"]] = unitdocs[i];
								}
							}
							if (doc[0].MIRABusinessUnit == "GTS") {
								if(unitdocs[i].DocSubType == "Country Process"){
									if(doc[0].CRMProcessObj[unitdocs[i].GPPARENT]){
										CRMables[unitdocs[i]["_id"]] = true;
									}else if(doc[0].DeliveryProcessObj[unitdocs[i].GPPARENT]){
										Deliveryables[unitdocs[i]["_id"]] = true;
									}else{
										//$or.pop();
										//delete doc[0].AUDocsObj[unitdocs[i]["_id"]];
										//console.log("CP category not found: "+ unitdocs[i].GPPARENT);
									}
								}else if(unitdocs[i].DocSubType == "Controllable Unit"){
									if(doc[0].CRMCUObj[unitdocs[i].Category]){
										CRMables[unitdocs[i]["_id"]] = true;
									}else if(doc[0].DeliveryCUObj[unitdocs[i].Category]){
										Deliveryables[unitdocs[i]["_id"]] = true;
									}else{
										$or.pop();
										delete doc[0].AUDocsObj[unitdocs[i]["_id"]];
										console.log("CU category not found: "+ unitdocs[i].Category);
									}
								}else if(unitdocs[i].DocSubType == "BU Country" && unitdocs[i].parentid == doc[0].parentid && unitdocs[i].ExcludeGeo !== undefined  && unitdocs[i].ExcludeGeo !=  "Yes"){
									doc[0].AUCountries.push(unitdocs[i]);
								}
							}
						}
						//Bringing second level - Roll Up
						var tmpQuery = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"CurrentPeriod": doc[0].CurrentPeriod,
							"Status": "Active",
							"DocSubType":"Controllable Unit",
							"parentid":{"$in":countriesID}
					}
				};
						db.find(tmpQuery).then(function(asmts) {
							var unitdocs = asmts.body.docs;
							for (var i = 0; i < unitdocs.length; i++) {
								$or.push({parentid: unitdocs[i]["_id"]});
								doc[0].AUDocsObj[unitdocs[i]["_id"]] = unitdocs[i];
								doc[0].AUDocs.push(unitdocs[i]);
								if(unitdocs[i].AuditableFlag != undefined && unitdocs[i].AuditableFlag == "Yes"){
									doc[0].auditableAUIds.push(unitdocs[i]._id);
									doc[0].AUAuditables[unitdocs[i]["_id"]] = unitdocs[i];
								}
								if (doc[0].MIRABusinessUnit == "GTS") {
									if(doc[0].CRMCUObj[unitdocs[i].Category]){
										CRMables[unitdocs[i]["_id"]] = true;
									}else if(doc[0].DeliveryCUObj[unitdocs[i].Category]){
										Deliveryables[unitdocs[i]["_id"]] = true;
									}else{
										//$or.pop();
										//delete doc[0].AUDocsObj[unitdocs[i]["_id"]];
										//console.log("CU category not found: "+ unitdocs[i].Category);
									}
								}
							}
						//END OF SECOND LEVEL DATA - ROLL UP
						var tmpQuery = {
							selector : {
								"_id": {"$gt":0},
								"key": "Assessment",
								"AUStatus": "Active",
								"ParentDocSubType":{"$in":["Country Process","Controllable Unit","BU Country"]},
								"CurrentPeriod": doc[0].CurrentPeriod,
								$or
							}
						};
						db.find(tmpQuery).then(function(asmts) {
							doc[0].asmtsdocs = asmts.body.docs;
							for (var i = 0; i < doc[0].asmtsdocs.length; i++) {
								//DATA RPTG Country Testing
								if (doc[0].asmtsdocs[i].key == "Assessment"){
									if ( doc[0].asmtsdocs[i].ParentDocSubType == "Country Process" && doc[0].ExcludedCountryNames.indexOf(doc[0].asmtsdocs[i].Country) == -1 ) {
										// Format Defect Rate
										doc[0].asmtsdocs[i].AUDefectRate = parseInt(doc[0].asmtsdocs[i].AUDefectRate).toFixed(1);
										if (doc[0].asmtsdocs[i].AUDefectRate == 0) {
											doc[0].asmtsdocs[i].AUDefectRate = parseInt(doc[0].asmtsdocs[i].AUDefectRate).toFixed(0);
										}
										// Get RAGStatus and if Marg or Unsat, push to list of Current Quarter Country Process Defect Rate Exception
										doc[0].asmtsdocs[i].processCategory = calculatefield.getProcessCategory(doc[0].asmtsdocs[i].GPWWBCITKey, doc);
										if (doc[0].asmtsdocs[i].AUDefectRate >= doc[0].UnsatThresholdPercent) {
											doc[0].asmtsdocs[i].RAGStatus = "Unsat";
											doc[0].CPDRException.push(doc[0].asmtsdocs[i]);
											if (doc[0].asmtsdocs[i].processCategory == "Financial") {
												unsatCPDRFin += 1;
											}else {
												unsatCPDROps += 1;
											}
										} else if (doc[0].asmtsdocs[i].AUDefectRate < doc[0].MargThresholdPercent) {
											doc[0].asmtsdocs[i].RAGStatus = "Sat";
										} else {
											doc[0].asmtsdocs[i].RAGStatus = "Marg";
											doc[0].CPDRException.push(doc[0].asmtsdocs[i]);
											if (doc[0].asmtsdocs[i].processCategory == "Financial") {
												margCPDRFin += 1;
											}else {
												margCPDROps += 1;
											}
										}
									}
								}
								//END OF DATA RPTG Country Testing
								doc[0].asmtsdocsObj[doc[0].asmtsdocs[i]["_id"]] = doc[0].asmtsdocs[i];
								if(doc[0].AUAuditables[doc[0].asmtsdocs[i].parentid]){
									doc[0].asmtsdocs[i].CUSize = doc[0].AUDocsObj[doc[0].asmtsdocs[i].parentid].CUSize
									doc[0].asmtsdocs[i].CUMaxScore = calculatefield.getCUMaxScore(doc[0].asmtsdocs[i].CUSize);
									//doc[0].asmtsdocs[i].CUScore = calculatefield.getCUScore(doc[0].AUDocsObj[doc[0].asmtsdocs[i].parentid].PeriodRating, doc[0].asmtsdocs[i].CUMaxScore);
									doc[0].asmtsdocs[i].CUScore = calculatefield.getCUScore(doc[0].asmtsdocs[i].PeriodRating, doc[0].asmtsdocs[i].CUMaxScore);
									doc[0].AUData.push(doc[0].asmtsdocs[i]);
								}
								if (doc[0].MIRABusinessUnit == "GTS") {
									if(CRMables[doc[0].asmtsdocs[i].parentid]){
										doc[0].asmtsdocs[i].catP = "CRM";
										doc[0].asmtsdocsCRM.push(doc[0].asmtsdocs[i]);
									}else	if(Deliveryables[doc[0].asmtsdocs[i].parentid]){
										doc[0].asmtsdocs[i].catP = "Delivery";
										doc[0].asmtsdocsDelivery.push(doc[0].asmtsdocs[i]);
									}else{
										doc[0].asmtsdocs[i].catP = "(Not Categorized)";
									}
								}
							}
							// For CP Defect Rate Exceptions
							doc[0].margCPDRFin = margCPDRFin;
							doc[0].unsatCPDRFin = unsatCPDRFin;
							doc[0].margCPDROps = margCPDROps;
							doc[0].unsatCPDROps = unsatCPDROps;
							//For Audits & Reviews
							calculatefield.createAuditsReviewsSupportDocs(doc);
							//Successful resolve
							deferred.resolve({"status": 200, "doc": doc});
						}).catch(function(err) {
							console.log("[class-fieldcalc][getAssessments] - " + err.error.reason);
							deferred.reject({"status": 500, "error": err.error.reason});
						});
						}).catch(function(err) {
							console.log("[class-fieldcalc][getAssessments] - " + err.error.reason);
							deferred.reject({"status": 500, "error": err.error.reason});
						});
						break;
					case "BU Country":
						doc[0].asmtsdocs = [];
						doc[0].auditableAUIds = [];
						var asmtsdocs = asmtsdata.body.docs;
						var CUassunits = [];
						var CUauditables = {};
						var CUCRMables = {};
						var CPauditables = {};
						var CPassmts = {};
						doc[0].AUDocs = {};
						// For Current Quarter Country Process Defect Rate Exceptions
						doc[0].CPDRException = [];
						// For CP Financial Process Defect Rates that are Marg counter
						var margCPDRFin = 0;
						// For CP Financial Process Defect Rates that are Unsat counter
						var unsatCPDRFin = 0;
						// For CP Operational Process Defect Rates that are Marg counter
						var margCPDROps = 0;
						// For CP Operationa Process Defect Rates that are Unsat counter
						var unsatCPDROps = 0;

						if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit) {
							doc[0].asmtsdocsCRM = [];
							doc[0].asmtsdocsDelivery = [];
						}
						for (var i = 0; i < asmtsdocs.length; ++i) {
							if (asmtsdocs[i].key == "Assessment"){
								doc[0].asmtsdocs.push(asmtsdocs[i]);
								asmtsdocs[i].Type = "Country Process";
								CPassmts[asmtsdocs[i].parentid] = asmtsdocs[i];
								if (doc[0].MIRABusinessUnit == "GTS") {
									if(doc[0].CRMProcessObj[asmtsdocs[i].GPWWBCITKey]){
										asmtsdocs[i].catP = "CRM";
										doc[0].asmtsdocsCRM.push(asmtsdocs[i])
									}else if(doc[0].DeliveryProcessObj[asmtsdocs[i].GPWWBCITKey]){
										asmtsdocs[i].catP = "Delivery";
										doc[0].asmtsdocsDelivery.push(asmtsdocs[i])
									}else {
										doc[0].asmtsdocs.pop();
										//console.log("GP not found: "+ asmtsdocs[i].GPWWBCITKey);
									}
								}
								// Get Current Quarter Country Process Defect Rate Exceptions
								if ( asmtsdocs[i].ParentDocSubType == "Country Process") {
									// Format Defect Rate
									asmtsdocs[i].AUDefectRate = parseInt(asmtsdocs[i].AUDefectRate).toFixed(1);
									if (asmtsdocs[i].AUDefectRate == 0) {
										asmtsdocs[i].AUDefectRate = parseInt(asmtsdocs[i].AUDefectRate).toFixed(0);
									}
									// Get RAGStatus and if Marg or Unsat, push to list of Current Quarter Country Process Defect Rate Exception
									asmtsdocs[i].processCategory = calculatefield.getProcessCategory(asmtsdocs[i].GPWWBCITKey, doc);
									if (asmtsdocs[i].AUDefectRate >= doc[0].UnsatThresholdPercent) {
										asmtsdocs[i].RAGStatus = "Unsat";
										doc[0].CPDRException.push(asmtsdocs[i]);
										if (asmtsdocs[i].processCategory == "Financial") {
											unsatCPDRFin += 1;
										}else {
											unsatCPDROps += 1;
										}
									} else if (asmtsdocs[i].AUDefectRate < doc[0].MargThresholdPercent) {
										asmtsdocs[i].RAGStatus = "Sat";
									} else {
										asmtsdocs[i].RAGStatus = "Marg";
										doc[0].CPDRException.push(asmtsdocs[i]);
										if (asmtsdocs[i].processCategory == "Financial") {
											margCPDRFin += 1;
										}else {
											margCPDROps += 1;
										}
									}
								}
							}
							else if (asmtsdocs[i].key == "Assessable Unit"){
								doc[0].AUDocs[asmtsdocs[i]["_id"]] = asmtsdocs[i];
								if (asmtsdocs[i].DocSubType == "Controllable Unit") {
									CUassunits.push(asmtsdocs[i]);
									if(asmtsdocs[i].AuditableFlag == "Yes"){
										doc[0].auditableAUIds.push(asmtsdocs[i]._id);
										CUauditables[asmtsdocs[i]["_id"]] = asmtsdocs[i];
									}
									if (doc[0].MIRABusinessUnit == "GTS") {
										if(doc[0].CRMCUObj[asmtsdocs[i].Category]){
											CUCRMables[asmtsdocs[i]["_id"]] = true;
										}else if(doc[0].DeliveryCUObj[asmtsdocs[i].Category]){
											CUCRMables[asmtsdocs[i]["_id"]] = false;
										}else{
											CUassunits.pop();
											//console.log("CU category not found: "+ asmtsdocs[i].Category);
										}
									}
								}
								else{
									if(asmtsdocs[i].AuditableFlag == "Yes"){
										doc[0].auditableAUIds.push(asmtsdocs[i]._id);
										CPauditables[asmtsdocs[i]["_id"]] = asmtsdocs[i];
									}
								}
							}
						}
						// For CP Defect Rate Exceptions
						doc[0].margCPDRFin = margCPDRFin;
						doc[0].unsatCPDRFin = unsatCPDRFin;
						doc[0].margCPDROps = margCPDROps;
						doc[0].unsatCPDROps = unsatCPDROps;
						for(var key in CPauditables){
							CPassmts[key].CUSize = CPauditables[key].CUSize
							CPassmts[key].CUMaxScore = calculatefield.getCUMaxScore(CPassmts[key].CUSize);
							CPassmts[key].CUScore = calculatefield.getCUScore(CPassmts[key].PeriodRating, CPassmts[key].CUMaxScore);
							doc[0].AUData.push(CPassmts[key]);
						}
						var $or = [];
						for(var i = 0; i < CUassunits.length; i++){
							$or.push({parentid: CUassunits[i]["_id"]});
						}
						var tmpQuery = {
							selector : {
								"_id": {"$gt":0},
								"key": "Assessment",
								"AUStatus": "Active",
								"ParentDocSubType": "Controllable Unit",
								"CurrentPeriod": doc[0].CurrentPeriod,
								$or
							}
						};
						db.find(tmpQuery).then(function(asmts) {
							doc[0].asmtsdocs = doc[0].asmtsdocs.concat(asmts.body.docs);
							for (var i = 0; i < asmts.body.docs.length; i++) {
								if(CUauditables[asmts.body.docs[i].parentid]){

									asmts.body.docs[i].CUSize = CUauditables[asmts.body.docs[i].parentid].CUSize
									asmts.body.docs[i].CUMaxScore = calculatefield.getCUMaxScore(asmts.body.docs[i].CUSize);
									asmts.body.docs[i].CUScore = calculatefield.getCUScore(asmts.body.docs[i].PeriodRating, asmts.body.docs[i].CUMaxScore);
									if(CUauditables[asmts.body.docs[i].parentid].Portfolio == "Yes") {
										asmts.body.docs[i].Type = "Portfolio CU";
									}else{
										asmts.body.docs[i].Type = "Standalone CU";
									}
									doc[0].AUData.push(asmts.body.docs[i]);
								}
								if (doc[0].MIRABusinessUnit == "GTS") {
									if(CUCRMables[asmts.body.docs[i].parentid]) {
										asmts.body.docs[i].catP = "CRM";
										doc[0].asmtsdocsCRM.push(asmts.body.docs[i]);
									}else{
										asmts.body.docs[i].catP = "Delivery";
										doc[0].asmtsdocsDelivery.push(asmts.body.docs[i]);
									}
								}
							}
							//** Additional calculations for BU Country's asmt Audits & Reviews tab
							//For Audits & Reviews
							calculatefield.createAuditsReviewsSupportDocs(doc);
							//Successful resolve
							deferred.resolve({"status": 200, "doc": doc});
						}).catch(function(err) {
							console.log("[class-fieldcalc][getAssessments] - " + err.error.reason);
							deferred.reject({"status": 500, "error": err.error.reason});
						});
						break;
					case "Country Process":
						doc[0].CURelevantAU = [];
						doc[0].CURelevantAUID = [];
						for (var i = 0; i < asmtsdata.body.docs.length; ++i) {
							doc[0].CURelevantAUID.push(asmtsdata.body.docs[i].parentid);
							doc[0].CURelevantAU.push(
								{"id": asmtsdata.body.docs[i].parentid},
								{"name": asmtsdata.body.docs[i].AssessableUnitName},
								{"wwbcitid": asmtsdata.body.docs[i].WWBCITKey}
							);
						}
						deferred.resolve({"status": 200, "doc": doc});
						break;
					case "Controllable Unit":
							doc[0].asmtsdocs = [];
							// For Current Quarter Country Process Defect Rate Exceptions
							doc[0].CPDRException = [];
							// For CP Financial Process Defect Rates that are Marg counter
							var margCPDRFin = 0;
							// For CP Financial Process Defect Rates that are Unsat counter
							var unsatCPDRFin = 0;
							// For CP Operational Process Defect Rates that are Marg counter
							var margCPDROps = 0;
							// For CP Operationa Process Defect Rates that are Unsat counter
							var unsatCPDROps = 0;

							var asmtsdocs = asmtsdata.body.docs;
							for (var i = 0; i < asmtsdocs.length; ++i) {
								if (asmtsdocs[i].key == "Assessment"){
									doc[0].asmtsdocs.push(asmtsdocs[i]);

									// Get Current Quarter Country Process Defect Rate Exceptions
									if ( asmtsdocs[i].ParentDocSubType == "Country Process") {
										// Format Defect Rate
										asmtsdocs[i].AUDefectRate = parseInt(asmtsdocs[i].AUDefectRate).toFixed(1);
										if (asmtsdocs[i].AUDefectRate == 0) {
											asmtsdocs[i].AUDefectRate = parseInt(asmtsdocs[i].AUDefectRate).toFixed(0);
										}
										// Get RAGStatus and if Marg or Unsat, push to list of Current Quarter Country Process Defect Rate Exception
										asmtsdocs[i].processCategory = calculatefield.getProcessCategory(asmtsdocs[i].GPWWBCITKey, doc);
										if (asmtsdocs[i].AUDefectRate >= doc[0].UnsatThresholdPercent) {
											asmtsdocs[i].RAGStatus = "Unsat";
											doc[0].CPDRException.push(asmtsdocs[i]);
											if (asmtsdocs[i].processCategory == "Financial") {
												unsatCPDRFin += 1;
											}else {
												unsatCPDROps += 1;
											}
										} else if (asmtsdocs[i].AUDefectRate < doc[0].MargThresholdPercent) {
											asmtsdocs[i].RAGStatus = "Sat";
										} else {
											asmtsdocs[i].RAGStatus = "Marg";
											doc[0].CPDRException.push(asmtsdocs[i]);
											if (asmtsdocs[i].processCategory == "Financial") {
												margCPDRFin += 1;
											}else {
												margCPDROps += 1;
											}
										}
									}
								}
							}
							// For CP Defect Rate Exceptions
							doc[0].margCPDRFin = margCPDRFin;
							doc[0].unsatCPDRFin = unsatCPDRFin;
							doc[0].margCPDROps = margCPDROps;
							doc[0].unsatCPDROps = unsatCPDROps;
							deferred.resolve({"status": 200, "doc": doc});
							break;
						default:
							doc[0].asmtsdocs = asmtsdata.body.docs;
							deferred.resolve({"status": 200, "doc": doc});
				}
			}).catch(function(err) {
				console.log("[class-fieldcalc][getAssessments] - " + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		} catch(e) {
			console.log("[class-fieldcalc][getAssessments] - " + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

		/* Populates the Rating Profile table */
	getRatingProfile: function(doc) {
			try {
				var satEqCU = 0, satUpCU = 0, margUpCU = 0, margEqCU = 0, margDwnCU = 0, unsatEqCU = 0, unsatDwnCU = 0, exemptCU = 0, nrCU = 0, bocExCU = 0;
				var satEq = 0, satUp = 0, margUp = 0, margEq = 0, margDwn = 0, unsatEq = 0, unsatDwn = 0, exempt = 0, nr = 0, bocEx = 0;
				var satEqFin = 0, satUpFin = 0, margUpFin = 0, margEqFin = 0, margDwnFin = 0, unsatEqFin = 0, unsatDwnFin = 0, exemptFin = 0, nrFin = 0;
				var satEqOps = 0, satUpOps = 0, margUpOps = 0, margEqOps = 0, margDwnOps = 0, unsatEqOps = 0, unsatDwnOps = 0, exemptOps = 0, nrOps = 0;
				var satEqCUCrm = 0, satUpCUCrm = 0, margUpCUCrm = 0, margEqCUCrm = 0, margDwnCUCrm = 0, unsatEqCUCrm = 0, unsatDwnCUCrm = 0, exemptCUCrm = 0, nrCUCrm = 0, bocExCUCrm = 0;
				var satEqCUDel = 0, satUpCUDel = 0, margUpCUDel = 0, margEqCUDel = 0, margDwnCUDel = 0, unsatEqCUDel = 0, unsatDwnCUDel = 0, exemptCUDel = 0, nrCUDel = 0, bocExCUDel = 0;
				var toadd;
				var POCountryFlag = 0, POCUFlag = 0, POBUCFlag  =0, POCountryOtherFlag = 0, POCUOtherFlag = 0, POBUCOtherFlag  =0;

				if (doc[0].ParentDocSubType == "Global Process" || doc[0].ParentDocSubType == "Controllable Unit" ) {
					for (var i = 0; i < doc[0].asmtsdocs.length; ++i) {
						switch (doc[0].ParentDocSubType) {
							case "Global Process":
								// PO tab performance indicators view for table Country Process and CU Performance Indicators && Country Process and CU Operational and Indicators

								try{



									//get MSAC missed commitments
									doc[0].asmtsdocs[i].MissedMSACSatCount= performanceTab.getMSACCOmmitmentsIndividual(doc[0].asmtsdocs[i]);
									//get Open Issue count per child assessment
									doc[0].asmtsdocs[i].MissedOpenIssueCount = performanceTab.getMissedRisksIndividual(doc[0].RiskView1Data, doc[0].asmtsdocs[i]);


									if(doc[0].asmtsdocs[i].KCFRDefectRate != undefined && doc[0].asmtsdocs[i].KCFRDefectRate != "" )
										doc[0].asmtsdocs[i].KCFRDefectRate = parseInt(doc[0].asmtsdocs[i].KCFRDefectRate).toFixed(1).toString();

									if(doc[0].asmtsdocs[i].KCODefectRate != undefined && doc[0].asmtsdocs[i].KCODefectRate != "")
										doc[0].asmtsdocs[i].KCODefectRate = parseInt(doc[0].asmtsdocs[i].KCODefectRate).toFixed(1).toString();

									toadd = {
										"docid":doc[0].asmtsdocs[i]._id,
										"name":doc[0].asmtsdocs[i].AssessableUnitName,
										"ParentDocSubType":doc[0].asmtsdocs[i].ParentDocSubType,
										"ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
										"ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
										"ratingPQ2":doc[0].asmtsdocs[i].PeriodRatingPrev2,
										"ratingPQ3":doc[0].asmtsdocs[i].PeriodRatingPrev3,
										"ratingPQ4":doc[0].asmtsdocs[i].PeriodRatingPrev4,
										"kcfrDR":doc[0].asmtsdocs[i].KCFRDefectRate,
										"kcoDR":doc[0].asmtsdocs[i].KCODefectRate,
										"auditScore":doc[0].asmtsdocs[i].WeightedAuditScore,
										"msdRisk":doc[0].asmtsdocs[i].MissedOpenIssueCount,
										"msdMSAC":doc[0].asmtsdocs[i].MissedMSACSatCount,
										"treeParent" :doc[0].asmtsdocs[i].ParentDocSubType.replace(/ /g,'')
									};


									doc[0].BUCAsmtDataPIview.push(toadd);


									// PO tab other indicators view

									toadd = {
										"docid":doc[0].asmtsdocs[i]._id,
										"name":doc[0].asmtsdocs[i].AssessableUnitName,
										"ParentDocSubType":doc[0].asmtsdocs[i].ParentDocSubType,
										"bocExCount":doc[0].asmtsdocs[i].BOCExceptionCount,
										"treeParent" :doc[0].asmtsdocs[i].ParentDocSubType.replace(/ /g,'')
									};


									if (doc[0].asmtsdocs[i].OpMetric != undefined) {

										for (var j = 0; j < doc[0].asmtsdocs[i].OpMetric.length; j++) {

											toadd[doc[0].asmtsdocs[i].OpMetric[j].id+"Rating"] = doc[0].asmtsdocs[i].OpMetric[j].rating;
											toadd["docid"] = doc[0].asmtsdocs[i]._id;
											toadd["name"] = doc[0].asmtsdocs[i].AssessableUnitName;
											toadd["ParentDocSubType"] = doc[0].asmtsdocs[i].ParentDocSubType;
											toadd["bocExCount"] = doc[0].asmtsdocs[i].BOCExceptionCount;


											// doc[0].BUCAsmtDataOIview[i] = {};
											//doc[0].BUCAsmtDataOIview[i][doc[0].asmtsdocs[i].OpMetric[j].id+"Rating"] = doc[0].asmtsdocs[i].OpMetric[j].rating;
											//  console.log(doc[0].asmtsdocs[i].OpMetric[j].id+"Rating");
										}


									}
									doc[0].BUCAsmtDataOIview.push(toadd);

									// Basics of Control Exception Counter
									if (doc[0].asmtsdocs[i].BOCExceptionCount == 1) {
										bocEx = bocEx + 1;
									}

									// Process Ratings tab data for GlobalProcess
									toadd = {
										"docid":doc[0].asmtsdocs[i]._id,
										"country":doc[0].asmtsdocs[i].Country,
										"iot":doc[0].asmtsdocs[i].IOT,
										"ratingcategory":doc[0].asmtsdocs[i].RatingCategory,
										"ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
										"ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
										"targettosat":doc[0].asmtsdocs[i].Target2Sat,
										"targettosatprev":doc[0].asmtsdocs[i].Target2SatPrev,
										"reviewcomments":doc[0].asmtsdocs[i].ReviewComments
									};
									doc[0].CPAsmtDataPR1view.push(toadd);



								}catch(e){
									console.log("[class-fieldcalc][getRatingProfile][Global Process Tab] - " + e.stack);

								}


								break;
							case "Controllable Unit":
							if (doc[0].asmtsdocs[i].ParentDocSubType == "Country Process") {
								// Process Ratings Tab embedded views
								toadd = {
									"docid":doc[0].asmtsdocs[i]._id,
									"name":doc[0].asmtsdocs[i].AssessableUnitName,
									"country":doc[0].asmtsdocs[i].Country,
									"ratingcategory":doc[0].asmtsdocs[i].RatingCategory,
									"ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
									"ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
									"targettosat":doc[0].asmtsdocs[i].Target2Sat,
									"targettosatprev":doc[0].asmtsdocs[i].Target2SatPrev,
									"reviewcomments":doc[0].asmtsdocs[i].ReviewComments
								};
								doc[0].CUAsmtDataPR1view.push(toadd);
							}
							// Account Ratings Tab embedded views
							if (doc[0].asmtsdocs[i].ParentDocSubType == "Account") {
								// toadd = {
								//   "docid":doc[0].asmtsdocs[i]._id,
								//   "name":doc[0].asmtsdocs[i].AssessableUnitName,
								//   "accountPortfolioPct":doc[0].asmtsdocs[i].AccountPortfolioPct,
								//   "ratingcategory":doc[0].asmtsdocs[i].RatingCategory,
								//   "ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
								//   "ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
								//   "targettosat":doc[0].asmtsdocs[i].Target2Sat,
								//   "coreQNoFlag":doc[0].asmtsdocs[i].CoreQNoFlag,
								//   "reviewcomments":doc[0].asmtsdocs[i].ReviewComments
								// };
								doc[0].AccountData.push(doc[0].asmtsdocs[i]);
							}
							break;
						}

						if (doc[0].asmtsdocs[i].ParentDocSubType == "Country Process") {
							var calculatedRatingCategory=calculatefield.getRatingCategory(doc[0].asmtsdocs[i].PeriodRating,doc[0].asmtsdocs[i].PeriodRatingPrev1);
							// Rating Category Counters
							switch (calculatedRatingCategory) {
							//switch (doc[0].asmtsdocs[i].RatingCategory) {
								case "Sat &#9650;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") satUpFin = satUpFin + 1;
								else satUpOps = satUpOps + 1;
								break;
								case "Sat &#61;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") satEqFin = satEqFin + 1;
								else satEqOps = satEqOps + 1;
								break;
								case "Marg &#9650;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") margUpFin = margUpFin + 1;
								else margUpOps = margUpOps + 1;
								break;
								case "Marg &#9660;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") margDwnFin = margDwnFin + 1;
								else margDwnOps = margDwnOps + 1;
								break;
								case "Marg &#61;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") margEqFin = margEqFin + 1;
								else margEqOps = margEqOps + 1;
								break;
								case "Unsat &#9660;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") unsatDwnFin = unsatDwnFin + 1;
								else unsatDwnOps = unsatDwnOps + 1;
								break;
								case "Unsat &#61;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") unsatEqFin = unsatEqFin + 1;
								else unsatEqOps = unsatEqOps + 1;
								break;
								case "Exempt":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") exemptFin = exemptFin + 1;
								else exemptOps = exemptOps + 1;
								break;
								default:
								if (doc[0].asmtsdocs[i].processCategory == "Financial") nrFin = nrFin + 1;
								else nrOps = nrOps + 1;
							}
						}
					}

					if (doc[0].ParentDocSubType == "Global Process") {
						doc[0].BOCExceptionCount = bocEx;
					}
					// Processing Financial processes
					doc[0].FINCPSatEqualCnt = satEqFin;
					doc[0].FINCPSatPlusCnt = satUpFin;
					doc[0].FINCPMargPlusCnt = margUpFin;
					doc[0].FINCPMargEqualCnt = margEqFin;
					doc[0].FINCPMargMinusCnt = margDwnFin;
					doc[0].FINCPUnsatEqualCnt = unsatEqFin;
					doc[0].FINCPUnsatMinusCnt = unsatDwnFin;
					doc[0].FINCPEXEMPTCnt = exemptFin;
					doc[0].FINCPNRCnt = nrFin;
					doc[0].FINCPTotalCnt = satEqFin + satUpFin + margUpFin + margEqFin + margDwnFin + unsatEqFin + unsatDwnFin + exemptFin + nrFin;
					if (satEqFin == 0)
					doc[0].FINCPSatEqualPct = "0%";
					else
					doc[0].FINCPSatEqualPct = ((satEqFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
					if (satUpFin == 0)
					doc[0].FINCPSatPlusPct = "0%";
					else
					doc[0].FINCPSatPlusPct = ((satUpFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
					if (margUpFin == 0)
					doc[0].FINCPMargPlusPct = "0%";
					else
					doc[0].FINCPMargPlusPct = ((margUpFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
					if (margEqFin == 0)
					doc[0].FINCPMargEqualPct = "0%";
					else
					doc[0].FINCPMargEqualPct = ((margEqFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
					if (margDwnFin == 0)
					doc[0].FINCPMargMinusPct = "0%";
					else
					doc[0].FINCPMargMinusPct = ((margDwnFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
					if (unsatEqFin == 0)
					doc[0].FINCPUnsatEqualPct = "0%";
					else
					doc[0].FINCPUnsatEqualPct = ((unsatEqFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
					if (unsatDwnFin == 0)
					doc[0].FINCPUnsatMinusPct = "0%";
					else
					doc[0].FINCPUnsatMinusPct = ((unsatDwnFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
					if (exemptFin == 0)
					doc[0].FINCPEXEMPTPct = "0%";
					else
					doc[0].FINCPEXEMPTPct = ((exemptFin/1) * 100).toFixed() + "%";
					if (nrFin == 0)
					doc[0].FINCPNRPct = "0%";
					else
					doc[0].FINCPNRPct = ((nrFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
					if (doc[0].FINCPTotalCnt == 0)
					doc[0].FINCPTotalPct = "0%";
					else
					doc[0].FINCPTotalPct = "100%";

					// Processing Operatioanl processes
					doc[0].OPSCPSatEqualCnt = satEqOps;
					doc[0].OPSCPSatPlusCnt = satUpOps;
					doc[0].OPSCPMargPlusCnt = margUpOps;
					doc[0].OPSCPMargEqualCnt = margEqOps;
					doc[0].OPSCPMargMinusCnt = margDwnOps;
					doc[0].OPSCPUnsatEqualCnt = unsatEqOps;
					doc[0].OPSCPUnsatMinusCnt = unsatDwnOps;
					doc[0].OPSCPEXEMPTCnt = exemptOps;
					doc[0].OPSCPNRCnt = nrOps;
					doc[0].OPSCPTotalCnt = satEqOps + satUpOps + margUpOps + margEqOps + margDwnOps + unsatEqOps + unsatDwnOps + exemptOps + nrOps;

					if (satEqOps == 0)
					doc[0].OPSCPSatEqualPct = "0%";
					else
					doc[0].OPSCPSatEqualPct = ((satEqOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
					if (satUpOps == 0)
					doc[0].OPSCPSatPlusPct = "0%";
					else
					doc[0].OPSCPSatPlusPct = ((satUpOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
					if (margUpOps == 0)
					doc[0].OPSCPMargPlusPct = "0%";
					else
					doc[0].OPSCPMargPlusPct = ((margUpOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
					if (margEqOps == 0)
					doc[0].OPSCPMargEqualPct = "0%";
					else
					doc[0].OPSCPMargEqualPct = ((margEqOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
					if (margDwnOps == 0)
					doc[0].OPSCPMargMinusPct = "0%";
					else
					doc[0].OPSCPMargMinusPct = ((margDwnOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
					if (unsatEqOps == 0)
					doc[0].OPSCPUnsatEqualPct = "0%";
					else
					doc[0].OPSCPUnsatEqualPct = ((unsatEqOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
					if (unsatDwnOps == 0)
					doc[0].OPSCPUnsatMinusPct = "0%";
					else
					doc[0].OPSCPUnsatMinusPct = ((unsatDwnOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
					if (exemptOps == 0)
					doc[0].OPSCPEXEMPTPct = "0%";
					else
					doc[0].OPSCPEXEMPTPct = ((exemptOps/1) * 100).toFixed() + "%";
					if (nrOps == 0)
					doc[0].OPSCPNRPct = "0%";
					else
					doc[0].OPSCPNRPct = ((nrOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
					if (doc[0].OPSCPTotalCnt == 0)
					doc[0].OPSCPTotalPct = "0%";
					else
					doc[0].OPSCPTotalPct = "100%";

					// Processing totals of financial and operational processes
					satUp = satUpFin + satUpOps;
					satEq = satEqFin + satEqOps;
					margUp = margUpFin + margUpOps;
					margDwn = margDwnFin + margDwnOps;
					margEq = margEqFin + margEqOps;
					unsatDwn = unsatDwnFin + unsatDwnOps;
					unsatEq = unsatEqFin + unsatEqOps;
					exempt = exemptFin + exemptOps;
					nr = nrFin + nrOps;
					doc[0].CPSatEqualCnt = satEq;
					doc[0].CPSatPlusCnt = satUp;
					doc[0].CPMargPlusCnt = margUp;
					doc[0].CPMargEqualCnt = margEq;
					doc[0].CPMargMinusCnt = margDwn;
					doc[0].CPUnsatEqualCnt = unsatEq;
					doc[0].CPUnsatMinusCnt = unsatDwn;
					doc[0].CPEXEMPTCnt = exempt;
					doc[0].CPNRCnt = nr;
					doc[0].CPTotalCnt = satEq + satUp + margUp + margEq + margDwn + unsatEq + unsatDwn + exempt + nr;

					if (satEq == 0)
					doc[0].CPSatEqualPct = "0%";
					else
					doc[0].CPSatEqualPct = ((satEq/doc[0].CPTotalCnt) * 100).toFixed() + "%";
					if (satUp == 0)
					doc[0].CPSatPlusPct = "0%";
					else
					doc[0].CPSatPlusPct = ((satUp/doc[0].CPTotalCnt) * 100).toFixed() + "%";
					if (margUp == 0)
					doc[0].CPMargPlusPct = "0%";
					else
					doc[0].CPMargPlusPct = ((margUp/doc[0].CPTotalCnt) * 100).toFixed() + "%";
					if (margEq == 0)
					doc[0].CPMargEqualPct = "0%";
					else
					doc[0].CPMargEqualPct = ((margEq/doc[0].CPTotalCnt) * 100).toFixed() + "%";
					if (margDwn == 0)
					doc[0].CPMargMinusPct = "0%";
					else
					doc[0].CPMargMinusPct = ((margDwn/doc[0].CPTotalCnt) * 100).toFixed() + "%";
					if (unsatEq == 0)
					doc[0].CPUnsatEqualPct = "0%";
					else
					doc[0].CPUnsatEqualPct = ((unsatEq/doc[0].CPTotalCnt) * 100).toFixed() + "%";
					if (unsatDwn == 0)
					doc[0].CPUnsatMinusPct = "0%";
					else
					doc[0].CPUnsatMinusPct = ((unsatDwn/doc[0].CPTotalCnt) * 100).toFixed() + "%";
					if (exempt == 0)
					doc[0].CPEXEMPTPct = "0%";
					else
					doc[0].CPEXEMPTPct = ((exempt/1) * 100).toFixed() + "%";
					if (nr == 0)
					doc[0].CPNRPct = "0%";
					else
					doc[0].CPNRPct = ((nr/doc[0].CPTotalCnt) * 100).toFixed() + "%";
					if (doc[0].CPTotalCnt == 0)
					doc[0].CPTotalPct = "0%";
					else
					doc[0].CPTotalPct = "100%";

				}
				else { // For BU Country, BU IOT, BU IMT, BU Reporting Group and Business Unit which needs to process ratings profile for both CU and CP
					var podatactr = 0;
					for (var i = 0; i < doc[0].asmtsdocs.length; ++i) {
						if (doc[0].asmtsdocs[i].ParentDocSubType == "Country Process" && doc[0].ExcludedCountryNames != undefined && doc[0].ExcludedCountryNames.indexOf(doc[0].asmtsdocs[i].Country) == -1) {
							// Process Audit Universe Data here

							// Process Ratings Tab embedded views
							toadd = {
								"docid":doc[0].asmtsdocs[i]._id,
								"name":doc[0].asmtsdocs[i].AssessableUnitName,
								"country":doc[0].asmtsdocs[i].Country,
								"imt":doc[0].asmtsdocs[i].IMT,
								"process":doc[0].asmtsdocs[i].GlobalProcess,
								"auditprogram":doc[0].asmtsdocs[i].AuditProgram,
								"ratingcategory":doc[0].asmtsdocs[i].RatingCategory,
								"ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
								"ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
								"targettosat":doc[0].asmtsdocs[i].Target2Sat,
								"targettosatprev":doc[0].asmtsdocs[i].Target2SatPrev,
								"reviewcomments":doc[0].asmtsdocs[i].ReviewComments
							};
							doc[0].BUCAsmtDataPRview.push(toadd);
                            var calculatedRatingCategory=calculatefield.getRatingCategory(doc[0].asmtsdocs[i].PeriodRating,doc[0].asmtsdocs[i].PeriodRatingPrev1);
							// Rating Category Counters
							switch (calculatedRatingCategory) {
							//switch (doc[0].asmtsdocs[i].RatingCategory) {
								case "Sat &#9650;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") satUpFin = satUpFin + 1;
								else satUpOps = satUpOps + 1;
								break;
								case "Sat &#61;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") satEqFin = satEqFin + 1;
								else satEqOps = satEqOps + 1;
								break;
								case "Marg &#9650;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") margUpFin = margUpFin + 1;
								else margUpOps = margUpOps + 1;
								break;
								case "Marg &#9660;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") margDwnFin = margDwnFin + 1;
								else margDwnOps = margDwnOps + 1;
								break;
								case "Marg &#61;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") margEqFin = margEqFin + 1;
								else margEqOps = margEqOps + 1;
								break;
								case "Unsat &#9660;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") unsatDwnFin = unsatDwnFin + 1;
								else unsatDwnOps = unsatDwnOps + 1;
								break;
								case "Unsat &#61;":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") unsatEqFin = unsatEqFin + 1;
								else unsatEqOps = unsatEqOps + 1;
								break;
								case "Exempt":
								if (doc[0].asmtsdocs[i].processCategory == "Financial") exemptFin = exemptFin + 1;
								else exemptOps = exemptOps + 1;
								break;
								default:
								if (doc[0].asmtsdocs[i].processCategory == "Financial") nrFin = nrFin + 1;
								else nrOps = nrOps + 1;
							}
					}
					if (doc[0].asmtsdocs[i].ParentDocSubType == "Controllable Unit") {
						// CU Ratings Tab embedded views
						var isDel=0; var isCRM=0;
						toadd = {
							"docid":doc[0].asmtsdocs[i]._id,
							"name":doc[0].asmtsdocs[i].AssessableUnitName,
							"country":doc[0].asmtsdocs[i].Country,
							"catP":doc[0].asmtsdocs[i].catP,
							"imt":doc[0].asmtsdocs[i].IMT,
							"size":doc[0].asmtsdocs[i].CUSize,
							"maxscore":doc[0].asmtsdocs[i].CUMaxScore,
							"cqscore":doc[0].asmtsdocs[i].CUScore,
							"pqscore":doc[0].asmtsdocs[i].CUScorePrev,
							"ratingcategory":doc[0].asmtsdocs[i].RatingCategory,
							"ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
							"ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
							"targettosat":doc[0].asmtsdocs[i].Target2Sat,
							"targettosatprev":doc[0].asmtsdocs[i].Target2SatPrev,
							"reviewcomments":doc[0].asmtsdocs[i].ReviewComments
						};
						if(doc[0].ParentDocSubType=='BU IMT'){
							if (doc[0].AUDocsObj[doc[0].AUDocsObj[doc[0].asmtsdocs[i].parentid].parentid]) {
								if (doc[0].AUDocsObj[doc[0].AUDocsObj[doc[0].asmtsdocs[i].parentid].parentid].Country) {
									toadd.country = util.resolveGeo(doc[0].AUDocsObj[doc[0].AUDocsObj[doc[0].asmtsdocs[i].parentid].parentid].Country, "Country");
								}
							}
						}else if(doc[0].ParentDocSubType=='BU IOT'){
							if (doc[0].AUDocsObj[doc[0].AUDocsObj[doc[0].asmtsdocs[i].parentid].parentid]) {
								if (doc[0].AUDocsObj[doc[0].AUDocsObj[doc[0].asmtsdocs[i].parentid].parentid].Country) {
									toadd.imt = global.hierarchy.countries[util.resolveGeo(doc[0].AUDocsObj[doc[0].AUDocsObj[doc[0].asmtsdocs[i].parentid].parentid].Country, "Country")].IMT;
								}else if (doc[0].AUDocsObj[doc[0].AUDocsObj[doc[0].asmtsdocs[i].parentid].parentid].IMT) {
									toadd.imt = util.resolveGeo(doc[0].AUDocsObj[doc[0].AUDocsObj[doc[0].asmtsdocs[i].parentid].parentid].IMT, "IMT");
								}
							}else {
								//console.log("Not found");
							}
						}

						doc[0].BUCAsmtDataCURview.push(toadd);
						if(doc[0].MIRABusinessUnit == "GBS"){
							var calculatedRatingCategory=calculatefield.getRatingCategory(doc[0].asmtsdocs[i].PeriodRating,doc[0].asmtsdocs[i].PeriodRatingPrev1);
							switch (calculatedRatingCategory) {
							//switch (doc[0].asmtsdocs[i].RatingCategory) {
								case "Sat &#9650;":
								satUpCU = satUpCU + 1;
								break;
								case "Sat &#61;":
								satEqCU = satEqCU + 1;
								break;
								case "Marg &#9650;":
								margUpCU = margUpCU + 1;
								break;
								case "Marg &#9660;":
								margDwnCU = margDwnCU + 1;
								break;
								case "Marg &#61;":
								margEqCU = margEqCU + 1;
								break;
								case "Unsat &#9660;":
								unsatDwnCU = unsatDwnCU + 1;
								break;
								case "Unsat &#61;":
								unsatEqCU = unsatEqCU + 1;
								break;
								case "Exempt":
								exemptCU = exemptCU + 1;
								break;
								default:
								nrCU = nrCU + 1;
							}
						}
						else{
							for(j=0;j<doc[0].asmtsdocsDelivery.length;j++){
								if(doc[0].asmtsdocsDelivery[j]._id==doc[0].asmtsdocs[i]._id) {
									isDel=1;
									j=doc[0].asmtsdocsDelivery.length;
								}
							}
							if(isDel==0){
								for(j=0;j<doc[0].asmtsdocsCRM.length;j++){
									if(doc[0].asmtsdocsCRM[j]._id==doc[0].asmtsdocs[i]._id) {
										isCRM=1;
										j=doc[0].asmtsdocsCRM.length;
									}
								}
							}
                            var calculatedRatingCategory=calculatefield.getRatingCategory(doc[0].asmtsdocs[i].PeriodRating,doc[0].asmtsdocs[i].PeriodRatingPrev1);
							switch (calculatedRatingCategory) {
							//switch (doc[0].asmtsdocs[i].RatingCategory) {
								case "Sat &#9650;":
								if (isCRM>0) satUpCUCrm = satUpCUCrm + 1;
								else satUpCUDel = satUpCUDel + 1;
								break;
								case "Sat &#61;":
								if (isCRM>0) satEqCUCrm = satEqCUCrm + 1;
								else satEqCUDel = satEqCUDel + 1;
								break;
								case "Marg &#9650;":
								if (isCRM>0) margUpCUCrm = margUpCUCrm + 1;
								else margUpCUDel = margUpCUDel + 1;
								break;
								case "Marg &#9660;":
								if (isCRM>0) margDwnCUCrm = margDwnCUCrm + 1;
								else margDwnCUDel = margDwnCUDel + 1;
								break;
								case "Marg &#61;":
								if (isCRM>0) margEqCUCrm = margEqCUCrm + 1;
								else margEqCUDel = margEqCUDel + 1;
								break;
								case "Unsat &#9660;":
								if (isCRM>0) unsatDwnCUCrm = unsatDwnCUCrm + 1;
								else unsatDwnCUDel = unsatDwnCUDel + 1;
								break;
								case "Unsat &#61;":
								if (isCRM>0) unsatEqCUCrm = unsatEqCUCrm + 1;
								else unsatEqCUDel = unsatEqCUDel + 1;
								break;
								case "Exempt":
								if (isCRM>0) exemptCUCrm = exemptCUCrm + 1;
								else exemptCUDel = exemptCUDel + 1;
								break;
								default:
								if (isCRM>0) nrCUCrm = nrCUCrm + 1;
								else nrCUDel = nrCUDel + 1;
							}
						}
					}

					switch (doc[0].ParentDocSubType) {
						case "BU IOT":
							// PO tab performance indicators view for table Country Process and CU Performance Indicators && Country Process and CU Operational and Indicators

							try{

								//GBS and GTS Transformation, GTS its been calculated on createTablesData

								//get MSAC missed commitments
								doc[0].asmtsdocs[i].MissedMSACSatCount= performanceTab.getMSACCOmmitmentsIndividual(doc[0].asmtsdocs[i]);
								//get Open Issue count per child assessment
								doc[0].asmtsdocs[i].MissedOpenIssueCount = performanceTab.getMissedRisksIndividual(doc[0].RiskView1Data, doc[0].asmtsdocs[i]);
								//get AuditScore per assessment
								doc[0].asmtsdocs[i].WeightedAuditScore = performanceTab.calculateCHQInternalAuditScoreAssessmentLevel(doc,doc[0].asmtsdocs[i],calculatefield);

								if(doc[0].asmtsdocs[i].KCFRDefectRate != undefined && doc[0].asmtsdocs[i].KCFRDefectRate != "" )
									doc[0].asmtsdocs[i].KCFRDefectRate = parseInt(doc[0].asmtsdocs[i].KCFRDefectRate).toFixed(1).toString();

								if(doc[0].asmtsdocs[i].KCODefectRate != undefined && doc[0].asmtsdocs[i].KCODefectRate != "")
									doc[0].asmtsdocs[i].KCODefectRate = parseInt(doc[0].asmtsdocs[i].KCODefectRate).toFixed(1).toString();


								toadd = {
									"docid":doc[0].asmtsdocs[i]._id,
									"name":doc[0].asmtsdocs[i].AssessableUnitName,
									"ParentDocSubType":doc[0].asmtsdocs[i].ParentDocSubType,
									"ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
									"ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
									"ratingPQ2":doc[0].asmtsdocs[i].PeriodRatingPrev2,
									"ratingPQ3":doc[0].asmtsdocs[i].PeriodRatingPrev3,
									"ratingPQ4":doc[0].asmtsdocs[i].PeriodRatingPrev4,
									"kcfrDR":doc[0].asmtsdocs[i].KCFRDefectRate,
									"kcoDR":doc[0].asmtsdocs[i].KCODefectRate,
									"auditScore":doc[0].asmtsdocs[i].WeightedAuditScore,
									"msdRisk":doc[0].asmtsdocs[i].MissedOpenIssueCount,
									"msdMSAC":doc[0].asmtsdocs[i].MissedMSACSatCount,
									"treeParent" :doc[0].asmtsdocs[i].ParentDocSubType.replace(/ /g,'')
								};


								doc[0].BUCAsmtDataPIview.push(toadd);


								// PO tab other indicators view

								toadd = {
									"docid":doc[0].asmtsdocs[i]._id,
									"name":doc[0].asmtsdocs[i].AssessableUnitName,
									"ParentDocSubType":doc[0].asmtsdocs[i].ParentDocSubType,
									"bocExCount":doc[0].asmtsdocs[i].BOCExceptionCount,
									"treeParent" :doc[0].asmtsdocs[i].ParentDocSubType.replace(/ /g,'')
								};


								if (doc[0].asmtsdocs[i].OpMetric != undefined) {

									for (var j = 0; j < doc[0].asmtsdocs[i].OpMetric.length; j++) {

										toadd[doc[0].asmtsdocs[i].OpMetric[j].id+"Rating"] = doc[0].asmtsdocs[i].OpMetric[j].rating;
										toadd["docid"] = doc[0].asmtsdocs[i]._id;
										toadd["name"] = doc[0].asmtsdocs[i].AssessableUnitName;
										toadd["ParentDocSubType"] = doc[0].asmtsdocs[i].ParentDocSubType;
										toadd["bocExCount"] = doc[0].asmtsdocs[i].BOCExceptionCount;


										// doc[0].BUCAsmtDataOIview[i] = {};
										//doc[0].BUCAsmtDataOIview[i][doc[0].asmtsdocs[i].OpMetric[j].id+"Rating"] = doc[0].asmtsdocs[i].OpMetric[j].rating;
										//  console.log(doc[0].asmtsdocs[i].OpMetric[j].id+"Rating");
									}


								}
								doc[0].BUCAsmtDataOIview.push(toadd);

								// Basics of Control Exception Counter
								if (doc[0].asmtsdocs[i].BOCExceptionCount == 1) {
									bocEx = bocEx + 1;
								}




							}catch(e){
								console.log("[class-fieldcalc][getRatingProfile][BU IOT Performance Tab] - " + e.stack);

							}
							break;

						case "BU IMT":
							// PO tab performance indicators view for table Country Process and CU Performance Indicators && Country Process and CU Operational and Indicators

							try{

								//GBS and GTS Transformation, GTS its been calculated on createTablesData

								//get MSAC missed commitments
								doc[0].asmtsdocs[i].MissedMSACSatCount= performanceTab.getMSACCOmmitmentsIndividual(doc[0].asmtsdocs[i]);
								//get Open Issue count per child assessment
								doc[0].asmtsdocs[i].MissedOpenIssueCount = performanceTab.getMissedRisksIndividual(doc[0].RiskView1Data, doc[0].asmtsdocs[i]);						//get AuditScore per assessment
								doc[0].asmtsdocs[i].WeightedAuditScore = performanceTab.calculateCHQInternalAuditScoreAssessmentLevel(doc,doc[0].asmtsdocs[i],calculatefield);

								if(doc[0].asmtsdocs[i].KCFRDefectRate != undefined && doc[0].asmtsdocs[i].KCFRDefectRate != "" )
									doc[0].asmtsdocs[i].KCFRDefectRate = parseInt(doc[0].asmtsdocs[i].KCFRDefectRate).toFixed(1).toString();

								if(doc[0].asmtsdocs[i].KCODefectRate != undefined && doc[0].asmtsdocs[i].KCODefectRate != "")
									doc[0].asmtsdocs[i].KCODefectRate = parseInt(doc[0].asmtsdocs[i].KCODefectRate).toFixed(1).toString();

								toadd = {
									"docid":doc[0].asmtsdocs[i]._id,
									"name":doc[0].asmtsdocs[i].AssessableUnitName,
									"ParentDocSubType":doc[0].asmtsdocs[i].ParentDocSubType,
									"ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
									"ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
									"ratingPQ2":doc[0].asmtsdocs[i].PeriodRatingPrev2,
									"ratingPQ3":doc[0].asmtsdocs[i].PeriodRatingPrev3,
									"ratingPQ4":doc[0].asmtsdocs[i].PeriodRatingPrev4,
									"kcfrDR":doc[0].asmtsdocs[i].KCFRDefectRate,
									"kcoDR":doc[0].asmtsdocs[i].KCODefectRate,
									"auditScore":doc[0].asmtsdocs[i].WeightedAuditScore,
									"msdRisk":doc[0].asmtsdocs[i].MissedOpenIssueCount,
									"msdMSAC":doc[0].asmtsdocs[i].MissedMSACSatCount,
									"treeParent" :doc[0].asmtsdocs[i].ParentDocSubType.replace(/ /g,'')
								};


								doc[0].BUCAsmtDataPIview.push(toadd);


								// PO tab other indicators view

								toadd = {
									"docid":doc[0].asmtsdocs[i]._id,
									"name":doc[0].asmtsdocs[i].AssessableUnitName,
									"ParentDocSubType":doc[0].asmtsdocs[i].ParentDocSubType,
									"bocExCount":doc[0].asmtsdocs[i].BOCExceptionCount,
									"treeParent" :doc[0].asmtsdocs[i].ParentDocSubType.replace(/ /g,'')
								};


								if (doc[0].asmtsdocs[i].OpMetric != undefined) {

									for (var j = 0; j < doc[0].asmtsdocs[i].OpMetric.length; j++) {

										toadd[doc[0].asmtsdocs[i].OpMetric[j].id+"Rating"] = doc[0].asmtsdocs[i].OpMetric[j].rating;
										toadd["docid"] = doc[0].asmtsdocs[i]._id;
										toadd["name"] = doc[0].asmtsdocs[i].AssessableUnitName;
										toadd["ParentDocSubType"] = doc[0].asmtsdocs[i].ParentDocSubType;
										toadd["bocExCount"] = doc[0].asmtsdocs[i].BOCExceptionCount;


										// doc[0].BUCAsmtDataOIview[i] = {};
										//doc[0].BUCAsmtDataOIview[i][doc[0].asmtsdocs[i].OpMetric[j].id+"Rating"] = doc[0].asmtsdocs[i].OpMetric[j].rating;
										//  console.log(doc[0].asmtsdocs[i].OpMetric[j].id+"Rating");
									}


								}
								doc[0].BUCAsmtDataOIview.push(toadd);

								// Basics of Control Exception Counter
								if (doc[0].asmtsdocs[i].BOCExceptionCount == 1) {
									bocEx = bocEx + 1;
								}




							}catch(e){
								console.log("[class-fieldcalc][getRatingProfile][BU IMT Performance Tab] - " + e.stack);

							}
							break;
						case "BU Country":
						// PO tab performance indicators view for table Country Process and CU Performance Indicators && Country Process and CU Operational and Indicators

						try{


							//GBS and GTS Transformation, GTS its been calculated on createTablesData

							//get MSAC missed commitments
							doc[0].asmtsdocs[i].MissedMSACSatCount= performanceTab.getMSACCOmmitmentsIndividual(doc[0].asmtsdocs[i]);
							//get Open Issue count per child assessment
							doc[0].asmtsdocs[i].MissedOpenIssueCount = performanceTab.getMissedRisksIndividual(doc[0].RiskView1Data, doc[0].asmtsdocs[i]);


							if(doc[0].asmtsdocs[i].KCFRDefectRate != undefined && doc[0].asmtsdocs[i].KCFRDefectRate != "" )
								doc[0].asmtsdocs[i].KCFRDefectRate = parseInt(doc[0].asmtsdocs[i].KCFRDefectRate).toFixed(1).toString();

							if(doc[0].asmtsdocs[i].KCODefectRate != undefined && doc[0].asmtsdocs[i].KCODefectRate != "")
								doc[0].asmtsdocs[i].KCODefectRate = parseInt(doc[0].asmtsdocs[i].KCODefectRate).toFixed(1).toString();

							toadd = {
								"docid":doc[0].asmtsdocs[i]._id,
								"name":doc[0].asmtsdocs[i].AssessableUnitName,
								"ParentDocSubType":doc[0].asmtsdocs[i].ParentDocSubType,
								"ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
								"ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
								"ratingPQ2":doc[0].asmtsdocs[i].PeriodRatingPrev2,
								"ratingPQ3":doc[0].asmtsdocs[i].PeriodRatingPrev3,
								"ratingPQ4":doc[0].asmtsdocs[i].PeriodRatingPrev4,
								"kcfrDR":doc[0].asmtsdocs[i].KCFRDefectRate,
								"kcoDR":doc[0].asmtsdocs[i].KCODefectRate,
								"auditScore":doc[0].asmtsdocs[i].WeightedAuditScore,
								"msdRisk":doc[0].asmtsdocs[i].MissedOpenIssueCount,
								"msdMSAC":doc[0].asmtsdocs[i].MissedMSACSatCount,
								"treeParent" :doc[0].asmtsdocs[i].ParentDocSubType.replace(/ /g,'')
							};


							doc[0].BUCAsmtDataPIview.push(toadd);


							// PO tab other indicators view

							toadd = {
								"docid":doc[0].asmtsdocs[i]._id,
								"name":doc[0].asmtsdocs[i].AssessableUnitName,
								"ParentDocSubType":doc[0].asmtsdocs[i].ParentDocSubType,
								"bocExCount":doc[0].asmtsdocs[i].BOCExceptionCount,
								"treeParent" :doc[0].asmtsdocs[i].ParentDocSubType.replace(/ /g,'')
							};


							if (doc[0].asmtsdocs[i].OpMetric != undefined) {

								for (var j = 0; j < doc[0].asmtsdocs[i].OpMetric.length; j++) {

									toadd[doc[0].asmtsdocs[i].OpMetric[j].id+"Rating"] = doc[0].asmtsdocs[i].OpMetric[j].rating;
									toadd["docid"] = doc[0].asmtsdocs[i]._id;
									toadd["name"] = doc[0].asmtsdocs[i].AssessableUnitName;
									toadd["ParentDocSubType"] = doc[0].asmtsdocs[i].ParentDocSubType;
									toadd["bocExCount"] = doc[0].asmtsdocs[i].BOCExceptionCount;


									// doc[0].BUCAsmtDataOIview[i] = {};
									//doc[0].BUCAsmtDataOIview[i][doc[0].asmtsdocs[i].OpMetric[j].id+"Rating"] = doc[0].asmtsdocs[i].OpMetric[j].rating;
									//  console.log(doc[0].asmtsdocs[i].OpMetric[j].id+"Rating");
								}


							}
							doc[0].BUCAsmtDataOIview.push(toadd);

							// Basics of Control Exception Counter
							if (doc[0].asmtsdocs[i].BOCExceptionCount == 1) {
								bocEx = bocEx + 1;
							}




						}catch(e){
							console.log("[class-fieldcalc][getRatingProfile][BU Country Performance Tab] - " + e.stack);

						}
						break;
						// }
					}
				}
				if (doc[0].ParentDocSubType == "Global Process" || doc[0].ParentDocSubType == "BU Country" || doc[0].ParentDocSubType == "BU IMT" || doc[0].ParentDocSubType == "BU IOT") {
					doc[0].BOCExceptionCount = bocEx;
				}
				// Processing Financial processes
				doc[0].FINCPSatEqualCnt = satEqFin;
				doc[0].FINCPSatPlusCnt = satUpFin;
				doc[0].FINCPMargPlusCnt = margUpFin;
				doc[0].FINCPMargEqualCnt = margEqFin;
				doc[0].FINCPMargMinusCnt = margDwnFin;
				doc[0].FINCPUnsatEqualCnt = unsatEqFin;
				doc[0].FINCPUnsatMinusCnt = unsatDwnFin;
				doc[0].FINCPEXEMPTCnt = exemptFin;
				doc[0].FINCPNRCnt = nrFin;
				doc[0].FINCPTotalCnt = satEqFin + satUpFin + margUpFin + margEqFin + margDwnFin + unsatEqFin + unsatDwnFin + exemptFin + nrFin;
				if (satEqFin == 0)
				doc[0].FINCPSatEqualPct = "0%";
				else
				doc[0].FINCPSatEqualPct = ((satEqFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
				if (satUpFin == 0)
				doc[0].FINCPSatPlusPct = "0%";
				else
				doc[0].FINCPSatPlusPct = ((satUpFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
				if (margUpFin == 0)
				doc[0].FINCPMargPlusPct = "0%";
				else
				doc[0].FINCPMargPlusPct = ((margUpFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
				if (margEqFin == 0)
				doc[0].FINCPMargEqualPct = "0%";
				else
				doc[0].FINCPMargEqualPct = ((margEqFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
				if (margDwnFin == 0)
				doc[0].FINCPMargMinusPct = "0%";
				else
				doc[0].FINCPMargMinusPct = ((margDwnFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
				if (unsatEqFin == 0)
				doc[0].FINCPUnsatEqualPct = "0%";
				else
				doc[0].FINCPUnsatEqualPct = ((unsatEqFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
				if (unsatDwnFin == 0)
				doc[0].FINCPUnsatMinusPct = "0%";
				else
				doc[0].FINCPUnsatMinusPct = ((unsatDwnFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
				if (exemptFin == 0)
				doc[0].FINCPEXEMPTPct = "0%";
				else
				doc[0].FINCPEXEMPTPct = ((exemptFin/1) * 100).toFixed() + "%";
				if (nrFin == 0)
				doc[0].FINCPNRPct = "0%";
				else
				doc[0].FINCPNRPct = ((nrFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
				if (doc[0].FINCPTotalCnt == 0)
				doc[0].FINCPTotalPct = "0%";
				else
				doc[0].FINCPTotalPct = "100%";

				// Processing Operatioanl processes
				doc[0].OPSCPSatEqualCnt = satEqOps;
				doc[0].OPSCPSatPlusCnt = satUpOps;
				doc[0].OPSCPMargPlusCnt = margUpOps;
				doc[0].OPSCPMargEqualCnt = margEqOps;
				doc[0].OPSCPMargMinusCnt = margDwnOps;
				doc[0].OPSCPUnsatEqualCnt = unsatEqOps;
				doc[0].OPSCPUnsatMinusCnt = unsatDwnOps;
				doc[0].OPSCPEXEMPTCnt = exemptOps;
				doc[0].OPSCPNRCnt = nrOps;
				doc[0].OPSCPTotalCnt = satEqOps + satUpOps + margUpOps + margEqOps + margDwnOps + unsatEqOps + unsatDwnOps + exemptOps + nrOps;

				if (satEqOps == 0)
				doc[0].OPSCPSatEqualPct = "0%";
				else
				doc[0].OPSCPSatEqualPct = ((satEqOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
				if (satUpOps == 0)
				doc[0].OPSCPSatPlusPct = "0%";
				else
				doc[0].OPSCPSatPlusPct = ((satUpOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
				if (margUpOps == 0)
				doc[0].OPSCPMargPlusPct = "0%";
				else
				doc[0].OPSCPMargPlusPct = ((margUpOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
				if (margEqOps == 0)
				doc[0].OPSCPMargEqualPct = "0%";
				else
				doc[0].OPSCPMargEqualPct = ((margEqOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
				if (margDwnOps == 0)
				doc[0].OPSCPMargMinusPct = "0%";
				else
				doc[0].OPSCPMargMinusPct = ((margDwnOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
				if (unsatEqOps == 0)
				doc[0].OPSCPUnsatEqualPct = "0%";
				else
				doc[0].OPSCPUnsatEqualPct = ((unsatEqOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
				if (unsatDwnOps == 0)
				doc[0].OPSCPUnsatMinusPct = "0%";
				else
				doc[0].OPSCPUnsatMinusPct = ((unsatDwnOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
				if (exemptOps == 0)
				doc[0].OPSCPEXEMPTPct = "0%";
				else
				doc[0].OPSCPEXEMPTPct = ((exemptOps/1) * 100).toFixed() + "%";
				if (nrOps == 0)
				doc[0].OPSCPNRPct = "0%";
				else
				doc[0].OPSCPNRPct = ((nrOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
				if (doc[0].OPSCPTotalCnt == 0)
				doc[0].OPSCPTotalPct = "0%";
				else
				doc[0].OPSCPTotalPct = "100%";

				// Processing totals of financial and operational processes
				satUp = satUpFin + satUpOps;
				satEq = satEqFin + satEqOps;
				margUp = margUpFin + margUpOps;
				margDwn = margDwnFin + margDwnOps;
				margEq = margEqFin + margEqOps;
				unsatDwn = unsatDwnFin + unsatDwnOps;
				unsatEq = unsatEqFin + unsatEqOps;
				exempt = exemptFin + exemptOps;
				nr = nrFin + nrOps;
				doc[0].CPSatEqualCnt = satEq;
				doc[0].CPSatPlusCnt = satUp;
				doc[0].CPMargPlusCnt = margUp;
				doc[0].CPMargEqualCnt = margEq;
				doc[0].CPMargMinusCnt = margDwn;
				doc[0].CPUnsatEqualCnt = unsatEq;
				doc[0].CPUnsatMinusCnt = unsatDwn;
				doc[0].CPEXEMPTCnt = exempt;
				doc[0].CPNRCnt = nr;
				doc[0].CPTotalCnt = satEq + satUp + margUp + margEq + margDwn + unsatEq + unsatDwn + exempt + nr;

				if (satEq == 0)
				doc[0].CPSatEqualPct = "0%";
				else
				doc[0].CPSatEqualPct = ((satEq/doc[0].CPTotalCnt) * 100).toFixed() + "%";
				if (satUp == 0)
				doc[0].CPSatPlusPct = "0%";
				else
				doc[0].CPSatPlusPct = ((satUp/doc[0].CPTotalCnt) * 100).toFixed() + "%";
				if (margUp == 0)
				doc[0].CPMargPlusPct = "0%";
				else
				doc[0].CPMargPlusPct = ((margUp/doc[0].CPTotalCnt) * 100).toFixed() + "%";
				if (margEq == 0)
				doc[0].CPMargEqualPct = "0%";
				else
				doc[0].CPMargEqualPct = ((margEq/doc[0].CPTotalCnt) * 100).toFixed() + "%";
				if (margDwn == 0)
				doc[0].CPMargMinusPct = "0%";
				else
				doc[0].CPMargMinusPct = ((margDwn/doc[0].CPTotalCnt) * 100).toFixed() + "%";
				if (unsatEq == 0)
				doc[0].CPUnsatEqualPct = "0%";
				else
				doc[0].CPUnsatEqualPct = ((unsatEq/doc[0].CPTotalCnt) * 100).toFixed() + "%";
				if (unsatDwn == 0)
				doc[0].CPUnsatMinusPct = "0%";
				else
				doc[0].CPUnsatMinusPct = ((unsatDwn/doc[0].CPTotalCnt) * 100).toFixed() + "%";
				if (exempt == 0)
				doc[0].CPEXEMPTPct = "0%";
				else
				doc[0].CPEXEMPTPct = ((exempt/1) * 100).toFixed() + "%";
				if (nr == 0)
				doc[0].CPNRPct = "0%";
				else
				doc[0].CPNRPct = ((nr/doc[0].CPTotalCnt) * 100).toFixed() + "%";
				if (doc[0].CPTotalCnt == 0)
				doc[0].CPTotalPct = "0%";
				else
				doc[0].CPTotalPct = "100%";

				if(doc[0].MIRABusinessUnit == "GTS"){
					//CU ratings
					// Processing CRM CU ratings
					doc[0].CUSatEqualCntCRM = satEqCUCrm;
					doc[0].CUSatPlusCntCRM = satUpCUCrm;
					doc[0].CUMargPlusCntCRM = margUpCUCrm;
					doc[0].CUMargEqualCntCRM = margEqCUCrm;
					doc[0].CUMargMinusCntCRM = margDwnCUCrm;
					doc[0].CUUnsatEqualCntCRM = unsatEqCUCrm;
					doc[0].CUUnsatMinusCntCRM = unsatDwnCUCrm;
					doc[0].CUEXEMPTCntCRM = exemptCUCrm;
					doc[0].CUNRCntCRM = nrCUCrm;
					doc[0].CUTotalCntCRM = satEqCUCrm + satUpCUCrm + margUpCUCrm + margEqCUCrm + margDwnCUCrm + unsatEqCUCrm + unsatDwnCUCrm + exemptCUCrm + nrCUCrm;
					if (satEqCUCrm == 0)
					doc[0].CUSatEqualPctCRM = "0%";
					else
					doc[0].CUSatEqualPctCRM = ((satEqCUCrm/doc[0].CUTotalCntCRM) * 100).toFixed() + "%";
					if (satUpCUCrm == 0)
					doc[0].CUSatPlusPctCRM = "0%";
					else
					doc[0].CUSatPlusPctCRM = ((satUpCUCrm/doc[0].CUTotalCntCRM) * 100).toFixed() + "%";
					if (margUpCUCrm == 0)
					doc[0].CUMargPlusPctCRM = "0%";
					else
					doc[0].CUMargPlusPctCRM = ((margUpCUCrm/doc[0].CUTotalCntCRM) * 100).toFixed() + "%";
					if (margEqCUCrm == 0)
					doc[0].CUMargEqualPctCRM = "0%";
					else
					doc[0].CUMargEqualPctCRM = ((margEqCUCrm/doc[0].CUTotalCntCRM) * 100).toFixed() + "%";
					if (margDwnCUCrm == 0)
					doc[0].CUMargMinusPctCRM = "0%";
					else
					doc[0].CUMargMinusPctCRM = ((margDwnCUCrm/doc[0].CUTotalCntCRM) * 100).toFixed() + "%";
					if (unsatEqCUCrm == 0)
					doc[0].CUUnsatEqualPctCRM = "0%";
					else
					doc[0].CUUnsatEqualPctCRM = ((unsatEqCUCrm/doc[0].CUTotalCntCRM) * 100).toFixed() + "%";
					if (unsatDwnCUCrm == 0)
					doc[0].CUUnsatMinusPctCRM = "0%";
					else
					doc[0].CUUnsatMinusPctCRM = ((unsatDwnCUCrm/doc[0].CUTotalCntCRM) * 100).toFixed() + "%";
					if (exemptCUCrm == 0)
					doc[0].CUEXEMPTPctCRM = "0%";
					else
					doc[0].CUEXEMPTPctCRM = ((exemptCUCrm/1) * 100).toFixed() + "%";
					if (nrCUCrm == 0)
					doc[0].CUNRPctCRM = "0%";
					else
					doc[0].CUNRPctCRM = ((nrCUCrm/doc[0].CUTotalCntCRM) * 100).toFixed() + "%";
					if (doc[0].CUTotalCntCRM == 0)
					doc[0].CUTotalPctCRM = "0%";
					else
					doc[0].CUTotalPctCRM = "100%";

					// Processing Delivery CU ratings
					doc[0].CUSatEqualCntSOD = satEqCUDel;
					doc[0].CUSatPlusCntSOD = satUpCUDel;
					doc[0].CUMargPlusCntSOD = margUpCUDel;
					doc[0].CUMargEqualCntSOD = margEqCUDel
					doc[0].CUMargMinusCntSOD = margDwnCUDel;
					doc[0].CUUnsatEqualCntSOD = unsatEqCUDel;
					doc[0].CUUnsatMinusCntSOD = unsatDwnCUDel;
					doc[0].CUEXEMPTCntSOD = exemptCUDel;
					doc[0].CUNRCntSOD = nrCUDel;
					doc[0].CUTotalCntSOD = satEqCUDel + satUpCUDel + margUpCUDel + margEqCUDel + margDwnCUDel + unsatEqCUDel + unsatDwnCUDel + exemptCUDel + nrCUDel;
					if (satEqCUDel == 0)
					doc[0].CUSatEqualPctSOD = "0%";
					else
					doc[0].CUSatEqualPctSOD = ((satEqCUDel/doc[0].CUTotalCntSOD) * 100).toFixed() + "%";
					if (satUpCUDel == 0)
					doc[0].CUSatPlusPctSOD = "0%";
					else
					doc[0].CUSatPlusPctSOD = ((satUpCUDel/doc[0].CUTotalCntSOD) * 100).toFixed() + "%";
					if (margUpCUDel == 0)
					doc[0].CUMargPlusPctSOD = "0%";
					else
					doc[0].CUMargPlusPctSOD = ((margUpCUDel/doc[0].CUTotalCntSOD) * 100).toFixed() + "%";
					if (margEqCUDel== 0)
					doc[0].CUMargEqualPctSOD = "0%";
					else
					doc[0].CUMargEqualPctSOD = ((margEqCUDel/doc[0].CUTotalCntSOD) * 100).toFixed() + "%";
					if (margDwnCUDel == 0)
					doc[0].CUMargMinusPctSOD = "0%";
					else
					doc[0].CUMargMinusPctSOD = ((margDwnCUDel/doc[0].CUTotalCntSOD) * 100).toFixed() + "%";
					if (unsatEqCUDel == 0)
					doc[0].CUUnsatEqualPctSOD = "0%";
					else
					doc[0].CUUnsatEqualPctSOD = ((unsatEqCUDel/doc[0].CUTotalCntSOD) * 100).toFixed() + "%";
					if (unsatDwnCUDel == 0)
					doc[0].CUUnsatMinusPctSOD = "0%";
					else
					doc[0].CUUnsatMinusPctSOD = ((unsatDwnCUDel/doc[0].CUTotalCntSOD) * 100).toFixed() + "%";
					if (exemptCUDel == 0)
					doc[0].CUEXEMPTPctSOD = "0%";
					else
					doc[0].CUEXEMPTPctSOD = ((exemptCUDel/1) * 100).toFixed() + "%";
					if (nrCUDel == 0)
					doc[0].CUNRPctSOD = "0%";
					else
					doc[0].CUNRPctSOD = ((nrCUDel/doc[0].CUTotalCntSOD) * 100).toFixed() + "%";
					if (doc[0].CUTotalCntSOD == 0)
					doc[0].CUTotalPctSOD = "0%";
					else
					doc[0].CUTotalPctSOD = "100%";

					// Processing totals of CU Ratings
					satEqCU = satEqCUCrm+satEqCUDel;
					satUpCU = satUpCUCrm+satUpCUDel;
					margUpCU = margUpCUCrm+margUpCUDel;
					margEqCU = margEqCUCrm+margEqCUDel;
					margDwnCU = margDwnCUCrm+margDwnCUDel;
					unsatEqCU = unsatEqCUCrm+unsatEqCUDel;
					unsatDwnCU = unsatDwnCUCrm+unsatDwnCUDel;
					exemptCU= exemptCUCrm+exemptCUDel;
					nrCU = nrCUCrm + nrCUDel;
					doc[0].CUSatEqualCnt = satEqCU;
					doc[0].CUSatPlusCnt = satUpCU;
					doc[0].CUMargPlusCnt = margUpCU;
					doc[0].CUMargEqualCnt = margEqCU;
					doc[0].CUMargMinusCnt = margDwnCU;
					doc[0].CUUnsatEqualCnt = unsatEqCU;
					doc[0].CUUnsatMinusCnt = unsatDwnCU;
					doc[0].CUEXEMPTCnt = exemptCU;
					doc[0].CUNRCnt = nrCU;
					doc[0].CUTotalCnt = satEqCU + satUpCU + margUpCU + margEqCU + margDwnCU + unsatEqCU + unsatDwnCU + exemptCU + nrCU;

					if (satEqCU == 0)
					doc[0].CUSatEqualPct = "0%";
					else
					doc[0].CUSatEqualPct = ((satEqCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (satUpCU == 0)
					doc[0].CUSatPlusPct = "0%";
					else
					doc[0].CUSatPlusPct = ((satUpCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (margUpCU == 0)
					doc[0].CUMargPlusPct = "0%";
					else
					doc[0].CUMargPlusPct = ((margUpCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (margEqCU == 0)
					doc[0].CUMargEqualPct = "0%";
					else
					doc[0].CUMargEqualPct = ((margEqCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (margDwnCU == 0)
					doc[0].CUMargMinusPct = "0%";
					else
					doc[0].CUMargMinusPct = ((margDwnCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (unsatEqCU == 0)
					doc[0].CUUnsatEqualPct = "0%";
					else
					doc[0].CUUnsatEqualPct = ((unsatEqCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (unsatDwnCU == 0)
					doc[0].CUUnsatMinusPct = "0%";
					else
					doc[0].CUUnsatMinusPct = ((unsatDwnCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (exemptCU == 0)
					doc[0].CUEXEMPTPct = "0%";
					else
					doc[0].CUEXEMPTPct = ((exemptCU/1) * 100).toFixed() + "%";
					if (nrCU == 0)
					doc[0].CUNRPct = "0%";
					else
					doc[0].CUNRPct = ((nrCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (doc[0].CUTotalCnt == 0)
					doc[0].CUTotalPct = "0%";
					else
					doc[0].CUTotalPct = "100%";
				}
				else{

					// Processing totals of CU Ratings
					doc[0].CUSatEqualCnt = satEqCU;
					doc[0].CUSatPlusCnt = satUpCU;
					doc[0].CUMargPlusCnt = margUpCU;
					doc[0].CUMargEqualCnt = margEqCU;
					doc[0].CUMargMinusCnt = margDwnCU;
					doc[0].CUUnsatEqualCnt = unsatEqCU;
					doc[0].CUUnsatMinusCnt = unsatDwnCU;
					doc[0].CUEXEMPTCnt = exemptCU;
					doc[0].CUNRCnt = nrCU;
					doc[0].CUTotalCnt = satEqCU + satUpCU + margUpCU + margEqCU + margDwnCU + unsatEqCU + unsatDwnCU + exemptCU + nrCU;

					if (satEqCU == 0)
					doc[0].CUSatEqualPct = "0%";
					else
					doc[0].CUSatEqualPct = ((satEqCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (satUpCU == 0)
					doc[0].CUSatPlusPct = "0%";
					else
					doc[0].CUSatPlusPct = ((satUpCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (margUpCU == 0)
					doc[0].CUMargPlusPct = "0%";
					else
					doc[0].CUMargPlusPct = ((margUpCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (margEqCU == 0)
					doc[0].CUMargEqualPct = "0%";
					else
					doc[0].CUMargEqualPct = ((margEqCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (margDwnCU == 0)
					doc[0].CUMargMinusPct = "0%";
					else
					doc[0].CUMargMinusPct = ((margDwnCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (unsatEqCU == 0)
					doc[0].CUUnsatEqualPct = "0%";
					else
					doc[0].CUUnsatEqualPct = ((unsatEqCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (unsatDwnCU == 0)
					doc[0].CUUnsatMinusPct = "0%";
					else
					doc[0].CUUnsatMinusPct = ((unsatDwnCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (exemptCU == 0)
					doc[0].CUEXEMPTPct = "0%";
					else
					doc[0].CUEXEMPTPct = ((exemptCU/1) * 100).toFixed() + "%";
					if (nrCU == 0)
					doc[0].CUNRPct = "0%";
					else
					doc[0].CUNRPct = ((nrCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
					if (doc[0].CUTotalCnt == 0)
					doc[0].CUTotalPct = "0%";
					else
					doc[0].CUTotalPct = "100%";
				}

			}
		} catch(e) {
			console.log("[class-fieldcalc][getRatingProfile] - " + e.stack);
		}
	},

	getAccountInheritedFields: function(db, doc) {
		var deferred = q.defer();
		try {
			//*** Process Portfolio Value and Percentage

			for (var k = 0; k < doc[0].AccountData.length; k++) {
				// get account parent assessable unit
				var parentAU = {
					selector:{
						"_id": {"$gt": 0},
						"$or": [{"_id":doc[0].AccountData[k].parentid}, {"_id":doc[0].AccountData[k].grandparentid}]
					}
				};
				var gpid = doc[0].AccountData[k].grandparentid;
				db.find(parentAU).then(function(audata) {
					if(audata.status==200 && !audata.error) {
						for (var j = 0; j < audata.body.docs.length; j++) {
							if (gpid == audata.body.docs[j]._id) {
								doc[0].MetricsValueCU = audata.body.docs[j].MetricsValue;
							}
							if (audata.body.docs[j].DocSubType != undefined && audata.body.docs[j].DocSubType == "Account") {
								for (var i = 0; i < doc[0].AccountData.length; i++) {
									if (doc[0].AccountData[i].parentid == audata.body.docs[j]._id) {
										doc[0].AccountData[i].MetricsValue = audata.body.docs[j].MetricsValue;
									}
								}
							}
						}
						deferred.resolve({"status": 200, "doc": doc});
					}
					else {
						console.log("[class-fieldcalc][getAccountInheritedFields] - " + audata.error);
						deferred.reject({"status": 500, "error": audata.error});
					}
				}).catch(function(err) {
					console.log("[class-fieldcalc][getAccountInheritedFields] - " + err.error.reason);
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}
			deferred.resolve({"status": 200, "doc": doc});
		}
		catch(e) {

			console.log("[class-fieldcalc][getCurrentAsmt] - " + e.stack);
			deferred.reject({"status": 500, "error": e.stack});

		}
		return deferred.promise;
	},

	getAccountsCU: function(db, doc) {
		var deferred = q.defer();
		try {
			// Get cuurent quarter assessment
			var accounts = {
				selector:{
					"_id": {"$gt":0},
					"key": "Assessable Unit",
					"parentid": doc[0]._id,
					"DocSubType": "Account",
					"MIRABusinessUnit": doc[0].MIRABusinessUnit
				}
			};
			console.log(accounts)
			db.find(accounts).then(function(actdata) {
				deferred.resolve({"status": 200, "doc": actdata.body.docs});
			}).catch(function(err) {
				console.log("[class-fieldcalc][getAccountsCU] - " + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		} catch(e) {
			console.log("[class-fieldcalc][getAccountsCU] - " + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	//Get Global Process
	getGlobalProcess: function(db, MBunit){
		var deferred = q.defer();
		try {
			var gprocess = {
				"selector":{
					"_id": {"$gt":0},
					"key": "Assessable Unit",
					"DocSubType":"Global Process",
					"Status": "Active",
					"MIRABusinessUnit": MBunit
				},
				"fields": [
					"Name","WWBCITKey"
				]
			};

			db.find(gprocess).then(function(gpdata) {
				if(gpdata.status==200 && !gpdata.error){
					var docs = [];
					if(gpdata.body.docs.length > 0){
						docs = gpdata.body.docs;
					}
					deferred.resolve({"status": 200, "doc": docs});
				}
				else{
					console.log("[class-fieldcalc][getGlobalProcess]" + gpdata.error);
					deferred.reject({"status": 500, "error": gpdata.error});
				}
			}).catch(function(err) {
				console.log("[class-fieldcalc][getGlobalProcess] - " + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		} catch(e) {
			console.log("[class-fieldcalc][getGlobalProcess] - " + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	}
}
module.exports = calculatefield;
