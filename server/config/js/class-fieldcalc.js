/**************************************************************************************************
 *
 * MIRA Web field calculation codes
 * Date: 25 August 2016
 * By: genonms@ph.ibm.com
 *
 */

 var param = require('./class-parameter.js');
 var util = require('./class-utility.js');
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
        obj.push({"":""});
        for (var prop in obj[0]) {
          if (obj[0].hasOwnProperty(prop)) {
            obj[(obj.length-1)][prop] = "";
          }
        }
      }
    } else {

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
    var prevYr = current[1]-1;
    switch (current[0]) {
      case "1":
        p4Qtrs.push("1Q"+prevYr1);
        p4Qtrs.push("2Q"+prevYr);
        p4Qtrs.push("3Q"+prevYr);
        p4Qtrs.push("4Q"+prevYr);
        break;
      case "2":
        p4Qtrs.push("2Q"+prevYr);
        p4Qtrs.push("3Q"+prevYr);
        p4Qtrs.push("4Q"+prevYr);
        p4Qtrs.push("1Q"+current[1]);
        break;
      case "3":
        p4Qtrs.push("3Q"+prevYr);
        p4Qtrs.push("4Q"+prevYr);
        p4Qtrs.push("1Q"+current[1]);
        p4Qtrs.push("2Q"+current[1]);
        break;
      case "4":
        p4Qtrs.push("4Q"+prevYr);
        p4Qtrs.push("1Q"+current[1]);
        p4Qtrs.push("2Q"+current[1]);
        p4Qtrs.push("3Q"+current[1]);
        break;
    }
    return p4Qtrs;
  },

	/* Calculates CatP, CatCU, BusinessUnitOLD, ShowEA */
	getDocParams: function(req, db, doc) {
    var deferred = q.defer();
		try{

      /* Calculate for Instance Design Specifics and parameters*/
  		var lParams = [];
  		// Get required paramaters
  		if (req.session.businessunit == "GTS") {
  			if (doc[0].DocSubType == "Controllable Unit") {
  				doc[0].CatCU = "";
  				lParams = ['CRMCU','DeliveryCU','GTSInstanceDesign'];
  			} else if (doc[0].DocSubType == "Country Process" || doc[0].DocSubType == "Global Process") {
  				doc[0].CatP = "";
  				lParams = ['CRMProcess','DeliveryProcess','GTSInstanceDesign','EAProcess'];
  			} else {
  				lParams = ['GTSInstanceDesign'];
  			}
  		} else {
  			lParams = ['GBSInstanceDesign'];
  		}
      if ((doc[0].ParentDocSubType == "Country Process" || doc[0].ParentDocSubType == "Global Process" || doc[0].ParentDocSubType == "Controllable Unit")) {
        var opMetricKey;
        switch (doc[0].ParentDocSubType) {
          case "Country Process":
            opMetricKey = "OpMetric" + doc[0].GPWWBCITKey;
            break;
          case "Global Process":
            opMetricKey = "OpMetric" + doc[0].WWBCITKey;
            break;
          case "Controllable Unit":
            opMetricKey = "GBSCUOpMetric" + doc[0].AuditProgram.split(" ").join("").split("-").join("");
            break;
        }
        lParams.push(opMetricKey);
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
  						if (doc[0].GlobalProcess == dataParam.parameters.CRMCU[0].options[j].name) doc[0].CatCU = "CRM";
  					}
  				}
  				if (dataParam.parameters.DeliveryCU) {
  					for (var j = 0; j < dataParam.parameters.DeliveryCU[0].options.length; ++j) {
  						if (doc[0].GlobalProcess == dataParam.parameters.DeliveryCU[0].options[j].name) doc[0].CatCU = "Delivery";
  					}
  				}
          if (dataParam.parameters[opMetricKey]) {
            var TmpOpMetric = [];
            var opMetricIDs = "";
            var opID;

            if (doc[0].OpMetric) {
              doc[0].OpMetricCurr = doc[0].OpMetric;
            }
            doc[0].OpMetric = [];
            var omIndex;
            for (var j = 0; j < dataParam.parameters[opMetricKey][0].options.length; ++j) {
                opID = dataParam.parameters[opMetricKey][0].options[j].id;
                if (opMetricIDs == "")
                  opMetricIDs = opID;
                else
                  opMetricIDs = opMetricIDs + "," + opID;
                if (doc[0].ParentDocSubType == "Country Process" || doc[0].ParentDocSubType == "Controllable Unit") {
                  doc[0].OpMetric.push(dataParam.parameters[opMetricKey][0].options[j]);
                  doc[0].OpMetric[j].desc = dataParam.parameters[opMetricKey][0].options[j].desc;
                  doc[0].OpMetric[j].namefield = opID + "Name";
                  doc[0].OpMetric[j].ratingfield = opID + "Rating";
                  doc[0].OpMetric[j].targetsatdatefield = opID + "TargetSatDate";
                  doc[0].OpMetric[j].colDate = "colDate"+ opID;
                  doc[0].OpMetric[j].findingfield = opID + "Finding";
                  doc[0].OpMetric[j].colFinding = "colFinding"+ opID;
                  doc[0].OpMetric[j].actionfield = opID + "Action";
                  doc[0].OpMetric[j].colFinding = "colAction"+ opID;
                  doc[0].OpMetric[j].rating = "";
                  doc[0].OpMetric[j].targetsatdate = "";
                  doc[0].OpMetric[j].finding = "";
                  doc[0].OpMetric[j].action = "";
                  if (doc[0].OpMetricCurr) {
                    omIndex = util.getIndex(doc[0].OpMetricCurr,"id",opID);
                    if (omIndex != -1) {
                      doc[0].OpMetric[j].rating = doc[0].OpMetricCurr[omIndex].rating;
                      doc[0].OpMetric[j].targetsatdate = doc[0].OpMetricCurr[omIndex].targetsatdate;
                      doc[0].OpMetric[j].finding = doc[0].OpMetricCurr[omIndex].finding;
                      doc[0].OpMetric[j].action = doc[0].OpMetricCurr[omIndex].action;
                    }
                  }
                } else {
                  // For Global Process
                  doc[0].OpMetric.push(dataParam.parameters[opMetricKey][0].options[j]);
                  doc[0].OpMetric[j].ratingfield = opID + "Rating";
                  doc[0].OpMetric[j].commentfield = opID + "Comment";
                  doc[0].OpMetric[j].commentfieldRO = opID + "commentfieldRO";
                  doc[0].OpMetric[j].commentfieldReadOnly = opID + "commentfieldReadOnly";
                  doc[0].OpMetric[j].rating = "";
                  doc[0].OpMetric[j].action = "";
                  if (doc[0].OpMetricCurr) {
                    omIndex = util.getIndex(doc[0].OpMetricCurr,"id",opID);
                    if (omIndex != -1) {
                      doc[0].OpMetric[j].rating = doc[0].OpMetricCurr[omIndex].rating;
                      doc[0].OpMetric[j].action = doc[0].OpMetricCurr[omIndex].action;
                    }
                  }
                }
            }
            doc[0].opMetricIDs = opMetricIDs;
          }
          if (doc[0].DocSubType == "Country Process" && dataParam.parameters.EAProcess && doc[0].GPWWBCITKey != undefined && dataParam.parameters.EAProcess.indexOf(doc[0].GPWWBCITKey) != -1 )
            doc[0].ShowEA = 1;
  				// evaluate BusinessUnitOLD formula
  				if (dataParam.parameters.GTSInstanceDesign) doc[0].BusinessUnitOLD = eval(dataParam.parameters.GTSInstanceDesign[0].options[0].name);
  				if (dataParam.parameters.GBSInstanceDesign) doc[0].BusinessUnitOLD = eval(dataParam.parameters.GBSInstanceDesign[0].options[0].name);

          deferred.resolve(doc);

  			} else {
          deferred.reject({"status": 500, "error": err.error.reason});
				  // console.log("[routes][class-assessableunit][getListParams] - " + dataParam.error);
  			}
  		}).catch(function(err) {
        deferred.reject({"status": 500, "error": err.error.reason});
  			// console.log("[routes][class-assessableunit][getListParams] - " + err.error);
  		});

    }catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},

  /* Pass data from Assessable Unit to Current Quarter Assessment */
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

  /* Populates the Rating Profile table */
	getRatingProfile: function(db, doc) {
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
              "GPWWBCITKey": doc[0].WWBCITKey
            }
          };
          break;
      }
      db.find(asmts).then(function(asmtsdata) {
        var asmtsdocs = asmtsdata.body.docs;
        var satEq = 0, satUp = 0, margUp = 0, margEq = 0, margDwn = 0, unsatEq = 0, unsatDwn = 0, exempt = 0, nr = 0, bocEx = 0;
        var toadd;

        for (var i = 0; i < asmtsdocs.length; ++i) {

          // PO tab performance indicators view
          toadd = {
            "docid":asmtsdocs[i]._id,
            "name":asmtsdocs[i].AssessableUnitName,
            "ratingCQ":asmtsdocs[i].PeriodRating,
            "ratingPQ1":asmtsdocs[i].PeriodRatingPrev1,
            "ratingPQ2":asmtsdocs[i].PeriodRatingPrev2,
            "ratingPQ3":asmtsdocs[i].PeriodRatingPrev3,
            "ratingPQ4":asmtsdocs[i].PeriodRatingPrev4,
            "kcfrDR":asmtsdocs[i].KCFRDefectRate,
            "kcoDR":asmtsdocs[i].KCODefectRate,
            "msdRisk":asmtsdocs[i].MissedOpenIssueCount,
            "msdMSAC":asmtsdocs[i].MissedMSACSatCount
          };
          doc[0].CPAsmtDataPIview.push(toadd);

          // PO tab other indicators view
          toadd = {
            "docid":asmtsdocs[i]._id,
            "name":asmtsdocs[i].AssessableUnitName,
            "bocExCount":asmtsdocs[i].BOCExceptionCount
          };
          doc[0].CPAsmtDataOIview.push(toadd);
          for (var j = 0; j < asmtsdocs[i].OpMetric.length; ++j) {
            doc[0].CPAsmtDataOIview[i][asmtsdocs[i].OpMetric[j].id+"Rating"] = asmtsdocs[i].OpMetric[j].rating;
          }

          // Process Ratings tab first embedded view
          toadd = {
            "docid":asmtsdocs[i]._id,
            "country":asmtsdocs[i].Country,
            "iot":asmtsdocs[i].IOT,
            "ratingcategory":asmtsdocs[i].RatingCategory,
            "ratingCQ":asmtsdocs[i].PeriodRating,
            "ratingPQ1":asmtsdocs[i].PeriodRatingPrev1,
            "targettosat":asmtsdocs[i].Target2Sat,
            "targettosatprev":asmtsdocs[i].Target2SatPrev,
            "reviewcomments":asmtsdocs[i].ReviewComments
          };
          doc[0].CPAsmtDataPR1view.push(toadd);

          // Basics of Control Exception Counter
          if (asmtsdocs[i].BOCExceptionCount == 1) bocEx = bocEx + 1;

          switch (asmtsdocs[i].RatingCategory) {
            case "Sat &#9650;":
              satUp = satUp + 1;
              break;
            case "Sat &#61;":
              satEq = satEq + 1;
              break;
            case "Marg &#9650;":
              margUp = margUp + 1;
              break;
            case "Marg &#9660;":
              margDwn = margDwn + 1;
              break;
            case "Marg &#61;":
              margEq = margEq + 1;
              break;
            case "Unsat &#9660;":
              unsatDwn = unsatDwn + 1;
              break;
            case "Unsat &#61;":
              unsatEq = unsatEq + 1;
              break;
            case "Exempt":
              exempt = exempt + 1;
              break;
            default:
              nr = nr + 1;
          }
        }

        doc[0].BOCExceptionCount = bocEx;
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
        var pct = (unsatDwn/doc[0].CPTotalCnt) * 100;
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
        deferred.resolve({"status": 200, "doc": doc});
      }).catch(function(err) {
        console.log("[class-fieldcalc][getRatingProfile] - " + err.error);
        deferred.reject({"status": 500, "error": err.error.reason});
      });
    } catch(e) {
      console.log("[class-fieldcalc][getRatingProfile] - " + err.error);
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	}


}
module.exports = calculatefield;
