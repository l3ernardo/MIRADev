var express = require("express");
var asmtComponents = express.Router();
var isAuthenticated = require('./router-authentication.js');
var db = require('./js/class-conn.js');
var components = require('./js/class-asmtComponents.js');
var parameter = require('./js/class-parameter.js');

/* Get components */
asmtComponents.get('/asmtcomponents', isAuthenticated, function(req, res) {
	components.getComponent(req, db).then(function(data){
		var type= data.data.compntType;
		data.data.editor=req.aceditor;
		switch (type) {
			case "controlSample":
				res.render('ac_controlsample', data.data );
				break;
			case  "CUSummarySample":
				res.render('ac_cusummarysample', data.data );
				break;
			case "internalAudit":
				var lParams = ['PeriodRatingIntAudit'];
				parameter.getListParams(db, lParams).then(function(dataParam) {
					if(dataParam.status==200 & !dataParam.error) {
						data.data.parameters = dataParam.parameters;
						res.render('ac_internalaudit', data.data );
					} else {
						res.render('error',{errorDescription: data.error});
						console.log("[router][asmtComponents][internalAudit] - " + dataParam.error);
					}
				}).catch(function(err) {
					res.render('error',{errorDescription: err.error});
					console.log("[router][asmtComponents][internalAudit] - " + err.error);
				});
				break;
			case "localAudit":
				res.render('ac_localaudit', data.data );
				break;
			case "accountAudit":
				res.render("ac_accountaudit", data.data)
				break;
			case "PPR":
				res.render('ac_ppr', data.data );
				break;
			case "openIssue":
				res.render('ac_openissue', data.data );
				break;
			case "sampledCountry":
				res.render('ac_sampledcountry', data.data );
				break;
			case "countryControls":
				res.render('ac_countrycontrols', data.data );
				break;
			case "accountControls":
				res.render('ac_accountcontrols', data.data );
				break;
			default:
				res.render('error',{errorDescription: "Document not found"});
				console.log("[routes][asmtComponents] ");
				break;
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][asmtComponents] - " + err.error);
	});
});
/* Control Sample */
asmtComponents.get('/controlsample', isAuthenticated, function(req, res) {
	components.getControlSample(req, db).then(function(data){
		res.render('ac_controlsample', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][controlsample] - " + err.error);
	});
});
/* Open Issue */
asmtComponents.get('/openissue', isAuthenticated, function(req, res) {
	components.getIssue(req, db).then(function(data){
		res.render('ac_openissue', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][openissue] - " + err.error);
	});
});
/* PPR */
asmtComponents.get('/ppr', isAuthenticated, function(req, res) {
	components.getPPR(req, db).then(function(data){
		res.render('ac_ppr', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][ppr] - " + err.error);
	});
});
/* Local Audit */
asmtComponents.get('/localaudit', isAuthenticated, function(req, res) {
	components.getLocalAudit(req, db).then(function(data){
		res.render('ac_localaudit', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][localaudit] - " + err.error);
	});
});
	/* Account Controls */
asmtComponents.get('/accountcontrols', isAuthenticated, function(req, res) {
	components.getAccountControls(req, db).then(function(data){
			res.render('ac_accountcontrols', data.data );
		}).catch(function(err) {
			res.render('error',{errorDescription: err.error});
			console.log("[routes][accountcontrols] - " + err.error);
		});
});
/* Account Audit */
asmtComponents.get('/accountaudit', isAuthenticated, function(req, res) {
	components.getAccountAudit(req, db).then(function(data){
		res.render('ac_accountaudit', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][accountaudit] - " + err.error);
	});

});
/* Internal Audit */
asmtComponents.get('/internalaudit', isAuthenticated, function(req, res) {
	components.getInternalAudit(req, db).then(function(data){
		res.render('ac_internalaudit', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][ppr] - " + err.error);
	});
});
/* CU Summary Sample */
asmtComponents.get('/cusummarysample', isAuthenticated, function(req, res) {
	components.getCUSummary(req, db).then(function(data){
		res.render('ac_cusummarysample', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][controlsample] - " + err.error);
	});
});
/* Save Open Issue in cloudant */
asmtComponents.post('/saveopenissue', isAuthenticated, function(req, res) {
	var params = res.req.headers.referer;
	params = params.split("&")[1];
	components.saveOverride(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('/asmtcomponents?id='+data.data.id+"&"+params);
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][openissue] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][openissue] - " + err.error);
	});
});
/* Save Account Key Controls Testing */
asmtComponents.post('/saveaccountcontrols', isAuthenticated, function(req, res) {
	var params = res.req.headers.referer;
	params = params.split("&")[1];
	components.saveAccountControls(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('/asmtcomponents?id='+data.data.id+"&"+params);
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][accountcontrols] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][accountcontrols] - " + err.error);
	});
});
/* Save PPR in cloudant */
asmtComponents.post('/saveppr', isAuthenticated, function(req, res) {
	var params = res.req.headers.referer;
	params = params.split("&")[1];
	components.savePPR(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('/asmtcomponents?id='+data.data.id+"&"+params);
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][ppr] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][ppr] - " + err.error);
	});
});
/* Save Local Audit in cloudant */
asmtComponents.post('/savelocalaudit', isAuthenticated, function(req, res) {
	var params = res.req.headers.referer;
	params = params.split("&")[1];
	components.saveLocalAudit(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('/asmtcomponents?id='+data.data.id+"&"+params);
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][localaudit] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][localaudit] - " + err.error);
	});
});
/* Save Account Audit in cloudant */
asmtComponents.post('/saveaccountaudit', isAuthenticated, function(req, res) {
	var params = res.req.headers.referer;
	params = params.split("&")[1];
	components.saveAccountAudit(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('/asmtcomponents?id='+data.data.id+"&"+params);
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][accountAudit] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][accountAudit] - " + err.error);
	});
});
/* Save Internal Audit in cloudant */
asmtComponents.post('/saveinternalaudit', isAuthenticated, function(req, res) {
	var params = res.req.headers.referer;
	params = params.split("&")[1];
	components.saveInternalAudit(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('/asmtcomponents?id='+data.data.id+"&"+params);
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][internalAudit] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][internalAudit] - " + err.error);
	});
});
/* Save Country Controls in cloudant */
asmtComponents.post('/savecountrycontrols', isAuthenticated, function(req, res) {
	var params = res.req.headers.referer;
	params = params.split("&")[1];
	components.saveCountryControls(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('/asmtcomponents?id='+data.data.id+"&"+params);
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][countryControls] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][countryControls] - " + err.error);
	});
});
module.exports = asmtComponents;
