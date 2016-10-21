var express = require("express");
var dashboards = express.Router();
var db = require('./js/class-conn.js');
// Add functionalities from other JS files
var assessableunit = require('./js/class-assessableunit.js');
var assessment = require('./js/class-assessment.js');
var parameter = require('./js/class-parameter.js');
var isAuthenticated = require('./router-authentication.js');
var utility = require('./js/class-utility.js');
var aureq = require('./js/class-auvalidation.js');

/**************************************************************
ASSESSABLE UNITS - Business Unit type
***************************************************************/

/* View assessable unit documents */
dashboards.get('/processdashboard', isAuthenticated, function(req, res) {
	assessableunit.listAU(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				res.render('processdashboard', data );
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][processdashboard] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][processdashboard] - " + err.error);
	})
});
dashboards.get('/geodashboard', isAuthenticated, function(req, res) {
	assessableunit.listAU(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				res.render('geodashboard', data );
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][geodashboard] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][geodashboard] - " + err.error);
	})
});

dashboards.get('/reportingdashboard', isAuthenticated, function(req, res) {
	assessableunit.listAU(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				res.render('reportingdashboard', data );
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][reportingdashboard] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][reportingdashboard] - " + err.error);
	})
});

dashboards.get('/subprocessdashboard', isAuthenticated, function(req, res) {
	assessableunit.listAU(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				res.render('subprocessdashboard', data );
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][subprocessdashboard] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][subprocessdashboard] - " + err.error);
	})
});

