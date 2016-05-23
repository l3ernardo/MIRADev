var express = require("express");
var passport = require('passport');
var router = express.Router();
var fs = require('fs');
var app = express();
var middleware = require('../lib/middleware.js')(passport);
var bluegroup = require('../lib/bluegroups.js');
var q  = require("q");
var db = require('../../conn.js');
var moment = require('moment');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get('/', function(req, res) {
	res.render('login');
});

router.get('/login', function(req, res) {
	var message= req.flash('error');
	if (message=='Missing credentials'){
		message='IBM Intranet ID and/or password is required';
	}
	else if (message=='Invalid username/password'){
		message='Wrong IBM Intranet ID and/or password.';  
	}
	res.render('login',{message});
	//res.render('login',{message});
	/*res.render('login',{
	message: req.flash('error'),
	user:req.user
	})  */
});

router.post('/login',middleware.urlEncodedParser,middleware.passport.authenticate('ldapauth' , { failureRedirect: '/login',failureFlash: true}),function (req,res){
	if(req.user.hasAccess) {
		console.log("[BG NAME]: " + bluegroup.bgname);
		req.session.user = req.user;
		req.session.isAuthenticated = true;
		req.session.BG = req.user.groupName;
		console.info("[routes][login] - roles: " + req.user.groupName);
		//res.render('index');
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
//***************************************************
//Logout
router.get('/logout', function(req, res) {
	req.logout();
	req.session.user = null;
	req.session.isAuthenticated = null;
	res.render('login');
});


router.get('/index', function(req, res) {
  if(req.session.isAuthenticated){
      res.render('index', { siteIndex:'' });
  }
  else{
	console.info('[INFO] User not authenticated!!! Redirecting to login page.');
	res.render('login');
	}
});

router.get('/variable', function (req, res, next) {
    res.render('variable', {
        //title: 'MSAC Integrated Reporting Application lei',
        user: {
            firstname: 'Gabriela',
            lastname: 'Pailiacho',
            email: 'gsoledad@br.ibm.com'
        }
    }
    );
});

router.get('/calendars', function(req, res, next) {
  res.render('calendars', { siteIndex:'Test Wendy' });
});

//get setup
router.get('/setup', function(req, res, next) {
	//res.render('setup', { siteIndex:'' });
	db.view('setup', 'view-setup', {include_docs: true}).then(function(data) {
		var len = data.body.rows.length;
		if ( len > 0 ) {
			var varMenu = "";
			var varBU = "";
			for (var i = 0; i < len; i++) {
				var exist = data.body.rows[i].doc;
				if (exist.keyName == 'Menu'){
					varMenu = "exist";
				}
				else if(exist.keyName == 'BusinessUnit') {
					varBU = "exist";
				}
			}
			if (varMenu == "" || varBU == "") {
				console.info("[routes][setup] - menu: " + varMenu + " businnessUnit: " + varBU);
				res.render('setup');
			}
			else{
				res.redirect('index');
			}
		} 
		else {
			console.info("[routes][setup] - There are no needed parameters");
			res.render('setup');
		}	
	}).catch(function(err) {
		console.log("[routes][setup] - " + err);
	});
}); 
//save setup data into db
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
		}).catch(function(error){
			console.log("[routes][saveSetup] - " + error);
		});
	}).catch(function(error){
		console.log("[routes][saveSetup] - " + error);
	});

	res.redirect('index');
});
//load data from db and show in event window
router.get('/loadSetup', function(req, res) {
	db.view('setup', 'view-setup', {include_docs: true}).then(function(data){
		var len = data.body.rows.length;
		var keyName = req.query.keyName;
		var value = [];
		keyNameM = varConf.keyNameM;
		keyNameBU = varConf.keyNameBU;
		console.log(keyNameM);
		console.log(keyNameBU);
		console.log("[routes] data length one: " + len);
		if ( len > 0 ) {
			for (var i = 0; i < len; i++) {
				var doc = data.body.rows[i].doc;
				if (keyNameM == data.body.rows[i].doc.keyName || keyNameBU == data.body.rows[i].doc.keyName){
					console.log("exist " + data.body.rows[i].doc.keyName);
					value.push(data.body.rows[i].doc);
				}
			}
		}
		res.send(value);
	}).catch(function(err) {
		console.log(err);
	});
}); 
//load data from db and show in event window
router.get('/getParam', function(req, res) {
	db.view('setup', 'view-setup', {include_docs: true}).then(function(data){
		var len = data.body.rows.length;
		var keyName = req.query.keyName;
		var value;
		
		console.log("[routes] data length: " + len);
		if ( len > 0 ) {
			for (var i = 0; i < len; i++) {
				var doc = data.body.rows[i].doc;
				//console.log("exist.keyName: " + exist.keyName);
				if (doc.keyName == keyName){
					value = doc.value;
				}
			}
		}
		res.send(value);
	}).catch(function(err) {
		console.log("[routes][getParam] - " + err);
	});
});
//Load parameters 
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
			error = 'There is no data in database. Add a new data to database.';
		}
	}).catch(function(error){ //dbView catch
		//res.json(error);
		res.render('error.hbs', {
			errortitle: "error  "
		});
	});
});
//load data from db and show in event window
router.get('/loadParam', function(req, res) {
	db.view('setup', 'view-setup', {include_docs: true}).then(function(data){
		var len = data.body.rows.length;
		var doc;
		//console.log("req.query.id: " + req.query.id);
		if (len > 0) {
			for (var i = 0; i < len; i++) {
				var myDoc = data.body.rows[i].doc;
				//console.log("myDoc.keyName: " + myDoc.keyName);
				if (myDoc._id == req.query.id) {
					//console.log("myDoc._id == req.query.id");
					doc = myDoc;
				}
			}
			res.send(doc);
		}
	}).catch(function(err) {
		console.log("[routes][loadParam] - " + err);
	});
});
//save param in db
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
	}).catch(function(error){
		console.log("[routes][saveParam] - " + error);
	});
	res.redirect('/parameter');
})


module.exports = router;
