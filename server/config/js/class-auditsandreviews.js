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
          // Begin Sort
          /*doc[0].InternalAuditData.sort(function(a, b){
            var nameA=a.plannedStartDate.toLowerCase(), nameB=b.plannedStartDate.toLowerCase()
            if (nameA > nameB) //sort string descending
              return -1
            if (nameA < nameB)
              return 1
            return 0
          });*/
          // End sort
          //InternalAuditData is populated on class-compdoc.js after querying all BU Country's Internal Audits
          var auditInter = doc[0].InternalAuditData;
          //Then all BU Country's constituent asmts and AUs are stored
          var parentAsmts = doc[0].BUCountryAssessments;
          var parentAUs = doc[0].BUCountryAssessableUnits;
          //List that will export all Internal Audits. Currently empty; to be populated below.
          var exportInternalAuditData = [];
          doc[0].exportInternalAuditData = [];
          //Total Score (CU and Max) variables. To be calculated below.
          var totalCUScore = "";
          var totalMaxScore = "";
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
                }
                else if (parentAU.DocSubType == "Controllable Unit" && (parentAU.Portfolio == "No" || parentAU.Portfolio == "" || parentAU.Portfolio == undefined)){
                  tmp.DocSubType = "Standalone CU";
                }
                else {
                  tmp.DocSubType = parentAU.DocSubType;
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
            //Add all the Internal Audits to the list
            exportInternalAuditData.push(tmp);
            var tmp2 = {
              plannedStartDate: tmp.plannedStartDate || " ",
              engagement: tmp.engagement || " ",
              Name: tmp.Name || " ",
              DocSubType: tmp.DocSubType || " ",
              PeriodRatingPrev: tmp.PeriodRatingPrev || " ",
              PeriodRating: tmp.PeriodRating || " ",
              CUSize: tmp.CUSize || " ",
              CUScore: tmp.CUScore || " "
            };
            doc[0].exportInternalAuditData.push(tmp2);
          }
          //Calculate WeightedAuditScore
          var weightedScore = 0;
          if(totalMaxScore == 0 || totalMaxScore == "" || totalCUScore == "") {
            weightedScore = "";
          }
          else {
            weightedScore = ((totalCUScore/totalMaxScore)*100).toFixed(1);
          }
          //Export Internal Audit data and the Weighted Score to the Handlebars view

          doc[0].InternalAuditData = exportInternalAuditData;
          //padding
          /*if (doc[0].InternalAuditData.length < defViewRow) {
            if (doc[0].InternalAuditData.length == 0) {
              doc[0].InternalAuditData = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].InternalAuditData,10,(defViewRow-doc[0].InternalAuditData.length));
            }
          };*/
          doc[0].WeightedAuditScore = weightedScore;
          //End of view 1

          //VIEW 2 - Proactive Reviews
          // Begin sort
          doc[0].PPRData.sort(function(a, b){
            var nameA=a.auditOrReview.toLowerCase(), nameB=b.auditOrReview.toLowerCase()
            if (nameA < nameB) //sort string ascending
              return -1
            if (nameA > nameB)
              return 1
            return 0
          });
          // End sort
          //PPRData is populated on class-compdoc.js after querying all BU Country's Proactive Reviews
          var auditPPR = doc[0].PPRData;
          //List that will export all PPRs. Currently empty; to be populated below.
          var exportPPRData = [];
          var pprCount = 0;
          var categoryList = {};
          doc[0].PPRData = [];
          var topCounter = 0;
          for(var i = 0; i < auditPPR.length; i++) {
            if(typeof categoryList[auditPPR[i].auditOrReview.replace(/ /g,'')] === "undefined"){
              topCounter++;
              var tmp ={
                id: auditPPR[i].auditOrReview.replace(/ /g,''),
                auditOrReview:auditPPR[i].auditOrReview,
                catEntry: true,
                count: 0
              }
              doc[0].PPRData.push(tmp);
              categoryList[auditPPR[i].auditOrReview.replace(/ /g,'')] = tmp;
            }
            if(typeof categoryList[auditPPR[i].auditOrReview.replace(/ /g,'')+auditPPR[i].reportingQuarter.replace(/ /g,'')] === "undefined"){
              var tmp ={
                parent: auditPPR[i].auditOrReview.replace(/ /g,''),
                id:auditPPR[i].auditOrReview.replace(/ /g,'')+auditPPR[i].reportingQuarter.replace(/ /g,''),
                reportingQuarter:auditPPR[i].reportingQuarter,
                catEntry: true,
                count: 0
              }
              doc[0].PPRData.push(tmp);
              categoryList[auditPPR[i].auditOrReview.replace(/ /g,'')+auditPPR[i].reportingQuarter.replace(/ /g,'')] = tmp;
            }
            if(typeof categoryList[auditPPR[i].reportingQuarter.replace(/ /g,'')+auditPPR[i].status.replace(/ /g,'')] === "undefined"){
              var tmp ={
                id: auditPPR[i].reportingQuarter.replace(/ /g,'')+auditPPR[i].status.replace(/ /g,''),
                parent: auditPPR[i].auditOrReview.replace(/ /g,'')+auditPPR[i].reportingQuarter.replace(/ /g,''),
                status:auditPPR[i].status,
                catEntry: true,
                count: 0
              }
              doc[0].PPRData.push(tmp);
              categoryList[auditPPR[i].reportingQuarter.replace(/ /g,'')+auditPPR[i].status.replace(/ /g,'')] = tmp;
            }
            var tmp={};
            tmp.count = 1;
            tmp.id = auditPPR[i]._id;
            tmp.auditOrReview = auditPPR[i].auditOrReview;
            tmp.reportingQuarter = auditPPR[i].reportingQuarter;
            tmp.status = auditPPR[i].status;
            tmp.reviewID = auditPPR[i].id;
            if (typeof auditPPR[i].CU === "undefined" || auditPPR[i].CU == "" || auditPPR[i].CU == "Not Applicable" || auditPPR[i].CU == undefined) {
              auditPPR[i].CU = auditPPR[i].countryProcess;
            }
            for(var key in parentAUs) {
              if (auditPPR[i].CU == parentAUs[key].Name) {
                tmp.Name = parentAUs[key].Name;
                if(parentAUs[key].DocSubType == "Controllable Unit" && parentAUs[key].Portfolio == "Yes") {
                  tmp.DocSubType = "Portfolio CU";
                }
                else if (parentAUs[key].DocSubType == "Controllable Unit" && (parentAUs[key].Portfolio == "No" || parentAUs[key].Portfolio == "" || parentAUs[key].Portfolio == undefined)){
                  tmp.DocSubType = "Standalone CU";
                }
                else {
                  tmp.DocSubType = parentAUs[key].DocSubType;
                }
              }
            }
            tmp.reportDate = auditPPR[i].reportDate;
            tmp.rating = auditPPR[i].rating;
            tmp.numRecommendationsTotal = auditPPR[i].numRecommendationsTotal;
            tmp.numRecommendationsOpen = auditPPR[i].numRecommendationsOpen;
            tmp.parent = auditPPR[i].reportingQuarter.replace(/ /g,'')+auditPPR[i].status.replace(/ /g,'');
            //adding counts
            categoryList[tmp.parent].count++;
            categoryList[categoryList[tmp.parent].parent].count++;
            categoryList[categoryList[categoryList[tmp.parent].parent].parent].count++;
            doc[0].PPRData.push(tmp)
            var tmp2 = {
              auditOrReview: tmp.auditOrReview || " ",
              reportingQuarter: tmp.reportingQuarter || " ",
              status: tmp.status || " ",
              reviewID: tmp.reviewID || " ",
              Name: tmp.Name || " ",
              DocSubType: tmp.DocSubType || " ",
              reportDate: tmp.reportDate || " ",
              rating: tmp.rating || " ",
              numRecommendationsTotal: tmp.numRecommendationsTotal || " ",
              numRecommendationsOpen: tmp.numRecommendationsOpen || " ",
              count: tmp.count || " "
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
          // Begin sort
          doc[0].OtherAuditsData.sort(function(a, b){
            var nameA=a.auditOrReview.toLowerCase(), nameB=b.auditOrReview.toLowerCase()
            if (nameA < nameB) //sort string ascending
              return -1
            if (nameA > nameB)
              return 1
            return 0
          });
          // EndSort
          //OtherAuditsData is populated on class-compdoc.js after querying all BU Country's local Audits that aren't Internal.
          var auditOther = doc[0].OtherAuditsData;
          //List that will export all local audits. Currently empty; to be populated below.
          var exportOtherAuditsData = [];
          doc[0].exportOtherAuditsData = [];
          var categoryList = {};
          for (var i = 0; i < auditOther.length; i++) {
            if(typeof categoryList[auditOther[i].auditOrReview.replace(/ /g,'')] === "undefined"){
              var tmp ={
                id: auditOther[i].auditOrReview.replace(/ /g,''),
                auditOrReviewName:auditOther[i].auditOrReview
              }
              exportOtherAuditsData.push(tmp);
              categoryList[auditOther[i].auditOrReview.replace(/ /g,'')] = tmp;
            }
            var tmp = {};
            tmp.id = auditOther[i]._id;
            tmp.auditOrReview = auditOther[i].auditOrReview;

            for(var j = 0; j < parentAsmts.length; j++) {
              if (auditOther[i].parentid == parentAsmts[j]._id || auditOther[i].parentid == parentAsmts[j].parentid) {
                var parentAU = parentAUs[parentAsmts[j].parentid];
                tmp.Name = parentAU.Name;
                if(parentAU.DocSubType == "Controllable Unit" && parentAU.Portfolio == "Yes") {
                  tmp.DocSubType = "Portfolio CU";
                }
                else if (parentAU.DocSubType == "Controllable Unit" && (parentAU.Portfolio == "No" || parentAU.Portfolio == "" || parentAU.Portfolio == undefined)){
                  tmp.DocSubType = "Standalone CU";
                }
                else {
                  tmp.DocSubType = parentAU.DocSubType;
                }
                tmp.PeriodRatingPrev = parentAU.PeriodRatingPrev;
                tmp.PeriodRating = parentAsmts[j].PeriodRating;
                tmp.imt = parentAU.IMT;
              }
            }
            tmp.reportDate = auditOther[i].reportDate;
            tmp.comments = auditOther[i].comments;
            tmp.parent = auditOther[i].auditOrReview.replace(/ /g,'');
            //Add all the local audits to the Other Audits list
            exportOtherAuditsData.push(tmp);
            var tmp2 = {
              auditOrReview: tmp.auditOrReview || "",
              PeriodRating: tmp.PeriodRating || "",
              imt: tmp.imt || "",
              reportDate: tmp.reportDate || "",
              Name: tmp.Name || "",
              DocSubType: tmp.DocSubType || "",
              PeriodRatingPrev: tmp.PeriodRatingPrev || "",
              CUSize: tmp.CUSize || "",
              comments: tmp.comments || ""
            };
            doc[0].exportOtherAuditsData.push(tmp2);
          }
          //Export Proactive Reviews data to the Handlebars view
          doc[0].OtherAuditsData = exportOtherAuditsData;
          if (Object.keys(categoryList).length < defViewRow) {
            if (doc[0].OtherAuditsData.length == 0) {
              doc[0].OtherAuditsData = fieldCalc.addTestViewData(10,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].OtherAuditsData,10,(defViewRow-Object.keys(categoryList).length));
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
