$(document).ready(function(){
	$.ajax({
		url: "/submenu",
		type: "GET",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function (response) {
			if(response.menu != ''){
				var menutitle=response.menu.menuTitle;
				var calendars = response.menu.dataCalendars;
				var dashboards = response.menu.dataDashboards;
				var reports = response.menu.dataReports;
				var references = response.menu.dataReferences;
				var archive = response.menu.dataArchive;
				var administration = response.menu.dataAdministration;
				updateSubMenu(menutitle,calendars,dashboards,reports,references,archive, administration);
			}
		},
		error: function(e) {
			//updateUserName('');
		}
	});
	
});
function updateSubMenu(menutitle,calendars,dashboards,reports,references,archive,administration) {
	$('#ibm-overview-1').text(menutitle);
	
	var divs='';
	//Calendars
	if(calendars.length > 0){
		$('a#calendars-a').attr({'href':calendars[0].link});
		for(i=0;i<calendars.length;i++){
			divs=divs+'<li><a id="'+calendars[i].link.replace('/','').replace('?','').replace('=','')+'" href="'+calendars[i].link+'">'+calendars[i].name+'</a></li>';
		}
		$('#calendars-options').append(divs);divs='';
	}else{
		$('#calendars').css('display', 'none');
	}
	//Dashboard
	if(dashboards.length > 0){
		$('a#dashboards-a').attr({'href':''+dashboards[0].link+''});
		for(i=0;i<dashboards.length;i++){
			 divs=divs+'<li><a id="'+dashboards[i].link.replace('/','')+'" href="'+dashboards[i].link+'">'+dashboards[i].name+'</a></li>';
		}
		$('#dashboards-options').append(divs);divs='';
	}else{
		$('#dashboards').css('display', 'none');
	}
	//Reports
	if(reports.length > 0){
		$('a#reports-a').attr({'href':''+reports[0].link+''});
		for(i=0;i<reports.length;i++){
			divs=divs+'<li><a id="'+reports[i].link.replace('/','')+'" href="'+reports[i].link+'">'+reports[i].name+'</a></li>';
		}
		$('#reports-options').append(divs);divs='';
	}else{
		$('#reports').css('display', 'none');
	}
	//References
	if(references.length > 0){
		$('a#references-a').attr({'href':''+references[0].link+''});
		for(i=0;i<references.length;i++){
			divs=divs+'<li><a id="'+references[i].link.replace('/','')+'" href="'+references[i].link+'">'+references[i].name+'</a></li>';
		}
		$('#references-options').append(divs);divs='';
	}else{
		$('#references').css('display', 'none');
	}
	//Archive
	if(archive.length > 0){
		$('a#archive-a').attr({'href':''+archive[0].link+''});
		for(i=0;i<archive.length;i++){
			divs=divs+'<li><a id="'+archive[i].link.replace('/','')+'" href="'+archive[i].link+'">'+archive[i].name+'</a></li>';
		}
		$('#archive-options').append(divs);divs='';
	}else{
		$('#archive').css('display', 'none');
	}
	//Administration
	if(administration.length > 0){
		$('a#administration-a').attr({'href':''+administration[0].link+''});
		for(i=0;i<administration.length;i++){
			divs=divs+'<li><a id="'+administration[i].link.replace('/','')+'" href="'+administration[i].link+'">'+administration[i].name+'</a></li>';
		}
		$('#administration-options').append(divs);divs='';
	}else{
		$('#administration').css('display', 'none');
	}
	window.addEventListener("load", selectedMenuOption());
};
function selectedMenuOption(){
	var url = parent.location.href;
	url = url.split('/');
	url = url[url.length -1];
	url = url.replace('?','').replace('=','');
	var selLink = document.getElementById(url);
	if(selLink != null){
		selLink = eval("$('a#"+url+"')");
		selLink.addClass('ibm-active'); //a
		selLink.parent().parent().show() //ul
		selLink.parent().parent().parent().addClass('ibm-active') //li
	}else{
		$('#calendars-options').hide();
		$('#calendars-options').parent().removeClass();
		$('#dashboards-options').hide();
		$('#dashboards-options').parent().removeClass();
		$('#reports-options').hide();
		$('#reports-options').parent().removeClass();
		$('#references-options').hide();
		$('#references-options').parent().removeClass();
		$('#archive-options').hide();
		$('#archive-options').parent().removeClass();
		$('#administration-options').hide();
		$('#administration-options').parent().removeClass();
	}
}



