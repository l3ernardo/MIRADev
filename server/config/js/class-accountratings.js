/**************************************************************************************************
*
* MIRA Key Controls Testing Code
* Date: 16 December 2016
* By: genonms@ph.ibm.com
*
*/

var fieldCalc = require('./class-fieldcalc.js');

var calculateARTab = {

  processARTab: function(doc, defViewRow) {
    var catList = {};
    var tmpAccountList = [];
    var exportList = [];
    //categorization for
    for(var i = 0; i < doc[0].AccountData.length; i++){
      //to categorize sort
      switch (doc[0].AccountData[i].RatingCategory) {
        case "NR":
        doc[0].AccountData[i].ratingcategorysort = 1;
        break;
        case "Unsat &#9660;":
        doc[0].AccountData[i].ratingcategorysort = 2;
        break;
        case "Unsat &#61;":
        doc[0].AccountData[i].ratingcategorysort = 3;
        doc[0].AccountData[i].RatingCategory = "Unsat";
        break;
        case "Marg &#9660;":
        doc[0].AccountData[i].ratingcategorysort = 4;
        break;
        case "Marg &#61;":
        doc[0].AccountData[i].ratingcategorysort = 5;
        doc[0].AccountData[i].RatingCategory = "Marg";
        break;
        case "Marg &#9650;":
        doc[0].AccountData[i].ratingcategorysort = 6;
        break;
        case "Sat &#9650;":
        doc[0].AccountData[i].ratingcategorysort = 7;
        break;
        case "Sat &#61;":
        doc[0].AccountData[i].ratingcategorysort = 8;
        doc[0].AccountData[i].RatingCategory = "Sat";
        break;
        case "Exempt;":
        doc[0].AccountData[i].ratingcategorysort = 9;
        break;
        default:
        doc[0].AccountData[i].ratingcategorysort = 10;
      }
    }
    doc[0].AccountData.sort(function(a, b){
      var nameA=a.ratingcategorysort, nameB=b.ratingcategorysort
      if (nameA > nameB) //sort string descending
      return -1
      if (nameA < nameB)
      return 1
      return 0 //default return value (no sorting)
    });
    //categorization for
    for(var i = 0; i < doc[0].AccountData.length; i++){
      if(typeof catList[doc[0].AccountData[i].RatingCategory] === "undefined"){
        var tmp= {
          id: doc[0].AccountData[i].RatingCategory.replace(/ /g,''),
          category: doc[0].AccountData[i].RatingCategory,
          count: 0
        }
        tmpAccountList.push(tmp);
        catList[doc[0].AccountData[i].RatingCategory] = tmp;
      }
      catList[doc[0].AccountData[i].RatingCategory].count++;
      doc[0].AccountData[i].id = doc[0].AccountData[i]["_id"];
      doc[0].AccountData[i].parent = doc[0].AccountData[i].RatingCategory.replace(/ /g,'');
      tmpAccountList.push(doc[0].AccountData[i]);
      exportList.push({
        category:doc[0].AccountData[i].RatingCategory  || " ",
        AssessableUnitName: doc[0].AccountData[i].AssessableUnitName || " ",
        blank: " ",
        blank2: " ",
        blank3: " ",
        PeriodRatingPrev1: doc[0].AccountData[i].PeriodRatingPrev1 || " ",
        PeriodRating: doc[0].AccountData[i].PeriodRating || " ",
        Target2Sat: doc[0].AccountData[i].Target2Sat || " ",
        blank4: " ",
        blank5: " ",
        blank6: " "
      });
    }
    doc[0].exportAccountRatings = exportList;
    for(var category in catList){
      catList[category].percent = catList[category].count/doc[0].AccountData.length*100;
    }
    //Adding padding
    if (Object.keys(catList).length < defViewRow) {
      if (tmpAccountList.length == 0) {
        tmpAccountList = fieldCalc.addTestViewData(9,defViewRow);
      } else {
        fieldCalc.addTestViewDataPadding(tmpAccountList,9,(defViewRow-Object.keys(catList).length));
      }
    }
    doc[0].AccountData = tmpAccountList;
  }
}

module.exports = calculateARTab;
