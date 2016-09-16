/**************************************************************************************************
 * 
 * Calendar code for MIRA Web
 * Developed by :   Gabriela S. Pailiacho G.
 * Date: 07 Sep 2016
 * 
 */

var q  = require("q");
var moment = require('moment');
var mtz = require('moment-timezone');
var accessrules = require('./class-accessrules.js');

var report = {
	assessableunitfile: function(req, db) {
		var deferred = q.defer();
		try{
			
			if(req.session.BG.indexOf("MIRA-ADMIN") > '-1'){
				var objAUFR = {
					"selector": {
						
							//"_id": { "$gt": 0 },
							"Name": { "$gt": null },
							"key": "Assessable Unit",
							"Status": "Active",
							"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"Name":"asc"}]
				};
			}
			else{
				var objAUFR = {
					"selector": {
						//"_id": { "$gt": 0 },
						"Name": { "$gt": null },
						"key": "Assessable Unit",
						"Status": "Active",
						"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}], 
						"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"Name":"asc"}]
				};
			}
			db.find(objAUFR).then(function(data){
				var doc = data.body.docs;
				var len= doc.length;
				var view_auFileReport = [];
				if(len > 0){
					for (var i = 0; i < len; i++){
						view_auFileReport.push(doc[i]);
					}
				}
				deferred.resolve({"status": 200, "doc":view_auFileReport});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}
		catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	controllableunitfile: function(req, db) {
		var deferred = q.defer();
		try{
			
			if(req.session.BG.indexOf("MIRA-ADMIN") > '-1'){
				var objAUFR = {
					"selector": {
						
							//"_id": { "$gt": 0 },
							"Name": { "$gt": null },
							"key": "Assessable Unit",
							"Status": "Active",
							"$or": [{"DocSubType":"Controllable Unit"},{"DocSubType":"Country Process", "CUFlag": "Yes"}],
							"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"Name":"asc"}]
				};
			}
			else{
				var objAUFR = {
					"selector": {
						//"_id": { "$gt": 0 },
						"Name": { "$gt": null },
						"key": "Assessable Unit",
						"Status": "Active",
						"$or": [{"DocSubType":"Controllable Unit"},{"DocSubType":"Country Process", "CUFlag": "Yes"}],
						"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}], 
						"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"Name":"asc"}]
				};
			}
			db.find(objAUFR).then(function(data){
				var doc = data.body.docs;
				var len= doc.length;
				var view_auFileReport = [];
				if(len > 0){
					for (var i = 0; i < len; i++){
						view_auFileReport.push({
							_id: doc[i]._id,
							Name: doc[i].Name,
							Status: doc[i].Status,
							Portafolio: doc[i].Portafolio,
							AuditableFlag: doc[i].AuditableFlag,
							AuditProgram: doc[i].AuditProgram,
							PeriodRatingPrev: doc[i].PeriodRatingPrev,
							PeriodRating: doc[i].PeriodRating,
							AUNextQtrRating: doc[i].AUNextQtrRating,
							Target2Sat:doc[i].Target2Sat,
							Owner:doc[i].Owner,
							DocSubType:doc[i].DocSubType
						});
					}
				}
				view=JSON.stringify(view_auFileReport, 'utf8');
				deferred.resolve({"status": 200, "doc":view_auFileReport});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}
		catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	}
};
module.exports = report;