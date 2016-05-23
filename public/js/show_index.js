function hide_divs(){
	if (document.getElementById){
		document.getElementById('ibm-leadspace-head').style.display="none";
		document.getElementById('ibm-navigation').style.display="none";
	}
}
$(document).ready(function() {
	hide_divs();
	$('#bCancel').click(function() {
		$('#username').val('');
		$('#password').val('');
	});
});

