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
var mtz = require('moment-timezone');
var xml2js = require('xml2js');

var util = {
	/* Get data from faces & bluepages */
	getPersonOrg: function(req) {
		var deferred = q.defer();
		try {
			url = varConf.bpOrgURL.replace('%t',req.query.search);
			require('request').get(url, function(err, response, body) {
				if(err) {
					deferred.resolve({"status": 500, "error": err});
				}
				deferred.resolve({"status": 200, "doc": body});
			});
			return deferred.promise;
		} catch(e) {
			deferred.resolve({"status": 500, "error": e});
		}
	},
	getPersonDiv: function(req) {
		var deferred = q.defer();
		try {
			url = varConf.bpDivURL.replace('%t',req.query.search);
			require('request').get(url, function(err, response, body) {
				if(err) {
					deferred.resolve({"status": 500, "error": err});
				}
				deferred.resolve({"status": 200, "doc": body});
			});
			return deferred.promise;
		} catch(e) {
			deferred.resolve({"status": 500, "error": e});
		}
	},
	getPersonData: function(req) {
		var deferred = q.defer();
		try {
			url = varConf.bpURL.replace('%t',req.query.search).replace('%f',req.query.field);
			require('request').get(url, function(err, response, body) {
				if(err) {
					deferred.resolve({"status": 500, "error": err});
				}
				deferred.resolve({"status": 200, "doc": body});
			});
			return deferred.promise;
		} catch(e) {
			deferred.resolve({"status": 500, "error": e});
		}
	},
	getPeopleData: function(req) {
		var deferred = q.defer();
		var member = [];
		url = varConf.facesURLcn.replace('%t',req.query.search);
		require('request').get(url, function(err, response, body) {
			if (err) {
				url = varConf.bpURL.replace('%t',req.query.search).replace('%f','cn');
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
	getBluegroup: function(req) {
		var deferred = q.defer();
		var parser = new xml2js.Parser();
		var bg = [];
		var bgemail = [];
		var bgcn = [];
		var bguid = [];
		var urlemail = varConf.bgURL.replace('%t',req.query.group).replace('%f','email');
		var urlcn = varConf.bgURL.replace('%t',req.query.group).replace('%f','cn');
		var urluid = varConf.bgURL.replace('%t',req.query.group).replace('%f','uid');
		try {
			require('request').get(urlemail, function(err, response, body) {
				if(err) {
					deferred.reject({"status": 500, "error": err});
				} else {
					parser.parseString(body, function (err, result) {
							result.group.member.forEach(function(member) {
								bgemail.push({"email":member})
							})
						});
					try {
						require('request').get(urlcn, function(err, response, body2) {
							if(err) {
								deferred.reject({"status": 500, "error": err});
							} else {
								parser.parseString(body2, function (err, result) {
									result.group.member.forEach(function(member) {
										bgcn.push({"cn":member})
									})
								});
								try {
									require('request').get(urluid, function(err, response, body3) {
										if(err) {
											deferred.reject({"status": 500, "error": err});
										} else {
											parser.parseString(body3, function (err, result) {
												result.group.member.forEach(function(member) {
													bguid.push({"uid":member})
												})
											})
											// We got all values, now return in a single JSON
											for(var i=0;i<bgemail.length;i++) {
												bg.push({"member": bgcn[i].cn + " (" + bgemail[i].email+ ")","uid":bguid[i].uid})
											}
											bg.sort(function(a, b){
												var nameA=a.member.toLowerCase(), nameB=b.member.toLowerCase()
												if (nameA < nameB) //sort string ascending
													return -1
												if (nameA > nameB)
													return 1
												return 0 //default return value (no sorting)
											})
											deferred.resolve({"status": 200, "doc": bg})
										}
									})
									return deferred.promise;
								} catch(e) {
									deferred.reject({"status": 500, "error": e});
								}
							}
						});
						return deferred.promise;
					} catch(e) {
						deferred.reject({"status": 500, "error": e});
					}
				}
			});
			return deferred.promise;
		} catch(e) {
			deferred.reject({"status": 500, "error": e});
		}
	},
	addMember: function(group,uid) {
		var deferred = q.defer();
		try {
			// Get URL credentials
			var credentials = JSON.parse(fs.readFileSync('APIProfile.json', 'utf8'));
			var host = credentials.host;
			var username = credentials.username;
			var password = credentials.password;
			url = varConf.addMembersURL.replace('%g',group).replace('%u',uid);
			console.log(url);
			var options = {
				uri: url,
				headers: {
					'User-Agent': 'request',
				'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
				}
			};
			//console.log(url);
			require('request').get(options, function(err, response, body) {
				if(err) {
					deferred.resolve({"status": 500, "error": err});
				}
				deferred.resolve({"status": 200, "doc": body});
			});
			return deferred.promise;
		} catch(e) {
			deferred.resolve({"status": 500, "error": e});
		}
	},
	delMember: function(group,uid) {
		var deferred = q.defer();
		try {
			// Get URL credentials
			var credentials = JSON.parse(fs.readFileSync('APIProfile.json', 'utf8'));
			var host = credentials.host;
			var username = credentials.username;
			var password = credentials.password;
			url = varConf.delMembersURL.replace('%g',group).replace('%u',uid);
			//console.log(url);
			var options = {
				uri: url,
				headers: {
					'User-Agent': 'request',
				'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
				}
			};
			console.log(url);
			require('request').get(options, function(err, response, body) {
				if(err) {
					deferred.resolve({"status": 500, "error": err});
				}
				deferred.resolve({"status": 200, "doc": body});
			});
			return deferred.promise;
		} catch(e) {
			deferred.resolve({"status": 500, "error": e});
		}
	},
	/* Upload a file*/
	uploadFile: function (parentid, req, db){
		var deferred = q.defer();
		try{
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
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	//Download the selected file
	downloadFile: function (req, res, db){
		var deferred = q.defer();
		try{
			var id = req.query.id;
			var filename = req.query.filename;
			db.getattachment(id, filename, {}, res).then(function(resp){
				if(resp.error){
					deferred.reject({"status": 500, "error": resp.error});
				}
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	//Delete the selected file
	deleteFile: function (req, db){
		var deferred = q.defer();
		try{
			var names=req.query.filename
			var id = req.query.id;
			db.get(id, {attachments: true}).then(function(existingdoc) {
				var rev = existingdoc.body._rev;
				db.del(id, rev).then(function(resp) {
					deferred.resolve({"status": 200});
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	//Delete files by parentid
	deleteFilesParentID: function (parentid, db){
		var deferred = q.defer();
		try{
			var doc;
			var object = {
				selector:{
					"_id": {"$gt":0},
					"parentid": parentid,
					"type": "Attachments"
				}
			};
			db.find(object).then(function(data){
				doc = data.body.docs;
				for (var i = 0; i < doc.length; ++i) {
					db.del(doc[i]._id, doc[i]._rev).then(function(resp) {
						deferred.resolve({"status": 200});
					}).catch(function(err) {
						deferred.reject({"status": 500, "error": err.error.reason});
					});
				}
				deferred.resolve({"status": 200});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	//Delete files by ids
	deleteFilesByIDs: function (filesIds, db){
		var deferred = q.defer();
		try{
			var object;
			var doc;
			var arrLinks = JSON.parse(filesIds);
			for(i=0; i<arrLinks.length; i++){
				object = {
					selector:{
						"_id": arrLinks[i].attachId,
						"type": "Attachments"
					}
				};
				db.find(object).then(function(data){
					doc = data.body.docs;
					db.del(doc[0]._id, doc[0]._rev).then(function(resp) {
						deferred.resolve({"status": 200});
					}).catch(function(err) {
						deferred.reject({"status": 500, "error": err.error.reason});
					});
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	//Update Files with the parentid
	updateFilesParentID: function (parentid, filesIds, db){
		var deferred = q.defer();
		try{
			var object;
			var doc;
			var arrLinks = JSON.parse(filesIds);
			for(i=0; i<arrLinks.length; i++){
				object = {
					selector:{
						"_id": arrLinks[i].attachId,
						"type": "Attachments"
					}
				};
				db.find(object).then(function(data){
					doc = data.body.docs;
					// Update Parent ID
					doc[0].parentid = parentid;
					db.save(doc[0]).then(function(data){
						deferred.resolve(data);
					}).catch(function(err) {
						deferred.reject({"status": 500, "error": err.error.reason});
					});
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	/***************************************************/
	//Generic HTTP request
	callhttp: function(url) {
		var deferred = q.defer();
		// Get URL credentials
		var credentials = JSON.parse(fs.readFileSync('APIProfile.json', 'utf8'));
		var host = credentials.host;
		var username = credentials.username;
		var password = credentials.password;
		if((url).indexOf('?')!=-1) {
			url = url+'&'+Math.random().toString()
		} else {
			url = url+'?'+Math.random().toString()
		}
		// console.log(url);
		var options = {
			uri: url,
			headers: {
				'User-Agent': 'request',
			'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
			}
		};
		try {
			require('request').get(options, process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0", function(error, res, body) {
				if (error) {
					console.log('There was an error: '+ error);
					deferred.reject({"status": 500, "error": error});
				} else {
					console.log('Http request ran');
					try {
						deferred.resolve({"status": 200, "doc": JSON.parse(body)});
					} catch(e) {
						deferred.resolve({"status": 200, "doc": body});
					}
				}
			});
		} catch(e) {
			deferred.resolve({"status": 500, "error": e});
		}
		return deferred.promise;
	},

	findAndRemove: function(array, property, value) {
		 array.forEach(function(result, index) {
			if(result[property] === value) {
				array.splice(index, 1);
			}
		});
	},
	//Get unique values and sort an array
	sort_unique: function(arr) {
		return arr.sort().filter(function(el,i,a) {
			return (i==a.indexOf(el));
		});
	},
	//check if a value exists in an object
	getIndex: function(arr,key,value) {
		for(var i = 0; i < arr.length; i += 1) {
        if(arr[i][key] === value) {
            return i;
        }
    }
    return -1;
	},


	//load the groups to be display
	loadBlueGroupPage: function(db,req){

	
		var deferred = q.defer();
		try{

			var obj = {
			selector : {
			//"_id": req.query.id
			"_id": {"$gt":0},
			keyName: "Bluegroups"
		}};

		db.find(obj).then(function(data){
		var doc = JSON.stringify(data.body.docs[0].value);	
		deferred.resolve(doc);
		}).catch(function(err) {
			console.log("[routes][bluegroups] - " + err);
			deferred.reject({"status": 500, "error": err.error.reason});
		});


		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
	
		return deferred.promise;
	},//en load blue group page

	//add a group member on clud
	addGroupMember: function(db,req, members){
                var deferred = q.defer();
                //console.log("enter");
                //get the list of all users per group
                try{

                db.view("bluegroups","view-bluegroups", {include_docs: true}).then(function(data){ //download the group information
                        var response = data.body.rows[0].doc;
                        response.area[req.session.businessunit][req.body.group] = members;
                                
                         db.save(response).then(function (data){
                                     deferred.resolve({"status": 200});
                         }).catch(function(err) {
                                      
                                     deferred.reject({"status": 500, "error": err.error.reason});
                         });
                                deferred.resolve(response);


                }).catch(function(err) {
                        console.log("[routes][bluegroups] - " + err);
                        deferred.reject({"status": 500, "error": err.error.reason});
                });

                }catch(e){
                        deferred.reject({"status": 500, "error": e});
                }
                return deferred.promise;
        }, 



	getArea: function(req,db) {
		var deferred = q.defer();
		var bg = [];
		try{
			db.view('userBG', 'Area', {include_docs: true}).then(function(data) {
				for(var i=0;i<data.body.rows[0].doc.area[req.session.businessunit][req.query.group].length;i++) {
					bg.push({"member": data.body.rows[0].doc.area[req.session.businessunit][req.query.group][i].name + " (" + data.body.rows[0].doc.area[req.session.businessunit][req.query.group][i].id+ ")","uid":data.body.rows[0].doc.area[req.session.businessunit][req.query.group][i].uid})
				}
				bg.sort(function(a, b){
					var nameA=a.member.toLowerCase(), nameB=b.member.toLowerCase()
					if (nameA < nameB) //sort string ascending
						return -1
					if (nameA > nameB)
						return 1
					return 0 //default return value (no sorting)
				});
				deferred.resolve({"status": 200, "doc": bg});
			}).catch(function(error){
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	
	getDateTime: function(dt, format) {
		var now;
		if(dt==undefined || dt=="") {
			now = moment(new Date());
		} else {
			// Acceptable format: YYYY-MM-DD HH:MM:SS
			try {
				var newdate = dt.split(" ");
				var year = newdate[0].split("-")[0];
				var month = newdate[0].split("-")[1];
				var day = newdate[0].split("-")[2];
				var hour = newdate[1].split("-")[0];
				var minute = newdate[1].split("-")[1];
				var second = newdate[1].split("-")[2];
				now = moment(new Date(year, month, day, hour, minute, second));
			} catch(e) {
				console.log("[class-utility][getDateTime] - Invalid date format (YYY-MM-DD HH:MM:SS): " + dt);
				now = moment(new Date());
			}
		}
		switch(format) {
			case "date":
				return now.format("MM/DD/YYYY");
			break;
			case "time":
				return now.format("hh:mmA") + " " + mtz.tz(mtz.tz.guess()).zoneAbbr();
			break;
			default:
				return now.format("MM/DD/YYYY") + " " + now.format("hh:mmA") + " " + mtz.tz(mtz.tz.guess()).zoneAbbr();
			break;
		}
	},

	logDoc: function(req, olddoc, newdoc) {
		// this function will compare both documents and provide a list of changed fields
		var fldlist = [];
		if(olddoc=="") {
			var addlog = {
				"name": req.session.user.notesId,
				"date": module.exports.getDateTime("","date"),
				"time": module.exports.getDateTime("","time")
			};
			return {"Log": addlog, "fldlist": fldlist}			
		} else {
			for (fld in newdoc) {
				var cp1 = JSON.stringify(olddoc[fld]);
				var cp2 = JSON.stringify(newdoc[fld]);
				if(cp1!=cp2) {
					fldlist.push("Field (" + fld + "): " + cp1);
				}
			}
			if(fldlist.length>0 && fldlist[0]!="") {
				var addlog = {
					"name": req.session.user.notesId,
					"date": module.exports.getDateTime("","date"),
					"time": module.exports.getDateTime("","time")
				};
				var buff = olddoc["Log"];
				buff.push(addlog);
				return {"Log": buff, "fldlist": fldlist}
			} else {
				return {"Log": olddoc["Log"], "fldlist": ""}
			}
		}
	}

}
module.exports = util;
