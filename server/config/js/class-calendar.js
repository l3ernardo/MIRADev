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
		var doc = [];
		accessrules.getRules(req, '');
		doc.push(accessrules.rules);
		if(doc[0]){
			deferred.resolve({"status": 200, "doc": doc[0]});
		}else{
			deferred.reject({"status": 500, "error": 'Access roles error.'});
		}
		return deferred.promise;
	},
	/* Get all calendars */
	getTargetCalendars: function(req, db) {
		var deferred = q.defer();
		dataTargetCalendars = [];
		var obj = {
			selector : {
				"_id": {"$gt":0},
				keyName: "MenuTitle",
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
						//Get Calendars options
						calendars = dataValue.calendars;
						lenCal = calendars.length;
						for(var j = 0; j < lenCal; j++){
							if(dataValue.calendars[j].id != "all"){
								dataTargetCalendars.push({
									id: dataValue.calendars[j].id,
									name: dataValue.calendars[j].name,
									link: dataValue.calendars[j].link
								});
							}
						}
					}
				}
				deferred.resolve({"status": 200, "dataTargetCalendars": dataTargetCalendars});
			}else{
				deferred.reject({"status": 500, "error": error});
			}
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},
	/* Get events */
	getEvents: function(req, db){
		var deferred = q.defer();
		var events = [];
		var ownerCalendar = req.query.id;
		if(ownerCalendar == "all"){
			var obj = {
				selector : {
					"_id": {"$gt":0},
					"type": "Calendar"
				}
			};
		}else{
			var obj = {
				selector : {
					"_id": {"$gt":0},
					"type": "Calendar",
					$or: [ { "ownerId": ownerCalendar }, { "targetCalendar": { $in: [ownerCalendar] } } ]
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
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},
	/*Save event*/
	saveEvent: function(req, db){
		var deferred = q.defer();
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
				doc[0].attachIDs = req.body.attachIDs;
				doc[0].log.push(addlog);
				doc[0].start = req.body.startDate;
				doc[0].end = req.body.endDate;
				doc[0].eventInfo = req.body.eventInfo;
				doc[0].targetCalendar = req.body.chkTarCal;

				db.save(doc[0]).then(function(data){
					deferred.resolve(data);
				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err});
				});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err});
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
				"attachIDs" : req.body.attachIDs,
				"log" : log
			};
			// save event
			db.save(object).then(function(data){
				deferred.resolve({"status": 200, "body": data.body});
			}).catch(function(err) {
				console.log("error"+err);
				deferred.reject({"status": 500, "error": err});
			});
		}
		
		return deferred.promise;
	},
	/*Delete event*/
	deleteEvent: function(req, db){
		var deferred = q.defer();
		var id = req.query.id;
		var rev = req.query.rev;
		// delete event
		db.del(id, rev).then(function(data){
			//delete files
			deferred.resolve(data);
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	}
};
module.exports = calendar;