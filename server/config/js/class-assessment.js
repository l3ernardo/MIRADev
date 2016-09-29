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

				switch (doc[0].ParentDocSubType) {
					case "Country Process":
						// test view data
						doc[0].ALLData = fieldCalc.addTestViewData(6,3);
						doc[0].ARCData = fieldCalc.addTestViewData(4,3);
						doc[0].RiskData = fieldCalc.addTestViewData(11,3);
						doc[0].AuditTrustedData = doc[0].RiskData;
						doc[0].AuditTrustedRCUData = fieldCalc.addTestViewData(10,3);
						doc[0].AuditLocalData = fieldCalc.addTestViewData(8,3);
						doc[0].DRData = fieldCalc.addTestViewData(5,1);
						doc[0].RCTestData = fieldCalc.addTestViewData(7,3);
						doc[0].SCTestData = doc[0].RCTestData;
						doc[0].SampleData = doc[0].RiskData;
						doc[0].EAData = doc[0].ARCData;
						break;
					case "Global Process":
						break;
					case "Controllable Unit":
						break;
				}

				// doc[0].CatP = "CRM";
				// doc[0].ShowEA = 1;
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

						// --- Start of Basic Section --- //
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
						// --- End of Basic Section --- //

					} else { // Read mode

					}
					if (doc[0].ParentDocSubType == "Global Process") {
						doc[0].CPAsmtDataOIview = [];
						doc[0].CPAsmtDataPIview = [];
						fieldCalc.getRatingProfile(db, doc).then(function(data){
							if (doc[0].CPAsmtDataPIview.length < 3) {
								fieldCalc.addTestViewDataPadding(doc[0].CPAsmtDataPIview,10,(3-doc[0].CPAsmtDataPIview.length));
							}
							if (doc[0].CPAsmtDataOIview.length < 3) {
								fieldCalc.addTestViewDataPadding(doc[0].CPAsmtDataOIview,8,(3-doc[0].CPAsmtDataOIview.length));
							}
							deferred.resolve({"status": 200, "doc": doc});
						}).catch(function(err) {
							deferred.reject({"status": 500, "error": err});
						});
					} else {
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
						"PeriodKey": pdoc[0].CurrentPeriod
					};
					doc.push(tmpdoc);
					switch (doc[0].ParentDocSubType) {
						case "BU IOT":
							break;
						case "BU IMT":
							break;
						case "BU Country":
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
					switch (doc[0].ParentDocSubType) {
						case "Business Unit":
							break;
						case "Subprocess":
							break;
						case "Global Process":
							break;
						case "BU IOT":
							break;
						case "BU IMT":
							break;
						case "BU Country":
							break;
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
							if (doc[0].BoCResponse1 == "No" || doc[0].BoCResponse2 == "No" || doc[0].BoCResponse3 == "No" || doc[0].BoCResponse4 == "No" || doc[0].BoCResponse5 == "No")
								doc[0].BOCExceptionCount = 1;
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
							//---Backend Fields---//
							doc[0].RatingCategory = fieldCalc.getRatingCategory(doc[0].PeriodRating,doc[0].PeriodRatingPrev1);
  						break;
						case "Account":
							break;
						case "Controllable Unit":
							//---Backend Fields---//
							doc[0].RatingCategory = fieldCalc.getRatingCategory(doc[0].PeriodRating,doc[0].PeriodRatingPrev1);
							break;
						case "BU Reporting Group":
							break;
					}

					//---Basics Section---//
					if (doc[0].PrevRatingUpdate != req.body.PeriodRating) {
						doc[0].RatingChangeWho = curruser;
						doc[0].RatingChangeWhen = currdate;
						doc[0].PrevRatingUpdate = doc[0].PeriodRating;
						doc[0].PeriodRating = req.body.PeriodRating;
					}
					doc[0].MIRARatingJustification = req.body.MIRARatingJustification;
					doc[0].ReviewComments = req.body.ReviewComments;
					doc[0].Target2Sat = req.body.Target2Sat;
					if ( doc[0].MIRAStatus != req.body.MIRAStatus ) {
						doc[0].MIRAStatusChangeWho = curruser;
						doc[0].MIRAStatusChangeWhen = currdate;
					}
					doc[0].MIRAStatus = req.body.MIRAStatus;
					doc[0].NextQtrRating = req.body.NextQtrRating;
					doc[0].DecommitExplanation = req.body.DecommitExplanation;
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
