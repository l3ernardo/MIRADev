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

var getOpenIssuePerAssessment = function (RiskView1Data,reviewParam,ParentDocSubType){
	
	if(ParentDocSubType =="Controllable Unit"){
		
		if(RiskView1Data.country != undefined){
			
			if(RiskView1Data.country == reviewParam)
				return true;
			else 
				return false;
		}else
			return false;
		
		
	}else if(ParentDocSubType =="Country Process"){
		
		if(RiskView1Data.controllableUnit  != undefined){
			
			if(RiskView1Data.controllableUnit  == reviewParam)
				return true;
			else 
				return false;
		}else
			return false;
		
	}
	
		
	
	
	

}




/*
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
			//var tempCountry = "USA";
	
	 
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
	
	
}*/

var performanceoverviewcountry = {
	
	getKFCRDefectRate : function (db,doc){
		
		var KCFRDefectRateCRM = 0;
		var KCFRDefectRateSOD = 0;
		var KCFRDefectRateCRMDefectCount =0;
		var KCFRDefectRateCRMTestCount =0;
		var KCFRDefectRateSODDefectCount = 0;
		var KCFRDefectRateSODTestCount =0;
		var CRMtestPerformed = false;
		var SODtestPerformed = false;
		
		var KCFRDefectCount = 0;
    	var KCFRTestCount = 0;
		var KFCRDefectRate = "";
		var testPerformed = false;
		
		try{
			
			if (doc[0].MIRABusinessUnit == "GTS")  {
				
			
				//obtain defect and test count from the components(countryControls) for CRM
				for(var i=0;i<doc[0].CountryControlsDataCRM.length;i++){
					
					if(doc[0].CountryControlsDataCRM[i].controlType == 'KCFR'){
						
						if(!isNaN(parseInt(doc[0].CountryControlsDataCRM[i].numDefects))){
							KCFRDefectRateCRMDefectCount += parseInt(doc[0].CountryControlsDataCRM[i].numDefects);
						
						}
						
						if(!isNaN(parseInt(doc[0].CountryControlsDataCRM[i].numActualTests))){
							KCFRDefectRateCRMTestCount += parseInt(doc[0].CountryControlsDataCRM[i].numActualTests);
							CRMtestPerformed = true;
						}
					}
				}
			
				if(CRMtestPerformed == true){
					if(KCFRDefectRateCRMTestCount > 0){
						KCFRDefectRateCRM = ((KCFRDefectRateCRMDefectCount / KCFRDefectRateCRMTestCount)*100).toFixed(2).toString();
					}else
						KCFRDefectRateCRM = "0";
					
				}else{
					KCFRDefectRateCRM = "";
				}
								
				
				doc[0].KCFRDefectRateCRM = KCFRDefectRateCRM;
				
			
			
				
				//obtain defect and test count from the components(countryControls) for Delivery
				for(var i=0;i<doc[0].CountryControlsDataDelivery.length;i++){
					 
					if(doc[0].CountryControlsDataDelivery[i].controlType == 'KCFR'){
						
						if(!isNaN(parseInt(doc[0].CountryControlsDataDelivery[i].numDefects)))
							KCFRDefectRateSODDefectCount += parseInt(doc[0].CountryControlsDataDelivery[i].numDefects);
						
						if(!isNaN(parseInt(doc[0].CountryControlsDataDelivery[i].numActualTests))){
							KCFRDefectRateSODTestCount += parseInt(doc[0].CountryControlsDataDelivery[i].numActualTests);
							SODtestPerformed = true;
						}
					}
				}
				
				if(SODtestPerformed == true){
					if(KCFRDefectRateSODTestCount > 0){
						KCFRDefectRateSOD = ((KCFRDefectRateSODDefectCount / KCFRDefectRateSODTestCount)*100).toFixed(2).toString();
					}else
						KCFRDefectRateSOD = "0";
					
				}else{
					KCFRDefectRateSOD = "0";
				}
				
				
				
				
				doc[0].KCFRDefectRateSOD = KCFRDefectRateSOD;
			
			}else{
			
					
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
					KFCRDefectRate = ((KCFRDefectCount/KCFRTestCount)*100).toFixed(2).toString();
				}else
					KFCRDefectRate = "0";
				
			}else{
				KFCRDefectRate = "0";
			}
			doc[0].KCFRDefectRate = KFCRDefectRate;
			}//end else
			
		
		
		}catch(e){
			console.log("error at [class-performanceoverview][getKFCRDefectRate]: "+e);
		}
		
	},

	getKCODefectRate : function (db,doc){
		
		var KCODefectRateCRM = 0;
		var KCODefectRateSOD = 0;
		var KCODefectRateCRMDefectCount =0;
		var KCODefectRateCRMTestCount =0;
		var KCODefectRateSODDefectCount = 0;
		var KCODefectRateSODTestCount =0;
		var CRMtestPerformed = false;
		var SODtestPerformed = false;
		
		var KCODefectCount = 0;
		var KCOTestCount = 0;
		var KCODefectRate = "";
		var testPerformed = false;
		
		try{
			
			
			if (doc[0].MIRABusinessUnit == "GTS")  {
				
				
				
				//obtain defect and test count from the components(countryControls) for CRM
				for(var i=0;i<doc[0].CountryControlsDataCRM.length;i++){
					
					if(doc[0].CountryControlsDataCRM[i].controlType == 'KCO'){
						
						if(!isNaN(parseInt(doc[0].CountryControlsDataCRM[i].numDefects))){
							KCODefectRateCRMDefectCount += parseInt(doc[0].CountryControlsDataCRM[i].numDefects);
						
						}
						
						if(!isNaN(parseInt(doc[0].CountryControlsDataCRM[i].numActualTests))){
							KCODefectRateCRMTestCount += parseInt(doc[0].CountryControlsDataCRM[i].numActualTests);
							CRMtestPerformed = true;
						}
					}
				}
			
		
				if(CRMtestPerformed == true){
					if(KCODefectRateCRMTestCount > 0){
						KCODefectRateCRM = ((KCODefectRateCRMDefectCount / KCODefectRateCRMTestCount)*100).toFixed(2).toString();
					}else
						KCODefectRateCRM = "0";
					
				}else{
					KCODefectRateCRM = "";
				}
								
				
				doc[0].KCODefectRateCRM = KCODefectRateCRM;
				
				
						
				
				//obtain defect and test count from the components(countryControls) for Delivery
				for(var i=0;i<doc[0].CountryControlsDataDelivery.length;i++){
					
					if(doc[0].CountryControlsDataDelivery[i].controlType == 'KCO'){
						
						if(!isNaN(parseInt(doc[0].CountryControlsDataDelivery[i].numDefects)))
							KCODefectRateSODDefectCount += parseInt(doc[0].CountryControlsDataDelivery[i].numDefects);
						
						if(!isNaN(parseInt(doc[0].CountryControlsDataDelivery[i].numActualTests))){
							KCODefectRateSODTestCount += parseInt(doc[0].CountryControlsDataDelivery[i].numActualTests);
							SODtestPerformed = true;
						}
					}
				}
				
				if(SODtestPerformed == true){
					if(KCODefectRateSODTestCount > 0){
						KCODefectRateSOD = ((KCODefectRateSODDefectCount / KCODefectRateSODTestCount)*100).toFixed(2).toString();
					}else
						KCODefectRateSOD = "0";
					
				}else{
					KCODefectRateSOD = "";
				}
				
				
			
				
				doc[0].KCODefectRateSOD = KCODefectRateSOD;
				
				
			}else{
					
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
					KCODefectRate = ((KCODefectCount/KCOTestCount)*100).toFixed(2).toString();
				}else
					KCODefectRate = "0";
				
			}else{
				KCODefectRate = "";
			}
			
			
			doc[0].KCODefectRate= KCODefectRate;
			}//end else
		
		}catch(e){
			console.log("error at [class-performanceoverview][getKCODefectRate]: "+e);
		}
		
		
		
	},
	
	GetCHQInternalAudit : function(db,doc){
		//check with Chris you can discuss it with chris, he's assigned to the BU Country A&R tab 
	},
	
	
	
	getMissedRisksIndividual : function (RiskView1Data,assessmentDoc){
		var counterRisks = 0;
		var reviewParam = "";
		
		
		try{
		
			for(var i=0; i< RiskView1Data.length; i++){
				
				// construc param depending on CU or CP since they are calculated diff
				if(assessmentDoc.ParentDocSubType == "Controllable Unit"){
					
					reviewParam = assessmentDoc.AssessableUnitName;
				}
				else if(assessmentDoc.ParentDocSubType == "Country Process"){
					
					reviewParam = assessmentDoc.Country;
				}
				
				
				if(getOpenIssuePerAssessment(RiskView1Data[i],reviewParam,assessmentDoc.ParentDocSubType )){
							
					if(RiskView1Data[i].status != "Closed"){
						    
						if(RiskView1Data[i].ctrg != ""){
							if(parseInt(RiskView1Data[i].ctrg) > 0 || RiskView1Data[i].FlagTodaysDate == "1" )
								counterRisks ++;
						}
						else
							if(RiskView1Data[i].numMissedTasks != ""){
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
		var counterRisksCRM =0;
		var counterRisksDelivery =0;
		
	//console.log(doc[0].RiskView1DataCRM);		console.log("next");		console.log(doc[0].RiskView1DataDelivery);
		
		try{
			
			if (doc[0].MIRABusinessUnit == "GTS")  {
			
			//obtain defect and test count from the components(Open issue) for CRM
			for(var i=0;i<doc[0].RiskView1DataCRM.length;i++){
				if(doc[0].RiskView1DataCRM[i].status != "Closed"){
					
					if(doc[0].RiskView1DataCRM[i].ctrg != ""){
						if(parseInt(doc[0].RiskView1DataCRM[i].ctrg) > 0 || doc[0].RiskView1DataCRM[i].FlagTodaysDate == "1" )
							counterRisksCRM ++;
					}
					else
						if(doc[0].RiskView1DataCRM[i].numMissedTasks != ""){
							if(parseInt(doc[0].RiskView1DataCRM[i].numMissedTasks) > 0 || doc[0].RiskView1DataCRM[i].FlagTodaysDate == "1")
								counterRisksCRM ++;
						}
						else
							if(doc[0].RiskView1DataCRM[i].FlagTodaysDate == "1")
								counterRisksCRM ++;
								
				}
			}
			
			doc[0].MissedOpenIssueCountCRM = counterRisksCRM;
			
			
			
			
			//obtain defect and test count from the components(Open issue) for CRM
			for(var i=0;i<doc[0].RiskView1DataDelivery.length;i++){
				if(doc[0].RiskView1DataDelivery[i].status != "Closed"){
					
					if(doc[0].RiskView1DataDelivery[i].ctrg != ""){
						if(parseInt(doc[0].RiskView1DataDelivery[i].ctrg) > 0 || doc[0].RiskView1DataDelivery[i].FlagTodaysDate == "1" )
							counterRisksDelivery ++;
					}
					else
						if(doc[0].RiskView1DataDelivery[i].numMissedTasks != ""){
							if(parseInt(doc[0].RiskView1DataDelivery[i].numMissedTasks) > 0 || doc[0].RiskView1DataDelivery[i].FlagTodaysDate == "1")
								counterRisksDelivery ++;
						}
						else
							if(doc[0].RiskView1DataDelivery[i].FlagTodaysDate == "1")
								counterRisksDelivery ++;
								
				}
			}  
			
			doc[0].MissedOpenIssueCountSOD = counterRisksDelivery;
			
			}else{
				
				//obtain defect and test count from the components(Open issue)
				for(var i=0;i<doc[0].RiskView1Data.length;i++){
					if(doc[0].RiskView1Data[i].status != "Closed"){
						
						if(doc[0].RiskView1Data[i].ctrg != ""){
							if(parseInt(doc[0].RiskView1Data[i].ctrg) > 0 || doc[0].RiskView1Data[i].FlagTodaysDate == "1" )
								counterRisks ++;
						}
						else
							if(doc[0].RiskView1Data[i].numMissedTasks != ""){
								if(parseInt(doc[0].RiskView1Data[i].numMissedTasks) > 0 || doc[0].RiskView1Data[i].FlagTodaysDate == "1")
									counterRisks ++;
							}
							else
								if(doc[0].RiskView1Data[i].FlagTodaysDate == "1")
									counterRisks ++;
									
					}
				}
				
				doc[0].MissedOpenIssueCountSOD = counterRisks;
				
				
			}
			
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
	
	getCPANDCUPerformanceIndicatorsGTS: function (db,doc){
		//Sort for correct display
		 var POCountryFlag = 0, POCUFlag = 0, POBUCFlag  =0;
		 var tempArray = [];
		 var head = {};
		
	try{
		 //Sort the array CRM
		doc[0].BUCAsmtDataPIviewCRM.sort(function(a, b){
		    var nameA=a.ParentDocSubType.toLowerCase(), nameB=b.ParentDocSubType.toLowerCase()
		    if (nameA > nameB) //sort string descending
		      return -1
		    if (nameA < nameB)
		      return 1
		    return 0 //default return value (no sorting)
		  }); 
		
		 //Sort the array Delivery
		doc[0].BUCAsmtDataPIviewDelivery.sort(function(a, b){
		    var nameA=a.ParentDocSubType.toLowerCase(), nameB=b.ParentDocSubType.toLowerCase()
		    if (nameA > nameB) //sort string descending
		      return -1
		    if (nameA < nameB)
		      return 1
		    return 0 //default return value (no sorting)
		  }); 
		
		
		//Add BU country itself to the tree
		
		head = {
				"docid":doc[0]._id,
                "name":doc[0].AssessableUnitName,
                "ParentDocSubType":doc[0].ParentDocSubType,
                "ratingCQ":doc[0].PeriodRating,
                "ratingPQ1":doc[0].PeriodRatingPrev1,
                "ratingPQ2":doc[0].PeriodRatingPrev2,
                "ratingPQ3":doc[0].PeriodRatingPrev3,
                "ratingPQ4":doc[0].PeriodRatingPrev4,
                "kcfrDR":doc[0].KCFRDefectRate,
                "kcoDR":doc[0].KCODefectRate,
                "auditScore":doc[0].WeightedAuditScore,
                "msdRisk":doc[0].MissedOpenIssueCount,
                "msdMSAC":doc[0].MissedMSACSatCount,
                "treeParent" :doc[0].ParentDocSubType.replace(/ /g,'')
        		 };
		
		
		doc[0].BUCAsmtDataPIviewDelivery.push(head);
		
		doc[0].BUCAsmtDataPIviewCRM.push(head);
		
		//Create the treetable array for CRM
		for(var i=0; i < doc[0].BUCAsmtDataPIviewCRM.length; i++){
			
			if(doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType == "Country Process" && POCountryFlag == 0){
				head = {
	            		"docid":doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType.replace(/ /g,''),
	                    "name":doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
	                    "ParentDocSubType":doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
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
		
			if(doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType == "Controllable Unit" && POCUFlag == 0){
				head = {
	            		"docid":doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType.replace(/ /g,''),
	                    "name":doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
	                    "ParentDocSubType":doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
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
		
			if(doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType == "BU Country" && POBUCFlag == 0){
				head = {
	            		"docid":doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType.replace(/ /g,''),
	                    "name":doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
	                    "ParentDocSubType":doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
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
			
				
				tempArray.push(doc[0].BUCAsmtDataPIviewCRM[i]);
		
		}
		
		
		doc[0].BUCAsmtDataPIviewCRM = tempArray;
		
		
		tempArray = [];
		POCountryFlag = 0;
		POCUFlag = 0;
		POBUCFlag  =0;
		
		//Create the treetable array for Delivery
		for(var i=0; i < doc[0].BUCAsmtDataPIviewDelivery.length; i++){
			
			if(doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType == "Country Process" && POCountryFlag == 0){
				head = {
	            		"docid":doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType.replace(/ /g,''),
	                    "name":doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
	                    "ParentDocSubType":doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
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
		
			if(doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType == "Controllable Unit" && POCUFlag == 0){
				head = {
	            		"docid":doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType.replace(/ /g,''),
	                    "name":doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
	                    "ParentDocSubType":doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
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
		
			if(doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType == "BU Country" && POBUCFlag == 0){
				head = {
	            		"docid":doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType.replace(/ /g,''),
	                    "name":doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
	                    "ParentDocSubType":doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
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
			
				
				tempArray.push(doc[0].BUCAsmtDataPIviewDelivery[i]);
		
		}
		
		
		doc[0].BUCAsmtDataPIviewDelivery = tempArray;
		
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
		
		
		//Add BU country itself to the tree
		
		head = {
				"docid":doc[0]._id,
                "name":doc[0].AssessableUnitName,
                "ParentDocSubType":doc[0].ParentDocSubType,
                "ratingCQ":doc[0].PeriodRating,
                "ratingPQ1":doc[0].PeriodRatingPrev1,
                "ratingPQ2":doc[0].PeriodRatingPrev2,
                "ratingPQ3":doc[0].PeriodRatingPrev3,
                "ratingPQ4":doc[0].PeriodRatingPrev4,
                "kcfrDR":doc[0].KCFRDefectRate,
                "kcoDR":doc[0].KCODefectRate,
                "auditScore":doc[0].WeightedAuditScore,
                "msdRisk":doc[0].MissedOpenIssueCount,
                "msdMSAC":doc[0].MissedMSACSatCount,
                "treeParent" :doc[0].ParentDocSubType.replace(/ /g,'')
        		 };
		
		doc[0].BUCAsmtDataPIview.push(head);
		
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
	
	
	getCPANDCUPerformanceIndicatorsAndOthersGTS: function (db,doc){
		var POCountryOtherFlag = 0, POCUOtherFlag = 0, POBUCOtherFlag  =0;
		var head = {};
		var tempArray = [];
		
		
	
		
		
try{
		 //Sort the array CRM
		doc[0].BUCAsmtDataOIviewCRM.sort(function(a, b){
		    var nameA=a.ParentDocSubType.toLowerCase(), nameB=b.ParentDocSubType.toLowerCase()
		    if (nameA > nameB) //sort string descending
		      return -1
		    if (nameA < nameB)
		      return 1
		    return 0 //default return value (no sorting)
		  }); 
		
		
		//Sort the array CRM
		doc[0].BUCAsmtDataOIviewDelivery.sort(function(a, b){
		    var nameA=a.ParentDocSubType.toLowerCase(), nameB=b.ParentDocSubType.toLowerCase()
		    if (nameA > nameB) //sort string descending
		      return -1
		    if (nameA < nameB)
		      return 1
		    return 0 //default return value (no sorting)
		  }); 
		
		//Create the treetable array for CRM
		for(var i=0; i < doc[0].BUCAsmtDataOIviewCRM.length; i++){
		
			if(doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType == "Country Process" && POCountryOtherFlag  == 0){
				head = {
						"docid":doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType.replace(/ /g,''),
						"name":doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType,
						"ParentDocSubType":doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType,
						"bocExCount":"",
						"treeParent" : i
					};
				tempArray.push(head);
				POCountryOtherFlag  = 1;
			}

			if(doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType == "Controllable Unit" && POCUOtherFlag == 0){
				head = {
						"docid":doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType.replace(/ /g,''),
						"name":doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType,
						"ParentDocSubType":doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType,
						"bocExCount":"",
						"treeParent" : i
				};
				tempArray.push(head);

				POCUOtherFlag = 1;
			}

			tempArray.push(doc[0].BUCAsmtDataOIviewCRM[i]);

		}
		//console.log(tempArray);
		doc[0].BUCAsmtDataOIviewCRM = tempArray;
		
		
		POCountryOtherFlag = 0;
		POCUOtherFlag = 0;
		POBUCOtherFlag  =0;
		
		tempArray = [];
		
		//Create the treetable array for Delivery
		for(var i=0; i < doc[0].BUCAsmtDataOIviewDelivery.length; i++){
		
			if(doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType == "Country Process" && POCountryOtherFlag  == 0){
				head = {
						"docid":doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType.replace(/ /g,''),
						"name":doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType,
						"ParentDocSubType":doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType,
						"bocExCount":"",
						"treeParent" : i
					};
				tempArray.push(head);
				POCountryOtherFlag  = 1;
			}

			if(doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType == "Controllable Unit" && POCUOtherFlag == 0){
				head = {
						"docid":doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType.replace(/ /g,''),
						"name":doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType,
						"ParentDocSubType":doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType,
						"bocExCount":"",
						"treeParent" : i
				};
				tempArray.push(head);

				POCUOtherFlag = 1;
			}

			tempArray.push(doc[0].BUCAsmtDataOIviewDelivery[i]);

		}
		//console.log(tempArray);
		doc[0].BUCAsmtDataOIviewDelivery = tempArray;
		
	
		
}catch(e){
	console.log("error at [class-performanceoverview][getCPANDCUPerformanceIndicatorsAndOthers]: "+e);
}
		//fieldCalc.getAssessments check if brings all documents
		/*
		 * it has the same criteria as the last table, table 3, minus the BU Country 
10:21:30 AM: genonms@ph.ibm.com - Minerva S Genon/Philippines/IBM: adn they also differ in the data displayed 
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
