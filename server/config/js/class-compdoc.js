/**************************************************************************************************
*
* MIRA Component Documents
* Date: 16 December 2016
* By: genonms@ph.ibm.com
*
*/

var q  = require("q");
var fieldCalc = require('./class-fieldcalc.js');

var getDocs = {

  getCompDocs: function(db,doc) {
    var deferred = q.defer();
    try {
      switch (doc[0].ParentDocSubType) {
        case "Country Process":
          var compObj = {
            selector : {
              "_id": {"$gt":0},
              "docType": "asmtComponent",
              "$or": [
                // Key Controls Testing Tab
                { "$and": [{"compntType": "countryControls"}, {"ParentWWBCITKey": doc[0].WWBCITKey}, {"status": {"$ne": "Retired"}}] },
                { "$and": [{"compntType": "controlSample"}, {"reportingCountry": doc[0].Country}, {"processSampled": doc[0].GlobalProcess}, {"status": {"$ne": "Retired"}}] },
                { "$and": [{"compntType": "sampledCountry"}, {"CPParentIntegrationKeyWWBCIT": doc[0].WWBCITKey}, {"status": {"$ne": "Retired"}}] },
                // Audits and Reviews Tab
                { "$and": [{"compntType": "PPR"},{"countryProcess" : doc[0].AssessableUnitName}] },
                { "$and": [{"compntType": "internalAudit"},{"$or":[{"CPWWBCITKey" : doc[0].WWBCITKey},{"RPTG_PROCESS": {"$ne": ""}}]}] },
                // { "$and": [{"compntType": "ppr"},{"RPTG_BUSINESS_UNIT": doc[0].BusinessUnit},{"CPWWBCITKey" : doc[0].WWBCITKey},{"REVIEW_TYPE": "CHQ Internal Audit"}] },
                { "$and": [{"compntType": "localAudit"},{"parentid": doc[0]._id}] }
                // { "$and": [{"DOCTYPE": "ppreview"},{"RPTG_BUSINESS_UNIT": doc[0].BusinessUnit}] }
              ]
            }
          };

          db.find(compObj).then(function(compdata) {
            var comps = compdata.body.docs;
            doc[0].risks = [];
            doc[0].RCTestData = [];
            doc[0].SCTestData = [];
            doc[0].SampleData = [];
            doc[0].SampleData2 = [];
            doc[0].AuditTrustedData = [];
            doc[0].AuditTrustedRCUData = [];
            doc[0].AuditLocalData = [];
            var controlCtr = 0;
            var scControlCtr = 0;
            var sampleCtr = 0;
            var sampleCtrPQ = 0;
            var ctrlname;
            var processCat;
            for(var i = 0; i < comps.length; i++) {
              if (comps[i].compntType == "openIssue") {
                doc[0].risks.push(comps[i]);
              }
              else if (comps[i].compntType == "countryControls") {
                doc[0].RCTestData.push(comps[i]);
                // Calculate for Defect Rate of Control doc
                if (doc[0].RCTestData[controlCtr].defectRate != "") {
                  doc[0].RCTestData[controlCtr].defectRate = (parseInt(doc[0].RCTestData[controlCtr].defectRate)).toFixed(1);
                  if (doc[0].RCTestData[controlCtr].defectRate == 0.0) {
                    doc[0].RCTestData[controlCtr].defectRate = 0;
                    doc[0].RCTestData[controlCtr].RAGStatus = "Sat";
                  }
                }
                // Calculate for ControlName
                doc[0].RCTestData[controlCtr].controlName = doc[0].RCTestData[controlCtr].controlReferenceNumber.split("-")[2] + " - " + doc[0].RCTestData[controlCtr].controlShortName;
                controlCtr++;
              }
              else if (comps[i].compntType == "sampledCountry") {
                doc[0].SCTestData.push(comps[i]);
                // Calculate for Defect Rate of Control doc
                doc[0].SCTestData[scControlCtr].defectRate = (parseInt(doc[0].SCTestData[scControlCtr].defectRate)).toFixed(1);
                // Calculate for ControlName
                doc[0].SCTestData[scControlCtr].controlName = doc[0].SCTestData[scControlCtr].controlReferenceNumber.split("-")[2] + " - " + doc[0].SCTestData[scControlCtr].controlShortName;
                scControlCtr++;
              }
              else if (comps[i].compntType == "controlSample") {
                doc[0].SampleData.push(JSON.parse(JSON.stringify(comps[i])));
                // calculate Process Category
                if (comps[i].controlType == "KCO") {
                  processCat = "Operational";
                } else {
                  processCat = "Financial";
                }
                doc[0].SampleData[sampleCtr].processCategory = processCat;

                // calculate Control Name
                ctrlname = comps[i].controlReferenceNumber.split("-")[2] + " - " + comps[i].controlShortName;
                doc[0].SampleData[sampleCtr].controlName = ctrlname;

                // Calculate for unremedPriorSample - Samples from prior quarters with unremediated defects. It will be used as a flag to alert that the asmt has an exception in it skey controls testing
                // this will also be displayed in the Unremediated Samples from Prior Periods
                if (comps[i].status != "Retired" && comps[i].reportingQuarter > comps[i].originalReportingQuarter && comps[i].remediationStatus == "Open" && comps[i].numDefects > 0) {
                  doc[0].unremedPriorSample = true;
                  doc[0].SampleData2.push(comps[i]);
                  doc[0].SampleData2[sampleCtrPQ].processCategory = processCat;
                  doc[0].SampleData2[sampleCtrPQ].controlName = ctrlname;
                  sampleCtrPQ++;
                }
                sampleCtr++;
              }
              // For Audits and Reviews Tab - view 1
              else if ((comps[i].compntType == "PPR" && comps[i].countryProcess == doc[0].AssessableUnitName) || (comps[i].compntType == "internalAudit" && comps[i].CPWWBCITKey ==  doc[0].WWBCITKey)) {
                doc[0].AuditTrustedData.push(comps[i]);
              }
              // For Audits and Reviews Tab - view 2
              else if ((comps[i].compntType == "PPR" || comps[i].compntType == "internalAudit") && doc[0].RelevantCPs != undefined && comps[i].RPTG_PROCESS.indexOf(doc[0].WWBCITKey)) {
                doc[0].AuditTrustedRCUData.push(comps[i]);
              }
              // For Audits and Reviews Tab - view 3
              else if (comps[i].compntType == "localAudit") {
                doc[0].AuditLocalData.push(comps[i]);
              }
              else {

              }
            }
            deferred.resolve({"status": 200, "doc": doc});
          }).catch(function(err) {
            console.log("[class-compdoc][getCompDocs] - " + err.error);
            deferred.reject({"status": 500, "error": err.error.reason});
          });
        break;
        case "Global Process":
        break;
        case "BU Reporting Group":
        break;
        case "Business Unit":
        break;
        case "BU IOT":
        break;
        case "BU IMT":
        break;
        case "BU Country":
        break;
        case "Controllable Unit":
          var compObj = {
            selector : {
              "_id": {"$gt":0},
              "docType": "asmtComponent",
              "$or": [
                // Key Controls Testing Tab
                { "$and": [{"compntType": "countryControls"},{"reportingQuarter": doc[0].CurrentPeriod},{"owningBusinessUnit": doc[0].BusinessUnit}] },
                { "$and": [{"compntType": "controlSample"},{"reportingQuarter": doc[0].CurrentPeriod},{"owningBusinessUnit": doc[0].BusinessUnit}] },
                { "$and": [{"compntType": "sampledCountry"},{"reportingQuarter": doc[0].CurrentPeriod},{"owningBusinessUnit": doc[0].BusinessUnit}] },
              ]
            }
          };
          db.find(compObj).then(function(compdata) {
            var comps = compdata.body.docs;
            doc[0].RCTestData = [];
            doc[0].SCTestData = [];
            doc[0].SampleData = [];
            var controlCtr = 0;
            var scControlCtr = 0;
            var sampleCtr = 0;
            for(var i = 0; i < comps.length; i++) {
              if (comps[i].compntType == "openIssue") {
                doc[0].risks.push(comps[i]);
              }
              else if (comps[i].compntType == "countryControls") {
                doc[0].RCTestData.push(comps[i]);
                // Calculate for Defect Rate of Control doc
                if (doc[0].RCTestData[controlCtr].numActualTests ==  undefined || doc[0].RCTestData[controlCtr].numActualTests == "" || doc[0].RCTestData[controlCtr].numActualTests == 0 || doc[0].RCTestData[controlCtr].numDefects == undefined || doc[0].RCTestData[controlCtr].numDefects == "") {
                  doc[0].RCTestData[controlCtr].defectRate = "";
                } else {
                  doc[0].RCTestData[controlCtr].defectRate = ((doc[0].RCTestData[controlCtr].numDefects/doc[0].RCTestData[controlCtr].numActualTests) * 100).toFixed(1);
                }
                // Calculate for ControlName
                doc[0].RCTestData[controlCtr].controlName = doc[0].RCTestData[controlCtr].controlReferenceNumber.split("-")[2] + " - " + doc[0].RCTestData[controlCtr].controlShortName;
                controlCtr++;
              }
              else if (comps[i].compntType == "sampledCountry") {
                doc[0].SCTestData.push(comps[i]);
                // Calculate for ControlName
                doc[0].SCTestData[scControlCtr].controlName = doc[0].SCTestData[scControlCtr].controlReferenceNumber.split("-")[2] + " - " + doc[0].SCTestData[scControlCtr].controlShortName;
                scControlCtr++;
              }
              else if (comps[i].compntType == "controlSample") {
                doc[0].SampleData.push(comps[i]);
                if (comps[i].controlType == "KCO") {
                  doc[0].SampleData[sampleCtr].processCategory = "Operational";
                } else {
                  doc[0].SampleData[sampleCtr].processCategory = "Financial";
                }
                // Calculate for unremedPriorSample - Samples from prior quarters with unremediated defects. It will be used as a flag to alert that the asmt has an exception in it skey controls testing
                if (comps[i].status != "Retired" && comps[i].reportingQuarter > comps[i].originalReportingQuarter && comps[i].remediationStatus == "Open" && comps[i].numDefects > 0) {
                  doc[0].unremedPriorSample = true;
                }
                // Calculate for ControlName
                doc[0].SampleData[sampleCtr].controlName = doc[0].SampleData[sampleCtr].controlReferenceNumber.split("-")[2] + " - " + doc[0].SampleData[sampleCtr].controlShortName;
                sampleCtr++;
              }
              else {

              }
            }
            deferred.resolve({"status": 200, "doc": doc});
          }).catch(function(err) {
            console.log("[class-compdoc][getCompDocs] - " + err.error);
            deferred.reject({"status": 500, "error": err.error.reason});
          });
        break;
      }
    }
    catch(e) {
      console.log("[class-compdoc][getCompDocs] - " + err.error);
      deferred.reject({"status": 500, "error": err.error.reason});
    }
    return deferred.promise;
  },

  getOpenIssue: function(db,doc,defViewRow){
    var deferred = q.defer();
    try {
      switch (doc[0].ParentDocSubType) {
        case "Controllable Unit":
        //Open issue
        var objIssue = {
          selector : {
            "_id": {"$gt":0},
            "compntType": "openIssue",
            "docType": "asmtComponent",
            "reportingQuarter": doc[0].CurrentPeriod,
            "controllableUnit": doc[0].AssessableUnitName,
            "businessUnit": doc[0].BusinessUnit,
            "scorecardCategory": {"$gt":0}
          },
          sort:[{"scorecardCategory":"asc"}]
        };
        break;
        case "Country Process":
        var objIssue = {
          selector : {
            "_id": {"$gt":0},
            "compntType": "openIssue",
            "docType": "asmtComponent",
            "reportingQuarter": doc[0].CurrentPeriod,
            "process": doc[0].GlobalProcess,
            "businessUnit": doc[0].BusinessUnit,
            "country": doc[0].Country,
            "scorecardCategory": {"$gt":0}
          },
          sort:[{"scorecardCategory":"asc"}]
        };
        break;
      }
      db.find(objIssue).then(function(dataRisks){
        var risks = dataRisks.body.docs;
        var riskCategory = {};
        var openrisks = [];
        var exportOpenRisks = [];
        doc[0].ORMCMissedRisks = 0;
        var objects = {};//object of objects for counting
        for(var i = 0; i < risks.length; i++){
          if(typeof riskCategory[risks[i].scorecardCategory] === "undefined"){
            var tmp = {
              id:risks[i].scorecardCategory.replace(/ /g,''),
              name:risks[i].scorecardCategory,
              numTasks: 0,
              numTasksOpen: 0,
              numMissedTasks: 0
            };
            openrisks.push(tmp);
            objects[tmp.id] = tmp;
            riskCategory[risks[i].scorecardCategory] = true;
          }
          if(risks[i].FlagTodaysDate == "1"||risks[i].ctrg > 0 || risks[i].numMissedTasks > 0){
            risks[i].missedFlag = true;
            doc[0].ORMCMissedRisks = 1;
          }else {
            risks[i].missedFlag = false;
          }
          var tmp = {};
          tmp.type = risks[i].type;
          tmp.name = risks[i].name;
          tmp.id = risks[i].id;
          tmp.status = risks[i].status;
          tmp.process = risks[i].process;
          tmp.originalTargetDate = risks[i].originalTargetDate;
          tmp.currentTargetDate = risks[i].currentTargetDate;
          tmp.numTasks = risks[i].numTasks;
          tmp.numTasksOpen = risks[i].numTasksOpen;
          tmp.numMissedTasks = risks[i].numMissedTasks;
          tmp.missedFlag = risks[i].missedFlag;
          tmp.riskAbstract = risks[i].riskAbstract;
          exportOpenRisks.push(tmp);
          risks[i].parent = risks[i].scorecardCategory.replace(/ /g,'');
          //do counting for category
          objects[risks[i].parent].numTasks += parseFloat(risks[i].numTasks);
          objects[risks[i].parent].numTasksOpen += parseFloat(risks[i].numTasksOpen);
          objects[risks[i].parent].numMissedTasks += parseFloat(risks[i].numMissedTasks);

          openrisks.push(risks[i]);
        }

        doc[0].exportOpenRisks =JSON.stringify(exportOpenRisks, 'utf8');
        if (Object.keys(riskCategory).length < defViewRow) {
          if (openrisks == 0) {
            openrisks = fieldCalc.addTestViewData(10,defViewRow);
          } else {
            fieldCalc.addTestViewDataPadding(openrisks,10,(defViewRow-Object.keys(riskCategory).length));
          }
        };
        doc[0].openrisks = openrisks;
        deferred.resolve({"status": 200, "doc": doc});
      }).catch(function(err) {
        console.log("[compdoc][openissue]" + err.stack);
        deferred.reject({"status": 500, "error": err});
      });
    }
    catch(e) {
      console.log("[class-compdoc][getCompDocs] - " + err.error);
      deferred.reject({"status": 500, "error": err.error.reason});
    }
    return deferred.promise;
  }

}
module.exports = getDocs;
