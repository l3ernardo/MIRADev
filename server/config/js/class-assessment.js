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
			// doc = fieldCalc.getDocParams(req, db, doc);
			fieldCalc.getDocParams(req, db, doc).then(function(data){

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
				doc[0].EAData = doc[0].ARCData;

				doc[0].CatP = "CRM";
				doc[0].ShowEA = 1;
				doc[0].PrevQtrs = [];
				doc[0].PrevQtrs = fieldCalc.getPrev4Qtrs(doc[0].CurrentPeriod);

				// get parent assessable unit document
				db.get(doc[0].parentid).then(function(pdata){
					var parentdoc = [];
					parentdoc.push(pdata.body);

					/* Get access and roles */
					var editors = parentdoc[0].AdditionalEditors + parentdoc[0].Owner + parentdoc[0].Focals;
					accessrules.getRules(req,editors);
					doc[0].editor = accessrules.rules.editor;
					doc[0].admin = accessrules.rules.admin;
					doc[0].resetstatus = accessrules.rules.resetstatus;

					if(req.query.edit != undefined && doc[0].editor) { // Edit mode
						doc[0].editmode = 1;

					} else { // Read mode

					}

					deferred.resolve({"status": 200, "doc": doc});

				}).catch(function(err) {
					deferred.reject({"status": 500, "error": err});
				});

			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err});
			});

		}).catch(function(err) {
			deferred.reject({"status": 500, "error": err});
		});
		return deferred.promise;
	}

};

module.exports = assessment;
