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
var fs = require('fs');

Array.prototype.unique = function() {
	var a = this.concat();
	for(var i=0; i<a.length; ++i) {
		for(var j=i+1; j<a.length; ++j) {
			if(a[i] === a[j])
				a.splice(j--, 1);
		}
	}

	return a;
};

var deleteUsers = function(deletes, list){
	try{
		for(var i=0;i<deletes.length; i++){
			var index = list.indexOf(deletes[i]);
			if(index > -1){
				list.splice(index,1);
			}
		}
	}catch(e){console.log(e);}

	return list;
}

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
				//console.log(res)
				if (error) {
					console.log('There was an error: '+ error);
					deferred.reject({"status": 500, "error": error});
				} else {
					if(res.statusCode == 200){
						try {
							deferred.resolve({"status": 200, "doc": JSON.parse(body)});
						} catch(e) {
							deferred.resolve({"status": 200, "doc": body});
						}
					}
					else{
						deferred.reject({"status": res.statusCode, "error": res.body});

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
			db.view('bluegroups', 'view-bluegroups', {include_docs: true}).then(function(data) {
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
	},
	resolveGeo: function(id,type,req) {
		var returnValue = id;
		try{
			if(type=="IOT") {
				if(typeof global.hierarchy.BU_IOT[id] !== "undefined"){
						returnValue = global.hierarchy.BU_IOT[id].IOT;
				}
			}
			if(type=="IMT") {
				if(typeof global.hierarchy.BU_IMT[id] !== "undefined"){
					returnValue = global.hierarchy.BU_IMT[id].IMT;
				}
			}
			if(type=="Country") {
				for(country in global.hierarchy.countries){
					if(global.hierarchy.countries[country].id == id ){
						returnValue = country;
						break;
					}
				}
			}
			return returnValue;
		}
		catch(e){
			console.log(e);
			return "";
		}
	},
	getIOTChildren: function (id,type,req){
		var iterator;
		var entityName;
		try{
			switch(type){
				case "IOT":
					if(typeof global.hierarchy.BU_IOT[id] !== "undefined"){
						entityName = global.hierarchy.BU_IOT[id].IOT;
						iterator = global.hierarchy.IOT;
						for (var key in iterator){
							if(iterator.hasOwnProperty(key)){
								if(iterator[key].name==entityName){ console.log("getimtids")
									return util.getIMTIDs(req,iterator[key].IMTs);
								}
							}
						}
					}
					else{
						return [];
					}
					break;
				case "IMT":
					if(typeof global.hierarchy.BU_IMT[id] !== "undefined"){
						entityName = global.hierarchy.BU_IMT[id].IMT;
						iterator = global.hierarchy.IMT;
						return util.getCountryIDs(req,iterator[entityName]);
					}
					else{
						return [];
					}
					break;
				default:
					return "in correct type for function";
					break;
			}
		}
		catch(e){
			console.log(e);
			return "";
		}

	},
	getIMTIDs: function (req,IMTs){
		var result = [];
		var temp = {};
		var reqIMT = global.hierarchy.BU_IMT;
		for(i=0;i<IMTs.length;i++){
			for (var key in reqIMT){
				if(reqIMT.hasOwnProperty(key)){
					if(reqIMT[key].IMT == IMTs[i]){
					temp.docid = reqIMT[key].ID;
					temp.name = IMTs[i];
					//temp[IMTs[i]] = reqIMT[key].ID;
					result.push(temp);
					temp = {};
					}
				}
			}
		}
		return result;
	},

	getIMTNameByCountry: function (countryname){
		for(country in global.hierarchy.countries){
			if (countryname == country) {
				return global.hierarchy.countries[country].IMT;
			}
		}
		return "";
	},

	getCountryIDs: function (req,Countries){
		var result = [];
		var temp = {};
		var reqCountry = global.hierarchy.countries;
		for(i=0;i<Countries.length;i++){
			temp.docid = reqCountry[Countries[i]].id
			temp.name = Countries[i]
			result.push(temp);
			temp = {};
		}
		return result;
	},

	addUserAccessList: function(db,docid,list,accessLevel){
		var deferred = q.defer();
		try{
			var selector = {
				selector : {
					"_id": {"$gt":0},
					key: "AccessList",
					doc_id : docid
				}};

			db.find(selector).then(function(data){
				var doc = data.body.docs[0];
				try{
					if(accessLevel == "readers"){
						doc.AllReaders = doc.AllReaders.concat(list).unique();

					}else{
						if(accessLevel == "editors"){
							doc.AllEditors = doc.AllEditors.concat(list).unique();
						}
					}
				}catch(e){deferred.reject({"status": 500, "error": e});}
				db.save(doc).then(function(data){
					deferred.resolve({"status": 200, "result": "Successful Users Added"});
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}).catch(function(error){
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},

	delUserAccessList: function (db,docid,list,accessLevel){
		var deferred = q.defer();
		try{
			var selector = {
				selector : {
					"_id": {"$gt":0},
					key: "AccessList",
					doc_id : docid
				}};
			db.find(selector).then(function(data){
				var doc = data.body.docs[0];
				try{
					if(accessLevel == "readers"){
						doc.AllReaders = doc.AllReaders.concat(list).unique();
						doc.AllReaders = deleteUsers(list, doc.AllReaders);
						doc.deletes.AllReaders = doc.deletes.AllReaders.concat(list).unique();
					}else{
						if(accessLevel == "editors"){
							doc.AllEditors = doc.AllEditors.concat(list).unique();
							doc.AllEditors  = deleteUsers(list, doc.AllEditors);
							doc.deletes.AllEditors = doc.deletes.AllEditors.concat(list).unique();
						}
					}
				}catch(e){deferred.reject({"status": 500, "error": e});}
				db.save(doc).then(function(data){
					deferred.resolve({"status": 200, "result": "Successful Users Deleted"});
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}).catch(function(error){
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},

	getAccessDoc : function(db,docid){
		var deferred = q.defer();
		try{
			var selector = {
				selector : {
					"_id": {"$gt":0},
					key: "AccessList",
					doc_id : docid
			}};
			db.find(selector).then(function(data){
				var doc = data.body.docs[0];
				deferred.resolve({"status": 200, "result": doc});
			}).catch(function(error){
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},

	// Created by Carlos Takata - used in Dashboards
	getAllUserDocs : function(db,user){
		var deferred = q.defer();
		try{
			var query = "(?i)" + user
			var selector = {
				selector : {
					"_id": {"$gt":0},
					key: "AccessList",
					"$or": [
						{"AllEditors":{"$elemMatch":{"$regex":query}}},
						{"AllReaders":{"$elemMatch":{"$regex":query}}}
					]
			}};
			db.find(selector).then(function(data){
				var doc = data.body.docs;
				deferred.resolve({"status": 200, "result": doc});
			}).catch(function(error){
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},

	// Load manifest.yml to identify ORG
	getOrg: function() {
		var data = (fs.readFileSync('manifest.info', 'utf8'));
		var lines = data.split(/\r?\n/);
		for(var i=0;i<lines.length;i++) {
			if(lines[i].indexOf('name')!=-1) {
				return (lines[i].split(":")[1]).trim();
			}
		}
	}

}
module.exports = util;
