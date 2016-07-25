/**************************************************************************************************
 * 
 * Setup code for MIRA Web
 * Developed by : Gabriel Fuentes
 * Date:27 May 2016
 * 
 */

var q  = require("q");

var setup = {
	/* getSetup will get if exist required parameters and its data*/
	getSetup: function(req, db, keyNameM, keyNameBU) {
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
			var dataBU = [];
			var dataM = [];
			if(numDocs <= 2) {
				for(var i = 0; i < numDocs; i++) {
					var doc = data.body.docs[i];
					data.body.docs[i].value = JSON.stringify(data.body.docs[i].value);
					if(doc.keyName == keyNameBU){
						dataBU.push(data.body.docs[i]);
					}
					if(doc.keyName == keyNameM){
						dataM.push(data.body.docs[i]);
					}
				}
				value.push({
					BU : dataBU,
					Menu : dataM
				})
				deferred.resolve({"status": 200, "setup": value, "numDocs": numDocs });
			}
			else{
				deferred.reject({"status": 200, "value": value, "numDocs": numDocs });
			}
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},
	/* Save setup parameters in cloudant */
	saveSetup: function(req, db) {
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
			db.save(obj2).then(function(data2){
				deferred.resolve({"status": 200, "msg": "OK"});
			}).catch(function(err){
				deferred.reject({"status": 500, "error": err});
			});
		}).catch(function(err){
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},
};
module.exports = setup;