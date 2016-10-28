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
  var obj = {
    selector : {
      "_id": {"$gt":0},
      "sampleUniqueID": req.query.id
    }
  };

    db.find(obj).then(function(data){
      //console.log(data.body.docs[0]);
      data.body.docs[0].subtitle = data.body.docs[0].controllableUnit +" "+data.body.docs[0].controlShortName +" Sample";
      deferred.resolve({"status": 200, "data":data.body.docs[0]})
    }).catch(function(err) {
      deferred.reject({"status": 500, "error": err.error.reason});
    });
    return deferred.promise;
}
};

module.exports = components;
