/**************************************************************************************************
 *
 * MIRA Key Controls Testing Code
 * Date: 16 December 2016
 * By: genonms@ph.ibm.com
 *
 */

var calculatefield = {

  calcDefectRate: function(doc) {
		try {
      switch (doc[0].ParentDocSubType) {
        case "Country Process":
          if (doc[0].AUTestCount == undefined || doc[0].AUTestCount == 0 ) {
            console.log("heremmmmm");
            doc[0].AUDefectRate = "";
          }
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
      console.log("[class-keycontrol][calcDefectRate] - " + err.error);
		}
	}

}
module.exports = calculatefield;
