/**************************************************************************************************
*
*assessment components code for MIRA Web
* Developed by : Irving Fernando Alvarez Vazquez
* Date:27 Oct 2016
*
*/

var q  = require("q");
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
  getLocalAudit: function(req, db){
    var deferred = q.defer();
    try{
      if(typeof req.query.new !== "undefined"){
        var output = {};
        var obj = {
          selector : {
            "_id": {"$gt":0},
            keyName: "AuditAndReviewRatings"
          }};
          db.find(obj).then(function(data2){
            var tmp = [];
            for(var list in data2.body.docs[0].value){
              tmp.push({name:list});
            }
            output.auditList = tmp;
            output.ratingList = data2.body.docs[0].value;
            output.new = 1;
            output.editmode = 1;
            output.reportingQuarter = req.session.quarter;
            deferred.resolve({"status": 200, "data":output});
          }).catch(function(err) {
            deferred.reject({"status": 500, "error": err.error.reason});
          });

        }else{

          var obj = {
            selector : {
              "_id": req.query.id,
              "docType": "localaudit"
            }
          };

          db.find(obj).then(function(data){
            //console.log(data.body.docs[0]);
            var output = data.body.docs[0];
            output["_id"] = req.query.id;
            if(typeof req.query.edit !== "undefined"){
              output.editmode = 1;
            }

            obj = {
              selector : {
                "_id": {"$gt":0},
                keyName: "AuditAndReviewRatings"
              }};
              db.find(obj).then(function(data2){
                var tmp = [];
                for(var list in data2.body.docs[0].value){
                  tmp.push({name:list});
                }
                output.auditList = tmp;
                output.ratingList = data2.body.docs[0].value;
                deferred.resolve({"status": 200, "data":output});
              }).catch(function(err) {
                deferred.reject({"status": 500, "error": err.error.reason});
              });
            }).catch(function(err) {
              deferred.reject({"status": 500, "error": err.error.reason});
            });
          }
        }catch(e){
          deferred.reject({"status": 500, "error": e});
        }
        return deferred.promise;
      },
      getInternalAudit: function(req, db){
        var deferred = q.defer();
        try{
          var obj = {
            selector : {
              "_id": req.query.id,
              "docType": "internalaudit"
            }
          };

          db.find(obj).then(function(data){
            //console.log(data.body.docs[0]);
            var internal = data.body.docs[0];
            internal["_id"] = req.query.id;
            if(typeof req.query.edit !== "undefined"){
              internal.editmode = 1;
              obj = {
                selector : {
                  "_id": {"$gt":0},
                  keyName: "UnitSizes"
                }};
                db.find(obj).then(function(data){
                  var doc = data.body.docs[0];
                  if(typeof doc === "undefined"){
                    deferred.reject({"status": 500, "error": "parameter does not exist"});
                  }else{
                    //console.log(doc.value.options);
                    internal.sizes = doc.value.options;
                    deferred.resolve({"status": 200, "data": internal})
                  }
                }).catch(function(err) {
                  deferred.reject({"status": 500, "error": err.error.reason});
                });
              }else{
                deferred.resolve({"status": 200, "data":internal})}
              }).catch(function(err) {
                deferred.reject({"status": 500, "error": err.error.reason});
              });
            }catch(e){
              deferred.reject({"status": 500, "error": e});
            }
            return deferred.promise;
          },
          getCUSummary: function(req, db){
            var deferred = q.defer();
            try{
              var obj = {
                selector : {
                  "_id": req.query.id,
                  "docType": "CUSummarySample"
                }
              };
              db.find(obj).then(function(data){
                var tmp = data.body.docs[0];
                tmp.modified = {};
                tmp.modified.name =tmp.Log[tmp.Log.length -1].name;
                tmp.modified.date =tmp.Log[tmp.Log.length -1].date;
                tmp.modified.time =tmp.Log[tmp.Log.length -1].time;
                deferred.resolve({"status": 200, "data":tmp})
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
              var addlog = {
                "name": req.session.user.notesId,
                "date": utility.getDateTime("","date"),
                "time": utility.getDateTime("","time")
              };
              var obj = {
                selector : {
                  "_id": req.body["_id"],
                  "docType": "openIssue"
                }
              };
              db.find(obj).then(function(data){

                obj = data.body.docs[0];
                obj.numMissedTasksOverride = req.body.numMissedTasksOverride;
                obj.Log.push(addlog);
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
              var addlog = {
                "name": req.session.user.notesId,
                "date": utility.getDateTime("","date"),
                "time": utility.getDateTime("","time")
              };
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
                obj.Log.push(addlog);

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
          /* Save Local Audit */
          saveLocalAudit: function(req, db) {
            var deferred = q.defer();
            try{
              var addlog = {
                "name": req.session.user.notesId,
                "date": utility.getDateTime("","date"),
                "time": utility.getDateTime("","time")
              };

              if(req.body.docid === ""){

                var obj={};
                obj.docType = "localaudit";
                obj.controllableUnit = req.body.controllableUnit;
                obj.auditOrReview = req.body.auditOrReview;
                obj.Log = [addlog];
                obj.reportingQuarter = req.session.quarter;
                obj.reportDate = req.body.reportDate;
                obj.process = req.body.process;
                obj.rating = req.body.rating;
                obj.numRecommendationsTotal = req.body.numRecommendationsTotal;
                obj.numRecommendationsOpen = req.body.numRecommendationsOpen;
                obj.targetCloseOriginal = req.body.targetCloseOriginal;
                obj.targetCloseCurrent = req.body.targetCloseCurrent;
                obj.comments = req.body.comments;
                obj.Notes = req.body.Notes;
                obj.Links = req.body.attachIDs;

                db.save(obj).then(function(data){
                  deferred.resolve({"status": 200, "data": data.body});
                }).catch(function(err){
                  deferred.reject({"status": 500, "error": err.error.reason});
                });
              }
              else{
                var obj = {
                  selector : {
                    "_id": req.body["_id"],
                    "docType": "localaudit"
                  }
                };
                db.find(obj).then(function(data){

                  obj = data.body.docs[0];
                  obj.Log.push(addlog);
                  obj.auditOrReview = req.body.auditOrReview;
                  obj.reportDate = req.body.reportDate;
                  obj.process = req.body.process;
                  obj.rating = req.body.rating;
                  obj.numRecommendationsTotal = req.body.numRecommendationsTotal;
                  obj.numRecommendationsOpen = req.body.numRecommendationsOpen;
                  obj.targetCloseOriginal = req.body.targetCloseOriginal;
                  obj.targetCloseCurrent = req.body.targetCloseCurrent;
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
              }
            }catch(e){
              deferred.reject({"status": 500, "error": e});
            }
            return deferred.promise;
          },
          /* Save Internal Audit */
          saveInternalAudit: function(req, db) {
            var deferred = q.defer();
            try{
              var addlog = {
                "name": req.session.user.notesId,
                "date": utility.getDateTime("","date"),
                "time": utility.getDateTime("","time")
              };
              var obj = {
                selector : {
                  "_id": req.body["_id"],
                  "docType": "internalaudit"
                }
              };
              db.find(obj).then(function(data){

                obj = data.body.docs[0];
                obj.Log.push(addlog);
                obj.size = req.body.size;
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
