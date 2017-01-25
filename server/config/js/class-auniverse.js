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
    auditsList.push({id: "topCategory", counter: audits.length,name: "total"});
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
          parent: "topCategory"
        };
        auditsList.push(tmp);
        objects[tmp.id] = tmp;
        ratingCategory[audits[i].PeriodRating] = true;
      }
      audits[i].counter = 1;
      var tmp = {};
      tmp.PeriodRating = audits[i].PeriodRating || " ";
      tmp.Counter = audits[i].counter || " ";
      tmp.Portfolio = audits[i].Portfolio || " ";

      exportAudits.push(tmp);
      audits[i].parent = audits[i].PeriodRating.replace(/ /g,'');
      audits[i].id = audits[i]["_id"];
      //do counting for category
      objects[audits[i].parent].counter++ ;
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
	}

}
module.exports = calculateAUTab;
