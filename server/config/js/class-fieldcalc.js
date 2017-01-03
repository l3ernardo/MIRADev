/**************************************************************************************************
 *
 * MIRA Web field calculation codes
 * Date: 25 August 2016
 * By: genonms@ph.ibm.com
 *
 */

 var param = require('./class-parameter.js');
 var util = require('./class-utility.js');
 var opMetric = require('./class-opmetric.js');
 var q  = require("q");

var calculatefield = {

  // adding empty Test View Data Only
  addTestViewData: function(colnum, rownum) {
    var vwData = [];
    var col = [];
    for (var i = 0; i < colnum; i++) {
      col.push("");
    }
    var listdata = {col};
    for (var i = 0; i < rownum; i++) {
      vwData.push(listdata);
    }
    return vwData;
  },
  addTestViewDataPadding: function(obj, colnum, rownum) {
    var col = [];
    if (obj.length > 0) {
      for (var i = 0; i < rownum; i++) {
        obj.push({});
        for (var prop in obj[0]) {
          if (obj[0].hasOwnProperty(prop)) {
            obj[(obj.length-1)][prop] = "";
          }
        }
      }
    }
  },
  // adding empty Test View Data Only
  getRatingCategory: function(rating, ratingPrev) {
    var ratingCat;
    if (rating == "Sat") {
      if (ratingPrev == "Marg" || ratingPrev == "Unsat")
        ratingCat = "Sat &#9650;";
      else
        ratingCat = "Sat &#61;";
    } else if (rating == "Marg") {
      if (ratingPrev == "Unsat")
        ratingCat = "Marg &#9650;";
      else if (ratingPrev == "Sat")
        ratingCat = "Marg &#9660;";
      else
        ratingCat = "Marg &#61;";
    } else if (rating == "Unsat") {
      if (ratingPrev == "Sat" || ratingPrev == "Marg")
       ratingCat = "Unsat &#9660;";
      else
       ratingCat = "Unsat &#61;";
    } else if (rating == "Exempt") {
      ratingCat = "Exempt";
    } else {
      ratingCat = "NR";
    }
    return ratingCat;
  },

  getPrev4Qtrs: function(currentQtr) {
    var p4Qtrs = [];
    var current = currentQtr.split("Q");
    var prevYr = current[0]-1;
    switch (current[1]) {
      case "1":
        p4Qtrs.push(prevYr1+" Q1");
        p4Qtrs.push(prevYr+" Q2");
        p4Qtrs.push(prevYr+" Q3");
        p4Qtrs.push(prevYr+" Q4");
        break;
      case "2":
        p4Qtrs.push(prevYr+" Q2");
        p4Qtrs.push(prevYr+" Q3");
        p4Qtrs.push(prevYr+" Q4");
        p4Qtrs.push(current[0]+" Q1");
        break;
      case "3":
        p4Qtrs.push(prevYr+" Q3");
        p4Qtrs.push(prevYr+" Q4");
        p4Qtrs.push(current[0]+" Q1");
        p4Qtrs.push(current[0]+" Q2");
        break;
      case "4":
        p4Qtrs.push(prevYr+" Q4");
        p4Qtrs.push(current[0]+" Q1");
        p4Qtrs.push(current[0]+" Q2");
        p4Qtrs.push(current[0]+" Q3");
        break;
    }
    return p4Qtrs;
  },

	/* Calculates CatP, CatCU, BusinessUnitOLD, ShowEA ... etc */
	getDocParams: function(req, db, doc) {
    var deferred = q.defer();
		try{

      /* Calculate for Instance Design Specifics and parameters*/
  		var lParams = [];

      // Get Parameters for Assessable Units
      if (doc[0].DocType == "Assessable Unit") {
        if (req.session.businessunit == "GTS") {
          // GTS Assessable Unit Doc Parameters
    			if (doc[0].DocSubType == "Controllable Unit") {
    				doc[0].CatCU = "";
    				lParams = ['CRMCU','DeliveryCU','GTSInstanceDesign'];
    			} else if (doc[0].DocSubType == "Country Process" || doc[0].DocSubType == "Global Process") {
    				doc[0].CatP = "";
    				lParams = ['CRMProcess','DeliveryProcess','GTSInstanceDesign','EAProcess'];
    			} else {
    				lParams = ['GTSInstanceDesign'];
    			}
        }
        else if (req.session.businessunit == "GBS") {
          // GBS Assessable Unit Doc Parameters
          lParams.push('GBSInstanceDesign');
    		}
        else {
          // GTS Transformation Assessable Unit Doc Parameters
    		}
      }
      // Get Parameters for Assessments
      else {
        if (req.session.businessunit == "GTS") {
          // GTS Assessment Doc Parameters
    			if (doc[0].ParentDocSubType == "Controllable Unit") {
    				doc[0].CatCU = "";
    				lParams = ['CRMCU','DeliveryCU','GTSInstanceDesign'];
    			} else if (doc[0].ParentDocSubType == "Country Process" || doc[0].ParentDocSubType == "Global Process") {
    				doc[0].CatP = "";
    				lParams = ['CRMProcess','DeliveryProcess','GTSInstanceDesign','EAProcess'];
    			} else {
    				lParams = ['GTSInstanceDesign'];
    			}
          if (doc[0].ParentDocSubType == "Business Unit" || doc[0].ParentDocSubType == "BU Reporting Group" || doc[0].ParentDocSubType == "BU IOT" || doc[0].ParentDocSubType == "BU IMT" || doc[0].ParentDocSubType == "BU Country") {
            // For Testing Tab Dynamic tables in the Rollup Assessments
            lParams.push('GTSRollupProcessesOPS');
            lParams.push('GTSRollupProcessesFIN');
          }
        }
        else if (req.session.businessunit == "GBS") {
          // GBS Assessment Doc Parameters
          lParams.push('GBSInstanceDesign');
          if (doc[0].ParentDocSubType == "Business Unit" || doc[0].ParentDocSubType == "BU Reporting Group" || doc[0].ParentDocSubType == "BU IOT" || doc[0].ParentDocSubType == "BU IMT" || doc[0].ParentDocSubType == "BU Country") {
            // For Testing Tab Dynamic tables in the Rollup Assessments
            lParams.push('GBSRollupProcessesOPS');
            lParams.push('GBSRollupProcessesFIN');
          }
    		}
        else {
          // GTS Transformation Assessment Doc Parameters
    		}

        // For Operational Metric Parameters of Assessments
        var opMetricKey = opMetric.getOpMetricKeys(doc,lParams);

      }

  		param.getListParams(db, lParams).then(function(dataParam) {

        if(dataParam.status==200 & !dataParam.error) {
  				if (dataParam.parameters.CRMProcess) {
  					for (var j = 0; j < dataParam.parameters.CRMProcess[0].options.length; ++j) {
  						if (doc[0].GlobalProcess == dataParam.parameters.CRMProcess[0].options[j].name) doc[0].CatP = "CRM";
  					}
  				}
  				if (dataParam.parameters.DeliveryProcess) {
  					for (var j = 0; j < dataParam.parameters.DeliveryProcess[0].options.length; ++j) {
  						if (doc[0].GlobalProcess == dataParam.parameters.DeliveryProcess[0].options[j].name) doc[0].CatP = "Delivery";
  					}
  				}
  				if (dataParam.parameters.CRMCU) {
  					for (var j = 0; j < dataParam.parameters.CRMCU[0].options.length; ++j) {
  						if (doc[0].Category == dataParam.parameters.CRMCU[0].options[j].name) doc[0].CatCU = "CRM";
  					}
  				}
  				if (dataParam.parameters.DeliveryCU) {
  					for (var j = 0; j < dataParam.parameters.DeliveryCU[0].options.length; ++j) {
  						if (doc[0].Category == dataParam.parameters.DeliveryCU[0].options[j].name) doc[0].CatCU = "Delivery";
  					}
  				}
          if (dataParam.parameters.ProcessCatFIN) {
            doc[0].ProcessCategory = "OPS";
  					for (var j = 0; j < dataParam.parameters.ProcessCatFIN[0].options.length; ++j) {
  						if (doc[0].GPWWBCITKey == dataParam.parameters.ProcessCatFIN[0].options[j].name) doc[0].ProcessCategory = "FIN";
  					}
  				}
          if (dataParam.parameters.GBSRollupProcessesOPS) {
            doc[0].KCProcessOPS = dataParam.parameters.GBSRollupProcessesOPS[0].options;
  				}
          if (dataParam.parameters.GBSRollupProcessesFIN) {
            doc[0].KCProcessFIN = dataParam.parameters.GBSRollupProcessesFIN[0].options;
  				}
          if (dataParam.parameters.GTSRollupProcessesOPS) {
            doc[0].KCProcessOPS = dataParam.parameters.GTSRollupProcessesOPS[0].options;
  				}
          if (dataParam.parameters.GTSRollupProcessesFIN) {
            doc[0].KCProcessFIN = dataParam.parameters.GTSRollupProcessesFIN[0].options;
  				}

          // Get Operational Metrics
          if (dataParam.parameters[opMetricKey]) {
            opMetric.getOpMetrics(doc,dataParam,opMetricKey,req);
          }

          if (doc[0].DocSubType == "Country Process" && dataParam.parameters.EAProcess && doc[0].GPWWBCITKey != undefined && dataParam.parameters.EAProcess.indexOf(doc[0].GPWWBCITKey) != -1 )
            doc[0].ShowEA = 1;
  				// evaluate BusinessUnitOLD formula
  				if (dataParam.parameters.GTSInstanceDesign) doc[0].BusinessUnitOLD = eval(dataParam.parameters.GTSInstanceDesign[0].options[0].name);
  				if (dataParam.parameters.GBSInstanceDesign) doc[0].BusinessUnitOLD = eval(dataParam.parameters.GBSInstanceDesign[0].options[0].name);
          deferred.resolve(doc);

  			} else {
          deferred.reject({"status": 500, "error": err.error.reason});
  			}
  		}).catch(function(err) {
        deferred.reject({"status": 500, "error": err.error.reason});
  		});

    }catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},

	getCurrentAsmt: function(db, doc) {
    var deferred = q.defer();

		try {

      // Get cuurent quarter assessment
      var asmt = {
        selector:{
          "_id": {"$gt":0},
          "key": "Assessment",
          "AUStatus": "Active",
          "ParentDocSubType": doc[0].DocSubType,
          "WWBCITKey": doc[0].WWBCITKey,
          "CurrentPeriod": doc[0].CurrentPeriod
        }
      };
      db.find(asmt).then(function(asmtdata) {
        deferred.resolve({"status": 200, "doc": asmtdata.body.docs[0]});
      }).catch(function(err) {
        console.log("[class-fieldcalc][getCurrentAsmt] - " + err.error);
        deferred.reject({"status": 500, "error": err.error.reason});
      });

    } catch(e) {

      console.log("[class-fieldcalc][getCurrentAsmt] - " + err.error);
			deferred.reject({"status": 500, "error": e});

		}

		return deferred.promise;
	},

  /* Gets Constituent assesments of assessable unit */
	getAssessments: function(db, doc, req) {
    var deferred = q.defer();
		try {
      switch (doc[0].ParentDocSubType) {
        case "Global Process":
          var asmts = {
            selector:{
              "_id": {"$gt":0},
              "key": "Assessment",
              "AUStatus": "Active",
              "ParentDocSubType": "Country Process",
              "CurrentPeriod": req.session.quarter,
              "GPWWBCITKey": doc[0].WWBCITKey
            }
          };
          break;
        case "BU Country":
          var asmts = {
            selector:{
              "_id": {"$gt":0},
              "key": "Assessment",
              "AUStatus": "Active",
              "ParentDocSubType":{"$in":["Controllable Unit","Country Process"]},
              "BusinessUnit": doc[0].BusinessUnit,
              "CurrentPeriod": req.session.quarter,
              "Country": doc[0].Country
            }
          };
          break;
        case "BU IMT":
          var asmts = {
            selector:{
              "_id": {"$gt":0},
              "key": "Assessment",
              "AUStatus": "Active",
              "ParentDocSubType":{"$in":["Controllable Unit","Country Process","BU Country","BU IMT"]},
              "BusinessUnit": doc[0].BusinessUnit,
              "CurrentPeriod": req.session.quarter,
              "IMT": doc[0].IMT
            }
          };
          break;
        case "BU IOT":
          var asmts = {
            selector:{
              "_id": {"$gt":0},
              "key": "Assessment",
              "AUStatus": "Active",
              "CurrentPeriod": req.session.quarter,
              "$or": [
                { "$and": [{"BusinessUnit": doc[0].BusinessUnit},{"IOT": doc[0].IOT},{"ParentDocSubType":{"$in":["Controllable Unit","Country Process","BU IMT","BU IOT"]}}] },
                { "$and": [{"ParentDocSubType": "BU Country"},{"_id": doc[0].BUCountryIOT}] },
                { "$and": [{"ParentDocSubType": "BU Reporting Group"},{"_id": doc[0].RGRollup}] },
              ]
            }
          };
          break;
        case "BU Reporting Group":
          var asmts = {
            selector:{
              "_id": {"$gt":0},
              "key": "Assessment",
              "AUStatus": "Active",
              "CurrentPeriod": req.session.quarter,
              "BRGMembership": {"$regex": "(?i)"+doc[0]._id+"(?i)"}
            }
          };
          break;
        case "Business Unit":
          var asmts = {
            selector:{
              "_id": {"$gt":0},
              "key": "Assessment",
              "AUStatus": "Active",
              "CurrentPeriod": req.session.quarter,
              // "BusinessUnit": doc[0].BusinessUnit,
              "BusinessUnit": "testing only, replace this with the commented line above in IT8",
              "ParentDocSubType":{"$in":["Controllable Unit","Country Process","Global Process","BU IOT"]}
            }
          };
          break;
        case "Controllable Unit":
          var asmts = {
            selector:{
              "_id": {"$gt":0},
              "key": "Assessment",
              "AUStatus": "Active",
              "CurrentPeriod": req.session.quarter,
              "ParentDocSubType": "Country Process",
              "AssessableUnitName":{"$in":doc[0].RelevantCountryProcesses}
            }
          };
          break;
      }
      db.find(asmts).then(function(asmtsdata) {
        doc[0].asmtsdocs = asmtsdata.body.docs;
        deferred.resolve({"status": 200, "doc": doc});
      }).catch(function(err) {
        console.log("[class-fieldcalc][getAssessments] - " + err.error);
        deferred.reject({"status": 500, "error": err.error.reason});
      });
    } catch(e) {
      console.log("[class-fieldcalc][getAssessments] - " + err.error);
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},

  /* Populates the Rating Profile table */
	getRatingProfile: function(doc) {
		try {
      var satEqCU = 0, satUpCU = 0, margUpCU = 0, margEqCU = 0, margDwnCU = 0, unsatEqCU = 0, unsatDwnCU = 0, exemptCU = 0, nrCU = 0, bocExCU = 0;
      var satEq = 0, satUp = 0, margUp = 0, margEq = 0, margDwn = 0, unsatEq = 0, unsatDwn = 0, exempt = 0, nr = 0, bocEx = 0;
      var satEqFin = 0, satUpFin = 0, margUpFin = 0, margEqFin = 0, margDwnFin = 0, unsatEqFin = 0, unsatDwnFin = 0, exemptFin = 0, nrFin = 0;
      var satEqOps = 0, satUpOps = 0, margUpOps = 0, margEqOps = 0, margDwnOps = 0, unsatEqOps = 0, unsatDwnOps = 0, exemptOps = 0, nrOps = 0;
      var toadd;
      if (doc[0].ParentDocSubType == "Global Process" || doc[0].ParentDocSubType == "Controllable Unit" ) {
        for (var i = 0; i < doc[0].asmtsdocs.length; ++i) {
          switch (doc[0].ParentDocSubType) {
            case "Global Process":
              // PO tab performance indicators view
              toadd = {
                "docid":doc[0].asmtsdocs[i]._id,
                "name":doc[0].asmtsdocs[i].AssessableUnitName,
                "ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
                "ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
                "ratingPQ2":doc[0].asmtsdocs[i].PeriodRatingPrev2,
                "ratingPQ3":doc[0].asmtsdocs[i].PeriodRatingPrev3,
                "ratingPQ4":doc[0].asmtsdocs[i].PeriodRatingPrev4,
                "kcfrDR":doc[0].asmtsdocs[i].KCFRDefectRate,
                "kcoDR":doc[0].asmtsdocs[i].KCODefectRate,
                "msdRisk":doc[0].asmtsdocs[i].MissedOpenIssueCount,
                "msdMSAC":doc[0].asmtsdocs[i].MissedMSACSatCount
              };
              doc[0].CPAsmtDataPIview.push(toadd);
              // PO tab other indicators view
              toadd = {
                "docid":doc[0].asmtsdocs[i]._id,
                "name":doc[0].asmtsdocs[i].AssessableUnitName,
                "bocExCount":doc[0].asmtsdocs[i].BOCExceptionCount
              };
              doc[0].CPAsmtDataOIview.push(toadd);
              if (doc[0].asmtsdocs[i].OpMetric != undefined) {
                for (var j = 0; j < doc[0].asmtsdocs[i].OpMetric.length; ++j) {
                  doc[0].CPAsmtDataOIview[i][doc[0].asmtsdocs[i].OpMetric[j].id+"Rating"] = doc[0].asmtsdocs[i].OpMetric[j].rating;
                }
              }
              // Process Ratings tab first embedded view
              toadd = {
                "docid":doc[0].asmtsdocs[i]._id,
                "country":doc[0].asmtsdocs[i].Country,
                "iot":doc[0].asmtsdocs[i].IOT,
                "ratingcategory":doc[0].asmtsdocs[i].RatingCategory,
                "ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
                "ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
                "targettosat":doc[0].asmtsdocs[i].Target2Sat,
                "targettosatprev":doc[0].asmtsdocs[i].Target2SatPrev,
                "reviewcomments":doc[0].asmtsdocs[i].ReviewComments
              };
              doc[0].CPAsmtDataPR1view.push(toadd);
              // Basics of Control Exception Counter
              if (doc[0].asmtsdocs[i].BOCExceptionCount == 1) bocEx = bocEx + 1;
              break;
            case "Controllable Unit":
              // Process Ratings Tab embedded views
              toadd = {
                "docid":doc[0].asmtsdocs[i]._id,
                "name":doc[0].asmtsdocs[i].AssessableUnitName,
                "country":doc[0].asmtsdocs[i].Country,
                "ratingcategory":doc[0].asmtsdocs[i].RatingCategory,
                "ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
                "ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
                "targettosat":doc[0].asmtsdocs[i].Target2Sat,
                "targettosatprev":doc[0].asmtsdocs[i].Target2SatPrev,
                "reviewcomments":doc[0].asmtsdocs[i].ReviewComments
              };
              doc[0].CUAsmtDataPR1view.push(toadd);
              break;
          }
          // Rating Category Counters
          switch (doc[0].asmtsdocs[i].RatingCategory) {
            case "Sat &#9650;":
              if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") satUpFin = satUpFin + 1;
              else satUpOps = satUpOps + 1;
              break;
            case "Sat &#61;":
              if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") satEqFin = satEqFin + 1;
              else satEqOps = satEqOps + 1;
              break;
            case "Marg &#9650;":
              if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") margUpFin = margUpFin + 1;
              else margUpOps = margUpOps + 1;
              break;
            case "Marg &#9660;":
              if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") margDwnFin = margDwnFin + 1;
              else margDwnOps = margDwnOps + 1;
              break;
            case "Marg &#61;":
              if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") margEqFin = margEqFin + 1;
              else margEqOps = margEqOps + 1;
              break;
            case "Unsat &#9660;":
              if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") unsatDwnFin = unsatDwnFin + 1;
              else unsatDwnOps = unsatDwnOps + 1;
              break;
            case "Unsat &#61;":
              if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") unsatEqFin = unsatEqFin + 1;
              else unsatEqOps = unsatEqOps + 1;
              break;
            case "Exempt":
              if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") exemptFin = exemptFin + 1;
              else exemptOps = exemptOps + 1;
              break;
            default:
              if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") nrFin = nrFin + 1;
              else nrOps = nrOps + 1;
          }
        }

        if (doc[0].ParentDocSubType == "Global Process") {
          doc[0].BOCExceptionCount = bocEx;
        }
        // Processing Financial processes
        doc[0].FINCPSatEqualCnt = satEqFin;
        doc[0].FINCPSatPlusCnt = satUpFin;
        doc[0].FINCPMargPlusCnt = margUpFin;
        doc[0].FINCPMargEqualCnt = margEqFin;
        doc[0].FINCPMargMinusCnt = margDwnFin;
        doc[0].FINCPUnsatEqualCnt = unsatEqFin;
        doc[0].FINCPUnsatMinusCnt = unsatDwnFin;
        doc[0].FINCPEXEMPTCnt = exemptFin;
        doc[0].FINCPNRCnt = nrFin;
        doc[0].FINCPTotalCnt = satEqFin + satUpFin + margUpFin + margEqFin + margDwnFin + unsatEqFin + unsatDwnFin + exemptFin + nrFin;
        if (satEqFin == 0)
          doc[0].FINCPSatEqualPct = "0%";
        else
          doc[0].FINCPSatEqualPct = ((satEqFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (satUpFin == 0)
          doc[0].FINCPSatPlusPct = "0%";
        else
          doc[0].FINCPSatPlusPct = ((satUpFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (margUpFin == 0)
          doc[0].FINCPMargPlusPct = "0%";
        else
          doc[0].FINCPMargPlusPct = ((margUpFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (margEqFin == 0)
          doc[0].FINCPMargEqualPct = "0%";
        else
          doc[0].FINCPMargEqualPct = ((margEqFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (margDwnFin == 0)
          doc[0].FINCPMargMinusPct = "0%";
        else
          doc[0].FINCPMargMinusPct = ((margDwnFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (unsatEqFin == 0)
          doc[0].FINCPUnsatEqualPct = "0%";
        else
          doc[0].FINCPUnsatEqualPct = ((unsatEqFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (unsatDwnFin == 0)
          doc[0].FINCPUnsatMinusPct = "0%";
        else
          doc[0].FINCPUnsatMinusPct = ((unsatDwnFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (exemptFin == 0)
          doc[0].FINCPEXEMPTPct = "0%";
        else
          doc[0].FINCPEXEMPTPct = ((exemptFin/1) * 100).toFixed() + "%";
        if (nrFin == 0)
          doc[0].FINCPNRPct = "0%";
        else
          doc[0].FINCPNRPct = ((nrFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (doc[0].FINCPTotalCnt == 0)
          doc[0].FINCPTotalPct = "0%";
        else
          doc[0].FINCPTotalPct = "100%";

        // Processing Operatioanl processes
        doc[0].OPSCPSatEqualCnt = satEqOps;
        doc[0].OPSCPSatPlusCnt = satUpOps;
        doc[0].OPSCPMargPlusCnt = margUpOps;
        doc[0].OPSCPMargEqualCnt = margEqOps;
        doc[0].OPSCPMargMinusCnt = margDwnOps;
        doc[0].OPSCPUnsatEqualCnt = unsatEqOps;
        doc[0].OPSCPUnsatMinusCnt = unsatDwnOps;
        doc[0].OPSCPEXEMPTCnt = exemptOps;
        doc[0].OPSCPNRCnt = nrOps;
        doc[0].OPSCPTotalCnt = satEqOps + satUpOps + margUpOps + margEqOps + margDwnOps + unsatEqOps + unsatDwnOps + exemptOps + nrOps;

        if (satEqOps == 0)
          doc[0].OPSCPSatEqualPct = "0%";
        else
          doc[0].OPSCPSatEqualPct = ((satEqOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (satUpOps == 0)
          doc[0].OPSCPSatPlusPct = "0%";
        else
          doc[0].OPSCPSatPlusPct = ((satUpOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (margUpOps == 0)
          doc[0].OPSCPMargPlusPct = "0%";
        else
          doc[0].OPSCPMargPlusPct = ((margUpOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (margEqOps == 0)
          doc[0].OPSCPMargEqualPct = "0%";
        else
          doc[0].OPSCPMargEqualPct = ((margEqOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (margDwnOps == 0)
          doc[0].OPSCPMargMinusPct = "0%";
        else
          doc[0].OPSCPMargMinusPct = ((margDwnOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (unsatEqOps == 0)
          doc[0].OPSCPUnsatEqualPct = "0%";
        else
          doc[0].OPSCPUnsatEqualPct = ((unsatEqOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (unsatDwnOps == 0)
          doc[0].OPSCPUnsatMinusPct = "0%";
        else
          doc[0].OPSCPUnsatMinusPct = ((unsatDwnOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (exemptOps == 0)
          doc[0].OPSCPEXEMPTPct = "0%";
        else
          doc[0].OPSCPEXEMPTPct = ((exemptOps/1) * 100).toFixed() + "%";
        if (nrOps == 0)
          doc[0].OPSCPNRPct = "0%";
        else
          doc[0].OPSCPNRPct = ((nrOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (doc[0].OPSCPTotalCnt == 0)
          doc[0].OPSCPTotalPct = "0%";
        else
          doc[0].OPSCPTotalPct = "100%";

        // Processing totals of financial and operational processes
        satUp = satUpFin + satUpOps;
        satEq = satEqFin + satEqOps;
        margUp = margUpFin + margUpOps;
        margDwn = margDwnFin + margDwnOps;
        margEq = margEqFin + margEqOps;
        unsatDwn = unsatDwnFin + unsatDwnOps;
        unsatEq = unsatEqFin + unsatEqOps;
        exempt = exemptFin + exemptOps;
        nr = nrFin + nrOps;
        doc[0].CPSatEqualCnt = satEq;
        doc[0].CPSatPlusCnt = satUp;
        doc[0].CPMargPlusCnt = margUp;
        doc[0].CPMargEqualCnt = margEq;
        doc[0].CPMargMinusCnt = margDwn;
        doc[0].CPUnsatEqualCnt = unsatEq;
        doc[0].CPUnsatMinusCnt = unsatDwn;
        doc[0].CPEXEMPTCnt = exempt;
        doc[0].CPNRCnt = nr;
        doc[0].CPTotalCnt = satEq + satUp + margUp + margEq + margDwn + unsatEq + unsatDwn + exempt + nr;

        if (satEq == 0)
          doc[0].CPSatEqualPct = "0%";
        else
          doc[0].CPSatEqualPct = ((satEq/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (satUp == 0)
          doc[0].CPSatPlusPct = "0%";
        else
          doc[0].CPSatPlusPct = ((satUp/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (margUp == 0)
          doc[0].CPMargPlusPct = "0%";
        else
          doc[0].CPMargPlusPct = ((margUp/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (margEq == 0)
          doc[0].CPMargEqualPct = "0%";
        else
          doc[0].CPMargEqualPct = ((margEq/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (margDwn == 0)
          doc[0].CPMargMinusPct = "0%";
        else
          doc[0].CPMargMinusPct = ((margDwn/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (unsatEq == 0)
          doc[0].CPUnsatEqualPct = "0%";
        else
          doc[0].CPUnsatEqualPct = ((unsatEq/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (unsatDwn == 0)
          doc[0].CPUnsatMinusPct = "0%";
        else
          doc[0].CPUnsatMinusPct = ((unsatDwn/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (exempt == 0)
          doc[0].CPEXEMPTPct = "0%";
        else
          doc[0].CPEXEMPTPct = ((exempt/1) * 100).toFixed() + "%";
        if (nr == 0)
          doc[0].CPNRPct = "0%";
        else
          doc[0].CPNRPct = ((nr/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (doc[0].CPTotalCnt == 0)
          doc[0].CPTotalPct = "0%";
        else
          doc[0].CPTotalPct = "100%";

      }
      else { // For BU Country, BU IOT, BU IMT, BU Reporting Group and Business Unit which needs to process ratings profile for both CU and CP
        var podatactr = 0;
        for (var i = 0; i < doc[0].asmtsdocs.length; ++i) {

          if (doc[0].asmtsdocs[i].ParentDocSubType == "Country Process") {
            // Process Ratings Tab embedded views
            toadd = {
              "docid":doc[0].asmtsdocs[i]._id,
              "name":doc[0].asmtsdocs[i].AssessableUnitName,
              "country":doc[0].asmtsdocs[i].Country,
              "imt":doc[0].asmtsdocs[i].IMT,
              "process":doc[0].asmtsdocs[i].GlobalProcess,
              "auditprogram":doc[0].asmtsdocs[i].AuditProgram,
              "ratingcategory":doc[0].asmtsdocs[i].RatingCategory,
              "ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
              "ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
              "targettosat":doc[0].asmtsdocs[i].Target2Sat,
              "targettosatprev":doc[0].asmtsdocs[i].Target2SatPrev,
              "reviewcomments":doc[0].asmtsdocs[i].ReviewComments
            };
            doc[0].BUCAsmtDataPRview.push(toadd);
            // Rating Category Counters for CP
            switch (doc[0].asmtsdocs[i].RatingCategory) {
              case "Sat &#9650;":
                if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") satUpFin = satUpFin + 1;
                else satUpOps = satUpOps + 1;
                break;
              case "Sat &#61;":
                if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") satEqFin = satEqFin + 1;
                else satEqOps = satEqOps + 1;
                break;
              case "Marg &#9650;":
                if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") margUpFin = margUpFin + 1;
                else margUpOps = margUpOps + 1;
                break;
              case "Marg &#9660;":
                if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") margDwnFin = margDwnFin + 1;
                else margDwnOps = margDwnOps + 1;
                break;
              case "Marg &#61;":
                if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") margEqFin = margEqFin + 1;
                else margEqOps = margEqOps + 1;
                break;
              case "Unsat &#9660;":
                if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") unsatDwnFin = unsatDwnFin + 1;
                else unsatDwnOps = unsatDwnOps + 1;
                break;
              case "Unsat &#61;":
                if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") unsatEqFin = unsatEqFin + 1;
                else unsatEqOps = unsatEqOps + 1;
                break;
              case "Exempt":
                if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") exemptFin = exemptFin + 1;
                else exemptOps = exemptOps + 1;
                break;
              default:
                if (doc[0].asmtsdocs[i].ProcessCategory == "FIN") nrFin = nrFin + 1;
                else nrOps = nrOps + 1;
            }
          }
          if (doc[0].asmtsdocs[i].ParentDocSubType == "Controllable Unit") {
            // CU Ratings Tab embedded views
            toadd = {
              "docid":doc[0].asmtsdocs[i]._id,
              "name":doc[0].asmtsdocs[i].AssessableUnitName,
              "country":doc[0].asmtsdocs[i].Country,
              "imt":doc[0].asmtsdocs[i].IMT,
              "size":doc[0].asmtsdocs[i].CUSize,
              "maxscore":doc[0].asmtsdocs[i].CUMaxScore,
              "cqscore":doc[0].asmtsdocs[i].CUScore,
              "pqscore":doc[0].asmtsdocs[i].CUScorePrev,
              "ratingcategory":doc[0].asmtsdocs[i].RatingCategory,
              "ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
              "ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
              "targettosat":doc[0].asmtsdocs[i].Target2Sat,
              "targettosatprev":doc[0].asmtsdocs[i].Target2SatPrev,
              "reviewcomments":doc[0].asmtsdocs[i].ReviewComments
            };
            doc[0].BUCAsmtDataCURview.push(toadd);

            // Rating Category Counters for CU
            switch (doc[0].asmtsdocs[i].RatingCategory) {
              case "Sat &#9650;":
                satUpCU = satUpCU + 1;
                break;
              case "Sat &#61;":
                satEqCU = satEqCU + 1;
                break;
              case "Marg &#9650;":
                margUpCU = margUpCU + 1;
                break;
              case "Marg &#9660;":
                margDwnCU = margDwnCU + 1;
                break;
              case "Marg &#61;":
                margEqCU = margEqCU + 1;
                break;
              case "Unsat &#9660;":
                unsatDwnCU = unsatDwnCU + 1;
                break;
              case "Unsat &#61;":
                unsatEqCU = unsatEqCU + 1;
                break;
              case "Exempt":
                exemptCU = exemptCU + 1;
                break;
              default:
                nrCU = nrCU + 1;
            }
          }

          switch (doc[0].ParentDocSubType) {
            case "BU IOT":
            case "BU IMT":
              toadd = {
                "docid":doc[0].asmtsdocs[i]._id,
                "name":doc[0].asmtsdocs[i].AssessableUnitName,
                "ParentDocSubType":doc[0].asmtsdocs[i].ParentDocSubType,
                "ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
                "ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
                "ratingPQ2":doc[0].asmtsdocs[i].PeriodRatingPrev2,
                "ratingPQ3":doc[0].asmtsdocs[i].PeriodRatingPrev3,
                "ratingPQ4":doc[0].asmtsdocs[i].PeriodRatingPrev4,
                "kcfrDR":doc[0].asmtsdocs[i].KCFRDefectRate,
                "kcoDR":doc[0].asmtsdocs[i].KCODefectRate,
                "auditScore":doc[0].asmtsdocs[i].WeightedAuditScore,
                "msdRisk":doc[0].asmtsdocs[i].MissedOpenIssueCount,
                "msdMSAC":doc[0].asmtsdocs[i].MissedMSACSatCount
              };
              doc[0].BUCAsmtDataPIview.push(toadd);
              // PO tab other indicators view
              toadd = {
                "docid":doc[0].asmtsdocs[i]._id,
                "name":doc[0].asmtsdocs[i].AssessableUnitName,
                "ParentDocSubType":doc[0].asmtsdocs[i].ParentDocSubType,
                "bocExCount":doc[0].asmtsdocs[i].BOCExceptionCount
              };
              doc[0].BUCAsmtDataOIview.push(toadd);
              if (doc[0].asmtsdocs[i].OpMetric != undefined) {
                for (var j = 0; j < doc[0].asmtsdocs[i].OpMetric.length; ++j) {
                  doc[0].BUCAsmtDataOIview[podatactr][doc[0].asmtsdocs[i].OpMetric[j].id+"Rating"] = doc[0].asmtsdocs[i].OpMetric[j].rating;
                }
              }
              podatactr = podatactr + 1;
              // Basics of Control Exception Counter
              if (doc[0].asmtsdocs[i].BOCExceptionCount == 1) bocEx = bocEx + 1;
              break;
            case "BU Country":
              // PO tab performance indicators view
              toadd = {
                "docid":doc[0].asmtsdocs[i]._id,
                "name":doc[0].asmtsdocs[i].AssessableUnitName,
                "ParentDocSubType":doc[0].asmtsdocs[i].ParentDocSubType,
                "ratingCQ":doc[0].asmtsdocs[i].PeriodRating,
                "ratingPQ1":doc[0].asmtsdocs[i].PeriodRatingPrev1,
                "ratingPQ2":doc[0].asmtsdocs[i].PeriodRatingPrev2,
                "ratingPQ3":doc[0].asmtsdocs[i].PeriodRatingPrev3,
                "ratingPQ4":doc[0].asmtsdocs[i].PeriodRatingPrev4,
                "kcfrDR":doc[0].asmtsdocs[i].KCFRDefectRate,
                "kcoDR":doc[0].asmtsdocs[i].KCODefectRate,
                "auditScore":doc[0].asmtsdocs[i].WeightedAuditScore,
                "msdRisk":doc[0].asmtsdocs[i].MissedOpenIssueCount,
                "msdMSAC":doc[0].asmtsdocs[i].MissedMSACSatCount
              };
              doc[0].BUCAsmtDataPIview.push(toadd);
              // PO tab other indicators view
              toadd = {
                "docid":doc[0].asmtsdocs[i]._id,
                "name":doc[0].asmtsdocs[i].AssessableUnitName,
                "ParentDocSubType":doc[0].asmtsdocs[i].ParentDocSubType,
                "bocExCount":doc[0].asmtsdocs[i].BOCExceptionCount
              };
              if (doc[0].asmtsdocs[i].OpMetric != undefined) {
                for (var j = 0; j < doc[0].asmtsdocs[i].OpMetric.length; ++j) {
                  doc[0].BUCAsmtDataOIview[i][doc[0].asmtsdocs[i].OpMetric[j].id+"Rating"] = doc[0].asmtsdocs[i].OpMetric[j].rating;
                }
              }
              // Basics of Control Exception Counter
              if (doc[0].asmtsdocs[i].BOCExceptionCount == 1) {
                bocEx = bocEx + 1;
              }
              break;
          // }
          }
        }
        if (doc[0].ParentDocSubType == "Global Process" || doc[0].ParentDocSubType == "BU Country" || doc[0].ParentDocSubType == "BU IMT" || doc[0].ParentDocSubType == "BU IOT") {
          doc[0].BOCExceptionCount = bocEx;
        }
        // Processing Financial processes
        doc[0].FINCPSatEqualCnt = satEqFin;
        doc[0].FINCPSatPlusCnt = satUpFin;
        doc[0].FINCPMargPlusCnt = margUpFin;
        doc[0].FINCPMargEqualCnt = margEqFin;
        doc[0].FINCPMargMinusCnt = margDwnFin;
        doc[0].FINCPUnsatEqualCnt = unsatEqFin;
        doc[0].FINCPUnsatMinusCnt = unsatDwnFin;
        doc[0].FINCPEXEMPTCnt = exemptFin;
        doc[0].FINCPNRCnt = nrFin;
        doc[0].FINCPTotalCnt = satEqFin + satUpFin + margUpFin + margEqFin + margDwnFin + unsatEqFin + unsatDwnFin + exemptFin + nrFin;
        if (satEqFin == 0)
          doc[0].FINCPSatEqualPct = "0%";
        else
          doc[0].FINCPSatEqualPct = ((satEqFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (satUpFin == 0)
          doc[0].FINCPSatPlusPct = "0%";
        else
          doc[0].FINCPSatPlusPct = ((satUpFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (margUpFin == 0)
          doc[0].FINCPMargPlusPct = "0%";
        else
          doc[0].FINCPMargPlusPct = ((margUpFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (margEqFin == 0)
          doc[0].FINCPMargEqualPct = "0%";
        else
          doc[0].FINCPMargEqualPct = ((margEqFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (margDwnFin == 0)
          doc[0].FINCPMargMinusPct = "0%";
        else
          doc[0].FINCPMargMinusPct = ((margDwnFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (unsatEqFin == 0)
          doc[0].FINCPUnsatEqualPct = "0%";
        else
          doc[0].FINCPUnsatEqualPct = ((unsatEqFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (unsatDwnFin == 0)
          doc[0].FINCPUnsatMinusPct = "0%";
        else
          doc[0].FINCPUnsatMinusPct = ((unsatDwnFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (exemptFin == 0)
          doc[0].FINCPEXEMPTPct = "0%";
        else
          doc[0].FINCPEXEMPTPct = ((exemptFin/1) * 100).toFixed() + "%";
        if (nrFin == 0)
          doc[0].FINCPNRPct = "0%";
        else
          doc[0].FINCPNRPct = ((nrFin/doc[0].FINCPTotalCnt) * 100).toFixed() + "%";
        if (doc[0].FINCPTotalCnt == 0)
          doc[0].FINCPTotalPct = "0%";
        else
          doc[0].FINCPTotalPct = "100%";

        // Processing Operatioanl processes
        doc[0].OPSCPSatEqualCnt = satEqOps;
        doc[0].OPSCPSatPlusCnt = satUpOps;
        doc[0].OPSCPMargPlusCnt = margUpOps;
        doc[0].OPSCPMargEqualCnt = margEqOps;
        doc[0].OPSCPMargMinusCnt = margDwnOps;
        doc[0].OPSCPUnsatEqualCnt = unsatEqOps;
        doc[0].OPSCPUnsatMinusCnt = unsatDwnOps;
        doc[0].OPSCPEXEMPTCnt = exemptOps;
        doc[0].OPSCPNRCnt = nrOps;
        doc[0].OPSCPTotalCnt = satEqOps + satUpOps + margUpOps + margEqOps + margDwnOps + unsatEqOps + unsatDwnOps + exemptOps + nrOps;

        if (satEqOps == 0)
          doc[0].OPSCPSatEqualPct = "0%";
        else
          doc[0].OPSCPSatEqualPct = ((satEqOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (satUpOps == 0)
          doc[0].OPSCPSatPlusPct = "0%";
        else
          doc[0].OPSCPSatPlusPct = ((satUpOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (margUpOps == 0)
          doc[0].OPSCPMargPlusPct = "0%";
        else
          doc[0].OPSCPMargPlusPct = ((margUpOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (margEqOps == 0)
          doc[0].OPSCPMargEqualPct = "0%";
        else
          doc[0].OPSCPMargEqualPct = ((margEqOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (margDwnOps == 0)
          doc[0].OPSCPMargMinusPct = "0%";
        else
          doc[0].OPSCPMargMinusPct = ((margDwnOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (unsatEqOps == 0)
          doc[0].OPSCPUnsatEqualPct = "0%";
        else
          doc[0].OPSCPUnsatEqualPct = ((unsatEqOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (unsatDwnOps == 0)
          doc[0].OPSCPUnsatMinusPct = "0%";
        else
          doc[0].OPSCPUnsatMinusPct = ((unsatDwnOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (exemptOps == 0)
          doc[0].OPSCPEXEMPTPct = "0%";
        else
          doc[0].OPSCPEXEMPTPct = ((exemptOps/1) * 100).toFixed() + "%";
        if (nrOps == 0)
          doc[0].OPSCPNRPct = "0%";
        else
          doc[0].OPSCPNRPct = ((nrOps/doc[0].OPSCPTotalCnt) * 100).toFixed() + "%";
        if (doc[0].OPSCPTotalCnt == 0)
          doc[0].OPSCPTotalPct = "0%";
        else
          doc[0].OPSCPTotalPct = "100%";

        // Processing totals of financial and operational processes
        satUp = satUpFin + satUpOps;
        satEq = satEqFin + satEqOps;
        margUp = margUpFin + margUpOps;
        margDwn = margDwnFin + margDwnOps;
        margEq = margEqFin + margEqOps;
        unsatDwn = unsatDwnFin + unsatDwnOps;
        unsatEq = unsatEqFin + unsatEqOps;
        exempt = exemptFin + exemptOps;
        nr = nrFin + nrOps;
        doc[0].CPSatEqualCnt = satEq;
        doc[0].CPSatPlusCnt = satUp;
        doc[0].CPMargPlusCnt = margUp;
        doc[0].CPMargEqualCnt = margEq;
        doc[0].CPMargMinusCnt = margDwn;
        doc[0].CPUnsatEqualCnt = unsatEq;
        doc[0].CPUnsatMinusCnt = unsatDwn;
        doc[0].CPEXEMPTCnt = exempt;
        doc[0].CPNRCnt = nr;
        doc[0].CPTotalCnt = satEq + satUp + margUp + margEq + margDwn + unsatEq + unsatDwn + exempt + nr;

        if (satEq == 0)
          doc[0].CPSatEqualPct = "0%";
        else
          doc[0].CPSatEqualPct = ((satEq/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (satUp == 0)
          doc[0].CPSatPlusPct = "0%";
        else
          doc[0].CPSatPlusPct = ((satUp/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (margUp == 0)
          doc[0].CPMargPlusPct = "0%";
        else
          doc[0].CPMargPlusPct = ((margUp/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (margEq == 0)
          doc[0].CPMargEqualPct = "0%";
        else
          doc[0].CPMargEqualPct = ((margEq/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (margDwn == 0)
          doc[0].CPMargMinusPct = "0%";
        else
          doc[0].CPMargMinusPct = ((margDwn/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (unsatEq == 0)
          doc[0].CPUnsatEqualPct = "0%";
        else
          doc[0].CPUnsatEqualPct = ((unsatEq/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (unsatDwn == 0)
          doc[0].CPUnsatMinusPct = "0%";
        else
          doc[0].CPUnsatMinusPct = ((unsatDwn/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (exempt == 0)
          doc[0].CPEXEMPTPct = "0%";
        else
          doc[0].CPEXEMPTPct = ((exempt/1) * 100).toFixed() + "%";
        if (nr == 0)
          doc[0].CPNRPct = "0%";
        else
          doc[0].CPNRPct = ((nr/doc[0].CPTotalCnt) * 100).toFixed() + "%";
        if (doc[0].CPTotalCnt == 0)
          doc[0].CPTotalPct = "0%";
        else
          doc[0].CPTotalPct = "100%";

        // Processing totals of CU Ratings
        doc[0].CUSatEqualCnt = satEqCU;
        doc[0].CUSatPlusCnt = satUpCU;
        doc[0].CUMargPlusCnt = margUpCU;
        doc[0].CUMargEqualCnt = margEqCU;
        doc[0].CUMargMinusCnt = margDwnCU;
        doc[0].CUUnsatEqualCnt = unsatEqCU;
        doc[0].CUUnsatMinusCnt = unsatDwnCU;
        doc[0].CUEXEMPTCnt = exemptCU;
        doc[0].CUNRCnt = nrCU;
        doc[0].CUTotalCnt = satEqCU + satUpCU + margUpCU + margEqCU + margDwnCU + unsatEqCU + unsatDwnCU + exemptCU + nrCU;

        if (satEqCU == 0)
          doc[0].CUSatEqualPct = "0%";
        else
          doc[0].CUSatEqualPct = ((satEqCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
        if (satUpCU == 0)
          doc[0].CUSatPlusPct = "0%";
        else
          doc[0].CUSatPlusPct = ((satUpCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
        if (margUpCU == 0)
          doc[0].CUMargPlusPct = "0%";
        else
          doc[0].CUMargPlusPct = ((margUpCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
        if (margEqCU == 0)
          doc[0].CUMargEqualPct = "0%";
        else
          doc[0].CUMargEqualPct = ((margEqCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
        if (margDwnCU == 0)
          doc[0].CUMargMinusPct = "0%";
        else
          doc[0].CUMargMinusPct = ((margDwnCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
        if (unsatEqCU == 0)
          doc[0].CUUnsatEqualPct = "0%";
        else
          doc[0].CUUnsatEqualPct = ((unsatEqCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
        if (unsatDwnCU == 0)
          doc[0].CUUnsatMinusPct = "0%";
        else
          doc[0].CUUnsatMinusPct = ((unsatDwnCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
        if (exemptCU == 0)
          doc[0].CUEXEMPTPct = "0%";
        else
          doc[0].CUEXEMPTPct = ((exemptCU/1) * 100).toFixed() + "%";
        if (nrCU == 0)
          doc[0].CUNRPct = "0%";
        else
          doc[0].CUNRPct = ((nrCU/doc[0].CUTotalCnt) * 100).toFixed() + "%";
        if (doc[0].CUTotalCnt == 0)
          doc[0].CUTotalPct = "0%";
        else
          doc[0].CUTotalPct = "100%";

      }
    } catch(e) {
      console.log("[class-fieldcalc][getRatingProfile] - " + err.error);
    }
	},

	getAccountsCU: function(db, doc) {
	var deferred = q.defer();
	try {
		// Get cuurent quarter assessment
		var accounts = {
			selector:{
				"_id": {"$gt":0},
				"key": "Assessable Unit",
				"parentid": doc[0]._id,
				"DocSubType": "Account",
				"MIRABusinessUnit": doc[0].MIRABusinessUnit
			}
		};
		console.log(accounts)
		db.find(accounts).then(function(actdata) {
			deferred.resolve({"status": 200, "doc": actdata.body.docs});
		}).catch(function(err) {
			console.log("[class-fieldcalc][getAccountsCU] - " + err.error);
			deferred.reject({"status": 500, "error": err.error.reason});
		});
	} catch(e) {
		console.log("[class-fieldcalc][getAccountsCU] - " + err.error);
		deferred.reject({"status": 500, "error": e});
	}
		return deferred.promise;
	},
}
module.exports = calculatefield;
