/**************************************************************************************************
 *
 * Assessment code for MIRA Web
 * Developed by : Carlos Ramirez
 * Date: 11 Jan 2017
 *
 */

var q  = require("q");
var forEach = require('async-foreach').forEach;
var util = require('./class-utility.js');
var moment = require('moment');

var getOpenIssuePerAssessment = function (RiskView1Data,AssessableUnitName){
	var tempProcess = "";
	var tempCountry = "";
	var tempRiskCountry = "";
	var tempRiskProces = "";

	try{

		if(AssessableUnitName != undefined && RiskView1Data != undefined){
			if(AssessableUnitName.indexOf("-") != -1 ){

			if(AssessableUnitName.split('-').length > 0 ){

			 tempCountry = AssessableUnitName.split('-')[0].replace(/ /g,'');

			if(AssessableUnitName.split('-').length>2){
			    tempProcess = AssessableUnitName.split('-')[1];
				tempProcess += "-";
				tempProcess += AssessableUnitName.split('-')[2];
			}
			else{
				 tempProcess = AssessableUnitName.split('-')[1] ;
				}

				tempProcess = tempProcess.replace(/ /g,'');
				tempCountry = tempCountry.replace(/ /g,'');

			if(RiskView1Data.country != undefined && RiskView1Data.process != undefined ){
				tempRiskCountry = RiskView1Data.country.replace(/ /g,'');
				tempRiskProcess = RiskView1Data.process.replace(/ /g,'');
			}

			if(tempRiskCountry == tempCountry && tempRiskProcess == tempProcess )
				return true;
			else
				return false;
			}

			}

		}

	}catch (e){
		console.log("error at [class-performanceoverview][getOpenIssuePerAssessment]: "+e);
		return false;
	}


}

