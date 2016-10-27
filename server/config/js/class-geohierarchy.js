/**
* GeoHierarchy Class: functionality for creating the GeoHierarchy tree.
* @author Christopher Harold Spangler Garcia
* @version 1.0
*/

//Required modules
var q = require("q");

//imports
var parameter = require('./class-parameter.js');
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
	var IMT = {};
	var key = {};
	var countries = {};
	var country = {};
	var iot = {};
	var indexIOT = {};
	var indexIOTIMTs = {};
	var response = {};
	var uri = "http://mira-connector-dev.w3ibm.mybluemix.net/showAlldata?designdoc=wwbcitdocs&viewname=hierarchy";
	try{
		util.callhttp(uri).then(function(data){

			var json = data.doc;

			try{
				for(var i=0;i<json.length;i++){  //Iterate on all the response by country
					country["id"] = json[i].ID;
					country["IMT"] = json[i].SUB_GEO;
					country["IOT"] = json[i].GEO;
					countries[json[i].COUNTRY]= country;

					if(typeof IMT[json[i].SUB_GEO] !== 'undefined'){ // check if IMT exist and add the addional countries
						IMT[json[i].SUB_GEO].push(json[i].COUNTRY);

					}else{  // if not add the new IMT with its country

						IMT[json[i].SUB_GEO] = [json[i].COUNTRY];

						imt= {};
					}

					if(typeof indexIOT[json[i].GEO] !== 'undefined' ){ // check if IOT exist and add the addional countries
						if(typeof indexIOTIMTs[json[i].SUB_GEO] === 'undefined' ){
							IOT[indexIOT[json[i].GEO]].IMTs.push(json[i].SUB_GEO);
							indexIOTIMTs[json[i].SUB_GEO] = "true";
						}

					}else{  // if not add the new IMT with its country
						iot["name"] = json[i].GEO;
						iot["IMTs"] = [json[i].SUB_GEO];
						IOT.push(iot);
						indexIOT[json[i].GEO] = IOT.length-1;
						indexIOTIMTs[json[i].SUB_GEO] = "true";
						iot= {};
					}

					country = {};

				}
			}catch(e){console.log(e);}


			response["countries"]= countries;
			response["IMT"] = IMT;
			response["IOT"] = IOT;

			deferred.resolve({"status": 200, "response": response});

		}).catch(function(error){ //end getParam

			deferred.reject({"status": 500, "error": err.error.reason});

		});


	}catch(e){
		deferred.reject({"status": 500, "error": e});
	}

	return deferred.promise;


},

}

module.exports = geohierarchy;
