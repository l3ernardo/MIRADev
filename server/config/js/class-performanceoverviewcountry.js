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
			//console.log(KCFRDefectCount);
			//console.log(KCFRTestCount);
			if(testPerformed == true){
				if(KCFRTestCount > 0){
					KFCRDefectRate = (KCFRDefectCount/KCFRTestCount).toString();
				}else
					KFCRDefectRate = "0";
				
			}else{
				KFCRDefectRate = "";
			}
			
			
		doc[0].KCFRDefectRate = KFCRDefectRate;
		
		}catch(e){
			console.log(e);
			deferred.reject({"status": 500, "error": e});
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
			//console.log(KCODefectCount);
			//console.log(KCOTestCount);
			
			if(testPerformed == true){
				if(KCOTestCount > 0){
					KCODefectRate = (KCODefectCount/KCOTestCount).toString();
				}else
					KCODefectRate = "0";
				
			}else{
				KCODefectRate = "";
			}
			
			
		doc[0].KCODefectRate= KCODefectRate;
		
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		
		
		
	},
	
	GetCHQInternalAudit : function(db,doc){
		//check with Chris you can discuss it with chris, he's assigned to the BU Country A&R tab 
	},
	
	
	getMissedRisks : function (db,doc){
		var conterRisks =0;
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
			
			doc[0].MissedOpenIssueCount = conterRisks;
			
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		
		/*
		okay for the missed risks 
		9:47:56 AM: genonms@ph.ibm.com - Minerva S Genon/Philippines/IBM: get all risks (compntType="openIssue") with this criteria => status != "Closed" and (ctrg > 0 | FlagTodaysDate = "1" | (numMissedTasks != "" & numMissedTasks > 0) 
		9:48:23 AM: genonms@ph.ibm.com - Minerva S Genon/Philippines/IBM: and country(openIssue) = country(assessment)  
		9:48:32 AM: genonms@ph.ibm.com - Minerva S Genon/Philippines/IBM: and same business unit 
		9:48:36 AM: genonms@ph.ibm.com - Minerva S Genon/Philippines/IBM: and same reporting quarter
		 */
	},
	
	
	
	getMSACCommitments : function (db,doc){
		try{
			for(var i=0;i<doc[0].AUData.length;i++){
				if(doc[0].AUData.PeriodRating == "Marg" || doc[0].AUData.PeriodRating =="Unsat" ){
					if(doc[0].AUData.AUStatus != "Retired"){
						
						
						
					}
				}
				
			}
			
			
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		
		/*
		 * all assessments under the BU Country, where reportign quarter is the same, business unit is the same, and country is the same 
	???? target		, including Country Process, Controllable Unit and BU Country    ,  PeriodRating = "Marg" or "Unsat" , AUStatus != "Retired" AND ( (Target2Sat != "" & Target2SatPrev != "" & Target2Sat > Target2SatPrev ) | (Target2SatPrev < currentdate) )  
		 */
		
	},
	
	getCPANDCUPerformanceIndicators: function (db,repoCountry){
		
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
	
	getCPANDCUPerformanceIndicatorsAndOthers: function (db,repoCountry){
		
		//fieldCalc.getAssessments check if brings all documents
		/*
		 * it has the same criteria as the last table, table 3, minus the BU Country 
10:21:30 AM: genonms@ph.ibm.com - Minerva S Genon/Philippines/IBM: adn they also differ in the data displayed 
		 */
	},
	
	
};

module.exports = performanceoverviewcountry;
