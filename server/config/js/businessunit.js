/**************************************************************************************************
 * 
 * Business Unit code for MIRA Web
 * Developed by : Gabriel Fuentes
 * Date: 25 May 2016
 * 
 */

var q  = require("q");

var businessunit = {
	/* Display Business Units */
	listBU: function(req, res, db) {
		var deferred = q.defer();
		var obj = {
			selector:{
				"_id": {"$gt":0},
				"keyName": "BusinessUnit"
			}
		};
		db.find(obj).then(function(data){
			var doc = data.body.docs;
			deferred.resolve({"status": 200, "doc": doc});
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},
	/* Save parameter in session */
	saveBU: function(req, res, db) {
		var deferred = q.defer();
		var value = req.body.selectedBU;
		deferred.resolve({"status": 200, "bunit": value});
		
		return deferred.promise;		
	}
};
module.exports = businessunit;