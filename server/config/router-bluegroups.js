var express = require("express");
var passport = require('passport');
var interface = express.Router();
var isAuthenticated = require('./router-authentication.js');

var db = require('./js/class-conn.js');
var util = require('./js/class-utility.js');
var varConf = require('../../configuration');

/**************************************************************
BLUEGROUPS FUNCTIONALITY
***************************************************************/
/* Load Bluegroup page */
interface.get('/bluegroups', function(req, res) {
	var obj = {
		selector : {
			//"_id": req.query.id
			"_id": {"$gt":0},
			keyName: "Bluegroups"
		}};
	db.find(obj).then(function(data){
		var doc = JSON.stringify(data.body.docs[0].value);
		res.render('bluegroups', { alldata: doc });
	}).catch(function(err) {
		console.log("[routes][bluegroups] - " + err);
	});
});

/* Load Bluegroups members */
interface.get('/bgdetail', function(req, res) {
	util.getBluegroup(req).then(function(data) {
		res.send(data);
		res.end();
	})
});

module.exports = interface;
