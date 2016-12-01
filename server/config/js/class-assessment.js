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
var util = require('./class-utility.js');

var assessment = {

	/* Get assessment by ID */
	getAsmtbyID: function(req, db) {
		var deferred = q.defer();
		var docid = req.query.id

		db.get(docid).then(function(data){
			var doc = [];
			doc.push(data.body);
			/* Format Links */
			doc[0].Links = JSON.stringify(doc[0].Links);
			doc[0].EnteredBU = req.session.businessunit;
			fieldCalc.getDocParams(req, db, doc).then(function(data){
				doc[0].PrevQtrs = [];
				doc[0].PrevQtrs = fieldCalc.getPrev4Qtrs(doc[0].CurrentPeriod);

				// get parent assessable unit document
				db.get(doc[0].parentid).then(function(pdata){
					var parentdoc = [];
					parentdoc.push(pdata.body);
					/* Get access and roles */
					var editors = parentdoc[0].AdditionalEditors + parentdoc[0].Owner + parentdoc[0].Focals;
					accessrules.getRules(req,editors);
					doc[0].editor = accessrules.rules.editor;
					doc[0].admin = accessrules.rules.admin;
					doc[0].resetstatus = accessrules.rules.resetstatus;

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
							doc[0].InternalAuditData = fieldCalc.addTestViewData(9,3);
							doc[0].PPRData = fieldCalc.addTestViewData(12,3);
							doc[0].OtherAuditsData = doc[0].InternalAuditData;
							doc[0].KCTest1Data = fieldCalc.addTestViewData(7,3);
							doc[0].KCTest2Data = fieldCalc.addTestViewData(9,3);
							doc[0].KCTest3Data = fieldCalc.addTestViewData(10,3);
							doc[0].KC2Test1Data = fieldCalc.addTestViewData(4,3);
							doc[0].KC2Test2Data = fieldCalc.addTestViewData(8,3);
							doc[0].KC2Test3Data = fieldCalc.addTestViewData(10,3);
							doc[0].RiskView1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RiskView2Data = fieldCalc.addTestViewData(13,3);
							doc[0].AUData = fieldCalc.addTestViewData(17,10);
							doc[0].CPAsmtDataOIview = [];
							doc[0].CPAsmtDataPIview = [];
							doc[0].CPAsmtDataPR1view = [];
							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].CPAsmtDataPIview.length < 3) {
									if (doc[0].CPAsmtDataPIview.length == 0) {
										doc[0].CPAsmtDataPIview = fieldCalc.addTestViewData(10,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].CPAsmtDataPIview,10,(3-doc[0].CPAsmtDataPIview.length));
									}
								}
								if (doc[0].CPAsmtDataOIview.length < 3) {
									if (doc[0].CPAsmtDataOIview.length == 0) {
										doc[0].CPAsmtDataOIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].CPAsmtDataOIview,8,(3-doc[0].CPAsmtDataOIview.length));
									}
								}
								if (doc[0].CPAsmtDataPR1view.length < 3) {
									if (doc[0].CPAsmtDataPR1view.length == 0) {
										doc[0].CPAsmtDataPR1view = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].CPAsmtDataPR1view,8,(3-doc[0].CPAsmtDataPR1view.length));
									}
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								deferred.reject({"status": 500, "error": err});
							});
							break;
						case "BU Reporting Group":
							if (doc[0].EnteredBU == "GTS") {
								doc[0].PPRData = fieldCalc.addTestViewData(13,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(16,3);
								doc[0].RiskView3Data = fieldCalc.addTestViewData(13,3);
							} else {
								doc[0].PPRData = fieldCalc.addTestViewData(12,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(13,3);
							}
							doc[0].InternalAuditData = fieldCalc.addTestViewData(10,3);
							doc[0].AUData = fieldCalc.addTestViewData(17,5);
							doc[0].AUData2 = fieldCalc.addTestViewData(19,5);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,3);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,3);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];
							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].BUCAsmtDataPRview.length < 3) {
									if (doc[0].BUCAsmtDataPRview.length == 0) {
										doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataCURview.length < 3) {
									if (doc[0].BUCAsmtDataCURview.length == 0) {
										doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(3-doc[0].BUCAsmtDataCURview.length));
									}
								}
								if (doc[0].BUCAsmtDataPIview.length < 3) {
									if (doc[0].BUCAsmtDataPIview.length == 0) {
										doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(3-doc[0].BUCAsmtDataPIview.length));
									}
								}
								if (doc[0].BUCAsmtDataOIview.length < 3) {
									if (doc[0].BUCAsmtDataOIview.length == 0) {
										doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(3-doc[0].BUCAsmtDataOIview.length));
									}
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								deferred.reject({"status": 500, "error": err});
							});
							break;
						case "Business Unit":
							if (doc[0].EnteredBU == "GTS") {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(10,3);
								doc[0].PPRData = fieldCalc.addTestViewData(13,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(16,3);
								doc[0].RiskView3Data = fieldCalc.addTestViewData(13,3);
								doc[0].AUData2 = fieldCalc.addTestViewData(18,10);
								doc[0].AUData3 = fieldCalc.addTestViewData(19,10);
							} else {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(9,3);
								doc[0].PPRData = fieldCalc.addTestViewData(12,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(13,3);
							}
							doc[0].AUData = fieldCalc.addTestViewData(17,10);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,3);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,3);
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];

							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].BUCAsmtDataPRview.length < 3) {
									if (doc[0].BUCAsmtDataPRview.length == 0) {
										doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataCURview.length < 3) {
									if (doc[0].BUCAsmtDataCURview.length == 0) {
										doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(3-doc[0].BUCAsmtDataCURview.length));
									}
								}
								if (doc[0].BUCAsmtDataPIview.length < 3) {
									if (doc[0].BUCAsmtDataPIview.length == 0) {
										doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(3-doc[0].BUCAsmtDataPIview.length));
									}
								}
								if (doc[0].BUCAsmtDataOIview.length < 3) {
									if (doc[0].BUCAsmtDataOIview.length == 0) {
										doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(3-doc[0].BUCAsmtDataOIview.length));
									}
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								deferred.reject({"status": 500, "error": err});
							});
							break;
						case "BU IOT":
							if (doc[0].EnteredBU == "GTS") {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(10,3);
								doc[0].PPRData = fieldCalc.addTestViewData(13,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(15,3);
							} else {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(9,3);
								doc[0].PPRData = fieldCalc.addTestViewData(12,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(13,3);
							}
							doc[0].AUData = fieldCalc.addTestViewData(17,10);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,3);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,3);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];

							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].BUCAsmtDataPRview.length < 3) {
									if (doc[0].BUCAsmtDataPRview.length == 0) {
										doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataCURview.length < 3) {
									if (doc[0].BUCAsmtDataCURview.length == 0) {
										doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(3-doc[0].BUCAsmtDataCURview.length));
									}
								}
								if (doc[0].BUCAsmtDataPIview.length < 3) {
									if (doc[0].BUCAsmtDataPIview.length == 0) {
										doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(3-doc[0].BUCAsmtDataPIview.length));
									}
								}
								if (doc[0].BUCAsmtDataOIview.length < 3) {
									if (doc[0].BUCAsmtDataOIview.length == 0) {
										doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(3-doc[0].BUCAsmtDataOIview.length));
									}
								}
								doc[0].IOT = util.resolveGeo(doc[0].IOT, "IOT",req);
								doc[0].Name = req.session.buname + " - " + doc[0].IOT;
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								deferred.reject({"status": 500, "error": err});
							});
							break;
						case "BU IMT":
							if (doc[0].EnteredBU == "GTS") {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(9,3);
								doc[0].PPRData = fieldCalc.addTestViewData(12,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(14,3);
							} else {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(9,3);
								doc[0].PPRData = fieldCalc.addTestViewData(12,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(12,3);
							}
							doc[0].AUData = fieldCalc.addTestViewData(17,10);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,3);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,3);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];

							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].BUCAsmtDataPRview.length < 3) {
									if (doc[0].BUCAsmtDataPRview.length == 0) {
										doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataCURview.length < 3) {
									if (doc[0].BUCAsmtDataCURview.length == 0) {
										doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(3-doc[0].BUCAsmtDataCURview.length));
									}
								}
								if (doc[0].BUCAsmtDataPIview.length < 3) {
									if (doc[0].BUCAsmtDataPIview.length == 0) {
										doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(3-doc[0].BUCAsmtDataPIview.length));
									}
								}
								if (doc[0].BUCAsmtDataOIview.length < 3) {
									if (doc[0].BUCAsmtDataOIview.length == 0) {
										doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(3-doc[0].BUCAsmtDataOIview.length));
									}
								}
								doc[0].BUIOT = req.session.buname + " - " + util.resolveGeo(doc[0].IOT,"IOT",req);
								doc[0].IMT = util.resolveGeo(doc[0].IMT,"IMT",req);
								doc[0].Name = req.session.buname + " - " + doc[0].IMT;
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								deferred.reject({"status": 500, "error": err});
							});
							break;
						case "BU Country":
							if (doc[0].EnteredBU == "GTS") {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(9,3);
								doc[0].PPRData = fieldCalc.addTestViewData(12,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(14,3);
							} else {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(8,3);
								doc[0].PPRData = fieldCalc.addTestViewData(11,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(11,3);
							}
							doc[0].AUData = fieldCalc.addTestViewData(17,5);
							doc[0].AUData2 = fieldCalc.addTestViewData(19,5);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,3);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,3);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];

							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].BUCAsmtDataPRview.length < 3) {
									if (doc[0].BUCAsmtDataPRview.length == 0) {
										doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataCURview.length < 3) {
									if (doc[0].BUCAsmtDataCURview.length == 0) {
										doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(3-doc[0].BUCAsmtDataCURview.length));
									}
								}
								if (doc[0].BUCAsmtDataPIview.length < 3) {
									if (doc[0].BUCAsmtDataPIview.length == 0) {
										doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(3-doc[0].BUCAsmtDataPIview.length));
									}
								}
								if (doc[0].BUCAsmtDataOIview.length < 3) {
									if (doc[0].BUCAsmtDataOIview.length == 0) {
										doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(3-doc[0].BUCAsmtDataOIview.length));
									}
								}
								doc[0].BUIMT = req.session.buname + " - " + util.resolveGeo(doc[0].IMT,"IMT",req);
								doc[0].Country = util.resolveGeo(doc[0].Country,"Country",req);
								doc[0].Name = req.session.buname + " - " + doc[0].Country;
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								deferred.reject({"status": 500, "error": err});
							});
							break;
						case "Controllable Unit":
							if (parentdoc[0].ParentDocSubType == "BU Country") {
								doc[0].hybrid = "No";
							} else {
								doc[0].hybrid = "Yes";
							}
							doc[0].Portfolio =  parentdoc[0].Portfolio;
							doc[0].ALLData = fieldCalc.addTestViewData(6,3);
							doc[0].ARCData = fieldCalc.addTestViewData(4,3);
							doc[0].RiskData = fieldCalc.addTestViewData(11,3);
							doc[0].AuditTrustedData = doc[0].RiskData;
							doc[0].AuditTrustedRCUData = fieldCalc.addTestViewData(10,3);
							doc[0].AuditLocalData = fieldCalc.addTestViewData(8,3);
							doc[0].DRData = fieldCalc.addTestViewData(5,1);
							doc[0].RCTestData = fieldCalc.addTestViewData(7,3);
							doc[0].SCTestData = doc[0].RCTestData;
							doc[0].RCTestData = fieldCalc.addTestViewData(7,3);
							doc[0].SampleData = doc[0].RiskData;
							doc[0].EAData = doc[0].ARCData;
							doc[0].AccountData = doc[0].RiskData;
							doc[0].CUAsmtDataPR1view = [];
							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].CUAsmtDataPR1view.length < 3) {
									if (doc[0].CUAsmtDataPR1view.length == 0) {
										doc[0].CUAsmtDataPR1view = fieldCalc.addTestViewData(9,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].CUAsmtDataPR1view,9,(3-doc[0].CUAsmtDataPR1view.length));
									}
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								deferred.reject({"status": 500, "error": err});
							});
							break;
						case "Country Process":
							doc[0].ALLData = fieldCalc.addTestViewData(6,3);
							doc[0].ARCData = fieldCalc.addTestViewData(4,3);
							doc[0].RiskData = fieldCalc.addTestViewData(11,3);
							doc[0].AuditTrustedData = doc[0].RiskData;
							doc[0].AuditTrustedRCUData = fieldCalc.addTestViewData(10,3);
							doc[0].AuditLocalData = fieldCalc.addTestViewData(8,3);
							doc[0].DRData = fieldCalc.addTestViewData(5,1);
							doc[0].RCTestData = fieldCalc.addTestViewData(7,3);
							doc[0].SCTestData = doc[0].RCTestData;
							doc[0].RCTestData = fieldCalc.addTestViewData(7,3);
							doc[0].SampleData = doc[0].RiskData;
							doc[0].EAData = doc[0].ARCData;
							deferred.resolve({"status": 200, "doc": doc});
							break;
						case "Account":
							doc[0].ALLData = fieldCalc.addTestViewData(7,3);
							doc[0].ARCData = fieldCalc.addTestViewData(4,3);
							doc[0].RiskData = fieldCalc.addTestViewData(11,3);
							doc[0].AuditTrustedData = doc[0].RiskData;
							doc[0].AuditTrustedRCUData = fieldCalc.addTestViewData(9,3);
							doc[0].AuditLocalData = fieldCalc.addTestViewData(8,3);
							doc[0].DRData = fieldCalc.addTestViewData(5,1);
							doc[0].RCTestData = fieldCalc.addTestViewData(9,3);
							doc[0].SCTestData = doc[0].RCTestData;
							doc[0].RCTestData = fieldCalc.addTestViewData(9,3);
							doc[0].SampleData = doc[0].RiskData;
							doc[0].EAData = doc[0].ARCData;
							doc[0].AccountData = doc[0].RiskData;
							deferred.resolve({"status": 200, "doc": doc});
							break;
						default:
							deferred.resolve({"status": 200, "doc": doc});
					}
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err});
				});

			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err});
			});

		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},

	/* New assessment by parent ID */
	newAsmtByPID: function(req, db) {
		var deferred = q.defer();
		try{
			var pid = req.query.pid
			db.get(pid).then(function(data){
				var pdoc = [];
				var doc = [];
				pdoc.push(data.body);

				/* Get access and roles */
				var peditors = pdoc[0].AdditionalEditors + pdoc[0].Owner + pdoc[0].Focals;
				accessrules.getRules(req,peditors);
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
					doc[0].EnteredBU = req.session.businessunit;

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
								console.log("[assessableunit][AccountLists][NewAccount]" + resdata.error);
								deferred.reject({"status": 500, "error": err.error.reason});
							});
							break;
						case "BU Reporting Group":
							if (doc[0].EnteredBU == "GTS") {
								doc[0].PeriodRatingSOD = "NR";
								doc[0].PeriodRatingCRM = "NR";
								doc[0].PPRData = fieldCalc.addTestViewData(13,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(16,3);
								doc[0].RiskView3Data = fieldCalc.addTestViewData(13,3);
							} else {
								doc[0].PPRData = fieldCalc.addTestViewData(12,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(13,3);
							}
							doc[0].InternalAuditData = fieldCalc.addTestViewData(10,3);
							doc[0].AUData = fieldCalc.addTestViewData(17,5);
							doc[0].AUData2 = fieldCalc.addTestViewData(19,5);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,3);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,3);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];
							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].BUCAsmtDataPRview.length < 3) {
									if (doc[0].BUCAsmtDataPRview.length == 0) {
										doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataCURview.length < 3) {
									if (doc[0].BUCAsmtDataCURview.length == 0) {
										doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataPIview.length < 3) {
									if (doc[0].BUCAsmtDataPIview.length == 0) {
										doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(3-doc[0].BUCAsmtDataPIview.length));
									}
								}
								if (doc[0].BUCAsmtDataOIview.length < 3) {
									if (doc[0].BUCAsmtDataOIview.length == 0) {
										doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(3-doc[0].BUCAsmtDataOIview.length));
									}
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								deferred.reject({"status": 500, "error": err});
							});
							break;
						case "BU IOT":
							doc[0].IOT = pdoc[0].IOT;
							if (doc[0].EnteredBU == "GTS") {
								doc[0].PeriodRatingSOD = "NR";
								doc[0].PeriodRatingCRM = "NR";
								doc[0].InternalAuditData = fieldCalc.addTestViewData(9,3);
								doc[0].PPRData = fieldCalc.addTestViewData(12,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(14,3);
								doc[0].RiskView3Data = fieldCalc.addTestViewData(13,3);
							} else {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(9,3);
								doc[0].PPRData = fieldCalc.addTestViewData(12,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(13,3);
							}
							doc[0].AUData = fieldCalc.addTestViewData(17,10);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,3);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,3);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];
							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].BUCAsmtDataPRview.length < 3) {
									if (doc[0].BUCAsmtDataPRview.length == 0) {
										doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataCURview.length < 3) {
									if (doc[0].BUCAsmtDataCURview.length == 0) {
										doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataPIview.length < 3) {
									if (doc[0].BUCAsmtDataPIview.length == 0) {
										doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(3-doc[0].BUCAsmtDataPIview.length));
									}
								}
								if (doc[0].BUCAsmtDataOIview.length < 3) {
									if (doc[0].BUCAsmtDataOIview.length == 0) {
										doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(3-doc[0].BUCAsmtDataOIview.length));
									}
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								deferred.reject({"status": 500, "error": err});
							});
							break;
						case "BU IMT":
							doc[0].IOT = pdoc[0].IOT;
							doc[0].IMT = pdoc[0].IMT;
							doc[0].BUIOT = req.session.buname + " - " + util.resolveGeo(doc[0].IOT,"IOT",req);
							if (doc[0].EnteredBU == "GTS") {
								doc[0].PeriodRatingSOD = "NR";
								doc[0].PeriodRatingCRM = "NR";
								doc[0].InternalAuditData = fieldCalc.addTestViewData(9,3);
								doc[0].PPRData = fieldCalc.addTestViewData(12,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(14,3);
								doc[0].RiskView3Data = fieldCalc.addTestViewData(13,3);
							} else {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(9,3);
								doc[0].PPRData = fieldCalc.addTestViewData(12,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(11,3);
							}
							doc[0].AUData = fieldCalc.addTestViewData(17,10);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,3);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,3);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];
							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].BUCAsmtDataPRview.length < 3) {
									if (doc[0].BUCAsmtDataPRview.length == 0) {
										doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataCURview.length < 3) {
									if (doc[0].BUCAsmtDataCURview.length == 0) {
										doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataPIview.length < 3) {
									if (doc[0].BUCAsmtDataPIview.length == 0) {
										doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(3-doc[0].BUCAsmtDataPIview.length));
									}
								}
								if (doc[0].BUCAsmtDataOIview.length < 3) {
									if (doc[0].BUCAsmtDataOIview.length == 0) {
										doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(3-doc[0].BUCAsmtDataOIview.length));
									}
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								deferred.reject({"status": 500, "error": err});
							});
							break;
						case "BU Country":
							doc[0].IOT = pdoc[0].IOT;
							doc[0].IMT = pdoc[0].IMT;
							doc[0].Country = pdoc[0].Country;
							doc[0].BUIMT = req.session.buname + " - " + util.resolveGeo(doc[0].IMT,"IMT",req);
							if (doc[0].EnteredBU == "GTS") {
								doc[0].PeriodRatingSOD = "NR";
								doc[0].PeriodRatingCRM = "NR";
								doc[0].InternalAuditData = fieldCalc.addTestViewData(9,3);
								doc[0].PPRData = fieldCalc.addTestViewData(12,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(6,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(14,3);
								doc[0].RiskView3Data = fieldCalc.addTestViewData(13,3);
							} else {
								doc[0].InternalAuditData = fieldCalc.addTestViewData(8,3);
								doc[0].PPRData = fieldCalc.addTestViewData(11,3);
								doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,3);
								doc[0].RiskView1Data = fieldCalc.addTestViewData(5,3);
								doc[0].RiskView2Data = fieldCalc.addTestViewData(11,3);
							}
							doc[0].AUData = fieldCalc.addTestViewData(17,5);
							doc[0].AUData2 = fieldCalc.addTestViewData(19,5);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,3);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,3);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];
							fieldCalc.getAssessments(db, doc, req).then(function(data){
								fieldCalc.getRatingProfile(doc);
								if (doc[0].BUCAsmtDataPRview.length < 3) {
									if (doc[0].BUCAsmtDataPRview.length == 0) {
										doc[0].BUCAsmtDataPRview = fieldCalc.addTestViewData(10,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPRview,10,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataCURview.length < 3) {
									if (doc[0].BUCAsmtDataCURview.length == 0) {
										doc[0].BUCAsmtDataCURview = fieldCalc.addTestViewData(14,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataCURview,14,(3-doc[0].BUCAsmtDataPRview.length));
									}
								}
								if (doc[0].BUCAsmtDataPIview.length < 3) {
									if (doc[0].BUCAsmtDataPIview.length == 0) {
										doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(3-doc[0].BUCAsmtDataPIview.length));
									}
								}
								if (doc[0].BUCAsmtDataOIview.length < 3) {
									if (doc[0].BUCAsmtDataOIview.length == 0) {
										doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,3);
									} else {
										fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(3-doc[0].BUCAsmtDataOIview.length));
									}
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								deferred.reject({"status": 500, "error": err});
							});
							break;
						default:
							deferred.resolve({"status": 200, "doc": doc});
							break;
					}
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});

				} else {
					deferred.reject({"status": 500, "error": "Access denied!"});
				}
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
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
						"parentid": pdoc[0]._id,
						"ParentDocSubType": req.body.parentdocsubtype,
						"AUStatus": pdoc[0].Status,
						"AssessableUnitName": pdoc[0].Name,
						"BusinessUnit": pdoc[0].BusinessUnit,
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
							doc[0].SCSOXProcessTestingExplanations = req.body.SCSOXProcessTestingExplanations;
							doc[0].SCOpsProcessTestingExplanations = req.body.SCOpsProcessTestingExplanations;
							doc[0].SCProcessTestingFocusItems = req.body.SCProcessTestingFocusItems;
							break;
						case "Account":
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
						deferred.reject({"status": 500, "error": err.error.reason});
					});

				}).catch(function(err) {
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
							if (req.body.CatCU == "Delivery") {
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
							}
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
							if (req.session.businessunit == "GTS") {
								doc[0].ARALLResponse = req.body.ARALLResponse;
								doc[0].ARALLQtrRating = req.body.ARALLQtrRating;
								doc[0].ARALLTarget2Sat = req.body.ARALLTarget2Sat;
								doc[0].ARALLExplanation = req.body.ARALLExplanation;
							} else {
								//---Operational Metrics Tab Tab---//
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
							if (req.session.businessunit == "GTS") {
								doc[0].ARALLResponse = req.body.ARALLResponse;
								doc[0].ARALLQtrRating = req.body.ARALLQtrRating;
								doc[0].ARALLTarget2Sat = req.body.ARALLTarget2Sat;
								doc[0].ARALLExplanation = req.body.ARALLExplanation;
							}
							//---Operational Metrics Tab Tab---//

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

					db.save(doc[0]).then(function(data){
						deferred.resolve({"status": 200, "id": data.body.id, "parentid": doc[0].parentid});
					}).catch(function(err) {
						deferred.reject({"status": 500, "error": err.error.reason});
					});
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	}

};

module.exports = assessment;
