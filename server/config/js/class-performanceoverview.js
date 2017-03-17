/*******************************************************************************
 *
 * Assessment code for MIRA Web Developed by : Carlos Ramirez Date: 11 Jan 2017
 *
 */



var util = require('./class-utility.js');
//var fieldCalc = require('./class-fieldcalc.js');


var calculateWeightedAuditScore =function (CUMaxScore, CUScore){
	var WeightedAuditScore = 0;

	if (isNaN(CUMaxScore))
		CUMaxScore = parseInt(CUMaxScore);

	if (isNaN(CUScore))
		CUScore = parseInt(CUScore);

	if(CUMaxScore == 0 || CUMaxScore == "" || totalCUScore == "") {
		weightedScore = "";
	}
	else
		WeightedAuditScore = ((CUScore /CUMaxScore)*100).toFixed(1);



	return WeightedAuditScore.toString();
}

var getCatSumAuditSc = function(view, Type) {
	var count = 0;
	try {
		for (var i = 0; i < view.length; i++) {

			if (view[i].ParentDocSubType ==  Type) {
				count += parseFloat(view[i].auditScore);

			}
		}
		return count.toFixed(1).toString();

	} catch (e) {
		console.log("error at [class-performanceoverview][getCatSumbocEx]: "+ e);
		return 0;
	}

}

var getCatSumbocEx = function(view, Type) {
	var count = 0;
	try {

		for (var i = 0; i < view.length; i++) {

			if (view[i].ParentDocSubType == Type
					&& view[i].bocExCount != undefined
					&& view[i].bocExCount != "") {
				if (view[i].bocExCount == 1) {
					count++;
				}

			}

		}

		return count;

	} catch (e) {
		console.log("error at [class-performanceoverview][getCatSumbocEx]: "
				+ e);
		return 0;
	}

}

var getCatSumRisk = function(BUCAsmtDataPIview, ParentDocSubType) {
	var count = 0;
	try {
		for (var i = 0; i < BUCAsmtDataPIview.length; i++) {

			if (BUCAsmtDataPIview[i].ParentDocSubType == ParentDocSubType) {
				count += parseInt(BUCAsmtDataPIview[i].msdRisk);

			}
		}
		return count;

	} catch (e) {
		console
				.log("error at [class-performanceoverview][getCatSumRisk]: "
						+ e);
		return 0;
	}
}

var getCatSumMSAC = function(BUCAsmtDataPIview, ParentDocSubType) {
	var count = 0;
	try {
		for (var i = 0; i < BUCAsmtDataPIview.length; i++) {

			if (BUCAsmtDataPIview[i].ParentDocSubType == ParentDocSubType) {
				count += parseInt(BUCAsmtDataPIview[i].msdMSAC);

			}
		}
		return count;

	} catch (e) {
		console
				.log("error at [class-performanceoverview][getCatSumMSAC]: "
						+ e);
		return 0;
	}
}

var getOpenIssuePerAssessment = function(RiskView1Data, reviewParam,
		assessmentDoc) {

	if (assessmentDoc.ParentDocSubType == "Controllable Unit") {

		if (RiskView1Data.country != undefined) {
			if (RiskView1Data.controllableUnit == reviewParam)
				return true;
			else
				return false;
		} else
			return false;

	} else if (assessmentDoc.ParentDocSubType == "Country Process") {

		if (RiskView1Data.country != undefined
				&& RiskView1Data.process != undefined) {

			if (RiskView1Data.country == reviewParam
					&& RiskView1Data.process == assessmentDoc.GlobalProcess)
				return true;
			else
				return false;
		} else
			return false;

	}

}


