$(document).ready(function(){
	$('#btn_edit').click(function() {
		window.location.href = window.location.href+"&edit";
	});
	$('#btn_save').click(function(evt) {
		if(validation()){
			//Disable save button
			$(':button').prop("disabled",true);
			
			var form = $('#asmtcomponentform');
			$.ajax({
				url: form.attr("action"),
				type: 'POST',
				data: form.serialize(),
				processData: false,
				success: function (data) {
					if(window.location.href.indexOf("&new") > 0){
						var url = window.location.href.split("pid=");
						window.location.href = window.location.origin + "/asmtcomponents?id=" + data.data.id + "&pid=" + url[url.length - 1].replace("&new","&edit"); 
					}
					else{
						window.location.href = window.location.href;
					}
					window.opener.document.form.submit();
				},
				error: function() {
					$(':button').prop("disabled",false);
					alert("There was an error when saving the document.");
				}
			});
		}
	});
	
	$('#btn_cancel').click(function() {
		window.close();
	});
	if(window.opener.location.href.indexOf("&edit")== -1){
		$('#btn_edit').next().remove();
		$('#btn_edit').remove();
	}
});