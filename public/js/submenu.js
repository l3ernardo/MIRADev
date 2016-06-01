$(document).ready(function(){
	$.ajax({
		url: "/submenu",
		type: "GET",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function (response) {
			var menutitle=response.menu.menuTitle;
			var calendars = response.menu.dataCalendars;
			var dashboards = response.menu.dataDashboards;
			var reports = response.menu.dataReports;
			var references = response.menu.dataReferences;
			var archive = response.menu.dataArchive;
			updateSubMenu(menutitle,calendars,dashboards,reports,references,archive);
		},
		error: function(e) {
			//updateUserName('');
		}
	});
	show_submenus();
});

function updateSubMenu(menutitle,calendars,dashboards,reports,references,archive) {
	$('#ibm-overview-1').text(menutitle);
	var divs='';
    for(i=0;i<calendars.length;i++){
		 divs=divs+'<li><a href="'+calendars[i].link+'">'+calendars[i].name+'</a></li>';
	 }   	
	$('#calendar-options').append(divs);divs='';
	for(i=0;i<dashboards.length;i++){
		 divs=divs+'<li><a href="'+dashboards[i].link+'">'+dashboards[i].name+'</a></li>';
	 }   	
	$('#dashboards-options').append(divs);divs='';
	for(i=0;i<reports.length;i++){
		 divs=divs+'<li><a href="'+reports[i].link+'">'+reports[i].name+'</a></li>';
	 }   	
	$('#reports-options').append(divs);divs='';
	for(i=0;i<references.length;i++){
		 divs=divs+'<li><a href="'+references[i].link+'">'+references[i].name+'</a></li>';
	 }   	
	$('#references-options').append(divs);divs='';
	for(i=0;i<archive.length;i++){
		 divs=divs+'<li><a href="'+archive[i].link+'">'+archive[i].name+'</a></li>';
	 }   	
	$('#rarchive-options').append(divs);divs='';
		
};

/*
function show_hide(name){
     if( $('#calendar-options').is(":visible") )
	 {
		 
		   $('#calendar-options').hide()
	 }
	  else {$('#calendar-options').show(); $("#calendars").addClass("ibm-active");}
	}
}*/

function show_submenus(){
$('#calendars').click($('#calendar-options').show());
$('#dashboards').click($('#dashboards-options').show());
$('#reports').click($('#reports-options').show());
$('#references').click($('#references.options').show());
$('#archive').click($('#archive-options').show());
}




