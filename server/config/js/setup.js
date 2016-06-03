/**************************************************************************************************
 * 
 * Setup code for MIRA Web
 * Developed by :                                                
 * Date:27 May 2016
 * 
 */

var q  = require("q");

var setup = {
	/* listSetup will get if exist required parameters */
	listSetup: function(req, res, db, keyNameM, keyNameBU) {
		var deferred = q.defer();
		var obj = {
			selector:{
				"_id": {"$gt":0},
				"keyName": {
						"$in": [keyNameBU, keyNameM]
					}
			}
		};
		db.find(obj).then(function(data){
			var numDocs = data.body.docs.length;
			deferred.resolve({"status": 200, "numDocs": numDocs});
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},
	/* Load needed parameters data in setup page */
	getSetup: function(req, res, db, keyNameM, keyNameBU ) {
		var deferred = q.defer();
		var obj = {
		selector:{
			"_id": {"$gt":0},
			"keyName": {
					"$in": [keyNameBU, keyNameM]
				}
			}
		};
		db.find(obj).then(function(data){		
			var numDocs = data.body.docs.length;
			var value = [];
			if(numDocs <= 2) {
				for(var i = 0; i < numDocs; i++) {
					var doc = data.body.docs[i];
					if(doc.keyName == keyNameBU || doc.keyName == keyNameM){
						value.push(data.body.docs[i]);
					}
				}
				deferred.resolve({"status": 200, "value": value});
			}
			else{
				deferred.reject({"status": 500, "error": err});
			}
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},
	/* Save setup parameters in cloudant */
	saveSetup: function(req, res, db) {
		var deferred = q.defer();		
		var value1 = JSON.parse(req.body.fldvalue);
		var value2 = JSON.parse(req.body.fldvalueM);
		var obj1 = {
				"docType": "setup",
				"keyName": req.body.fldname,
				"active": req.body.fldtrue,
				"value": value1,
				"description": req.body.flddesc
		};
		if (req.body.idBU != '') {
			obj1._id = req.body.idBU;
			obj1._rev = req.body.revBU;
		}
		var obj2 = {
				"docType": "setup",
				"keyName": req.body.fldnameM,
				"active": req.body.fldtrueM,
				"value": value2,	
				"description": req.body.flddescM
		};
		if (req.body.idCM != '') {
			obj2._id = req.body.idCM;
			obj2._rev = req.body.revCM;
		}
		db.save(obj1).then(function(data1){
			console.log("obj1 saved successfully");			
			db.save(obj2).then(function(data2){
				console.log("obj2 saved successfully");
				deferred.resolve({"status": 200, "msg": "OK"});
			}).catch(function(err){
				console.log("[routes][saveSetup] - " + err.error);
				deferred.reject({"status": 500, "error": err});
			});
		}).catch(function(err){
			console.log("[routes][saveSetup] - " + err.error);
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},
};
module.exports = setup;