/**************************************************************************************************
 *
 * Assessment code for MIRA Web
 * Developed by : Minerva S Genon
 * Date: 22 August 2016
 *
 */

var q  = require("q");
var moment = require('moment');
var mtz = require('moment-timezone');
var accessrules = require('./class-accessrules.js');
// var param = require('./class-parameter.js');
// var util = require('./class-utility.js');

var assessment = {

	/* Get assessment by ID */
	getAsmtbyID: function(req, db) {
		var deferred = q.defer();
		var docid = req.query.id

		db.get(docid).then(function(data){
			var doc = [];
			doc.push(data.body);
			deferred.resolve({"status": 200, "doc": doc});
		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	}

};

module.exports = assessment;
