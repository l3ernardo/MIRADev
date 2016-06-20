/**************************************************************************************************
 * 
 * Utility code for MIRA Web
 * Developed by : Carlos Kenji Takata                                               
 * Date:01 June 2016
 * 
 */
var varConf = require('../../../configuration');
var q  = require("q");

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
	}
}
module.exports = util;