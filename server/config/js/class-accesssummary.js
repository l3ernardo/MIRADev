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

var shrinkSubType = function (type){
	response = "";
	
	switch(type){
	case "Account":
		response = "1";
		break;
	case "BU Country":
		response = "2";
		break;
	case "BU IMT":
		response = "3";
		break;
	case "BU IOT":
		response = "4";
		break;
	case "BU Reporting Group":
		response = "5";
		break;
	case "Controllable Unit":
		response = "6";
		break;
	case "Country Process":
		response = "7";
		break;
	case "Global Process":
		response = "8";
		break;
	case "Sub-process":
		response = "9";
		break;
	default:
		response = "666";
		break;
	
	}
	
	return response;
}

var removeEmail = function(list){
	var result= [];
	
	if(typeof list == "string")
	list = list.split(',');
	
	
	for(var i=0; i<list.length;i++){
		var temp = list[i].split("(")[0];
		 if(temp.indexOf("=") > -1){
			 temp = temp.split("/")[0].split("=")[1];
			  }
		result.push(temp);
	}
	return result;
}



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
	var ordered = {};
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
	   		
	   		
	   		Object.keys(response).sort().forEach(function(key) {
	   		  ordered[key] = response[key];
	   		});
	   		
			
		}catch(e){return ({"status": 500, "error": e});}
		
	}catch(e){deferred.reject({"status": 500, "error": e});}

	
		return ordered;
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

	getUserAccessSummary: function(req, db,start,end){
		var deferred = q.defer();
		var counterBreaker = 0;
		var response = {};
		var datafeed = {};
		var datarray = [];
		var docsView = "";
		var usersView = "";
		var arrayofDocs = [];
		
		var user = {};
		var userData = [];
		var userList = [];
		
		
		try{
			
			switch(req.session.businessunit){
			case "GBS":
				docsView = "view-docs-GBS";
				usersView = "view-users-GBS";
						
				break;
				
			case "GTS" :
				docsView = "view-docs-GTS";
				usersView = "view-users-GTS";
				break;
				
			case "GTS Transformation" :
				docsView = "view-docs-GTSTransformation";
				usersView = "view-users-GTSTransformation";
				break;
				
				default:
					deferred.reject({"status": 500, "error": "Wrong Business Unit"});
					break;
			
			}
			
			
		
				var count = 0;
				db.view('assessableUnit',docsView,{include_docs:true}).then(function(documents){
					var indexGBS = createIndexFromView(documents.body.rows);
					
			
				db.view('assessableUnit',usersView,{include_docs:true}).then(function(data){
				
					var UserListOfDocs = createUserList(data.body.rows);
					
					

					   
						try{
							for (var key in UserListOfDocs){ 
					   			if(UserListOfDocs.hasOwnProperty(key)){
					   				
					   				for(var i=0;i<UserListOfDocs[key].length;i++){
					   					var element = [];
					   										
					   					
					   					if(count >= start && count <= end){
					   				
					   				
					   					if(indexGBS[UserListOfDocs[key][i]]){ //if access doc exist on a document
					   				
										element.push(UserListOfDocs[key][i]);
										element.push(key);
										element.push(shrinkSubType(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.DocSubType)));
										element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Name.replace(/[^A-Za-z0-9]/g,'')));
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
												 
												element.push("M");
											}
											else{
												
												element.push("W");
											}
											
										}
										else{ 	element.push("M"); }
					   					
					   					
					   					}else{
					   						
					   						
											
											element.push(UserListOfDocs[key][i]);
										//	element.push("");
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
					   						element.push("D");
					   						
					   						
					   					}else{
					   						element.push("R");
					   						element.push(key);
					   					
					   					}
					   					
					   					datarray.push(element);
					   					
					   				}//if count
					   					counterBreaker ++;
					   					count++;
					   					
					   					if(count>end ){	break;	}
	
					   				}//inner for
					   			
							    }
					   			
					   			if(count>end ){	break;	}
					   		
							}
							
							//console.log("length of list: "+count);
							//console.log("length of array: "+datarray.length);
							
							
						}catch(e){deferred.reject({"status": 500, "error": e});}
					
						deferred.resolve({"status": 200, "data": datarray});
						
				}).catch(function(error){
					deferred.reject({"status": 500, "error": err.error.reason});
				});
				


				}).catch(function(error){
					deferred.reject({"status": 500, "error": err.error.reason});
				});
				

		}catch(e){
			deferred.reject({"status": 500, "error": e});
		}


		return deferred.promise;

},
getUserAccessSummaryByUser: function(req, db,userToFind){
	var deferred = q.defer();
	var counterBreaker = 0;
	var response = {};
	var datafeed = {};
	var datarray = [];
	var docsView = "";
	var usersView = "";
	var arrayofDocs = [];
	
	var user = {};
	var userData = [];
	var userList = [];
	
	
	try{
		
		switch(req.session.businessunit){
		case "GBS":
			docsView = "view-docs-GBS";
			usersView = "view-users-GBS";
					
			break;
			
		case "GTS" :
			docsView = "view-docs-GTS";
			usersView = "view-users-GTS";
			break;
			
		case "GTS Transformation" :
			docsView = "view-docs-GTSTransformation";
			usersView = "view-users-GTSTransformation";
			break;
			
			default:
				deferred.reject({"status": 500, "error": "Wrong Business Unit"});
				break;
		
		}
		
		
	
			var count = 0;
			db.view('assessableUnit',docsView,{include_docs:true}).then(function(documents){
				var indexGBS = createIndexFromView(documents.body.rows);
				
		
			db.view('assessableUnit',usersView,{include_docs:true}).then(function(data){
			
				var UserListOfDocs = createUserList(data.body.rows);
				   
					try{
						
						


						var UserListOfDocs = Object.keys(UserListOfDocs).filter(function(k) { //look only for the user
							k = k.toUpperCase();
						    return k.indexOf(userToFind.toUpperCase()) > -1;
						}).reduce(function(newData, k) {
						    newData[k] = UserListOfDocs[k];
						    return newData;
						}, {});
					
															
						
						for (var key in UserListOfDocs){
				   			if(UserListOfDocs.hasOwnProperty(key)){
				   				
				   				for(var i=0;i<UserListOfDocs[key].length;i++){
				   					var element = [];
				   										
				   					
				   				
				   				
				   				
				   					if(indexGBS[UserListOfDocs[key][i]]){ //if access doc exist on a document
				   				
									element.push(UserListOfDocs[key][i]);
									element.push(key);
									element.push(shrinkSubType(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.DocSubType)));
									element.push(accesssumary.checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Name.replace(/[^A-Za-z0-9]/g,'')));
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
											 
											element.push("M");
										}
										else{
											
											element.push("W");
										}
										
									}
									else{ 	element.push("M"); }
				   					
				   					
				   					}else{
				   						
				   						
										
										element.push(UserListOfDocs[key][i]);
									//	element.push("");
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
				   						element.push("D");
				   						
				   						
				   					}else{
				   						element.push("R");
				   						element.push(key);
				   					
				   					}
				   					
				   					datarray.push(element);
				   					
				   			
				   					counterBreaker ++;
				   					count++;
				   					
				   				

				   				}//inner for
				   			
						    }
				   			
				   	
				   		
						}
						
						
						
						//console.log("length of list: "+count);
						//console.log("length of array: "+datarray.length);
						
						
					}catch(e){deferred.reject({"status": 500, "error": e});}
				
					deferred.resolve({"status": 200, "data": datarray});
					
			}).catch(function(error){
				deferred.reject({"status": 500, "error": err.error.reason});
			});
			


			}).catch(function(error){
				deferred.reject({"status": 500, "error": err.error.reason});
			});
			

	}catch(e){
		deferred.reject({"status": 500, "error": e});
	}


	return deferred.promise;

},

		checkUndefined: function(data){

			if(typeof data == 'undefined'  )
			return "";
			else
			return data

		},
		
	getUserAccessSummaryTabs: function(req, db){
			var deferred = q.defer();
			var tabsCounter = 0;
			var counterBreaker = 0;
			var response = [];
		    var count =0;
		    var maxElementsPerView = 3000;
			
			
			try{
				
				switch(req.session.businessunit){
				case "GBS":
					docsView = "view-docs-GBS";
					usersView = "view-users-GBS";
							
					break;
					
				case "GTS" :
					docsView = "view-docs-GTS";
					usersView = "view-users-GTS";
					break;
					
				case "GTS Transformation" :
					docsView = "view-docs-GTSTransformation";
					usersView = "view-users-GTSTransformation";
					break;
					
					default:
						deferred.reject({"status": 500, "error": "Wrong Business Unit"});
						break;
				
				}
			
					db.view('assessableUnit',docsView,{include_docs:true}).then(function(documents){
						var indexGBS = createIndexFromView(documents.body.rows);
						
				
					db.view('assessableUnit',usersView,{include_docs:true}).then(function(data){
					
						var UserListOfDocs = createUserList(data.body.rows);
						   
							try{
								for (var key in UserListOfDocs){ 
						   			if(UserListOfDocs.hasOwnProperty(key)){
						   				
						   				for(var i=0;i<UserListOfDocs[key].length;i++){
						   					var element = [];
						   					
						   					counterBreaker ++;
						   					count++;
						   				
						   				}
						   				
						   				if(counterBreaker > maxElementsPerView ){
							   				var tabs = {};
							   				
							   				
							   				if(tabsCounter === 0)
							   					tabs.start = 0;
							   				else{
							   					
							   					tabs.start = response[tabsCounter-1].end+1;
							   				}
							   				
							   				tabs.end = count-1;
							   				response.push(tabs);
							   				counterBreaker = 0;
							   				tabsCounter++;
							   		
							   			}
						   									   								   				
								    }
						   									   		
						   		}
								
								if(count < maxElementsPerView){ // in case less than maxElementsPerView
									tabs = {};
									
									if(tabsCounter === 0){
										tabs.start = 0;
									}
									else{
										
				   				
										tabs.start = response[tabsCounter-1].end-1;
										tabs.end = count;
										response.push(tabs);
				   				
									}
								}
								else{
									tabs = {};
										
										tabs.start = response[tabsCounter-1].end+1;
										tabs.end = count;
										response.push(tabs);
				   											
								}
							
							
								//console.log("length of list: "+count);
								
								
							}catch(e){deferred.reject({"status": 500, "error": e});}
						
								
							deferred.resolve({"status": 200, "data": response});
							
						
					}).catch(function(error){
						deferred.reject({"status": 500, "error": err.error.reason});
					});
					


					}).catch(function(error){
						deferred.reject({"status": 500, "error": err.error.reason});
					});
					


			}catch(e){
				deferred.reject({"status": 500, "error": e});
			}


			return deferred.promise;

	},
	
	


}

module.exports = accesssumary;
