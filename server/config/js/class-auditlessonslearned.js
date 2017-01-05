/**************************************************************************************************
 *
 * MIRA Audit Lessons Learned
 * Date: 4 January 2017
 * By: genonms@ph.ibm.com
 *
 */

var fieldCalc = require('./class-fieldcalc.js');

var calculateALL = {

  processALL: function(doc, defViewRow) {
		try {
      switch (doc[0].ParentDocSubType) {
        case "Country Process":
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
        case "BU Country":
          break;
        case "Controllable Unit":
          break;
      }
    }catch(e){
      console.log("[class-keycontrol][calcDefectRate] - " + e.stack);
		}
	}

}
module.exports = calculateALL;
