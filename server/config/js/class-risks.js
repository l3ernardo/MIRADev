/**************************************************************************************************
 *
 * MIRA Key Controls Testing Code
 * Date: 16 December 2016
 * By: genonms@ph.ibm.com
 *
 */

var fieldCalc = require('./class-fieldcalc.js');

var calculateORTab = {

  processORTab: function(doc, defViewRow) {
    var risks = RiskView1Data;
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
	}

}
module.exports = calculateORTab;
