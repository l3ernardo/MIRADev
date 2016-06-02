var express = require("express");
var passport = require('passport');
var administration = express.Router();
var app = express();
var db = require('../../conn.js');
var varConf = require('../../configuration');

// Add functionalities from other JS files
var parameter = require('./js/parameter.js');
var setup = require('./js/setup.js');


function isAuthenticated(req, res, next) {
	if (req.session.isAuthenticated)
        return next();
    res.redirect('/login');
};


/**************************************************************
SETUP FUNCTIONALITY
***************************************************************/
/* Setup will validate if required parameters were created */
administration.get('/setup', isAuthenticated, function(req, res, next){
	setup.listSetup(req,res, db, varConf.keyNameM, varConf.keyNameBU).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.numDocs < 2) {
				res.render('setup');
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

/* Load needed parameters data in setup page */
administration.get('/loadSetup', isAuthenticated, function(req, res, next){
	setup.getSetup(req,res, db, varConf.keyNameM, varConf.keyNameBU).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.value);
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][loadsetup] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][loadsetup] - " + err.error);
	})
});  
/* Save setup parameters in cloudant */
administration.post('/saveSetup', isAuthenticated, function(req, res){
	setup.saveSetup(req,res, db).then(function(data) {
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
	parameter.listParam(req,res, db).then(function(data) {
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
/* Load specific parameter data */
administration.get('/getParam', isAuthenticated, function(req, res) {
	parameter.getParam(req,res, db).then(function(data) {
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
/* Save parameter in cloudant */
administration.post('/saveParam', isAuthenticated, function(req, res) {
	parameter.saveParam(req,res, db).then(function(data) {
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
/* Get parameter by keyName */
administration.get('/getParameter',isAuthenticated, function(req, res) {
	parameter.getParam(req,res, db).then(function(data) {
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

module.exports = administration;
