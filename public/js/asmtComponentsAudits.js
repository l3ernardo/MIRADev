$(document).ready(function(){
	//Display notes
	if($("#NotesReadOnly").length > 0){
		$("#NotesReadOnly").html($("input[name='NotesRO']").val());
		//Setup some private variables
		var Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event;
		//The SimpleEditor config
		var myConfig = {
			height: '200px',
			width: '100%',
			dompath: true,
			focusAtStart: true
		};
		//Load the SimpleEditor
		myEditor = new YAHOO.widget.SimpleEditor('Notes', myConfig);
		myEditor.render();
		
	}
	
	//Hide notes section
	$("#notes_area").html("<td></td><td></td>");
		
	$('#btn_edit').click(function() {
		window.location.href = window.location.href+"&edit";
	});
	$('#btn_save').click(function(evt) {
		if(validation()){
			// myEditor.saveHTML();
			// var YmyEditor = myEditor.get('element').value;
			// $('#Notes').val(YmyEditor);
			
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
	
	$("#numRecommendationsOpen").change(function() {
		var open = Number(this.value);
		var total = Number($("#numRecommendationsTotal").val());
		if(total < open){
			alert("Total # recomendations can't be less than # of Open recomendations.");
		}
	});
	$("#numRecommendationsTotal").change(function() {
		var total = Number(this.value);
		var open = Number($("#numRecommendationsOpen").val());
		if(total < open){
			alert("Total # recomendations can't be less than # of Open recomendations.");
		}
	});

	if(window.opener.location.href.indexOf("&edit")== -1){
		$('#btn_edit').next().remove();
		$('#btn_edit').remove();
	}
	
});
