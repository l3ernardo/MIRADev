var express = require("express");
var passport = require('passport');
var router = express.Router();
var app = express();
var db = require('../../conn.js');
var varConf = require('../../configuration');

// Add functionalities from other JS files
var dialog = require('./js/dialog.js');
var businessunit = require('./js/businessunit.js');


function isAuthenticated(req, res, next) {
	if (req.session.isAuthenticated)
        return next();
    res.redirect('/');
};

router.get('/', function(req, res) {
	res.render('login');
});
/* Index page displayed */
router.get('/index', isAuthenticated, function(req, res) {
	console.info('[routes][index]');
	res.render('index')
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
			console.log("[routes][disclosure] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][disclosure] - " + err.error);
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
BULLETIN FUNCTIONALITY
***************************************************************/
/* Bulletin page displayed */
router.get('/bulletin', isAuthenticated, function(req, res) {
	console.info('[routes][bulletin]');
	res.render('bulletin')
});

module.exports = router;
