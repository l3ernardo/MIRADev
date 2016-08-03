var express = require("express");
var passport = require('passport');
var administration = express.Router();
var app = express();
var db = require('./js/class-conn.js');
var varConf = require('../../configuration');

// Add functionalities from other JS files
var parameter = require('./js/class-parameter.js');
var setup = require('./js/class-setup.js');
var isAuthenticated = require('./router-authentication.js');
var simpleAuthentication = require('./router-simpleAuthentication.js');

/**************************************************************
SETUP FUNCTIONALITY
***************************************************************/
/* Setup will validate if required parameters were created */
administration.get('/setup', isAuthenticated, function(req, res, next){
	setup.getSetup(req, db, varConf.keyNameM, varConf.keyNameBU).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.numDocs < 2) {
				res.render('setup', data.setup[0]);
			} else {
				res.redirect('disclosure');
			}
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[routes][setup] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][setup] - " + err.error);
	})
});
/* Save setup parameters in cloudant */
administration.post('/saveSetup', isAuthenticated, function(req, res){
	setup.saveSetup(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('index');
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][saveSetup] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][saveSetup] - " + err.error);
	})
});

/**************************************************************
PARAMETERS FUNCTIONALITY
***************************************************************/
/* Load all parameters in view*/
administration.get('/parameter', isAuthenticated, function(req, res){
	parameter.listParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.render('parameters', data.parameters )
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][parameter] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][parameter] - " + err.error);
	})
});
/* Save parameter in cloudant */
administration.post('/saveParam', isAuthenticated, function(req, res) {
	parameter.saveParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('/parameter');
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][saveParam] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][saveParam] - " + err.error);
	})

});
administration.get('/getParam', isAuthenticated, function(req, res) {
	parameter.getParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send( data.doc );
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][getParam] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][getParam] - " + err.error);
	})
});
/* Get parameter by keyName */
administration.get('/getParameter', simpleAuthentication, function(req, res) {
	parameter.getParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.doc.value);
		} else {
			res.render('error',{errorDescription: data.error});
			//console.log("[routes][getParameter] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		//console.log("[routes][getParameter] - " + err.error);
	})
});
/* Load test for list of parameter */
administration.get('/getListParams', isAuthenticated, function(req, res) {
	var lParams = ['Metrics', 'UnitSizes'];
	parameter.getListParams(req, db, lParams).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send( data.parameters.Metrics );
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][getListParams] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][getListParams] - " + err.error);
	})
});

module.exports = administration;
