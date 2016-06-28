var express = require("express");
var passport = require('passport');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var app = express();
var db = require('../../conn.js');
var varConf = require('../../configuration');

// Add functionalities from other JS files
var dialog = require('./js/dialog.js');
var businessunit = require('./js/businessunit.js');
var submenu = require('./js/submenu.js');
var utility = require('./js/utility.js');
var assessableunit = require('./js/assessableunit.js');
var isAuthenticated = require('./authentication.js');

router.get('/', isAuthenticated, function(req, res) {
	res.redirect('login');
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
	if(req.session.businessunit != ""){
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
	}
	else{
		res.json({menu: ""});
	}
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
							//Redirect to original URL, if available
							console.log('URL requested: ' + req.session.returnTo);
							if(typeof req.session.returnTo!='undefined') {
								if(req.session.returnTo!='' && req.session.returnTo!='/') {
									res.redirect(req.session.returnTo);
									req.session.returnTo = '';	
								} else {
									res.render('bulletin', {bulletin: JSON.stringify(data.doc[0].value.Message,null,'\\')});	
								}								
							} else {
								res.render('bulletin', {bulletin: JSON.stringify(data.doc[0].value.Message,null,'\\')});	
							}
						} else {
							//Redirect to original URL, if available
							console.log('URL requested: ' + req.session.returnTo);
							if(typeof req.session.returnTo!='undefined') {
								if(req.session.returnTo!='' && req.session.returnTo!='/') {
									res.redirect(req.session.returnTo);
									req.session.returnTo = '';	
								} else {
									res.render('index');
								}								
							} else {
								res.render('index');
							}
						}
					} else {
						//Redirect to original URL, if available
						console.log('URL requested: ' + req.session.returnTo);
						if(typeof req.session.returnTo!='undefined') {
							if(req.session.returnTo!='' && req.session.returnTo!='/') {
								res.redirect(req.session.returnTo);
								req.session.returnTo = '';	
							} else {
								res.render('index');
							}								
						} else {
							res.render('index');
						}
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
/* Get Person Organization */
router.get('/bporg', function(req, res) {
	utility.getPersonOrg(req,res).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.doc)
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[routes][bporg] - " + data.error);
		}			
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][bporg] - " + err.error);
	})
});
/* Get Person Division */
router.get('/bpdiv', function(req, res) {
	utility.getPersonDiv(req,res).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.doc)
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[routes][bpdiv] - " + data.error);
		}			
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][bpdiv] - " + err.error);
	})
});
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
router.get('/processdashboard', isAuthenticated, function(req, res) {
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
router.get('/assessableunit', isAuthenticated, function(req, res) {
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
							res.redirect('/assessableunit?id=' + data.doc[0]._id);
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
				});
				// res.render('aubusinessunit', data.body );
			} else {
				res.render('error',{errorDescription: data.error});
				console.log("[routes][savebuau] - " + data.error);
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][savebuau] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][savebuau] - " + err.error);
	})

});

/**************************************************************
FILE UPLOAD FUNCTIONALITY
***************************************************************/
/* Save attachement */
router.post('/saveAttachment', isAuthenticated, multipartMiddleware, function(req, res) {
	var parentIdValueField = req.body.parentIdHidden;
	utility.uploadFile(parentIdValueField, req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.json({attachId:data.doc.id, attachName:data.doc.name});
		} else {
			console.log("[routes][saveAttachment] - " + data.error);
		}
	}).catch(function(err) {
		console.log("[routes][saveAttachment] - " + err.error);
	})

});
/* Load example attachment page*/
router.get('/attachment', isAuthenticated, function(req, res) {
	res.render('attachment');
});
/* Download attachment */
router.get('/download', isAuthenticated, function(req, res){
	utility.downloadFile(req,res,db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.download(res.body); 
		} else {
			console.log("[routes][downloadFile] - " + data.error);
		}
	}).catch(function(err) {
		console.log("[routes][downloadFile] - " + err.error);
	})
});
/* Delete attachment */
router.get('/deleteAttachment', isAuthenticated, function(req, res){
	utility.downloadFile(req,res,db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.end();
		} else {
			console.log("[routes][deleteAttachment] - " + data.error);
		}
	}).catch(function(err) {
		console.log("[routes][deleteAttachment] - " + err.error);
	})
	
});

/**************************************************************
CALENDARS
***************************************************************/
/* Load calendar page*/
router.get('/calendar', isAuthenticated, function(req, res) {
	res.render('calendar');
});
/**************************************************************
REPORTS
***************************************************************/
/* Load report assessable unit file page*/
router.get('/reportaufile', isAuthenticated, function(req, res) {
	res.render('reportaufile');
});
/**************************************************************
REFERENCES
***************************************************************/
/* Load reference by category page*/
router.get('/referencebycat', isAuthenticated, function(req, res) {
	res.render('referencebycat');
});
/**************************************************************
ARCHIVE
***************************************************************/
/* Load archive page*/
router.get('/archive', isAuthenticated, function(req, res) {
	res.render('archive');
});
module.exports = router;