/**************************************************************************************************
 *
 * MIRA Web Operational Metrics Code
 * Date: 08 December 2016
 * By: genonms@ph.ibm.com
 *
 */

 var util = require('./class-utility.js');

var calculatefield = {

  getOpMetricKeys: function(doc,lParams) {
		try {
      // For Operational Metric Parameters of Assessments
      var opMetricKey;
      var opMetricKeySOD = "";
      switch (doc[0].ParentDocSubType) {
        case "Country Process":
          if (doc[0].EnteredBU == "GBS") {
            lParams.push("GBSOpMetrics");
            opMetricKey = "GBSOpMetricKeysProcess";
          }
          else {
            lParams.push("GTSOpMetrics");
            opMetricKey = "GTSOpMetricKeys";
          }
          break;
        case "Account":
          if (doc[0].EnteredBU == "GBS") {
            lParams.push("GBSOpMetrics");
            opMetricKey = "GBSOpMetricKeysCU";
          }
          else {
            lParams.push("GTSOpMetrics");
            opMetricKey = "GTSOpMetricKeys";
          }
          break;
        case "Global Process":
          break;
        case "BU Reporting Group":
        case "Business Unit":
        case "BU IOT":
        case "BU IMT":
        case "BU Country":
          if (doc[0].EnteredBU == "GBS") {
            lParams.push("GBSOpMetrics");
            opMetricKey = "GBSGeoOpMetric";
          } else {
            opMetricKey = "GTSGeoOpMetric";
            opMetricKeySOD = "GTSGeoOpMetricSOD";
            lParams.push(opMetricKeySOD);
            lParams.push("GTSOpMetrics");
          }
          break;
        case "Controllable Unit":
          if (doc[0].EnteredBU == "GBS") {
            lParams.push("GBSOpMetrics");
            opMetricKey = "GBSOpMetricKeysCU";
          }
          else {
            lParams.push("GTSOpMetrics");
            opMetricKey = "GTSOpMetricKeys";
          }
          break;
      }
      lParams.push(opMetricKey);
      return opMetricKey;
    }catch(e){
      console.log("[class-opmetric][getOpMetricKeys] - " + err.error);
		}
	},

	getOpMetrics: function(doc,dataParam,opMetricKey,req) {
		try {
      var TmpOpMetric = [];
      var opMetricIDs = "";
      var opID;

      if (doc[0].OpMetric) {
        doc[0].OpMetricCurr = doc[0].OpMetric;
      }
      doc[0].OpMetric = [];
      var omIndex, paramOpMetrics;
      if (doc[0].MIRABusinessUnit == "GBS") paramOpMetrics = "GBSOpMetrics";
      else paramOpMetrics = "GTSOpMetrics";

      if (doc[0].ParentDocSubType == "Country Process" || doc[0].ParentDocSubType == "Controllable Unit" || doc[0].ParentDocSubType == "Account" ) {
        // For Base Level Assessments
        if (doc[0].MIRABusinessUnit == "GTS" && doc[0].OpMetricKey == "OMKID4") {
          // OMKID4 is opmetric key id for "Delivery"
          if (doc[0].OtherMetricRating == "Marg" || doc[0].OtherMetricRating == "Unsat") {
            doc[0].opMetricException = 1;
          } else {
            doc[0].opMetricException = 0;
          }
        } else {
          for (var j = 0; j < dataParam.parameters[opMetricKey][0].options.length; ++j) {
            if (doc[0].OpMetricKey == dataParam.parameters[opMetricKey][0].options[j].id ) {
              for (var k = 0; k < dataParam.parameters[opMetricKey][0].options[j].metrics.length; ++k) {
                opID = dataParam.parameters[opMetricKey][0].options[j].metrics[k];
                if (opMetricIDs == "") opMetricIDs = opID;
                else opMetricIDs = opMetricIDs + "," + opID;
                omIndex = util.getIndex(dataParam.parameters[paramOpMetrics][0].options,"id",opID)
                doc[0].OpMetric.push({"id": opID});
                doc[0].OpMetric[k].name = dataParam.parameters[paramOpMetrics][0].options[omIndex].name;
                if (dataParam.parameters[paramOpMetrics][0].options[omIndex].desc) {
                  doc[0].OpMetric[k].desc = dataParam.parameters[paramOpMetrics][0].options[omIndex].desc.split("<br />");
                }
                doc[0].OpMetric[k].namefield = opID + "Name";
                doc[0].OpMetric[k].ratingfield = opID + "Rating";
                doc[0].OpMetric[k].targetsatdatefield = opID + "TargetSatDate";
                doc[0].OpMetric[k].colDate = "colDate"+ opID;
                doc[0].OpMetric[k].findingfield = opID + "Finding";
                doc[0].OpMetric[k].colFinding = "colFinding"+ opID;
                doc[0].OpMetric[k].actionfield = opID + "Action";
                doc[0].OpMetric[k].colFinding = "colAction"+ opID;
                doc[0].OpMetric[k].rating = "";
                doc[0].OpMetric[k].targetsatdate = "";
                doc[0].OpMetric[k].finding = "";
                doc[0].OpMetric[k].action = "";
                if (doc[0].OpMetricCurr) {
                  omIndex = util.getIndex(doc[0].OpMetricCurr,"id",opID);
                  if (omIndex != -1) {
                    doc[0].OpMetric[k].rating = doc[0].OpMetricCurr[omIndex].rating;
                    doc[0].OpMetric[k].targetsatdate = doc[0].OpMetricCurr[omIndex].targetsatdate;
                    doc[0].OpMetric[k].finding = doc[0].OpMetricCurr[omIndex].finding;
                    doc[0].OpMetric[k].action = doc[0].OpMetricCurr[omIndex].action;
                    if (doc[0].OpMetric[k].rating == "Marg" || doc[0].OpMetric[k].rating == "Unsat") doc[0].opMetricException = 1;
                  }
                }
              }
              break;
            }
          }
        }
      }
      else {
        // For Rollup Assessments
        for (var j = 0; j < dataParam.parameters[opMetricKey][0].options.length; ++j) {
          opID = dataParam.parameters[opMetricKey][0].options[j];
          if (opMetricIDs == "") opMetricIDs = opID;
          else opMetricIDs = opMetricIDs + "," + opID;
          omIndex = util.getIndex(dataParam.parameters[paramOpMetrics][0].options,"id",opID)
          doc[0].OpMetric.push({"id": opID});
          doc[0].OpMetric[j].name = dataParam.parameters[paramOpMetrics][0].options[omIndex].name;
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
    }catch(e){
      console.log("[class-opmetric][getOpMetrics] - " + err.error);
		}
	},

  getOpMetricsPrevQtr: function(doc,dataParam,opMetricKey,req) {
    try {
      var TmpOpMetric = [];
      var opMetricIDs = "";
      var opID;

      if (doc[0].OpMetric) {
        doc[0].OpMetricCurr = doc[0].OpMetric;
      }
      doc[0].OpMetric = [];
      var omIndex, paramOpMetrics;
      if (doc[0].MIRABusinessUnit == "GBS") paramOpMetrics = "GBSOpMetrics";
      else paramOpMetrics = "GTSOpMetrics";

      if (doc[0].ParentDocSubType == "Country Process" || doc[0].ParentDocSubType == "Controllable Unit" || doc[0].ParentDocSubType == "Account" ) {
        // For Base Level Assessments
        if (doc[0].MIRABusinessUnit == "GTS" && doc[0].OpMetricKey == "OMKID4") {
          // OMKID4 is opmetric key id for "Delivery"
          if (doc[0].OtherMetricRating == "Marg" || doc[0].OtherMetricRating == "Unsat") {
            doc[0].opMetricException = 1;
          } else {
            doc[0].opMetricException = 0;
          }
        } else {
          for (var j = 0; j < dataParam.parameters[opMetricKey][0].options.length; ++j) {
            if (doc[0].OpMetricKey == dataParam.parameters[opMetricKey][0].options[j].id ) {
              for (var k = 0; k < dataParam.parameters[opMetricKey][0].options[j].metrics.length; ++k) {
                opID = dataParam.parameters[opMetricKey][0].options[j].metrics[k];
                if (opMetricIDs == "") opMetricIDs = opID;
                else opMetricIDs = opMetricIDs + "," + opID;
                omIndex = util.getIndex(dataParam.parameters[paramOpMetrics][0].options,"id",opID)
                doc[0].OpMetric.push({"id": opID});
                doc[0].OpMetric[k].name = dataParam.parameters[paramOpMetrics][0].options[omIndex].name;
                if (dataParam.parameters[paramOpMetrics][0].options[omIndex].desc) {
                  doc[0].OpMetric[k].desc = dataParam.parameters[paramOpMetrics][0].options[omIndex].desc.split("<br />");
                }
                doc[0].OpMetric[k].namefield = opID + "Name";
                doc[0].OpMetric[k].ratingfield = opID + "Rating";
                doc[0].OpMetric[k].targetsatdatefield = opID + "TargetSatDate";
                doc[0].OpMetric[k].colDate = "colDate"+ opID;
                doc[0].OpMetric[k].findingfield = opID + "Finding";
                doc[0].OpMetric[k].colFinding = "colFinding"+ opID;
                doc[0].OpMetric[k].actionfield = opID + "Action";
                doc[0].OpMetric[k].colFinding = "colAction"+ opID;
                doc[0].OpMetric[k].rating = "";
                doc[0].OpMetric[k].targetsatdate = "";
                doc[0].OpMetric[k].finding = "";
                doc[0].OpMetric[k].action = "";
                if (doc[0].OpMetricCurr) {
                  omIndex = util.getIndex(doc[0].OpMetricCurr,"id",opID);
                  if (omIndex != -1) {
                    doc[0].OpMetric[k].rating = doc[0].OpMetricCurr[omIndex].rating;
                    doc[0].OpMetric[k].targetsatdate = doc[0].OpMetricCurr[omIndex].targetsatdate;
                    doc[0].OpMetric[k].finding = doc[0].OpMetricCurr[omIndex].finding;
                    doc[0].OpMetric[k].action = doc[0].OpMetricCurr[omIndex].action;
                    if (doc[0].OpMetric[k].rating == "Marg" || doc[0].OpMetric[k].rating == "Unsat") doc[0].opMetricException = 1;
                  }
                }
              }
              break;
            }
          }
        }
      }
      else {
        // For Rollup Assessments
        for (var j = 0; j < dataParam.parameters[opMetricKey][0].options.length; ++j) {
          opID = dataParam.parameters[opMetricKey][0].options[j];
          if (opMetricIDs == "") opMetricIDs = opID;
          else opMetricIDs = opMetricIDs + "," + opID;
          omIndex = util.getIndex(dataParam.parameters[paramOpMetrics][0].options,"id",opID)
          doc[0].OpMetric.push({"id": opID});
          doc[0].OpMetric[j].name = dataParam.parameters[paramOpMetrics][0].options[omIndex].name;
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
    }catch(e){
      console.log("[class-opmetric][getOpMetrics] - " + err.error);
    }
  }

}
module.exports = calculatefield;
