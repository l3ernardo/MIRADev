/**************************************************************
DATA TRANSFORMATION FUNCTIONALITY

Created by: Valdenir Alves
email:  silvav@br.ibm.com
Date: 20/09/2016
***************************************************************/

var express = require("express");
var passport = require('passport');
var interface = express.Router();
var isAuthenticated = require('./router-authentication.js');

var db = require('./js/class-conn.js');
var util = require('./js/class-utility.js');
var varConf = require('../../configuration');


datatrans.get('/checkData', function(req, res) {
	console.log(req.query.designdoc, req.query.viewname)
	util.getBusinessDocs(req, req.query.designdoc, req.query.viewname).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data) {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(data.data));				
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[router][showAlldata] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[router][showAlldata] - " + err.error);
	})
});

module.exports = datatrans;
