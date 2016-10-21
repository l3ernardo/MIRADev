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
	getGeoHierarchy: function (req) { 
		var result = "";
		//var deferred = q.defer();
		try  {
			if (req.session.businessunit == "GBS") {
				result = "GeoHierarchy -- GBS";
				console.log("GeoHierarchy -- GBS");
				return result;
			}
			else {
				result = "GeoHierarchy -- GTS";
				console.log("GeoHierarchy -- GTS");
				return result;
			}
		}
		catch(e){
			//deferred.reject({"status": 500, "error": e});
		}
	},
	
	createGEOHierarchy: function(req,db){
			var deferred = q.defer();

			var IOT = [];
			var IMT = {};
			var countries = [];
			var country = {};
			var iot = {};
			var indexIOT = {};
			var indexIOTIMTs = {};
			var response = {};
			var uri = "https://eapim-dev.w3ibm.mybluemix.net/portfoliomgmt/development/mira/hierarchy?QTR=";
	

			req.query.keyName = "ImportWWBCITData";

			try{
	
				parameter.getParam(req,db).then(function(data){

					 uri = uri+"'"+data.doc.value.quarter+"'&format=j";
					

				try{
					util.callhttp(uri).then(function(data){
					
						var json = data.doc.response.resultset;
						
					
				try{
					for(var i=0;i<json.length;i++){  //Iterate on all the response by country
				
						
							

								 country["name"] = json[i].row.COUNTRY;
								 country["IMT"] = json[i].row.SUB_GEO;
								 country["IOT"] = json[i].row.GEO;
								 countries.push(country);
								 
								 if(typeof IMT[json[i].row.SUB_GEO] !== 'undefined'){ // check if IMT exist and add the addional countries
										
								 	
				
									IMT[json[i].row.SUB_GEO].push(json[i].row.COUNTRY);

								 }else{  // if not add the new IMT with its country
							
									IMT[json[i].row.SUB_GEO] = [json[i].row.COUNTRY];
									

									imt= {};
								}

								if(typeof indexIOT[json[i].row.GEO] !== 'undefined' ){ // check if IOT exist and add the addional countries
									if(typeof indexIOTIMTs[json[i].row.SUB_GEO] === 'undefined' ){
										IOT[indexIOT[json[i].row.GEO]].IMTs.push(json[i].row.SUB_GEO);
										indexIOTIMTs[json[i].row.SUB_GEO] = "true";
									}
										
	
								 }else{  // if not add the new IMT with its country
									iot["name"] = json[i].row.GEO;
									iot["IMTs"] = [json[i].row.SUB_GEO];
									IOT.push(iot);	
									indexIOT[json[i].row.GEO] = IOT.length-1;
									indexIOTIMTs[json[i].row.SUB_GEO] = "true";
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
			

		

			}).catch(function(err) {//end callhttp
					console.log("[routes][geohierarchy] - " + err);
					deferred.reject({"status": 500, "error": err.error.reason});
				});


		}catch(e){
			deferred.reject({"status": 500, "error": e});
			}



			return deferred.promise;

		
		},


}

module.exports = geohierarchy;
