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
var util = require('./class-utility.js');
var geohierarchy = require('./class-geohierarchy.js');

var dashboard = {

	/* Display all Assessable Units */
	listAU: function(req, db) {
		var deferred = q.defer();
		try{
			geohierarchy.createGEOHierarchy(req,db).then(function(response){
				if(response.status==200 & !response.error) {
					global.hierarchy = response.response;//save in locals due to session 1 K limit

					var view_dashboard=[];
					var temporal=[];
					var A=[];
					var F=[];
					var index;
					//Process Dashboard
					if(req.url=='/processdashboard'){
						if(req.session.BG.indexOf("MIRA-ADMIN")> '-1'){
							var process = {
								"selector":{
									"$and": [
										{ "LevelType": { "$gt": null }},
										{"Name": { "$ne": null }},
										{"key": "Assessable Unit"},
										{"DocSubType":{"$in":["Business Unit","Global Process","Country Process"]}},
										{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
										{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
									]
								},
								"sort": [{"LevelType":"asc"},{"Name":"asc"}]
							};
						}
						else{
							var process = {
								"selector":{
									"$and": [
										{ "LevelType": { "$gt": null }},
										{"Name": { "$ne": null }},
										{"key": "Assessable Unit"},
										{"DocSubType":{"$in":["Business Unit","Global Process","Country Process"]}},
										{"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}]},
										{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
										{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
									]
								}	,
								"sort": [{"LevelType":"asc"},{"Name":"asc"}]
							};
						}
						obj = process;
					}
					//Geo Dashboard
					else if(req.url=='/geodashboard'){
						if(req.session.BG.indexOf("MIRA-ADMIN")> '-1'){
							var geo = {
								"selector":{
									"$and": [
										{ "LevelType": { "$gt": null }},
										{"Name": { "$ne": null }},
										{"key": "Assessable Unit"},
										{"DocSubType":{"$in":["Business Unit","BU IOT","BU IMT","BU Country","Controllable Unit","Account"]}},
										{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
										{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
									]
								},
								"fields": [
									"_id",
									"Name",
									"DocSubType",
									"LevelType",
									"parentid",
									"MIRABusinessUnit",
									"PeriodRatingPrev",
									"PeriodRating",
									"AUNextQtrRating",
									"Target2Sat",
									"MIRAAssessmentStatus",
									"WWBCITAssessmentStatus",
									"IOT",
									"IMT",
									"Country",
									"CurrentPeriod",
									"Portfolio",
									"Status"
								],
								"sort": [{"LevelType":"asc"},{"DocSubType":"asc"},{"Name":"asc"}]
							};
						}
						else{
							var geo = {
								"selector":{
									"$and": [
										{ "LevelType": { "$gt": null }},
										{"Name": { "$ne": null }},
										{"key": "Assessable Unit"},
										{"DocSubType":{"$in":["Business Unit","BU IOT","BU IMT","BU Country","Controllable Unit","Account"]}},
										{"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}]},
										{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
										{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
									]
								},
								"fields": [
									"_id",
									"Name",
									"DocSubType",
									"LevelType",
									"parentid",
									"MIRABusinessUnit",
									"PeriodRatingPrev",
									"PeriodRating",
									"AUNextQtrRating",
									"Target2Sat",
									"MIRAAssessmentStatus",
									"WWBCITAssessmentStatus",
									"Portfolio",
									"Status"
								],
								"sort": [{"LevelType":"asc"},{"DocSubType":"asc"},{"Name":"asc"}]
							};
						}
						obj = geo;
					}
					//Reporting Group Dashboard
					else if(req.url=='/reportingdashboard'){
						if(req.session.BG.indexOf("MIRA-ADMIN")> '-1'){
							var rg = {
								"selector": {
									"$and": [
										{"LevelType": { "$gt": null }},
										{"Name": { "$ne": null }},
										{"key": "Assessable Unit"},
										{"$or": [{"DocSubType":{"$in":["BU Reporting Group"]}},{"BRGMembership":{ "$exists": true, "$ne":"" }}]},
										{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
										{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
									]
								},
								"fields": [
									"_id",
									"Name",
									"DocSubType",
									"LevelType",
									"parentid",
									"MIRABusinessUnit",
									"PeriodRatingPrev",
									"PeriodRating",
									"AUNextQtrRating",
									"Target2Sat",
									"MIRAAssessmentStatus",
									"WWBCITAssessmentStatus",
									"Portfolio",
									"Status",
									"BRGMembership"
								],
								"sort": [{"LevelType":"asc"},{"Name":"asc"}]
							};
						}
						else{
							var rg = {
								"selector": {
									"$and": [
										{"LevelType": { "$gt": null }},
										{"Name": { "$ne": null }},
										{"key": "Assessable Unit"},
										{"$or": [{"DocSubType":{"$in":["BU Reporting Group"]}},{"BRGMembership":{ "$exists": true, "$ne":"" }}]},
										{"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}]},
										{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
										{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
									]
								},
								"fields": [
									"_id",
									"Name",
									"DocSubType",
									"LevelType",
									"parentid",
									"MIRABusinessUnit",
									"PeriodRatingPrev",
									"PeriodRating",
									"AUNextQtrRating",
									"Target2Sat",
									"MIRAAssessmentStatus",
									"WWBCITAssessmentStatus",
									"Portfolio",
									"Status",
									"BRGMembership"
								],
								"sort": [{"LevelType":"asc"},{"Name":"asc"}]
							};
						}
						obj = rg;
					}
					//Subprocess Dashboard
					else if(req.url=='/subprocessdashboard'){
						if(req.session.BG.indexOf("MIRA-ADMIN")> '-1'){
							var subprocess = {
								"selector": {
									"$and": [
										{ "LevelType": { "$gt": null }},
										{"Name": { "$ne": null }},
										{"key": "Assessable Unit"},
										{"DocSubType":{"$in":["Business Unit","Global Process","Sub-process"]}},
										{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
										{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
									]
								},
								"sort": [{"LevelType":"asc"},{"Name":"asc"}]
							};
						}
						else{
							var subprocess = {
								"selector": {
									"$and": [
										{ "LevelType": { "$gt": null }},
										{"Name": { "$ne": null }},
										{"key": "Assessable Unit"},
										{"DocSubType":{"$in":["Business Unit","Global Process","Sub-process"]}},
										{"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}]},
										{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
										{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
									]
								},
								"sort": [{"LevelType":"asc"},{"Name":"asc"}]
							};
						}
						obj = subprocess;
					}

					db.find(obj).then(function(data){

						var doc = data.body.docs;
						var level1 = [];
						var level2 = {};
						var level3 = {};
						var level4 = {};
						var level5 = {};
						var level6 = {};

						if(req.url!='/reportingdashboard'){
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
								}else if(doc[i].LevelType == 5){
									if(typeof level5[doc[i].parentid] === "undefined"){
										level5[doc[i].parentid] = [doc[i]];
									}else{
										level5[doc[i].parentid].push(doc[i]);
									}
								}else if(doc[i].LevelType == 6){
									if(typeof level6[doc[i].parentid] === "undefined"){
										level6[doc[i].parentid] = [doc[i]];
									}else{
										level6[doc[i].parentid].push(doc[i]);
									}
								}
							}

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

														//level5
														if(typeof level5[tmplvl4[i4]["_id"]] !== "undefined"){
															var tmplvl5 = level5[tmplvl4[i4]["_id"]];
															for(var i5 = 0; i5 < tmplvl5.length; i5++){
																F.push(tmplvl5[i5]);

																//level6
																if(typeof level6[tmplvl5[i5]["_id"]] !== "undefined"){
																	var tmplvl6 = level6[tmplvl5[i5]["_id"]];
																	for(var i6 = 0; i6 < tmplvl6.length; i6++){
																		F.push(tmplvl6[i6]);
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
						else{ //For Reporting Dashboard
							var levelrp = []
							for(var i = 0; i < doc.length; i++){
								if(doc[i].DocSubType == "BU Reporting Group"){
									level1.push(doc[i]);
								}
								else{ // All other documents
									levelrp.push(doc[i]);
								}
							}
							
							for(var i = 0; i < level1.length; i++){
								//Group Name
								var groupName = level1[i]["Name"];
								groupName = groupName.replace(req.session.buname + " - ","");
								//ParentID
								var parentidg = i;//groupName.replace(/ /g,'');
								//ID to compare
								var idRGroup = level1[i]["_id"];
								
								//Group Name (parent level)
								F.push({"id": parentidg, "GroupName": groupName});
								//Reporting Group
								level1[i]["id"] = level1[i]["_id"];
								level1[i]["parentidg"] = parentidg;
								F.push(level1[i]);
								
								//All other documents
								for(var j = 0; j < levelrp.length; j++){
									var brglist = levelrp[j]["BRGMembership"];
									var tmplevel2 = levelrp[j];
									var addDoc = false;
									tmplevel2["id"] = tmplevel2["_id"] + parentidg;
									if(brglist.indexOf(",") > -1){
										brglist = brglist.split(",");
										for(k = 0; k < brglist.length; k++){
											if(brglist[k] === idRGroup){ // ==groupName
												addDoc = true;
												break;
											}
										}
									}
									else if(brglist === idRGroup){ // ==groupName
										addDoc = true;
									}
									if(addDoc){
										F.push({"id": tmplevel2["id"], 
												"_id":tmplevel2["_id"], 
												"Name":tmplevel2["Name"], 
												"parentidg": parentidg,
												"DocSubType":tmplevel2["DocSubType"],
												"MIRABusinessUnit":tmplevel2["MIRABusinessUnit"],
												"PeriodRatingPrev":tmplevel2["PeriodRatingPrev"],
												"PeriodRating":tmplevel2["PeriodRating"],
												"AUNextQtrRating":tmplevel2["AUNextQtrRating"],
												"Target2Sat":tmplevel2["Target2Sat"],
												"MIRAAssessmentStatus":tmplevel2["MIRAAssessmentStatus"],
												"WWBCITAssessmentStatus":tmplevel2["WWBCITAssessmentStatus"],
												"Portfolio":tmplevel2["Portfolio"]
											});
									}
									tmplevel2 = "";
								}
							}
						}

						for (var i = 0; i < F.length; i++){
							view_dashboard.push({
								assessableUnit: F[i].Name,
								priorQ: F[i].PeriodRatingPrev,
								currentQ: F[i].PeriodRating,
								nextQtr: F[i].AUNextQtrRating,
								targetToSat:F[i].Target2Sat,
								mira:F[i].MIRAAssessmentStatus,
								wwBcit:F[i].WWBCITAssessmentStatus,
								type:F[i].DocSubType,
							});
						}

						view=JSON.stringify(view_dashboard, 'utf8');
						deferred.resolve({"status": 200, "doc": F,"view":view});
					}).catch(function(err) {
						deferred.reject({"status": 500, "error": err.error.reason});
					});
				
				}
				else{
					deferred.reject({"status": 500, "error": response.error});
				}
			}).catch(function(err) {// geohierarchy.createGEOHierarchy
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	}
};

module.exports = dashboard;
