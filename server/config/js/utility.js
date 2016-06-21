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
		url = varConf.facesURLmail.replace('%t',req.query.search);
		require('request').get(url, function(err, response, body) {
			if (err) {
				url = varConf.bpURLmail.replace('%t',req.query.search);
				require('request').get(url, function(err, response, body) {
					if(err) {
						deferred.resolve({"status": 500, "error": err});
					}
					deferred.resolve({"status": 200, "doc": body});
				});
				return deferred.promise;
			}			
			deferred.resolve({"status": 200, "doc": body});
		});
		return deferred.promise;
	},
	getPeopleData: function(req, res) {
		var deferred = q.defer();
		var member = [];
		url = varConf.facesURLcn.replace('%t',req.query.search);
		require('request').get(url, function(err, response, body) {
			if (err) {
				url = varConf.bpURLcn.replace('%t',req.query.search);
				require('request').get(url, function(err, response, body) {
					if(err) {
						deferred.resolve({"status": 500, "error": err});
					}
					try {
						var doc = JSON.parse(body);
						//console.log(doc.search.return.count);
						for (var i = 0; i < doc.search.return.count; i++) {
							var cn = '';
							var mail = '';							
							for(var j=0;j<doc.search.entry[i].attribute.length;j++) {
								switch(doc.search.entry[i].attribute[j].name) {
									case 'cn':
										cn = doc.search.entry[i].attribute[j].value[0];
										break;
									case 'mail':
										mail = doc.search.entry[i].attribute[j].value[0];
										break;										
								}
							}
							member.push({"name": cn, "email":mail});
						}
						deferred.resolve({"status": 200, "doc": member});
					} catch(e) {
						deferred.resolve({"status": 500, "error": e});
					}
				});
				return deferred.promise;
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
		});
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
				var file = filenames;
				fs.readFile(file.path, function(err, data) {
					if (!err) { 
						if (file) {
							db.attach(doc.body.id, file.name, data, file.type, {rev: doc.body.rev}).then(function(obj) {
								doc.body.name= file.name;
								deferred.resolve({"status": 200, "doc": doc.body})
							}).catch(function(error){
								deferred.reject({"status": 500, "error": error});
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
			deferred.reject({"status": 500, "error": error});
		})
		return deferred.promise;
	},
	//Download the selected file
	downloadFile: function (req, res,db){
		var deferred = q.defer();
		var id = req.query.id;
		var filename = req.query.filename;
		db.getattachment(id, filename, {}).then(function(resp){
			res.body = resp.body;
			deferred.resolve({"status": 200});
		}).catch(function(err) {
			deferred.reject({"status": 500, "error - download file": err});
		});		
		return deferred.promise;	
	},
	//Delete the selected file
	deleteAttachment: function (req, res,db){
		var deferred = q.defer();
		var names=req.query.filename
		var id = req.query.id;
		db.get(id, {attachments: true}).then(function(existingdoc) {
			var rev = existingdoc.body._rev;
			db.del(id, rev).then(function(resp) {
				deferred.resolve({"status": 200});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err});
			});
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});		
		return deferred.promise;	
	}
}
module.exports = util;