var express = require("express");
var assessments = express.Router();
var db = require('./js/class-conn.js');
// Add functionalities from other JS files
var assessment = require('./js/class-assessment.js');
var parameter = require('./js/class-parameter.js');
var isAuthenticated = require('./router-authentication.js');

/**************************************************************
ASSESSMENTS UNITS
***************************************************************/
/* Display assesment document */
assessments.get('/assessment', isAuthenticated, function(req, res) {
	assessment.getAsmtbyID(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				try {
					// Temporary save the original document status
					if(global.userdoc!="") {
						var docOrig = Object.assign({},global.userdoc);
						req.app.locals.doc1= docOrig;
						global.doc1 = docOrig;
						global.userdoc="";
					} else {
						var docOrig = Object.assign({},data.doc);
						req.app.locals.doc1=  docOrig[0];
						global.doc1 = docOrig[0];
					}
				} catch(e) {
					console.log(e.stack)
				}
				switch (data.doc[0].ParentDocSubType) {
					case "Business Unit":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','UnsatThresholdPercent','MargThresholdPercent','OpMetricRating','UnsatThresholdPercentTR','MargThresholdPercentTR','MissedIssueColor'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent','UnsatThresholdPercentTR','MargThresholdPercentTR'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								// Update the doc if it comes from a merge conflict
								try {
									var newdoc = Object.assign({},global.userdoc); // Working document
									global.userdoc="";
									if(global.conflictfields[0]!=undefined) {
										data.doc[0].conflictfields = global.conflictfields;
										global.conflictfields="";
										data.doc[0].editmode = "1";
									}
								}catch(e){
									console.log(e.stack);
								}
								// end merge here
								res.render('asmtbusinessunit', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][BUassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][BUassessment][getListParams] - " + err.error);
						})
						break;
					case "Global Process":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','UnsatThresholdPercent','MargThresholdPercent','OpMetricRating','UnsatThresholdPercentTR','MargThresholdPercentTR','MissedIssueColor'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent','UnsatThresholdPercentTR','MargThresholdPercentTR'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								// Update the doc if it comes from a merge conflict
								try {
									var newdoc = Object.assign({},global.userdoc); // Working document
									global.userdoc="";
									if(global.conflictfields[0]!=undefined) {
										data.doc[0].conflictfields = global.conflictfields;
										global.conflictfields="";
										data.doc[0].editmode = "1";
									}
									res.render('asmtglobalprocess', data.doc[0] );
								}catch(e){
									console.log(e.stack);
								}
								// end merge here
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][GPassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][GPassessment][getListParams] - " + err.error);
						})
						break;
					case "Sub-process":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','UnsatThresholdPercent','MargThresholdPercent','OpMetricRating','UnsatThresholdPercentTR','MargThresholdPercentTR','MissedIssueColor'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent','UnsatThresholdPercentTR','MargThresholdPercentTR'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								// Update the doc if it comes from a merge conflict
								try {
									var newdoc = Object.assign({},global.userdoc); // Working document
									global.userdoc="";
									if(global.conflictfields[0]!=undefined) {
										data.doc[0].conflictfields = global.conflictfields;
										global.conflictfields="";
										data.doc[0].editmode = "1";
									}
									res.render('asmtsubprocess', data.doc[0] );
								}catch(e){
									console.log(e.stack);
								}
								// end merge here
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][SPassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][SPassessment][getListParams] - " + err.error);
						})
						break;
					case "BU IOT":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','UnsatThresholdPercent','MargThresholdPercent','OpMetricRating','UnsatThresholdPercentTR','MargThresholdPercentTR','MissedIssueColor'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent','UnsatThresholdPercentTR','MargThresholdPercentTR'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								// Update the doc if it comes from a merge conflict
								try {
									var newdoc = Object.assign({},global.userdoc); // Working document
									global.userdoc="";
									if(global.conflictfields[0]!=undefined) {
										data.doc[0].conflictfields = global.conflictfields;
										global.conflictfields="";
										data.doc[0].editmode = "1";
									}
									res.render('asmtbuiot', data.doc[0] );
								}catch(e){
									console.log(e.stack);
								}
								// end merge here
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][BUIOTassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][BUIOTassessment][getListParams] - " + err.error);
						})
						break;
					case "BU IMT":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','UnsatThresholdPercent','MargThresholdPercent','OpMetricRating','UnsatThresholdPercentTR','MargThresholdPercentTR','MissedIssueColor'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent','UnsatThresholdPercentTR','MargThresholdPercentTR'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								// Update the doc if it comes from a merge conflict
								try {
									var newdoc = Object.assign({},global.userdoc); // Working document
									global.userdoc="";
									if(global.conflictfields[0]!=undefined) {
										data.doc[0].conflictfields = global.conflictfields;
										global.conflictfields="";
										data.doc[0].editmode = "1";
									}
									res.render('asmtbuimt', data.doc[0] );
								}catch(e){
									console.log(e.stack);
								}
								// end merge here
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][BUIMTassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][BUIMTassessment][getListParams] - " + err.error);
						})
						break;
					case "BU Country":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','UnsatThresholdPercent','MargThresholdPercent','OpMetricRating','UnsatThresholdPercentTR','MargThresholdPercentTR','MissedIssueColor'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent','UnsatThresholdPercentTR','MargThresholdPercentTR'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								// Update the doc if it comes from a merge conflict
								try {
									var newdoc = Object.assign({},global.userdoc); // Working document
									global.userdoc="";
									if(global.conflictfields[0]!=undefined) {
										data.doc[0].conflictfields = global.conflictfields;
										global.conflictfields="";
										data.doc[0].editmode = "1";
									}
								}catch(e){
									console.log(e.stack);
								}
								// end merge here
								res.render('asmtbucountry', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][BUCountryassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][BUCountryassessment][getListParams] - " + err.error);
						})
						break;
					case "Country Process":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','AuditLessonsLearnedFinding','OpMetricRating','UnsatThresholdPercent','MargThresholdPercent'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent'];

						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								// Update the doc if it comes from a merge conflict
								try {
									var newdoc = Object.assign({},global.userdoc); // Working document
									global.userdoc="";
									if(global.conflictfields[0]!=undefined) {
										data.doc[0].conflictfields = global.conflictfields;
										global.conflictfields="";
										data.doc[0].editmode = "1";
									}
								}catch(e){
									console.log(e.stack);
								}
								// end merge here
								res.render('asmtcountryprocess', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][CPassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][CPassessment][getListParams] - " + err.error);
						})
						break;
					case "Controllable Unit":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','AuditLessonsLearnedFinding','OpMetricRating','UnsatThresholdPercent','MargThresholdPercent'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								// Update the doc if it comes from a merge conflict
								try {
									var newdoc = Object.assign({},global.userdoc); // Working document
									global.userdoc="";
									if(global.conflictfields[0]!=undefined) {
										data.doc[0].conflictfields = global.conflictfields;
										global.conflictfields="";
										data.doc[0].editmode = "1";
									}
									res.render('asmtcontrollableunit', data.doc[0] );
								}catch(e){
									console.log(e.stack);
								}
								// end merge here
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][CUassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][CUassessment][getListParams] - " + err.error);
						})
						break;
					case "BU Reporting Group":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','UnsatThresholdPercent','MargThresholdPercent','OpMetricRating','UnsatThresholdPercentTR','MargThresholdPercentTR','MissedIssueColor'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent','UnsatThresholdPercentTR','MargThresholdPercentTR'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								// Update the doc if it comes from a merge conflict
								try {
									var newdoc = Object.assign({},global.userdoc); // Working document
									global.userdoc="";
									if(global.conflictfields[0]!=undefined) {
										data.doc[0].conflictfields = global.conflictfields;
										global.conflictfields="";
										data.doc[0].editmode = "1";
									}
								}catch(e){
									console.log(e.stack);
								}
								// end merge here
								res.render('asmtbureportinggroup', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][BUReportingGroupAssessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][BUReportingGroupAssessment][getListParams] - " + err.error);
						})
						break;
					case "Account":
					  var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','AuditLessonsLearnedFinding','OpMetricRating','UnsatThresholdPercent','MargThresholdPercent'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								// Update the doc if it comes from a merge conflict
								try {
									var newdoc = Object.assign({},global.userdoc); // Working document
									global.userdoc="";
									if(global.conflictfields[0]!=undefined) {
										data.doc[0].conflictfields = global.conflictfields;
										global.conflictfields="";
										data.doc[0].editmode = "1";
									}
									res.render('asmtaccount', data.doc[0] );
								}catch(e){
									console.log(e.stack);
								}
								// end merge here
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][AccountAssessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][AccountAssessment][getListParams] - " + err.error);
						})
						break;
				}
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[router][assessment] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[router][assessment] - " + err.error);
	})
});

