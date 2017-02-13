/**************************************************************************************************
*
* Database for MIRA Web
* Developed by : Carlos K Takata
* Date: 13 Feb 2017
*
*/

var q  = require("q");

var database = {
	/* Display Databases */
	listDB: function(req, db) {
		var deferred = q.defer();
		var dbs = [];
		var obj = {
			selector:{
				"_id": {"$gt":0},
				"keyName": "Database"
			}
		};
		try{
			db.find(obj).then(function(data){
				var doc = data.body.docs[0].value;
				for (i=0; i<doc.length; i++){
					if(doc[i].option == "enable"){
						dbs.push({name : doc[i].database, alias: doc[i].alias});
					}
				}
				deferred.resolve({"status": 200, "dbs": dbs});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	/* Selected Database */
	saveDB: function(req, db) {
		var deferred = q.defer();
		try {
			console.log(req.body.selectedDB);
			db.connect(req.body.selectedDB);
			deferred.resolve({"status": 200, "db": req.body.selectedDB});			
		}catch(e){
			deferred.reject({"status": 500, "error": e.stack});
		}		
		return deferred.promise;
	}		
};
module.exports = database;
