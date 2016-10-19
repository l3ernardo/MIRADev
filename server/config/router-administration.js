var express = require("express");
var passport = require('passport');
var administration = express.Router();
var app = express();
var db = require('./js/class-conn.js');
var varConf = require('../../configuration');
var auditlesson = require('./js/class-auditlesson.js');
// Add functionalities from other JS files
var parameter = require('./js/class-parameter.js');
var setup = require('./js/class-setup.js');
var isAuthenticated = require('./router-authentication.js');
var isAuthorized = require('./router-authorization.js');
var simpleAuthentication = require('./router-simpleAuthentication.js');
var accesssumary = require('./js/class-accesssummary.js')

/**************************************************************
SETUP FUNCTIONALITY
***************************************************************/
/* Setup will validate if required parameters were created */
administration.get('/setup', isAuthenticated, function(req, res, next){
	setup.getSetup(req, db, varConf.keyNameM, varConf.keyNameBU).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.numDocs < 2) {
				res.render('setup', data.setup[0]);
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
/* Save setup parameters in cloudant */
administration.post('/saveSetup', isAuthenticated, function(req, res){
	setup.saveSetup(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('index');
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][saveSetup] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][saveSetup] - " + err.error);
	})
});

/**************************************************************
PARAMETERS FUNCTIONALITY
***************************************************************/
//Add new parameter
administration.get('/newparam', isAuthenticated, function(req, res){
	var data = {"doc":{"value":{}}};
	res.render('formparam', data );
});

//Edit existing parameter
administration.get('/formparam', isAuthenticated, function(req, res){
	parameter.getParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.render('formparam', data )
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][getParam] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][getParam] - " + err.error);
	})
});
/* Load all parameters in view*/
administration.get('/parameter', isAuthenticated, function(req, res){
	parameter.listParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.render('parameters', data.parameters )
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][parameter] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][parameter] - " + err.error);
	})
});
/* Save parameter in cloudant */
administration.post('/saveParam', isAuthenticated, function(req, res) {
	parameter.saveParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('/parameter');
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][saveParam] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][saveParam] - " + err.error);
	})

});
administration.get('/getParam', isAuthenticated, function(req, res) {
	parameter.getParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send( data.doc );
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][getParam] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][getParam] - " + err.error);
	})
});
/* Get parameter by keyName */ // -> This is the only restful
administration.get('/getParameter', isAuthorized, function(req, res) {
	parameter.getParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.doc.value);
		} else {
			res.render('error',{errorDescription: data.error});
			//console.log("[routes][getParameter] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		//console.log("[routes][getParameter] - " + err.error);
	})
});
/* Load test for list of parameter */
administration.get('/getListParams', isAuthenticated, function(req, res) {
	var lParams = ['GBSInstanceDesign', 'UnitSizes','ARCFrequencies'];
	parameter.getListParams(db, lParams).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send( data.parameters.GBSInstanceDesign );
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][getListParams] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][getListParams] - " + err.error);
	})
});
/**************************************************************
Explicit user summary
***************************************************************/

administration.get('/explicitAccessSummary',isAuthenticated, function(req,res){

		accesssumary.getUserAccessSummary(req,db).then(function (data){

			if(data.status==200 & !data.error) {

				res.render('accesssummary',data.data);

			}else{

			res.render('error',{errorDescription: data.error});
			console.log("[routes][explicitAccessSummary] - " + data.error);


			}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][explicitAccessSummary] - " + err.error);

		});



});


/**************************************************************
AUDITLESSON FUNCTIONALITY
***************************************************************/

/* View audit lesson documents */
administration.get('/auditlessonlearned', isAuthenticated, function(req, res) {
		auditlesson.getLessonByID(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				res.render('auditlessonlearned', data.doc );
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][auditlesson] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][auditlesson] - " + err.error);
	})
});
/* View audit lessons list */
administration.get('/auditlessons', isAuthenticated, function(req, res) {
	auditlesson.getAllLessons(req, db).then(function(data){
		//console.log(data);
			res.render('auditlessons', data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][auditlessonsave] - " + err.error);
	});
});
/* Save Audit Lesson in cloudant */
administration.post('/saveaulesson', isAuthenticated, function(req, res) {
	auditlesson.saveAL(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.id == "new"){
				res.redirect('/auditlessons');
			}else {
				//console.log(data.id);
				res.redirect('/auditlessonlearned?id='+data.id);
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][auditlessonsave] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][auditlessonsave] - " + err.error);
	});
});

module.exports = administration;
