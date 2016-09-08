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
							assessableUnit: doc[i].Name,
							status: doc[i].Status,
							portafolio: doc[i].Portafolio,
							auditable: doc[i].AuditableFlag,
							auditableProcess: doc[i].AuditProgram,
							priorQ: doc[i].PeriodRatingPrev,
							currentQ: doc[i].PeriodRating,
							nextQtr: doc[i].AUNextQtrRating,
							targetToSat:doc[i].Target2Sat,
							owner:doc[i].Owner,
							type:doc[i].DocSubType
						});
					}
				}
				view=JSON.stringify(view_auFileReport, 'utf8');
				deferred.resolve({"status": 200, "doc":view});
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