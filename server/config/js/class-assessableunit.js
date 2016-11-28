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
var accessupdates = require('./class-accessupdates.js');
var fieldCalc = require('./class-fieldcalc.js');

var assessableunit = {

	/* Display all Assessable Units */
	listAU: function(req, db) {
		var deferred = q.defer();
		try{
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
							"CurrentPeriod"
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
							"WWBCITAssessmentStatus"
						],
						"sort": [{"LevelType":"asc"},{"DocSubType":"asc"},{"Name":"asc"}]
					};
				}
				obj = geo;
			}
			//Reporting Group Dashboard
			/*-----------------------------------------------------*/
			// Change reporting groups to list all documents by id of reporting group(All AU but not BU neither Account). Look id in BRGMembership
			/*-----------------------------------------------------*/
			else if(req.url=='/reportingdashboard'){
				if(req.session.BG.indexOf("MIRA-ADMIN")> '-1'){
					var rg = {
						"selector":{
							"$and": [
								{ "LevelTypeG": { "$gt": null }},
								{"Name": { "$ne": null }},
								{"key": "Assessable Unit"},
								{"DocSubType":{"$in":["BU Reporting Group"]}},
								//{"DocSubType":{"$in":["BU Reporting Group","Country Process","GroupName"]}},
								{"$not": {"Name":"Reporting Group"}},
								{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
								{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
							]
						},
						"sort": [{"LevelTypeG":"asc"},{"Name":"asc"}]
					};
				}
				else{
					var rg = {
						"selector":{
							"$and": [
								{ "LevelTypeG": { "$gt": null }},
								{"Name": { "$ne": null }},
								{"key": "Assessable Unit"},
								{"DocSubType":{"$in":["BU Reporting Group"]}},
								//{"DocSubType":{"$in":["BU Reporting Group","Country Process","GroupName"]}},
								{"$not": {"Name":"Reporting Group"}},
								{"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}]},
								{"$or": [{"parentid":{ "$exists": false }},{"parentid":{ "$exists":true, "$regex": "([^A-Z0-9])+" }}]},
								{"MIRABusinessUnit": {"$eq": req.session.businessunit}}
							]
						},
						"sort": [{"LevelTypeG":"asc"},{"Name":"asc"}]
					};
				}
				obj = rg;
			}
			//Subprocess Dashboard
			else if(req.url=='/subprocessdashboard'){
				if(req.session.BG.indexOf("MIRA-ADMIN")> '-1'){
					var subprocess = {
						"selector":{
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
						"selector":{
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
				var len = doc.length;
				//if(len > 0){
				//sorting
				var n ;
				var result;
				var result2;
				var lenF=0;
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
				else{
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
					}
					F = doc;
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
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},

	/* Get assessable unit by ID */
	getAUbyID: function(req, db) {
		var deferred = q.defer();
		try{
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

				/* Get Constituents and assessment Data*/
				switch (doc[0].DocSubType) {
					case "Account":
						constiobj = {
							/*selector:{
							"_id": {"$gt":0},
							"key": "Assessable Unit",
							"DocSubType": "Account",
							"ParentSubject":doc[0].ParentSubject,
							"BusinessUnit": doc[0].BusinessUnit
						}*/
						selector:{
							"_id": {"$gt":0},
							"BusinessUnit": doc[0].BusinessUnit,
							"$and": [{"key": "Assessment"},{"ParentDocSubType": "Account"},{"parentid": doc[0]._id}]
						}
						};
						doc[0].AccountData = [];
						break;
					case "Business Unit":
						constiobj = {
							selector:{
								"_id": {"$gt":0},
								"BusinessUnit": doc[0].BusinessUnit,
								"$or":
									[	{ "$and":
											[	{"key": "Assessable Unit"},
												{"$or":
													[
														{"DocSubType":{"$or": ["Global Process","BU Reporting Group","BU IOT"] }},
														{"$and": [{"DocSubType":"Controllable Unit"},{"ParentDocSubType": "Business Unit"}]}
													]
												}
											]
										},
										{ "$and": [{"key": "Assessment"},{"parentid": doc[0]._id}] }
									]
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
								"BusinessUnit": doc[0].BusinessUnit,
								"GlobalProcess": doc[0].GlobalProcess,
								"$or": [
									{ "$and": [{"key": "Assessable Unit"},{"DocSubType": {"$or":["Country Process","Sub-process"]}}] },
									{ "$and": [{"key": "Assessment"},{"ParentDocSubType": "Global Process"},{"parentid": doc[0]._id}] }
								]
							}
						};
						doc[0].CPData = [];
						doc[0].SPData = [];
						break;
					case "Sub-process":
						var constiobj = {
							selector:{
								"_id": {"$gt":0},
								"key": "Assessment",
								"ParentDocSubType": "Sub-process"
							}
						};
						doc[0].CPData = [];
						doc[0].SPData = [];
						break;
					case "BU IOT":
						var constiobj = {
							selector:{
								"_id": {"$gt":0},
								"BusinessUnit": doc[0].BusinessUnit,
								"IOT": doc[0].IOT,
								"$or": [
									{ "$and": [{"key": "Assessable Unit"},{"DocSubType": {"$or":["BU IMT","Controllable Unit"]}}] },
									{ "$and": [{"key": "Assessment"},{"parentid": doc[0]._id}] }
								]
							}
						};
						doc[0].BUIMTData = [];
						doc[0].CUData = [];
						break;
					case "BU IMT":
						var constiobj = {
							selector:{
								"_id": {"$gt":0},
								"BusinessUnit": doc[0].BusinessUnit,
								"IMT": doc[0].IMT,
								"$or": [
									{ "$and": [{"key": "Assessable Unit"},{"DocSubType": {"$or":["BU Country","Controllable Unit"]}}] },
									{ "$and": [{"key": "Assessment"},{"parentid": doc[0]._id}] }
								]
							}
						};
						doc[0].BUCountryData = [];
						doc[0].CUData = [];
						break;
					case "BU Country":
						var constiobj = {
							selector:{
								"_id": {"$gt":0},
								"BusinessUnit": doc[0].BusinessUnit,
								"Country": doc[0].Country,
								"$or": [
									{ "$and": [{"key": "Assessable Unit"},{"DocSubType": {"$or":["Country Process","Controllable Unit"]}}] },
									{ "$and": [{"key": "Assessment"},{"parentid": doc[0]._id}] }
								]
							}
						};
						doc[0].CPData = [];
						doc[0].CUData = [];
						break;
					case "Controllable Unit":
						var constiobj = {
							selector:{
								"_id": {"$gt":0},
								"BusinessUnit": doc[0].BusinessUnit,
								"parentid": doc[0]._id,
								"$or": [
									{ "$and": [{"key": "Assessable Unit"},{"DocSubType": "Account"}] },
									{ "$and": [{"key": "Assessment"}] }
								]
							}
						};
						// var constiobj = {
						// 	selector:{
						// 		"_id": {"$gt":0},
						// 		"BusinessUnit": doc[0].BusinessUnit,
						// 		"$or": [
						// 			{ "$and": [{"key": "Assessable Unit"},{"DocSubType": "Account"},{"ControllableUnit": doc[0].ControllableUnit}] },
						// 			{ "$and": [{"key": "Assessment"},{"ParentDocSubType": "Controllable Unit"},{"parentid": doc[0]._id}] }
						// 		]
						// 	}
						// };
						doc[0].AccountData = [];
						break;
					case "Country Process":
						var constiobj = {
							selector:{
								"_id": {"$gt":0},
								"BusinessUnit": doc[0].BusinessUnit,
								"$or": [
									{ "$and": [{"key": "Assessable Unit"},{"DocSubType": "Controllable Unit"},{"RelevantCP": {"$in": [doc[0].Name]}}] },
									{ "$and": [{"key": "Assessment"},{"ParentDocSubType": "Country Process"},{"parentid": doc[0]._id}] }
								]
							}
						};

						doc[0].ControlData = [];
						doc[0].CUData = [];
						break;
					case "BU Reporting Group":
						var constiobj = {
							selector:{
								"_id": {"$gt":0},
								"BusinessUnit": doc[0].BusinessUnit,
								"$or": [
									{ "$and": [ {"key": "Assessable Unit"},{"DocSubType": {"$or":["Controllable Unit","Country Process","BU Country","BU IMT","BU IOT","GlobalProcess"]}},{"BRGMembership": {"$regex": "(?i)"+doc[0]._id+"(?i)"}} ] },
									{ "$and": [{"key": "Assessment"},{"parentid": doc[0]._id}] }
								]
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
					doc[0].AssessmentData = [];
					var hasCurQAsmt = false;
					for (var i = 0; i < constidocs.length; ++i) {
						if (constidocs[i].DocType == "Assessment") {
							toadd = {
								"docid": constidocs[i]._id,
								"CurrentPeriod": constidocs[i].CurrentPeriod,
								"PeriodRating": constidocs[i].PeriodRating,
								"Owner": constidocs[i].Owner,
								"Target2Sat": constidocs[i].Target2Sat
							};
							doc[0].AssessmentData.push(toadd);
							if (constidocs[i].CurrentPeriod ==  doc[0].CurrentPeriod) {
								hasCurQAsmt = true;
								if (doc[0].WWBCITKey == undefined || doc[0].WWBCITKey == "") {
									doc[0].RatingJustification = constidocs[i].MIRARatingJustification;
								} else {
									if (constidocs[i].WWBCITStatus != "Draft") {
										doc[0].RatingJustification = constidocs[i].WWBCITRatingJustification;
									} else {
										doc[0].RatingJustification = constidocs[i].MIRARatingJustification;
									}
								}
							}
						}
						else {
							if(constidocs[i].DocSubType == "BU IOT"){
									constidocs[i].Name = req.session.buname + " - " + util.resolveGeo(constidocs[i].IOT, "IOT",req);

							}else if(constidocs[i].DocSubType == "BU IMT"){
									constidocs[i].Name = req.session.buname + " - " + util.resolveGeo(constidocs[i].IMT, "IMT",req);

							}else if(constidocs[i].DocSubType == "BU Country"){
									constidocs[i].Name = req.session.buname + " - " + util.resolveGeo(constidocs[i].Country, "Country",req);
							}
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
					}
					/* Check if user can create assessment */
					if (
							(doc[0].WWBCITKey == undefined || doc[0].WWBCITKey == "") &&
							doc[0].Status == "Active" &&
							hasCurQAsmt == false &&
							(doc[0].editor || doc[0].admin) &&
							(doc[0].DocSubType == "BU Country" || doc[0].DocSubType == "BU IMT" || doc[0].DocSubType == "BU IOT" || doc[0].DocSubType == "BU Reporting Group")
						 ) {
						doc[0].CreateAsmt = true;
					}
					/* Calculate for Instance Design Specifics and parameters*/
					doc[0].EnteredBU = req.session.businessunit;
					fieldCalc.getDocParams(req, db, doc).then(function(data) {
						if (doc[0].BusinessUnitOLD == "GTS" && doc[0].DocSubType == "Controllable Unit" && (doc[0].Category == "SO" || doc[0].Category == "IS" || doc[0].Category == "ITS" || doc[0].Category == "TSS" || doc[0].Category == "GPS")) {
							doc[0].showARCFreq = 1;
						}
						/* Get Reporting Groups and BU Countries*/
						if(req.query.edit != undefined && doc[0].editor) { //Edit mode
							doc[0].editmode = 1;
							switch (doc[0].DocSubType) {
								case "Business Unit":
								case "Global Process":
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
								deferred.reject({"status": 500, "error": err.error.reason});
								});
								break;
								case "Sub-process":
								case "Country Process":
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
								deferred.reject({"status": 500, "error": err.error.reason});
								});
								break;
								case "Account":
									var CUSearch = {
												selector:{
													"_id": {"$gt":0},
													"BusinessUnit": doc[0].BusinessUnit,
													"DocType": "Assessable Unit",
													"DocSubType": "Controllable Unit",
													"Portfolio": "Yes"
												},
												fields : ["_id", "Name"]
											};
									db.find(CUSearch).then(function(CUPData){
										doc[0].CUPList = CUPData.body.docs;
										deferred.resolve({"status": 200, "doc": doc});
									}).catch(function(err) {
										console.log("[assessableunit][AccountParentsList]" + err.error.reason);
										deferred.reject({"status": 500, "error": err.error.reason});
									});
									break;
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
										//Get CU Parent Documents if admin
										if(doc[0].admin){
											assessableunit.getCUParents(req, db).then(function(dataCP) {
												if(dataCP.status==200 && !dataCP.error){
													doc[0].CUParents = [];
													doc[0].CUParents = dataCP.doc;
													deferred.resolve({"status": 200, "doc": doc});
												}
												else{
													deferred.reject({"status": 500, "error": dataCP.error});
												}
											}).catch(function(err) {
												console.log("[assessableunit][CUParentList]" + dataCP.error);
												deferred.reject({"status": 500, "error": err});
											});
										}
										else{
											deferred.resolve({"status": 200, "doc": doc});
										}
									}).catch(function(err) {
										console.log("[assessableunit][ReportingGroupList]" + resdata.error);
										deferred.reject({"status": 500, "error": err.error.reason});
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
										doc[0].IOT = util.resolveGeo(doc[0].IOT, "IOT",req);
										doc[0].Name = req.session.buname + " - " + doc[0].IOT;
										deferred.resolve({"status": 200, "doc": doc});
									}).catch(function(err) {
										console.log("[assessableunit][iotlists]" + resdata.error);
										deferred.reject({"status": 500, "error": err.error.reason});
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
										doc[0].IOT = util.resolveGeo(doc[0].IOT, "IOT",req);
										doc[0].IMT = util.resolveGeo(doc[0].IMT,"IMT",req);
										if (doc[0].DocSubType == "BU IMT") {
											doc[0].Name = req.session.buname + " - " + doc[0].IMT;
											doc[0].BUIOT = req.session.buname + " - " + doc[0].IOT;
										} else {
											doc[0].Country = util.resolveGeo(doc[0].Country,"Country",req);
											doc[0].BUIMT = req.session.buname + " - " + doc[0].IMT;
											doc[0].Name = req.session.buname + " - " + doc[0].Country;
										}
										deferred.resolve({"status": 200, "doc": doc});
									}).catch(function(err) {
										console.log("[assessableunit][imtlists]" + resdata.error);
										deferred.reject({"status": 500, "error": err.error.reason});
									});
									break;
								default:
									deferred.resolve({"status": 200, "doc": doc});
									break;
							}
						}
						else { //Read mode
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
										console.log("[assessableunit][countrylistIncluded]" + err.error.reason);
										deferred.reject({"status": 500, "error": err.error.reason});
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
										console.log("[assessableunit][countrylistIncluded]" + err.error.reason);
										deferred.reject({"status": 500, "error": err.error.reason});
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
										}
										doc[0].BUCountryIOTDisp = bucNames;
										doc[0].BRGMembershipDisp = brgmNames;
										doc[0].RGRollupDisp = rgrNames;
										doc[0].IOT = util.resolveGeo(doc[0].IOT, "IOT",req);
										doc[0].Name = req.session.buname + " - " + doc[0].IOT;
										deferred.resolve({"status": 200, "doc": doc});
									}).catch(function(err) {
										console.log("[assessableunit][countrylistIncluded]" + err);
										deferred.reject({"status": 500, "error": err.error.reason});
									});
									/* end: get names of admin section IDs for display */
									break;
								case "BU IMT":
								case "BU Country":
									doc[0].IOT = util.resolveGeo(doc[0].IOT, "IOT",req);
									if (doc[0].DocSubType == "BU IMT") {
										doc[0].IMT = util.resolveGeo(doc[0].IMT,"IMT",req);
										doc[0].Name = req.session.buname + " - " + doc[0].IMT;
										doc[0].BUIOT = req.session.buname + " - " + doc[0].IOT;
									} else {
										doc[0].IMT = util.resolveGeo(doc[0].IMT,"IMT",req);
										doc[0].Country = util.resolveGeo(doc[0].Country,"Country",req);
										doc[0].Name = req.session.buname + " - " + doc[0].Country;
										doc[0].BUIMT = req.session.buname + " - " + doc[0].IMT;
									}
								case "Country Process":
								case "Account":
								case "Controllable Unit":
									/* start: get names of admin section IDs for display and IMT name for BU IMT unit*/
									var $or = [];
									var brgmIDs = "";
									if (doc[0].BRGMembership != "" && doc[0].BRGMembership != null) {
										brgmIDs = doc[0].BRGMembership.split(',');
										for (var i = 0; i < brgmIDs.length; i++) {
											$or.push({"_id":brgmIDs[i]});
										}
									}
									if (doc[0].DocSubType == "Controllable Unit") $or.push({"_id":doc[0].parentid});
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
											if (doc[0].DocSubType == "Controllable Unit") {
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
											}
										}
										doc[0].BRGMembershipDisp = brgmNames;
										deferred.resolve({"status": 200, "doc": doc});
									}).catch(function(err) {
										console.log("[assessableunit][countrylistIncluded]" + err.error.reason);
										deferred.reject({"status": 500, "error": err.error.reason});
									});
									/* end: get names of admin section IDs for display */
									break;
								default:
									deferred.resolve({"status": 200, "doc": doc});
									break;
							}//end of read mode switch
						}
					}).catch(function(err) {
						deferred.reject({"status": 500, "error": err});
					});
				}).catch(function(err) {
					console.log("[assessableunit][constituents]" + constidata.error);
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}
		catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},

	/* New assessable unit via parent ID */
	newAUbyPID: function(req, db) {
		var deferred = q.defer();
		try{
			var pid = req.query.pid
			db.get(pid).then(function(data){
				var pdoc = [];
				var doc = [];
				pdoc.push(data.body);
				var peditors = pdoc[0].AdditionalEditors + pdoc[0].Owner + pdoc[0].Focals;
				/* Check if user is admin to the parent doc where the new unit is created from */
				accessrules.getRules(req,peditors);

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
						"EnteredBU": req.session.businessunit
					};

					doc.push(tmpdoc);
					/* CurrentPeriod of Assessable Units will always have the current period of the app */
					doc[0].CurrentPeriod = req.session.quarter;
					if (doc[0].DocSubType == "Business Unit")
						doc[0].BUWWBCITKey = pdoc[0].WWBCITKey;
					else
						doc[0].BUWWBCITKey = pdoc[0].BUWWBCITKey;

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
							db.find(searchobj).then(function(resdata) {
								var resdocs = resdata.body.docs;
								for (var i = 0; i < resdocs.length; ++i) {
									if (resdocs[i].DocSubType == "BU Country") doc[0].BUCountryList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
									if (resdocs[i].DocSubType == "BU Reporting Group") doc[0].ReportingGroupList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
									if (resdocs[i].DocSubType == "BU IOT") doc[0].IOTAUList.push({"iotid":resdocs[i].IOT});
								}
								var tmpIOT = [];
								for(var tmp in req.app.locals.hierarchy.BU_IOT){
									tmpIOT.push({docid:tmp, name:req.app.locals.hierarchy.BU_IOT[tmp].IOT});
								}
								doc[0].IOTList = tmpIOT;
								for (var i = 0; i < doc[0].IOTAUList.length; ++i) {
									util.findAndRemove(doc[0].IOTList,'docid',doc[0].IOTAUList[i].iotid)
								}
								doc[0].IOT = util.resolveGeo(pdoc[0].IOT, "IOT",req);
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								console.log("[assessableunit][IOTLists][NewIOT]" + resdata.error);
								deferred.reject({"status": 500, "error": err.error.reason});
							});
							break;
						case "BU IMT":
						
							doc[0].IOT = util.resolveGeo(pdoc[0].IOT, "IOT",req);
							//Documents are without IOT ids
							if(doc[0].IOT == "") doc[0].IOT= pdoc[0].IOT
							
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
							
							db.find(searchobj).then(function(resdata) {
								var resdocs = resdata.body.docs;
								for (var i = 0; i < resdocs.length; ++i) {
									if (resdocs[i].DocSubType == "BU Reporting Group") doc[0].ReportingGroupList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
									if (resdocs[i].DocSubType == "BU IMT") doc[0].IMTAUList.push({"imtid":resdocs[i].IMT});
								}
								doc[0].IMTList = util.getIOTChildren(pdoc[0].IOT,"IOT",req);
								
								for (var i = 0; i < doc[0].IMTAUList.length; ++i) {
									util.findAndRemove(doc[0].IMTList,'docid',doc[0].IMTAUList[i].imtid)
								}
								
								//Documents are without IOT ids
								doc[0].IOTDisplay = util.resolveGeo(pdoc[0].IOT, "IOT",req);
								
								doc[0].BUIOT = req.session.buname + " - " + doc[0].IOT;
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								console.log("[assessableunit][IMTLists][NewIMT]" + resdata.error);

								deferred.reject({"status": 500, "error": err.error.reason});
							});
							break;
						case "BU Country":
							doc[0].ReportingGroupList = [];
							doc[0].CountryList = [];
							doc[0].CountryAUList = [];
							var searchobj = {
								selector:{
									"_id": {"$gt":0},
									"key": "Assessable Unit",
									"Status": "Active",
									$and:[{$or:[{"DocSubType": "BU Reporting Group"},{"DocSubType": "BU Country"}]},{"BusinessUnit":doc[0].BusinessUnit}]
								}
							};
							db.find(searchobj).then(function(resdata) {
								var resdocs = resdata.body.docs;
								for (var i = 0; i < resdocs.length; ++i) {
									if (resdocs[i].DocSubType == "BU Reporting Group") doc[0].ReportingGroupList.push({"docid":resdocs[i]._id,"name":resdocs[i].Name});
									if (resdocs[i].DocSubType == "BU Country") doc[0].CountryAUList.push({"countryid":resdocs[i].Country});
								}
								doc[0].CountryList = util.getIOTChildren(pdoc[0].IMT,"IMT",req);
								for (var i = 0; i < doc[0].CountryAUList.length; ++i) {
									util.findAndRemove(doc[0].CountryList,'docid',doc[0].CountryAUList[i].countryid)
								}
								doc[0].IOT = util.resolveGeo(pdoc[0].IOT, "IOT",req);
								doc[0].IMT = util.resolveGeo(pdoc[0].IMT,"IMT",req);
								doc[0].BUIMT = req.session.buname + " - " + doc[0].IMT;
								deferred.resolve({"status": 200, "doc": doc});
							}).catch(function(err) {
								console.log("[assessableunit][BUCountryLists][NewBUCountry]" + resdata.error);
								deferred.reject({"status": 500, "error": err.error.reason});
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
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
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
							break;
						case "BU Reporting Group":
							doc[0].LevelTypeG = "1";
							doc[0].AuditProgram = req.body.AuditProgram;
							doc[0].Name = req.body.Name;
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

				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});

			}
			else{
				// existing doc
				var obj = {
					selector:{
						"_id": docid,
					}
				};

				db.get(docid).then(function(data){
					var doc = [];
					doc.push(data.body);
					if(req.body.Status !== doc[0].Status){
						doc[0].StatusChangeWho = curruser;
						doc[0].StatusChangeWhen = currdate;
					}
					switch (doc[0].DocSubType) {
						case "Business Unit":
							doc[0].RGRollup = req.body.RGRollup;
							break;
						case "Sub-process":
							doc[0].BRGMembership = req.body.BRGMembership;
							doc[0].BRGMembershipDisp=req.body.BRGMembershipDisp;
							doc[0].ReportingGroupList=req.body.ReportingGroupList;
							break;
						case "Global Process":
							doc[0].RGRollup = req.body.RGRollup;
							doc[0].BRGMembership = req.body.BRGMembership;
							break;
						case "BU IOT":
							doc[0].RGRollup = req.body.RGRollup;
							doc[0].BRGMembership = req.body.BRGMembership;
							doc[0].BUCountryIOT = req.body.BUCountryIOT;
							doc[0].Status = req.body.Status
							break;
						case "BU IMT":
							doc[0].BRGMembership = req.body.BRGMembership;
							doc[0].Status = req.body.Status
							break;
						case "BU Country":
							doc[0].BRGMembership = req.body.BRGMembership;
							doc[0].ExcludeGeo = req.body.ExcludeGeo;
							doc[0].Status = req.body.Status
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
							break;
						case "Controllable Unit":
							/* --------------------------------------------------------------------------- */
							//Add LevelType based on ParentDocSubType - Missing functionality of Update parent
							/* --------------------------------------------------------------------------- */
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
							break;
					}
					doc[0].Notes = req.body.Notes;
					doc[0].Links = eval(req.body.attachIDs);
					doc[0].Log.push(addlog);
					doc = accessupdates.updateAccessExistDoc(req,doc);
					//Save document
					db.save(doc[0]).then(function(data){
						// Get current quarter Assessment
						fieldCalc.getCurrentAsmt(db, doc).then(function(asmtdata) {
							var asmtdoc = [];
							if(asmtdata.doc != undefined){
								asmtdoc.push(asmtdata.doc);
								// Pass data to current quarter assessment
								switch (doc[0].DocSubType) {
									case "Controllable Unit":
									asmtdoc[0].AuditProgram = doc[0].AuditProgram;
									asmtdoc[0].Portfolio = doc[0].Portfolio;
									break;
								}
								db.save(asmtdoc[0]).then(function(asmtdata){
									deferred.resolve(data);
								}).catch(function(err) {
									deferred.reject({"status": 500, "error": err.error.reason});
								});
							}
							else{
								deferred.resolve(data);
							}
						}).catch(function(err) {
							deferred.reject({"status": 500, "error": err.error.reason});
						});
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
	},

	/* Get Parents for Controllable Units */
	getCUParents: function(req, db){
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
						{"MIRABusinessUnit":  {"$eq": req.session.businessunit}}
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
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	}

};

module.exports = assessableunit;
