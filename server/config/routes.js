var express = require("express");
var passport = require('passport');
var router = express.Router();
var app = express();
var db = require('../../conn.js');
var varConf = require('../../configuration');

// Add functionalities from other JS files
var dialog = require('./js/dialog.js');
var businessunit = require('./js/businessunit.js');
var submenu = require('./js/submenu.js');
var utility = require('./js/utility.js');
var assessableunit = require('./js/assessableunit.js');

function isAuthenticated(req, res, next) {
	if (req.session.isAuthenticated)
        return next();
    res.redirect('/login');
};

router.get('/', isAuthenticated, function(req, res) {
	res.redirect('disclosure');
});
/* Index page displayed */
router.get('/index', isAuthenticated, function(req, res) {
	res.render('index');
});

/**************************************************************
LOAD HEADER FUNCTIONALITY
***************************************************************/
router.get('/name', isAuthenticated, function(req, res) {
	if (req.session.user != undefined)
		return res.json({ uname: req.session.user.notesId});
	else
		return res.json({ uname: '' });
});

/**************************************************************
SUBMENU FUNCTIONALITY
***************************************************************/

router.get('/submenu', isAuthenticated, function(req, res) {
	submenu.listMenu(req,res,db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.json({menu: data.submenu});
		} else {
			//res.render('error',{errorDescription: data.error})
			console.log("[routes][submenulist]" + data.error);
		}
	}).catch(function(err) {
		//res.render('error',{errorDescription: err.error})
		console.log("[routes][submenulist] - " + err.error);
	})
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
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][disclosure] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
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
							res.render('index');
						}
					} else {
						res.render('index');
					}
				}).catch(function(err) {
					res.render('index');
				})				
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][businessunit] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][businessunit] - " + err.error);
	})
});
/**************************************************************
BULLETIN FUNCTIONALITY
***************************************************************/
/* Bulletin page displayed */
router.get('/bulletin', isAuthenticated, function(req, res) {
	res.render('bulletin');
});
/**************************************************************
BLUEPAGES FUNCTIONALITY
***************************************************************/
/* Get Person data */
router.get('/bpdata', function(req, res) {
	utility.getPersonData(req,res).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.doc)
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[routes][bpdata] - " + data.error);
		}			
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][bpdata] - " + err.error);
	})
});
/* Get People data */
router.get('/bplist', function(req, res) {
	utility.getPeopleData(req,res).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.doc)
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[routes][bpdata] - " + data.error);
		}			
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][bpdata] - " + err.error);
	})
});
router.get('/bluepages', function(req, res) {
	res.render('bluepages');
});


/**************************************************************
DYNAMIC SECTIONS FUNCTIONALITY
***************************************************************/
router.get('/testsectionv1', isAuthenticated, function(req, res) {
	if (req.session.BG != undefined)
		res.render('testsectionv1', {bg: req.session.BG});
	else
		res.render('testsectionv1', {bg: ''});
});

router.get('/sectionwidget', isAuthenticated, function(req, res) {
	if (req.session.BG != undefined)
		res.render('sectionwidget', {bg: req.session.BG});
	else
		res.render('sectionwidget', {bg: ''});
});
/**************************************************************
ASSESSABLE UNITS - Business Unit type
***************************************************************/

/* View assessable unit documents */
router.get('/processdashboard', function(req, res) {
	assessableunit.listAU(req, res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				res.render('processdashboard', data );
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][processdashboard] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][processdashboard] - " + err.error);
	})
});


/* Display BU assessable unit document */
router.get('/assessableunit', function(req, res) {
	assessableunit.getAUbyID(req, res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				res.render('aubusinessunit', data.doc[0] );
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][assessableunit] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][assessableunit] - " + err.error);
	})
});

/* Save BU assessable unit document */
router.post('/savebuau', isAuthenticated, function(req, res){
	assessableunit.saveAUBU(req, res, db).then(function(data) {
		req.query.id = req.body.docid;
		if(data.status==200 & !data.error) {
			if(data.body) {
				assessableunit.getAUbyID(req, res, db).then(function(data) {
					if(data.status==200 & !data.error) {
						if(data.doc) {
							res.render('aubusinessunit', data.doc[0] );
						} else {
							res.render('error',{errorDescription: data.error});
						}
					} else {
						res.render('error',{errorDescription: data.error});
						console.log("[routes][getassessableunitbyID] - " + data.error);
					}
				}).catch(function(err) {
					res.render('error',{errorDescription: err.error});
					console.log("[routes][getassessableunitbyID] - " + err.error);
				})
				// res.render('aubusinessunit', data.body );
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
	})

});

module.exports = router;