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
		console.log("[routes][reportaufile] - " + err.error);
	})
	
});
/* Load report controllable unit file page*/
reports.get('/reportcufile', isAuthenticated, function(req, res) {
	report.controllableunitfile(req, db).then(function(data){
		if(data.status=="200" & !data.error){
			res.render('reportcufile', data);
		}
		else{
			res.render('error',{errorDescription: data.error});
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][reportcufile] - " + err.error);
	})
	
});
/* Load report status exceptions file page*/
reports.get('/reportstaexc', isAuthenticated, function(req, res) {
	report.statusexception(req, db).then(function(data){
		if(data.status=="200" & !data.error){
			res.render('reportstaexc', data);
		}
		else{
			res.render('error',{errorDescription: data.error});
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][reportstaexc] - " + err.error);
	})
	
});
/* Load report auditable unit file page*/
reports.get('/reportaudunifile', isAuthenticated, function(req, res) {
	report.audunifiles(req, db).then(function(data){
		if(data.status=="200" & !data.error){
			res.render('reportaudunifile', data);
		}
		else{
			res.render('error',{errorDescription: data.error});
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][reportaudunifile] - " + err.error);
	})
	
});
/* Load report CU audit lessons learned file page*/
reports.get('/reportcuauditlessons', isAuthenticated, function(req, res) {
	report.cuauditlessonslearned(req, db).then(function(data){
		if(data.status=="200" & !data.error){
			res.render('reportcuauditlessons',data);
		}
		else{
			res.render('error',{errorDescription: data.error});
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][reportcuauditlessons] - " + err.error);
	})
	
});
module.exports = reports;