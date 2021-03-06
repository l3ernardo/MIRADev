var express = require("express");
var passport = require('passport');
var administration = express.Router();
var app = express();
var db = require('./js/class-conn.js');
var varConf = require('../../configuration');
var auditlesson = require('./js/class-auditlesson.js');
// Add functionalities from other JS files
var parameter = require('./js/class-parameter.js');
var setup = require('./js/class-setup.js');
var isAuthenticated = require('./router-authentication.js');
var isAuthorized = require('./router-authorization.js');
var simpleAuthentication = require('./router-simpleAuthentication.js');
var accesssumary = require('./js/class-accesssummary.js');
var accesssumaryreports = require('./js/class-accesssumaryreports.js');
var geohierarchy = require('./js/class-geohierarchy.js');
var accessrules = require('./js/class-accessrules.js');
var buffer = require('buffer').kMaxLength;





/**************************************************************
SETUP FUNCTIONALITY
***************************************************************/
/* Setup will validate if required parameters were created */
administration.get('/setup', isAuthenticated, function(req, res, next){
	setup.getSetup(req, db, varConf.keyNameM, varConf.keyNameBU).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.numDocs < 2) {
				res.render('setup', data.setup[0]);
			} else {
				res.redirect('disclosure');
			}
		} else {
			res.render('error',{errorDescription: data.error})
			console.log("[routes][setup] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error})
		console.log("[routes][setup] - " + err.error);
	})
});
/* Save setup parameters in cloudant */
administration.post('/saveSetup', isAuthenticated, function(req, res){
	setup.saveSetup(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('index');
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][saveSetup] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][saveSetup] - " + err.error);
	})
});

/**************************************************************
PARAMETERS FUNCTIONALITY
***************************************************************/
//Add new parameter
administration.get('/newparam', isAuthenticated, function(req, res){
	var data = {"doc":{"value":{}}};
	res.render('formparam', data );
});

//Edit existing parameter
administration.get('/formparam', isAuthenticated, function(req, res){
	parameter.getParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.render('formparam', data )
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][getParam] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][getParam] - " + err.error);
	})
});
/* Load all parameters in view*/
administration.get('/parameter', isAuthenticated, function(req, res){
	parameter.listParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.render('parameters', data.parameters )
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][parameter] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][parameter] - " + err.error);
	})
});
/* Save parameter in cloudant */
administration.post('/saveParam', isAuthenticated, function(req, res) {
	parameter.saveParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.redirect('/parameter');
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][saveParam] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][saveParam] - " + err.error);
	})

});
administration.get('/getParam', isAuthenticated, function(req, res) {
	parameter.getParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send( data.doc );
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][getParam] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][getParam] - " + err.error);
	})
});
/* Get parameter by keyName */ // -> This is the only restful
administration.get('/getParameter', isAuthorized, function(req, res) {
	parameter.getParam(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send(data.doc.value);
		} else {
			res.render('error',{errorDescription: data.error});
			//console.log("[routes][getParameter] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		//console.log("[routes][getParameter] - " + err.error);
	})
});
/* Load test for list of parameter */
administration.get('/getListParams', isAuthenticated, function(req, res) {
	var lParams = ['GBSInstanceDesign', 'UnitSizes','ARCFrequencies'];
	parameter.getListParams(db, lParams).then(function(data) {
		if(data.status==200 & !data.error) {
			res.send( data.parameters.GBSInstanceDesign );
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][getListParams] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][getListParams] - " + err.error);
	})
});

/**************************************************************
Explicit user summary
***************************************************************/

