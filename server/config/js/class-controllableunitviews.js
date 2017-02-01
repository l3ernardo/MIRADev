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
	var totalmaxscoreDel = 0;
    var totalcqscoreDel = 0;
	var withmaxscoreDel = false;
	var totalmaxscoreCrm = 0;
    var totalcqscoreCrm = 0;
	var withmaxscoreCrm = false;
	  //tmpAccountList.push({id: "topCategory", counter: audits.length,percent:'100%',name: "Total"});
	  var objects = {};//object of objects for counting
    //categorization for
    for(var i = 0; i < doc[0].BUCAsmtDataCURview.length; i++){
		var isDel=0; var isCRM=0; var CUType;
		if(doc[0].MIRABusinessUnit == "GTS"){//just for GTS
   	  //Define if assessment is Del / CRM
	     for(j=0;j<doc[0].asmtsdocsDelivery.length;j++){
					if(doc[0].asmtsdocsDelivery[j]._id==doc[0].BUCAsmtDataCURview[i].docid) {
      				    isDel=1;
					    j=doc[0].asmtsdocsDelivery.length;
					}
				}
				if(isDel==0){
							for(j=0;j<doc[0].asmtsdocsCRM.length;j++){
									if(doc[0].asmtsdocsCRM[j]._id==doc[0].BUCAsmtDataCURview[i].docid) {
										isCRM=1;
										j=doc[0].asmtsdocsCRM.length;
									}
							}
				}
				if(isDel>'0')
				{
						if (doc[0].BUCAsmtDataCURview[i].maxscore !== undefined && doc[0].BUCAsmtDataCURview[i].maxscore !== "") {
								if (!isNaN(doc[0].BUCAsmtDataCURview[i].maxscore)) {
									totalmaxscoreDel += parseInt(doc[0].BUCAsmtDataCURview[i].maxscore);
									withmaxscoreDel = true;
								}
						}
						if (doc[0].BUCAsmtDataCURview[i].cqscore !== undefined && doc[0].BUCAsmtDataCURview[i].cqscore !== "") {
								if (!isNaN(doc[0].BUCAsmtDataCURview[i].cqscore)) {
									totalcqscoreDel += parseInt(doc[0].BUCAsmtDataCURview[i].cqscore);
								}
						}
				}
				else if(isCRM>'0')
				{
						if (doc[0].BUCAsmtDataCURview[i].maxscore !== undefined && doc[0].BUCAsmtDataCURview[i].maxscore !== "") {
							if (!isNaN(doc[0].BUCAsmtDataCURview[i].maxscore)) {
								totalmaxscoreCrm += parseInt(doc[0].BUCAsmtDataCURview[i].maxscore);
								withmaxscoreCrm = true;
							}
						}
						if (doc[0].BUCAsmtDataCURview[i].cqscore !== undefined && doc[0].BUCAsmtDataCURview[i].cqscore !== "") {
							if (!isNaN(doc[0].BUCAsmtDataCURview[i].cqscore)) {
									totalcqscoreCrm += parseInt(doc[0].BUCAsmtDataCURview[i].cqscore);
							}
						}
				}
		}
      //to categorize sort
      doc[0].BUCAsmtDataCURview[i].ratingcategory = fieldCalc.getRatingCategory(doc[0].BUCAsmtDataCURview[i].ratingCQ,doc[0].BUCAsmtDataCURview[i].ratingPQ1);
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

    if(doc[0].MIRABusinessUnit == "GTS"){ //just for GTS
			// CU - Del Weighted Score calculation
				if (withmaxscoreDel && totalmaxscoreDel !== 0) {
						doc[0].WeightedCUScoreSOD = ((totalcqscoreDel/totalmaxscoreDel) * 100).toFixed(1)
				} else {
						doc[0].WeightedCUScoreSOD = 0;
				}
			// CU - CRM Weighted Score calculation
				if (withmaxscoreCrm && totalmaxscoreCrm !== 0) {
						doc[0].WeightedCUScoreCRM = ((totalcqscoreCrm/totalmaxscoreCrm) * 100).toFixed(1)
				} else {
							doc[0].WeightedCUScoreCRM = 0;
				}
	}

    doc[0].BUCAsmtDataCURview.sort(function(a, b){
      if (doc[0].MIRABusinessUnit == "GTS") {
        var nameA=a.catP, nameB=b.catP
        if (nameA > nameB) //sort string descending
        return -1
        if (nameA < nameB)
        return 1
      }
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
      topName: "Total",
      percent: 100,
      count: 0 ,
      maxscore: 0,
      cqscore: 0,
      pqscore: 0
    };
    tmpAccountList.push(topEntry);
    //categorization for
    for(var i = 0; i < doc[0].BUCAsmtDataCURview.length; i++){
    	var id_aux, parent_aux;
    	//console.log(category_aux+'  esto:'+doc[0].BUCAsmtDataCURview[i].catP);
    	switch (doc[0].BUCAsmtDataCURview[i].ratingcategory) {
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
      	id_aux=doc[0].BUCAsmtDataCURview[i].ratingcategory;parent_aux=doc[0].BUCAsmtDataCURview[i].ratingcategory;
      }

      if (doc[0].MIRABusinessUnit == "GTS") {
        if(typeof catList[doc[0].BUCAsmtDataCURview[i].catP] === "undefined"){

          var tmp= {
            id: doc[0].BUCAsmtDataCURview[i].catP,
            parent: "topEntry",
            categoryName: doc[0].BUCAsmtDataCURview[i].catP,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList.push(tmp);
  		    catList[doc[0].BUCAsmtDataCURview[i].catP] = tmp;
        }
        if(typeof catList[doc[0].BUCAsmtDataCURview[i].catP+doc[0].BUCAsmtDataCURview[i].ratingcategory] === "undefined"){

          var tmp= {
            id: id_aux,
            parent: doc[0].BUCAsmtDataCURview[i].catP,
            category:doc[0].BUCAsmtDataCURview[i].ratingcategory,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList.push(tmp);
  		    catList[doc[0].BUCAsmtDataCURview[i].catP+doc[0].BUCAsmtDataCURview[i].ratingcategory] = tmp;
        }
      }else{
        if(typeof catList[doc[0].BUCAsmtDataCURview[i].ratingcategory] === "undefined"){

          var tmp= {
            id: id_aux,
            parent: "topEntry",
            category:doc[0].BUCAsmtDataCURview[i].ratingcategory,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList.push(tmp);
  		    catList[doc[0].BUCAsmtDataCURview[i].ratingcategory] = tmp;
        }
      }
      var exportTmp = {};
        exportTmp.blank = " ";
        if (doc[0].MIRABusinessUnit == "GTS") {
          exportTmp.catP = doc[0].BUCAsmtDataCURview[i].catP  || " ";
        }
        exportTmp.ratingcategory = doc[0].BUCAsmtDataCURview[i].ratingcategory || " ";
        exportTmp.name = doc[0].BUCAsmtDataCURview[i].name || " ";
        exportTmp.count = doc[0].BUCAsmtDataCURview[i].count || " ";
        exportTmp.percent = doc[0].BUCAsmtDataCURview[i].percent || " ";
        exportTmp.ratingPQ1 = doc[0].BUCAsmtDataCURview[i].ratingPQ1 || " ";
        exportTmp.ratingCQ = doc[0].BUCAsmtDataCURview[i].ratingCQ || " ";
        exportTmp.targettosatprev = doc[0].BUCAsmtDataCURview[i].targettosatprev || " ";
        exportTmp.targettosat = doc[0].BUCAsmtDataCURview[i].targettosat || " ";
        exportTmp.size = doc[0].BUCAsmtDataCURview[i].size || " ";
        exportTmp.maxscore = doc[0].BUCAsmtDataCURview[i].maxscore || " ";
        exportTmp.cqscore = doc[0].BUCAsmtDataCURview[i].cqscore || " ";
        exportTmp.pqscore = doc[0].BUCAsmtDataCURview[i].pqscore || " ";
        exportTmp.reviewcomments = doc[0].BUCAsmtDataCURview[i].reviewcomments || " ";
      exportList.push(exportTmp);
      if (doc[0].MIRABusinessUnit == "GTS") {
        catList[doc[0].BUCAsmtDataCURview[i].catP].count++;
        catList[doc[0].BUCAsmtDataCURview[i].catP+doc[0].BUCAsmtDataCURview[i].ratingcategory].count++;
        if(doc[0].BUCAsmtDataCURview[i].maxscore!=''){
          catList[doc[0].BUCAsmtDataCURview[i].catP+doc[0].BUCAsmtDataCURview[i].ratingcategory].maxscore += parseInt(doc[0].BUCAsmtDataCURview[i].maxscore);
          topEntry.maxscore += parseInt(doc[0].BUCAsmtDataCURview[i].maxscore);
          catList[doc[0].BUCAsmtDataCURview[i].catP].maxscore += parseInt(doc[0].BUCAsmtDataCURview[i].maxscore);
        }
        if(doc[0].BUCAsmtDataCURview[i].cqscore!=''){
           catList[doc[0].BUCAsmtDataCURview[i].catP+doc[0].BUCAsmtDataCURview[i].ratingcategory].cqscore +=  parseInt(doc[0].BUCAsmtDataCURview[i].cqscore);
           topEntry.cqscore += parseInt(doc[0].BUCAsmtDataCURview[i].cqscore);
           catList[doc[0].BUCAsmtDataCURview[i].catP].cqscore += parseInt(doc[0].BUCAsmtDataCURview[i].cqscore);
         }
        if(doc[0].BUCAsmtDataCURview[i].pqscore!=''){
           catList[doc[0].BUCAsmtDataCURview[i].catP+doc[0].BUCAsmtDataCURview[i].ratingcategory].pqscore +=  parseInt(doc[0].BUCAsmtDataCURview[i].pqscore);
           topEntry.pqscore += parseInt(doc[0].BUCAsmtDataCURview[i].pqscore);
           catList[doc[0].BUCAsmtDataCURview[i].catP].pqscore += parseInt(doc[0].BUCAsmtDataCURview[i].pqscore);
         }
      }else{
        catList[doc[0].BUCAsmtDataCURview[i].ratingcategory].count++;
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
      }
      topEntry.count++;
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
    if (1 < defViewRow) {
      if (tmpAccountList.length == 0) {
        tmpAccountList = fieldCalc.addTestViewData(9,defViewRow);
      } else {
        fieldCalc.addTestViewDataPadding(tmpAccountList,9,(defViewRow-1));
      }
    }
	  doc[0].exportCURating = exportList;
    doc[0].BUCAsmtDataCURview = tmpAccountList;
  }
}

module.exports = calculateCUTab;
