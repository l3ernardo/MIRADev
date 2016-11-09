/**************************************************************************************************
*
* Audit Lesson code for MIRA Web
* Developed by : Irving Fernando Alvarez Vazquez
* Date:3 Oct 2016
*
*/

var q  = require("q");
var moment = require('moment');
var utility = require('./class-utility.js');

var auditlesson = {
  /* Get lesson parameter data by ID */
  getLessonByID: function(req, db) {
    var deferred = q.defer();
    //Load data for new audit lesson
    if(typeof req.query.new !== "undefined"){
      var doc = {};
      var tmpcountries = [];
      for(var key in req.app.locals.hierarchy.countries){
        tmpcountries.push({"name": key});
      }
      doc.countries = tmpcountries;
      doc.IOTIMTs = req.app.locals.hierarchy.countries;
      doc.editmode = "new";
      doc.reportingQuarters = [
        {quarter:1},
        {quarter:2},
        {quarter:3},
        {quarter:4}
      ];
      var obj = {
        selector : {
          "_id": {"$gt":0},
          keyName: req.session.businessunit+"AuditPrograms"
        }};
        db.find(obj).then(function(data){
          var param = data.body.docs[0];
          if(typeof param === "undefined"){
            deferred.reject({"status": 500, "error": "parameter does not exist"});
          }else{
            doc.programs = param.value.options;
          }
          var obj = {
            selector : {
              "_id": {"$gt":0},
              keyName: "ReportingYears"
            }};
            db.find(obj).then(function(data){

              var param = data.body.docs[0];
              if(typeof param === "undefined"){
                deferred.reject({"status": 500, "error": "parameter does not exist"});
              }else{
                doc.reportingYears = param.value.options;
              }
              var obj = {
                selector: {
                  Name: { "$gt": null },
                  key: "Assessable Unit",
                  DocSubType:"Business Unit",
                  Status: "Active",
                  MIRABusinessUnit: req.session.businessunit
                },
                fields: [
                  "Name"
                ]
              };
              db.find(obj).then(function(data){
                var param = data.body.docs;
                if(typeof param === "undefined"){
                  deferred.reject({"status": 500, "error": "parameter does not exist"});
                }else{
                  doc.businessList = param;
                }
                var obj = {
                  selector: {
                    Name: { "$gt": null },
                    key: "Assessable Unit",
                    DocSubType:"Global Process",
                    Status: "Active",
                    MIRABusinessUnit: req.session.businessunit
                  },
                  fields: [
                    "Name"
                  ]
                };
                db.find(obj).then(function(data){
                  var param = data.body.docs;
                  if(typeof param === "undefined"){
                    deferred.reject({"status": 500, "error": "parameter does not exist"});
                  }else{
                    doc.processList = param;
                    deferred.resolve({"status": 200, "doc": doc})
                  }
                })
              })
            })
          }).fail(function(err) {
            deferred.reject({"status": 500, "error": err.error.reason});
          });

        }else{
          //load audit lesson by id
          if(typeof req.query.id === "undefined"){
            deferred.reject({"status": 500, "error": "ID does not exist"});
          }else{
            try{
              db.get(req.query.id).then(function(data){
                var doc = data.body;
                var tmpcountries = [];
                for(var key in req.app.locals.hierarchy.countries){
                  tmpcountries.push({"name": key});
                }
                doc.countries = tmpcountries;
                doc.IOTIMTs = req.app.locals.hierarchy.countries;
                if(typeof doc === "undefined"){
                  deferred.reject({"status": 500, "error": "Audit Lesson does not exist"});
                }else{
                  if(data.body.Log.length == 1){
                    data.body.Log.push(data.body.Log[0]);
                  }
                  if(data.body.Log.length > 2){
                    var tmpLog = [];
                    tmpLog.push(data.body.Log[0]);
                    tmpLog.push(data.body.Log[data.body.Log.length - 1]);
                    doc.Log = tmpLog;
                  }
                  if(data.body.auditProgramSelect == "Audit"){
                    doc.auditSelectYes = true;
                  }else{
                    doc.auditSelectYes = false;
                  }
                  //load data necessary for edit mode
                  if(typeof req.query.edit !== "undefined"){
                    var tmpArr = data.body.reportingPeriod.split("Q");
                    doc.reportingQuarter = tmpArr[0];
                    doc.reportingYear = tmpArr[1];
                    doc.editmode = true;
                    doc.reportingQuarters = [
                      {quarter:1},
                      {quarter:2},
                      {quarter:3},
                      {quarter:4}
                    ];
                    var obj = {
                      selector : {
                        "_id": {"$gt":0},
                        keyName: req.session.businessunit+"AuditPrograms"
                      }};
                      db.find(obj).then(function(data){
                        var param = data.body.docs[0];
                        if(typeof param === "undefined"){
                          deferred.reject({"status": 500, "error": "parameter does not exist"});
                        }else{
                          doc.programs = param.value.options;
                        }
                        var obj = {
                          selector : {
                            "_id": {"$gt":0},
                            keyName: "ReportingYears"
                          }};
                          db.find(obj).then(function(data){

                            var param = data.body.docs[0];
                            if(typeof param === "undefined"){
                              deferred.reject({"status": 500, "error": "parameter does not exist"});
                            }else{
                              doc.reportingYears = param.value.options;
                            }
                            var obj = {
                              selector: {
                                Name: { "$gt": null },
                                key: "Assessable Unit",
                                DocSubType:"Business Unit",
                                Status: "Active",
                                MIRABusinessUnit: req.session.businessunit
                              },
                              fields: [
                                "Name"
                              ]
                            };
                            db.find(obj).then(function(data){
                              var param = data.body.docs;
                              if(typeof param === "undefined"){
                                deferred.reject({"status": 500, "error": "parameter does not exist"});
                              }else{
                                doc.businessList = param;
                              }
                              var obj = {
                                selector: {
                                  Name: { "$gt": null },
                                  key: "Assessable Unit",
                                  DocSubType:"Global Process",
                                  Status: "Active",
                                  MIRABusinessUnit: req.session.businessunit
                                },
                                fields: [
                                  "Name"
                                ]
                              };
                              db.find(obj).then(function(data){
                                var param = data.body.docs;
                                if(typeof param === "undefined"){
                                  deferred.reject({"status": 500, "error": "parameter does not exist"});
                                }else{
                                  doc.processList = param;
                                  deferred.resolve({"status": 200, "doc": doc})
                                }
                              })
                            })
                          })
                        }).fail(function(err) {
                          deferred.reject({"status": 500, "error": err.error.reason});
                        });
                      }else{
                        deferred.resolve({"status": 200, "doc": doc})
                      }
                    }
                  }).catch(function(err) {
                    deferred.reject({"status": 500, "error": err.error.reason});
                  });
                }catch(e){
                  deferred.reject({"status": 500, "error": e});
                }
              }
            }
            return deferred.promise;
          },

          /* Get all Audit Lesson in cloudant */
          getAllLessons: function(req, db) {
            var deferred = q.defer();
            try{
              var view = [];
              var obj = {
                selector : {
                  "_id": {"$gt":0},
                  "reportingPeriod": {"$gt":0},
                  docType: "auditLesson",
                  businessUnit: "IBM "+req.session.businessunit
                },
                sort:[{"reportingPeriod":"desc"}, {"auditProgram":"desc"}]

              };

                db.find(obj).then(function(data){
                  var uniqueBUs = {};
                  var uniquePeriods = {};
                  var uniquePrograms = {};
                  var docs = data.body.docs;
                  var list = [];
                  var dataExport = [];
                  for(var i = 0; i < docs.length; i++){
                    if(typeof uniqueBUs[docs[i].businessUnit] === "undefined"){
                      uniqueBUs[docs[i].businessUnit] = true;
                      list.push({id: docs[i].businessUnit.replace(/ /g,''), name: docs[i].businessUnit});
                    }

                    if(typeof uniquePeriods[docs[i].reportingPeriod] === "undefined"){
                      uniquePeriods[docs[i].reportingPeriod] = true ;
                      list.push({id: docs[i].reportingPeriod, name: docs[i].reportingPeriod, parent: docs[i].businessUnit.replace(/ /g,'') });
                    }

                    if(typeof uniquePrograms[docs[i].auditProgram+""+docs[i].reportingPeriod] === "undefined"){
                      uniquePrograms[docs[i].auditProgram+""+docs[i].reportingPeriod] = true;
                      list.push({id: docs[i].auditProgram.replace(/ /g,'')+""+docs[i].reportingPeriod, name: docs[i].auditProgram, parent: docs[i].reportingPeriod});
                    }
                    list.push({
                      "_id": docs[i]["_id"],
                      id: docs[i]["_id"],
                      parent:docs[i].auditProgram.replace(/ /g,'')+""+docs[i].reportingPeriod,

                      engagementID: docs[i].engagementIDone +"-"+docs[i].engagementIDtwo+"-"+docs[i].engagementIDthree+" "+docs[i].recommendationNum,
                      IOT: docs[i].IOT,
                      IMT: docs[i].IMT,
                      country: docs[i].country,
                      process: docs[i].globalProcess,
                      subprocess: docs[i].subprocess,
                      observationCategory: docs[i].observationCategory,
                      summary: docs[i].summary
                    });
                    dataExport.push({
                      BU: docs[i].businessUnit,
                      period: docs[i].reportingPeriod,
                      type: docs[i].auditProgram,
                      engagementID: docs[i].engagementIDone +"-"+docs[i].engagementIDtwo+"-"+docs[i].engagementIDthree+" "+docs[i].recommendationNum,
                      IOT: docs[i].IOT,
                      IMT: docs[i].IMT,
                      country: docs[i].country,
                      process: docs[i].globalProcess,
                      subprocess: docs[i].subprocess,
                      observationCategory: docs[i].observationCategory,
                      summary: docs[i].summary
                    });

                  }

                  deferred.resolve({"status": 200, "dataExport": dataExport,"doc": list});
                }).catch(function(err){
                  deferred.reject({"status": 500, "error": err.error.reason});
                });
              }catch(e){
                deferred.reject({"status": 500, "error": e});
              };
              return deferred.promise;
            },

            /* Save Audit Lesson in cloudant */
            saveAL: function(req, db) {
              var deferred = q.defer();
              try{
                var docid = req.body["_id"];
                var now = moment(new Date());
                var curruser = req.session.user.notesId;
                var currdate = now.format("MM/DD/YYYY");
                var addlog = {
                "name": curruser,
                "date": utility.getDateTime("","date"),
                "time": utility.getDateTime("","time")
            };

                if(req.body.editmode == "new"){
                  var newAudit = {};
                  newAudit.docType= "auditLesson",
                  newAudit.Log = [];
                  newAudit.Log.push(addlog);
                  newAudit.engagementIDone = req.body.engagementIDone;
                  newAudit.engagementIDtwo = req.body.engagementIDtwo;
                  newAudit.engagementIDthree = req.body.engagementIDthree;
                  newAudit.recommendationNum = req.body.recommendationNum;
                  newAudit.auditProgram = req.body.auditProgram;
                  newAudit.auditProgramSelect = req.body.auditProgramSelect;
                  newAudit.observationCategory = req.body.observationCategory;
                  newAudit.reportingPeriod = req.body.reportingQuarter+"Q"+req.body.reportingYear;
                  newAudit.businessUnit = req.body.BU;
                  newAudit.country = req.body.country;
                  newAudit.IMT = req.body.IMT;
                  newAudit.IOT = req.body.IOT;
                  newAudit.globalProcess = req.body.globalProcess;
                  newAudit.subprocess = req.body.subprocess;
                  newAudit.summary = req.body.Notes;

                  db.save(newAudit).then(function(data){
                    deferred.resolve({"status": 200, "id": data.body.id});
                  }).catch(function(err){
                    deferred.reject({"status": 500, "error": err.error.reason});
                  });
                }else{
                  var obj = {
                    selector:{
                      "_id": docid,
                    },
                    fields: [
                      "_id",
                      "_rev",
                      "docType",
                      "Log"
                    ]
                  };
                  db.find(obj).then(function(data){
                    data.body.docs[0].Log.push(addlog);
                    data.body.docs[0].engagementIDone = req.body.engagementIDone;
                    data.body.docs[0].engagementIDtwo = req.body.engagementIDtwo;
                    data.body.docs[0].engagementIDthree = req.body.engagementIDthree;
                    data.body.docs[0].recommendationNum = req.body.recommendationNum;
                    data.body.docs[0].auditProgram = req.body.auditProgram;
                    data.body.docs[0].auditProgramSelect = req.body.auditProgramSelect;
                    data.body.docs[0].observationCategory = req.body.observationCategory;
                    data.body.docs[0].reportingPeriod = req.body.reportingQuarter + "Q"+req.body.reportingYear;
                    data.body.docs[0].businessUnit = req.body.BU;
                    data.body.docs[0].country = req.body.country;
                    data.body.docs[0].IMT = req.body.IMT;
                    data.body.docs[0].IOT = req.body.IOT;
                    data.body.docs[0].globalProcess = req.body.globalProcess;
                    data.body.docs[0].subprocess = req.body.subprocess;
                    data.body.docs[0].summary = req.body.Notes;

                    db.save(data.body.docs[0]).then(function(data){
                      deferred.resolve({"status": 200, "id": data.body.id});
                    }).catch(function(err){
                      deferred.reject({"status": 500, "error": err.error.reason});
                    });
                  });
                }

              }catch(e){
                deferred.reject({"status": 500, "error": e});
              }
              return deferred.promise;
            }

          };


          module.exports = auditlesson;
