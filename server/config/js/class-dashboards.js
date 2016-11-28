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

var dashboard = {

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
							"CurrentPeriod",
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
							"Status"
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
	}
};

module.exports = dashboard;
