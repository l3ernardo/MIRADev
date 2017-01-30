/**************************************************************************************************
*
* MIRA Component Documents
* Date: 16 December 2016
* By: genonms@ph.ibm.com
*
*/

var q  = require("q");
var fieldCalc = require('./class-fieldcalc.js');
var util = require('./class-utility.js');

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
                { "$and": [{"compntType": "internalAudit"},{"parentid":doc[0].parentid}] },
                { "$and": [{"compntType": "internalAudit"},{"parentid": {"$in": doc[0].CURelevantAUID}}] },
                { "$and": [{"compntType": "localAudit"},{"parentid": doc[0]._id}] }
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
              // For Audits and Reviews Tab - view 1 and 2
              else if (comps[i].compntType == "PPR" || comps[i].compntType == "internalAudit") {
                // For view 1
                if (comps[i].compntType == "PPR") {
                  doc[0].AuditTrustedData.push(comps[i]);
                }
                // For view 1
                if (comps[i].compntType == "internalAudit" && comps[i].parentid == doc[0].parentid) {
                  comps[i].reportingQuarter = "20"+comps[i].engagement.split("-")[0]+" Q"+doc[0].CurrentPeriod.split(" Q")[1];
                  comps[i].auditOrReview = "CHQ Internal Audit";
                  comps[i].id = comps[i].engagement;
                  comps[i].reportDate = comps[i].addedToAQDB;
                  comps[i].countryProcess = doc[0].AssessableUnitName;
                  doc[0].AuditTrustedData.push(comps[i]);
                }
                // For view 2
                if (comps[i].compntType == "internalAudit") {
                  for (var j = 0; j < doc[0].CURelevantAU.length; j++) {
                    if (comps[i].parentid == doc[0].CURelevantAU[j].id) {
                      comps[i].reportingQuarter = "20"+comps[i].engagement.split("-")[0]+" Q"+doc[0].CurrentPeriod.split(" Q")[1];
                      comps[i].auditOrReview = "CHQ Internal Audit";
                      comps[i].id = comps[i].engagement;
                      comps[i].reportDate = comps[i].addedToAQDB;
                      comps[i].controllableUnit = doc[0].CURelevantAU[j].name;
                      doc[0].AuditTrustedRCUData.push(comps[i]);
                      break;
                    }
                  }
                }
              }
              // For Audits and Reviews Tab - view 3
              else if (comps[i].compntType == "localAudit") {
                doc[0].AuditLocalData.push(comps[i]);
              }
            }
            deferred.resolve({"status": 200, "doc": doc});
          }).catch(function(err) {
            console.log("[class-compdoc][getCompDocs](Country Process) - " + err.error);
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
        case "Account":
          var compObj = {
            selector : {
              "_id": {"$gt":0},
              "docType": "asmtComponent",
              "$or": [
                // Key Controls Testing Tab
                { "$and": [{"compntType": "accountControls"},{"parentid": doc[0]._id},{"reportingQuarter":doc[0].CurrentPeriod}] },
                // Audits and Reviews Tab
                { "$and": [{"compntType": "accountAudit"},{"parentid": doc[0]._id}, {"reportingQuarter": {"$in":[doc[0].CurrentPeriod,fieldCalc.getPrevQtr(doc[0].CurrentPeriod)]}}] }
              ]
            }
          };
          db.find(compObj).then(function(compdata) {
            var comps = compdata.body.docs;
            doc[0].RCTestData = [];
            doc[0].AuditLocalData = [];
            var totalTest = 0;
            var withTest = false;
            var totalDefect = 0;
            for(var i = 0; i < comps.length; i++) {
              //Calculate for Audit data
              if (comps[i].compntType == "accountAudit") {
                if (comps[i].reportingQuarter == doc[0].CurrentPeriod) {
                  doc[0].AuditLocalData.push(comps[i]);
                }
                // Calculate for Audit/Review exception
                if (comps[i].numRecommendationsOpen !== "" && parseInt(comps[i].numRecommendationsOpen) > 0 ) {
                  var currdate = new Date();
                  currdate.setHours(0,0,0,0);
                  var dateval = "";
                  if (comps[i].targetCloseCurrent !== undefined && comps[i].targetCloseCurrent !== "") {
                    dateval = new Date(comps[i].targetCloseCurrent);
                  } else {
                    if (comps[i].targetCloseOriginal !== undefined && comps[i].targetCloseOriginal !== "") {
                      dateval = new Date(comps[i].targetCloseOriginal);
                    }
                  }
                  if (comps[i].rating == "Marginal" || comps[i].rating == "Marg" || comps[i].rating == "Unsat" || comps[i].rating == "Qualified" || comps[i].rating == "C" ||
                      comps[i].rating == "D" || comps[i].rating == "Negative" || comps[i].rating == "Unsatisfactory" || comps[i].rating == "Unfavorable" ||
                      (dateval !== "" && dateval < currdate)) {

                    doc[0].auditReviewException = true;
                  }
                }

              }
              //Calculate for Account Key Control Testing (Account Controls)
              else if (comps[i].compntType == "accountControls") {
                doc[0].RCTestData.push(comps[i]);
                // For Defect rate calculation
                if (comps[i].numTestsCompleted !== undefined && comps[i].numTestsCompleted !== "") {
                  withTest = true;
                  totalTest += parseInt(comps[i].numTestsCompleted);
                }
                if (comps[i].numProcessDefects !== undefined && comps[i].numProcessDefects !== "") {
                  withTest = true;
                  totalDefect += parseInt(comps[i].numProcessDefects);
                }

                //calculate for Process Category
                if (doc[0].GBSRollupProcessesOPS !== undefined) {
                  for (var j = 0; j < doc[0].GBSRollupProcessesOPS.length; j++) {
                    if (comps[i].process == doc[0].GBSRollupProcessesOPS[j].name) {
                      comps[i].processCategory = "Operational Processes";
                      break;
                    }
                  }
                }
                if (comps[i].processCategory == undefined && doc[0].GBSRollupProcessesFIN !== undefined) {
                  for (var j = 0; j < doc[0].GBSRollupProcessesFIN.length; j++) {
                    if (comps[i].process == doc[0].GBSRollupProcessesFIN[j].name) {
                      comps[i].processCategory = "Financial Processes";
                      break;
                    }
                  }
                }
                if (comps[i].processCategory == undefined && doc[0].GTSRollupProcessesOPS !== undefined) {
                  for (var j = 0; j < doc[0].GTSRollupProcessesOPS.length; j++) {
                    if (comps[i].process == doc[0].GTSRollupProcessesOPS[j].name) {
                      comps[i].processCategory = "Operational Processes";
                      break;
                    }
                  }
                }
                if (comps[i].processCategory == undefined && doc[0].GTSRollupProcessesFIN !== undefined) {
                  for (var j = 0; j < doc[0].GTSRollupProcessesFIN.length; j++) {
                    if (comps[i].process == doc[0].GTSRollupProcessesFIN[j].name) {
                      comps[i].processCategory = "Financial Processes";
                      break;
                    }
                  }
                }
                if (comps[i].processCategory == undefined) {
                  comps[i].processCategory = "Operational Processes";
                }
              }
              else {
                console.log("Did not enter either Account Audits or Audit Controls");
              }
            }
            // Calculate for Defect Rate and RAGStatus
            if (withTest) {
              doc[0].AUDefectRate = ((totalDefect/totalTest) * 100).toFixed(1);
              if (doc[0].AUDefectRate == 0) {
                doc[0].AUDefectRate = 0;
              }
              if (doc[0].AUDefectRate >= doc[0].UnsatThresholdPercent) {
                doc[0].RAGStatus = "Unsat";
                doc[0].kctException = true;
              } else if (doc[0].AUDefectRate < doc[0].MargThresholdPercent) {
                doc[0].RAGStatus = "Sat";
              } else {
                doc[0].RAGStatus = "Marg";
                doc[0].kctException = true;
              }
            }else{
              doc[0].RAGStatus = "";
              doc[0].defectRate = "";
            }
            deferred.resolve({"status": 200, "doc": doc});
          }).catch(function(err) {
            console.log("[class-compdoc][getCompDocs](Account) - " + err.error);
            deferred.reject({"status": 500, "error": err.error.reason});
          });
          break;
        case "BU Country":
          var compObj = {
            selector : {
              "_id": {"$gt":0},
              "$or": [
                //Performance Tab
                { "$and": [{"docType": "asmtComponent"},{"compntType": "countryControls"}, {"reportingCountry": doc[0].Country}, {"owningBusinessUnit": doc[0].BusinessUnit}, {"reportingQuarter": doc[0].CurrentPeriod},{"status": {"$ne": "Retired"}}] },
                //Risks Tab
                {"$and": [{"docType": "asmtComponent"},{"compntType": "openIssue"}, {"businessUnit": doc[0].BusinessUnit}, {"country": doc[0].Country}, {"status": {"$ne": "Closed"}}] },
                //Getting open issue categories to displaye
                {"$and": [{"docType": "setup"},{"keyName": "OpenIssuesCategories"}, {"active": "true"}] },
                // Sampled Country Testing tab
                { "$and": [{"compntType": "sampledCountry"}, {"sampleCountry": doc[0].Country}, {"owningBusinessUnit": doc[0].BusinessUnit}, {"reportingQuarter":{"$in": doc[0].PrevQtrs}}, {"status": {"$ne": "Retired"}}] },
                { "$and": [{"compntType": "sampledCountry"}, {"sampleCountry": doc[0].Country}, {"owningBusinessUnit": doc[0].BusinessUnit}, {"reportingQuarter":doc[0].CurrentPeriod}, {"status": {"$ne": "Retired"}}] },
                { "$and": [{"compntType": "controlSample"}, {"sampleCountry": doc[0].Country}, {"owningBusinessUnit": doc[0].BusinessUnit}, {"reportingQuarter":{"$in": doc[0].PrevQtrs}}, {"status": {"$ne": "Retired"}}] },
                { "$and": [{"compntType": "controlSample"}, {"sampleCountry": doc[0].Country}, {"owningBusinessUnit": doc[0].BusinessUnit}, {"reportingQuarter":doc[0].CurrentPeriod}, {"status": {"$ne": "Retired"}}] }
              ]
            }
          };

          db.find(compObj).then(function(compdata) {
            var comps = compdata.body.docs;
            doc[0].riskCategories = [];
            doc[0].CountryControlsData = [];
          	doc[0].RiskView1Data =  [];
          	doc[0].RiskView2Data = [];

            // For Sampled Country Testing Tab
            doc[0].SCTest1Data = [];
            doc[0].SCTestDataPQ1 = [];
            doc[0].SCTestDataPQ2 = [];
            doc[0].SCTestDataPQ3 = [];
            doc[0].SCTestDataPQ4 = [];
            doc[0].SCTest2Data = [];
            doc[0].SCTest2DataPQ1 = [];
            doc[0].SCTest2DataPQ2 = [];
            doc[0].SCTest2DataPQ3 = [];
            doc[0].SCTest2DataPQ4 = [];

            if (doc[0].MIRABusinessUnit == "GTS") {
              doc[0].RiskView1DataCRM = [];
              doc[0].RiskView1DataDelivery = [];
            }
            for(var i = 0; i < comps.length; i++) {
              if (comps[i].compntType == "openIssue") {
                comps[i].AssessableUnitName = comps[i].businessUnit + " - " + comps[i].country;
                doc[0].RiskView1Data.push(comps[i]);
                if(comps[i].reportingQuarter == doc[0].CurrentPeriod ){
                  doc[0].RiskView2Data.push(comps[i]);
                }
                if (doc[0].MIRABusinessUnit == "GTS") {
                  comps[i].catP = "(uncategorized)";
                  if(doc[0].CRMProcessObj[comps[i].GPPARENT]){
                    comps[i].catP = "CRM/Other";
                    doc[0].RiskView1DataCRM.push(comps[i]);
                  }/*else{
                    comps[i].catP = "Delivery";
                    doc[0].RiskView1DataDelivery.push(comps[i]);}*/
                  else if(doc[0].DeliveryProcessObj[comps[i].GPPARENT]){
                    comps[i].catP = "Delivery";
                    doc[0].RiskView1DataDelivery.push(comps[i])}
                  else console.log("Process not found: "+comps[i].GPPARENT);
                }
              }
              else if (comps[i].compntType == "countryControls"){
               	  doc[0].CountryControlsData.push(comps[i]);
              }
              else if (comps[i].docType == "setup"){
               	  doc[0].riskCategories = comps[i].value.options;
              }
              // For Sampled Country Testing Tab
              else if (comps[i].compntType == "sampledCountry"){
                if (comps[i].reportingQuarter == doc[0].CurrentPeriod) {
                  doc[0].SCTest1Data.push(comps[i]);
                } else if (comps[i].reportingQuarter == doc[0].PrevQtrs[0]) {
                  doc[0].SCTestDataPQ1.push(comps[i]);
                } else if (comps[i].reportingQuarter == doc[0].PrevQtrs[1]) {
                  doc[0].SCTestDataPQ2.push(comps[i]);
                } else if (comps[i].reportingQuarter == doc[0].PrevQtrs[2]) {
                  doc[0].SCTestDataPQ3.push(comps[i]);
                } else if (comps[i].reportingQuarter == doc[0].PrevQtrs[3]) {
                  doc[0].SCTestDataPQ4.push(comps[i]);
                } else {}
              }
              // For Sampled Country Testing Tab
              else if (comps[i].compntType == "controlSample" && comps[i].sampleCountry == doc[0].Country) {
                // calculate Control Name
                comps[i].controlName = comps[i].controlReferenceNumber.split("-")[2] + " - " + comps[i].controlShortName;
                if (comps[i].reportingQuarter == doc[0].CurrentPeriod) {
                  doc[0].SCTest2Data.push(comps[i]);
                } else if (comps[i].reportingQuarter == doc[0].PrevQtrs[0]) {
                  doc[0].SCTest2DataPQ1.push(comps[i]);
                } else if (comps[i].reportingQuarter == doc[0].PrevQtrs[1]) {
                  doc[0].SCTest2DataPQ2.push(comps[i]);
                } else if (comps[i].reportingQuarter == doc[0].PrevQtrs[2]) {
                  doc[0].SCTest2DataPQ3.push(comps[i]);
                } else if (comps[i].reportingQuarter == doc[0].PrevQtrs[3]) {
                  doc[0].SCTest2DataPQ4.push(comps[i]);
                } else {}
              }
            }
            deferred.resolve({"status": 200, "doc": doc});


          }).catch(function(err) {
            console.log("[class-compdoc][getCompDocs]4 - " + err.error);
            deferred.reject({"status": 500, "error": err.error.reason});
          });
          break;
        case "Controllable Unit":
          var compObj = {
            selector : {
              "_id": {"$gt":0},
              "docType": "asmtComponent",
              "$or": [
                // Key Controls Testing Tab
                // { "$and": [{"compntType": "countryControls"},{"reportingQuarter": doc[0].CurrentPeriod},{"owningBusinessUnit": doc[0].BusinessUnit}] },
                { "$and": [{"compntType": "CUSummarySample"},{"reportingQuarter": doc[0].CurrentPeriod},{"controllableUnit": doc[0].AssessableUnitName}] },
                { "$and": [{"compntType": "controlSample"},{"reportingQuarter": doc[0].CurrentPeriod},{"controllableUnit": doc[0].AssessableUnitName}] },
                // Audits and Reviews Tab
                { "$and": [{"compntType": "PPR"},{"AssessableUnitName" : doc[0].AssessableUnitName}] },
                { "$and": [{"compntType": "internalAudit"},{"parentid":doc[0].parentid}] },
                { "$and": [{"compntType": "localAudit"},{"parentid": doc[0]._id}] }
              ]
            }
          };
          db.find(compObj).then(function(compdata) {
            var comps = compdata.body.docs;
            doc[0].RCTestData = [];
            doc[0].SampleData = [];
            doc[0].SampleData2 = [];
            var controlCtr = 0;
            var sampleCtr = 0;
            var sampleCtrPQ = 0;
            var ctrlname;
            var processCat;
            var numTestsTotal = 0;
            var DefectCountTotal = 0;
            for(var i = 0; i < comps.length; i++) {
              if (comps[i].compntType == "openIssue") {
                doc[0].risks.push(comps[i]);
              }
              else if (comps[i].compntType == "CUSummarySample") {
                doc[0].RCTestData.push(comps[i]);
                // Calculate for Defect Rate of Control doc
                if (doc[0].RCTestData[controlCtr].numTests ==  undefined || doc[0].RCTestData[controlCtr].numTests == "" || doc[0].RCTestData[controlCtr].numTests == 0 || doc[0].RCTestData[controlCtr].DefectCount == undefined || doc[0].RCTestData[controlCtr].DefectCount == "") {
                  doc[0].RCTestData[controlCtr].defectRate = "";
                } else {
                  doc[0].RCTestData[controlCtr].defectRate = ((doc[0].RCTestData[controlCtr].DefectCount/doc[0].RCTestData[controlCtr].numTests) * 100).toFixed(1);
                }
                // Calculate for ControlName
                doc[0].RCTestData[controlCtr].controlName = doc[0].RCTestData[controlCtr].controlReferenceNumber.split("-")[2] + " - " + doc[0].RCTestData[controlCtr].controlShortName;
                // Calculate for Defect Rate
                numTestsTotal = numTestsTotal + comps[i].numTests;
                DefectCountTotal = DefectCountTotal + comps[i].DefectCount;

                controlCtr++;
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
              else if (comps[i].compntType == "PPR" || comps[i].compntType == "internalAudit") {
                if (comps[i].compntType == "internalAudit") {
                  comps[i].reportingQuarter = "20"+comps[i].engagement.split("-")[0]+" Q"+doc[0].CurrentPeriod.split(" Q")[1];
                  comps[i].auditOrReview = "CHQ Internal Audit";
                  comps[i].id = comps[i].engagement;
                  comps[i].reportDate = comps[i].addedToAQDB;
                }
                doc[0].AuditTrustedData.push(comps[i]);
              }
              // For Audits and Reviews Tab - view 2
              else if (comps[i].compntType == "localAudit") {
                doc[0].AuditLocalData.push(comps[i]);
              }
              else {

              }
            }
            // Calculate for Defect Rate
            if (numTestsTotal == 0) {
              doc[0].AUDefectRate = "";
            } else {
              doc[0].AUDefectRate = ((DefectCountTotal/numTestsTotal) * 100).toFixed(1);
            }
            deferred.resolve({"status": 200, "doc": doc});
          }).catch(function(err) {
            console.log("[class-compdoc][getCompDocs]5 - " + err.error);
            deferred.reject({"status": 500, "error": err.error.reason});
          });
        break;
      }
    }
    catch(e) {
      console.log("[class-compdoc][getCompDocs]6 - " + err.error);
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
            "scorecardCategory": {"$gt":0},
            "status": {"$ne": "Closed"}
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
            "scorecardCategory": {"$gt":0},
            "status": {"$ne": "Closed"}
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

        doc[0].exportOpenRisks = exportOpenRisks;
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
      console.log("[class-compdoc][getCompDocs]7 - " + err.error);
      deferred.reject({"status": 500, "error": err.error.reason});
    }
    return deferred.promise;
  }

}
module.exports = getDocs;
