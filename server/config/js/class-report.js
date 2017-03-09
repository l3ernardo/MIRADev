/**************************************************************************************************
 *
 * Calendar code for MIRA Web
 * Developed by :   Gabriela S. Pailiacho G.
 * Date: 07 Sep 2016
 *
 */

var q  = require("q");
var moment = require('moment');
var mtz = require('moment-timezone');
var accessrules = require('./class-accessrules.js');
var util = require('./class-utility.js');
var fieldCalc = require('./class-fieldcalc');
var recordindex;
var parentindex;
var indexp;

function existparentid (parentkey,F){
      for (j=0;j<F.length;j++)
   {
      if(F[j]!= undefined){

      if(F[j]._id==parentkey)
	  {
	       result=1;
		   parentindex=j;
   }}
   }
  /* return 1;*/
   return result
}
function parentidf (parentkey,G){
  for (m=0;m<G.length;m++)
   {
      if(G[m]!= undefined){
      if(G[m]._id==parentkey)
	  {
		   indexp=m;
     }
	 else
	 {
		  indexp=G.length;
	 }
   }
   }
   return indexp
}
/*
function findtl(level,parentkey,F){
    for(k=F.length-1;k>=parentindex;k--)
	{
	   if(F[k]!= undefined)
	   {
	       if((F[k].LevelTypeSE==level && F[k].parentidrse==parentkey) || (F[k].LevelTypeAUF==level && F[k].parentidauf==parentkey))
		       {
					result2=1;
				    recordindex=k;
					k=parentindex-1;
				}
				else{
					 recordindex=parentidf(parentkey,F);
					 result2=0;
				}
	   }
	}
	return result2
}*/

