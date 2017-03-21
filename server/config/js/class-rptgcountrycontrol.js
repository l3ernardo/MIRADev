/**************************************************************************************************
 *
 * MIRA Key Rptg Country Testing Tab Codes
 * Date: 27 January 2017
 * By: genonms@ph.ibm.com
 *
 */

var fieldCalc = require('./class-fieldcalc.js');

var calculateRCTab = {

  processRCTab: function(doc, defViewRow) {
		try {
      switch (doc[0].ParentDocSubType) {
        case "BU Reporting Group":
          break;
        case "Business Unit":
          break;
        case "BU IOT":
        case "BU IMT":
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
                        if (parseInt(doc[0].RCTest2Data[i].numActualTests) > parseInt(doc[0].RCTest2Data[i].numRequiredTests)) {
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
                      if (doc[0].RCTest2Data[i].numRequiredTests == undefined || doc[0].RCTest2Data[i].numRequiredTests == "" || doc[0].RCTest2Data[i].numRequiredTests == 0 || cappedtest == "") {
                        doc[0].RCTest2Data[i].testingRatio == "";
                      } else {
                        if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                          doc[0].RCTest2Data[i].testingRatio = ((cappedtest / doc[0].RCTest2Data[i].numRequiredTests) * 100).toFixed(2);
                          if (doc[0].RCTest2Data[i].testingRatio == 0 || doc[0].RCTest2Data[i].testingRatio == 100) {
                            doc[0].RCTest2Data[i].testingRatio = parseInt(doc[0].RCTest2Data[i].testingRatio).toFixed(2);
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
                        if (parseInt(doc[0].RCTest2Data[i].numActualTests) > parseInt(doc[0].RCTest2Data[i].numRequiredTests)) {
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
                      if (doc[0].RCTest2Data[i].numRequiredTests == undefined || doc[0].RCTest2Data[i].numRequiredTests == "" || doc[0].RCTest2Data[i].numRequiredTests == 0 || cappedtest == "") {
                        doc[0].RCTest2Data[i].testingRatio == "";
                      } else {
                        if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                          doc[0].RCTest2Data[i].testingRatio = ((cappedtest / doc[0].RCTest2Data[i].numRequiredTests) * 100).toFixed(2);
                          if (doc[0].RCTest2Data[i].testingRatio == 0 || doc[0].RCTest2Data[i].testingRatio == 100) {
                            doc[0].RCTest2Data[i].testingRatio = parseInt(doc[0].RCTest2Data[i].testingRatio).toFixed(2);
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
                if (doc[0].KCProcessFIN[j].id == doc[0].RCTest2Data[i].GPParentWWBCITKey) {
                  // add all tests for DR calc
                  if (!isNaN(doc[0].RCTest2Data[i].numActualTests)) {
                    if (doc[0].KCProcessFIN[j].test == undefined) {
                      doc[0].KCProcessFIN[j].test = parseInt(doc[0].RCTest2Data[i].numActualTests);
                    }else {
                      doc[0].KCProcessFIN[j].test += parseInt(doc[0].RCTest2Data[i].numActualTests);
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

                  // add all required tests for TR Calc
                  if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                    if (doc[0].KCProcessFIN[j].reqtest == undefined) {
                      doc[0].KCProcessFIN[j].reqtest = parseInt(doc[0].RCTest2Data[i].numRequiredTests);
                    }else {
                      doc[0].KCProcessFIN[j].reqtest += parseInt(doc[0].RCTest2Data[i].numRequiredTests);
                    }
                  }
                  // add all capped tests for TR Calc
                  // calculate for capped test
                  if (!isNaN(doc[0].RCTest2Data[i].numActualTests)) {
                    if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                      if (parseInt(doc[0].RCTest2Data[i].numActualTests) > parseInt(doc[0].RCTest2Data[i].numRequiredTests)) {
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
                    if (doc[0].KCProcessFIN[j].cappedtest == undefined) {
                      doc[0].KCProcessFIN[j].cappedtest = parseInt(cappedtest);
                    }else {
                      doc[0].KCProcessFIN[j].cappedtest += parseInt(cappedtest);
                    }
                    if (doc[0].RCTest2Data[i].numRequiredTests == undefined || doc[0].RCTest2Data[i].numRequiredTests == "" || doc[0].RCTest2Data[i].numRequiredTests == 0 || cappedtest == "") {
                      doc[0].RCTest2Data[i].testingRatio == "";
                    } else {
                      if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                        doc[0].RCTest2Data[i].testingRatio = ((cappedtest / doc[0].RCTest2Data[i].numRequiredTests) * 100).toFixed(2);
                        if (doc[0].RCTest2Data[i].testingRatio == 0 || doc[0].RCTest2Data[i].testingRatio == 100) {
                          doc[0].RCTest2Data[i].testingRatio = parseInt(doc[0].RCTest2Data[i].testingRatio).toFixed(2);
                        }
                      }
                    }
                  }

                }
              }

              // For operational processes
              for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
                if (doc[0].KCProcessOPS[j].id == doc[0].RCTest2Data[i].GPParentWWBCITKey) {
                  // add all tests for DR Calc
                  if (!isNaN(doc[0].RCTest2Data[i].numActualTests)) {
                    if (doc[0].KCProcessOPS[j].test == undefined) {
                      doc[0].KCProcessOPS[j].test = parseInt(doc[0].RCTest2Data[i].numActualTests);
                    }else {
                      doc[0].KCProcessOPS[j].test += parseInt(doc[0].RCTest2Data[i].numActualTests);
                    }
                  }
                  // add all defects for DR Calc
                  if (!isNaN(doc[0].RCTest2Data[i].numDefects)) {
                    if (doc[0].KCProcessOPS[j].defect == undefined) {
                      doc[0].KCProcessOPS[j].defect = parseInt(doc[0].RCTest2Data[i].numDefects);
                    }else {
                      doc[0].KCProcessOPS[j].defect += parseInt(doc[0].RCTest2Data[i].numDefects);
                    }
                  }

                  // add all required rests for TR Calc
                  if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                    if (doc[0].KCProcessOPS[j].reqtest == undefined) {
                      doc[0].KCProcessOPS[j].reqtest = parseInt(doc[0].RCTest2Data[i].numRequiredTests);
                    }else {
                      doc[0].KCProcessOPS[j].reqtest += parseInt(doc[0].RCTest2Data[i].numRequiredTests);
                    }
                  }
                  // add all capped tests for TR Calc
                  // calculate for capped test
                  if (!isNaN(doc[0].RCTest2Data[i].numActualTests)) {
                    if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                      if (parseInt(doc[0].RCTest2Data[i].numActualTests) > parseInt(doc[0].RCTest2Data[i].numRequiredTests)) {
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
                    if (doc[0].KCProcessOPS[j].cappedtest == undefined) {
                      doc[0].KCProcessOPS[j].cappedtest = parseInt(cappedtest);
                    }else {
                      doc[0].KCProcessOPS[j].cappedtest += parseInt(cappedtest);
                    }
                    if (doc[0].RCTest2Data[i].numRequiredTests == undefined || doc[0].RCTest2Data[i].numRequiredTests == "" || doc[0].RCTest2Data[i].numRequiredTests == 0 || cappedtest == "") {
                      doc[0].RCTest2Data[i].testingRatio == "";
                    } else {
                      if (!isNaN(doc[0].RCTest2Data[i].numRequiredTests)) {
                        doc[0].RCTest2Data[i].testingRatio = ((cappedtest / doc[0].RCTest2Data[i].numRequiredTests) * 100).toFixed(2);
                        if (doc[0].RCTest2Data[i].testingRatio == 0 || doc[0].RCTest2Data[i].testingRatio == 100) {
                          doc[0].RCTest2Data[i].testingRatio = parseInt(doc[0].RCTest2Data[i].testingRatio).toFixed(2);
                        }
                      }
                    }
                  }
                }
              }

            }

            // For Testing Ratio Exception View
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
                  if (doc[0].KCProcessFIN[j].members[k].defect == undefined || doc[0].KCProcessFIN[j].members[k].test == 0) {
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
                  if (doc[0].KCProcessOPS[j].members[k].defect == undefined || doc[0].KCProcessOPS[j].members[k].test == 0) {
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
                if (doc[0].KCProcessFIN[j].defect == undefined || doc[0].KCProcessFIN[j].test == 0) {
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
                if (doc[0].KCProcessOPS[j].defect == undefined || doc[0].KCProcessOPS[j].test == 0) {
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
                if (doc[0].KCProcessFIN[j].members[k].reqtest == undefined || doc[0].KCProcessFIN[j].members[k].reqtest == "" || doc[0].KCProcessFIN[j].members[k].reqtest == 0) {
                  doc[0].KCProcessFIN[j].members[k].testingRatio = "";
                }
                else {
                  if (doc[0].KCProcessFIN[j].members[k].cappedtest == undefined || doc[0].KCProcessFIN[j].members[k].cappedtest == "") {
                    doc[0].KCProcessFIN[j].members[k].cappedtest = "";
                  } else {
                    doc[0].KCProcessFIN[j].members[k].testingRatio = ((doc[0].KCProcessFIN[j].members[k].cappedtest / doc[0].KCProcessFIN[j].members[k].reqtest) * 100).toFixed(1);
                    if (doc[0].KCProcessFIN[j].members[k].testingRatio == 0 || doc[0].KCProcessFIN[j].members[k].testingRatio == 100) {
                      doc[0].KCProcessFIN[j].members[k].testingRatio = parseInt(doc[0].KCProcessFIN[j].members[k].testingRatio).toFixed(0);
                    }
                  }
                }
              }
            }
            // operational processes calculate for testing ratio
            for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
              for (var k = 0; k < doc[0].KCProcessOPS[j].members.length; k++) {
                if (doc[0].KCProcessOPS[j].members[k].reqtest == undefined || doc[0].KCProcessOPS[j].members[k].reqtest == "" || doc[0].KCProcessOPS[j].members[k].reqtest == 0) {
                  doc[0].KCProcessOPS[j].members[k].testingRatio = "";
                }
                else {
                  if (doc[0].KCProcessOPS[j].members[k].cappedtest == undefined || doc[0].KCProcessOPS[j].members[k].cappedtest == "") {
                    doc[0].KCProcessOPS[j].members[k].cappedtest = "";
                  } else {
                    doc[0].KCProcessOPS[j].members[k].testingRatio = ((doc[0].KCProcessOPS[j].members[k].cappedtest / doc[0].KCProcessOPS[j].members[k].reqtest) * 100).toFixed(1);
                    if (doc[0].KCProcessOPS[j].members[k].testingRatio == 0 || doc[0].KCProcessOPS[j].members[k].testingRatio == 100) {
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
              if (doc[0].KCProcessFIN[j].reqtest == undefined || doc[0].KCProcessFIN[j].reqtest == "" || doc[0].KCProcessFIN[j].reqtest == 0) {
                doc[0].KCProcessFIN[j].testingRatio = "";
              } else {
                if (doc[0].KCProcessFIN[j].cappedtest == undefined || doc[0].KCProcessFIN[j].cappedtest == "") {
                  doc[0].KCProcessFIN[j].cappedtest = "";
                } else {
                  doc[0].KCProcessFIN[j].testingRatio = ((doc[0].KCProcessFIN[j].cappedtest / doc[0].KCProcessFIN[j].reqtest) * 100).toFixed(1);
                  if (doc[0].KCProcessFIN[j].testingRatio == 0 || doc[0].KCProcessFIN[j].testingRatio == 100) {
                    doc[0].KCProcessFIN[j].testingRatio = parseInt(doc[0].KCProcessFIN[j].testingRatio).toFixed(0);
                  }
                }
              }
            }
            // operational processes calculate for defect rate
            for (var j = 0; j < doc[0].KCProcessOPS.length; j++) {
              if (doc[0].KCProcessOPS[j].reqtest == undefined || doc[0].KCProcessOPS[j].reqtest == "" || doc[0].KCProcessOPS[j].reqtest == 0) {
                doc[0].KCProcessOPS[j].testingRatio = "";
              } else {
                if (doc[0].KCProcessOPS[j].cappedtest == undefined || doc[0].KCProcessOPS[j].cappedtest == "") {
                  doc[0].KCProcessOPS[j].cappedtest = "";
                } else {
                  doc[0].KCProcessOPS[j].testingRatio = ((doc[0].KCProcessOPS[j].cappedtest / doc[0].KCProcessOPS[j].reqtest) * 100).toFixed(1);
                  if (doc[0].KCProcessOPS[j].testingRatio == 0 || doc[0].KCProcessOPS[j].testingRatio == 100) {
                    doc[0].KCProcessOPS[j].testingRatio = parseInt(doc[0].KCProcessOPS[j].testingRatio).toFixed(0);
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
          // doc[0].SCUnremedDefects = [];
          var tmpRCTest3Data = [];
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
              tmpRCTest3Data.push(doc[0].RCTest3Data[i]);
            }

          }
          doc[0].RCTest3Data = [];
          doc[0].RCTest3Data = tmpRCTest3Data;
          // Calculate for Previous 1 Quarter Unremediated Defect
          // Calculate for Previous 2 Quarter Unremediated Defect
          // Calculate for Previous 3 Quarter Unremediated Defect
          // Calculate for Previous 4 Quarter Unremediated Defect

          //** Calculate for Unremediated Defects - END **//

          /////////////////////////////////////////////////////////////
          //Irving's code for repoting country

          //Sorting for first table is done in the process of Sample Country

          //Second table sorting
          var sortingElements = doc[0].TRExceptionControls;
          var exportList = [];
          var topCategory = 0;
          var catObjects = {};//object of objects for counting
          var sortedList = [];
          sortingElements.sort(function(a, b){
            var nameA=a.controlType.toLowerCase(), nameB=b.controlType.toLowerCase()
            if (nameA < nameB) //sort string ascending
              return -1
            if (nameA > nameB)
              return 1
              var nameA=a.process.toLowerCase(), nameB=b.process.toLowerCase()
              if (nameA < nameB) //sort string ascending
                return -1
              if (nameA > nameB)
                return 1
            return 0
          });
          for(var i = 0; i < sortingElements.length; i++){
            if(typeof catObjects[sortingElements[i].controlType.replace(/ /g,'')] === "undefined"){
              topCategory++;
              var tmp = {
                id:sortingElements[i].controlType.replace(/ /g,''),
                controlTypeName:sortingElements[i].controlType,
                numRequiredTests: 0,
                numActualTests: 0
              };
              sortedList.push(tmp);
              catObjects[sortingElements[i].controlType.replace(/ /g,'')] = tmp;
            }
            if(typeof catObjects[sortingElements[i].controlType.replace(/ /g,'')+sortingElements[i].process.replace(/ /g,'')] === "undefined"){
              var tmp = {
                parent:sortingElements[i].controlType.replace(/ /g,''),
                id: sortingElements[i].controlType.replace(/ /g,'')+sortingElements[i].process.replace(/ /g,''),
                processName:sortingElements[i].process,
                numRequiredTests: 0,
                numActualTests: 0
              };
              sortedList.push(tmp);
              catObjects[sortingElements[i].controlType.replace(/ /g,'')+sortingElements[i].process.replace(/ /g,'')] = tmp;
            }
            sortingElements[i].count = 1;
            sortingElements[i].parent = sortingElements[i].controlType.replace(/ /g,'')+sortingElements[i].process.replace(/ /g,'');
            sortingElements[i].id = sortingElements[i]["_id"];
            //do counting for category
            if(sortingElements[i].numRequiredTests != ""){
              catObjects[sortingElements[i].parent].numRequiredTests += parseFloat(sortingElements[i].numRequiredTests);
              catObjects[catObjects[sortingElements[i].parent].parent].numRequiredTests += parseFloat(sortingElements[i].numRequiredTests);
            }
            if(sortingElements[i].numActualTests != ""){
              catObjects[sortingElements[i].parent].numActualTests += parseFloat(sortingElements[i].numActualTests);
              catObjects[catObjects[sortingElements[i].parent].parent].numActualTests += parseFloat(sortingElements[i].numActualTests);
            }
            //catObjects[sortingElements[i].parent].count++ ;
            var tmp = {};
            tmp.controlType = sortingElements[i].controlType || " ";
            tmp.process = sortingElements[i].process || " ";
            tmp.controlName = sortingElements[i].controlName || " ";
            tmp.numRequiredTests = sortingElements[i].numRequiredTests || " ";
            tmp.numActualTests = sortingElements[i].numActualTests || " ";
            tmp.testingRatio = sortingElements[i].testingRatio || " ";
            tmp.reasonTested = sortingElements[i].reasonTested || " ";
            tmp.actionPlan = sortingElements[i].actionPlan || " ";

            exportList.push(tmp);
            sortedList.push(sortingElements[i]);
          }
          doc[0].exportRCTest = exportList;
          // Add padding to Unremediated Defects by Quarter in SCT
          if (topCategory < defViewRow) {
            if (sortedList.length == 0) {
              sortedList = fieldCalc.addTestViewData(11,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(sortedList,11,(defViewRow - topCategory));
            }
          }
          doc[0].TRExceptionControls = sortedList;
          // END OF SECOND TABLE SORTING*****************
          //start of third treetable
          var RCTest3 = doc[0].RCTest3Data;
          var RCTest3Category = {};
          var RCTest3List = [];
          var exportRCTest3 = [];
          var topCategory = 0;
          var objects = {};//object of objects for counting
          RCTest3.sort(function(a, b){
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
          for(var i = 0; i < RCTest3.length; i++){
            if(typeof RCTest3Category[RCTest3[i].originalReportingQuarter.replace(/ /g,'')] === "undefined"){
              topCategory++;
              var tmp = {
                id:RCTest3[i].originalReportingQuarter.replace(/ /g,''),
                originalReportingQuarter:RCTest3[i].originalReportingQuarter,
                count: 0,
                catEntry: true
              };
              RCTest3List.push(tmp);
              objects[tmp.id] = tmp;
              RCTest3Category[RCTest3[i].originalReportingQuarter.replace(/ /g,'')] = true;

            }
            if(typeof RCTest3Category[RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].testType.replace(/ /g,'')] === "undefined"){
              var tmp = {
                parent:RCTest3[i].originalReportingQuarter.replace(/ /g,''),
                id:RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].testType.replace(/ /g,''),
                testType:RCTest3[i].testType,
                count: 0,
                catEntry: true
              };
              RCTest3List.push(tmp);
              objects[tmp.id] = tmp;
              RCTest3Category[RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].testType.replace(/ /g,'')] = true;

            }
            if(typeof RCTest3Category[RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].testType.replace(/ /g,'')+RCTest3[i].processSampled.replace(/ /g,'')] === "undefined"){
              var tmp = {
                id:RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].testType.replace(/ /g,'')+RCTest3[i].processSampled.replace(/ /g,''),
                parent:RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].testType.replace(/ /g,''),
                processSampled:RCTest3[i].processSampled,
                count: 0,
                catEntry: true
              };
              RCTest3List.push(tmp);
              objects[tmp.id] = tmp;
              RCTest3Category[RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].testType.replace(/ /g,'')+RCTest3[i].processSampled.replace(/ /g,'')] = true;

            }
            if(typeof RCTest3Category[RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].processSampled.replace(/ /g,'')+RCTest3[i].reportingCountry.replace(/ /g,'')] === "undefined"){
              var tmp = {
                parent:RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].testType.replace(/ /g,'')+RCTest3[i].processSampled.replace(/ /g,''),
                id:RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].processSampled.replace(/ /g,'')+RCTest3[i].reportingCountry.replace(/ /g,''),
                reportingCountry:RCTest3[i].reportingCountry,
                count: 0,
                catEntry: true
              };
              RCTest3List.push(tmp);
              objects[tmp.id] = tmp;
              RCTest3Category[RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].processSampled.replace(/ /g,'')+RCTest3[i].reportingCountry.replace(/ /g,'')] = true;

            }
            if(typeof RCTest3Category[RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].reportingCountry.replace(/ /g,'')+RCTest3[i].controlName.replace(/ /g,'')] === "undefined"){
              var tmp = {
                id:RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].reportingCountry.replace(/ /g,'')+RCTest3[i].controlName.replace(/ /g,''),
                parent:RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].processSampled.replace(/ /g,'')+RCTest3[i].reportingCountry.replace(/ /g,''),
                controlName:RCTest3[i].controlName.replace(/ /g,''),
                count: 0,
                catEntry: true
              };
              RCTest3List.push(tmp);
              objects[tmp.id] = tmp;
              RCTest3Category[RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].reportingCountry.replace(/ /g,'')+RCTest3[i].controlName.replace(/ /g,'')] = true;

            }
            RCTest3[i].count = 1;
            RCTest3[i].parent = RCTest3[i].originalReportingQuarter.replace(/ /g,'')+RCTest3[i].reportingCountry.replace(/ /g,'')+RCTest3[i].controlName.replace(/ /g,'');
            RCTest3[i].id = RCTest3[i]["_id"];

            //do counting for category
            objects[RCTest3[i].parent].count++ ;
            //do counting for 2nd level category
            objects[objects[RCTest3[i].parent].parent].count ++;
            //do counting for 3rd level category
            objects[objects[objects[RCTest3[i].parent].parent].parent].count ++;
            //do counting for 4th level category
            objects[objects[objects[objects[RCTest3[i].parent].parent].parent].parent].count ++;
            //do counting for 5th level category
            objects[objects[objects[objects[objects[RCTest3[i].parent].parent].parent].parent].parent].count ++;

            var tmp = {};
            tmp.originalReportingQuarter = RCTest3[i].originalReportingQuarter || " ";
            tmp.testType = RCTest3[i].testType || " ";
            tmp.processSampled = RCTest3[i].processSampled || " ";
            tmp.reportingCountry = RCTest3[i].reportingCountry || " ";
            tmp.controlName = RCTest3[i].controlName || " ";
            tmp.controllableUnit = RCTest3[i].controllableUnit || " ";
            tmp.sampleUniqueID = RCTest3[i].sampleUniqueID || " ";
            tmp.originalTargetDate = RCTest3[i].originalTargetDate || " ";
            tmp.targetClose = RCTest3[i].targetClose || " ";
            tmp.count = RCTest3[i].count || " ";
            tmp.defectType = RCTest3[i].defectType || " ";
            exportRCTest3.push(tmp);
            RCTest3List.push(RCTest3[i]);
          }
          doc[0].exportRCTest3 = exportRCTest3;

          // Add padding to Unremediated Defects by Quarter in SCT
          if (topCategory < defViewRow) {
            if (RCTest3List.length == 0) {
              RCTest3List = fieldCalc.addTestViewData(11,defViewRow);
            } else {
              fieldCalc.addTestViewDataPadding(RCTest3List,11,(defViewRow - topCategory));
            }
          }
          doc[0].RCTest3Data = RCTest3List;
          // END OF IRVING'S CODE FOR REPORTING COUNTRY TAB****************
          ///////////////////////////////////////////////////////
          break;
      }
    }catch(e){
      console.log("[class-sampledcountrycontrol][processSCTab] - " + err.error);
		}
	}

}
module.exports = calculateRCTab;
