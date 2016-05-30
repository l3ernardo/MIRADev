function redirect(action){
	if(action == 'OK'){
			window.location.href='/index';
		} else {
			window.location.href='/login';
		}
}
function hide_divs(){
	$('div#ibm-leadspace-head').hide();
	$('div#ibm-navigation').hide();
}
$(document).ready(function() { 
	hide_divs();
})				
