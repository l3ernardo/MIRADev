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
var param = require('./class-parameter.js');
var util = require('./class-utility.js');

var assessableunit = {

	/* Display all Assessable Units */
	listAU: function(req, db) {
		var deferred = q.defer();
		var view_dashboard=[];
		var obj = {
			selector:{
				"_id": {"$gt":0},
				"key": "Assessable Unit",
				"DocSubType": {$or: ["Business Unit", "Global Process", "Country Process", "Controllable Unit", "BU Reporting Group", "BU IOT", "BU IMT", "BU Country","Account","Sub-process"]}
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

			/* Field displays */
			if(doc[0].AuditableFlag == "Yes") {
				doc[0].AuditableFlagYes = 1;
				doc[0].SizeFlag = 1;
			}
			if(doc[0].CUFlag == "Yes") {
				doc[0].CUFlagYes = 1;
				doc[0].SizeFlag = 1;
			}

			if(doc[0].DocSubType == "Controllable Unit") {
				doc[0].CUFlag = 1;
      }
			if(doc[0].DocSubType == "BU Reporting Group" || doc[0].DocSubType == "Account" || doc[0].DocSubType == "BU IOT" || doc[0].DocSubType == "BU IMT" || doc[0].DocSubType == "BU Country") {
				doc[0].MIRAunit = 1;
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
							"$or":
								[
									{ "DocSubType":"Global Process" },
									{ "DocSubType":"BU Reporting Group" },
									{ "DocSubType":"BU IOT" },
									{ "$and": [{"DocSubType":"Controllable Unit"},{"ParentDocSubType": "Business Unit"}] }
								],
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
							"GlobalProcess": doc[0].GlobalProcess
						}
					};
					doc[0].CPData = [];
					break;
				case "Sub-process":
					var constiobj = {
						selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"DocSubType": "Country Process",
							"Subprocess": doc[0].Name,
							"GlobalProcess": doc[0].GlobalProcess
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

				/* Calculate for Instance Design Specifics and parameters*/
				if(doc[0].DocSubType == "BU IOT" || doc[0].DocSubType == "BU Country" || doc[0].DocSubType == "Controllable Unit" || doc[0].DocSubType == "Country Process" || (doc[0].DocSubType == "BU Reporting Group" && req.session.businessunit == "GBS")) {
					var lParams;
					// Get required paramaters
					if (req.session.businessunit == "GTS") {
						doc[0].EnteredBU = "GTS";
						if (doc[0].DocSubType == "Controllable Unit") {
							doc[0].CatCU = "";
							lParams = ['CRMCU','DeliveryCU','GTSInstanceDesign'];
						} else if (doc[0].DocSubType == "Country Process") {
							doc[0].CatP = "";
							lParams = ['CRMProcess','DeliveryProcess','GTSInstanceDesign'];
						} else {
							lParams = ['GTSInstanceDesign'];
						}
					} else {
						doc[0].EnteredBU = "GBS";
						lParams = ['GBSInstanceDesign'];
					}
					param.getListParams(db, lParams).then(function(dataParam) {
						if(dataParam.status==200 & !dataParam.error) {
							// calculate for CatP and CatCU fields
							if (doc[0].DocSubType == "Country Process") {
								if (dataParam.parameters.CRMProcess) {
									for (var j = 0; j < dataParam.parameters.CRMProcess[0].options.length; ++j) {
										if (doc[0].GlobalProcess == dataParam.parameters[0].options[j].name) doc[0].CatP = "CRM";
									}
								}
								if (dataParam.parameters.DeliveryProcess) {
									for (var j = 0; j < dataParam.parameters.DeliveryProcess[0].options.length; ++j) {
										if (doc[0].GlobalProcess == dataParam.parameters[0].options[j].name) doc[0].CatP = "Delivery";
									}
								}
							}
							if (doc[0].DocSubType == "Controllable Unit") {
								if (dataParam.parameters.CRMCU) {
									for (var j = 0; j < dataParam.parameters.CRMCU[0].options.length; ++j) {
										if (doc[0].GlobalProcess == dataParam.parameters[0].options[j].name) doc[0].CatCU = "CRM";
									}
								}
								if (dataParam.parameters.DeliveryCU) {
									for (var j = 0; j < dataParam.parameters.DeliveryCU[0].options.length; ++j) {
										if (doc[0].GlobalProcess == dataParam.parameters[0].options[j].name) doc[0].CatCU = "Delivery";
									}
								}
							}

							// evaluate BusinessUnitOLD formula
							if (dataParam.parameters.GTSInstanceDesign) doc[0].BusinessUnitOLD = eval(dataParam.parameters.GTSInstanceDesign[0].options[0].name);
							if (dataParam.parameters.GBSInstanceDesign) doc[0].BusinessUnitOLD = eval(dataParam.parameters.GBSInstanceDesign[0].options[0].name);

							if (doc[0].BusinessUnitOLD == "GTS" && doc[0].DocSubType == "Controllable Unit" && (doc[0].Category == "SO" || doc[0].Category == "IS" || doc[0].Category == "ITS" || doc[0].Category == "TSS" || doc[0].Category == "GPS")) {
								doc[0].showARCFreq = 1;
							}

						} else {
							console.log("[routes][class-assessableunit][getListParams] - " + dataParam.error);
						}
					}).catch(function(err) {
						console.log("[routes][class-assessableunit][getListParams] - " + err.error);
					})

				}

				/* Get Reporting Groups and BU Countries*/
				if(req.query.edit != undefined && doc[0].editor) { //Edit mode
					doc[0].editmode = 1;

					switch (doc[0].DocSubType) {

						case "Business Unit":
						case "Global Process":
						case "Sub-process":
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
							doc[0].BUCountryList = [];
							doc[0].ReportingGroupList = [];

							var searchobj = {
								selector:{
									"_id": {"$gt":0},
									"key": "Assessable Unit",
									"Status": "Active",
									"BusinessUnit":doc[0].BusinessUnit,
									"DocSubType": {$or: ["BU Reporting Group","BU Country"]}
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
								console.log("[assessableunit][iotlists]" + resdata.error);
								deferred.reject({"status": 500, "error": err});
							});
							break;

						case "BU IMT":
						case "BU Country":
							doc[0].ReportingGroupList = [];
							var searchobj = {
								selector:{
									"_id": {"$gt":0},
									"key": "Assessable Unit",
									"Status": "Active",
									"BusinessUnit":doc[0].BusinessUnit,
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
								console.log("[assessableunit][imtlists]" + resdata.error);
								deferred.reject({"status": 500, "error": err});
							});
							break;

						default:
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

						case "Sub-process":
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

							switch (doc[0].DocSubType) {
								case "BU IMT":
									$or.push({"_id":doc[0].IOTid});
									$or.push({"_id":doc[0].IMTid});
									break;
								case "BU Country":
									$or.push({"_id":doc[0].IOTid});
									$or.push({"_id":doc[0].IMTid});
									$or.push({"_id":doc[0].Countryid});
									break;
								case "Controllable Unit":
									$or.push({"_id":doc[0].parentid});
									break;
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

									switch (doc[0].DocSubType) {
										case "BU IMT":
											if (resdocs[i]._id == doc[0].IOTid) doc[0].IOT = resdocs[i].IOT;
											if (resdocs[i]._id == doc[0].IMTid) doc[0].IMT = resdocs[i].IMT;
											break;
										case "BU Country":
											if (resdocs[i]._id == doc[0].IOTid) doc[0].IOT = resdocs[i].IOT;
											if (resdocs[i]._id == doc[0].IMTid) doc[0].IMT = resdocs[i].IMT;
											if (resdocs[i]._id == doc[0].Countryid) doc[0].Country = resdocs[i].Country;
											break;
										case "Controllable Unit":
											if (resdocs[i]._id == doc[0].parentid && !doc[0].ParentDocSubType == "Business Unit") {
												doc[0].ParentSubject = resdocs[i].Name;
												doc[0].IOT = resdocs[i].IOT;
												switch (doc[0].ParentDocSubType) {
													case "BU IMT":
														doc[0].IMT = resdocs[i].IMT;
														break;
													case "Country":
														doc[0].IMT = resdocs[i].IMT;
														doc[0].Country = resdocs[i].Country;
													break;
												}
											}
											break;
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

	/* New assessable unit via parent ID */
	newAUbyPID: function(req, db) {
		var deferred = q.defer();
		var pid = req.query.pid

		db.get(pid).then(function(data){
			var pdoc = [];
			var doc = [];
			pdoc.push(data.body);
			var peditors = pdoc[0].AdditionalEditors + pdoc[0].Owner + pdoc[0].Focals;
			/* Check if user is admin to the parent doc where the new unit is created from */
			accessrules.getRules(req,peditors);
			accessrules.rules.admin = 1;

			if (accessrules.rules.admin) {
				var tmpdoc = {
					"key": "Assessable Unit",
				  "DocType": "Assessable Unit",
					"parentid": pid,
				  "DocSubType": req.query.docsubtype,
				  "Status": "Draft",
				  "BusinessUnit": pdoc[0].BusinessUnit,
				  "CurrentPeriod": pdoc[0].CurrentPeriod,
					"Status": "Active",
					"editmode": 1,
					"admin": 1,
					"grantaccess": 1,
					"MIRAunit": 1,
					"newunit": 1
				};

				doc.push(tmpdoc);

				switch (doc[0].DocSubType) {
					case "Account":
						if (pdoc[0].IOT) {
							doc[0].IOT = pdoc[0].IOT;
							doc[0].IOTid = pdoc[0].IOTid;
						}
						if (pdoc[0].IMT) {
							doc[0].IMT = pdoc[0].IMT;
							doc[0].IMTid = pdoc[0].IMTid;
						}
						if (pdoc[0].Country) {
							doc[0].Country = pdoc[0].Country;
							doc[0].Countryid = pdoc[0].Countryid;
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
							deferred.reject({"status": 500, "error": err});
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
								if (resdocs[i].DocSubType == "BU IOT") doc[0].IOTAUList.push({"iotid":resdocs[i].IOTid});
							}
							for (var i = 0; i < doc[0].IOTAUList.length; ++i) {
                util.findAndRemove(doc[0].IOTList,'docid',doc[0].IOTAUList[i].iotid)
							}
							deferred.resolve({"status": 200, "doc": doc});
						}).catch(function(err) {
							console.log("[assessableunit][IOTLists][NewIOT]" + resdata.error);
							deferred.reject({"status": 500, "error": err});
						});
						break;

					case "BU IMT":
					  doc[0].IOT = pdoc[0].IOT;
						doc[0].IOTid = pdoc[0].IOTid;
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
								if (resdocs[i].DocSubType == "BU IMT") doc[0].IMTAUList.push({"imtid":resdocs[i].IMTid});
							}
							for (var i = 0; i < doc[0].IMTAUList.length; ++i) {
								util.findAndRemove(doc[0].IMTList,'docid',doc[0].IMTAUList[i].imtid)
							}
							deferred.resolve({"status": 200, "doc": doc});
						}).catch(function(err) {
							console.log("[assessableunit][IMTLists][NewIMT]" + resdata.error);
							deferred.reject({"status": 500, "error": err});
						});
						break;

					case "BU Country":
						doc[0].IOT = pdoc[0].IOT;
						doc[0].IOTid = pdoc[0].IOTid;
						doc[0].IMT = pdoc[0].IMT;
						doc[0].IMTid = pdoc[0].IMTid;
						doc[0].ReportingGroupList = [];
						doc[0].CountryList = [];
						doc[0].CountryAUList = [];

						var searchobj = {
							selector:{
								"_id": {"$gt":0},
								"key": "Assessable Unit",
								"Status": "Active",
								$or: [
                  {$and:[{$or:[{"DocSubType": "BU Reporting Group"},{"DocSubType": "BU Country"}]},{"BusinessUnit":doc[0].BusinessUnit}]},
									{$and:[{"DocSubType": "Country"},{"IMT":doc[0].IMT}]}
								]
							}
						};
            doc[0].CountryList.push({"docid":"","name":""});
						db.find(searchobj).then(function(resdata) {
							var resdocs = resdata.body.docs;
							for (var i = 0; i < resdocs.length; ++i) {
								if (resdocs[i].DocSubType == "BU Reporting Group") doc[0].ReportingGroupList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
								if (resdocs[i].DocSubType == "Country") doc[0].CountryList.push({"docid":resdocs[i]._id,"name":resdocs[i].Country});
								if (resdocs[i].DocSubType == "BU Country") doc[0].CountryAUList.push({"countryid":resdocs[i].Countryid});
							}
							for (var i = 0; i < doc[0].CountryAUList.length; ++i) {
								util.findAndRemove(doc[0].CountryList,'docid',doc[0].CountryAUList[i].countryid)
							}
							deferred.resolve({"status": 200, "doc": doc});
						}).catch(function(err) {
							console.log("[assessableunit][BUCountryLists][NewBUCountry]" + resdata.error);
							deferred.reject({"status": 500, "error": err});
						});
						break;

					default:
						deferred.resolve({"status": 200, "doc": doc});
						break;
				}

			} else {
				deferred.reject({"status": 500, "error": "Access denied!"});
			}
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});

		return deferred.promise;
	},

	/* Update assessable unit */
	saveAUBU: function(req, db) {
		var deferred = q.defer();
		var now = moment(new Date());
		var docid = req.body.docid;
		var curruser = req.session.user.notesId;
		var currdate = now.format("MM/DD/YYYY");
		var addlog = {
			"name": curruser,
			"date": currdate,
			"time": now.format("hh:mmA") + " " + mtz.tz(mtz.tz.guess()).zoneAbbr(),
		};

		if (docid == "") {
			// new document
			var pid = req.body.parentid;
			db.get(pid).then(function(pdata){
				var pdoc = [];
				var doc = [];
				pdoc.push(pdata.body);
				var tmpdoc = {
					"key": "Assessable Unit",
					"DocType": "Assessable Unit",
					"parentid": pdoc[0]._id,
					"DocSubType": req.body.docsubtype,
					"BusinessUnit": pdoc[0].BusinessUnit,
					"CurrentPeriod": pdoc[0].CurrentPeriod,
					"StatusChangeWho": curruser,
					"StatusChangeWhen": currdate,
					"WWBCITAssessmentStatus": "",
					"MIRAAssessmentStatus": "Draft",
					"PeriodRating": "",
					"AUNextQtrRating": "",
					"PeriodRatingPrev": "",
					"Target2Sat": "",
					"Target2SatPrev": "",
					"RatingJustification": ""
				};

				doc.push(tmpdoc);
				switch (doc[0].DocSubType) {
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
						doc[0].AuditProgram = req.body.AuditProgram;
						doc[0].ExcludeGeo = req.body.ExcludeGeo;
						break;
					case "Account":
            doc[0].ControllableUnit = pdoc[0].ControllableUnit;
            doc[0].Category = pdoc[0].Category;
            doc[0].AuditProgram = pdoc[0].AuditProgram;
						doc[0].Name = req.body.Name;
						doc[0].MetricsCriteria = req.body.MetricsCriteria;
						doc[0].MetricsValue = req.body.MetricsValue
					case "BU Reporting Group":
						doc[0].AuditProgram = req.body.AuditProgram;
						doc[0].Name = req.body.Name;
						break;
				}
				doc[0].Notes = req.body.Notes;
				doc[0].Links = eval(req.body.attachIDs);
				doc[0].Log = [];
				doc[0].Log.push(addlog);
        doc[0].Status = req.body.Status;

        doc[0].Owner = req.body.ownername;
        doc[0].Focals = req.body.focalslist;
        doc[0].Coordinators = req.body.coordinatorslist;
        doc[0].Readers = req.body.readerslist;

        doc[0].AdditionalReaders = req.body.readerlist;
				doc[0].AdditionalEditors = req.body.editorlist;

        if (pdoc[0].AllReaders == undefined) pdoc[0].AllReaders = [];
				doc[0].AllReaders = pdoc[0].AllReaders; //inherited reader access
        if (doc[0].AdditionalReaders != undefined && doc[0].AdditionalReaders != "") {
          doc[0].AdditionalReaders.split(',').forEach(function(entry) { doc[0].AllReaders.push(entry); });
          doc[0].AdditionalReaders = util.sort_unique(doc[0].AdditionalReaders.split(',')).join();
        }
        if (doc[0].Coordinators != undefined && doc[0].Coordinators != "")  {
          doc[0].Coordinators.split(',').forEach(function(entry) { doc[0].AllReaders.push(entry); });
          doc[0].Coordinators = util.sort_unique(doc[0].Coordinators.split(',')).join();
        }
        if (doc[0].Readers != undefined && doc[0].Readers != "") {
          doc[0].Readers.split(',').forEach(function(entry) { doc[0].AllReaders.push(entry); });
          doc[0].Readers = util.sort_unique(doc[0].Readers.split(',')).join();
        }
        doc[0].AllReaders = util.sort_unique(doc[0].AllReaders);

        if (pdoc[0].AllEditors == undefined) pdoc[0].AllEditors = [];
				doc[0].AllEditors = pdoc[0].AllEditors; //inherited reader access
        if (doc[0].Owner != undefined && doc[0].Owner != "") doc[0].AllEditors.push(doc[0].Owner);
        if (doc[0].AdditionalEditors != undefined && doc[0].AdditionalEditors != "") {
          doc[0].AdditionalEditors.split(',').forEach(function(entry) { doc[0].AllEditors.push(entry); });
          doc[0].AdditionalEditors = util.sort_unique(doc[0].AdditionalEditors.split(',')).join();
        }
        if (doc[0].Focals != undefined && doc[0].Focals != "") {
          doc[0].Focals.split(',').forEach(function(entry) { doc[0].AllEditors.push(entry); });
          doc[0].Focals = util.sort_unique(doc[0].Focals.split(',')).join();
        }
        doc[0].AllEditors = util.sort_unique(doc[0].AllEditors);

				db.save(doc[0]).then(function(data){
					deferred.resolve(data);
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err});
				});

			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err});
			});

		} else {

      // existing doc
			var obj = {
				selector:{
					"_id": docid,
				}
			};

			db.get(docid).then(function(data){
				var doc = [];
				doc.push(data.body);
				switch (doc[0].DocSubType) {
					case "Business Unit":
						doc[0].RGRollup = req.body.RGRollup;
						break;
					case "Sub-process":
					case "Global Process":
						doc[0].RGRollup = req.body.RGRollup;
						doc[0].BRGMembership = req.body.BRGMembership;
						break;
					case "BU IOT":
						doc[0].RGRollup = req.body.RGRollup;
						doc[0].BRGMembership = req.body.BRGMembership;
						doc[0].BUCountryIOT = req.body.BUCountryIOT;
						doc[0].Name = doc[0].BusinessUnit + " - " + doc[0].IOT;
						doc[0].Status = req.body.Status
						doc[0].Owner = req.body.ownername;
						doc[0].Focals = req.body.focalslist;
						doc[0].Coordinators = req.body.coordinatorslist;
	          doc[0].Readers = req.body.readerslist;
						break;
					case "BU IMT":
						doc[0].BRGMembership = req.body.BRGMembership;
						doc[0].IMTid = req.body.IMTid;
						doc[0].Name = doc[0].BusinessUnit + " - " + doc[0].IMT;
						doc[0].Status = req.body.Status
						doc[0].Owner = req.body.ownername;
						doc[0].Focals = req.body.focalslist;
						doc[0].Coordinators = req.body.coordinatorslist;
	          doc[0].Readers = req.body.readerslist;
						break;
					case "BU Country":
						doc[0].BRGMembership = req.body.BRGMembership;
						doc[0].Countryid = req.body.Countryid;
						doc[0].Name = doc[0].BusinessUnit + " - " + doc[0].Country;
						doc[0].AuditProgram = req.body.AuditProgram;
						doc[0].ExcludeGeo = req.body.ExcludeGeo;
						doc[0].Status = req.body.Status
						doc[0].Owner = req.body.ownername;
						doc[0].Focals = req.body.focalslist;
						doc[0].Coordinators = req.body.coordinatorslist;
	          doc[0].Readers = req.body.readerslist;
						break;
					case "Country Process":
						doc[0].BRGMembership = req.body.BRGMembership;
						doc[0].AuditableFlag = req.body.AuditableFlag;
						doc[0].CUFlag = req.body.CUFlag;
						doc[0].AuditProgram = req.body.AuditProgram;
						doc[0].CUSize = req.body.CUSize;
						break;
					case "Account":
						doc[0].Name = req.body.Name;
						doc[0].MetricsCriteria = req.body.MetricsCriteria;
						doc[0].MetricsValue = req.body.MetricsValue
						doc[0].Status = req.body.Status;
						doc[0].Owner = req.body.ownername;
						doc[0].Focals = req.body.focalslist;
						doc[0].Coordinators = req.body.coordinatorslist;
	          doc[0].Readers = req.body.readerslist;
					case "Controllable Unit":
						doc[0].BRGMembership = req.body.BRGMembership;
						doc[0].CUSize = req.body.CUSize;
						doc[0].LifetimeTCV= req.body.LifetimeTCV;
						doc[0].AuditableFlag = req.body.AuditableFlag;
						doc[0].AuditProgram = req.body.AuditProgram;
						doc[0].Portfolio = req.body.Portfolio;
						doc[0].ARCFrequency = req.body.ARCFrequency
						doc[0].MetricsCriteria = req.body.MetricsCriteria;
						doc[0].MetricsValue = req.body.MetricsValue;
						doc[0].ParentSubject = req.body.ParentSubject;
						doc[0].IOT = req.body.IOT;
						doc[0].IMT = req.body.IMT;
						doc[0].Country = req.body.Country;
						break;
					case "BU Reporting Group":
						doc[0].AuditProgram = req.body.AuditProgram;
						doc[0].Name = req.body.Name;
						doc[0].Status = req.body.Status;
						doc[0].Owner = req.body.ownername;
						doc[0].Focals = req.body.focalslist;
						doc[0].Coordinators = req.body.coordinatorslist;
	          doc[0].Readers = req.body.readerslist;
						break;
				}
				doc[0].Notes = req.body.Notes;
				doc[0].Links = eval(req.body.attachIDs);
				doc[0].Log.push(addlog);

        doc[0].AdditionalReaders = req.body.readerlist;
				doc[0].AdditionalEditors = req.body.editorlist;

        if (doc[0].AllReaders == undefined) doc[0].AllReaders = [];
        if (doc[0].AdditionalReaders != undefined && doc[0].AdditionalReaders != "") {
          doc[0].AdditionalReaders.split(',').forEach(function(entry) { doc[0].AllReaders.push(entry); });
          doc[0].AdditionalReaders = util.sort_unique(doc[0].AdditionalReaders.split(',')).join();
        }
        if (doc[0].Coordinators != undefined && doc[0].Coordinators != "")  {
          doc[0].Coordinators.split(',').forEach(function(entry) { doc[0].AllReaders.push(entry); });
          doc[0].Coordinators = util.sort_unique(doc[0].Coordinators.split(',')).join();
        }
        if (doc[0].Readers != undefined && doc[0].Readers != "") {
          doc[0].Readers.split(',').forEach(function(entry) { doc[0].AllReaders.push(entry); });
          doc[0].Readers = util.sort_unique(doc[0].Readers.split(',')).join();
        }
        doc[0].AllReaders = util.sort_unique(doc[0].AllReaders);

        if (doc[0].AllEditors == undefined) doc[0].AllEditors = [];
        if (doc[0].Owner != undefined && doc[0].Owner != "") doc[0].AllEditors.push(doc[0].Owner);
        if (doc[0].AdditionalEditors != undefined && doc[0].AdditionalEditors != "") {
          doc[0].AdditionalEditors.split(',').forEach(function(entry) { doc[0].AllEditors.push(entry); });
          doc[0].AdditionalEditors = util.sort_unique(doc[0].AdditionalEditors.split(',')).join();
        }
        if (doc[0].Focals != undefined && doc[0].Focals != "") {
          doc[0].Focals.split(',').forEach(function(entry) { doc[0].AllEditors.push(entry); });
          doc[0].Focals = util.sort_unique(doc[0].Focals.split(',')).join();
        }
        doc[0].AllEditors = util.sort_unique(doc[0].AllEditors);

				db.save(doc[0]).then(function(data){
					deferred.resolve(data);
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err});
				});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err});
			});
		}

		return deferred.promise;
	}
};

module.exports = assessableunit;
