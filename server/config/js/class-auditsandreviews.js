/**************************************************************************************************
 *
 * MIRA Audits and Reviews Code
 * Date: 4 January 2017
 * By: genonms@ph.ibm.com
 *
 */

var fieldCalc = require('./class-fieldcalc.js');

var calculateARTab = {

  processARTab: function(doc, defViewRow) {
		try {
      switch (doc[0].ParentDocSubType) {
        case "Country Process":

          // *** Start of Audits and Reviews embedded view 1 *** //
          var auditR = doc[0].AuditTrustedData;
          auditR.sort(function(a, b){
            var nameA=a.compntType.toLowerCase(), nameB=b.compntType.toLowerCase()
            if (nameA < nameB) //sort string ascending
              return -1
            if (nameA > nameB)
              return 1
            var nameA=a.reportingQuarter.toLowerCase(), nameB=b.reportingQuarter.toLowerCase()
            if (nameA > nameB) //sort string descending
              return -1
            if (nameA < nameB)
              return 1
            return 0 //default return value (no sorting)
          });
          var typeList = {};
          var periodList = {};
          var exportPPR = [];
          var auditRList = [];

          for(var i = 0; i < auditR.length; i++){
            if (auditR[i].compntType == "PPR" && auditR[i].originalReportingQuarter == auditR[i].reportingQuarter) {
              auditR[i].COFlag = true;
            } else {
              auditR[i].COFlag = false;
            }
            // if(auditR[i].REVIEW_TYPE == "CHQ Internal Audit"||auditR[i].REVIEW_TYPE == "" && reportingQuarter == doc[0].CurrentPeriod){
            //   auditR[i].COFlag = false;
            // }else{
            // auditR[i].COFlag = true;
            // }
            if(auditR[i].compntType == "PPR"){
              auditR[i].compntType = "Proactive Reviews";
            }else{
              auditR[i].compntType = "Internal Audit";
            }
            if(typeof typeList[auditR[i].compntType] === "undefined"){
              auditRList.push(
                {
                  id:auditR[i].compntType.replace(/ /g,''),
                  reportingQuarter:auditR[i].compntType,
                  catEntry:"Yes"
                }
              );
              typeList[auditR[i].compntType] = true;
            }
            if(typeof periodList[auditR[i].compntType.replace(/ /g,'')+auditR[i].reportingQuarter.replace(/ /g,'')] === "undefined"){
              auditRList.push(
                {
                  parent: auditR[i].compntType.replace(/ /g,''),id:auditR[i].compntType.replace(/ /g,'')+auditR[i].reportingQuarter.replace(/ /g,''),
                  reportingQuarter:auditR[i].reportingQuarter,
                  catEntry:"Yes"
                }
              );
              periodList[auditR[i].compntType.replace(/ /g,'')+auditR[i].reportingQuarter.replace(/ /g,'')] = true;
            }

            auditR[i].eid = auditR[i].id;
            auditR[i].id = auditR[i]["_id"];
            auditR[i].parent = auditR[i].compntType.replace(/ /g,'')+auditR[i].reportingQuarter.replace(/ /g,'');

            exportPPR.push({
              period:auditR[i].reportingQuarter,
              CO:auditR[i].COFlag,
              auditOrReview:auditR[i].auditOrReview,
              id:auditR[i].eid,
              assessableunit:auditR[i].countryProcess,
              date:auditR[i].reportDate,
              rating:auditR[i].rating,
              totalrecs:auditR[i].numRecommendationsTotal,
              openrecos:auditR[i].numRecommendationsOpen,
              target2close:auditR[i].targetClose,
              comments:auditR[i].comments
            });
            auditRList.push(auditR[i]);
          }
          // add padding
          if (Object.keys(typeList).length < defViewRow) {
            if (auditRList == 0) {
              auditRList = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(auditRList,10,(defViewRow-Object.keys(typeList).length));
            }
          }

          doc[0].AuditTrustedData = auditRList;
          doc[0].exportPPR = exportPPR;
          // *** End of Audits and Reviews embedded view 1 *** //

          // *** Start of Audits and Reviews embedded view 2 *** //
          var auditInt = doc[0].AuditTrustedRCUData;
          var AuditTrustedRCUData = auditInt;
          for(var i = 0; i < auditInt.length; i++){
            if (auditInt[i].compntType == "PPR" && auditInt[i].originalReportingQuarter == auditInt[i].reportingQuarter) {
              auditInt[i].COFlag = true;
            } else {
              auditInt[i].COFlag = false;
            }
            // if(auditInt[i].REVIEW_TYPE == "CHQ Internal Audit"||auditInt[i].REVIEW_TYPE == "" && ORIG_RPTG_QTR == doc[0].CurrentPeriod){
            //   auditInt[i].COFlag = false;
            // }else{
            // auditInt[i].COFlag = true;
            // }
          }
          // add padding
          if (Object.keys(AuditTrustedRCUData).length < defViewRow) {
            if (Object.keys(AuditTrustedRCUData).length == 0) {
              AuditTrustedRCUData = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(AuditTrustedRCUData,10,(defViewRow-Object.keys(AuditTrustedRCUData).length));
            }
          }
          doc[0].AuditTrustedRCUData = AuditTrustedRCUData;
          // *** End of Audits and Reviews embedded view 2 *** //

          // *** Start of Audits and Reviews embedded view 3 *** //
          //sort
          doc[0].AuditLocalData.sort(function(a, b){
            var nameA=a.reportingQuarter.toLowerCase(), nameB=b.reportingQuarter.toLowerCase()
            if (nameA > nameB) //sort string descending
              return -1
            if (nameA < nameB)
              return 1

            return 0
          });
          //end sort
          var auditLoc = doc[0].AuditLocalData;
          //var AuditLocalData = auditLoc;
          var quartersList = {};
          var localAuditsList = [];
          var exportLocalAuditsList = [];
          for(var i = 0; i < auditLoc.length; i++){
            // if(auditLoc[i].auditOrReview == "CHQ Internal Audit"||auditLoc[i].auditOrReview == "" && auditLoc[i].reportingQuarter == doc[0].CurrentPeriod){
            //   auditLoc[i].COFlag = false;
            // }else {
            //   auditLoc[i].COFlag = true;
            // }
            if(typeof quartersList[auditLoc[i].reportingQuarter] === "undefined"){
              localAuditsList.push({id:auditLoc[i].reportingQuarter.replace(/ /g,''), reportingQuarter:auditLoc[i].reportingQuarter });
              quartersList[auditLoc[i].reportingQuarter] = true;
            }
            var tmp = {};
            tmp.reportingQuarter = auditLoc[i].reportingQuarter;
            tmp.auditOrReview = auditLoc[i].auditOrReview;
            tmp.reportDate = auditLoc[i].reportDate;
            tmp.rating = auditLoc[i].rating;
            tmp.numRecommendationsTotal = auditLoc[i].numRecommendationsTotal;
            tmp.numRecommendationsOpen = auditLoc[i].numRecommendationsOpen;
            tmp.targetCloseOriginal = auditLoc[i].targetCloseOriginal;
            tmp.comments = auditLoc[i].comments;

            exportLocalAuditsList.push(tmp);
            auditLoc[i].parent = auditLoc[i].reportingQuarter.replace(/ /g,'');
            auditLoc[i].id = auditLoc[i]["_id"];

            localAuditsList.push(auditLoc[i]);
          }
          doc[0].exportLocalAuditsList = exportLocalAuditsList;

          // add padding
          if (Object.keys(quartersList).length < defViewRow) {
            if (localAuditsList == 0) {
              localAuditsList = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(localAuditsList,10,(defViewRow-Object.keys(quartersList).length));
            }
          };
          doc[0].AuditLocalData = localAuditsList;
          // add padding
          /*if (Object.keys(AuditLocalData).length < defViewRow) {
            if (Object.keys(AuditLocalData).length == 0) {
              AuditLocalData = fieldCalc.addTestViewData(8,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(AuditLocalData,8,(defViewRow-Object.keys(AuditLocalData).length));
            }
          }*/

          // *** End of Audits and Reviews embedded view 3 *** //

          break;
        case "Global Process":
          break;
        case "BU Reporting Group":
          break;
        case "Business Unit":
          break;
        case "BU IOT":
          break;
        case "BU IMT":
          break;
        case "Account":
          // *** Start of Audits and Reviews embedded view *** //
          //sort
          doc[0].AuditLocalData.sort(function(a, b){
            var nameA=a.reportingQuarter.toLowerCase(), nameB=b.reportingQuarter.toLowerCase()
            if (nameA > nameB) //sort string descending
              return -1
            if (nameA < nameB)
              return 1

            return 0
          });
          //end sort
          var auditLoc = doc[0].AuditLocalData;
          var quartersList = {};
          var localAuditsList = [];
          var exportLocalAuditsList = [];
          for(var i = 0; i < auditLoc.length; i++){
            // if(auditLoc[i].auditOrReview == "CHQ Internal Audit"||auditLoc[i].auditOrReview == "" && auditLoc[i].reportingQuarter == doc[0].CurrentPeriod){
            //   auditLoc[i].COFlag = false;
            // }else {
            //   auditLoc[i].COFlag = true;
            // }
            if(typeof quartersList[auditLoc[i].reportingQuarter] === "undefined"){
              localAuditsList.push({id:auditLoc[i].reportingQuarter.replace(/ /g,''), reportingQuarter:auditLoc[i].reportingQuarter });
              quartersList[auditLoc[i].reportingQuarter] = true;
            }
            var tmp = {};
            tmp.reportingQuarter = auditLoc[i].reportingQuarter;
            tmp.auditOrReview = auditLoc[i].auditOrReview;
            tmp.reportDate = auditLoc[i].reportDate;
            tmp.rating = auditLoc[i].rating;
            tmp.numRecommendationsTotal = auditLoc[i].numRecommendationsTotal;
            tmp.numRecommendationsOpen = auditLoc[i].numRecommendationsOpen;
            tmp.targetCloseOriginal = auditLoc[i].targetCloseOriginal;
            tmp.comments = auditLoc[i].comments;

            exportLocalAuditsList.push(tmp);
            auditLoc[i].parent = auditLoc[i].reportingQuarter.replace(/ /g,'');
            auditLoc[i].id = auditLoc[i]["_id"];

            localAuditsList.push(auditLoc[i]);
          }
          doc[0].exportLocalAuditsList = exportLocalAuditsList;

          // add padding
          if (Object.keys(quartersList).length < defViewRow) {
            if (localAuditsList == 0) {
              localAuditsList = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(localAuditsList,10,(defViewRow-Object.keys(quartersList).length));
            }
          };
          doc[0].AuditLocalData = localAuditsList;

          // *** End of Audits and Reviews embedded view *** //
          break;

        case "BU Country":
          // *** Start of Audits and Reviews embedded view *** //
          //View 1 - Internal Audit Data
          //InternalAuditData is populated on class-compdoc.js after querying all BU Country's Internal Audits
          var auditInter = doc[0].InternalAuditData;
          //Then all BU Country's constituent asmts and AUs are stored
          var parentAsmts = doc[0].BUCountryAssessments;
          var parentAUs = doc[0].BUCountryAssessableUnits;
          //FOR GTS AND GTS TRANSFORM ONLY - IS Delivery and CRM asmt docs
          var parentISDeliveryDocs = doc[0].BUCountryISDeliveryDocs;
          var parentCRMDocs = doc[0].BUCountryCRMDocs;
          //FOR GTS AND GTS TRANSFORM ONLY - summary objects of all Internal Audits
          var summaryISDeliveryAllCounts = {
            countComplete: 0,
            countSAT: 0,
            countUNSAT: 0,
            countScore: 0
          };
              summaryCRMISAllCounts = {
                countComplete: 0,
                countSAT: 0,
                countUNSAT: 0,
                countScore: 0
              };
              summaryCRMOtherAllCounts = {
                countComplete: 0,
                countSAT: 0,
                countUNSAT: 0,
                countScore: 0
              };
              summaryTotalAllCounts = {
                countComplete: 0,
                countSAT: 0,
                countUNSAT: 0,
                countScore: 0
              };
              //for weighted scores:
          var totalISDeliveryCUScore = 0; totalISDeliveryMaxScore = 0;
              totalCRMISCUScore = 0; totalCRMISMaxScore = 0;
              totalCRMOtherCUScore = 0; totalCRMOtherMaxScore = 0;

          //List that will export all Internal Audits. Pointing to empty memory so it can be recreated.
          doc[0].InternalAuditData = [];

          //Total Score (CU and Max) variables. To be calculated below.
          var totalCUScore = "";
          var totalMaxScore = "";

          //Iterate over found Internal Audits
          for(var i = 0; i < auditInter.length; i++) {
            var tmp = {};
            tmp.id = auditInter[i]._id;
            if (auditInter[i].auditOrReview == "CHQ Internal Audit") {
              tmp.plannedStartDate = auditInter[i].reportDate;
              tmp.engagement = auditInter[i].auditID;
            }
            else {
              tmp.plannedStartDate = auditInter[i].plannedStartDate;
              tmp.engagement = auditInter[i].engagement;
            }
            for(var j = 0; j < parentAsmts.length; j++) {
              if (auditInter[i].parentid == parentAsmts[j]._id || auditInter[i].parentid == parentAsmts[j].parentid) {
                var parentAU = parentAUs[parentAsmts[j].parentid];
                tmp.Name = parentAU.Name;
                if(parentAU.DocSubType == "Controllable Unit" && parentAU.Portfolio == "Yes") {
                  tmp.DocSubType = "Portfolio CU";
                  //If the audit is GTS, then we need to add the corresponding category at a Portfolio CU level
                  if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
                    //If the assessment matches the parentid of the asmtsdocsDelivery, then its category is "IS Delivery"
                    for(var k = 0; k < parentISDeliveryDocs.length; k++) {
                      //Check it's a local audit with "CHQ Audit Internal", then a comparison must be made with asmtsdocsDelivery id
                      if(auditInter[i].auditOrReview == "CHQ Internal Audit") {
                        if (parentAsmts[j]._id == parentISDeliveryDocs[k]._id) {
                          tmp.cat = "IS Delivery";
                          break;
                        }
                      }
                      //Else it's an Internal Audit, then a comparison must be made with asmtsdocsDelivery parentid
                      else {
                        if (parentAU._id == parentISDeliveryDocs[k].parentid) {
                          tmp.cat = "IS Delivery"; //Still an IS Delivery cat since it matches parentISDeliveryDocs
                          break;
                        }
                      }
                    }
                    //If the assessment matches the parentid of the asmtsdocsCRM, then its category is either "IS" or "Other"
                    for(var k = 0; k < parentCRMDocs.length; k++) {
                      //Check it's a local audit with "CHQ Audit Internal", then a comparison must be made with asmtsdocsCRM parentid
                      if(auditInter[i].auditOrReview == "CHQ Internal Audit") {
                        if (parentAsmts[j]._id == parentCRMDocs[k].parentid) {
                          //If the assessment has "IS", "SO", and "ITS" as its categories, then it's "IS"
                          for(var key in doc[0].AuditCUIS.options){
                            if (parentAU.Category == doc[0].AuditCUIS.options[key]) {
                              tmp.cat = "IS";
                              break;
                            }
                            //Else it can be considered "Other"
                            else {
                              tmp.cat = "Other";
                            }
                          }
                          break;
                        }
                      }
                      //Else it's an Internal Audit, then a comparison must be made with amstsdocsCRM parentid
                      else {
                        if (parentAU._id == parentCRMDocs[k].parentid) {
                          //If the assessment has "IS", "SO", and "ITS" as its categories, then it's "IS"
                          for(var key in doc[0].AuditCUIS.options){
                            if (parentAU.Category == doc[0].AuditCUIS.options[key]) {
                              tmp.cat = "IS";
                              break;
                            }
                            //Else it can be considered "Other"
                            else {
                              tmp.cat = "Other";
                            }
                          }
                          break;
                        }
                      }
                    }
                  }
                }
                else if (parentAU.DocSubType == "Controllable Unit" && (parentAU.Portfolio == "No" || parentAU.Portfolio == "" || parentAU.Portfolio == undefined)){
                  tmp.DocSubType = "Standalone CU";
                  //If the audit is GTS, then we need to add the corresponding category at a Standalone CU level
                  if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
                    //If the assessment matches the parentid of the asmtsdocsDelivery, then its category is "IS Delivery"
                    for(var k = 0; k < parentISDeliveryDocs.length; k++) {
                      //Check it's a local audit with "CHQ Audit Internal", then a comparison must be made with asmtsdocsDelivery id
                      if(auditInter[i].auditOrReview == "CHQ Internal Audit") {
                        if (parentAsmts[j]._id == parentISDeliveryDocs[k]._id) {
                          tmp.cat = "IS Delivery";
                          break;
                        }
                      }
                      //Else it's an Internal Audit, then a comparison must be made with asmtsdocsDelivery parentid
                      else {
                        if (parentAU[i]._id == parentISDeliveryDocs[k].parentid) {
                          tmp.cat = "IS Delivery"; //Still an IS Delivery cat since it matches parentISDeliveryDocs
                          break;
                        }
                      }
                    }
                    //If the assessment matches the parentid of the asmtsdocsCRM, then its category is either "IS" or "Other"
                    for(var k = 0; k < parentCRMDocs.length; k++) {
                      if (parentAU._id == parentCRMDocs[k].parentid) {
                        //Review IS categories
                        for (var key in doc[0].AuditCUIS.options) {
                          if (parentAU.Category == doc[0].AuditCUIS.options[key]) {
                            tmp.cat = "IS";
                            break;
                          }
                        }
                        //Review Other categories
                        for (var key in doc[0].AuditCUOTHER.options) {
                          if (parentAU.Category == doc[0].AuditCUOTHER.options[key]) {
                            tmp.cat = "Other";
                            break;
                          }
                        }
                      }
                    }
                  }
                }
                else {
                  tmp.DocSubType = parentAU.DocSubType;
                  //If the audit is GTS, then we need to add the corresponding category
                  if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
                    //If it is a Country Process then its category is supposed to be the CP's "Category" field in Cloudant
                    if (tmp.DocSubType == "Country Process") {
                      //Review IS categories
                      for(var key in doc[0].AuditCUIS.options){
                        if (parentAU.Category == doc[0].AuditCUIS.options[key]) {
                          tmp.cat = "IS";
                          break;
                        }
                      }
                      //Review Other categories
                      for (var key in doc[0].AuditCUOTHER.options) {
                        if (parentAU.Category == doc[0].AuditCUOTHER.options[key]) {
                          tmp.cat = "Other";
                          break;
                        }
                      }
                      //Review Delivery categories
                      for (var key in doc[0].DeliveryCU.options) {
                        if (parentAU.Category == doc[0].AuditCUOTHER.options[key]) {
                          tmp.cat = "IS Delivery";
                          break;
                        }
                      }
                    }
                    //Else if it's something else, it is not categorized (Check with Minnie if this is true)
                    else {
                      tmp.cat = "(uncategorized)";
                    }
                    break;
                  }
                }
                tmp.PeriodRatingPrev = parentAU.PeriodRatingPrev;
                tmp.PeriodRating = parentAsmts[j].PeriodRating;
                if (auditInter[i].CUSize == undefined || auditInter[i].CUSize == "") {
                  tmp.CUSize = parentAU.CUSize;
                } else {
                  tmp.CUSize = auditInter[i].CUSize;
                }
                tmp.CUMaxScore = fieldCalc.getCUMaxScore(tmp.CUSize);
                tmp.CUScore = fieldCalc.getCUScore(tmp.PeriodRating,tmp.CUMaxScore);

              }
            }
            //Calculate total scores (CU and MAX) for later WeightedAuditScore calculation
            if (!isNaN(tmp.CUScore)) totalCUScore += tmp.CUScore;
            if (!isNaN(tmp.CUMaxScore)) totalMaxScore += tmp.CUMaxScore;
            //Summary count
            if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
              if (tmp.cat == "IS Delivery") {
                if (tmp.PeriodRating == "Sat" || tmp.PeriodRating == "Satisfactory" || tmp.PeriodRating == "Favorable" || tmp.PeriodRating == "Unqualified" || tmp.PeriodRating == "Positive") {
                  summaryISDeliveryAllCounts.countSAT++;
                }
                if (tmp.PeriodRating == "Unsat" || tmp.PeriodRating == "Unsatisfactory" || tmp.PeriodRating == "Qualified" || tmp.PeriodRating == "Unfavorable" || tmp.PeriodRating == "Negative") {
                  summaryISDeliveryAllCounts.countUNSAT++;
                }
                //For IS Delivery WeightedAuditScore
                if (!isNaN(tmp.CUScore)) totalISDeliveryCUScore += tmp.CUScore;
                if (!isNaN(tmp.CUMaxScore)) totalISDeliveryMaxScore += tmp.CUMaxScore;
              }
              else if (tmp.cat == "IS") {
                if (tmp.PeriodRating == "Sat" || tmp.PeriodRating == "Satisfactory" || tmp.PeriodRating == "Favorable" || tmp.PeriodRating == "Unqualified" || tmp.PeriodRating == "Positive") {
                  summaryCRMISAllCounts.countSAT++;
                }
                if (tmp.PeriodRating == "Unsat" || tmp.PeriodRating == "Unsatisfactory" || tmp.PeriodRating == "Qualified" || tmp.PeriodRating == "Unfavorable" || tmp.PeriodRating == "Negative") {
                  summaryCRMISAllCounts.countUNSAT++;
                }
                //For CRM IS WeightedAuditScore
                if (!isNaN(tmp.CUScore)) totalCRMISCUScore += tmp.CUScore;
                if (!isNaN(tmp.CUMaxScore)) totalCRMISMaxScore += tmp.CUMaxScore;
              }
              else if (tmp.cat == "Other") {
                if (tmp.PeriodRating == "Sat" || tmp.PeriodRating == "Satisfactory" || tmp.PeriodRating == "Favorable" || tmp.PeriodRating == "Unqualified" || tmp.PeriodRating == "Positive") {
                  summaryCRMOtherAllCounts.countSAT++;
                }
                if (tmp.PeriodRating == "Unsat" || tmp.PeriodRating == "Unsatisfactory" || tmp.PeriodRating == "Qualified" || tmp.PeriodRating == "Unfavorable" || tmp.PeriodRating == "Negative") {
                  summaryCRMOtherAllCounts.countUNSAT++;
                }
                //For CRM Other WeightedAuditScore
                if (!isNaN(tmp.CUScore)) totalCRMOtherCUScore += tmp.CUScore;
                if (!isNaN(tmp.CUMaxScore)) totalCRMOtherMaxScore += tmp.CUMaxScore;
              }
              else {
                totalISDeliveryMaxScore, totalCRMISMaxScore, totalCRMOtherMaxScore = 0;
              }
            }
            //For treeview's parent (have to ask Irving how this actually works)
            if(doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
              if(!tmp.cat) tmp.cat = "(uncategorized)";
              tmp.parent = tmp.cat.replace(/ /g,'');
            }
            //Add all the tmp fields to InternalAuditData
            doc[0].InternalAuditData.push(tmp);
          }
          // Begin sort
          if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
            doc[0].InternalAuditData.sort(function(a,b) {
              var nameA=a.cat.toLowerCase(), nameB=b.cat.toLowerCase()
              if (nameA < nameB){ //sort string ascending
                if (nameA == "(uncategorized)") {
                  return 1;
                }
                return -1
              }
              if (nameA > nameB){
                if (nameB =="(uncategorized)") {
                  return -1
                }
                return 1
              }
              return 0
            });
          }
          else {
            doc[0].InternalAuditData.sort(function(a,b) {
              var nameA=a.plannedStartDate.toLowerCase(), nameB=b.plannedStartDate.toLowerCase()
              if (nameA < nameB) //sort string ascending
                return -1
              if (nameA > nameB)
                return 1
              return 0
            });
          }
          // End sort

          //Category list for treetable
          var categoryList = {};
          var tmpList = doc[0].InternalAuditData;
          //Create list for view, and another one for Excel and ODS export
          doc[0].InternalAuditData = [];
          var exportInternalAuditData = [];

          //Populate the Internal Audits. Also, create treetable structure
          for (var i = 0; i < tmpList.length; i++) {
            //Treetable will only be created if GTS or GTS Transform
            if(doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
              if(typeof categoryList[tmpList[i].cat.replace(/ /g,'')] === "undefined"){
                var tmp2 ={
                  id: tmpList[i].cat.replace(/ /g,''),
                  cat:tmpList[i].cat
                }
                doc[0].InternalAuditData.push(tmp2);
                categoryList[tmpList[i].cat.replace(/ /g,'')] = tmp2;
              }
            }
            //Add all Internal Audits to list
            doc[0].InternalAuditData.push(tmpList[i]);
            //For Excel and ODS export
            var tmp2 = {
              plannedStartDate: tmpList[i].plannedStartDate || " ",
              engagement: tmpList[i].engagement || " ",
              Name: tmpList[i].Name || " ",
              DocSubType: tmpList[i].DocSubType || " ",
              PeriodRatingPrev: tmpList[i].PeriodRatingPrev || " ",
              PeriodRating: tmpList[i].PeriodRating || " ",
              CUSize: tmpList[i].CUSize || " ",
              CUScore: tmpList[i].CUScore || " "
            };
            exportInternalAuditData.push(tmp2);
          }

          //Calculate WeightedAuditScore
          var weightedScore = 0;
          //GTS and GTS Transform need to calculate WeightedAuditScore per category
          if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
            //IS Delivery
            if (totalISDeliveryMaxScore == 0) {
              weightedScore = "";
              summaryISDeliveryAllCounts.countScore = weightedScore;
            }
            else {
              weightedScore = ((totalISDeliveryCUScore/totalISDeliveryMaxScore)*100).toFixed(1);
              summaryISDeliveryAllCounts.countScore = weightedScore;
            }
            //CRM IS
            if (totalCRMISMaxScore == 0) {
              weightedScore = "";
              summaryCRMISAllCounts.countScore = weightedScore;
            }
            else {
              weightedScore = ((totalCRMISCUScore/totalCRMISMaxScore)*100).toFixed(1);
              summaryCRMISAllCounts.countScore = weightedScore;
            }
            //CRM Other
            if (totalCRMOtherMaxScore == 0) {
              weightedScore = "";
              summaryCRMOtherAllCounts.countScore = weightedScore;
            }
            else {
              weightedScore = ((totalCRMOtherCUScore/totalCRMOtherMaxScore)*100).toFixed(1);
              summaryCRMOtherAllCounts.countScore = weightedScore;
            }
          }
          //WeightedAuditScore for all audits
          weightedScore = 0;
          if(totalMaxScore == 0 || totalMaxScore == "" || totalCUScore == "") {
            weightedScore = "";
          }
          else {
            weightedScore = ((totalCUScore/totalMaxScore)*100).toFixed(1);
          }

          //Export Internal Audit data and the Weighted Score to the Handlebars view
          doc[0].exportInternalAuditData = exportInternalAuditData;
          doc[0].WeightedAuditScore = weightedScore;
          //If GTS or GTS Transform, calculate all summary counts
          if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
            //Complete: sum of all SAT and UNSAT audits.
            summaryISDeliveryAllCounts.countComplete = summaryISDeliveryAllCounts.countSAT + summaryISDeliveryAllCounts.countUNSAT;
            summaryCRMISAllCounts.countComplete = summaryCRMISAllCounts.countSAT + summaryCRMISAllCounts.countUNSAT;
            summaryCRMOtherAllCounts.countComplete = summaryCRMOtherAllCounts.countSAT + summaryCRMOtherAllCounts.countUNSAT;
            //Total: add all the categories:
            summaryTotalAllCounts.countComplete = summaryISDeliveryAllCounts.countComplete + summaryCRMISAllCounts.countComplete + summaryCRMOtherAllCounts.countComplete;
            summaryTotalAllCounts.countSAT = summaryISDeliveryAllCounts.countSAT + summaryCRMISAllCounts.countSAT + summaryCRMOtherAllCounts.countSAT;
            summaryTotalAllCounts.countUNSAT = summaryISDeliveryAllCounts.countUNSAT + summaryCRMISAllCounts.countUNSAT + summaryCRMOtherAllCounts.countUNSAT;            
            //Export all summary to Handlebars view
            doc[0].SummaryISDelivery = summaryISDeliveryAllCounts;
            doc[0].SummaryCRMIS = summaryCRMISAllCounts;
            doc[0].SummaryCRMOther = summaryCRMOtherAllCounts;
            doc[0].SummaryTotal = summaryTotalAllCounts;
          }
          //Add padding
          if (Object.keys(categoryList).length < defViewRow) {
            if (doc[0].InternalAuditData.length == 0) {
              doc[0].InternalAuditData = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].InternalAuditData,10,(defViewRow-Object.keys(categoryList).length));
            }
          };
          //End of view 1

          //VIEW 2 - Proactive Reviews

          //PPRData is populated on class-compdoc.js after querying all BU Country's Proactive Reviews
          var auditPPR = doc[0].PPRData;
          //List that will export all PPRs. Currently empty; to be populated below.
          doc[0].PPRData = [];
          for(var i = 0; i < auditPPR.length; i++) {
            var tmp={};
            tmp.id = auditPPR[i]._id;
            tmp.auditOrReview = auditPPR[i].auditOrReview;
            tmp.reportingQuarter = auditPPR[i].reportingQuarter;
            tmp.status = auditPPR[i].status;
            tmp.reviewID = auditPPR[i].id;
            if ((typeof auditPPR[i].CU === "undefined" || auditPPR[i].CU == "" || auditPPR[i].CU == "Not Applicable" || auditPPR[i].CU == undefined)
            && (typeof auditPPR[i].countryProcess !== "undefined" || auditPPR[i].countryProcess != "" || auditPPR[i].countryProcess != "Not Applicable" || auditPPR[i].countryProcess != undefined)) {
              auditPPR[i].CU = auditPPR[i].countryProcess;
            }
            else {
              auditPPR[i].CU = "PARENT ASSESSABLE UNIT NOT FOUND";
            }
            for(var key in parentAUs) {
              if (auditPPR[i].CU == parentAUs[key].Name) {
                tmp.Name = parentAUs[key].Name;
                //Categorization for GTS: will cycle through all the IS Delivery and CRM docs to select one of those as category.
                if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
                  //If the assessment matches the parentid of the asmtsdocsDelivery, then its category is "IS Delivery"
                  for(var j = 0; j < parentISDeliveryDocs.length; j++) {
                    if (parentAUs[key]._id == parentISDeliveryDocs[j].parentid) {
                      tmp.cat = "IS Delivery";
                      break;
                    }
                  }
                  //If the assessment matches the parentid of the asmtsdocsCRM, then its category is "CRM/Other"
                  for(var j = 0; j < parentCRMDocs.length; j++) {
                    if (parentAUs[key]._id == parentCRMDocs[j].parentid) {
                      tmp.cat = "CRM/Other";
                      break;
                    }
                  }
                  //If there's no category after cycling both asmtsdocsDelivery and asmtsdocsCRM, then it should be labeled as uncategorized
                  if (typeof tmp.cat === "undefined" || tmp.cat == "") {
                    tmp.cat = "(uncategorized)";
                    //break;
                  }
                }
                //Doc Type
                if(parentAUs[key].DocSubType == "Controllable Unit" && parentAUs[key].Portfolio == "Yes") {
                  tmp.DocSubType = "Portfolio CU";
                  //break;
                }
                else if (parentAUs[key].DocSubType == "Controllable Unit" && (parentAUs[key].Portfolio == "No" || parentAUs[key].Portfolio == "" || parentAUs[key].Portfolio == undefined)){
                  tmp.DocSubType = "Standalone CU";
                  //break;
                }
                else {
                  tmp.DocSubType = parentAUs[key].DocSubType;
                  //break;
                }
                break;
              }
            }
            if((typeof tmp.Name === "undefined" || tmp.Name == "")&&(typeof tmp.cat === "undefined" || tmp.cat == "")) {
              tmp.Name = auditPPR[i].CU;
              tmp.cat = "(uncategorized)";
            }
            tmp.reportDate = auditPPR[i].reportDate;
            tmp.rating = auditPPR[i].rating;
            tmp.numRecommendationsTotal = auditPPR[i].numRecommendationsTotal;
            tmp.numRecommendationsOpen = auditPPR[i].numRecommendationsOpen;
            //Push all the data to the PPRData list.
            doc[0].PPRData.push(tmp);
          }
          // Begin sort
          if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
            doc[0].PPRData.sort(function(a, b){
              var nameA=a.cat.toLowerCase(), nameB=b.cat.toLowerCase()
              if (nameA < nameB){ //sort string ascending
                if (nameA == "(uncategorized)") {
                  return 1;
                }
                return -1
              }
              if (nameA > nameB){
                if (nameB =="(uncategorized)") {
                  return -1
                }
                return 1
              }
              var nameA=a.auditOrReview.toLowerCase(), nameB=b.auditOrReview.toLowerCase()
              if (nameA < nameB) //sort string ascending
                return -1
              if (nameA > nameB)
                return 1
              var nameA=a.reportingQuarter.toLowerCase(), nameB=b.reportingQuarter.toLowerCase()
              if (nameA < nameB) //sort string ascending
                return -1
              if (nameA > nameB)
                return 1
              var nameA=a.status.toLowerCase(), nameB=b.status.toLowerCase()
              if (nameA < nameB) //sort string ascending
                return -1
              if (nameA > nameB)
                return 1
              var nameA=a.reviewID.toLowerCase(), nameB=b.reviewID.toLowerCase()
              if (nameA < nameB) //sort string ascending
                return -1
              if (nameA > nameB)
                return 1
              return 0
            });
          }
          else {
            doc[0].PPRData.sort(function(a, b){
              var nameA=a.auditOrReview.toLowerCase(), nameB=b.auditOrReview.toLowerCase()
              if (nameA < nameB) //sort string ascending
                return -1
              if (nameA > nameB)
                return 1
              return 0
            });
          }
          // End sort

          var categoryList = {};
          var tmpList = doc[0].PPRData;
          doc[0].PPRData = [];
          var exportPPRData = [];
          var topCounter = 0;

          for (var i = 0; i < tmpList.length; i++) {
            //Categorization exclusive to GTS adds a new layer to the treetable
            if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
              if(typeof categoryList[tmpList[i].cat.replace(/ /g,'')] === "undefined") {
                topCounter++;
                var tmp2 ={
                  id: tmpList[i].cat.replace(/ /g,''),
                  cat: tmpList[i].cat,
                  catEntry: true,
                  count: 0
                }
                doc[0].PPRData.push(tmp2);
                categoryList[tmpList[i].cat.replace(/ /g,'')] = tmp2;
              }
              if(typeof categoryList[tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,'')] === "undefined"){
                var tmp2 ={
                  parent: tmpList[i].cat.replace(/ /g,''),
                  id:tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,''),
                  auditOrReview:tmpList[i].auditOrReview,
                  catEntry: true,
                  count: 0
                }
                doc[0].PPRData.push(tmp2);
                categoryList[tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,'')] = tmp2;
              }
              if(typeof categoryList[tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,'')+tmpList[i].reportingQuarter.replace(/ /g,'')] === "undefined"){
                var tmp2 ={
                  parent: tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,''),
                  id:tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,'')+tmpList[i].reportingQuarter.replace(/ /g,''),
                  reportingQuarter:tmpList[i].reportingQuarter,
                  catEntry: true,
                  count: 0
                }
                doc[0].PPRData.push(tmp2);
                categoryList[tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,'')+tmpList[i].reportingQuarter.replace(/ /g,'')] = tmp2;
              }
              if(typeof categoryList[tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,'')+tmpList[i].reportingQuarter.replace(/ /g,'')+tmpList[i].status.replace(/ /g,'')] === "undefined"){
                var tmp2 ={
                  parent: tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,'')+tmpList[i].reportingQuarter.replace(/ /g,''),
                  id:tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,'')+tmpList[i].reportingQuarter.replace(/ /g,'')+tmpList[i].status.replace(/ /g,''),
                  status:tmpList[i].status,
                  catEntry: true,
                  count: 0
                }
                doc[0].PPRData.push(tmp2);
                categoryList[tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,'')+tmpList[i].reportingQuarter.replace(/ /g,'')+tmpList[i].status.replace(/ /g,'')] = tmp2;
              }
              tmpList[i].parent = tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,'')+tmpList[i].reportingQuarter.replace(/ /g,'')+tmpList[i].status.replace(/ /g,'');
            }
            //If it's GBS, then categorization is missing and instead starts with the audit or review type
            else {
              if(typeof categoryList[tmpList[i].auditOrReview.replace(/ /g,'')] === "undefined"){
                topCounter++;
                var tmp2 ={
                  id: tmpList[i].auditOrReview.replace(/ /g,''),
                  auditOrReview:tmpList[i].auditOrReview,
                  catEntry: true,
                  count: 0
                }
                doc[0].PPRData.push(tmp2);
                categoryList[tmpList[i].auditOrReview.replace(/ /g,'')] = tmp2;
              }
              //Rest of the treetable continues as usual.
              if(typeof categoryList[tmpList[i].auditOrReview.replace(/ /g,'')+tmpList[i].reportingQuarter.replace(/ /g,'')] === "undefined"){
                var tmp2 ={
                  parent: tmpList[i].auditOrReview.replace(/ /g,''),
                  id:tmpList[i].auditOrReview.replace(/ /g,'')+tmpList[i].reportingQuarter.replace(/ /g,''),
                  reportingQuarter:tmpList[i].reportingQuarter,
                  catEntry: true,
                  count: 0
                }
                doc[0].PPRData.push(tmp2);
                categoryList[tmpList[i].auditOrReview.replace(/ /g,'')+tmpList[i].reportingQuarter.replace(/ /g,'')] = tmp2;
              }
              if(typeof categoryList[tmpList[i].reportingQuarter.replace(/ /g,'')+tmpList[i].status.replace(/ /g,'')] === "undefined"){
                var tmp2 ={
                  id: tmpList[i].reportingQuarter.replace(/ /g,'')+tmpList[i].status.replace(/ /g,''),
                  parent: tmpList[i].auditOrReview.replace(/ /g,'')+tmpList[i].reportingQuarter.replace(/ /g,''),
                  status:tmpList[i].status,
                  catEntry: true,
                  count: 0
                }
                doc[0].PPRData.push(tmp2);
                categoryList[tmpList[i].reportingQuarter.replace(/ /g,'')+tmpList[i].status.replace(/ /g,'')] = tmp2;
              }
              tmpList[i].parent = tmpList[i].reportingQuarter.replace(/ /g,'')+tmpList[i].status.replace(/ /g,'');
            }

            //adding counts
            tmpList[i].count = 1;
            categoryList[tmpList[i].parent].count++;
            categoryList[categoryList[tmpList[i].parent].parent].count++;
            categoryList[categoryList[categoryList[tmpList[i].parent].parent].parent].count++;
            //If it's GTS or GTS Transform, it also needs to count an additional layer for the categories.
            if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
              categoryList[categoryList[categoryList[categoryList[tmpList[i].parent].parent].parent].parent].count++;
            }
            //Add all the Internal Audits to the list
            doc[0].PPRData.push(tmpList[i]);
            ////TMP2 is for Excel and ODS export
            var tmp2 = {};
            if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
              tmp2 = {
                cat: tmpList[i].cat || " "
              };
            }
            tmp2 = {
              auditOrReview: tmpList[i].auditOrReview || " ",
              reportingQuarter: tmpList[i].reportingQuarter || " ",
              status: tmpList[i].status || " ",
              reviewID: tmpList[i].reviewID || " ",
              Name: tmpList[i].Name || " ",
              DocSubType: tmpList[i].DocSubType || " ",
              reportDate: tmpList[i].reportDate || " ",
              rating: tmpList[i].rating || " ",
              numRecommendationsTotal: tmpList[i].numRecommendationsTotal || " ",
              numRecommendationsOpen: tmpList[i].numRecommendationsOpen || " ",
              count: tmpList[i].count || " "
            };
            exportPPRData.push(tmp2);
          }

          //Export Proactive Reviews data to the Handlebars view
          doc[0].exportPPRData = exportPPRData;
          //Adding padding
          if (topCounter < defViewRow) {
            if (doc[0].PPRData.length == 0) {
              doc[0].PPRData = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].PPRData,10,(defViewRow- topCounter));
            }
          };
          //End of view 2

          //VIEW 3 - Other Audits

          //OtherAuditsData is populated on class-compdoc.js after querying all BU Country's local Audits that aren't Internal.
          var auditOther = doc[0].OtherAuditsData;
          //List that will export all local audits. Currently empty; to be populated below.
          doc[0].OtherAuditsData = [];

          //Iterate over the Other Audit list
          for (var i = 0; i < auditOther.length; i++) {
            var tmp = {};
            tmp.id = auditOther[i]._id;
            tmp.auditOrReview = auditOther[i].auditOrReview;
            for(var j = 0; j < parentAsmts.length; j++) {
              if (auditOther[i].parentid == parentAsmts[j]._id || auditOther[i].parentid == parentAsmts[j].parentid) {
                var parentAU = parentAUs[parentAsmts[j].parentid];
                tmp.Name = parentAU.Name;
                //Categorization for GTS: will cycle through all the IS Delivery and CRM docs to select one of those as category.
                if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
                  //If the assessment matches the parentid of the asmtsdocsDelivery, then its category is "IS Delivery"
                  for(var k = 0; k < parentISDeliveryDocs.length; k++) {
                    if (parentAU._id == parentISDeliveryDocs[k].parentid) {
                      tmp.cat = "IS Delivery";
                      break;
                    }
                  }
                  //If the assessment matches the parentid of the asmtsdocsCRM, then its category is "CRM/Other"
                  for(var k = 0; k < parentCRMDocs.length; k++) {
                    if (parentAU._id == parentCRMDocs[k].parentid) {
                      tmp.cat = "CRM/Other";
                      break;
                    }
                  }
                  //If there's no category after cycling both asmtsdocsDelivery and asmtsdocsCRM, then it should be labeled as uncategorized
                  if (typeof tmp.cat === "undefined" || tmp.cat == "") {
                    tmp.cat = "(uncategorized)";
                  }
                }
                //Doc Type
                if(parentAU.DocSubType == "Controllable Unit" && parentAU.Portfolio == "Yes") {
                  tmp.DocSubType = "Portfolio CU";
                }
                else if (parentAU.DocSubType == "Controllable Unit" && (parentAU.Portfolio == "No" || parentAU.Portfolio == "" || parentAU.Portfolio == undefined)){
                  tmp.DocSubType = "Standalone CU";
                }
                else {
                  tmp.DocSubType = parentAU.DocSubType;
                }
                //MSAC and Rating
                tmp.PeriodRatingPrev = parentAU.PeriodRatingPrev;
                tmp.PeriodRating = parentAsmts[j].PeriodRating;
                //IMT
                tmp.imt = parentAU.IMT;
                break;
              }
            }
            tmp.reportDate = auditOther[i].reportDate;
            tmp.comments = auditOther[i].comments;
            //Push all the data to the OtherAuditsData
            doc[0].OtherAuditsData.push(tmp);
          }
          // Begin sort
          if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
            doc[0].OtherAuditsData.sort(function(a, b){
              var nameA=a.cat.toLowerCase(), nameB=b.cat.toLowerCase();
              if (nameA < nameB) //sort string ascending
                return -1
              if (nameA > nameB)
                return 1
              return 0
            });
          }
          else {
            doc[0].OtherAuditsData.sort(function(a, b){
              var nameA=a.auditOrReview.toLowerCase(), nameB=b.auditOrReview.toLowerCase();
              if (nameA < nameB) //sort string ascending
                return -1
              if (nameA > nameB)
                return 1
              return 0
            });
          }
          // EndSort
          var exportOtherAuditsData = [];
          var tmpList = doc[0].OtherAuditsData;
          doc[0].OtherAuditsData = [];
          var categoryList = {};
          var topCounter = 0;

          for (var i = 0; i < tmpList.length; i++) {
            //Categorization exclusive to GTS adds a new layer to the treetable
            if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
              if(typeof categoryList[tmpList[i].cat.replace(/ /g,'')] === "undefined"){
                topCounter++;
                var tmp2 ={
                  id: tmpList[i].cat.replace(/ /g,''),
                  cat:tmpList[i].cat,
                  catEntry: true
                }
                doc[0].OtherAuditsData.push(tmp2);
                categoryList[tmpList[i].cat.replace(/ /g,'')] = tmp2;
              }
              if(typeof categoryList[tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,'')] === "undefined"){
                var tmp2 ={
                  parent: tmpList[i].cat.replace(/ /g,''),
                  id:tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,''),
                  auditOrReview:tmpList[i].auditOrReview,
                  catEntry: true
                }
                doc[0].OtherAuditsData.push(tmp2);
                categoryList[tmpList[i].cat.replace(/ /g,'')+tmpList[i].auditOrReview.replace(/ /g,'')] = tmp2;
              }
              tmpList[i].parent = tmpList[i].cat.replace(/ /g,'');
            }
            //If it's GBS, then categorization is missing and instead starts with the audit or review type
            else {
              if(typeof categoryList[tmpList[i].auditOrReview.replace(/ /g,'')] === "undefined"){
                topCounter++;
                var tmp2 ={
                  id: tmpList[i].auditOrReview.replace(/ /g,''),
                  auditOrReviewName:tmpList[i].auditOrReview,
                  catEntry: true
                }
                doc[0].OtherAuditsData.push(tmp2);
                categoryList[tmpList[i].auditOrReview.replace(/ /g,'')] = tmp2;
              }
              tmpList[i].parent = tmpList[i].auditOrReview.replace(/ /g,'');
            }
            //Add all the local audits to the Other Audits list
            doc[0].OtherAuditsData.push(tmpList[i]);
            //For Excel and ODS export
            var tmp2 = {};
            if (doc[0].MIRABusinessUnit == "GTS" || doc[0].MIRABusinessUnit == "GTS Transformation") {
              tmp2 = {
                cat: tmpList[i].cat || ""
              };
            }
            tmp2 = {
              auditOrReview: tmpList[i].auditOrReview || "",
              PeriodRating: tmpList[i].PeriodRating || "",
              imt: tmpList[i].imt || "",
              reportDate: tmpList[i].reportDate || "",
              Name: tmpList[i].Name || "",
              DocSubType: tmpList[i].DocSubType || "",
              PeriodRatingPrev: tmp.PeriodRatingPrev || "",
              CUSize: tmpList[i].CUSize || "",
              comments: tmpList[i].comments || ""
            };
            exportOtherAuditsData.push(tmp2);
          }
          //Export Proactive Reviews data to the Handlebars view
          doc[0].exportOtherAuditsData = exportOtherAuditsData;
          //Add padding
          if (topCounter < defViewRow) {
            if (doc[0].OtherAuditsData.length == 0) {
              doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].OtherAuditsData,10,(defViewRow- topCounter));
            }
          };
          //End of view 3

          // *** End of Audits and Reviews embedded view *** //
          break;

        case "Controllable Unit":
        // *** Start of Audits and Reviews embedded view 1 *** //
        var auditR = doc[0].AuditTrustedData;
        auditR.sort(function(a, b){
          var nameA=a.compntType.toLowerCase(), nameB=b.compntType.toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          var nameA=a.reportingQuarter.toLowerCase(), nameB=b.reportingQuarter.toLowerCase()
          if (nameA > nameB) //sort string descending
            return -1
          if (nameA < nameB)
            return 1
          return 0 //default return value (no sorting)
        });
        var typeList = {};
        var periodList = {};
        var exportPPR = [];
        var auditRList = [];

        for(var i = 0; i < auditR.length; i++){
          if (auditR[i].compntType == "PPR" && auditR[i].originalReportingQuarter == auditR[i].reportingQuarter) {
            auditR[i].COFlag = true;
          } else {
            auditR[i].COFlag = false;
          }
          // if(auditR[i].REVIEW_TYPE == "CHQ Internal Audit"||auditR[i].REVIEW_TYPE == "" && reportingQuarter == doc[0].CurrentPeriod){
          //   auditR[i].COFlag = false;
          // }else{
          // auditR[i].COFlag = true;
          // }
          if(auditR[i].compntType == "PPR"){
            auditR[i].compntType = "Proactive Reviews";
          }else{
            auditR[i].compntType = "Internal Audit";
          }
          if(typeof typeList[auditR[i].compntType] === "undefined"){
            auditRList.push(
              {
                id:auditR[i].compntType.replace(/ /g,''),
                reportingQuarter:auditR[i].compntType,
                catEntry:"Yes"
              }
            );
            typeList[auditR[i].compntType] = true;
          }
          if(typeof periodList[auditR[i].compntType.replace(/ /g,'')+auditR[i].reportingQuarter.replace(/ /g,'')] === "undefined"){
            auditRList.push(
              {
                parent: auditR[i].compntType.replace(/ /g,''),id:auditR[i].compntType.replace(/ /g,'')+auditR[i].reportingQuarter.replace(/ /g,''),
                reportingQuarter:auditR[i].reportingQuarter,
                catEntry:"Yes"
              }
            );
            periodList[auditR[i].compntType.replace(/ /g,'')+auditR[i].reportingQuarter.replace(/ /g,'')] = true;
          }

          auditR[i].eid = auditR[i].id;
          auditR[i].id = auditR[i]["_id"];
          auditR[i].parent = auditR[i].compntType.replace(/ /g,'')+auditR[i].reportingQuarter.replace(/ /g,'');

          exportPPR.push({
            period:auditR[i].reportingQuarter,
            CO:auditR[i].COFlag,
            auditOrReview:auditR[i].auditOrReview,
            id:auditR[i].eid,
            date:auditR[i].reportDate,
            rating:auditR[i].rating,
            totalrecs:auditR[i].numRecommendationsTotal,
            openrecos:auditR[i].numRecommendationsOpen,
            target2close:auditR[i].targetClose,
            comments:auditR[i].comments
          });
          auditRList.push(auditR[i]);
        }
        // add padding
        if (Object.keys(typeList).length < defViewRow) {
          if (auditRList == 0) {
            auditRList = fieldCalc.addTestViewData(10,defViewRow);
          } else {
            fieldCalc.addTestViewDataPadding(auditRList,10,(defViewRow-Object.keys(typeList).length));
          }
        }

        doc[0].AuditTrustedData = auditRList;
        doc[0].exportPPR = exportPPR;
        // *** End of Audits and Reviews embedded view 1 *** //
        // add padding for local audits
          if (doc[0].AuditLocalData.length < defViewRow) {
            if (doc[0].AuditLocalData.length == 0) {
              doc[0].AuditLocalData = fieldCalc.addTestViewData(8,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].AuditLocalData,8,(8-doc[0].AuditLocalData.length));
            }
          }
          break;
      }
    }catch(e){
      console.log("[class-auditsandreviews][calcAudits] - " + e.stack);
		}
	}

}
module.exports = calculateARTab;
