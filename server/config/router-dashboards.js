var express = require("express");
var dashboards = express.Router();
var db = require('./js/class-conn.js');
// Add functionalities from other JS files
var assessableunit = require('./js/class-assessableunit.js');
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

module.exports = dashboards;
