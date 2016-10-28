var express = require("express");
var asmtComponents = express.Router();
var isAuthenticated = require('./router-authentication.js');
var db = require('./js/class-conn.js');
var components = require('./js/class-asmtComponents.js');


/* Control Sample */
asmtComponents.get('/controlsample', isAuthenticated, function(req, res) {
	if(typeof req.query.id === "undefined"){
	req.query.id = "9d9902492259ecc30230af749b1c2a06";
}
	components.getControl(req, db).then(function(data){
			res.render('controlsample', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][controlsample] - " + err.error);
	});
});

/* Open Issue */
asmtComponents.get('/openissue', isAuthenticated, function(req, res) {
	if(typeof req.query.id === "undefined"){
	req.query.id = "1caba93791bd9eeb006a97bd03324f8f";
}
	components.getIssue(req, db).then(function(data){
			res.render('openissue', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][openissue] - " + err.error);
	});
});
/* PPR */
asmtComponents.get('/ppr', isAuthenticated, function(req, res) {
	if(typeof req.query.id === "undefined"){
	req.query.id = "a75108a8b64db30c0f47722a78a100b8";
}
	components.getPPR(req, db).then(function(data){
			res.render('ppr', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][ppr] - " + err.error);
	});
});

/* Save Open Issue in cloudant */
asmtComponents.post('/saveopenissue', isAuthenticated, function(req, res) {
	components.saveOverride(req, db).then(function(data) {

		if(data.status==200 & !data.error) {

				res.redirect('/openissue?id='+data.data.id);

		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][openissue] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][openissue] - " + err.error);
	});
});

/* Save PPR in cloudant */
asmtComponents.post('/saveppr', isAuthenticated, function(req, res) {
	components.savePPR(req, db).then(function(data) {
		if(data.status==200 & !data.error) {

				res.redirect('/ppr?id='+data.data.id);

		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][openissue] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][openissue] - " + err.error);
	});
});


module.exports = asmtComponents;
