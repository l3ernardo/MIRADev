$(document).ready(function(){
	//Hide left navigation
	//hide_divs();
	//display as htmls
	$("#ratingcategoryDisplay").html($("input[name='ratingcategory']").val());
	$("#ratingcategoryDisplayByIOT").html($("input[name='ratingcategory']").val());
	$("#ratingcategoryDisplayByCountry").html($("input[name='ratingcategory']").val());
 	$("#NotesReadOnly").html($("input[name='NotesRO']").val());
	$("#RatingSummaryReadOnly").html($("input[name='RatingSummaryRO']").val());
	$("#HighlightReadOnly").html($("input[name='HighlightRO']").val());
	$("#FocusAreaReadOnly").html($("input[name='FocusAreaRO']").val());
	switch ($("input[name='parentdocsubtype']").val()) {
		case "Controllable Unit":
		case "Country Process":
			$("#AsmtOtherConsiderationsReadOnly").html($("input[name='AsmtOtherConsiderationsRO']").val());
			break;
		case "BU Reporting Group":
		case "BU IOT":
		case "BU IMT":
		case "BU Country":
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

	if ($("input[name='parentdocsubtype']").val() == "Country Process" || $("input[name='parentdocsubtype']").val() == "Controllable Unit") {
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
			case "Controllable Unit":
			case "Country Process":
				myEditorAsmtOtherConsiderations.saveHTML();
				YmyEditor = myEditorAsmtOtherConsiderations.get('element').value;
				$('#AsmtOtherConsiderations').val(YmyEditor);
				break;
			case "BU Reporting Group":
			case "BU IOT":
			case "BU IMT":
			case "BU Country":
			case "Global Process":
				myEditorOverallAssessmentComments.saveHTML();
				YmyEditor = myEditorOverallAssessmentComments.get('element').value;
				$('#OverallAssessmentComments').val(YmyEditor);
				myEditorKCFRTestingComments.saveHTML();
				YmyEditor = myEditorKCFRTestingComments.get('element').value;
				$('#KCFRTestingComments').val(YmyEditor);
				myEditorKCOTestingComments.saveHTML();
				YmyEditor = myEditorKCOTestingComments.get('element').value;
				$('#KCOTestingComments').val(YmyEditor);
				myEditorKCOTestingComments.saveHTML();
				YmyEditor = myEditorKCOTestingComments.get('element').value;
				$('#KCOTestingComments').val(YmyEditor);
				myEditorCorpIAComments.saveHTML();
				YmyEditor = myEditorCorpIAComments.get('element').value;
				$('#CorpIAComments').val(YmyEditor);
				myEditorMissedREComments.saveHTML();
				YmyEditor = myEditorMissedREComments.get('element').value;
				$('#MissedREComments').val(YmyEditor);
				myEditorMissedMSACComments.saveHTML();
				YmyEditor = myEditorMissedMSACComments.get('element').value;
				$('#MissedMSACComments').val(YmyEditor);
				myEditorBoCComments.saveHTML();
				YmyEditor = myEditorBoCComments.get('element').value;
				$('#BoCComments').val(YmyEditor);
				myEditorPerfOverviewOtherExplanation.saveHTML();
				YmyEditor = myEditorPerfOverviewOtherExplanation.get('element').value;
				$('#PerfOverviewOtherExplanation').val(YmyEditor);
				myEditorPerfOverviewCriticaExplanation.saveHTML();
				YmyEditor = myEditorPerfOverviewCriticaExplanation.get('element').value;
				$('#PerfOverviewCriticaExplanation').val(YmyEditor);
				// Rich text fields for metrics
				var metrics = $("#opMetricIDs").val().split(',');
				var i;
				for (i = 0; i < metrics.length; ++i) {
					vars['myEditor'+metrics[i]+'Comment'].saveHTML();
					YmyEditor = vars['myEditor'+metrics[i]+'Comment'].get('element').value;
					$('#'+metrics[i]+'Comment').val(YmyEditor);
				}
				break;
		}
		$("#assessment").submit();
	});
	//Code for Save & Close button
	$('#btn_save_close').click(function(evt) {
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
			case "Controllable Unit":
			case "Country Process":
				myEditorAsmtOtherConsiderations.saveHTML();
				YmyEditor = myEditorAsmtOtherConsiderations.get('element').value;
				$('#AsmtOtherConsiderations').val(YmyEditor);
				break;
			case "BU Reporting Group":
			case "BU IOT":
			case "BU IMT":
			case "BU Country":
			case "Global Process":
				myEditorOverallAssessmentComments.saveHTML();
				YmyEditor = myEditorOverallAssessmentComments.get('element').value;
				$('#OverallAssessmentComments').val(YmyEditor);
				myEditorKCFRTestingComments.saveHTML();
				YmyEditor = myEditorKCFRTestingComments.get('element').value;
				$('#KCFRTestingComments').val(YmyEditor);
				myEditorKCOTestingComments.saveHTML();
				YmyEditor = myEditorKCOTestingComments.get('element').value;
				$('#KCOTestingComments').val(YmyEditor);
				myEditorKCOTestingComments.saveHTML();
				YmyEditor = myEditorKCOTestingComments.get('element').value;
				$('#KCOTestingComments').val(YmyEditor);
				myEditorCorpIAComments.saveHTML();
				YmyEditor = myEditorCorpIAComments.get('element').value;
				$('#CorpIAComments').val(YmyEditor);
				myEditorMissedREComments.saveHTML();
				YmyEditor = myEditorMissedREComments.get('element').value;
				$('#MissedREComments').val(YmyEditor);
				myEditorMissedMSACComments.saveHTML();
				YmyEditor = myEditorMissedMSACComments.get('element').value;
				$('#MissedMSACComments').val(YmyEditor);
				myEditorBoCComments.saveHTML();
				YmyEditor = myEditorBoCComments.get('element').value;
				$('#BoCComments').val(YmyEditor);
				myEditorPerfOverviewOtherExplanation.saveHTML();
				YmyEditor = myEditorPerfOverviewOtherExplanation.get('element').value;
				$('#PerfOverviewOtherExplanation').val(YmyEditor);
				myEditorPerfOverviewCriticaExplanation.saveHTML();
				YmyEditor = myEditorPerfOverviewCriticaExplanation.get('element').value;
				$('#PerfOverviewCriticaExplanation').val(YmyEditor);
				// Rich text fields for metrics
				var metrics = $("#opMetricIDs").val().split(',');
				var i;
				for (i = 0; i < metrics.length; ++i) {
					vars['myEditor'+metrics[i]+'Comment'].saveHTML();
					YmyEditor = vars['myEditor'+metrics[i]+'Comment'].get('element').value;
					$('#'+metrics[i]+'Comment').val(YmyEditor);
				}
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
	myEditorRatingSummary = new YAHOO.widget.SimpleEditor('RatingSummary', myConfig);
	myEditorRatingSummary.render();
	myEditorHighlight = new YAHOO.widget.SimpleEditor('Highlight', myConfig);
	myEditorHighlight.render();
	myEditorFocusArea = new YAHOO.widget.SimpleEditor('FocusArea', myConfig);
	myEditorFocusArea.render();
	switch ($("input[name='parentdocsubtype']").val()) {
		case "Controllable Unit":
		case "Country Process":
			myEditorAsmtOtherConsiderations = new YAHOO.widget.SimpleEditor('AsmtOtherConsiderations', myConfig);
			myEditorAsmtOtherConsiderations.render();
			break;
		case "BU Reporting Group":
		case "BU IOT":
		case "BU IMT":
		case "BU Country":
		case "Global Process":
			myEditorOverallAssessmentComments = new YAHOO.widget.SimpleEditor('OverallAssessmentComments', myConfig);
			myEditorOverallAssessmentComments.render();
			myEditorKCFRTestingComments = new YAHOO.widget.SimpleEditor('KCFRTestingComments', myConfig);
			myEditorKCFRTestingComments.render();
			myEditorKCOTestingComments = new YAHOO.widget.SimpleEditor('KCOTestingComments', myConfig);
			myEditorKCOTestingComments.render();
			myEditorCorpIAComments = new YAHOO.widget.SimpleEditor('CorpIAComments', myConfig);
			myEditorCorpIAComments.render();
			myEditorMissedREComments = new YAHOO.widget.SimpleEditor('MissedREComments', myConfig);
			myEditorMissedREComments.render();
			myEditorMissedMSACComments = new YAHOO.widget.SimpleEditor('MissedMSACComments', myConfig);
			myEditorMissedMSACComments.render();
			myEditorBoCComments = new YAHOO.widget.SimpleEditor('BoCComments', myConfig);
			myEditorBoCComments.render();
			myEditorPerfOverviewOtherExplanation = new YAHOO.widget.SimpleEditor('PerfOverviewOtherExplanation', myConfig);
			myEditorPerfOverviewOtherExplanation.render();
			myEditorPerfOverviewCriticaExplanation = new YAHOO.widget.SimpleEditor('PerfOverviewCriticaExplanation', myConfig);
			myEditorPerfOverviewCriticaExplanation.render();
			// Rich text fields for metrics
			var metrics = $("#opMetricIDs").val().split(',');
			var i;
			var vars = {};
			for (i = 0; i < metrics.length; ++i) {
				vars['myEditor'+metrics[i]+'Comment'] = new YAHOO.widget.SimpleEditor(metrics[i]+'Comment', myConfig);
				vars['myEditor'+metrics[i]+'Comment'].render();
			}
			break;
	}
	// --- end of rich text section --- //

});

function hide_divs(){
	$('div#ibm-navigation').hide();
};
