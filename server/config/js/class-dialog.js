/**************************************************************************************************
 *
 * Dialog code for MIRA Web
 * Developed by : Carlos Kenji Takata
 * Date: 27 May 2016
 *
 */

var q  = require("q");

var dialog = {
	/* Display Non disclosure */
	displayNonDisclosure: function(db) {
		var deferred = q.defer();
		try{
			var obj = {
				selector:{
					"_id": {"$gt":0},
					"keyName": "NonDisclosure"
				}
			};
			db.find(obj).then(function(data){
				var doc = data.body.docs;
				deferred.resolve({"status": 200, "doc": doc});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	/* Display Bulletin */
	displayBulletin: function(req, db) {
		var deferred = q.defer();
		try{
			// Display Bulletin if available
			if(req.session.businessunit) {
				var obj = {
					selector:{
						"_id": {"$gt":0},
						"keyName": req.session.businessunit + "_Bulletin"
					}
				};
				db.find(obj).then(function(data){
					var doc = data.body.docs;
					deferred.resolve({"status": 200, "doc": doc});
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			} else {
				deferred.reject({"status": 500, "error": "n/a"});
			}
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
//Display Overview
	displayOverview : function(db){
		var deferred = q.defer();
		try{
			var obj = {
				selector:{
					"_id": {"$gt":0},
					"keyName": "IndexOverview"
				}
			};
			db.find(obj).then(function(data){
				var doc = data.body.docs;
				deferred.resolve({"status": 200, "doc": doc});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	}
}
module.exports = dialog;
