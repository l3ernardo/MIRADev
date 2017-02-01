/**************************************************************************************************
*
* MIRA Key Controls Testing Code
* Date: 25 January 2017
* By: genonms@ph.ibm.com
*
*/

var fieldCalc = require('./class-fieldcalc.js');

var calculateCUTab = {

  processCUTab: function(doc, defViewRow) {
    var catList = {};
  	var tmpAccountList = [];
  	var exportList = [];
    var totalmaxscore = 0;
    var totalcqscore = 0;
    var withmaxscore = false;
	  //tmpAccountList.push({id: "topCategory", counter: audits.length,percent:'100%',name: "Total"});
	  var objects = {};//object of objects for counting
    //categorization for
    for(var i = 0; i < doc[0].BUCAsmtDataCURview.length; i++){
      //to categorize sort
      switch (doc[0].BUCAsmtDataCURview[i].ratingcategory) {
        case "NR":
        doc[0].BUCAsmtDataCURview[i].ratingcategorysort = 1;
        break;
        case "Unsat &#9660;":
        doc[0].BUCAsmtDataCURview[i].ratingcategorysort = 2;
        break;
        case "Unsat &#61;":
        doc[0].BUCAsmtDataCURview[i].ratingcategorysort = 3;
       // doc[0].BUCAsmtDataCURview[i].ratingcategory = "Unsat";
        break;
        case "Marg &#9660;":
        doc[0].BUCAsmtDataCURview[i].ratingcategorysort = 4;
        break;
        case "Marg &#61;":
        doc[0].BUCAsmtDataCURview[i].ratingcategorysort = 5;
        //doc[0].BUCAsmtDataCURview[i].ratingcategory = "Marg";
        break;
        case "Marg &#9650;":
        doc[0].BUCAsmtDataCURview[i].ratingcategorysort = 6;
        break;
        case "Sat &#9650;":
        doc[0].BUCAsmtDataCURview[i].ratingcategorysort = 7;
        break;
        case "Sat &#61;":
        doc[0].BUCAsmtDataCURview[i].ratingcategorysort = 8;
        //doc[0].BUCAsmtDataCURview[i].ratingcategory = "Sat";
        break;
        case "Exempt;":
        doc[0].BUCAsmtDataCURview[i].ratingcategorysort = 9;
        break;
        default:
        doc[0].BUCAsmtDataCURview[i].ratingcategorysort = 10;
      }
      // For CU Weighted Score calculation
      if (doc[0].BUCAsmtDataCURview[i].maxscore !== undefined && doc[0].BUCAsmtDataCURview[i].maxscore !== "") {
        if (!isNaN(doc[0].BUCAsmtDataCURview[i].maxscore)) {
          totalmaxscore += parseInt(doc[0].BUCAsmtDataCURview[i].maxscore);
          withmaxscore = true;
        }
      }
      if (doc[0].BUCAsmtDataCURview[i].cqscore !== undefined && doc[0].BUCAsmtDataCURview[i].cqscore !== "") {
        if (!isNaN(doc[0].BUCAsmtDataCURview[i].cqscore)) {
          totalcqscore += parseInt(doc[0].BUCAsmtDataCURview[i].cqscore);
        }
      }
    }

    // CU Weighted Score calculation
    if (withmaxscore && totalmaxscore !== 0) {
      doc[0].WeightedCUScore = ((totalcqscore/totalmaxscore) * 100).toFixed(1)
    } else {
      doc[0].WeightedCUScore = 0;
    }


    doc[0].BUCAsmtDataCURview.sort(function(a, b){
      var nameA=a.ratingcategorysort, nameB=b.ratingcategorysort
      if (nameA > nameB) //sort string descending
      return -1
      if (nameA < nameB)
      return 1
      return 0 //default return value (no sorting)
    });
    //total level
    var topEntry = {
      id: "topEntry",
      category: "Total",
      percent: 100,
      count: 0 ,
      maxscore: 0,
      cqscore: 0,
      pqscore: 0
    };
    tmpAccountList.push(topEntry);
/*
    if (doc[0].MIRABusinessUnit == "GTS") {
      for(var i = 0; i < doc[0].BUCAsmtDataCURview.length; i++){
        if(doc[0].CRMProcessObj[asmtsdocs[i].GPWWBCITKey]){
          asmtsdocs[i].catP = "CRM";
          doc[0].asmtsdocsCRM.push(asmtsdocs[i])
        }else if(doc[0].DeliveryProcessObj[asmtsdocs[i].GPWWBCITKey]){
          asmtsdocs[i].catP = "Delivery";
          doc[0].asmtsdocsDelivery.push(asmtsdocs[i])
        }else {
          doc[0].asmtsdocs.pop();
          console.log("GP not found for CU rating asmt: "+ asmtsdocs[i].GPWWBCITKey);
        }
      }
    }*/
    //categorization for
    for(var i = 0; i < doc[0].BUCAsmtDataCURview.length; i++){
    	var category_aux, id_aux, parent_aux;
    	category_aux = fieldCalc.getRatingCategory(doc[0].BUCAsmtDataCURview[i].ratingCQ,doc[0].BUCAsmtDataCURview[i].ratingPQ1);
    	//console.log(category_aux+'  esto:'+doc[0].BUCAsmtDataCURview[i].catP);
    	switch (category_aux) {
        case "Unsat &#9660;":
        id_aux = 'Unsat1'; parent_aux='Unsat1';
        break;
        case "Unsat &#61;":
         id_aux = 'Unsat2'; parent_aux='Unsat2';
        break;
        case "Marg &#9660;":
         id_aux = 'Marg1'; parent_aux='Marg1';
        break;
        case "Marg &#61;":
        id_aux = 'Marg2'; parent_aux='Marg2';
        break;
        case "Marg &#9650;":
        id_aux = 'Marg3'; parent_aux='Marg3';
        break;
        case "Sat &#9650;":
        id_aux = 'Sat1'; parent_aux='Sat1';
        break;
        case "Sat &#61;":
        id_aux = 'Sat2'; parent_aux='Sat2';
        break;
      	default:
      	id_aux=category_aux;parent_aux=category_aux;
      }

      if(typeof catList[doc[0].BUCAsmtDataCURview[i].ratingcategory] === "undefined"){

        var tmp= {
          id: id_aux,
          parent: "topEntry",
          category:category_aux,
          count: 0 ,
		      maxscore: 0,
      	  cqscore: 0,
      	  pqscore: 0
        };
        tmpAccountList.push(tmp);
		    catList[doc[0].BUCAsmtDataCURview[i].ratingcategory] = tmp;
      }

      exportList.push({
        category:doc[0].BUCAsmtDataCURview[i].ratingcategory  || " ",
        name: doc[0].BUCAsmtDataCURview[i].name || " ",
        country:doc[0].BUCAsmtDataCURview[i].country || " ",
        process:doc[0].BUCAsmtDataCURview[i].process || " ",
        auditprogram:doc[0].BUCAsmtDataCURview[i].auditprogram || " ",
        ratingcategory:doc[0].BUCAsmtDataCURview[i].ratingcategory || " ",
        ratingCQ:doc[0].BUCAsmtDataCURview[i].ratingCQ || " ",
        ratingPQ1:doc[0].BUCAsmtDataCURview[i].ratingPQ1 || " ",
        targettosat:doc[0].BUCAsmtDataCURview[i].targettosat || " ",
        targettosatprev:doc[0].BUCAsmtDataCURview[i].targettosatprev || " ",
      	size:doc[0].BUCAsmtDataCURview[i].size || " ",
      	maxscore:doc[0].BUCAsmtDataCURview[i].maxscore || " ",
      	cqscore:doc[0].BUCAsmtDataCURview[i].cqscore || " ",
      	pqscore:doc[0].BUCAsmtDataCURview[i].pqscore || " ",
        reviewcomments:doc[0].BUCAsmtDataCURview[i].reviewcomments
      });

      catList[doc[0].BUCAsmtDataCURview[i].ratingcategory].count++;
      topEntry.count++;
      if(doc[0].BUCAsmtDataCURview[i].maxscore!=''){
        catList[doc[0].BUCAsmtDataCURview[i].ratingcategory].maxscore += parseInt(doc[0].BUCAsmtDataCURview[i].maxscore);
        topEntry.maxscore += parseInt(doc[0].BUCAsmtDataCURview[i].maxscore);
      }
      if(doc[0].BUCAsmtDataCURview[i].cqscore!=''){
         catList[doc[0].BUCAsmtDataCURview[i].ratingcategory].cqscore +=  parseInt(doc[0].BUCAsmtDataCURview[i].cqscore);
         topEntry.cqscore +=  parseInt(doc[0].BUCAsmtDataCURview[i].cqscore);
       }
	    if(doc[0].BUCAsmtDataCURview[i].pqscore!=''){
         catList[doc[0].BUCAsmtDataCURview[i].ratingcategory].pqscore +=  parseInt(doc[0].BUCAsmtDataCURview[i].pqscore);
         topEntry.pqscore+=  parseInt(doc[0].BUCAsmtDataCURview[i].pqscore);
       }
      doc[0].BUCAsmtDataCURview[i].id = doc[0].BUCAsmtDataCURview[i]["docid"];
      doc[0].BUCAsmtDataCURview[i].parent = parent_aux; //doc[0].BUCAsmtDataCURview[i].ratingcategory.replace(/ /g,'');
      //do counting for category
      //objects[doc[0].BUCAsmtDataCURview[i].parent].count++ ;
      tmpAccountList.push(doc[0].BUCAsmtDataCURview[i]);
    }

    for(var category in catList){
      catList[category].percent = (catList[category].count/doc[0].BUCAsmtDataCURview.length*100).toFixed(1);
    }
    //Adding padding
    if (Object.keys(catList).length < defViewRow) {
      if (tmpAccountList.length == 0) {
        tmpAccountList = fieldCalc.addTestViewData(9,defViewRow);
      } else {
        fieldCalc.addTestViewDataPadding(tmpAccountList,9,(defViewRow-Object.keys(catList).length));
      }
    }
	  doc[0].exportAccountRatings = exportList;
    doc[0].BUCAsmtDataCURview = tmpAccountList;
  }
}

module.exports = calculateCUTab;
