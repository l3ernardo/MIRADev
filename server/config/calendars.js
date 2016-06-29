/**************************************************************************************************
 *
 * Calendars code for MIRA Web
 * Developed by : Gabriela S Pailiacho G
 * Date: 27 June 2016
 *
 */
var express = require("express");
var passport = require('passport');
var calendars = express.Router();
var db = require('../../conn.js');
var submenu = require('./js/submenu.js');
var calendar = require('./js/calendar.js');
var isAuthenticated = require('./authentication.js');

/**************************************************************
CALENDARS
***************************************************************/
/* Load calendar page*/
calendars.get('/calendar', isAuthenticated, function(req, res) {
	res.render('calendar');
});
//load data from db and show in calendar
calendars.get('/getEvents', function(req, res) {
	calendar.getEvents(req,res,db).then(function(data) {
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
	calendar.getTargetCalendars(req,res,db).then(function(data) {
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
calendars.post('/saveEvent', function(req, res) {
	calendar.saveEvent(req, res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.end();
		} else {
			console.log("[calendars][saveEvent] - " + data.error);
		}
	}).catch(function(err) {
		console.log("[calendars][saveEvent] - " + err.error);
	})
});
//Delete event
calendars.post('/saveEvent', function(req, res) {
	calendar.deleteEvent(req, res, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.end();
		} else {
			console.log("[calendars][saveEvent] - " + data.error);
		}
	}).catch(function(err) {
		console.log("[calendars][saveEvent] - " + err.error);
	})
}); 



module.exports = calendars;