/* Display BU assessable unit document */
dashboards.get('/assessableunit', isAuthenticated, function(req, res) {
	assessableunit.getAUbyID(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				switch (data.doc[0].DocSubType) {
					case "Business Unit":
						res.render('aubusinessunit', data.doc[0] );
						break;
					case "Global Process":
						res.render('auglobalprocess', data.doc[0] );
						break;
					case "Subprocess":
						res.render('ausubprocess', data.doc[0] );
						break;
					case "BU IOT":
						if (data.doc[0].editmode) {
							var lParams = ['AssessableUnitStatus'];
							parameter.getListParams(db, lParams).then(function(dataParam) {
								if(dataParam.status==200 & !dataParam.error) {
									data.doc[0].parameters = dataParam.parameters;
									res.render('aubuiot', data.doc[0] );
								} else {
									res.render('error',{errorDescription: data.error});
									console.log("[routes][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[routes][assessableunit][getListParams] - " + err.error);
							})
						} else {
							res.render('aubuiot', data.doc[0]);
						}
						break;
					case "BU IMT":
						if (data.doc[0].editmode) {
							var lParams = ['AssessableUnitStatus'];
							parameter.getListParams(db, lParams).then(function(dataParam) {
								if(dataParam.status==200 & !dataParam.error) {
									data.doc[0].parameters = dataParam.parameters;
									res.render('aubuimt', data.doc[0] );
								} else {
									res.render('error',{errorDescription: data.error});
									console.log("[routes][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[routes][assessableunit][getListParams] - " + err.error);
							})
						} else {
							res.render('aubuimt', data.doc[0]);
						}
						break;
					case "BU Country":
						if (data.doc[0].editmode) {
							var lParams = ['AssessableUnitStatus'];
							parameter.getListParams(db, lParams).then(function(dataParam) {
								if(dataParam.status==200 & !dataParam.error) {
									data.doc[0].parameters = dataParam.parameters;
									res.render('aubucountry', data.doc[0] );
								} else {
									res.render('error',{errorDescription: data.error});
									console.log("[routes][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[routes][assessableunit][getListParams] - " + err.error);
							})
						} else {
							res.render('aubucountry', data.doc[0]);
						}
						break;
					case "Country Process":
						if (data.doc[0].editmode) {
							var lParams;
							if (req.session.businessunit == "GTS") lParams = ['UnitSizes','GTSAuditPrograms'];
							else lParams = ['UnitSizes','GBSAuditPrograms'];
							parameter.getListParams(db, lParams).then(function(dataParam) {
								if(dataParam.status==200 & !dataParam.error) {
									data.doc[0].parameters = dataParam.parameters;
									res.render('aucountryprocess', data.doc[0] );
								} else {
									res.render('error',{errorDescription: data.error});
									console.log("[routes][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[routes][assessableunit][getListParams] - " + err.error);
							})
						} else {
							res.render('aucountryprocess', data.doc[0] );
						}
						break;
					case "Controllable Unit":
						if (data.doc[0].editmode) {
							var lParams;
							if (req.session.businessunit == "GTS") lParams = ['GTSMetrics', 'UnitSizes','ARCFrequencies','GTSAuditPrograms'];
							else lParams = ['GBSMetrics', 'UnitSizes','ARCFrequencies','GBSAuditPrograms'];
							parameter.getListParams(db, lParams).then(function(dataParam) {
								if(dataParam.status==200 & !dataParam.error) {
									data.doc[0].parameters = dataParam.parameters;
									res.render('aucontrollableunit', data.doc[0] );
								} else {
									res.render('error',{errorDescription: data.error});
									console.log("[routes][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[routes][assessableunit][getListParams] - " + err.error);
							})
						} else {
							res.render('aucontrollableunit', data.doc[0] );
						}
						break;
					case "BU Reporting Group":
						if (data.doc[0].editmode) {
							var lParams;
							if (req.session.businessunit == "GBS") lParams = ['GBSAuditPrograms','AssessableUnitStatus'];
							else lParams = ['AssessableUnitStatus'];
							parameter.getListParams(db, lParams).then(function(dataParam) {
								if(dataParam.status==200 & !dataParam.error) {
									data.doc[0].parameters = dataParam.parameters;
									res.render('aureportinggroup', data.doc[0] );
								} else {
									res.render('error',{errorDescription: data.error});
									console.log("[routes][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[routes][assessableunit][getListParams] - " + err.error);
							})
						} else {
							res.render('aureportinggroup', data.doc[0] );
						}
						break;
					case "Account":
						if (data.doc[0].editmode) {
							var lParams;
							if (req.session.businessunit == "GTS") lParams = ['GTSMetrics', 'AssessableUnitStatus'];
							else lParams = ['GBSMetrics', 'AssessableUnitStatus'];
							parameter.getListParams(db, lParams).then(function(dataParam) {
								if(dataParam.status==200 & !dataParam.error) {
									data.doc[0].parameters = dataParam.parameters;
									res.render('auaccount', data.doc[0] );
								} else {
									res.render('error',{errorDescription: data.error});
									console.log("[routes][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[routes][assessableunit][getListParams] - " + err.error);
							})
						} else {
							res.render('auaccount', data.doc[0] );
						}
						break;

				}
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][assessableunit] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][assessableunit] - " + err.error);
	})
});

/* Create New assessable unit document */
dashboards.get('/newassessableunit', isAuthenticated, function(req, res) {
	assessableunit.newAUbyPID(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				switch (data.doc[0].DocSubType) {
					case "BU IOT":
						var lParams = ['AssessableUnitStatus'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								res.render('aubuiot', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[routes][newassessableunit][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[routes][newassessableunit][getListParams] - " + err.error);
						})
						break;
					case "BU IMT":
						var lParams = ['AssessableUnitStatus'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								res.render('aubuimt', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[routes][newassessableunit][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[routes][newassessableunit][getListParams] - " + err.error);
						})
						break;
					case "BU Country":
						var lParams = ['AssessableUnitStatus'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								res.render('aubucountry', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[routes][newassessableunit][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[routes][newassessableunit][getListParams] - " + err.error);
						})
						break;
					case "BU Reporting Group":
						var lParams;
						if (req.session.businessunit == "GBS") lParams = ['GBSAuditPrograms','AssessableUnitStatus'];
						else lParams = ['AssessableUnitStatus'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								res.render('aureportinggroup', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[routes][newassessableunit][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[routes][newassessableunit][getListParams] - " + err.error);
						})
						break;
					case "Account":
						var lParams;
						if (req.session.businessunit == "GTS") lParams = ['GTSMetrics', 'AssessableUnitStatus'];
						else lParams = ['GBSMetrics', 'AssessableUnitStatus'];
						parameter.getListParams(db, lParams).then(function(dataParam) {
							if(dataParam.status==200 & !dataParam.error) {
								data.doc[0].parameters = dataParam.parameters;
								res.render('auaccount', data.doc[0] );
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[routes][newassessableunit][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[routes][newassessableunit][getListParams] - " + err.error);
						})
						break;
				}

			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][assessableunit] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][assessableunit] - " + err.error);
	})
});

/* Save BU assessable unit document */
dashboards.post('/savebuau', isAuthenticated, function(req, res){
	aureq.validate(req);
	if (!aureq.validation.status) {
		res.render('error',{errorDescription: aureq.validation.message.join()});
		console.log("[routes][savebuau] - " + aureq.validation.message.join());
	} else {
		assessableunit.saveAUBU(req, db).then(function(data) {
			req.query.id = data.body.id;
			var close = req.body.close;
			if(data.status==200 & !data.error) {
				//New document need to update attachments
				if(req.body.attachIDs != '' && req.body.docid == ""){
					utility.updateFilesParentID(data.body.id, req.body.attachIDs, db).then(function(dataF) {
						if(dataF.status==200 & !dataF.error && data.body) {
							assessableunit.getAUbyID(req, db).then(function(data) {
								if(data.status==200 & !data.error) {
									if(data.doc) {
										if(close!= 0) {
											res.redirect(close);
										} else {
											res.redirect('/assessableunit?id=' + data.doc[0]._id);
										}
									} else {
										res.render('error',{errorDescription: data.error});
									}
								} else {
									res.render('error',{errorDescription: data.error});
									console.log("[routes][getassessableunitbyID] - " + data.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[routes][getassessableunitbyID] - " + err.error);
							});
							// res.render('aubusinessunit', data.body );
						} else {
							res.render('error',{errorDescription: dataF.error});
							console.log("[routes][savebuau] - " + dataF.error);
						}
					}).catch(function(err) {
						console.log("[dashboards][savebuau] - " + err.error);
					});
				} else { //Old document doesn't need to update attachments
					if(data.body) {
						assessableunit.getAUbyID(req, db).then(function(data) {
							if(data.status==200 & !data.error) {
								if(data.doc) {
									if(close!= 0) {
											res.redirect(close);
									} else {
										res.redirect('/assessableunit?id=' + data.doc[0]._id);
									}
								} else {
									res.render('error',{errorDescription: data.error});
								}
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[routes][getassessableunitbyID] - " + data.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[routes][getassessableunitbyID] - " + err.error);
						});
						// res.render('aubusinessunit', data.body );
					} else {
						res.render('error',{errorDescription: dataF.error});
						console.log("[routes][savebuau] - " + dataF.error);
					}
				}
			} else {
				res.render('error',{errorDescription: data.error});
				console.log("[dashboards][savebuau] - " + data.error);
			}
		}).catch(function(err) {
			res.render('error',{errorDescription: err.error});
			console.log("[dashboards][savebuau] - " + err.error);
		})
	}

});

/* Display assesment document */
dashboards.get('/assessment', isAuthenticated, function(req, res) {
	assessment.getAsmtbyID(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				switch (data.doc[0].ParentDocSubType) {
					case "Business Unit":
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
								console.log("[routes][GPassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[routes][GPassessment][getListParams] - " + err.error);
						})
						break;

					case "Sub-process":
						break;

					case "BU IOT":
						break;

					case "BU IMT":
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
								console.log("[routes][BUCountryassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[routes][BUCountryassessment][getListParams] - " + err.error);
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
								console.log("[routes][CPassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[routes][CPassessment][getListParams] - " + err.error);
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
								console.log("[routes][CPassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[routes][CPassessment][getListParams] - " + err.error);
						})
						break;

					case "BU Reporting Group":
						break;

					case "Account":
						break;
				}
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][assessment] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][assessment] - " + err.error);
	})
});

/* Create new assesment document */
dashboards.get('/newassessment', isAuthenticated, function(req, res) {
	assessment.newAsmtByPID(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				switch (data.doc[0].DocSubType) {
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
								console.log("[routes][BUCountryassessment][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[routes][BUCountryassessment][getListParams] - " + err.error);
						})
						break;
				}
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][assessment] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][assessment] - " + err.error);
	})
});

