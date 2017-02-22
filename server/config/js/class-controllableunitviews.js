/**************************************************************************************************
*
* MIRA Key Controls Testing Code
* Date: 25 January 2017
* By: genonms@ph.ibm.com
*
*/

var fieldCalc = require('./class-fieldcalc.js');
var clone = require('clone');

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
	var objects = {};//object of objects for counting
	doc[0].BUCAsmtDataCURview2 =clone(doc[0].BUCAsmtDataCURview);
	//for BU IMT (CU by Country table)
	if(doc[0].ParentDocSubType=='BU IMT'){
	var catList2 = {};
  	var tmpAccountList2 = [];
  	var exportList2 = [];
    var totalmaxscore2 = 0;
    var totalcqscore2 = 0;
    var withmaxscore2 = false;
	var totalmaxscoreDel2 = 0;
    var totalcqscoreDel2 = 0;
	var withmaxscoreDel2 = false;
	var totalmaxscoreCrm2 = 0;
    var totalcqscoreCrm2 = 0;
	var withmaxscoreCrm2 = false;
    //categorization for
    for(var i = 0; i < doc[0].BUCAsmtDataCURview2.length; i++){
		var isDel2=0; var isCRM2=0; var CUType2;
    if(doc[0].MIRABusinessUnit == "GTS" ){ //just for GTS
   	  //Define if assessment is Del / CRM
	     for(j=0;j<doc[0].asmtsdocsDelivery.length;j++){
					if(doc[0].asmtsdocsDelivery[j]._id==doc[0].BUCAsmtDataCURview2[i].docid) {
      				    isDel2=1;
					    j=doc[0].asmtsdocsDelivery.length;
					}
				}
				if(isDel2==0){
							for(j=0;j<doc[0].asmtsdocsCRM.length;j++){
									if(doc[0].asmtsdocsCRM[j]._id==doc[0].BUCAsmtDataCURview2[i].docid) {
										isCRM2=1;
										j=doc[0].asmtsdocsCRM.length;
									}
							}
				}
				if(isDel2>'0')
				{
						if (doc[0].BUCAsmtDataCURview2[i].maxscore !== undefined && doc[0].BUCAsmtDataCURview2[i].maxscore !== "") {
								if (!isNaN(doc[0].BUCAsmtDataCURview2[i].maxscore)) {
									totalmaxscoreDel2 += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
									withmaxscoreDel2 = true;
								}
						}
						if (doc[0].BUCAsmtDataCURview2[i].cqscore !== undefined && doc[0].BUCAsmtDataCURview2[i].cqscore !== "") {
								if (!isNaN(doc[0].BUCAsmtDataCURview2[i].cqscore)) {
									totalcqscoreDel2 += parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
								}
						}
				}
				else if(isCRM2>'0')
				{
						if (doc[0].BUCAsmtDataCURview2[i].maxscore !== undefined && doc[0].BUCAsmtDataCURview2[i].maxscore !== "") {
							if (!isNaN(doc[0].BUCAsmtDataCURview2[i].maxscore)) {
								totalmaxscoreCrm2 += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
								withmaxscoreCrm2 = true;
							}
						}
						if (doc[0].BUCAsmtDataCURview2[i].cqscore !== undefined && doc[0].BUCAsmtDataCURview2[i].cqscore !== "") {
							if (!isNaN(doc[0].BUCAsmtDataCURview2[i].cqscore)) {
									totalcqscoreCrm2 += parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
							}
						}
				}
		}
	  //to categorize sort
      doc[0].BUCAsmtDataCURview2[i].ratingcategory = fieldCalc.getRatingCategory(doc[0].BUCAsmtDataCURview2[i].ratingCQ,doc[0].BUCAsmtDataCURview2[i].ratingPQ1);
      switch (doc[0].BUCAsmtDataCURview2[i].ratingcategory) {
        case "NR":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 1;
        break;
        case "Unsat &#9660;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 2;
        break;
        case "Unsat &#61;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 3;
       // doc[0].BUCAsmtDataCURview2[i].ratingcategory = "Unsat";
        break;
        case "Marg &#9660;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 4;
        break;
        case "Marg &#61;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 5;
        //doc[0].BUCAsmtDataCURview2[i].ratingcategory = "Marg";
        break;
        case "Marg &#9650;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 6;
        break;
        case "Sat &#9650;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 7;
        break;
        case "Sat &#61;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 8;
        //doc[0].BUCAsmtDataCURview2[i].ratingcategory = "Sat";
        break;
        case "Exempt;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 9;
        break;
        default:
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 10;
      }
    }
	 doc[0].BUCAsmtDataCURview2.sort(function(b, a){
      if (doc[0].MIRABusinessUnit == "GTS") {
	    var nameA=a.country, nameB=b.country
		if (nameA > nameB) //sort string descending
			return -1;
		if (nameA < nameB)
			return 1;
		var nameA=a.catP, nameB=b.catP
		if (nameA > nameB) //sort string descending
			return -1;
		if (nameA < nameB)
			return 1;
		else
			return 0; //default return value (no sorting)
    }
      var nameA=a.country, nameB=b.country
				if (nameA > nameB) //sort string descending
					return -1;
				if (nameA < nameB)
					return 1;
	var nameA=a.ratingcategorysort, nameB=b.ratingcategorysort
				if (nameA > nameB) //sort string descending
					return -1;
				if (nameA < nameB)
					return 1;
				else
					return 0; //default return value (no sorting)
    });
    //total level
    var topEntry2 = {
      id: "topEntry2",
      topName: "Total",
      percent: 100,
      count: 0 ,
      maxscore: 0,
      cqscore: 0,
      pqscore: 0
    };
    tmpAccountList2.push(topEntry2);

	//categorization for
    for(var i = 0; i < doc[0].BUCAsmtDataCURview2.length; i++){
	    var countryaux;
	    if(doc[0].BUCAsmtDataCURview2[i].country=="" ){
			countryaux='(Not Categorized)';
		}
		else
		{  countryaux=doc[0].BUCAsmtDataCURview2[i].country;}
    	var id_aux2, parent_aux2;
    	switch (doc[0].BUCAsmtDataCURview2[i].ratingcategory) {
        case "Unsat &#9660;":
        id_aux2 = 'Unsat1'; parent_aux2='Unsat1';
        break;
        case "Unsat &#61;":
         id_aux2 = 'Unsat2'; parent_aux2='Unsat2';
        break;
        case "Marg &#9660;":
         id_aux2 = 'Marg1'; parent_aux2='Marg1';
        break;
        case "Marg &#61;":
        id_aux2 = 'Marg2'; parent_aux2='Marg2';
        break;
        case "Marg &#9650;":
        id_aux2 = 'Marg3'; parent_aux2='Marg3';
        break;
        case "Sat &#9650;":
        id_aux2 = 'Sat1'; parent_aux2='Sat1';
        break;
        case "Sat &#61;":
        id_aux2 = 'Sat2'; parent_aux2='Sat2';
        break;
      	default:
      	id_aux2=doc[0].BUCAsmtDataCURview2[i].ratingcategory;parent_aux2=doc[0].BUCAsmtDataCURview2[i].ratingcategory;
      }

      if (doc[0].MIRABusinessUnit == "GTS") {
        if(typeof catList2[doc[0].BUCAsmtDataCURview2[i].country] === "undefined"){
          var tmp2= {
            id: countryaux.replace(/ /g,''),
            parent: "topEntry2",
			country: countryaux,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList2.push(tmp2);
  		  catList2[doc[0].BUCAsmtDataCURview2[i].country] = tmp2;
        }
		if(typeof catList2[doc[0].BUCAsmtDataCURview2[i].country.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP] === "undefined"){
          var tmp2= {
            id: countryaux.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP,
            parent: countryaux.replace(/ /g,''),
            categoryName: doc[0].BUCAsmtDataCURview2[i].catP,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList2.push(tmp2);
  		    catList2[doc[0].BUCAsmtDataCURview2[i].country.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP] = tmp2;
        }

        if(typeof catList2[doc[0].BUCAsmtDataCURview2[i].country.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory] === "undefined"){
          var tmp2= {
            id: countryaux.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory,
            parent: countryaux.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP,
            category2:doc[0].BUCAsmtDataCURview2[i].ratingcategory,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList2.push(tmp2);
  		    catList2[doc[0].BUCAsmtDataCURview2[i].country.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory] = tmp2;
        }
      }else{
		 if(typeof catList2[doc[0].BUCAsmtDataCURview2[i].country.replace(/ /g,'')] === "undefined"){

          var tmp2= {
            id: countryaux.replace(/ /g,''),
            parent: "topEntry2",
			country: countryaux,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList2.push(tmp2);
  		    catList2[doc[0].BUCAsmtDataCURview2[i].country] = tmp2;
        }
        if(typeof catList2[doc[0].BUCAsmtDataCURview2[i].country.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].ratingcategory] === "undefined"){

          var tmp2= {
            id: countryaux.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].ratingcategory,
            parent: countryaux.replace(/ /g,''),
            category2: doc[0].BUCAsmtDataCURview2[i].ratingcategory,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList2.push(tmp2);
  		    catList2[doc[0].BUCAsmtDataCURview2[i].country.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].ratingcategory] = tmp2;
        }
      }

      var exportTmp2 = {};
        exportTmp2.blank = " ";
        if (doc[0].MIRABusinessUnit == "GTS") {
          exportTmp2.catP = doc[0].BUCAsmtDataCURview2[i].catP  || " ";
        }
        exportTmp2.ratingcategory = doc[0].BUCAsmtDataCURview2[i].ratingcategory || " ";
        exportTmp2.name = doc[0].BUCAsmtDataCURview2[i].name || " ";
		exportTmp2.country = doc[0].BUCAsmtDataPRview2[i].country || " ",
        exportTmp2.count = doc[0].BUCAsmtDataCURview2[i].count || " ";
        exportTmp2.percent = doc[0].BUCAsmtDataCURview2[i].percent || " ";
        exportTmp2.ratingPQ1 = doc[0].BUCAsmtDataCURview2[i].ratingPQ1 || " ";
        exportTmp2.ratingCQ = doc[0].BUCAsmtDataCURview2[i].ratingCQ || " ";
        exportTmp2.targettosatprev = doc[0].BUCAsmtDataCURview2[i].targettosatprev || " ";
        exportTmp2.targettosat = doc[0].BUCAsmtDataCURview2[i].targettosat || " ";
        exportTmp2.size = doc[0].BUCAsmtDataCURview2[i].size || " ";
        exportTmp2.maxscore = doc[0].BUCAsmtDataCURview2[i].maxscore || " ";
        exportTmp2.cqscore = doc[0].BUCAsmtDataCURview2[i].cqscore || " ";
        exportTmp2.pqscore = doc[0].BUCAsmtDataCURview2[i].pqscore || " ";
        exportTmp2.reviewcomments = doc[0].BUCAsmtDataCURview2[i].reviewcomments || " ";
      exportList2.push(exportTmp2);
      if (doc[0].MIRABusinessUnit == "GTS") {
		catList2[doc[0].BUCAsmtDataCURview2[i].country].count++;
        catList2[doc[0].BUCAsmtDataCURview2[i].country+doc[0].BUCAsmtDataCURview2[i].catP].count++;
        catList2[doc[0].BUCAsmtDataCURview2[i].country+doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory].count++;
        if(doc[0].BUCAsmtDataCURview2[i].maxscore!=''){
          catList2[doc[0].BUCAsmtDataCURview2[i].country+doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory].maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
          topEntry2.maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore); //corregir
		  catList2[doc[0].BUCAsmtDataCURview2[i].country].maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
          catList2[doc[0].BUCAsmtDataCURview2[i].catP].maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
        }
        if(doc[0].BUCAsmtDataCURview2[i].cqscore!=''){
           catList2[doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory].cqscore +=  parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
           topEntry2.cqscore += parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
           catList2[doc[0].BUCAsmtDataCURview2[i].catP].cqscore += parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
         }
        if(doc[0].BUCAsmtDataCURview2[i].pqscore!=''){
           catList2[doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory].pqscore +=  parseInt(doc[0].BUCAsmtDataCURview2[i].pqscore);
           topEntry2.pqscore += parseInt(doc[0].BUCAsmtDataCURview2[i].pqscore);
           catList2[doc[0].BUCAsmtDataCURview2[i].catP].pqscore += parseInt(doc[0].BUCAsmtDataCURview2[i].pqscore);
         }
      }else{
		catList2[doc[0].BUCAsmtDataCURview2[i].country].count++;
        catList2[doc[0].BUCAsmtDataCURview2[i].country+doc[0].BUCAsmtDataCURview2[i].ratingcategory].count++;
        if(doc[0].BUCAsmtDataCURview2[i].maxscore!=''){
          catList2[doc[0].BUCAsmtDataCURview2[i].country+doc[0].BUCAsmtDataCURview2[i].ratingcategory].maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
          topEntry2.maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
		  catList2[doc[0].BUCAsmtDataCURview2[i].country].maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
        }
        if(doc[0].BUCAsmtDataCURview2[i].cqscore!=''){
           catList2[doc[0].BUCAsmtDataCURview2[i].country+doc[0].BUCAsmtDataCURview2[i].ratingcategory].cqscore +=  parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
           topEntry2.cqscore +=  parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
		   catList[doc[0].BUCAsmtDataCURview2[i].country].cqscore += parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
         }
        if(doc[0].BUCAsmtDataCURview2[i].pqscore!=''){
           catList2[doc[0].BUCAsmtDataCURview2[i].ratingcategory].pqscore +=  parseInt(doc[0].BUCAsmtDataCURview2[i].pqscore);
           topEntry2.pqscore+=  parseInt(doc[0].BUCAsmtDataCURview2[i].pqscore);
		   catList2[doc[0].BUCAsmtDataCURview2[i].country].pqscore += parseInt(doc[0].BUCAsmtDataCURview2[i].pqscore);
         }
      }
      topEntry2.count++;
      doc[0].BUCAsmtDataCURview2[i].id = doc[0].BUCAsmtDataCURview2[i]["docid"];

    if (doc[0].MIRABusinessUnit == "GTS") {
		    doc[0].BUCAsmtDataCURview2[i].parent=countryaux.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory;
	   }
	   else{
		   doc[0].BUCAsmtDataCURview2[i].parent=countryaux.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].ratingcategory;
	   }
      //do counting for category
      //objects[doc[0].BUCAsmtDataCURview2[i].parent].count++ ;
      tmpAccountList2.push(doc[0].BUCAsmtDataCURview2[i]);
    }
	 for(var category2 in catList2){
      catList2[category2].percent = (catList2[category2].count/doc[0].BUCAsmtDataCURview2.length*100).toFixed(0);
    }
    //Adding padding
    if (1 < defViewRow) {
      if (tmpAccountList2.length == 0) {
        tmpAccountList2 = fieldCalc.addTestViewData(15,defViewRow);
      } else {
        fieldCalc.addTestViewDataPadding(tmpAccountList2,15,(defViewRow-1));
      }
    }
	  doc[0].exportCURating2 = exportList2;
    doc[0].BUCAsmtDataCURview2 = tmpAccountList2;
}

	//for  BU IOT (CU by IMT table)
	if(doc[0].ParentDocSubType=='BU IOT'){
	var catList2 = {};
  	var tmpAccountList2 = [];
  	var exportList2 = [];
    var totalmaxscore2 = 0;
    var totalcqscore2 = 0;
    var withmaxscore2 = false;
	var totalmaxscoreDel2 = 0;
    var totalcqscoreDel2 = 0;
	var withmaxscoreDel2 = false;
	var totalmaxscoreCrm2 = 0;
    var totalcqscoreCrm2 = 0;
	var withmaxscoreCrm2 = false;
    //categorization for
    for(var i = 0; i < doc[0].BUCAsmtDataCURview2.length; i++){
		var isDel2=0; var isCRM2=0; var CUType2;
    if(doc[0].MIRABusinessUnit == "GTS" ){ //just for GTS
   	  //Define if assessment is Del / CRM
	     for(j=0;j<doc[0].asmtsdocsDelivery.length;j++){
					if(doc[0].asmtsdocsDelivery[j]._id==doc[0].BUCAsmtDataCURview2[i].docid) {
      				    isDel2=1;
					    j=doc[0].asmtsdocsDelivery.length;
					}
				}
				if(isDel2==0){
							for(j=0;j<doc[0].asmtsdocsCRM.length;j++){
									if(doc[0].asmtsdocsCRM[j]._id==doc[0].BUCAsmtDataCURview2[i].docid) {
										isCRM2=1;
										j=doc[0].asmtsdocsCRM.length;
									}
							}
				}
				if(isDel2>'0')
				{
						if (doc[0].BUCAsmtDataCURview2[i].maxscore !== undefined && doc[0].BUCAsmtDataCURview2[i].maxscore !== "") {
								if (!isNaN(doc[0].BUCAsmtDataCURview2[i].maxscore)) {
									totalmaxscoreDel2 += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
									withmaxscoreDel2 = true;
								}
						}
						if (doc[0].BUCAsmtDataCURview2[i].cqscore !== undefined && doc[0].BUCAsmtDataCURview2[i].cqscore !== "") {
								if (!isNaN(doc[0].BUCAsmtDataCURview2[i].cqscore)) {
									totalcqscoreDel2 += parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
								}
						}
				}
				else if(isCRM2>'0')
				{
						if (doc[0].BUCAsmtDataCURview2[i].maxscore !== undefined && doc[0].BUCAsmtDataCURview2[i].maxscore !== "") {
							if (!isNaN(doc[0].BUCAsmtDataCURview2[i].maxscore)) {
								totalmaxscoreCrm2 += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
								withmaxscoreCrm2 = true;
							}
						}
						if (doc[0].BUCAsmtDataCURview2[i].cqscore !== undefined && doc[0].BUCAsmtDataCURview2[i].cqscore !== "") {
							if (!isNaN(doc[0].BUCAsmtDataCURview2[i].cqscore)) {
									totalcqscoreCrm2 += parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
							}
						}
				}
		}
	  //to categorize sort
      doc[0].BUCAsmtDataCURview2[i].ratingcategory = fieldCalc.getRatingCategory(doc[0].BUCAsmtDataCURview2[i].ratingCQ,doc[0].BUCAsmtDataCURview2[i].ratingPQ1);
      switch (doc[0].BUCAsmtDataCURview2[i].ratingcategory) {
        case "NR":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 1;
        break;
        case "Unsat &#9660;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 2;
        break;
        case "Unsat &#61;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 3;
       // doc[0].BUCAsmtDataCURview2[i].ratingcategory = "Unsat";
        break;
        case "Marg &#9660;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 4;
        break;
        case "Marg &#61;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 5;
        //doc[0].BUCAsmtDataCURview2[i].ratingcategory = "Marg";
        break;
        case "Marg &#9650;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 6;
        break;
        case "Sat &#9650;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 7;
        break;
        case "Sat &#61;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 8;
        //doc[0].BUCAsmtDataCURview2[i].ratingcategory = "Sat";
        break;
        case "Exempt;":
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 9;
        break;
        default:
        doc[0].BUCAsmtDataCURview2[i].ratingcategorysort = 10;
      }
    }

	 doc[0].BUCAsmtDataCURview2.sort(function(b, a){
      if (doc[0].MIRABusinessUnit == "GTS") {
	    var nameA=a.imt, nameB=b.imt
		if (nameA > nameB) //sort string descending
			return -1;
		if (nameA < nameB)
			return 1;
		var nameA=a.catP, nameB=b.catP
		if (nameA > nameB) //sort string descending
			return -1;
		if (nameA < nameB)
			return 1;
		else
			return 0; //default return value (no sorting)
    }
      var nameA=a.imt, nameB=b.imt
				if (nameA > nameB) //sort string descending
					return -1;
				if (nameA < nameB)
					return 1;
	var nameA=a.ratingcategorysort, nameB=b.ratingcategorysort
				if (nameA > nameB) //sort string descending
					return -1;
				if (nameA < nameB)
					return 1;
				else
					return 0; //default return value (no sorting)
    });
    //total level
    var topEntry2 = {
      id: "topEntry2",
      topName: "Total",
      percent: 100,
      count: 0 ,
      maxscore: 0,
      cqscore: 0,
      pqscore: 0
    };
    tmpAccountList2.push(topEntry2);

	//categorization for
    for(var i = 0; i < doc[0].BUCAsmtDataCURview2.length; i++){
	    var countryaux;
	    if(doc[0].BUCAsmtDataCURview2[i].imt=="" ){
			countryaux='(Not Categorized)';
		}
		else
		{  countryaux=doc[0].BUCAsmtDataCURview2[i].imt;}
    	var id_aux2, parent_aux2;
    	switch (doc[0].BUCAsmtDataCURview2[i].ratingcategory) {
        case "Unsat &#9660;":
        id_aux2 = 'Unsat1'; parent_aux2='Unsat1';
        break;
        case "Unsat &#61;":
         id_aux2 = 'Unsat2'; parent_aux2='Unsat2';
        break;
        case "Marg &#9660;":
         id_aux2 = 'Marg1'; parent_aux2='Marg1';
        break;
        case "Marg &#61;":
        id_aux2 = 'Marg2'; parent_aux2='Marg2';
        break;
        case "Marg &#9650;":
        id_aux2 = 'Marg3'; parent_aux2='Marg3';
        break;
        case "Sat &#9650;":
        id_aux2 = 'Sat1'; parent_aux2='Sat1';
        break;
        case "Sat &#61;":
        id_aux2 = 'Sat2'; parent_aux2='Sat2';
        break;
      	default:
      	id_aux2=doc[0].BUCAsmtDataCURview2[i].ratingcategory;parent_aux2=doc[0].BUCAsmtDataCURview2[i].ratingcategory;
      }

	  if (doc[0].MIRABusinessUnit == "GTS") {
        if(typeof catList2[doc[0].BUCAsmtDataCURview2[i].imt] === "undefined"){
          var tmp2= {
            id: countryaux.replace(/ /g,''),
            parent: "topEntry2",
			imt: countryaux,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList2.push(tmp2);
  		  catList2[doc[0].BUCAsmtDataCURview2[i].imt] = tmp2;
        }
		if(typeof catList2[doc[0].BUCAsmtDataCURview2[i].imt.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP] === "undefined"){
          var tmp2= {
            id: countryaux.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP,
            parent: countryaux.replace(/ /g,''),
            categoryName: doc[0].BUCAsmtDataCURview2[i].catP,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList2.push(tmp2);
  		    catList2[doc[0].BUCAsmtDataCURview2[i].imt.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP] = tmp2;
        }

        if(typeof catList2[doc[0].BUCAsmtDataCURview2[i].imt.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory] === "undefined"){
          var tmp2= {
            id: countryaux.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory,
            parent: countryaux.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP,
            category2:doc[0].BUCAsmtDataCURview2[i].ratingcategory,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList2.push(tmp2);
  		    catList2[doc[0].BUCAsmtDataCURview2[i].imt.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory] = tmp2;
        }
      }else{
		 if(typeof catList2[doc[0].BUCAsmtDataCURview2[i].imt.replace(/ /g,'')] === "undefined"){

          var tmp2= {
            id: countryaux.replace(/ /g,''),
            parent: "topEntry2",
			imt: countryaux,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList2.push(tmp2);
  		    catList2[doc[0].BUCAsmtDataCURview2[i].imt] = tmp2;
        }
        if(typeof catList2[doc[0].BUCAsmtDataCURview2[i].imt.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].ratingcategory] === "undefined"){

          var tmp2= {
            id: countryaux.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].ratingcategory,
            parent: countryaux.replace(/ /g,''),
            category2: doc[0].BUCAsmtDataCURview2[i].ratingcategory,
            count: 0 ,
  		      maxscore: 0,
        	  cqscore: 0,
        	  pqscore: 0
          };
          tmpAccountList2.push(tmp2);
  		    catList2[doc[0].BUCAsmtDataCURview2[i].imt.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].ratingcategory] = tmp2;
        }
      }

      var exportTmp2 = {};
        exportTmp2.blank = " ";
        if (doc[0].MIRABusinessUnit == "GTS") {
          exportTmp2.catP = doc[0].BUCAsmtDataCURview2[i].catP  || " ";
        }
        exportTmp2.ratingcategory = doc[0].BUCAsmtDataCURview2[i].ratingcategory || " ";
        exportTmp2.name = doc[0].BUCAsmtDataCURview2[i].name || " ";
		exportTmp2.imt = doc[0].BUCAsmtDataPRview2[i].imt || " ",
        exportTmp2.count = doc[0].BUCAsmtDataCURview2[i].count || " ";
        exportTmp2.percent = doc[0].BUCAsmtDataCURview2[i].percent || " ";
        exportTmp2.ratingPQ1 = doc[0].BUCAsmtDataCURview2[i].ratingPQ1 || " ";
        exportTmp2.ratingCQ = doc[0].BUCAsmtDataCURview2[i].ratingCQ || " ";
        exportTmp2.targettosatprev = doc[0].BUCAsmtDataCURview2[i].targettosatprev || " ";
        exportTmp2.targettosat = doc[0].BUCAsmtDataCURview2[i].targettosat || " ";
        exportTmp2.size = doc[0].BUCAsmtDataCURview2[i].size || " ";
        exportTmp2.maxscore = doc[0].BUCAsmtDataCURview2[i].maxscore || " ";
        exportTmp2.cqscore = doc[0].BUCAsmtDataCURview2[i].cqscore || " ";
        exportTmp2.pqscore = doc[0].BUCAsmtDataCURview2[i].pqscore || " ";
        exportTmp2.reviewcomments = doc[0].BUCAsmtDataCURview2[i].reviewcomments || " ";
      exportList2.push(exportTmp2);
      if (doc[0].MIRABusinessUnit == "GTS") {
		catList2[doc[0].BUCAsmtDataCURview2[i].imt].count++;
        catList2[doc[0].BUCAsmtDataCURview2[i].imt+doc[0].BUCAsmtDataCURview2[i].catP].count++;
        catList2[doc[0].BUCAsmtDataCURview2[i].imt+doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory].count++;
        if(doc[0].BUCAsmtDataCURview2[i].maxscore!=''){
          catList2[doc[0].BUCAsmtDataCURview2[i].imt+doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory].maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
          topEntry2.maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore); //corregir
		  catList2[doc[0].BUCAsmtDataCURview2[i].imt].maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
          catList2[doc[0].BUCAsmtDataCURview2[i].catP].maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
        }
        if(doc[0].BUCAsmtDataCURview2[i].cqscore!=''){
           catList2[doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory].cqscore +=  parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
           topEntry2.cqscore += parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
           catList2[doc[0].BUCAsmtDataCURview2[i].catP].cqscore += parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
         }
        if(doc[0].BUCAsmtDataCURview2[i].pqscore!=''){
           catList2[doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory].pqscore +=  parseInt(doc[0].BUCAsmtDataCURview2[i].pqscore);
           topEntry2.pqscore += parseInt(doc[0].BUCAsmtDataCURview2[i].pqscore);
           catList2[doc[0].BUCAsmtDataCURview2[i].catP].pqscore += parseInt(doc[0].BUCAsmtDataCURview2[i].pqscore);
         }
      }else{
		catList2[doc[0].BUCAsmtDataCURview2[i].imt].count++;
        catList2[doc[0].BUCAsmtDataCURview2[i].imt+doc[0].BUCAsmtDataCURview2[i].ratingcategory].count++;
        if(doc[0].BUCAsmtDataCURview2[i].maxscore!=''){
          catList2[doc[0].BUCAsmtDataCURview2[i].imt+doc[0].BUCAsmtDataCURview2[i].ratingcategory].maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
          topEntry2.maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
		  catList2[doc[0].BUCAsmtDataCURview2[i].imt].maxscore += parseInt(doc[0].BUCAsmtDataCURview2[i].maxscore);
        }
        if(doc[0].BUCAsmtDataCURview2[i].cqscore!=''){
           catList2[doc[0].BUCAsmtDataCURview2[i].imt+doc[0].BUCAsmtDataCURview2[i].ratingcategory].cqscore +=  parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
           topEntry2.cqscore +=  parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
		   catList[doc[0].BUCAsmtDataCURview2[i].imt].cqscore += parseInt(doc[0].BUCAsmtDataCURview2[i].cqscore);
         }
        if(doc[0].BUCAsmtDataCURview2[i].pqscore!=''){
           catList2[doc[0].BUCAsmtDataCURview2[i].ratingcategory].pqscore +=  parseInt(doc[0].BUCAsmtDataCURview2[i].pqscore);
           topEntry2.pqscore+=  parseInt(doc[0].BUCAsmtDataCURview2[i].pqscore);
		   catList2[doc[0].BUCAsmtDataCURview2[i].imt].pqscore += parseInt(doc[0].BUCAsmtDataCURview2[i].pqscore);
         }
      }
      topEntry2.count++;
      doc[0].BUCAsmtDataCURview2[i].id = doc[0].BUCAsmtDataCURview2[i]["docid"];

      if (doc[0].MIRABusinessUnit == "GTS") {
		    doc[0].BUCAsmtDataCURview2[i].parent=countryaux.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].catP+doc[0].BUCAsmtDataCURview2[i].ratingcategory;
	   }
	   else{
		   doc[0].BUCAsmtDataCURview2[i].parent=countryaux.replace(/ /g,'')+doc[0].BUCAsmtDataCURview2[i].ratingcategory;
	   }
      //do counting for category
      //objects[doc[0].BUCAsmtDataCURview2[i].parent].count++ ;
      tmpAccountList2.push(doc[0].BUCAsmtDataCURview2[i]);
    }
	 for(var category2 in catList2){
      catList2[category2].percent = (catList2[category2].count/doc[0].BUCAsmtDataCURview2.length*100).toFixed(0);
    }
    //Adding padding
    if (1 < defViewRow) {
      if (tmpAccountList2.length == 0) {
        tmpAccountList2 = fieldCalc.addTestViewData(15,defViewRow);
      } else {
        fieldCalc.addTestViewDataPadding(tmpAccountList2,15,(defViewRow-1));
      }
    }
	  doc[0].exportCURating2 = exportList2;
    doc[0].BUCAsmtDataCURview2 = tmpAccountList2;
}

    //for BU Country, BU IMT, BU IOT (CU  by rating table)
    //categorization for
    for(var i = 0; i < doc[0].BUCAsmtDataCURview.length; i++){
		var isDel=0; var isCRM=0; var CUType;
    if(doc[0].MIRABusinessUnit == "GTS"){ //just for GTS
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

    doc[0].BUCAsmtDataCURview.sort(function(b, a){
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
            id: doc[0].BUCAsmtDataCURview[i].catP+doc[0].BUCAsmtDataCURview[i].ratingcategory,
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
      }
	  else{
        catList[doc[0].BUCAsmtDataCURview[i].ratingcategory].count++;
        if(doc[0].BUCAsmtDataCURview[i].maxscore!=''){
          catList[doc[0].BUCAsmtDataCURview[i].ratingcategory].maxscore += parseInt(doc[0].BUCAsmtDataCURview[i].maxscore);
          topEntry.maxscore += parseInt(doc[0].BUCAsmtDataCURview[i].maxscore);
        }
        if(doc[0].BUCAsmtDataCURview[i].cqscore!=''){
           catList[doc[0].BUCAsmtDataCURview[i].ratingcategory].cqscore +=  parseInt(doc[0].BUCAsmtDataCURview[i].cqscore);
           topEntry.cqscore +=  parseInt(doc[0].BUCAsmtDataCURview[i].cqscore);
		   //topEntry.cqscore = topEntry.cqscore.toFixed(1);
         }
        if(doc[0].BUCAsmtDataCURview[i].pqscore!=''){
           catList[doc[0].BUCAsmtDataCURview[i].ratingcategory].pqscore +=  parseInt(doc[0].BUCAsmtDataCURview[i].pqscore);
           topEntry.pqscore+=  parseInt(doc[0].BUCAsmtDataCURview[i].pqscore);
		   //topEntry.pqscore = topEntry.pqscore.toFixed(1);
         }
      }
      topEntry.count++;
      doc[0].BUCAsmtDataCURview[i].id = doc[0].BUCAsmtDataCURview[i]["docid"];
      if (doc[0].MIRABusinessUnit == "GTS") {
		    doc[0].BUCAsmtDataCURview[i].parent=doc[0].BUCAsmtDataCURview[i].catP+doc[0].BUCAsmtDataCURview[i].ratingcategory;
	   }
	   else{
		    doc[0].BUCAsmtDataCURview[i].parent = parent_aux; //doc[0].BUCAsmtDataCURview[i].ratingcategory.replace(/ /g,'');
	   }
      //do counting for category
      tmpAccountList.push(doc[0].BUCAsmtDataCURview[i]);
    }

    for(var category in catList){
      catList[category].percent = (catList[category].count/doc[0].BUCAsmtDataCURview.length*100).toFixed(0);
      catList[category].cqscore = catList[category].cqscore.toFixed(1);
    }

	/*for(var cqscore in catList){
    catList[category].cqscore = catList[category].cqscore.toFixed(1);
  }*/

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
