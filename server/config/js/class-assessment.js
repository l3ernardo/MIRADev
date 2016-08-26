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
var fieldCalc = require('./class-fieldcalc.js');

var assessment = {

	/* Get assessment by ID */
	getAsmtbyID: function(req, db) {
		var deferred = q.defer();
		var docid = req.query.id

		db.get(docid).then(function(data){
			var doc = [];
			doc.push(data.body);
			doc[0].EnteredBU = req.session.businessunit;
			doc = fieldCalc.getCategoryAndBUOld(req, db, doc);

			// test view data
			doc[0].ALLData = fieldCalc.addTestViewData(6,3);
			doc[0].ARCData = fieldCalc.addTestViewData(4,3);
			doc[0].RiskData = fieldCalc.addTestViewData(11,3);
			doc[0].AuditTrustedData = doc[0].RiskData;
			doc[0].AuditTrustedRCUData = fieldCalc.addTestViewData(10,3);
			doc[0].AuditLocalData = fieldCalc.addTestViewData(8,3);
			doc[0].DRData = fieldCalc.addTestViewData(5,1);
			doc[0].RCTestData = fieldCalc.addTestViewData(7,3);
			doc[0].SCTestData = doc[0].RCTestData;
			doc[0].SampleData = doc[0].RiskData;


			doc[0].CatP = "CRM";
			doc[0].PrevQtrs = [];
			doc[0].PrevQtrs = fieldCalc.getPrev4Qtrs(doc[0].CurrentPeriod);

			deferred.resolve({"status": 200, "doc": doc});

		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	}

};

module.exports = assessment;
