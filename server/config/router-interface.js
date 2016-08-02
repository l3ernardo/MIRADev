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

module.exports = interface;