/* Save Assessment document */
dashboards.post('/saveasmt', isAuthenticated, function(req, res){
	assessment.saveAsmt(req, db).then(function(data) {
		req.query.id = data.body.id;
		var close = req.body.close;
		if(data.status==200 & !data.error) {
			//New document need to update attachments
			if(req.body.attachIDs != '' && req.body.docid == ""){
				utility.updateFilesParentID(data.body.id, req.body.attachIDs, db).then(function(dataF) {
					if(dataF.status==200 & !dataF.error && data.body) {
						assessment.getAsmtbyID(req, db).then(function(data) {
							if(data.status==200 & !data.error) {
								if(data.doc) {
									if(close=='1') {
										res.redirect('/processdashboard');
									} else {
										res.redirect('/assessment?id=' + data.doc[0]._id);
									}
								} else {
									res.render('error',{errorDescription: data.error});
								}
							} else {
								res.render('error',{errorDescription: data.error});
								console.log("[routes][getassessmentbyID] - " + data.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[routes][getassessmentbyID] - " + err.error);
						});
					} else {
						res.render('error',{errorDescription: dataF.error});
						console.log("[routes][saveasmt] - " + dataF.error);
					}
				}).catch(function(err) {
					console.log("[dashboards][saveasmt] - " + err.error);
				});
			} else { //Old document doesn't need to update attachments
				if(data.body) {
					assessment.getAsmtbyID(req, db).then(function(data) {
						if(data.status==200 & !data.error) {
							if(data.doc) {
								if(close=='1') {
									res.redirect('/processdashboard');
								} else {
									res.redirect('/assessment?id=' + data.doc[0]._id);
								}
							} else {
								res.render('error',{errorDescription: data.error});
							}
						} else {
							res.render('error',{errorDescription: data.error});
							console.log("[routes][getassessmentbyID] - " + data.error);
						}
					}).catch(function(err) {
						res.render('error',{errorDescription: err.error});
						console.log("[routes][getassessmentbyID] - " + err.error);
					});
				} else {
					res.render('error',{errorDescription: dataF.error});
					console.log("[routes][saveasmt] - " + dataF.error);
				}
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[dashboards][saveasmt] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[dashboards][saveasmt] - " + err.error);
	})

});

module.exports = dashboards;
