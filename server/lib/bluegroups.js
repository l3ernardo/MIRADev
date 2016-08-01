var express = require('express'),
    router = express.Router(),
    q  = require("q"),
     db = require('../config/js/class-conn.js');


var _membersURL = 'https://eapim-dev.w3ibm.mybluemix.net/devops/development/whitewater/bluegroups/%s/members?';
var _urlBG = 'https://bluepages.ibm.com/tools/groups/groupsxml.wss?task=inAGroup&depth=5&email=%s&group=%s';
var q = require("q");


/**
* @description This  query function verifies the membership of a user in a group.
* @param {String} url with parameters
*/
var requestBlueGroups = function(url) {
//console.log(url)
  var deferred = q.defer();
  var memberBG = [];
  var request = require('request');
  var lenRC = '<rc>'.length;
  var lenMsg = '<msg>'.length;
  var lenGroup = '<groupName>'.length;

  require('request').get(url, function(err, response, body) {
    if (err) {
      //return err;
      deferred.reject(err);
    }

    //All good, send back the members list
    //res.json(JSON.parse(response.body));
    var xmlDoc = response.body;
    var rc = xmlDoc.substring(xmlDoc.search('<rc>') + lenRC, xmlDoc.search('</rc>'));
    var msg = xmlDoc.substring(xmlDoc.search('<msg>') + lenMsg, xmlDoc.search('</msg>'));
    var groupName = xmlDoc.substring(xmlDoc.search('<groupName>') + lenGroup, xmlDoc.search('</groupName>'));

    memberBG.push({
      "msg": msg,
      "groupName": groupName
    });

    deferred.resolve(memberBG);
  });

  return deferred.promise;

}; //end requestBlueGroups

//**************************************************************************


var Bluegroups = function() {
  /**
   * Retrieve the list with  specified bluegroup.  Result is passed back
   * as a JSON Array to the callback function.
   */
  this.getMembersByBG = function(username) {
    var deferred = q.defer();
    var bluegroups = [];
	var bgroups = [];

      //read db to get the BG names.
      
        var deferred = q.defer();
        var obj = {
          selector:{
            "_id": {"$gt":0},
            "keyName": "Bluegroups"
          }
        };

        db.find(obj).then(function(data){
          var len = data.body.docs[0].value.bg.length;
          var doc = data.body.docs;

          for (var i = 0; i < len; i++) {
            var bgname = data.body.docs[0].value.bg[i].bgname;
            var urlBG = require('util').format(_urlBG, username, bgname);

            //checks the BG name and if user is member of the BG.
            requestBlueGroups(urlBG).then(function(data) {
              if(data){
                bluegroups.push(data);
				if(data[0].msg=='Success') {
					bgroups.push(data[0].groupName);
				}
                if(bluegroups.length==len) {
					deferred.resolve(bgroups);
				}
              }
            });
          } //end FOR

        }).catch(function(err) {
          deferred.reject({"status": 500, "error": err});
        });

        return deferred.promise;

  }; //end this.getMembersByBG

//**************************************************************************

  function getMembersPred() {
    var deferred = q.defer();
    var members = [];
    var urlBG = require('util').format(_membersURL, bgList);
    console.log("URL HR: " + urlBG);
    //Getting reader members
    require('request').get(urlBG, function(err, response, body) {
      if (err) {
        deferred.reject(err);
      }
      try {
        members.push({
          "bg": JSON.parse(response.body)
        });
      } catch (e) {
        members.push({
          "bg": bgList
        });
      }
        deferred.resolve(members);
    });
    return deferred.promise;
  }

//**************************************************************************
  /**
  * @deprecated 2016-01-19
  */
  this.getRoles = function(username) {
    var deferred = q.defer();
    var bluegroups = [];
    var groups;

    getMembersPred().then(function(data) {
      groups = data;
      console.log("Getting roles for: " + username);
      console.log("message bg " + groups[0].bg.httpMessage);
      var messageHR = groups[0].bg.httpMessage;
      if (messageHR == 'Internal Server Error') {
        bluegroups.push('error500'); //Failed to establish a backside connection
        deferred.resolve(bluegroups);
        //Internal Server Error
      } else {
        groups.forEach(function(group) {
          for (var list in group) {
            var members = group[list].members;
            for (var i in members) {
              if (members[i] == username)
                bluegroups.push(list);
            }
          }

          deferred.resolve(bluegroups);
        });
      }
    });
    return deferred.promise;
  }; //end getRolesAPI
}; // end var Bluegroups

module.exports = new Bluegroups();
