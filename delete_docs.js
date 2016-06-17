/**************************************************************************************************
 * 
 * Deleting documents for MIRA database
 * This code will delete all documents from a cloudant database (keeping only the design documents)
 * run it from command line using:
 *
 * node delete_docs.js
 *
 * Developed by :                                                
 * Date:16 June 2016
 * 
 */

var testurl= 'https://90a4b44e-124b-4d13-bfab-6a8a30e3bed7-bluemix:ef79e2bdea5dbbe240d8cef784bf653b987f6af0581195db348a887b860b1c18@90a4b44e-124b-4d13-bfab-6a8a30e3bed7-bluemix.cloudant.com';

var devurl='https://f4e839f3-6b73-4788-8704-f224e93810a4-bluemix:de829651ca37cc6958fa84219a99df631173d97fcbcb26d38e5b0fee0bb6542f@f4e839f3-6b73-4788-8704-f224e93810a4-bluemix.cloudant.com';

/* Choose the cloudant service where you want to connect for deletion */
var tmpurl = devurl;
/* Put the database name where you want all docs deleted */
var dbname = 'miratemplate';

var cloudant = require('cloudant')(tmpurl); 
var ldb = cloudant.db.use(dbname);

var count = 0;  
ldb.list(function(er, body) {
	if (er) return console.log('Error listing docs')
		body.rows.forEach(function(doc) {
			if ( doc.id.substring(0,7) != '_design') {
				console.log('deleting id: %s, rev: %s', doc.id, doc.value.rev)
				ldb.destroy(doc.id, doc.value.rev, function(er, body){
					if (er) console.log('ERROR: %s', er)
						else console.log(body)
				})
			}
		})
	})
