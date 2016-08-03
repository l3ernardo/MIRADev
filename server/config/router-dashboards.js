var express = require("express");
var dashboards = express.Router();
var db = require('./js/class-conn.js');
// Add functionalities from other JS files
var assessableunit = require('./js/class-assessableunit.js');
var parameter = require('./js/class-parameter.js');
var isAuthenticated = require('./router-authentication.js');

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
					case "BU IOT":
						res.render('aubuiot', data.doc[0]);
						break;
					case "BU IMT":
						res.render('aubuimt', data.doc[0]);
						break;
					case "BU Country":
						res.render('aubucountry', data.doc[0]);
						break;
					case "Country Process":
						res.render('aucountryprocess', data.doc[0] );
						break;
					case "Controllable Unit":
						var lParams = ['Metrics', 'UnitSizes', 'CUTypes', 'SupportedFrom'];
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

						break;
					case "BU Reporting Group":
						res.render('aureportinggroup', data.doc[0] );
						break;
					case "Account":
						res.render('auaccount', data.doc[0] );
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
	assessableunit.saveAUBU(req, db).then(function(data) {
		req.query.id = req.body.docid;
		var close = req.body.close;
		if(data.status==200 & !data.error) {
			if(data.body) {
				assessableunit.getAUbyID(req, db).then(function(data) {
					if(data.status==200 & !data.error) {
						if(data.doc) {
							if(close=='1') {
								res.redirect('/processdashboard');
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
				res.render('error',{errorDescription: data.error});
				console.log("[routes][savebuau] - " + data.error);
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][savebuau] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][savebuau] - " + err.error);
	})

});

module.exports = dashboards;
