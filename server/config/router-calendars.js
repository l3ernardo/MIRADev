/**************************************************************************************************
 *
 * Calendars code for MIRA Web
 * Developed by : Gabriela S Pailiacho G
 * Date: 27 June 2016
 *
 */
var express = require("express");
var calendars = express.Router();
var db = require('./js/class-conn.js');
var calendar = require('./js/class-calendar.js');
var utility = require('./js/class-utility.js');
var isAuthenticated = require('./router-authentication.js');
var varConf = require('../../configuration');

/**************************************************************
CALENDARS
***************************************************************/
/* Load calendar page*/
calendars.get('/calendar', isAuthenticated, function(req, res) {
	calendar.getAccessRoles(req, db).then(function(data) {
		if(data.status==200) {
			res.render('calendar', data.doc);
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[calendars][getAccessCalendar] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[calendars][getAccessCalendar] - " + err.error);
	});
});
//load data from db and show in calendar
calendars.get('/getEvents', isAuthenticated, function(req, res) {
	calendar.getEvents(req, db, varConf.keyIntCal).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.events);
		} else {
			console.log("[calendars][getEvents]" + data.error);
		}
	}).catch(function(err) {
		console.log("[calendars][getEvents] - " + err.error);
	});
});
//Get all calendars
calendars.get('/getTargetCalendars', isAuthenticated, function(req, res){
	calendar.getTargetCalendars(req, db, varConf.keyIntCal).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.dataTargetCalendars);
		} else {
			console.log("[calendars][getTargetCalendars]" + data.error);
		}
	}).catch(function(err) {
		console.log("[calendars][getTargetCalendars] - " + err.error);
	});
});
//Save event
calendars.post('/saveEvent', isAuthenticated, function(req, res) {
	calendar.saveEvent(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(req.body.attachIDs != ''){
				utility.updateFilesParentID(data.body.id, req.body.attachIDs, db).then(function(data) {
					if(data.status==200 & !data.error) {
						res.redirect("/calendar?id=all");
					} else {
						console.log("[calendars][saveEvent] - " + data.error);
					}
				}).catch(function(err) {
					console.log("[calendars][saveEvent] - " + err.error);
				})
			}else{
				res.redirect("/calendar?id=all");
			}
		} else {
			console.log("[calendars][saveEvent] - " + data.error);
		}
	}).catch(function(err) {
		console.log("[calendars][saveEvent] - " + err.error);
	});
});
//Delete event
calendars.get('/deleteEvent', isAuthenticated, function(req, res) {
	utility.deleteFilesParentID(req.query.id, db).then(function(data) {
		if(data.status==200 & !data.error) {
			calendar.deleteEvent(req, db).then(function(data) {
				if(data.status==200 & !data.error) {
					res.redirect("/calendar?id=all");
				} else {
					console.log("[calendars][deleteEvent] - " + data.error);
				}
			}).catch(function(err) {
				console.log("[calendars][deleteEvent] - " + err.error);
			});
		} else {
			console.log("[calendars][deleteEvent] - " + data.error);
		}
	}).catch(function(err) {
		console.log("[calendars][deleteEvent] - " + err.error);
	});
}); 
//Cancel event
calendars.get('/cancelEvent', isAuthenticated, function(req, res) {
	utility.deleteFilesByIDs(req.query.attachIDs, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect("/calendar?id=all");
		} else {
			console.log("[calendars][cancelEvent] - " + data.error);
		}
	}).catch(function(err) {
		console.log("[calendars][cancelEvent] - " + err.error);
	});
}); 


module.exports = calendars;