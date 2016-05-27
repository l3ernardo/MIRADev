var express = require("express");
var passport = require('passport');
var router = express.Router();
var app = express();
var middleware = require('../lib/middleware.js')(passport);
var bluegroup = require('../lib/bluegroups.js');
var q  = require("q");
var db = require('../../conn.js');
var varConf = require('../../configuration');

// Add functionalities from other JS files
var parameter = require('./parameter.js');
var setup = require('./setup.js');

/** Validate if the user is authenticated **/
function isAuthenticated(req, res, next) {
	if (req.session.isAuthenticated)
        return next();
    res.redirect('/');
};

router.get('/', function(req, res) {
	res.render('login');
});
/**************************************************************
LOGIN FUNCTIONALITY
***************************************************************/
/* Validate in Login page */
router.get('/login', function(req, res) {
	var message = req.flash('error');
	if(message == 'Missing credentials'){
		message = varConf.msgIdPassR;
	}
	else if(message == 'Invalid username/password'){
		message = varConf.msgIdPassW;  
	}
	res.render('login',{message});
});
/* Post Login function to validate user access and store in a session */
router.post('/login',middleware.urlEncodedParser,middleware.passport.authenticate('ldapauth' , { failureRedirect: '/login',failureFlash: true}),function (req,res){
	if(req.user.hasAccess) {
		console.log("[BG NAME]: " + bluegroup.bgname);
		req.session.user = req.user;
		req.session.isAuthenticated = true;
		req.session.BG = req.user.groupName;
		console.info("[routes][login] - roles: " + req.user.groupName);
		res.redirect('setup');
	}
	else {
		console.log("[routes][login] - Access Denied");
		req.logout();
		req.session.user = null;
		req.session.isAuthenticated = null;
		res.render('login');
	}
});
/* Logout function to reset user session */
router.get('/logout', function(req, res) {
	req.logout();
	req.session.user = null;
	req.session.isAuthenticated = null;
	res.render('login');
});

/* Index page displayed */
router.get('/index', isAuthenticated, function(req, res) {
	res.render('index', { siteIndex:'' });
});
/**************************************************************
SETUP FUNCTIONALITY
***************************************************************/
/* Setup will validate if required parameters were created */
router.get('/setup', isAuthenticated, function(req, res, next){
	setup.listSetup(req,res, db, varConf.keyNameM, varConf.keyNameBU).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.numDocs < 2) {
				res.render('setup');
			} else {
				res.redirect('index');
			}
		} else {
			res.render('error.hbs',{errorDescription: data.error})
			console.log("[routes][setup] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error.hbs',{errorDescription: err.error})
		console.log("[routes][setup] - " + err.error);
	})
}); 

/* Load needed parameters data in setup page */
router.get('/loadSetup', isAuthenticated, function(req, res, next){
	setup.getSetup(req,res, db, varConf.keyNameM, varConf.keyNameBU).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.value)
		} else {
			res.render('error.hbs',{errorDescription: data.error})
			console.log("[routes][loadsetup] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error.hbs',{errorDescription: err.error})
		console.log("[routes][loadsetup] - " + err.error);
	})
});  
/* Save setup parameters in cloudant */
router.post('/saveSetup', isAuthenticated, function(req, res){
	setup.saveSetup(req,res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('index');
		} else {
			res.render('error.hbs',{errorDescription: data.error})
			console.log("[routes][saveSetup] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error.hbs',{errorDescription: err.error})
		console.log("[routes][saveSetup] - " + err.error);
	})
});
/**************************************************************
PARAMETERS FUNCTIONALITY
***************************************************************/
/* Load all parameters in view*/
router.get('/parameter', isAuthenticated, function(req, res){
	parameter.listParam(req,res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.render('parameters.hbs', data.parameters )
		} else {
			res.render('error.hbs',{errorDescription: data.error})
			console.log("[routes][parameter] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error.hbs',{errorDescription: err.error})
		console.log("[routes][parameter] - " + err.error);
	})
});
/* Load specific parameter data */
router.get('/getParam', isAuthenticated, function(req, res) {
	parameter.getParam(req,res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send( data.doc )
		} else {
			res.render('error.hbs',{errorDescription: data.error})
			console.log("[routes][loadParam] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error.hbs',{errorDescription: err.error})
		console.log("[routes][loadParam] - " + err.error);
	})
});
/* Save parameter in cloudant */
router.post('/saveParam', isAuthenticated, function(req, res) {
	parameter.saveParam(req,res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('/parameter');
		} else {
			res.render('error.hbs',{errorDescription: data.error})
			console.log("[routes][saveParam] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error.hbs',{errorDescription: err.error})
		console.log("[routes][saveParam] - " + err.error);
	})

});
/* Get parameter by keyName */
router.get('/getParameter',isAuthenticated, function(req, res) {
	parameter.getParam(req,res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.doc.value);
		} else {
			res.render('error.hbs',{errorDescription: data.error})
			console.log("[routes][getParameter] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error.hbs',{errorDescription: err.error})
		console.log("[routes][getParameter] - " + err.error);
	})
});

module.exports = router;
