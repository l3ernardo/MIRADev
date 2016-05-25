var express = require("express");
var passport = require('passport');
var router = express.Router();
var app = express();
var middleware = require('../lib/middleware.js')(passport);
var bluegroup = require('../lib/bluegroups.js');
var q  = require("q");
var db = require('../../conn.js');
var varConf = require('../../configuration');

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
		//Redirect to setup
		res.redirect('setup');
	}
	else {
		console.log("[routes][login] - Access Denied");
		req.logout();
		req.session.user = null;
		req.session.isAuthenticated = null;
		//res.redirect('./login');
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
router.get('/index', function(req, res) {
	if(req.session.isAuthenticated){
		res.render('index', { siteIndex:'' });
	}
	else{
		console.info('[INFO] User not authenticated!!! Redirecting to login page.');
		res.render('login');
	}
});
/**************************************************************
SETUP FUNCTIONALITY
***************************************************************/
/* Setup will validate if required parameters were created */
router.get('/setup', function(req, res, next){
	var keyNameM = varConf.keyNameM;
	var keyNameBU = varConf.keyNameBU;
	var obj = {
		selector:{
			"_id": {"$gt":0},
			"keyName": {
					"$in": [keyNameBU, keyNameM]
				}
		}
	};
	db.find(obj).then(function(data){
		var numDocs = data.body.docs.length;
		if(numDocs <= 2) {
			res.render('setup');
		}
		else{
			res.redirect('index');
		}
	}).catch(function(err) {
		console.log("[routes][setup] - " + err.error);
	});
}); 
/* Load needed parameters data in setup page */
router.get('/loadSetup', function(req, res, next){
	var keyNameBU = varConf.keyNameBU;
	var keyNameM = varConf.keyNameM;
	var obj = {
		selector:{
			"_id": {"$gt":0},
			"keyName": {
					"$in": [keyNameBU, keyNameM]
				}
		}
	};
	db.find(obj).then(function(data){
		var numDocs = data.body.docs.length;
		var value = [];
		if(numDocs <= 2) {
			for(var i = 0; i < numDocs; i++) {
				var doc = data.body.docs[i];
				if(doc.keyName == keyNameBU || doc.keyName == keyNameM){
					value.push(data.body.docs[i]);
				}
			}
			res.send(value);
		}
		else{
			res.redirect('index');
		}
	}).catch(function(err) {
		console.log("[routes][loadSetup] - " + err.error);
	});
});  
/* Save setup parameters in cloudant */
router.post('/saveSetup', function(req, res){
	var value1 = JSON.parse(req.body.fldvalue);
	var value2 = JSON.parse(req.body.fldvalueM);

	var obj1 = {
			"docType": "setup",
			"keyName": req.body.fldname,
			"active": req.body.fldtrue,
			"value": value1,
			"description": req.body.flddesc
	};

	if (req.body.idBU != '') {
		obj1._id = req.body.idBU;
		obj1._rev = req.body.revBU;
	}

	var obj2 = {
			"docType": "setup",
			"keyName": req.body.fldnameM,
			"active": req.body.fldtrueM,
			"value": value2,	
			"description": req.body.flddescM
	};

	if (req.body.idCM != '') {
		obj2._id = req.body.idCM;
		obj2._rev = req.body.revCM;
	}

	db.save(obj1).then(function(data1){
		console.log("obj1 saved successfully");
		
		db.save(obj2).then(function(data2){
			console.log("obj2 saved successfully");
		}).catch(function(err){
			console.log("[routes][saveSetup] - " + err.error);
		});
	}).catch(function(err){
		console.log("[routes][saveSetup] - " + err.error);
	});

	res.redirect('index');
});
/**************************************************************
PARAMETERS FUNCTIONALITY
***************************************************************/
/* Load all parameters in view*/
router.get('/parameter', function(req, res){
	db.view('setup', 'view-setup', {include_docs: true}).then(function(data) {
		var len = data.body.rows.length;
		//if DB contains data, then list it
		if(len > 0){ 
			totalLog = len;
			pageSize = 20;
			pageCount = Math.ceil(totalLog/pageSize);
			currentPage = 1;
			log = [];
			logArray = [];
			logList = [];
			//generate list of parameters
			for (var i = 0; i < totalLog; i++) {
			//console.log(data.body.rows[i].doc)
				log.push({
					id: data.body.rows[i].doc._id,
					keyName: data.body.rows[i].doc.keyName,
					active: data.body.rows[i].doc.active, 
					description: data.body.rows[i].doc.description
				});
			}
			//split list into groups
			while (log.length > 0) {
				logArray.push(log.splice(0, pageSize));
			}
			//set current page if specifed as get variable (eg: /?page=2)
			if (typeof req.query.page !== 'undefined') {
				currentPage = +req.query.page;
			}
			//show list of parameters from group
			logList = logArray[+currentPage - 1];
			//render log.ejs page
			res.render('parameters.hbs', {
				logList: logList,
				pageSize: pageSize,
				totalLog: totalLog,
				pageCount: pageCount,
				currentPage: currentPage
			});
		}else{
			//if there is no data in the DB, then redirects to addnew form
			// This code get the error description to configuration.js ( error of db )
			res.render('error.hbs', {
				errorDescription: varConf.error_500,
				errorCode: 501
			});
		}
	}).catch(function(error){ //dbView catch
		//res.json(error);
		res.render('error.hbs', {
			errortitle: "error  "
		});
	});
});
/* Load specific parameter data */
router.get('/loadParam', function(req, res) {
	var obj = {
		selector : {
			"_id": req.query.id
	}};
	db.find(obj).then(function(data){
		var doc = data.body.docs[0];
		res.send(doc);
	}).catch(function(err) {
		console.log("[routes][loadParam] - " + err.error);
		// This code get the error description to configuration.js ( error of db )
		res.render('error.hbs', {
			errorDescription: varConf.error_501,
			errorCode: 501
		});
	});
});
/* Save parameter in cloudant */
router.post('/saveParam', function(req, res) {
	var value = JSON.parse(req.body.fldvalue);
	var obj = {
		"docType": "setup",
		"keyName": req.body.fldname,
		"active": req.body.fldtrue,
		"value": value,
		"description": req.body.flddesc
	};
	if (req.body.id != '') {
		obj._id = req.body.id;
		obj._rev = req.body.rev;
	}
	db.save(obj).then(function(data){
		console.log("obj saved successfully");
	}).catch(function(err){
		console.log("[routes][saveParam] - " + err.error);
	});
	res.redirect('/parameter');
});

/* Get parameter by keyName */
router.get('/getParameter', function(req, res) {
	var obj = {
		selector : {
			"_id": {"$gt":0},
			keyName: req.query.keyName
	}};
	db.find(obj).then(function(data){
		var doc = data.body.docs[0];
		var value = doc.value;
		res.send(value);
	}).catch(function(err) {
		console.log("[routes][getParam] - " + err.error);
	});
});
/**************************************************************
ERROR FUNCTIONALITY
***************************************************************/
/* Read data from db and show the error in error form */
router.get('/loadError', function(req, res) {
	console.log("[loadError] int to loadError: ");
	var errorCode = req.query.errorCode;

	db.view('setup', 'view-setup', {include_docs: true}).then(function(data){
		var len = data.body.rows.length;
		var errorDescription;
		
		//console.log("len: " + len);
		//console.log("errorCode: " + errorCode);
		
		for (var i = 0; i < len; i++) {
			var exist = data.body.rows[i].doc;
			var keyNameE = exist.keyName;
			//console.log("keyNameE: " + keyNameE);
			if (keyNameE == "ErrorCodes") {
				var errors = exist.value;
				var lenErrors = errors.length;
	
				//console.log("errors: " + errors[0].id);

				for (var j = 0; j < lenErrors; j++) {
					if (errorCode == errors[j].id) {
						errorDescription = errors[j].description;
						//console.log("errorDescription: " + errorDescription);
						res.render('error.hbs', {errorDescription: errorDescription})

					}
				}
				
			}
		}
	}).catch(function(err) {
			//console.log(err);
			// This code get the error description to configuration.js ( error of db )
		res.render('error.hbs', {
			errorDescription: varConf.error_500,
			errorCode: 500
		});
	});
});

module.exports = router;
