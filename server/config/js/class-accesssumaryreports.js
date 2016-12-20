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

createIndexFromView = function(docs){
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
				  },
		  addionalEditors: {
				    displayName: 'Addional Editors',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 220 // <- width in pixels 
				    },
			addionalReaders: {
				    displayName: 'Addional Readers',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 220 // <- width in pixels 
				    },
		    
		    owners: {
				    displayName: 'Owners',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 220 // <- width in pixels 
				    },
			focals: {
				    displayName: 'Focals',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 220 // <- width in pixels 
				    },		
			coordinators: {
				    displayName: 'Coordinators',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 220 // <- width in pixels 
				    },
		    readers: {
				    displayName: 'Readers',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 220 // <- width in pixels 
				    },
			iot: {
				    displayName: 'BU IOT',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 220 // <- width in pixels 
				    },					    
			imt: {
				    displayName: 'BU IMT',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 220 // <- width in pixels 
				    },	
		   country: {
			        displayName: 'Country',
				    headerStyle: styles.headerDark,
				    cellStyle: styles.cellPink, // <- Cell style 
				    width: 220 // <- width in pixels 
				    },	
			  
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
						   			
						   				
						   					if(indexGBS[UserListOfDocs[key][i]]){ //if access doc exist on a document
						   						
						   						
						   						
							   				
							   					document.user = key;
							   					document.type = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.DocSubType);
							   					document.assessableUnit = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Name.replace(/[^A-Za-z0-9]/g,''))
							   					document.status = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Status);
							   					document.addionalEditors = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.AdditionalEditors);
							   					document.addionalReaders = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.AdditionalReaders);
							   					document.owners = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Owner);
							   					document.focals = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Focals);
							   					document.coordinators =  checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Coordinators);
							   					document.readers = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.Readers);
							   					document.iot = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.IOT);
							   					document.imt = checkUndefined(documents.body.rows[indexGBS[UserListOfDocs[key][i]]].doc.IMT);
							   					document.country = "Country";
						   						
						   					
											
									
						   					
						   					
						   					}else{
						   						
												
											
						   												   						
						   					}
						   					
						   					if(i==0){
						   						element.push(key);
						   						element.push("D");
						   						
						   						
						   					}else{
						   						element.push("R");
						   						element.push(key);
						   					
						   					}
						   					
						   				
						   					dataset.push(document);
						   			
						   					count++;
						   				
						   				}//inner for
						   			
								    }
						   			
								}
								
																
								
							}catch(e){deferred.reject({"status": 500, "error": e});}
							
					
							
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