var performanceoverviewcountry = {

	getCatSize : function(view) {
		var count = 0;

		for (var i = 0; i < view.length; i++) {

			if (!isNaN(view[i].treeParent))
				count++;
		}

		return count;
	},

	calculateCHQInternalAuditScoreAssessmentLevel: function(doc,assessment,fieldCalc){
		var result = 0;
		var CUScore = 0;
		var MaxScore = 0;
		var auditScoreArray = [];
			//get the corresponding audits record per assessment
			if(assessment.ParentDocSubType == "Country Process" || assessment.ParentDocSubType == "Controllable Unit"){
				for(var i=0;i<doc[0].InternalAuditData.length;i++){
					//for internal audit comparation
					if(assessment.parentid == doc[0].InternalAuditData[i].parentid)
						auditScoreArray.push(doc[0].InternalAuditData[i]);
					//for local audit comparation
					if(assessment._id == doc[0].InternalAuditData[i].parentid)
						auditScoreArray.push(doc[0].InternalAuditData[i]);
				}

			}




			for(var j=0;j<auditScoreArray.length;j++){
				if(!isNaN(fieldCalc.getCUMaxScore(auditScoreArray[j].size)) && auditScoreArray[j].rating !== undefined )
					if(auditScoreArray[j].rating == "Sat" || auditScoreArray[j].rating == "Marg" || auditScoreArray[j].rating == "Unsat"){
						var tempMaxScore =  fieldCalc.getCUMaxScore(auditScoreArray[j].size);
						var tempCUScore =	fieldCalc.getCUScore(auditScoreArray[j].rating,tempMaxScore);
					//	console.log("tempMax "+tempMaxScore);
					//	console.log("tempScore "+tempCUScore);
						CUScore += tempCUScore;
						MaxScore += tempMaxScore;

					}

			}

		/*	if(assessment._id == "4c18f7bb2a46282782b6e84e90e8e235"){

				console.log(assessment.parentid );
				console.log(auditScoreArray);
				console.log("CUSCORE "+CUScore);
				console.log("MAXScore"+MaxScore);
				console.log("array size "+auditScoreArray.length);
			}
			*/


			if(MaxScore != 0)
				result = (CUScore/MaxScore)
				else
					result = 0;
			//total score / total max score


		return result.toFixed(1).toString();
	},

 buildPerformanceTabGP : function(db, doc,defViewRow,fieldCalc) {

		// 	performanceoverviewcountry.getKFCRDefectRate(db,doc);
		// performanceoverviewcountry.getKCODefectRate(db,doc);
		if (doc[0].KCODefectRate !== undefined && doc[0].KCODefectRate !== "") {
			doc[0].KCODefectRate = (parseFloat(doc[0].KCODefectRate) * 100).toFixed(1);
			if (doc[0].KCODefectRate == 0) {
				doc[0].KCODefectRate = parseFloat(doc[0].KCODefectRate).toFixed(0);
			}
		}
		if (doc[0].KCFRDefectRate !== undefined && doc[0].KCFRDefectRate !== "") {
			doc[0].KCFRDefectRate = (parseFloat(doc[0].KCFRDefectRate) * 100).toFixed(1);
			if (doc[0].KCFRDefectRate == 0) {
				doc[0].KCFRDefectRate = parseFloat(doc[0].KCFRDefectRate).toFixed(0);
			}
		}

		performanceoverviewcountry.getMissedRisks(db,doc);
		performanceoverviewcountry.getMSACCommitmentsCount(db,doc);

		performanceoverviewcountry.getCPANDCUPerformanceIndicators(db,doc);
		performanceoverviewcountry.getCPANDCUPerformanceIndicatorsAndOthers(db,doc);

		if (performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataPIview) < defViewRow) {

			if (doc[0].BUCAsmtDataPIview.length == 0) {
				doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,defViewRow);
			} else {

				fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(defViewRow-performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataPIview)));

			}
		}

		if (performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataOIview) < defViewRow) {
			if (doc[0].BUCAsmtDataOIview.length == 0) {
				doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,defViewRow);
			} else {
				fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(defViewRow-performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataOIview)));
			}
		}

 },

  buildPerformanceTab : function(db, doc,defViewRow,fieldCalc) {


		performanceoverviewcountry.getKFCRDefectRate(db,doc);
		performanceoverviewcountry.getKCODefectRate(db,doc);
		performanceoverviewcountry.getMissedRisks(db,doc);
		performanceoverviewcountry.getMSACCommitmentsCount(db,doc);


		if (doc[0].MIRABusinessUnit == "GTS") {
			performanceoverviewcountry.createTablesData(doc);
			performanceoverviewcountry.getCPANDCUPerformanceIndicatorsGTS(db,doc);
			performanceoverviewcountry.getCPANDCUPerformanceIndicatorsAndOthersGTS(db,doc);


			if (performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataPIviewCRM) < defViewRow) {
				if (doc[0].BUCAsmtDataPIviewCRM.length == 0) {
					doc[0].BUCAsmtDataPIviewCRM = fieldCalc.addTestViewData(8,defViewRow);
				} else {
					fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIviewCRM,8,(defViewRow-performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataPIviewCRM)));
				}
			}


			if (performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataPIviewDelivery) < defViewRow) {
				if (doc[0].BUCAsmtDataPIviewDelivery.length == 0) {
					doc[0].BUCAsmtDataPIviewDelivery = fieldCalc.addTestViewData(8,defViewRow);
				} else {
					fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIviewDelivery,8,(defViewRow-performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataPIviewDelivery)));
				}
			}

			if (performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataOIviewCRM) < defViewRow) {
				if (doc[0].BUCAsmtDataOIviewCRM.length == 0) {
					doc[0].BUCAsmtDataOIviewCRM = fieldCalc.addTestViewData(8,defViewRow);
				} else {
					fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIviewCRM,8,(defViewRow-performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataOIviewCRM)));
				}
			}

			if (performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataOIviewDelivery) < defViewRow) {
				if (doc[0].BUCAsmtDataOIviewDelivery.length == 0) {
					doc[0].BUCAsmtDataOIviewDelivery = fieldCalc.addTestViewData(8,defViewRow);
				} else {
					fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIviewDelivery,8,(defViewRow-performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataOIviewDelivery)));
				}
			}

			//Summary tab calculations for KFCR and KCO
			 if(doc[0].MissedOpenIssueCountSOD != "" && doc[0].MissedOpenIssueCountCRM != "")
					doc[0].MissedOpenIssueCount =  (parseInt(doc[0].MissedOpenIssueCountSOD ) + parseInt(doc[0].MissedOpenIssueCountCRM)).toString();
			 else
			 	if(doc[0].MissedOpenIssueCountCRM != "" )
			 		doc[0].MissedOpenIssueCount = (parseInt(doc[0].MissedOpenIssueCountCRM) + 0).toString();
			 	else
			 		doc[0].MissedOpenIssueCount = (0 + parseInt(doc[0].MissedOpenIssueCountSOD)).toString();
			 
			 if(doc[0].MissedMSACSatCountSOD != "" && doc[0].MissedMSACSatCountCRM != "")
					doc[0].MissedMSACSatCount =  (parseInt(doc[0].MissedMSACSatCountSOD ) + parseInt(doc[0].MissedMSACSatCountCRM)).toString();
			 else
			 	if(doc[0].MissedOpenIssueCountCRM != "" )
			 		doc[0].MissedMSACSatCount = (parseInt(doc[0].MissedMSACSatCountCRM) + 0).toString();
			 	else
			 		doc[0].MissedMSACSatCount = (0 + parseInt(doc[0].MissedMSACSatCountSOD)).toString();
		
			
			
			
					//Summary tab calculations for KFCR and KCO
				// if(doc[0].KCFRDefectRateCRM != "" && doc[0].KCFRDefectRateSOD != "")
				// 	doc[0].KCFRDefectRate = (parseInt(doc[0].KCFRDefectRateCRM) + parseInt(doc[0].KCFRDefectRateSOD)).toString();
				// else
				// 	if(doc[0].KCFRDefectRateCRM != "" )
				// 		doc[0].KCFRDefectRate = (parseInt(doc[0].KCFRDefectRateCRM) + 0).toString();
				// 	else
				// 		doc[0].KCFRDefectRate = (0 + parseInt(doc[0].KCFRDefectRateSOD)).toString();
				//
				//
				// 	doc[0].KCODefectRate =  (parseInt(doc[0].KCODefectRateCRM) + parseInt(doc[0].KCODefectRateSOD)).toString();
				//
				// 	if(doc[0].KCODefectRateCRM != "" && doc[0].KCODefectRateSOD != "")
				// 		doc[0].KCODefectRate = (parseInt(doc[0].KCODefectRateCRM) + parseInt(doc[0].KCODefectRateSOD)).toString();
				// 	else
				// 		if(doc[0].KCODefectRateCRM != "" )
				// 			doc[0].KCODefectRate = (parseInt(doc[0].KCODefectRateCRM) + 0).toString();
				// 		else
				// 			doc[0].KCODefectRate = (0 + parseInt(doc[0].KCODefectRateSOD)).toString();

		}
		else{// GBS and GTS trans

			performanceoverviewcountry.getCPANDCUPerformanceIndicators(db,doc);
			performanceoverviewcountry.getCPANDCUPerformanceIndicatorsAndOthers(db,doc);


			if (performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataPIview) < defViewRow) {

				if (doc[0].BUCAsmtDataPIview.length == 0) {
					doc[0].BUCAsmtDataPIview = fieldCalc.addTestViewData(8,defViewRow);
				} else {

					fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataPIview,8,(defViewRow-performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataPIview)));

				}
			}

			if (performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataOIview) < defViewRow) {
				if (doc[0].BUCAsmtDataOIview.length == 0) {
					doc[0].BUCAsmtDataOIview = fieldCalc.addTestViewData(8,defViewRow);
				} else {
					fieldCalc.addTestViewDataPadding(doc[0].BUCAsmtDataOIview,8,(defViewRow-performanceoverviewcountry.getCatSize(doc[0].BUCAsmtDataOIview)));
				}
			}


		}


	},

	getKFCRDefectRate : function(db, doc) {

		var KCFRDefectRateCRM = 0;
		var KCFRDefectRateSOD = 0;
		var KCFRDefectRateCRMDefectCount = 0;
		var KCFRDefectRateCRMTestCount = 0;
		var KCFRDefectRateSODDefectCount = 0;
		var KCFRDefectRateSODTestCount = 0;
		var CRMtestPerformed = false;
		var SODtestPerformed = false;

		var KCFRDefectCount = 0;
		var KCFRTestCount = 0;
		var KFCRDefectRate = "";
		var testPerformed = false;

		try {

			// Calculate for GTS
			if (doc[0].MIRABusinessUnit == "GTS" && doc[0].ParentDocSubType !="Global Process") {

				// obtain defect and test count from the
				// components(countryControls) for CRM
				for (var i = 0; i < doc[0].CountryControlsDataCRM.length; i++) {

					if (doc[0].CountryControlsDataCRM[i].controlType == 'KCFR') {

						if (!isNaN(parseInt(doc[0].CountryControlsDataCRM[i].numDefects))) {
							KCFRDefectRateCRMDefectCount += parseInt(doc[0].CountryControlsDataCRM[i].numDefects);

						}

						if (!isNaN(parseInt(doc[0].CountryControlsDataCRM[i].numActualTests))) {
							KCFRDefectRateCRMTestCount += parseInt(doc[0].CountryControlsDataCRM[i].numActualTests);
							CRMtestPerformed = true;
						}
					}
				}

				if (CRMtestPerformed == true) {
					if (KCFRDefectRateCRMTestCount > 0) {
						KCFRDefectRateCRM = ((KCFRDefectRateCRMDefectCount / KCFRDefectRateCRMTestCount) * 100).toFixed(1).toString();
					} else
						KCFRDefectRateCRM = "0";

				} else {
					KCFRDefectRateCRM = "";
				}

				doc[0].KCFRDefectRateCRM = KCFRDefectRateCRM;

				// obtain defect and test count from the
				// components(countryControls) for Delivery
				for (var i = 0; i < doc[0].CountryControlsDataDelivery.length; i++) {

					if (doc[0].CountryControlsDataDelivery[i].controlType == 'KCFR') {

						if (!isNaN(parseInt(doc[0].CountryControlsDataDelivery[i].numDefects)))
							KCFRDefectRateSODDefectCount += parseInt(doc[0].CountryControlsDataDelivery[i].numDefects);

						if (!isNaN(parseInt(doc[0].CountryControlsDataDelivery[i].numActualTests))) {
							KCFRDefectRateSODTestCount += parseInt(doc[0].CountryControlsDataDelivery[i].numActualTests);
							SODtestPerformed = true;
						}
					}
				}

				if (SODtestPerformed == true) {
					if (KCFRDefectRateSODTestCount > 0) {
						KCFRDefectRateSOD = ((KCFRDefectRateSODDefectCount / KCFRDefectRateSODTestCount) * 100).toFixed(1).toString();
					} else
						KCFRDefectRateSOD = "0";

				} else {
					KCFRDefectRateSOD = "";
				}

				doc[0].KCFRDefectRateSOD = KCFRDefectRateSOD;

			}


			// Calculate for GBS and GTS

			// obtain defect and test count from the
			// components(countryControls)
			for (var i = 0; i < doc[0].CountryControlsData.length; i++) {
				//  console.log(doc[0].CountryControlsData[i]);
				if (doc[0].CountryControlsData[i].controlType == 'KCFR') {
					// console.log("KCFR numDefects: " + doc[0].CountryControlsData[i].numDefects);
					// console.log("KCFR numActualTests: " + doc[0].CountryControlsData[i].numActualTests);
					if (!isNaN(parseInt(doc[0].CountryControlsData[i].numDefects)))
						KCFRDefectCount += parseInt(doc[0].CountryControlsData[i].numDefects);

					if (!isNaN(parseInt(doc[0].CountryControlsData[i].numActualTests))) {
						KCFRTestCount += parseInt(doc[0].CountryControlsData[i].numActualTests);
						testPerformed = true;
					}
				}
			}

			if (testPerformed == true) {
				if (KCFRTestCount > 0) {
					KFCRDefectRate = ((KCFRDefectCount / KCFRTestCount) * 100).toFixed(1).toString();
				} else
					KFCRDefectRate = "0";

			} else {
				KFCRDefectRate = "";
			}
			doc[0].KCFRDefectRate = KFCRDefectRate;

		} catch (e) {
			console
					.log("error at [class-performanceoverview][getKFCRDefectRate]: "
							+ e);
		}

	},

	getKCODefectRate : function(db, doc) {

		var KCODefectRateCRM = 0;
		var KCODefectRateSOD = 0;
		var KCODefectRateCRMDefectCount = 0;
		var KCODefectRateCRMTestCount = 0;
		var KCODefectRateSODDefectCount = 0;
		var KCODefectRateSODTestCount = 0;
		var CRMtestPerformed = false;
		var SODtestPerformed = false;

		var KCODefectCount = 0;
		var KCOTestCount = 0;
		var KCODefectRate = "";
		var testPerformed = false;

		try {




			if (doc[0].MIRABusinessUnit == "GTS" && doc[0].ParentDocSubType !="Global Process" ) {

				// obtain defect and test count from the
				// components(countryControls) for CRM
				for (var i = 0; i < doc[0].CountryControlsDataCRM.length; i++) {

					if (doc[0].CountryControlsDataCRM[i].controlType == 'KCO') {

						if (!isNaN(parseInt(doc[0].CountryControlsDataCRM[i].numDefects))) {
							KCODefectRateCRMDefectCount += parseInt(doc[0].CountryControlsDataCRM[i].numDefects);

						}

						if (!isNaN(parseInt(doc[0].CountryControlsDataCRM[i].numActualTests))) {
							KCODefectRateCRMTestCount += parseInt(doc[0].CountryControlsDataCRM[i].numActualTests);
							CRMtestPerformed = true;
						}
					}
				}

				if (CRMtestPerformed == true) {
					if (KCODefectRateCRMTestCount > 0) {
						KCODefectRateCRM = ((KCODefectRateCRMDefectCount / KCODefectRateCRMTestCount) * 100).toFixed(1).toString();
					} else
						KCODefectRateCRM = "0";

				} else {
					KCODefectRateCRM = "";
				}

				doc[0].KCODefectRateCRM = KCODefectRateCRM;

				// obtain defect and test count from the
				// components(countryControls) for Delivery
				for (var i = 0; i < doc[0].CountryControlsDataDelivery.length; i++) {

					if (doc[0].CountryControlsDataDelivery[i].controlType == 'KCO') {

						if (!isNaN(parseInt(doc[0].CountryControlsDataDelivery[i].numDefects)))
							KCODefectRateSODDefectCount += parseInt(doc[0].CountryControlsDataDelivery[i].numDefects);

						if (!isNaN(parseInt(doc[0].CountryControlsDataDelivery[i].numActualTests))) {
							KCODefectRateSODTestCount += parseInt(doc[0].CountryControlsDataDelivery[i].numActualTests);
							SODtestPerformed = true;
						}
					}
				}

				if (SODtestPerformed == true) {
					if (KCODefectRateSODTestCount > 0) {
						KCODefectRateSOD = ((KCODefectRateSODDefectCount / KCODefectRateSODTestCount) * 100).toFixed(1).toString();
					} else
						KCODefectRateSOD = "0";

				} else {
					KCODefectRateSOD = "";
				}

				doc[0].KCODefectRateSOD = KCODefectRateSOD;

			}

			// Calculate total KCO and KCFR for GBS and GTS
			// obtain defect and test count from the
			// components(countryControls)
			for (var i = 0; i < doc[0].CountryControlsData.length; i++) {



				if (doc[0].CountryControlsData[i].controlType == 'KCO') {


					if (!isNaN(parseInt(doc[0].CountryControlsData[i].numDefects)))
						KCODefectCount += parseInt(doc[0].CountryControlsData[i].numDefects);

					if (!isNaN(parseInt(doc[0].CountryControlsData[i].numActualTests))) {
						KCOTestCount += parseInt(doc[0].CountryControlsData[i].numActualTests);
						testPerformed = true;
					}
				}
			}


			if (testPerformed == true) {
				if (KCOTestCount > 0) {
					KCODefectRate = ((KCODefectCount / KCOTestCount) * 100).toFixed(1).toString();
				} else
					KCODefectRate = "0";

				} else {
				KCODefectRate = "";
				}

				doc[0].KCODefectRate = KCODefectRate;

		} catch (e) {
			console.log("error at [class-performanceoverview][getKCODefectRate]: "+ e);
		}

	},

	GetCHQInternalAudit : function(db, doc) {
		// check with Chris you can discuss it with chris, he's assigned to the
		// BU Country A&R tab
	},

	getMissedRisksIndividual : function(RiskView1Data, assessmentDoc) {
		var counterRisks = 0;
		var reviewParam = "";

		try {

			for (var i = 0; i < RiskView1Data.length; i++) {

				// construc param depending on CU or CP since they are
				// calculated diff
				if (assessmentDoc.ParentDocSubType == "Controllable Unit") {

					reviewParam = assessmentDoc.AssessableUnitName;
				} else if (assessmentDoc.ParentDocSubType == "Country Process") {

					reviewParam = assessmentDoc.Country;
				}
				// console.log(reviewParam);
				// console.log(assessmentDoc._id);

				if (getOpenIssuePerAssessment(RiskView1Data[i], reviewParam,
						assessmentDoc)) {

					if (RiskView1Data[i].status != "Closed") {

						if (RiskView1Data[i].ctrg != "" && parseInt(RiskView1Data[i].ctrg) > 0) {
							counterRisks++;
						} else if (RiskView1Data[i].FlagTodaysDate == "1") {
							counterRisks++;
						}
						// if (RiskView1Data[i].ctrg != "") {
						// 	if (parseInt(RiskView1Data[i].ctrg) > 0
						// 			|| RiskView1Data[i].FlagTodaysDate == "1")
						// 		counterRisks++;
						// } else if (RiskView1Data[i].numMissedTasks != "") {
						// 	if (parseInt(RiskView1Data[i].numMissedTasks) > 0
						// 			|| RiskView1Data[i].FlagTodaysDate == "1")
						// 		counterRisks++;
						// } else if (RiskView1Data[i].FlagTodaysDate == "1")
						// 	counterRisks++;
					}

				}

			}
		} catch (e) {
			console
					.log("error at [class-performanceoverview][getMissedRisksIndividual]: "
							+ e);
			return "err";
		}

		return counterRisks.toString();
	},

	getMissedRisks : function(db, doc) {
		var currentDate = util.getDateTime("", "date")
		var counterRisks = 0;
		var counterRisksCRM = 0;
		var counterRisksDelivery = 0;

		// console.log(doc[0].RiskView1DataCRM); console.log("next");
		// console.log(doc[0].RiskView1DataDelivery);

		try {

			if (doc[0].MIRABusinessUnit == "GTS" && doc[0].ParentDocSubType !="Global Process") {

				// obtain defect and test count from the components(Open issue)
				// for CRM
				for (var i = 0; i < doc[0].RiskView1DataCRM.length; i++) {
					if (doc[0].RiskView1DataCRM[i].status != "Closed") {

						if (doc[0].RiskView1DataCRM[i].ctrg != "" && parseInt(doc[0].RiskView1DataCRM[i].ctrg) > 0) {
							counterRisksCRM++;
						} else if (doc[0].RiskView1DataCRM[i].FlagTodaysDate == "1") {
							counterRisksCRM++;
						}

						// if (doc[0].RiskView1DataCRM[i].ctrg != "") {
						// 	if (parseInt(doc[0].RiskView1DataCRM[i].ctrg) > 0
						// 			|| doc[0].RiskView1DataCRM[i].FlagTodaysDate == "1")
						// 		counterRisksCRM++;
						// } else if (doc[0].RiskView1DataCRM[i].numMissedTasks != "") {
						// 	if (parseInt(doc[0].RiskView1DataCRM[i].numMissedTasks) > 0
						// 			|| doc[0].RiskView1DataCRM[i].FlagTodaysDate == "1")
						// 		counterRisksCRM++;
						// } else if (doc[0].RiskView1DataCRM[i].FlagTodaysDate == "1")
						// 	counterRisksCRM++;

					}
				}

				doc[0].MissedOpenIssueCountCRM = counterRisksCRM.toString();

				// obtain defect and test count from the components(Open issue)
				// for CRM
				for (var i = 0; i < doc[0].RiskView1DataDelivery.length; i++) {
					if (doc[0].RiskView1DataDelivery[i].status != "Closed") {

						if (doc[0].RiskView1DataDelivery[i].ctrg != "" && parseInt(doc[0].RiskView1DataDelivery[i].ctrg) > 0) {
							counterRisksDelivery++;
						} else if (doc[0].RiskView1DataDelivery[i].FlagTodaysDate == "1") {
							counterRisksDelivery++;
						}

						// if (doc[0].RiskView1DataDelivery[i].ctrg != "") {
						// 	if (parseInt(doc[0].RiskView1DataDelivery[i].ctrg) > 0
						// 			|| doc[0].RiskView1DataDelivery[i].FlagTodaysDate == "1")
						// 		counterRisksDelivery++;
						// } else if (doc[0].RiskView1DataDelivery[i].numMissedTasks != "") {
						// 	if (parseInt(doc[0].RiskView1DataDelivery[i].numMissedTasks) > 0
						// 			|| doc[0].RiskView1DataDelivery[i].FlagTodaysDate == "1")
						// 		counterRisksDelivery++;
						// } else if (doc[0].RiskView1DataDelivery[i].FlagTodaysDate == "1")
						// 	counterRisksDelivery++;

					}
				}

				doc[0].MissedOpenIssueCountSOD = counterRisksDelivery.toString();

			} else {

				// obtain defect and test count from the components(Open issue)
				for (var i = 0; i < doc[0].RiskView1Data.length; i++) {
					if (doc[0].RiskView1Data[i].status != "Closed") {

						if (doc[0].RiskView1Data[i].ctrg != "" && parseInt(doc[0].RiskView1Data[i].ctrg) > 0) {
							counterRisks++;
						} else if (doc[0].RiskView1Data[i].FlagTodaysDate == "1") {
							counterRisks++;
						}
						// if (doc[0].RiskView1Data[i].ctrg != "") {
						// 	if (parseInt(doc[0].RiskView1Data[i].ctrg) > 0 || doc[0].RiskView1Data[i].FlagTodaysDate == "1")
						// 		counterRisks++;
						// } else if (doc[0].RiskView1Data[i].numMissedTasks != "") {
						// 	if (parseInt(doc[0].RiskView1Data[i].numMissedTasks) > 0 || doc[0].RiskView1Data[i].FlagTodaysDate == "1")
						// 		counterRisks++;
						// } else if (doc[0].RiskView1Data[i].FlagTodaysDate == "1")
						// 	counterRisks++;
						// if (new Date(doc[0].RiskView1Data[i].currentTargetDate).getTime() < new Date(currentDate).getTime()) {
						// 	counterRisks++;
						// }
					}
				}



				doc[0].MissedOpenIssueCount = counterRisks.toString();

			}

		} catch (e) {
			console
					.log("error at [class-performanceoverview][getMissedRisks]: "
							+ e);
		}


	},

	getMSACCOmmitmentsIndividual : function(AUData) {
		var count = 0;
		var currentDate = util.getDateTime("", "date")

		try {

			if (AUData.PeriodRating == "Marg" || AUData.PeriodRating == "Unsat") {
				if (AUData.AUStatus != "Retired") {
					if (AUData.Target2Sat != undefined
							&& AUData.Target2SatPrev != undefined) {
						if (AUData.Target2Sat != ""
								&& AUData.Target2SatPrev != "") {

							if ((new Date(AUData.Target2Sat).getTime() > new Date(
									AUData.Target2SatPrev).getTime())
									|| (new Date(AUData.Target2SatPrev)
											.getTime() < new Date(currentDate)
											.getTime())) {
								count++;
							}
						} else if (AUData.Target2SatPrev != "") {
							if ((new Date(AUData.Target2SatPrev).getTime() < new Date(
									currentDate).getTime())) {
								count++;
							}

						}

					}

				}
			}

			return count.toString();

		} catch (e) {
			console
					.log("error at [class-performanceoverview][getMSACCOmmitmentsIndividual]: "
							+ e);
		}

	},
	// summarize the missed commitments
	getMSACCommitmentsCount : function(db, doc) {
		var count = 0;
		var currentDate = util.getDateTime("", "date");
		var AUDataMSAC = [];
		try {

			if (doc[0].MIRABusinessUnit == "GTS" && doc[0].ParentDocSubType !="Global Process") {
				for (var i = 0; i < doc[0].RiskView1DataCRM.length; i++) {

					if (doc[0].RiskView1DataCRM[i].PeriodRating == "Marg"
							|| doc[0].RiskView1DataCRM[i].PeriodRating == "Unsat") {
						if (doc[0].RiskView1DataCRM[i].AUStatus != "Retired") {
							if (doc[0].RiskView1DataCRM[i].Target2Sat != undefined
									&& doc[0].RiskView1DataCRM[i].Target2SatPrev != undefined) {
								if (doc[0].RiskView1DataCRM[i].Target2Sat != ""
										&& doc[0].RiskView1DataCRM[i].Target2SatPrev != "") {

									if ((new Date(
											doc[0].RiskView1DataCRM[i].Target2Sat)
											.getTime() > new Date(
											doc[0].RiskView1DataCRM[i].Target2SatPrev)
											.getTime())
											|| (new Date(
													doc[0].RiskView1DataCRM[i].Target2SatPrev)
													.getTime() < new Date(
													currentDate).getTime())) {
										count++;
										AUDataMSAC
												.push(doc[0].RiskView1DataCRM[i]);
									}
								} else if (doc[0].RiskView1DataCRM[i].Target2SatPrev != "") {
									if ((new Date(
											doc[0].RiskView1DataCRM[i].Target2SatPrev)
											.getTime() < new Date(currentDate)
											.getTime())) {
										count++;
										AUDataMSAC
												.push(doc[0].RiskView1DataCRM[i]);
									}

								}

							}

						}
					}

				}

				doc[0].AUDataMSACCRM = AUDataMSAC;
				doc[0].MissedMSACSatCountCRM = count.toString();

				count = 0;
				AUDataMSAC = [];

				for (var i = 0; i < doc[0].RiskView1DataDelivery.length; i++) {

					if (doc[0].RiskView1DataDelivery[i].PeriodRating == "Marg"
							|| doc[0].RiskView1DataDelivery[i].PeriodRating == "Unsat") {
						if (doc[0].RiskView1DataDelivery[i].AUStatus != "Retired") {
							if (doc[0].RiskView1DataDelivery[i].Target2Sat != undefined
									&& doc[0].RiskView1DataDelivery[i].Target2SatPrev != undefined) {
								if (doc[0].RiskView1DataDelivery[i].Target2Sat != ""
										&& doc[0].RiskView1DataDelivery[i].Target2SatPrev != "") {

									if ((new Date(
											doc[0].RiskView1DataDelivery[i].Target2Sat)
											.getTime() > new Date(
											doc[0].RiskView1DataDelivery[i].Target2SatPrev)
											.getTime())
											|| (new Date(
													doc[0].RiskView1DataDelivery[i].Target2SatPrev)
													.getTime() < new Date(
													currentDate).getTime())) {
										count++;
										AUDataMSAC
												.push(doc[0].RiskView1DataDelivery[i]);
									}
								} else if (doc[0].RiskView1DataDelivery[i].Target2SatPrev != "") {
									if ((new Date(
											doc[0].RiskView1DataDelivery[i].Target2SatPrev)
											.getTime() < new Date(currentDate)
											.getTime())) {
										count++;
										AUDataMSAC
												.push(doc[0].RiskView1DataDelivery[i]);
									}

								}

							}

						}
					}

					doc[0].AUDataMSACSOD = AUDataMSAC;
					doc[0].MissedMSACSatCountSOD = count.toString();

					count = 0;
					AUDataMSAC = [];

				}

			}
			// For GBS and global process
			else {

				for (var i = 0; i < doc[0].asmtsdocs.length; i++) {
					if (doc[0].asmtsdocs[i].PeriodRating == "Marg" || doc[0].asmtsdocs[i].PeriodRating == "Unsat") {
						if (doc[0].asmtsdocs[i].Target2Sat != undefined && doc[0].asmtsdocs[i].Target2SatPrev != undefined) {
								if (doc[0].asmtsdocs[i].Target2Sat != "" && doc[0].asmtsdocs[i].Target2SatPrev != "") {
									if ((new Date(doc[0].asmtsdocs[i].Target2Sat).getTime() > new Date(doc[0].asmtsdocs[i].Target2SatPrev).getTime()) || (new Date(doc[0].asmtsdocs[i].Target2SatPrev).getTime() < new Date(currentDate).getTime() )) {
										count++;
										AUDataMSAC.push(doc[0].asmtsdocs[i]);
									}
								} else if (doc[0].asmtsdocs[i].Target2SatPrev != "") {
									if ((new Date(doc[0].asmtsdocs[i].Target2SatPrev).getTime() < new Date(currentDate).getTime())) {
										count++;
										AUDataMSAC.push(doc[0].asmtsdocs[i]);
									}
								}
						}
					}

				}
				doc[0].AUDataMSAC = AUDataMSAC;
				doc[0].MissedMSACSatCount = count.toString();
			}// else
		} catch (e) {
			console
					.log("error at [class-performanceoverview][getMSACCommitmentsCount]: "
							+ e);
		}


	},

	createTablesData : function(doc) {
		try {

			for (var i = 0; i < doc[0].asmtsdocsCRM.length; i++) {

				// get Open Issue count per child assessment for CRM
				doc[0].asmtsdocsCRM[i].MissedOpenIssueCount = performanceoverviewcountry
						.getMissedRisksIndividual(doc[0].RiskView1DataCRM,
								doc[0].asmtsdocsCRM[i]);
				// count for assessment OpenIssue CRM
				doc[0].MissedOpenIssueCountCRMDoc += parseInt(doc[0].asmtsdocsCRM[i].MissedOpenIssueCount);

				// get MSAC missed commitments for CRM
				doc[0].asmtsdocsCRM[i].MissedMSACSatCount = performanceoverviewcountry
						.getMSACCOmmitmentsIndividual(doc[0].asmtsdocsCRM[i]);
				// get MSAC missed commitments count for CRM
				if (doc[0].asmtsdocsCRM[i].MissedMSACSatCount)
					doc[0].MissedMSACSatCountCRMDoc += parseInt(doc[0].asmtsdocsCRM[i].MissedMSACSatCount);

				toadd = {
					"docid" : doc[0].asmtsdocsCRM[i]._id,
					"name" : doc[0].asmtsdocsCRM[i].AssessableUnitName,
					"ParentDocSubType" : doc[0].asmtsdocsCRM[i].ParentDocSubType,
					"ratingCQ" : doc[0].asmtsdocsCRM[i].PeriodRating,
					"ratingPQ1" : doc[0].asmtsdocsCRM[i].PeriodRatingPrev1,
					"ratingPQ2" : doc[0].asmtsdocsCRM[i].PeriodRatingPrev2,
					"ratingPQ3" : doc[0].asmtsdocsCRM[i].PeriodRatingPrev3,
					"ratingPQ4" : doc[0].asmtsdocsCRM[i].PeriodRatingPrev4,
					"kcfrDR" : doc[0].asmtsdocsCRM[i].KCFRDefectRate,
					"kcoDR" : doc[0].asmtsdocsCRM[i].KCODefectRate,
					"auditScore" : doc[0].asmtsdocsCRM[i].WeightedAuditScore,
					"msdRisk" : doc[0].asmtsdocsCRM[i].MissedOpenIssueCount,
					"msdMSAC" : doc[0].asmtsdocsCRM[i].MissedMSACSatCount,
					"treeParent" : doc[0].asmtsdocsCRM[i].ParentDocSubType
							.replace(/ /g, '')
				};
				doc[0].BUCAsmtDataPIviewCRM.push(toadd);

				// PO tab other indicators view CRM

				toadd = {
					"docid" : doc[0].asmtsdocsCRM[i]._id,
					"name" : doc[0].asmtsdocsCRM[i].AssessableUnitName,
					"ParentDocSubType" : doc[0].asmtsdocsCRM[i].ParentDocSubType,
					"bocExCount" : doc[0].asmtsdocsCRM[i].BOCExceptionCount,
					"treeParent" : doc[0].asmtsdocsCRM[i].ParentDocSubType
							.replace(/ /g, '')
				};

				if (doc[0].asmtsdocsCRM[i].OpMetric != undefined) {

					for (var j = 0; j < doc[0].asmtsdocsCRM[i].OpMetric.length; j++) {

						toadd[doc[0].asmtsdocsCRM[i].OpMetric[j].id + "Rating"] = doc[0].asmtsdocsCRM[i].OpMetric[j].rating;
						toadd["docid"] = doc[0].asmtsdocsCRM[i]._id;
						toadd["name"] = doc[0].asmtsdocsCRM[i].AssessableUnitName;
						toadd["ParentDocSubType"] = doc[0].asmtsdocsCRM[i].ParentDocSubType;
						toadd["bocExCount"] = doc[0].asmtsdocsCRM[i].BOCExceptionCount;
						toadd["treeParent"] = doc[0].asmtsdocsCRM[i].ParentDocSubType
								.replace(/ /g, '');

						// Basics of Control Exception Counter
						if (doc[0].asmtsdocsCRM[i].BOCExceptionCount == 1) {
							doc[0].BOCExceptionCountCRM++;
						}

					}

				}

				doc[0].BUCAsmtDataOIviewCRM.push(toadd);

				doc[0].BOCExceptionCountCRM = 0;
				doc[0].BOCExceptionCountSOD = 0

			}
			for (var i = 0; i < doc[0].asmtsdocsDelivery.length; i++) {

				// get Open Issue count per child assessment for Delivery
				doc[0].asmtsdocsDelivery[i].MissedOpenIssueCount = performanceoverviewcountry
						.getMissedRisksIndividual(doc[0].RiskView1DataDelivery,
								doc[0].asmtsdocsDelivery[i]);
				// count for assessment OpenIssue Delivery
				doc[0].MissedOpenIssueCountDeliveryDoc += parseInt(doc[0].asmtsdocsDelivery[i].MissedOpenIssueCount);

				// get MSAC missed commitments for CRM
				doc[0].asmtsdocsDelivery[i].MissedMSACSatCount = performanceoverviewcountry
						.getMSACCOmmitmentsIndividual(doc[0].asmtsdocsDelivery[i]);
				// get MSAC missed commitments count for CRM
				doc[0].MissedMSACSatCountDeliveryDoc += parseInt(doc[0].asmtsdocsDelivery[i].MissedMSACSatCount);

				toadd = {
					"docid" : doc[0].asmtsdocsDelivery[i]._id,
					"name" : doc[0].asmtsdocsDelivery[i].AssessableUnitName,
					"ParentDocSubType" : doc[0].asmtsdocsDelivery[i].ParentDocSubType,
					"ratingCQ" : doc[0].asmtsdocsDelivery[i].PeriodRating,
					"ratingPQ1" : doc[0].asmtsdocsDelivery[i].PeriodRatingPrev1,
					"ratingPQ2" : doc[0].asmtsdocsDelivery[i].PeriodRatingPrev2,
					"ratingPQ3" : doc[0].asmtsdocsDelivery[i].PeriodRatingPrev3,
					"ratingPQ4" : doc[0].asmtsdocsDelivery[i].PeriodRatingPrev4,
					"kcfrDR" : doc[0].asmtsdocsDelivery[i].KCFRDefectRate,
					"kcoDR" : doc[0].asmtsdocsDelivery[i].KCODefectRate,
					"auditScore" : doc[0].asmtsdocsDelivery[i].WeightedAuditScore,
					"msdRisk" : doc[0].asmtsdocsDelivery[i].MissedOpenIssueCount,
					"msdMSAC" : doc[0].asmtsdocsDelivery[i].MissedMSACSatCount,
					"treeParent" : doc[0].asmtsdocsDelivery[i].ParentDocSubType
							.replace(/ /g, '')
				};

				doc[0].BUCAsmtDataPIviewDelivery.push(toadd);

				// PO tab other indicators view Delivery

				toadd = {
					"docid" : doc[0].asmtsdocsDelivery[i]._id,
					"name" : doc[0].asmtsdocsDelivery[i].AssessableUnitName,
					"ParentDocSubType" : doc[0].asmtsdocsDelivery[i].ParentDocSubType,
					"bocExCount" : doc[0].asmtsdocsDelivery[i].BOCExceptionCount,
					"treeParent" : doc[0].asmtsdocsDelivery[i].ParentDocSubType
							.replace(/ /g, '')
				};

				if (doc[0].asmtsdocsDelivery[i].OpMetric != undefined) {

					for (var j = 0; j < doc[0].asmtsdocsDelivery[i].OpMetric.length; j++) {

						toadd[doc[0].asmtsdocsDelivery[i].OpMetric[j].id
								+ "Rating"] = doc[0].asmtsdocsDelivery[i].OpMetric[j].rating;
						toadd["docid"] = doc[0].asmtsdocsDelivery[i]._id;
						toadd["name"] = doc[0].asmtsdocsDelivery[i].AssessableUnitName;
						toadd["ParentDocSubType"] = doc[0].asmtsdocsDelivery[i].ParentDocSubType;
						toadd["bocExCount"] = doc[0].asmtsdocsDelivery[i].BOCExceptionCount;
						toadd["treeParent"] = doc[0].asmtsdocsDelivery[i].ParentDocSubType
								.replace(/ /g, '');

						// Basics of Control Exception Counter
						if (doc[0].asmtsdocsDelivery[i].BOCExceptionCount == 1) {
							doc[0].BOCExceptionCountSOD++;
						}

					}

				}

				doc[0].BUCAsmtDataOIviewDelivery.push(toadd);

			}

		} catch (e) {
			console
					.log("error at [class-performanceoverview][createTablesData]: "
							+ e);
		}

	},

	getCPANDCUPerformanceIndicatorsGTS : function(db, doc) {
		// Sort for correct display
		var POCountryFlag = 0, POCUFlag = 0, POBUCFlag = 0, POIMTFlag=0, POIOTFlag =0;
		var tempArray = [];
		var head = {};

		try {
			// Sort the array CRM
			doc[0].BUCAsmtDataPIviewCRM
					.sort(function(a, b) {
						var nameA = a.ParentDocSubType.toLowerCase(), nameB = b.ParentDocSubType
								.toLowerCase()
						if (nameA > nameB) // sort string descending
							return -1
						if (nameA < nameB)
							return 1
						return 0 // default return value (no sorting)
					});

			// Sort the array Delivery
			doc[0].BUCAsmtDataPIviewDelivery
					.sort(function(a, b) {
						var nameA = a.ParentDocSubType.toLowerCase(), nameB = b.ParentDocSubType
								.toLowerCase()
						if (nameA > nameB) // sort string descending
							return -1
						if (nameA < nameB)
							return 1
						return 0 // default return value (no sorting)
					});

			// Add BU country itself to the tree

			head = {
				"docid" : doc[0]._id,
				"name" : doc[0].AssessableUnitName,
				"ParentDocSubType" : doc[0].ParentDocSubType,
				"ratingCQ" : doc[0].PeriodRating,
				"ratingPQ1" : doc[0].PeriodRatingPrev1,
				"ratingPQ2" : doc[0].PeriodRatingPrev2,
				"ratingPQ3" : doc[0].PeriodRatingPrev3,
				"ratingPQ4" : doc[0].PeriodRatingPrev4,
				"kcfrDR" : doc[0].KCFRDefectRate,
				"kcoDR" : doc[0].KCODefectRate,
				"auditScore" : doc[0].WeightedAuditScore,
				"msdRisk" : doc[0].MissedOpenIssueCountCRMDoc,
				"msdMSAC" : doc[0].MissedMSACSatCountCRMDoc,
				"treeParent" : doc[0].ParentDocSubType.replace(/ /g, '')
			};
			doc[0].BUCAsmtDataPIviewCRM.push(head);

			head = {
				"docid" : doc[0]._id,
				"name" : doc[0].AssessableUnitName,
				"ParentDocSubType" : doc[0].ParentDocSubType,
				"ratingCQ" : doc[0].PeriodRating,
				"ratingPQ1" : doc[0].PeriodRatingPrev1,
				"ratingPQ2" : doc[0].PeriodRatingPrev2,
				"ratingPQ3" : doc[0].PeriodRatingPrev3,
				"ratingPQ4" : doc[0].PeriodRatingPrev4,
				"kcfrDR" : doc[0].KCFRDefectRate,
				"kcoDR" : doc[0].KCODefectRate,
				"auditScore" : doc[0].WeightedAuditScore,
				"msdRisk" : doc[0].MissedOpenIssueCountDeliveryDoc,
				"msdMSAC" : doc[0].MissedMSACSatCountDeliveryDoc,
				"treeParent" : doc[0].ParentDocSubType.replace(/ /g, '')
			};
			doc[0].BUCAsmtDataPIviewDelivery.push(head);

			// Create the treetable array for CRM
			for (var i = 0; i < doc[0].BUCAsmtDataPIviewCRM.length; i++) {

				if (doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType == "BU IMT"
					&& POIMTFlag == 0) {
				head = {
					"docid" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType
							.replace(/ /g, ''),
					"name" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
					"ParentDocSubType" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
					"ratingCQ" : "",
					"ratingPQ1" : "",
					"ratingPQ2" : "",
					"ratingPQ3" : "",
					"ratingPQ4" : "",
					"kcfrDR" : "",
					"kcoDR" : "",
					"auditScore" : "",
					"msdRisk" : getCatSumRisk(doc[0].BUCAsmtDataPIviewCRM,
							doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
					"msdMSAC" : getCatSumMSAC(doc[0].BUCAsmtDataPIviewCRM,
							doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
					"treeParent" : i
				};
				POIMTFlag = 1;
				tempArray.push(head);
			}

				if (doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType == "BU IOT"
					&& POIOTFlag == 0) {
				head = {
					"docid" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType
							.replace(/ /g, ''),
					"name" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
					"ParentDocSubType" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
					"ratingCQ" : "",
					"ratingPQ1" : "",
					"ratingPQ2" : "",
					"ratingPQ3" : "",
					"ratingPQ4" : "",
					"kcfrDR" : "",
					"kcoDR" : "",
					"auditScore" : "",
					"msdRisk" : getCatSumRisk(doc[0].BUCAsmtDataPIviewCRM,
							doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
					"msdMSAC" : getCatSumMSAC(doc[0].BUCAsmtDataPIviewCRM,
							doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
					"treeParent" : i
				};
				POIOTFlag = 1;
				tempArray.push(head);
			}


				if (doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType == "Country Process"
						&& POCountryFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
						"ratingCQ" : "",
						"ratingPQ1" : "",
						"ratingPQ2" : "",
						"ratingPQ3" : "",
						"ratingPQ4" : "",
						"kcfrDR" : "",
						"kcoDR" : "",
						"auditScore" : getCatSumAuditSc(doc[0].BUCAsmtDataPIviewCRM,
								doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
						"msdRisk" : getCatSumRisk(doc[0].BUCAsmtDataPIviewCRM,
								doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
						"msdMSAC" : getCatSumMSAC(doc[0].BUCAsmtDataPIviewCRM,
								doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
						"treeParent" : i
					};
					POCountryFlag = 1;
					tempArray.push(head);
				}

				if (doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType == "Controllable Unit"
						&& POCUFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
						"ratingCQ" : "",
						"ratingPQ1" : "",
						"ratingPQ2" : "",
						"ratingPQ3" : "",
						"ratingPQ4" : "",
						"kcfrDR" : "",
						"kcoDR" : "",
						"auditScore" : getCatSumAuditSc(doc[0].BUCAsmtDataPIviewCRM,
								doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
						"msdRisk" : getCatSumRisk(doc[0].BUCAsmtDataPIviewCRM,
								doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
						"msdMSAC" : getCatSumMSAC(doc[0].BUCAsmtDataPIviewCRM,
								doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
						"treeParent" : i
					};
					POCUFlag = 1;
					tempArray.push(head);
				}

				if (doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType == "BU Country"
						&& POBUCFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType,
						"ratingCQ" : "",
						"ratingPQ1" : "",
						"ratingPQ2" : "",
						"ratingPQ3" : "",
						"ratingPQ4" : "",
						"kcfrDR" : "",
						"kcoDR" : "",
						"auditScore" : getCatSumAuditSc(doc[0].BUCAsmtDataPIviewCRM,
								doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
						"msdRisk" : getCatSumRisk(doc[0].BUCAsmtDataPIviewCRM,
								doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
						"msdMSAC" : getCatSumMSAC(doc[0].BUCAsmtDataPIviewCRM,
								doc[0].BUCAsmtDataPIviewCRM[i].ParentDocSubType),
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
			POBUCFlag = 0;
			POIMTFlag = 0;
			POIOTFlag = 0;

			// Create the treetable array for Delivery
			for (var i = 0; i < doc[0].BUCAsmtDataPIviewDelivery.length; i++) {

				if (doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType == "BU IMT"
					&& POIMTFlag == 0) {
				head = {
					"docid" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType
							.replace(/ /g, ''),
					"name" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
					"ParentDocSubType" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
					"ratingCQ" : "",
					"ratingPQ1" : "",
					"ratingPQ2" : "",
					"ratingPQ3" : "",
					"ratingPQ4" : "",
					"kcfrDR" : "",
					"kcoDR" : "",
					"auditScore" : "",
					"msdRisk" : getCatSumRisk(
							doc[0].BUCAsmtDataPIviewDelivery,
							doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
					"msdMSAC" : getCatSumMSAC(
							doc[0].BUCAsmtDataPIviewDelivery,
							doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
					"treeParent" : i
				};
				POIMTFlag = 1;
				tempArray.push(head);
			}

				if (doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType == "BU IOT"
					&& POIOTFlag == 0) {
				head = {
					"docid" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType
							.replace(/ /g, ''),
					"name" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
					"ParentDocSubType" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
					"ratingCQ" : "",
					"ratingPQ1" : "",
					"ratingPQ2" : "",
					"ratingPQ3" : "",
					"ratingPQ4" : "",
					"kcfrDR" : "",
					"kcoDR" : "",
					"auditScore" : "",
					"msdRisk" : getCatSumRisk(
							doc[0].BUCAsmtDataPIviewDelivery,
							doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
					"msdMSAC" : getCatSumMSAC(
							doc[0].BUCAsmtDataPIviewDelivery,
							doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
					"treeParent" : i
				};
				POIOTFlag = 1;
				tempArray.push(head);
			}

				if (doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType == "Country Process"
						&& POCountryFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
						"ratingCQ" : "",
						"ratingPQ1" : "",
						"ratingPQ2" : "",
						"ratingPQ3" : "",
						"ratingPQ4" : "",
						"kcfrDR" : "",
						"kcoDR" : "",
						"auditScore" : getCatSumAuditSc(doc[0].BUCAsmtDataPIviewDelivery,
								doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
						"msdRisk" : getCatSumRisk(
								doc[0].BUCAsmtDataPIviewDelivery,
								doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
						"msdMSAC" : getCatSumMSAC(
								doc[0].BUCAsmtDataPIviewDelivery,
								doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
						"treeParent" : i
					};
					POCountryFlag = 1;
					tempArray.push(head);
				}

				if (doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType == "Controllable Unit"
						&& POCUFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
						"ratingCQ" : "",
						"ratingPQ1" : "",
						"ratingPQ2" : "",
						"ratingPQ3" : "",
						"ratingPQ4" : "",
						"kcfrDR" : "",
						"kcoDR" : "",
						"auditScore" : getCatSumAuditSc(doc[0].BUCAsmtDataPIviewDelivery,
								doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
						"msdRisk" : getCatSumRisk(
								doc[0].BUCAsmtDataPIviewDelivery,
								doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
						"msdMSAC" : getCatSumMSAC(
								doc[0].BUCAsmtDataPIviewDelivery,
								doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
						"treeParent" : i
					};
					POCUFlag = 1;
					tempArray.push(head);
				}

				if (doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType == "BU Country"
						&& POBUCFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType,
						"ratingCQ" : "",
						"ratingPQ1" : "",
						"ratingPQ2" : "",
						"ratingPQ3" : "",
						"ratingPQ4" : "",
						"kcfrDR" : "",
						"kcoDR" : "",
						"auditScore" : getCatSumAuditSc(doc[0].BUCAsmtDataPIviewDelivery,
								doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
						"msdRisk" : getCatSumRisk(
								doc[0].BUCAsmtDataPIviewDelivery,
								doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
						"msdMSAC" : getCatSumMSAC(
								doc[0].BUCAsmtDataPIviewDelivery,
								doc[0].BUCAsmtDataPIviewDelivery[i].ParentDocSubType),
						"treeParent" : i
					};
					POBUCFlag = 1;
					tempArray.push(head);
				}

				tempArray.push(doc[0].BUCAsmtDataPIviewDelivery[i]);

			}

			doc[0].BUCAsmtDataPIviewDelivery = tempArray;



		} catch (e) {
			console
					.log("error at [class-performanceoverview][getCPANDCUPerformanceIndicators]: "
							+ e);
		}

	},

	getCPANDCUPerformanceIndicators : function(db, doc) {
		// Sort for correct display
		var POCountryFlag = 0, POCUFlag = 0, POBUCFlag = 0, POIMTFlag = 0, POIOTFlag = 0,POGPFlag = 0;
		var tempArray = [];
		var head = {};

		try {
			// Sort the array
			doc[0].BUCAsmtDataPIview
					.sort(function(a, b) {
						var nameA = a.ParentDocSubType.toLowerCase(), nameB = b.ParentDocSubType
								.toLowerCase()
						if (nameA > nameB) // sort string descending
							return -1
						if (nameA < nameB)
							return 1
						return 0 // default return value (no sorting)
					});

			// Add BU country itself to the tree

			head = {
				"docid" : doc[0]._id,
				"name" : doc[0].AssessableUnitName,
				"ParentDocSubType" : doc[0].ParentDocSubType,
				"ratingCQ" : doc[0].PeriodRating,
				"ratingPQ1" : doc[0].PeriodRatingPrev1,
				"ratingPQ2" : doc[0].PeriodRatingPrev2,
				"ratingPQ3" : doc[0].PeriodRatingPrev3,
				"ratingPQ4" : doc[0].PeriodRatingPrev4,
				"kcfrDR" : doc[0].KCFRDefectRate,
				"kcoDR" : doc[0].KCODefectRate,
				"auditScore" : doc[0].WeightedAuditScore,
				"msdRisk" : doc[0].MissedOpenIssueCount,
				"msdMSAC" : doc[0].MissedMSACSatCount,
				"treeParent" : doc[0].ParentDocSubType.replace(/ /g, '')
			};

			doc[0].BUCAsmtDataPIview.push(head);

			// Create the treetable array
			for (var i = 0; i < doc[0].BUCAsmtDataPIview.length; i++) {

				if (doc[0].BUCAsmtDataPIview[i].ParentDocSubType == "Global Process"
					&& POIMTFlag == 0) {
				head = {
					"docid" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType
							.replace(/ /g, ''),
					"name" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
					"ParentDocSubType" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
					"ratingCQ" : "",
					"ratingPQ1" : "",
					"ratingPQ2" : "",
					"ratingPQ3" : "",
					"ratingPQ4" : "",
					"kcfrDR" : "",
					"kcoDR" : "",
					"auditScore" : doc[0].WeightedAuditScore,
					"msdRisk" : getCatSumRisk(doc[0].BUCAsmtDataPIview,
							doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
					"msdMSAC" : getCatSumMSAC(doc[0].BUCAsmtDataPIview,
							doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
					"treeParent" : i
				};
				POGPFlag = 1;
				tempArray.push(head);
			}

				if (doc[0].BUCAsmtDataPIview[i].ParentDocSubType == "BU IMT"
					&& POIMTFlag == 0) {
				head = {
					"docid" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType
							.replace(/ /g, ''),
					"name" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
					"ParentDocSubType" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
					"ratingCQ" : "",
					"ratingPQ1" : "",
					"ratingPQ2" : "",
					"ratingPQ3" : "",
					"ratingPQ4" : "",
					"kcfrDR" : "",
					"kcoDR" : "",
					"auditScore" : doc[0].WeightedAuditScore,
					"msdRisk" : getCatSumRisk(doc[0].BUCAsmtDataPIview,
							doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
					"msdMSAC" : getCatSumMSAC(doc[0].BUCAsmtDataPIview,
							doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
					"treeParent" : i
				};
				POIMTFlag = 1;
				tempArray.push(head);
			}

				if (doc[0].BUCAsmtDataPIview[i].ParentDocSubType == "BU IOT"
					&& POIOTFlag == 0) {
				head = {
					"docid" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType
							.replace(/ /g, ''),
					"name" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
					"ParentDocSubType" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
					"ratingCQ" : "",
					"ratingPQ1" : "",
					"ratingPQ2" : "",
					"ratingPQ3" : "",
					"ratingPQ4" : "",
					"kcfrDR" : "",
					"kcoDR" : "",
					"auditScore" : doc[0].WeightedAuditScore,
					"msdRisk" : getCatSumRisk(doc[0].BUCAsmtDataPIview,
							doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
					"msdMSAC" : getCatSumMSAC(doc[0].BUCAsmtDataPIview,
							doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
					"treeParent" : i
				};
				POIOTFlag = 1;
				tempArray.push(head);
			}

				if (doc[0].BUCAsmtDataPIview[i].ParentDocSubType == "Country Process"
						&& POCountryFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
						"ratingCQ" : "",
						"ratingPQ1" : "",
						"ratingPQ2" : "",
						"ratingPQ3" : "",
						"ratingPQ4" : "",
						"kcfrDR" : "",
						"kcoDR" : "",
						"auditScore" : getCatSumAuditSc(doc[0].BUCAsmtDataPIview,
								doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
						"msdRisk" : getCatSumRisk(doc[0].BUCAsmtDataPIview,
								doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
						"msdMSAC" : getCatSumMSAC(doc[0].BUCAsmtDataPIview,
								doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
						"treeParent" : i
					};
					POCountryFlag = 1;
					tempArray.push(head);
				}

				if (doc[0].BUCAsmtDataPIview[i].ParentDocSubType == "Controllable Unit"
						&& POCUFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
						"ratingCQ" : "",
						"ratingPQ1" : "",
						"ratingPQ2" : "",
						"ratingPQ3" : "",
						"ratingPQ4" : "",
						"kcfrDR" : "",
						"kcoDR" : "",
						"auditScore" : getCatSumAuditSc(doc[0].BUCAsmtDataPIview,
								doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
						"msdRisk" : getCatSumRisk(doc[0].BUCAsmtDataPIview,
								doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
						"msdMSAC" : getCatSumMSAC(doc[0].BUCAsmtDataPIview,
								doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
						"treeParent" : i
					};
					POCUFlag = 1;
					tempArray.push(head);
				}

				if (doc[0].BUCAsmtDataPIview[i].ParentDocSubType == "BU Country"
						&& POBUCFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataPIview[i].ParentDocSubType,
						"ratingCQ" : "",
						"ratingPQ1" : "",
						"ratingPQ2" : "",
						"ratingPQ3" : "",
						"ratingPQ4" : "",
						"kcfrDR" : "",
						"kcoDR" : "",
						"auditScore" : getCatSumAuditSc(doc[0].BUCAsmtDataPIview,
								doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
						"msdRisk" : getCatSumRisk(doc[0].BUCAsmtDataPIview,
								doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
						"msdMSAC" : getCatSumMSAC(doc[0].BUCAsmtDataPIview,
								doc[0].BUCAsmtDataPIview[i].ParentDocSubType),
						"treeParent" : i
					};
					POBUCFlag = 1;
					tempArray.push(head);
				}

				tempArray.push(doc[0].BUCAsmtDataPIview[i]);

			}

			doc[0].BUCAsmtDataPIview = tempArray;

		} catch (e) {
			console
					.log("error at [class-performanceoverview][getCPANDCUPerformanceIndicators]: "
							+ e);
		}

	},

	getCPANDCUPerformanceIndicatorsAndOthersGTS : function(db, doc) {
		var POCountryOtherFlag = 0, POCUOtherFlag = 0, POBUCOtherFlag = 0;
		var head = {};
		var tempArray = [];

		try {
			// Sort the array CRM
			doc[0].BUCAsmtDataOIviewCRM
					.sort(function(a, b) {
						var nameA = a.ParentDocSubType.toLowerCase(), nameB = b.ParentDocSubType
								.toLowerCase()
						if (nameA > nameB) // sort string descending
							return -1
						if (nameA < nameB)
							return 1
						return 0 // default return value (no sorting)
					});

			// Sort the array CRM
			doc[0].BUCAsmtDataOIviewDelivery
					.sort(function(a, b) {
						var nameA = a.ParentDocSubType.toLowerCase(), nameB = b.ParentDocSubType
								.toLowerCase()
						if (nameA > nameB) // sort string descending
							return -1
						if (nameA < nameB)
							return 1
						return 0 // default return value (no sorting)
					});

			// Create the treetable array for CRM
			for (var i = 0; i < doc[0].BUCAsmtDataOIviewCRM.length; i++) {

				if (doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType == "Country Process"
						&& POCountryOtherFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType,
						"bocExCount" : getCatSumbocEx(
								doc[0].BUCAsmtDataOIviewCRM,
								doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType),
						"treeParent" : i
					};
					tempArray.push(head);
					POCountryOtherFlag = 1;
				}

				if (doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType == "Controllable Unit"
						&& POCUOtherFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType,
						"bocExCount" : getCatSumbocEx(
								doc[0].BUCAsmtDataOIviewCRM,
								doc[0].BUCAsmtDataOIviewCRM[i].ParentDocSubType),
						"treeParent" : i
					};
					tempArray.push(head);

					POCUOtherFlag = 1;
				}

				tempArray.push(doc[0].BUCAsmtDataOIviewCRM[i]);

			}
			// console.log(tempArray);
			doc[0].BUCAsmtDataOIviewCRM = tempArray;

			POCountryOtherFlag = 0;
			POCUOtherFlag = 0;
			POBUCOtherFlag = 0;

			tempArray = [];

			// Create the treetable array for Delivery
			for (var i = 0; i < doc[0].BUCAsmtDataOIviewDelivery.length; i++) {

				if (doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType == "Country Process"
						&& POCountryOtherFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType,
						"bocExCount" : getCatSumbocEx(
								doc[0].BUCAsmtDataOIviewDelivery,
								doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType),
						"treeParent" : i
					};
					tempArray.push(head);
					POCountryOtherFlag = 1;
				}

				if (doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType == "Controllable Unit"
						&& POCUOtherFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType,
						"bocExCount" : getCatSumbocEx(
								doc[0].BUCAsmtDataOIviewDelivery,
								doc[0].BUCAsmtDataOIviewDelivery[i].ParentDocSubType),
						"treeParent" : i
					};
					tempArray.push(head);

					POCUOtherFlag = 1;
				}

				tempArray.push(doc[0].BUCAsmtDataOIviewDelivery[i]);

			}
			// console.log(tempArray);
			doc[0].BUCAsmtDataOIviewDelivery = tempArray;

		} catch (e) {
			console
					.log("error at [class-performanceoverview][getCPANDCUPerformanceIndicatorsAndOthersGTS]: "
							+ e);
		}

	},

	getCPANDCUPerformanceIndicatorsAndOthers : function(db, doc) {
		var POCountryOtherFlag = 0, POCUOtherFlag = 0, POBUCOtherFlag = 0;
		var head = {};
		var tempArray = [];

		try {
			// Sort the array
			doc[0].BUCAsmtDataOIview
					.sort(function(a, b) {
						var nameA = a.ParentDocSubType.toLowerCase(), nameB = b.ParentDocSubType
								.toLowerCase()
						if (nameA > nameB) // sort string descending
							return -1
						if (nameA < nameB)
							return 1
						return 0 // default return value (no sorting)
					});

			// Create the treetable array
			for (var i = 0; i < doc[0].BUCAsmtDataOIview.length; i++) {

				if (doc[0].BUCAsmtDataOIview[i].ParentDocSubType == "BU Country"
						&& POBUCOtherFlag == 0 ) {
					head = {
						"docid" : doc[0].BUCAsmtDataOIview[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataOIview[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataOIview[i].ParentDocSubType,
						"bocExCount" : getCatSumbocEx(doc[0].BUCAsmtDataOIview,
								doc[0].BUCAsmtDataOIview[i].ParentDocSubType),
						"treeParent" : i
					};
					tempArray.push(head);
					POBUCOtherFlag = 1;
				}




				if (doc[0].BUCAsmtDataOIview[i].ParentDocSubType == "Country Process"
						&& POCountryOtherFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataOIview[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataOIview[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataOIview[i].ParentDocSubType,
						"bocExCount" : getCatSumbocEx(doc[0].BUCAsmtDataOIview,
								doc[0].BUCAsmtDataOIview[i].ParentDocSubType),
						"treeParent" : i
					};
					tempArray.push(head);
					POCountryOtherFlag = 1;
				}

				if (doc[0].BUCAsmtDataOIview[i].ParentDocSubType == "Controllable Unit"
						&& POCUOtherFlag == 0) {
					head = {
						"docid" : doc[0].BUCAsmtDataOIview[i].ParentDocSubType
								.replace(/ /g, ''),
						"name" : doc[0].BUCAsmtDataOIview[i].ParentDocSubType,
						"ParentDocSubType" : doc[0].BUCAsmtDataOIview[i].ParentDocSubType,
						"bocExCount" : getCatSumbocEx(doc[0].BUCAsmtDataOIview,
								doc[0].BUCAsmtDataOIview[i].ParentDocSubType),
						"treeParent" : i
					};
					tempArray.push(head);

					POCUOtherFlag = 1;
				}

				tempArray.push(doc[0].BUCAsmtDataOIview[i]);

			}
			// console.log(tempArray);
			doc[0].BUCAsmtDataOIview = tempArray;

		} catch (e) {
			console
					.log("error at [class-performanceoverview][getCPANDCUPerformanceIndicatorsAndOthers]: "
							+ e);
		}

	},

};

module.exports = performanceoverviewcountry;
