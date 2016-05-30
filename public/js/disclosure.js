$(document).ready(function() { 
	hide_divs();
	$('#bOK').click(function() {
		window.location.href ='./businessunit';
	});
	$('#bCancel').click(function() {
		window.location.href='/login';
	});
});
function hide_divs(){
	$('div#ibm-leadspace-head').hide();
	$('div#ibm-navigation').hide();
};