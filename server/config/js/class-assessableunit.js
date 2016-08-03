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
				"DocSubType": {$or: ["Business Unit", "Global Process", "Country Process", "Controllable Unit", "BU Reporting Group", "BU IOT", "BU IMT", "BU Country","Account"]}
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
			if (doc[0].admin) doc[0].editor = 1;

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
			if(doc[0].DocSubType == "BU Reporting Group"  || doc[0].DocSubType == "Account") {
				doc[0].RGFlag = 1;
      }
	        if(doc[0].DocSubType == "BU IMT") {
				doc[0].BUIMTflag = 1;
            }
			 if(req.session.businessunit == "GBS") {
				doc[0].GBSflag = 1;
            } else  if(req.session.businessunit == "GTS") {
				doc[0].GTSflag = 1;
            }
			else
				{
				doc[0].GTSTransflag = 1;
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
				case "Account":
					constiobj = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"DocSubType": "Account",
							"ParentSubject":doc[0].ParentSubject,
							"BusinessUnit": doc[0].BusinessUnit
						}
					};						
					doc[0].AccountData = [];
					break;
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
							"IOT": doc[0].IOT
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
							"IMT": doc[0].IMT
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
							"Country": doc[0].Country
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
					else if(constidocs[i].DocSubType == "BU IMT") doc[0].BUIMTData.push(toadd);
					else if(constidocs[i].DocSubType == "BU Country") doc[0].BUCountryData.push(toadd);
					else if (constidocs[i].DocSubType == "BU Reporting Group") doc[0].RGData.push(toadd);					
					else if (constidocs[i].DocSubType == "Account") doc[0].AccountData.push(toadd);
					else if (constidocs[i].DocSubType == "Country Process") doc[0].CPData.push(toadd);
					else if (constidocs[i].DocSubType == "Controllable Unit") doc[0].CUData.push(toadd);
					else doc[0].CUData.push(toadd);
				}

				/* Get Reporting Groups and BU Countries*/
				if(req.query.edit != undefined) { //Edit mode
					doc[0].editmode = 1;

					switch (doc[0].DocSubType) {

						case "Business Unit":
						case "Global Process":
						case "Country Process":
						case "Account":
						case "Controllable Unit":
							/* get Reporting Group list for Controllable Unit, Country Process, Global Process and Business Unit */
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
								console.log("[assessableunit][ReportingGroupList]" + resdata.error);
								deferred.reject({"status": 500, "error": err});
							});
							break;

						case "BU IOT":
							/* get BU Countries List, Reporting Group list and IOT name list */
							doc[0].BUCountryList = [];
							doc[0].ReportingGroupList = [];
							/*
								IOT Name List:
								Editing the unit name for BU IOT, BU IMT and BU Country should only be applicable for new units that are not yet saved.
								Once saved, it should not be editable but the name may change only if it is updated in WWBCIT, MIRA should automatically pick up the name change.
								***This is enabled for testing purposes only.
								orig query without iot name list: var searchobj = { selector: {"_id": {"$gt":0}, "key": "Assessable Unit", $or } };
							*/
							doc[0].IOTList = [];

							var searchobj = {
								selector:{
									"_id": {"$gt":0},
									"key": "Assessable Unit",
									"Status": "Active",
									$or: [
										{$and:[{$or:[{"DocSubType": "BU Country"},{"DocSubType": "BU Reporting Group"}]},{"BusinessUnit":doc[0].BusinessUnit}]},
							      {"DocSubType": "IOT"}
									]
								}
							};
							db.find(searchobj).then(function(resdata) {
								var resdocs = resdata.body.docs;
								for (var i = 0; i < resdocs.length; ++i) {
									if (resdocs[i].DocSubType == "BU Country") doc[0].BUCountryList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
									if (resdocs[i].DocSubType == "BU Reporting Group") doc[0].ReportingGroupList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
									if (resdocs[i].DocSubType == "IOT") doc[0].IOTList.push({"docid":resdocs[i]._id,"name":resdocs[i].IOT});
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								console.log("[assessableunit][iotlists]" + resdata.error);
								deferred.reject({"status": 500, "error": err});
							});
							break;

						case "BU IMT":
							/* get Reporting Group list and IMT name list */
							doc[0].ReportingGroupList = [];
							/*
								IMT Name List:
								Editing the unit name for BU IOT, BU IMT and BU Country should only be applicable for new units that are not yet saved.
								Once saved, it should not be editable but the name may change only if it is updated in WWBCIT, MIRA should automatically pick up the name change.
								***This is enabled for testing purposes only.
							*/
							doc[0].IMTList = [];

							var searchobj = {
								selector:{
									"_id": {"$gt":0},
									"key": "Assessable Unit",
									"Status": "Active",
									$or: [
										{$and:[{"DocSubType": "BU Reporting Group"},{"BusinessUnit":doc[0].BusinessUnit}]},
										{$and:[{"DocSubType": "IMT"},{"IOT":doc[0].IOT}]}
									]
								}
							};
							db.find(searchobj).then(function(resdata) {
								var resdocs = resdata.body.docs;
								for (var i = 0; i < resdocs.length; ++i) {
									if (resdocs[i].DocSubType == "BU Reporting Group") doc[0].ReportingGroupList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
									if (resdocs[i].DocSubType == "IMT") doc[0].IMTList.push({"docid":resdocs[i]._id,"name":resdocs[i].IMT});
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								console.log("[assessableunit][imtlists]" + resdata.error);
								deferred.reject({"status": 500, "error": err});
							});
							break;

						case "BU Country":
							/* get Reporting Group list and IMT name list */
							doc[0].ReportingGroupList = [];
							/*
								Country Name List:
								Editing the unit name for BU IOT, BU IMT and BU Country should only be applicable for new units that are not yet saved.
								Once saved, it should not be editable but the name may change only if it is updated in WWBCIT, MIRA should automatically pick up the name change.
								***This is enabled for testing purposes only.
							*/
							doc[0].CountryList = [];

							var searchobj = {
								selector:{
									"_id": {"$gt":0},
									"key": "Assessable Unit",
									"Status": "Active",
									$or: [
										{$and:[{"DocSubType": "BU Reporting Group"},{"BusinessUnit":doc[0].BusinessUnit}]},
										{$and:[{"DocSubType": "Country"},{"IMT":doc[0].IMT}]}
									]
								}
							};
							db.find(searchobj).then(function(resdata) {
								var resdocs = resdata.body.docs;
								for (var i = 0; i < resdocs.length; ++i) {
									if (resdocs[i].DocSubType == "BU Reporting Group") doc[0].ReportingGroupList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
									if (resdocs[i].DocSubType == "Country") doc[0].CountryList.push({"docid":resdocs[i]._id,"name":resdocs[i].Country});
								}
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								console.log("[assessableunit][imtlists]" + resdata.error);
								deferred.reject({"status": 500, "error": err});
							});
							break;

						default:
							console.log("doc[0].ReportingGroupList: " + doc[0].ReportingGroupList.length);
							deferred.resolve({"status": 200, "doc": doc});
							break;
					}

				}else{ //Read mode

					switch (doc[0].DocSubType) { //start of read mode switch

						case "Business Unit":
							/* start: get names of admin section IDs for display */
							var $or = [];
							var rgrIDs = "";

							if (doc[0].RGRollup != "" && doc[0].RGRollup != null) {
								rgrIDs = doc[0].RGRollup.split(',');
								for (var i = 0; i < rgrIDs.length; i++) {
									$or.push({"_id":rgrIDs[i]});
								}
							}

							var searchobj = { selector: {"_id": {"$gt":0}, "key": "Assessable Unit", $or } };
							db.find(searchobj).then(function(resdata) {
								var resdocs = resdata.body.docs;
								var rgrNames = "";

								for (var i = 0; i < resdocs.length; ++i) {
									for (var j = 0; j < rgrIDs.length; j++) {
										if (rgrIDs[j] == resdocs[i]._id) {
											if (rgrNames == "") rgrNames = resdocs[i].Name;
											else rgrNames = rgrNames + ", " + resdocs[i].Name;
										}
									}
								}

								doc[0].RGRollupDisp = rgrNames;
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								console.log("[assessableunit][countrylistIncluded]" + err);
								deferred.reject({"status": 500, "error": err});
							});
							/* end: get names of admin section IDs for display */
							break;

						case "Global Process":
							/* start: get names of admin section IDs for display */
							var $or = [];
							var brgmIDs = "", rgrIDs = "";

							if (doc[0].BRGMembership != "" && doc[0].BRGMembership != null) {
								brgmIDs = doc[0].BRGMembership.split(',');
								for (var i = 0; i < brgmIDs.length; i++) {
									$or.push({"_id":brgmIDs[i]});
								}
							}
							if (doc[0].RGRollup != "" && doc[0].RGRollup != null) {
								rgrIDs = doc[0].RGRollup.split(',');
								for (var i = 0; i < rgrIDs.length; i++) {
									$or.push({"_id":rgrIDs[i]});
								}
							}

							var searchobj = { selector: {"_id": {"$gt":0}, "key": "Assessable Unit", $or } };
							db.find(searchobj).then(function(resdata) {
								var resdocs = resdata.body.docs;
								var bucNames = "", brgmNames = "", rgrNames = "";

								for (var i = 0; i < resdocs.length; ++i) {
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
								doc[0].BRGMembershipDisp = brgmNames;
								doc[0].RGRollupDisp = rgrNames;
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								console.log("[assessableunit][countrylistIncluded]" + err);
								deferred.reject({"status": 500, "error": err});
							});
							/* end: get names of admin section IDs for display */
							break;

						case "BU IOT":
							/* start: get names of admin section IDs for display and IOT name for BU IOT unit*/
							var getadminsecID = false;
							var $or = [];
							var bucIDs = "", brgmIDs = "", rgrIDs = "";

							if (doc[0].BUCountryIOT != "" && doc[0].BUCountryIOT != null) {
								bucIDs = doc[0].BUCountryIOT.split(',');
								for (var i = 0; i < bucIDs.length; i++) {
									$or.push({"_id":bucIDs[i]});
								}
							}
							if (doc[0].BRGMembership != "" && doc[0].BRGMembership != null) {
								brgmIDs = doc[0].BRGMembership.split(',');
								for (var i = 0; i < brgmIDs.length; i++) {
									$or.push({"_id":brgmIDs[i]});
								}
							}
							if (doc[0].RGRollup != "" && doc[0].RGRollup != null) {
								rgrIDs = doc[0].RGRollup.split(',');
								for (var i = 0; i < rgrIDs.length; i++) {
									$or.push({"_id":rgrIDs[i]});
								}
							}
							// IOT doc ID
							$or.push({"_id":doc[0].IOTid});

							var searchobj = { selector: {"_id": {"$gt":0}, "key": "Assessable Unit", $or } };
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

									//get latetest IOT name based on ID
									if (resdocs[i]._id == doc[0].IOTid) doc[0].IOT = resdocs[i].IOT;

								}
								doc[0].BUCountryIOTDisp = bucNames;
								doc[0].BRGMembershipDisp = brgmNames;
								doc[0].RGRollupDisp = rgrNames;
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								console.log("[assessableunit][countrylistIncluded]" + err);
								deferred.reject({"status": 500, "error": err});
							});
							/* end: get names of admin section IDs for display */
							break;

						case "BU IMT":
						case "BU Country":
						case "Country Process":
						case "Controllable Unit":
							/* start: get names of admin section IDs for display and IMT name for BU IMT unit*/
							var $or = [];
							var brgmIDs = "";

							if (doc[0].BRGMembership != "") {
								brgmIDs = doc[0].BRGMembership.split(',');
								for (var i = 0; i < brgmIDs.length; i++) {
									$or.push({"_id":brgmIDs[i]});
								}
							}

							if (doc[0].DocSubType == "BU IMT" || doc[0].DocSubType == "BU Country") {
								$or.push({"_id":doc[0].IOTid}); // IOT doc ID
								$or.push({"_id":doc[0].IMTid}); // IMT doc ID
								if (doc[0].DocSubType == "BU Country") $or.push({"_id":doc[0].Countryid}); // Country doc ID
							}

							var searchobj = { selector: {"_id": {"$gt":0}, "key": "Assessable Unit", $or } };
							db.find(searchobj).then(function(resdata) {
								var resdocs = resdata.body.docs;
								var bucNames = "", brgmNames = "", rgrNames = "";

								for (var i = 0; i < resdocs.length; ++i) {
									for (var j = 0; j < brgmIDs.length; j++) {
										if (brgmIDs[j] == resdocs[i]._id) {
											if ( brgmNames == "" ) brgmNames = resdocs[i].Name;
											else brgmNames = brgmNames + ", " + resdocs[i].Name;
										}
									}

									if (doc[0].DocSubType == "BU IMT" || doc[0].DocSubType == "BU Country") {
										if (resdocs[i]._id == doc[0].IOTid) doc[0].IOT = resdocs[i].IOT; //get latetest IOT name based on ID
										if (resdocs[i]._id == doc[0].IMTid) doc[0].IMT = resdocs[i].IMT; //get latetest IMT name based on ID
										if (doc[0].DocSubType == "BU Country")
											if (resdocs[i]._id == doc[0].Countryid) doc[0].Country = resdocs[i].Country; //get latetest Country name based on ID
									}

								}
								doc[0].BRGMembershipDisp = brgmNames;
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								console.log("[assessableunit][countrylistIncluded]" + err);
								deferred.reject({"status": 500, "error": err});
							});
							/* end: get names of admin section IDs for display */
							break;

						default:
							deferred.resolve({"status": 200, "doc": doc});
							break;

					}//end of read mode switch
				}

			}).catch(function(err) {
				console.log("[assessableunit][constituents]" + constidata.error);
				deferred.reject({"status": 500, "error": err});
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
			// Update Admin/Basic Section
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
					doc[0].IOT = req.body.IOT;
					doc[0].IOTid = req.body.IOTid;
					doc[0].Name = doc[0].BusinessUnit + " - " + doc[0].IOT;
					break;
				case "BU IMT":
					doc[0].BRGMembership = req.body.BRGMembership;
					doc[0].IOT = req.body.IOT;
					doc[0].IMT = req.body.IMT;
					doc[0].IMTid = req.body.IMTid;
					doc[0].Name = doc[0].BusinessUnit + " - " + doc[0].IMT;
					break;
				case "BU Country":
					doc[0].BRGMembership = req.body.BRGMembership;
					doc[0].IOT = req.body.IOT;
					doc[0].IMT = req.body.IMT;
					doc[0].Country = req.body.Country;
					doc[0].Countryid = req.body.Countryid;
					doc[0].Name = doc[0].BusinessUnit + " - " + doc[0].Country;
					break;
				case "Country Process":
					doc[0].BRGMembership = req.body.BRGMembership;
					doc[0].AuditableFlag = req.body.AuditableFlag;
					doc[0].CUFlag = req.body.CUFlag;
					doc[0].AuditProgram = req.body.AuditProgram;
					doc[0].CUSize = req.body.CUSize;
					break;
				case "Account":
					doc[0].ParentSubject = req.body.ParentSubject;
					doc[0].MetricsCriteriaLabel= req.body.MetricsCriteriaLabel;
					doc[0].MetricsCriteria = req.body.MetricsCriteria;
					doc[0].SpecialContractCategory = req.body.SpecialContractCategory;
					// Update Focals, Coordinators & Readers
					doc[0].Focals = req.body.focalslist;
					doc[0].Coordinators = req.body.coordinatorslist;
                    doc[0].Readers = req.body.readerslist;
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
