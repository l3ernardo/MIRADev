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

var calendar = {
	/* Get all calendars */
	getTargetCalendars: function(req, res, db) {
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
								obj_calendar = dataValue.calendars[j].role;
								len_objcalendar = obj_calendar.length;
								var flag = 0;
								for(var k = 0; k < len_objcalendar; k++){
									if(obj_calendar[k]==req.session.BG){
										flag = 1;
									}
								}
								if(flag == '1'){
									dataTargetCalendars.push({
										id: dataValue.calendars[j].id,
										name: dataValue.calendars[j].name,
										link: dataValue.calendars[j].link
									});
								}	
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
	getEvents: function(req, res, db){
		var deferred = q.defer();
		var events = [];
		var ownerCalendar = req.query.id;
		if(ownerCalendar == "all"){
			var obj = {
				selector : {
					"_id": {"$gt":0},
					"eventType": {"$or":["Meeting/Event","Milestone"]},
				}
			};
		}else{
			var obj = {
				selector : {
					"_id": {"$gt":0},
					"eventType": {"$or":["Meeting/Event","Milestone"]},
					"ownerId": ownerCalendar
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
	saveEvent: function(req, res, db){
		var deferred = q.defer();
		var object;
		var now = moment(new Date());
		object = {
			"title" : req.body.title,
			"type" : "Calendar",
			"start" : req.body.startDate,
			"end" : req.body.endDate,
			"eventType" : req.body.eventType,
			"eventInfo" : req.body.eventInfo,
			"owner" : req.body.owner,
			"ownerId" : req.body.ownerId,
			"targetCalendar" : req.body.chkTarCal,
			"attachIDs" : req.body.attachIDs
		};
		if (req.body.id != "") {
			object._id = req.body.id;
			object._rev = req.body.rev;
			//object.creationBy = req.body.creationBy;
			//object.creationDate = req.body.creationDate;
			//object.creationTime = req.body.creationTime;
		}else{
			object.creationBy = req.session.user.notesId;
			object.creationDate = now.format("MM/DD/YYYY");
			object.creationTime = now.format("hh:mmA") + " " + mtz.tz(mtz.tz.guess()).zoneAbbr();
		}
		// save event
		db.save(object).then(function(data){
			deferred.resolve({"status": 200, "msg": "OK"});
		}).catch(function(err) {
			console.log("error"+err);
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},
	/*Delete event*/
	deleteEvent: function(req, res, db){
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