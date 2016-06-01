function hide_divs(){
	$('div#ibm-leadspace-head').hide();
	$('div#ibm-navigation').hide();
	$('div#ibm-profile-links').hide();
	$('p#ibm-site-title').html('');
}
$(document).ready(function() {
	hide_divs();
	$('#bCancel').click(function() {
		$('#username').val('');
		$('#password').val('');
	});
});

