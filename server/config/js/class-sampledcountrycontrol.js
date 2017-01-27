/**************************************************************************************************
 *
 * MIRA Key Controls Testing Code
 * Date: 16 December 2016
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

          //** Calculate for Defect Rate **//
          for (var i = 0; i < doc[0].SCTest1Data.length; i++) {
            // For financial processes
            for (var j = 0; j < doc[0].KCProcessFIN.length; j++) {
              if (doc[0].KCProcessFIN[j].id == doc[0].SCTest1Data[i].GPPARENT) {
                // add all tests
                if (doc[0].SCTest1Data[i].numtest !== undefined && doc[0].SCTest1Data[i].numtest !== "") {
                  if (doc[0].KCProcessFIN[j].test == undefined) {
                    doc[0].KCProcessFIN[j].test = parseInt(doc[0].SCTest1Data[i].numtest);
                  }else {
                    doc[0].KCProcessFIN[j].test += parseInt(doc[0].SCTest1Data[i].numtest);
                  }
                }
                // add all defects
                if (doc[0].SCTest1Data[i].numDefects !== undefined && doc[0].SCTest1Data[i].numDefects !== "") {
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
              if (doc[0].SCTest1Data[i].numtest !== undefined && doc[0].SCTest1Data[i].numtest !== "") {
                if (doc[0].KCProcessOPS[j].test == undefined) {
                  doc[0].KCProcessOPS[j].test = parseInt(doc[0].SCTest1Data[i].numtest);
                }else {
                  doc[0].KCProcessOPS[j].test += parseInt(doc[0].SCTest1Data[i].numtest);
                }
              }
              // add all defects
              if (doc[0].KCProcessOPS[j].id == doc[0].SCTest1Data[i].GPPARENT) {
                if (doc[0].SCTest1Data[i].numDefects !== undefined && doc[0].SCTest1Data[i].numDefects !== "") {
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

          break;
      }
    }catch(e){
      console.log("[class-sampledcountrycontrol][processSCTab] - " + err.error);
		}
	}

}
module.exports = calculateSCTab;
