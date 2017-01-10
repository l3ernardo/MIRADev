/**************************************************************************************************
 * 
 * IBM Bluemix app with Cloudant service using Node.js
 * Date: 09 May 2016
 * 
 */

var Cloudant = require('cloudant');
var q  = require("q");
var util = require("./class-utility.js");
var cloudant, dbCredentials = {};
var DB = {
	db: {},
	database: "",
	//BULK - INSERT/UPDATE/DELETE
	bulk: function(object) {
		var deferred = q.defer();
		this.db.bulk({docs: object}, '', function(err) {
			if(err) {
				deferred.reject({"status": 500, "body": {}, "error": err});
			} else{
				deferred.resolve({"status": 200, "body": object});
			}
		});
		return deferred.promise;
	},
	//SAVE
	save: function(object) {
		//console.log("[db] save");
		var deferred = q.defer();
		this.db.insert(object, '', function(err, doc) {
			if(err) {
				deferred.reject({"status": 500, "body": {}, "error": err});
			} else{
				deferred.resolve({"status": 200, "body": doc});
			}
		});
		return deferred.promise;
	},
	//FIND
	find: function(object){
		//console.log("[db] find");
		var deferred = q.defer();
		this.db.find(object, function(error, result) {
			if (error) {
				deferred.reject({"status": 500, "body": {}, "error": error});
			}
			deferred.resolve({"status": 200, "body": result});
		});
		return deferred.promise;
	},
	//VIEW
	view: function(designname, viewname, params){
		//console.log("[db] view: ");
		var deferred = q.defer();
		this.db.view(designname, viewname, params, function(error, result) {
			if (error) {
				deferred.reject({"status": 500, "body": {}, "error": error});
			}
			deferred.resolve({"status": 200, "body": result});
		});
		return deferred.promise;
	},
	//SEARCH
	search: function(designname, viewname, params){
		//console.log("[db] search: ");
		var deferred = q.defer();
		this.db.search(designname, viewname, params, function(error, result) {
			if (error) {
				deferred.reject({"status": 500, "body": {}, "error": error});
			}
			deferred.resolve({"status": 200, "body": result});
		});
		return deferred.promise;
	},
	//LIST
	list: function(){
		//console.log("[db] list: ");
		var deferred = q.defer();
		this.db.list({include_docs: true}, function(error, result) {
			if (error) {
				deferred.reject({"status": 500, "body": {}, "error": error});
			}
			deferred.resolve({"status": 200, "body": result});
		});
		return deferred.promise;
	},
	//GET
	get: function(id, params){
		//console.log("[db] get: " + id + " " + params);
		var deferred = q.defer();
		this.db.get(id, params, function(error, result) {
			if (error) {
				deferred.reject({"status": 500, "body": {}, "error": error});
			}
			deferred.resolve({"status": 200, "body": result});
		});
		return deferred.promise;
	},
	//DELETE
	del: function(id, rev){
		//console.log("[db] delete" + id);
		var deferred = q.defer();
		var doc = {"_id":id, "_rev":rev, "_deleted": true};
		this.db.insert(doc, '', function(error, body) {
			if (error) {
				deferred.reject({"status": 500, "body": {}, "error": error});
			}
			deferred.resolve({"status": 200, "body": body});
		});
		return deferred.promise;
	},
	//CONNECT TO DB
	connect: function(database){
		console.log("[db] connecting to cloudant: "+database);
		this.database = database;
		var isValidDatabase = false;
		// read connection parameters from json file
		fs = require('fs');
		var obj = JSON.parse(fs.readFileSync('./connProfile.json', 'utf8'));
		var org = util.getOrg();
		
		if(obj){
			dbCredentials.host = obj[org].host;
			dbCredentials.port = obj[org].port;
			dbCredentials.user = obj[org].user;
			dbCredentials.password = obj[org].pass;
			dbCredentials.url = obj[org].url;
			isValidDatabase = true;
		}else{
			console.log('Connection error');
		}

		if(isValidDatabase){
			cloudant = require('cloudant')(dbCredentials.url);
			cloudant.db.get(database, function (err, res) {
				if (err) {
					console.log('[db] creating new database ', database);
					cloudant.db.create(database, function (err, res) {
						if (err) {
							console.error('[db] could not create db ', err);
						}
					});
				}
			}),
			this.db = cloudant.use(database);
			status = "connected";
		}
	},
	//ATTACH
	attach: function(id, filename, data, filetype, params) {
		//console.log("[db] attach");
		var deferred = q.defer();
		this.db.attachment.insert(id, filename, data, filetype, params, function(err, doc) {
			if(err) {
				deferred.reject({"status": 500, "body": {}, "error": err});
			} else{
				deferred.resolve({"status": 200, "body": doc});
			}
		});
		return deferred.promise;
	},
	//GET ATTACHMENT
	getattachment: function(id, filename, params, res) {
		var deferred = q.defer();
		
		try{
			res.setHeader('Content-disposition', 'attachment; filename='+filename);
			this.db.attachment.get(id, filename).pipe(res, function(error){
				if(error) { 
					 deferred.reject({"status": 500, "body": {}, "error": error});
				}
			});
		}catch(e){
			deferred.reject({"status": 500, "body": {}, "error": e.toString()});
		}
		return deferred.promise;
	},
	//DELETE ATTACHMENT
	delattachment: function(id, filename, params) {
		console.log("[db] delete attachment");
		var deferred = q.defer();

		this.db.attachment.destroy(id, filename, params, function(err, body) {
			if(err) {
				deferred.reject({"status": 500, "body": {}, "error": err});
			} else {
				deferred.resolve({"status": 200, "body": body});
			}
		});
		return deferred.promise;
	},
	// MERGE SAVE
	mergesave: function(doc1, userdoc) {
		//console.log(doc1);
		var deferred = q.defer();
		// Check if there is a new version of same document in cloudant
		var docid = userdoc._id
		this.db.get(docid, '', function(error, data) {
			var doc2 = data;
			//console.log(doc1._rev);
			//console.log(doc2._rev);
			if(doc1._rev==doc2._rev) {
				// No changes detected, so userdoc can be saved
				delete userdoc.fieldslist;
				module.exports.save(userdoc).then(function(data2) {
					if(data2.status!="200" && data2.err) {
						deferred.reject({"status": 500, "body": {}, "error": data2.err});
					} else{
						deferred.resolve({"status": 200, "body": data2.body});
					}					
				});
			} else {
				// A change is detected, checking if the fields can be merged between doc2 and userdoc
				userdoc._rev=doc2._rev; // updating the userdoc to be the last version
				console.log("Conflict");
				var conflictfields = [];
				try {
					if(userdoc.fieldslist) { // the list of the editable fields to be looked for
						var fieldslist = userdoc.fieldslist.split(","); // convert into an array
						for(var i=0;i<fieldslist.length;i++) {
							var field = fieldslist[i].split(":")[0]; //field;
							var label = fieldslist[i].split(":")[1]; //label;
							// Checking and merging conflicted fields
							//console.log("Comparing field: " + field + ", value:" + userdoc[field]);
							var count = 0;
							if(doc1[field]!=userdoc[field]) count++;
							if(doc1[field]!=doc2[field]) count++;
							if(userdoc[field]!=doc2[field]) count++;
							if(count>=3) { // Conflict detected
								//console.log("Conflicted fields found");
								conflictfields.push({"field":field, "label":label, "old":doc2[field], "new":userdoc[field]});
							} else {
								// Only merge if doc2 has a different value from doc1 and userdoc (and doc1 and userdoc are the same)
								if(doc1[field]==userdoc[field]) {
									userdoc[field] = doc2[field];
								}
								//console.log(field + " => " + userdoc[field]);
							}
						}
						// Merge fields from doc2 into doc1, if they are changed and don't belong to editable fields' list
						for (var fld in doc1) {
							//console.log(fld);
							if (doc1.hasOwnProperty(fld)) {
								try {
									// Check if it's a non-mapped field (probably read-only or system control)
									var flag = false;
									for(var i=0;i<fieldslist.length;i++) {
										if(fieldslist[i].split(":")[0]==fld) {
											flag = true;
										}	
									}
									// The field does not exist, merging userdoc with the value from doc2
									if(!flag) {
										//console.log(fld+":"+doc1[fld]+" / " + userdoc[fld] + " / " + doc2[fld]);
										if(doc1[fld]==userdoc[fld]) {
											userdoc[fld] = doc2[fld];
										}
									}
								} catch(e) {
									console.log(e)
								} finally {}
							}
						}					
						if(conflictfields.length>0) {
							//console.log(conflictfields.length + " conflicts found.");
							try {
								deferred.resolve({"status": 999, "id": docid, "body": userdoc, "conflictfields": conflictfields});
							}catch(e){
								console.log(e.stack);
							}
						} else {
							//console.log("No conflicts detected!");
							// No conflicts detected, the userdoc (with all merges) can be saved
							delete userdoc.fieldslist; // Delete temp fieldlist field
							module.exports.save(userdoc).then(function(data2) {
								if(data2.status!="200" && data2.err) {
									deferred.reject({"status": 500, "body": {}, "error": data2.err});
								} else{
									deferred.resolve({"status": 200, "body": data2.body});
								}					
							});						
						}
					} else {
						//console.log("No conflicts detected!");
						// No list of fields supplied, it means no need to check anything
						delete userdoc.fieldslist; // Delete temp fieldlist field
						module.exports.save(userdoc).then(function(data2) {
							if(data2.status!="200" && data2.err) {
								deferred.reject({"status": 500, "body": {}, "error": data2.err});
							} else{
								deferred.resolve({"status": 200, "body": data2.body});
							}					
						});				
					}
				} catch(e) {
					console.log(e);
				}
			}
		})
		return deferred.promise;
	}		
};

module.exports = DB;
