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
var forEach = require('async-foreach').forEach;


Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

var createIndexFromView = function(docs){
	var  result = {};
		forEach(docs, function (item,index,arr){
				result[item.id] = index;
		});
	return result;
	
}

var createUserList = function(docs){
	var result = {};
	var temparray = [];
	
	var response = {};
	
	try{
		forEach(docs, function (item,index,arr){
			
			
			
					
			for(var i=0;i<item.doc.AllReaders.length;i++){
				
		
				
					if(result[item.doc.AllReaders[i]] instanceof Array){
					result[item.doc.AllReaders[i]].push(item.doc.doc_id);
					}else{//meaning if the user is created but does not have readers array added we need to add them for the first time
						temparray.push(item.doc.doc_id);
						result[item.doc.AllReaders[i]] = [];
						result[item.doc.AllReaders[i]] = temparray;
						temparray = [];
					}
				
				
				
			}
			
			for(var j=0;j<item.doc.AllEditors.length;j++){
				
					    
					if(result[item.doc.AllEditors[j]] instanceof Array){
					result[item.doc.AllEditors[j]].push(item.doc.doc_id);
					}else{//meaning if the user is created but does not have editors array added we need to add them for the first time
						temparray.push(item.doc.doc_id);
						result[item.doc.AllEditors[j]] = [];
						result[item.doc.AllEditors[j]] = temparray;
						temparray = [];
						
					}
					
				
				
			}
					
		
		

		});	
		
		
		try{

	   		for (var key in result){  //create uniques docs response per user
	   			if(result.hasOwnProperty(key)){
	   			 response[key] = result[key].unique();
	   			}
	   		}
			
		}catch(e){return ({"status": 500, "error": e});}
		
	}catch(e){deferred.reject({"status": 500, "error": e});}

	
		return response;
}

var createUserListSplit = function(docs){
	var result = {};
	var AllReaders = [];
	var AllEditors = [];
	
	try{
	forEach(docs, function (item,index,arr){
		
		for(var i=0;i<item.doc.AllReaders.length;i++){
			
		
			if(result[item.doc.AllReaders[i]]){// if exist it will push the new doc ID
				if(result[item.doc.AllReaders[i]].AllReaders instanceof Array){
				result[item.doc.AllReaders[i]].AllReaders.push(item.doc.doc_id);
				}else{//meaning if the user is created but does not have readers arrray added we need to add them for the first ti
					AllReaders.push(item.doc.doc_id);
					result[item.doc.AllReaders[i]].AllReaders = [];
					result[item.doc.AllReaders[i]].AllReaders = AllReaders;
					AllReaders = [];
				}
			}else{ //if new it add the array for first time
				
				AllReaders.push(item.doc.doc_id);
				result[item.doc.AllReaders[i]] = {};
				result[item.doc.AllReaders[i]].AllReaders = [];
				
				result[item.doc.AllReaders[i]].AllReaders = AllReaders;
				AllReaders = [];
				
			}
			
			
		}
		
		for(var j=0;j<item.doc.AllEditors.length;j++){
			if(result[item.doc.AllEditors[j]]){// if exist it will push the new doc ID
				    
				if(result[item.doc.AllEditors[j]].AllEditors instanceof Array){
				result[item.doc.AllEditors[j]].AllEditors.push(item.doc.doc_id);
				}else{//meaning if the user is created but does not have editors arrray added we need to add them for the first time
					AllEditors.push(item.doc.doc_id);
					
					result[item.doc.AllEditors[j]].AllEditors = [];
					result[item.doc.AllEditors[j]].AllEditors = AllEditors;
					AllEditors = [];
					
				}
				
			}else{//if new it add the array for first time
				AllEditors.push(item.doc.doc_id);
				result[item.doc.AllEditors[j]] = {};
				result[item.doc.AllEditors[j]].AllEditors = [];
				result[item.doc.AllEditors[j]].AllEditors = AllEditors;
				AllEditors = [];
			}
			
		}
		
	
});
	}catch(e){console.log(e);}
	
	return result;
	
}

var getDocumentValues = function(docs){
	var response = [];
	var document = {};
	try{
	forEach(docs, function (item,index,arr){
		//console.log(item.value);
		var array = item.value.split(/[*]+/);
		
		document["Type"] = array[0];
		document["AssessableUnit"] = array[1];
		document["Status"] = array[2];
		document["AddionalEditors"] = array[3];
		document["AddionalReaders"] = array[4];
		document["Owners"] = array[5];
		document["Focals"] = array[6];
		document["Coordinators"] = array[7]
		document["Readers"] = array[8];
		document["IOT"] = array[9];
		document["IMT"] = array[10];
		document["WWBCITKey"] = array[11];
		
		document["Country"] = "Country";
		
		response[index]= document;
		array = [];
		document = {};
		
		
	});
	}catch(e){console.log(e);}
	
	return response;
}

