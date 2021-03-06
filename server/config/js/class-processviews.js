/**************************************************************************************************
*
* MIRA Key Controls Testing Code
* Date: 25 January 2017
* By: genonms@ph.ibm.com
*
*/

var fieldCalc = require('./class-fieldcalc.js');
var clone = require('clone');

var calculatePRTab = {

	processProTab: function(doc, defViewRow) {
		try{
			var catList = {};
			var tmpAccountList = [];
			var exportList = [];
			doc[0].BUCAsmtDataPRview2 = clone(doc[0].BUCAsmtDataPRview);
			doc[0].CPAsmtDataPR1view2 = clone(doc[0].CPAsmtDataPR1view);

			//for BU IMT (Process by Country table)
			if(doc[0].ParentDocSubType=='BU IMT'){
			var catList2 = {};
			var tmpAccountList2 = [];
			var exportList2 = [];
			//table categorized by country
			for(var j = 0; j < doc[0].BUCAsmtDataPRview2.length; j++){
				doc[0].BUCAsmtDataPRview2[j].ratingcategory = fieldCalc.getRatingCategory(doc[0].BUCAsmtDataPRview2[j].ratingCQ, doc[0].BUCAsmtDataPRview2[j].ratingPQ1);
				//to categorize sort
				switch (doc[0].BUCAsmtDataPRview2[j].ratingcategory) {
					case "NR":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 1;
					break;
					case "Unsat &#9660;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 2;
					break;
					case "Unsat &#61;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 3;
					//doc[0].BUCAsmtDataPRview2[i].ratingcategory = "Unsat";
					break;
					case "Marg &#9660;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 4;
					break;
					case "Marg &#61;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 5;
					//doc[0].BUCAsmtDataPRview2[i].ratingcategory = "Marg";
					break;
					case "Marg &#9650;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 6;
					break;
					case "Sat &#9650;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 7;
					break;
					case "Sat &#61;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 8;
					//doc[0].BUCAsmtDataPRview2[i].ratingcategory = "Sat";
					break;
					case "Exempt;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 9;
					break;
					default:
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 10;
				}
			}
			doc[0].BUCAsmtDataPRview2.sort(function(b, a){
				var nameA=a.country, nameB=b.country
				if (nameA > nameB) //sort string ascending
					return -1;
				if (nameA < nameB)
					return 1;
				var nameA=a.ratingcategorysort, nameB=b.ratingcategorysort
				if (nameA > nameB) //sort string ascending
					return -1;
				if (nameA < nameB)
					return 1;
				else
					return 0; //default return value (no sorting)
			});
			var topEntriesCount2= 0;
			for(var j = 0; j < doc[0].BUCAsmtDataPRview2.length; j++){
				var id_aux2; var parent_aux2;
				//category_aux = fieldCalc.getRatingCategory(doc[0].BUCAsmtDataPRview[i].ratingCQ,doc[0].BUCAsmtDataPRview[i].ratingPQ1);
				switch (doc[0].BUCAsmtDataPRview2[j].ratingcategory) {
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
						id_aux2=doc[0].BUCAsmtDataPRview2[j].ratingcategory;parent_aux2=doc[0].BUCAsmtDataPRview2[j].ratingcategory;
				}

				if(typeof catList2[doc[0].BUCAsmtDataPRview2[j].country.replace(/ /g,'')] === "undefined"){
					topEntriesCount2++;
					var tmp2 = {
						id: doc[0].BUCAsmtDataPRview2[j].country.replace(/ /g,''),
						country: doc[0].BUCAsmtDataPRview2[j].country,
						count: 0,
						percent: 0,
						top: true,
						MetricsValue: 0
					}
					tmpAccountList2.push(tmp2);
					catList2[doc[0].BUCAsmtDataPRview2[j].country.replace(/ /g,'')] = tmp2;
				}
				if(typeof catList2[doc[0].BUCAsmtDataPRview2[j].country.replace(/ /g,'')+doc[0].BUCAsmtDataPRview2[j].ratingcategory.replace(/ /g,'')] === "undefined"){
					var tmp2= {
						id: doc[0].BUCAsmtDataPRview2[j].country.replace(/ /g,'')+id_aux2,
						parent: doc[0].BUCAsmtDataPRview2[j].country.replace(/ /g,''),
						category: doc[0].BUCAsmtDataPRview2[j].ratingcategory,
						count: 0
					}
					tmpAccountList2.push(tmp2);
					catList2[doc[0].BUCAsmtDataPRview2[j].country.replace(/ /g,'')+doc[0].BUCAsmtDataPRview2[j].ratingcategory.replace(/ /g,'')] = tmp2;
				}
				catList2[doc[0].BUCAsmtDataPRview2[j].country.replace(/ /g,'')].count++;
				catList2[doc[0].BUCAsmtDataPRview2[j].country.replace(/ /g,'')+doc[0].BUCAsmtDataPRview2[j].ratingcategory.replace(/ /g,'')].count++;
				doc[0].BUCAsmtDataPRview2[j].id = doc[0].BUCAsmtDataPRview2[j]["docid"];
				doc[0].BUCAsmtDataPRview2[j].parent =doc[0].BUCAsmtDataPRview2[j].country.replace(/ /g,'')+id_aux2;//
				tmpAccountList2.push(doc[0].BUCAsmtDataPRview2[j]);
				exportList2.push({
					country:doc[0].BUCAsmtDataPRview2[j].country || " ",
					category:doc[0].BUCAsmtDataPRview2[j].ratingcategory  || " ",
					name: doc[0].BUCAsmtDataPRview2[j].name || " ",
					process:doc[0].BUCAsmtDataPRview2[j].process || " ",
					auditprogram:doc[0].BUCAsmtDataPRview2[j].auditprogram || " ",
					ratingcategory:doc[0].BUCAsmtDataPRview2[j].ratingcategory || " ",
					ratingCQ:doc[0].BUCAsmtDataPRview2[j].ratingCQ || " ",
					ratingPQ1:doc[0].BUCAsmtDataPRview2[j].ratingPQ1 || " ",
					targettosat:doc[0].BUCAsmtDataPRview2[j].targettosat || " ",
					targettosatprev:doc[0].BUCAsmtDataPRview2[j].targettosatprev || " ",
					reviewcomments:doc[0].BUCAsmtDataPRview2[j].reviewcomments
				});
			}
			doc[0].exportAccountRatings2 = exportList2;
			/*for(var category in catList2){
				catList2[category].percent = (catList2[category].count/doc[0].BUCAsmtDataPRview2.length*100).toFixed(1);
			}*/

			for(var category in catList2)
			{
			    var tot, look;
				if(catList2[category].top)
				{
				    tot=catList2[category].count;
					look=catList2[category].id;
					catList2[category].percent = (tot / doc[0].BUCAsmtDataPRview2.length*100).toFixed(0);
          for(var category in catList2)
						{
							if(!catList2[category].top && catList2[category].parent==look){
								catList2[category].percent=(catList2[category].count*100/tot).toFixed(0);
								//console.log('%'+catList[category].percent);
							}
						}
				}
			}

			//Adding padding
			if (topEntriesCount2 < defViewRow) {
				if (tmpAccountList2.length == 0) {
					tmpAccountList2 = fieldCalc.addTestViewData(9,defViewRow);
				} else {
					fieldCalc.addTestViewDataPadding(tmpAccountList2,9,(defViewRow-topEntriesCount2));
				}
			}
			doc[0].BUCAsmtDataPRview2 = tmpAccountList2;
	}

			//For BU IOT  (Process by IMT table)
			if(doc[0].ParentDocSubType=='BU IOT'){
			var catList2 = {};
			var tmpAccountList2 = [];
			var exportList2 = [];
			//table categorized by country
			for(var j = 0; j < doc[0].BUCAsmtDataPRview2.length; j++){
				doc[0].BUCAsmtDataPRview2[j].ratingcategory = fieldCalc.getRatingCategory(doc[0].BUCAsmtDataPRview2[j].ratingCQ, doc[0].BUCAsmtDataPRview2[j].ratingPQ1);
				//to categorize sort
				switch (doc[0].BUCAsmtDataPRview2[j].ratingcategory) {
					case "NR":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 1;
					break;
					case "Unsat &#9660;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 2;
					break;
					case "Unsat &#61;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 3;
					//doc[0].BUCAsmtDataPRview2[i].ratingcategory = "Unsat";
					break;
					case "Marg &#9660;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 4;
					break;
					case "Marg &#61;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 5;
					//doc[0].BUCAsmtDataPRview2[i].ratingcategory = "Marg";
					break;
					case "Marg &#9650;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 6;
					break;
					case "Sat &#9650;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 7;
					break;
					case "Sat &#61;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 8;
					//doc[0].BUCAsmtDataPRview2[i].ratingcategory = "Sat";
					break;
					case "Exempt;":
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 9;
					break;
					default:
					doc[0].BUCAsmtDataPRview2[j].ratingcategorysort = 10;
				}
			}
			doc[0].BUCAsmtDataPRview2.sort(function(b, a){
				var nameA=a.imt, nameB=b.imt
				if (nameA > nameB) //sort string ascending
					return -1;
				if (nameA < nameB)
					return 1;
				var nameA=a.ratingcategorysort, nameB=b.ratingcategorysort
				if (nameA > nameB) //sort string ascending
					return -1;
				if (nameA < nameB)
					return 1;
				else
					return 0; //default return value (no sorting)
			});
			var topEntriesCount2= 0;
			for(var j = 0; j < doc[0].BUCAsmtDataPRview2.length; j++){
				var id_aux2; var parent_aux2;
				//category_aux = fieldCalc.getRatingCategory(doc[0].BUCAsmtDataPRview[i].ratingCQ,doc[0].BUCAsmtDataPRview[i].ratingPQ1);
				switch (doc[0].BUCAsmtDataPRview2[j].ratingcategory) {
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
						id_aux2=doc[0].BUCAsmtDataPRview2[j].ratingcategory;parent_aux2=doc[0].BUCAsmtDataPRview2[j].ratingcategory;
				}

				if(typeof catList2[doc[0].BUCAsmtDataPRview2[j].imt.replace(/ /g,'')] === "undefined"){
					topEntriesCount2++;
					var tmp2 = {
						id: doc[0].BUCAsmtDataPRview2[j].imt.replace(/ /g,''),
						imt: doc[0].BUCAsmtDataPRview2[j].imt,
						count: 0,
						percent: 0,
						top: true,
						MetricsValue: 0
					}
					tmpAccountList2.push(tmp2);
					catList2[doc[0].BUCAsmtDataPRview2[j].imt.replace(/ /g,'')] = tmp2;
				}
				if(typeof catList2[doc[0].BUCAsmtDataPRview2[j].imt.replace(/ /g,'')+doc[0].BUCAsmtDataPRview2[j].ratingcategory.replace(/ /g,'')] === "undefined"){
					var tmp2= {
						id: doc[0].BUCAsmtDataPRview2[j].imt.replace(/ /g,'')+id_aux2,
						parent: doc[0].BUCAsmtDataPRview2[j].imt.replace(/ /g,''),
						category: doc[0].BUCAsmtDataPRview2[j].ratingcategory,
						count: 0
					}
					tmpAccountList2.push(tmp2);
					catList2[doc[0].BUCAsmtDataPRview2[j].imt.replace(/ /g,'')+doc[0].BUCAsmtDataPRview2[j].ratingcategory.replace(/ /g,'')] = tmp2;
				}
				catList2[doc[0].BUCAsmtDataPRview2[j].imt.replace(/ /g,'')].count++;
				catList2[doc[0].BUCAsmtDataPRview2[j].imt.replace(/ /g,'')+doc[0].BUCAsmtDataPRview2[j].ratingcategory.replace(/ /g,'')].count++;
				doc[0].BUCAsmtDataPRview2[j].id = doc[0].BUCAsmtDataPRview2[j]["docid"];
				doc[0].BUCAsmtDataPRview2[j].parent =doc[0].BUCAsmtDataPRview2[j].imt.replace(/ /g,'')+id_aux2;//
				tmpAccountList2.push(doc[0].BUCAsmtDataPRview2[j]);
				exportList2.push({
					imt:doc[0].BUCAsmtDataPRview2[j].imt || " ",
					category:doc[0].BUCAsmtDataPRview2[j].ratingcategory  || " ",
					name: doc[0].BUCAsmtDataPRview2[j].name || " ",
					process:doc[0].BUCAsmtDataPRview2[j].process || " ",
					auditprogram:doc[0].BUCAsmtDataPRview2[j].auditprogram || " ",
					ratingcategory:doc[0].BUCAsmtDataPRview2[j].ratingcategory || " ",
					ratingCQ:doc[0].BUCAsmtDataPRview2[j].ratingCQ || " ",
					ratingPQ1:doc[0].BUCAsmtDataPRview2[j].ratingPQ1 || " ",
					targettosat:doc[0].BUCAsmtDataPRview2[j].targettosat || " ",
					targettosatprev:doc[0].BUCAsmtDataPRview2[j].targettosatprev || " ",
					reviewcomments:doc[0].BUCAsmtDataPRview2[j].reviewcomments
				});
			}
			doc[0].exportAccountRatings2 = exportList2;
			/*for(var category in catList2){
				catList2[category].percent = (catList2[category].count/doc[0].BUCAsmtDataPRview2.length*100).toFixed(1);
			}*/
			for(var category in catList2)
			{
			    var tot, look;
				if(catList2[category].top)
				{
				    tot=catList2[category].count;
					look=catList2[category].id;
					catList2[category].percent = (tot / doc[0].BUCAsmtDataPRview2.length*100).toFixed(0);
          for(var category in catList2)
						{
							if(!catList2[category].top && catList2[category].parent==look){
								catList2[category].percent=(catList2[category].count*100/tot).toFixed(0);
								//console.log('%'+catList[category].percent);
							}
						}
				}
			}
			//Adding padding
			if (topEntriesCount2 < defViewRow) {
				if (tmpAccountList2.length == 0) {
					tmpAccountList2 = fieldCalc.addTestViewData(9,defViewRow);
				} else {
					fieldCalc.addTestViewDataPadding(tmpAccountList2,9,(defViewRow-topEntriesCount2));
				}
			}
			doc[0].BUCAsmtDataPRview2 = tmpAccountList2;
	}

			//for BU IMT / BU IOT / BU Country (Process by rating table)
			if(doc[0].ParentDocSubType!='Global Process'){
			//categorization for
			for(var i = 0; i < doc[0].BUCAsmtDataPRview.length; i++){
				doc[0].BUCAsmtDataPRview[i].ratingcategory = fieldCalc.getRatingCategory(doc[0].BUCAsmtDataPRview[i].ratingCQ, doc[0].BUCAsmtDataPRview[i].ratingPQ1);
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
					//doc[0].BUCAsmtDataPRview[i].ratingcategory = "Unsat";
					break;
					case "Marg &#9660;":
					doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 4;
					break;
					case "Marg &#61;":
					doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 5;
					//doc[0].BUCAsmtDataPRview[i].ratingcategory = "Marg";
					break;
					case "Marg &#9650;":
					doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 6;
					break;
					case "Sat &#9650;":
					doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 7;
					break;
					case "Sat &#61;":
					doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 8;
					//doc[0].BUCAsmtDataPRview[i].ratingcategory = "Sat";
					break;
					case "Exempt;":
					doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 9;
					break;
					default:
					doc[0].BUCAsmtDataPRview[i].ratingcategorysort = 10;
				}
			}
			doc[0].BUCAsmtDataPRview.sort(function(b, a){
				var nameA=a.ratingcategorysort, nameB=b.ratingcategorysort
				if (nameA > nameB) //sort string ascending
					return -1;
				if (nameA < nameB)
					return 1;
				var nameA=a.process, nameB=b.process
				if (nameA > nameB) //sort string ascending
					return -1;
				if (nameA < nameB)
					return 1;
				else
					return 0; //default return value (no sorting)
			});
			var topEntriesCount= 0;
			//categorization for
			for(var i = 0; i < doc[0].BUCAsmtDataPRview.length; i++){
				var id_aux; var parent_aux;
				//category_aux = fieldCalc.getRatingCategory(doc[0].BUCAsmtDataPRview[i].ratingCQ,doc[0].BUCAsmtDataPRview[i].ratingPQ1);
				switch (doc[0].BUCAsmtDataPRview[i].ratingcategory) {
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
						id_aux=doc[0].BUCAsmtDataPRview[i].ratingcategory;parent_aux=doc[0].BUCAsmtDataPRview[i].ratingcategory;
				}

				if(typeof catList[doc[0].BUCAsmtDataPRview[i].ratingcategory.replace(/ /g,'')] === "undefined"){
					topEntriesCount++;
					var tmp = {
						id: id_aux,
						category: doc[0].BUCAsmtDataPRview[i].ratingcategory,
						count: 0,
						percent: 0,
						top: true,
						MetricsValue: 0
					}
					tmpAccountList.push(tmp);
					catList[doc[0].BUCAsmtDataPRview[i].ratingcategory.replace(/ /g,'')] = tmp;
				}
				if(typeof catList[doc[0].BUCAsmtDataPRview[i].ratingcategory.replace(/ /g,'')+doc[0].BUCAsmtDataPRview[i].process.replace(/ /g,'')] === "undefined"){
					var tmp= {
						id: id_aux+doc[0].BUCAsmtDataPRview[i].process.replace(/ /g,''),
						parent: id_aux,
						processName: doc[0].BUCAsmtDataPRview[i].process,
						count: 0
					}
					tmpAccountList.push(tmp);
					catList[doc[0].BUCAsmtDataPRview[i].ratingcategory.replace(/ /g,'')+doc[0].BUCAsmtDataPRview[i].process.replace(/ /g,'')] = tmp;
				}
				catList[doc[0].BUCAsmtDataPRview[i].ratingcategory.replace(/ /g,'')].count++;
				catList[doc[0].BUCAsmtDataPRview[i].ratingcategory.replace(/ /g,'')+doc[0].BUCAsmtDataPRview[i].process.replace(/ /g,'')].count++;
				doc[0].BUCAsmtDataPRview[i].id = doc[0].BUCAsmtDataPRview[i]["docid"];
				doc[0].BUCAsmtDataPRview[i].parent =id_aux+doc[0].BUCAsmtDataPRview[i].process.replace(/ /g,'');

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

			for(var category in catList)
			{
			    var tot, look;
				if(catList[category].top)
				{
				    tot=catList[category].count;
					look=catList[category].id;
					catList[category].percent = (tot / doc[0].BUCAsmtDataPRview.length * 100).toFixed(0);
        	for(var category in catList)
						{
							if(!catList[category].top && catList[category].parent==look){
								catList[category].percent=(catList[category].count*100/tot).toFixed(0);
								//console.log('%'+catList[category].percent);
							}
						}
				}
			}

			//Adding padding
			if (topEntriesCount < defViewRow) {
				if (tmpAccountList.length == 0) {
					tmpAccountList = fieldCalc.addTestViewData(9,defViewRow);
				} else {
					fieldCalc.addTestViewDataPadding(tmpAccountList,9,(defViewRow-topEntriesCount));
				}
			}
			doc[0].BUCAsmtDataPRview = tmpAccountList;
			}
					   //for Global Process (Process by rating table)
			if(doc[0].ParentDocSubType=='Global Process'){
			//categorization for
			for(var i = 0; i < doc[0].CPAsmtDataPR1view.length; i++){
				doc[0].CPAsmtDataPR1view[i].ratingcategory = fieldCalc.getRatingCategory(doc[0].CPAsmtDataPR1view[i].ratingCQ, doc[0].CPAsmtDataPR1view[i].ratingPQ1);
				//to categorize sort
				switch (doc[0].CPAsmtDataPR1view[i].ratingcategory) {
					case "NR":
					doc[0].CPAsmtDataPR1view[i].ratingcategorysort = 1;
					break;
					case "Unsat &#9660;":
					doc[0].CPAsmtDataPR1view[i].ratingcategorysort = 2;
					break;
					case "Unsat &#61;":
					doc[0].CPAsmtDataPR1view[i].ratingcategorysort = 3;
					//doc[0].CPAsmtDataPR1view[i].ratingcategory = "Unsat";
					break;
					case "Marg &#9660;":
					doc[0].CPAsmtDataPR1view[i].ratingcategorysort = 4;
					break;
					case "Marg &#61;":
					doc[0].CPAsmtDataPR1view[i].ratingcategorysort = 5;
					//doc[0].CPAsmtDataPR1view[i].ratingcategory = "Marg";
					break;
					case "Marg &#9650;":
					doc[0].CPAsmtDataPR1view[i].ratingcategorysort = 6;
					break;
					case "Sat &#9650;":
					doc[0].CPAsmtDataPR1view[i].ratingcategorysort = 7;
					break;
					case "Sat &#61;":
					doc[0].CPAsmtDataPR1view[i].ratingcategorysort = 8;
					//doc[0].CPAsmtDataPR1view[i].ratingcategory = "Sat";
					break;
					case "Exempt;":
					doc[0].CPAsmtDataPR1view[i].ratingcategorysort = 9;
					break;
					default:
					doc[0].CPAsmtDataPR1view[i].ratingcategorysort = 10;
				}
			}
			doc[0].CPAsmtDataPR1view.sort(function(b, a){
				var nameA=a.ratingcategorysort, nameB=b.ratingcategorysort
				if (nameA > nameB) //sort string ascending
					return -1;
				if (nameA < nameB)
					return 1;
				var nameA=a.country, nameB=b.country
				if (nameA > nameB) //sort string ascending
					return -1;
				if (nameA < nameB)
					return 1;
				else
					return 0; //default return value (no sorting)
			});
			var topEntriesCount= 0;
			//categorization for
			for(var i = 0; i < doc[0].CPAsmtDataPR1view.length; i++){
				var id_aux; var parent_aux;
				//category_aux = fieldCalc.getRatingCategory(doc[0].CPAsmtDataPR1view[i].ratingCQ,doc[0].CPAsmtDataPR1view[i].ratingPQ1);
				switch (doc[0].CPAsmtDataPR1view[i].ratingcategory) {
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
						id_aux=doc[0].CPAsmtDataPR1view[i].ratingcategory;parent_aux=doc[0].CPAsmtDataPR1view[i].ratingcategory;
				}

				if(typeof catList[doc[0].CPAsmtDataPR1view[i].ratingcategory.replace(/ /g,'')] === "undefined"){
					topEntriesCount++;
					var tmp = {
						id: id_aux,
						category: doc[0].CPAsmtDataPR1view[i].ratingcategory,
						count: 0,
						percent:0,
						MetricsValue: 0
					}
					tmpAccountList.push(tmp);
					catList[doc[0].CPAsmtDataPR1view[i].ratingcategory.replace(/ /g,'')] = tmp;
				}
				catList[doc[0].CPAsmtDataPR1view[i].ratingcategory.replace(/ /g,'')].count++;
				doc[0].CPAsmtDataPR1view[i].id = doc[0].CPAsmtDataPR1view[i]["docid"];
				doc[0].CPAsmtDataPR1view[i].parent =id_aux;
				tmpAccountList.push(doc[0].CPAsmtDataPR1view[i]);
				exportList.push({
					category:doc[0].CPAsmtDataPR1view[i].ratingcategory  || " ",
					country:doc[0].CPAsmtDataPR1view[i].country || " ",
					ratingCQ:doc[0].CPAsmtDataPR1view[i].ratingCQ || " ",
					ratingPQ1:doc[0].CPAsmtDataPR1view[i].ratingPQ1 || " ",
					targettosatprev:doc[0].CPAsmtDataPR1view[i].targettosatprev || " ",
					targettosat:doc[0].CPAsmtDataPR1view[i].targettosat || " ",
					reviewcomments:doc[0].CPAsmtDataPR1view[i].reviewcomments
				});
			}
			doc[0].exportProcessRatings = exportList;

			for(var category in catList)
			{
			    var tot, look;
				    tot=catList[category].count;
					look=catList[category].id;
							if(catList[category].percent!='100'){
								catList[category].percent=(catList[category].count*100/doc[0].CPAsmtDataPR1view.length).toFixed(1);
							}
			}

			//Adding padding
			if (topEntriesCount < defViewRow) {
				if (tmpAccountList.length == 0) {
					tmpAccountList = fieldCalc.addTestViewData(9,defViewRow);
				} else {
					fieldCalc.addTestViewDataPadding(tmpAccountList,9,(defViewRow-topEntriesCount));
				}
			}
				doc[0].CPAsmtDataPR1view = tmpAccountList;

			//second table for Global Process
			var catList2 = {};
			var tmpAccountList2 = [];
			var exportList2 = [];
            //categorization for
			for(var j = 0; j < doc[0].CPAsmtDataPR1view2.length; j++){
				doc[0].CPAsmtDataPR1view2[j].ratingcategory = fieldCalc.getRatingCategory(doc[0].CPAsmtDataPR1view2[j].ratingCQ, doc[0].CPAsmtDataPR1view2[j].ratingPQ1);
				//to categorize sort
				switch (doc[0].CPAsmtDataPR1view2[j].ratingcategory) {
					case "NR":
					doc[0].CPAsmtDataPR1view2[j].ratingcategorysort = 1;
					break;
					case "Unsat &#9660;":
					doc[0].CPAsmtDataPR1view2[j].ratingcategorysort = 2;
					break;
					case "Unsat &#61;":
					doc[0].CPAsmtDataPR1view2[j].ratingcategorysort = 3;
					//doc[0].CPAsmtDataPR1view2[i].ratingcategory = "Unsat";
					break;
					case "Marg &#9660;":
					doc[0].CPAsmtDataPR1view2[j].ratingcategorysort = 4;
					break;
					case "Marg &#61;":
					doc[0].CPAsmtDataPR1view2[j].ratingcategorysort = 5;
					//doc[0].CPAsmtDataPR1view2[i].ratingcategory = "Marg";
					break;
					case "Marg &#9650;":
					doc[0].CPAsmtDataPR1view2[j].ratingcategorysort = 6;
					break;
					case "Sat &#9650;":
					doc[0].CPAsmtDataPR1view2[j].ratingcategorysort = 7;
					break;
					case "Sat &#61;":
					doc[0].CPAsmtDataPR1view2[j].ratingcategorysort = 8;
					//doc[0].CPAsmtDataPR1view2[i].ratingcategory = "Sat";
					break;
					case "Exempt;":
					doc[0].CPAsmtDataPR1view2[j].ratingcategorysort = 9;
					break;
					default:
					doc[0].CPAsmtDataPR1view2[j].ratingcategorysort = 10;
				}
			}
			doc[0].CPAsmtDataPR1view2.sort(function(b, a){
				var nameA=a.iot, nameB=b.iot
				if (nameA > nameB) //sort string ascending
					return -1;
				if (nameA < nameB)
					return 1;
				var nameA=a.ratingcategorysort, nameB=b.ratingcategorysort
				if (nameA > nameB) //sort string ascending
					return -1;
				if (nameA < nameB)
					return 1;
				var nameA=a.country, nameB=b.country
				if (nameA > nameB) //sort string ascending
					return -1;
				if (nameA < nameB)
					return 1;
				else
					return 0; //default return value (no sorting)
			});
			var topEntriesCount2= 0;
			//categorization for
			for(var j = 0; j < doc[0].CPAsmtDataPR1view2.length; j++){
				var id_aux2; var parent_aux2;
				switch (doc[0].CPAsmtDataPR1view2[j].ratingcategory) {
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
						id_aux2=doc[0].CPAsmtDataPR1view2[j].ratingcategory;parent_aux2=doc[0].CPAsmtDataPR1view2[j].ratingcategory;
				}
                if(typeof catList2[doc[0].CPAsmtDataPR1view2[j].iot.replace(/ /g,'')] === "undefined"){
					topEntriesCount2++;
					var tmp2 = {
						id: doc[0].CPAsmtDataPR1view2[j].iot.replace(/ /g,''),
						iot: doc[0].CPAsmtDataPR1view2[j].iot,
						count: 0,
						percent: 100,
						MetricsValue: 0
					}
					tmpAccountList2.push(tmp2);
					catList2[doc[0].CPAsmtDataPR1view2[j].iot.replace(/ /g,'')] = tmp2;
				}
				if(typeof catList2[doc[0].CPAsmtDataPR1view2[j].iot.replace(/ /g,'')+doc[0].CPAsmtDataPR1view2[j].ratingcategory.replace(/ /g,'')] === "undefined"){
					var tmp2= {
						id: doc[0].CPAsmtDataPR1view2[j].iot.replace(/ /g,'')+id_aux2,
						parent: doc[0].CPAsmtDataPR1view2[j].iot.replace(/ /g,''),
						category: doc[0].CPAsmtDataPR1view2[j].ratingcategory,
						percent: 0,
						count: 0,
						MetricsValue: 1
					}
					tmpAccountList2.push(tmp2);
					catList2[doc[0].CPAsmtDataPR1view2[j].iot.replace(/ /g,'')+doc[0].CPAsmtDataPR1view2[j].ratingcategory.replace(/ /g,'')] = tmp2;
				}

				catList2[doc[0].CPAsmtDataPR1view2[j].iot.replace(/ /g,'')].count++;
				catList2[doc[0].CPAsmtDataPR1view2[j].iot.replace(/ /g,'')+doc[0].CPAsmtDataPR1view2[j].ratingcategory.replace(/ /g,'')].count++;
				catList2[doc[0].CPAsmtDataPR1view2[j].iot.replace(/ /g,'')+doc[0].CPAsmtDataPR1view2[j].ratingcategory.replace(/ /g,'')].helper=doc[0].CPAsmtDataPR1view2[j].iot;
				doc[0].CPAsmtDataPR1view2[j].id = doc[0].CPAsmtDataPR1view2[j]["docid"];
				doc[0].CPAsmtDataPR1view2[j].parent =doc[0].CPAsmtDataPR1view2[j].iot.replace(/ /g,'')+id_aux2;
				tmpAccountList2.push(doc[0].CPAsmtDataPR1view2[j]);
				exportList2.push({
					iot:doc[0].CPAsmtDataPR1view2[j].iot || " ",
					category:doc[0].CPAsmtDataPR1view2[j].ratingcategory  || " ",
					country:doc[0].CPAsmtDataPR1view2[j].country  || " ",
					ratingCQ:doc[0].CPAsmtDataPR1view2[j].ratingCQ || " ",
					ratingPQ1:doc[0].CPAsmtDataPR1view2[j].ratingPQ1 || " ",
					targettosat:doc[0].CPAsmtDataPR1view2[j].targettosat || " ",
					reviewcomments:doc[0].CPAsmtDataPR1view2[j].reviewcomments
				});
			}
			doc[0].exportProcessRatings2 = exportList2;

			for(var category in catList2)
			{
			    if(catList2[category].MetricsValue=='0'){

								catList2[category].percent=(catList2[category].count*100/doc[0].CPAsmtDataPR1view2.length).toFixed(1);

				}else {
					catList2[category].percent = (catList2[category].count/catList2[catList2[category].parent].count*100).toFixed(1);
				}
			}
			/*for(var category in catList2)
			{
			    var tot2, look2,look3;
				if(catList2[category].percent!='100')
				{
				    tot2=catList2[iot].count;
					look2=catList2[category].parent;
					look3=catList2[category].helper; console.log('helper:'+catList2[category].helper);
                       for(var category in catList2)
						{
							if(catList2[category].MetricsValue=='1'&& look3==look2){//console.log('vamos');console.log('tot2:'+tot2+'  count:'+catList2[category].count+'parent:'+catList2[category].parent);

								catList2[category].percent=(catList2[category].count*100/tot2).toFixed(0);
							}
						}
				}
			}*/

			//Adding padding
			if (topEntriesCount2 < defViewRow) {
				if (tmpAccountList2.length == 0) {
					tmpAccountList2 = fieldCalc.addTestViewData(9,defViewRow);
				} else {
					fieldCalc.addTestViewDataPadding(tmpAccountList2,9,(defViewRow-topEntriesCount2));
				}
			}
				doc[0].CPAsmtDataPR1view2 = tmpAccountList2;

			}
		}
		catch(e){
			console.log("[class-processviews][processProTab] - " + e.stack);
		}
	}

}

module.exports = calculatePRTab;
