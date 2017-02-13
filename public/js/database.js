$(document).ready(function(){
	hide_divs();
	
	$('#btn_submit').click(function() {
		if ($("#selectedDB option:selected").text() != '')  {
				sessionStorage.breadcrumb = "";
				$('#form').submit();			
		}else {
			alert('Please select one Database');
		}
	});
});
function hide_divs(){
	$('div#ibm-leadspace-head').hide();
	$('div#ibm-navigation').hide();
};