var accesssumary = {

	getUserAccessSummary: function(req, db){
		var deferred = q.defer();
		var response = {};
		var datafeed = {};
		var datarray = [];
		
		var user = {};
		var userData = [];
		var userList = [];
		
		
		try{
			
			if(req.session.businessunit == "GBS"){
				var count = 0;
				db.view('assessableUnit','view-docs-GBS',{include_docs:true}).then(function(documents){
					var indexGBS = createIndexFromView(documents.body.rows);
					
			
				db.view('assessableUnit','view-users-GBS',{include_docs:true}).then(function(data){
				
					var UserListOfDocs = createUserList(data.body.rows);
					   
						try{
							for (var key in UserListOfDocs){ 
					   			if(UserListOfDocs.hasOwnProperty(key)){
					   				
					   				for(var i=0;i<UserListOfDocs[key].length;i++){
					   					var element = [];
					   					var document = {};
					   					count++;
					   					
					   					
					   					
					   					if(indexGBS[UserListOfDocs[key][i]]){ //if access doc exist on a document
					   					
					   					//document["_id"] = UserListOfDocs[key][i];
					   					document["_id"] = "";	
					   					document["Name"] = key;
					   					document["Type"] = accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.DocSubType);
					   					document["AssessableUnit"] = accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Name);
										document["Status"] = accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Status);
										document["AddionalEditors"] = accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.AdditionalEditors);
										document["AddionalReaders"] = accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.AdditionalReaders);
										document["Owners"] = accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Owner);
										document["Focals"] = accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Focals);
										document["Coordinators"] = accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Coordinators);
										document["Readers"] = accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Readers);
										document["IOT"] = accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.IOT);
										document["IMT"] = accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.IMT);
										document["Country"] = "Country";
										
										//element.push(UserListOfDocs[key][i]);
										element.push("");
										element.push(key);
										element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.DocSubType));
										element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Name));
										element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Status));
										element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.AdditionalEditors));
										element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.AdditionalReaders));
										element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Owner));
										element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Focals));
										element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Coordinators));
										element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Readers));
										element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.IOT));
										element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.IMT));
										element.push("Country");
									
										
										
										
										if(typeof documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.WWBCITKey != 'undefined'  ) 					
										{ 
											if(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.WWBCITKey.length == 0)
											{
												document["Source"] = "Mira"; 
												element.push("Mira");
											}
											else{
												document["Source"] = "WWBCIT";
												element.push("WWBCIT");
											}
											
										}
										else{document["Source"] = "Mira"; 	element.push("Mira"); }
					   					
					   					
					   					}else{
					   						
					   						document["_id"] = "";
						   					document["Name"] = key;
						   					document["Type"] = "Non Existing doc";
						   					document["AssessableUnit"] = "Non Existing doc";
											document["Status"] = "Non Existing doc";
											document["AddionalEditors"] = "Non Existing doc";
											document["AddionalReaders"] = "Non Existing doc";
											document["Owners"] = "Non Existing doc";
											document["Focals"] = "Non Existing doc";
											document["Coordinators"] = "Non Existing doc";
											document["Readers"] = "Non Existing doc";
											document["IOT"] = "Non Existing doc";
											document["IMT"] = "Non Existing doc";
											document["Country"] = "Non Existing doc";
											document["Source"] = "Non Existing doc";
											
											element.push("");
											element.push(key);
											element.push("Non Existing doc");
											element.push("Non Existing doc");
											element.push("Non Existing doc");
											element.push("Non Existing doc");
											element.push("Non Existing doc");
											element.push("Non Existing doc");
											element.push("Non Existing doc");
											element.push("Non Existing doc");
											element.push("Non Existing doc");
											element.push("Non Existing doc");
											element.push("Non Existing doc");
											element.push("Non Existing doc");
											element.push("Non Existing doc");
					   						
					   						
					   					}
					   					
					   					
					   					if(i==0){
					   						element.push(key);
					   						element.push("ccc");
					   						document["id"]= key;
					   						document["parentid"]= "ccc"
					   						
					   					}else{
					   						element.push("random ID");
					   						element.push(key);
					   						document["id"]= "random ID";
					   						document["parentid"]= key;
					   						
					   					}
					   					
					   					
					   					datarray.push(element);
					   					userData.push(document);
					   					
					   					
					   					
					   				}
					   				
					   				datafeed["draw"] = 1;
					   				datafeed["recordsTotal"] = count;
					   				datafeed["recordsFiltered"] = count;
					   				datafeed["data"] = datarray;
					   				
					   				
					   				user["name"] = key;
					   				user["data"] = userData;
					   				userList.push(user);
									userData = [];
									user = {};
									
					   				
					   				
							    }
					   			
					   			//if(count === 2) {break;}
					   			
							}
							response["Users"] = userList;
							response["List"] = userList;
							//console.log("length of list: "+count);
							
							
						}catch(e){deferred.reject({"status": 500, "error": e});}
					
						//deferred.resolve({"status": 200, "data": response});
						deferred.resolve({"status": 200, "data": datafeed});
					
				}).catch(function(error){
					deferred.reject({"status": 500, "error": err.error.reason});
				});
				


				}).catch(function(error){
					deferred.reject({"status": 500, "error": err.error.reason});
				});
				
				
 
			}
			else
				if(req.session.businessunit == "GTS"){
					var count = 0;
					db.view('assessableUnit','view-docs-GTS',{include_docs:true}).then(function(documents){
						var indexGTS = createIndexFromView(documents.body.rows);
						
				
					db.view('assessableUnit','view-users-GTS',{include_docs:true}).then(function(data){
					
						var UserListOfDocs = createUserList(data.body.rows);
						   
						
						
						
							try{
								for (var key in UserListOfDocs){ 
						   			if(UserListOfDocs.hasOwnProperty(key)){
						   				
						   				for(var i=0;i<UserListOfDocs[key].length;i++){
						   					var element = [];
						   					var document = {};
						   					count++;
						   					
						   					
						   					
						   					if(indexGTS[UserListOfDocs[key][i]]){ //if access doc exist on a document
						   					
						   					//document["_id"] = UserListOfDocs[key][i];
						   					document["_id"] = "";	
						   					document["Name"] = key;
						   					document["Type"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.DocSubType);
						   					document["AssessableUnit"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Name);
											document["Status"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Status);
											document["AddionalEditors"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.AdditionalEditors);
											document["AddionalReaders"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.AdditionalReaders);
											document["Owners"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Owner);
											document["Focals"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Focals);
											document["Coordinators"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Coordinators);
											document["Readers"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Readers);
											document["IOT"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.IOT);
											document["IMT"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.IMT);
											document["Country"] = "Country";
											
											//element.push(UserListOfDocs[key][i]);
											element.push("");
											element.push(key);
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.DocSubType));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Name));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Status));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.AdditionalEditors));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.AdditionalReaders));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Owner));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Focals));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Coordinators));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Readers));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.IOT));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.IMT));
											element.push("Country");
										
											
											
											
											if(typeof documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.WWBCITKey != 'undefined'  ) 					
											{ 
												if(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.WWBCITKey.length == 0)
												{
													document["Source"] = "Mira"; 
													element.push("Mira");
												}
												else{
													document["Source"] = "WWBCIT";
													element.push("WWBCIT");
												}
												
											}
											else{document["Source"] = "Mira"; 	element.push("Mira"); }
						   					
						   					
						   					}else{
						   						
						   						document["_id"] = "";
							   					document["Name"] = key;
							   					document["Type"] = "Non Existing doc";
							   					document["AssessableUnit"] = "Non Existing doc";
												document["Status"] = "Non Existing doc";
												document["AddionalEditors"] = "Non Existing doc";
												document["AddionalReaders"] = "Non Existing doc";
												document["Owners"] = "Non Existing doc";
												document["Focals"] = "Non Existing doc";
												document["Coordinators"] = "Non Existing doc";
												document["Readers"] = "Non Existing doc";
												document["IOT"] = "Non Existing doc";
												document["IMT"] = "Non Existing doc";
												document["Country"] = "Non Existing doc";
												document["Source"] = "Non Existing doc";
												
												element.push("");
												element.push(key);
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
						   						
						   						
						   					}
						   					
						   					
						   					if(i==0){
						   						element.push(key);
						   						element.push("ccc");
						   						document["id"]= key;
						   						document["parentid"]= "ccc"
						   						
						   					}else{
						   						element.push("random ID");
						   						element.push(key);
						   						document["id"]= "random ID";
						   						document["parentid"]= key;
						   						
						   					}
						   					
						   					
						   					datarray.push(element);
						   					userData.push(document);
						   					
						   					
						   					
						   				}
						   				
						   				datafeed["draw"] = 1;
						   				datafeed["recordsTotal"] = count;
						   				datafeed["recordsFiltered"] = count;
						   				datafeed["data"] = datarray;
						   				
						   				
						   				user["name"] = key;
						   				user["data"] = userData;
						   				userList.push(user);
										userData = [];
										user = {};
										
						   				
						   				
								    }
						   			
						   			//if(count === 2) {break;}
						   			
								}
								response["Users"] = userList;
								response["List"] = userList;
								//console.log("length of list: "+count);
								
								
							}catch(e){deferred.reject({"status": 500, "error": e});}
						
							//deferred.resolve({"status": 200, "data": response});
							deferred.resolve({"status": 200, "data": datafeed});
						
					}).catch(function(error){
						deferred.reject({"status": 500, "error": err.error.reason});
					});
					


					}).catch(function(error){
						deferred.reject({"status": 500, "error": err.error.reason});
					});
							
				
				
			}else
				if(req.session.businessunit == "GTS Transformation"){
					var count = 0;
					db.view('assessableUnit','view-docs-GTSTransformation',{include_docs:true}).then(function(documents){
						var indexGTS = createIndexFromView(documents.body.rows);
						
				
					db.view('assessableUnit','view-users-GTSTransformation',{include_docs:true}).then(function(data){
					
						var UserListOfDocs = createUserList(data.body.rows);
						   
						
						
						
							try{
								for (var key in UserListOfDocs){ 
						   			if(UserListOfDocs.hasOwnProperty(key)){
						   				
						   				for(var i=0;i<UserListOfDocs[key].length;i++){
						   					var element = [];
						   					var document = {};
						   					count++;
						   					
						   					
						   					
						   					if(indexGTS[UserListOfDocs[key][i]]){ //if access doc exist on a document
						   					
						   					//document["_id"] = UserListOfDocs[key][i];
						   					document["_id"] = "";	
						   					document["Name"] = key;
						   					document["Type"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.DocSubType);
						   					document["AssessableUnit"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Name);
											document["Status"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Status);
											document["AddionalEditors"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.AdditionalEditors);
											document["AddionalReaders"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.AdditionalReaders);
											document["Owners"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Owner);
											document["Focals"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Focals);
											document["Coordinators"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Coordinators);
											document["Readers"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Readers);
											document["IOT"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.IOT);
											document["IMT"] = accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.IMT);
											document["Country"] = "Country";
											
											//element.push(UserListOfDocs[key][i]);
											element.push("");
											element.push(key);
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.DocSubType));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Name));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Status));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.AdditionalEditors));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.AdditionalReaders));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Owner));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Focals));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Coordinators));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.Readers));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.IOT));
											element.push(accesssumary.checkUndefined(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.IMT));
											element.push("Country");
										
											
											
											
											if(typeof documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.WWBCITKey != 'undefined'  ) 					
											{ 
												if(documents.body.rows[indexGTS[UserListOfDocs[key][i]]].doc.WWBCITKey.length == 0)
												{
													document["Source"] = "Mira"; 
													element.push("Mira");
												}
												else{
													document["Source"] = "WWBCIT";
													element.push("WWBCIT");
												}
												
											}
											else{document["Source"] = "Mira"; 	element.push("Mira"); }
						   					
						   					
						   					}else{
						   						
						   						document["_id"] = "";
							   					document["Name"] = key;
							   					document["Type"] = "Non Existing doc";
							   					document["AssessableUnit"] = "Non Existing doc";
												document["Status"] = "Non Existing doc";
												document["AddionalEditors"] = "Non Existing doc";
												document["AddionalReaders"] = "Non Existing doc";
												document["Owners"] = "Non Existing doc";
												document["Focals"] = "Non Existing doc";
												document["Coordinators"] = "Non Existing doc";
												document["Readers"] = "Non Existing doc";
												document["IOT"] = "Non Existing doc";
												document["IMT"] = "Non Existing doc";
												document["Country"] = "Non Existing doc";
												document["Source"] = "Non Existing doc";
												
												element.push("");
												element.push(key);
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
												element.push("Non Existing doc");
						   						
						   						
						   					}
						   					
						   					
						   					if(i==0){
						   						element.push(key);
						   						element.push("ccc");
						   						document["id"]= key;
						   						document["parentid"]= "ccc"
						   						
						   					}else{
						   						element.push("random ID");
						   						element.push(key);
						   						document["id"]= "random ID";
						   						document["parentid"]= key;
						   						
						   					}
						   					
						   					
						   					datarray.push(element);
						   					userData.push(document);
						   					
						   					
						   					
						   				}
						   				
						   				datafeed["draw"] = 1;
						   				datafeed["recordsTotal"] = count;
						   				datafeed["recordsFiltered"] = count;
						   				datafeed["data"] = datarray;
						   				
						   				
						   				user["name"] = key;
						   				user["data"] = userData;
						   				userList.push(user);
										userData = [];
										user = {};
										
						   				
						   				
								    }
						   			
						   			//if(count === 2) {break;}
						   			
								}
								response["Users"] = userList;
								response["List"] = userList;
								//console.log("length of list: "+count);
								
								
							}catch(e){deferred.reject({"status": 500, "error": e});}
						
							//deferred.resolve({"status": 200, "data": response});
							deferred.resolve({"status": 200, "data": datafeed});
						
					}).catch(function(error){
						deferred.reject({"status": 500, "error": err.error.reason});
					});
					


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
