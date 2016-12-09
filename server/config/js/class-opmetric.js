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
          break;
        case "Account":
          break;
        case "Global Process":
          break;
        case "BU Reporting Group":
        case "Business Unit":
        case "BU IOT":
        case "BU IMT":
        case "BU Country":
          if (doc[0].BUWWBCITKey == "BSU300000027") {
            opMetricKey = "GBSGeoOpMetric";
          } else if (doc[0].BUWWBCITKey == "BSU300000026") {
            opMetricKey = "TOGeoOpMetric";
          } else {
            opMetricKey = "GTSGeoOpMetric";
            opMetricKeySOD = "GTSGeoOpMetricSOD";
            lParams.push(opMetricKeySOD);
          }
          break;
        case "Controllable Unit":
          if (doc[0].EnteredBU == "GBS") {
            lParams.push("GBSOpMetrics");
            opMetricKey = "GBSOpMetricKeysCU";
          }
          break;
      }
      lParams.push(opMetricKey);
      return opMetricKey;
    }catch(e){
      console.log("[class-opmetric][getOpMetrics] - " + err.error);
		}
	},

	getOpMetrics: function(doc,dataParam,opMetricKey) {
		try {
      var TmpOpMetric = [];
      var opMetricIDs = "";
      var opID;

      if (doc[0].OpMetric) {
        doc[0].OpMetricCurr = doc[0].OpMetric;
      }
      doc[0].OpMetric = [];
      var omIndex;
      for (var j = 0; j < dataParam.parameters[opMetricKey][0].options.length; ++j) {
        if (doc[0].OpMetricKey == dataParam.parameters[opMetricKey][0].options[j].id ) {
          for (var k = 0; k < dataParam.parameters[opMetricKey][0].options[j].metrics.length; ++k) {
            // doc[0].OpMetric.push({"id:" + dataParam.parameters[opMetricKey][0].options[j].metrics[k]});
            opID = dataParam.parameters[opMetricKey][0].options[j].metrics[k];
            omIndex = util.getIndex(dataParam.parameters["GBSOpMetrics"][0].options,"id",opID)
            doc[0].OpMetric.push({"id": opID});
            doc[0].OpMetric[k].name = dataParam.parameters["GBSOpMetrics"][0].options[omIndex].name;
            // For Base Level Assessments
            if (doc[0].ParentDocSubType == "Country Process" || doc[0].ParentDocSubType == "Controllable Unit" || doc[0].ParentDocSubType == "Account" ) {
              doc[0].OpMetric[k].desc = dataParam.parameters["GBSOpMetrics"][0].options[omIndex].desc.split("<br />");
              console.log("desc: " + JSON.stringify(doc[0].OpMetric[k].desc));
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
            // For Rollup Assessments
            else {
              doc[0].OpMetric[k].ratingfield = opID + "Rating";
              doc[0].OpMetric[k].commentfield = opID + "Comment";
              doc[0].OpMetric[k].commentfieldRO = opID + "commentfieldRO";
              doc[0].OpMetric[k].commentfieldReadOnly = opID + "commentfieldReadOnly";
              doc[0].OpMetric[k].rating = "";
              doc[0].OpMetric[k].action = "";
              if (doc[0].OpMetricCurr) {
                omIndex = util.getIndex(doc[0].OpMetricCurr,"id",opID);
                if (omIndex != -1) {
                  doc[0].OpMetric[k].rating = doc[0].OpMetricCurr[omIndex].rating;
                  doc[0].OpMetric[k].action = doc[0].OpMetricCurr[omIndex].action;
                }
              }
            }
          }
          break;
        }
      }
    }catch(e){
      console.log("[class-opmetric][getOpMetrics] - " + err.error);
		}
	}

}
module.exports = calculatefield;
