/**************************************************************************************************
 *
 * access summary code for MIRA Web
 * Created by Carlos Ramirez
 * 12/Dec/2016
 * */
var varConf = require('../../../configuration');
var excel = require('node-excel-export');
var q  = require("q");
var moment = require('moment');
var xml2js = require('xml2js');
var forEach = require('async-foreach').forEach;

var createIndexFromView = function(docs){
	var  result = {};
		forEach(docs, function (item,index,arr){
				result[item.id] = index;
		});
	return result;
	
}

checkUndefined = function(data){

	if(typeof data == 'undefined'  )
	return "";
	else
	return data

}

var createUserList = function(docs){
	var result = {};
	var temparray = [];
	var ordered = {};
	var response = {};
	
	try{
		forEach(docs, function (item,index,arr){
			
					
			for(var i=0;i<item.doc.AllReaders.length;i++){
				var tempObj = {};
				   tempObj["id"] = item.doc.doc_id;
				  	  tempObj["role"] = "Reader";
					if(result[item.doc.AllReaders[i]] instanceof Array){
					result[item.doc.AllReaders[i]].push(tempObj);
					}else{//meaning if the user is created but does not have readers array added we need to add them for the first time
						temparray.push(tempObj);
						result[item.doc.AllReaders[i]] = [];
						result[item.doc.AllReaders[i]] = temparray;
						temparray = [];
					}
				
				tempObj = {}; 
			}
			
			for(var j=0;j<item.doc.AllEditors.length;j++){
				var tempObj = {};
				  tempObj["id"] = item.doc.doc_id;
			  	  tempObj["role"] = "Editor";
					    
					if(result[item.doc.AllEditors[j]] instanceof Array){
					result[item.doc.AllEditors[j]].push(tempObj);
					}else{//meaning if the user is created but does not have editors array added we need to add them for the first time
						temparray.push(tempObj);
						result[item.doc.AllEditors[j]] = [];
						result[item.doc.AllEditors[j]] = temparray;
						temparray = [];
						
					}
					tempObj = {};
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


var findRole = function (doc,user){
	
	if(doc.Owner)
		if(doc.Owner.indexOf(user)!= -1)
			return "Owner";
		
			if(doc.Focals)
				if(doc.Focals.indexOf(user)!= -1)
					return "Focal";
				
					if(doc.Coordinators)
						if(doc.Coordinators.indexOf(user)!= -1)
							return "Coordinator";
						
							if(doc.Readers)
								if(doc.Readers.indexOf(user)!= -1)
									return "Reader";
								
									if(doc.AdditionalEditors)
										if(doc.AdditionalEditors.indexOf(user)!= -1)
											return "Editor";
										
											if(doc.AdditionalReaders)
												if(doc.AdditionalReaders.indexOf(user)!= -1)
													return "Reader";
												return "";
}



//recursive function to find the user role
var findRoleRecursive = function(indexList,docs,doc_id,user,role){
	try{
	//try to find exit condition
	role = 	findRole(docs[indexList[doc_id]].doc,user);
			
	
	if(role.length < 1 && docs[indexList[doc_id]].doc.parentid){ //if role is not found and parentid exist it keeps looking deep on hierarchy
		return findRoleRecursive(indexList,docs,docs[indexList[doc_id]].doc.parentid,user,role);
	}
	else
		if(!docs[indexList[doc_id]].doc.parentid && role.length < 1) //means there is no parentid means you reach to top level and not found the role
			return "role not found";
		else
			return role; //means role was found
			
	
	
	}catch(e){ console.log(e); return "Error at Role";}
		
	}


var accesssumaryreports = {
		
		exportToExcel : function (req,db){
			
			var deferred = q.defer();
			var response = {};
			var datafeed = {};
			var datarray = [];
			var docsView = "";
			var usersView = "";
			var arrayofDocs = [];
			
			var user = {};
			var userData = [];
			var dataset = [];
			
			
			
			var styles = {  //Styles for the export
					  headerDark: {
					    fill: {
					      fgColor: {
					        rgb: '87AFC6'
					      }
					    },
					    font: {
					      color: {
					        rgb: 'FFFFFFFF'
					      },
					      sz: 14,
					      bold: true,
					      underline: true
					    }
					  },
					  cellPink: {
					    alignment:{
					    	wrapText:true
					      }
					  },
					  cellGreen: {
					    fill: {
					      fgColor: {
					        rgb: 'FF00FF00'
					      }
					    }
					  }
					};
			
			//Array of objects representing heading rows (very top) 
			var heading = [	];
			
			
			
			//Here you specify the export structure 
	var specification = {
			user: { // <- the key should match the actual data key 
				    displayName: 'User',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 220 // <- width in pixels 
			  },
			  role: {
				    displayName: 'Role',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 220 // <- width in pixels 
				  },
		 type: {
				  displayName: 'Type',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 100 // <- width in pixels 
			  },
		  assessableUnit: {
			    displayName: 'Assessable Unit (WWBCIT blue/Mira green)',
			    headerStyle: styles.headerDark,
			    cellStyle: styles.cellPink, // <- Cell style 
			    width: 220 // <- width in pixels 
			  },
			  
		  status: {
				    displayName: 'Status',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 220 // <- width in pixels 
				  }
			  
			}
		
			
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
						   					var document = {};
						   					var tempRole = "";
						   					var role = "";
						   			
						   				
						   					if(indexGBS[UserListOfDocs[key][i].id]){ //if access doc exist on a document
						   						
						   						
						   						
						   						//Obtain recursive WWBCIT/MIRA roles
						   						if(typeof documents.body.rows[indexGBS[UserListOfDocs[key][i].id]].doc.WWBCITKey != 'undefined'  ) 					
												{ 
													if(documents.body.rows[indexGBS[UserListOfDocs[key][i].id]].doc.WWBCITKey.length == 0)
													{
														 tempRole = findRole(documents.body.rows[indexGBS[UserListOfDocs[key][i].id]].doc,key);
														 if(tempRole.length >1)
															 document.role = tempRole;
														 else
															 document.role = UserListOfDocs[key][i].role;
													}
													else{
														
														document.role = findRoleRecursive(indexGBS,documents.body.rows,UserListOfDocs[key][i].id,key,role);
													}
													
												}
												else{ 	
													 tempRole = findRole(documents.body.rows[indexGBS[UserListOfDocs[key][i].id]].doc,key);
													 if(tempRole.length >1)
														 document.role = tempRole;
													 else
														 document.role = UserListOfDocs[key][i].role;
													}
						   						
						   						
						   					 
						   				
						   					document.user = key;
						   					
						   					//document.Role = UserListOfDocs[key][i].role;
						   					document.type = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i].id]].doc.DocSubType);
						   					document.assessableUnit = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i].id]].doc.Name);
						   					document.status = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i].id]].doc.Status);
						   					
						   					
						   					}
						   					
						   				
						   					
						   				
						   					dataset.push(document);
						   			
						   					count++;
						   				
						   				}//inner for
						   			
								    }
						   			
								}
								
																
								
							}catch(e){deferred.reject({"status": 500, "error": e});}
							
					console.log(dataset);
							
							var report = excel.buildExport(
									  [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report 
									    {
									      name: 'AccessSummary', // <- Specify sheet name (optional) 
									      heading: heading, // <- Raw heading array (optional) 
									      specification: specification, // <- Report specification 
									      data: dataset // <-- Report data 
									    }
									  ]
									);
							
							
						
							deferred.resolve({"status": 200, "data": report});
						
							
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
module.exports = accesssumaryreports;