var performanceoverviewcountry = {

	getKFCRDefectRate : function (db,doc){

		var KCFRDefectCount = 0;
		var KCFRTestCount = 0;
		var KFCRDefectRate = "";
		var testPerformed = false;

		try{

			//obtain defect and test count from the components(countryControls)
			for(var i=0;i<doc[0].CountryControlsData.length;i++){

				if(doc[0].CountryControlsData[i].controlType == 'KCFR'){

					if(!isNaN(parseInt(doc[0].CountryControlsData[i].numDefects)))
					KCFRDefectCount += parseInt(doc[0].CountryControlsData[i].numDefects);

					if(!isNaN(parseInt(doc[0].CountryControlsData[i].numActualTests))){
					KCFRTestCount += parseInt(doc[0].CountryControlsData[i].numActualTests);
					testPerformed = true;
					}
				}
			}
			if(testPerformed == true){
				if(KCFRTestCount > 0){
					KFCRDefectRate = (KCFRDefectCount/KCFRTestCount) * 100;
				}else
					KFCRDefectRate = "0";

			}else{
				KFCRDefectRate = "";
			}

			doc[0].KCFRDefectRate = parseInt(KFCRDefectRate).toFixed(1);

		}catch(e){
			console.log("error at [class-performanceoverview][getKFCRDefectRate]: "+e);
		}

	},

	getKCODefectRate : function (db,doc){

		var KCODefectCount = 0;
		var KCOTestCount = 0;
		var KCODefectRate = "";
		var testPerformed = false;

		try{

			//obtain defect and test count from the components(countryControls)
			for(var i=0;i<doc[0].CountryControlsData.length;i++){

				if(doc[0].CountryControlsData[i].controlType == 'KCO'){

					if(!isNaN(parseInt(doc[0].CountryControlsData[i].numDefects)))
						KCODefectCount += parseInt(doc[0].CountryControlsData[i].numDefects);

					if(!isNaN(parseInt(doc[0].CountryControlsData[i].numActualTests))){
						KCOTestCount += parseInt(doc[0].CountryControlsData[i].numActualTests);
					testPerformed = true;
					}
				}
			}

			if(testPerformed == true){
				if(KCOTestCount > 0){
					KCODefectRate = (KCODefectCount/KCOTestCount) * 100;
				}else
					KCODefectRate = "0";

			}else{
				KCODefectRate = "";
			}


			doc[0].KCODefectRate= parseInt(KCODefectRate).toFixed(1);

		}catch(e){
			console.log("error at [class-performanceoverview][getKCODefectRate]: "+e);
		}



	},

	GetCHQInternalAudit : function(db,doc){
		//check with Chris you can discuss it with chris, he's assigned to the BU Country A&R tab
	},



	getMissedRisksIndividual : function (RiskView1Data,AssessableUnitName){
		var counterRisks = 0;


		try{

			for(var i=0; i< RiskView1Data.length; i++){

				if(getOpenIssuePerAssessment(RiskView1Data[i],AssessableUnitName)){

					if(RiskView1Data[i].status != "Closed"){

						if(!isNaN(parseInt(RiskView1Data[i].ctrg))){
							if(parseInt(RiskView1Data[i].ctrg) > 0 || RiskView1Data[i].FlagTodaysDate == "1" )
								counterRisks ++;
						}
						else
							if(!isNaN(parseInt(RiskView1Data[i].numMissedTasks))){
								if(parseInt(RiskView1Data[i].numMissedTasks) > 0 || RiskView1Data[i].FlagTodaysDate == "1")
									counterRisks ++;
							}
							else
								if(RiskView1Data[i].FlagTodaysDate == "1")
									counterRisks ++;
					}

				}

		}
		}catch(e){
			console.log("error at [class-performanceoverview][getMissedRisksIndividual]: "+e);
			return "err";
		}

		return counterRisks.toString();
	},




	getMissedRisks : function (db,doc){
		var counterRisks =0;
		try{

			//obtain defect and test count from the components(Open issue)
			for(var i=0;i<doc[0].RiskView1Data.length;i++){
				if(doc[0].RiskView1Data[i].status != "Closed"){

					if(!isNaN(parseInt(doc[0].RiskView1Data[i].ctrg))){
						if(parseInt(doc[0].RiskView1Data[i].ctrg) > 0 || doc[0].RiskView1Data[i].FlagTodaysDate == "1" )
							counterRisks ++;
					}
					else
						if(!isNaN(parseInt(doc[0].RiskView1Data[i].numMissedTasks))){
							if(parseInt(doc[0].RiskView1Data[i].numMissedTasks) > 0 || doc[0].RiskView1Data[i].FlagTodaysDate == "1")
								counterRisks ++;
						}
						else
							if(doc[0].RiskView1Data[i].FlagTodaysDate == "1")
								counterRisks ++;

				}
			}

			doc[0].MissedOpenIssueCount = counterRisks;

		}catch(e){
			console.log("error at [class-performanceoverview][getMissedRisks]: "+e);
		}

		/*
		okay for the missed risks
		9:47:56 AM: genonms@ph.ibm.com - Minerva S Genon/Philippines/IBM: get all risks (compntType="openIssue") with this criteria => status != "Closed" and (ctrg > 0 | FlagTodaysDate = "1" | (numMissedTasks != "" & numMissedTasks > 0)
		9:48:23 AM: genonms@ph.ibm.com - Minerva S Genon/Philippines/IBM: and country(openIssue) = country(assessment)
		9:48:32 AM: genonms@ph.ibm.com - Minerva S Genon/Philippines/IBM: and same business unit
		9:48:36 AM: genonms@ph.ibm.com - Minerva S Genon/Philippines/IBM: and same reporting quarter
		 */
	},

	getMSACCOmmitmentsIndividual: function (AUData){
		var count =0;
		var currentDate =  util.getDateTime("","date")

		try{

				if(AUData.PeriodRating == "Marg" || AUData.PeriodRating =="Unsat" ){
					if(AUData.AUStatus != "Retired"){
						if(AUData.Target2Sat != undefined && AUData.Target2SatPrev != undefined){
							if(AUData.Target2Sat != "" && AUData.Target2SatPrev != "" ){
								//console.log( "Target2Sat: "+new Date(doc[0].AUData[i].Target2Sat).getTime()); console.log( "Target2SatPrev: "+new Date(doc[0].AUData[i].Target2SatPrev).getTime()); console.log("current date: "+new Date(currentDate ).getTime());

								if( (new Date(AUData.Target2Sat).getTime() > new Date(AUData.Target2SatPrev).getTime()) || (new Date(AUData.Target2SatPrev).getTime() < new Date(currentDate).getTime()) ){
									count++;
								}
							}else
								if(AUData.Target2SatPrev != ""){
									if( (new Date(AUData.Target2SatPrev).getTime() < new Date(currentDate).getTime())){
										count++;
									}

								}

						}

					}
				}


			return count.toString();

		}catch(e){
			console.log("error at [class-performanceoverview][getMSACCOmmitmentsIndividual]: "+e);
		}

	},
	//summarize the missed commitments
	getMSACCommitmentsCount : function (db,doc){
		var count =0;
		var currentDate =  util.getDateTime("","date");
	    var AUDataMSAC = [];

		try{
			for(var i=0;i<doc[0].asmtsdocs.length;i++){
				if(doc[0].asmtsdocs[i].PeriodRating == "Marg" || doc[0].asmtsdocs[i].PeriodRating =="Unsat" ){
					if(doc[0].asmtsdocs[i].AUStatus != "Retired"){
						if(doc[0].asmtsdocs[i].Target2Sat != undefined && doc[0].asmtsdocs[i].Target2SatPrev != undefined){
							if(doc[0].asmtsdocs[i].Target2Sat != "" && doc[0].asmtsdocs[i].Target2SatPrev != "" ){
								//console.log( "Target2Sat: "+new Date(doc[0].AUData[i].Target2Sat).getTime()); console.log( "Target2SatPrev: "+new Date(doc[0].AUData[i].Target2SatPrev).getTime()); console.log("current date: "+new Date(currentDate ).getTime());

								if( (new Date(doc[0].asmtsdocs[i].Target2Sat).getTime() > new Date(doc[0].asmtsdocs[i].Target2SatPrev).getTime()) || (new Date(doc[0].asmtsdocs[i].Target2SatPrev).getTime() < new Date(currentDate).getTime()) ){
									count++;
									AUDataMSAC.push(doc[0].asmtsdocs[i]);
								}
							}else
								if(doc[0].asmtsdocs[i].Target2SatPrev != ""){
									if( (new Date(doc[0].asmtsdocs[i].Target2SatPrev).getTime() < new Date(currentDate).getTime())){
										count++;
										AUDataMSAC.push(doc[0].asmtsdocs[i]);
									}

								}

						}

					}
				}

			}
			doc[0].AUDataMSAC = AUDataMSAC;
			doc[0].MissedMSACSatCount = count.toString();

		}catch(e){
			console.log("error at [class-performanceoverview][getMSACCommitmentsCount]: "+e);
		}

		/*
		 * all assessments under the BU Country, where reportign quarter is the same, business unit is the same, and country is the same
	 target		, including Country Process, Controllable Unit and BU Country    ,  PeriodRating = "Marg" or "Unsat" , AUStatus != "Retired" AND ( (Target2Sat != "" & Target2SatPrev != "" & Target2Sat > Target2SatPrev ) | (Target2SatPrev < currentdate) )
		 */

	},



	getCPANDCUPerformanceIndicators: function (db,doc){
		//Sort for correct display
		 var POCountryFlag = 0, POCUFlag = 0, POBUCFlag  =0;
		 var tempArray = [];
		 var head = {};

	try{
		 //Sort the array
		doc[0].BUCAsmtDataPIview.sort(function(a, b){
		    var nameA=a.ParentDocSubType.toLowerCase(), nameB=b.ParentDocSubType.toLowerCase()
		    if (nameA > nameB) //sort string descending
		      return -1
		    if (nameA < nameB)
		      return 1
		    return 0 //default return value (no sorting)
		  });

		//Create the treetable array
		for(var i=0; i < doc[0].BUCAsmtDataPIview.length; i++){

			if(doc[0].BUCAsmtDataPIview[i].ParentDocSubType == "Country Process" && POCountryFlag == 0){
				head = {
	            		"docid":doc[0].BUCAsmtDataPIview[i].ParentDocSubType.replace(/ /g,''),
	                    "name":doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
	                    "ParentDocSubType":doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
	                    "ratingCQ":"",
	                    "ratingPQ1":"",
	                    "ratingPQ2":"",
	                    "ratingPQ3":"",
	                    "ratingPQ4":"",
	                    "kcfrDR":"",
	                    "kcoDR":"",
	                    "auditScore":"",
	                    "msdRisk":"",
	                    "msdMSAC":"",
	                    "treeParent" : i
	            		 };
				POCountryFlag = 1;
				tempArray.push(head);
			}

			if(doc[0].BUCAsmtDataPIview[i].ParentDocSubType == "Controllable Unit" && POCUFlag == 0){
				head = {
	            		"docid":doc[0].BUCAsmtDataPIview[i].ParentDocSubType.replace(/ /g,''),
	                    "name":doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
	                    "ParentDocSubType":doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
	                    "ratingCQ":"",
	                    "ratingPQ1":"",
	                    "ratingPQ2":"",
	                    "ratingPQ3":"",
	                    "ratingPQ4":"",
	                    "kcfrDR":"",
	                    "kcoDR":"",
	                    "auditScore":"",
	                    "msdRisk":"",
	                    "msdMSAC":"",
	                    "treeParent" : i
	            		 };
				POCUFlag = 1;
				tempArray.push(head);
			}

			if(doc[0].BUCAsmtDataPIview[i].ParentDocSubType == "BU Country" && POBUCFlag == 0){
				head = {
	            		"docid":doc[0].BUCAsmtDataPIview[i].ParentDocSubType.replace(/ /g,''),
	                    "name":doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
	                    "ParentDocSubType":doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
	                    "ratingCQ":"",
	                    "ratingPQ1":"",
	                    "ratingPQ2":"",
	                    "ratingPQ3":"",
	                    "ratingPQ4":"",
	                    "kcfrDR":"",
	                    "kcoDR":"",
	                    "auditScore":"",
	                    "msdRisk":"",
	                    "msdMSAC":"",
	                    "treeParent" : i
	            		 };
				POBUCFlag = 1;
				tempArray.push(head);
			}


				tempArray.push(doc[0].BUCAsmtDataPIview[i]);

		}


		doc[0].BUCAsmtDataPIview = tempArray;

	}catch(e){
		console.log("error at [class-performanceoverview][getCPANDCUPerformanceIndicators]: "+e);
	}
		//fieldCalc.getAssessments check if brings all documents
		/*
		 * criteria ==> all assessments under the BU Country, where reportign quarter is the same, business unit is the same, and country is the same
, including Country Process, Controllable Unit and BU Country    AND  AUStatus != "Retired"
PeriodRatingPrev1
PeriodRatingPrev2
PeriodRatingPrev3
PeriodRatingPrev4
		 */
	},

	getCPANDCUPerformanceIndicatorsAndOthers: function (db,doc){
		var POCountryOtherFlag = 0, POCUOtherFlag = 0, POBUCOtherFlag  =0;
		var head = {};
		var tempArray = [];


try{
		 //Sort the array
		doc[0].BUCAsmtDataOIview.sort(function(a, b){
		    var nameA=a.ParentDocSubType.toLowerCase(), nameB=b.ParentDocSubType.toLowerCase()
		    if (nameA > nameB) //sort string descending
		      return -1
		    if (nameA < nameB)
		      return 1
		    return 0 //default return value (no sorting)
		  });

		//Create the treetable array
		for(var i=0; i < doc[0].BUCAsmtDataOIview.length; i++){

			if(doc[0].BUCAsmtDataOIview[i].ParentDocSubType == "Country Process" && POCountryOtherFlag  == 0){
				head = {
						"docid":doc[0].BUCAsmtDataOIview[i].ParentDocSubType.replace(/ /g,''),
						"name":doc[0].BUCAsmtDataOIview[i].ParentDocSubType,
						"ParentDocSubType":doc[0].BUCAsmtDataOIview[i].ParentDocSubType,
						"bocExCount":"",
						"treeParent" : i
					};
				tempArray.push(head);
				POCountryOtherFlag  = 1;
			}

			if(doc[0].BUCAsmtDataOIview[i].ParentDocSubType == "Controllable Unit" && POCUOtherFlag == 0){
				head = {
						"docid":doc[0].BUCAsmtDataOIview[i].ParentDocSubType.replace(/ /g,''),
						"name":doc[0].BUCAsmtDataOIview[i].ParentDocSubType,
						"ParentDocSubType":doc[0].BUCAsmtDataOIview[i].ParentDocSubType,
						"bocExCount":"",
						"treeParent" : i
				};
				tempArray.push(head);

				POCUOtherFlag = 1;
			}

			tempArray.push(doc[0].BUCAsmtDataOIview[i]);

		}
		//console.log(tempArray);
		doc[0].BUCAsmtDataOIview = tempArray;

}catch(e){
	console.log("error at [class-performanceoverview][getCPANDCUPerformanceIndicatorsAndOthers]: "+e);
}
		//fieldCalc.getAssessments check if brings all documents
		/*
		 * it has the same criteria as the last table, table 3, minus the BU Country
10:21:30 AM: genonms@ph.ibm.com - Minerva S Genon/Philippines/IBM: adn they also differ in the data displayed
		 */
	},


};

module.exports = performanceoverviewcountry;
