/**************************************************************************************************
 *
 * MIRA Web access update codes
 * Date: 22 July 2016
 *
 */
var util = require('./class-utility.js');

var accessupdates = {

	/* Get assessment by ID */
	updateAccessNewDoc: function(req, pdoc, doc) {

		doc[0].Owner = req.body.ownername;
		doc[0].AdditionalReaders = req.body.readerlist;
		doc[0].AdditionalEditors = req.body.editorlist;

		//AllReaders = AdditionalReaders
		if (pdoc[0].AllReaders == undefined) pdoc[0].AllReaders = [];
		doc[0].AllReaders = pdoc[0].AllReaders; //inherited reader access
		if (doc[0].AdditionalReaders != undefined && doc[0].AdditionalReaders != "") {
			doc[0].AdditionalReaders.split(',').forEach(function(entry) {
				accessupdates.validateEntryIsNotEmpty(entry, doc[0].AllReaders);
			});
			doc[0].AdditionalReaders = util.sort_unique(doc[0].AdditionalReaders.split(',')).join();
		}
		doc[0].AllReaders = util.sort_unique(doc[0].AllReaders);

		//AllEditors = Owner + AdditionalEditors
		if (pdoc[0].AllEditors == undefined) pdoc[0].AllEditors = [];
		doc[0].AllEditors = pdoc[0].AllEditors; //inherited reader access
		if (doc[0].Owner != undefined && doc[0].Owner != "") doc[0].AllEditors.push(doc[0].Owner.split("(")[1].split(")")[0]);
		if (doc[0].AdditionalEditors != undefined && doc[0].AdditionalEditors != "") {
			doc[0].AdditionalEditors.split(',').forEach(function(entry) {
				accessupdates.validateEntryIsNotEmpty(entry, doc[0].AllReaders);
			});
			doc[0].AdditionalEditors = util.sort_unique(doc[0].AdditionalEditors.split(',')).join();
		}
		doc[0].AllEditors = util.sort_unique(doc[0].AllEditors);

		return doc;
	},

	updateAccessExistDoc: function(req, doc) {
		if (doc[0].DocSubType == "BU IOT" || doc[0].DocSubType == "BU IMT" || doc[0].DocSubType == "BU Country" || doc[0].DocSubType == "BU Reporting Group" || doc[0].DocSubType == "Account") {
			doc[0].Owner = req.body.ownername;
		}
		doc[0].AdditionalReaders = req.body.readerlist;
		doc[0].AdditionalEditors = req.body.editorlist;
		//AllReaders = Coordinators + Readers + AdditionalReaders
		if (doc[0].AllReaders == undefined) doc[0].AllReaders = [];
		if (doc[0].AdditionalReaders != undefined && doc[0].AdditionalReaders != "") {
			doc[0].AdditionalReaders.split(',').forEach(function(entry) {
				accessupdates.validateEntryIsNotEmpty(entry, doc[0].AllReaders);
			});
			doc[0].AdditionalReaders = util.sort_unique(doc[0].AdditionalReaders.split(',')).join();
		}
		if (doc[0].Coordinators != undefined && doc[0].Coordinators != "")  {
			doc[0].Coordinators.split(',').forEach(function(entry) {
				accessupdates.validateEntryIsNotEmpty(entry, doc[0].AllReaders);
			});
			doc[0].Coordinators = util.sort_unique(doc[0].Coordinators.split(',')).join();
		}
		if (doc[0].Readers != undefined && doc[0].Readers != "") {
			doc[0].Readers.split(',').forEach(function(entry) {
				accessupdates.validateEntryIsNotEmpty(entry, doc[0].AllReaders);
			});
			doc[0].Readers = util.sort_unique(doc[0].Readers.split(',')).join();
		}
		doc[0].AllReaders = util.sort_unique(doc[0].AllReaders);

		//AllEditors = Owner + Focals + AdditionalEditors
		if (doc[0].AllEditors == undefined) doc[0].AllEditors = [];
		if (doc[0].Owner != undefined && doc[0].Owner != "") doc[0].AllEditors.push(doc[0].Owner.split("(")[1].split(")")[0]);
		if (doc[0].AdditionalEditors != undefined && doc[0].AdditionalEditors != "") {
			doc[0].AdditionalEditors.split(',').forEach(function(entry) {
				accessupdates.validateEntryIsNotEmpty(entry, doc[0].AllEditors);
			});
			doc[0].AdditionalEditors = util.sort_unique(doc[0].AdditionalEditors.split(',')).join();
		}
		if (doc[0].Focals != undefined && doc[0].Focals != "") {
			doc[0].Focals.split(',').forEach(function(entry) {
				accessupdates.validateEntryIsNotEmpty(entry, doc[0].AllEditors);
			});
			doc[0].Focals = util.sort_unique(doc[0].Focals.split(',')).join();
		}
		doc[0].AllEditors = util.sort_unique(doc[0].AllEditors);
		return doc;

	},
	validateEntryIsNotEmpty: function(entry, listOfEntries) {
		if(entry != undefined && entry != "") {
			//error
			if(entry.indexOf("@") != -1){
			entry = entry.split("(")[1].split(")")[0];
			listOfEntries.push(entry);
		}
		}
	}

}
module.exports = accessupdates;
