var express = require("express");
var passport = require('passport');
var security = express.Router();
var middleware = require('../lib/middleware.js')(passport);
var bluegroup = require('../lib/bluegroups.js');
var varConf = require('../../configuration');
var isAuthenticated = require('./router-authentication.js');

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
		// Store the initial url
		if(req.session.returnTo=='')	req.session.returnTo = req.flash('url');
		// Store only required user parameters
		req.session.user = { uid : req.user.uid, cn:req.user.cn, groupName: req.user.groupName, mail:req.user.mail};
		
		var userID = req.session.user.cn;
		if(userID[0].length > 1)	userID = userID[0];
		req.session.user.notesId = userID;
		req.session.isAuthenticated = true;
		req.session.BG = req.user.groupName;
		req.session.businessunit = "";
		console.log("[USER] - " + req.session.user.notesId);
		console.log("[BG NAME]: " + req.user.groupName);
		res.redirect('setup');
	}else{
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