var report = {
	assessableunitfile: function(req, db) {
		var deferred = q.defer();
		try{

			if(req.session.BG.indexOf("MIRA-ADMIN") > '-1'){
				var objAUFR = {
					"selector": {

							//"_id": { "$gt": 0 },
							"Name": { "$gt": null },
							"key": "Assessable Unit",
              "CurrentPeriod": req.session.quarter,
							"Status": "Active",
							"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"Name":"asc"}]
				};
			}
			else{
				var objAUFR = {
					"selector": {
						//"_id": { "$gt": 0 },
						"Name": { "$gt": null },
						"key": "Assessable Unit",
            "CurrentPeriod": req.session.quarter,
						"Status": "Active",
						"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}],
						"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"Name":"asc"}]
				};
			}
			db.find(objAUFR).then(function(data){
				var doc = data.body.docs;
				var len = doc.length;
        var exportInfo = [];
        var view_auFileReport = [];
        var parentsids = {};
				if(len > 0){
					for (var i = 0; i < len; i++){
            if (parentsids[doc[i].parentid]) {
              parentsids[doc[i].parentid].push(doc[i]);
            }else{
              parentsids[doc[i].parentid] =[doc[i]];
            }
            var tmp={
              nothing: " ",
              Name: ""+doc[i].Name,
              DocSubType: ""+doc[i].DocSubType,
              Status: ""+doc[i].Status,
              Portfolio: ""+doc[i].Portfolio,
              AuditableFlag: ""+doc[i].AuditableFlag,
              AuditProgram: ""+doc[i].AuditProgram,
              IOT: ""+doc[i].IOT,
              IMT: ""+doc[i].IMT,
              Country: ""+doc[i].Country,
              CUSize: ""+doc[i].CUSize,
              MetricsValue: ""+doc[i].MetricsValue,
              ARCFrequency: ""+doc[i].ARCFrequency,
              PeriodRatingPrev4: ""+doc[i].PeriodRatingPrev4,
              PeriodRatingPrev3: ""+doc[i].PeriodRatingPrev3,
              PeriodRatingPrev2: ""+doc[i].PeriodRatingPrev2,
              PeriodRatingPrev: ""+doc[i].PeriodRatingPrev,
              PeriodRating: ""+doc[i].PeriodRating,
              AUNextQtrRating: ""+doc[i].AUNextQtrRating,
              Target2Sat: ""+doc[i].Target2Sat,
              Owner: ""+doc[i].Owner,
              Focals: ""+doc[i].Focals,
              Coordinators: ""+doc[i].Coordinators,
              Readers: ""+doc[i].Readers,
              AdditionalEditors: ""+doc[i].AdditionalEditors,
              AdditionalReaders: ""+doc[i].AdditionalReaders
            }
            exportInfo.push(tmp);
						view_auFileReport.push(doc[i]);
					}
				}
        var objparents = {
					"selector": {
            "Name": { "$gt": 0 },
						"_id": { "$in": Object.keys(parentsids) },
						"key": "Assessable Unit",
            "CurrentPeriod": req.session.quarter,
						"MIRABusinessUnit": req.session.businessunit
					},
					"fields": ["_id","DocSubType","Country","IMT","IOT"]
				};

			  db.find(objparents).then(function(data){

          var parents = data.body.docs;
          for (var i = 0; i < parents.length; i++) {
            if(parents[i].Country){
              var tmpCountry = util.resolveGeo(parents[i].Country, "Country");
              var tmpIOT = "";
              var tmpIMT = "";
              if (global.hierarchy.countries[util.resolveGeo(parents[i].Country, "Country")]) {
                tmpIOT = global.hierarchy.countries[util.resolveGeo(parents[i].Country, "Country")].IOT;
                tmpIMT = global.hierarchy.countries[util.resolveGeo(parents[i].Country, "Country")].IMT;
              }
              for (var j = 0; j < parentsids[parents[i]["_id"]].length; j++) {
                parentsids[parents[i]["_id"]][j].IOT = tmpIOT;
                parentsids[parents[i]["_id"]][j].IMT = tmpIMT;
                parentsids[parents[i]["_id"]][j].Country = tmpCountry;
              }
            }else if(parents[i].IMT){
              var tmpIMT = global.hierarchy.BU_IMT[parents[i].IMT].IMT;
              var tmpIOT = global.hierarchy.BU_IMT[parents[i].IMT].IOT;
              for (var j = 0; j < parentsids[parents[i]["_id"]].length; j++) {
                parentsids[parents[i]["_id"]][j].IOT = tmpIOT;
                parentsids[parents[i]["_id"]][j].IMT = tmpIMT;
              }
            }else if(parents[i].IOT){
              var tmpIOT = global.hierarchy.BU_IOT[parents[i].IOT].IOT;
              for (var j = 0; j < parentsids[parents[i]["_id"]].length; j++) {
                parentsids[parents[i]["_id"]][j].IOT = tmpIOT;
              }
            }
          }
				  deferred.resolve({"status": 200, "doc":view_auFileReport,"exportInfo": exportInfo});
        }).catch(function(err) {
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
	controllableunitfile: function(req, db) {
		var deferred = q.defer();
		try{

			if(req.session.BG.indexOf("MIRA-ADMIN") > '-1'){
				var objAUFR = {
					"selector": {

							//"_id": { "$gt": 0 },
							"Name": { "$gt": null },
							"key": "Assessable Unit",
              "CurrentPeriod": req.session.quarter,
							"Status": "Active",
							"$or": [{"DocSubType":"Controllable Unit"},{"DocSubType":"Country Process", "CUFlag": "Yes"}],
							"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"Name":"asc"}]
				};
			}
			else{
				var objAUFR = {
					"selector": {
						//"_id": { "$gt": 0 },
						"Name": { "$gt": null },
						"key": "Assessable Unit",
            "CurrentPeriod": req.session.quarter,
						"Status": "Active",
						"$or": [{"DocSubType":"Controllable Unit"},{"DocSubType":"Country Process", "CUFlag": "Yes"}],
						"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}],
						"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"Name":"asc"}]
				};
			}
			db.find(objAUFR).then(function(data){
				var doc = data.body.docs;
				var len= doc.length;
				var view_cuFileReport = [];
        var exportInfo = [];
        var parentsids = {};
				if(len > 0){
					for (var i = 0; i < len; i++){
            if (parentsids[doc[i].parentid]) {
              parentsids[doc[i].parentid].push(doc[i]);
            }else{
              parentsids[doc[i].parentid] =[doc[i]];
            }
            var tmp={
              nothing: " ",
              Name: ""+doc[i].Name,
              IOT: ""+doc[i].IOT,
              IMT: ""+doc[i].IMT,
              Country: ""+doc[i].Country,
              Status: ""+doc[i].Status,
              Portfolio: ""+doc[i].Portfolio,
              DocSubType: ""+doc[i].DocSubType,
              AuditableFlag: ""+doc[i].AuditableFlag,
              Category: ""+doc[i].Category,
              Subcategory: ""+doc[i].Subcategory,
              AuditProgram: ""+doc[i].AuditProgram,
              CUSize: ""+doc[i].CUSize,
              MetricsCriteria: ""+doc[i].MetricsCriteria,
              MetricsValue: ""+doc[i].MetricsValue,
              ARCFrequency: ""+doc[i].ARCFrequency,
              PeriodRatingPrev: ""+doc[i].PeriodRatingPrev,
              PeriodRating: ""+doc[i].PeriodRating,
              AUNextQtrRating: ""+doc[i].AUNextQtrRating,
              Target2SatPrev: ""+doc[i].Target2SatPrev,
              Target2Sat: ""+doc[i].Target2Sat,
              Owner: ""+doc[i].Owner,
              Focals: ""+doc[i].Focals,
              Coordinators: ""+doc[i].Coordinators,
              Readers: ""+doc[i].Readers,
              AdditionalEditors: ""+doc[i].AdditionalEditors,
              AdditionalReaders: ""+doc[i].AdditionalReaders
            }
            exportInfo.push(tmp);
						view_cuFileReport.push(doc[i]);
					}
				}

        var objparents = {
					"selector": {
            "Name": { "$gt": 0 },
						"_id": { "$in": Object.keys(parentsids) },
						"key": "Assessable Unit",
            "CurrentPeriod": req.session.quarter,
						"MIRABusinessUnit": req.session.businessunit
					},
					"fields": ["_id","DocSubType","Country","IMT","IOT"]
				};

			  db.find(objparents).then(function(data){

          var parents = data.body.docs;
          for (var i = 0; i < parents.length; i++) {
            if(parents[i].Country){
              var tmpCountry = util.resolveGeo(parents[i].Country, "Country");
              var tmpIOT = "";
              var tmpIMT = "";
              if (global.hierarchy.countries[util.resolveGeo(parents[i].Country, "Country")]) {
                tmpIOT = global.hierarchy.countries[util.resolveGeo(parents[i].Country, "Country")].IOT;
                tmpIMT = global.hierarchy.countries[util.resolveGeo(parents[i].Country, "Country")].IMT;
              }
              for (var j = 0; j < parentsids[parents[i]["_id"]].length; j++) {
                parentsids[parents[i]["_id"]][j].IOT = tmpIOT;
                parentsids[parents[i]["_id"]][j].IMT = tmpIMT;
                parentsids[parents[i]["_id"]][j].Country = tmpCountry;
              }
            }else if(parents[i].IMT){
              var tmpIMT = global.hierarchy.BU_IMT[parents[i].IMT].IMT;
              var tmpIOT = global.hierarchy.BU_IMT[parents[i].IMT].IOT;
              for (var j = 0; j < parentsids[parents[i]["_id"]].length; j++) {
                parentsids[parents[i]["_id"]][j].IOT = tmpIOT;
                parentsids[parents[i]["_id"]][j].IMT = tmpIMT;
              }
            }else if(parents[i].IOT){
              var tmpIOT = global.hierarchy.BU_IOT[parents[i].IOT].IOT;
              for (var j = 0; j < parentsids[parents[i]["_id"]].length; j++) {
                parentsids[parents[i]["_id"]][j].IOT = tmpIOT;
              }
            }
          }
  				deferred.resolve({"status": 200, "doc":view_cuFileReport,"exportInfo":exportInfo});
        }).catch(function(err) {
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
 statusexception: function(req, db) {
   var deferred = q.defer();
   var F=[];
   try{
       var objSE = {
         "selector":{
           "Name": { "$gt": null },
           "key": "Assessable Unit",
           "DocType": { "$gt": 0 },
           "CurrentPeriod": req.session.quarter,
           "MIRABusinessUnit": req.session.businessunit
         }
       };
			db.find(objSE).then(function(data){
				var doc = data.body.docs;
				var finalList = [];
        var exportInfo = [];
        var AccountList = [];
        var BUCountryList = [];
        var BUIMTList = [];
        var BUIOTList = [];
        var BURptGrpList = [];
        var CUList = [];
        var CUIOTList = [];
        var CPList = [];
        var GPList = [];
        var CPIOTList = {};
        var parentsObj = {};
        if(req.session.BG.indexOf("MIRA-ADMIN") > '-1'){
          finalList.push({GroupingName: "Business Units", id: "BusinessUnit", catEntry: true});
          finalList.push({IOTName: "(Not Categorized)", id: "BusinessUnit(NotCategorized)", parent:"BusinessUnit", catEntry: true});
          for (var i = 0; i < doc.length; i++) {
            if(doc[i].DocSubType == "Business Unit" && (doc[i].MIRAAssessmentStatus != "Final" || (doc[i].WWBCITAssessmentStatus != "Complete" && doc[i].WWBCITAssessmentStatus != "Reviewed"&& doc[i].WWBCITAssessmentStatus != ""))){
              doc[i].GroupingName = "Business Unit";
              doc[i].parent = "BusinessUnit(NotCategorized)";
              doc[i].id = doc[i]["_id"];
              finalList.push(doc[i]);
            }else{
              if (doc[i].parentid) {
                if (parentsObj[doc[i].parentid]) {
                  parentsObj[doc[i].parentid].push(doc[i]);
                }else {
                  parentsObj[doc[i].parentid] = [doc[i]];
                }
              }
              if(doc[i].DocSubType == "Account"){
                doc[i].sortlevel = 6;
                AccountList.push(doc[i]);
              }else if (doc[i].DocSubType == "BU Country") {
                doc[i].sortlevel = 3;
                BUCountryList.push(doc[i]);
              }else if (doc[i].DocSubType == "BU IMT") {
                doc[i].sortlevel = 2;
                BUIMTList.push(doc[i]);
              }else if (doc[i].DocSubType == "BU IOT") {
                doc[i].sortlevel = 1;
                BUIOTList.push(doc[i]);
              }else if (doc[i].DocSubType == "BU Reporting Group") {
                doc[i].sortlevel = 8;
                BURptGrpList.push(doc[i]);
              }else if (doc[i].DocSubType == "Controllable Unit") {
                if (doc[i].Portfolio == "Yes") {
                  doc[i].cutype = "Portfolio CU";
                  doc[i].sortlevel = 4;
                }else{
                  doc[i].cutype = "Standalone CU";
                  doc[i].sortlevel = 5;
                }
                CUList.push(doc[i]);
                if (doc[i].ParentDocSubType == "BU IOT") {
                  CUIOTList.push(doc[i]);
                }
              }else if (doc[i].DocSubType == "Country Process") {
                doc[i].sortlevel = 7;
                if (CPIOTList[doc[i].IOT]) {
                  CPIOTList[doc[i].IOT].push(doc[i]);
                }else {
                    CPIOTList[doc[i].IOT] = [doc[i]];
                }
                CPList.push(doc[i]);
              }else if (doc[i].DocSubType == "Global Process") {
                GPList.push(doc[i]);
              }
            }
          }
          finalList.push({GroupingName: "Geo-Aligned Entities", id:"GeoEntities", catEntry: true});
          for (var i = 0; i < BUIOTList.length; i++) {
            var tmpArray = [];
            BUIOTList[i].IOT = util.resolveGeo(BUIOTList[i].IOT, "IOT");
            finalList.push({IOTName: BUIOTList[i].IOT, id:BUIOTList[i]["_id"], parent: "GeoEntities", catEntry: true});
            if (BUIOTList[i].MIRAAssessmentStatus != "Final") {
              BUIOTList[i].GroupingName = "Geo-Aligned Entities";
              BUIOTList[i].parent = BUIOTList[i]["_id"];
              BUIOTList[i].id = "dummy";
              tmpArray.push(JSON.parse(JSON.stringify(BUIOTList[i])));
            }
            if (parentsObj[BUIOTList[i]["_id"]]) {
              for (var j = 0; j < parentsObj[BUIOTList[i]["_id"]].length; j++) {
                var imtlevel = parentsObj[BUIOTList[i]["_id"]][j];
                if (imtlevel.MIRAAssessmentStatus != "Final") {
                  imtlevel.GroupingName = "Geo-Aligned Entities";
                  imtlevel.IOT = BUIOTList[i].IOT;
                  imtlevel.parent = BUIOTList[i]["_id"];
                  imtlevel.id = "dummy";
                  tmpArray.push(JSON.parse(JSON.stringify(imtlevel)));
                }
                if (parentsObj[imtlevel["_id"]]) {
                  for (var k = 0; k < parentsObj[imtlevel["_id"]].length; k++) {
                    var countrylevel = parentsObj[imtlevel["_id"]][k];
                      if (countrylevel.MIRAAssessmentStatus != "Final") {
                        countrylevel.GroupingName = "Geo-Aligned Entities";
                        countrylevel.IOT = BUIOTList[i].IOT;
                        countrylevel.parent = BUIOTList[i]["_id"];
                        countrylevel.id = "dummy";
                        tmpArray.push(JSON.parse(JSON.stringify(countrylevel)));
                    }
                    if (parentsObj[countrylevel["_id"]]) {
                      for (var l = 0; l < parentsObj[countrylevel["_id"]].length; l++) {
                        var culevel = parentsObj[countrylevel["_id"]][l];
                        if (culevel.MIRAAssessmentStatus != "Final") {
                          culevel.GroupingName = "Geo-Aligned Entities";
                          culevel.IOT = BUIOTList[i].IOT;
                          culevel.parent = BUIOTList[i]["_id"];
                          culevel.id = "dummy";
                          tmpArray.push(JSON.parse(JSON.stringify(culevel)));
                        }
                        if (parentsObj[culevel["_id"]]) {
                          for (var m = 0; m < parentsObj[culevel["_id"]].length; m++) {
                            var accountlevel = parentsObj[culevel["_id"]][m];
                            if (accountlevel.MIRAAssessmentStatus != "Final") {
                              accountlevel.GroupingName = "Geo-Aligned Entities";
                              accountlevel.IOT = BUIOTList[i].IOT;
                              accountlevel.parent = BUIOTList[i]["_id"];
                              accountlevel.id = "dummy";
                              tmpArray.push(JSON.parse(JSON.stringify(accountlevel)));
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            if (CPIOTList[BUIOTList[i].IOT]) {
              for (var j = 0; j < CPIOTList[BUIOTList[i].IOT].length; j++) {
                if (CPIOTList[BUIOTList[i].IOT][j].MIRAAssessmentStatus != "Final" || (CPIOTList[BUIOTList[i].IOT][j].WWBCITAssessmentStatus != "Complete" && CPIOTList[BUIOTList[i].IOT][j].WWBCITAssessmentStatus != "Reviewed"&& CPIOTList[BUIOTList[i].IOT][j].WWBCITAssessmentStatus != "")) {
                  CPIOTList[BUIOTList[i].IOT][j].GroupingName = "Geo-Aligned Entities";
                  CPIOTList[BUIOTList[i].IOT][j].IOT = BUIOTList[i].IOT;
                  CPIOTList[BUIOTList[i].IOT][j].parent = BUIOTList[i]["_id"];
                  CPIOTList[BUIOTList[i].IOT][j].id = "dummy";
                  tmpArray.push(JSON.parse(JSON.stringify(CPIOTList[BUIOTList[i].IOT][j])));
                }
              }
            }
            tmpArray.sort(function(a, b){
              var nameA=a.sortlevel, nameB=b.sortlevel
              if (nameA < nameB){ //sort string ascending
                return -1
              }
              if (nameA > nameB){
                return 1
              }
              return 0 //default return value (no sorting)
            });
            finalList = finalList.concat(tmpArray);
          }
          finalList.push({GroupingName: "Global Processes", id:"GlobalProcesses", catEntry: true});
          finalList.push({IOTName: "(Not Categorized)", id:"GlobalProcesses(NotCategorized)", parent:"GlobalProcesses", catEntry: true});
          for (var i = 0; i < GPList.length; i++) {
            if (GPList[i].MIRAAssessmentStatus != "Final" || (GPList[i].WWBCITAssessmentStatus != "Complete" && GPList[i].WWBCITAssessmentStatus != "Reviewed"&& GPList[i].WWBCITAssessmentStatus != "")) {
              GPList[i].GroupingName = "Global Processes";
              GPList[i].parent = "GlobalProcesses(NotCategorized)";
              GPList[i].id = GPList[i]["_id"];
              finalList.push(GPList[i]);
            }
          }
          finalList.push({GroupingName: "IOT level CUs", id:"IOTlevelCUs", catEntry: true});
          finalList.push({IOTName: "(Not Categorized)", id:"IOTlevelCUs(NotCategorized)", parent:"IOTlevelCUs", catEntry: true});
          for (var i = 0; i < CUIOTList.length; i++) {
            if (CUIOTList[i].MIRAAssessmentStatus != "Final" || (CUIOTList[i].WWBCITAssessmentStatus != "Complete" && CUIOTList[i].WWBCITAssessmentStatus != "Reviewed"&& CUIOTList[i].WWBCITAssessmentStatus != "")) {
              CUIOTList[i].GroupingName = "IOT level CUs";
              CUIOTList[i].parent = "IOTlevelCUs(NotCategorized)";
              CUIOTList[i].id = CUIOTList[i]["_id"];
              finalList.push(CUIOTList[i]);
            }
          }
          finalList.push({GroupingName: "Reporting Group", id:"ReportingGroup", catEntry: true});
          finalList.push({IOTName: "(Not Categorized)", id:"ReportingGroup(NotCategorized)", parent:"ReportingGroup", catEntry: true});
          for (var i = 0; i < BURptGrpList.length; i++) {
            if (BURptGrpList[i].MIRAAssessmentStatus != "Final") {
              BURptGrpList[i].GroupingName = "Reporting Group";
              BURptGrpList[i].parent = "ReportingGroup(NotCategorized)";
              BURptGrpList[i].id = BURptGrpList[i]["_id"];
              finalList.push(BURptGrpList[i]);
            }
          }
          //no admin
            }else{
              finalList.push({GroupingName: "Business Units", id: "BusinessUnit", catEntry: true});
              finalList.push({IOTName: "(Not Categorized)", id: "BusinessUnit(NotCategorized)", parent:"BusinessUnit", catEntry: true});
              for (var i = 0; i < doc.length; i++) {
                if(doc[i].DocSubType == "Business Unit" && (doc[i].MIRAAssessmentStatus != "Final" || (doc[i].WWBCITAssessmentStatus != "Complete" && doc[i].WWBCITAssessmentStatus != "Reviewed"&& doc[i].WWBCITAssessmentStatus != "")) && ((doc[i].AllEditors.indexOf(req.session.user.mail) > -1) || (doc[i].AllReaders.indexOf(req.session.user.mail) > -1))){
                  doc[i].GroupingName = "Business Unit";
                  doc[i].parent = "BusinessUnit(NotCategorized)";
                  doc[i].id = doc[i]["_id"];
                  finalList.push(doc[i]);
                }else{
                  if (doc[i].parentid) {
                    if (parentsObj[doc[i].parentid]) {
                      parentsObj[doc[i].parentid].push(doc[i]);
                    }else {
                      parentsObj[doc[i].parentid] = [doc[i]];
                    }
                  }
                  if(doc[i].DocSubType == "Account"){
                    doc[i].sortlevel = 6;
                    AccountList.push(doc[i]);
                  }else if (doc[i].DocSubType == "BU Country") {
                    doc[i].sortlevel = 3;
                    BUCountryList.push(doc[i]);
                  }else if (doc[i].DocSubType == "BU IMT") {
                    doc[i].sortlevel = 2;
                    BUIMTList.push(doc[i]);
                  }else if (doc[i].DocSubType == "BU IOT") {
                    doc[i].sortlevel = 1;
                    BUIOTList.push(doc[i]);
                  }else if (doc[i].DocSubType == "BU Reporting Group") {
                    doc[i].sortlevel = 8;
                    BURptGrpList.push(doc[i]);
                  }else if (doc[i].DocSubType == "Controllable Unit") {
                    if (doc[i].Portfolio == "Yes") {
                      doc[i].cutype = "Portfolio CU";
                      doc[i].sortlevel = 4;
                    }else{
                      doc[i].cutype = "Standalone CU";
                      doc[i].sortlevel = 5;
                    }
                    CUList.push(doc[i]);
                    if (doc[i].ParentDocSubType == "BU IOT") {
                      CUIOTList.push(doc[i]);
                    }
                  }else if (doc[i].DocSubType == "Country Process") {
                    doc[i].sortlevel = 7;
                    if (CPIOTList[doc[i].IOT]) {
                      CPIOTList[doc[i].IOT].push(doc[i]);
                    }else {
                        CPIOTList[doc[i].IOT] = [doc[i]];
                    }
                    CPList.push(doc[i]);
                  }else if (doc[i].DocSubType == "Global Process") {
                    GPList.push(doc[i]);
                  }
                }
              }
              finalList.push({GroupingName: "Geo-Aligned Entities", id:"GeoEntities", catEntry: true});
              for (var i = 0; i < BUIOTList.length; i++) {
                var tmpArray = [];
                BUIOTList[i].IOT = util.resolveGeo(BUIOTList[i].IOT, "IOT");
                finalList.push({IOTName: BUIOTList[i].IOT, id:BUIOTList[i]["_id"], parent: "GeoEntities", catEntry: true});
                if (BUIOTList[i].MIRAAssessmentStatus != "Final" && ((BUIOTList[i].AllEditors.indexOf(req.session.user.mail) > -1) || (BUIOTList[i].AllReaders.indexOf(req.session.user.mail) > -1))) {
                  BUIOTList[i].GroupingName = "Geo-Aligned Entities";
                  BUIOTList[i].parent = BUIOTList[i]["_id"];
                  BUIOTList[i].id = "dummy";
                  tmpArray.push(JSON.parse(JSON.stringify(BUIOTList[i])));
                }
                if (parentsObj[BUIOTList[i]["_id"]]) {
                  for (var j = 0; j < parentsObj[BUIOTList[i]["_id"]].length; j++) {
                    var imtlevel = parentsObj[BUIOTList[i]["_id"]][j];
                    if (imtlevel.MIRAAssessmentStatus != "Final" && ((imtlevel.AllEditors.indexOf(req.session.user.mail) > -1) || (imtlevel.AllReaders.indexOf(req.session.user.mail) > -1))) {
                      imtlevel.GroupingName = "Geo-Aligned Entities";
                      imtlevel.IOT = BUIOTList[i].IOT;
                      imtlevel.parent = BUIOTList[i]["_id"];
                      imtlevel.id = "dummy";
                      tmpArray.push(JSON.parse(JSON.stringify(imtlevel)));
                    }
                    if (parentsObj[imtlevel["_id"]]) {
                      for (var k = 0; k < parentsObj[imtlevel["_id"]].length; k++) {
                        var countrylevel = parentsObj[imtlevel["_id"]][k];
                          if (countrylevel.MIRAAssessmentStatus != "Final" && ((countrylevel.AllEditors.indexOf(req.session.user.mail) > -1) || (countrylevel.AllReaders.indexOf(req.session.user.mail) > -1))) {
                            countrylevel.GroupingName = "Geo-Aligned Entities";
                            countrylevel.IOT = BUIOTList[i].IOT;
                            countrylevel.parent = BUIOTList[i]["_id"];
                            countrylevel.id = "dummy";
                            tmpArray.push(JSON.parse(JSON.stringify(countrylevel)));
                        }
                        if (parentsObj[countrylevel["_id"]]) {
                          for (var l = 0; l < parentsObj[countrylevel["_id"]].length; l++) {
                            var culevel = parentsObj[countrylevel["_id"]][l];
                            if (culevel.MIRAAssessmentStatus != "Final" && ((culevel.AllEditors.indexOf(req.session.user.mail) > -1) || (culevel.AllReaders.indexOf(req.session.user.mail) > -1))) {
                              culevel.GroupingName = "Geo-Aligned Entities";
                              culevel.IOT = BUIOTList[i].IOT;
                              culevel.parent = BUIOTList[i]["_id"];
                              culevel.id = "dummy";
                              tmpArray.push(JSON.parse(JSON.stringify(culevel)));
                            }
                            if (parentsObj[culevel["_id"]]) {
                              for (var m = 0; m < parentsObj[culevel["_id"]].length; m++) {
                                var accountlevel = parentsObj[culevel["_id"]][m];
                                if (accountlevel.MIRAAssessmentStatus != "Final" && ((accountlevel.AllEditors.indexOf(req.session.user.mail) > -1) || (accountlevel.AllReaders.indexOf(req.session.user.mail) > -1))) {
                                  accountlevel.GroupingName = "Geo-Aligned Entities";
                                  accountlevel.IOT = BUIOTList[i].IOT;
                                  accountlevel.parent = BUIOTList[i]["_id"];
                                  accountlevel.id = "dummy";
                                  tmpArray.push(JSON.parse(JSON.stringify(accountlevel)));
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }

                if (CPIOTList[BUIOTList[i].IOT]) {
                  for (var j = 0; j < CPIOTList[BUIOTList[i].IOT].length; j++) {
                    if (CPIOTList[BUIOTList[i].IOT][j].MIRAAssessmentStatus != "Final" || (CPIOTList[BUIOTList[i].IOT][j].WWBCITAssessmentStatus != "Complete" && CPIOTList[BUIOTList[i].IOT][j].WWBCITAssessmentStatus != "Reviewed"&& CPIOTList[BUIOTList[i].IOT][j].WWBCITAssessmentStatus != "") && ((CPIOTList[BUIOTList[i].IOT][j].AllEditors.indexOf(req.session.user.mail) > -1) || (CPIOTList[BUIOTList[i].IOT][j].AllReaders.indexOf(req.session.user.mail) > -1))) {
                      CPIOTList[BUIOTList[i].IOT][j].GroupingName = "Geo-Aligned Entities";
                      CPIOTList[BUIOTList[i].IOT][j].IOT = BUIOTList[i].IOT;
                      CPIOTList[BUIOTList[i].IOT][j].parent = BUIOTList[i]["_id"];
                      CPIOTList[BUIOTList[i].IOT][j].id = "dummy";
                      tmpArray.push(JSON.parse(JSON.stringify(CPIOTList[BUIOTList[i].IOT][j])));
                    }
                  }
                }
                tmpArray.sort(function(a, b){
                  var nameA=a.sortlevel, nameB=b.sortlevel
                  if (nameA < nameB){ //sort string ascending
                    return -1
                  }
                  if (nameA > nameB){
                    return 1
                  }
                  return 0 //default return value (no sorting)
                });
                finalList = finalList.concat(tmpArray);
              }
              finalList.push({GroupingName: "Global Processes", id:"GlobalProcesses", catEntry: true});
              finalList.push({IOTName: "(Not Categorized)", id:"GlobalProcesses(NotCategorized)", parent:"GlobalProcesses", catEntry: true});
              for (var i = 0; i < GPList.length; i++) {
                if (GPList[i].MIRAAssessmentStatus != "Final" || (GPList[i].WWBCITAssessmentStatus != "Complete" && GPList[i].WWBCITAssessmentStatus != "Reviewed"&& GPList[i].WWBCITAssessmentStatus != "") && ((GPList[i].AllEditors.indexOf(req.session.user.mail) > -1) || (GPList[i].AllReaders.indexOf(req.session.user.mail) > -1))) {
                  GPList[i].GroupingName = "Global Processes";
                  GPList[i].parent = "GlobalProcesses(NotCategorized)";
                  GPList[i].id = GPList[i]["_id"];
                  finalList.push(GPList[i]);
                }
              }
              finalList.push({GroupingName: "IOT level CUs", id:"IOTlevelCUs", catEntry: true});
              finalList.push({IOTName: "(Not Categorized)", id:"IOTlevelCUs(NotCategorized)", parent:"IOTlevelCUs", catEntry: true});
              for (var i = 0; i < CUIOTList.length; i++) {
                if (CUIOTList[i].MIRAAssessmentStatus != "Final" || (CUIOTList[i].WWBCITAssessmentStatus != "Complete" && CUIOTList[i].WWBCITAssessmentStatus != "Reviewed"&& CUIOTList[i].WWBCITAssessmentStatus != "") && ((CUIOTList[i].AllEditors.indexOf(req.session.user.mail) > -1) || (CUIOTList[i].AllReaders.indexOf(req.session.user.mail) > -1))) {
                  CUIOTList[i].GroupingName = "IOT level CUs";
                  CUIOTList[i].parent = "IOTlevelCUs(NotCategorized)";
                  CUIOTList[i].id = CUIOTList[i]["_id"];
                  finalList.push(CUIOTList[i]);
                }
              }
              finalList.push({GroupingName: "Reporting Group", id:"ReportingGroup", catEntry: true});
              finalList.push({IOTName: "(Not Categorized)", id:"ReportingGroup(NotCategorized)", parent:"ReportingGroup", catEntry: true});
              for (var i = 0; i < BURptGrpList.length; i++) {
                if (BURptGrpList[i].MIRAAssessmentStatus != "Final" && ((BURptGrpList[i].AllEditors.indexOf(req.session.user.mail) > -1) || (BURptGrpList[i].AllReaders.indexOf(req.session.user.mail) > -1))) {
                  BURptGrpList[i].GroupingName = "Reporting Group";
                  BURptGrpList[i].parent = "ReportingGroup(NotCategorized)";
                  BURptGrpList[i].id = BURptGrpList[i]["_id"];
                  finalList.push(BURptGrpList[i]);
                }
              }
            }
        for (var i = 0; i < finalList.length; i++) {
          if(!finalList[i].catEntry){
            var tmp = {
              GroupingName: finalList[i].GroupingName || " ",
              IOT: finalList[i].IOT || " ",
              DocSubType:finalList[i].DocSubType || " ",
              Name: finalList[i].Name || " ",
              MIRAAssessmentStatus: finalList[i].MIRAAssessmentStatus || " ",
              WWBCITAssessmentStatus: finalList[i].WWBCITAssessmentStatus || " ",
              PeriodRating: finalList[i].PeriodRating || " "
            }
            exportInfo.push(tmp);
          }
        }
				deferred.resolve({"status": 200, "doc":finalList, "exportInfo": exportInfo});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}
		catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	audunifiles: function(req, db) {
		var deferred = q.defer();
		var G=[];
		try{

			if(req.session.BG.indexOf("MIRA-ADMIN") > '-1'){
				var objAUF = {
					"selector": {
							"Name": { "$gt": null },
							"key": "Assessable Unit",
              "PeriodRating": {"$gt":0},
              "CurrentPeriod": req.session.quarter,
							"Status": "Active",
							"$or": [{"DocSubType":"Controllable Unit"},{"DocSubType":"Country Process"}],
					    "AuditableFlag": "Yes",
							"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"PeriodRating": "asc"},{"Name":"asc"}]
				};
			}
			else{
				var objAUF = {
					"selector": {
						"Name": { "$gt": null },
						"key": "Assessable Unit",
            "PeriodRating": {"$gt":0},
            "CurrentPeriod": req.session.quarter,
						"Status": "Active",
						"$or": [{"DocSubType":"Controllable Unit"},{"DocSubType":"Country Process"}],
					  "AuditableFlag": "Yes",
						"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}],
						"MIRABusinessUnit": req.session.businessunit
					}
        };
			}
			db.find(objAUF).then(function(data){
				var audoc = data.body.docs;
        var auids = [];
        var audocs = {};
        for (var i = 0; i < audoc.length; i++) {
          auids.push(audoc[i]["_id"]);
          audocs[audoc[i]["_id"]] = audoc[i];
        }
        var assmts = {
					"selector": {
            "_id": {"$gt":0},
            "AssessableUnitName": {"$gt":0},
            "PeriodRating": {"$gt":0},
						"key": "Assessment",
            "CurrentPeriod": req.session.quarter,
						"$or": [{"ParentDocSubType":"Controllable Unit"},{"ParentDocSubType":"Country Process"}],
						"MIRABusinessUnit": req.session.businessunit,
            "parentid": {"$in": auids }
					},
					"sort": [{"PeriodRating": "asc"},{"AssessableUnitName":"asc"}]
				};
  			db.find(assmts).then(function(data){
          var doc = data.body.docs;
          var CurrentPeriod;
          var PrevQtrs;
          if (doc.length >0) {
            CurrentPeriod = doc[0].CurrentPeriod;
            PrevQtrs = fieldCalc.getPrev4Qtrs(CurrentPeriod);
          }
  				var finalList = [];
          var catList = {};
          var exportInfo = [];
          var asmtsids = {};
          finalList.push({catName: "Total", total: doc.length, id: "Total", catEntry: true});
          for (var i = 0; i < doc.length; i++) {
            if (!catList[doc[i].PeriodRating]) {
              var tmp = {
                id: doc[i].PeriodRating,
                catName: doc[i].PeriodRating,
                parent: "Total",
                total: 0,
                catEntry: true
              };
              finalList.push(tmp);
              catList[doc[i].PeriodRating] = tmp;
            }
            if (doc[i].ParentDocSubType == "Controllable Unit") {
              if(doc[i].Portfolio == "Yes"){
                doc[i].ParentDocSubType = "Portfolio CU";
              }else{
                doc[i].ParentDocSubType = "Standalone CU";
              }
            }
            doc[i].CUSize = audocs[doc[i].parentid].CUSize;
            doc[i].CUMaxScore = fieldCalc.getCUMaxScore(doc[i].CUSize);
            doc[i].CUScore = fieldCalc.getCUScore(doc[i].PeriodRating, doc[i].CUMaxScore);
            asmtsids[doc[i]["_id"]] = doc[i];
            doc[i].AuditProgram = audocs[doc[i].parentid].AuditProgram
            doc[i].id = doc[i]["_id"];
            doc[i].parent = doc[i].PeriodRating;
            finalList.push(doc[i]);
            catList[doc[i].PeriodRating].total++;
          }
          PrevQtrs.push(CurrentPeriod);
          var audits = {
  					"selector": {
              "_id": {"$gt":0},
              "reportingQuarter": {"$in": PrevQtrs},
              "docType": "asmtComponent",
              "compntType": "localAudit",
              "auditOrReview": "ARR",
              "parentid": {"$in": Object.keys(asmtsids) }
  					},
            "fields": ["parentid","rating","reportingQuarter"]
          };
    			db.find(audits).then(function(data){
            PrevQtrs.pop();
            audits = data.body.docs;
            audits.sort(function(a, b){
              var nameA=a.reportingQuarter, nameB=b.reportingQuarter
              if (nameA > nameB) //sort string descending
                return -1
              if (nameA < nameB)
                return 1
              return 0 //default return value (no sorting)
            });
            for (var i = 0; i < audits.length; i++) {
              if(asmtsids[audits[i].parentid]){
                asmtsids[audits[i].parentid].AuditReadiness = asmtsids[audits[i].parentid].CurrentPeriod+" "+ audits[i].rating;
                delete asmtsids[audits[i].parentid];
              }
            }
            for (var i = 0; i < finalList.length; i++) {
              if(!finalList[i].catEntry){
                exportInfo.push({
                    catName: finalList[i].PeriodRating || " ",
                    AssessableUnitName: finalList[i].AssessableUnitName || " ",
                    total: finalList[i].total || " ",
                    ParentDocSubType: finalList[i].ParentDocSubType || " ",
                    AuditProgram: finalList[i].AuditProgram || " ",
                    AuditReadiness: finalList[i].AuditReadiness || " ",
                    PeriodRatingPrev4: finalList[i].PeriodRatingPrev4 || " ",
                    PeriodRatingPrev3: finalList[i].PeriodRatingPrev3 || " ",
                    PeriodRatingPrev2: finalList[i].PeriodRatingPrev2 || " ",
                    PeriodRatingPrev1: finalList[i].PeriodRatingPrev1 || " ",
                    PeriodRating: finalList[i].PeriodRating || " ",
                    NextQtrRating: finalList[i].NextQtrRating || " ",
                    Target2Sat: finalList[i].Target2Sat || " ",
                    CUSize: finalList[i].CUSize || " ",
                    CUMaxScore: finalList[i].CUMaxScore || " ",
                    CUScore: finalList[i].CUScore || " ",
                    ReviewComments: finalList[i].ReviewComments || " "
                });
              }
            }
    				deferred.resolve({"status": 200, "doc":finalList, "exportInfo": exportInfo});
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
		catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	cuauditlessonslearned: function(req, db) {
		var deferred = q.defer();
		try{
			if(req.session.BG.indexOf("MIRA-ADMIN") > '-1'){
				var objCUALL = {
					"selector": {
						    "AssessableUnitName": { "$gt": null },
					        "CurrentPeriod": req.session.quarter,
							"key": "Assessment",
							"ParentDocSubType":"Controllable Unit",
							"$not":{"AUStatus":"Retired"},
							"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"AssessableUnitName":"asc"},{"CurrentPeriod":"asc"}]
				};
			}
			else{
				var objCUALL = {
					"selector": {
						    "AssessableUnitName": { "$gt": null },
					        "CurrentPeriod": req.session.quarter,
							"key": "Assessment",
							"ParentDocSubType":"Controllable Unit",
							"$not":{"AUStatus":"Retired"},
							"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}],
							"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"AssessableUnitName":"asc"},{"CurrentPeriod":"asc"}]
				};
			}

			db.find(objCUALL).then(function(data){
				var doc = data.body.docs;
				var len= doc.length;
				var view_cuALLReport = [];
				var exportInfo = [];
				if(len > 0){
					for (var i = 0; i < len; i++){
						var a=doc[i]._id; var b=doc[i].AssessableUnitName;var c=doc[i].IOT;
						var tmp = {
							IOT: doc[i].IOT,
							IMT: doc[i].IMT,
							AssessableUnitName: doc[i].AssessableUnitName,
							Quarter: doc[i].CurrentPeriod,
							Response:doc[i].ARALLResponse,
							Findings:doc[i].ARALLQtrRating,
							Target2Sat:doc[i].ARALLTarget2Sat,
							Explanation: doc[i].ARALLExplanation
						};
						exportInfo.push(tmp);
						view_cuALLReport.push({
							IOT: doc[i].IOT,
							IMT: doc[i].IMT,
							AssessableUnitName: doc[i].AssessableUnitName,
							Quarter: doc[i].CurrentPeriod,
							Response:doc[i].ARALLResponse,
							Findings:doc[i].ARALLQtrRating,
							Target2Sat:doc[i].ARALLTarget2Sat,
							Explanation: doc[i].ARALLExplanation,
							_id: doc[i]._id
						});
					}
				}
				view=JSON.stringify(view_cuALLReport, 'utf8');
				deferred.resolve({"status": 200, "doc":view_cuALLReport});
			}).catch(function(err) {
				console.log("[report][cuauditlessonslearned]" + err.error.reason);
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}
		catch(e){
			console.log("[report][cuauditlessonslearned]" + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	}
	};
module.exports = report;
