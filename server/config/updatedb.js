/**************************************************************************************************
*
* Update database
* Developed by :  Carlos Kenji Takata.
* Date:20 Dec 2016
*
* Please make sure to perform the following tasks first:
* 1) Make a replica from "miradb", from DEV org to TEST org as the name "miradb_dev";
* 2) Change the app.js from "miradb" to "miradb_dev";
* 3) Make sure you have at least the design doc called "setup" in both dbs, with a view called "view-setup" with at least 1 doc;
* 4) Run the program from local console typing "updatedb";
* 5) Wait until it finishes (+-15 sec);
* 6) Check the number of designdocs in both dbs, same for parameter docs;
*/

var express = require("express");
var access = express.Router();
var db = require('./js/class-conn');
var util = require('./js/class-utility');

console.log(new Date());
console.log("Update code");

var designdocs = [];
var paramdocs = [];
var newdocs = [];

try {
	// This code cannot be executed on DEV, otherwise we can lost the original designdocs + parameter docs!!!
	if(util.getOrg().indexOf("dev")!=-1) {
		console.log("**************************************");
		console.log("THIS CODE CANNOT BE EXECUTED ON DEV!!!");
		console.log("**************************************");
		console.log("Please make sure to perform the following tasks first:");
		console.log("1) Make a replica from 'miradb', from DEV org to TEST org as the name 'miradb_dev';");
		console.log("2) Change the app.js from 'miradb' to 'miradb_dev';");
		console.log("3) Make sure you have at least the design doc called 'setup' in both dbs, with a view called 'view-setup' with at least 1 doc;");
		console.log("4) Run the program from local console typing 'updatedb' (like you just did);");
		console.log("5) Wait until it finishes (+-15 sec);");
		console.log("6) Check the number of designdocs in both dbs, same for parameter docs;");
		process.exit();
	} else {
		console.log("Updating DesignDocs and Parameter Docs");
		db.list().then(function(data){
			if(data.status == 200 && !data.error){
				console.log("Found " + data.body.total_rows + " documents");
				total = data.body.total_rows;
				try {
					// Get all design docs
					data.body.rows.forEach(function(data) {	
						var doc = data.doc;
						if(doc._id.indexOf("_design")!=-1) {
							var newdoc = Object.assign({}, doc);	
							delete newdoc._rev;
							designdocs.push(newdoc);
						}					
					})
					console.log("Design docs:" + designdocs.length);
					// Get all parameter docs
					db.view('setup', 'view-setup', {include_docs: true}).then(function(data){
						if(data.status == 200 && !data.error){
							console.log("Found " + data.body.total_rows + " documents");
							var total = data.body.total_rows;
							try {
								data.body.rows.forEach(function(data) {	
									var doc = data.doc;
									var newdoc = Object.assign({}, doc);	
									delete newdoc._rev;
									paramdocs.push(newdoc);							
								})
								console.log("Parameter docs:" + paramdocs.length);
								// Delete all parameter docs from destiny db
								var ldb = require('./js/class-conn');
								ldb.connect("miradb");		
							
								ldb.view('setup', 'view-setup', {include_docs: true}).then(function(data){
									if(data.status == 200 && !data.error){
										console.log("Found " + data.body.total_rows + " documents");
										total = data.body.total_rows;
										try {
											data.body.rows.forEach(function(data) {
												var doc = data.doc;
												doc._deleted = true;
												newdocs.push(doc);
												if(newdocs.length==total) {
													ldb.bulk(newdocs).then(function(body){
														console.log('Documents deleted.');
														// Copying design documents
														ldb.bulk(designdocs).then(function(body){
															console.log("Design documents copied.");
															// Copying design documents
															ldb.bulk(paramdocs).then(function(body){
																console.log("Parameter documents copied.");
																console.log(new Date());
															})
														})
													})
												}
											})
										}catch(e){
											console.log(e)
										}
									}
								})	
								
							} catch(e) {
								console.log(e)
							}					
						}
					})	

				} catch(e) {
					console.log(e);
				}
			}			
		})
	}
} catch(e) {
	console.log(e);
}

module.exports = access;