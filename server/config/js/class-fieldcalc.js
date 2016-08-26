/**************************************************************************************************
 *
 * MIRA Web field calculation codes
 * Date: 25 August 2016
 * By: genonms@ph.ibm.com
 *
 */

 var param = require('./class-parameter.js');

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

	/* Get category (CRM/Other or Delivery) and BusinessUnitOLD */
	getCategoryAndBUOld: function(req, db, doc) {

		/* Calculate for Instance Design Specifics and parameters*/
		var lParams;
		// Get required paramaters
		if (req.session.businessunit == "GTS") {
			if (doc[0].DocSubType == "Controllable Unit") {
				doc[0].CatCU = "";
				lParams = ['CRMCU','DeliveryCU','GTSInstanceDesign'];
			} else if (doc[0].DocSubType == "Country Process" || doc[0].DocSubType == "Global Process") {
				doc[0].CatP = "";
				lParams = ['CRMProcess','DeliveryProcess','GTSInstanceDesign'];
			} else {
				lParams = ['GTSInstanceDesign'];
			}
		} else {
			lParams = ['GBSInstanceDesign'];
		}
		param.getListParams(db, lParams).then(function(dataParam) {
			if(dataParam.status==200 & !dataParam.error) {
				// calculate for CatP and CatCU fields
				if (doc[0].DocSubType == "Country Process") {
					if (dataParam.parameters.CRMProcess) {
						for (var j = 0; j < dataParam.parameters.CRMProcess[0].options.length; ++j) {
							if (doc[0].GlobalProcess == dataParam.parameters[0].options[j].name) doc[0].CatP = "CRM";
						}
					}
					if (dataParam.parameters.DeliveryProcess) {
						for (var j = 0; j < dataParam.parameters.DeliveryProcess[0].options.length; ++j) {
							if (doc[0].GlobalProcess == dataParam.parameters[0].options[j].name) doc[0].CatP = "Delivery";
						}
					}
				}
				if (doc[0].DocSubType == "Controllable Unit") {
					if (dataParam.parameters.CRMCU) {
						for (var j = 0; j < dataParam.parameters.CRMCU[0].options.length; ++j) {
							if (doc[0].GlobalProcess == dataParam.parameters[0].options[j].name) doc[0].CatCU = "CRM";
						}
					}
					if (dataParam.parameters.DeliveryCU) {
						for (var j = 0; j < dataParam.parameters.DeliveryCU[0].options.length; ++j) {
							if (doc[0].GlobalProcess == dataParam.parameters[0].options[j].name) doc[0].CatCU = "Delivery";
						}
					}
				}
				// evaluate BusinessUnitOLD formula
				if (dataParam.parameters.GTSInstanceDesign) doc[0].BusinessUnitOLD = eval(dataParam.parameters.GTSInstanceDesign[0].options[0].name);
				if (dataParam.parameters.GBSInstanceDesign) doc[0].BusinessUnitOLD = eval(dataParam.parameters.GBSInstanceDesign[0].options[0].name);
			} else {
				console.log("[routes][class-assessableunit][getListParams] - " + dataParam.error);
			}
		}).catch(function(err) {
			console.log("[routes][class-assessableunit][getListParams] - " + err.error);
		});
		return doc;
	}
}
module.exports = calculatefield;
