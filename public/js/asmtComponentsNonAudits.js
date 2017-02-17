$(document).ready(function(){
	$('#btn_edit').click(function() {
	  window.location.href = window.location.href+"&edit";
	});
	$('#btn_save').click(function(evt) {
		var form = $('#asmtcomponentform');
		$.ajax({
			url: form.attr("action"),
			type: 'POST',
			data: form.serialize(),
			processData: false,
			success: function (data) {
				location.reload();
				window.opener.document.form.submit();
			},
			error: function() {
				alert("There was an error when saving the document.");
			}
		});
	});
	
	$('#btn_cancel').click(function() {
		window.close();
	});
	if(window.opener.location.href.indexOf("&edit")== -1){
		$('#btn_edit').next().remove();
		$('#btn_edit').remove();
	}
});