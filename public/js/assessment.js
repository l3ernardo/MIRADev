$(document).ready(function(){
	//Hide left navigation
	hide_divs();
	//display notes
 	$("#NotesReadOnly").html($("input[name='NotesRO']").val());

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
		myEditor.saveHTML();
		var YmyEditor = myEditor.get('element').value;
		$('#Notes').val(YmyEditor);
		$("#assessment").submit();
	});
	//Code for Save & Close button
	$('#btn_save_close').click(function(evt) {
		myEditor.saveHTML();
		var YmyEditor = myEditor.get('element').value;
		$('#Notes').val(YmyEditor);
		$('#close').val('1');
		$("#assessment").submit();
	});

	// --- start of rich text section --- //
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
	// --- end of rich text section --- //

});

function hide_divs(){
	$('div#ibm-navigation').hide();
};
