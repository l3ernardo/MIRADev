/**************************************************************************************************
 *
 * MIRA Web identify all user access
 * Date: 06 July 2016
 *
 */

var util = require('./class-utility.js');

var accessrules = {
	rules: {},   
	getRules: function(req,docid,db,doc) {
		
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
				   	/*
					var indexEditor =	accessDoc.result.AllEditors.indexOf(req.session.user.mail);
					var indexReader =	accessDoc.result.AllReaders.indexOf(req.session.user.mail);
				
					if(indexEditor > -1)
						editor = true;
					if(indexReader > -1)
						reader = true;
					*/
				  
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
		
		
				}else{ // in case the access doc is not found(most cause due to the propagation access as not run) we provide access to admins and its creator

					if(req.session.user.groupName.indexOf("MIRA-ADMIN")!=-1){
						admin = true;
						grantaccess = true;
						editor = true;
					
						
									
					}
					else if(doc.Log[0].name.indexOf(usr)!= -1){ // check if the owner is requesting access
						editor = true;
						
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
					
					
				}//end else
				
		
			
		
			}).catch(function(error){
				res.render('error',{errorDescription: err.error});
				console.log("[class][accessRules] - " + err.error);
			});
		}catch(e){res.render('error',{errorDescription: err.error});
		console.log("[class][accessRules] - " + err.error);}
		
	}
};

module.exports = accessrules;
