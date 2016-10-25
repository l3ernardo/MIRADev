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

createGEOHierarchy: function(req){
			var deferred = q.defer();

			var IOT = [];
			var IMT = {};
			var key = {};
			var countries = [];
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
								 country["name"] = json[i].COUNTRY;
								 country["IMT"] = json[i].SUB_GEO;
								 country["IOT"] = json[i].GEO;
								 
								 countries.push(country);
								 
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
