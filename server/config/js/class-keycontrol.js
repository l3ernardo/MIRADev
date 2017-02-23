/**************************************************************************************************
 *
 * MIRA Key Controls Testing Code
 * Date: 16 December 2016
 * By: genonms@ph.ibm.com
 *
 */

var fieldCalc = require('./class-fieldcalc.js');

var calculateKCTab = {

  processKCTab: function(doc, defViewRow) {
		try {
      switch (doc[0].ParentDocSubType) {
        case "Account":
          //Functionality to export the Account's Key Controls Testing to Excel and ODS.
          var rct = doc[0].RCTestData;
          var exportRCTest = [];
          //Sort
          rct.sort(function(a, b){
            if (a.processCategory == undefined) a.processCategory = "(uncategorized)";
            if (b.processCategory == undefined) b.processCategory = "(uncategorized)";
            var nameA=a.processCategory.toLowerCase(), nameB=b.processCategory.toLowerCase()
            if (nameA < nameB){ //sort string ascending
              if (nameA == "(uncategorized)") {
                return 1;
              }
              return -1
            }
            if (nameA > nameB){
              if (nameB =="(uncategorized)") {
                return -1
              }
              return 1
            }
            return 0 //default return value (no sorting)
          });
          var categoryList = {};
          var tmpList = [];
          for(var i = 0; i < rct.length; i++) {
            if(typeof categoryList[rct[i].processCategory] === "undefined"){
              var tmp = {
                id:rct[i].processCategory.replace(/ /g,''),
                parent:"",
                name: rct[i].processCategory
              };
              tmpList.push(tmp);
              categoryList[rct[i].processCategory] = true;
            }
            rct[i].parent = rct[i].processCategory.replace(/ /g,'');
            rct[i].id = rct[i]["_id"];
            exportRCTest.push({
              processCategory:rct[i].processCategory || "",
              process:rct[i].process || "",
              eventDate:rct[i].eventDate || "",
              numTestsCompleted:rct[i].numTestsCompleted || "",
              numProcessDefects:rct[i].numProcessDefects || "",
              numControlDeficiencies:rct[i].numControlDeficiencies || "",
              defectRate:rct[i].defectRate || "",
              remediationStatus:rct[i].remediationStatus || "",
              targetToClose:rct[i].targetToClose || "",
              comments:rct[i].comments || ""
            });
            tmpList.push(rct[i]);
          }
          doc[0].exportRCTest = exportRCTest;
          doc[0].RCTestData = tmpList;
          // add padding for RCT Data
          if (Object.keys(categoryList).length < defViewRow) {
            if (Object.keys(categoryList).length == 0) {
              doc[0].RCTestData = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].RCTestData,10,(defViewRow-Object.keys(categoryList).length));
            }
          }
          break;
        case "Country Process":
          doc[0].AUDefectRate = parseInt(doc[0].AUDefectRate).toFixed(1);
          if (doc[0].AUDefectRate == 0) {
            doc[0].AUDefectRate = parseInt(doc[0].AUDefectRate).toFixed(0);
          }
          if (doc[0].AUDefectRate >= doc[0].UnsatThresholdPercent) {
            doc[0].RAGStatus = "Unsat";
          } else if (doc[0].AUDefectRate < doc[0].MargThresholdPercent) {
            doc[0].RAGStatus = "Sat";
          } else {
            doc[0].RAGStatus = "Marg";
          }
          // *** Start of Reporting Country Testing Data (1st embedded view in Testing tab) *** //
          //Sorting for RCTest_treeview
          var tmpList = [];
          var periodList = {};//reportingQuarter
          var typeList = {};//controlType
          var rct = doc[0].RCTestData;
          var exportRCTest = [];
          rct.sort(function(a, b){
            var nameA=a.reportingQuarter.toLowerCase(), nameB=b.reportingQuarter.toLowerCase()
            if (nameA > nameB) //sort string descending
              return -1
            if (nameA < nameB)
              return 1
            if (a.controlType == undefined) a.controlType = "(uncategorized)";
            if (b.controlType == undefined) b.controlType = "(uncategorized)";
            var nameA=a.controlType.toLowerCase(), nameB=b.controlType.toLowerCase()
            if (nameA < nameB){ //sort string ascending
              if (nameA == "(uncategorized)") {
                return 1;
              }
              return -1
            }
            if (nameA > nameB){
              if (nameB =="(uncategorized)") {
                return -1
              }
              return 1
            }
            return 0 //default return value (no sorting)
          });
          var objects = {};//object of objects for counting
          for(var i = 0; i < rct.length; i++){
            if (rct[i].reportingQuarter == undefined) rct[i].reportingQuarter = "(uncategorized)";
            if(typeof periodList[rct[i].reportingQuarter] === "undefined"){
              var tmp = {
                id:rct[i].reportingQuarter.replace(/ /g,''),
                parent:"",
                reportingQuarter: rct[i].reportingQuarter,
                catEntry:"Yes",
                numActualTests: 0,
                numDefects: 0,
                remFinImpact: 0.00
              };
              tmpList.push(tmp);
              objects[tmp.id] = tmp;
              periodList[rct[i].reportingQuarter] = true;
            }
            if (rct[i].controlType == undefined) rct[i].controlType = "(uncategorized)";
            if(typeof typeList[rct[i].reportingQuarter+rct[i].controlType] === "undefined"){
              var tmp = {
                parent: rct[i].reportingQuarter.replace(/ /g,''),
                id:rct[i].reportingQuarter.replace(/ /g,'')+rct[i].controlType.replace(/ /g,''),
                controlType: rct[i].controlType,
                catEntry:"Yes",
                numActualTests: 0,
                numDefects: 0,
                remFinImpact: 0.00
              };
              tmpList.push(tmp);
              objects[tmp.id] = tmp;
              typeList[rct[i].reportingQuarter+rct[i].controlType] = true;
            }
            rct[i].parent = rct[i].reportingQuarter.replace(/ /g,'')+rct[i].controlType.replace(/ /g,'');
            rct[i].id = rct[i]["_id"];
            //do counting for category
            if (rct[i].numActualTests != undefined && rct[i].numActualTests != ""  ) {
                objects[rct[i].parent].numActualTests += parseFloat(rct[i].numActualTests);
                objects[objects[rct[i].parent].parent].numActualTests += parseFloat(rct[i].numActualTests);
            }

            if (rct[i].numDefects != undefined && rct[i].numDefects != ""  ) {
                objects[rct[i].parent].numDefects += parseFloat(rct[i].numDefects);
                objects[objects[rct[i].parent].parent].numDefects += parseFloat(rct[i].numDefects);
            }

            if (rct[i].remFinImpact != undefined && rct[i].remFinImpact != ""  ) {
              objects[rct[i].parent].remFinImpact += parseFloat(rct[i].remFinImpact);
              objects[objects[rct[i].parent].parent].remFinImpact += parseFloat(rct[i].remFinImpact);
            }

            exportRCTest.push({
              reportingQuarter:rct[i].reportingQuarter || "",
              controlType:rct[i].controlType || "",
              controlName:rct[i].controlName || "",
              numActualTests:rct[i].numActualTests || "",
              numDefects:rct[i].numDefects || "",
              defectRate:rct[i].defectRate || "",
              remFinImpact:rct[i].remFinImpact || ""
            });
            tmpList.push(rct[i]);
          }
          //add ".00" to category counting
          for(var key in objects){
            objects[key].remFinImpact = objects[key].remFinImpact.toFixed(2);
          }
          doc[0].exportRCTest = exportRCTest;
          doc[0].RCTestData = tmpList;
          // add padding for RCT Data
          if (Object.keys(periodList).length < defViewRow) {
            if (Object.keys(periodList).length == 0) {
              doc[0].RCTestData = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].RCTestData,10,(defViewRow-Object.keys(periodList).length));
            }
          }
          // *** End of Reporting Country Testing Data (1st embedded view in Testing tab) *** //

          // *** Start of Sampled Country Testing Data (2nd embedded view in Testing tab) *** //
          //sortin for SCTest_treeview
          var tmpList = [];
          var periodList = {};//reportingQuarter
          var typeList = {};//controlType
          var controlList = {};//controlName
          var sct = doc[0].SCTestData;
          var exportSCTest = [];
          sct.sort(function(a, b){
            var nameA=a.reportingQuarter.toLowerCase(), nameB=b.reportingQuarter.toLowerCase()
            if (nameA > nameB) //sort string descending
              return -1
            if (nameA < nameB)
              return 1
            if (a.controlType == undefined) a.controlType = "(uncategorized)";
            if (b.controlType == undefined) b.controlType = "(uncategorized)";
            var nameA=a.controlType.toLowerCase(), nameB=b.controlType.toLowerCase()
            if (nameA < nameB){ //sort string ascending
              if (nameA == "(uncategorized)") {
                return 1;
              }
              return -1
            }
            if (nameA > nameB){
              if (nameB == "(uncategorized)") {
                return -1;
              }
              return 1
            }
            if (a.controlName == undefined){ a.controlName = "(uncategorized)";  return 1;};
            if (b.controlName == undefined) b.controlName = "(uncategorized)";
            var nameA=a.controlName.toLowerCase(), nameB=b.controlName.toLowerCase()
            if (nameA < nameB){ //sort string ascending
              if (nameA == "(uncategorized)") {
                return 1;
              }
              return -1
            }
            if (nameA > nameB){
              if (nameB == "(uncategorized)") {
                return -1;
              }
              return 1
            }
            return 0 //default return value (no sorting)
          });
          var objects = {};//object of objects for counting
          for(var i = 0; i < sct.length; i++){
            if (sct[i].reportingQuarter == undefined) sct[i].reportingQuarter = "(uncategorized)";
            if(typeof periodList[sct[i].reportingQuarter] === "undefined"){
              var tmp = {
                id:sct[i].reportingQuarter.replace(/ /g,''),
                parent:"",
                catEntry:"Yes",
                reportingQuarter: sct[i].reportingQuarter,
                numtest: 0,
                numDefects: 0
              };
              tmpList.push(tmp);
              objects[tmp.id] = tmp;
              periodList[sct[i].reportingQuarter] = true;
            }
            if (sct[i].controlType == undefined) sct[i].controlType = "(uncategorized)";
            if(typeof typeList[sct[i].reportingQuarter+sct[i].controlType] === "undefined"){
              var tmp = {
                parent: sct[i].reportingQuarter.replace(/ /g,''),
                id:sct[i].reportingQuarter.replace(/ /g,'')+sct[i].controlType.replace(/ /g,''),
                catEntry:"Yes",
                controlType: sct[i].controlType,
                numtest: 0,
                numDefects: 0
              };
              tmpList.push(tmp);
              objects[tmp.id] = tmp;
              typeList[sct[i].reportingQuarter+sct[i].controlType] = true;
            }
            if (sct[i].controlName == undefined) sct[i].controlName = "(uncategorized)";
            if(typeof controlList[sct[i].reportingQuarter+sct[i].controlType+sct[i].controlName] === "undefined"){
              var tmp = {
                parent: sct[i].reportingQuarter.replace(/ /g,'')+sct[i].controlType.replace(/ /g,''),
                id:sct[i].reportingQuarter.replace(/ /g,'')+sct[i].controlType.replace(/ /g,'')+sct[i].controlName.replace(/ /g,''),
                catEntry:"Yes",
                controlName: sct[i].controlName,
                numtest: 0,
                numDefects: 0
              }
              tmpList.push(tmp);
              objects[tmp.id] = tmp;
              controlList[sct[i].reportingQuarter+sct[i].controlType+sct[i].controlName] = true;
            }
            exportSCTest.push({
              reportingQuarter:sct[i].reportingQuarter || "",
              controlType:sct[i].controlType || "",
              controlName:sct[i].controlName || "",
              sampleCountry:sct[i].sampleCountry || "",
              numtest:sct[i].numtest || "",
              numDefects:sct[i].numDefects || "",
              defectRate:sct[i].defectRate || ""
            });
            sct[i].parent = sct[i].reportingQuarter.replace(/ /g,'')+sct[i].controlType.replace(/ /g,'')+sct[i].controlName.replace(/ /g,'');
            sct[i].id = sct[i]["_id"];
            //do counting for category
            objects[sct[i].parent].numtest += parseInt(sct[i].numtest);
            objects[sct[i].parent].numDefects += parseInt(sct[i].numDefects);
            //do counting for 2nd level category
            objects[objects[sct[i].parent].parent].numtest += parseInt(sct[i].numtest);
            objects[objects[sct[i].parent].parent].numDefects += parseInt(sct[i].numDefects);
            //do counting for 3rd level category
            objects[objects[objects[sct[i].parent].parent].parent].numtest += parseInt(sct[i].numtest);
            objects[objects[objects[sct[i].parent].parent].parent].numDefects += parseInt(sct[i].numDefects);

            tmpList.push(sct[i]);
          }
          doc[0].exportSCTest = exportSCTest;
          doc[0].SCTestData = tmpList;
          // add padding for SCT data
          if (Object.keys(periodList).length < defViewRow) {
            if (doc[0].SCTestData.length == 0) {
              doc[0].SCTestData = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].SCTestData,10,(defViewRow-Object.keys(periodList).length));
            }
          }
          // *** End of Sampled Country Testing Data (2nd embedded view in Testing tab) *** //

          // *** Start of Sample Data (3rd embedded view in Testing tab) *** //
          //Saving the data in new variable for next sorting
          // doc[0].SampleData2 = JSON.parse(JSON.stringify(doc[0].SampleData));;
          //Sorting for Sample_treeview
          var tmpList = [];
          var categoryList = {};//processCategory
          var processList = {};//processSampled
          var samples = doc[0].SampleData;
          var exportSample = [];
          samples.sort(function(a, b){
            if (a.processCategory == undefined) a.processCategory = "(uncategorized)";
            if (b.processCategory == undefined) b.processCategory = "(uncategorized)";
            var nameA=a.processCategory.toLowerCase(), nameB=b.processCategory.toLowerCase()
            if (nameA < nameB){ //sort string ascending
              if (nameA == "(uncategorized)") {
                return 1;
              }
              return -1
            }
            if (nameA > nameB){
              if (nameB == "(uncategorized)") {
                return -1;
              }
              return 1
            }
            if (a.processSampled == undefined) a.processSampled = "(uncategorized)";
            if (b.processSampled == undefined) b.processSampled = "(uncategorized)";
            var nameA=a.processSampled.toLowerCase(), nameB=b.processSampled.toLowerCase()
            if (nameA < nameB){ //sort string ascending
              if (nameA == "(uncategorized)") {
                return 1;
              }
              return -1
            }
            if (nameA > nameB){
              if (nameB == "(uncategorized)") {
                return -1;
              }
              return 1
            }
            return 0 //default return value (no sorting)
          });
          var objects = {};//object of objects for counting
          for(var i = 0; i < samples.length; i++){
            if (samples[i].processCategory == undefined) samples[i].processCategory = "(uncategorized)";
            if(typeof categoryList[samples[i].processCategory] === "undefined"){
              var tmp = {
                id:samples[i].processCategory.replace(/ /g,''),
                parent:"",
                catEntry:"Yes",
                processCategory: samples[i].processCategory,
                numDefects: 0,
                remainingFinancialImpact: 0.00
              };
              tmpList.push(tmp);
              objects[tmp.id] = tmp;
              categoryList[samples[i].processCategory] = true;
            }
            if (samples[i].processSampled == undefined) samples[i].processSampled = "(uncategorized)";
            if(typeof processList[samples[i].processCategory+samples[i].processSampled] === "undefined"){
              var tmp = {
                parent: samples[i].processCategory.replace(/ /g,''),
                id:samples[i].processCategory.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,''),
                catEntry:"Yes",
                processSampled: samples[i].processSampled,
                numDefects: 0,
                remainingFinancialImpact: 0.00
              };
              tmpList.push(tmp);
              objects[tmp.id] = tmp;
              processList[samples[i].processCategory+samples[i].processSampled] = true;
            }
            exportSample.push({
              processCategory:samples[i].processCategory || "",
              processSampled:samples[i].processSampled || "",
              controlName:samples[i].controlName || "",
              IntegrationKeyWWBCIT:samples[i].IntegrationKeyWWBCIT || "",
              defectType:samples[i].defectType || "",
              numDefects:samples[i].numDefects || "",
              remediationStatus:samples[i].remediationStatus || "",
              remainingFinancialImpact:samples[i].remainingFinancialImpact || "",
              originalTargetDate:samples[i].originalTargetDate || "",
              targetClose:samples[i].targetClose || "",
              defectsAbstract:samples[i].defectsAbstract || ""
            });
            samples[i].parent = samples[i].processCategory.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,'');
            samples[i].id = samples[i]["_id"];

            //do counting for category
            objects[samples[i].parent].remainingFinancialImpact += parseFloat(samples[i].remainingFinancialImpact);
            objects[samples[i].parent].numDefects += parseInt(samples[i].numDefects);
            //do counting for 2nd level category
            objects[objects[samples[i].parent].parent].remainingFinancialImpact += parseFloat(samples[i].remainingFinancialImpact);
            objects[objects[samples[i].parent].parent].numDefects += parseInt(samples[i].numDefects);

            tmpList.push(samples[i]);
          }
          doc[0].exportSample = exportSample;
          //add ".00" to category counting
          for(var key in objects){
            objects[key].remainingFinancialImpact = objects[key].remainingFinancialImpact.toFixed(2);
          }
          doc[0].SampleData = tmpList;
          // add padding for Sample data
          if (Object.keys(categoryList).length < defViewRow) {
            if (doc[0].SampleData.length == 0) {
              doc[0].SampleData = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].SampleData,10,(defViewRow-Object.keys(categoryList).length));
            }
          }
          // *** Start of Sample Data (3rd embedded view in Testing tab) *** //

          // *** Start of Sample2 Data (4th embedded view in Testing tab) *** //
          //Sorting for Sample2_treeview
          var tmpList = [];
          var periodList = {};//originalReportingQuarter
          var typeList = {};//testType
          var samples2 = doc[0].SampleData2;
          var exportSample2 = [];
          samples2.sort(function(a, b){
            var nameA=a.originalReportingQuarter.toLowerCase(), nameB=b.originalReportingQuarter.toLowerCase()
            if (nameA > nameB) //sort string descending
              return -1
            if (nameA < nameB)
              return 1
            if (a.testType == undefined) a.testType = "(uncategorized)";
            if (b.testType == undefined) b.testType = "(uncategorized)";
            var nameA=a.testType.toLowerCase(), nameB=b.testType.toLowerCase()
            if (nameA < nameB){ //sort string ascending
              if (nameA == "(uncategorized)") {
                return 1;
              }
              return -1
            }
            if (nameA > nameB){
              if (nameB == "(uncategorized)") {
                return -1;
              }
              return 1
            }
            return 0 //default return value (no sorting)
          });
          var objects = {};//object of objects for counting
          for(var i = 0; i < samples2.length; i++){
            if (samples2[i].originalReportingQuarter == undefined) samples2[i].originalReportingQuarter = "(uncategorized)";
            if(typeof periodList[samples2[i].originalReportingQuarter] === "undefined"){
              var tmp = {
                id:samples2[i].originalReportingQuarter.replace(/ /g,''),
                parent:"",
                catEntry:"Yes",
                originalReportingQuarter: samples2[i].originalReportingQuarter,
                numDefects: 0,
                remainingFinancialImpact: 0.00
              };
              tmpList.push(tmp);
              objects[tmp.id] =  tmp;
              periodList[samples2[i].originalReportingQuarter] = true;
            }
            if (samples2[i].testType == undefined) samples2[i].testType = "(uncategorized)";
            if(typeof typeList[samples2[i].originalReportingQuarter+samples2[i].testType] === "undefined"){
              var tmp = {
                parent: samples2[i].originalReportingQuarter.replace(/ /g,''),
                id:samples2[i].originalReportingQuarter.replace(/ /g,'')+samples2[i].testType.replace(/ /g,''),
                catEntry:"Yes",
                testType: samples2[i].testType,
                numDefects: 0,
                remainingFinancialImpact: 0.00
              };
              tmpList.push(tmp);
              objects[tmp.id] = tmp;
              typeList[samples2[i].originalReportingQuarter+samples2[i].testType] = true;
            }
            exportSample2.push({
              originalReportingQuarter:samples2[i].originalReportingQuarter || "",
              testType:samples2[i].testType || "",
              controlName:samples2[i].controlName || "",
              IntegrationKeyWWBCIT:samples2[i].IntegrationKeyWWBCIT || "",
              processSampled:samples2[i].processSampled || "",
              defectType:samples2[i].defectType || "",
              numDefects:samples2[i].numDefects || "",
              remainingFinancialImpact:samples2[i].remainingFinancialImpact || "",
              originalTargetDate:samples2[i].originalTargetDate || "",
              targetClose:samples2[i].targetClose || "",
              defectsAbstract:samples2[i].defectsAbstract  || ""
            });
            samples2[i].parent = samples2[i].originalReportingQuarter.replace(/ /g,'')+samples2[i].testType.replace(/ /g,'');
            samples2[i].id = samples2[i]["_id"];

            //do counting for category
            objects[samples2[i].parent].remainingFinancialImpact += parseFloat(samples2[i].remainingFinancialImpact);
            objects[samples2[i].parent].numDefects += parseInt(samples2[i].numDefects);
            //do counting for 2nd level category
            objects[objects[samples2[i].parent].parent].remainingFinancialImpact += parseFloat(samples2[i].remainingFinancialImpact);
            objects[objects[samples2[i].parent].parent].numDefects += parseInt(samples2[i].numDefects);

            tmpList.push(samples2[i]);
          }
          doc[0].exportSample2 = exportSample2;
          //add ".00" to category counting
          for(var key in objects){
            objects[key].remainingFinancialImpact = objects[key].remainingFinancialImpact.toFixed(2);
          }
          doc[0].SampleData2 = tmpList;
          // add padding for Sample2 data
          if (Object.keys(periodList).length < defViewRow) {
            if (doc[0].SampleData2.length == 0) {
              doc[0].SampleData2 = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].SampleData2,10,(defViewRow-Object.keys(periodList).length));
            }
          }
          // *** End of Sample2 Data (4th embedded view in Testing tab) *** //

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
        // *** Start of Reporting Country Testing Data (1st embedded view in Testing tab) *** //
        //Sorting for RCTest_treeview
        var tmpList = [];
        var periodList = {};//reportingQuarter
        var typeList = {};//controlType
        var controlList = {}; //process
        var rct = doc[0].RCTestData;
        var exportRCTest = [];
        rct.sort(function(a, b){
          var nameA=a.reportingQuarter.toLowerCase(), nameB=b.reportingQuarter.toLowerCase()
          if (nameA > nameB) //sort string descending
            return -1
          if (nameA < nameB)
            return 1
          if (a.controlType == undefined) a.controlType = "(uncategorized)";
          if (b.controlType == undefined) b.controlType = "(uncategorized)";
          var nameA=a.controlType.toLowerCase(), nameB=b.controlType.toLowerCase()
          if (nameA < nameB){ //sort string ascending
            if (nameA == "(uncategorized)") {
              return 1;
            }
            return -1
          }
          if (nameA > nameB){
            if (nameB =="(uncategorized)") {
              return -1
            }
            return 1
          }
          if (a.process == undefined){ a.process = "(uncategorized)";  return 1;};
          if (b.process == undefined) b.process = "(uncategorized)";
          var nameA=a.process.toLowerCase(), nameB=b.process.toLowerCase()
          if (nameA < nameB){ //sort string ascending
            if (nameA == "(uncategorized)") {
              return 1;
            }
            return -1
          }
          if (nameA > nameB){
            if (nameB == "(uncategorized)") {
              return -1;
            }
            return 1
          }
          return 0 //default return value (no sorting)
        });
        //*** Process CU Process Testing data for 2 ***//
        var objects = {};//object of objects for counting
        for(var i = 0; i < rct.length; i++){
          if (rct[i].reportingQuarter == undefined) rct[i].reportingQuarter = "(uncategorized)";
          if(typeof periodList[rct[i].reportingQuarter] === "undefined"){
            var tmp = {
              id:rct[i].reportingQuarter.replace(/ /g,''),
              parent:"",
              reportingQuarter: rct[i].reportingQuarter,
              catEntry:"Yes",
              numTests: 0,
              DefectCount: 0,
              remainingFinancialImpact: 0.00
            };
            tmpList.push(tmp);
            objects[tmp.id] = tmp;
            periodList[rct[i].reportingQuarter] = true;
          }
          if (rct[i].controlType == undefined) rct[i].controlType = "(uncategorized)";
          if(typeof typeList[rct[i].reportingQuarter+rct[i].controlType] === "undefined"){
            var tmp = {
              parent: rct[i].reportingQuarter.replace(/ /g,''),
              id:rct[i].reportingQuarter.replace(/ /g,'')+rct[i].controlType.replace(/ /g,''),
              controlType: rct[i].controlType,
              catEntry:"Yes",
              numTests: 0,
              DefectCount: 0,
              remainingFinancialImpact: 0.00
            };
            tmpList.push(tmp);
            objects[tmp.id] = tmp;
            typeList[rct[i].reportingQuarter+rct[i].controlType] = true;
          }
          if (rct[i].process == undefined) rct[i].process = "(uncategorized)";
          if(typeof controlList[rct[i].reportingQuarter+rct[i].controlType+rct[i].process] === "undefined"){
            var tmp = {
              parent: rct[i].reportingQuarter.replace(/ /g,'')+rct[i].controlType.replace(/ /g,''),
              id:rct[i].reportingQuarter.replace(/ /g,'')+rct[i].controlType.replace(/ /g,'')+rct[i].process.replace(/ /g,''),
              catEntry:"Yes",
              process: rct[i].process,
              numTests: 0,
              DefectCount: 0,
              remainingFinancialImpact: 0.00
            }
            tmpList.push(tmp);
            objects[tmp.id] = tmp;
            controlList[rct[i].reportingQuarter+rct[i].controlType+rct[i].process] = true;
          }
          rct[i].parent = rct[i].reportingQuarter.replace(/ /g,'')+rct[i].controlType.replace(/ /g,'')+rct[i].process.replace(/ /g,'');
          rct[i].id = rct[i]["_id"];
          //do counting for category
          objects[rct[i].parent].numTests += parseFloat(rct[i].numTests);
          objects[rct[i].parent].DefectCount += parseFloat(rct[i].DefectCount);
          objects[rct[i].parent].remainingFinancialImpact += parseFloat(rct[i].remainingFinancialImpact);
          //do counting for 2nd level category
          objects[objects[rct[i].parent].parent].numTests += parseFloat(rct[i].numTests);
          objects[objects[rct[i].parent].parent].DefectCount += parseFloat(rct[i].DefectCount);
          objects[objects[rct[i].parent].parent].remainingFinancialImpact += parseFloat(rct[i].remainingFinancialImpact);
          //do counting for 3d level category
          objects[objects[objects[rct[i].parent].parent].parent].numTests += parseFloat(rct[i].numTests);
          objects[objects[objects[rct[i].parent].parent].parent].DefectCount += parseFloat(rct[i].DefectCount);
          objects[objects[objects[rct[i].parent].parent].parent].remainingFinancialImpact += parseFloat(rct[i].remainingFinancialImpact);
          exportRCTest.push({
            reportingQuarter:rct[i].reportingQuarter || "",
            controlType:rct[i].controlType || "",
            process: rct[i].process || " ",
            controlName:rct[i].controlName || "",
            numActualTests:rct[i].numTests || "",
            numDefects:rct[i].DefectCount || "",
            defectRate:rct[i].defectRate || "",
            remFinImpact:rct[i].remainingFinancialImpact || ""
          });
          tmpList.push(rct[i]);
        }
        //add ".00" to category counting
        for(var key in objects){
          objects[key].remainingFinancialImpact = objects[key].remainingFinancialImpact.toFixed(2);
        }
        doc[0].exportRCTest = exportRCTest;
        doc[0].RCTestData = tmpList;
        // add padding for RCT Data
        if (Object.keys(periodList).length < defViewRow) {
          if (Object.keys(periodList).length == 0) {
            doc[0].RCTestData = fieldCalc.addTestViewData(10,defViewRow);
          } else {
            fieldCalc.addTestViewDataPadding(doc[0].RCTestData,10,(defViewRow-Object.keys(periodList).length));
          }
        }
        // *** End of Reporting Country Testing Data (1st embedded view in Testing tab) *** //
        // *** Start of Sample Data (3rd embedded view in Testing tab) *** //
        //Saving the data in new variable for next sorting
        //doc[0].SampleData2 = JSON.parse(JSON.stringify(doc[0].SampleData));;
        //Sorting for Sample_treeview
        var tmpList = [];
        var categoryList = {};//processCategory
        var processList = {};//processSampled
        var samples = doc[0].SampleData;
        var exportSample = [];
        samples.sort(function(a, b){
          if (a.processCategory == undefined) a.processCategory = "(uncategorized)";
          if (b.processCategory == undefined) b.processCategory = "(uncategorized)";
          var nameA=a.processCategory.toLowerCase(), nameB=b.processCategory.toLowerCase()
          if (nameA < nameB){ //sort string ascending
            if (nameA == "(uncategorized)") {
              return 1;
            }
            return -1
          }
          if (nameA > nameB){
            if (nameB == "(uncategorized)") {
              return -1;
            }
            return 1
          }
          if (a.processSampled == undefined) a.processSampled = "(uncategorized)";
          if (b.processSampled == undefined) b.processSampled = "(uncategorized)";
          var nameA=a.processSampled.toLowerCase(), nameB=b.processSampled.toLowerCase()
          if (nameA < nameB){ //sort string ascending
            if (nameA == "(uncategorized)") {
              return 1;
            }
            return -1
          }
          if (nameA > nameB){
            if (nameB == "(uncategorized)") {
              return -1;
            }
            return 1
          }
          return 0 //default return value (no sorting)
        });
        // Process Sample data for table 3
        var objects = {};//object of objects for counting
        for(var i = 0; i < samples.length; i++){
          if (samples[i].processCategory == undefined) samples[i].processCategory = "(uncategorized)";
          if(typeof categoryList[samples[i].processCategory] === "undefined"){
            var tmp = {
              id:samples[i].processCategory.replace(/ /g,''),
              parent:"",
              catEntry:"Yes",
              processCategory: samples[i].processCategory,
              numDefects: 0,
              remainingFinancialImpact: 0.00
            };
            tmpList.push(tmp);
            objects[tmp.id] = tmp;
            categoryList[samples[i].processCategory] = true;
          }
          if (samples[i].processSampled == undefined) samples[i].processSampled = "(uncategorized)";
          if(typeof processList[samples[i].processCategory+samples[i].processSampled] === "undefined"){
            var tmp = {
              parent: samples[i].processCategory.replace(/ /g,''),
              id:samples[i].processCategory.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,''),
              catEntry:"Yes",
              processSampled: samples[i].processSampled,
              numDefects: 0,
              remainingFinancialImpact: 0.00
            };
            tmpList.push(tmp);
            objects[tmp.id] = tmp;
            processList[samples[i].processCategory+samples[i].processSampled] = true;
          }
          exportSample.push({
            processCategory:samples[i].processCategory || "",
            processSampled:samples[i].processSampled || "",
            controlName:samples[i].controlName || "",
            IntegrationKeyWWBCIT:samples[i].IntegrationKeyWWBCIT || "",
            defectType:samples[i].defectType || "",
            numDefects:samples[i].numDefects || "",
            remediationStatus:samples[i].remediationStatus || "",
            remainingFinancialImpact:samples[i].remainingFinancialImpact || "",
            originalTargetDate:samples[i].originalTargetDate || "",
            targetClose:samples[i].targetClose || "",
            defectsAbstract:samples[i].defectsAbstract || ""
          });
          samples[i].parent = samples[i].processCategory.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,'');
          samples[i].id = samples[i]["_id"];

          //do counting for category
          objects[samples[i].parent].remainingFinancialImpact += parseFloat(samples[i].remainingFinancialImpact);
          objects[samples[i].parent].numDefects += parseInt(samples[i].numDefects);
          //do counting for 2nd level category
          objects[objects[samples[i].parent].parent].remainingFinancialImpact += parseFloat(samples[i].remainingFinancialImpact);
          objects[objects[samples[i].parent].parent].numDefects += parseInt(samples[i].numDefects);

          tmpList.push(samples[i]);
        }
        doc[0].exportSample = exportSample;
        //add ".00" to category counting
        for(var key in objects){
          objects[key].remainingFinancialImpact = objects[key].remainingFinancialImpact.toFixed(2);
        }
        doc[0].SampleData = tmpList;
        // add padding for Sample data
        if (Object.keys(categoryList).length < defViewRow) {
          if (doc[0].SampleData.length == 0) {
            doc[0].SampleData = fieldCalc.addTestViewData(10,defViewRow);
          } else {
            fieldCalc.addTestViewDataPadding(doc[0].SampleData,10,(defViewRow-Object.keys(categoryList).length));
          }
        }
        // *** end of Sample Data (3rd embedded view in Testing tab) *** //

        // *** Start of Sample2 Data (4th embedded view in Testing tab) *** //
        //Sorting for Sample2_treeview
        var tmpList = [];
        var periodList = {};//originalReportingQuarter
        var typeList = {};//testType
        var samples2 = doc[0].SampleData2;
        var exportSample2 = [];
        samples2.sort(function(a, b){
          var nameA=a.originalReportingQuarter.toLowerCase(), nameB=b.originalReportingQuarter.toLowerCase()
          if (nameA > nameB) //sort string descending
            return -1
          if (nameA < nameB)
            return 1
          if (a.testType == undefined) a.testType = "(uncategorized)";
          if (b.testType == undefined) b.testType = "(uncategorized)";
          var nameA=a.testType.toLowerCase(), nameB=b.testType.toLowerCase()
          if (nameA < nameB){ //sort string ascending
            if (nameA == "(uncategorized)") {
              return 1;
            }
            return -1
          }
          if (nameA > nameB){
            if (nameB == "(uncategorized)") {
              return -1;
            }
            return 1
          }
          return 0 //default return value (no sorting)
        });
        var objects = {};//object of objects for counting
        for(var i = 0; i < samples2.length; i++){
          if (samples2[i].originalReportingQuarter == undefined) samples2[i].originalReportingQuarter = "(uncategorized)";
          if(typeof periodList[samples2[i].originalReportingQuarter] === "undefined"){
            var tmp = {
              id:samples2[i].originalReportingQuarter.replace(/ /g,''),
              parent:"",
              catEntry:"Yes",
              originalReportingQuarter: samples2[i].originalReportingQuarter,
              numDefects: 0,
              remainingFinancialImpact: 0.00
            };
            tmpList.push(tmp);
            objects[tmp.id] =  tmp;
            periodList[samples2[i].originalReportingQuarter] = true;
          }
          if (samples2[i].testType == undefined) samples2[i].testType = "(uncategorized)";
          if(typeof typeList[samples2[i].originalReportingQuarter+samples2[i].testType] === "undefined"){
            var tmp = {
              parent: samples2[i].originalReportingQuarter.replace(/ /g,''),
              id:samples2[i].originalReportingQuarter.replace(/ /g,'')+samples2[i].testType.replace(/ /g,''),
              catEntry:"Yes",
              testType: samples2[i].testType,
              numDefects: 0,
              remainingFinancialImpact: 0.00
            };
            tmpList.push(tmp);
            objects[tmp.id] = tmp;
            typeList[samples2[i].originalReportingQuarter+samples2[i].testType] = true;
          }
          exportSample2.push({
            originalReportingQuarter:samples2[i].originalReportingQuarter || "",
            testType:samples2[i].testType || "",
            controlName:samples2[i].controlName || "",
            IntegrationKeyWWBCIT:samples2[i].IntegrationKeyWWBCIT || "",
            processSampled:samples2[i].processSampled || "",
            defectType:samples2[i].defectType || "",
            numDefects:samples2[i].numDefects || "",
            remainingFinancialImpact:samples2[i].remainingFinancialImpact || "",
            originalTargetDate:samples2[i].originalTargetDate || "",
            targetClose:samples2[i].targetClose || "",
            defectsAbstract:samples2[i].defectsAbstract  || ""
          });
          samples2[i].parent = samples2[i].originalReportingQuarter.replace(/ /g,'')+samples2[i].testType.replace(/ /g,'');
          samples2[i].id = samples2[i]["_id"];

          //do counting for category
          objects[samples2[i].parent].remainingFinancialImpact += parseFloat(samples2[i].remainingFinancialImpact);
          objects[samples2[i].parent].numDefects += parseInt(samples2[i].numDefects);
          //do counting for 2nd level category
          objects[objects[samples2[i].parent].parent].remainingFinancialImpact += parseFloat(samples2[i].remainingFinancialImpact);
          objects[objects[samples2[i].parent].parent].numDefects += parseInt(samples2[i].numDefects);

          tmpList.push(samples2[i]);
        }
        doc[0].exportSample2 = exportSample2;
        //add ".00" to category counting
        for(var key in objects){
          objects[key].remainingFinancialImpact = objects[key].remainingFinancialImpact.toFixed(2);
        }
        doc[0].SampleData2 = tmpList;
        // add padding for Sample2 data
        if (Object.keys(periodList).length < defViewRow) {
          if (doc[0].SampleData2.length == 0) {
            doc[0].SampleData2 = fieldCalc.addTestViewData(10,defViewRow);
          } else {
            fieldCalc.addTestViewDataPadding(doc[0].SampleData2,10,(defViewRow-Object.keys(periodList).length));
          }
        }
        // *** End of Sample2 Data (4th embedded view in Testing tab) *** //
        break;
      }
    }catch(e){
      console.log("[class-keycontrol][calcDefectRate] - " + err.error);
		}
	}

}
module.exports = calculateKCTab;
