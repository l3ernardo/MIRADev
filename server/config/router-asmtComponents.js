var express = require("express");
var asmtComponents = express.Router();
var isAuthenticated = require('./router-authentication.js');
var db = require('./js/class-conn.js');
var components = require('./js/class-asmtComponents.js');


/* Control Sample */
asmtComponents.get('/asmtcomponents', isAuthenticated, function(req, res) {
	components.getComponent(req, db).then(function(data){
		var type= data.data.docType;
		switch (type) {
			case "controlsample":
				res.render('controlsample', data.data );
				break;
			case  "cusummarysample":
				res.render('cusummarysample', data.data );
				break;
			case "internalaudit":
				res.render('internalaudit', data.data );
				break;
			case "localaudit":
				res.render('localaudit', data.data );
				break;
			case "ppr":
				res.render('ppr', data.data );
				break;
			case "openissue":
				res.render('openissue', data.data );
				break;
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][controlsample] - " + err.error);
	});
});

/* Control Sample */
asmtComponents.get('/controlsample', isAuthenticated, function(req, res) {
	if(typeof req.query.id === "undefined"){
		req.query.id = "9d9902492259ecc30230af749b1c2a06";
	}
	components.getControl(req, db).then(function(data){
		res.render('controlsample', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][controlsample] - " + err.error);
	});
});

/* Open Issue */
asmtComponents.get('/openissue', isAuthenticated, function(req, res) {
	if(typeof req.query.id === "undefined"){
		req.query.id = "1caba93791bd9eeb006a97bd03324f8f";
	}
	components.getIssue(req, db).then(function(data){
		res.render('openissue', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][openissue] - " + err.error);
	});
});
/* PPR */
asmtComponents.get('/ppr', isAuthenticated, function(req, res) {
	if(typeof req.query.id === "undefined"){
		req.query.id = "a75108a8b64db30c0f47722a78a100b8";
	}
	components.getPPR(req, db).then(function(data){
		res.render('ppr', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][ppr] - " + err.error);
	});
});
/* Local Audit */
asmtComponents.get('/localaudit', isAuthenticated, function(req, res) {
		if(typeof req.query.id === "undefined"){
			req.query.id = "cb71326690d51329c153f5f950eb3c8c";
		}
		components.getLocalAudit(req, db).then(function(data){
			res.render('localaudit', data.data );
		}).catch(function(err) {
			res.render('error',{errorDescription: err.error});
			console.log("[routes][localaudit] - " + err.error);
		});

});
/* Internal Audit */
asmtComponents.get('/internalaudit', isAuthenticated, function(req, res) {
		if(typeof req.query.id === "undefined"){
			req.query.id = "b0b51b526058b829e373769998e771e0";
		}
		components.getInternalAudit(req, db).then(function(data){
			res.render('internalaudit', data.data );
		}).catch(function(err) {
			res.render('error',{errorDescription: err.error});
			console.log("[routes][ppr] - " + err.error);
		});
});
/* CU Summary Sample */
asmtComponents.get('/cusummarysample', isAuthenticated, function(req, res) {
	if(typeof req.query.id === "undefined"){
		req.query.id = "df91794db326710c753a48ffbb8a70ae";
	}
	components.getCUSummary(req, db).then(function(data){
		res.render('cusummarysample', data.data );
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
			res.redirect('/openissue?id='+data.data.id);
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

/* Save PPR in cloudant */
asmtComponents.post('/saveppr', isAuthenticated, function(req, res) {
	components.savePPR(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(req.body.close === "back"){
				res.redirect("/assessment?id="+req.body.parentid);
			}else{
			res.redirect('/ppr?id='+data.data.id);
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
/* Save Local Audit in cloudant */
asmtComponents.post('/savelocalaudit', isAuthenticated, function(req, res) {
	components.saveLocalAudit(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(req.body.close === "back"){
				res.redirect("/assessment?id="+req.body.parentid);
			}else{
			res.redirect('/localaudit?id='+data.data.id);
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
/* Save Internal Audit in cloudant */
asmtComponents.post('/saveinternalaudit', isAuthenticated, function(req, res) {
	components.saveInternalAudit(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(req.body.close === "back"){
				res.redirect("/assessment?id="+req.body.parentid);
			}else{
			res.redirect('/internalaudit?id='+data.data.id);
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


module.exports = asmtComponents;