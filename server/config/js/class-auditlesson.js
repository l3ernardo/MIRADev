/**************************************************************************************************
*
* Audit Lesson code for MIRA Web
* Developed by : Irving Fernando Alvarez Vazquez
* Date:3 Oct 2016
*
*/

var q  = require("q");
var moment = require('moment');
var utility = require('./class-utility.js');

var auditlesson = {
	/* Get lesson parameter data by ID */
	getLessonByID: function(req, db) {
		var deferred = q.defer();
		//Load data for new audit lesson
		if(typeof req.query.new !== "undefined"){
			var doc = {};
			var tmpcountries = [];
			for(var key in global.hierarchy.countries){
				tmpcountries.push({"name": key});
			}
			tmpcountries.sort(function(a, b){
				var nameA=a.name, nameB=b.name
				if (nameA < nameB) //sort string ascending
					return -1
				if (nameA > nameB)
					return 1
				return 0 //default return value (no sorting)
			});
			doc.countries = tmpcountries;
			doc.IOTIMTs = global.hierarchy.countries;
			doc.editmode = "new";
			doc.reportingQuarters = [
				{quarter:1},
				{quarter:2},
				{quarter:3},
				{quarter:4}
			];
			var obj = {
				selector : {
					"_id": {"$gt":0},
					"keyName": req.session.businessunit.split(" ")[0]+"AuditPrograms"
				}};
				db.find(obj).then(function(data){
					var param = data.body.docs[0];
					if(typeof param === "undefined"){
						deferred.reject({"status": 500, "error": "parameter does not exist"});
					}else{
						doc.programs = param.value.options;
					}
					var obj = {
						selector : {
							"_id": {"$gt":0},
							"keyName": "ReportingYears"
						}};
						db.find(obj).then(function(data){
							var param = data.body.docs[0];
							if(typeof param === "undefined"){
								deferred.reject({"status": 500, "error": "parameter does not exist"});
							}else{
								doc.reportingYears = param.value.options;
							}
							var obj = {
								selector: {
									Name: { "$gt": null },
									key: "Assessable Unit",
									DocSubType:"Business Unit",
									Status: "Active",
									MIRABusinessUnit: req.session.businessunit
								},
								fields: [
									"Name"
								]
							};
							db.find(obj).then(function(data){
								var param = data.body.docs;
								if(typeof param === "undefined"){
									deferred.reject({"status": 500, "error": "parameter does not exist"});
								}else{
									doc.businessList = param;
								}
								var obj = {
									selector: {
										Name: { "$gt": null },
										key: "Assessable Unit",
										DocSubType:"Global Process",
										Status: "Active",
										MIRABusinessUnit: req.session.businessunit
									},
									fields: [
										"Name","WWBCITKey"
									]
								};
								db.find(obj).then(function(data){
									//console.log(Object.keys(data.body.docs[0]));
									var param = data.body.docs;
									if(typeof param === "undefined"){
										deferred.reject({"status": 500, "error": "parameter does not exist"});
									}else{
										doc.processList = param;
										//doc.processList = param;
										//Audit Key
										doc.EnteredBU = req.session.businessunit;
										if(req.session.businessunit.split(" ")[0] == "GTS"){
											var objSub = {
												selector: {
													DocSubType: "Sub-process"
												},
												fields: [
													"Name","WWBCITKey"
												]
											};
											db.find(objSub).then(function(dataSub){
												var subPros = dataSub.body.docs;
												doc.subprocessList = subPros;
												var obj = {
													selector : {
														"_id": {"$gt":0},
														"keyName": req.session.businessunit.replace(" ","")+"LessonsLearnedKey"
													}};
													db.find(obj).then(function(dataLL){
														doc.lessonsList = dataLL.body.docs[0].value;
														deferred.resolve({"status": 200, "doc": doc});
													}).catch(function(err) {
														console.log("[assessableunit][LessonsList]" + dataLL.error);
														deferred.reject({"status": 500, "error": err});
													});
												}).catch(function(err) {
													console.log("[assessableunit][subprocessList]" + dataLL.error);
													deferred.reject({"status": 500, "error": err});
												});
											}else {
												deferred.resolve({"status": 200, "doc": doc});
											}

										}
									});
								});
							});
						}).fail(function(err) {
							deferred.reject({"status": 500, "error": err.error.reason});
						});
					}
					//load audit lesson by id
					else{
						if(typeof req.query.id === "undefined"){
							deferred.reject({"status": 500, "error": "ID does not exist"});
						}else{
							try{
								db.get(req.query.id).then(function(data){
									var doc = data.body;
									if(typeof doc === "undefined"){
										deferred.reject({"status": 500, "error": "Audit Lesson does not exist"});
									}else{
										var tmpcountries = [];
										for(var key in global.hierarchy.countries){
											tmpcountries.push({"name": key});
										}
										doc.countries = tmpcountries;
										doc.IOTIMTs = global.hierarchy.countries;
										if(data.body.Log.length == 1){
											data.body.Log.push(data.body.Log[0]);
										}
										if(data.body.Log.length > 2){
											var tmpLog = [];
											tmpLog.push(data.body.Log[0]);
											tmpLog.push(data.body.Log[data.body.Log.length - 1]);
											doc.Log = tmpLog;
										}
										if(data.body.AuditCAR == "Audit"){
											doc.auditSelectYes = true;
										}else{
											doc.auditSelectYes = false;
										}
										var obj = {
											selector: {
												Name: { "$gt": null },
												key: "Assessable Unit",
												DocSubType:"Global Process",
												Status: "Active",
												MIRABusinessUnit: req.session.businessunit
											},
											fields: [
												"Name","WWBCITKey"
											]
										};
										db.find(obj).then(function(datagp){
											var gpList = datagp.body.docs;
											if(typeof gpList === "undefined"){
												deferred.reject({"status": 500, "error": "parameter does not exist"});
											}else{

												//load data necessary for edit mode
												if(typeof req.query.edit !== "undefined"){

													doc.processList = gpList;
													var tmpArr = data.body.reportingPeriod.split(" Q");
													doc.reportingQuarter = tmpArr[1];
													doc.reportingYear = tmpArr[0];
													doc.editmode = true;
													doc.reportingQuarters = [
														{quarter:1},
														{quarter:2},
														{quarter:3},
														{quarter:4}
													];
													var obj = {
														selector : {
															"_id": {"$gt":0},
															keyName: req.session.businessunit.split(" ")[0]+"AuditPrograms"
														}};
														db.find(obj).then(function(data){
															var param = data.body.docs[0];
															if(typeof param === "undefined"){
																deferred.reject({"status": 500, "error": "parameter does not exist"});
															}else{
																doc.programs = param.value.options;
															}
															var obj = {
																selector : {
																	"_id": {"$gt":0},
																	keyName: "ReportingYears"
																}};
																db.find(obj).then(function(data){
																	var param = data.body.docs[0];
																	if(typeof param === "undefined"){
																		deferred.reject({"status": 500, "error": "parameter does not exist"});
																	}else{
																		doc.reportingYears = param.value.options;
																	}
																	var obj = {
																		selector: {
																			Name: { "$gt": null },
																			key: "Assessable Unit",
																			DocSubType:"Business Unit",
																			Status: "Active",
																			MIRABusinessUnit: req.session.businessunit
																		},
																		fields: [
																			"Name"
																		]
																	};
																	db.find(obj).then(function(data){
																		var param = data.body.docs;
																		if(typeof param === "undefined"){
																			deferred.reject({"status": 500, "error": "parameter does not exist"});
																		}else{
																			doc.businessList = param;
																		}
																		//Audit Key
																		doc.EnteredBU = req.session.businessunit;
																		if(req.session.businessunit.split(" ")[0] == "GTS"){
																			var objSub = {
																				selector: {
																					DocSubType: "Sub-process"
																				},
																				fields: [
																					"Name","WWBCITKey"
																				]
																			};
																			db.find(objSub).then(function(dataSub){
																				var subPros = dataSub.body.docs;
																				doc.subprocessList = subPros;
																				var obj = {
																					selector : {
																						"_id": {"$gt":0},
																						"keyName": req.session.businessunit.replace(" ","")+"LessonsLearnedKey"
																					}};
																					db.find(obj).then(function(dataLL){
																						doc.lessonsList = dataLL.body.docs[0].value;
																						deferred.resolve({"status": 200, "doc": doc});
																					}).catch(function(err) {
																						console.log("[assessableunit][LessonsList]" + dataLL.error);
																						deferred.reject({"status": 500, "error": err});
																					});
																				});
																			}
																			else {
																				deferred.resolve({"status": 200, "doc": doc});
																			}

																		});
																	})

																}).fail(function(err) {
																	deferred.reject({"status": 500, "error": err.error.reason});
																});
															}else{
																if(req.session.businessunit.split(" ")[0] == "GTS" && (doc.AuditLessonsKey != null)){

																	var objSub = {
																		selector: {
																			DocSubType: "Sub-process"
																		},
																		fields: [
																			"Name","WWBCITKey"
																		]
																	};
																	db.find(objSub).then(function(dataSub){
																		var subPros = dataSub.body.docs;
																		for(var i = 0; i < subPros.length; i++){
																			if(doc.subprocess == subPros[i].WWBCITKey){
																				doc.subprocess = subPros[i].Name;
																				break;
																			}
																		}
																		var obj = {
																			selector : {
																				"_id": {"$gt":0},
																				"keyName": req.session.businessunit.replace(" ","")+"LessonsLearnedKey"
																			}};
																			db.find(obj).then(function(dataLL){
																				var ALLList = dataLL.body.docs[0].value;
																				var ALLKey = doc.AuditLessonsKey.split(",");
																				for(var i = 0; i < ALLKey.length; i++ ){
																					for(var j = 0; j < ALLList.length;j++){
																						if(ALLKey[i] == ALLList[j].id){
																							ALLKey[i] = ALLList[j].option;
																							break;
																						}
																					}
																				}
																				doc.AuditLessonsKey = ALLKey;

																				var gpKey = doc.globalProcess.split(",");
																				for(var i = 0; i < gpKey.length; i++ ){
																					for(var j = 0; j < gpList.length;j++){
																						if(gpKey[i] == gpList[j].WWBCITKey){
																							gpKey[i] = gpList[j].Name;
																							break;
																						}
																					}
																				}
																				doc.globalProcess = gpKey;

																				deferred.resolve({"status": 200, "doc": doc});
																			}).catch(function(err) {
																				console.log("[auditlesson][LessonsList]" + dataLL.error);
																				deferred.reject({"status": 500, "error": err});
																			});


																		}).catch(function(err) {
																			console.log("[auditlesson][Subprocess]" + dataLL.error);
																			deferred.reject({"status": 500, "error": err});
																		});

																	}else {
																		var gpKey = doc.globalProcess.split(",");
																		for(var i = 0; i < gpKey.length; i++ ){
																			for(var j = 0; j < gpList.length;j++){
																				if(gpKey[i] == gpList[j].WWBCITKey){
																					gpKey[i] = gpList[j].Name;
																					break;
																				}
																			}
																		}
																		doc.globalProcess = gpKey;
																		deferred.resolve({"status": 200, "doc": doc});
																	}
																}//2nd else editmode
															}//3rd else if
														}).catch(function(err) {//181 global process if
																deferred.reject({"status": 500, "error": err.error.reason});
															});
														}//148 else if doc undefined
													}).catch(function(err) {
														deferred.reject({"status": 500, "error": err.error.reason});
													});//144 get id;
													/*}
												}).catch(function(err) {
													deferred.reject({"status": 500, "error": err.error.reason});
												});*/

											}catch(e){
												deferred.reject({"status": 500, "error": e});
											}
										}
									}
									return deferred.promise;
								},

								/* Get all Audit Lesson in cloudant */
								getAllLessons: function(req, db) {
									var deferred = q.defer();
									try{
										var view = [];
										var obj = {
											selector : {
												"_id": {"$gt":0},
												"reportingPeriod": {"$gt":0},
												"AuditType": {"$gt":0},
												docType: "auditLesson",
												businessUnit: req.session.buname
											},
											sort:[{"reportingPeriod":"desc"}, {"AuditType":"desc"}]
										};
										db.find(obj).then(function(data){
											var objGP = {
												selector: {
													Name: { "$gt": null },
													key: "Assessable Unit",
													DocSubType:"Global Process",
													Status: "Active",
													MIRABusinessUnit: req.session.businessunit
												},
												fields: [
													"Name","WWBCITKey"
												]
											};
											db.find(objGP).then(function(datagp){
												var gpList = datagp.body.docs;
												var objSub = {
													selector: {
														DocSubType: "Sub-process"
													},
													fields: [
														"Name","WWBCITKey"
													]
												};
												db.find(objSub).then(function(dataSub){
													var subPros = dataSub.body.docs;
													var uniqueBUs = {};
													var uniquePeriods = {};
													var uniquePrograms = {};
													var docs = data.body.docs;
													var list = [];
													var dataExport = [];
													for(var i = 0; i < docs.length; i++){

														var gpKey = docs[i].globalProcess.split(",");
														for(var x = 0; x < gpKey.length; x++ ){
															for(var y = 0; y < gpList.length;y++){
																if(gpKey[x] == gpList[y].WWBCITKey){
																	gpKey[x] = gpList[y].Name;
																	break;
																}
															}
														}
														docs[i].globalProcess = gpKey;
														if(req.session.businessunit.split(" ")[0] == "GTS"){
															for(var y = 0; y < subPros.length; y++){
																if(docs[i].subprocess == subPros[y].WWBCITKey){
																	docs[i].subprocess = subPros[y].Name;
																	break;
																}
															}
														}
														if(typeof uniqueBUs[docs[i].businessUnit] === "undefined"){
															uniqueBUs[docs[i].businessUnit] = true;
															list.push({id: docs[i].businessUnit.replace(/ /g,''), name: docs[i].businessUnit});
														}

														if(typeof uniquePeriods[docs[i].reportingPeriod] === "undefined"){
															uniquePeriods[docs[i].reportingPeriod] = true ;
															list.push({id: docs[i].reportingPeriod.replace(/ /g,''), name: docs[i].reportingPeriod, parent: docs[i].businessUnit.replace(/ /g,'') });
														}

														if(typeof uniquePrograms[docs[i].AuditType+""+docs[i].reportingPeriod] === "undefined"){
															uniquePrograms[docs[i].AuditType+""+docs[i].reportingPeriod] = true;
															list.push({id: docs[i].AuditType.replace(/ /g,'')+""+docs[i].reportingPeriod.replace(/ /g,''), name: docs[i].AuditType, parent: docs[i].reportingPeriod.replace(/ /g,'')});
														}
														list.push({
															"_id": docs[i]["_id"],
															id: docs[i]["_id"],
															parent:docs[i].AuditType.replace(/ /g,'')+""+docs[i].reportingPeriod.replace(/ /g,''),

															engagementID: docs[i].engagementIDone +"-"+docs[i].engagementIDtwo+"-"+docs[i].engagementIDthree+" "+docs[i].recommendationNum,
															IOT: docs[i].IOT,
															IMT: docs[i].IMT,
															country: docs[i].country,
															process: docs[i].globalProcess,
															subprocess: docs[i].subprocess,
															observationCategory: docs[i].observationCategory,
															summary: docs[i].summary
														});
														dataExport.push({
															BU: docs[i].businessUnit,
															period: docs[i].reportingPeriod,
															type: docs[i].AuditType,
															engagementID: docs[i].engagementIDone +"-"+docs[i].engagementIDtwo+"-"+docs[i].engagementIDthree+" "+docs[i].recommendationNum,
															IOT: docs[i].IOT,
															IMT: docs[i].IMT,
															country: docs[i].country,
															process: docs[i].globalProcess,
															subprocess: docs[i].subprocess,
															observationCategory: docs[i].observationCategory,
															summary: docs[i].summary
														});
													}
													deferred.resolve({"status": 200, "dataExport": dataExport,"doc": list});
													//cierra
												}).catch(function(err){
													deferred.reject({"status": 500, "error": err.error.reason});
												});
											}).catch(function(err){
												deferred.reject({"status": 500, "error": err.error.reason});
											});
										}).catch(function(err){
											deferred.reject({"status": 500, "error": err.error.reason});
										});

									}catch(e){
										deferred.reject({"status": 500, "error": e});
									}
									return deferred.promise;
								},

								/* Save Audit Lesson in cloudant */
								saveAL: function(req, db) {
									var deferred = q.defer();
									try{
										var docid = req.body["_id"];
										var now = moment(new Date());
										var curruser = req.session.user.notesId;
										var currdate = now.format("MM/DD/YYYY");
										var addlog = {
											"name": curruser,
											"date": utility.getDateTime("","date"),
											"time": utility.getDateTime("","time")
										};

										if(req.body.editmode == "new"){
											var newAudit = {};
											newAudit.docType= "auditLesson",
											newAudit.Log = [];
											newAudit.Log.push(addlog);
											newAudit.engagementIDone = req.body.engagementIDone;
											newAudit.engagementIDtwo = req.body.engagementIDtwo;
											newAudit.engagementIDthree = req.body.engagementIDthree;
											newAudit.recommendationNum = req.body.recommendationNum;
											newAudit.AuditType = req.body.AuditType;
											newAudit.AuditCAR = req.body.AuditCAR;
											newAudit.observationCategory = req.body.observationCategory;
											newAudit.reportingPeriod = req.body.reportingYear+" Q"+req.body.reportingQuarter;
											newAudit.businessUnit = req.body.BU;
											newAudit.country = req.body.country;
											newAudit.IMT = req.body.IMT;
											newAudit.IOT = req.body.IOT;
											newAudit.globalProcess = req.body.globalProcess;
											newAudit.subprocess = req.body.subprocess;
											newAudit.summary = req.body.Notes;
											newAudit.AuditLessonsKey = req.body.AuditLessonsKey;

											db.save(newAudit).then(function(data){
												deferred.resolve({"status": 200, "id": data.body.id});
											}).catch(function(err){
												deferred.reject({"status": 500, "error": err.error.reason});
											});
										}else{
											var obj = {
												selector:{
													"_id": docid,
												},
												fields: [
													"_id",
													"_rev",
													"docType",
													"Log"
												]
											};
											db.find(obj).then(function(data){
												data.body.docs[0].Log.push(addlog);
												data.body.docs[0].engagementIDone = req.body.engagementIDone;
												data.body.docs[0].engagementIDtwo = req.body.engagementIDtwo;
												data.body.docs[0].engagementIDthree = req.body.engagementIDthree;
												data.body.docs[0].recommendationNum = req.body.recommendationNum;
												data.body.docs[0].AuditType = req.body.AuditType;
												data.body.docs[0].AuditCAR = req.body.AuditCAR;
												data.body.docs[0].observationCategory = req.body.observationCategory;
												data.body.docs[0].reportingPeriod = req.body.reportingYear + " Q"+req.body.reportingQuarter;
												data.body.docs[0].businessUnit = req.body.BU;
												data.body.docs[0].country = req.body.country;
												data.body.docs[0].IMT = req.body.IMT;
												data.body.docs[0].IOT = req.body.IOT;
												data.body.docs[0].globalProcess = req.body.globalProcess;
												data.body.docs[0].subprocess = req.body.subprocess;
												data.body.docs[0].summary = req.body.Notes;
												data.body.docs[0].AuditLessonsKey = req.body.AuditLessonsKey;

												db.save(data.body.docs[0]).then(function(data){
													deferred.resolve({"status": 200, "id": data.body.id});
												}).catch(function(err){
													deferred.reject({"status": 500, "error": err.error.reason});
												});
											});
										}
									}catch(e){
										deferred.reject({"status": 500, "error": e});
									}
									return deferred.promise;
								}

							};

							module.exports = auditlesson;
