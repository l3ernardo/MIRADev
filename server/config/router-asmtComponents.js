var express = require("express");
var asmtComponents = express.Router();
var isAuthenticated = require('./router-authentication.js');
var db = require('./js/class-conn.js');
var components = require('./js/class-asmtComponents.js');


/* Control SAmple */
asmtComponents.get('/controlsample', isAuthenticated, function(req, res) {
	//req.id = "SPL101696302";
	components.getControl(req, db).then(function(data){
			res.render('controlsample', data.data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][auditlessonsave] - " + err.error);
	});
});

module.exports = asmtComponents;
