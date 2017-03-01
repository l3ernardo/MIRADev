/**************************************************************************************************
 *
 * MIRA Key Sanpled Country Testing Tab Codes
 * Date: 27 January 2017
 * By: genonms@ph.ibm.com
 *
 */

var fieldCalc = require('./class-fieldcalc.js');

var calculateSCTab = {

  processSCTab: function(doc, defViewRow, req) {
		try {
      switch (doc[0].ParentDocSubType) {
        case "Global Process":
          break;
        case "BU Reporting Group":
          break;
        case "Business Unit":
          break;
        case "BU IOT":
        case "BU IMT":
        case "BU Country":
          //** Calculate for Defect Rate - START **//

          // Calculate for Current Quarter
          for (var i = 0; i < doc[0].SCTest1Data.length; i++) {
            if (doc[0].MIRABusinessUnit == "GTS") {

              // For financial processes
              for (var j = 0; j < doc[0].KCProcessFINSCT.length; j++) {
                for (var k = 0; k < doc[0].KCProcessFINSCT[j].members.length; k++) {
                  if (doc[0].KCProcessFINSCT[j].members[k].id == doc[0].SCTest1Data[i].GPPARENT) {
                    // add all tests
                    if (!isNaN(doc[0].SCTest1Data[i].numtest)) {
                      if (doc[0].KCProcessFINSCT[j].members[k].test == undefined) {
                        doc[0].KCProcessFINSCT[j].members[k].test = parseInt(doc[0].SCTest1Data[i].numtest);
                      }else {
                        doc[0].KCProcessFINSCT[j].members[k].test += parseInt(doc[0].SCTest1Data[i].numtest);
                      }
                    }
                    // add all defects
                    if (!isNaN(doc[0].SCTest1Data[i].numDefects)) {
                      if (doc[0].KCProcessFINSCT[j].members[k].defect == undefined) {
                        doc[0].KCProcessFINSCT[j].members[k].defect = parseInt(doc[0].SCTest1Data[i].numDefects);
                      }else {
                        doc[0].KCProcessFINSCT[j].members[k].defect += parseInt(doc[0].SCTest1Data[i].numDefects);
                      }
                    }
                  }
                }
              }

              // For operational processes
              for (var j = 0; j < doc[0].KCProcessOPSSCT.length; j++) {
                for (var k = 0; k < doc[0].KCProcessOPSSCT[j].members.length; k++) {
                  if (doc[0].KCProcessOPSSCT[j].members[k].id == doc[0].SCTest1Data[i].GPPARENT) {
                    // add all tests
                    if (!isNaN(doc[0].SCTest1Data[i].numtest)) {
                      if (doc[0].KCProcessOPSSCT[j].members[k].test == undefined) {
                        doc[0].KCProcessOPSSCT[j].members[k].test = parseInt(doc[0].SCTest1Data[i].numtest);
                      }else {
                        doc[0].KCProcessOPSSCT[j].members[k].test += parseInt(doc[0].SCTest1Data[i].numtest);
                      }
                    }
                    // add all defects
                    if (!isNaN(doc[0].SCTest1Data[i].numDefects)) {
                      if (doc[0].KCProcessOPSSCT[j].members[k].defect == undefined) {
                        doc[0].KCProcessOPSSCT[j].members[k].defect = parseInt(doc[0].SCTest1Data[i].numDefects);
                      }else {
                        doc[0].KCProcessOPSSCT[j].members[k].defect += parseInt(doc[0].SCTest1Data[i].numDefects);
                      }
                    }
                    // if (doc[0].SCTest1Data[i].GPPARENT == "GPC300000142") {
                      // console.log(doc[0].SCTest1Data[i].numtest + "," + doc[0].SCTest1Data[i].numDefects + "," + doc[0].SCTest1Data[i]._id);
                    // }
                  }
                }
              }

            }
            if (doc[0].MIRABusinessUnit == "GBS") {
              // For financial processes
              for (var j = 0; j < doc[0].KCProcessFINSCT.length; j++) {
                if (doc[0].KCProcessFINSCT[j].id == doc[0].SCTest1Data[i].GPPARENT) {
                  // add all tests
                  if (!isNaN(doc[0].SCTest1Data[i].numtest)) {
                    if (doc[0].KCProcessFINSCT[j].test == undefined) {
                      doc[0].KCProcessFINSCT[j].test = parseInt(doc[0].SCTest1Data[i].numtest);
                    }else {
                      doc[0].KCProcessFINSCT[j].test += parseInt(doc[0].SCTest1Data[i].numtest);
                    }
                  }
                  // add all defects
                  if (!isNaN(doc[0].SCTest1Data[i].numDefects)) {
                    if (doc[0].KCProcessFINSCT[j].defect == undefined) {
                      doc[0].KCProcessFINSCT[j].defect = parseInt(doc[0].SCTest1Data[i].numDefects);
                    }else {
                      doc[0].KCProcessFINSCT[j].defect += parseInt(doc[0].SCTest1Data[i].numDefects);
                    }
                  }
                }
              }

              // For operational processes
              for (var j = 0; j < doc[0].KCProcessOPSSCT.length; j++) {
                if (doc[0].KCProcessOPSSCT[j].id == doc[0].SCTest1Data[i].GPPARENT) {
                  // add all tests
                  if (!isNaN(doc[0].SCTest1Data[i].numtest)) {
                    if (doc[0].KCProcessOPSSCT[j].test == undefined) {
                      doc[0].KCProcessOPSSCT[j].test = parseInt(doc[0].SCTest1Data[i].numtest);
                    }else {
                      doc[0].KCProcessOPSSCT[j].test += parseInt(doc[0].SCTest1Data[i].numtest);
                    }
                  }
                  // add all defects
                  if (doc[0].KCProcessOPSSCT[j].id == doc[0].SCTest1Data[i].GPPARENT) {
                    if (!isNaN(doc[0].SCTest1Data[i].numDefects)) {
                    // if (doc[0].SCTest1Data[i].numDefects !== undefined && doc[0].SCTest1Data[i].numDefects !== "") {
                      if (doc[0].KCProcessOPSSCT[j].defect == undefined) {
                        doc[0].KCProcessOPSSCT[j].defect = parseInt(doc[0].SCTest1Data[i].numDefects);
                      }else {
                        doc[0].KCProcessOPSSCT[j].defect += parseInt(doc[0].SCTest1Data[i].numDefects);
                      }
                    }
                  }
                }
              }

            }
          }
          // Calculate Defect Rates
          if (doc[0].MIRABusinessUnit == "GTS") {
            // Financial processes calculate for defect rate
            for (var j = 0; j < doc[0].KCProcessFINSCT.length; j++) {
              for (var k = 0; k < doc[0].KCProcessFINSCT[j].members.length; k++) {
                if (doc[0].KCProcessFINSCT[j].members[k].test == undefined) {
                  doc[0].KCProcessFINSCT[j].members[k].test = "";
                  doc[0].KCProcessFINSCT[j].members[k].defectRate = "";
                } else {
                  if (doc[0].KCProcessFINSCT[j].members[k].defect == undefined) {
                    doc[0].KCProcessFINSCT[j].members[k].defectRate = 0;
                  } else {
                    doc[0].KCProcessFINSCT[j].members[k].defectRate = ((doc[0].KCProcessFINSCT[j].members[k].defect / doc[0].KCProcessFINSCT[j].members[k].test) * 100).toFixed(1);
                    if (doc[0].KCProcessFINSCT[j].members[k].defectRate == 0) {
                      doc[0].KCProcessFINSCT[j].members[k].defectRate = parseInt(doc[0].KCProcessFINSCT[j].members[k].defectRate).toFixed(0);
                    }
                  }
                }
              }
            }
            // operational processes calculate for defect rate
            for (var j = 0; j < doc[0].KCProcessOPSSCT.length; j++) {
              for (var k = 0; k < doc[0].KCProcessOPSSCT[j].members.length; k++) {
                if (doc[0].KCProcessOPSSCT[j].members[k].test == undefined) {
                  doc[0].KCProcessOPSSCT[j].members[k].test = "";
                  doc[0].KCProcessOPSSCT[j].members[k].defectRate = "";
                } else {
                  if (doc[0].KCProcessOPSSCT[j].members[k].defect == undefined) {
                    doc[0].KCProcessOPSSCT[j].members[k].defectRate = 0;
                  } else {
                    doc[0].KCProcessOPSSCT[j].members[k].defectRate = ((doc[0].KCProcessOPSSCT[j].members[k].defect / doc[0].KCProcessOPSSCT[j].members[k].test) * 100).toFixed(1);
                    if (doc[0].KCProcessOPSSCT[j].members[k].defectRate == 0) {
                      doc[0].KCProcessOPSSCT[j].members[k].defectRate = parseInt(doc[0].KCProcessOPSSCT[j].members[k].defectRate).toFixed(0);
                    }
                  }
                }
              }
            }
          }
          if (doc[0].MIRABusinessUnit == "GBS") {
            // Financial processes calculate for defect rate
            for (var j = 0; j < doc[0].KCProcessFINSCT.length; j++) {
              if (doc[0].KCProcessFINSCT[j].test == undefined) {
                doc[0].KCProcessFINSCT[j].test = "";
                doc[0].KCProcessFINSCT[j].defectRate = "";
              } else {
                if (doc[0].KCProcessFINSCT[j].defect == undefined) {
                  doc[0].KCProcessFINSCT[j].defectRate = 0;
                } else {
                  doc[0].KCProcessFINSCT[j].defectRate = ((doc[0].KCProcessFINSCT[j].defect / doc[0].KCProcessFINSCT[j].test) * 100).toFixed(1);
                  if (doc[0].KCProcessFINSCT[j].defectRate == 0) {
                    doc[0].KCProcessFINSCT[j].defectRate = parseInt(doc[0].KCProcessFINSCT[j].defectRate).toFixed(0);
                  }
                }
              }
            }
            // operational processes calculate for defect rate
            for (var j = 0; j < doc[0].KCProcessOPSSCT.length; j++) {
              if (doc[0].KCProcessOPSSCT[j].test == undefined) {
                doc[0].KCProcessOPSSCT[j].test = "";
                doc[0].KCProcessOPSSCT[j].defectRate = "";
              } else {
                if (doc[0].KCProcessOPSSCT[j].defect == undefined) {
                  doc[0].KCProcessOPSSCT[j].defectRate = 0;
                } else {
                  doc[0].KCProcessOPSSCT[j].defectRate = ((doc[0].KCProcessOPSSCT[j].defect / doc[0].KCProcessOPSSCT[j].test) * 100).toFixed(1);
                  if (doc[0].KCProcessOPSSCT[j].defectRate == 0) {
                    doc[0].KCProcessOPSSCT[j].defectRate = parseInt(doc[0].KCProcessOPSSCT[j].defectRate).toFixed(0);
                  }
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
            if (!isNaN(doc[0].SCTest2Data[i].numDefects) && doc[0].SCTest2Data[i].remediationStatus == "Open" && parseInt(doc[0].SCTest2Data[i].numDefects) > 0) {
              if (doc[0].MIRABusinessUnit == "GTS") {
                // For financial processes
                for (var j = 0; j < doc[0].KCProcessFINSCT.length; j++) {
                  for (var k = 0; k < doc[0].KCProcessFINSCT[j].members.length; k++) {
                    if (doc[0].KCProcessFINSCT[j].members[k].id == doc[0].SCTest2Data[i].GPPARENT) {
                      if (!isNaN(doc[0].SCTest2Data[i].numDefects)) {
                        // Process all Financial Defects
                        if (doc[0].SCTest2Data[i].controlType == "KCFR") {
                          // add all CQF - Current Quarter Financial Defects
                          if (doc[0].SCTest2Data[i].reportingQuarter == doc[0].SCTest2Data[i].originalReportingQuarter) {
                            if (doc[0].KCProcessFINSCT[j].members[k].cqf == undefined) {
                              doc[0].KCProcessFINSCT[j].members[k].cqf = parseInt(doc[0].SCTest2Data[i].numDefects);
                            }else {
                              doc[0].KCProcessFINSCT[j].members[k].cqf += parseInt(doc[0].SCTest2Data[i].numDefects);
                            }
                          }
                          // add all PQF - Previous Quarter Financial Defects
                          else {
                            if (doc[0].KCProcessFINSCT[j].members[k].pqf == undefined) {
                              doc[0].KCProcessFINSCT[j].members[k].pqf = parseInt(doc[0].SCTest2Data[i].numDefects);
                            }else {
                              doc[0].KCProcessFINSCT[j].members[k].pqf += parseInt(doc[0].SCTest2Data[i].numDefects);
                            }
                          }
                        }
                        // Process all Operatonal Defects
                        else {
                          // add all CQO - Current Quarter Operational Defects
                          if (doc[0].SCTest2Data[i].reportingQuarter == doc[0].SCTest2Data[i].originalReportingQuarter) {
                            if (doc[0].KCProcessFINSCT[j].members[k].cqo == undefined) {
                              doc[0].KCProcessFINSCT[j].members[k].cqo = parseInt(doc[0].SCTest2Data[i].numDefects);
                            }else {
                              doc[0].KCProcessFINSCT[j].members[k].cqo += parseInt(doc[0].SCTest2Data[i].numDefects);
                            }
                          }
                          // add all PQO - Previous Quarter Operational Defects
                          else {
                            if (doc[0].KCProcessFINSCT[j].members[k].pqo == undefined) {
                              doc[0].KCProcessFINSCT[j].members[k].pqo = parseInt(doc[0].SCTest2Data[i].numDefects);
                            }else {
                              doc[0].KCProcessFINSCT[j].members[k].pqo += parseInt(doc[0].SCTest2Data[i].numDefects);
                            }
                          }
                        }
                      }
                    }
                  }
                }
                // For operational processes
                for (var j = 0; j < doc[0].KCProcessOPSSCT.length; j++) {
                  for (var k = 0; k < doc[0].KCProcessOPSSCT[j].members.length; k++) {
                    if (doc[0].KCProcessOPSSCT[j].members[k].id == doc[0].SCTest2Data[i].GPPARENT) {
                      if (!isNaN(doc[0].SCTest2Data[i].numDefects)) {
                      // if (doc[0].SCTest2Data[i].numDefects !== undefined && doc[0].SCTest2Data[i].numDefects !== "") {
                        // Process all Financial Defects
                        if (doc[0].SCTest2Data[i].controlType == "KCFR") {
                          // add all CQF - Current Quarter Financial Defects
                          if (doc[0].SCTest2Data[i].reportingQuarter == doc[0].SCTest2Data[i].originalReportingQuarter) {
                            if (doc[0].KCProcessOPSSCT[j].members[k].cqf == undefined) {
                              doc[0].KCProcessOPSSCT[j].members[k].cqf = parseInt(doc[0].SCTest2Data[i].numDefects);
                            }else {
                              doc[0].KCProcessOPSSCT[j].members[k].cqf += parseInt(doc[0].SCTest2Data[i].numDefects);
                            }
                          }
                          // add all PQF - Previous Quarter Financial Defects
                          else {
                            if (doc[0].KCProcessOPSSCT[j].members[k].pqf == undefined) {
                              doc[0].KCProcessOPSSCT[j].members[k].pqf = parseInt(doc[0].SCTest2Data[i].numDefects);
                            }else {
                              doc[0].KCProcessOPSSCT[j].members[k].pqf += parseInt(doc[0].SCTest2Data[i].numDefects);
                            }
                          }
                        }
                        // Process all Operatonal Defects
                        else {
                          // add all CQO - Current Quarter Operational Defects
                          if (doc[0].SCTest2Data[i].reportingQuarter == doc[0].SCTest2Data[i].originalReportingQuarter) {
                            if (doc[0].KCProcessOPSSCT[j].members[k].cqo == undefined) {
                              doc[0].KCProcessOPSSCT[j].members[k].cqo = parseInt(doc[0].SCTest2Data[i].numDefects);
                            }else {
                              doc[0].KCProcessOPSSCT[j].members[k].cqo += parseInt(doc[0].SCTest2Data[i].numDefects);
                            }
                          }
                          // add all PQO - Previous Quarter Operational Defects
                          else {
                            if (doc[0].KCProcessOPSSCT[j].members[k].pqo == undefined) {
                              doc[0].KCProcessOPSSCT[j].members[k].pqo = parseInt(doc[0].SCTest2Data[i].numDefects);
                            }else {
                              doc[0].KCProcessOPSSCT[j].members[k].pqo += parseInt(doc[0].SCTest2Data[i].numDefects);
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
                for (var j = 0; j < doc[0].KCProcessFINSCT.length; j++) {
                  if (doc[0].KCProcessFINSCT[j].id == doc[0].SCTest2Data[i].GPPARENT) {
                    if (!isNaN(doc[0].SCTest2Data[i].numDefects)) {
                      // Process all Financial Defects
                      if (doc[0].SCTest2Data[i].controlType == "KCFR") {
                        // add all CQF - Current Quarter Financial Defects
                        if (doc[0].SCTest2Data[i].reportingQuarter == doc[0].SCTest2Data[i].originalReportingQuarter) {
                          if (doc[0].KCProcessFINSCT[j].cqf == undefined) {
                            doc[0].KCProcessFINSCT[j].cqf = parseInt(doc[0].SCTest2Data[i].numDefects);
                          }else {
                            doc[0].KCProcessFINSCT[j].cqf += parseInt(doc[0].SCTest2Data[i].numDefects);
                          }
                        }
                        // add all PQF - Previous Quarter Financial Defects
                        else {
                          if (doc[0].KCProcessFINSCT[j].pqf == undefined) {
                            doc[0].KCProcessFINSCT[j].pqf = parseInt(doc[0].SCTest2Data[i].numDefects);
                          }else {
                            doc[0].KCProcessFINSCT[j].pqf += parseInt(doc[0].SCTest2Data[i].numDefects);
                          }
                        }
                      }
                      // Process all Operatonal Defects
                      else {
                        // add all CQO - Current Quarter Operational Defects
                        if (doc[0].SCTest2Data[i].reportingQuarter == doc[0].SCTest2Data[i].originalReportingQuarter) {
                          if (doc[0].KCProcessFINSCT[j].cqo == undefined) {
                            doc[0].KCProcessFINSCT[j].cqo = parseInt(doc[0].SCTest2Data[i].numDefects);
                          }else {
                            doc[0].KCProcessFINSCT[j].cqo += parseInt(doc[0].SCTest2Data[i].numDefects);
                          }
                        }
                        // add all PQO - Previous Quarter Operational Defects
                        else {
                          if (doc[0].KCProcessFINSCT[j].pqo == undefined) {
                            doc[0].KCProcessFINSCT[j].pqo = parseInt(doc[0].SCTest2Data[i].numDefects);
                          }else {
                            doc[0].KCProcessFINSCT[j].pqo += parseInt(doc[0].SCTest2Data[i].numDefects);
                          }
                        }
                      }
                    }
                  }
                }
                // For operational processes
                for (var j = 0; j < doc[0].KCProcessOPSSCT.length; j++) {
                  if (doc[0].KCProcessOPSSCT[j].id == doc[0].SCTest2Data[i].GPPARENT) {
                    if (!isNaN(doc[0].SCTest2Data[i].numDefects)) {
                      // Process all Financial Defects
                      if (doc[0].SCTest2Data[i].controlType == "KCFR") {
                        // add all CQF - Current Quarter Financial Defects
                        if (doc[0].SCTest2Data[i].reportingQuarter == doc[0].SCTest2Data[i].originalReportingQuarter) {
                          if (doc[0].KCProcessOPSSCT[j].cqf == undefined) {
                            doc[0].KCProcessOPSSCT[j].cqf = parseInt(doc[0].SCTest2Data[i].numDefects);
                          }else {
                            doc[0].KCProcessOPSSCT[j].cqf += parseInt(doc[0].SCTest2Data[i].numDefects);
                          }
                        }
                        // add all PQF - Previous Quarter Financial Defects
                        else {
                          if (doc[0].KCProcessOPSSCT[j].pqf == undefined) {
                            doc[0].KCProcessOPSSCT[j].pqf = parseInt(doc[0].SCTest2Data[i].numDefects);
                          }else {
                            doc[0].KCProcessOPSSCT[j].pqf += parseInt(doc[0].SCTest2Data[i].numDefects);
                          }
                        }
                      }
                      // Process all Operatonal Defects
                      else {
                        // add all CQO - Current Quarter Operational Defects
                        if (doc[0].SCTest2Data[i].reportingQuarter == doc[0].SCTest2Data[i].originalReportingQuarter) {
                          if (doc[0].KCProcessOPSSCT[j].cqo == undefined) {
                            doc[0].KCProcessOPSSCT[j].cqo = parseInt(doc[0].SCTest2Data[i].numDefects);
                          }else {
                            doc[0].KCProcessOPSSCT[j].cqo += parseInt(doc[0].SCTest2Data[i].numDefects);
                          }
                        }
                        // add all PQO - Previous Quarter Operational Defects
                        else {
                          if (doc[0].KCProcessOPSSCT[j].pqo == undefined) {
                            doc[0].KCProcessOPSSCT[j].pqo = parseInt(doc[0].SCTest2Data[i].numDefects);
                          }else {
                            doc[0].KCProcessOPSSCT[j].pqo += parseInt(doc[0].SCTest2Data[i].numDefects);
                          }
                        }
                      }

                    }
                  }
                }
              }

            // List of unremediated defects by sampled Country
            // if (!isNaN(doc[0].SCTest2Data[i].numDefects) && doc[0].SCTest2Data[i].remediationStatus == "Open" && doc[0].SCTest2Data[i].numDefects > 0) {
              doc[0].SCUnremedDefects.push(doc[0].SCTest2Data[i]);
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
          var samples = JSON.parse(JSON.stringify(doc[0].SCUnremedDefects));
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
            if(typeof sampleCategory[samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].testType.replace(/ /g,'')] === "undefined"){
              var tmp = {
                parent:samples[i].originalReportingQuarter.replace(/ /g,''),
                id:samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].testType.replace(/ /g,''),
                testType:samples[i].testType,
                count: 0,
                catEntry: true
              };
              samplesList.push(tmp);
              objects[tmp.id] = tmp;
              sampleCategory[samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].testType.replace(/ /g,'')] = true;
            }
            if(typeof sampleCategory[samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].testType.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,'')] === "undefined"){
              var tmp = {
                id:samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].testType.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,''),
                parent:samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].testType.replace(/ /g,''),
                processSampled:samples[i].processSampled,
                count: 0,
                catEntry: true
              };
              samplesList.push(tmp);
              objects[tmp.id] = tmp;
              sampleCategory[samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].testType.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,'')] = true;
            }
            if(typeof sampleCategory[samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,'')+samples[i].reportingCountry.replace(/ /g,'')] === "undefined"){
              var tmp = {
                parent:samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].testType.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,''),
                id:samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,'')+samples[i].reportingCountry.replace(/ /g,''),
                reportingCountry:samples[i].reportingCountry,
                count: 0,
                catEntry: true
              };
              samplesList.push(tmp);
              objects[tmp.id] = tmp;
              sampleCategory[samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,'')+samples[i].reportingCountry.replace(/ /g,'')] = true;
            }
            if(typeof sampleCategory[samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].reportingCountry.replace(/ /g,'')+samples[i].controlName.replace(/ /g,'')] === "undefined"){
              var tmp = {
                id:samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].reportingCountry.replace(/ /g,'')+samples[i].controlName.replace(/ /g,''),
                parent:samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].processSampled.replace(/ /g,'')+samples[i].reportingCountry.replace(/ /g,''),
                controlName:samples[i].controlName.replace(/ /g,''),
                count: 0,
                catEntry: true
              };
              samplesList.push(tmp);
              objects[tmp.id] = tmp;
              sampleCategory[samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].reportingCountry.replace(/ /g,'')+samples[i].controlName.replace(/ /g,'')] = true;
            }
            samples[i].count = 1;
            samples[i].parent = samples[i].originalReportingQuarter.replace(/ /g,'')+samples[i].reportingCountry.replace(/ /g,'')+samples[i].controlName.replace(/ /g,'');
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
module.exports = calculateSCTab;
