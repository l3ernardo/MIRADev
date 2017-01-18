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

  newAudit: function(req, db){
    var deferred = q.defer();
    try{
      var obj = {
        selector : {
          "_id": req.query.id,
          "compntType": "ppr"
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

  getComponent: function(req, db){
    var deferred = q.defer();
    try{
      var obj = {
        selector : {
          "_id": req.query.id,
        },
        fields:["compntType"]
      };
      db.find(obj).then(function(data){
        var tipo = data.body.docs[0].compntType;

        switch (tipo) {
          case "controlSample":
            deferred.resolve(components.getControlSample(req,db));
            break;
          case  "CUSummarySample":
            deferred.resolve(components.getCUSummary(req,db));
            break;
          case "internalAudit":
            deferred.resolve(components.getInternalAudit(req,db));
            break;
          case "localAudit":
            deferred.resolve(components.getLocalAudit(req,db));
            break;
          case "accountAudit":
            deferred.resolve(components.getAccountAudit(req,db));
            break;
          case "PPR":
            deferred.resolve(components.getPPR(req,db));
            break;
          case "openIssue":
            deferred.resolve(components.getIssue(req,db));
            break;
          case "sampledCountry":
            deferred.resolve(components.getSampledCountry(req,db));
            break;
          case "countryControls":
            deferred.resolve(components.getCountryControls(req,db));
            break;
          case "accountControls":
            deferred.resolve(components.getAccountControls(req,db));
            break;
          default:
            deferred.reject({"status": 500, "error": "not a valid id"});
            break;
        }
      }).catch(function(err) {
        deferred.reject({"status": 500, "error": err.error.reason});
      });
    }catch(e){
      deferred.reject({"status": 500, "error": e});
    }
    return deferred.promise;
  },

  getControlSample: function(req, db){
    var deferred = q.defer();
    try{
      var obj = {
        selector : {
          "_id": req.query.id,
          "compntType": "controlSample"
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

  getSampledCountry: function(req, db){
    var deferred = q.defer();
    try{
      var obj = {
        selector : {
          "_id": req.query.id,
          "compntType": "sampledCountry"
        }
      };
      db.find(obj).then(function(data){
        data.body.docs[0].subtitle = data.body.docs[0].sampledCountry +" - "+data.body.docs[0].controlShortName +" Sample";
        deferred.resolve({"status": 200, "data":data.body.docs[0]})
      }).catch(function(err) {
        deferred.reject({"status": 500, "error": err.error.reason});
      });
    }catch(e){
      deferred.reject({"status": 500, "error": e});
    }
    return deferred.promise;
  },

  getCountryControls: function(req, db){
    var deferred = q.defer();
    try{
      var obj = {
        selector : {
          "_id": req.query.id,
          "compntType": "countryControls"
        }
      };
      db.find(obj).then(function(data){
        var output = data.body.docs[0];
        output.subtitle = output.reportingCountry +" - "+output.controlShortName;
        if(typeof req.query.edit !== "undefined"){
          output.editmode = 1;
        }
        var obj = {
          selector : {
            "_id": {"$gt":0},
            "compntType": "controlSample",
            "reportingQuarter": output.reportingQuarter,
            "CTRLPARENT": output.IntegrationKeyWWBCIT
          },
          fields:["_id","reportingQuarter","sampleUniqueID","controllableUnit","numTests","numDefects","remediationStatus","defectsAbstract"]
        };
        db.find(obj).then(function(data){
          var quarters = {};
          var list = [];
          for(var i=0; i< data.body.docs.length; i++){
            var samp = data.body.docs[i];
            if(typeof quarters[samp.reportingQuarter] === "undefined"){
              quarters[samp.reportingQuarter] = true;
              list.push({id:samp.reportingQuarter.replace(/ /g,''), period:samp.reportingQuarter});
            }
            samp.parent = samp.reportingQuarter.replace(/ /g,'');
            samp.id = samp["_id"];
            samp.defectRate = (samp.numDefects / samp.numTests) * 100;
            list.push(samp);
          }
          output.samples = list;
          deferred.resolve({"status": 200, "data":output});
        }).catch(function(err) {
          deferred.reject({"status": 500, "error": err.error.reason});
        });
        /*if(output.samples != undefined && output.samples.length != 0){
          var promises = output.samples.map(function(id){
            var obj = {
              selector : {
                "_id": id,
                "compntType": "controlSample"
              },
              fields:["_id","reportingQuarter","sampleUniqueID","controllableUnit","numTests","numDefects","remediationStatus","defectsAbstract"]
            };
            return db.find(obj);
          });
          var quarters = {};
          var list = [];
          q.all(promises).then(function(data){
            for(var i=0; i< data.length; i++){
              var samp = data[i].body.docs[0];
              if(typeof quarters[samp.reportingQuarter] === "undefined"){
                quarters[samp.reportingQuarter] = true;
                list.push({id:samp.reportingQuarter, period:samp.reportingQuarter});
              }
              samp.parent = samp.reportingQuarter;
              samp.id = samp["_id"];
              samp.defectRate = (samp.numDefects / samp.numTests) * 100;
              list.push(samp);
            }
            //console.log(list);
            output.samples = list;

            deferred.resolve({"status": 200, "data":output});
          });
        }else{

        deferred.resolve({"status": 200, "data":output});
        }*/
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
          "compntType": "openIssue"
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
          "compntType": "PPR"
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
        var ratingKey = "";
        if(req.session.BG.indexOf("MIRA-ADMIN") > -1){
          ratingKey ="NonAdminAuditsRatings";
        }else{
          ratingKey ="AdminAuditsRatings";
        }
        var obj = {
          selector : {
            "_id": {"$gt":0},
            keyName: req.session.businessunit+ratingKey
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
          var pkey = {
            selector : {
              "_id": req.query.id
          }};
          db.find(pkey).then(function(parentData){
            var parent = parentData.body.docs[0];
            if(!((parent.ParentDocSubType != "Controllable Unit" && parent.ParentDocSubType != "Country Process") || (parent.MIRAStatus == "Final"))){
              output.procesDisplay = true;
            }
            output.parentType = parent.ParentDocSubType;
            output.AssessableUnitName = parent.AssessableUnitName;
            output.parentid = req.query.id;
            deferred.resolve({"status": 200, "data":output});
          }).catch(function(err) {
            deferred.reject({"status": 500, "error": err.error.reason});
          });

        }).catch(function(err) {
          deferred.reject({"status": 500, "error": err.error.reason});
        });
      }
      else{
        var obj = {
          selector : {
            "_id": req.query.id,
            "compntType": "localAudit"
          }
        };

        db.find(obj).then(function(data){

          var output = data.body.docs[0];
          output["_id"] = req.query.id;
          if(typeof req.query.edit !== "undefined"){
            output.editmode = 1;
          }
          var ratingKey = "";
          if(req.session.BG.indexOf("MIRA-ADMIN") > -1){
            ratingKey ="NonAdminAuditsRatings";
          }else{
            ratingKey ="AdminAuditsRatings";
          }
          //console.log(req.session.businessunit+ratingKey);
          obj = {
            selector : {
              "_id": {"$gt":0},
              keyName: req.session.businessunit+ratingKey
          }};
          db.find(obj).then(function(data2){
            var tmp = [];
            for(var list in data2.body.docs[0].value){
              tmp.push({name:list});
            }
            output.auditList = tmp;
            output.ratingList = data2.body.docs[0].value;
            var pkey = {
              selector : {
                "_id": output.parentid
            }};
            db.find(pkey).then(function(parentData){
              var parent = parentData.body.docs[0]
              if(!((parent.ParentDocSubType != "Controllable Unit" && parent.ParentDocSubType != "Country Process") || ( parent.reportingQuarter != req.session.quarter || parent.MIRAStatus == "Final"))){
                output.procesDisplay = true;
              }
              deferred.resolve({"status": 200, "data":output});
            }).catch(function(err) {
              deferred.reject({"status": 500, "error": err.error.reason});
            });

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

  getAccountAudit: function(req, db){

    var deferred = q.defer();
    try{
      if(typeof req.query.new !== "undefined"){
        var output = {};
        var ratingKey = "";
        if(req.session.BG.indexOf("MIRA-ADMIN") > -1){
          ratingKey ="NonAdminAuditsRatings";
        }else{
          ratingKey ="AdminAuditsRatings";
        }

        var obj = {
          selector : {
            "_id": {"$gt":0},
            keyName: req.session.businessunit+ratingKey
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
          var pkey = {
            selector : {
              "_id": req.query.id
          }};
          db.find(pkey).then(function(parentData){
            var parent = parentData.body.docs[0]
            if(!(parent.MIRAStatus == "Final")){
              //output.procesDisplay = true;
            }
            output.parentType = parent.ParentDocSubType;
            output.AssessableUnitName = parent.AssessableUnitName;
            output.parentid = req.query.id;
            deferred.resolve({"status": 200, "data":output});
          }).catch(function(err) {
            deferred.reject({"status": 500, "error": err.error.reason});
          });
            /*if(!((ParentSubType != "Controllable Unit" && ParentSubType != "Country Process") || (parentStatus == "Final"))){
            output.procesDisplay = true;
          }*/
        }).catch(function(err) {
          deferred.reject({"status": 500, "error": err.error.reason});
        });

      }
      else{

        var obj = {
          selector : {
            "_id": req.query.id,
            "compntType": "accountAudit"
          }
        };

        db.find(obj).then(function(data){
          //console.log(data.body.docs[0]);
          var output = data.body.docs[0];
          output["_id"] = req.query.id;
          if(typeof req.query.edit !== "undefined"){
            output.editmode = 1;
          }
          var ratingKey = "";
          if(req.session.BG.indexOf("MIRA-ADMIN") > -1){
            ratingKey ="NonAdminAuditsRatings";
          }else{
            ratingKey ="AdminAuditsRatings";
          }

          obj = {
            selector : {
              "_id": {"$gt":0},
              keyName: req.session.businessunit+ratingKey
          }};

          db.find(obj).then(function(data2){
            var tmp = [];
            for(var list in data2.body.docs[0].value){
              tmp.push({name:list});
            }
            output.auditList = tmp;
            output.ratingList = data2.body.docs[0].value;
            var pkey = {
              selector : {
                "_id": output.parentid
            }};
            db.find(pkey).then(function(parentData){
              var parent = parentData.body.docs[0]
              if(!( parent.CurrentPeriod != req.session.quarter || parent.MIRAStatus == "Final")){
                //output.procesDisplay = true;
              }
              deferred.resolve({"status": 200, "data":output});
            }).catch(function(err) {
              deferred.reject({"status": 500, "error": err.error.reason});
            });

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
          "compntType": "internalAudit"
        }
      };
      db.find(obj).then(function(data){
        var internal = data.body.docs[0];
        internal["_id"] = req.query.id;

        // get parent doc
        db.get(internal.parentid).then(function(data){
          var pdoc = data.body;
          if(typeof pdoc === "undefined"){
            deferred.reject({"status": 500, "error": "parent document does not exist"});
          }else{
            // get fields from parent assessable unit
            internal.parentdocsubtype = pdoc.DocSubType;
            internal.parentname = pdoc.Name;
            // ** Edit Mode **//
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
                  internal.sizes = doc.value.options;
                  deferred.resolve({"status": 200, "data": internal})
                }
              }).catch(function(err) {
                deferred.reject({"status": 500, "error": err.error.reason});
              });
            }
            // ** Read Mode **//
            else{
              deferred.resolve({"status": 200, "data":internal})
            }

          }
        }).catch(function(err) {
          console.log("err?");
          console.log(err);
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

  getCUSummary: function(req, db){
    var deferred = q.defer();
    try{
      var obj = {
        selector : {
          "_id": req.query.id,
          "compntType": "CUSummarySample"
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

  getAccountControls: function(req, db){
    /******************

    PROCESS PENDNING

    *************************/
    var deferred = q.defer();
    if(typeof req.query.new !== "undefined"){
      var data = {};
      data.new = 1;
      data.editmode = true;
      deferred.resolve({"status": 200, "data":data})

      return deferred.promise;

    }else{
      try{
        var obj = {
          selector : {
            "_id": req.query.id,
            "compntType": "accountControls"
          }
        };

        db.find(obj).then(function(data){
        //console.log(data.body.docs[0]);
        //data.body.docs[0]["_id"] = req.query.id;
        if(typeof req.query.edit !== "undefined"){
          data.body.docs[0].editmode = 1;
          var Thresholds = [];
          var keyN = {
            selector : {
              "_id": {"$gt":0},
              keyName: "KCO/KCFR Marginal Defect Rate Threshold"
            }};
            Thresholds.push(db.find(keyN));
             keyN = {
              selector : {
                "_id": {"$gt":0},
                keyName: "KCO/KCFR Unsat Defect Rate Threshold"
              }};
              Thresholds.push(db.find(keyN));
              q.all(Thresholds).then(function(thres){

                data.body.docs[0].Marg = thres[0].body.docs[0].value.option;
                data.body.docs[0].Unsat = thres[1].body.docs[0].value.option;
                  deferred.resolve({"status": 200, "data":data.body.docs[0]});
              });
        }else{
          deferred.resolve({"status": 200, "data":data.body.docs[0]});
        }
      }).catch(function(err) {
        deferred.reject({"status": 500, "error": err.error.reason});
      });

      }catch(e){
        deferred.reject({"status": 500, "error": e});
      }
      return deferred.promise;
    }
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
          "docType": "asmtComponent",
          "compntType": "openIssue"
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

  /* Save country Controls */
  saveCountryControls: function(req, db) {
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
          "docType": "asmtComponent",
          "compntType": "countryControls"
        }
      };
      db.find(obj).then(function(data){

        obj = data.body.docs[0];
        obj.reasonTested = req.body.reasonTested;
        obj.actionPlan = req.body.actionPlan;
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
          "docType": "asmtComponent",
          "compntType": "PPR"
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
        obj.docType = "asmtComponent";
        obj.compntType = "localAudit";
        obj.controllableUnit = req.body.controllableUnit;
        obj.AssessableUnitName = req.body.AssessableUnitName;
        obj.auditOrReview = req.body.auditOrReview;
        obj.Log = [addlog];
        obj.reportingQuarter = req.session.quarter;
        obj.auditID = req.body.auditID;
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
        obj.parentid = req.body.parentid;

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
            "docType": "asmtComponent",
            "compntType": "localAudit"
          }
        };
        db.find(obj).then(function(data){

          obj = data.body.docs[0];
          obj.Log.push(addlog);
          obj.auditOrReview = req.body.auditOrReview;
          obj.auditID = req.body.auditID;
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

  /* Save Account Controls */
  saveAccountControls: function(req, db) {

    var deferred = q.defer();
    try{
      var addlog = {
        "name": req.session.user.notesId,
        "date": utility.getDateTime("","date"),
        "time": utility.getDateTime("","time")
      };

      if(req.body.docid === ""){

        var obj={};
        obj.docType = "asmtComponent";
        obj.compntType = "accountControls";
        obj.account = req.body.account;
        obj.process = req.body.process;
        obj.Log = [addlog];
        obj.reportingQuarter = req.session.quarter;
        obj.eventDate = req.body.eventDate;
        obj.numTestsCompleted = req.body.numTestsCompleted;
        obj.numProcessDefects = req.body.numProcessDefects;
        obj.numControlDeficiencies = req.body.numControlDeficiencies;
        obj.RAGStatus = req.body.RAGStatus;
        obj.remediationStatus = req.body.remediationStatus;
        obj.targetToClose = req.body.targetToClose;
        obj.comments = req.body.comments;
        obj.parentid = req.body.parentid;

        db.save(obj).then(function(data){

          deferred.resolve({"status": 200, "data": data.body});
        }).catch(function(err){
          deferred.reject({"status": 500, "error": err.error.reason});
        });

      }
      else{

        var obj = {
          selector : {
            "_id": req.body.docid,
            "docType": "asmtComponent",
            "compntType": "accountControls"
          }
        };

        db.find(obj).then(function(data){

          obj = data.body.docs[0];
          obj.Log.push(addlog);
          obj.process = req.body.process;
          obj.eventDate = req.body.eventDate;
          obj.numTestsCompleted = req.body.numTestsCompleted;
          obj.numProcessDefects = req.body.numProcessDefects;
          obj.numControlDeficiencies = req.body.numControlDeficiencies;
          obj.RAGStatus = req.body.RAGStatus;
          obj.remediationStatus = req.body.remediationStatus;
          obj.targetToClose = req.body.targetToClose;
          obj.comments = req.body.comments;

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

  saveAccountAudit: function(req, db) {
    var deferred = q.defer();
    try{
      var addlog = {
        "name": req.session.user.notesId,
        "date": utility.getDateTime("","date"),
        "time": utility.getDateTime("","time")
      };

      if(req.body.docid === ""){

        var obj={};
        obj.docType = "asmtComponent";
        obj.compntType = "accountAudit";
        obj.controllableUnit = req.body.controllableUnit;
        obj.auditOrReview = req.body.auditOrReview;
        obj.Log = [addlog];
        obj.reportingQuarter = req.session.quarter;
        obj.auditID = req.body.auditID;
        obj.reportDate = req.body.reportDate;
        obj.process = req.body.process;
        obj.rating = req.body.rating;
        obj.numRecommendationsTotal = req.body.numRecommendationsTotal;
        obj.numRecommendationsOpen = req.body.numRecommendationsOpen;
        obj.targetCloseOriginal = req.body.targetCloseOriginal;
        obj.targetCloseCurrent = req.body.targetCloseCurrent;
        obj.comments = req.body.comments;
        obj.parentid = req.body.parentid;

        db.save(obj).then(function(data){

          deferred.resolve({"status": 200, "data": data.body});
        }).catch(function(err){
          deferred.reject({"status": 500, "error": err.error.reason});
        });
      }
      else{

        var obj = {
          selector : {
            "_id": req.body["docid"],
            "docType": "asmtComponent",
            "compntType": "accountAudit"
          }
        };

        db.find(obj).then(function(data){

          obj = data.body.docs[0];
          obj.Log.push(addlog);
          obj.auditOrReview = req.body.auditOrReview;
          obj.auditID = req.body.auditID;
          obj.reportDate = req.body.reportDate;
          obj.process = req.body.process;
          obj.rating = req.body.rating;
          obj.numRecommendationsTotal = req.body.numRecommendationsTotal;
          obj.numRecommendationsOpen = req.body.numRecommendationsOpen;
          obj.targetCloseOriginal = req.body.targetCloseOriginal;
          obj.targetCloseCurrent = req.body.targetCloseCurrent;
          obj.comments = req.body.comments;

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
          "docType": "asmtComponent",
          "compntType": "internalAudit"
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
