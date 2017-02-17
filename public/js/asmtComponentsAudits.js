$(document).ready(function(){
	//Display notes
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

	$('#btn_edit').click(function() {
		window.location.href = window.location.href+"&edit";
	});
	$('#btn_save').click(function(evt) {
		myEditor.saveHTML();
		var YmyEditor = myEditor.get('element').value;
		$('#Notes').val(YmyEditor);
		
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
