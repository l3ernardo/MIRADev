var express = require("express");
var assessableUnits = express.Router();
var db = require('./js/class-conn.js');
// Add functionalities from other JS files
var assessableunit = require('./js/class-assessableunit.js');
var parameter = require('./js/class-parameter.js');
var isAuthenticated = require('./router-authentication.js');
var utility = require('./js/class-utility.js');
var aureq = require('./js/class-auvalidation.js');

/**************************************************************
ASSESSABLE UNITS
***************************************************************/
/* Display assessable unit document */
assessableUnits.get('/assessableunit', isAuthenticated, function(req, res) {
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
					case "Sub-process":
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
									console.log("[router][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[router][assessableunit][getListParams] - " + err.error);
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
									console.log("[router][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[router][assessableunit][getListParams] - " + err.error);
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
									console.log("[router][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[router][assessableunit][getListParams] - " + err.error);
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
									console.log("[router][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[router][assessableunit][getListParams] - " + err.error);
							})
						} else {
							res.render('aucountryprocess', data.doc[0] );
						}
						break;
					case "Controllable Unit":
						if (data.doc[0].editmode) {
							var lParams;
							if (req.session.businessunit == "GTS") lParams = ['GTSMetrics', 'UnitSizes','ARCFrequencies','GTSAuditPrograms'];
							else lParams = ['GBSMetrics', 'UnitSizes','ARCFrequencies','GBSAuditPrograms','GBSOpMetricKeysCU'];
							parameter.getListParams(db, lParams).then(function(dataParam) {
								if(dataParam.status==200 & !dataParam.error) {
									data.doc[0].parameters = dataParam.parameters;
									res.render('aucontrollableunit', data.doc[0] );
								} else {
									res.render('error',{errorDescription: data.error});
									console.log("[router][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[router][assessableunit][getListParams] - " + err.error);
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
									console.log("[router][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[router][assessableunit][getListParams] - " + err.error);
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
									console.log("[router][assessableunit][getListParams] - " + dataParam.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[router][assessableunit][getListParams] - " + err.error);
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
			console.log("[router][assessableunit] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[router][assessableunit] - " + err.error);
	})
});

/* Create New assessable unit document */
assessableUnits.get('/newassessableunit', isAuthenticated, function(req, res) {
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
								console.log("[router][newassessableunit][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][newassessableunit][getListParams] - " + err.error);
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
								console.log("[router][newassessableunit][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][newassessableunit][getListParams] - " + err.error);
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
								console.log("[router][newassessableunit][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][newassessableunit][getListParams] - " + err.error);
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
								console.log("[router][newassessableunit][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][newassessableunit][getListParams] - " + err.error);
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
								console.log("[router][newassessableunit][getListParams] - " + dataParam.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][newassessableunit][getListParams] - " + err.error);
						})
						break;
				}

			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[router][newassessableunit] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[router][newassessableunit][newAUbyPID] - " + err.error);
	})
});

/* Save BU assessable unit document */
assessableUnits.post('/savebuau', isAuthenticated, function(req, res){
	aureq.validate(req);
	if (!aureq.validation.status) {
		res.render('error',{errorDescription: aureq.validation.message.join()});
		console.log("[router][savebuau] - " + aureq.validation.message.join());
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
									console.log("[router][savebuau][getassessableunitbyID] - " + data.error);
								}
							}).catch(function(err) {
								res.render('error',{errorDescription: err.error});
								console.log("[router][savebuau][getassessableunitbyID] - " + err.error);
							});
							// res.render('aubusinessunit', data.body );
						} else {
							res.render('error',{errorDescription: dataF.error});
							console.log("[router][savebuau][updateFilesParentID] - " + dataF.error);
						}
					}).catch(function(err) {
						console.log("[router][savebuau] - " + err.error);
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
								console.log("[router][savebuau][getassessableunitbyID] - " + data.error);
							}
						}).catch(function(err) {
							res.render('error',{errorDescription: err.error});
							console.log("[router][savebuau][getassessableunitbyID] - " + err.error);
						});
						// res.render('aubusinessunit', data.body );
					} else {
						res.render('error',{errorDescription: dataF.error});
						console.log("[router][savebuau] - " + dataF.error);
					}
				}
			} else {
				res.render('error',{errorDescription: data.error});
				console.log("[router][savebuau] - " + data.error);
			}
		}).catch(function(err) {
			res.render('error',{errorDescription: err.error});
			console.log("[router][savebuau] - " + err.error);
		})
	}

});

module.exports = assessableUnits;
