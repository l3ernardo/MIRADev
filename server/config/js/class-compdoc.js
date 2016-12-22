/**************************************************************************************************
 *
 * MIRA Component Documents
 * Date: 16 December 2016
 * By: genonms@ph.ibm.com
 *
 */

var q  = require("q");

var getDocs = {

  getCompDocs: function(db,doc) {
    var deferred = q.defer();
		try {
      switch (doc[0].ParentDocSubType) {
        case "Country Process":
          var compObj = {
            selector : {
              "_id": {"$gt":0},
              "docType": "asmtComponent",
              "reportingQuarter": doc[0].CurrentPeriod,
              "$or": [
                { "$and": [{"compntType": "countryControls"},{"status": "Active"}] },
                { "$and": [{"compntType": "controlSample"},{"status": "Active"}] },
                { "$and": [{"compntType": "sampledCountry"},{"status": "Active"}] }
              ]
            }
          };
          // { "$and": [{"compntType": "openIssue"},{"scorecardCategory": {"$gt":0}},{"country": doc[0].Country},{"businessUnit": doc[0].BusinessUnit},{"process": doc[0].GlobalProcess}] },
          // { "$and": [{"compntType": "countryControls"},{"status": "Active"},{"reportingCountry": doc[0].Country},{"owningBusinessUnit": doc[0].BusinessUnit}] },
          // { "$and": [{"compntType": "controlSample"},{"status": "Active"},{"reportingCountry": doc[0].Country},{"owningBusinessUnit": doc[0].BusinessUnit}] },
          // { "$and": [{"compntType": "sampledCountry"},{"status": "Active"},{"sampleCountry": doc[0].Country},{"owningBusinessUnit": doc[0].BusinessUnit}] }
          db.find(compObj).then(function(compdata) {
            var comps = compdata.body.docs;
            doc[0].risks = [];
            doc[0].RCTestData = [];
            doc[0].SCTestData = [];
            doc[0].SampleData = [];
            var controlCtr = 0;
            var scControlCtr = 0;
            var sampleCtr = 0;
            for(var i = 0; i < comps.length; i++) {
              if (comps[i].compntType == "openIssue") {
                doc[0].risks.push(comps[i]);
              }
              else if (comps[i].compntType == "countryControls") {
                doc[0].RCTestData.push(comps[i]);
                // Calculate for Defect Rate of Control doc
                if (doc[0].RCTestData[controlCtr].numActualTests ==  undefined || doc[0].RCTestData[controlCtr].numActualTests == "" || doc[0].RCTestData[controlCtr].numActualTests == 0 || doc[0].RCTestData[controlCtr].numDefects == undefined || doc[0].RCTestData[controlCtr].numDefects == "") {
                  doc[0].RCTestData[controlCtr].defectRate = "";
                } else {
                  doc[0].RCTestData[controlCtr].defectRate = ((doc[0].RCTestData[controlCtr].numDefects/doc[0].RCTestData[controlCtr].numActualTests) * 100).toFixed(1);
                }
                // Calculate for ControlName
                doc[0].RCTestData[controlCtr].controlName = doc[0].RCTestData[controlCtr].controlReferenceNumber.split("-")[2] + " - " + doc[0].RCTestData[controlCtr].controlShortName;
                controlCtr++;
              }
              else if (comps[i].compntType == "sampledCountry") {
                doc[0].SCTestData.push(comps[i]);
                // Calculate for ControlName
                doc[0].SCTestData[scControlCtr].controlName = doc[0].SCTestData[scControlCtr].controlReferenceNumber.split("-")[2] + " - " + doc[0].SCTestData[scControlCtr].controlShortName;
                scControlCtr++;
              }
              else if (comps[i].compntType == "controlSample") {
                doc[0].SampleData.push(comps[i]);
                sampleCtr++;
              }
              else {

              }
            }
            deferred.resolve({"status": 200, "doc": doc});
          }).catch(function(err) {
            console.log("[class-compdoc][getCompDocs] - " + err.error);
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
      console.log("[class-compdoc][getCompDocs] - " + err.error);
      deferred.reject({"status": 500, "error": err.error.reason});
		}
    return deferred.promise;
	}

}
module.exports = getDocs;
