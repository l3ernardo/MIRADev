$(document).ready(function(){
	//Hide left navigation
	hide_divs();
	//display as htmls
	$("#ratingcategoryDisplay").html($("input[name='ratingcategory']").val());
	$("#ratingcategoryDisplayByIOT").html($("input[name='ratingcategory']").val());
 	$("#NotesReadOnly").html($("input[name='NotesRO']").val());
	$("#RatingSummaryReadOnly").html($("input[name='RatingSummaryRO']").val());
	$("#HighlightReadOnly").html($("input[name='HighlightRO']").val());
	$("#FocusAreaReadOnly").html($("input[name='FocusAreaRO']").val());
	if ($("input[name='parentdocsubtype']").val() == "Country Process") {
		$("#AsmtOtherConsiderationsReadOnly").html($("input[name='AsmtOtherConsiderationsRO']").val());
	}

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
		myEditorRatingSummary.saveHTML();
		myEditorHighlight.saveHTML();
		myEditorFocusArea.saveHTML();

		var YmyEditor = myEditor.get('element').value;
		$('#Notes').val(YmyEditor);
		YmyEditor = myEditorRatingSummary.get('element').value;
		$('#RatingSummary').val(YmyEditor);
		YmyEditor = myEditorHighlight.get('element').value;
		$('#Highlight').val(YmyEditor);
		YmyEditor = myEditorFocusArea.get('element').value;
		$('#FocusArea').val(YmyEditor);
		if ($("input[name='parentdocsubtype']").val() == "Country Process") {
			myEditorAsmtOtherConsiderations.saveHTML();
			YmyEditor = myEditorAsmtOtherConsiderations.get('element').value;
			$('#AsmtOtherConsiderations').val(YmyEditor);
		}
		$("#assessment").submit();
	});
	//Code for Save & Close button
	$('#btn_save_close').click(function(evt) {
		myEditor.saveHTML();
		myEditor.saveHTML();
		myEditorRatingSummary.saveHTML();
		myEditorHighlight.saveHTML();
		myEditorFocusArea.saveHTML();

		var YmyEditor = myEditor.get('element').value;
		$('#Notes').val(YmyEditor);
		YmyEditor = myEditorRatingSummary.get('element').value;
		$('#RatingSummary').val(YmyEditor);
		YmyEditor = myEditorHighlight.get('element').value;
		$('#Highlight').val(YmyEditor);
		YmyEditor = myEditorFocusArea.get('element').value;
		$('#FocusArea').val(YmyEditor);
		if ($("input[name='parentdocsubtype']").val() == "Country Process") {
			myEditorAsmtOtherConsiderations.saveHTML();
			YmyEditor = myEditorAsmtOtherConsiderations.get('element').value;
			$('#AsmtOtherConsiderations').val(YmyEditor);
		}

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
	//Load the SimpleEditors
	myEditor = new YAHOO.widget.SimpleEditor('Notes', myConfig);
	myEditor.render();
	myEditorRatingSummary = new YAHOO.widget.SimpleEditor('RatingSummary', myConfig);
	myEditorRatingSummary.render();
	myEditorHighlight = new YAHOO.widget.SimpleEditor('Highlight', myConfig);
	myEditorHighlight.render();
	myEditorFocusArea = new YAHOO.widget.SimpleEditor('FocusArea', myConfig);
	myEditorFocusArea.render();
	if ($("input[name='parentdocsubtype']").val() == "Country Process") {
		myEditorAsmtOtherConsiderations = new YAHOO.widget.SimpleEditor('AsmtOtherConsiderations', myConfig);
		myEditorAsmtOtherConsiderations.render();
	}
	// --- end of rich text section --- //

});

function hide_divs(){
	$('div#ibm-navigation').hide();
};
