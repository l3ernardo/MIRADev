/**************************************************************************************************
 * 
 * Calendar code for MIRA Web
 * Developed by :   Gabriela S. Pailiacho G.
 * Date: 07 Sep 2016
 * 
 */

var q  = require("q");
var moment = require('moment');
var mtz = require('moment-timezone');
var accessrules = require('./class-accessrules.js');
var recordindex;
var parentindex;
var indexp;

function existparentid (parentkey,F){
      for (j=0;j<F.length;j++)
   {
      if(F[j]!= undefined){

      if(F[j]._id==parentkey)
	  {
	       result=1;
		   parentindex=j;
   }}
   }
  /* return 1;*/
   return result
}
function parentidf (parentkey,G){
  for (m=0;m<G.length;m++)
   {
      if(G[m]!= undefined){
      if(G[m]._id==parentkey)
	  {
		   indexp=m;
     }
	 else
	 {
		  indexp=G.length;
	 }
   }
   }
   return indexp
}

function findtl(level,parentkey,F){
    for(k=F.length-1;k>=parentindex;k--)
	{
	   if(F[k]!= undefined)
	   {
	       if((F[k].LevelTypeSE==level && F[k].parentidrse==parentkey) || (F[k].LevelTypeAUF==level && F[k].parentidauf==parentkey))
		       {
					result2=1;
				    recordindex=k;
					k=parentindex-1;
				}
				else{
					 recordindex=parentidf(parentkey,F);
					 result2=0;
				}
	   }
	}
	return result2
}

