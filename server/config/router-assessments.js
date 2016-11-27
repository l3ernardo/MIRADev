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
								res.render('asmtbusinessunit', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][GPassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][GPassessment][getListParams] - " + err.error);
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
								res.render('asmtglobalprocess', data.doc[0] );
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
								res.render('asmtsubprocess', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][GPassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][GPassessment][getListParams] - " + err.error);
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

					case "Country Process":
						var lParams;
						if (data.doc[0].editmode)
							lParams = ['PeriodRating','AssessmentStatus','NextQtrRating','AuditLessonsLearnedFinding','OpMetricRating','UnsatThresholdPercent','MargThresholdPercent'];
						else
							lParams = ['UnsatThresholdPercent','MargThresholdPercent'];

						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
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
								res.render('asmtcontrollableunit', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][CPassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][CPassessment][getListParams] - " + err.error);
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
								res.render('asmtaccount', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[router][CPassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][CPassessment][getListParams] - " + err.error);
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
		var close = req.body.close;
		if(data.status==200 & !data.error) {
			if(close=='1') {
				res.redirect('/assessableunit?id='+ data.parentid);
			} else {
				res.redirect('/assessment?id=' + data.id);
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[router][assessments][saveasmt] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[router][assessments][saveasmt] - " + err.error);
	})

});

module.exports = assessments;
