$(document).ready(function(){
	selectedMenuOption();
	//Update breadcrumb
	addEventToMenu();
	showBreadCrumb();
});

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
