/**************************************************************************************************
 * 
 * Parameters code for MIRA Web
 * Developed by :   Gabriela S. Pailiacho G.
 * Date:25 May 2016
 * 
 */

var q  = require("q");

var parameters = {
	/* Load all parameters in view*/
	listParam: function(req, db) {
		var deferred = q.defer();
				
		db.view('setup', 'view-setup', {include_docs: true}).then(function(data) {
		var len = data.body.rows.length;
		if(len > 0){ 
			totalLog = len;
			pageSize = 20;
			pageCount = Math.ceil(totalLog/pageSize);
			currentPage = 1;
			log = [];
			logArray = [];
			logList = [];
			for (var i = 0; i < totalLog; i++) {
				log.push({
					id: data.body.rows[i].doc._id,
					keyName: data.body.rows[i].doc.keyName,
					active: data.body.rows[i].doc.active, 
					description: data.body.rows[i].doc.description
				});
			}
			while (log.length > 0) {
				logArray.push(log.splice(0, pageSize));
			}
			if (typeof req.query.page !== 'undefined') {
				currentPage = +req.query.page;
			}
			logList = logArray[+currentPage - 1];
			deferred.resolve({"status": 200, "parameters":{
				logList: logList,
				pageSize: pageSize,
				totalLog: totalLog,
				pageCount: pageCount,
				currentPage: currentPage
			}})
		} else {
			deferred.reject({"status": 500, "error": err});
			}
		}).catch(function(error){
			deferred.reject({"status": 500, "error": err});
		});		
		return deferred.promise;
	},
	/* Get specific parameter data by ID */
	getParam: function(req, db) {
		var deferred = q.defer();
		var obj = {
			selector : {
				//"_id": req.query.id
				"_id": {"$gt":0},
				keyName: req.query.keyName
			}};
		db.find(obj).then(function(data){
			var doc = data.body.docs[0];
			deferred.resolve({"status": 200, "doc": doc})
		}).catch(function(err) {
			console.log("[routes][loadParam] - " + err.error);
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},
	/* Get all the list of parameter data by keyName list parameter */
	getListParams: function(req, db, lParams) {
		var deferred = q.defer();
		var valParam = [];
		var obj;
		var $or = [];
		
		try{
			
			for(i=0; i<lParams.length; i++){
				$or.push({"keyName":lParams[i]});
			}
			obj = {
				selector : {
					"_id": {"$gt":0},
					$or
				}
			};
			
			db.find(obj).then(function(data){
				var parameters = data.body.docs;
				for (var i = 0; i < parameters.length; ++i) {
					eval("valParam."+parameters[i].keyName+" = [];");
					eval('valParam.'+parameters[i].keyName+'.push({"keyName" : parameters[i].keyName, "options" : parameters[i].value.options});');
				}
				deferred.resolve({"status": 200, "parameters": valParam})
			}).catch(function(err) {
				
				deferred.reject({"status": 500, "error": err});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	/* Save parameter in cloudant */
	saveParam: function(req, db) {
		var deferred = q.defer();
		var value = JSON.parse(req.body.fldvalue);
		var obj = {
			"docType": "setup",
			"keyName": req.body.fldname,
			"active": req.body.fldtrue,
			"value": value,
			"description": req.body.flddesc
		};
		if (req.body.id != '') {
			obj._id = req.body.id;
			obj._rev = req.body.rev;
		}
		db.save(obj).then(function(data){
			deferred.resolve({"status": 200, "msg": "OK"})
		}).catch(function(err){
			console.log("[routes][saveParam] - " + err.error);
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	}
};
module.exports = parameters;