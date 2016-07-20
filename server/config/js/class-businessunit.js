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
	listBU: function(req, db) {
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
	saveBU: function(req, db) {
		var deferred = q.defer();
		var value = req.body.selectedBU;
		var obj = {
			selector:{
				"_id": {"$gt":0},
				"keyName": "MIRAVersion"
			}
		};
		db.find(obj).then(function(data){
			var doc = data.body.docs[0];
			console.log(doc.value);
			deferred.resolve({"status": 200, "bunit": value, "version": doc.value.title + " " + doc.value.version});
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});	
		return deferred.promise;		
	}
};
module.exports = businessunit;