/* Create new assesment document */
assessments.get('/newassessment', isAuthenticated, function(req, res) {
	assessment.newAsmtByPID(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				switch (data.doc[0].ParentDocSubType) {
					case "BU Reporting Group":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','UnsatThresholdPercent','MargThresholdPercent','OpMetricRating','UnsatThresholdPercentTR','MargThresholdPercentTR','MissedIssueColor'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent','UnsatThresholdPercentTR','MargThresholdPercentTR'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								res.render('asmtbureportinggroup', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][BUReportingGroupAssessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][BUReportingGroupAssessment][getListParams] - " + err.error);
						})
						break;
					case "BU IOT":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','UnsatThresholdPercent','MargThresholdPercent','OpMetricRating','UnsatThresholdPercentTR','MargThresholdPercentTR','MissedIssueColor'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent','UnsatThresholdPercentTR','MargThresholdPercentTR'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								res.render('asmtbuiot', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][BUIOTassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][BUIOTassessment][getListParams] - " + err.error);
						})
						break;
					case "BU IMT":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','UnsatThresholdPercent','MargThresholdPercent','OpMetricRating','UnsatThresholdPercentTR','MargThresholdPercentTR','MissedIssueColor'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent','UnsatThresholdPercentTR','MargThresholdPercentTR'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								res.render('asmtbuimt', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][BUIMTassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][BUIMTassessment][getListParams] - " + err.error);
						})
						break;
					case "BU Country":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','UnsatThresholdPercent','MargThresholdPercent','OpMetricRating','UnsatThresholdPercentTR','MargThresholdPercentTR','MissedIssueColor'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent','UnsatThresholdPercentTR','MargThresholdPercentTR'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								res.render('asmtbucountry', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][BUCountryassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][BUCountryassessment][getListParams] - " + err.error);
						})
						break;
					case "Account":
						var	lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','AuditLessonsLearnedFinding','OpMetricRating','UnsatThresholdPercent','MargThresholdPercent'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								res.render('asmtaccount', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][NewAccountAssessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][NewAccountAssessment][getListParams] - " + err.error);
						})
						break;
				}
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[router][assessment] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[router][assessment] - " + err.error);
	})
});

/* Save Assessment document */
assessments.post('/saveasmt', isAuthenticated, function(req, res){
	assessment.saveAsmt(req, db).then(function(data) {
		if(data.status==999) {
			try {
				global.userdoc = data.userdoc;
				global.conflictfields = data.conflictfields;
				res.redirect('/assessment?id=' + data.id + "&edit");
			}catch(e){
				console.log(e.stack);
			}
		} else {
			var close = req.body.close;
			if(data.status==200 & !data.error) {
				if(close=='1') {
					res.redirect('/assessableunit?id='+ data.parentid);
				} else {
					res.redirect('/assessment?id=' + data.id + "&edit");
				}
			} else {
				res.render('error',{errorDescription: data.error});
				console.log("[router][assessments][saveasmt] - " + data.error);

			}
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[router][assessments][saveasmt] - " + err.error);
	})

});

module.exports = assessments;
