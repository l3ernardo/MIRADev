/**************************************************************************************************
 *
 * MIRA Web identify all user access
 * Date: 06 July 2016
 *
 */

var util = require('./class-utility.js');
var q  = require("q");

var accessrules = {
	rules: {},   
	getRules: function(req,docid,db,doc) {
		
		var deferred = q.defer();
		var usr =   req.session.user.mail;
		var reader = false;
		var editor = false;
		var admin = false;
		var grantaccess = false;
		var resetstatus = false;
		var cuadmin = false;
		
		
		
		try{	
			util.getAccessDoc(db,docid).then(function (accessDoc){ //gets the corresponding access doc and reviews its access
				
				if(accessDoc.status == 200 && !accessDoc.error && accessDoc.result != undefined) {
				   	
					for(var n =0;n<accessDoc.result.AllEditors.length;n++){
						var indexEditor =	accessDoc.result.AllEditors[n].indexOf(usr);
						if(indexEditor > -1)
							break;
					}
					
					for(var m =0;m<accessDoc.result.AllReaders.length;m++){
						var indexReader =	accessDoc.result.AllReaders[m].indexOf(usr);
						if(indexReader > -1)
							break;
					}
					/*
					console.log("Edit index: "+indexEditor);
					console.log("Reader index: "+indexReader);
					
					console.log("Doc readers: "+accessDoc.result.AllReaders);
					console.log("Doc Editors: "+accessDoc.result.AllEditors);
					
					console.log("User email:"+usr);
					*/
					if(indexEditor > -1)
						editor = true;
					if(indexReader > -1)
						reader = true;
					
				  
					var roles = ['MIRA-ADMIN','MIRA-GRANT-ACCESS','MIRA-RESET-STATUS','MIRA-CU-ADMIN-DATA'];
					for(var i=0;i<roles.length;i++) {
						if(req.session.user.groupName.indexOf(roles[i])!=-1) {
							switch (roles[i]) {
							case 'MIRA-ADMIN':
								admin = true;
								grantaccess = true;
								editor = true;
								break;	
							case 'MIRA-GRANT-ACCESS':
								grantaccess = true;
								editor = true;
								break;
							case 'MIRA-RESET-STATUS':
								resetstatus = true;
								break;
							case 'MIRA-CU-ADMIN-DATA':
								cuadmin = true;
								break;
							}
						}
					}
					var rules = {
							"editor":editor,
							"reader":reader,
							"admin":admin,
							"grantaccess":grantaccess,
							"resetstatus":resetstatus,
							"cuadmin":cuadmin
					}
					
					
				
					this.rules = rules;
					deferred.resolve({"status": 200, "rules": rules});
					
		
				}else{ // in case the access doc is not found(most cause due to the propagation access as not run) we provide access to admins and its creator

					if(req.session.user.groupName.indexOf("MIRA-ADMIN")!=-1){
						admin = true;
						grantaccess = true;
						editor = true;
					
						
									
					}
					else 
						if(doc != ""){
							if(doc.Log[0].name.indexOf(usr)!= -1){ // check if the owner is requesting access
									editor = true;
						
							}
							else{  //user not found
								editor = false;
								reader = false;
								admin = false;
								grantaccess = false;
								resetstatus = false;
								cudamin = false;
							}
					}else{
						editor = false;
						reader = false;
						admin = false;
						grantaccess = false;
						resetstatus = false;
						cudamin = false;
						
					}
					
					var rules = {
							"editor":editor,
							"reader":reader,
							"admin":admin,
							"grantaccess":grantaccess,
							"resetstatus":resetstatus,
							"cuadmin":cuadmin
					}
		
					
					this.rules = rules;
					deferred.resolve({"status": 200, "rules": rules});
					
					
				}//end else
				
				
			
		
			}).catch(function(error){
				res.render('error',{errorDescription: error.error});
				deferred.reject({"status": 500, "error": error.error});
				console.log("[class][accessRules] - " + error.error);
			});
		}catch(e){res.render('error',{errorDescription: e});
		deferred.reject({"status": 500, "error": e});
		console.log("[class][accessRules] - " + e);}
		
		return deferred.promise;
		
	}
}

module.exports = accessrules;