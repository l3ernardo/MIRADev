/**************************************************************************************************
 *
 * MIRA Key Sanpled Country Testing Tab Codes
 * Date: 27 January 2017
 * By: genonms@ph.ibm.com
 *
 */

var fieldCalc = require('./class-fieldcalc.js');

var calculateRCTab = {

  processRCTab: function(doc, defViewRow) {
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
          var cappedtest;
          doc[0].TRExceptionControls = [];
          //** Calculate for Defect Rate and Testing Ratio - START **//

          // Calculate for Current Quarter
          for (var i = 0; i < doc[0].RCTest2Data.length; i++) {

            if (doc[0].MIRABusinessUnit == "GTS") {

              // For financial processes
              for (var j = 0; j < doc[0].KCProcessFIN.length; j++) {
                for (var k = 0; k < doc[0].KCProcessFIN[j].members.length; k++) {
                  if (doc[0].KCProcessFIN[j].members[k].id == doc[0].RCTest2Data[i].GPParentWWBCITKey) {

                    // add all tests for DR Calc
                    if (!isNaN(doc[0].RCTest2Data[i].numActualTests)) {
                      if (doc[0].KCProcessFIN[j].members[k].test == undefined) {
                        doc[0].KCProcessFIN[j].members[k].test = parseInt(doc[0].RCTest2Data[i].numActualTests);
                      }else {
                        doc[0].KCProcessFIN[j].members[k].test += parseInt(doc[0].RCTest2Data[i].numActualTests);
                      }
                    }
                    // add all defects for DR Calc
                    if (!isNaN(doc[0].RCTest2Data[i].numDefects)) {
                      if (doc[0].KCProcessFIN[j].members[k].defect == undefined) {
                        doc[0].KCProcessFIN[j].members[k].defect = parseInt(doc[0].RCTest2Data[i].numDefects);
                      }else {
                        doc[0].KCProcessFIN[j].members[k].defect += parseInt(doc[0].RCTest2Data[i].numDefects);
                      }
                    }

                    // add all required rests for TR Calc
                    if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                      if (doc[0].KCProcessFIN[j].members[k].reqtest == undefined) {
                        doc[0].KCProcessFIN[j].members[k].reqtest = parseInt(doc[0].RCTest2Data[i].numRequiredTests);
                      }else {
                        doc[0].KCProcessFIN[j].members[k].reqtest += parseInt(doc[0].RCTest2Data[i].numRequiredTests);
                      }
                    }
                    // add all capped tests for TR Calc
                    // calculate for capped test
                    if (!isNaN(doc[0].RCTest2Data[i].numActualTests)) {
                      if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                        if (doc[0].RCTest2Data[i].numActualTests > doc[0].RCTest2Data[i].numRequiredTests) {
                          cappedtest = doc[0].RCTest2Data[i].numRequiredTests;
                        } else {
                          cappedtest = doc[0].RCTest2Data[i].numActualTests;
                        }
                      } else {
                        cappedtest = doc[0].RCTest2Data[i].numActualTests;
                      }
                    }
                    else {
                      cappedtest = "";
                    }
                    doc[0].RCTest2Data[i].testingRatio = "";
                    if (cappedtest !== "") {
                      if (doc[0].KCProcessFIN[j].members[k].cappedtest == undefined) {
                        doc[0].KCProcessFIN[j].members[k].cappedtest = parseInt(cappedtest);
                      }else {
                        doc[0].KCProcessFIN[j].members[k].cappedtest += parseInt(cappedtest);
                      }
                      if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests) || doc[0].RCTest2Data[i].numRequiredTests !== 0) {
                        doc[0].RCTest2Data[i].testingRatio = ((cappedtest / doc[0].RCTest2Data[i].numRequiredTests) * 100).toFixed(1);
                        if (doc[0].RCTest2Data[i].testingRatio == 0) {
                          doc[0].RCTest2Data[i].testingRatio = parseInt(doc[0].RCTest2Data[i].testingRatio).toFixed(0);
                        }
                      }
                    }

                  }
                }
              }

              // For operational processes
              for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
                for (var k = 0; k < doc[0].KCProcessOPS[j].members.length; k++) {
                  if (doc[0].KCProcessOPS[j].members[k].id == doc[0].RCTest2Data[i].GPParentWWBCITKey) {
                    // add all tests
                    if (!isNaN(doc[0].RCTest2Data[i].numActualTests)) {
                      if (doc[0].KCProcessOPS[j].members[k].test == undefined) {
                        doc[0].KCProcessOPS[j].members[k].test = parseInt(doc[0].RCTest2Data[i].numActualTests);
                      }else {
                        doc[0].KCProcessOPS[j].members[k].test += parseInt(doc[0].RCTest2Data[i].numActualTests);
                      }
                    }
                    // add all defects
                    if (!isNaN(doc[0].RCTest2Data[i].numDefects)) {
                      if (doc[0].KCProcessOPS[j].members[k].defect == undefined) {
                        doc[0].KCProcessOPS[j].members[k].defect = parseInt(doc[0].RCTest2Data[i].numDefects);
                      }else {
                        doc[0].KCProcessOPS[j].members[k].defect += parseInt(doc[0].RCTest2Data[i].numDefects);
                      }
                    }

                    // add all required rests for TR Calc
                    if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                      if (doc[0].KCProcessOPS[j].members[k].reqtest == undefined) {
                        doc[0].KCProcessOPS[j].members[k].reqtest = parseInt(doc[0].RCTest2Data[i].numRequiredTests);
                      }else {
                        doc[0].KCProcessOPS[j].members[k].reqtest += parseInt(doc[0].RCTest2Data[i].numRequiredTests);
                      }
                    }
                    // add all capped tests for TR Calc
                    // calculate for capped test
                    if (!isNaN(doc[0].RCTest2Data[i].numActualTests)) {
                      if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                        if (doc[0].RCTest2Data[i].numActualTests > doc[0].RCTest2Data[i].numRequiredTests) {
                          cappedtest = doc[0].RCTest2Data[i].numRequiredTests;
                        } else {
                          cappedtest = doc[0].RCTest2Data[i].numActualTests;
                        }
                      } else {
                        cappedtest = doc[0].RCTest2Data[i].numActualTests;
                      }
                    }
                    else {
                      cappedtest = "";
                    }
                    doc[0].RCTest2Data[i].testingRatio = "";
                    if (cappedtest !== "") {
                      if (doc[0].KCProcessOPS[j].members[k].cappedtest == undefined) {
                        doc[0].KCProcessOPS[j].members[k].cappedtest = parseInt(cappedtest);
                      }else {
                        doc[0].KCProcessOPS[j].members[k].cappedtest += parseInt(cappedtest);
                      }
                      if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests) || doc[0].RCTest2Data[i].numRequiredTests !== 0) {
                        doc[0].RCTest2Data[i].testingRatio = ((cappedtest / doc[0].RCTest2Data[i].numRequiredTests) * 100).toFixed(1);
                        if (doc[0].RCTest2Data[i].testingRatio == 0) {
                          doc[0].RCTest2Data[i].testingRatio = parseInt(doc[0].RCTest2Data[i].testingRatio).toFixed(0);
                        }
                      }
                    }

                  }
                }
              }

            }
            if (doc[0].MIRABusinessUnit == "GBS") {
              // For financial processes
              for (var j = 0; j < doc[0].KCProcessFIN.length; j++) {
                if (doc[0].KCProcessFIN[j].id == doc[0].RCTest2Data[i].GPParentWWBCITKey) {

                  // add all tests for DR calc
                  if (!isNaN(doc[0].RCTest2Data[i].numtest)) {
                    if (doc[0].KCProcessFIN[j].test == undefined) {
                      doc[0].KCProcessFIN[j].test = parseInt(doc[0].RCTest2Data[i].numtest);
                    }else {
                      doc[0].KCProcessFIN[j].test += parseInt(doc[0].RCTest2Data[i].numtest);
                    }
                  }
                  // add all defects for DR calc
                  if (!isNaN(doc[0].RCTest2Data[i].numDefects)) {
                    if (doc[0].KCProcessFIN[j].defect == undefined) {
                      doc[0].KCProcessFIN[j].defect = parseInt(doc[0].RCTest2Data[i].numDefects);
                    }else {
                      doc[0].KCProcessFIN[j].defect += parseInt(doc[0].RCTest2Data[i].numDefects);
                    }
                  }

                  // add all required rests for TR Calc
                  if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                    if (doc[0].KCProcessFIN[j].members[k].reqtest == undefined) {
                      doc[0].KCProcessFIN[j].members[k].reqtest = parseInt(doc[0].RCTest2Data[i].numRequiredTests);
                    }else {
                      doc[0].KCProcessFIN[j].members[k].reqtest += parseInt(doc[0].RCTest2Data[i].numRequiredTests);
                    }
                  }
                  // add all capped tests for TR Calc
                  // calculate for capped test
                  if (!isNaN(doc[0].RCTest2Data[i].numActualTests)) {
                    if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                      if (doc[0].RCTest2Data[i].numActualTests > doc[0].RCTest2Data[i].numRequiredTests) {
                        cappedtest = doc[0].RCTest2Data[i].numRequiredTests;
                      } else {
                        cappedtest = doc[0].RCTest2Data[i].numActualTests;
                      }
                    } else {
                      cappedtest = doc[0].RCTest2Data[i].numActualTests;
                    }
                  }
                  else {
                    cappedtest = "";
                  }
                  doc[0].RCTest2Data[i].testingRatio = "";
                  if (cappedtest !== "") {
                    if (doc[0].KCProcessFIN[j].members[k].cappedtest == undefined) {
                      doc[0].KCProcessFIN[j].members[k].cappedtest = parseInt(cappedtest);
                    }else {
                      doc[0].KCProcessFIN[j].members[k].cappedtest += parseInt(cappedtest);
                    }
                    if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests) || doc[0].RCTest2Data[i].numRequiredTests !== 0) {
                      doc[0].RCTest2Data[i].testingRatio = ((cappedtest / doc[0].RCTest2Data[i].numRequiredTests) * 100).toFixed(1);
                      if (doc[0].RCTest2Data[i].testingRatio == 0) {
                        doc[0].RCTest2Data[i].testingRatio = parseInt(doc[0].RCTest2Data[i].testingRatio).toFixed(0);
                      }
                    }
                  }

                }
              }

              // For operational processes
              for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
                if (doc[0].KCProcessOPS[j].id == doc[0].RCTest2Data[i].GPParentWWBCITKey) {

                  // add all tests for DR Calc
                  if (!isNaN(doc[0].RCTest2Data[i].numtest)) {
                    if (doc[0].KCProcessOPS[j].test == undefined) {
                      doc[0].KCProcessOPS[j].test = parseInt(doc[0].RCTest2Data[i].numtest);
                    }else {
                      doc[0].KCProcessOPS[j].test += parseInt(doc[0].RCTest2Data[i].numtest);
                    }
                  }
                  // add all defects for DR Calc
                  if (doc[0].KCProcessOPS[j].id == doc[0].RCTest2Data[i].GPParentWWBCITKey) {
                    if (!isNaN(doc[0].RCTest2Data[i].numDefects)) {
                      if (doc[0].KCProcessOPS[j].defect == undefined) {
                        doc[0].KCProcessOPS[j].defect = parseInt(doc[0].RCTest2Data[i].numDefects);
                      }else {
                        doc[0].KCProcessOPS[j].defect += parseInt(doc[0].RCTest2Data[i].numDefects);
                      }
                    }
                  }

                  // add all required rests for TR Calc
                  if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                    if (doc[0].KCProcessOPS[j].members[k].reqtest == undefined) {
                      doc[0].KCProcessOPS[j].members[k].reqtest = parseInt(doc[0].RCTest2Data[i].numRequiredTests);
                    }else {
                      doc[0].KCProcessOPS[j].members[k].reqtest += parseInt(doc[0].RCTest2Data[i].numRequiredTests);
                    }
                  }
                  // add all capped tests for TR Calc
                  // calculate for capped test
                  if (!isNaN(doc[0].RCTest2Data[i].numActualTests)) {
                    if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                      if (doc[0].RCTest2Data[i].numActualTests > doc[0].RCTest2Data[i].numRequiredTests) {
                        cappedtest = doc[0].RCTest2Data[i].numRequiredTests;
                      } else {
                        cappedtest = doc[0].RCTest2Data[i].numActualTests;
                      }
                    } else {
                      cappedtest = doc[0].RCTest2Data[i].numActualTests;
                    }
                  }
                  else {
                    cappedtest = "";
                  }
                  doc[0].RCTest2Data[i].testingRatio = "";
                  if (cappedtest !== "") {
                    if (doc[0].KCProcessOPS[j].members[k].cappedtest == undefined) {
                      doc[0].KCProcessOPS[j].members[k].cappedtest = parseInt(cappedtest);
                    }else {
                      doc[0].KCProcessOPS[j].members[k].cappedtest += parseInt(cappedtest);
                    }
                    if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests) || doc[0].RCTest2Data[i].numRequiredTests !== 0) {
                      doc[0].RCTest2Data[i].testingRatio = ((cappedtest / doc[0].RCTest2Data[i].numRequiredTests) * 100).toFixed(1);
                      if (doc[0].RCTest2Data[i].testingRatio == 0) {
                        doc[0].RCTest2Data[i].testingRatio = parseInt(doc[0].RCTest2Data[i].testingRatio).toFixed(0);
                      }
                    }
                  }

                }
              }

            }

            // For Testing Ration Exception View

            if (!isNaN(doc[0].RCTest2Data[i].numActualTests) && !isNaN(doc[0].RCTest2Data[i].numRequiredTests) && parseInt(doc[0].RCTest2Data[i].numActualTests) < parseInt(doc[0].RCTest2Data[i].numRequiredTests)) {
              doc[0].TRExceptionControls.push(doc[0].RCTest2Data[i]);
            }

          }
          // Calculate Defect Rates
          if (doc[0].MIRABusinessUnit == "GTS") {
            // Financial processes calculate for defect rate
            for (var j = 0; j < doc[0].KCProcessFIN.length; j++) {
              for (var k = 0; k < doc[0].KCProcessFIN[j].members.length; k++) {
                if (doc[0].KCProcessFIN[j].members[k].test == undefined) {
                  doc[0].KCProcessFIN[j].members[k].test = "";
                  doc[0].KCProcessFIN[j].members[k].defectRate = "";
                } else {
                  if (doc[0].KCProcessFIN[j].members[k].defect == undefined) {
                    doc[0].KCProcessFIN[j].members[k].defectRate = 0;
                  } else {
                    doc[0].KCProcessFIN[j].members[k].defectRate = ((doc[0].KCProcessFIN[j].members[k].defect / doc[0].KCProcessFIN[j].members[k].test) * 100).toFixed(1);
                    if (doc[0].KCProcessFIN[j].members[k].defectRate == 0) {
                      doc[0].KCProcessFIN[j].members[k].defectRate = parseInt(doc[0].KCProcessFIN[j].members[k].defectRate).toFixed(0);
                    }
                  }
                }
              }
            }
            // operational processes calculate for defect rate
            for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
              for (var k = 0; k < doc[0].KCProcessOPS[j].members.length; k++) {
                if (doc[0].KCProcessOPS[j].members[k].test == undefined) {
                  doc[0].KCProcessOPS[j].members[k].test = "";
                  doc[0].KCProcessOPS[j].members[k].defectRate = "";
                } else {
                  if (doc[0].KCProcessOPS[j].members[k].defect == undefined) {
                    doc[0].KCProcessOPS[j].members[k].defectRate = 0;
                  } else {
                    doc[0].KCProcessOPS[j].members[k].defectRate = ((doc[0].KCProcessOPS[j].members[k].defect / doc[0].KCProcessOPS[j].members[k].test) * 100).toFixed(1);
                    if (doc[0].KCProcessOPS[j].members[k].defectRate == 0) {
                      doc[0].KCProcessOPS[j].members[k].defectRate = parseInt(doc[0].KCProcessOPS[j].members[k].defectRate).toFixed(0);
                    }
                  }
                }
              }
            }
          }
          if (doc[0].MIRABusinessUnit == "GBS") {
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
          }

          // Calcualte for Testing Ratios
          if (doc[0].MIRABusinessUnit == "GTS") {
            // Financial processes calculate for testing ratio
            for (var j = 0; j < doc[0].KCProcessFIN.length; j++) {
              for (var k = 0; k < doc[0].KCProcessFIN[j].members.length; k++) {
                if (doc[0].KCProcessFIN[j].members[k].reqtest == undefined) {
                  doc[0].KCProcessFIN[j].members[k].testingRatio = "";
                }
                else {
                  if (doc[0].KCProcessFIN[j].members[k].cappedtest == undefined) {
                    doc[0].KCProcessFIN[j].members[k].cappedtest = 0;
                  } else {
                    doc[0].KCProcessFIN[j].members[k].testingRatio = ((doc[0].KCProcessFIN[j].members[k].cappedtest / doc[0].KCProcessFIN[j].members[k].reqtest) * 100).toFixed(1);
                    if (doc[0].KCProcessFIN[j].members[k].testingRatio == 0) {
                      doc[0].KCProcessFIN[j].members[k].testingRatio = parseInt(doc[0].KCProcessFIN[j].members[k].testingRatio).toFixed(0);
                    }
                  }
                }
              }
            }
            // operational processes calculate for testing ratio
            for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
              for (var k = 0; k < doc[0].KCProcessOPS[j].members.length; k++) {
                if (doc[0].KCProcessOPS[j].members[k].reqtest == undefined) {
                  doc[0].KCProcessOPS[j].members[k].testingRatio = "";
                }
                else {
                  if (doc[0].KCProcessOPS[j].members[k].cappedtest == undefined) {
                    doc[0].KCProcessOPS[j].members[k].cappedtest = 0;
                  } else {
                    doc[0].KCProcessOPS[j].members[k].testingRatio = ((doc[0].KCProcessOPS[j].members[k].cappedtest / doc[0].KCProcessOPS[j].members[k].reqtest) * 100).toFixed(1);
                    if (doc[0].KCProcessOPS[j].members[k].testingRatio == 0) {
                      doc[0].KCProcessOPS[j].members[k].testingRatio = parseInt(doc[0].KCProcessOPS[j].members[k].testingRatio).toFixed(0);
                    }
                  }
                }
              }
            }
          }
          if (doc[0].MIRABusinessUnit == "GBS") {
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
          }

          // Calculate for Previous 1 Quarter Defect Rates
          // Calculate for Previous 2 Quarter Defect Rates
          // Calculate for Previous 3 Quarter Defect Rates
          // Calculate for Previous 4 Quarter Defect Rates

          //** Calculate for Defect Rate and Testing Ratio - END **//

          //** Calculate for Unremediated Defects - START **//
          doc[0].SCUnremedDefects = [];
          for (var i = 0; i < doc[0].RCTest3Data.length; i++) {
            if (!isNaN(doc[0].RCTest3Data[i].numDefects) && doc[0].RCTest3Data[i].remediationStatus == "Open" && parseInt(doc[0].RCTest3Data[i].numDefects) > 0) {
              if (doc[0].MIRABusinessUnit == "GTS") {
                // For financial processes
                for (var j = 0; j < doc[0].KCProcessFIN.length; j++) {
                  for (var k = 0; k < doc[0].KCProcessFIN[j].members.length; k++) {
                    if (doc[0].KCProcessFIN[j].members[k].id == doc[0].RCTest3Data[i].GPPARENT) {
                      if (!isNaN(doc[0].RCTest3Data[i].numDefects)) {
                        // Process all Financial Defects
                        if (doc[0].RCTest3Data[i].controlType == "KCFR") {
                          // add all CQF - Current Quarter Financial Defects
                          if (doc[0].RCTest3Data[i].reportingQuarter == doc[0].RCTest3Data[i].originalReportingQuarter) {
                            if (doc[0].KCProcessFIN[j].members[k].cqf == undefined) {
                              doc[0].KCProcessFIN[j].members[k].cqf = parseInt(doc[0].RCTest3Data[i].numDefects);
                            }else {
                              doc[0].KCProcessFIN[j].members[k].cqf += parseInt(doc[0].RCTest3Data[i].numDefects);
                            }
                          }
                          // add all PQF - Previous Quarter Financial Defects
                          else {
                            if (doc[0].KCProcessFIN[j].members[k].pqf == undefined) {
                              doc[0].KCProcessFIN[j].members[k].pqf = parseInt(doc[0].RCTest3Data[i].numDefects);
                            }else {
                              doc[0].KCProcessFIN[j].members[k].pqf += parseInt(doc[0].RCTest3Data[i].numDefects);
                            }
                          }
                        }
                        // Process all Operatonal Defects
                        else {
                          // add all CQO - Current Quarter Operational Defects
                          if (doc[0].RCTest3Data[i].reportingQuarter == doc[0].RCTest3Data[i].originalReportingQuarter) {
                            if (doc[0].KCProcessFIN[j].members[k].cqo == undefined) {
                              doc[0].KCProcessFIN[j].members[k].cqo = parseInt(doc[0].RCTest3Data[i].numDefects);
                            }else {
                              doc[0].KCProcessFIN[j].members[k].cqo += parseInt(doc[0].RCTest3Data[i].numDefects);
                            }
                          }
                          // add all PQO - Previous Quarter Operational Defects
                          else {
                            if (doc[0].KCProcessFIN[j].members[k].pqo == undefined) {
                              doc[0].KCProcessFIN[j].members[k].pqo = parseInt(doc[0].RCTest3Data[i].numDefects);
                            }else {
                              doc[0].KCProcessFIN[j].members[k].pqo += parseInt(doc[0].RCTest3Data[i].numDefects);
                            }
                          }
                        }
                      }
                    }
                  }
                }
                // For operational processes
                for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
                  for (var k = 0; k < doc[0].KCProcessOPS[j].members.length; k++) {
                    if (doc[0].KCProcessOPS[j].members[k].id == doc[0].RCTest3Data[i].GPPARENT) {
                      if (!isNaN(doc[0].RCTest3Data[i].numDefects)) {
                        // Process all Financial Defects
                        if (doc[0].RCTest3Data[i].controlType == "KCFR") {
                          // add all CQF - Current Quarter Financial Defects
                          if (doc[0].RCTest3Data[i].reportingQuarter == doc[0].RCTest3Data[i].originalReportingQuarter) {
                            if (doc[0].KCProcessOPS[j].members[k].cqf == undefined) {
                              doc[0].KCProcessOPS[j].members[k].cqf = parseInt(doc[0].RCTest3Data[i].numDefects);
                            }else {
                              doc[0].KCProcessOPS[j].members[k].cqf += parseInt(doc[0].RCTest3Data[i].numDefects);
                            }
                          }
                          // add all PQF - Previous Quarter Financial Defects
                          else {
                            if (doc[0].KCProcessOPS[j].members[k].pqf == undefined) {
                              doc[0].KCProcessOPS[j].members[k].pqf = parseInt(doc[0].RCTest3Data[i].numDefects);
                            }else {
                              doc[0].KCProcessOPS[j].members[k].pqf += parseInt(doc[0].RCTest3Data[i].numDefects);
                            }
                          }
                        }
                        // Process all Operatonal Defects
                        else {
                          // add all CQO - Current Quarter Operational Defects
                          if (doc[0].RCTest3Data[i].reportingQuarter == doc[0].RCTest3Data[i].originalReportingQuarter) {
                            if (doc[0].KCProcessOPS[j].members[k].cqo == undefined) {
                              doc[0].KCProcessOPS[j].members[k].cqo = parseInt(doc[0].RCTest3Data[i].numDefects);
                            }else {
                              doc[0].KCProcessOPS[j].members[k].cqo += parseInt(doc[0].RCTest3Data[i].numDefects);
                            }
                          }
                          // add all PQO - Previous Quarter Operational Defects
                          else {
                            if (doc[0].KCProcessOPS[j].members[k].pqo == undefined) {
                              doc[0].KCProcessOPS[j].members[k].pqo = parseInt(doc[0].RCTest3Data[i].numDefects);
                            }else {
                              doc[0].KCProcessOPS[j].members[k].pqo += parseInt(doc[0].RCTest3Data[i].numDefects);
                            }
                          }
                        }

                      }
                    }
                  }
                }
              }

              if (doc[0].MIRABusinessUnit == "GBS") {
                // For financial processes
                for (var j = 0; j < doc[0].KCProcessFIN.length; j++) {
                  if (doc[0].KCProcessFIN[j].id == doc[0].RCTest3Data[i].GPPARENT) {
                    if (!isNaN(doc[0].RCTest3Data[i].numDefects)) {
                      // Process all Financial Defects
                      if (doc[0].RCTest3Data[i].controlType == "KCFR") {
                        // add all CQF - Current Quarter Financial Defects
                        if (doc[0].RCTest3Data[i].reportingQuarter == doc[0].RCTest3Data[i].originalReportingQuarter) {
                          if (doc[0].KCProcessFIN[j].cqf == undefined) {
                            doc[0].KCProcessFIN[j].cqf = parseInt(doc[0].RCTest3Data[i].numDefects);
                          }else {
                            doc[0].KCProcessFIN[j].cqf += parseInt(doc[0].RCTest3Data[i].numDefects);
                          }
                        }
                        // add all PQF - Previous Quarter Financial Defects
                        else {
                          if (doc[0].KCProcessFIN[j].pqf == undefined) {
                            doc[0].KCProcessFIN[j].pqf = parseInt(doc[0].RCTest3Data[i].numDefects);
                          }else {
                            doc[0].KCProcessFIN[j].pqf += parseInt(doc[0].RCTest3Data[i].numDefects);
                          }
                        }
                      }
                      // Process all Operatonal Defects
                      else {
                        // add all CQO - Current Quarter Operational Defects
                        if (doc[0].RCTest3Data[i].reportingQuarter == doc[0].RCTest3Data[i].originalReportingQuarter) {
                          if (doc[0].KCProcessFIN[j].cqo == undefined) {
                            doc[0].KCProcessFIN[j].cqo = parseInt(doc[0].RCTest3Data[i].numDefects);
                          }else {
                            doc[0].KCProcessFIN[j].cqo += parseInt(doc[0].RCTest3Data[i].numDefects);
                          }
                        }
                        // add all PQO - Previous Quarter Operational Defects
                        else {
                          if (doc[0].KCProcessFIN[j].pqo == undefined) {
                            doc[0].KCProcessFIN[j].pqo = parseInt(doc[0].RCTest3Data[i].numDefects);
                          }else {
                            doc[0].KCProcessFIN[j].pqo += parseInt(doc[0].RCTest3Data[i].numDefects);
                          }
                        }
                      }
                    }
                  }
                }
                // For operational processes
                for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
                  if (doc[0].KCProcessOPS[j].id == doc[0].RCTest3Data[i].GPPARENT) {
                    if (!isNaN(doc[0].RCTest3Data[i].numDefects)) {
                      // Process all Financial Defects
                      if (doc[0].RCTest3Data[i].controlType == "KCFR") {
                        // add all CQF - Current Quarter Financial Defects
                        if (doc[0].RCTest3Data[i].reportingQuarter == doc[0].RCTest3Data[i].originalReportingQuarter) {
                          if (doc[0].KCProcessOPS[j].cqf == undefined) {
                            doc[0].KCProcessOPS[j].cqf = parseInt(doc[0].RCTest3Data[i].numDefects);
                          }else {
                            doc[0].KCProcessOPS[j].cqf += parseInt(doc[0].RCTest3Data[i].numDefects);
                          }
                        }
                        // add all PQF - Previous Quarter Financial Defects
                        else {
                          if (doc[0].KCProcessOPS[j].pqf == undefined) {
                            doc[0].KCProcessOPS[j].pqf = parseInt(doc[0].RCTest3Data[i].numDefects);
                          }else {
                            doc[0].KCProcessOPS[j].pqf += parseInt(doc[0].RCTest3Data[i].numDefects);
                          }
                        }
                      }
                      // Process all Operatonal Defects
                      else {
                        // add all CQO - Current Quarter Operational Defects
                        if (doc[0].RCTest3Data[i].reportingQuarter == doc[0].RCTest3Data[i].originalReportingQuarter) {
                          if (doc[0].KCProcessOPS[j].cqo == undefined) {
                            doc[0].KCProcessOPS[j].cqo = parseInt(doc[0].RCTest3Data[i].numDefects);
                          }else {
                            doc[0].KCProcessOPS[j].cqo += parseInt(doc[0].RCTest3Data[i].numDefects);
                          }
                        }
                        // add all PQO - Previous Quarter Operational Defects
                        else {
                          if (doc[0].KCProcessOPS[j].pqo == undefined) {
                            doc[0].KCProcessOPS[j].pqo = parseInt(doc[0].RCTest3Data[i].numDefects);
                          }else {
                            doc[0].KCProcessOPS[j].pqo += parseInt(doc[0].RCTest3Data[i].numDefects);
                          }
                        }
                      }

                    }
                  }
                }
              }

            // List of unremediated defects by sampled Country
            // if (!isNaN(doc[0].RCTest3Data[i].numDefects) && doc[0].RCTest3Data[i].remediationStatus == "Open" && doc[0].RCTest3Data[i].numDefects > 0) {
              doc[0].SCUnremedDefects.push(doc[0].RCTest3Data[i]);
            }

          }

          // Calculate for Previous 1 Quarter Unremediated Defect
          // Calculate for Previous 2 Quarter Unremediated Defect
          // Calculate for Previous 3 Quarter Unremediated Defect
          // Calculate for Previous 4 Quarter Unremediated Defect

          //** Calculate for Unremediated Defects - END **//
          //Start of firs treetable
          var samples = doc[0].CPDRException;
          var sampleCategory = {};
          var samplesList = [];
          var exportSamples = [];
          var objects = {};//object of objects for counting
          samples.sort(function(a, b){
          var nameA=a.processCategory.toLowerCase(), nameB=b.processCategory.toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          var nameA=a.AUDefectRate.toLowerCase(), nameB=b.AUDefectRate.toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          return 0 //default return value (no sorting)
          });
          for(var i = 0; i < samples.length; i++){
          if(typeof sampleCategory[samples[i].processCategory] === "undefined"){
            var tmp = {
              id:samples[i].processCategory.replace(/ /g,''),
              category:samples[i].processCategory,
              count: 0,
            };
            samplesList.push(tmp);
            objects[tmp.id] = tmp;
            sampleCategory[samples[i].processCategory] = true;
          }
          samples[i].count = 1;
          var tmp = {};
          tmp.processCategory = samples[i].processCategory || " ";
          tmp.AssessableUnitName = samples[i].AssessableUnitName || " ";
          tmp.AUTestCount = samples[i].AUTestCount || " ";
          tmp.AUDefectCount = samples[i].AUDefectCount || " ";
          tmp.AUDefectRate = samples[i].AUDefectRate || " ";
          tmp.count = samples[i].count || " ";
          exportSamples.push(tmp);
          samples[i].parent = samples[i].processCategory.replace(/ /g,'');
          samples[i].id = samples[i]["_id"].replace(/ /g,'');
          //do counting for category
          objects[samples[i].parent].count++ ;
          samplesList.push(samples[i]);
          }
          doc[0].exportSample = exportSamples;

          // Add padding to Current Quarter Country Process Defect Rate Exceptions in SCT
          if (Object.keys(sampleCategory).length < defViewRow) {
            if (samplesList.length == 0) {
              samplesList = fieldCalc.addTestViewData(6,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(samplesList,6,(defViewRow-Object.keys(sampleCategory).length));
            }
          }
          doc[0].CPDRException = samplesList;
          //Start of second treetable
          var samples = doc[0].SCUnremedDefects;
          var sampleCategory = {};
          var samplesList = [];
          var exportSamples = [];
          var topCategory = 0;
          var objects = {};//object of objects for counting
          samples.sort(function(a, b){
            var nameA=a.originalReportingQuarter.toLowerCase(), nameB=b.originalReportingQuarter.toLowerCase()
            if (nameA < nameB) //sort string ascending
              return -1
            if (nameA > nameB)
              return 1
            var nameA=a.testType.toLowerCase(), nameB=b.testType.toLowerCase()
            if (nameA < nameB) //sort string ascending
              return -1
            if (nameA > nameB)
              return 1
            var nameA=a.processSampled.toLowerCase(), nameB=b.processSampled.toLowerCase()
            if (nameA < nameB) //sort string ascending
              return -1
            if (nameA > nameB)
              return 1
            /*
            var nameA=a.processSampled2.toLowerCase(), nameB=b.processSampled2.toLowerCase()
            if (nameA < nameB) //sort string ascending
              return -1
            if (nameA > nameB)
              return 1
            */
            var nameA=a.reportingCountry.toLowerCase(), nameB=b.reportingCountry.toLowerCase()
            if (nameA < nameB) //sort string ascending
              return -1
            if (nameA > nameB)
              return 1
            var nameA=a.controlName.toLowerCase(), nameB=b.controlName.toLowerCase()
            if (nameA < nameB) //sort string ascending
              return -1
            if (nameA > nameB)
              return 1
            return 0 //default return value (no sorting)
          });
          for(var i = 0; i < samples.length; i++){
            if(typeof sampleCategory[samples[i].originalReportingQuarter.replace(/ /g,'')] === "undefined"){
              topCategory++;
              var tmp = {
                id:samples[i].originalReportingQuarter.replace(/ /g,''),
                originalReportingQuarter:samples[i].originalReportingQuarter,
                count: 0,
                catEntry: true
              };
              samplesList.push(tmp);
              objects[tmp.id] = tmp;
              sampleCategory[samples[i].originalReportingQuarter.replace(/ /g,'')] = true;
            }
            if(typeof sampleCategory[samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].testType.replace(/ /g,'')] === "undefined"){
              var tmp = {
                parent:samples[i].originalReportingQuarter.replace(/ /g,''),
                id:samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].testType.replace(/ /g,''),
                testType:samples[i].testType,
                count: 0,
                catEntry: true
              };
              samplesList.push(tmp);
              objects[tmp.id] = tmp;
              sampleCategory[samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].testType.replace(/ /g,'')] = true;
            }
            if(typeof sampleCategory[samples[i].testType.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,'')] === "undefined"){
              var tmp = {
                id:samples[i].testType.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,''),
                parent:samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].testType.replace(/ /g,''),
                processSampled:samples[i].processSampled,
                count: 0,
                catEntry: true
              };
              samplesList.push(tmp);
              objects[tmp.id] = tmp;
              sampleCategory[samples[i].testType.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,'')] = true;
            }
            if(typeof sampleCategory[samples[i].processSampled.replace(/ /g,'')+samples[i].reportingCountry.replace(/ /g,'')] === "undefined"){
              var tmp = {
                parent:samples[i].testType.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,''),
                id:samples[i].processSampled.replace(/ /g,'')+samples[i].reportingCountry.replace(/ /g,''),
                reportingCountry:samples[i].reportingCountry,
                count: 0,
                catEntry: true
              };
              samplesList.push(tmp);
              objects[tmp.id] = tmp;
              sampleCategory[samples[i].processSampled.replace(/ /g,'')+samples[i].reportingCountry.replace(/ /g,'')] = true;
            }
            if(typeof sampleCategory[samples[i].reportingCountry.replace(/ /g,'')+samples[i].controlName.replace(/ /g,'')] === "undefined"){
              var tmp = {
                id:samples[i].reportingCountry.replace(/ /g,'')+samples[i].controlName.replace(/ /g,''),
                parent:samples[i].processSampled.replace(/ /g,'')+samples[i].reportingCountry.replace(/ /g,''),
                controlName:samples[i].controlName.replace(/ /g,''),
                count: 0,
                catEntry: true
              };
              samplesList.push(tmp);
              objects[tmp.id] = tmp;
              sampleCategory[samples[i].reportingCountry.replace(/ /g,'')+samples[i].controlName.replace(/ /g,'')] = true;
            }
            samples[i].count = 1;
            samples[i].parent = samples[i].reportingCountry.replace(/ /g,'')+samples[i].controlName.replace(/ /g,'');
            samples[i].id = samples[i]["_id"];
            //do counting for category
            objects[samples[i].parent].count++ ;
            //do counting for 2nd level category
            objects[objects[samples[i].parent].parent].count ++;
            //do counting for 3rd level category
            objects[objects[objects[samples[i].parent].parent].parent].count ++;
            //do counting for 4th level category
            objects[objects[objects[objects[samples[i].parent].parent].parent].parent].count ++;
            //do counting for 5th level category
            objects[objects[objects[objects[objects[samples[i].parent].parent].parent].parent].parent].count ++;
            var tmp = {};
            tmp.originalReportingQuarter = samples[i].originalReportingQuarter || " ";
            tmp.testType = samples[i].testType || " ";
            tmp.processSampled = samples[i].processSampled || " ";
            tmp.reportingCountry = samples[i].reportingCountry || " ";
            tmp.controlName = samples[i].controlName || " ";
            tmp.controllableUnit = samples[i].controllableUnit || " ";
            tmp.sampleUniqueID = samples[i].sampleUniqueID || " ";
            tmp.originalTargetDate = samples[i].originalTargetDate || " ";
            tmp.targetClose = samples[i].targetClose || " ";
            tmp.count = samples[i].count || " ";
            tmp.defectType = samples[i].defectType || " ";
            exportSamples.push(tmp);
            samplesList.push(samples[i]);
          }
          doc[0].exportSample2 = exportSamples;

          // Add padding to Unremediated Defects by Quarter in SCT
          if (topCategory < defViewRow) {
            if (samplesList.length == 0) {
              samplesList = fieldCalc.addTestViewData(11,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(samplesList,11,(defViewRow - topCategory));
            }
          }
          doc[0].SCUnremedDefects = samplesList;
          break;
      }
    }catch(e){
      console.log("[class-sampledcountrycontrol][processSCTab] - " + err.error);
		}
	}

}
module.exports = calculateRCTab;
