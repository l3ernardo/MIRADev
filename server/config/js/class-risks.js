/**************************************************************************************************
*
* MIRA Key Controls Testing Code
* Date: 16 December 2016
* By: genonms@ph.ibm.com
*
*/

var fieldCalc = require('./class-fieldcalc.js');

var calculateORTab = {

  processORTab: function(doc, defViewRow, req){
    try {
      switch (doc[0].ParentDocSubType) {
        case "Country Process":
        var risks = doc[0].RiskView1Data;
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
          // if(risks[i].FlagTodaysDate == "1"||risks[i].ctrg > 0 || risks[i].numMissedTasks > 0){
          if((risks[i].FlagTodaysDate == "1"||risks[i].ctrg > 0) && risks[i].status != "Closed"){
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
        break;
      case "BU IOT":
      case "BU IMT":
      case "BU Country":
         if(doc[0].MIRABusinessUnit == "GBS"){
          //count the category issues
          doc[0].totalRisks = {
            PrevQtr1: 0,
            PrevQtr2: 0,
            PrevQtr3: 0,
            PrevQtr4: 0,
            Current: 0
          };
          doc[0].riskCategories[0].flagForTextarea = true;
          for (var i = 0; i < doc[0].RiskView1Data.length; i++) {
            for (var j = 0; j < doc[0].riskCategories.length; j++) {
              if(doc[0].RiskView1Data[i].scorecardCategory == doc[0].riskCategories[j].name){
                if (doc[0].RiskView1Data[i].reportingQuarter == doc[0].CurrentPeriod) {
                  doc[0].totalRisks.Current++;
                  if(doc[0].riskCategories[j]["Current"] == undefined){
                    doc[0].riskCategories[j]["Current"] = 1;
                  }else {
                    doc[0].riskCategories[j]["Current"]++;
                  }
                }
                else{
                  for (var k = 0; k < doc[0].PrevQtrs.length; k++) {
                    if(doc[0].RiskView1Data[i].reportingQuarter == doc[0].PrevQtrs[k]){
                      doc[0].totalRisks["PrevQtr"+(k+1)]++;
                      if(doc[0].riskCategories[j]["PrevQtr"+(k+1)] == undefined){
                        doc[0].riskCategories[j]["PrevQtr"+(k+1)] = 1;
                      }else {
                        doc[0].riskCategories[j]["PrevQtr"+(k+1)]++;
                      }
                    }
                  }
                }
              }
            }
          }
          //Quarters change
          doc[0].QtdChangeRisks = {
            QtdChange1:  Math.abs(doc[0].totalRisks.PrevQtr1 - doc[0].totalRisks.PrevQtr2),
            QtdChange2: Math.abs(doc[0].totalRisks.PrevQtr2 - doc[0].totalRisks.PrevQtr3),
            QtdChange3: Math.abs(doc[0].totalRisks.PrevQtr3 - doc[0].totalRisks.PrevQtr4),
            QtdChange4: Math.abs(doc[0].totalRisks.PrevQtr4 - doc[0].totalRisks.Current)
          };
          //first table
            var risks = doc[0].AUDataMSAC;
            var exportOpenRisks = [];
            for(var i = 0; i < risks.length; i++){
              var tmp = {};
              tmp.AssessableUnitName = risks[i].AssessableUnitName || " ";
              tmp.PeriodRatingPrev1 = risks[i].PeriodRatingPrev1 || " ";
              tmp.PeriodRating = risks[i].PeriodRating || " ";
              tmp.originalTargetDate = risks[i].originalTargetDate || " ";
              tmp.Target2Sat = risks[i].Target2Sat || " ";
              exportOpenRisks.push(tmp);
            }
            doc[0].exportOpenRisks = exportOpenRisks;
            if (risks.length < defViewRow) {
              if (risks.length == 0) {
                risks = fieldCalc.addTestViewData(10,defViewRow);
              } else {
                fieldCalc.addTestViewDataPadding(risks,10,(defViewRow-risks.length));
              }
            };
            doc[0].RiskView1Data = risks;
            //second table
            var risks = doc[0].RiskView2Data;
            var riskCategory = {};
            var openrisks = [];
            var exportOpenRisks2 = [];
            doc[0].ORMCMissedRisks = 0;
          var objects = {};//object of objects for counting
          risks.sort(function(a, b){
            var nameA=a.scorecardCategory.toLowerCase(), nameB=b.scorecardCategory.toLowerCase()
            if (nameA > nameB) //sort string descending
              return -1
            if (nameA < nameB)
              return 1
            return 0 //default return value (no sorting)
          });
          for(var i = 0; i < risks.length; i++){
            if(typeof riskCategory[risks[i].scorecardCategory] === "undefined"){
              var tmp = {
                id:risks[i].scorecardCategory.replace(/ /g,''),
                type:risks[i].scorecardCategory,
                numOpenIssues: 0,
              };
              openrisks.push(tmp);
              objects[tmp.id] = tmp;
              riskCategory[risks[i].scorecardCategory] = true;
            }
            if((risks[i].FlagTodaysDate == "1"||risks[i].ctrg > 0) && risks[i].status != "Closed"){
            // if(risks[i].FlagTodaysDate == "1"||risks[i].ctrg > 0 || risks[i].numMissedTasks > 0){
              risks[i].missedFlag = true;
              doc[0].ORMCMissedRisks = 1;
            }else {
              risks[i].missedFlag = false;
            }
            risks[i].numOpenIssues = 1;
            var tmp = {};
            tmp.scorecardCategory = risks[i].scorecardCategory || " ";
            tmp.id = risks[i].id || " ";
            tmp.status = risks[i].status || " ";
            tmp.originalTargetDate = risks[i].originalTargetDate || " ";
            tmp.currentTargetDate = risks[i].currentTargetDate || " ";
            tmp.numTasks = risks[i].numTasks || " ";
            tmp.numTasksOpen = risks[i].numTasksOpen || " ";
            tmp.numMissedTasks = risks[i].numMissedTasks || " ";
            tmp.numOpenIssues = risks[i].numOpenIssues || " ";
            tmp.missedFlag = risks[i].missedFlag || " ";
            tmp.riskAbstract = risks[i].riskAbstract || " ";
            exportOpenRisks2.push(tmp);
            risks[i].parent = risks[i].scorecardCategory.replace(/ /g,'');
            //do counting for category
            objects[risks[i].parent].numOpenIssues++ ;
            openrisks.push(risks[i]);
          }
          doc[0].exportOpenRisks2 = exportOpenRisks2;
          if (Object.keys(riskCategory).length < defViewRow) {
            if (openrisks.length == 0) {
              openrisks = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(openrisks,10,(defViewRow-Object.keys(riskCategory).length));
            }
          };
          doc[0].RiskView2Data = openrisks;

        }
        else{//no GBS
          //count the totals category issues
          doc[0].totalRisks = {
            CRMPrevQtr1: 0,
            CRMPrevQtr2: 0,
            CRMPrevQtr3: 0,
            CRMPrevQtr4: 0,
            CRMCurrent: 0,
            DeliveryPrevQtr1: 0,
            DeliveryPrevQtr2: 0,
            DeliveryPrevQtr3: 0,
            DeliveryPrevQtr4: 0,
            DeliveryCurrent: 0
          };
          //count the CRM category issues
          for (var i = 0; i < doc[0].RiskView1DataCRM.length; i++) {
            for (var j = 0; j < doc[0].riskCategories.length; j++) {
              if(doc[0].RiskView1DataCRM[i].scorecardCategory == doc[0].riskCategories[j].name){
                if (doc[0].RiskView1DataCRM[i].reportingQuarter == doc[0].CurrentPeriod) {
                  doc[0].totalRisks.CRMCurrent++;
                  if(doc[0].riskCategories[j]["CRMCurrent"] == undefined){
                    doc[0].riskCategories[j]["CRMCurrent"] = 1;
                  }else {
                    doc[0].riskCategories[j]["CRMCurrent"]++;
                  }
                }
                else{
                  for (var k = 0; k < doc[0].PrevQtrs.length; k++) {
                    if(doc[0].RiskView1DataCRM[i].reportingQuarter == doc[0].PrevQtrs[k]){
                      doc[0].totalRisks["CRMPrevQtr"+(k+1)]++;
                      if(doc[0].riskCategories[j]["CRMPrevQtr"+(k+1)] == undefined){
                        doc[0].riskCategories[j]["CRMPrevQtr"+(k+1)] = 1;
                      }else {
                        doc[0].riskCategories[j]["CRMPrevQtr"+(k+1)]++;
                      }
                    }
                  }
                }
              }
            }
          }
          //count the Delivery category issues
          for (var i = 0; i < doc[0].RiskView1DataDelivery.length; i++) {
            for (var j = 0; j < doc[0].riskCategories.length; j++) {
              if(doc[0].RiskView1DataDelivery[i].scorecardCategory == doc[0].riskCategories[j].name){
                if (doc[0].RiskView1DataDelivery[i].reportingQuarter == doc[0].CurrentPeriod) {
                  doc[0].totalRisks.DeliveryCurrent++;
                  if(doc[0].riskCategories[j]["DeliveryCurrent"] == undefined){
                    doc[0].riskCategories[j]["DeliveryCurrent"] = 1;
                  }else {
                    doc[0].riskCategories[j]["DeliveryCurrent"]++;
                  }
                }
                else{
                  for (var k = 0; k < doc[0].PrevQtrs.length; k++) {
                    if(doc[0].RiskView1DataDelivery[i].reportingQuarter == doc[0].PrevQtrs[k]){
                      doc[0].totalRisks["DeliveryPrevQtr"+(k+1)]++;
                      if(doc[0].riskCategories[j]["DeliveryPrevQtr"+(k+1)] == undefined){
                        doc[0].riskCategories[j]["DeliveryPrevQtr"+(k+1)] = 1;
                      }else {
                        doc[0].riskCategories[j]["DeliveryPrevQtr"+(k+1)]++;
                      }
                    }
                  }
                }
              }
            }
          }
          //Quarters change
          doc[0].QtdChangeRisks = {
            CRMQtdChange1:  Math.abs(doc[0].totalRisks.CRMPrevQtr1 - doc[0].totalRisks.CRMPrevQtr2),
            CRMQtdChange2: Math.abs(doc[0].totalRisks.CRMPrevQtr2 - doc[0].totalRisks.CRMPrevQtr3),
            CRMQtdChange3: Math.abs(doc[0].totalRisks.CRMPrevQtr3 - doc[0].totalRisks.CRMPrevQtr4),
            CRMQtdChange4: Math.abs(doc[0].totalRisks.CRMPrevQtr4 - doc[0].totalRisks.CRMCurrent),
            DeliveryQtdChange1:  Math.abs(doc[0].totalRisks.DeliveryPrevQtr1 - doc[0].totalRisks.DeliveryPrevQtr2),
            DeliveryQtdChange2: Math.abs(doc[0].totalRisks.DeliveryPrevQtr2 - doc[0].totalRisks.DeliveryPrevQtr3),
            DeliveryQtdChange3: Math.abs(doc[0].totalRisks.DeliveryPrevQtr3 - doc[0].totalRisks.DeliveryPrevQtr4),
            DeliveryQtdChange4: Math.abs(doc[0].totalRisks.DeliveryPrevQtr4 - doc[0].totalRisks.DeliveryCurrent)
          };
          //first table
            //var risks = JSON.parse(JSON.stringify(doc[0].asmtsdocs));
            var risks = doc[0].AUDataMSAC;
            var exportOpenRisks = [];
            var riskCategory = {};
            var openrisks = [];
            risks.sort(function(a, b){
              var nameA=a.catP.toLowerCase(), nameB=b.catP.toLowerCase()
              if (nameA > nameB)
                return -1
              if (nameA < nameB)
                return 1
              var nameA=a.PeriodRating.toLowerCase(), nameB=b.PeriodRating.toLowerCase()
              if (nameA > nameB)
                return -1
              if (nameA < nameB)
                return 1
              return 0 //default return value (no sorting)
            });
            for(var i = 0; i < risks.length; i++){
              if(typeof riskCategory[risks[i].catP] === "undefined"){
                var tmp = {
                  id:risks[i].catP.replace(/ /g,''),
                  catName:risks[i].catP
                };
                openrisks.push(tmp);
                riskCategory[risks[i].catP] = true;
              }
              var tmp = {};
              tmp.catName = risks[i].catP || " ";
              tmp.AssessableUnitName = risks[i].AssessableUnitName || " ";
              tmp.PeriodRatingPrev1 = risks[i].PeriodRatingPrev1 || " ";
              tmp.PeriodRating = risks[i].PeriodRating || " ";
              tmp.originalTargetDate = risks[i].originalTargetDate || " ";
              tmp.Target2Sat = risks[i].Target2Sat || " ";
              exportOpenRisks.push(tmp);
              risks[i].parent = risks[i].catP.replace(/ /g,'');
              risks[i].id = risks[i]["_id"].replace(/ /g,'');
              openrisks.push(risks[i]);
            }
            doc[0].exportOpenRisks = exportOpenRisks;
            if (Object.keys(riskCategory).length < defViewRow) {
              if (openrisks.length == 0) {
                openrisks = fieldCalc.addTestViewData(10,defViewRow);
              } else {
                fieldCalc.addTestViewDataPadding(openrisks,10,(defViewRow-Object.keys(riskCategory).length));
              }
            };
            doc[0].RiskView1Data = openrisks;
          //second table
          var risks = doc[0].RiskView2Data;
          var riskCategory1 = {};
          var riskCategory = {};
          var openrisks = [];
          var exportOpenRisks2 = [];
          doc[0].ORMCMissedRisks = 0;
        var objects = {};//object of objects for counting
        risks.sort(function(a, b){
          var nameA=a.catP.toLowerCase(), nameB=b.catP.toLowerCase()
          if (nameA > nameB) //sort string descending
            return -1
          if (nameA < nameB)
            return 1
          var nameA=a.scorecardCategory.toLowerCase(), nameB=b.scorecardCategory.toLowerCase()
          if (nameA > nameB) //sort string descending
            return -1
          if (nameA < nameB)
            return 1
          return 0 //default return value (no sorting)
        });
        for(var i = 0; i < risks.length; i++){
          if(typeof riskCategory1[risks[i].catP] === "undefined"){
            var tmp = {
              id:risks[i].catP.replace(/ /g,''),
              catP:risks[i].catP,
              numOpenIssues: 0,
            };
            openrisks.push(tmp);
            objects[tmp.catP] = tmp;
            riskCategory1[risks[i].catP] = true;
          }
          if(typeof riskCategory[risks[i].catP.replace(/ /g,'')+risks[i].scorecardCategory.replace(/ /g,'')] === "undefined"){
            var tmp = {
              id:risks[i].catP.replace(/ /g,'')+risks[i].scorecardCategory.replace(/ /g,''),
              parent:risks[i].catP.replace(/ /g,''),
              type:risks[i].scorecardCategory,
              numOpenIssues: 0,
            };
            openrisks.push(tmp);
            objects[tmp.id] = tmp;
            riskCategory[risks[i].catP.replace(/ /g,'')+risks[i].scorecardCategory.replace(/ /g,'')] = true;
          };
          if((risks[i].FlagTodaysDate == "1"||risks[i].ctrg > 0) && risks[i].status != "Closed"){
          // if(risks[i].FlagTodaysDate == "1"||risks[i].ctrg > 0 || risks[i].numMissedTasks > 0){
            risks[i].missedFlag = true;
            doc[0].ORMCMissedRisks = 1;
          }else {
            risks[i].missedFlag = false;
          };
          risks[i].numOpenIssues = 1;
          var tmp = {};
          tmp.scorecardCategory = risks[i].scorecardCategory || " ";
          tmp.id = risks[i].id || " ";
          tmp.status = risks[i].status || " ";
          tmp.originalTargetDate = risks[i].originalTargetDate || " ";
          tmp.currentTargetDate = risks[i].currentTargetDate || " ";
          tmp.numTasks = risks[i].numTasks || " ";
          tmp.numTasksOpen = risks[i].numTasksOpen || " ";
          tmp.numMissedTasks = risks[i].numMissedTasks || " ";
          tmp.numOpenIssues = risks[i].numOpenIssues || " ";
          tmp.missedFlag = risks[i].missedFlag || " ";
          tmp.riskAbstract = risks[i].riskAbstract || " ";
          exportOpenRisks2.push(tmp);
          risks[i].parent = risks[i].catP.replace(/ /g,'')+risks[i].scorecardCategory.replace(/ /g,'');
          //do counting for category
          objects[risks[i].parent].numOpenIssues++ ;
          objects[risks[i].catP].numOpenIssues++ ;
          openrisks.push(risks[i]);
        }
        doc[0].exportOpenRisks2 = exportOpenRisks2;
        if (Object.keys(riskCategory1).length < defViewRow) {
          if (openrisks.length == 0) {
            openrisks = fieldCalc.addTestViewData(10,defViewRow);
          } else {
            fieldCalc.addTestViewDataPadding(openrisks,10,(defViewRow-Object.keys(riskCategory1).length));
          }
        };
        doc[0].RiskView2Data = openrisks;
      }
      break;
      }
    }catch(e){
      console.log("[class-risks][processORTab] - " + err.error);
		}
  }
}
module.exports = calculateORTab;
