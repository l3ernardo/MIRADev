$(document).ready(function(){
	hide_divs();
	$('#btn_cancel').click(function() {
		window.location.href = "/processdashboard";
	});
});

function hide_divs(){
	$('div#ibm-navigation').hide();
};
