/**************************************************************************************************
 *
 * access summary code for MIRA Web
 * Developed by : Carlos Ramirez Vargas
 * Date:12 Oct 2016
 *
 */


var varConf = require('../../../configuration');
var q  = require("q");
var moment = require('moment');
var xml2js = require('xml2js');

var accesssumary = {

	getUserAccessSummary: function(req, db){
		var deferred = q.defer();
		try{
			if(req.session.businessunit == "GBS"){
				db.view('assessableUnit','view-users-GBS',{include_docs:true}).then(function(data){
						
					var response = {};
					var userList = [];
					var filterList = [];
					var user = {};
					var user1 = {};
					var userData = [];
					
					var parent = true;
					var f=0;

				try{
				for(i = 0; i<data.body.rows.length-1; i++){ //construct each document
					
						var document = {};
						
						document["_id"] = accesssumary.checkUndefined(data.body.rows[i].doc._id);	
						document["Name"] = accesssumary.checkUndefined(data.body.rows[i].key);	
						document["Type"] = accesssumary.checkUndefined(data.body.rows[i].doc.DocSubType);
						document["AssessableUnit"] = accesssumary.checkUndefined(data.body.rows[i].doc.Name);
						document["Status"] = accesssumary.checkUndefined(data.body.rows[i].doc.Status);
						document["AddionalEditors"] = accesssumary.checkUndefined(data.body.rows[i].doc.AdditionalEditors);
						document["AddionalReaders"] = accesssumary.checkUndefined(data.body.rows[i].doc.AdditionalReaders);
						document["Owners"] = accesssumary.checkUndefined(data.body.rows[i].doc.Owner);
						document["Focals"] = accesssumary.checkUndefined(data.body.rows[i].doc.Focals);
						document["Coordinators"] = accesssumary.checkUndefined(data.body.rows[i].doc.Coordinators);
						document["Readers"] = accesssumary.checkUndefined(data.body.rows[i].doc.Readers);
						document["IOT"] = accesssumary.checkUndefined(data.body.rows[i].doc.IOT);
						document["IMT"] = accesssumary.checkUndefined(data.body.rows[i].doc.IMT);
						document["Country"] = "Country";
						
						if(typeof data.body.rows[i].doc.WWBCITKey != 'undefined'  ) 					
						{ 
							if(data.body.rows[i].doc.WWBCITKey.length == 0)
							{
								document["Source"] = "Mira"; 
							}
							else{
								document["Source"] = "WWBCIT"; 
							}
							
						}
						else{document["Source"] = "Mira"; }
						
								
						
						if(data.body.rows[i].key == data.body.rows[i+1].key ){ //compare user has multiple access
							
							if(data.body.rows[i].doc._id != data.body.rows[i+1].doc._id ){ //make sure unique records are posted
								userData.push(document);
								if(f==0){   // validates that only one header name enter for multiple user access
									user1["name"] = data.body.rows[i].key;
									filterList.push(user1);
									user1 ={};
									f=1;
								}
								
								filterList.push(document);

								
							}
							
						}else{
							userData.push(document);
							user["name"] = data.body.rows[i].key;
							user1["name"] = data.body.rows[i].key;
							
							if(f==1){	//in case multiple user access added the last document	
								filterList.push(document);
							}else{
								user1["name"] = data.body.rows[i].key;
								filterList.push(user1);
								filterList.push(document);							
								}
							
							user["data"] = userData;
							userList.push(user);
							userData = [];
							user = {};
							user1 = {};
							f=0;
						
						} 

					}//end for	

							
							userData.push(document);
							user["name"] = data.body.rows[i].key;
							if(data.body.rows[i-1].key == data.body.rows[i].key){	//in case multiple user access added the last document						
								filterList.push(document);
							}else{
								user1["name"] = data.body.rows[i].key;
								filterList.push(user1);
								filterList.push(document);							
								}
							user["data"] = userData;
							userList.push(user);
							userData = [];
							user = {};
							user1 = {};
							f=0;
							
									
					}catch(e){deferred.reject({"status": 500, "error": e});}

					response["Users"] = userList;
					response["List"] = filterList;
					
					deferred.resolve({"status": 200, "data": response});

				}).catch(function(error){
					deferred.reject({"status": 500, "error": err.error.reason});
				});
 
			}
			else{
				db.view('assessableUnit','view-users-GTS',{include_docs:true}).then(function(data){
					var response = {};
					var userList = [];
					var filterList = [];
					var user = {};
					var user1 = {};
					var userData = [];
					
					var parent = true;
					var f=0;

				try{
				for(i = 0; i<data.body.rows.length-1; i++){ //construc each document
					
						var document = {};
						
						document["_id"] = accesssumary.checkUndefined(data.body.rows[i].doc._id);	
						document["Name"] = accesssumary.checkUndefined(data.body.rows[i].key);	
						document["Type"] = accesssumary.checkUndefined(data.body.rows[i].doc.DocSubType);
						document["AssessableUnit"] = accesssumary.checkUndefined(data.body.rows[i].doc.Name);
						document["Status"] = accesssumary.checkUndefined(data.body.rows[i].doc.Status);
						document["AddionalEditors"] = accesssumary.checkUndefined(data.body.rows[i].doc.AdditionalEditors);
						document["AddionalReaders"] = accesssumary.checkUndefined(data.body.rows[i].doc.AdditionalReaders);
						document["Owners"] = accesssumary.checkUndefined(data.body.rows[i].doc.Owner);
						document["Focals"] = accesssumary.checkUndefined(data.body.rows[i].doc.Focals);
						document["Coordinators"] = accesssumary.checkUndefined(data.body.rows[i].doc.Coordinators);
						document["Readers"] = accesssumary.checkUndefined(data.body.rows[i].doc.Readers);
						document["IOT"] = accesssumary.checkUndefined(data.body.rows[i].doc.IOT);
						document["IMT"] = accesssumary.checkUndefined(data.body.rows[i].doc.IMT);
						document["Country"] = "Country";
						
						if(typeof data.body.rows[i].doc.WWBCITKey != 'undefined'  ) 					
						{ 
							if(data.body.rows[i].doc.WWBCITKey.length == 0)
							{
								document["Source"] = "Mira"; 
							}
							else{
								document["Source"] = "WWBCIT"; 
							}
							
						}
						else{document["Source"] = "Mira"; }
						
								
						
						if(data.body.rows[i].key == data.body.rows[i+1].key ){ //compare user has multiple access
							
							if(data.body.rows[i].doc._id != data.body.rows[i+1].doc._id ){//make sure unique records are posted
								userData.push(document);
								if(f==0){// validates that only one header name enter for multiple user access
									user1["name"] = data.body.rows[i].key;
									filterList.push(user1);
									user1 ={};
									f=1;
								}
								
								filterList.push(document);

								
							}
							
						}else{
							userData.push(document);
							user["name"] = data.body.rows[i].key;
							user1["name"] = data.body.rows[i].key;
							
							if(f==1){			//in case multiple user access added the last document				
								filterList.push(document);
							}else{
								user1["name"] = data.body.rows[i].key;
								filterList.push(user1);
								filterList.push(document);							
								}
							
							user["data"] = userData;
							userList.push(user);
							userData = [];
							user = {};
							user1 = {};
							f=0;
						
						} 

					}//end for	

							
							userData.push(document);
							user["name"] = data.body.rows[i].key;
							if(data.body.rows[i-1].key == data.body.rows[i].key){	//in case multiple user access added the last document						
								filterList.push(document);
							}else{
								user1["name"] = data.body.rows[i].key;
								filterList.push(user1);
								filterList.push(document);							
								}
							user["data"] = userData;
							userList.push(user);
							userData = [];
							user = {};
							user1 = {};
							f=0;
							
									
					}catch(e){deferred.reject({"status": 500, "error": e});}

					response["Users"] = userList;
					response["List"] = filterList;
					
					deferred.resolve({"status": 200, "data": response});

				}).catch(function(error){
					deferred.reject({"status": 500, "error": err.error.reason});
				});
			}

		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}


		return deferred.promise;

},

		checkUndefined: function(data){

			if(typeof data == 'undefined'  )
			return " ";
			else
			return data

		},


}

module.exports = accesssumary;
