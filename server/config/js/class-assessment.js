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

var assessment = {

	/* Get assessment by ID */
	getAsmtbyID: function(req, db) {
		var deferred = q.defer();
		var docid = req.query.id

		db.get(docid).then(function(data){
			var doc = [];
			doc.push(data.body);
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
					if (doc[0].MIRAStatus != "Final" || ( (doc[0].WWBCITKey != undefined || doc[0].WWBCITKey != "") && (doc[0].WWBCITStatus == "Pending" || doc[0].WWBCITStatus == "Draft") ) )
						doc[0].RJandT2SEditable = 1;

					if(req.query.edit != undefined && doc[0].editor) { // Edit mode
						doc[0].editmode = 1;
						// check if Rating is editable
						var ratingEditors = parentdoc[0].Owner + parentdoc[0].Focals;
						if(ratingEditors.indexOf("(" + req.session.user.mail + ")") !== -1) {
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
							fieldCalc.getAssessments(db, doc).then(function(data){
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
						case "BU Country":
							doc[0].InternalAuditData = fieldCalc.addTestViewData(8,3);
							doc[0].PPRData = fieldCalc.addTestViewData(11,3);
							doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,3);
							doc[0].AUData = fieldCalc.addTestViewData(17,10);
							doc[0].RiskView1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RiskView2Data = fieldCalc.addTestViewData(11,3);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,3);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,3);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];
							fieldCalc.getAssessments(db, doc).then(function(data){
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
						case "Controllable Unit":
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
							fieldCalc.getAssessments(db, doc).then(function(data){
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
						"CurrentPeriod": pdoc[0].CurrentPeriod,
						"Country": pdoc[0].Country,
						"IMT": pdoc[0].IMT,
						"IOT": pdoc[0].IOT,
						"AllEditors": pdoc[0].AllEditors,
						"AllReaders": pdoc[0].AllReaders,
						"Owner": pdoc[0].Owner,
						"ExcludeGeo": pdoc[0].ExcludeGeo,
						"editmode": 1,
						"RJandT2SEditable": 1,
						"RatingEditable": 1,
						"editor": accessrules.rules.editor,
						"admin": accessrules.rules.admin,
						"resetstatus": accessrules.rules.resetstatus,
					};
					doc.push(tmpdoc);

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
						case "BU IOT":

							doc[0].BUCountryList = [];
							doc[0].ReportingGroupList = [];
							doc[0].IOTList = [];
							doc[0].IOTAUList = [];

							var searchobj = {
								selector:{
									"_id": {"$gt":0},
									"key": "Assessable Unit",
									"Status": "Active",
									$or: [
										{$and:[{$or:[{"DocSubType": "BU Country"},{"DocSubType": "BU IOT"},{"DocSubType": "BU Reporting Group"}]},{"BusinessUnit":doc[0].BusinessUnit}]},
										{"DocSubType": "IOT"}
									]
								}
							};
							doc[0].IOTList.push({"docid":"","name":""});
							db.find(searchobj).then(function(resdata) {
								var resdocs = resdata.body.docs;
								for (var i = 0; i < resdocs.length; ++i) {
									if (resdocs[i].DocSubType == "BU Country") doc[0].BUCountryList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
									if (resdocs[i].DocSubType == "BU Reporting Group") doc[0].ReportingGroupList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
									if (resdocs[i].DocSubType == "IOT") doc[0].IOTList.push({"docid":resdocs[i]._id,"name":resdocs[i].IOT});
									if (resdocs[i].DocSubType == "BU IOT") doc[0].IOTAUList.push({"name":resdocs[i].IOT});
								}
								for (var i = 0; i < doc[0].IOTAUList.length; ++i) {
									util.findAndRemove(doc[0].IOTList,'name',doc[0].IOTAUList[i].IOT)
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								console.log("[assessableunit][IOTLists][NewIOT]" + resdata.error);
								deferred.reject({"status": 500, "error": err.error.reason});
							});
							break;
						case "BU IMT":
							doc[0].IOT = pdoc[0].IOT;
							doc[0].ReportingGroupList = [];
							doc[0].IMTList = [];
							doc[0].IMTAUList = [];

							var searchobj = {
								selector:{
									"_id": {"$gt":0},
									"key": "Assessable Unit",
									"Status": "Active",
									$or: [
										{$and:[{$or:[{"DocSubType": "BU Reporting Group"},{"DocSubType": "BU IMT"}]},{"BusinessUnit":doc[0].BusinessUnit}]},
										{$and:[{"DocSubType": "IMT"},{"IOT":doc[0].IOT}]}
									]
								}
							};
							doc[0].IMTList.push({"docid":"","name":""});
							db.find(searchobj).then(function(resdata) {
								var resdocs = resdata.body.docs;
								for (var i = 0; i < resdocs.length; ++i) {
									if (resdocs[i].DocSubType == "BU Reporting Group") doc[0].ReportingGroupList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
									if (resdocs[i].DocSubType == "IMT") doc[0].IMTList.push({"docid":resdocs[i]._id,"name":resdocs[i].IMT});
									if (resdocs[i].DocSubType == "BU IMT") doc[0].IMTAUList.push({"name":resdocs[i].IMT});
								}
								for (var i = 0; i < doc[0].IMTAUList.length; ++i) {
									util.findAndRemove(doc[0].IMTList,'name',doc[0].IMTAUList[i].IMT)
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								console.log("[assessableunit][IMTLists][NewIMT]" + resdata.error);
								deferred.reject({"status": 500, "error": err.error.reason});
							});
							break;
						case "BU Country":
							doc[0].PrevQtrs = [];
							doc[0].PrevQtrs = fieldCalc.getPrev4Qtrs(doc[0].CurrentPeriod);
							doc[0].InternalAuditData = fieldCalc.addTestViewData(8,3);
							doc[0].PPRData = fieldCalc.addTestViewData(11,3);
							doc[0].OtherAuditsData = fieldCalc.addTestViewData(9,3);
							doc[0].AUData = fieldCalc.addTestViewData(17,10);
							doc[0].RiskView1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RiskView2Data = fieldCalc.addTestViewData(11,3);
							doc[0].RCTest1Data = fieldCalc.addTestViewData(5,3);
							doc[0].RCTest2Data = fieldCalc.addTestViewData(8,3);
							doc[0].RCTest3Data = fieldCalc.addTestViewData(11,3);
							doc[0].SCTest1Data = doc[0].RCTest1Data;
							doc[0].SCTest2Data = doc[0].RCTest3Data;
							doc[0].BUCAsmtDataPRview = [];
							doc[0].BUCAsmtDataCURview = [];
							doc[0].BUCAsmtDataPIview = [];
							doc[0].BUCAsmtDataOIview = [];
							fieldCalc.getAssessments(db, doc).then(function(data){
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
						"AssessableUnitName": pdoc[0].Name,
						"BusinessUnit": pdoc[0].BusinessUnit,
						"CurrentPeriod": pdoc[0].CurrentPeriod,
						"IOT": pdoc[0].IOT,
						"IMT": pdoc[0].IMT,
						"Country": pdoc[0].Country,
						"Owner": pdoc[0].Owner
					};
					doc.push(tmpdoc);

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
						case "BU IOT":
							break;
						case "BU IMT":
							break;
						case "BU Country":
							//---Summary Tab---//
							doc[0].RatingSummary = req.body.RatingSummary;
							doc[0].Highlight = req.body.Highlight;
							doc[0].FocusArea = req.body.FocusArea;
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
							//---Audits and Reviews Tab---//
							doc[0].IAExplanations = req.body.IAExplanations;
							doc[0].PRExplanations = req.body.PRExplanations;
							doc[0].ARRExplanations = req.body.ARRExplanations;
							doc[0].AuditFocusText = req.body.AuditFocusText;
							//---CU Ratings Tab---//
							doc[0].CUFocusItems = req.body.CUFocusItems;
							//---Reporting Country Testign Tab---//
							doc[0].SOXProcessTestingExplanations = req.body.SOXProcessTestingExplanations;
							doc[0].OpsProcessTestingExplanations = req.body.OpsProcessTestingExplanations;
							doc[0].ProcessTestingFocusItems = req.body.ProcessTestingFocusItems;
							//---Key Controls Testign 2 Tab---//
							doc[0].SCSOXProcessTestingExplanations = req.body.SCSOXProcessTestingExplanations;
							doc[0].SCOpsProcessTestingExplanations = req.body.SCOpsProcessTestingExplanations;
							doc[0].SCProcessTestingFocusItems = req.body.SCProcessTestingFocusItems;
							//---Open Risks and Missed Commits Tab---//
							doc[0].GCSSection1Explanations = req.body.GCSSection1Explanations;
							doc[0].GCSFocusItems = req.body.GCSFocusItems;
							doc[0].MissedMSACsRptColor = req.body.MissedMSACsRptColor;
							doc[0].MissedIssueRptColor = req.body.MissedIssueRptColor;
							break;
						case "Account":
							break;
						case "BU Reporting Group":
							break;
					}
					doc[0].Notes = req.body.Notes;
					doc[0].Links = eval(req.body.attachIDs);
					doc[0].Log = [];
					doc[0].Log.push(addlog);
					doc[0].Status = req.body.Status;

					db.save(doc[0]).then(function(data){
						deferred.resolve(data);
					}).catch(function(err) {
						deferred.reject({"status": 500, "error": err.error.reason});
					});

				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});

			} else { // existing assessment document

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
						case "Business Unit":
							break;
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
						case "BU IOT":
							break;
						case "BU IMT":
							break;
						case "BU Country":
							//---Summary Tab---//
							doc[0].RatingSummary = req.body.RatingSummary;
							doc[0].Highlight = req.body.Highlight;
							doc[0].FocusArea = req.body.FocusArea;
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
							console.log("req.body.opMetricIDs: " + req.body.opMetricIDs);
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
							//---Audits and Reviews Tab---//
							doc[0].IAExplanations = req.body.IAExplanations;
							doc[0].PRExplanations = req.body.PRExplanations;
							doc[0].ARRExplanations = req.body.ARRExplanations;
							doc[0].AuditFocusText = req.body.AuditFocusText;
							//---CU Ratings Tab---//
							doc[0].CUFocusItems = req.body.CUFocusItems;
							//---Reporting Country Testign Tab---//
							doc[0].SOXProcessTestingExplanations = req.body.SOXProcessTestingExplanations;
							doc[0].OpsProcessTestingExplanations = req.body.OpsProcessTestingExplanations;
							doc[0].ProcessTestingFocusItems = req.body.ProcessTestingFocusItems;
							//---Key Controls Testign 2 Tab---//
							doc[0].SCSOXProcessTestingExplanations = req.body.SCSOXProcessTestingExplanations;
							doc[0].SCOpsProcessTestingExplanations = req.body.SCOpsProcessTestingExplanations;
							doc[0].SCProcessTestingFocusItems = req.body.SCProcessTestingFocusItems;
							//---Open Risks and Missed Commits Tab---//
							doc[0].GCSSection1Explanations = req.body.GCSSection1Explanations;
							doc[0].GCSFocusItems = req.body.GCSFocusItems;
							doc[0].MissedMSACsRptColor = req.body.MissedMSACsRptColor;
							doc[0].MissedIssueRptColor = req.body.MissedIssueRptColor;
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
					doc[0].Log.push(addlog);

					db.save(doc[0]).then(function(data){
						deferred.resolve(data);
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
