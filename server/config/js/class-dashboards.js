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

function findParent(tagMap,doc,buffer) {
	try {
		if(doc == undefined) {
			return buffer;
		} else {
			if (typeof(doc.parentid) == undefined) {
				return buffer;
			} else {
				if(tagMap[doc.parentid]!=undefined) {
					buffer.push(tagMap[doc.parentid]);
					return ( findParent(tagMap, tagMap[doc.parentid], buffer) );
				} else {
					return buffer;
				}
			}
		}
	}catch(e){
		console.log(e.stack);
	} finally {
		return buffer;
	}
}

var dashboard = {

	/* Display all Assessable Units */
	listAU: function(req, db) {
		var deferred = q.defer();
		try{
			geohierarchy.createGEOHierarchy(req,db).then(function(response){
				if(response.status==200 & !response.error) {
					global.hierarchy = response.response;//save in locals due to session 1 K limit
					
					//req.session.user.mail = "llillo@us.ibm.com";
					util.getAllUserDocs(db, req.session.user.mail).then(function(rs) {
						if(rs.status==200 & !rs.error) {
							var view_dashboard=[];
							var temporal=[];
							var A=[];
							var F=[];
							var index;
							//Process Dashboard
							if(req.url=='/processdashboard'){
								var process = {
									"selector":{
										"$and": 
											[
												   { "DocType": { "$gt": null }},
												   {"$or":
												   [
													  {"$and": 
														[
															{ "LevelType": { "$gt": null }},
															{"Name": { "$ne": null }},
															{"key": "Assessable Unit"},
															{"DocSubType":{"$in":["Business Unit","Global Process","Country Process"]}},
															{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
															{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
														]
													  },									
													  {"$and":
														[
															{"DocType":{ "$gt": null }},
															{"key":"Assessment"},
															{"MIRABusinessUnit": {"$eq": req.session.businessunit}},
															{"CurrentPeriod": {"$eq": req.session.quarter}}
														]
													  }
													]
													}
											]									
									}
								}
								obj = process;
							}
							//Geo Dashboard
							else if(req.url=='/geodashboard'){
								var geo = {
									"selector":{								
									"$and": 
										[
										{ "DocType": { "$gt": null }},
										{"$or":[
									{   "$and": [
											{ "LevelType": { "$gt": null }},
											{"Name": { "$ne": null }},
											{"key": "Assessable Unit"},
											{"DocSubType":{"$in":["Business Unit","BU IOT","BU IMT","BU Country","Controllable Unit","Account"]}},
											{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
											{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
										]
									},									
										{ "$and":[
											{"DocType":{ "$gt": null }},
											{"key":"Assessment"},
											{"MIRABusinessUnit": {"$eq": req.session.businessunit}},
											{"CurrentPeriod": {"$eq": req.session.quarter}}
										]
										}
										]}
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
										"NextQtrRating",
										"MIRAAssessmentStatus",
										"MIRAStatus",
										"WWBCITStatus",
										"WWBCITAssessmentStatus",
										"IOT",
										"IMT",
										"Country",
										"CurrentPeriod",
										"Portfolio",
										"Status",
										"DocType"
									]
								};
								obj = geo;
							}
							//Reporting Group Dashboard
							else if(req.url=='/reportingdashboard'){
								var rg = {
									"selector": {
										"$and": [
											{ "DocType": { "$gt": null }},
											{"$or":[
											{ 
												"$and": [
													{"LevelType": { "$gt": null }},
													{"Name": { "$ne": null }},
													{"key": "Assessable Unit"},
													{"$or": [{"DocSubType":{"$in":["BU Reporting Group"]}},{"BRGMembership":{ "$exists": true, "$ne":"" }}]},
													{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
													{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
												]
											},
											{ 
												"$and":[
														{"DocType":{ "$gt": null }},
														{"key":"Assessment"},
														{"MIRABusinessUnit": {"$eq": req.session.businessunit}},
														{"CurrentPeriod": {"$eq": req.session.quarter}}
												]
											}
											]}
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
										"NextQtrRating",
										"MIRAStatus",
										"WWBCITStatus",
										"MIRAAssessmentStatus",
										"WWBCITAssessmentStatus",
										"Portfolio",
										"Status",
										"BRGMembership",
										"DocType"
									]
								};
								obj = rg;
							}
							//Subprocess Dashboard
							else if(req.url=='/subprocessdashboard'){
								var subprocess = {
									 "selector": {
										"$and": 
												[
													{ "DocType": { "$gt": null }},
													{"$or":[
															{  "$and": [
																		{ "LevelType": { "$gt": null }},
																		{"Name": { "$ne": null }},
																		{"key": "Assessable Unit"},
																		{"DocSubType":{"$in":["Business Unit","Global Process","Sub-process"]}},
																		{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
																		{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
																	]
															},
															{ "$and":[
																		{"DocType":{ "$gt": null }},
																		{"key":"Assessment"},
																		{"MIRABusinessUnit": {"$eq": req.session.businessunit}},
																		{"CurrentPeriod": {"$eq": req.session.quarter}}
															]
															}
														]}
												]
									}
								};
								obj = subprocess;
							}
							
							db.find(obj).then(function(data){
								 var doctest=data.body.docs;
								// Filter documents by User, if not ADMIN
								if(req.session.BG.indexOf("MIRA-ADMIN")==-1){
									var finalobj = [];
									var tagMap = {};
									for(var i=0;i<doctest.length;i++) {
										tagMap[doctest[i]._id] = doctest[i];
									}
									var doc = {};
									try {
										// First, add Business Unit and Assessments
										for(var i=0;i<doctest.length;i++) {
											if(doctest[i].key=='Assessment') {
												finalobj.push(doctest[i]);
											} else {
												if(doctest[i].DocSubType=='Business Unit') {
													finalobj.push(doctest[i]);
												}
											}
										}
										// Now add user docs and their parents
										for(var i=0;i<rs.result.length;i++) {
											doc = tagMap[rs.result[i].doc_id];
											if(doc!=undefined) {
												var buffer = [];
												finalobj.push(doc); // Adding user doc
												if(doc.parentid!=undefined) {												
													var buff = findParent(tagMap,doc,buffer);
													for(var j=0;j<buff.length;j++) {
														finalobj.push(buff[j]);
													}													
												} else {
													console.log("Parent ID doc cannot be found: " + doc.parentid);
												}					
											}											
										}	
									} catch(e) {
										console.log(e.stack);
									}
									doctest = finalobj; // Recreate list of docs
									// Removing duplicates
									try {
										var newdocs = [];
										var tagMap2 = {};
										for(var i=0;i<doctest.length;i++) {
											tagMap2[doctest[i]._id] = doctest[i];
										}
										for(var docid in tagMap2){
											newdocs.push(tagMap2[docid]);
										}
										doctest = newdocs;
									} catch(e) {
										console.log(e.stack);
									}
								}
								
								if(req.url!='/geodashboard'){
								doctest.sort(function (a, b) {
										if(req.url=='/reportingdashboard'){
											var aConcat = a.DocSubType+a.Name;
											var bConcat = b.DocSubType+b.Name;
										}
										else{
											var aConcat = a.LevelType+a.Name;
											var bConcat = b.LevelType+b.Name;
										}
										
										var nameA=aConcat.toString().toLowerCase();
										var nameB=bConcat.toString().toLowerCase();
										if (nameA < nameB) {
												return -1;
										} else if (nameA > nameB) {
												return 1;
										} else {
											return 0;
											} 
								});
								}					
								else{
									doctest.sort(function (a, b) {  
										var aConcat = a.LevelType + a.DocSubType + a.Name;
										var bConcat = b.LevelType + b.DocSubType + b.Name;
										var nameA=aConcat.toString().toLowerCase();
										var nameB=bConcat.toString().toLowerCase();
										
										if (nameA < nameB)
										{	return -1 }
										else if (nameA > nameB)
										{ return 1}
										else 
										{  return 0 }
									});
								}
								
								for (var j=0;j<doctest.length;j++){ 
												
									if(doctest[j].DocType=='Assessable Unit')
									{    
										for(var l=0;l<doctest.length;l++)
										{   
											if(doctest[l].DocType=='Assessment' && doctest[l].parentid==doctest[j]._id ){
												 doctest[j].priorQ = doctest[l].PeriodRatingPrev1;
												 doctest[j].currentQ = doctest[l].PeriodRating;
												 doctest[j].nextQtr = doctest[l].NextQtrRating;
												 doctest[j].Target2Sat = doctest[l].Target2Sat;	
												 doctest[j].MIRAStatus = doctest[l].MIRAStatus;	
												 doctest[j].WWBCITStatus = doctest[l].WWBCITStatus;
												 l=doctest.length;
											}
										}
										
									}
									
								}

								var doc=[]; var count=0;
								for(var p = 0; p < doctest.length; p++){
									if(doctest[p].DocType == 'Assessable Unit')
									{  
										doc.push(doctest[p]);
									}							
								}
						
								//var doc = data.body.docs;
								var BUList = [];
								var parentsList = {};
								
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
										if(doc[i].DocSubType == "Business Unit"){
											BUList.push(doc[i]);
										}else if(typeof parentsList[doc[i].parentid] === "undefined"){
												parentsList[doc[i].parentid] = [doc[i]];
											}else{
												parentsList[doc[i].parentid].push(doc[i]);
											}
										}
									//level1

									for(var i = 0; i < BUList.length; i++){
										F.push(BUList[i]);
										//level2
										if(typeof parentsList[BUList[i]["_id"]] !== "undefined"){
											var tmplvl2 = parentsList[BUList[i]["_id"]];
											for(var i2 = 0; i2 < tmplvl2.length; i2++){
												F.push(tmplvl2[i2]);

												//level3
												if(typeof parentsList[tmplvl2[i2]["_id"]] !== "undefined"){
													var tmplvl3 =parentsList[tmplvl2[i2]["_id"]];
													for(var i3 = 0; i3 < tmplvl3.length; i3++){
														F.push(tmplvl3[i3]);

														//level4
														if(typeof parentsList[tmplvl3[i3]["_id"]] !== "undefined"){
															var tmplvl4 = parentsList[tmplvl3[i3]["_id"]];
															for(var i4 = 0; i4 < tmplvl4.length; i4++){
																F.push(tmplvl4[i4]);

																//level5
																if(typeof parentsList[tmplvl4[i4]["_id"]] !== "undefined"){
																	var tmplvl5 = parentsList[tmplvl4[i4]["_id"]];
																	for(var i5 = 0; i5 < tmplvl5.length; i5++){
																		F.push(tmplvl5[i5]);

																		//level6
																		if(typeof parentsList[tmplvl5[i5]["_id"]] !== "undefined"){
																			var tmplvl6 = parentsList[tmplvl5[i5]["_id"]];
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
											BUList.push(doc[i]);
										}
										else{ // All other documents
											levelrp.push(doc[i]);
										}
									}
									//Order RPGroup Name
									BUList.sort(function (a, b) {  
										var aConcat = a.Name.replace(req.session.buname + " - ","");
										var bConcat = b.Name.replace(req.session.buname + " - ","");
										var nameA=aConcat.toString().toLowerCase();
										var nameB=bConcat.toString().toLowerCase();
										
										if (nameA < nameB)
										{	return -1 }
										else if (nameA > nameB)
										{ return 1}
										else 
										{  return 0 }
									});	
									for(var i = 0; i < BUList.length; i++){
										//Group Name
										var groupName = BUList[i]["Name"];
										groupName = groupName.replace(req.session.buname + " - ","");
										//ParentID
										var parentidg = i;//groupName.replace(/ /g,'');
										//ID to compare
										var idRGroup = BUList[i]["_id"];

										//Group Name (parent level)
										F.push({"id": parentidg, "GroupName": groupName});
										//Reporting Group
										BUList[i]["id"] = BUList[i]["_id"];
										BUList[i]["parentidg"] = parentidg;
										F.push(BUList[i]);

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
														"priorQ":tmplevel2["priorQ"],
														"currentQ":tmplevel2["currentQ"],
														"nextQtr":tmplevel2["nextQtr"],
														"Target2Sat":tmplevel2["Target2Sat"],
														"MIRAStatus":tmplevel2["MIRAStatus"],
														"WWBCITAssessmentStatus":tmplevel2["WWBCITAssessmentStatus"],
														"Portfolio":tmplevel2["Portfolio"]
													});
											}
											tmplevel2 = "";
										}
									}
								}

								if(req.url!='/reportingdashboard'){
									for (var i = 0; i < F.length; i++){
									view_dashboard.push({
										assessableUnit: F[i].Name,
										priorQ: F[i].priorQ,
										currentQ: F[i].currentQ,
										nextQtr: F[i].nextQtr,
										targetToSat:F[i].Target2Sat,
										mira:F[i].MIRAStatus,
										wwBcit:F[i].WWBCITStatus,
										type:F[i].DocSubType
									});
								  }				
								}
								else{
									for (var i = 0; i < F.length; i++){
									view_dashboard.push({
										GroupName:F[i].GroupName,
										type:F[i].DocSubType,
										assessableUnit: F[i].Name,
										priorQ: F[i].priorQ,
										currentQ: F[i].currentQ,
										nextQtr: F[i].nextQtr,
										targetToSat:F[i].Target2Sat,
										mira:F[i].MIRAStatus,
										wwBcit:F[i].WWBCITStatus								
									});
								  }
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
					}).catch(function(err) {// util.getAllUserDocs
						deferred.reject({"status": 500, "error": err.error.reason});
					});
				} else {
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
