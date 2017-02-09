/**************************************************************************************************
*
* MIRA Key Controls Testing Code
* Date: 16 December 2016
* By: genonms@ph.ibm.com
*
*/

var fieldCalc = require('./class-fieldcalc.js');

var calculatePRTab = {

  processPRTab: function(doc, defViewRow) {
    for(var i = 0; i < doc[0].CUAsmtDataPR1view.length; i++){
      doc[0].CUAsmtDataPR1view[i].ratingcategory = fieldCalc.getRatingCategory(doc[0].CUAsmtDataPR1view[i].ratingCQ, doc[0].CUAsmtDataPR1view[i].ratingPQ1);
      switch (doc[0].CUAsmtDataPR1view[i].ratingcategory) {
        case "NR":
        doc[0].CUAsmtDataPR1view[i].ratingcategorysort = 1;
        break;
        case "Unsat &#9660;":
        doc[0].CUAsmtDataPR1view[i].ratingcategorysort = 2;
        break;
        case "Unsat &#61;":
        doc[0].CUAsmtDataPR1view[i].ratingcategorysort = 3;
        break;
        case "Marg &#9660;":
        doc[0].CUAsmtDataPR1view[i].ratingcategorysort = 4;
        break;
        case "Marg &#61;":
        doc[0].CUAsmtDataPR1view[i].ratingcategorysort = 5;
        break;
        case "Marg &#9650;":
        doc[0].CUAsmtDataPR1view[i].ratingcategorysort = 6;
        break;
        case "Sat &#9650;":
        doc[0].CUAsmtDataPR1view[i].ratingcategorysort = 7;
        break;
        case "Sat &#61;":
        doc[0].CUAsmtDataPR1view[i].ratingcategorysort = 8;
        break;
        case "Exempt;":
        doc[0].CUAsmtDataPR1view[i].ratingcategorysort = 9;
        break;
        default:
        doc[0].CUAsmtDataPR1view[i].ratingcategorysort = 10;
      }
    }
    doc[0].CUAsmtDataPR1view2 = JSON.parse(JSON.stringify(doc[0].CUAsmtDataPR1view));
    doc[0].CUAsmtDataPR1view.sort(function(a, b){
      var nameA=a.ratingcategorysort, nameB=b.ratingcategorysort
      if (nameA > nameB) //sort string descending
      return -1
      if (nameA < nameB)
      return 1
      return 0 //default return value (no sorting)
    });
    //categorization for
    var catList = {};
    var tmpRatingList = [];
    var exportList = [];
    for(var i = 0; i < doc[0].CUAsmtDataPR1view.length; i++){
      if(typeof catList[doc[0].CUAsmtDataPR1view[i].ratingcategory] === "undefined"){
        var tmp= {
          id: doc[0].CUAsmtDataPR1view[i].ratingcategory.replace(/ /g,''),
          ratingcategory: doc[0].CUAsmtDataPR1view[i].ratingcategory,
          count: 0
        }
        tmpRatingList.push(tmp);
        catList[doc[0].CUAsmtDataPR1view[i].ratingcategory] = tmp;
      }
      catList[doc[0].CUAsmtDataPR1view[i].ratingcategory].count++;
      doc[0].CUAsmtDataPR1view[i].id = doc[0].CUAsmtDataPR1view[i].docid;
      doc[0].CUAsmtDataPR1view[i].parent = doc[0].CUAsmtDataPR1view[i].ratingcategory.replace(/ /g,'');
      tmpRatingList.push(doc[0].CUAsmtDataPR1view[i]);
      exportList.push({
        ratingcategory:doc[0].CUAsmtDataPR1view[i].ratingcategory  || " ",
        name: doc[0].CUAsmtDataPR1view[i].name || " ",
        blank: " ",
        blank2: " ",
        ratingPQ1: doc[0].CUAsmtDataPR1view[i].ratingPQ1 || " ",
        ratingCQ: doc[0].CUAsmtDataPR1view[i].ratingCQ || " ",
        targettosat: doc[0].CUAsmtDataPR1view[i].targettosat || " ",
        targettosatprev: doc[0].CUAsmtDataPR1view[i].targettosatprev || " ",
        reviewcomments: doc[0].CUAsmtDataPR1view[i].reviewcomments || " "
      });
    }
    doc[0].exportProcessRatings = exportList;
    for(var category in catList){
      catList[category].percent = (catList[category].count/doc[0].CUAsmtDataPR1view.length*100).toFixed(0);
    }
    //Adding padding
    if (Object.keys(catList).length < defViewRow) {
      if (tmpRatingList.length == 0) {
        tmpRatingList = fieldCalc.addTestViewData(9,defViewRow);
      } else {
        fieldCalc.addTestViewDataPadding(tmpRatingList,9,(defViewRow-Object.keys(catList).length));
      }
    }
    doc[0].CUAsmtDataPR1view = tmpRatingList;
    //process ratings by country
    doc[0].CUAsmtDataPR1view2.sort(function(a, b){
      var nameA=a.country.toLowerCase(), nameB=b.country.toLowerCase()
      if (nameA > nameB) //sort string descending
      return -1
      if (nameA < nameB)
      return 1
      var nameA=a.ratingcategorysort, nameB=b.ratingcategorysort
      if (nameA > nameB) //sort string descending
      return -1
      if (nameA < nameB)
      return 1
      return 0 //default return value (no sorting)
    });
    //categorization for - Process Ratings by Country
    var catList = {};
    var countryList = {};
    var tmpRatingList = [];
    var exportList = [];
    for(var i = 0; i < doc[0].CUAsmtDataPR1view2.length; i++){
      if(typeof countryList[doc[0].CUAsmtDataPR1view2[i].country.replace(/ /g,'')] === "undefined"){
        var tmp= {
          id: doc[0].CUAsmtDataPR1view2[i].country.replace(/ /g,''),
          country: doc[0].CUAsmtDataPR1view2[i].country,
          count: 0
        }
        tmpRatingList.push(tmp);
        countryList[doc[0].CUAsmtDataPR1view2[i].country.replace(/ /g,'')] = tmp;
      }
      if(typeof catList[doc[0].CUAsmtDataPR1view2[i].country+doc[0].CUAsmtDataPR1view2[i].ratingcategory] === "undefined"){
        var tmp= {
          parent: doc[0].CUAsmtDataPR1view2[i].country.replace(/ /g,''),
          id: doc[0].CUAsmtDataPR1view2[i].country.replace(/ /g,'')+doc[0].CUAsmtDataPR1view2[i].ratingcategory.replace(/ /g,''),
          ratingcategory: doc[0].CUAsmtDataPR1view2[i].ratingcategory,
          count: 0,
          total: 0
        }
        tmpRatingList.push(tmp);
        catList[doc[0].CUAsmtDataPR1view2[i].country+doc[0].CUAsmtDataPR1view2[i].ratingcategory] = tmp;
      }
      catList[doc[0].CUAsmtDataPR1view2[i].country+doc[0].CUAsmtDataPR1view2[i].ratingcategory].count++;
      countryList[doc[0].CUAsmtDataPR1view2[i].country.replace(/ /g,'')].count++;
      doc[0].CUAsmtDataPR1view2[i].id = doc[0].CUAsmtDataPR1view2[i].docid;
      doc[0].CUAsmtDataPR1view2[i].parent = doc[0].CUAsmtDataPR1view2[i].country.replace(/ /g,'')+doc[0].CUAsmtDataPR1view2[i].ratingcategory.replace(/ /g,'');
      tmpRatingList.push(doc[0].CUAsmtDataPR1view2[i]);
      exportList.push({
        country: doc[0].CUAsmtDataPR1view2[i].country || " ",
        ratingcategory:doc[0].CUAsmtDataPR1view2[i].ratingcategory || " ",
        name: doc[0].CUAsmtDataPR1view2[i].name || " ",
        blank: " ",
        blank2: " ",
        ratingPQ1: doc[0].CUAsmtDataPR1view2[i].ratingPQ1 || " ",
        ratingCQ: doc[0].CUAsmtDataPR1view2[i].ratingCQ || " ",
        targettosat: doc[0].CUAsmtDataPR1view2[i].targettosat || " ",
        reviewcomments: doc[0].CUAsmtDataPR1view2[i].reviewcomments || " "
      });
    }
    doc[0].exportProcessRatings2 = exportList;
    for(var category in catList){
      catList[category].percent = (catList[category].count/countryList[catList[category].parent].count*100).toFixed(0);
    }
    for(var country in countryList){
      countryList[country].percent = (countryList[country].count/doc[0].CUAsmtDataPR1view2.length*100).toFixed(0);
    }
    //Adding padding
    if (Object.keys(catList).length < defViewRow) {
      if (tmpRatingList.length == 0) {
        tmpRatingList = fieldCalc.addTestViewData(9,defViewRow);
      } else {
        fieldCalc.addTestViewDataPadding(tmpRatingList,9,(defViewRow-Object.keys(catList).length));
      }
    }
    doc[0].CUAsmtDataPR1view2 = tmpRatingList;
  }
}

module.exports = calculatePRTab;
