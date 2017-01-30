/**************************************************************************************************
 *
 * MIRA Key Sanpled Country Testing Tab Codes
 * Date: 27 January 2017
 * By: genonms@ph.ibm.com
 *
 */

var fieldCalc = require('./class-fieldcalc.js');

var calculateSCTab = {

  processSCTab: function(doc, defViewRow) {
		try {
      switch (doc[0].ParentDocSubType) {
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

          //** Calculate for Defect Rate - START **//

          // Calculate for Current Quarter
          for (var i = 0; i < doc[0].SCTest1Data.length; i++) {

            // For financial processes
            for (var j = 0; j < doc[0].KCProcessFIN.length; j++) {
              if (doc[0].KCProcessFIN[j].id == doc[0].SCTest1Data[i].GPPARENT) {
                // add all tests

                if (!isNaN(doc[0].SCTest1Data[i].numtest)) {
                // if (doc[0].SCTest1Data[i].numtest !== undefined && doc[0].SCTest1Data[i].numtest !== "") {
                  if (doc[0].KCProcessFIN[j].test == undefined) {
                    doc[0].KCProcessFIN[j].test = parseInt(doc[0].SCTest1Data[i].numtest);
                  }else {
                    doc[0].KCProcessFIN[j].test += parseInt(doc[0].SCTest1Data[i].numtest);
                  }
                }
                // add all defects
                if (!isNaN(doc[0].SCTest1Data[i].numDefects)) {
                // if (doc[0].SCTest1Data[i].numDefects !== undefined && doc[0].SCTest1Data[i].numDefects !== "") {
                  if (doc[0].KCProcessFIN[j].defect == undefined) {
                    doc[0].KCProcessFIN[j].defect = parseInt(doc[0].SCTest1Data[i].numDefects);
                  }else {
                    doc[0].KCProcessFIN[j].defect += parseInt(doc[0].SCTest1Data[i].numDefects);
                  }
                }
              }
            }

            // For operational processes
            for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
              // add all tests
              if (!isNaN(doc[0].SCTest1Data[i].numtest)) {
              // if (doc[0].SCTest1Data[i].numtest !== undefined && doc[0].SCTest1Data[i].numtest !== "") {
                if (doc[0].KCProcessOPS[j].test == undefined) {
                  doc[0].KCProcessOPS[j].test = parseInt(doc[0].SCTest1Data[i].numtest);
                }else {
                  doc[0].KCProcessOPS[j].test += parseInt(doc[0].SCTest1Data[i].numtest);
                }
              }
              // add all defects
              if (doc[0].KCProcessOPS[j].id == doc[0].SCTest1Data[i].GPPARENT) {
                if (!isNaN(doc[0].SCTest1Data[i].numDefects)) {
                // if (doc[0].SCTest1Data[i].numDefects !== undefined && doc[0].SCTest1Data[i].numDefects !== "") {
                  if (doc[0].KCProcessOPS[j].defect == undefined) {
                    doc[0].KCProcessOPS[j].defect = parseInt(doc[0].SCTest1Data[i].numDefects);
                  }else {
                    doc[0].KCProcessOPS[j].defect += parseInt(doc[0].SCTest1Data[i].numDefects);
                  }
                }
              }
            }

          }

          // Financial processes calculate for defect rate
          for (var j = 0; j < doc[0].KCProcessFIN.length; j++) {
            if (doc[0].KCProcessFIN[j].test == undefined) {
              doc[0].KCProcessFIN[j].test = "";
              doc[0].KCProcessFIN[j].defectRate = "";
            } else {
              if (doc[0].KCProcessFIN[j].defect == undefined) {
                doc[0].KCProcessFIN[j].defectRate = 0;
              } else {
                doc[0].KCProcessFIN[j].defectRate = ((doc[0].KCProcessFIN[j].defect / doc[0].KCProcessFIN[j].test) * 100).toFixed(1);
                if (doc[0].KCProcessFIN[j].defectRate == 0) {
                  doc[0].KCProcessFIN[j].defectRate = parseInt(doc[0].KCProcessFIN[j].defectRate).toFixed(0);
                }
              }
            }
          }
          // operational processes calculate for defect rate
          for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
            if (doc[0].KCProcessOPS[j].test == undefined) {
              doc[0].KCProcessOPS[j].test = "";
              doc[0].KCProcessOPS[j].defectRate = "";
            } else {
              if (doc[0].KCProcessOPS[j].defect == undefined) {
                doc[0].KCProcessOPS[j].defectRate = 0;
              } else {
                doc[0].KCProcessOPS[j].defectRate = ((doc[0].KCProcessOPS[j].defect / doc[0].KCProcessOPS[j].test) * 100).toFixed(1);
                if (doc[0].KCProcessOPS[j].defectRate == 0) {
                  doc[0].KCProcessOPS[j].defectRate = parseInt(doc[0].KCProcessOPS[j].defectRate).toFixed(0);
                }
              }
            }
          }

          // Calculate for Previous 1 Quarter Defect Rates
          // Calculate for Previous 2 Quarter Defect Rates
          // Calculate for Previous 3 Quarter Defect Rates
          // Calculate for Previous 4 Quarter Defect Rates

          //** Calculate for Defect Rate - END **//

          //** Calculate for Unremediated Defects - START **//

          doc[0].SCUnremedDefects = [];
          for (var i = 0; i < doc[0].SCTest2Data.length; i++) {

            // For financial processes
            for (var j = 0; j < doc[0].KCProcessFIN.length; j++) {
              if (doc[0].KCProcessFIN[j].id == doc[0].SCTest2Data[i].GPPARENT) {
                if (!isNaN(doc[0].SCTest2Data[i].numDefects)) {
                // if (doc[0].SCTest2Data[i].numDefects !== undefined && doc[0].SCTest2Data[i].numDefects !== "") {
                  // Process all Financial Defects
                  if (doc[0].SCTest2Data[i].controlType == "KCFR") {
                    // add all CQF - Current Quarter Financial Defects
                    if (doc[0].SCTest2Data[i].reportingQuarter == doc[0].SCTest2Data[i].originalReportingQuarter) {
                      if (doc[0].KCProcessFIN[j].cqf == undefined) {
                        doc[0].KCProcessFIN[j].cqf = parseInt(doc[0].SCTest2Data[i].numDefects);
                      }else {
                        doc[0].KCProcessFIN[j].cqf += parseInt(doc[0].SCTest2Data[i].numDefects);
                      }
                    }
                    // add all PQF - Previous Quarter Financial Defects
                    else {
                      if (doc[0].KCProcessFIN[j].pqf == undefined) {
                        doc[0].KCProcessFIN[j].pqf = parseInt(doc[0].SCTest2Data[i].numDefects);
                      }else {
                        doc[0].KCProcessFIN[j].pqf += parseInt(doc[0].SCTest2Data[i].numDefects);
                      }
                    }
                  }
                  // Process all Operatonal Defects
                  else {
                    // add all CQO - Current Quarter Operational Defects
                    if (doc[0].SCTest2Data[i].reportingQuarter == doc[0].SCTest2Data[i].originalReportingQuarter) {
                      if (doc[0].KCProcessFIN[j].cqo == undefined) {
                        doc[0].KCProcessFIN[j].cqo = parseInt(doc[0].SCTest2Data[i].numDefects);
                      }else {
                        doc[0].KCProcessFIN[j].cqo += parseInt(doc[0].SCTest2Data[i].numDefects);
                      }
                    }
                    // add all PQO - Previous Quarter Operational Defects
                    else {
                      if (doc[0].KCProcessFIN[j].pqo == undefined) {
                        doc[0].KCProcessFIN[j].pqo = parseInt(doc[0].SCTest2Data[i].numDefects);
                      }else {
                        doc[0].KCProcessFIN[j].pqo += parseInt(doc[0].SCTest2Data[i].numDefects);
                      }
                    }
                  }

                }
              }
            }

            // For operational processes
            for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
              if (doc[0].KCProcessOPS[j].id == doc[0].SCTest2Data[i].GPPARENT) {
                if (!isNaN(doc[0].SCTest2Data[i].numDefects)) {
                // if (doc[0].SCTest2Data[i].numDefects !== undefined && doc[0].SCTest2Data[i].numDefects !== "") {
                  // Process all Financial Defects
                  if (doc[0].SCTest2Data[i].controlType == "KCFR") {
                    // add all CQF - Current Quarter Financial Defects
                    if (doc[0].SCTest2Data[i].reportingQuarter == doc[0].SCTest2Data[i].originalReportingQuarter) {
                      if (doc[0].KCProcessOPS[j].cqf == undefined) {
                        doc[0].KCProcessOPS[j].cqf = parseInt(doc[0].SCTest2Data[i].numDefects);
                      }else {
                        doc[0].KCProcessOPS[j].cqf += parseInt(doc[0].SCTest2Data[i].numDefects);
                      }
                    }
                    // add all PQF - Previous Quarter Financial Defects
                    else {
                      if (doc[0].KCProcessOPS[j].pqf == undefined) {
                        doc[0].KCProcessOPS[j].pqf = parseInt(doc[0].SCTest2Data[i].numDefects);
                      }else {
                        doc[0].KCProcessOPS[j].pqf += parseInt(doc[0].SCTest2Data[i].numDefects);
                      }
                    }
                  }
                  // Process all Operatonal Defects
                  else {
                    // add all CQO - Current Quarter Operational Defects
                    if (doc[0].SCTest2Data[i].reportingQuarter == doc[0].SCTest2Data[i].originalReportingQuarter) {
                      if (doc[0].KCProcessOPS[j].cqo == undefined) {
                        doc[0].KCProcessOPS[j].cqo = parseInt(doc[0].SCTest2Data[i].numDefects);
                      }else {
                        doc[0].KCProcessOPS[j].cqo += parseInt(doc[0].SCTest2Data[i].numDefects);
                      }
                    }
                    // add all PQO - Previous Quarter Operational Defects
                    else {
                      if (doc[0].KCProcessOPS[j].pqo == undefined) {
                        doc[0].KCProcessOPS[j].pqo = parseInt(doc[0].SCTest2Data[i].numDefects);
                      }else {
                        doc[0].KCProcessOPS[j].pqo += parseInt(doc[0].SCTest2Data[i].numDefects);
                      }
                    }
                  }

                }
              }
            }

            // List of unremediated defects by sampled Country
            if (!isNaN(doc[0].SCTest2Data[i].numDefects) && doc[0].SCTest2Data[i].remediationStatus == "Open" && doc[0].SCTest2Data[i].numDefects > 0) {
              doc[0].SCUnremedDefects.push(doc[0].SCTest2Data[i]);
            }

          }

          // Calculate for Previous 1 Quarter Unremediated Defect
          // Calculate for Previous 2 Quarter Unremediated Defect
          // Calculate for Previous 3 Quarter Unremediated Defect
          // Calculate for Previous 4 Quarter Unremediated Defect

          //** Calculate for Unremediated Defects - END **//

          // Add padding to Current Quarter Country Process Defect Rate Exceptions in SCT
          if (doc[0].CPDRException.length < defViewRow) {
            if (doc[0].CPDRException.length == 0) {
              doc[0].CPDRException = fieldCalc.addTestViewData(6,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].CPDRException,6,(defViewRow-doc[0].CPDRException.length));
            }
          }
          // Add padding to Unremediated Defects by Quarter in SCT
          if (doc[0].SCUnremedDefects.length < defViewRow) {
            if (doc[0].SCUnremedDefects.length == 0) {
              doc[0].SCUnremedDefects = fieldCalc.addTestViewData(11,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(doc[0].SCUnremedDefects,11,(defViewRow-doc[0].SCUnremedDefects.length));
            }
          }

          break;
      }
    }catch(e){
      console.log("[class-sampledcountrycontrol][processSCTab] - " + err.error);
		}
	}

}
module.exports = calculateSCTab;
