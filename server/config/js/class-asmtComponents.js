/**************************************************************************************************
*
*assessment components code for MIRA Web
* Developed by : Irving Fernando Alvarez Vazquez
* Date:27 Oct 2016
*
*/

var q  = require("q");
var moment = require('moment');
var utility = require('./class-utility.js');

var components = {

  getControl: function(req, db){
    var deferred = q.defer();
    try{
    var obj = {
      selector : {
        "_id": req.query.id,
          "docType": "controlSample"
      }
    };
      db.find(obj).then(function(data){
        data.body.docs[0].subtitle = data.body.docs[0].controllableUnit +" "+data.body.docs[0].controlShortName +" Sample";
        deferred.resolve({"status": 200, "data":data.body.docs[0]})
      }).catch(function(err) {
        deferred.reject({"status": 500, "error": err.error.reason});
      });
    }catch(e){
			deferred.reject({"status": 500, "error": e});
		}
      return deferred.promise;
  },
  getIssue: function(req, db){
    var deferred = q.defer();
    try{
    var obj = {
      selector : {
        "_id": req.query.id,
          "docType": "openIssue"
      }
    };

      db.find(obj).then(function(data){
        //console.log(data.body.docs[0]);
        data.body.docs[0]["_id"] = req.query.id;
        if(typeof req.query.edit !== "undefined"){
          data.body.docs[0].editmode = true;
        }
        deferred.resolve({"status": 200, "data":data.body.docs[0]})
      }).catch(function(err) {
        deferred.reject({"status": 500, "error": err.error.reason});
      });
    }catch(e){
			deferred.reject({"status": 500, "error": e});
		}
      return deferred.promise;
  },
  getPPR: function(req, db){
    var deferred = q.defer();
    try{
    var obj = {
      selector : {
        "_id": req.query.id,
          "docType": "PPR"
      }
    };

      db.find(obj).then(function(data){
        //console.log(data.body.docs[0]);
        data.body.docs[0]["_id"] = req.query.id;
        if(typeof req.query.edit !== "undefined"){
          data.body.docs[0].editmode = 1;
        }
        deferred.resolve({"status": 200, "data":data.body.docs[0]})
      }).catch(function(err) {
        deferred.reject({"status": 500, "error": err.error.reason});
      });
    }catch(e){
      deferred.reject({"status": 500, "error": e});
    }
      return deferred.promise;
  },

  /* Save Open Issue number of missed tasks override in cloudant */
	saveOverride: function(req, db) {
    var deferred = q.defer();
    try{
      var obj = {
      selector : {
        "_id": req.body["_id"],
        "docType": "openIssue"
      }
      };
      db.find(obj).then(function(data){

        obj = data.body.docs[0];
        obj.numMissedTasksOverride = req.body.numMissedTasksOverride;

        db.save(obj).then(function(data){

  				deferred.resolve({"status": 200, "data": data.body});
  			}).catch(function(err){
  				deferred.reject({"status": 500, "error": err.error.reason});
  			});

      }).catch(function(err) {
        deferred.reject({"status": 500, "error": err.error.reason});
      });
    }catch(e){
			deferred.reject({"status": 500, "error": e});
		}
      return deferred.promise;
  },
  /* Save PPR */
	savePPR: function(req, db) {
    var deferred = q.defer();
    try{
      var obj = {
      selector : {
        "_id": req.body["_id"],
        "docType": "PPR"
      }
      };
      db.find(obj).then(function(data){

        obj = data.body.docs[0];
        obj.comments = req.body.comments;
        obj.Notes = req.body.Notes;
        obj.Links = req.body.attachIDs;


        db.save(obj).then(function(data){

  				deferred.resolve({"status": 200, "data": data.body});
  			}).catch(function(err){
  				deferred.reject({"status": 500, "error": err.error.reason});
  			});

      }).catch(function(err) {
        deferred.reject({"status": 500, "error": err.error.reason});
      });
    }catch(e){
			deferred.reject({"status": 500, "error": e});
		}
      return deferred.promise;
  }
};

module.exports = components;
