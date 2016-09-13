var express = require("express");
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var db = require('./js/class-conn.js');

// Add functionalities from other JS files
var dialog = require('./js/class-dialog.js');
var businessunit = require('./js/class-businessunit.js');
var submenu = require('./js/class-submenu.js');
var utility = require('./js/class-utility.js');
var isAuthenticated = require('./router-authentication.js');

router.get('/', isAuthenticated, function(req, res) {
	res.redirect('index');
});
/* Index page displayed */
router.get('/index', isAuthenticated, function(req, res) {
	res.render('index');
});

/**************************************************************
DISCLOSURE FUNCTIONALITY
***************************************************************/
/* Disclosure screen */
router.get('/disclosure', function(req, res) {
	dialog.displayNonDisclosure(req, db).then(function(data) {
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
	businessunit.listBU(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.render('businessunit', data);
		}else{
			res.render('error', {errorDescription: data.error});
			console.log("[routes][businessunit] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][businessunit] - " + err.error);
	})
	
});
/* Save Business Unit */
router.post('/savebunit', isAuthenticated, function(req, res){
	businessunit.saveBU(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			req.session.businessunit = data.bunit;
			req.session.user.version = data.version;
			businessunit.getMenu(req,db).then(function(data) {
			if(data.status==200 & !data.error) {
				req.app.locals.submenu = data.submenu;
				// Control the bulletin message to be displayed
				dialog.displayBulletin(req, db).then(function(data) {
					if(data.status==200 & !data.error) {
							if(data.doc) {
								//Redirect to original URL, if available
								console.log('URL requested: ' + req.session.returnTo);
								if(typeof req.session.returnTo!='undefined') {
									if(req.session.returnTo!='' && req.session.returnTo!='/' && req.session.returnTo!='-') {
										var rtn = req.session.returnTo;
										req.session.returnTo = '-';
										req.flash('url', '-');
										res.redirect(rtn);
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
										var rtn = req.session.returnTo;
										req.session.returnTo = '-';
										req.flash('url', '-');
										res.redirect(rtn);
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
										var rtn = req.session.returnTo;
										req.session.returnTo = '-';
										req.flash('url', '-');
										res.redirect(rtn);
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
				}
			})
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][savebunit] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][savebunit] - " + err.error);
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
	utility.downloadFile(req, res, db).then(function(data) {
		if(data.error) {
			console.log("[routes][downloadFile] - " + data.error);
		}
	}).catch(function(err) {
		console.log("[routes][download] - " + err.error);
	})
});
/* Delete attachment */
router.get('/deleteAttachment', isAuthenticated, function(req, res){
	utility.deleteFile(req, db).then(function(data) {
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
