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
var util = require('./class-utility.js');
var accessupdates = require('./class-accessupdates.js');
var fieldCalc = require('./class-fieldcalc.js');

var assessableunit = {

	/* Get assessable unit by ID */
	getAUbyID: function(req, db) {
		var deferred = q.defer();
		try{
			var docid = req.query.id
			db.get(docid).then(function(data){
				if(data.status==200 && !data.error) {
					var doc = [];
					doc.push(data.body);
					var constiobj = {};
					var toadd = {};
					var editors = doc[0].AdditionalEditors + doc[0].Owner + doc[0].Focals;

					/* CurrentPeriod of Assessable Units will always have the current period of the app */
					doc[0].CurrentPeriod = req.session.quarter;
					/* Get access and roles */
					//accessrules.getRules(req,editors);
					accessrules.getRules(req,docid,db,doc[0]).then(function (result){

					accessrules.rules = result.rules;

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

					/* Get Constituents Data*/
					switch (doc[0].DocSubType) {
						case "Sub-process":
						case "Account":
							//Dummy queries cause those docTypes don't have constituent documents.
							constiobj = {
								selector:{
									"_id": {"$gt":0},
									"BusinessUnit": doc[0].BusinessUnit,
									"key": "Assessable Unit",
									"parentid": doc[0]._id
								}
							};
							break;
						case "Business Unit":
							constiobj = {
								selector:{
									"Name": {"$gt":0},
									"_id": {"$gt":0},
									"BusinessUnit": doc[0].BusinessUnit,
									"$or":
										[	{ "$and":
												[	{"key": "Assessable Unit"},
													{"parentid": doc[0]._id},
													{"$or":
														[
															{"DocSubType":{"$or": ["Global Process","BU Reporting Group","BU IOT"] }},
															{"$and": [{"DocSubType":"Controllable Unit"},{"ParentDocSubType": "Business Unit"}]}
														]
													}
												]
											}
										]
								},
								"sort": [{"Name": "asc"}]
							};
							doc[0].GPData = [];
							doc[0].BUIOTData = [];
							doc[0].RGData = [];
							doc[0].CUData = [];
							break;
						case "Global Process":
							constiobj = {
								selector:{
									"Name": {"$gt":0},
									"_id": {"$gt":0},
									"BusinessUnit": doc[0].BusinessUnit,
									"GlobalProcess": doc[0].GlobalProcess,
									"$or": [
										{ "$and": [{"key": "Assessable Unit"},{"parentid": doc[0]._id},{"DocSubType": {"$or":["Country Process","Sub-process"]}}] }
									]
								},
								"sort": [{"Name": "asc"}]
							};
							doc[0].CPData = [];
							doc[0].SPData = [];
							break;
						case "BU IOT":
							constiobj = {
								selector:{
									"Name": {"$gt":0},
									"_id": {"$gt":0},
									"BusinessUnit": doc[0].BusinessUnit,
									"key": "Assessable Unit",
									"parentid": doc[0]._id,
									"DocSubType": {"$or":["BU IMT","Controllable Unit"]}
								},
								"sort": [{"Name": "asc"}]
							};
							doc[0].BUIMTData = [];
							doc[0].CUData = [];
							break;
						case "BU IMT":
							constiobj = {
								selector:{
									"Name": {"$gt":0},
									"_id": {"$gt":0},
									"BusinessUnit": doc[0].BusinessUnit,
									"$or": [
										{ "$and": [{"key": "Assessable Unit"},{"parentid": doc[0]._id},{"DocSubType": {"$or":["BU Country","Controllable Unit"]}}] }
									]
								},
								"sort": [{"Name": "asc"}]
							};
							doc[0].BUCountryData = [];
							doc[0].CUData = [];
							break;
						case "BU Country":
							constiobj = {
								selector:{
									"Name": {"$gt":0},
									"_id": {"$gt":0},
									"BusinessUnit": doc[0].BusinessUnit,
									"$or": [
										{ "$and": [{"key": "Assessable Unit"},{"parentid": doc[0]._id},{"DocSubType": "Controllable Unit"}] },
										{ "$and": [{"key": "Assessable Unit"},{"Country": util.resolveGeo(doc[0].Country, "Country",req)},{"DocSubType": "Country Process"}] }
									]
								},
								"sort": [{"Name": "asc"}]
							};
							doc[0].CPData = [];
							doc[0].CUData = [];
							break;
						case "Controllable Unit":
							constiobj = {
								selector:{
									"Name": {"$gt":0},
									"_id": {"$gt":0},
									"BusinessUnit": doc[0].BusinessUnit,
									"parentid": doc[0]._id,
									"$or": [
										{ "$and": [{"key": "Assessable Unit"},{"parentid": doc[0]._id},{"DocSubType": "Account"}] }
									]
								},
								"sort": [{"Name": "asc"}]
							};
							doc[0].AccountData = [];
							break;
						case "Country Process":
							constiobj = {
								selector:{
									"Name": {"$gt":0},
									"_id": {"$gt":0},
									"BusinessUnit": doc[0].BusinessUnit,
									"$or": [
										{ "$and": [{"key": "Assessable Unit"},{"parentid": doc[0]._id},{"DocSubType": "Controllable Unit"},{"RelevantCP": {"$in": [doc[0].Name]}}] }
									]
								},
								"sort": [{"Name": "asc"}]
							};

							doc[0].ControlData = [];
							doc[0].CUData = [];
							break;
						case "BU Reporting Group":
							constiobj = {
								selector:{
									"Name": {"$gt":0},
									"_id": {"$gt":0},
									"BusinessUnit": doc[0].BusinessUnit,
									"$or": [
										{ "$and": [ {"key": "Assessable Unit"},{"DocSubType": {"$or":["Controllable Unit","Country Process","BU Country","BU IMT","BU IOT","GlobalProcess"]}},{"BRGMembership": {"$regex": "(?i)"+doc[0]._id+"(?i)"}} ] }
									]
								},
								"sort": [{"Name": "asc"}]
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
						if(constidata.status==200 && !constidata.error) {
							var constidocs = constidata.body.docs;
							doc[0].AssessmentData = [];
							var constiAsmtsIds = [];
							var hasCurQAsmt = false;
							for (var i = 0; i < constidocs.length; ++i) {
								//Constituents documents
								constiAsmtsIds.push(constidocs[i]._id) // used in getting the current quarter asmts of the constituent asmts
								if(constidocs[i].DocSubType == "BU IOT"){
										constidocs[i].Name = req.session.buname + " - " + util.resolveGeo(constidocs[i].IOT, "IOT",req);
								}else if(constidocs[i].DocSubType == "BU IMT"){
										constidocs[i].Name = req.session.buname + " - " + util.resolveGeo(constidocs[i].IMT, "IMT",req);
								}else if(constidocs[i].DocSubType == "BU Country"){
										constidocs[i].Name = req.session.buname + " - " + util.resolveGeo(constidocs[i].Country, "Country",req);
								}
								toadd = {
									"docid": constidocs[i]._id,
									"Name": constidocs[i].Name,
									"Status": constidocs[i].Status,
									"PeriodRatingPrev": "",
									"PeriodRating": "",
									"AUNextQtrRating": "",
									"Target2Sat": ""
								};
								if(constidocs[i].DocSubType == "Global Process") doc[0].GPData.push(toadd);
								else if(constidocs[i].DocSubType == "BU IOT") doc[0].BUIOTData.push(toadd);
								else if(constidocs[i].DocSubType == "BU IMT") doc[0].BUIMTData.push(toadd);
								else if(constidocs[i].DocSubType == "BU Country") doc[0].BUCountryData.push(toadd);
								else if(constidocs[i].DocSubType == "BU Reporting Group") doc[0].RGData.push(toadd);
								else if(constidocs[i].DocSubType == "Account") doc[0].AccountData.push(toadd);
								else if(constidocs[i].DocSubType == "Country Process") doc[0].CPData.push(toadd);
								else if(constidocs[i].DocSubType == "Controllable Unit") doc[0].CUData.push(toadd);
								else doc[0].SPData.push(toadd);
							}
							
							/* Calculate for Instance Design Specifics and parameters*/
							doc[0].EnteredBU = doc[0].MIRABusinessUnit;
							/* Get current qtr and previous qtr assessments of constituent units */
							var prevQtr = fieldCalc.getPrevQtr(doc[0].CurrentPeriod);
							constiAsmtsIds.push(doc[0]._id) // for the assessments of the assessable unit
							var constiasmtsobj = {
								selector:{
									"_id": {"$gt":0},
									"parentid": {"$in":constiAsmtsIds},
									"key": "Assessment",
									"CurrentPeriod": {"$in":[doc[0].CurrentPeriod,prevQtr]}
								}
							};
							db.find(constiasmtsobj).then(function(constiasmtdata) {
								if(constiasmtdata.status==200 && !constiasmtdata.error) {
									var constiasmtdocs = constiasmtdata.body.docs;
									// Get data from asmts of constituent units
									for (var i = 0; i < constiasmtdocs.length; ++i) {
										//Get assessment information of current AU
										if (doc[0]._id == constiasmtdocs[i].parentid) {
											toadd = {
												"docid": constiasmtdocs[i]._id,
												"CurrentPeriod": constiasmtdocs[i].CurrentPeriod,
												"PeriodRating": constiasmtdocs[i].PeriodRating,
												"Owner": constiasmtdocs[i].Owner,
												"Target2Sat": constiasmtdocs[i].Target2Sat
											};
											doc[0].AssessmentData.push(toadd);
											if (constiasmtdocs[i].CurrentPeriod ==  doc[0].CurrentPeriod) {
												hasCurQAsmt = true;
												if (doc[0].WWBCITKey == undefined || doc[0].WWBCITKey == "") {
													doc[0].RatingJustification = constiasmtdocs[i].MIRARatingJustification;
												} else {
													if (constiasmtdocs[i].WWBCITStatus != "Draft") {
														doc[0].RatingJustification = constiasmtdocs[i].WWBCITRatingJustification;
													} else {
														doc[0].RatingJustification = constiasmtdocs[i].MIRARatingJustification;
													}
												}
											}
										}
										//Load information of Constituent AU's assessments
										if (doc[0].CPData !== undefined) fieldCalc.addConstiDocData(doc, "CPData", constiasmtdocs[i], prevQtr);
										if (doc[0].CUData !== undefined) fieldCalc.addConstiDocData(doc, "CUData", constiasmtdocs[i], prevQtr);
										if (doc[0].GPData !== undefined) fieldCalc.addConstiDocData(doc, "GPData", constiasmtdocs[i], prevQtr);
										if (doc[0].BUIOTData !== undefined) fieldCalc.addConstiDocData(doc, "BUIOTData", constiasmtdocs[i], prevQtr);
										if (doc[0].BUIMTData !== undefined) fieldCalc.addConstiDocData(doc, "BUIMTData", constiasmtdocs[i], prevQtr);
										if (doc[0].BUCountryData !== undefined) fieldCalc.addConstiDocData(doc, "BUCountryData", constiasmtdocs[i], prevQtr);
										if (doc[0].RGData !== undefined) fieldCalc.addConstiDocData(doc, "RGData", constiasmtdocs[i], prevQtr);
										if (doc[0].AccountData !== undefined) fieldCalc.addConstiDocData(doc, "AccountData", constiasmtdocs[i], prevQtr);
										if (doc[0].SPData !== undefined) fieldCalc.addConstiDocData(doc, "SPData", constiasmtdocs[i], prevQtr);
									}

									/* Check if user can create assessment */
									if (
											(doc[0].WWBCITKey == undefined || doc[0].WWBCITKey == "") &&
											doc[0].Status == "Active" &&
											hasCurQAsmt == false &&
											(doc[0].editor || doc[0].admin) &&
											(doc[0].DocSubType == "BU Country" || doc[0].DocSubType == "BU IMT" || doc[0].DocSubType == "BU IOT" || doc[0].DocSubType == "BU Reporting Group" || doc[0].DocSubType == "Account")
										 ) {
										doc[0].CreateAsmt = true;
									}

									fieldCalc.getDocParams(req, db, doc).then(function(data) {
										if(!data.error){
											/* Define if ARCFrequency is displayed */
											if (doc[0].BusinessUnitOLD == "GTS" && doc[0].DocSubType == "Controllable Unit") {
												if ((doc[0].Category == "SO" || doc[0].Category == "IS" || doc[0].Category == "ITS" || doc[0].Category == "TSS" || doc[0].Category == "GPS"))
													doc[0].showARCFreq = 1;
											}
											/* Define if document is in edit mode */
											if(req.query.edit != undefined && doc[0].editor)	doc[0].editmode = 1;
											/* Get Reporting Groups */
											//doc[0].admin = false;
											assessableunit.getReportingGroups(req, db, doc[0].MIRABusinessUnit).then(function(resdata) {
												if(resdata.status==200 && !resdata.error){
													//Load Reporting groups list - for edit/read mode
													doc[0].ReportingGroupList = [];
													doc[0].ReportingGroupList = resdata.doc;
													switch (doc[0].DocSubType) {
														case "Business Unit":
															if(req.query.edit == undefined || ( req.query.edit != undefined && doc[0].editor && !doc[0].admin)){
																doc[0].RGRollupDisp = assessableunit.getNames(doc[0].ReportingGroupList, doc[0].RGRollup, "docid","name");
															}
															deferred.resolve({"status": 200, "doc": doc});
															break;
														case "Global Process":
														case "Sub-process":
															if(req.query.edit == undefined || ( req.query.edit != undefined && doc[0].editor && !doc[0].admin)){
																doc[0].RGRollupDisp = assessableunit.getNames(doc[0].ReportingGroupList, doc[0].RGRollup, "docid","name");
																doc[0].BRGMembershipDisp = assessableunit.getNames(doc[0].ReportingGroupList, doc[0].BRGMembership, "docid", "name");
															}
															deferred.resolve({"status": 200, "doc": doc});
															break;
														case "Country Process":
															//Get IA Data
															assessableunit.getInternalAudits(req, db).then(function(dataIntAud) {
																if(dataIntAud.status==200 && !dataIntAud.error){
																	doc[0].IntAud = [];
																	doc[0].IntAud = dataIntAud.doc;
																	//IA Data
																	doc[0].InternalAuditsDataDisp = assessableunit.getIADisplay(dataIntAud.docList, doc[0].InternalAuditsData);
																	//Edit but not Admin - Reader
																	if(req.query.edit == undefined || ( req.query.edit != undefined && doc[0].editor && !doc[0].admin)){
																		doc[0].BRGMembershipDisp = assessableunit.getNames(doc[0].ReportingGroupList, doc[0].BRGMembership, "docid", "name");

																		deferred.resolve({"status": 200, "doc": doc});
																	}
																	else{
																		deferred.resolve({"status": 200, "doc": doc});
																	}
																}
																else{
																	deferred.reject({"status": 500, "error": dataIntAud.error});
																}
															}).catch(function(err) { // end assessableunit.getInternalAudits
																console.log("[assessableunit][getInternalAudits]" + err.error.reason);
																deferred.reject({"status": 500, "error": err.error.reason});
															});
															break;
														case "Account":
															//CUPList
															assessableunit.getPortfolioCUs(req, db, doc[0].MIRABusinessUnit).then(function(cudata) {
																if(cudata.status==200 && !cudata.error){
																	doc[0].CUPList = cudata.doc;
																	//Load CU name read mode
																	if(req.query.edit == undefined){
																		doc[0].ControllableUnit = assessableunit.getNames(doc[0].CUPList, doc[0].parentid, "_id", "Name");
																	}
																	//ALL Key List not for GBS
																	if(doc[0].BusinessUnit != "GBS"){
																		//ALL Key List
																		assessableunit.getALLKey(req, db, doc[0].MIRABusinessUnit).then(function(adata) {
																			if(adata.status==200 && !adata.error){
																				doc[0].lessonsList = adata.doc;
																				//AuditLessonsKey for read mode - or edit non admin user
																				if(req.query.edit == undefined || ( req.query.edit != undefined && doc[0].editor && !doc[0].admin)){
																					doc[0].AuditLessonsKey = assessableunit.getNames(doc[0].lessonsList, doc[0].AuditLessonsKey, "id", "option");
																				}
																				deferred.resolve({"status": 200, "doc": doc});
																			}
																			else{
																				deferred.reject({"status": 500, "error": adata.error});
																			}
																		}).catch(function(err) { // end assessableunit.getALLKey
																			console.log("[assessableunit][getALLKey]" + err.error.reason);
																			deferred.reject({"status": 500, "error": err.error.reason});
																		});
																	}
																	else{
																		deferred.resolve({"status": 200, "doc": doc});
																	}
																}
																else{
																	deferred.reject({"status": 500, "error": cudata.error});
																}
															}).catch(function(err) { // end assessableunit.getPortfolioCUs
																console.log("[assessableunit][getPortfolioCUs]" + err.error.reason);
																deferred.reject({"status": 500, "error": err.error.reason});
															});
															break;
														case "Controllable Unit":
															//Get Parent Document
															assessableunit.getParentCU(req, db, doc[0].parentid).then(function(pcudata) {
																if(pcudata.status==200 && !pcudata.error){
																	var resdoc = pcudata.doc[0];
																	doc[0].ParentSubject = resdoc.Name;
																	doc[0].ParentDocSubType = resdoc.DocSubType;
																	if (resdoc.DocSubType != "Business Unit") {
																		doc[0].IOT = resdoc.IOT;
																		if(doc[0].ParentDocSubType == "BU IMT"){
																			doc[0].IMT = resdoc.IMT;
																		}
																		if(doc[0].ParentDocSubType == "BU Country"){
																			doc[0].IMT = resdoc.IMT;
																			doc[0].Country = resdoc.Country;
																			doc[0].CountryDisp = util.resolveGeo(doc[0].Country, "Country", req)
																		}
																	}
																	//Get ALL Keys
																	assessableunit.getALLKey(req, db, doc[0].MIRABusinessUnit).then(function(adata) {
																		if(adata.status==200 && !adata.error){
																			doc[0].lessonsList = adata.doc;
																			//Get ALL Keys
																			assessableunit.getSubprocess(req, db, doc[0].MIRABusinessUnit).then(function(spdata) {
																				if(spdata.status==200 && !spdata.error){
																					doc[0].subprocessList = spdata.doc;
																					//Get IA Data
																					assessableunit.getInternalAudits(req, db).then(function(dataIntAud) {
																						if(dataIntAud.status==200 && !dataIntAud.error){
																							doc[0].IntAud = [];
																							doc[0].IntAud = dataIntAud.doc;
																							//IA Data
																							doc[0].InternalAuditsDataDisp = assessableunit.getIADisplay(dataIntAud.docList, doc[0].InternalAuditsData);
																							//Edit && Admin
																							if(req.query.edit != undefined && doc[0].editor && doc[0].admin){
																								//Get CU Parents List
																								assessableunit.getCUParents(req, db, doc[0].MIRABusinessUnit).then(function(dataCP) {
																									if(dataCP.status==200 && !dataCP.error){
																										doc[0].CUParents = [];
																										doc[0].CUParents = dataCP.doc;
																										deferred.resolve({"status": 200, "doc": doc});
																									}
																									else{
																										deferred.reject({"status": 500, "error": dataCP.error});
																									}
																								}).catch(function(err) {
																									console.log("[assessableunit][CUParentList]" + err.error.reason);
																									deferred.reject({"status": 500, "error": err.error.reason});
																								});
																							}
																							//Edit non admin - Read
																							else{
																								//ALL keys
																								if(doc[0].MIRABusinessUnit != "GBS"){
																									doc[0].AuditLessonsKey = assessableunit.getNames(doc[0].lessonsList, doc[0].AuditLessonsKey, "id", "option");
																								}
																								//Sub-process keys
																								if(doc[0].MIRABusinessUnit == "GTS Transformation"){
																									doc[0].SubprocessDisp = assessableunit.getNames(doc[0].subprocessList, doc[0].subprocess, "WWBCITKey", "Name");
																								}

																								//BU reporting groups
																								doc[0].BRGMembershipDisp = assessableunit.getNames(doc[0].ReportingGroupList, doc[0].BRGMembership, "docid", "name");

																								deferred.resolve({"status": 200, "doc": doc});
																							}
																						}
																						else{
																							deferred.reject({"status": 500, "error": dataIntAud.error});
																						}
																					}).catch(function(err) { // end assessableunit.getInternalAudits
																						console.log("[assessableunit][getInternalAudits]" + err.error.reason);
																						deferred.reject({"status": 500, "error": err.error.reason});
																					});
																				}
																				else{
																					deferred.reject({"status": 500, "error": spdata.error});
																				}
																			}).catch(function(err) { // end assessableunit.getSubprocess
																				console.log("[assessableunit][getSubprocess]" + err.error.reason);
																				deferred.reject({"status": 500, "error": err.error.reason});
																			});
																		}
																		else{
																			deferred.reject({"status": 500, "error": adata.error});
																		}
																	}).catch(function(err) { // end assessableunit.getALLKey
																		console.log("[assessableunit][getALLKey]" + err.error.reason);
																		deferred.reject({"status": 500, "error": err.error.reason});
																	});
																}
																else{
																	deferred.reject({"status": 500, "error": pcudata.error});
																}
															}).catch(function(err) { // end assessableunit.getParentCU
																console.log("[assessableunit][getParentCU]" + err.error.reason);
																deferred.reject({"status": 500, "error": err.error.reason});
															});
															break;
														case "BU IOT":
															//Get BU Country list
															doc[0].BUCountryList = [];
															assessableunit.getBUCountry(req, db, doc[0].MIRABusinessUnit).then(function(bucdata) {
																if(bucdata.status==200 && !bucdata.error){
																	doc[0].BUCountryList = bucdata.doc;
																	doc[0].IOT = util.resolveGeo(doc[0].IOT, "IOT",req);
																	doc[0].Name = req.session.buname + " - " + doc[0].IOT;

																	if(req.query.edit == undefined || ( req.query.edit != undefined && doc[0].editor && !doc[0].admin)){
																		doc[0].BUCountryIOTDisp = assessableunit.getNames(doc[0].BUCountryList, doc[0].BUCountryIOT, "docid", "name");
																		doc[0].BRGMembershipDisp = assessableunit.getNames(doc[0].ReportingGroupList, doc[0].BRGMembership, "docid", "name");
																		doc[0].RGRollupDisp = assessableunit.getNames(doc[0].ReportingGroupList, doc[0].RGRollup, "docid", "name");
																	}
																	deferred.resolve({"status": 200, "doc": doc});
																}
																else{
																	deferred.reject({"status": 500, "error": bucdata.error});
																}
															}).catch(function(err) { // end assessableunit.getBUCountry
																console.log("[assessableunit][getBUCountry]" + err.error.reason);
																deferred.reject({"status": 500, "error": err.error.reason});
															});
															break;
														case "BU IMT":
														case "BU Country":
															doc[0].IOT = util.resolveGeo(doc[0].IOT, "IOT", req);
															doc[0].IMT = util.resolveGeo(doc[0].IMT, "IMT", req);
															if (doc[0].DocSubType == "BU IMT") {
																doc[0].Name = req.session.buname + " - " + doc[0].IMT;
																doc[0].BUIOT = req.session.buname + " - " + doc[0].IOT;
															} else {
																doc[0].Country = util.resolveGeo(doc[0].Country,"Country",req);
																doc[0].BUIMT = req.session.buname + " - " + doc[0].IMT;
																doc[0].Name = req.session.buname + " - " + doc[0].Country;
															}
															if(req.query.edit == undefined || ( req.query.edit != undefined && doc[0].editor && !doc[0].admin)){
																doc[0].BRGMembershipDisp = assessableunit.getNames(doc[0].ReportingGroupList, doc[0].BRGMembership, "docid", "name");
															}
															deferred.resolve({"status": 200, "doc": doc});
															break;

														default:
															deferred.resolve({"status": 200, "doc": doc});
															break;
													}
												}
												else{
													deferred.reject({"status": 500, "error": resdata.error});
												}

											}).catch(function(err) { // end assessableunit.getReportingGroups
												console.log("[assessableunit][ReportingGroupList]" + err.error.reason);
												deferred.reject({"status": 500, "error": err.error.reason});
											});

										}
										else{
											deferred.reject({"status": 500, "error": data.error});
										}
									}).catch(function(err) { //end fieldCalc.getDocParams
										console.log("[assessableunit][getDocParams]" + err.error.reason);
										deferred.reject({"status": 500, "error": err.error.reason});
									});

								}
								else{
									deferred.reject({"status": 500, "error": data.error});
								}
							}).catch(function(err) {
								console.log("[assessableunit][getconstiasmtsobj]" + err.error.reason);
								deferred.reject({"status": 500, "error": err.error.reason});
							});

						}
						else{
							deferred.reject({"status": 500, "error": constidata.error});
						}
					}).catch(function(err) {
						console.log("[assessableunit][constituents]" + err.error.reason);
						deferred.reject({"status": 500, "error": err.error.reason});
					});

					}).catch(function(err) {
						console.log("[assessableunit][accessRules]" + err.error.reason);
						deferred.reject({"status": 500, "error": err.error.reason});
					});

				}
				else{
					deferred.reject({"status": 500, "error": data.error});
				}
			}).catch(function(err) {
				console.log("[assessableunit][getAUbyID]" + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}
		catch(e){
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	/* New assessable unit via parent ID */
	newAUbyPID: function(req, db) {
		var deferred = q.defer();
		try{
			var pid = req.query.pid
			db.get(pid).then(function(data){
				if(data.status==200 && !data.error) {
					var pdoc = [];
					var doc = [];
					pdoc.push(data.body);
					var peditors = pdoc[0].AdditionalEditors + pdoc[0].Owner + pdoc[0].Focals;
					/* Check if user is admin to the parent doc where the new unit is created from */
					//accessrules.getRules(req,peditors);
					accessrules.getRules(req,pid,db,pdoc[0]).then(function (result){

						accessrules.rules = result.rules;

					if (accessrules.rules.admin) {
						var tmpdoc = {
							"key": "Assessable Unit",
							"DocType": "Assessable Unit",
							"parentid": pid,
							"DocSubType": req.query.docsubtype,
							"BusinessUnit": pdoc[0].BusinessUnit,
							"Status": "Active",
							"editmode": 1,
							"admin": 1,
							"grantaccess": 1,
							"MIRAunit": 1,
							"newunit": 1,
							"MIRABusinessUnit": pdoc[0].MIRABusinessUnit,
							"EnteredBU": pdoc[0].MIRABusinessUnit
						};

						doc.push(tmpdoc);
						/* CurrentPeriod of Assessable Units will always have the current period of the app */
						doc[0].CurrentPeriod = req.session.quarter;
						if (doc[0].DocSubType == "Business Unit")
							doc[0].BUWWBCITKey = pdoc[0].WWBCITKey;
						else
							doc[0].BUWWBCITKey = pdoc[0].BUWWBCITKey;


						/* Get Reporting groups */
						assessableunit.getReportingGroups(req, db, doc[0].MIRABusinessUnit).then(function(resdata) {
							if(resdata.status==200 && !resdata.error){
								//Load Reporting groups list - for edit/read mode
								doc[0].ReportingGroupList = [];
								doc[0].ReportingGroupList = resdata.doc;

								switch (doc[0].DocSubType) {
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
										//ALL keys not for GBS
										if(doc[0].MIRABusinessUnit != "GBS"){
											//Get ALL Keys
											assessableunit.getALLKey(req, db, doc[0].MIRABusinessUnit).then(function(adata) {
												if(adata.status==200 && !adata.error){
													doc[0].lessonsList = adata.doc;
													deferred.resolve({"status": 200, "doc": doc});
												}
												else{
													deferred.reject({"status": 500, "error": adata.error});
												}
											}).catch(function(err) { // end assessableunit.getALLKey
												console.log("[assessableunit][getALLKey]" + err.error.reason);
												deferred.reject({"status": 500, "error": err.error.reason});
											});
										}
										else{
											deferred.resolve({"status": 200, "doc": doc});
										}
										break;
									case "BU IOT":
										doc[0].BUCountryList = [];
										doc[0].IOTList = [];
										doc[0].IOTAUList = [];

										//Get BU Country list
										assessableunit.getBUCountry(req, db, doc[0].MIRABusinessUnit).then(function(bucdata) {
											if(bucdata.status==200 && !bucdata.error){
												doc[0].BUCountryList = bucdata.doc;
												//Get BU IOTs available
												assessableunit.getMIRABUs(req, db, doc[0].MIRABusinessUnit, "BU IOT").then(function(buiotdata) {
													if(buiotdata.status==200 && !buiotdata.error){
														var resdocs = buiotdata.doc;
														for (var i = 0; i < resdocs.length; ++i) {
															if (resdocs[i].IOT != undefined){
																doc[0].IOTAUList.push({"iotid":resdocs[i].IOT});
															}
														}
														var tmpIOT = [];
														for(var tmp in global.hierarchy.BU_IOT){
															tmpIOT.push({"docid":tmp, "name":global.hierarchy.BU_IOT[tmp].IOT});
														}
														doc[0].IOTList = tmpIOT;
														//Remove an IOT from list if it already exists
														for (var i = 0; i < doc[0].IOTAUList.length; ++i) {
															util.findAndRemove(doc[0].IOTList,'docid',doc[0].IOTAUList[i].iotid)
														}
														doc[0].IOT = util.resolveGeo(pdoc[0].IOT, "IOT",req);
														deferred.resolve({"status": 200, "doc": doc});
													}
													else{
														deferred.reject({"status": 500, "error": buiotdata.error});
													}
												}).catch(function(err) {// end get BU IOT
													console.log("[assessableunit][IOTLists][NewIOT]" + err.error.reason);
													deferred.reject({"status": 500, "error": err.error.reason});
												});
											}
											else{
												deferred.reject({"status": 500, "error": bucdata.error});
											}
										}).catch(function(err) { // end assessableunit.getBUCountry
											console.log("[assessableunit][getBUCountry]" + err.error.reason);
											deferred.reject({"status": 500, "error": err.error.reason});
										});


										break;
									case "BU IMT":
										doc[0].IOT = util.resolveGeo(pdoc[0].IOT, "IOT",req);
										//Documents are without IOT ids
										if(doc[0].IOT == "") doc[0].IOT= pdoc[0].IOT
										doc[0].IMTList = [];
										doc[0].IMTAUList = [];
										//Get BU IMTs available
										assessableunit.getMIRABUs(req, db, doc[0].MIRABusinessUnit, "BU IMT").then(function(buimtdata) {
											if(buimtdata.status==200 && !buimtdata.error){
												var resdocs = buimtdata.doc;
												for (var i = 0; i < resdocs.length; ++i) {
													doc[0].IMTAUList.push({"imtid":resdocs[i].IMT});
												}
												doc[0].IMTList = util.getIOTChildren(pdoc[0].IOT,"IOT",req);
												for (var i = 0; i < doc[0].IMTAUList.length; ++i) {
													util.findAndRemove(doc[0].IMTList,'docid',doc[0].IMTAUList[i].imtid)
												}
												//Documents are without IOT ids
												doc[0].IOTDisplay = util.resolveGeo(pdoc[0].IOT, "IOT",req);
												doc[0].BUIOT = req.session.buname + " - " + doc[0].IOT;
												deferred.resolve({"status": 200, "doc": doc});
											}
											else{
												deferred.reject({"status": 500, "error": buimtdata.error});
											}
										}).catch(function(err) {
											console.log("[assessableunit][IMTLists][NewIMT]" + err.error.reason);
											deferred.reject({"status": 500, "error": err.error.reason});
										});
										break;
									case "BU Country":
										doc[0].CountryList = [];
										doc[0].CountryAUList = [];
										//Get BU Countries available
										assessableunit.getMIRABUs(req, db, doc[0].MIRABusinessUnit, "BU Country").then(function(bucdata) {
											if(bucdata.status==200 && !bucdata.error){
												var resdocs = bucdata.doc;
												for (var i = 0; i < resdocs.length; ++i) {
													doc[0].CountryAUList.push({"countryid":resdocs[i].Country});
												}
												doc[0].CountryList = util.getIOTChildren(pdoc[0].IMT,"IMT",req);
												for (var i = 0; i < doc[0].CountryAUList.length; ++i) {
													util.findAndRemove(doc[0].CountryList,'docid',doc[0].CountryAUList[i].countryid)
												}
												doc[0].IOT = util.resolveGeo(pdoc[0].IOT, "IOT",req);
												doc[0].IMT = util.resolveGeo(pdoc[0].IMT,"IMT",req);
												doc[0].BUIMT = req.session.buname + " - " + doc[0].IMT;
												deferred.resolve({"status": 200, "doc": doc});
											}
											else{
												deferred.reject({"status": 500, "error": bucdata.error});
											}
										}).catch(function(err) {
											console.log("[assessableunit][BUCountryLists][NewBUCountry]" + err.error.reason);
											deferred.reject({"status": 500, "error": err.error.reason});
										});
										break;
									default:
										deferred.resolve({"status": 200, "doc": doc});
										break;
								}
							}
							else {
								console.log("[assessableunit][newAUbyPID][getReportingGroups]" + resdata.error);
								deferred.reject({"status": 500, "error": resdata.error});
							}
						}).catch(function(err) { // end assessableunit.getReportingGroups
							console.log("[assessableunit][newAUbyPID][getReportingGroups]" + err.error.reason);
							deferred.reject({"status": 500, "error": err.error.reason});
						});
					}
					else {
						console.log("[assessableunit][validateAdmin] - " + "Access denied!");
						deferred.reject({"status": 500, "error": "Access denied!"});
					}


					}).catch(function(err) {
						console.log("[assessableunit][accessRules] - " + err.error.reason);
						deferred.reject({"status": 500, "error": err.error.reason});
					});

					//here
				}


				else {
					console.log("[assessableunit][getParent] - " + data.error);
					deferred.reject({"status": 500, "error": data.error});
				}
			}).catch(function(err) {
				console.log("[assessableunit][newAUbyPID] - " + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			console.log("[assessableunit][newAUbyPID] - " + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	/* Update assessable unit */
	saveAUBU: function(req, db) {
		var deferred = q.defer();
		try{
			var now = moment(new Date());
			var docid = req.body.docid;
			var curruser = req.session.user.notesId;
			var currdate = now.format("MM/DD/YYYY");
			var addlog = {
				"name": curruser,
				"date": util.getDateTime("","date"),
				"time": util.getDateTime("","time")
			};

			if (docid == "") {
				// new document - for MIRA only units only
				var pid = req.body.parentid;
				db.get(pid).then(function(pdata){
					if(pdata.status==200 && !pdata.error) {
						var pdoc = [];
						var doc = [];
						pdoc.push(pdata.body);
						var tmpdoc = {
							"key": "Assessable Unit",
							"DocType": "Assessable Unit",
							"parentid": pdoc[0]._id,
							"DocSubType": req.body.docsubtype,
							"BusinessUnit": pdoc[0].BusinessUnit,
							"MIRABusinessUnit": pdoc[0].MIRABusinessUnit,
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
								doc[0].LevelType = "2";
								doc[0].RGRollup = req.body.RGRollup;
								doc[0].BRGMembership = req.body.BRGMembership;
								doc[0].BUCountryIOT = req.body.BUCountryIOT;
								doc[0].IOT = req.body.IOT;
								doc[0].Name = req.session.buname + " - " + util.resolveGeo(doc[0].IOT, "IOT",req);
								doc[0].BUWWBCITKey = pdoc[0].WWBCITKey;
								break;
							case "BU IMT":
								doc[0].LevelType = "3";
								doc[0].BRGMembership = req.body.BRGMembership;
								doc[0].IOT = pdoc[0].IOT;
								doc[0].IMT = req.body.IMT;
								doc[0].Name = req.session.buname + " - " + util.resolveGeo(doc[0].IMT, "IMT",req);
								doc[0].BUWWBCITKey = pdoc[0].BUWWBCITKey;
								break;
							case "BU Country":
								doc[0].LevelType = "4";
								doc[0].BRGMembership = req.body.BRGMembership;
								doc[0].IOT = pdoc[0].IOT;
								doc[0].IMT = pdoc[0].IMT;
								doc[0].Country = req.body.Country;
								doc[0].Name = req.session.buname + " - " + util.resolveGeo(doc[0].Country, "Country",req);
								doc[0].ExcludeGeo = req.body.ExcludeGeo;
								doc[0].BUWWBCITKey = pdoc[0].BUWWBCITKey;
								break;
							case "Account":
								var levelT = parseInt(pdoc[0].LevelType) + 1;
								doc[0].LevelType = levelT.toString();
								doc[0].ControllableUnit = pdoc[0].ControllableUnit;
								doc[0].Category = pdoc[0].Category;
								doc[0].AuditProgram = pdoc[0].AuditProgram;
								doc[0].Name = req.body.Name;
								doc[0].MetricsCriteria = req.body.MetricsCriteria;
								doc[0].MetricsValue = req.body.MetricsValue;
								doc[0].ControllableUnit = req.body.ControllableUnit;
								doc[0].parentid = req.body.parentid;
								doc[0].OpMetricKey = req.body.OpMetricKey;
								doc[0].CUWWBCITKey = pdoc[0].WWBCITKey;
								//ALL keys
								if(doc[0].MIRABusinessUnit != "GBS"){
									doc[0].AuditLessonsKey = req.body.AuditLessonsKey;
								}
								break;
							case "BU Reporting Group":
								doc[0].LevelType = "1";
								doc[0].AuditProgram = req.body.AuditProgram;
								doc[0].Name = req.body.Name;
								doc[0].DocRPType = "BU Mixed-Level Group";
								break;
						}
						doc[0].Notes = req.body.Notes;
						doc[0].Links = eval(req.body.attachIDs);
						doc[0].Log = [];
						doc[0].Log.push(addlog);
						doc[0].Status = req.body.Status;

						doc = accessupdates.updateAccessNewDoc(req,pdoc,doc);

						db.save(doc[0]).then(function(data){
							deferred.resolve(data);
						}).catch(function(err) {
							deferred.reject({"status": 500, "error": err.error.reason});
						});

					}
					else {
						deferred.reject({"status": 500, "error": data.error});
					}
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});

			}

			else{
				// existing doc
				db.get(docid).then(function(data){
					if(data.status==200 && !data.error) {
						var doc = [];
						var updateIntAudit = false;
						doc.push(data.body);

						if(req.body.Status != undefined){
							if(req.body.Status != doc[0].Status){
								doc[0].StatusChangeWho = curruser;
								doc[0].StatusChangeWhen = currdate;
								doc[0].Status = req.body.Status;
							}
						}
						switch (doc[0].DocSubType) {
							case "Business Unit":
								if(req.body.RGRollup != undefined) {//only for admin user
									doc[0].RGRollup = req.body.RGRollup;
								}
								break;
							case "Sub-process":
							case "Global Process":
								if(req.body.RGRollup != undefined){//only for admin user
									doc[0].BRGMembership = req.body.BRGMembership;
									doc[0].RGRollup = req.body.RGRollup;
								}
								break;
							case "BU IOT":
								if(req.body.RGRollup != undefined){//only for admin user
									doc[0].RGRollup = req.body.RGRollup;
									doc[0].BRGMembership = req.body.BRGMembership;
									doc[0].BUCountryIOT = req.body.BUCountryIOT;
								}
								break;
							case "BU IMT":
								if(req.body.BRGMembership != undefined){//only for admin user
									doc[0].BRGMembership = req.body.BRGMembership;
								}
								break;
							case "BU Country":
								if(req.body.BRGMembership != undefined){//only for admin user
									doc[0].BRGMembership = req.body.BRGMembership;
									doc[0].ExcludeGeo = req.body.ExcludeGeo;
								}
								break;
							case "Country Process":
								if(req.body.BRGMembership != undefined){//only for admin user
									doc[0].BRGMembership = req.body.BRGMembership;
									doc[0].AuditableFlag = req.body.AuditableFlag;
									doc[0].CUFlag = req.body.CUFlag;
									doc[0].AuditProgram = req.body.AuditProgram;
									doc[0].CUSize = req.body.CUSize;
									doc[0].CUCat = req.body.CUCat;
									doc[0].OpMetricKey = req.body.OpMetricKey;
									if(req.body.InternalAuditsData != undefined){//IA Data
										if(doc[0].InternalAuditsData != req.body.InternalAuditsData){
											doc[0].InternalAuditsData = req.body.InternalAuditsData;
											updateIntAudit = true;
										}
									}

								}
								break;
							case "Account":
								//Validate if account changed parent
								if(doc[0].parentid != req.body.cuparentname){
									doc[0].parentid = req.body.cuparentname;
								}
								doc[0].Name = req.body.Name;
								//doc[0].CUWWBCITKey = pdoc[0].WWBCITKey;
								if(req.body.MetricsCriteria != undefined){//only for admin user
									doc[0].MetricsCriteria = req.body.MetricsCriteria;
									doc[0].MetricsValue = req.body.MetricsValue;
									doc[0].OpMetricKey = req.body.OpMetricKey;
									//ALL keys
									if(doc[0].MIRABusinessUnit != "GBS"){
										doc[0].AuditLessonsKey = req.body.AuditLessonsKey;
									}
								}
								break;
							case "Controllable Unit":
								//Validate if accounts require to be updated
								if(doc[0].parentid != req.body.parentid && doc[0].LevelType != req.body.LevelType){
									doc[0].parentid = req.body.parentid;
								}
								doc[0].Portfolio = req.body.Portfolio;
								doc[0].ParentSubject = req.body.ParentSubject;
								doc[0].ParentDocSubType = req.body.ParentDocSubType;
								doc[0].LevelType = req.body.LevelType;
								doc[0].IOT = req.body.IOT;
								doc[0].IMT = req.body.IMT;
								doc[0].Country = req.body.Country;
								if(req.body.BRGMembership != undefined){//only for admin user
									doc[0].BRGMembership = req.body.BRGMembership;
									doc[0].CUSize = req.body.CUSize;
									doc[0].MetricsCriteria = req.body.MetricsCriteria;
									doc[0].MetricsValue = req.body.MetricsValue;
									doc[0].OpMetricKey = req.body.OpMetricKey;
									doc[0].ARCFrequency = req.body.ARCFrequency;
									doc[0].AuditableFlag = req.body.AuditableFlag;
									doc[0].AuditProgram = req.body.AuditProgram;
									//ALL keys
									if(doc[0].MIRABusinessUnit != "GBS"){
										doc[0].AuditLessonsKey = req.body.AuditLessonsKey;
									}
									//Sub-process keys
									if(doc[0].MIRABusinessUnit == "GTS Transformation"){
										doc[0].subprocess = req.body.subprocess;
									}
									//IA Data
									if(req.body.InternalAuditsData != undefined){
										if(doc[0].InternalAuditsData != req.body.InternalAuditsData){
											doc[0].InternalAuditsData = req.body.InternalAuditsData;
											updateIntAudit = true;
										}
									}
								}
								break;
							case "BU Reporting Group":
								if(req.body.AuditProgram != undefined){//only for admin user
									doc[0].AuditProgram = req.body.AuditProgram;
								}
								doc[0].Name = req.body.Name;
								doc[0].DocRPType = "BU Mixed-Level Group";
								break;
						}
						doc[0].Notes = req.body.Notes;
						doc[0].Links = eval(req.body.attachIDs);
						if(doc[0].Log == undefined){
							doc[0].Log = [];
							console.log("This document: "+docid+" must have a Log[0]. Requires a review.")
						}
						doc[0].Log.push(addlog);
						doc = accessupdates.updateAccessExistDoc(req,doc);
						//Save document
						db.save(doc[0]).then(function(data){
							if(data.status==200 && !data.error) {
								//Update Internal Audit if necessary - CPs/CUs
								if(updateIntAudit){
									var $or = [];
									var addArr = [];
									var delArr = [];
									var addIds = req.body.InternalAuditsData;
									var delIds = req.body.InternalAuditsDataDel;
									if(addIds != ""){
										addArr = addIds.split(',');
										for (var i = 0; i < addArr.length; i++) {
											$or.push({"_id":addArr[i]});
										}
									}
									if(delIds != ""){
										delArr = delIds.split(',');
										for (var i = 0; i < delArr.length; i++) {
											$or.push({"_id":delArr[i]});
										}
									}
									var searchobj = { selector: {"_id": {"$gt":0}, "docType": "asmtComponent", "compntType": "internalAudit", $or } };
									db.find(searchobj).then(function(resdata) {
										if(resdata.status==200 && !resdata.error) {
											var resdocs = resdata.body.docs;
											for(var j=0; j<resdocs.length; j++){
												for (var i = 0; i < addArr.length; i++) {
													if(resdocs[j]._id == addArr[i]){
														resdocs[j].parentid = doc[0]._id;
														resdocs[j].size = doc[0].CUSize;
														var CUScore = fieldCalc.getCUMaxScore(doc[0].CUSize);
														var finalscore = fieldCalc.getCUScore(resdocs[j].rating, CUScore);
														resdocs[j].score = finalscore;
														break;
													}
												}
											}
											for(var j=0; j<resdocs.length; j++){
												for (var i = 0; i < delArr.length; i++) {
													if(resdocs[j]._id == delArr[i]){
														resdocs[j].parentid = "";
														resdocs[j].size = "";
														resdocs[j].score = "";
														break;
													}
												}
											}
											db.bulk(resdocs).then(function(dataIADocs){
												if(dataIADocs.status==200 && !dataIADocs.error) {
													deferred.resolve(data);
												}
												else{
													deferred.reject({"status": 500, "error": dataIADocs.error});
												}
											}).catch(function(err) {
												console.log("[assessableunit][saveAUBU][updateIntAudit] - " + err.error.reason);
												deferred.reject({"status": 500, "error": err.error.reason});
											});
										}
										else{
											deferred.reject({"status": 500, "error": resdata.error});
										}
									}).catch(function(err) {
										console.log("[assessableunit][saveAUBU][findIntAudit] - " + err.error.reason);
										deferred.reject({"status": 500, "error": err.error.reason});
									});
								}
								else{
									deferred.resolve(data);
								}
							}
							else{
								deferred.reject({"status": 500, "error": data.error});
							}
						}).catch(function(err) {
							console.log("[assessableunit][saveAUBU][save] - " + err.error.reason);
							deferred.reject({"status": 500, "error": err.error.reason});
						});

					}
					else {
						deferred.reject({"status": 500, "error": data.error});
					}
				}).catch(function(err) {
					console.log("[assessableunit][saveAUBU][getDoc] - " + err.error.reason);
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}
		}catch(e){
			console.log("[assessableunit][saveAUBU] - " + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	/* Get Parents for Controllable Units */
	getCUParents: function(req, db, MIRABunit){
		var deferred = q.defer();
		try{
			var geo = {
				"selector":{
					"$and": [
						{ "LevelType": { "$gt": null }},
						{"Name": { "$ne": null }},
						{"key": "Assessable Unit"},
						{"DocSubType":{"$in":["Business Unit","BU IOT","BU IMT","BU Country"]}},
						{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
						{"MIRABusinessUnit":  {"$eq": MIRABunit}}
					]
				},
				"fields": [
					"_id",
					"Name",
					"DocSubType",
					"LevelType",
					"parentid",
					"MIRABusinessUnit",
					"IOT",
					"IMT",
					"Country",
					"CurrentPeriod"
				],
				"sort": [{"LevelType":"asc"},{"DocSubType":"asc"},{"Name":"asc"}]
			};
			db.find(geo).then(function(data){
				if(data.status==200 && !data.error) {
					var doc = data.body.docs;
					var len = doc.length;
					var level1 = [];
					var level2 = {};
					var level3 = {};
					var level4 = {};

					for(var i = 0; i < doc.length; i++){
						if(req.session.quarter == doc[i].CurrentPeriod){
							if(doc[i].DocSubType == "BU IOT"){
									doc[i].Name = req.session.buname + " - " + util.resolveGeo(doc[i].IOT, "IOT",req);
							}else if(doc[i].DocSubType == "BU IMT"){
									doc[i].Name = req.session.buname + " - " + util.resolveGeo(doc[i].IMT, "IMT",req);
							}else if(doc[i].DocSubType == "BU Country"){
									doc[i].Name = req.session.buname + " - " + util.resolveGeo(doc[i].Country, "Country",req);
							}
						}
						if(doc[i].LevelType == 1){
							level1.push(doc[i]);
						}else if(doc[i].LevelType == 2){
							if(typeof level2[doc[i].parentid] === "undefined"){
								level2[doc[i].parentid] = [doc[i]];
							}else{
								level2[doc[i].parentid].push(doc[i]);
							}
						}else if(doc[i].LevelType == 3){
							if(typeof level3[doc[i].parentid] === "undefined"){
								level3[doc[i].parentid] = [doc[i]];
							}else{
								level3[doc[i].parentid].push(doc[i]);
							}
						}else if(doc[i].LevelType == 4){
							if(typeof level4[doc[i].parentid] === "undefined"){
								level4[doc[i].parentid] = [doc[i]];
							}else{
								level4[doc[i].parentid].push(doc[i]);
							}
						}
					}
					var F = [];
					//level1
					for(var i = 0; i < level1.length; i++){
						F.push(level1[i]);

						//level2
						if(typeof level2[level1[i]["_id"]] !== "undefined"){
							var tmplvl2 = level2[level1[i]["_id"]];
							for(var i2 = 0; i2 < tmplvl2.length; i2++){
								F.push(tmplvl2[i2]);

								//level3
								if(typeof level3[tmplvl2[i2]["_id"]] !== "undefined"){
									var tmplvl3 =level3[tmplvl2[i2]["_id"]];
									for(var i3 = 0; i3 < tmplvl3.length; i3++){
										F.push(tmplvl3[i3]);

										//level4
										if(typeof level4[tmplvl3[i3]["_id"]] !== "undefined"){
											var tmplvl4 = level4[tmplvl3[i3]["_id"]];
											for(var i4 = 0; i4 < tmplvl4.length; i4++){
												F.push(tmplvl4[i4]);
											}
										}
									}
								}
							}
						}
					}
					deferred.resolve({"status": 200, "doc": F});
				}else{
					console.log("[assessableunit][getCUParents]" + data.error);
					deferred.reject({"status": 500, "error": data.error});
				}
			}).catch(function(err) {
				console.log("[assessableunit][getCUParents]" + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			console.log("[assessableunit][getCUParents]" + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	/* Get Active Reporting Groups */
	getReportingGroups: function(req, db, MIRABunit){
		var deferred = q.defer();
		try{
			var objRG = [];
			var searchobj = {
				"selector": {
					"_id": {"$gt":0},
					"key": "Assessable Unit",
					"Status": "Active",
					"MIRABusinessUnit": MIRABunit,
					"DocSubType": "BU Reporting Group"
				},
				"fields": ["_id", "Name"],
				"sort": ["DocSubType","Name"]
			};
			db.find(searchobj).then(function(resdata) {
				if(resdata.status==200 && !resdata.error) {
					if(resdata.body.docs.length > 0){
						var resdocs = resdata.body.docs;
						for (var i = 0; i < resdocs.length; ++i) {
							objRG.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
						}
					}
					deferred.resolve({"status": 200, "doc": objRG});
				}
				else{
					console.log("[assessableunit][getReportingGroups]" + resdata.error);
					deferred.reject({"status": 500, "error": resdata.error});
				}
			}).catch(function(err) {
				console.log("[assessableunit][getReportingGroups]" + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			console.log("[assessableunit][getReportingGroups]" + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	/* Get names from array comparing ids*/
	getNames: function(arrObj, idList, idField, nameField){
		var listNames = "";
		var arrIds;
		var listId, listName;

		try{
			if(idList != "" && idList != null) {
				arrIds = idList.split(',');
				for (var i = 0; i < arrObj.length; ++i) {
					for (var j = 0; j < arrIds.length; j++) {
						listId = eval('arrObj[i].' + idField);
						listName = eval('arrObj[i].' + nameField);
						if (arrIds[j] == listId) {
							if (listNames == "") listNames = listName;
							else listNames = listNames + ", " + listName;
						}
					}
				}
			}
		}catch(e){
			console.log("[assessableunit][getNames]" + e.stack);
		}
		return listNames;
	},

	/* Get Portfolio Controllable Units */
	getPortfolioCUs: function(req, db, MIRABunit){
		var deferred = q.defer();
		try{
			var searchobj = {
				"selector": {
					"_id": {"$gt":0},
					"MIRABusinessUnit": MIRABunit,
					"DocType": "Assessable Unit",
					"DocSubType": "Controllable Unit",
					"Portfolio": "Yes"
				},
				"fields": ["_id", "Name"]
			};
			db.find(searchobj).then(function(resdata) {
				if(resdata.status==200 && !resdata.error) {
					var resdocs = [];
					if(resdata.body.docs.length > 0){
						resdocs = resdata.body.docs;
					}
					deferred.resolve({"status": 200, "doc": resdocs});
				}
				else{
					console.log("[assessableunit][getPortfolioCUs]" + resdata.error);
					deferred.reject({"status": 500, "error": resdata.error});
				}
			}).catch(function(err) {
				console.log("[assessableunit][getPortfolioCUs]" + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			console.log("[assessableunit][getPortfolioCUs]" + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	/* Get Audit Lessons List */
	getALLKey: function(req, db, MIRABunit){
		var deferred = q.defer();
		try{
			var searchobj = {
				"selector":{
					"_id": {"$gt":0},
					"docType": "setup",
					"keyName": MIRABunit.replace(" ","")+"LessonsLearnedKey"
				}
			};
			db.find(searchobj).then(function(resdata) {
				if(resdata.status==200 && !resdata.error) {
					var resdocs = [];
					if(resdata.body.docs.length > 0){
						resdocs = resdata.body.docs[0].value;
					}
					deferred.resolve({"status": 200, "doc": resdocs});
				}
				else{
					console.log("[assessableunit][getALLKey]" + resdata.error);
					deferred.reject({"status": 500, "error": resdata.error});
				}
			}).catch(function(err) {
				console.log("[assessableunit][getALLKey]" + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			console.log("[assessableunit][getALLKey]" + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	/* Get Active BU Country */
	getBUCountry: function(req, db, MIRABunit){
		var deferred = q.defer();
		try{
			var objBUC = [];
			var searchobj = {
				"selector": {
					"_id": {"$gt":0},
					"key": "Assessable Unit",
					"Status": "Active",
					"BusinessUnit": MIRABunit,
					"DocSubType": "BU Country"
				},
				"fields": ["_id", "Name"]
			};
			db.find(searchobj).then(function(resdata) {
				if(resdata.status==200 && !resdata.error) {
					var objBUC = [];
					if(resdata.body.docs.length > 0){
						var resdocs = resdata.body.docs;
						for (var i = 0; i < resdocs.length; ++i) {
							objBUC.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
						}
					}
					deferred.resolve({"status": 200, "doc": objBUC});
				}
				else{
					console.log("[assessableunit][getBUCountry]" + resdata.error);
					deferred.reject({"status": 500, "error": resdata.error});
				}
			}).catch(function(err) {
				console.log("[assessableunit][getBUCountry]" + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			console.log("[assessableunit][getBUCountry]" + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	/* Get Subprocess */
	getSubprocess: function(req, db, MIRABunit){
		var deferred = q.defer();
		try{
			var searchobj = {
				"selector": {
					"_id": {"$gt":0},
					"DocType": "Assessable Unit",
					"DocSubType": "Sub-process",
					"MIRABusinessUnit": MIRABunit
				},
				"fields": ["WWBCITKey", "Name"]
			};
			db.find(searchobj).then(function(resdata) {
				if(resdata.status==200 && !resdata.error) {
					var resdocs = [];
					if(resdata.body.docs.length > 0){
						resdocs = resdata.body.docs;
					}
					deferred.resolve({"status": 200, "doc": resdocs});
				}
				else{
					console.log("[assessableunit][getSubprocess]" + resdata.error);
					deferred.reject({"status": 500, "error": resdata.error});
				}
			}).catch(function(err) {
				console.log("[assessableunit][getSubprocess]" + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			console.log("[assessableunit][getSubprocess]" + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	/* Get actual Parent of CU  */
	getParentCU: function(req, db, parentId){
		var deferred = q.defer();
		try{
			var objParent = {
				"selector":{
					"_id": parentId,
					"key": "Assessable Unit"
				},
				"fields": [ "_id", "Name", "DocSubType", "IOT", "IMT", "Country" ]
			};
			db.find(objParent).then(function(data){
				if(data.status==200 && !data.error) {
					var doc = [];
					if(data.body.docs.length > 0){
						doc = data.body.docs;
					}
					deferred.resolve({"status": 200, "doc": doc});
				}else{
					console.log("[assessableunit][getParentCU]" + data.error);
					deferred.reject({"status": 500, "error": data.error});
				}
			}).catch(function(err) {
				console.log("[assessableunit][getParentCU]" + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			console.log("[assessableunit][getParentCU]" + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

	/* Get MIRA BUs */
	getMIRABUs: function(req, db, MIRABunit, docType){
		var deferred = q.defer();
		try{
			var searchobj = {
				"selector":{
					"_id": {"$gt":0},
					"key": "Assessable Unit",
					"Status": "Active",
					"DocSubType": docType,
					"BusinessUnit": MIRABunit
				},
				"fields": [ "_id", "IOT", "IMT", "Country" ]
			};
			db.find(searchobj).then(function(budata) {
				if(budata.status==200 && !budata.error){
					var doc = [];
					if(budata.body.docs.length > 0){
						doc = budata.body.docs;
					}
					deferred.resolve({"status": 200, "doc": doc});
				}
				else{
					console.log("[assessableunit][getMIRABU]" + budata.error);
					deferred.reject({"status": 500, "error": budata.error});
				}
			}).catch(function(err) {
				console.log("[assessableunit][getMIRABU]" + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});

		}catch(e){
			console.log("[assessableunit][getMIRABU]" + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},
	//Get Internal Audit list
	getInternalAudits: function(req, db){
		var deferred = q.defer();
		try{
			var doc = [];
			var iaObj = {
				"selector":{
					"engagement": { "$gt": null },
					"docType": "asmtComponent",
					"compntType": "internalAudit",
					"auditReviewName":"CHQ Internal Audit",
					"status":"Final" //,
					//"auditYear": req.session.quarter.split(" ")[0]
				},
				"fields": [
					"_id",
					"docType",
					"compntType",
					"engagement",
					"location",
					"locationDescription",
					"organization",
					"RPTG_PROCESS",
					"addedToAQDB",
					"rating",
					"size",
					"score",
					"parentid"
				],
				"sort": [{"engagement":"asc"}]
			};
			db.find(iaObj).then(function(data){
				if(data.status==200 && !data.error){
					var doc = [];
					var docList = [];
					if(data.body.docs.length > 0){
						var docs = data.body.docs;
						//Separate internal audit with parentid null to display in list. The ones with parent is for display only if it was selected
						for (var i = 0; i < docs.length; ++i) {
							if(docs[i].parentid != null && docs[i].parentid != "")
								docList.push(docs[i]);
							else
								doc.push(docs[i]);
						}
					}
					deferred.resolve({"status": 200, "doc": doc, "docList": docList});
				}
				else{
					console.log("[assessableunit][getInternalAudits]" + data.error);
					deferred.reject({"status": 500, "error": data.error});
				}
			}).catch(function(err) {
				console.log("[assessableunit][getInternalAudits]" + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			console.log("[assessableunit][getInternalAudits]" + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},
	/* Get Internal Audit to display*/
	getIADisplay: function(arrObj, idList){
		var dataIntAudits = [];
		var aux = {};
		var arrIds;
		try{
			if(idList != "" && idList != null) {
				arrIds = idList.split(',');
				for (var i = 0; i < arrObj.length; ++i) {
					for (var j = 0; j < arrIds.length; j++) {
						if (arrIds[j] == arrObj[i]._id){
							aux = {
								"engagement": arrObj[i].engagement,
								"addedToAQDB": arrObj[i].addedToAQDB,
								"rating": arrObj[i].rating,
								"size": arrObj[i].size,
								"score": arrObj[i].score,
								"id": arrObj[i]._id
							};
							dataIntAudits.push(aux);
						}
					}
				}
			}
		}catch(e){
			console.log("[assessableunit][getIADisplay]" + e.stack);
		}
		return dataIntAudits;
	},
};

module.exports = assessableunit;
