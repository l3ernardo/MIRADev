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

  getPrev4Qtrs: function(currentQtr) {
    var p4Qtrs = [];
    var current = currentQtr.split("Q");
    var prevYr = current[1]-1;
    switch (current[0]) {
      case "1":
        p4Qtrs.push("4Q"+prevYr);
        p4Qtrs.push("3Q"+prevYr);
        p4Qtrs.push("2Q"+prevYr);
        p4Qtrs.push("1Q"+prevYr1);
        break;
      case "2":
        p4Qtrs.push("1Q"+current[1]);
        p4Qtrs.push("4Q"+prevYr);
        p4Qtrs.push("3Q"+prevYr);
        p4Qtrs.push("2Q"+prevYr);
        break;
      case "3":
        p4Qtrs.push("2Q"+current[1]);
        p4Qtrs.push("1Q"+current[1]);
        p4Qtrs.push("4Q"+prevYr);
        p4Qtrs.push("3Q"+prevYr);
        break;
      case "4":
        p4Qtrs.push("3Q"+current[1]);
        p4Qtrs.push("2Q"+current[1]);
        p4Qtrs.push("1Q"+current[1]);
        p4Qtrs.push("4Q"+prevYr);
        break;
    }
    return p4Qtrs;
  },

	/* Calculates CatP, CatCU, BusinessUnitOLD, ShowEA */
	getDocParams: function(req, db, doc) {
    var deferred = q.defer();
		try{

      // if(doc[0].DocSubType == "BU IOT" || doc[0].DocSubType == "BU Country" || doc[0].DocSubType == "Controllable Unit" || doc[0].DocSubType == "Global Process" || doc[0].DocSubType == "Country Process" || (doc[0].DocSubType == "BU Reporting Group" && req.session.businessunit == "GBS")) {

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
      if ((doc[0].ParentDocSubType == "Country Process" || doc[0].ParentDocSubType == "Global Process")) {
        var opMetricKey;
        if (doc[0].ParentDocSubType == "Country Process") {
          opMetricKey = "OpMetric" + doc[0].GPWWBCITKey;
        }else{
          opMetricKey = "OpMetric" + doc[0].WWBCITKey;
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
                doc[0].OpMetric.push(dataParam.parameters[opMetricKey][0].options[j]);
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
	}

}
module.exports = calculatefield;
