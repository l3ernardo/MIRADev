/**************************************************************************************************
*
* MIRA Key Controls Testing Code
* Date: 25 January 2017
* By: genonms@ph.ibm.com
*
*/

var fieldCalc = require('./class-fieldcalc.js');

var calculatePRTab = {

  processProTab: function(doc, defViewRow) {
    var catList = {};
    var tmpAccountList = [];
    var exportList = [];
    //categorization for
    for(var i = 0; i < doc[0].BUCAsmtDataPRview.length; i++){
      //to categorize sort
      switch (doc[0].BUCAsmtDataPRview[i].ratingcategory) {
        case "NR":
        doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 1;
        break;
        case "Unsat &#9660;":
        doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 2;
        break;
        case "Unsat &#61;":
        doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 3;
        doc[0].BUCAsmtDataPRview[i].ratingcategory = "Unsat";
        break;
        case "Marg &#9660;":
        doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 4;
        break;
        case "Marg &#61;":
        doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 5;
        doc[0].BUCAsmtDataPRview[i].ratingcategory = "Marg";
        break;
        case "Marg &#9650;":
        doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 6;
        break;
        case "Sat &#9650;":
        doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 7;
        break;
        case "Sat &#61;":
        doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 8;
        doc[0].BUCAsmtDataPRview[i].ratingcategory = "Sat";
        break;
        case "Exempt;":
        doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 9;
        break;
        default:
        doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 10;
      }
    }
    doc[0].BUCAsmtDataPRview.sort(function(a, b){
      var nameA=a.ratingcategorysort, nameB=b.ratingcategorysort
      if (nameA > nameB) //sort string descending
      return -1
      if (nameA < nameB)
      return 1
      return 0 //default return value (no sorting)
    });
    //categorization for
    for(var i = 0; i < doc[0].BUCAsmtDataPRview.length; i++){
		var category_aux; 
		category_aux = fieldCalc.getRatingCategory(doc[0].BUCAsmtDataPRview[i].ratingCQ,doc[0].BUCAsmtDataPRview[i].ratingPQ1);	
      if(typeof catList[doc[0].BUCAsmtDataPRview[i].ratingcategory] === "undefined"){
        var tmp= {
          id: category_aux,
          category: category_aux,
          count: 0,
          MetricsValue: 0
        }
        tmpAccountList.push(tmp);
        catList[doc[0].BUCAsmtDataPRview[i].ratingcategory] = tmp;
      }
      catList[doc[0].BUCAsmtDataPRview[i].ratingcategory].count++;
      catList[doc[0].BUCAsmtDataPRview[i].ratingcategory].MetricsValue += parseInt(doc[0].BUCAsmtDataPRview[i].MetricsValue);
      doc[0].BUCAsmtDataPRview[i].id = doc[0].BUCAsmtDataPRview[i]["docid"];
      doc[0].BUCAsmtDataPRview[i].parent =category_aux;// doc[0].BUCAsmtDataPRview[i].ratingcategory.replace(/ /g,'');

      tmpAccountList.push(doc[0].BUCAsmtDataPRview[i]);
      exportList.push({
        category:doc[0].BUCAsmtDataPRview[i].ratingcategory  || " ",
        name: doc[0].BUCAsmtDataPRview[i].name || " ",
		country:doc[0].BUCAsmtDataPRview[i].country || " ",
        process:doc[0].BUCAsmtDataPRview[i].process || " ",
        auditprogram:doc[0].BUCAsmtDataPRview[i].auditprogram || " ",
        ratingcategory:doc[0].BUCAsmtDataPRview[i].ratingcategory || " ",
        ratingCQ:doc[0].BUCAsmtDataPRview[i].ratingCQ || " ",
        ratingPQ1:doc[0].BUCAsmtDataPRview[i].ratingPQ1 || " ",
        targettosat:doc[0].BUCAsmtDataPRview[i].targettosat || " ",
        targettosatprev:doc[0].BUCAsmtDataPRview[i].targettosatprev || " ",
        reviewcomments:doc[0].BUCAsmtDataPRview[i].reviewcomments
      });
    }
    doc[0].exportAccountRatings = exportList;
    for(var category in catList){
      catList[category].percent = (catList[category].count/doc[0].BUCAsmtDataPRview.length*100).toFixed(1);
      catList[category].MetricsValue = ((catList[category].MetricsValue/parseFloat(doc[0].MetricsValueCU))*100).toFixed(1);
    }
    //Adding padding
    if (Object.keys(catList).length < defViewRow) {
      if (tmpAccountList.length == 0) {
        tmpAccountList = fieldCalc.addTestViewData(9,defViewRow);
      } else {
        fieldCalc.addTestViewDataPadding(tmpAccountList,9,(defViewRow-Object.keys(catList).length));
      }
    }
    doc[0].BUCAsmtDataPRview = tmpAccountList;
  }
}

module.exports = calculatePRTab;
