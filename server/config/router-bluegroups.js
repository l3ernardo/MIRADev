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
interface.get('/bluegroups', isAuthenticated, function(req, res) {
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
interface.get('/bgdetail', isAuthenticated, function(req, res) {
	util.getBluegroup(req).then(function(data) {
		res.send(data);
		res.end();
	})
});

/* Load Bluegroups members */
interface.get('/frmbg', isAuthenticated, function(req, res) {
	util.getBluegroup(req).then(function(data) {
		res.render('formbluegroups', {bgname: req.query.group, alldata: data.doc});
	})
});

/* Process Bluegroups members */
interface.post('/processbg', isAuthenticated, function(req,res) {
	//console.log(req.body.finalmembers.split(";"));	
	req.query.group = req.body.group;
	var addmembers = [];
	var delmembers = [];
	util.getBluegroup(req).then(function(data) {
		//console.log("Current # of members: " + data.doc.length + "\nNew # of members: " + req.body.finalmembers.split(";").length);
		data.doc.forEach(function(member) {
			if(req.body.finalmembers.split(";").indexOf(member.uid)==-1) {
				delmembers.push(member.uid);
				util.delMember(req.body.group,member.uid).then(function(result) {
					if(result) {
						//console.log("Deleted: " + member.uid);
					}
				})
			}
		});
		req.body.finalmembers.split(";").forEach(function(member) {
			if(member.indexOf("@")!=-1) {
				//console.log(member);
				req.query.search = member;
				req.query.field = "mail";
				util.getPersonData(req).then(function(data) {
					var person = data.doc.replace("search","doc"); // search is a reserved word for node.js, replacing with "doc"
					var pdata = JSON.parse(person);
					var uid = (pdata.doc.entry[0].dn.split(',')[0]).split("=")[1];
					addmembers.push(uid);
					util.addMember(req.body.group,uid).then(function(result) {
						if(result) {
							//console.log("Added: " + uid);
						}
					})					
				});
			}
		});
		res.redirect('/bluegroups');
	})
});

module.exports = interface;
