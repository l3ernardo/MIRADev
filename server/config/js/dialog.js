/**************************************************************************************************
 * 
 * Dialog code for MIRA Web
 * Developed by :                                                
 * Date:27 May 2016
 * 
 */

var q  = require("q");

var dialog = {
	/* Display Non disclosure */
	displayNonDisclosure: function(req, res, db) {
		var deferred = q.defer();
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
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},
	/* Display Bulletin */
	displayBulletin: function(req, res, db) {
		var deferred = q.defer();
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
				deferred.reject({"status": 500, "error": err});
			});			
		} else {
			deferred.reject({"status": 500, "error": "n/a"});
		}
		return deferred.promise;
	}
}
module.exports = dialog;