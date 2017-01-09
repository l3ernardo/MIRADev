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
        case "Country Process":
          // format defect rate
          // if (doc[0].AUTestCount == undefined || doc[0].AUTestCount == 0 ) {
          //   doc[0].AUDefectRate = "";
          // }

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
          for(var i = 0; i < rct.length; i++){
            if (rct[i].reportingQuarter == undefined) rct[i].reportingQuarter = "(uncategorized)";
            if(typeof periodList[rct[i].reportingQuarter] === "undefined"){
              tmpList.push({
                id:rct[i].reportingQuarter.replace(/ /g,''),
                parent:"",
                reportingQuarter: rct[i].reportingQuarter,
                catEntry:"Yes"
              });
              periodList[rct[i].reportingQuarter] = true;
            }
            if (rct[i].controlType == undefined) rct[i].controlType = "(uncategorized)";
            if(typeof typeList[rct[i].reportingQuarter+rct[i].controlType] === "undefined"){
              tmpList.push({
                parent: rct[i].reportingQuarter.replace(/ /g,''),
                id:rct[i].reportingQuarter.replace(/ /g,'')+rct[i].controlType.replace(/ /g,''),
                controlType: rct[i].controlType,
                catEntry:"Yes"
              });
              typeList[rct[i].reportingQuarter+rct[i].controlType] = true;
            }
            rct[i].parent = rct[i].reportingQuarter.replace(/ /g,'')+rct[i].controlType.replace(/ /g,'');
            rct[i].id = rct[i]["_id"];
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
          for(var i = 0; i < sct.length; i++){
            if (sct[i].reportingQuarter == undefined) sct[i].reportingQuarter = "(uncategorized)";
            if(typeof periodList[sct[i].reportingQuarter] === "undefined"){
              tmpList.push({
                id:sct[i].reportingQuarter.replace(/ /g,''),
                parent:"",
                catEntry:"Yes",
                reportingQuarter: sct[i].reportingQuarter
              });
              periodList[sct[i].reportingQuarter] = true;
            }
            if (sct[i].controlType == undefined) sct[i].controlType = "(uncategorized)";
            if(typeof typeList[sct[i].reportingQuarter+sct[i].controlType] === "undefined"){
              tmpList.push({
                parent: sct[i].reportingQuarter.replace(/ /g,''),
                id:sct[i].reportingQuarter.replace(/ /g,'')+sct[i].controlType.replace(/ /g,''),
                catEntry:"Yes",
                controlType: sct[i].controlType
              });
              typeList[sct[i].reportingQuarter+sct[i].controlType] = true;
            }
            if (sct[i].controlName == undefined) sct[i].controlName = "(uncategorized)";
            if(typeof controlList[sct[i].reportingQuarter+sct[i].controlType+sct[i].controlName] === "undefined"){

              tmpList.push({
                parent: sct[i].reportingQuarter.replace(/ /g,'')+sct[i].controlType.replace(/ /g,''),
                id:sct[i].reportingQuarter.replace(/ /g,'')+sct[i].controlType.replace(/ /g,'')+sct[i].controlName.replace(/ /g,''),
                catEntry:"Yes",
                controlName: sct[i].controlName
              });
              controlList[sct[i].reportingQuarter+sct[i].controlType+sct[i].controlName] = true;
            }
            exportSCTest.push({
              reportingQuarter:sct[i].reportingQuarter || "",
              controlType:sct[i].controlType || "",
              controlName:sct[i].controlName || "",
              reportingCountry:sct[i].reportingCountry || "",
              numtest:sct[i].numtest || "",
              numDefects:sct[i].numDefects || "",
              defectRate:sct[i].defectRate || ""
            });
            sct[i].parent = sct[i].reportingQuarter.replace(/ /g,'')+sct[i].controlType.replace(/ /g,'')+sct[i].controlName.replace(/ /g,'');
            sct[i].id = sct[i]["_id"];
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
          doc[0].SampleData2 = JSON.parse(JSON.stringify(doc[0].SampleData));;
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
          for(var i = 0; i < samples.length; i++){
            if (samples[i].processCategory == undefined) samples[i].processCategory = "(uncategorized)";
            if(typeof categoryList[samples[i].processCategory] === "undefined"){
              tmpList.push({
                id:samples[i].processCategory.replace(/ /g,''),
                parent:"",
                catEntry:"Yes",
                processCategory: samples[i].processCategory
              });
              categoryList[samples[i].processCategory] = true;
            }
            if (samples[i].processSampled == undefined) samples[i].processSampled = "(uncategorized)";
            if(typeof processList[samples[i].processCategory+samples[i].processSampled] === "undefined"){
              tmpList.push({
                parent: samples[i].processCategory.replace(/ /g,''),
                id:samples[i].processCategory.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,''),
                catEntry:"Yes",
                processSampled: samples[i].processSampled
              });
              processList[samples[i].processCategory+samples[i].processSampled] = true;
            }
            exportSample.push({
              processCategory:samples[i].processCategory || "",
              processSampled:samples[i].processSampled || "",
              controlName:samples[i].controlName || "",
              IntegrationKeyWWBCIT:samples[i].IntegrationKeyWWBCIT || "",
              numDefects:samples[i].numDefects || "",
              defectType:samples[i].defectType || "",
              remediationStatus:samples[i].remediationStatus || "",
              remainingFinancialImpact:samples[i].remainingFinancialImpact || "",
              originalTargetDate:samples[i].originalTargetDate || "",
              targetClose:samples[i].targetClose || "",
              defectsAbstract:samples[i].defectsAbstract || ""
            });
            samples[i].parent = samples[i].processCategory.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,'');
            samples[i].id = samples[i]["_id"];
            tmpList.push(samples[i]);
          }
          doc[0].exportSample = exportSample;
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
          for(var i = 0; i < samples2.length; i++){
            if (samples2[i].originalReportingQuarter == undefined) samples2[i].originalReportingQuarter = "(uncategorized)";
            if(typeof periodList[samples2[i].originalReportingQuarter] === "undefined"){
              tmpList.push({
                id:samples2[i].originalReportingQuarter.replace(/ /g,''),
                parent:"",
                catEntry:"Yes",
                originalReportingQuarter: samples2[i].originalReportingQuarter
              });
              periodList[samples2[i].originalReportingQuarter] = true;
            }
            if (samples2[i].testType == undefined) samples2[i].testType = "(uncategorized)";
            if(typeof typeList[samples2[i].originalReportingQuarter+samples2[i].testType] === "undefined"){
              tmpList.push({
                parent: samples2[i].originalReportingQuarter.replace(/ /g,''),
                id:samples2[i].originalReportingQuarter.replace(/ /g,'')+samples2[i].testType.replace(/ /g,''),
                catEntry:"Yes",
                testType: samples2[i].testType
              });
              typeList[samples2[i].originalReportingQuarter+samples2[i].testType] = true;
            }
            exportSample2.push({
              originalReportingQuarter:samples2[i].originalReportingQuarter || "",
              testType:samples2[i].testType || "",
              controlName:samples2[i].controlName || "",
              IntegrationKeyWWBCIT:samples2[i].IntegrationKeyWWBCIT || "",
              processSampled:samples2[i].processSampled || "",
              numDefects:samples2[i].numDefects || "",
              defectType:samples2[i].defectType || "",
              remainingFinancialImpact:samples2[i].remainingFinancialImpact || "",
              originalTargetDate:samples2[i].originalTargetDate || "",
              targetClose:samples2[i].targetClose || "",
              defectsAbstract:samples2[i].defectsAbstract  || ""
            });
            samples2[i].parent = samples2[i].originalReportingQuarter.replace(/ /g,'')+samples2[i].testType.replace(/ /g,'');
            samples2[i].id = samples2[i]["_id"];
            tmpList.push(samples2[i]);
          }
          doc[0].exportSample2 = exportSample2;
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
          break;
      }
    }catch(e){
      console.log("[class-keycontrol][calcDefectRate] - " + err.error);
		}
	}

}
module.exports = calculateKCTab;
