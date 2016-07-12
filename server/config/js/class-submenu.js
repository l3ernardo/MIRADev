/**************************************************************************************************
 * 
 * Parameters code for MIRA Web
 * Developed by : Wendy Edith Villa Jarrin
 * Date:30 May 2016
 * 
 */

var q  = require("q");

var submenu = {
	/* Load all submenus in view*/
	listMenu: function(req, db) {
		var deferred = q.defer();
		dataCalendars = [];
		dataDashboards = [];
		dataReports = [];
		dataReferences = [];
		dataArchive = [];
		dataAdministration = [];
		db.view('setup', 'view-setup', {include_docs: true}).then(function(data) {
			var len= data.body.rows.length;
			if(len > 0){	
				for (var i = 0; i < len; i++){
					if (data.body.rows[i].doc.keyName=='MenuTitle'){
						var index=i;
						var lenTitle = data.body.rows[i].doc.value.length;
					}
				}
				
				for (var i = 0; i < lenTitle; i++) { 
					if (data.body.rows[index].doc.value[i].businessUnit==req.session.businessunit){
						dataValue=data.body.rows[index].doc.value[i];
						menuTitle = dataValue.menutitle;
						//Build Calendar menu
						calendars = dataValue.calendars;
						lenCal = calendars.length;
						for(var j = 0; j < lenCal; j++){
							obj_calendar=data.body.rows[index].doc.value[i].calendars[j].role;
							len_objcalendar=obj_calendar.length;
							var flag=0;
							for(var k=0;k<len_objcalendar;k++)
							{
								if(req.session.BG.indexOf(obj_calendar[k])> '-1')
								{
									flag=1;
								}				   
							}
							if(flag>'0')
								{						
									dataCalendars.push({
										id: data.body.rows[index].doc.value[i].calendars[j].id,
										name: data.body.rows[index].doc.value[i].calendars[j].name,
										link: data.body.rows[index].doc.value[i].calendars[j].link,
										role: data.body.rows[index].doc.value[i].calendars[j].role
									})	
								}						 
						}
						//Build Dashboard menu
						dashboards=dataValue.dashboards; 	
						lenDash=dashboards.length;   
						for(var j = 0; j < lenDash; j++){
							obj_dashboard=data.body.rows[index].doc.value[i].dashboards[j].role;
							len_objdashboard=obj_dashboard.length;
							var flag=0;
							for(var k=0;k<len_objdashboard;k++)
							{  
								if(req.session.BG.indexOf(obj_dashboard[k])> '-1')
								{
									flag++;
								}							
							}										   
							if(flag>'0')
								{	
									dataDashboards.push({
										id: data.body.rows[index].doc.value[i].dashboards[j].id,
										name: data.body.rows[index].doc.value[i].dashboards[j].name,
										link: data.body.rows[index].doc.value[i].dashboards[j].link,
										role: data.body.rows[index].doc.value[i].dashboards[j].role
									})	  
								}
						 }
						 
						//Build Reports menu
						reports=dataValue.reports; 	
						lenReport=reports.length;   
						for(var j = 0; j < lenReport; j++){
							obj_report=data.body.rows[index].doc.value[i].reports[j].role;
							len_objreport=obj_report.length;
							var flag=0;
							for(var k=0;k<len_objreport;k++)
							{  
								if(req.session.BG.indexOf(obj_report[k])> '-1')
								{
									flag++;
								}							
							}		
							if(flag>'0')
							 {	
									dataReports.push({
										 id: data.body.rows[index].doc.value[i].reports[j].id,
										 name: data.body.rows[index].doc.value[i].reports[j].name,
										 link: data.body.rows[index].doc.value[i].reports[j].link,
										 role: data.body.rows[index].doc.value[i].reports[j].role
									})
							 }						 
						 }	
						//Build References menu
						references=dataValue.references; 	
						lenReference=references.length;   
						for(var j = 0; j < lenReference; j++){
							obj_reference=data.body.rows[index].doc.value[i].references[j].role;
							len_objreference=obj_reference.length;
							var flag=0;
							for(var k=0;k<len_objreference;k++)
							{  
							    if(req.session.BG.indexOf(obj_reference[k])> '-1')
								{
									flag++;
								}							
							}			    
							if(flag>'0')
							 {	
									dataReferences.push({
											id: data.body.rows[index].doc.value[i].references[j].id,
											name: data.body.rows[index].doc.value[i].references[j].name,
											link: data.body.rows[index].doc.value[i].references[j].link,
											role: data.body.rows[index].doc.value[i].references[j].role
									})	
							 }
						 }
						//Build Archive menu
						archive=dataValue.archive; 	
						lenArchive=archive.length;   
						for(var j = 0; j < lenArchive; j++){
							obj_archive=data.body.rows[index].doc.value[i].archive[j].role;
							len_objarchive=obj_archive.length;
							var flag=0;
							for(var k=0;k<len_objarchive;k++)
							{   
								 if(req.session.BG.indexOf(obj_archive[k])> '-1')
								{
									flag++;
								}							
							}						
							if(flag>'0')
							 {
									dataArchive.push({
										id: data.body.rows[index].doc.value[i].archive[j].id,
										name: data.body.rows[index].doc.value[i].archive[j].name,
										link: data.body.rows[index].doc.value[i].archive[j].link,
										role: data.body.rows[index].doc.value[i].archive[j].role
							 })	
							 }
						}
						//Build Administration menu
						administration=dataValue.administration; 	
						lenAdministration=administration.length;   
						for(var j = 0; j < lenAdministration; j++){
							obj_administration=data.body.rows[index].doc.value[i].administration[j].role;
							len_objadministration=obj_administration.length;
							var flag=0;
							for(var k=0;k<len_objadministration;k++)
							{  
								if(req.session.BG.indexOf(obj_administration)> '-1')
								{
									flag++;
								}							
							}			 
							if(flag>'0')
							 {
									dataAdministration.push({
										id: data.body.rows[index].doc.value[i].administration[j].id,
										name: data.body.rows[index].doc.value[i].administration[j].name,
										link: data.body.rows[index].doc.value[i].administration[j].link,
										role: data.body.rows[index].doc.value[i].administration[j].role
							 })	
							 }
						}
				  }
				}
				deferred.resolve({"status": 200, "submenu":{
					menuTitle: menuTitle,
					dataCalendars: dataCalendars ,
					dataDashboards: dataDashboards,
					dataReports: dataReports,
					dataReferences: dataReferences,
					dataArchive: dataArchive,
					dataAdministration: dataAdministration
				}});
			}
			else {
				deferred.reject({"status": 500, "error": error});
			}	
		
		}).catch(function(error){
			deferred.reject({"status": 500, "error": error});
		});
		return deferred.promise;
	},
};
module.exports = submenu;