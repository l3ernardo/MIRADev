/**************************************************************************************************
 *
 * MIRA Component Documents
 * Date: 16 December 2016
 * By: genonms@ph.ibm.com
 *
 */

var getDocs = {

  getCompDocs: function(doc) {
		try {
      switch (doc[0].ParentDocSubType) {
        case "Country Process":
          var comps = {
            selector:{
              "_id": {"$gt":0},
              "compntType": "countryControls",
              "Status": "Active",

            }
          };
          db.find(asmt).then(function(asmtdata) {
            deferred.resolve({"status": 200, "doc": asmtdata.body.docs[0]});
          }).catch(function(err) {
            console.log("[class-fieldcalc][getCurrentAsmt] - " + err.error);
            deferred.reject({"status": 500, "error": err.error.reason});
          });
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
    }
    catch(e) {
      console.log("[class-keycontrol][calcDefectRate] - " + err.error);
		}
	}

}
module.exports = calculatefield;
