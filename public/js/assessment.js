$(document).ready(function(){
	//Hide left navigation
	hide_divs();

	//Code for Edit button
	$('#btn_edit').click(function() {
		window.location.href = "assessment?id=" + $("input[name='docid']").val() + "&edit";
	});
	//Code for Cancel button
	$('#btn_cancel').click(function() {
		window.location.href = "/processdashboard";
	});
	//Code for Save button
	$('#btn_save').click(function(evt) {
		$("#assessment").submit();
	});
	//Code for Save & Close button
	$('#btn_save_close').click(function(evt) {
		$('#close').val('1');
		$("#assessment").submit();
	});

});

function hide_divs(){
	$('div#ibm-navigation').hide();
};
