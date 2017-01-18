var express = require("express");
var asmtComponents = express.Router();
var isAuthenticated = require('./router-authentication.js');
var db = require('./js/class-conn.js');
var components = require('./js/class-asmtComponents.js');

/* Get components */
asmtComponents.get('/asmtcomponents', isAuthenticated, function(req, res) {
	components.getComponent(req, db).then(function(data){
		var type= data.data.compntType;
		//console.log("type :" + type);
		switch (type) {
			case "controlSample":
			//9d9902492259ecc30230af749b1c2a06
				res.render('ac_controlsample', data.data );
				break;
			case  "CUSummarySample":
			//df91794db326710c753a48ffbb8a70ae
				res.render('ac_cusummarysample', data.data );
				break;
			case "internalAudit":
			//b0b51b526058b829e373769998e771e0
				res.render('ac_internalaudit', data.data );
				break;
			case "localAudit":
			//cb71326690d51329c153f5f950eb3c8c
				res.render('ac_localaudit', data.data );
				break;
			case "accountAudit":
			//a464dfcf0335a4d86e96fd0072d58889
				res.render("ac_accountaudit", data.data)
				break;
			case "PPR":
			//a75108a8b64db30c0f47722a78a100b8
				res.render('ac_ppr', data.data );
				break;
			case "openIssue":
			//1caba93791bd9eeb006a97bd03324f8f
				res.render('ac_openissue', data.data );
				break;
			case "sampledCountry":
			//8f57b3ea6517064267c1e009046df7b2
				res.render('ac_sampledcountry', data.data );
				break;
			case "countryControls":
			//ee3ee7b63aebfa7f63575877099d7d65
				res.render('ac_countrycontrols', data.data );
				break;
			case "accountControls":
			//1cae4863555a802db08c242b37909b81
				res.render('ac_accountcontrols', data.data );
				break;
			default:
				res.render('error',{errorDescription: "doc not found"});
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
	components.saveOverride(req, db).then(function(data) {

		if(data.status==200 & !data.error) {
			if(req.body.close === "back"){
				res.redirect("/assessment?id="+req.body.parentid);
			}else{
				res.redirect('/asmtcomponents?id='+data.data.id);
			}
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
	components.saveAccountControls(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(req.body.close === "back"){
				res.redirect("/assessment?id="+req.body.parentid);
			}else{
				res.redirect('/asmtcomponents?id='+data.data.id);
			}
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
	components.savePPR(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(req.body.close === "back"){
				res.redirect("/assessment?id="+req.body.parentid);
			}else{
				res.redirect('/asmtcomponents?id='+data.data.id);
			}
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
	components.saveLocalAudit(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(req.body.close === "back"){
				res.redirect("/assessment?id="+req.body.parentid);
			}else{
				res.redirect('/asmtcomponents?id='+data.data.id);
			}
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
	components.saveAccountAudit(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(req.body.close === "back"){
				res.redirect("/assessment?id="+req.body.parentid);
			}else{
				res.redirect('/asmtcomponents?id='+data.data.id);
			}
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
	components.saveInternalAudit(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(req.body.close === "back"){
				res.redirect("/assessment?id="+req.body.parentid);
			}else{
				res.redirect('/asmtcomponents?id='+data.data.id);
			}
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
	components.saveCountryControls(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(req.body.close === "back"){
				res.redirect("/assessment?id="+req.body.parentid);
			}else{
				res.redirect('/asmtcomponents?id='+data.data.id);
			}
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
