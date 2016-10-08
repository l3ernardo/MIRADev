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
	switch ($("input[name='parentdocsubtype']").val()) {
		case "Country Process":
			$("#AsmtOtherConsiderationsReadOnly").html($("input[name='AsmtOtherConsiderationsRO']").val());
			break;
		case "Global Process":
			$("#OverallAssessmentCommentsReadOnly").html($("input[name='OverallAssessmentCommentsRO']").val());
			$("#KCFRTestingCommentsReadOnly").html($("input[name='KCFRTestingCommentsRO']").val());
			$("#KCOTestingCommentsReadOnly").html($("input[name='KCOTestingCommentsRO']").val());
			$("#CorpIACommentsReadOnly").html($("input[name='CorpIACommentsRO']").val());
			$("#MissedRECommentsReadOnly").html($("input[name='MissedRECommentsRO']").val());
			$("#MissedMSACCommentsReadOnly").html($("input[name='MissedMSACCommentsRO']").val());
			$("#BoCCommentsReadOnly").html($("input[name='BoCCommentsRO']").val());
			$("#PerfOverviewOtherExplanationReadOnly").html($("input[name='PerfOverviewOtherExplanationRO']").val());
			$("#PerfOverviewCriticaExplanationReadOnly").html($("input[name='PerfOverviewCriticaExplanationRO']").val());
			// Rich text fields for metrics
			var metrics = $("#opMetricIDs").val().split(',');
			var i;
			for (i = 0; i < metrics.length; ++i) {
				$("#"+metrics[i]+"commentfieldReadOnly").html($("input[name='"+metrics[i]+"commentfieldRO']").val());
			}
			break;
	}

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
		switch ($("input[name='parentdocsubtype']").val()) {
			case "Country Process":
				myEditorAsmtOtherConsiderations.saveHTML();
				YmyEditor = myEditorAsmtOtherConsiderations.get('element').value;
				$('#AsmtOtherConsiderations').val(YmyEditor);
				break;
			case "Global Process":
				break;
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
		switch ($("input[name='parentdocsubtype']").val()) {
			case "Country Process":
				myEditorAsmtOtherConsiderations.saveHTML();
				YmyEditor = myEditorAsmtOtherConsiderations.get('element').value;
				$('#AsmtOtherConsiderations').val(YmyEditor);
				break;
			case "Global Process":
				break;
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
	myEditor = new YAHOO.widget.SimpleEditor('RatingSummary', myConfig);
	myEditor.render();
	myEditor = new YAHOO.widget.SimpleEditor('Highlight', myConfig);
	myEditor.render();
	myEditor = new YAHOO.widget.SimpleEditor('FocusArea', myConfig);
	myEditor.render();
	switch ($("input[name='parentdocsubtype']").val()) {
		case "Country Process":
			myEditor = new YAHOO.widget.SimpleEditor('AsmtOtherConsiderations', myConfig);
			myEditor.render();
			break;
		case "Global Process":
			myEditor = new YAHOO.widget.SimpleEditor('OverallAssessmentComments', myConfig);
			myEditor.render();
			myEditor = new YAHOO.widget.SimpleEditor('KCFRTestingComments', myConfig);
			myEditor.render();
			myEditor = new YAHOO.widget.SimpleEditor('KCOTestingComments', myConfig);
			myEditor.render();
			myEditor = new YAHOO.widget.SimpleEditor('CorpIAComments', myConfig);
			myEditor.render();
			myEditor = new YAHOO.widget.SimpleEditor('MissedREComments', myConfig);
			myEditor.render();
			myEditor = new YAHOO.widget.SimpleEditor('MissedMSACComments', myConfig);
			myEditor.render();
			myEditor = new YAHOO.widget.SimpleEditor('BoCComments', myConfig);
			myEditor.render();
			myEditor = new YAHOO.widget.SimpleEditor('PerfOverviewOtherExplanation', myConfig);
			myEditor.render();
			myEditor = new YAHOO.widget.SimpleEditor('PerfOverviewCriticaExplanation', myConfig);
			myEditor.render();
			// Rich text fields for metrics
			var metrics = $("#opMetricIDs").val().split(',');
			var i;
			for (i = 0; i < metrics.length; ++i) {
				myEditor = new YAHOO.widget.SimpleEditor(metrics[i]+'Comment', myConfig);
				myEditor.render();
			}
			break;
	}
	// --- end of rich text section --- //

});

function hide_divs(){
	$('div#ibm-navigation').hide();
};
