$(document).ready(function(){
	//Hide left navigation
	hide_divs();
	//display notes
 	$("#NotesReadOnly").html($("input[name='NotesRO']").val());
	//Code for Cancel button
	$('#btn_cancel').click(function() {
		window.location.href = "/processdashboard";
	});
	//Code for Save button
	$('#btn_save').click(function() {
		myEditor.saveHTML();
		var YmyEditor = myEditor.get('element').value;
		$('#Notes').val(YmyEditor);
		$("#assessableunit").submit();
	});
	//Code for Save & Close button
	$('#btn_save_close').click(function() {
		myEditor.saveHTML();
		var YmyEditor = myEditor.get('element').value;
		$('#Notes').val(YmyEditor);
		$('#close').val('1');
		$("#assessableunit").submit();
	});
	//Code for Edit button
	$('#btn_edit').click(function() {
		window.location.href = "assessableunit?id=" + $("input[name='docid']").val() + "&edit";
	});
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
});

function hide_divs(){
	$('div#ibm-navigation').hide();
};
