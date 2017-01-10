/**************************************************************************************************
 * 
 * Calendar code for MIRA Web
 * Developed by :   Gabriela S. Pailiacho G.
 * Date:27 Jun 2016
 * 
 */

var q  = require("q");
var moment = require('moment');
var mtz = require('moment-timezone');
var accessrules = require('./class-accessrules.js');

var calendar = {
	/* Get access and roles */
	getAccessRoles: function(req, db){
		var deferred = q.defer();
		try{
			var doc = [];
			accessrules.getRules(req, '');
			doc.push(accessrules.rules);
			if(doc[0]){
				deferred.resolve({"status": 200, "doc": doc[0]});
			}else{
				deferred.reject({"status": 500, "error": 'Access roles error.'});
			}
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	/* Get all calendars */
	getTargetCalendars: function(req, db, keyIntCal) {
		var deferred = q.defer();
		try{
			dataTargetCalendars = [];
			var obj = {
				selector : {
					"_id": {"$gt":0},
					keyName: "MIRAMenu",
					docType: "setup"
				}
			};
			db.find(obj).then(function(data){
				var len = data.body.docs.length;
				if(len > 0){
					var lenValue = data.body.docs[0].value.length;
					for (var i = 0; i < lenValue; i++){
						var dataValue = data.body.docs[0].value[i];
						
						if (dataValue.businessUnit==req.session.businessunit){
							var menu = dataValue.menu;
							for (var j = 0; j < menu.length; j++){
								var dataMenu = menu[j];
								//Get Calendars options
								if (dataMenu.title=="Calendar"){
									var dataCalendar = dataMenu.entries;
									for(var k = 0; k < dataCalendar.length; k++){
										if(dataCalendar[k].id != keyIntCal){
											dataTargetCalendars.push({
												id: dataCalendar[k].id,
												name: dataCalendar[k].name,
												link: dataCalendar[k].link
											});
										}
									}
								}
							}
						}
					}
					deferred.resolve({"status": 200, "dataTargetCalendars": dataTargetCalendars});
				}else{
					deferred.reject({"status": 500, "error": "No Target Calendars data."});
				}
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	/* Get events by Business Unit*/
	getEvents: function(req, db, keyIntCal){
		var deferred = q.defer();
		try{
			var events = [];
			var ownerCalendar = req.query.id;
			if(ownerCalendar == keyIntCal){
				var obj = {
					selector : {
						"_id": {"$gt":0},
						"type": "Calendar",
						"businessUnit" : req.session.businessunit
					}
				};
			}else{
				var obj = {
					selector : {
						"_id": {"$gt":0},
						"type": "Calendar",
						$or: [ { "ownerId": ownerCalendar }, { "targetCalendar": { $in: [ownerCalendar] } } ],
						"businessUnit" : req.session.businessunit
					}
				};
			}
			db.find(obj).then(function(data){
				var len = data.body.docs.length;
				if(len > 0){
					for(var i = 0; i < len; i++){
						events.push(data.body.docs[i]);
					}
				}
				deferred.resolve({"status": 200, "events": events});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	/*Save event*/
	saveEvent: function(req, db){
		var deferred = q.defer();
		try{
			var now = moment(new Date());
			var addlog = {
				"name": req.session.user.notesId,
				"date": now.format("MM/DD/YYYY"),
				"time": now.format("hh:mmA") + " " + mtz.tz(mtz.tz.guess()).zoneAbbr(),
			};
			
			if (req.body.id != "") {
				db.get(req.body.id).then(function(data){
					var doc = [];
					doc.push(data.body);
					doc[0].title = req.body.title;
					doc[0].eventInfo = req.body.eventInfo;
					doc[0].log.push(addlog);
					doc[0].start = req.body.startDate;
					doc[0].end = req.body.endDate;
					doc[0].eventInfo = req.body.eventInfo;
					doc[0].targetCalendar = req.body.chkTarCal;
					doc[0].businessUnit = req.session.businessunit;
					db.save(doc[0]).then(function(data){
						deferred.resolve(data);
					}).catch(function(err) {
						deferred.reject({"status": 500, "error": err.error.reason});
					});
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}else{
				var log = [];
				log.push(addlog);
				var object = {
					"title" : req.body.title,
					"type" : "Calendar",
					"start" : req.body.startDate,
					"end" : req.body.endDate,
					"eventType" : req.body.eventType,
					"eventInfo" : req.body.eventInfo,
					"owner" : req.body.owner,
					"ownerId" : req.body.ownerId,
					"targetCalendar" : req.body.chkTarCal,
					"log" : log,
					"businessUnit" : req.session.businessunit
				};
				// save event
				db.save(object).then(function(data){
					deferred.resolve({"status": 200, "body": data.body});
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	/*Delete event*/
	deleteEvent: function(req, db){
		var deferred = q.defer();
		try{
			var id = req.query.id;
			var rev = req.query.rev;
			// delete event
			db.del(id, rev).then(function(data){
				deferred.resolve(data);
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	}
};
module.exports = calendar;