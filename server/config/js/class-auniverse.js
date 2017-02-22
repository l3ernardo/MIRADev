/**************************************************************************************************
 *
 * MIRA Key Controls Testing Code
 * Date: 16 December 2016
 * By: genonms@ph.ibm.com
 *
 */

var fieldCalc = require('./class-fieldcalc.js');

var calculateAUTab = {

  processAUTab: function(doc, defViewRow) {
    var audits= doc[0].AUData;
    var ratingCategory = {};
    var auditsList = [];
    var exportAudits = [];
    var topEntry = {id: "topCategory", counter: audits.length,name: "total", CUMaxScore: 0, CUScore: 0};
    if (audits.length > 0) {
      auditsList.push(topEntry);
    }
  var objects = {};//object of objects for counting
  audits.sort(function(a, b){
    var nameA=a.PeriodRating.toLowerCase(), nameB=b.PeriodRating.toLowerCase()
    if (nameA > nameB) //sort string descending
      return -1
    if (nameA < nameB)
      return 1
    return 0 //default return value (no sorting)
  });
    for(var i = 0; i < audits.length; i++){
      if(typeof ratingCategory[audits[i].PeriodRating] === "undefined"){
        var tmp = {
          id:audits[i].PeriodRating.replace(/ /g,''),
          name:audits[i].PeriodRating,
          counter: 0,
          parent: "topCategory",
          CUMaxScore: 0,
          CUScore: 0
        };
        auditsList.push(tmp);
        objects[tmp.id] = tmp;
        ratingCategory[audits[i].PeriodRating] = true;
      }

      audits[i].counter = 1;
      var tmp = {};
      tmp.cat = audits[i].PeriodRating || " ";
      tmp.AssessableUnitName = audits[i].AssessableUnitName || " ";
      tmp.Counter = audits[i].counter || " ";
      tmp.Type = audits[i].Type || " ";
      tmp.ARRGATTStatus = audits[i].ARRGATTStatus || " ";
      tmp.PeriodRatingPrev4 = audits[i].PeriodRatingPrev4 || " ";
      tmp.PeriodRatingPrev3 = audits[i].PeriodRatingPrev3 || " ";
      tmp.PeriodRatingPrev2 = audits[i].PeriodRatingPrev2 || " ";
      tmp.PeriodRatingPrev1 = audits[i].PeriodRatingPrev1 || " ";
      tmp.PeriodRating = audits[i].PeriodRating || " ";
      tmp.NextQtrRating = audits[i].NextQtrRating || " ";
      tmp.Target2Sat = audits[i].Target2Sat || " ";
      tmp.CUSize = audits[i].CUSize || " ";
      tmp.CUMaxScore = audits[i].CUMaxScore || " ";
      tmp.CUScore = audits[i].CUScore || " ";
      tmp.ReviewComments = audits[i].ReviewComments || " ";

      exportAudits.push(tmp);
      audits[i].parent = audits[i].PeriodRating.replace(/ /g,'');
      audits[i].id = audits[i]["_id"];
      //do counting for category
      objects[audits[i].parent].counter++ ;
      if(audits[i].CUMaxScore != ""){
        topEntry.CUMaxScore += parseFloat(audits[i].CUMaxScore);
        objects[audits[i].parent].CUMaxScore += parseFloat(audits[i].CUMaxScore);
      }
      if(audits[i].CUScore != ""){
        topEntry.CUScore += parseFloat(audits[i].CUScore);
        objects[audits[i].parent].CUScore += parseFloat(audits[i].CUScore);
      }
      auditsList.push(audits[i]);
    }
    if (Object.keys(ratingCategory).length < defViewRow) {
      if (auditsList.length == 0) {
        auditsList = fieldCalc.addTestViewData(10,defViewRow);
      } else {
        fieldCalc.addTestViewDataPadding(auditsList,10,(defViewRow-Object.keys(ratingCategory).length));
      }
    };
    doc[0].AUData = auditsList;
    doc[0].exportAUniverse = exportAudits;
    if(topEntry.CUScore > 0 && topEntry.CUMaxScore > 0 )  doc[0].AUWeightedScore = (topEntry.CUScore / topEntry.CUMaxScore * 100).toFixed(1)+"%";
	}

}
module.exports = calculateAUTab;