var report = {
	assessableunitfile: function(req, db) {
		var deferred = q.defer();
		try{
			
			if(req.session.BG.indexOf("MIRA-ADMIN") > '-1'){
				var objAUFR = {
					"selector": {
						
							//"_id": { "$gt": 0 },
							"Name": { "$gt": null },
							"key": "Assessable Unit",
							"Status": "Active",
							"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"Name":"asc"}]
				};
			}
			else{
				var objAUFR = {
					"selector": {
						//"_id": { "$gt": 0 },
						"Name": { "$gt": null },
						"key": "Assessable Unit",
						"Status": "Active",
						"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}], 
						"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"Name":"asc"}]
				};
			}
			db.find(objAUFR).then(function(data){
				var doc = data.body.docs;
				var len = doc.length;
				var view_auFileReport = [];
				if(len > 0){
					for (var i = 0; i < len; i++){
						view_auFileReport.push(doc[i]);
					}
				}
				deferred.resolve({"status": 200, "doc":view_auFileReport});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}
		catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	controllableunitfile: function(req, db) {
		var deferred = q.defer();
		try{
			
			if(req.session.BG.indexOf("MIRA-ADMIN") > '-1'){
				var objAUFR = {
					"selector": {
						
							//"_id": { "$gt": 0 },
							"Name": { "$gt": null },
							"key": "Assessable Unit",
							"Status": "Active",
							"$or": [{"DocSubType":"Controllable Unit"},{"DocSubType":"Country Process", "CUFlag": "Yes"}],
							"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"Name":"asc"}]
				};
			}
			else{
				var objAUFR = {
					"selector": {
						//"_id": { "$gt": 0 },
						"Name": { "$gt": null },
						"key": "Assessable Unit",
						"Status": "Active",
						"$or": [{"DocSubType":"Controllable Unit"},{"DocSubType":"Country Process", "CUFlag": "Yes"}],
						"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}], 
						"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"Name":"asc"}]
				};
			}
			db.find(objAUFR).then(function(data){
				var doc = data.body.docs;
				var len= doc.length;
				var view_cuFileReport = [];
				if(len > 0){
					for (var i = 0; i < len; i++){
						view_cuFileReport.push(doc[i]);
					}
				}
				view=JSON.stringify(view_cuFileReport, 'utf8');
				deferred.resolve({"status": 200, "doc":view_cuFileReport});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}
		catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
 statusexception: function(req, db) {
		var deferred = q.defer();
		var F=[];
		try{
			
			if(req.session.BG.indexOf("MIRA-ADMIN") > '-1'){
				var objSE = {
					"selector": {
						    "LevelTypeSE": { "$gt": null },
							"Name": { "$gt": null },
							"key": "Assessable Unit",
							"$or":[{"$not": {"MIRAAssessmentStatus": "Complete"}},{"$not": {"WWBCITAssessmentStatus": "Complete"}},{"$not": {"WWBCITAssessmentStatus": "Reviewed"}}],
							"$not": {"Status": "Complete" },
							"MIRABusinessUnit": req.session.businessunit
					},
					//"sort": [{"LevelTypeSE":"asc"}]
					"sort": [{"LevelTypeSE":"asc"},{"Name":"asc"}]
				};
			}
			else{
				var objSE = {
					"selector": {
						"LevelTypeSE": { "$gt": null },
						"Name": { "$gt": null },
						"key": "Assessable Unit",						
					    "$or":[{"$not": {"MIRAAssessmentStatus": "Complete"}},{"$not": {"WWBCITAssessmentStatus": "Complete"}},{"$not": {"WWBCITAssessmentStatus": "Reviewed"}}],
						"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}], 
						"MIRABusinessUnit": req.session.businessunit
					},
					//"sort": [{"LevelTypeSE":"asc"}]
					"sort": [{"LevelTypeSE":"asc"},{"Name":"asc"}]
				};
			}
			db.find(objSE).then(function(data){
				var doc = data.body.docs;
				var len= doc.length;
				var view_statExcReport = [];
				if(len > 0){
					
				   //sorting
            var n ;
            var result;
			var result2;
			var lenF=0;
if(F!= undefined)
	{
for (i=0;i<len;i++)
{       lenF=F.length;
         if(i==0)
			{
			   F[0]=doc[0];
			}
	     else if (i!=0 && doc[i].LevelTypeSE=='1')
	          {
				F[n]=doc[i];
				//F.sort();
	          }
              else
	     {   //
	             if(existparentid(doc[i].parentidrse,F)=='1' && findtl(doc[i].LevelTypeSE,doc[i].parentidrse,F)=='1')
	                {
						for(l=lenF;l>recordindex;l--)
								{
									 F[l]=F[l-1];
								}
								F[recordindex+1]=doc[i];
					}

	                else if(existparentid(doc[i].parentidrse,F)=='1' && findtl(doc[i].LevelTypeSE,doc[i].parentidrse,F)=='0')
	                {
						for(l=lenF;l>parentindex;l--)
						{
							F[l]=F[l-1];
						}
							F[parentindex+1]=doc[i];
					}
	         }
         n=lenF+1;

	}
}
					for (var i = 0; i < F.length; i++){
						view_statExcReport.push({
							_id: F[i]._id,
							//LevelTypeSE:doc[i].LevelTypeSE,
						    Name: F[i].Name,
							GroupingName: F[i].GroupingName,
                            DocSubType:F[i].DocSubType,
							parentidrse:F[i].parentidrse,
							IOT: F[i].IOT,
							Status: F[i].Status,
							MIRAAssessmentStatus: F[i].MIRAAssessmentStatus,
							WWBCITAssessmentStatus: F[i].WWBCITAssessmentStatus,
							PeriodRatingPrev: F[i].PeriodRatingPrev,
							PeriodRating: F[i].PeriodRating,							
							AUNextQtrRating: F[i].AUNextQtrRating,
							Target2Sat:F[i].Target2Sat,
							Owner:F[i].Owner,
							Portafolio: F[i].Portafolio,
							AuditableFlag: F[i].AuditableFlag,
							AuditProgram: F[i].AuditProgram
						});
					}
				}
				view=JSON.stringify(view_statExcReport, 'utf8');
				deferred.resolve({"status": 200, "doc":view_statExcReport});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}
		catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	},
	audunifiles: function(req, db) {
		var deferred = q.defer();
		var G=[];
		try{
			
			if(req.session.BG.indexOf("MIRA-ADMIN") > '-1'){
				var objAUF = {
					"selector": {
						    "LevelTypeAUF": { "$gt": null },
							"Name": { "$gt": null },
							"key": "Assessable Unit",
							"Status": "Active",							
							"$or": [{"DocSubType":"Controllable Unit"},{"DocSubType":"Country Process"},{"DocSubType":"BU Country"},{"DocSubType":"Total"}],
					        "AuditableFlag": "Yes",
							"MIRABusinessUnit": req.session.businessunit 
					},
					"sort": [{"LevelTypeAUF":"asc"},{"Name":"asc"}]
				};
			}
			else{
				var objAUF = {
					"selector": {
						"LevelTypeAUF": { "$gt": null },
						"Name": { "$gt": null },
						"key": "Assessable Unit",
						"Status": "Active",
						"$or": [{"DocSubType":"Controllable Unit"},{"DocSubType":"Country Process"},{"DocSubType":"BU Country"},{"DocSubType":"Total"}],
					    "AuditableFlag": "Yes",
						"$or": [{"AllEditors":{"$in":[req.session.user.mail]}},{"AllReaders":{"$in":[req.session.user.mail]}}], 
						"MIRABusinessUnit": req.session.businessunit
					},
					"sort": [{"LevelTypeAUF":"asc"},{"Name":"asc"}]
				};
			}
			db.find(objAUF).then(function(data){
				var doc = data.body.docs;
				var len= doc.length;
				var view_auFileReport = [];
				if(len > 0){
									   //sorting
            var n ;
            var result;
			var result2;
			var lenG=0;
			var total=0, marg=0,sat=0,unsat=0,pending=0,exempt=0,nr=0;
if(G!= undefined)
	{
for (i=0;i<len;i++)
{       lenG=G.length;
         if(doc[i].AUNextQtrRating=="Sat")
		 {
			   sat=sat+1;
		 }
	     else if(doc[i].AUNextQtrRating=="Unsat")
		 {
			   unsat=unsat+1;
		 }
		 else if(doc[i].AUNextQtrRating=="Marg")
		 {
			   marg=marg+1;
		 }
		 else if(doc[i].AUNextQtrRating=="Pending")
		 {
			   pending=pending+1;
		 }
		  else if(doc[i].AUNextQtrRating=="Exempt")
		 {
			   exempt=exempt+1;
		 }
		 else if(doc[i].AUNextQtrRating=="NR")
		 {
			   nr=nr+1;
		 }
		 total=sat+unsat+marg+pending+exempt+nr;
         if(i==0)
			{
			   G[0]=doc[0];
			}
	     else if (i!=0 && doc[i].LevelTypeAUF=='1')
	          {
				G[n]=doc[i];
	          }
              else
	     {   //
	             if(existparentid(doc[i].parentidauf,G)=='1' && findtl(doc[i].LevelTypeAUF,doc[i].parentidauf,G)=='1')
	                {
						for(l=lenG;l>recordindex;l--)
								{
									 G[l]=G[l-1];
								}
								G[recordindex+1]=doc[i];
					}

	                else if(existparentid(doc[i].parentidauf,G)=='1' && findtl(doc[i].LevelTypeAUF,doc[i].parentidauf,G)=='0')
	                {
						for(l=lenG;l>parentindex;l--)
						{
							G[l]=G[l-1];
						}
							G[parentindex+1]=doc[i];
					}
	         }
         n=lenG+1;

	}
}

					for (var i = 0; i <  G.length; i++){
						if(G[i].Name=='Total'){
							view_auFileReport.push({
							_id: G[i]._id,
							parentidauf:G[i].parentidauf,
							Total: G[i].Total,
							CategoryName: G[i].CategoryName,
							Name: G[i].Name,
							DocSubType:G[i].DocSubType,
							Status: G[i].Status,			
							MIRAAssessmentStatus: G[i].MIRAAssessmentStatus,
							WWBCITAssessmentStatus: G[i].WWBCITAssessmentStatus,
							PeriodRatingPrev: G[i].PeriodRatingPrev,
							PeriodRating: G[i].PeriodRating,							
							AUNextQtrRating: G[i].AUNextQtrRating,
							Target2Sat:G[i].Target2Sat,
							Owner:G[i].Owner,
							Portafolio: G[i].Portafolio,
							AuditableFlag: G[i].AuditableFlag,
							AuditProgram: G[i].AuditProgram,
							Count:total
						});							
						}
						else if(G[i].Name=='Sat'){
							view_auFileReport.push({
							_id: G[i]._id,
							parentidauf:G[i].parentidauf,
							Total: G[i].Total,
							CategoryName: G[i].CategoryName,
							Name: G[i].Name,
							DocSubType:G[i].DocSubType,
							Status: G[i].Status,			
							MIRAAssessmentStatus: G[i].MIRAAssessmentStatus,
							WWBCITAssessmentStatus: G[i].WWBCITAssessmentStatus,
							PeriodRatingPrev: G[i].PeriodRatingPrev,
							PeriodRating: G[i].PeriodRating,							
							AUNextQtrRating: G[i].AUNextQtrRating,
							Target2Sat:G[i].Target2Sat,
							Owner:G[i].Owner,
							Portafolio: G[i].Portafolio,
							AuditableFlag: G[i].AuditableFlag,
							AuditProgram: G[i].AuditProgram,
							Count:sat
						});
							
						}
						else if(G[i].Name=='Unsat'){
							view_auFileReport.push({
							_id: G[i]._id,
							parentidauf:G[i].parentidauf,
							Total: G[i].Total,
							CategoryName: G[i].CategoryName,
							Name: G[i].Name,
							DocSubType:G[i].DocSubType,
							Status: G[i].Status,			
							MIRAAssessmentStatus: G[i].MIRAAssessmentStatus,
							WWBCITAssessmentStatus: G[i].WWBCITAssessmentStatus,
							PeriodRatingPrev: G[i].PeriodRatingPrev,
							PeriodRating: G[i].PeriodRating,							
							AUNextQtrRating: G[i].AUNextQtrRating,
							Target2Sat:G[i].Target2Sat,
							Owner:G[i].Owner,
							Portafolio: G[i].Portafolio,
							AuditableFlag: G[i].AuditableFlag,
							AuditProgram: G[i].AuditProgram,
							Count:unsat
						});							
						}
						else if(G[i].Name=='Pending'){
							view_auFileReport.push({
							_id: G[i]._id,
							parentidauf:G[i].parentidauf,
							Total: G[i].Total,
							CategoryName: G[i].CategoryName,
							Name: G[i].Name,
							DocSubType:G[i].DocSubType,
							Status: G[i].Status,			
							MIRAAssessmentStatus: G[i].MIRAAssessmentStatus,
							WWBCITAssessmentStatus: G[i].WWBCITAssessmentStatus,
							PeriodRatingPrev: G[i].PeriodRatingPrev,
							PeriodRating: G[i].PeriodRating,							
							AUNextQtrRating: G[i].AUNextQtrRating,
							Target2Sat:G[i].Target2Sat,
							Owner:G[i].Owner,
							Portafolio: G[i].Portafolio,
							AuditableFlag: G[i].AuditableFlag,
							AuditProgram: G[i].AuditProgram,
							Count:pending
						});							
						}
						else if(G[i].Name=='Marg'){
							view_auFileReport.push({
							_id: G[i]._id,
							parentidauf:G[i].parentidauf,
							Total: G[i].Total,
							CategoryName: G[i].CategoryName,
							Name: G[i].Name,
							DocSubType:G[i].DocSubType,
							Status: G[i].Status,			
							MIRAAssessmentStatus: G[i].MIRAAssessmentStatus,
							WWBCITAssessmentStatus: G[i].WWBCITAssessmentStatus,
							PeriodRatingPrev: G[i].PeriodRatingPrev,
							PeriodRating: G[i].PeriodRating,							
							AUNextQtrRating: G[i].AUNextQtrRating,
							Target2Sat:G[i].Target2Sat,
							Owner:G[i].Owner,
							Portafolio: G[i].Portafolio,
							AuditableFlag: G[i].AuditableFlag,
							AuditProgram: G[i].AuditProgram,
							Count:marg
						});							
						}
						else if(G[i].Name=='Exempt'){
							view_auFileReport.push({
							_id: G[i]._id,
							parentidauf:G[i].parentidauf,
							Total: G[i].Total,
							CategoryName: G[i].CategoryName,
							Name: G[i].Name,
							DocSubType:G[i].DocSubType,
							Status: G[i].Status,			
							MIRAAssessmentStatus: G[i].MIRAAssessmentStatus,
							WWBCITAssessmentStatus: G[i].WWBCITAssessmentStatus,
							PeriodRatingPrev: G[i].PeriodRatingPrev,
							PeriodRating: G[i].PeriodRating,							
							AUNextQtrRating: G[i].AUNextQtrRating,
							Target2Sat:G[i].Target2Sat,
							Owner:G[i].Owner,
							Portafolio: G[i].Portafolio,
							AuditableFlag: G[i].AuditableFlag,
							AuditProgram: G[i].AuditProgram,
							Count:exempt
						});							
						}
						else if(G[i].Name=='NR'){
							view_auFileReport.push({
							_id: G[i]._id,
							parentidauf:G[i].parentidauf,
							Total: G[i].Total,
							CategoryName: G[i].CategoryName,
							Name: G[i].Name,
							DocSubType:G[i].DocSubType,
							Status: G[i].Status,			
							MIRAAssessmentStatus: G[i].MIRAAssessmentStatus,
							WWBCITAssessmentStatus: G[i].WWBCITAssessmentStatus,
							PeriodRatingPrev: G[i].PeriodRatingPrev,
							PeriodRating: G[i].PeriodRating,							
							AUNextQtrRating: G[i].AUNextQtrRating,
							Target2Sat:G[i].Target2Sat,
							Owner:G[i].Owner,
							Portafolio: G[i].Portafolio,
							AuditableFlag: G[i].AuditableFlag,
							AuditProgram: G[i].AuditProgram,
							Count:nr
						});							
						}
						else
						{
						view_auFileReport.push({
							_id: G[i]._id,
							parentidauf:G[i].parentidauf,
							Total: G[i].Total,
							CategoryName: G[i].CategoryName,
							Name: G[i].Name,
							DocSubType:G[i].DocSubType,
							Status: G[i].Status,			
							MIRAAssessmentStatus: G[i].MIRAAssessmentStatus,
							WWBCITAssessmentStatus: G[i].WWBCITAssessmentStatus,
							PeriodRatingPrev: G[i].PeriodRatingPrev,
							PeriodRating: G[i].PeriodRating,							
							AUNextQtrRating: G[i].AUNextQtrRating,
							Target2Sat:G[i].Target2Sat,
							Owner:G[i].Owner,
							Portafolio: G[i].Portafolio,
							AuditableFlag: G[i].AuditableFlag,
							AuditProgram: G[i].AuditProgram,
						});
					}
					}
				}
				view=JSON.stringify(view_auFileReport, 'utf8');
				deferred.resolve({"status": 200, "doc":view_auFileReport});
			}).catch(function(err) {
				deferred.reject({"status": 500, "error": err.error.reason});
			});
		}
		catch(e){
			deferred.reject({"status": 500, "error": e});
		}
		return deferred.promise;
	}
	};
module.exports = report;