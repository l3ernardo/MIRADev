/**************************************************************************************************
 * 
 * Utility code for MIRA Web
 * Developed by : Carlos Kenji Takata                                               
 * Date:01 June 2016
 * 
 */
var varConf = require('../../../configuration');
var q  = require("q");
var moment = require('moment');

var util = {
	/* Get person data from faces */
	getPersonData: function(req, res) {
		var deferred = q.defer();
		url = varConf.bpURLmail.replace('%t',req.query.search);
		require('request').get(url, function(err, response, body) {
			deferred.resolve({"status": 200, "doc": body});
		})
		return deferred.promise;
	},
	getPeopleData: function(req, res) {
		var deferred = q.defer();
		var member = [];
		url = varConf.bpURLcn.replace('%t',req.query.search);
		require('request').get(url, function(err, response, body) {
			if (err) {
				deferred.resolve({"status": 500, "error": err});
			}
			try {
				var doc = JSON.parse(body);	
				for (var i = 0; i < doc.length; i++) {
					member.push({"name": doc[i].name, "email":doc[i].email});
				}
				deferred.resolve({"status": 200, "doc": member});
			} catch(e) {
				deferred.resolve({"status": 500, "error": e});
			}
			
		})
	return deferred.promise;		
	},
	/* Upload a file*/
	uploadFile: function (parentid, req, db){
		var deferred = q.defer();
		var object;
		var date = new Date();
		var filenames = req.files.upload;	

		object = {
			"parentid": parentid,
			"type": "Attachments",
			"creation_date": moment(date).format("DD-MM-YYYY HH:mm")
		};

		db.save(object).then(function(doc) {
			if (filenames) {
				var file = filenames; console.log('filenames:'+filenames); 
				fs.readFile(file.path, function(err, data) {
					if (!err) { 
						if (file) { console.log('id del file: '+doc.body.id+'  file.name: '+file.name);
							db.attach(doc.body.id, file.name, data, file.type, {rev: doc.body.rev}).then(function(obj) {
								doc.body.name= file.name;
								deferred.resolve({"status": 200, "doc": doc.body})
							}).catch(function(error){
								deferred.reject({"status": 500, "error": err});
							});
						}
					}
					else { 
						deferred.reject({"status": 500, "error": err});
					}
				});
			}else {
				deferred.resolve({"status": 200, "doc":doc.body});
			}				
		}).catch(function(error) {
			deferred.reject({"status": 500, "error": err});
		})
		return deferred.promise;
	},
	downloadFile: function (req, res,db){
		var deferred = q.defer();
		var id = req.query.id;
		var filename = req.query.filename; console.log('download  id:'+id+' download file:'+filename);
		db.getattachment(id, filename, {}).then(function(resp){
			        res.body = resp.body;
			        deferred.resolve({"status": 200});					
		}).catch(function(err) {
			    deferred.reject({"status": 500, "error - download file": err});
				console.log(err);
				});		
		return deferred.promise;	
	},
	deleteAttachment: function (req, res,db){
		var deferred = q.defer();
		var names=req.query.filename
		var id = req.query.id; console.log('this is id:'+id+'this is file:'+names);
		db.get(id, {attachments: true}).then(function(existingdoc) {
		var rev = existingdoc.body._rev;
				db.del(id, rev).then(function(resp) {console.log('1');
					console.log("Document deleted successfully");
					deferred.resolve({"status": 200});
				}).catch(function(err) {console.log('2');
				         deferred.reject({"status": 500, "error": err});
							console.log(err);
					});
			}).catch(function(err) {console.log('3');
			        deferred.reject({"status": 500, "error": err});
					console.log(err);
		});		
		return deferred.promise;	
	}
}
module.exports = util;