/**
* GeoHierarchy Class: functionality for creating the GeoHierarchy tree.
* @author Christopher Harold Spangler Garcia
* @version 1.0
*/

//Required modules
var q = require("q");

//imports
var varConf = require('../../../configuration');
var util = require('./class-utility.js');

var geohierarchy = {
	getGeoHierarchy: function (req, sqlQueryJSON) {
		var response = [];
		var deferred = q.defer();

		try {
			if (req.session.businessunit == "GBS") {
				response = geohierarchy.generateGeoHierarchyList(sqlQueryJSON);
			}
			else {
				response = geohierarchy.generateGeoHierarchyList(sqlQueryJSON);
			}
			deferred.resolve({"status": 200, "data": response});

		}
		catch(e){
			console.log("error at class-geohierarchy level: "+e);
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	generateGeoHierarchyList: function(sqlQuery) {
		try{
			var geoHierarchyList = [];
			for (var i=0; i<sqlQuery.IOT.length; i++) {
				geoHierarchyList.push({
					"type":"GMT/IOT",
					"name":sqlQuery.IOT[i].name,
					"id":sqlQuery.IOT[i].name.replace(/ /g,'')
				});
				for (var j=0; j<sqlQuery.IOT[i].IMTs.length; j++) {
					if(sqlQuery.IOT[i].name != sqlQuery.IOT[i].IMTs[j] ){ //validates IOT and IMT are diff to generate parentID
						geoHierarchyList.push({
							"type":"GMT/IMT",
							"name":sqlQuery.IOT[i].IMTs[j],
							"id":sqlQuery.IOT[i].IMTs[j].replace(/ /g,''),
							"parentID":sqlQuery.IOT[i].name.replace(/ /g,'')
						});
					}
					else {
						if(sqlQuery.IOT[i].IMTs[j].indexOf(' ') >= 0){ //if IOT has spaces construct the id replacing empty spaces
							geoHierarchyList.push({
								"type":"GMT/IMT",
								"name":sqlQuery.IOT[i].IMTs[j],
								"id":sqlQuery.IOT[i].IMTs[j].replace(/ /g,'child'),
								"parentID":sqlQuery.IOT[i].name.replace(/ /g,'')
							});
						}
						else{//if has no spaces counstruc the ID adding child at the end
							geoHierarchyList.push({
								"type":"GMT/IMT",
								"name":sqlQuery.IOT[i].IMTs[j],
								"id":sqlQuery.IOT[i].IMTs[j]+"child",
								"parentID":sqlQuery.IOT[i].name.replace(/ /g,'')
							});
						}
					}
					for (var n=0; n<sqlQuery.IMT[sqlQuery.IOT[i].IMTs[j]].length; n++) {

						if(sqlQuery.IOT[i].name != sqlQuery.IOT[i].IMTs[j] ){ //validates IOT and IMT are diff to generate parentID
							geoHierarchyList.push({
								"type":"Country",
								"name":sqlQuery.IMT[sqlQuery.IOT[i].IMTs[j]][n],
								"id":sqlQuery.IMT[sqlQuery.IOT[i].IMTs[j]][n].replace(/ /g,''),
								"parentID":sqlQuery.IOT[i].IMTs[j].replace(/ /g,'')
							});
						}
						else{
							if(sqlQuery.IOT[i].IMTs[j].indexOf(' ') >= 0){//if IOT has spaces construct the id replacing empty spaces
								geoHierarchyList.push({
									"type":"Country",
									"name":sqlQuery.IMT[sqlQuery.IOT[i].IMTs[j]][n],
									"id":sqlQuery.IMT[sqlQuery.IOT[i].IMTs[j]][n].replace(/ /g,'-'),
									"parentID":sqlQuery.IOT[i].IMTs[j].replace(/ /g,'child')
								});
							}
							else{//if has no spaces counstruc the ID adding child at the end
								geoHierarchyList.push({
									"type":"Country",
									"name":sqlQuery.IMT[sqlQuery.IOT[i].IMTs[j]][n],
									"id":sqlQuery.IMT[sqlQuery.IOT[i].IMTs[j]][n].replace(/ /g,'-'),
									"parentID":sqlQuery.IOT[i].IMTs[j]+"child"
								});
							}							
						}
					}
				}
			}
		}catch(e){console.log("error:"+e);}
		return geoHierarchyList;
	},
	/*checkIDIsNotSameAsParentID: function(currentID, parentID) {
	var correctID = "";
	if (currentID == parentID) {
	correctID = currentID+"Child";
}
else {
correctID = currentID;
}
return correctID;
},*/
	createGEOHierarchy: function(req){
		var deferred = q.defer();

		var IOT = [];
		var BU_IMT = {};
		var BU_IOT = {};
		var IMT = {};
		var key = {};
		var countries = {};
		var country = {};
		var iot = {};
		var indexIOT = {};
		var indexIOTIMTs = {};
		var response = {};
		var uri = varConf.mirainterfaces + "/showAlldata2?designdoc=wwbcitdocs&viewname=hierarchy";
		try{
			util.callhttp(uri).then(function(data){
				if(data.status==200 & !data.error) {
					var json = data.doc;
					if(json != undefined || json != ""){
						for(var i=0;i<json.length;i++){  //Iterate on all the response by country
							if(json[i].doc.COUNTRY != ""){
								country["id"] = json[i].doc.ID;
								country["IMT"] = json[i].doc.SUB_GEO;
								country["IOT"] = json[i].doc.GEO;
								countries[json[i].doc.COUNTRY]= country;

								if(typeof IMT[json[i].doc.SUB_GEO] !== 'undefined'){ // check if IMT exist and add the additional countries
									IMT[json[i].doc.SUB_GEO].push(json[i].doc.COUNTRY);
								}else{  // if not add the new IMT with its country
									IMT[json[i].doc.SUB_GEO] = [json[i].doc.COUNTRY];
									imt= {};
								}
								if(typeof indexIOT[json[i].doc.GEO] !== 'undefined' ){ // check if IOT exist and add the additional countries
									if(typeof indexIOTIMTs[json[i].doc.SUB_GEO] === 'undefined' ){
										IOT[indexIOT[json[i].doc.GEO]].IMTs.push(json[i].doc.SUB_GEO);
										indexIOTIMTs[json[i].doc.SUB_GEO] = "true";
									}
								}else{  // if not add the new IMT with its country
									iot["name"] = json[i].doc.GEO;
									iot["IMTs"] = [json[i].doc.SUB_GEO];
									IOT.push(iot);
									indexIOT[json[i].doc.GEO] = IOT.length-1;
									indexIOTIMTs[json[i].doc.SUB_GEO] = "true";
									iot= {};
								}
								country = {};
							}
							else{
								if(json[i].doc.COUNTRY == "" && json[i].doc.SUB_GEO != ""){//IMT record process
									var tempIMT = {};
									tempIMT["IMT"] = json[i].doc.SUB_GEO;
									tempIMT["IOT"] = json[i].doc.GEO;
									tempIMT["ID"] = json[i].doc.ID;
									
									BU_IMT[json[i].doc.ID] = tempIMT;
									tempIMT = {};
								}
								if(json[i].doc.COUNTRY == "" && json[i].doc.SUB_GEO == "" && json[i].doc.GEO != ""){// IOT record
									var tempIOT = {};
									tempIOT["IOT"] = json[i].doc.GEO;
									tempIOT["ID"] = json[i].doc.ID;
								
									BU_IOT[json[i].doc.ID] = tempIOT;
									tempIOT = {};
								}
							}
						}
						response["countries"]= countries;
						response["IMT"] = IMT;
						response["IOT"] = IOT;
						response["BU_IMT"] = BU_IMT;
						response["BU_IOT"] = BU_IOT;

						deferred.resolve({"status": 200, "response": response});
					}
					else{
						console.log("[geohierarchy][createGEOHierarchy] - " + "Geo Hierarchy is empty");
						deferred.reject({"status": 500, "error": "Geo Hierarchy is empty"});
					}
				}
				else{
					console.log("[geohierarchy][createGEOHierarchy] - " + data.error);
					deferred.reject({"status": 500, "error": data.error});
				}
			}).catch(function(err){ //end util.callhttp
				console.log("[geohierarchy][createGEOHierarchy][callhttp] - " + err.error);
				deferred.reject({"status": 500, "error": err.error});
			});
		}catch(e){
			console.log("[geohierarchy][createGEOHierarchy] - " + e.stack);
			deferred.reject({"status": 500, "error": e.stack});
		}
		return deferred.promise;
	},

}

module.exports = geohierarchy;
