var express = require("express");
var reports = express.Router();
var db = require('./js/class-conn.js');

// Add functionalities from other JS files
var report = require('./js/class-report.js');
var isAuthenticated = require('./router-authentication.js');

/**************************************************************
REPORTS
***************************************************************/
/* Load report assessable unit file page*/
reports.get('/reportaufile', isAuthenticated, function(req, res) {
	report.assessableunitfile(req, db).then(function(data){
		if(data.status=="200" & !data.error){
			res.render('reportaufile', data);
		}
		else{
			res.render('error',{errorDescription: data.error});
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][disclosure] - " + err.error);
	})
	
});

module.exports = reports;