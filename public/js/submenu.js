$(document).ready(function(){
	selectedMenuOption();
	//Update breadcrumb
	addEventToMenu();
	showBreadCrumb();
	//Define colors for calendars options
	defineColorCalendar();
});

function selectedMenuOption(){
	var url = parent.location.href;
	url = url.split('/');
	url = url[url.length -1];
	url = url.replace('?','').replace('=','').replace('&','').replace('=','');
	var selLink = document.getElementById(url);
	if(selLink != null){
		selLink = eval("$('a#"+url+"')");
		selLink.addClass('ibm-active'); //a
		selLink.parent().parent().show() //ul
		selLink.parent().parent().parent().addClass('ibm-active') //li
	}else{
		try {
			$('#*-options').hide();
			$('#*-options').parent().removeClass();
		} catch(e) {}
	}
}

function addEventToMenu(){
	$.each($("#ibm-primary-links > li > ul > li > a"), function(index, element){
		$(element).click(function(event){
			breadcrumbUpdate($(this).attr('id'), $(this).attr('href'), $(this).text());
		});
	});
	$.each($("#ibm-primary-links > li > a"), function(index, element){
		if($(this).attr('id')!='ibm-overview'){
			$(element).click(function(event){
				var idLink = $(this).attr('href').replace('/','').replace('?','').replace('=','');
				var firstLink = eval("$('#" + idLink + "')");
				breadcrumbUpdate(idLink, $(this).attr('href'), firstLink.html());
			});
		}
	});
	
	$.each($("#ibm-navigation-trail > li > a"), function(index, element){
		if(index==0){
			$(element).click(function(event){
				breadcrumbUpdate('', '', '');
			});
		}
	});
}

function showBreadCrumb(){
	$("#breadcrumb").html(sessionStorage.breadcrumb);
}

function breadcrumbUpdate(aid, link, text) {
	if (typeof (Storage) != "undefined") {
		if(aid != "")
			sessionStorage.breadcrumb = "<a id='"+aid+"' href='" + link + "'>" + text + "</a>";
		else
			sessionStorage.breadcrumb = "";
	}
	showBreadCrumb();
}
function defineColorCalendar(){
	
	var colorsArray = ["#FAFAFA", "#2eacf5", "#c2efff", "#a1d3e8", "#BEFFB3", "#dbdbdb", "#ffdca3", "#f0e6bc", "#e2c3b1", "#cca3a3", "#f3d3dc"];

	$.each($("ul#calendar-options > li"), function(index){
		$(this).css({'background': colorsArray[index]});
	});

}
