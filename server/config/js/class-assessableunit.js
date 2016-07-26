/**************************************************************************************************
 *
 * Business Unit code for MIRA Web
 * Developed by : Minerva S Genon
 * Date:07 June 2016
 *
 */

var q  = require("q");
var moment = require('moment');
var mtz = require('moment-timezone');
var accessrules = require('./class-accessrules.js');

var assessableunit = {

	/* Display all Assessable Units */
	listAU: function(req, db) {
		var deferred = q.defer();
		var view_dashboard=[];
		var obj = {
			selector:{
				"_id": {"$gt":0},
				"key": "Assessable Unit",
				$or: [  {"DocSubType": "Business Unit"},{"DocSubType": "Global Process"},{"DocSubType": "Country Process"},{"DocSubType": "Controllable Unit"},{"DocSubType": "BU Reporting Group"}]
			}
		};
		db.find(obj).then(function(data){
			var doc = data.body.docs;
			var len= doc.length;
            if(len > 0){
				for (var i = 0; i < len; i++){
					 view_dashboard.push({
										assessableUnit: doc[i].Name,
										priorQ: doc[i].PeriodRatingPrev,
										currentQ: doc[i].PeriodRating,
										nextQtr: doc[i].AUNextQtrRating,
										targetToSat:doc[i].Target2Sat,
										mira:doc[i].MIRAAssessmentStatus,
										wwBcit:doc[i].WWBCITAssessmentStatus,
										owner:doc[i].Owner,
										type:doc[i].DocSubType,
									})
				}
			}
			view=JSON.stringify(view_dashboard, 'utf8');
			deferred.resolve({"status": 200, "doc": doc,"view":view});
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},

	/* Get assessable unit by ID */
	getAUbyID: function(req, db) {
		var deferred = q.defer();
		var docid = req.query.id
		var obj = {
			selector:{
				"_id": docid,
			}
		};
		db.get(docid).then(function(data){
			var doc = [];
			doc.push(data.body);
			var constiobj = {};
			var toadd = {};
			var editors = doc[0].AdditionalEditors + doc[0].Owner + doc[0].Focals;

			/* Get access and roles */
			accessrules.getRules(req,editors);
			doc[0].editor = accessrules.rules.editor;
			doc[0].admin = accessrules.rules.admin;
			doc[0].grantaccess = accessrules.rules.grantaccess;
			doc[0].resetstatus = accessrules.rules.resetstatus;
			doc[0].cuadmin = accessrules.rules.cuadmin;
			if (accessrules.rules.editor && accessrules.rules.cuadmin && (doc[0].DocSubType == "Country Process" || doc[0].DocSubType == "Controllable Unit")) doc[0].admin = 1;

			if(req.query.edit == '') {
				doc[0].editmode = 1;

				switch (doc[0].DocSubType) {

					case "Business Unit","BU IMT","BU Country","Controllable Unit","Country Process","Global Process":
						/* get Reporting Group list */
						doc[0].ReportingGroupList = [];
						var searchobj = {
							selector:{
								"_id": {"$gt":0},
								"key": "Assessable Unit",
								"Status": "Active",
								"BusinessUnit": doc[0].BusinessUnit,
								"DocSubType": "BU Reporting Group",
							}
						};
						db.find(searchobj).then(function(resdata) {
							var resdocs = resdata.body.docs;
							for (var i = 0; i < resdocs.length; ++i) {
								doc[0].ReportingGroupList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
							}
							deferred.resolve({"status": 200, "doc": doc});
						}).catch(function(err) {
							console.log("[assessableunit][countrylist]" + resdata.error);
						});
					break;

					case "BU IOT":
						/* get BU Countries and Reporting Group list */
						doc[0].BUCountryList = [];
						doc[0].ReportingGroupList = [];
						var searchobj = {
							selector:{
								"_id": {"$gt":0},
								"key": "Assessable Unit",
								"Status": "Active",
								"BusinessUnit": doc[0].BusinessUnit,
								$or: [{"DocSubType": "BU Country"},{"DocSubType": "BU Reporting Group"}]
							}
						};
						db.find(searchobj).then(function(resdata) {
							var resdocs = resdata.body.docs;
							for (var i = 0; i < resdocs.length; ++i) {
								if (resdocs[i].DocSubType == "BU Country") doc[0].BUCountryList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
								if (resdocs[i].DocSubType == "BU Reporting Group") doc[0].ReportingGroupList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
							}
							deferred.resolve({"status": 200, "doc": doc});
						}).catch(function(err) {
							console.log("[assessableunit][countrylist]" + resdata.error);
						});
						break;

				}

			} else {

				/* start: get names of admin section IDs for display */
				if(doc[0].DocSubType == "BU IOT" && (doc[0].BUCountryIOT != "" || doc[0].BRGMembership != "" || doc[0].RGRollup != "") ) {
					var getadminsecID = false;
					var $or = [];
					var bucIDs = "", brgmIDs = "", rgrIDs = "";

					if (doc[0].BUCountryIOT != "") {
						bucIDs = doc[0].BUCountryIOT.split(',');
						for (var i = 0; i < bucIDs.length; i++) {
							$or.push({"_id":bucIDs[i]});
						}
					}
					if (doc[0].BRGMembership != "") {
						brgmIDs = doc[0].BRGMembership.split(',');
						for (var i = 0; i < brgmIDs.length; i++) {
							$or.push({"_id":brgmIDs[i]});
						}
					}
					if (doc[0].RGRollup != "") {
						rgrIDs = doc[0].RGRollup.split(',');
						for (var i = 0; i < rgrIDs.length; i++) {
							$or.push({"_id":rgrIDs[i]});
						}
					}

					var searchobj = { selector: {"_id": {"$gt":0}, $or } };

					db.find(searchobj).then(function(resdata) {
						var resdocs = resdata.body.docs;
						var bucNames = "", brgmNames = "", rgrNames = "";

						for (var i = 0; i < resdocs.length; ++i) {

							for (var j = 0; j < bucIDs.length; j++) {
								if (bucIDs[j] == resdocs[i]._id) {
									if ( bucNames == "" ) bucNames = resdocs[i].Name;
									else bucNames = bucNames + ", " + resdocs[i].Name;
								}
							}
							for (var j = 0; j < brgmIDs.length; j++) {
								if (brgmIDs[j] == resdocs[i]._id) {
									if ( brgmNames == "" ) brgmNames = resdocs[i].Name;
									else brgmNames = brgmNames + ", " + resdocs[i].Name;
								}
							}
							for (var j = 0; j < rgrIDs.length; j++) {
								if (rgrIDs[j] == resdocs[i]._id) {
									if (rgrNames == "") rgrNames = resdocs[i].Name;
									else rgrNames = rgrNames + ", " + resdocs[i].Name;
								}
							}

						}

						doc[0].BUCountryIOTDisp = bucNames;
						doc[0].BRGMembershipDisp = brgmNames;
						doc[0].RGRollupDisp = rgrNames;
						deferred.resolve({"status": 200, "doc": doc});

					}).catch(function(err) {
						console.log("[assessableunit][countrylistIncluded]" + resdata.error);
					});
				}
				/* end: get names of admin section IDs for display */

			}

			/* Field displays */
			if(doc[0].AuditableFlag == "Yes") {
				doc[0].AuditableFlagYes = 1;
				doc[0].SizeFlag = 1;
			}
			if(doc[0].CUFlag == "Yes") {
				doc[0].CUFlagYes = 1;
				doc[0].SizeFlag = 1;
			}
			if(doc[0].Portfolio == "Yes") {
				doc[0].PortfolioYes = 1;
			}

			if(doc[0].DocSubType == "Controllable Unit") {
				doc[0].CUFlag = 1;
            }
			if(doc[0].DocSubType == "BU Reporting Group") {
				doc[0].RGFlag = 1;
            }
			/* Format Links */
			doc[0].Links = JSON.stringify(doc[0].Links);

			/* Get Assessment Data */
			doc[0].AssessmentData = [];
			toadd = {
				"docid": "id101",
				"col":["2Q2016","Marg","Minerva S Genon","Jun 4, 2016"]
			};
			doc[0].AssessmentData.push(toadd);
			toadd = {
				"docid": "id102",
				"col":["1Q2016","Sat","Minerva S Genon",""]
			};
			doc[0].AssessmentData.push(toadd);
			toadd = {
				"docid": "id103",
				"col":["4Q2015","Sat","Minerva S Genon",""]
			};
			doc[0].AssessmentData.push(toadd);

			/* Get Constituents Data*/
			switch (doc[0].DocSubType) {
				case "Business Unit":
					constiobj = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"DocSubType": {"$or":["Global Process","BU Reporting Group","Controllable Unit","BU IOT"]},
							"BusinessUnit": doc[0].BusinessUnit
						}
					};
					doc[0].GPData = [];
					doc[0].BUIOTData = [];
					doc[0].RGData = [];
					doc[0].CUData = [];
					break;
				case "Global Process":
					var constiobj = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"DocSubType": "Country Process",
							"BusinessUnit": doc[0].BusinessUnit,
							"Global Process": doc[0].GlobalProcess
						}
					};
					doc[0].CPData = [];
					break;
				case "BU IOT":
					var constiobj = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"DocSubType": {"$or":["Controllable Unit","BU IMT"]},
							"BusinessUnit": doc[0].BusinessUnit,
							"BUIOT": doc[0].BUIOT
						}
					};
					doc[0].BUIMTData = [];
					doc[0].CUData = [];
					break;
				case "BU IMT":
					var constiobj = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"DocSubType": {"$or":["Controllable Unit","BU Country"]},
							"BusinessUnit": doc[0].BusinessUnit,
							"BUIMT": doc[0].BUIMT
						}
					};
					doc[0].BUCountryData = [];
					doc[0].CUData = [];
					break;
				case "BU Country":
					var constiobj = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"DocSubType": {"$or":["Controllable Unit","Country Process"]},
							"BusinessUnit": doc[0].BusinessUnit,
							"BUCountry": doc[0].BUCountry
						}
					};
					doc[0].CPData = [];
					doc[0].CUData = [];
					break;
				case "Controllable Unit":
					var constiobj = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"DocSubType": "Account",
							"BusinessUnit": doc[0].BusinessUnit,
							"ControllableUnit": doc[0].ControllableUnit,
						}
					};
					doc[0].AccountData = [];
					break;
				case "Country Process":
					var constiobj = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"DocSubType": "Controllable Unit",
							"RelevantCP": doc[0].Name,
							"BusinessUnit": doc[0].BusinessUnit
						}
					};
					doc[0].ControlData = [];
					doc[0].CUData = [];
					break;
				case "BU Reporting Group":
					var constiobj = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"DocSubType": {"$or":["Controllable Unit","Country Process","BU Country","BU IMT","BU IOT","GlobalProcess"]},
							"BusinessUnit": doc[0].BusinessUnit,
							"GroupName": doc[0].GroupName
						}
					};
					doc[0].GPData = [];
					doc[0].BUIOTData = [];
					doc[0].BUIMTData = [];
					doc[0].BUCountryData = [];
					doc[0].CUData = [];
					doc[0].CPData = [];
					break;
			}

			db.find(constiobj).then(function(constidata) {
				var constidocs = constidata.body.docs;

				for (var i = 0; i < constidocs.length; ++i) {
					toadd = {
						"docid": constidocs[i]._id,
						"col": [
								constidocs[i].Name,
								constidocs[i].Status,
								constidocs[i].PeriodRatingPrev,
								constidocs[i].PeriodRating,
								constidocs[i].AUNextQtrRating,
								constidocs[i].Target2Sat
						]
					};
					if (constidocs[i].DocSubType == "Global Process") doc[0].GPData.push(toadd);
					else if(constidocs[i].DocSubType == "BU IOT") doc[0].BUIOTData.push(toadd);
					else if (constidocs[i].DocSubType == "BU Reporting Group") doc[0].RGData.push(toadd);
					else if (constidocs[i].DocSubType == "Country Process") doc[0].CPData.push(toadd);
					else if (constidocs[i].DocSubType == "Controllable Unit") doc[0].CUData.push(toadd);
					else doc[0].CUData.push(toadd);
				}

				deferred.resolve({"status": 200, "doc": doc});
			}).catch(function(err) {
				console.log("[assessableunit][constituents]" + constidata.error);
			});

		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},

	/* Update assessable unit */
	saveAUBU: function(req, db) {
		var deferred = q.defer();
		var now = moment(new Date());
		var addlog = {
			"name": req.session.user.notesId,
			"date": now.format("MM/DD/YYYY"),
			"time": now.format("hh:mmA") + " " + mtz.tz(mtz.tz.guess()).zoneAbbr(),
		};
		var docid = req.body.docid;
		var obj = {
			selector:{
				"_id": docid,
			}
		};

		db.get(docid).then(function(data){
			var doc = [];
			doc.push(data.body);
			// Update Admin Section
			switch (doc[0].DocSubType) {
				case "Business Unit":
					doc[0].RGRollup = req.body.RGRollup;
					break;
				case "Global Process":
					doc[0].RGRollup = req.body.RGRollup;
					doc[0].BRGMembership = req.body.BRGMembership;
					break;
				case "BU IOT":
					doc[0].RGRollup = req.body.RGRollup;
					doc[0].BRGMembership = req.body.BRGMembership;
					doc[0].BUCountryIOT = req.body.BUCountryIOT;
					break;
				case "Country Process":
					doc[0].BRGMembership = req.body.BRGMembership;
					doc[0].AuditableFlag = req.body.AuditableFlag;
					doc[0].CUFlag = req.body.CUFlag;
					doc[0].AuditProgram = req.body.AuditProgram;
					doc[0].CUSize = req.body.CUSize;
					break;
            // Update Admin & Basic Sections
				case "Controllable Unit":
					doc[0].BRGMembership = req.body.BRGMembership;
					doc[0].PrimaryGlobalProcess = req.body.PrimaryGlobalProcess;
					doc[0].CUSize = req.body.CUSize;
					doc[0].LifetimeTCV= req.body.LifetimeTCV;
					doc[0].AuditableFlag = req.body.AuditableFlag;
					doc[0].AuditProgram = req.body.AuditProgram;
					doc[0].Portfolio = req.body.Portfolio;
                    // Update Focals, Coordinators & Readers
					doc[0].PEDPE = req.body.pedpelist;
					doc[0].IMTVP = req.body.imtvpedpelist;
                    doc[0].SCAGEOLead = req.body.scageoleadlist;
					break;
				case "BU Reporting Group":
					doc[0].GroupLOB = req.body.GroupLOB;
					doc[0].AuditProgram = req.body.AuditProgram;
                    doc[0].GroupLOB = req.body.GroupLOB;
					doc[0].Name = req.body.Name;
					doc[0].Status = req.body.Status;
                    // Update Focals, Coordinators & Readers
					doc[0].Focals = req.body.focalslist;
					doc[0].Coordinators = req.body.coordinatorslist;
                    doc[0].Readers = req.body.readerslist;
					break;
			}
			// Update Additional Readers
			doc[0].AdditionalReaders = req.body.readerlist;
			// Update Additional Editors
			doc[0].AdditionalEditors = req.body.editorlist;
			// Update notes
			doc[0].Notes = req.body.Notes;
			// Update links
			doc[0].Links = eval(req.body.attachIDs);
			// Update logs
			doc[0].Log.push(addlog);

			db.save(doc[0]).then(function(data){
				deferred.resolve(data);
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err});
			});
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});

		return deferred.promise;
	}

};

module.exports = assessableunit;
