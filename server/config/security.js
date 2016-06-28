var express = require("express");
var passport = require('passport');
var security = express.Router();
var middleware = require('../lib/middleware.js')(passport);
var bluegroup = require('../lib/bluegroups.js');
var varConf = require('../../configuration');
var isAuthenticated = require('./authentication.js');

/**************************************************************
LOGIN FUNCTIONALITY
***************************************************************/
/* Validate in Login page */
security.get('/login', function(req, res) {
	var message = req.flash('error');
	// Store the initial url
	if(typeof req.session.returnTo=='undefined') req.session.returnTo = req.flash('url');
	if(message == 'Missing credentials'){
		message = varConf.msgIdPassR;
	}
	else if(message == 'Invalid username/password'){
		message = varConf.msgIdPassW;  
	}
	res.render('login',{message});
});
/* Post Login function to validate user access and store in a session */
security.post('/login',middleware.urlEncodedParser,middleware.passport.authenticate('ldapauth' , { failureRedirect: '/login',failureFlash: true}),function (req,res){
	if(req.user.hasAccess) {
		console.log("[BG NAME]: " + req.user.groupName);
		// Store the initial url
		if(req.session.returnTo=='') req.session.returnTo = req.flash('url');
		req.session.user = req.user;
		req.session.isAuthenticated = true;
		req.session.BG = req.user.groupName;
		console.info("[routes][login] - roles: " + req.user.groupName);
		req.session.businessunit = "";
		res.redirect('setup');
	}
	else {
		//console.log("[routes][login] - Access Denied");
		req.logout();
		req.session.user = null;
		req.session.isAuthenticated = null;
		req.session.businessunit = null;
		res.render('login');
	}
});

/* Logout function to reset user session */
security.get('/logout', function(req, res) {
	req.logout();
	req.session.user = null;
	req.session.isAuthenticated = null;
	res.redirect('login');
});


module.exports = security;
