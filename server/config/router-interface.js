var express = require("express");
var passport = require('passport');
var interface = express.Router();
var isAuthenticated = require('./router-authentication.js');

var db = require('./js/class-conn.js');
var util = require('./js/class-utility.js');
var varConf = require('../../configuration');

/**************************************************************
INTERFACES FUNCTIONALITY
***************************************************************/
/* Validate in Login page */
interface.get('/wwbcitdata', function(req, res) {
	// /showdata?designdoc=wwbcitdocs&viewname=samplesprod
	var query = varConf.mirainterfaces+"/showdata?designdoc="+req.query.doc+"&viewname="+req.query.id;
	util.callhttp(query).then(function(data) {
		if(data.status==200) {
			//console.log(data);
			var doc = data;
			rawDataList=[];
			//generate list of raw data
			for(var i=0;i<data.doc.length;i++) {
				var doc=data.doc[i];
				//console.log(doc);
				rawDataList.push({
					// doctype: data.body.rows[i].doc.row.DOCTYPE, 
					id: doc.id,
					key: doc.key,
					value: doc.value
				});					
			}
			res.render('wwbcitdata', {
				dataList: rawDataList,
				viewname: '',
				quarter: '',
				alldata: JSON.stringify(data, 'utf8'),
				onedoc: ''
			})
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err})
		console.log("[router-interface][wwbcitdata] - " + err);
	})
});

/**************************************************************
RAW DATA ONE DOC DETAIL
***************************************************************/
interface.get('/rawDataDetail/:viewname/:id', function(req, res) {
	var query = varConf.mirainterfaces+"/showDocDetail?id="+req.params.id;

	util.callhttp(query).then(function(data) {
		// console.log(data.doc)
		if(data.status==200) {
			res.render('rawDataDetail', {
				doc:JSON.stringify(data.doc, 'utf8') 
			});
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[interface][rawDataDetail] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[interface][rawDataDetail] - " + err.error);
	})
});

/* Load log page */
interface.get('/listlog', function(req, res) {
	// /listlog
	var query = varConf.mirainterfaces+"/listlog";
	util.callhttp(query).then(function(data) {
		if(data.status==200) {
			//console.log(data);
			var doc = data;
			rawDataList=[];
			//generate list of raw data
			for(var i=0;i<data;i++) {
				var doc=data.doc[i];
				//console.log(doc);
				rawDataList.push({
					// doctype: data.body.rows[i].doc.row.DOCTYPE, 
					filename: doc.filename
				});					
			}
			res.render('loglist', {
				dataList: rawDataList,
				server: varConf.mirainterfaces,
				viewname: '',
				quarter: '',
				alldata: JSON.stringify(data, 'utf8'),
				onedoc: ''
			})
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err})
		console.log("[router-interface][listlog] - " + err);
	})
});

/* Load log file */
interface.get('/logDetail', function(req, res) {
	// /listlog
	util.callhttp(req.query.filepath).then(function(data) {
		res.render('logDetail', { doc: data.doc });
	}).catch(function(err) {
		res.render('error',{errorDescription: err})
		console.log("[router-interface][logDetail] - " + err);
	})
});

module.exports = interface;
