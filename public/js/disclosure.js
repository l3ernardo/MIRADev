$(document).ready(function() { 
	hide_divs();
	$('#bOK').click(function() {
		window.location.href ='./businessunit';
		//window.location.href ='./database';
	});
	$('#bCancel').click(function() {
		window.location.href='/logout';
	});
});

function hide_divs(){
	$('div#ibm-leadspace-head').hide();
	$('div#ibm-navigation').hide();
};
