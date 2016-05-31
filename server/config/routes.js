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
var dialog = require('./dialog.js');
var businessunit = require('./businessunit.js');

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
		req.session.businessunit = "";
		res.redirect('setup');
	}
	else {
		console.log("[routes][login] - Access Denied");
		req.logout();
		req.session.user = null;
		req.session.isAuthenticated = null;
		req.session.businessunit = null;
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
	console.info('[routes][index]');
	res.render('index')
});

/* Bulletin page displayed */
router.get('/bulletin', isAuthenticated, function(req, res) {
	console.info('[routes][bulletin]');
	res.render('bulletin')
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
router.get('/loadSetup', isAuthenticated, function(req, res, next){
	setup.getSetup(req,res, db, varConf.keyNameM, varConf.keyNameBU).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.value)
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[routes][loadsetup] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][loadsetup] - " + err.error);
	})
});  
/* Save setup parameters in cloudant */
router.post('/saveSetup', isAuthenticated, function(req, res){
	setup.saveSetup(req,res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('index');
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[routes][saveSetup] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][saveSetup] - " + err.error);
	})
});
/**************************************************************
LOAD HEADER FUNCTIONALITY
***************************************************************/
router.get('/name', isAuthenticated, function(req, res) {
	if (req.session.user != undefined)
		return res.json({ uname: req.session.user.cn });
	else
		return res.json({ uname: '' });
});
/**************************************************************
DISCLOSURE FUNCTIONALITY
***************************************************************/
/* Disclosure screen */
router.get('/disclosure', function(req, res) {
	dialog.displayNonDisclosure(req, res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				res.render('disclosure', {disclosure: JSON.stringify(data.doc[0].value.Message,null,'\\')} );
			} else {
				es.render('error',{errorDescription: data.error})
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
/**************************************************************
BUSINESS UNIT FUNCTIONALITY
***************************************************************/
/* List Business Unit */
router.get('/businessunit', isAuthenticated, function(req, res){
	res.render('businessunit');
});
/* Save Business Unit */
router.post('/savebunit', isAuthenticated, function(req, res){
	businessunit.saveBU(req,res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			req.session.businessunit = data.bunit;
			// Control the bulletin message to be displayed
			dialog.displayBulletin(req, res, db).then(function(data) {
				if(data.status==200 & !data.error) {
						if(data.doc) {
							res.render('bulletin', {bulletin: JSON.stringify(data.doc[0].value.Message,null,'\\')});
						} else {
							res.render('index',{siteIndex:''})
						}
					} else {
						res.render('index',{siteIndex:''})
					}
				}).catch(function(err) {
					res.render('index',{siteIndex:''})
				})				
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[routes][businessunit] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][businessunit] - " + err.error);
	})
});

/**************************************************************
PARAMETERS FUNCTIONALITY
***************************************************************/
/* Load all parameters in view*/
router.get('/parameter', isAuthenticated, function(req, res){
	parameter.listParam(req,res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.render('parameters', data.parameters )
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[routes][parameter] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][parameter] - " + err.error);
	})
});
/* Load specific parameter data */
router.get('/getParam', isAuthenticated, function(req, res) {
	parameter.getParam(req,res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send( data.doc )
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[routes][getParam] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][getParam] - " + err.error);
	})
});
/* Save parameter in cloudant */
router.post('/saveParam', isAuthenticated, function(req, res) {
	parameter.saveParam(req,res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('/parameter');
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[routes][saveParam] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][saveParam] - " + err.error);
	})

});
/* Get parameter by keyName */
router.get('/getParameter',isAuthenticated, function(req, res) {
	parameter.getParam(req,res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.doc.value);
		} else {
			res.render('error',{errorDescription: data.error})
			//console.log("[routes][getParameter] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		//console.log("[routes][getParameter] - " + err.error);
	})
});

module.exports = router;
