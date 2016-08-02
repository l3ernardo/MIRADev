$(document).ready(function(){
	hide_divs();
	
	$('#btn_submit').click(function() {
		if ($("#selectedBU option:selected").text() != '')  {
				$('#form').submit();
			
		}else {
			alert('Please select one Business Unit');
		}
	});
});
function hide_divs(){
	$('div#ibm-leadspace-head').hide();
	$('div#ibm-navigation').hide();
};