administration.get('/explicitAccessSummary',isAuthenticated, function(req,res){
			var limits = "";
			
			
			
	if(req.query.start && req.query.end && req.query.searchEmail){ //user search wit limits of pagination
		
			
			accesssumary.getUserAccessSummaryByUser(req,db,req.query.searchEmail,req.query.start,req.query.end).then(function (data){

				if(data.status==200 & !data.error) {
				
					res.render('accesssummary',{alldata: JSON.stringify(data.data.datarray,'utf8').replace(/[`~!#$%^&*|+\-=?';:<>]/gi, ''),limits:req.query.limits, exportdata:data.data.userList, searchEmail:req.query.searchEmail});
	
					
					}else{

						res.render('error',{errorDescription: data.error});
						console.log("[routes][explicitAccessSummary] - " + data.error);


					}
			
				}).catch(function(err) {
					res.render('error',{errorDescription: err.error});
					console.log("[routes][explicitAccessSummary] - " + err.error);

				});
			
		
	}else
		if(req.query.start && req.query.end){
		
			accesssumary.getUserAccessSummary(req,db,req.query.start,req.query.end).then(function (data){

				if(data.status==200 & !data.error) {
					
				res.render('accesssummary',{alldata: JSON.stringify(data.data.datarray,'utf8').replace(/[`~!#$%^&*|+\-=?';:<>]/gi, ''),limits:req.query.limits, exportdata:data.data.userList});
				
				}else{

					res.render('error',{errorDescription: data.error});
					console.log("[routes][explicitAccessSummary] - " + data.error);


				}
			
				}).catch(function(err) {
				res.render('error',{errorDescription: err.error});
				console.log("[routes][explicitAccessSummary] - " + err.error);
				
					});

	}else
		if(req.query.searchEmail){
		
			accesssumary.getUserAccessSummaryTabsUser(req,db,req.query.searchEmail).then(function (tabs){
			
				accesssumary.getUserAccessSummaryByUser(req,db,req.query.searchEmail,tabs.data[0].start,tabs.data[0].end).then(function (data){

					if(data.status==200 & !data.error) {
						
						limits = "";
						for(var i=0;i<tabs.data.length;i++){
							
							if(i==tabs.data.length-1)
								limits += tabs.data[i].start+"|"+tabs.data[i].end;
							else
								limits += tabs.data[i].start+"|"+tabs.data[i].end+",";
							
						}
						res.render('accesssummary',{alldata: JSON.stringify(data.data.datarray,'utf8').replace(/[`~!#$%^&*|+\-=?';:<>]/gi, ''),limits:limits, exportdata:data.data.userList,searchEmail:req.query.searchEmail});
		
						
						}else{

							res.render('error',{errorDescription: data.error});
							console.log("[routes][explicitAccessSummary] - " + data.error);


						}
				
					}).catch(function(err) {
						res.render('error',{errorDescription: err.error});
						console.log("[routes][explicitAccessSummary] - " + err.error);

					});
				
			}).catch(function(err) {
				res.render('error',{errorDescription: err.error});
				console.log("[routes][explicitAccessSummary] - " + err.error);

			});
		   
	}
	
	
	else{ // means first time is called
		
		

		accesssumary.getUserAccessSummaryTabs(req,db).then(function (tabs){
			
			
		
			
			accesssumary.getUserAccessSummary(req,db,tabs.data[0].start,tabs.data[0].end).then(function (data){

				if(data.status==200 & !data.error) {
					limits = "";
					
					for(var i=0;i<tabs.data.length;i++){
					
						if(i==tabs.data.length-1)
							limits += tabs.data[i].start+"|"+tabs.data[i].end;
						else
							limits += tabs.data[i].start+"|"+tabs.data[i].end+",";
						
					}
					
					res.render('accesssummary',{alldata: JSON.stringify(data.data.datarray,'utf8').replace(/[`~!#$%^&*|+\-=?';:<>]/gi, ''),limits:limits, exportdata:data.data.userList});
		

				}else{

				res.render('error',{errorDescription: data.error});
				console.log("[routes][explicitAccessSummary] - " + data.error);


				}
				
				}).catch(function(err) {
					res.render('error',{errorDescription: err.error});
					console.log("[routes][explicitAccessSummary] - " + err.error);

					});
				
		}).catch(function(err) {
			res.render('error',{errorDescription: err.error});
			console.log("[routes][explicitAccessSummary] - " + err.error);

			});
		
	}
			
	

});



//data feed for Explicit access summary
administration.get('/dataFeedAccessSummary',isAuthenticated, function(req,res){
	
	
	
	
	accesssumary.getUserAccessSummaryTabs(req,db).then(function (tabs){
		
		accesssumary.getUserAccessSummary(req,db,tabs.data[0].start,tabs.data[0].end).then(function (data){

			if(data.status==200 & !data.error) {
			
				res.json(JSON.parse(JSON.stringify(data.data.datarray,'utf8').replace(/[`~!@#$%^&*()|+\-=?';:<>]/gi, '')));

			}else{

			res.render('error',{errorDescription: data.error});
			console.log("[routes][explicitAccessSummary] - " + data.error);


			}
			
			}).catch(function(err) {
				res.render('error',{errorDescription: err.error});
				console.log("[routes][explicitAccessSummary] - " + err.error);

				});
			
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][explicitAccessSummary] - " + err.error);

		});
	
	
});

//report generated at server level
administration.get('/downloadaccesssummary',isAuthenticated, function(req,res){

	switch(req.session.businessunit){
	
	case "GBS":
		
		accesssumaryreports.exportToExcel(req,db).then(function (data){
			//console.log("length of exported buffer: "+data.data.length);
			//console.log("Masimun Buffer size: "+buffer);
					res.attachment('access_summary_report.xlsx'); 
					res.send(data.data);
		
		}).catch(function(err) {
			res.render('error',{errorDescription: err.error});
			console.log("[routes][explicitAccessSummaryReport] - " + err.error);

			});
		
		
				
		break;
		
	case "GTS" :
		
		
		
		res.render('accesssummaryerror');
		
		
		break;
		
	case "GTS Transformation" :
		
		accesssumaryreports.exportToExcel(req,db).then(function (data){
			//console.log("length of exported buffer: "+data.data.length);
			//console.log("Masimun Buffer size: "+buffer);
					res.attachment('access_summary_report.xlsx'); 
					res.send(data.data);
		
		}).catch(function(err) {
			res.render('error',{errorDescription: err.error});
			console.log("[routes][explicitAccessSummaryReport] - " + err.error);

			});
		
		
		break;
		
		default:
			res.render('error',{errorDescription: "invalid Business Unit"});
		    console.log("[routes][explicitAccessSummary] - " + "invalid Business Unit");
			break;
	
	}
	
	
	
	
	
	

});



/**************************************************************
AUDITLESSON FUNCTIONALITY
***************************************************************/

/* View audit lesson documents */
administration.get('/auditlessonlearned', isAuthenticated, function(req, res) {
		auditlesson.getLessonByID(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.doc) {
				res.render('auditlessonlearned', data.doc );
			} else {
				res.render('error',{errorDescription: data.error});
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][auditlesson] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][auditlesson] - " + err.error);
	})
});
/* View audit lessons list */
administration.get('/auditlessons', isAuthenticated, function(req, res) {
	auditlesson.getAllLessons(req, db).then(function(data){
		//console.log(data);
			res.render('auditlessons', data );
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][auditlessonsave] - " + err.error);
	});
});
/* Save Audit Lesson in cloudant */
administration.post('/saveaulesson', isAuthenticated, function(req, res) {
	auditlesson.saveAL(req, db).then(function(data) {
		if(data.status==200 & !data.error) {
			if(data.id == "new"){
				res.redirect('/auditlessons');
			}else {
				//console.log(data.id);
				res.redirect('/auditlessonlearned?id='+data.id);
			}
		} else {
			res.render('error',{errorDescription: data.error});
			console.log("[routes][auditlessonsave] - " + data.error);
		}
	}).catch(function(err) {
		res.render('error',{errorDescription: err.error});
		console.log("[routes][auditlessonsave] - " + err.error);
	});
});

/**************************************************************
GEOHIERARCHY FUNCTIONALITY
***************************************************************/
//GET method to create the GeoHierarchy view
administration.get('/admingeohie',isAuthenticated, function(req,res) {
	var geoJSON = global.hierarchy;
	/*{
	"country":[
    {"name":"Korea","IMT":"Korean IMT","IOT":"AP IOT"},
    {"name":"Austria","IMT":"DACH IMT","IOT":"Europe IOT"},
    {"name":"Germany","IMT":"DACH IMT","IOT":"Europe IOT"},
    {"name":"UK","IMT":"UKI IMT","IOT":"Europe IOT"}
	],
  "IMT":{
    "Korean IMT":[
        {"name":"Korea"}],
    "DACH IMT":[
        {"name":"Austria"},{"name":"Germany"}],
    "UKI IMT":[
        {"name":"UK"}]
	},
  "IOT":[
    {"name":"AP IOT","IMTs":[
        {"name":"Korean IMT"}]},
    {"name":"Europe IOT","IMTs":[
        {"name":"DACH IMT"},{"name":"UKI IMT"}]}
	]
	};
	//var geoJSON = JSON.parse(geoJSONString);
	/*Instance of the GeoHiearchy class running the getGeoHierarchy function.
	* Requires the JSON generated by the WWBCIT SQL query as a parameter.
	*/
	geohierarchy.getGeoHierarchy(req, geoJSON).then(function (data) {
		if(data.status==200 & !data.error) {
			//console.log("Raw data: "+data);
			//console.log("Data first country: "+data.data.country[0].name);
			res.render('geohierarchy',data);
		}
		else {
			res.render('error', {errorDescription: err.error});
		}
	}).catch(function(err){
		console.log("error at router-administration level: "+err);
		res.render('error',{errorDescription: err.error});
	});
});

module.exports = administration;
