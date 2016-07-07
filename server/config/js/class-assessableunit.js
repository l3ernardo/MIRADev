/**************************************************************************************************
 *
 * Business Unit code for MIRA Web
 * Developed by : Minerva S Genon
 * Date:07 June 2016
 *
 */

var q  = require("q");
var moment = require('moment');
var mtz = require('moment-timezone');
var accessrules = require('./class-accessrules.js');

var assessableunit = {

	/* Display all Assessable Units */
	listAU: function(req, db) {
		var deferred = q.defer();
		var obj = {
			selector:{
				"_id": {"$gt":0},
				"key": "Assessable Unit",
				"DocSubType": "Business Unit"
			}
		};
		db.find(obj).then(function(data){
			var doc = data.body.docs;
			deferred.resolve({"status": 200, "doc": doc});
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},

	/* Get assessable unit by ID */
	getAUbyID: function(req, db) {
		var deferred = q.defer();
		var docid = req.query.id
		var obj = {
			selector:{
				"_id": docid,
			}
		};

		db.find(obj).then(function(data){
			var doc = data.body.docs;
			var constiobj = {};
			var toadd = {};
			var editors = doc[0].AdditionalReaders + doc[0].Owner + doc[0].Focals;

			/* Get access and roles */
			accessrules.getRules(req,editors);
			doc[0].editor = accessrules.rules.editor;
			doc[0].admin = accessrules.rules.admin;
			doc[0].grantaccess = accessrules.rules.grantaccess;
			doc[0].resetstatus = accessrules.rules.resetstatus;
			doc[0].cuadmin = accessrules.rules.cuadmin;
			if(req.query.edit == '') doc[0].editmode = 1;

			/* Format Links */
			doc[0].Links = JSON.stringify(doc[0].Links);

			/* Get Assessment Data */
			doc[0].AssessmentData = [];
			toadd = {
				"docid": "id101",
				"col":["2Q2016","Marg","Minerva S Genon","Jun 4, 2016"]
			};
			doc[0].AssessmentData.push(toadd);
			toadd = {
				"docid": "id102",
				"col":["1Q2016","Sat","Minerva S Genon",""]
			};
			doc[0].AssessmentData.push(toadd);
			toadd = {
				"docid": "id103",
				"col":["4Q2015","Sat","Minerva S Genon",""]
			};
			doc[0].AssessmentData.push(toadd);

			/* Get Constituents Data*/
			if (doc[0].DocSubType == "Business Unit"){
				constiobj = {
					selector:{
						"_id": {"$gt":0},
						"key": "Assessable Unit",
						"DocSubType": {"$or":["Global Process","BU Reporting Group","Controllable Unit","BU IOT"]},
						"BusinessUnit": doc[0].BusinessUnit
					}
				};
				doc[0].GPData = [];
				doc[0].BUIOTData = [];
				doc[0].RGData = [];
				doc[0].CUData = [];

			} else {
				/* Query here for constituents of other types*/
				doc[0].GPData = [];
				doc[0].BUIOTData = [];
				doc[0].RGData = [];
				doc[0].CUData = [];
				var constiobj = {
					selector:{
						"_id": {"$gt":0},
						"key": "Assessable Unit",
						"DocSubType": {"$or":["Country Process"]}
					}
				};

			};

			db.find(constiobj).then(function(constidata) {
				var constidocs = constidata.body.docs;

				for (var i = 0; i < constidocs.length; ++i) {
					toadd = {
						"docid": constidocs[i]._id,
						"col": [
								constidocs[i].Name,
								constidocs[i].Status,
								constidocs[i].PeriodRatingPrev,
								constidocs[i].PeriodRating,
								constidocs[i].AUNextQtrRating,
								constidocs[i].Target2Sat
						]
					};
					if (constidocs[i].DocSubType == "Global Process") {
						doc[0].GPData.push(toadd);
					} else if(constidocs[i].DocSubType == "BU IOT") {
						doc[0].BUIOTData.push(toadd);
					} else if (constidocs[i].DocSubType == "BU Reporting Group") {
						doc[0].RGData.push(toadd);
					} else {
						doc[0].CUData.push(toadd);
					}
				};

				deferred.resolve({"status": 200, "doc": doc});
			}).catch(function(err) {
				console.log("[assessableunit][constituents]" + constidata.error);
			});

		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	},

	/* Update assessable unit */
	saveAUBU: function(req, db) {
		var deferred = q.defer();
		var now = moment(new Date());
		var addlog = {
			"name": req.session.user.cn[0],
			"date": now.format("MM/DD/YYYY"),
			"time": now.format("hh:mmA") + " " + mtz.tz(mtz.tz.guess()).zoneAbbr(),
		};
		var docid = req.body.docid;
		var obj = {
			selector:{
				"_id": docid,
			}
		};

		db.find(obj).then(function(data){
			var doc = data.body.docs;

			// Update Admin Section
			doc[0].RGRollup = req.body.RGRollup;
			// Update Additional Readers
			doc[0].AdditionalReaders = req.body.readerlist;
			// Update Additional Editors
			doc[0].AdditionalEditors = req.body.editorlist;
			// Update notes
			doc[0].Notes = req.body.Notes;
			// Update links
			doc[0].Links = eval(req.body.attachIDs);
			// Update logs
			doc[0].Log.push(addlog);

			db.save(doc[0]).then(function(data){
				deferred.resolve(data);
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err});
			});
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});

		return deferred.promise;
	}

};

module.exports = assessableunit;
