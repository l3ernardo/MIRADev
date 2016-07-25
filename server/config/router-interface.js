var express = require("express");
var passport = require('passport');
var interface = express.Router();
var isAuthenticated = require('./router-authentication.js');

var db = require('./js/class-conn.js');

/**************************************************************
INTERFACES FUNCTIONALITY
***************************************************************/
/* Validate in Login page */
interface.get('/wwbcitdata', function(req, res) {
	db.connect("mira-interfaces");
	var viewname= 'view-'+req.query.id;
	//var viewname = "view-setup";
	db.view('wwbcitdocs', viewname, {include_docs: false}).then(function(data){
		var len = data.body.rows.length;
		if(len > 0){ 
			rawDataList=[];
			//generate list of raw data
			data.body.rows.forEach(function(doc) {
				rawDataList.push({
					// doctype: data.body.rows[i].doc.row.DOCTYPE, 
					id: doc.id,
					key: doc.key,
					value: doc.value
				});				
			})
			
			if (process.env.VCAP_SERVICES) {
				db.connect('miradb');
			} else {
				db.connect('miradbtest');
			} 
			
			res.render('wwbcitdata', {
				dataList: rawDataList,
				viewname: '',
				quarter: '',
				alldata: JSON.stringify(data.body.rows, 'utf8'),
				onedoc: ''
			})
		} else{
			if (process.env.VCAP_SERVICES) {
				db.connect('miradb');
			} else {
				db.connect('miradbtest');
			} 			
			//if there is no data in the DB, then redirects to addnew form
			error = 'There is no data in database.';
		}
	}).catch(function(error){ //dbView catch
		if (process.env.VCAP_SERVICES) {
			db.connect('miradb');
		} else {
			db.connect('miradbtest');
		} 	
		res.render('error',{errorDescription: err.error});
		console.log("[router-interface][wwbcitdata] - " + error.error);
	});
});

module.exports = interface;
