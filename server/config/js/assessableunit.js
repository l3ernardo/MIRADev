/**************************************************************************************************
 *
 * Business Unit code for MIRA Web
 * Developed by : Minerva S Genon
 * Date:07 June 2016
 *
 */

 function formatAMPM(dt) {
   var hours = dt.getHours();
   var minutes = dt.getMinutes();
   var ampm = hours >= 12 ? 'PM' : 'AM';
   hours = hours % 12;
   hours = hours ? hours : 12;
   minutes = minutes < 10 ? '0'+minutes : minutes;
   return hours + ':' + minutes + ampm;
 };

 function pad(n) {return n < 10 ? "0"+n : n;};

 function getTZ(now) {
   var TZ = now.indexOf('(') > -1 ?
   now.match(/\([^\)]+\)/)[0].match(/[A-Z]/g).join('') :
   now.match(/[A-Z]{3,4}/)[0];
   if (TZ == "GMT" && /(GMT\W*\d{4})/.test(now)) TZ = RegExp.$1;
   return TZ;
 }

var q  = require("q");

var assessableunit = {

	/* Display all Assessable Units */
	listAU: function(req, res, db) {
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
	getAUbyID: function(req, res, db) {
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
	saveAUBU: function(req, res, db) {
		var deferred = q.defer();
    var dt = new Date();
    var addlog = {
      "name": req.session.user.cn[0],
      "date": pad((dt.getMonth() + 1)) + "/" + pad(dt.getDate()) + "/" + pad(dt.getFullYear()),
      "time": formatAMPM(dt) + ' ' + getTZ(dt.toString())
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
			// Update notes
			doc[0].Notes = req.body.Notes;
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
