/**************************************************************************************************
 *
 * Assessment code for MIRA Web
 * Developed by : Minerva S Genon
 * Date: 22 August 2016
 *
 */

var q  = require("q");
var moment = require('moment');
var mtz = require('moment-timezone');
var accessrules = require('./class-accessrules.js');
var fieldCalc = require('./class-fieldcalc.js');
var kct = require('./class-keycontrol.js');
var sct = require('./class-sampledcountrycontrol.js');
var rcc = require('./class-rptgcountrycontrol.js');
var prt = require('./class-processviews.js');
var cut = require('./class-controllableunitviews.js');
var pct = require('./class-processratings.js');
var art = require('./class-accountratings.js');
var aar = require('./class-auditsandreviews.js');
var ort = require('./class-risks.js');
var aut = require('./class-auniverse.js');
var comp = require('./class-compdoc.js');
var util = require('./class-utility.js');
var performanceTab = require('./class-performanceoverview.js');

var assessment = {

	/* Get assessment by ID */
	getAsmtbyID: function(req, db) {
		var deferred = q.defer();
		var docid = req.query.id
		var defViewRow = 7;

		db.get(docid).then(function(data){
			var doc = [];
			try {
				if(global.userdoc!="") { // If it's a document with merge conflict
					var newdoc = Object.assign({},global.userdoc);
					doc.push(newdoc);
					global.userdoc="";
				} else {
					var newdoc = Object.assign({},data.body);
					doc.push(newdoc);
				}
				global.doc1 = newdoc; // Temporary store the doc using the ID as the attribute, so easy to check if it exists
				/* Format Links */
				doc[0].Links = JSON.stringify(doc[0].Links);
				doc[0].EnteredBU = req.session.businessunit;
			} catch(e) {
				console.log("[assessment][getAsmtbyID]" + e.stack);
				console.log(e.stack);
			}
			assessment.preload(global.doc1,req,db).then(function(data) {
				var obj = [];
				obj.push(data.doc);
				deferred.resolve({"status": 200, "doc": obj});
			}).catch(function(err) {
				console.log("[assessment][getAsmtbyID][preload]" + err.error);
				deferred.reject({"status": 500, "error": err.error});
			});
		}).catch(function(err) {
			console.log("[assessment][getAsmtbyID]" + err.error.reason);
			deferred.reject({"status": 500, "error": err.error.reason});
		});
		return deferred.promise;
	},

	preload: function(newdoc,req,db) {
		var deferred = q.defer();
		var docid = req.query.id
		var defViewRow = 10;
		var doc = [];
		doc.push(newdoc);
		/* Format Links */
		doc[0].Links = JSON.stringify(doc[0].Links);
		doc[0].EnteredBU = req.session.businessunit;
		//doc[0].MIRABusinessUnit = doc[0].EnteredBU;
		db.get(doc[0].parentid).then(function(pdata){
			var parentdoc = [];
			parentdoc.push(pdata.body);
			/* Get access and roles */
			var editors = parentdoc[0].AdditionalEditors + parentdoc[0].Owner + parentdoc[0].Focals;
			//accessrules.getRules(req,editors);

			accessrules.getRules(req,doc[0].parentid,db,parentdoc[0]).then(function(result){

				accessrules.rules = result.rules;
				//console.log(result.rules);
				doc[0].editor = accessrules.rules.editor;
				doc[0].admin = accessrules.rules.admin;
				doc[0].resetstatus = accessrules.rules.resetstatus;
				// Get inherited fields from parent assessable unit
				if (parentdoc[0].OpMetricKey == undefined || parentdoc[0].OpMetricKey == "") parentdoc[0].OpMetricKey = "OMKID0";
				// OMKID0 - Operational Metric ID for Other Metrics as a default metric
				doc[0].OpMetricKey = parentdoc[0].OpMetricKey;
				doc[0].Category = parentdoc[0].Category;
				fieldCalc.getDocParams(req, db, doc).then(function(data){
					doc[0].PrevQtrs = [];
					doc[0].PrevQtrs = fieldCalc.getPrev4Qtrs(doc[0].CurrentPeriod);

					// Check if Rating Justification and Target to Sat is editable. This is part of the basic section but conditions apply in both read and edit mode
					if (doc[0].MIRAStatus != "Final" || ( (doc[0].WWBCITKey != undefined || doc[0].WWBCITKey != "") && (doc[0].WWBCITStatus == "Pending" || doc[0].WWBCITStatus == "Draft") ) ) {
						doc[0].RJandT2SEditable = 1;
					}

					if(req.query.edit != undefined && doc[0].editor) { // Edit mode
						doc[0].editmode = 1;
						// check if Rating is editable
						var ratingEditors = parentdoc[0].Owner + parentdoc[0].Focals;
						if(ratingEditors.indexOf("(" + req.session.user.mail + ")") !== -1 || accessrules.rules.admin) {
							if (doc[0].ParentDocSubType == "Country Process" && doc[0].WWBCITStatus != "Reviewed" && doc[0].MIRAStatus != "Final") {
								doc[0].RatingEditable = 1;
							} else {
								if (doc[0].MIRAStatus != "Final" || ( (doc[0].WWBCITKey != undefined || doc[0].WWBCITKey != "") && (doc[0].WWBCITStatus == "Pending" || doc[0].WWBCITStatus == "Draft") ) )
									doc[0].RatingEditable = 1;
							}
						}
					}
					switch (doc[0].ParentDocSubType) {
						case "Global Process":
								/*doc[0].InternalAuditData = fieldCalc.addTestViewData(9,defViewRow);
								doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,defViewRow);*/
							//	doc[0].RiskView1Data = fieldCalc.addTestViewData(6,defViewRow);
							//	doc[0].RiskView2Data = fieldCalc.addTestViewData(14,defViewRow);
								doc[0].BUCAsmtDataPIviewCRM = [];
								doc[0].BUCAsmtDataPIviewDelivery = [];
								doc[0].BUCAsmtDataOIviewCRM = [];
								doc[0].BUCAsmtDataOIviewDelivery = [];

								doc[0].MissedMSACSatCountDeliveryDoc = 0;
								doc[0].MissedOpenIssueCountDeliveryDoc =0;
								doc[0].MissedOpenIssueCountCRMDoc = 0;
								doc[0].MissedMSACSatCountCRMDoc = 0;

								doc[0].AUDataMSACCRM = [];
								doc[0].MissedMSACSatCountCRM = "";
								doc[0].AUDataMSACSOD = [];
								doc[0].MissedMSACSatCountSOD = "";

								doc[0].BOCExceptionCountCRM = 0;
								doc[0].BOCExceptionCountSOD = 0;
							
							doc[0].AUData2 = fieldCalc.addTestViewData(19,defViewRow);
							// doc[0].RCTest1Data = fieldCalc.addTestViewData(5,defViewRow);
							// doc[0].RCTest2Data = fieldCalc.addTestViewData(8,defViewRow);
							// doc[0].RCTest3Data = fieldCalc.addTestViewData(11,defViewRow);

							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];
							doc[0].AUData = [];
							doc[0].RiskView1Data = [];
							doc[0].RiskView2Data = [];
							doc[0].AUDataMSAC = [];
							doc[0].CPAsmtDataPIview = [];
							doc[0].CPAsmtDataOIview = [];
							doc[0].CPAsmtDataPR1view = [];
							doc[0].CUAsmtDataPR1view = [];
							
							
							fieldCalc.getAssessments(db, doc, req).then(function(data){
							
								comp.getCompDocs(db,doc).then(function(dataComp){
									
									fieldCalc.getRatingProfile(doc);
									
									console.log("assessment docs: "+doc[0].asmtsdocs.length);
									console.log("audata: "+doc[0].AUData.length);
								
								
								
								
								/*
								
								if (doc[0].CPAsmtDataPIview.length < defViewRow) {
									if (doc[0].CPAsmtDataPIview.length == 0) {
										doc[0].CPAsmtDataPIview = fieldCalc.addTestViewData(10,defViewRow);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].CPAsmtDataPIview,10,(defViewRow-doc[0].CPAsmtDataPIview.length));
									}
								}
								if (doc[0].CPAsmtDataOIview.length < defViewRow) {
									if (doc[0].CPAsmtDataOIview.length == 0) {
										doc[0].CPAsmtDataOIview = fieldCalc.addTestViewData(8,defViewRow);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].CPAsmtDataOIview,8,(defViewRow-doc[0].CPAsmtDataOIview.length));
									}
								}
								if (doc[0].CPAsmtDataPR1view.length < defViewRow) {
									if (doc[0].CPAsmtDataPR1view.length == 0) {
										doc[0].CPAsmtDataPR1view = fieldCalc.addTestViewData(8,defViewRow);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].CPAsmtDataPR1view,8,(defViewRow-doc[0].CPAsmtDataPR1view.length));
									}
								}
								
								*/
								
									var obj = doc[0]; // For Merge
									deferred.resolve({"status": 200, "doc": obj});
								}).catch(function(err) {
									console.log("[assessment][getAsmtbyID][getCompDocs]" + err.error);
									deferred.reject({"status": 500, "error": err.error});
								});
							}).catch(function(err) {
								console.log("[assessment][getAsmtbyID][getAssessments]" + err.error);
								deferred.reject({"status": 500, "error": err.error});
							});
							break;
						case "BU Reporting Group":
							if (doc[0].EnteredBU == "GTS") {
								doc[0].PPRData = fieldCalc.addTestViewData(13,defViewRow);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,defViewRow);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,defViewRow);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(16,defViewRow);
								doc[0].RiskView3Data = fieldCalc.addTestViewData(13,defViewRow);
							} else {
								doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,defViewRow);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,defViewRow);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(13,defViewRow);
							}
							doc[0].InternalAuditData = fieldCalc.addTestViewData(10,defViewRow);
							doc[0].AUData = fieldCalc.addTestViewData(17,defViewRow);
							doc[0].AUData2 = fieldCalc.addTestViewData(19,defViewRow);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,defViewRow);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,defViewRow);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,defViewRow);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];
							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].BUCAsmtDataPRview.length < defViewRow) {
									if (doc[0].BUCAsmtDataPRview.length == 0) {
										doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,defViewRow);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(defViewRow-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataCURview.length < defViewRow) {
									if (doc[0].BUCAsmtDataCURview.length == 0) {
										doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,defViewRow);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(defViewRow-doc[0].BUCAsmtDataCURview.length));
									}
								}
								if (doc[0].BUCAsmtDataPIview.length < defViewRow) {
									if (doc[0].BUCAsmtDataPIview.length == 0) {
										doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,defViewRow);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(defViewRow-doc[0].BUCAsmtDataPIview.length));
									}
								}
								if (doc[0].BUCAsmtDataOIview.length < defViewRow) {
									if (doc[0].BUCAsmtDataOIview.length == 0) {
										doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,defViewRow);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(defViewRow-doc[0].BUCAsmtDataOIview.length));
									}
								}
								var obj = doc[0]; // For Merge
								deferred.resolve({"status": 200, "doc": obj});
							}).catch(function(err) {
								console.log("[assessment][getAsmtbyID][getAssessments]" + err.error);
								deferred.reject({"status": 500, "error": err.error});
							});
							break;
						case "Business Unit":
							if (doc[0].EnteredBU == "GTS") {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(10,defViewRow);
								doc[0].PPRData = fieldCalc.addTestViewData(13,defViewRow);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,defViewRow);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,defViewRow);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(16,defViewRow);
								doc[0].RiskView3Data = fieldCalc.addTestViewData(13,defViewRow);
								doc[0].AUData2 = fieldCalc.addTestViewData(18,10);
								doc[0].AUData3 = fieldCalc.addTestViewData(19,10);
							} else {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(9,defViewRow);
								doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,defViewRow);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,defViewRow);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(13,defViewRow);
							}
							doc[0].AUData = fieldCalc.addTestViewData(17,10);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,defViewRow);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,defViewRow);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,defViewRow);
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];

							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].BUCAsmtDataPRview.length < defViewRow) {
									if (doc[0].BUCAsmtDataPRview.length == 0) {
										doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,defViewRow);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(defViewRow-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataCURview.length < defViewRow) {
									if (doc[0].BUCAsmtDataCURview.length == 0) {
										doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,defViewRow);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(defViewRow-doc[0].BUCAsmtDataCURview.length));
									}
								}
								if (doc[0].BUCAsmtDataPIview.length < defViewRow) {
									if (doc[0].BUCAsmtDataPIview.length == 0) {
										doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,defViewRow);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(defViewRow-doc[0].BUCAsmtDataPIview.length));
									}
								}
								if (doc[0].BUCAsmtDataOIview.length < defViewRow) {
									if (doc[0].BUCAsmtDataOIview.length == 0) {
										doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,defViewRow);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(defViewRow-doc[0].BUCAsmtDataOIview.length));
									}
								}
								var obj = doc[0]; // For Merge
								deferred.resolve({"status": 200, "doc": obj});
							}).catch(function(err) {
								console.log("[assessment][getAsmtbyID][getAssessments]" + err.error);
								deferred.reject({"status": 500, "error": err.error});
							});
							break;
						case "BU IOT":
							if (doc[0].EnteredBU == "GTS") {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(10,defViewRow);
								doc[0].PPRData = fieldCalc.addTestViewData(13,defViewRow);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,defViewRow);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,defViewRow);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(15,defViewRow);

								doc[0].BUCAsmtDataPIviewCRM = [];
								doc[0].BUCAsmtDataPIviewDelivery = [];
								doc[0].BUCAsmtDataOIviewCRM = [];
								doc[0].BUCAsmtDataOIviewDelivery = [];

								doc[0].MissedMSACSatCountDeliveryDoc = 0;
								doc[0].MissedOpenIssueCountDeliveryDoc =0;
								doc[0].MissedOpenIssueCountCRMDoc = 0;
								doc[0].MissedMSACSatCountCRMDoc = 0;

								doc[0].AUDataMSACCRM = [];
								doc[0].MissedMSACSatCountCRM = "";
								doc[0].AUDataMSACSOD = [];
								doc[0].MissedMSACSatCountSOD = "";

								doc[0].BOCExceptionCountCRM = 0;
								doc[0].BOCExceptionCountSOD = 0;
							} else {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(9,defViewRow);
								doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,defViewRow);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,defViewRow);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(13,defViewRow);
							}
							doc[0].AUData = fieldCalc.addTestViewData(17,10);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,defViewRow);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,defViewRow);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,defViewRow);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];

							doc[0].AUData = [];
							doc[0].AUDataMSAC = [];
							doc[0].IOTid = doc[0].IOT;
							doc[0].IOT = util.resolveGeo(doc[0].IOT, "IOT",req);
							doc[0].Name = doc[0].BusinessUnit + " - " + doc[0].IOT;
							fieldCalc.getAssessments(db, doc, req).then(function(data){
								comp.getCompDocs(db,doc).then(function(dataComp){
									// Get rating profiles
									fieldCalc.getRatingProfile(doc);
									// Process Country Process Ratings tab
									prt.processProTab(doc,defViewRow);
									// Process CU Ratings tab
									cut.processCUTab(doc,defViewRow);
									// Rptg Country Testing tab
									rcc.processRCTab(doc,defViewRow);
									// Process Sampled Country Testing Tab
									sct.processSCTab(doc,defViewRow);
									//Performance tab
									performanceTab.buildPerformanceTab(db,doc,defViewRow,fieldCalc);
									// Process Audit Universe Tab
									aut.processAUTab(doc,defViewRow);
									//open risks
									ort.processORTab(doc,defViewRow,req);
									// Process Audits & Reviews tab
									aar.processARTab(doc,defViewRow);

									var obj = doc[0]; // For Merge
									deferred.resolve({"status": 200, "doc": obj});
								}).catch(function(err) {
									console.log("[assessment][getAsmtbyID][getAssessments]" + err.error);
									deferred.reject({"status": 500, "error": err.error});
								});
							}).catch(function(err) {
								console.log("[assessment][getAsmtbyID][getAssessments]" + err.error);
								deferred.reject({"status": 500, "error": err.error});
							});
							break;
						case "BU IMT":
							if (doc[0].EnteredBU == "GTS") {
								/*doc[0].InternalAuditData = fieldCalc.addTestViewData(9,defViewRow);
								doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,defViewRow);*/
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,defViewRow);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(14,defViewRow);

								doc[0].BUCAsmtDataPIviewCRM = [];
								doc[0].BUCAsmtDataPIviewDelivery = [];
								doc[0].BUCAsmtDataOIviewCRM = [];
								doc[0].BUCAsmtDataOIviewDelivery = [];

								doc[0].MissedMSACSatCountDeliveryDoc = 0;
								doc[0].MissedOpenIssueCountDeliveryDoc =0;
								doc[0].MissedOpenIssueCountCRMDoc = 0;
								doc[0].MissedMSACSatCountCRMDoc = 0;

								doc[0].AUDataMSACCRM = [];
								doc[0].MissedMSACSatCountCRM = "";
								doc[0].AUDataMSACSOD = [];
								doc[0].MissedMSACSatCountSOD = "";

								doc[0].BOCExceptionCountCRM = 0;
								doc[0].BOCExceptionCountSOD = 0;

							} else {
								/*doc[0].InternalAuditData = fieldCalc.addTestViewData(9,defViewRow);
								doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,defViewRow);*/
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,defViewRow);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(12,defViewRow);
							}
							doc[0].AUData = [];
							doc[0].AUDataMSAC = [];
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,defViewRow);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,defViewRow);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,defViewRow);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];

							doc[0].IMTName = util.resolveGeo(doc[0].IMT,"IMT",req);
							doc[0].BUIOT = doc[0].BusinessUnit + " - " + util.resolveGeo(doc[0].IOT,"IOT",req);
							doc[0].BUIMT = doc[0].BusinessUnit + " - " + util.resolveGeo(doc[0].IMT,"IMT",req);
							doc[0].IMTid = doc[0].IMT;
							doc[0].IMT = util.resolveGeo(doc[0].IMT,"IMT",req);
							doc[0].Name = doc[0].BusinessUnit + " - " + doc[0].IMT;
							fieldCalc.getAssessments(db, doc, req).then(function(data){
								comp.getCompDocs(db,doc).then(function(dataComp){
									// Get rating profiles
									fieldCalc.getRatingProfile(doc);
									// Process Country Process Ratings tab
									prt.processProTab(doc,defViewRow);
	                // Process CU Ratings tab
	                cut.processCUTab(doc,defViewRow);
									// Process Audit Universe Tab
									aut.processAUTab(doc,defViewRow);
									//open risks
									ort.processORTab(doc,defViewRow,req);
									// Process Sampled Country Testing Tab
									sct.processSCTab(doc,defViewRow);
									//Performance tab
									performanceTab.buildPerformanceTab(db,doc,defViewRow,fieldCalc);
									// Process Audits & Reviews tab
									aar.processARTab(doc,defViewRow);
									//Rptg Country Testing Tab
									rcc.processRCTab(doc,defViewRow)
									/*fieldCalc.getRatingProfile(doc);
									if (doc[0].BUCAsmtDataPRview.length < defViewRow) {
										if (doc[0].BUCAsmtDataPRview.length == 0) {
											doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,defViewRow);
										} else {
											fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(defViewRow-doc[0].BUCAsmtDataPRview.length));
										}
									}
									if (doc[0].BUCAsmtDataCURview.length < defViewRow) {
										if (doc[0].BUCAsmtDataCURview.length == 0) {
											doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,defViewRow);
										} else {
											fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(defViewRow-doc[0].BUCAsmtDataCURview.length));
										}
									}
									if (doc[0].BUCAsmtDataPIview.length < defViewRow) {
										if (doc[0].BUCAsmtDataPIview.length == 0) {
											doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,defViewRow);
										} else {
											fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(defViewRow-doc[0].BUCAsmtDataPIview.length));
										}
									}
									if (doc[0].BUCAsmtDataOIview.length < defViewRow) {
										if (doc[0].BUCAsmtDataOIview.length == 0) {
											doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,defViewRow);
										} else {
											fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(defViewRow-doc[0].BUCAsmtDataOIview.length));
										}
									}
									*/
									var obj = doc[0]; // For Merge
									deferred.resolve({"status": 200, "doc": obj});
								}).catch(function(err) {
									console.log("[assessment][getAsmtbyID][getCompDocs]" + err.error);
									deferred.reject({"status": 500, "error": err.error});
								});
							}).catch(function(err) {
								console.log("[assessment][getAsmtbyID][getAssessments]" + err.error);
								deferred.reject({"status": 500, "error": err.error});
							});
							break;
						case "BU Country":
							if (doc[0].EnteredBU == "GTS") {
								/*doc[0].InternalAuditData = fieldCalc.addTestViewData(9,defViewRow);
								doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,defViewRow);*/
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,defViewRow);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(14,defViewRow);
								doc[0].BUCAsmtDataPIviewCRM = [];
								doc[0].BUCAsmtDataPIviewDelivery = [];
								doc[0].BUCAsmtDataOIviewCRM = [];
								doc[0].BUCAsmtDataOIviewDelivery = [];

								doc[0].MissedMSACSatCountDeliveryDoc = 0;
								doc[0].MissedOpenIssueCountDeliveryDoc =0;
								doc[0].MissedOpenIssueCountCRMDoc = 0;
								doc[0].MissedMSACSatCountCRMDoc = 0;

								doc[0].AUDataMSACCRM = [];
								doc[0].MissedMSACSatCountCRM = "";
								doc[0].AUDataMSACSOD = [];
								doc[0].MissedMSACSatCountSOD = "";

								doc[0].BOCExceptionCountCRM = 0;
								doc[0].BOCExceptionCountSOD = 0;
							} else {
								/*doc[0].InternalAuditData = fieldCalc.addTestViewData(8,defViewRow);
								doc[0].PPRData = fieldCalc.addTestViewData(11,defViewRow);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,defViewRow);*/
							}
							doc[0].AUData2 = fieldCalc.addTestViewData(19,defViewRow);
							// doc[0].RCTest1Data = fieldCalc.addTestViewData(5,defViewRow);
							// doc[0].RCTest2Data = fieldCalc.addTestViewData(8,defViewRow);
							// doc[0].RCTest3Data = fieldCalc.addTestViewData(11,defViewRow);

							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];
							doc[0].AUData = [];
							doc[0].RiskView1Data = [];
							doc[0].RiskView2Data = [];
							doc[0].AUDataMSAC = [];
							doc[0].CountryId = parentdoc[0].Country;
							doc[0].Country = util.resolveGeo(parentdoc[0].Country,"Country",req);
							doc[0].BUIMT = doc[0].BusinessUnit + " - " + util.resolveGeo(doc[0].IMT,"IMT",req);
							// doc[0].Country = util.resolveGeo(doc[0].Country,"Country",req);
							doc[0].Name = doc[0].BusinessUnit + " - " + doc[0].Country;
							fieldCalc.getAssessments(db, doc, req).then(function(data){
								comp.getCompDocs(db,doc).then(function(dataComp){
									// Get rating profiles
									fieldCalc.getRatingProfile(doc);
									// Process Sampled Country Testing Tab
									sct.processSCTab(doc,defViewRow);
									// Process Country Process Ratings tab
									prt.processProTab(doc,defViewRow);
									// RPTG Country Testing tab
									rcc.processRCTab(doc,defViewRow);
									// Process CU Ratings tab
									cut.processCUTab(doc,defViewRow);
									// Process Audit Universe Tab
									aut.processAUTab(doc,defViewRow);
									// create a space for performance Tab
									performanceTab.buildPerformanceTab(db,doc,defViewRow,fieldCalc);
									// Process Audits & Reviews tab
									aar.processARTab(doc,defViewRow);
									//open risks
									ort.processORTab(doc,defViewRow,req);

									//console.log(doc[0].BUCAsmtDataPIviewCRM);
									var obj = doc[0]; // For Merge
									deferred.resolve({"status": 200, "doc": obj});

								}).catch(function(err) {
									console.log("[assessment][getAsmtbyID][getCompDocs]" + err.error);
									deferred.reject({"status": 500, "error": err.error});
								});
							}).catch(function(err) {
								console.log("[assessment][getAsmtbyID][getAssessments]" + err.error);
								deferred.reject({"status": 500, "error": err.error});
							});
							break;
						case "Controllable Unit":
							if (parentdoc[0].ParentDocSubType == "BU Country") {
								doc[0].hybrid = "No";
							} else {
								doc[0].hybrid = "Yes";
							}
							doc[0].Portfolio =  parentdoc[0].Portfolio;
							//doc[0].ALLData = fieldCalc.addTestViewData(6,defViewRow);
							doc[0].ARCData = fieldCalc.addTestViewData(4,defViewRow);
							doc[0].RiskData = fieldCalc.addTestViewData(11,defViewRow);
							doc[0].AuditTrustedRCUData = fieldCalc.addTestViewData(10,defViewRow);
							// doc[0].AuditLocalData = fieldCalc.addTestViewData(defViewRow);
							doc[0].DRData = fieldCalc.addTestViewData(5,1);
							doc[0].RCTestData = fieldCalc.addTestViewData(7,defViewRow);
							doc[0].SCTestData = doc[0].RCTestData;
							doc[0].RCTestData = fieldCalc.addTestViewData(7,defViewRow);
							doc[0].SampleData = doc[0].RiskData;
							doc[0].EAData = doc[0].ARCData;
							// doc[0].AccountData = doc[0].RiskData;
							doc[0].AccountData = [];
							doc[0].AuditTrustedData = [];
							doc[0].CUAsmtDataPR1view = [];
							doc[0].AuditLocalData = [];
							//FOR GTS TRANSFORM ONLY: CTRT calculations
							if(doc[0].MIRABusinessUnit == "GTS Transformation") {
								console.log("Entered a GTS Transformation CU");
								var ctrtValues = {
									reportingQuarter: doc[0].CurrentPeriod,
									geo: parentdoc[0].Geo,
									process: parentdoc[0].ControllableUnit,
									rating: parentdoc[0].PeriodRating,
									totalTests: parentdoc[0].TotalTests,
									defects: parentdoc[0].Defects,
									defectsRate: parentdoc[0].DefectsRate
								};								
								doc[0].CTRT = ctrtValues;
							}

							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								fieldCalc.getAccountInheritedFields(db, doc).then(function(accdata){
									// Get Component Docs
									comp.getCompDocs(db,doc).then(function(dataComp){
										//Account Ratings tab
										art.processARTab(doc,defViewRow);
										// Key Controls Tesing tab
										kct.processKCTab(doc,defViewRow);
										// Audits and Reviews Tab
										aar.processARTab(doc,defViewRow);
										//Process rating tab
										pct.processPRTab(doc,defViewRow);
										//Open issue
										comp.getOpenIssue(db,doc,defViewRow).then(function(){
											//AuditKey - GTS & GTS Transformation
											if(doc[0].MIRABusinessUnit != "GBS" && (parentdoc[0].AuditLessonsKey != null)){
												fieldCalc.getGlobalProcess(db, doc[0].MIRABusinessUnit).then(function(dataGP){
													var gpList = dataGP.doc;

													var promises = parentdoc[0].AuditLessonsKey.split(",").map(function(id){
														var obj = {
															selector : {
																"_id": {"$gt":0},
																"docType": "auditLesson",
																"reportingPeriod": {"$gt":0},
																"AuditType": {"$gt":0},
																"businessUnit": req.session.buname,
																"MIRABusinessUnit": doc[0].MIRABusinessUnit,
																"AuditLessonsKey": {
																	"$regex":".*"+id+".*"}
															},
															sort:[{"reportingPeriod":"desc"}, {"AuditType":"desc"}]
														};
														return db.find(obj);
													});
													q.all(promises).then(function(dataLL){
														var ALLs = {};
														var uniques = {};
														var periods = {};
														for (var i = 0; i < dataLL.length; i++) {
															for (var j = 0; j < dataLL[i].body.docs.length; j++){
																//GlobalProcess
																var gpKey = dataLL[i].body.docs[j].globalProcess.split(",");
																for(var x = 0; x < gpKey.length; x++ ){
																	for(var y = 0; y < gpList.length;y++){
																		if(gpKey[x] == gpList[y].WWBCITKey){
																			gpKey[x] = gpList[y].Name;
																			break;
																		}
																	}
																}
																dataLL[i].body.docs[j].globalProcess = gpKey;

																var current = dataLL[i].body.docs[j].AuditType+" - "+dataLL[i].body.docs[j].AuditCAR+"@"+dataLL[i].body.docs[j].reportingPeriod;
																if(typeof uniques[dataLL[i].body.docs[j]["_id"]] === "undefined"){
																	uniques[dataLL[i].body.docs[j]["_id"]] = true;
																	if(typeof uniques[current] === "undefined"){
																		uniques[current] = true;
																		if(typeof periods[dataLL[i].body.docs[j].reportingPeriod] === "undefined" ){
																			periods[dataLL[i].body.docs[j].reportingPeriod] = [current];
																			uniques[current] = true;
																		}else{
																			periods[dataLL[i].body.docs[j].reportingPeriod].push(current);
																		}
																	}
																	if(typeof ALLs[current] === "undefined"){
																		ALLs[current] = [dataLL[i].body.docs[j]];
																	}else{
																		ALLs[current].push(dataLL[i].body.docs[j]);
																	}

																}
															}
														}
														var keys = Object.keys(periods);
														keys.sort(function(a, b){
															if(a > b) return -1;
															if(a < b) return 1;
															return 0;
														});

														for(var i = 0; i < keys.length; i++){
															periods[keys[i]].sort(function(a, b){
																if(a < b) return -1;
															if(a > b) return 1;
															return 0;
															});
														};
														var list = [];
														for(var i = 0; i < keys.length; i++){
															list.push({id: keys[i].replace(/ /g,''), name: keys[i]});
															for(var j =0; j < periods[keys[i]].length; j++){
																list.push({id: periods[keys[i]][j].replace(/ /g,''), name: periods[keys[i]][j].split("@")[0], parent:keys[i].replace(/ /g,'')});
																var current = ALLs[periods[keys[i]][j]];
																for (var l = 0; l < current.length; l++) {
																	current[l].engagementID = current[l].engagementIDone +"-"+current[l].engagementIDtwo+"-"+current[l].engagementIDthree+" "+current[l].recommendationNum,
																	current[l].parent = periods[keys[i]][j].replace(/ /g,'');
																	current[l].id = current[l]["_id"];
																	current[l].process = current[l]["globalProcess"];
																	list.push(current[l]);
																}
															}
														}
														 doc[0].list = list;
														 var obj = doc[0]; // For Merge
														deferred.resolve({"status": 200, "doc": obj});
													}).catch(function(err) {
														console.log("[assessment][getAsmtbyID][getALLList]" + err.error.reason);
														deferred.reject({"status": 500, "error": err.error.reason});
													});

												}).catch(function(err) {
													console.log("[assessment][getAsmtbyID][getGlobalProcess]" + err.error.reason);
													deferred.reject({"status": 500, "error": err.error.reason});
												});
											}
											else {
												var obj = doc[0]; // For Merge
												deferred.resolve({"status": 200, "doc": obj});
											}
										}).catch(function(err) {
											console.log("[assessment][getAsmtbyID][getOpenIssue]" + err.error);
											deferred.reject({"status": 500, "error": err.error});
										});

									}).catch(function(err) {

										console.log("[assessment][getAsmtbyID][getCompDocs] - " + err.error);
										deferred.reject({"status": 500, "error": err.error});
										deferred.promise
									});

								}).catch(function(err) {
									console.log("[assessment][getAsmtbyID][getAccountInheritedFields]" + err.error);
									deferred.reject({"status": 500, "error": err.error});
								});
							}).catch(function(err) {
								console.log("[assessment][getAsmtbyID][getAssessments]" + err.error);
								deferred.reject({"status": 500, "error": err.error});
							});
							break;
						case "Country Process":
							doc[0].ALLData = fieldCalc.addTestViewData(6,defViewRow);
							doc[0].ARCData = fieldCalc.addTestViewData(4,defViewRow);
							doc[0].RiskData = fieldCalc.addTestViewData(11,defViewRow);
							doc[0].AuditTrustedData = doc[0].RiskData;
							doc[0].AuditTrustedRCUData = fieldCalc.addTestViewData(10,defViewRow);
							//doc[0].AuditLocalData = fieldCalc.addTestViewData(8,defViewRow);
							doc[0].DRData = fieldCalc.addTestViewData(5,1);
							doc[0].EAData = doc[0].ARCData;

							// get relevant assessments
							fieldCalc.getAssessments(db, doc, req).then(function(data){
								// Get Component Docs
								comp.getCompDocs(db,doc).then(function(dataComp){
									// Key Controls Tesing tab
									kct.processKCTab(doc,defViewRow);
									// Audits and Reviews Tab
									aar.processARTab(doc,defViewRow);
									//Open Issues Tab
									comp.getOpenIssue(db,doc,defViewRow).then(function(){
										//console.log(doc[0].AuditLocalData);
										//AuditKey
										if(doc[0].MIRABusinessUnit != "GBS" && (parentdoc[0].GPPARENT != null)){
											var obj = {
												selector : {
													"_id": {"$gt":0},
													"docType": "auditLesson",
													"reportingPeriod": {"$gt":0},
													"AuditType": {"$gt":0},
													"businessUnit": req.session.buname,
													"MIRABusinessUnit": doc[0].MIRABusinessUnit,
													"globalProcess": {
														"$regex":".*"+parentdoc[0].GPPARENT+".*"}
												},
												sort:[{"reportingPeriod":"desc"}, {"AuditType":"desc"}]
											};
											db.find(obj).then(function(dataLL){
												var ALLs = {};
												var uniques = {};
												var periods = {};
												for (var j = 0; j < dataLL.body.docs.length; j++){
													var current = dataLL.body.docs[j].AuditType+" - "+dataLL.body.docs[j].AuditCAR+"@"+dataLL.body.docs[j].reportingPeriod;
													if(typeof uniques[dataLL.body.docs[j]["_id"]] === "undefined"){
														uniques[dataLL.body.docs[j]["_id"]] = true;
														if(typeof uniques[current] === "undefined"){
															uniques[current] = true;
														if(typeof periods[dataLL.body.docs[j].reportingPeriod] === "undefined" ){
															periods[dataLL.body.docs[j].reportingPeriod] = [current];
															uniques[current] = true;
														}else{
															periods[dataLL.body.docs[j].reportingPeriod].push(current);
														}
													}
														if(typeof ALLs[current] === "undefined"){
															ALLs[current] = [dataLL.body.docs[j]];
														}else{
															ALLs[current].push(dataLL.body.docs[j]);
														}

													}
												}
												var keys = Object.keys(periods);
												keys.sort(function(a, b){
													if(a > b) return -1;
													if(a < b) return 1;
													return 0;
												});

												for(var i = 0; i < keys.length; i++){
													periods[keys[i]].sort(function(a, b){
														if(a < b) return -1;
														if(a > b) return 1;
														return 0;
													});
												}
												var list = [];
												for(var i = 0; i < keys.length; i++){
													list.push({id: keys[i].replace(/ /g,''), name: keys[i]});
													for(var j =0; j < periods[keys[i]].length; j++){
														//list.push({id: periods[keys[i]][j].replace(/ /g,''), name: periods[keys[i]][j].split("@")[0], parent:keys[i].replace(/ /g,'')});
														var current = ALLs[periods[keys[i]][j]];
														for (var l = 0; l < current.length; l++) {
															current[l].engagementID = current[l].engagementIDone +"-"+current[l].engagementIDtwo+"-"+current[l].engagementIDthree+" "+current[l].recommendationNum,
															current[l].parent = keys[i].replace(/ /g,'');//periods[keys[i]][j].replace(/ /g,'');
															current[l].id = current[l]["_id"];
															current[l].AuditCAR = current[l]["AuditCAR"];
															list.push(current[l]);
														}
													}
												}
												doc[0].list = list;
												var obj = doc[0]; // For Merge
												deferred.resolve({"status": 200, "doc": obj});
											}).catch(function(err) {
												console.log("[assessment][getAsmtbyID][getALLList]" + err.error.reason);
												deferred.reject({"status": 500, "error": err.error.reason});
											});
										}//end if GTS
										else {
											var obj = doc[0]; // For Merge
											deferred.resolve({"status": 200, "doc": obj});
										}
									}).catch(function(err) {
										console.log("[assessment][getAsmtbyID][getOpenIssue]" + err.error);
										deferred.reject({"status": 500, "error": err.error});
									});

									// deferred.resolve({"status": 200, "doc": doc});
								}).catch(function(err) {
									console.log("[assessment][getAsmtbyID][getCompDocs]" + err.error);
									deferred.reject({"status": 500, "error": err.error});
								});

							}).catch(function(err) {
								console.log("[assessment][getAsmtbyID][getAssessments]" + err.error);
								deferred.reject({"status": 500, "error": err.error});
							});

							break;
						case "Account":
							doc[0].ALLData = fieldCalc.addTestViewData(7,defViewRow);
							doc[0].ARCData = fieldCalc.addTestViewData(4,defViewRow);
							doc[0].RiskData = fieldCalc.addTestViewData(11,defViewRow);
							doc[0].AuditTrustedData = doc[0].RiskData;
							doc[0].AuditTrustedRCUData = fieldCalc.addTestViewData(9,defViewRow);
							//doc[0].AuditLocalData = fieldCalc.addTestViewData(8,defViewRow);
							doc[0].DRData = fieldCalc.addTestViewData(5,1);
							doc[0].RCTestData = fieldCalc.addTestViewData(9,defViewRow);
							doc[0].SCTestData = doc[0].RCTestData;
							doc[0].RCTestData = fieldCalc.addTestViewData(9,defViewRow);
							doc[0].SampleData = doc[0].RiskData;
							doc[0].EAData = doc[0].ARCData;
							doc[0].AccountData = doc[0].RiskData;
							//Get components docs
							comp.getCompDocs(db,doc).then(function(dataComp){
								// Audits and Reviews Tab
								aar.processARTab(doc,defViewRow);
								// Key Controls Tesing tab
								kct.processKCTab(doc,defViewRow);
								//AuditKey
								if(doc[0].MIRABusinessUnit != "GBS" && (parentdoc[0].AuditLessonsKey != null)){
									fieldCalc.getGlobalProcess(db, doc[0].MIRABusinessUnit).then(function(dataGP){
										var gpList = dataGP.doc;

										var promises = parentdoc[0].AuditLessonsKey.split(",").map(function(id){
											var obj = {
												selector : {
													"_id": {"$gt":0},
													"docType": "auditLesson",
													"reportingPeriod": {"$gt":0},
													"AuditType": {"$gt":0},
													"businessUnit": req.session.buname,
													"MIRABusinessUnit": doc[0].MIRABusinessUnit,
													"AuditLessonsKey": {
														"$regex":".*"+id+".*"}
												},
												sort:[{"reportingPeriod":"desc"}, {"AuditType":"desc"}]
											};
											return db.find(obj);
										});
										q.all(promises).then(function(dataLL){

											var ALLs = {};
											var uniques = {};
											var periods = {};
											for (var i = 0; i < dataLL.length; i++) {
												for (var j = 0; j < dataLL[i].body.docs.length; j++){
													//GlobalProcess
													var gpKey = dataLL[i].body.docs[j].globalProcess.split(",");
													for(var x = 0; x < gpKey.length; x++ ){
														for(var y = 0; y < gpList.length;y++){
															if(gpKey[x] == gpList[y].WWBCITKey){
																gpKey[x] = gpList[y].Name;
																break;
															}
														}
													}
													dataLL[i].body.docs[j].globalProcess = gpKey;

													var current = dataLL[i].body.docs[j].AuditType+" - "+dataLL[i].body.docs[j].AuditCAR+"@"+dataLL[i].body.docs[j].reportingPeriod;
													if(typeof uniques[dataLL[i].body.docs[j]["_id"]] === "undefined"){
														uniques[dataLL[i].body.docs[j]["_id"]] = true;
														if(typeof uniques[current] === "undefined"){
															uniques[current] = true;
															if(typeof periods[dataLL[i].body.docs[j].reportingPeriod] === "undefined" ){
																periods[dataLL[i].body.docs[j].reportingPeriod] = [current];
																uniques[current] = true;
															}else{
																periods[dataLL[i].body.docs[j].reportingPeriod].push(current);
															}
														}
														if(typeof ALLs[current] === "undefined"){
															ALLs[current] = [dataLL[i].body.docs[j]];
														}else{
															ALLs[current].push(dataLL[i].body.docs[j]);
														}

													}
												}
											}
											var keys = Object.keys(periods);
											keys.sort(function(a, b){
												if(a > b) return -1;
												if(a < b) return 1;
												return 0;
											});

											for(var i = 0; i < keys.length; i++){
												periods[keys[i]].sort(function(a, b){
													if(a < b) return -1;
													if(a > b) return 1;
													return 0;
												});
											}
											var list = [];
											for(var i = 0; i < keys.length; i++){
												list.push({id: keys[i].replace(/ /g,''), name: keys[i]});
												for(var j =0; j < periods[keys[i]].length; j++){
													list.push({id: periods[keys[i]][j].replace(/ /g,''), name: periods[keys[i]][j].split("@")[0], parent:keys[i].replace(/ /g,'')});
													var current = ALLs[periods[keys[i]][j]];
													for (var l = 0; l < current.length; l++) {
														current[l].engagementID = current[l].engagementIDone +"-"+current[l].engagementIDtwo+"-"+current[l].engagementIDthree+" "+current[l].recommendationNum,
														current[l].parent = periods[keys[i]][j].replace(/ /g,'');
														current[l].id = current[l]["_id"];
														current[l].process = current[l]["globalProcess"];
														list.push(current[l]);
													}
												}
											}
											doc[0].list = list;
											var obj = doc[0]; // For Merge
											deferred.resolve({"status": 200, "doc": obj});
										}).catch(function(err) {
											console.log("[assessment][getAsmtbyID][getALLList]" + err.error.reason);
											deferred.reject({"status": 500, "error": err.error.reason});
										});

									}).catch(function(err) {
										console.log("[assessment][getAsmtbyID][getGlobalProcess]" + err.error);
										deferred.reject({"status": 500, "error": err.error});
									});
								}
								else {
									var obj = doc[0]; // For Merge
									deferred.resolve({"status": 200, "doc": obj});
								}
							}).catch(function(err) {
								console.log("[assessment][getAsmtbyID][getCompDocs]" + err.error);
								deferred.reject({"status": 500, "error": err.error});
							});
							break;
						default:
							deferred.resolve({"status": 200, "doc": doc});
					}
				}).catch(function(err) {
					console.log("[assessment][getAsmtbyID][getDocParams]" + err.error);
					deferred.reject({"status": 500, "error": err.error});
				});


			}).catch(function(err) {
				console.log("[assessment][getAsmtbyID][getRules]" + err.error);
				deferred.reject({"status": 500, "error": err.error});
			});


		}).catch(function(err) {
			console.log("[assessment][getAsmtbyID]" + err.error.reason);
			deferred.reject({"status": 500, "error": err.error.reason});
		});
		return deferred.promise;
	},
	/* New assessment by parent ID */
	newAsmtByPID: function(req, db) {
		var deferred = q.defer();
		try{
			var pid = req.query.pid
			var defViewRow = 5;
			db.get(pid).then(function(data){
				var pdoc = [];
				var doc = [];
				pdoc.push(data.body);

				/* Get access and roles */
				var peditors = pdoc[0].AdditionalEditors + pdoc[0].Owner + pdoc[0].Focals;
				accessrules.getRules(req,pid,db,data.body).then(function(result){

					accessrules.rules = result.rules;
					//accessrules.getRules(req,peditors);
					var editors = pdoc[0].AdditionalEditors + pdoc[0].Owner + pdoc[0].Focals;

					if (accessrules.rules.editor) {
						var tmpdoc = {
							"key": "Assessment",
							"DocType": "Assessment",
							"parentid": pid,
							"ParentDocSubType": pdoc[0].DocSubType,
							"AssessableUnitName": pdoc[0].Name,
							"PeriodRating": "NR",
							"MIRAStatus": "Draft",
							"AUStatus": "Active",
							"BusinessUnit": pdoc[0].BusinessUnit,
							"AllEditors": pdoc[0].AllEditors,
							"AllReaders": pdoc[0].AllReaders,
							"Owner": pdoc[0].Owner,
							"ExcludeGeo": pdoc[0].ExcludeGeo,
							"BUCountryIOT": pdoc[0].BUCountryIOT,
							"RGRollup": pdoc[0].RGRollup,
							"MIRABusinessUnit": pdoc[0].MIRABusinessUnit,
							"editmode": 1,
							"RJandT2SEditable": 1,
							"RatingEditable": 1,
							"editor": accessrules.rules.editor,
							"admin": accessrules.rules.admin,
							"resetstatus": accessrules.rules.resetstatus,
							"newunit": 1
						};
						doc.push(tmpdoc);
						doc[0].CurrentPeriod = req.session.quarter;
						doc[0].PrevQtrs = [];
						doc[0].PrevQtrs = fieldCalc.getPrev4Qtrs(doc[0].CurrentPeriod);
						doc[0].EnteredBU = pdoc[0].MIRABusinessUnit;
						// Get inherited fields from parent assessable unit
						if (pdoc[0].OpMetricKey == undefined || pdoc[0].OpMetricKey == "") pdoc[0].OpMetricKey = "OMKID0";
						doc[0].OpMetricKey = pdoc[0].OpMetricKey;
						doc[0].Category = pdoc[0].Category;
						fieldCalc.getDocParams(req, db, doc).then(function(data){
							/* Get previous 4 quarter assessments to get historical data from:
									- previous 4 qtrs Ratings
									- prrevious 4 qtrs target to Status
									- previous 4 qtrs DR & TR
									- previous 4 qtrs unremed defects
							*/
							// var searchobj = {
							// 	selector:{
							// 		"_id": {"$gt":0},
							// 		"key": "Assessable Unit",
							// 		"Status": "Active",
							// 		$or: [
							// 			{$and:[{$or:[{"DocSubType": "BU Reporting Group"},{"DocSubType": "BU IMT"}]},{"BusinessUnit":doc[0].BusinessUnit}]},
							// 			{$and:[{"DocSubType": "IMT"},{"IOT":doc[0].IOT}]}
							// 		]
							// 	}
							// };

							switch (doc[0].ParentDocSubType) {
								case "Account":
									doc[0].ALLData = fieldCalc.addTestViewData(7,defViewRow);
									doc[0].ARCData = fieldCalc.addTestViewData(4,defViewRow);
									doc[0].RiskData = fieldCalc.addTestViewData(11,defViewRow);
									doc[0].AuditTrustedData = doc[0].RiskData;
									doc[0].AuditTrustedRCUData = fieldCalc.addTestViewData(9,defViewRow);
									doc[0].AuditLocalData = fieldCalc.addTestViewData(8,defViewRow);
									doc[0].DRData = fieldCalc.addTestViewData(5,1);
									doc[0].RCTestData = fieldCalc.addTestViewData(9,defViewRow);
									doc[0].SCTestData = doc[0].RCTestData;
									doc[0].RCTestData = fieldCalc.addTestViewData(9,defViewRow);
									doc[0].SampleData = doc[0].RiskData;
									doc[0].EAData = doc[0].ARCData;
									doc[0].AccountData = doc[0].RiskData;

									if (pdoc[0].IOT != undefined) {
										doc[0].IOT = pdoc[0].IOT;
									}
									if (pdoc[0].IMT != undefined) {
										doc[0].IMT = pdoc[0].IMT;
									}
									if (pdoc[0].Country != undefined) {
										doc[0].Country = pdoc[0].Country;
									}

									doc[0].ControllableUnit = pdoc[0].ControllableUnit;
									doc[0].Category = pdoc[0].Category;
									doc[0].AuditProgram = pdoc[0].AuditProgram;
									doc[0].ReportingGroupList = [];
									var searchobj = {
										selector:{
											"_id": {"$gt":0},
											"key": "Assessable Unit",
											"Status": "Active",
											"BusinessUnit": doc[0].BusinessUnit,
											"DocSubType": "BU Reporting Group"
										}
									};

									db.find(searchobj).then(function(resdata) {
										var resdocs = resdata.body.docs;
										for (var i = 0; i < resdocs.length; ++i) {
											doc[0].ReportingGroupList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
										}
										deferred.resolve({"status": 200, "doc": doc});
									}).catch(function(err) {
										console.log("[assessment][newAsmtByPID][ReportingGroupList]" + err.error.reason);
										deferred.reject({"status": 500, "error": err.error.reason});
									});
									break;
								case "BU Reporting Group":
									if (doc[0].EnteredBU == "GTS") {
										doc[0].PeriodRatingSOD = "NR";
										doc[0].PeriodRatingCRM = "NR";
										doc[0].PPRData = fieldCalc.addTestViewData(13,defViewRow);
										doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,defViewRow);
										doc[0].RiskView1Data = fieldCalc.addTestViewData(6,defViewRow);
										doc[0].RiskView2Data = fieldCalc.addTestViewData(16,defViewRow);
										doc[0].RiskView3Data = fieldCalc.addTestViewData(13,defViewRow);
									} else {
										doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
										doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,defViewRow);
										doc[0].RiskView1Data = fieldCalc.addTestViewData(5,defViewRow);
										doc[0].RiskView2Data = fieldCalc.addTestViewData(13,defViewRow);
									}
									doc[0].InternalAuditData = fieldCalc.addTestViewData(10,defViewRow);
									doc[0].AUData = fieldCalc.addTestViewData(17,5);
									doc[0].AUData2 = fieldCalc.addTestViewData(19,5);
									doc[0].RCTest1Data = fieldCalc.addTestViewData(5,defViewRow);
									doc[0].RCTest2Data = fieldCalc.addTestViewData(8,defViewRow);
									doc[0].RCTest3Data = fieldCalc.addTestViewData(11,defViewRow);
									doc[0].SCTest1Data = doc[0].RCTest1Data;
									doc[0].SCTest2Data = doc[0].RCTest3Data;
									doc[0].BUCAsmtDataPRview = [];
									doc[0].BUCAsmtDataCURview = [];
									doc[0].BUCAsmtDataPIview = [];
									doc[0].BUCAsmtDataOIview = [];
									fieldCalc.getAssessments(db, doc, req).then(function(data){
										fieldCalc.getRatingProfile(doc);
										if (doc[0].BUCAsmtDataPRview.length < defViewRow) {
											if (doc[0].BUCAsmtDataPRview.length == 0) {
												doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,defViewRow);
											} else {
												fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(defViewRow-doc[0].BUCAsmtDataPRview.length));
											}
										}
										if (doc[0].BUCAsmtDataCURview.length < defViewRow) {
											if (doc[0].BUCAsmtDataCURview.length == 0) {
												doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,defViewRow);
											} else {
												fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(defViewRow-doc[0].BUCAsmtDataPRview.length));
											}
										}
										if (doc[0].BUCAsmtDataPIview.length < defViewRow) {
											if (doc[0].BUCAsmtDataPIview.length == 0) {
												doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,defViewRow);
											} else {
												fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(defViewRow-doc[0].BUCAsmtDataPIview.length));
											}
										}
										if (doc[0].BUCAsmtDataOIview.length < defViewRow) {
											if (doc[0].BUCAsmtDataOIview.length == 0) {
												doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,defViewRow);
											} else {
												fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(defViewRow-doc[0].BUCAsmtDataOIview.length));
											}
										}
										deferred.resolve({"status": 200, "doc": doc});
									}).catch(function(err) {
										console.log("[assessment][newAsmtByPID][getAssessments]" + err.error);
										deferred.reject({"status": 500, "error": err.error});
									});
									break;
								case "BU IOT":
									doc[0].IOT = pdoc[0].IOT;
									if (doc[0].EnteredBU == "GTS") {
										doc[0].PeriodRatingSOD = "NR";
										doc[0].PeriodRatingCRM = "NR";
										doc[0].InternalAuditData = fieldCalc.addTestViewData(9,defViewRow);
										doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
										doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,defViewRow);
										doc[0].RiskView1Data = fieldCalc.addTestViewData(6,defViewRow);
										doc[0].RiskView2Data = fieldCalc.addTestViewData(14,defViewRow);
										doc[0].RiskView3Data = fieldCalc.addTestViewData(13,defViewRow);
									} else {
										doc[0].InternalAuditData = fieldCalc.addTestViewData(9,defViewRow);
										doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
										doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,defViewRow);
										doc[0].RiskView1Data = fieldCalc.addTestViewData(5,defViewRow);
										doc[0].RiskView2Data = fieldCalc.addTestViewData(13,defViewRow);
									}
									doc[0].AUData = fieldCalc.addTestViewData(17,10);
									doc[0].RCTest1Data = fieldCalc.addTestViewData(5,defViewRow);
									doc[0].RCTest2Data = fieldCalc.addTestViewData(8,defViewRow);
									doc[0].RCTest3Data = fieldCalc.addTestViewData(11,defViewRow);
									doc[0].SCTest1Data = doc[0].RCTest1Data;
									doc[0].SCTest2Data = doc[0].RCTest3Data;
									doc[0].BUCAsmtDataPRview = [];
									doc[0].BUCAsmtDataCURview = [];
									doc[0].BUCAsmtDataPIview = [];
									doc[0].BUCAsmtDataOIview = [];
									fieldCalc.getAssessments(db, doc, req).then(function(data){
										fieldCalc.getRatingProfile(doc);
										if (doc[0].BUCAsmtDataPRview.length < defViewRow) {
											if (doc[0].BUCAsmtDataPRview.length == 0) {
												doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,defViewRow);
											} else {
												fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(defViewRow-doc[0].BUCAsmtDataPRview.length));
											}
										}
										if (doc[0].BUCAsmtDataCURview.length < defViewRow) {
											if (doc[0].BUCAsmtDataCURview.length == 0) {
												doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,defViewRow);
											} else {
												fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(defViewRow-doc[0].BUCAsmtDataPRview.length));
											}
										}
										if (doc[0].BUCAsmtDataPIview.length < defViewRow) {
											if (doc[0].BUCAsmtDataPIview.length == 0) {
												doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,defViewRow);
											} else {
												fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(defViewRow-doc[0].BUCAsmtDataPIview.length));
											}
										}
										if (doc[0].BUCAsmtDataOIview.length < defViewRow) {
											if (doc[0].BUCAsmtDataOIview.length == 0) {
												doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,defViewRow);
											} else {
												fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(defViewRow-doc[0].BUCAsmtDataOIview.length));
											}
										}
										deferred.resolve({"status": 200, "doc": doc});
									}).catch(function(err) {
										console.log("[assessment][newAsmtByPID][getAssessments]" + err.error);
										deferred.reject({"status": 500, "error": err.error});
									});
									break;
								case "BU IMT":
									doc[0].IOT = pdoc[0].IOT;
									doc[0].IMT = pdoc[0].IMT;
									doc[0].BUIOT = req.session.buname + " - " + util.resolveGeo(doc[0].IOT,"IOT",req);
									if (doc[0].EnteredBU == "GTS") {
										doc[0].PeriodRatingSOD = "NR";
										doc[0].PeriodRatingCRM = "NR";
										doc[0].InternalAuditData = fieldCalc.addTestViewData(9,defViewRow);
										doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
										doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,defViewRow);
										doc[0].RiskView1Data = fieldCalc.addTestViewData(6,defViewRow);
										doc[0].RiskView2Data = fieldCalc.addTestViewData(14,defViewRow);
										doc[0].RiskView3Data = fieldCalc.addTestViewData(13,defViewRow);
									} else {
										doc[0].InternalAuditData = fieldCalc.addTestViewData(9,defViewRow);
										doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
										doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,defViewRow);
										doc[0].RiskView1Data = fieldCalc.addTestViewData(5,defViewRow);
										doc[0].RiskView2Data = fieldCalc.addTestViewData(11,defViewRow);
									}
									doc[0].AUData = fieldCalc.addTestViewData(17,10);
									doc[0].RCTest1Data = fieldCalc.addTestViewData(5,defViewRow);
									doc[0].RCTest2Data = fieldCalc.addTestViewData(8,defViewRow);
									doc[0].RCTest3Data = fieldCalc.addTestViewData(11,defViewRow);
									doc[0].SCTest1Data = doc[0].RCTest1Data;
									doc[0].SCTest2Data = doc[0].RCTest3Data;
									doc[0].BUCAsmtDataPRview = [];
									doc[0].BUCAsmtDataCURview = [];
									doc[0].BUCAsmtDataPIview = [];
									doc[0].BUCAsmtDataOIview = [];
									fieldCalc.getAssessments(db, doc, req).then(function(data){
										comp.getCompDocs(db,doc).then(function(dataComp){
											fieldCalc.getRatingProfile(doc);
											if (doc[0].BUCAsmtDataPRview.length < defViewRow) {
												if (doc[0].BUCAsmtDataPRview.length == 0) {
													doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,defViewRow);
												} else {
													fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(defViewRow-doc[0].BUCAsmtDataPRview.length));
												}
											}
											if (doc[0].BUCAsmtDataCURview.length < defViewRow) {
												if (doc[0].BUCAsmtDataCURview.length == 0) {
													doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,defViewRow);
												} else {
													fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(defViewRow-doc[0].BUCAsmtDataPRview.length));
												}
											}
											if (doc[0].BUCAsmtDataPIview.length < defViewRow) {
												if (doc[0].BUCAsmtDataPIview.length == 0) {
													doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,defViewRow);
												} else {
													fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(defViewRow-doc[0].BUCAsmtDataPIview.length));
												}
											}
											if (doc[0].BUCAsmtDataOIview.length < defViewRow) {
												if (doc[0].BUCAsmtDataOIview.length == 0) {
													doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,defViewRow);
												} else {
													fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(defViewRow-doc[0].BUCAsmtDataOIview.length));
												}
											}
											deferred.resolve({"status": 200, "doc": doc});
										}).catch(function(err) {
											console.log("[assessment][newAsmtByPID][getCompDocs]" + err.error);
											deferred.reject({"status": 500, "error": err.error});
										});
									}).catch(function(err) {
										console.log("[assessment][newAsmtByPID][getAssessments]" + err.error);
										deferred.reject({"status": 500, "error": err.error});
									});
									break;
								case "BU Country":
									doc[0].IOT = pdoc[0].IOT;
									doc[0].IMT = pdoc[0].IMT;
									doc[0].Country = pdoc[0].Country;
									doc[0].BUIMT = req.session.buname + " - " + util.resolveGeo(doc[0].IMT,"IMT",req);
									doc[0].CountryId = doc[0].Country;
									doc[0].Country = util.resolveGeo(doc[0].Country,"Country",req);
									doc[0].Name = doc[0].BusinessUnit + " - " + doc[0].Country;
									if (doc[0].EnteredBU == "GTS") {
										doc[0].PeriodRatingSOD = "NR";
										doc[0].PeriodRatingCRM = "NR";
										doc[0].InternalAuditData = fieldCalc.addTestViewData(9,defViewRow);
										doc[0].PPRData = fieldCalc.addTestViewData(12,defViewRow);
										doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,defViewRow);
										doc[0].RiskView1Data = fieldCalc.addTestViewData(6,defViewRow);
										doc[0].RiskView2Data = fieldCalc.addTestViewData(14,defViewRow);
										doc[0].RiskView3Data = fieldCalc.addTestViewData(13,defViewRow);
									} else {
										doc[0].InternalAuditData = fieldCalc.addTestViewData(8,defViewRow);
										doc[0].PPRData = fieldCalc.addTestViewData(11,defViewRow);
										doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,defViewRow);
										doc[0].RiskView1Data = fieldCalc.addTestViewData(5,defViewRow);
										doc[0].RiskView2Data = fieldCalc.addTestViewData(11,defViewRow);
									}
									doc[0].AUData = fieldCalc.addTestViewData(17,5);
									doc[0].AUData2 = fieldCalc.addTestViewData(19,5);
									doc[0].RCTest1Data = fieldCalc.addTestViewData(5,defViewRow);
									doc[0].RCTest2Data = fieldCalc.addTestViewData(8,defViewRow);
									doc[0].RCTest3Data = fieldCalc.addTestViewData(11,defViewRow);
									doc[0].SCTest1Data = doc[0].RCTest1Data;
									doc[0].SCTest2Data = doc[0].RCTest3Data;
									doc[0].BUCAsmtDataPRview = [];
									doc[0].BUCAsmtDataCURview = [];
									doc[0].BUCAsmtDataPIview = [];
									doc[0].BUCAsmtDataOIview = [];
									doc[0].AUDataMSAC = [];

									comp.getCompDocs(db,doc).then(function(dataComp){
										fieldCalc.getAssessments(db, doc, req).then(function(data){
											//open risks
											ort.processORTab(doc,defViewRow,req);
											fieldCalc.getRatingProfile(doc);
											if (doc[0].BUCAsmtDataPRview.length < defViewRow) {
												if (doc[0].BUCAsmtDataPRview.length == 0) {
													doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,defViewRow);
												} else {
													fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(defViewRow-doc[0].BUCAsmtDataPRview.length));
												}
											}
											if (doc[0].BUCAsmtDataCURview.length < defViewRow) {
												if (doc[0].BUCAsmtDataCURview.length == 0) {
													doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,defViewRow);
												} else {
													fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(defViewRow-doc[0].BUCAsmtDataPRview.length));
												}
											}
											if (doc[0].BUCAsmtDataPIview.length < defViewRow) {
												if (doc[0].BUCAsmtDataPIview.length == 0) {
													doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,defViewRow);
												} else {
													fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(defViewRow-doc[0].BUCAsmtDataPIview.length));
												}
											}
											if (doc[0].BUCAsmtDataOIview.length < defViewRow) {
												if (doc[0].BUCAsmtDataOIview.length == 0) {
													doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,defViewRow);
												} else {
													fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(defViewRow-doc[0].BUCAsmtDataOIview.length));
												}
											}

											//create a space for performance Tab
											performanceTab.getKFCRDefectRate(db,doc);
											performanceTab.getKCODefectRate(db,doc);
											performanceTab.getMissedRisks(db,doc);
											performanceTab.getMSACCommitmentsCount(db,doc);
											performanceTab.getCPANDCUPerformanceIndicators(db,doc);
											performanceTab.getCPANDCUPerformanceIndicatorsAndOthers(db,doc);


											deferred.resolve({"status": 200, "doc": doc});
										}).catch(function(err) {
											console.log("[assessment][newAsmtByPID][getAssessments]" + err.error);
											deferred.reject({"status": 500, "error": err.error});
										});

									}).catch(function(err) {
										console.log("[assessment][newAsmtByPID][getCompDocs]" + err.error);
										deferred.reject({"status": 500, "error": err.error});
									});

									break;
							}
						}).catch(function(err) {
							console.log("[assessment][newAsmtByPID][getDocParams]" + err.error);
							deferred.reject({"status": 500, "error": err.error});
						});

					} else {
						deferred.reject({"status": 500, "error": "Access denied!"});
					}

				}).catch(function(err) {
					console.log("[assessment][newAsmtByPID][getRules]" + err.error);
					deferred.reject({"status": 500, "error": err.error});
				});

			}).catch(function(err) {
				console.log("[assessment][newAsmtByPID]" + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	/* Save Assessment document */
	saveAsmt: function(req, db) {
		var deferred = q.defer();
		try{
			var now = moment(new Date());
			var docid = req.body.docid;
			var curruser = req.session.user.notesId;
			var currdate = now.format("MM/DD/YYYY");
			var addlog = {
				"name": curruser,
				"date": currdate,
				"time": now.format("hh:mmA") + " " + mtz.tz(mtz.tz.guess()).zoneAbbr(),
			};

			if (docid == "") { // new assessment document
				var pid = req.body.parentid;
				db.get(pid).then(function(pdata){
					var pdoc = [];
					var doc = [];
					pdoc.push(pdata.body);
					var tmpdoc = {
						"key": "Assessment",
						"DocType": "Assessment",
						"parentid": pid,
						"grandparentid": pdoc[0].parentid,
						"ParentDocSubType": req.body.parentdocsubtype,
						"AUStatus": pdoc[0].Status,
						"AssessableUnitName": pdoc[0].Name,
						"BusinessUnit": pdoc[0].BusinessUnit,
						"MIRABusinessUnit": pdoc[0].MIRABusinessUnit,
						"AllEditors": pdoc[0].AllEditors,
						"AllReaders": pdoc[0].AllReaders,
						"ExcludeGeo": pdoc[0].ExcludeGeo,
						"BRGMembership": pdoc[0].BRGMembership,
						"BUCountryIOT": pdoc[0].BUCountryIOT,
						"RGRollup": pdoc[0].RGRollup,
						"AuditableFlag": pdoc[0].AuditableFlag,
						"BUWWBCITKey": pdoc[0].BUWWBCITKey,
						"Owner": pdoc[0].Owner
					};
					doc.push(tmpdoc);
					//---Basics Section---//
					doc[0].CurrentPeriod = req.session.quarter;
					if (doc[0].PrevRatingUpdate != req.body.PeriodRating) {
						doc[0].RatingChangeWho = curruser;
						doc[0].RatingChangeWhen = currdate;
						doc[0].PrevRatingUpdate = doc[0].PeriodRating;
						doc[0].PeriodRating = req.body.PeriodRating;
					}
					if ( doc[0].PeriodRating  ==  "Sat") {
						doc[0].ReviewComments = "";
						doc[0].Target2Sat = "";
					} else {
						doc[0].ReviewComments = req.body.ReviewComments;
						doc[0].Target2Sat = req.body.Target2Sat;
					}
					if ( doc[0].MIRAStatus != req.body.MIRAStatus ) {
						doc[0].MIRAStatusChangeWho = curruser;
						doc[0].MIRAStatusChangeWhen = currdate;
					}
					doc[0].MIRARatingJustification = req.body.MIRARatingJustification;
					doc[0].MIRAStatus = req.body.MIRAStatus;
					doc[0].NextQtrRating = req.body.NextQtrRating;
					doc[0].DecommitExplanation = req.body.DecommitExplanation;
					switch (doc[0].ParentDocSubType) {
						case "BU Reporting Group":
						case "BU IOT":
						case "BU IMT":
						case "BU Country":
							if (doc[0].ParentDocSubType == "BU Country") {
								doc[0].IOT = pdoc[0].IOT;
								doc[0].IMT = pdoc[0].IMT;
								doc[0].Country = pdoc[0].Country;
							} else if (doc[0].ParentDocSubType == "BU IMT") {
								doc[0].IOT = pdoc[0].IOT;
								doc[0].IMT = pdoc[0].IMT;
								//---Summary Tab---//
								doc[0].Insight1 = req.body.Insight1;
								doc[0].Insight2 = req.body.Insight2;
								doc[0].Insight3 = req.body.Insight3;
								doc[0].Insight4 = req.body.Insight4;
								doc[0].Insight5 = req.body.Insight5;
							} else if (doc[0].ParentDocSubType == "BU IOT") {
								doc[0].IOT = pdoc[0].IOT;
								//---Summary Tab---//
								doc[0].Insight1 = req.body.Insight1;
								doc[0].Insight2 = req.body.Insight2;
								doc[0].Insight3 = req.body.Insight3;
								doc[0].Insight4 = req.body.Insight4;
								doc[0].Insight5 = req.body.Insight5;
							} else {
								//---Summary Tab---//
								doc[0].Insight1 = req.body.Insight1;
								doc[0].Insight2 = req.body.Insight2;
								doc[0].Insight3 = req.body.Insight3;
								doc[0].Insight4 = req.body.Insight4;
								doc[0].Insight5 = req.body.Insight5;
							}
							//---Summary Tab---//
							doc[0].RatingSummary = req.body.RatingSummary;
							//---Performance Overview Tab---//
							doc[0].OverallAssessmentComments = req.body.OverallAssessmentComments;
							doc[0].KCFRTestingComments = req.body.KCFRTestingComments;
							doc[0].KCOTestingComments = req.body.KCOTestingComments;
							doc[0].CorpIAComments = req.body.CorpIAComments;
							doc[0].MissedREComments = req.body.MissedREComments;
							doc[0].MissedMSACComments = req.body.MissedMSACComments;
							//---Perfromance Overview Tab operational metrics---//
							var metricsID = req.body.opMetricIDs.split(",");
							var tname, topush;
							doc[0].OpMetric = [];
							for (var i = 0; i < metricsID.length; ++i) {
								if(metricsID[i] != undefined && metricsID[i] != "") {
									topush = {
										"id": metricsID[i]
									};
									doc[0].OpMetric.push(topush);
									fname = metricsID[i]+"Name";
									doc[0].OpMetric[i].name = req.body[fname];
									fname = metricsID[i]+"Rating";
									doc[0].OpMetric[i].rating = req.body[fname];
									fname = metricsID[i]+"Comment";
									doc[0].OpMetric[i].action = req.body[fname];
								}
							}
							// For GTS
							if (req.session.businessunit == "GTS") {
								//---Summary Tab---//
								doc[0].HighlightCRM = req.body.HighlightCRM;
								doc[0].FocusAreaCRM = req.body.FocusAreaCRM;
								doc[0].HighlightSOD = req.body.HighlightSOD;
								doc[0].FocusAreaSOD = req.body.FocusAreaSOD;
								//---Perfromance Overview Tab operational metrics CRM---//
								doc[0].PeriodRatingCRM = req.body.PeriodRatingCRM;
								// CRM rich text fields
								doc[0].OverallAssessmentCommentsCRM = req.body.OverallAssessmentCommentsCRM;
								doc[0].KCFRTestingCommentsCRM = req.body.KCFRTestingCommentsCRM;
								doc[0].KCOTestingCommentsCRM = req.body.KCOTestingCommentsCRM;
								doc[0].CorpIACommentsCRM = req.body.CorpIACommentsCRM;
								doc[0].MissedRECommentsCRM = req.body.MissedRECommentsCRM;
								doc[0].MissedMSACCommentsCRM = req.body.MissedMSACCommentsCRM;
								doc[0].BoCCommentsCRM = req.body.BoCCommentsCRM;
								doc[0].PerfOverviewOtherExplanationCRM = req.body.PerfOverviewOtherExplanationCRM;
								doc[0].PerfOverviewCriticaExplanationCRM = req.body.PerfOverviewCriticaExplanationCRM;
								//---Perfromance Overview Tab operational metrics SOD---//
								doc[0].PeriodRatingSOD = req.body.PeriodRatingSOD;
								// SOD rich text fields
								doc[0].OverallAssessmentCommentsSOD = req.body.OverallAssessmentCommentsSOD;
								doc[0].KCFRTestingCommentsSOD = req.body.KCFRTestingCommentsSOD;
								doc[0].KCOTestingCommentsSOD = req.body.KCOTestingCommentsSOD;
								doc[0].CorpIACommentsSOD = req.body.CorpIACommentsSOD;
								doc[0].MissedRECommentsSOD = req.body.MissedRECommentsSOD;
								doc[0].MissedMSACCommentsSOD = req.body.MissedMSACCommentsSOD;
								doc[0].BoCCommentsSOD = req.body.BoCCommentsSOD;
								doc[0].PerfOverviewOtherExplanationSOD = req.body.PerfOverviewOtherExplanationSOD;
								doc[0].PerfOverviewCriticaExplanationSOD = req.body.PerfOverviewCriticaExplanationSOD;
								//---Perfromance Overview Tab operational metrics---//
								var metricsID = req.body.opMetricIDsSOD.split(",");
								var tname, topush;
								doc[0].OpMetricSOD = [];
								for (var i = 0; i < metricsID.length; ++i) {
									if(metricsID[i] != undefined && metricsID[i] != "") {
										topush = {
											"id": metricsID[i]
										};
										doc[0].OpMetricSOD.push(topush);
										fname = metricsID[i]+"NameSOD";
										doc[0].OpMetricSOD[i].name = req.body[fname];
										fname = metricsID[i]+"RatingSOD";
										doc[0].OpMetricSOD[i].rating = req.body[fname];
										fname = metricsID[i]+"CommentSOD";
										doc[0].OpMetricSOD[i].action = req.body[fname];
									}
								}
								//---Open Risks and Missed Commits Tab---//
								doc[0].GCSFocusItems = req.body.GCSFocusItems;
								doc[0].MissedMSACsRptColorCRM = req.body.MissedMSACsRptColorCRM;
								doc[0].MissedIssueRptColorCRM = req.body.MissedIssueRptColorCRM;
								doc[0].MissedMSACsRptColorSOD = req.body.MissedMSACsRptColorSOD;
								doc[0].MissedIssueRptColorSOD = req.body.MissedIssueRptColorSOD;
							}
							// For GBS
							else {
								//---Summary Tab---//
								doc[0].Highlight = req.body.Highlight;
								doc[0].FocusArea = req.body.FocusArea;
								//---Perfromance Overview Tab---//
								doc[0].BoCComments = req.body.BoCComments;
								doc[0].PerfOverviewOtherExplanation = req.body.PerfOverviewOtherExplanation;
								doc[0].PerfOverviewCriticaExplanation = req.body.PerfOverviewCriticaExplanation;
								//---Open Risks and Missed Commits Tab---//
								doc[0].GCSSection1Explanations = req.body.GCSSection1Explanations;
								doc[0].GCSFocusItems = req.body.GCSFocusItems;
								doc[0].MissedMSACsRptColor = req.body.MissedMSACsRptColor;
								doc[0].MissedIssueRptColor = req.body.MissedIssueRptColor;
							}
							//---Audits and Reviews Tab---//
							doc[0].IAExplanations = req.body.IAExplanations;
							doc[0].PRExplanations = req.body.PRExplanations;
							doc[0].ARRExplanations = req.body.ARRExplanations;
							doc[0].AuditFocusText = req.body.AuditFocusText;
							//---CU Ratings Tab---//
							doc[0].CUFocusItems = req.body.CUFocusItems;
							//---Reporting Country Testing Tab---//
							doc[0].SOXProcessTestingExplanations = req.body.SOXProcessTestingExplanations;
							doc[0].OpsProcessTestingExplanations = req.body.OpsProcessTestingExplanations;
							doc[0].ProcessTestingFocusItems = req.body.ProcessTestingFocusItems;
							//---Sampled Country Testing Tab---//
							doc[0].SCSOXProcessTestingExplanations = req.body.SCSOXProcessTestingExplanations;
							doc[0].SCOpsProcessTestingExplanations = req.body.SCOpsProcessTestingExplanations;
							doc[0].SCProcessTestingFocusItems = req.body.SCProcessTestingFocusItems;
							break;
						case "Account":
						    //---Rating Summary Tab---//
							doc[0].RatingSummary = req.body.RatingSummary;
							doc[0].Highlight = req.body.Highlight;
							doc[0].FocusArea = req.body.FocusArea;
							//---Basics of Control Tab---//
							doc[0].BoCResponse1 = req.body.BoCResponse1;
							doc[0].BoCResponse2 = req.body.BoCResponse2;
							doc[0].BoCResponse3 = req.body.BoCResponse3;
							doc[0].BoCResponse4 = req.body.BoCResponse4;
							doc[0].BoCResponse5 = req.body.BoCResponse5;
							doc[0].BoCTargetCloseDate1 = req.body.BoCTargetCloseDate1;
							doc[0].BoCTargetCloseDate2 = req.body.BoCTargetCloseDate2;
							doc[0].BoCTargetCloseDate3 = req.body.BoCTargetCloseDate3;
							doc[0].BoCTargetCloseDate4 = req.body.BoCTargetCloseDate4;
							doc[0].BoCTargetCloseDate5 = req.body.BoCTargetCloseDate5;
							doc[0].BoCComments1 = req.body.BoCComments1;
							doc[0].BoCComments2 = req.body.BoCComments2;
							doc[0].BoCComments3 = req.body.BoCComments3;
							doc[0].BoCComments4 = req.body.BoCComments4;
							doc[0].BoCComments5 = req.body.BoCComments5;
							doc[0].BOCExceptionCount = req.body.BOCExceptionCount;

							//---Audit Readiness Assessment Tab---//
							if (req.session.businessunit == "GTS") {
								doc[0].ARALLResponse = req.body.ARALLResponse;
								doc[0].ARALLQtrRating = req.body.ARALLQtrRating;
								doc[0].ARALLTarget2Sat = req.body.ARALLTarget2Sat;
								doc[0].ARALLExplanation = req.body.ARALLExplanation;
							}
							//---Operational Metrics Tab Tab---//
							// OMKID4 - metric key ID for Delivery in GTS
							if (req.body.opmetrickey == "OMKID4" && req.session.businessunit == "GTS") {
								doc[0].OtherMetricRating = req.body.OtherMetricRating;
								doc[0].OtherMetricDate = req.body.OtherMetricDate;
								doc[0].OtherMetricComment = req.body.OtherMetricComment;
								doc[0].OtherMetricRatingCat1 = req.body.OtherMetricRatingCat1;
								doc[0].OtherMetricCommentCat1 = req.body.OtherMetricCommentCat1;
								doc[0].OtherMetricRatingCat2 = req.body.OtherMetricRatingCat2;
								doc[0].OtherMetricCommentCat2 = req.body.OtherMetricCommentCat2;
								doc[0].OtherMetricRatingCat3 = req.body.OtherMetricRatingCat3;
								doc[0].OtherMetricCommentCat3 = req.body.OtherMetricCommentCat3;
								doc[0].OtherMetricRatingCat4 = req.body.OtherMetricRatingCat4;
								doc[0].OtherMetricCommentCat4 = req.body.OtherMetricCommentCat4;
								doc[0].OtherMetricRatingCat5 = req.body.OtherMetricRatingCat5;
								doc[0].OtherMetricCommentCat5 = req.body.OtherMetricCommentCat5;
								doc[0].OtherMetricRatingCat6 = req.body.OtherMetricRatingCat6;
								doc[0].OtherMetricCommentCat6 = req.body.OtherMetricCommentCat6;
								doc[0].OtherMetricRatingCat7 = req.body.OtherMetricRatingCat7;
								doc[0].OtherMetricCommentCat7 = req.body.OtherMetricCommentCat7;
								doc[0].OtherMetricRatingCat8 = req.body.OtherMetricRatingCat8;
								doc[0].OtherMetricCommentCat8 = req.body.OtherMetricCommentCat8;
								doc[0].OtherMetricRatingCat9 = req.body.OtherMetricRatingCat9;
								doc[0].OtherMetricCommentCat9 = req.body.OtherMetricCommentCat9;
								doc[0].OtherMetricRatingCat10 = req.body.OtherMetricRatingCat10;
								doc[0].OtherMetricCommentCat10 = req.body.OtherMetricCommentCat10;
								doc[0].OtherMetricRatingCat11 = req.body.OtherMetricRatingCat11;
								doc[0].OtherMetricCommentCat11 = req.body.OtherMetricCommentCat11;
								doc[0].OtherMetricRatingCat12 = req.body.OtherMetricRatingCat12;
								doc[0].OtherMetricCommentCat12 = req.body.OtherMetricCommentCat12;
								doc[0].OtherMetricRatingCat13 = req.body.OtherMetricRatingCat13;
								doc[0].OtherMetricCommentCat13 = req.body.OtherMetricCommentCat13;
							} else {
								var metricsID = req.body.opMetricIDs.split(",");
								var tname, topush;
								doc[0].OpMetric = [];
								for (var i = 0; i < metricsID.length; ++i) {
									if(metricsID[i] != undefined && metricsID[i] != "") {
										topush = {
											"id": metricsID[i]
										};
										doc[0].OpMetric.push(topush);
										fname = metricsID[i]+"Name";
										doc[0].OpMetric[i].name = req.body[fname];
										fname = metricsID[i]+"Rating";
										doc[0].OpMetric[i].rating = req.body[fname];
										fname = metricsID[i]+"TargetSatDate";
										doc[0].OpMetric[i].targetsatdate = req.body[fname];
										fname = metricsID[i]+"Finding";
										doc[0].OpMetric[i].finding = req.body[fname];
										fname = metricsID[i]+"Action";
										doc[0].OpMetric[i].action = req.body[fname];
									}
								}
							}

							//---Others Tab Tab---//
							doc[0].AsmtOtherConsiderations = req.body.AsmtOtherConsiderations;
							//---Account Ratings Tab (For Portfolio CU only)---//
							if (doc[0].ParentDocSubType == "Controllable Unit" && doc[0].Portfolio == "Yes") {
								doc[0].CUFocusItems = req.body.CUFocusItems;
							}
							//---Backend Fields---//
							doc[0].RatingCategory = fieldCalc.getRatingCategory(doc[0].PeriodRating,doc[0].PeriodRatingPrev1);
							doc[0].CUWWBCITKey = pdoc[0].WWBCITKey;
							break;
					}
					doc[0].Notes = req.body.Notes;
					doc[0].Links = eval(req.body.attachIDs);
					doc[0].Log = [];
					doc[0].Log.push(addlog);
					doc[0].Status = req.body.Status;
					db.save(doc[0]).then(function(data){
						deferred.resolve({"status": 200, "id": data.body.id, "parentid": doc[0].parentid});
					}).catch(function(err) {
						console.log("[assessment][saveAsmt][save]" + err.error.reason);
						deferred.reject({"status": 500, "error": err.error.reason});
					});

				}).catch(function(err) {
					console.log("[assessment][saveAsmt][getID]" + err.error);
					deferred.reject({"status": 500, "error": err.error.reason});
				});

			}
			else { // existing assessment document
				var obj = {
					selector:{
						"_id": docid,
					}
				};
				db.get(docid).then(function(data){
					var doc = [];
					doc.push(data.body);
					//---Basics Section---//
					if (doc[0].PrevRatingUpdate != req.body.PeriodRating) {
						doc[0].RatingChangeWho = curruser;
						doc[0].RatingChangeWhen = currdate;
						doc[0].PrevRatingUpdate = doc[0].PeriodRating;
						doc[0].PeriodRating = req.body.PeriodRating;
					}
					if ( doc[0].PeriodRating  ==  "Sat") {
						doc[0].ReviewComments = "";
						doc[0].Target2Sat = "";
					} else {
						doc[0].ReviewComments = req.body.ReviewComments;
						doc[0].Target2Sat = req.body.Target2Sat;
					}
					if ( doc[0].MIRAStatus != req.body.MIRAStatus ) {
						doc[0].MIRAStatusChangeWho = curruser;
						doc[0].MIRAStatusChangeWhen = currdate;
					}
					doc[0].MIRARatingJustification = req.body.MIRARatingJustification;
					doc[0].MIRAStatus = req.body.MIRAStatus;
					doc[0].NextQtrRating = req.body.NextQtrRating;
					doc[0].DecommitExplanation = req.body.DecommitExplanation;

					switch (doc[0].ParentDocSubType) {
						case "Subprocess":
							break;
						case "Global Process":
							//---Summary Tab---//
							doc[0].RatingSummary = req.body.RatingSummary;
							doc[0].Highlight = req.body.Highlight;
							doc[0].FocusArea = req.body.FocusArea;
							doc[0].Insight1 = req.body.Insight1;
							doc[0].Insight2 = req.body.Insight2;
							doc[0].Insight3 = req.body.Insight3;
							doc[0].Insight4 = req.body.Insight4;
							doc[0].Insight5 = req.body.Insight5;
							//---Performance Overview Tab---//
							doc[0].OverallAssessmentComments = req.body.OverallAssessmentComments;
							doc[0].KCFRTestingComments = req.body.KCFRTestingComments;
							doc[0].KCOTestingComments = req.body.KCOTestingComments;
							doc[0].CorpIAComments = req.body.CorpIAComments;
							doc[0].MissedREComments = req.body.MissedREComments;
							doc[0].MissedMSACComments = req.body.MissedMSACComments;
							doc[0].BoCComments = req.body.BoCComments;
							doc[0].PerfOverviewOtherExplanation = req.body.PerfOverviewOtherExplanation;
							doc[0].PerfOverviewCriticaExplanation = req.body.PerfOverviewCriticaExplanation;
							//---Perfromance Overview Tab operational metrics---//
							var metricsID = req.body.opMetricIDs.split(",");
							var tname, topush;
							doc[0].OpMetric = [];
							for (var i = 0; i < metricsID.length; ++i) {
								if(metricsID[i] != undefined && metricsID[i] != "") {
									topush = {
										"id": metricsID[i]
									};
									doc[0].OpMetric.push(topush);
									fname = metricsID[i]+"Name";
									doc[0].OpMetric[i].name = req.body[fname];
									fname = metricsID[i]+"Rating";
									doc[0].OpMetric[i].rating = req.body[fname];
									fname = metricsID[i]+"Comment";
									doc[0].OpMetric[i].action = req.body[fname];
								}
							}
							//---Performance Overview Tab---//
							doc[0].IAExplanations = req.body.IAExplanations;
							doc[0].PRExplanations = req.body.PRExplanations;
							doc[0].ARRExplanations = req.body.ARRExplanations;
							doc[0].AuditFocusText = req.body.AuditFocusText;
							//---Key Controls Testign 1 Tab---//
							doc[0].KCT1Section1Explanations = req.body.KCT1Section1Explanations;
							doc[0].KCT1Section2Explanations = req.body.KCT1Section2Explanations;
							doc[0].KCT1Section3Explanations = req.body.KCT1Section3Explanations;
							//---Key Controls Testign 2 Tab---//
							doc[0].SOXProcessTestingExplanations = req.body.SOXProcessTestingExplanations;
							doc[0].ProcessTestingFocusItems = req.body.ProcessTestingFocusItems;
							//---Open Risks and Missed Commits Tab---//
							doc[0].GCSSection1Explanations = req.body.GCSSection1Explanations;
							doc[0].GCSFocusItems = req.body.GCSFocusItems;
							doc[0].MissedMSACsRptColor = req.body.MissedMSACsRptColor;
							doc[0].MissedIssueRptColor = req.body.MissedIssueRptColor;
							break;
						case "BU Reporting Group":
						case "Business Unit":
						case "BU IOT":
						case "BU IMT":
						case "BU Country":
							//---Summary Tab---//
							doc[0].RatingSummary = req.body.RatingSummary;
							if (doc[0].ParentDocSubType != "BU Country") {
								doc[0].Insight1 = req.body.Insight1;
								doc[0].Insight2 = req.body.Insight2;
								doc[0].Insight3 = req.body.Insight3;
								doc[0].Insight4 = req.body.Insight4;
								doc[0].Insight5 = req.body.Insight5;
							}
							//---Performance Overview Tab---//
							doc[0].OverallAssessmentComments = req.body.OverallAssessmentComments;
							doc[0].KCFRTestingComments = req.body.KCFRTestingComments;
							doc[0].KCOTestingComments = req.body.KCOTestingComments;
							doc[0].CorpIAComments = req.body.CorpIAComments;
							doc[0].MissedREComments = req.body.MissedREComments;
							doc[0].MissedMSACComments = req.body.MissedMSACComments;
							//---Perfromance Overview Tab operational metrics---//
							var metricsID = req.body.opMetricIDs.split(",");
							var tname, topush;
							doc[0].OpMetric = [];
							for (var i = 0; i < metricsID.length; ++i) {
								if(metricsID[i] != undefined && metricsID[i] != "") {
									topush = {
										"id": metricsID[i]
									};
									doc[0].OpMetric.push(topush);
									fname = metricsID[i]+"Name";
									doc[0].OpMetric[i].name = req.body[fname];
									fname = metricsID[i]+"Rating";
									doc[0].OpMetric[i].rating = req.body[fname];
									fname = metricsID[i]+"Comment";
									doc[0].OpMetric[i].action = req.body[fname];
								}
							}
							if (doc[0].MIRABusinessUnit == "GTS") {
								//---Summary Tab---//
								doc[0].HighlightCRM = req.body.HighlightCRM;
								doc[0].FocusAreaCRM = req.body.FocusAreaCRM;
								doc[0].HighlightSOD = req.body.HighlightSOD;
								doc[0].FocusAreaSOD = req.body.FocusAreaSOD;
								//---Perfromance Overview Tab operational metrics CRM---//
								doc[0].PeriodRatingCRM = req.body.PeriodRatingCRM;
								// CRM rich text fields
								doc[0].OverallAssessmentCommentsCRM = req.body.OverallAssessmentCommentsCRM;
								doc[0].KCFRTestingCommentsCRM = req.body.KCFRTestingCommentsCRM;
								doc[0].KCOTestingCommentsCRM = req.body.KCOTestingCommentsCRM;
								doc[0].CorpIACommentsCRM = req.body.CorpIACommentsCRM;
								doc[0].MissedRECommentsCRM = req.body.MissedRECommentsCRM;
								doc[0].MissedMSACCommentsCRM = req.body.MissedMSACCommentsCRM;
								doc[0].BoCCommentsCRM = req.body.BoCCommentsCRM;
								doc[0].PerfOverviewOtherExplanationCRM = req.body.PerfOverviewOtherExplanationCRM;
								doc[0].PerfOverviewCriticaExplanationCRM = req.body.PerfOverviewCriticaExplanationCRM;
								//---Perfromance Overview Tab operational metrics SOD---//
								doc[0].PeriodRatingSOD = req.body.PeriodRatingSOD;
								// SOD rich text fields
								doc[0].OverallAssessmentCommentsSOD = req.body.OverallAssessmentCommentsSOD;
								doc[0].KCFRTestingCommentsSOD = req.body.KCFRTestingCommentsSOD;
								doc[0].KCOTestingCommentsSOD = req.body.KCOTestingCommentsSOD;
								doc[0].CorpIACommentsSOD = req.body.CorpIACommentsSOD;
								doc[0].MissedRECommentsSOD = req.body.MissedRECommentsSOD;
								doc[0].MissedMSACCommentsSOD = req.body.MissedMSACCommentsSOD;
								doc[0].BoCCommentsSOD = req.body.BoCCommentsSOD;
								doc[0].PerfOverviewOtherExplanationSOD = req.body.PerfOverviewOtherExplanationSOD;
								doc[0].PerfOverviewCriticaExplanationSOD = req.body.PerfOverviewCriticaExplanationSOD;
								//---Perfromance Overview Tab operational metrics---//
								var metricsID = req.body.opMetricIDsSOD.split(",");
								var tname, topush;
								doc[0].OpMetricSOD = [];
								for (var i = 0; i < metricsID.length; ++i) {
									if(metricsID[i] != undefined && metricsID[i] != "") {
										topush = {
											"id": metricsID[i]
										};
										doc[0].OpMetricSOD.push(topush);
										fname = metricsID[i]+"NameSOD";
										doc[0].OpMetricSOD[i].name = req.body[fname];
										fname = metricsID[i]+"RatingSOD";
										doc[0].OpMetricSOD[i].rating = req.body[fname];
										fname = metricsID[i]+"CommentSOD";
										doc[0].OpMetricSOD[i].action = req.body[fname];
									}
								}
								//---Open Risks and Missed Commits Tab---//
								doc[0].GCSFocusItems = req.body.GCSFocusItems;
								doc[0].MissedMSACsRptColorCRM = req.body.MissedMSACsRptColorCRM;
								doc[0].MissedIssueRptColorCRM = req.body.MissedIssueRptColorCRM;
								doc[0].MissedMSACsRptColorSOD = req.body.MissedMSACsRptColorSOD;
								doc[0].MissedIssueRptColorSOD = req.body.MissedIssueRptColorSOD;
							} else {
								//---Summary Tab---//
								doc[0].Highlight = req.body.Highlight;
								doc[0].FocusArea = req.body.FocusArea;
								//---Perfromance Overview Tab---//
								doc[0].BoCComments = req.body.BoCComments;
								doc[0].PerfOverviewOtherExplanation = req.body.PerfOverviewOtherExplanation;
								doc[0].PerfOverviewCriticaExplanation = req.body.PerfOverviewCriticaExplanation;
								//---Open Risks and Missed Commits Tab---//
								doc[0].GCSSection1Explanations = req.body.GCSSection1Explanations;
								doc[0].GCSFocusItems = req.body.GCSFocusItems;
								doc[0].MissedMSACsRptColor = req.body.MissedMSACsRptColor;
								doc[0].MissedIssueRptColor = req.body.MissedIssueRptColor;
							}
							//---Audits and Reviews Tab---//
							doc[0].IAExplanations = req.body.IAExplanations;
							doc[0].PRExplanations = req.body.PRExplanations;
							doc[0].ARRExplanations = req.body.ARRExplanations;
							doc[0].AuditFocusText = req.body.AuditFocusText;
							//---CU Ratings Tab---//
							doc[0].CUFocusItems = req.body.CUFocusItems;
							//---Reporting Country Testing Tab---//
							doc[0].SOXProcessTestingExplanations = req.body.SOXProcessTestingExplanations;
							doc[0].OpsProcessTestingExplanations = req.body.OpsProcessTestingExplanations;
							doc[0].ProcessTestingFocusItems = req.body.ProcessTestingFocusItems;

							//---Sampled Country Testing Tab---//
							if (doc[0].ParentDocSubType != "Business Unit") {
								doc[0].SCSOXProcessTestingExplanations = req.body.SCSOXProcessTestingExplanations;
								doc[0].SCOpsProcessTestingExplanations = req.body.SCOpsProcessTestingExplanations;
								doc[0].SCProcessTestingFocusItems = req.body.SCProcessTestingFocusItems;
							}
							break;
						case "Controllable Unit":
						case "Country Process":
							//---Rating Summary Tab---//
							doc[0].RatingSummary = req.body.RatingSummary;
							doc[0].Highlight = req.body.Highlight;
							doc[0].FocusArea = req.body.FocusArea;
							//---Basics of Control Tab---//
							doc[0].BoCResponse1 = req.body.BoCResponse1;
							doc[0].BoCResponse2 = req.body.BoCResponse2;
							doc[0].BoCResponse3 = req.body.BoCResponse3;
							doc[0].BoCResponse4 = req.body.BoCResponse4;
							doc[0].BoCResponse5 = req.body.BoCResponse5;
							doc[0].BoCTargetCloseDate1 = req.body.BoCTargetCloseDate1;
							doc[0].BoCTargetCloseDate2 = req.body.BoCTargetCloseDate2;
							doc[0].BoCTargetCloseDate3 = req.body.BoCTargetCloseDate3;
							doc[0].BoCTargetCloseDate4 = req.body.BoCTargetCloseDate4;
							doc[0].BoCTargetCloseDate5 = req.body.BoCTargetCloseDate5;
							doc[0].BoCComments1 = req.body.BoCComments1;
							doc[0].BoCComments2 = req.body.BoCComments2;
							doc[0].BoCComments3 = req.body.BoCComments3;
							doc[0].BoCComments4 = req.body.BoCComments4;
							doc[0].BoCComments5 = req.body.BoCComments5;
							doc[0].BOCExceptionCount = req.body.BOCExceptionCount;
							//---Audit Readiness Assessment Tab---//
							if (doc[0].MIRABusinessUnit == "GTS") {
								doc[0].ARALLResponse = req.body.ARALLResponse;
								doc[0].ARALLQtrRating = req.body.ARALLQtrRating;
								doc[0].ARALLTarget2Sat = req.body.ARALLTarget2Sat;
								doc[0].ARALLExplanation = req.body.ARALLExplanation;
							}
							//---Operational Metrics Tab Tab---//
							if (req.body.opmetrickey == "OMKID4" && doc[0].MIRABusinessUnit == "GTS") {
								// OMKID4 - metric key ID for Delivery
								doc[0].OtherMetricRating = req.body.OtherMetricRating;
								doc[0].OtherMetricDate = req.body.OtherMetricDate;
								doc[0].OtherMetricComment = req.body.OtherMetricComment;
								doc[0].OtherMetricRatingCat1 = req.body.OtherMetricRatingCat1;
								doc[0].OtherMetricCommentCat1 = req.body.OtherMetricCommentCat1;
								doc[0].OtherMetricRatingCat2 = req.body.OtherMetricRatingCat2;
								doc[0].OtherMetricCommentCat2 = req.body.OtherMetricCommentCat2;
								doc[0].OtherMetricRatingCat3 = req.body.OtherMetricRatingCat3;
								doc[0].OtherMetricCommentCat3 = req.body.OtherMetricCommentCat3;
								doc[0].OtherMetricRatingCat4 = req.body.OtherMetricRatingCat4;
								doc[0].OtherMetricCommentCat4 = req.body.OtherMetricCommentCat4;
								doc[0].OtherMetricRatingCat5 = req.body.OtherMetricRatingCat5;
								doc[0].OtherMetricCommentCat5 = req.body.OtherMetricCommentCat5;
								doc[0].OtherMetricRatingCat6 = req.body.OtherMetricRatingCat6;
								doc[0].OtherMetricCommentCat6 = req.body.OtherMetricCommentCat6;
								doc[0].OtherMetricRatingCat7 = req.body.OtherMetricRatingCat7;
								doc[0].OtherMetricCommentCat7 = req.body.OtherMetricCommentCat7;
								doc[0].OtherMetricRatingCat8 = req.body.OtherMetricRatingCat8;
								doc[0].OtherMetricCommentCat8 = req.body.OtherMetricCommentCat8;
								doc[0].OtherMetricRatingCat9 = req.body.OtherMetricRatingCat9;
								doc[0].OtherMetricCommentCat9 = req.body.OtherMetricCommentCat9;
								doc[0].OtherMetricRatingCat10 = req.body.OtherMetricRatingCat10;
								doc[0].OtherMetricCommentCat10 = req.body.OtherMetricCommentCat10;
								doc[0].OtherMetricRatingCat11 = req.body.OtherMetricRatingCat11;
								doc[0].OtherMetricCommentCat11 = req.body.OtherMetricCommentCat11;
								doc[0].OtherMetricRatingCat12 = req.body.OtherMetricRatingCat12;
								doc[0].OtherMetricCommentCat12 = req.body.OtherMetricCommentCat12;
								doc[0].OtherMetricRatingCat13 = req.body.OtherMetricRatingCat13;
								doc[0].OtherMetricCommentCat13 = req.body.OtherMetricCommentCat13;
							} else {
								var metricsID = req.body.opMetricIDs.split(",");
								var tname, topush;
								doc[0].OpMetric = [];
								for (var i = 0; i < metricsID.length; ++i) {
									if(metricsID[i] != undefined && metricsID[i] != "") {
										topush = {
											"id": metricsID[i]
										};
										doc[0].OpMetric.push(topush);
										fname = metricsID[i]+"Name";
										doc[0].OpMetric[i].name = req.body[fname];
										fname = metricsID[i]+"Rating";
										doc[0].OpMetric[i].rating = req.body[fname];
										fname = metricsID[i]+"TargetSatDate";
										doc[0].OpMetric[i].targetsatdate = req.body[fname];
										fname = metricsID[i]+"Finding";
										doc[0].OpMetric[i].finding = req.body[fname];
										fname = metricsID[i]+"Action";
										doc[0].OpMetric[i].action = req.body[fname];
									}
								}
							}
							//---Others Tab Tab---//
							doc[0].AsmtOtherConsiderations = req.body.AsmtOtherConsiderations;
							//---Account Ratings Tab (For Portfolio CU only)---//
							if (doc[0].ParentDocSubType == "Controllable Unit" && doc[0].Portfolio == "Yes") {
								doc[0].CUFocusItems = req.body.CUFocusItems;
							}
							//---Backend Fields---//
							doc[0].RatingCategory = fieldCalc.getRatingCategory(doc[0].PeriodRating,doc[0].PeriodRatingPrev1);
							break;
						case "Account":
						    //---Rating Summary Tab---//
							doc[0].RatingSummary = req.body.RatingSummary;
							doc[0].Highlight = req.body.Highlight;
							doc[0].FocusArea = req.body.FocusArea;
							//---Basics of Control Tab---//
							doc[0].BoCResponse1 = req.body.BoCResponse1;
							doc[0].BoCResponse2 = req.body.BoCResponse2;
							doc[0].BoCResponse3 = req.body.BoCResponse3;
							doc[0].BoCResponse4 = req.body.BoCResponse4;
							doc[0].BoCResponse5 = req.body.BoCResponse5;
							doc[0].BoCTargetCloseDate1 = req.body.BoCTargetCloseDate1;
							doc[0].BoCTargetCloseDate2 = req.body.BoCTargetCloseDate2;
							doc[0].BoCTargetCloseDate3 = req.body.BoCTargetCloseDate3;
							doc[0].BoCTargetCloseDate4 = req.body.BoCTargetCloseDate4;
							doc[0].BoCTargetCloseDate5 = req.body.BoCTargetCloseDate5;
							doc[0].BoCComments1 = req.body.BoCComments1;
							doc[0].BoCComments2 = req.body.BoCComments2;
							doc[0].BoCComments3 = req.body.BoCComments3;
							doc[0].BoCComments4 = req.body.BoCComments4;
							doc[0].BoCComments5 = req.body.BoCComments5;
							doc[0].BOCExceptionCount = req.body.BOCExceptionCount;

							//---Audit Readiness Assessment Tab---//
							if (doc[0].MIRABusinessUnit == "GTS") {
								doc[0].ARALLResponse = req.body.ARALLResponse;
								doc[0].ARALLQtrRating = req.body.ARALLQtrRating;
								doc[0].ARALLTarget2Sat = req.body.ARALLTarget2Sat;
								doc[0].ARALLExplanation = req.body.ARALLExplanation;
							}
							//---Operational Metrics Tab Tab---//
							// OMKID4 - metric key ID for Delivery in GTS
							if (req.body.opmetrickey == "OMKID4" && doc[0].MIRABusinessUnit == "GTS") {
								doc[0].OtherMetricRating = req.body.OtherMetricRating;
								doc[0].OtherMetricDate = req.body.OtherMetricDate;
								doc[0].OtherMetricComment = req.body.OtherMetricComment;
								doc[0].OtherMetricRatingCat1 = req.body.OtherMetricRatingCat1;
								doc[0].OtherMetricCommentCat1 = req.body.OtherMetricCommentCat1;
								doc[0].OtherMetricRatingCat2 = req.body.OtherMetricRatingCat2;
								doc[0].OtherMetricCommentCat2 = req.body.OtherMetricCommentCat2;
								doc[0].OtherMetricRatingCat3 = req.body.OtherMetricRatingCat3;
								doc[0].OtherMetricCommentCat3 = req.body.OtherMetricCommentCat3;
								doc[0].OtherMetricRatingCat4 = req.body.OtherMetricRatingCat4;
								doc[0].OtherMetricCommentCat4 = req.body.OtherMetricCommentCat4;
								doc[0].OtherMetricRatingCat5 = req.body.OtherMetricRatingCat5;
								doc[0].OtherMetricCommentCat5 = req.body.OtherMetricCommentCat5;
								doc[0].OtherMetricRatingCat6 = req.body.OtherMetricRatingCat6;
								doc[0].OtherMetricCommentCat6 = req.body.OtherMetricCommentCat6;
								doc[0].OtherMetricRatingCat7 = req.body.OtherMetricRatingCat7;
								doc[0].OtherMetricCommentCat7 = req.body.OtherMetricCommentCat7;
								doc[0].OtherMetricRatingCat8 = req.body.OtherMetricRatingCat8;
								doc[0].OtherMetricCommentCat8 = req.body.OtherMetricCommentCat8;
								doc[0].OtherMetricRatingCat9 = req.body.OtherMetricRatingCat9;
								doc[0].OtherMetricCommentCat9 = req.body.OtherMetricCommentCat9;
								doc[0].OtherMetricRatingCat10 = req.body.OtherMetricRatingCat10;
								doc[0].OtherMetricCommentCat10 = req.body.OtherMetricCommentCat10;
								doc[0].OtherMetricRatingCat11 = req.body.OtherMetricRatingCat11;
								doc[0].OtherMetricCommentCat11 = req.body.OtherMetricCommentCat11;
								doc[0].OtherMetricRatingCat12 = req.body.OtherMetricRatingCat12;
								doc[0].OtherMetricCommentCat12 = req.body.OtherMetricCommentCat12;
								doc[0].OtherMetricRatingCat13 = req.body.OtherMetricRatingCat13;
								doc[0].OtherMetricCommentCat13 = req.body.OtherMetricCommentCat13;
							} else {
								var metricsID = req.body.opMetricIDs.split(",");
								var tname, topush;
								doc[0].OpMetric = [];
								for (var i = 0; i < metricsID.length; ++i) {
									if(metricsID[i] != undefined && metricsID[i] != "") {
										topush = {
											"id": metricsID[i]
										};
										doc[0].OpMetric.push(topush);
										fname = metricsID[i]+"Name";
										doc[0].OpMetric[i].name = req.body[fname];
										fname = metricsID[i]+"Rating";
										doc[0].OpMetric[i].rating = req.body[fname];
										fname = metricsID[i]+"TargetSatDate";
										doc[0].OpMetric[i].targetsatdate = req.body[fname];
										fname = metricsID[i]+"Finding";
										doc[0].OpMetric[i].finding = req.body[fname];
										fname = metricsID[i]+"Action";
										doc[0].OpMetric[i].action = req.body[fname];
									}
								}
							}

							//---Others Tab Tab---//
							doc[0].AsmtOtherConsiderations = req.body.AsmtOtherConsiderations;
							//---Account Ratings Tab (For Portfolio CU only)---//
							if (doc[0].ParentDocSubType == "Controllable Unit" && doc[0].Portfolio == "Yes") {
								doc[0].CUFocusItems = req.body.CUFocusItems;
							}
							//---Backend Fields---//
							doc[0].RatingCategory = fieldCalc.getRatingCategory(doc[0].PeriodRating,doc[0].PeriodRatingPrev1);
							break;
						case "BU Reporting Group":
							break;
					}
					//---Miscellaneous---//
					doc[0].Notes = req.body.Notes;
					doc[0].Links = eval(req.body.attachIDs);
					if (doc[0].Log == undefined || doc[0].Log == "") {
						doc[0].Log = [];
					}
					doc[0].Log.push(addlog);

					// Change to mergesave
					doc[0].fieldslist = req.body.fieldslist;
					db.mergesave(global.doc1, doc[0]).then(function(data){
						if(data.status==999) {
							deferred.resolve({"status": 999, "id": data.id, "parentid": doc[0].parentid, "userdoc": data.body, "conflictfields":data.conflictfields});
						} else {
							deferred.resolve({"status": 200, "id": data.body.id, "parentid": doc[0].parentid});
						}
					}).catch(function(err) {
						console.log("[assessment][saveAsmt][mergesave]" + err.error.reason);
						deferred.reject({"status": 500, "error": err.error.reason});
					});
				}).catch(function(err) {
					console.log("[assessment][saveAsmt][getID]" + err.error.reason);
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}
		}catch(e){
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	}

};

module.exports = assessment;
