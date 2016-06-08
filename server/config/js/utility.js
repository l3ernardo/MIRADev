/**************************************************************************************************
 * 
 * Utility code for MIRA Web
 * Developed by :                                                
 * Date:01 June 2016
 * 
 */

var q  = require("q");

var util = {
	/* Get person data from faces */
	getPersonData: function(req, res) {
		var deferred = q.defer();
		url = "https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmperson/(cn="+req.query.search+"*).search/byjson"
		require('request').get(url, function(err, response, body) {
			deferred.resolve({"status": 200, "doc": body});
		})
		return deferred.promise;
	},
	getPeopleData: function(req, res) {
		var deferred = q.defer();
		var member = [];
		url = "https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmperson/(cn="+req.query.search+"*).search/byjson"
		require('request').get(url, function(err, response, body) {
			if (err) {
				deferred.resolve({"status": 500, "error": err});
			}
			try {
				var doc = JSON.parse(body);	
				console.log('Found: ' + (doc.search.return.count) + ' records')
				for (var i = 0; i < doc.search.return.count; i++) {
					//console.log(doc.search.entry[i].dn)
					var callupname = '';
					var cn = '';
					var ibmserialnumber = '';
					var serialnumber = '';
					var notesemail = '';
					var uid = '';
					var mail = '';
					var internalmaildrop = '';				
					for(var j=0;j<doc.search.entry[i].attribute.length;j++) {
						//console.log(doc.search.entry[i].attribute.length);
						switch(doc.search.entry[i].attribute[j].name) {
							case 'callupname':
								callupname = doc.search.entry[i].attribute[j].value[0];
								break;
							case 'cn':
								cn = doc.search.entry[i].attribute[j].value[0];
								break;
							case 'ibmserialnumber':
								ibmserialnumber = doc.search.entry[i].attribute[j].value[0];
								break;
							case 'serialnumber':
								serialnumber = doc.search.entry[i].attribute[j].value[0];
								break;
							case 'notesemail':
								notesemail = doc.search.entry[i].attribute[j].value[0];
								break;
							case 'uid':
								uid = doc.search.entry[i].attribute[j].value[0];
								break;
							case 'mail':
								mail = doc.search.entry[i].attribute[j].value[0];
								break;
							case 'internalmaildrop':
								internalmaildrop = doc.search.entry[i].attribute[j].value[0];
								break;									
						}
					}
					/*
					member.push({
						"callupname": callupname,
						"cn": cn,
						"ibmserialnumber": ibmserialnumber,
						"serialnumber": serialnumber,
						"notesemail": notesemail,
						"uid": uid,
						"mail": mail,
						"internalmaildrop": internalmaildrop
					});				
					*/
					member.push(cn+" ("+mail+")");
				}
				deferred.resolve({"status": 200, "doc": member});
			} catch(e) {
				deferred.resolve({"status": 500, "error": e});
			}
			
		})
	return deferred.promise;		
	}
}
module.exports = util;