$(document).ready(function(){
	//display as htmls
	$("#ratingcategoryDisplay").html($("input[name='ratingcategory']").val());
	$("#ratingcategoryDisplayByIOT").html($("input[name='ratingcategory']").val());
	$("#ratingcategoryDisplayByCountry").html($("input[name='ratingcategory']").val());
 	$("#NotesReadOnly").html($("input[name='NotesRO']").val());
	$("#RatingSummaryReadOnly").html($("input[name='RatingSummaryRO']").val());
	if ( $("input[name='enteredbu']").val() == "GTS" ) {
		if ($("input[name='parentdocsubtype']").val() == "BU Reporting Group" || $("input[name='parentdocsubtype']").val() == "BU Country" || $("input[name='parentdocsubtype']").val() == "BU IMT" || $("input[name='parentdocsubtype']").val() == "BU IOT" || $("input[name='parentdocsubtype']").val() == "Business Unit") {
			$("#HighlightReadOnlyCRM").html($("input[name='HighlightROCRM']").val());
			$("#FocusAreaReadOnlyCRM").html($("input[name='FocusAreaROCRM']").val());
			$("#HighlightReadOnlySOD").html($("input[name='HighlightROSOD']").val());
			$("#FocusAreaReadOnlySOD").html($("input[name='FocusAreaROSOD']").val());
		} else {
			$("#HighlightReadOnly").html($("input[name='HighlightRO']").val());
			$("#FocusAreaReadOnly").html($("input[name='FocusAreaRO']").val());
		}
	} else {
		$("#HighlightReadOnly").html($("input[name='HighlightRO']").val());
		$("#FocusAreaReadOnly").html($("input[name='FocusAreaRO']").val());
	}
	switch ($("input[name='parentdocsubtype']").val()) {
		case "Controllable Unit":
		case "Country Process":
			$("#AsmtOtherConsiderationsReadOnly").html($("input[name='AsmtOtherConsiderationsRO']").val());
			break;
		case "Business Unit":
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
			// Rich text fields for metrics
			var metrics = $("#opMetricIDs").val().split(',');
			var i;
			for (i = 0; i < metrics.length; ++i) {
				$("#"+metrics[i]+"commentfieldReadOnly").html($("input[name='"+metrics[i]+"commentfieldRO']").val());
			}
			if ($("input[name='enteredbu']").val() == "GTS" && ($("input[name='parentdocsubtype']").val() !== "Global Process")) {
				// CRM rich text fields
				$("#OverallAssessmentCommentsReadOnlyCRM").html($("input[name='OverallAssessmentCommentsROCRM']").val());
				$("#KCFRTestingCommentsReadOnlyCRM").html($("input[name='KCFRTestingCommentsROCRM']").val());
				$("#KCOTestingCommentsReadOnlyCRM").html($("input[name='KCOTestingCommentsROCRM']").val());
				$("#CorpIACommentsReadOnlyCRM").html($("input[name='CorpIACommentsROCRM']").val());
				$("#MissedRECommentsReadOnlyCRM").html($("input[name='MissedRECommentsROCRM']").val());
				$("#MissedMSACCommentsReadOnlyCRM").html($("input[name='MissedMSACCommentsROCRM']").val());
				$("#BoCCommentsReadOnlyCRM").html($("input[name='BoCCommentsROCRM']").val());
				$("#PerfOverviewOtherExplanationReadOnlyCRM").html($("input[name='PerfOverviewOtherExplanationROCRM']").val());
				$("#PerfOverviewCriticaExplanationReadOnlyCRM").html($("input[name='PerfOverviewCriticaExplanationROCRM']").val());
				// SOD rich text fields
				$("#OverallAssessmentCommentsReadOnlySOD").html($("input[name='OverallAssessmentCommentsROSOD']").val());
				$("#KCFRTestingCommentsReadOnlySOD").html($("input[name='KCFRTestingCommentsROSOD']").val());
				$("#KCOTestingCommentsReadOnlySOD").html($("input[name='KCOTestingCommentsROSOD']").val());
				$("#CorpIACommentsReadOnlySOD").html($("input[name='CorpIACommentsROSOD']").val());
				$("#MissedRECommentsReadOnlySOD").html($("input[name='MissedRECommentsROSOD']").val());
				$("#MissedMSACCommentsReadOnlySOD").html($("input[name='MissedMSACCommentsROSOD']").val());
				$("#BoCCommentsReadOnlySOD").html($("input[name='BoCCommentsROSOD']").val());
				$("#PerfOverviewOtherExplanationReadOnlySOD").html($("input[name='PerfOverviewOtherExplanationROSOD']").val());
				$("#PerfOverviewCriticaExplanationReadOnlySOD").html($("input[name='PerfOverviewCriticaExplanationROSOD']").val());
				// Rich text fields for metrics
				var metricsSOD = $("#opMetricIDsSOD").val().split(',');
				var i;
				for (i = 0; i < metricsSOD.length; ++i) {
					$("#"+metricsSOD[i]+"commentfieldReadOnlySOD").html($("input[name='"+metricsSOD[i]+"commentfieldROSOD']").val());
				}
			} else {
				$("#BoCCommentsReadOnly").html($("input[name='BoCCommentsRO']").val());
				$("#PerfOverviewOtherExplanationReadOnly").html($("input[name='PerfOverviewOtherExplanationRO']").val());
				$("#PerfOverviewCriticaExplanationReadOnly").html($("input[name='PerfOverviewCriticaExplanationRO']").val());
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
		window.location.href = $("li#breadcrumb > a").attr("href");
	});
	//Code for Save button
	$('#btn_save').click(function(evt) {
		myEditor.saveHTML();
		myEditorRatingSummary.saveHTML();

		var YmyEditor = myEditor.get('element').value;
		$('#Notes').val(YmyEditor);
		YmyEditor = myEditorRatingSummary.get('element').value;
		$('#RatingSummary').val(YmyEditor);
		if ( $("input[name='enteredbu']").val() == "GTS" ) {
			if ($("input[name='parentdocsubtype']").val() == "BU Reporting Group" || $("input[name='parentdocsubtype']").val() == "BU Country" || $("input[name='parentdocsubtype']").val() == "BU IMT" || $("input[name='parentdocsubtype']").val() == "BU IOT" || $("input[name='parentdocsubtype']").val() == "Business Unit") {
				myEditorHighlightCRM.saveHTML();
				YmyEditor = myEditorHighlightCRM.get('element').value;
				$('#HighlightCRM').val(YmyEditor);
				myEditorFocusAreaCRM.saveHTML();
				YmyEditor = myEditorFocusAreaCRM.get('element').value;
				$('#FocusAreaCRM').val(YmyEditor);

				myEditorHighlightSOD.saveHTML();
				YmyEditor = myEditorHighlightSOD.get('element').value;
				$('#HighlightSOD').val(YmyEditor);
				myEditorFocusAreaSOD.saveHTML();
				YmyEditor = myEditorFocusAreaSOD.get('element').value;
				$('#FocusAreaSOD').val(YmyEditor);
			} else {
				myEditorHighlight.saveHTML();
				YmyEditor = myEditorHighlight.get('element').value;
				$('#Highlight').val(YmyEditor);
				myEditorFocusArea.saveHTML();
				YmyEditor = myEditorFocusArea.get('element').value;
				$('#FocusArea').val(YmyEditor);
			}
		} else {
			myEditorHighlight.saveHTML();
			YmyEditor = myEditorHighlight.get('element').value;
			$('#Highlight').val(YmyEditor);
			myEditorFocusArea.saveHTML();
			YmyEditor = myEditorFocusArea.get('element').value;
			$('#FocusArea').val(YmyEditor);
		}
		switch ($("input[name='parentdocsubtype']").val()) {
			case "Controllable Unit":
			case "Country Process":
				myEditorAsmtOtherConsiderations.saveHTML();
				YmyEditor = myEditorAsmtOtherConsiderations.get('element').value;
				$('#AsmtOtherConsiderations').val(YmyEditor);
				break;
			case "Business Unit":
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
				// Rich text fields for metrics
				var metrics = $("#opMetricIDs").val().split(',');
				var i;
				for (i = 0; i < metrics.length; ++i) {
					vars['myEditor'+metrics[i]+'Comment'].saveHTML();
					YmyEditor = vars['myEditor'+metrics[i]+'Comment'].get('element').value;
					$('#'+metrics[i]+'Comment').val(YmyEditor);
				}
				if ($("input[name='enteredbu']").val() == "GTS" && ($("input[name='parentdocsubtype']").val() !== "Global Process")) {
					// CRM rich text fields
					myEditorOverallAssessmentCommentsCRM.saveHTML();
					YmyEditor = myEditorOverallAssessmentCommentsCRM.get('element').value;
					$('#OverallAssessmentCommentsCRM').val(YmyEditor);
					myEditorKCFRTestingCommentsCRM.saveHTML();
					YmyEditor = myEditorKCFRTestingCommentsCRM.get('element').value;
					$('#KCFRTestingCommentsCRM').val(YmyEditor);
					myEditorKCOTestingCommentsCRM.saveHTML();
					YmyEditor = myEditorKCOTestingCommentsCRM.get('element').value;
					$('#KCOTestingCommentsCRM').val(YmyEditor);
					myEditorKCOTestingCommentsCRM.saveHTML();
					YmyEditor = myEditorKCOTestingCommentsCRM.get('element').value;
					$('#KCOTestingCommentsCRM').val(YmyEditor);
					myEditorCorpIACommentsCRM.saveHTML();
					YmyEditor = myEditorCorpIACommentsCRM.get('element').value;
					$('#CorpIACommentsCRM').val(YmyEditor);
					myEditorMissedRECommentsCRM.saveHTML();
					YmyEditor = myEditorMissedRECommentsCRM.get('element').value;
					$('#MissedRECommentsCRM').val(YmyEditor);
					myEditorMissedMSACCommentsCRM.saveHTML();
					YmyEditor = myEditorMissedMSACCommentsCRM.get('element').value;
					$('#MissedMSACCommentsCRM').val(YmyEditor);
					myEditorBoCCommentsCRM.saveHTML();
					YmyEditor = myEditorBoCCommentsCRM.get('element').value;
					$('#BoCCommentsCRM').val(YmyEditor);
					myEditorPerfOverviewOtherExplanationCRM.saveHTML();
					YmyEditor = myEditorPerfOverviewOtherExplanationCRM.get('element').value;
					$('#PerfOverviewOtherExplanationCRM').val(YmyEditor);
					myEditorPerfOverviewCriticaExplanationCRM.saveHTML();
					YmyEditor = myEditorPerfOverviewCriticaExplanationCRM.get('element').value;
					$('#PerfOverviewCriticaExplanationCRM').val(YmyEditor);
					// SOD rich text fields
					myEditorOverallAssessmentCommentsSOD.saveHTML();
					YmyEditor = myEditorOverallAssessmentCommentsSOD.get('element').value;
					$('#OverallAssessmentCommentsSOD').val(YmyEditor);
					myEditorKCFRTestingCommentsSOD.saveHTML();
					YmyEditor = myEditorKCFRTestingCommentsSOD.get('element').value;
					$('#KCFRTestingCommentsSOD').val(YmyEditor);
					myEditorKCOTestingCommentsSOD.saveHTML();
					YmyEditor = myEditorKCOTestingCommentsSOD.get('element').value;
					$('#KCOTestingCommentsSOD').val(YmyEditor);
					myEditorKCOTestingCommentsSOD.saveHTML();
					YmyEditor = myEditorKCOTestingCommentsSOD.get('element').value;
					$('#KCOTestingCommentsSOD').val(YmyEditor);
					myEditorCorpIACommentsSOD.saveHTML();
					YmyEditor = myEditorCorpIACommentsSOD.get('element').value;
					$('#CorpIACommentsSOD').val(YmyEditor);
					myEditorMissedRECommentsSOD.saveHTML();
					YmyEditor = myEditorMissedRECommentsSOD.get('element').value;
					$('#MissedRECommentsSOD').val(YmyEditor);
					myEditorMissedMSACCommentsSOD.saveHTML();
					YmyEditor = myEditorMissedMSACCommentsSOD.get('element').value;
					$('#MissedMSACCommentsSOD').val(YmyEditor);
					myEditorBoCCommentsSOD.saveHTML();
					YmyEditor = myEditorBoCCommentsSOD.get('element').value;
					$('#BoCCommentsSOD').val(YmyEditor);
					myEditorPerfOverviewOtherExplanationSOD.saveHTML();
					YmyEditor = myEditorPerfOverviewOtherExplanationSOD.get('element').value;
					$('#PerfOverviewOtherExplanationSOD').val(YmyEditor);
					myEditorPerfOverviewCriticaExplanationSOD.saveHTML();
					YmyEditor = myEditorPerfOverviewCriticaExplanationSOD.get('element').value;
					$('#PerfOverviewCriticaExplanationSOD').val(YmyEditor);
					// Rich text fields for metrics
					var metricsSOD = $("#opMetricIDsSOD").val().split(',');
					var i;
					for (i = 0; i < metricsSOD.length; ++i) {
						varsSOD['myEditor'+metricsSOD[i]+'CommentSOD'].saveHTML();
						YmyEditor = varsSOD['myEditor'+metricsSOD[i]+'CommentSOD'].get('element').value;
						$('#'+metricsSOD[i]+'CommentSOD').val(YmyEditor);
					}
				} else {
					myEditorBoCComments.saveHTML();
					YmyEditor = myEditorBoCComments.get('element').value;
					$('#BoCComments').val(YmyEditor);
					myEditorPerfOverviewOtherExplanation.saveHTML();
					YmyEditor = myEditorPerfOverviewOtherExplanation.get('element').value;
					$('#PerfOverviewOtherExplanation').val(YmyEditor);
					myEditorPerfOverviewCriticaExplanation.saveHTML();
					YmyEditor = myEditorPerfOverviewCriticaExplanation.get('element').value;
					$('#PerfOverviewCriticaExplanation').val(YmyEditor);
				}
				break;
		}
		$("#assessment").submit();
	});
	//Code for Save & Close button
	$('#btn_save_close').click(function(evt) {
		myEditor.saveHTML();
		myEditorRatingSummary.saveHTML();

		var YmyEditor = myEditor.get('element').value;
		$('#Notes').val(YmyEditor);
		YmyEditor = myEditorRatingSummary.get('element').value;
		$('#RatingSummary').val(YmyEditor);
		if ( $("input[name='enteredbu']").val() == "GTS" ) {
			if ($("input[name='parentdocsubtype']").val() == "BU Reporting Group" || $("input[name='parentdocsubtype']").val() == "BU Country" || $("input[name='parentdocsubtype']").val() == "BU IMT" || $("input[name='parentdocsubtype']").val() == "BU IOT" || $("input[name='parentdocsubtype']").val() == "Business Unit") {
				myEditorHighlightCRM.saveHTML();
				myEditorFocusAreaCRM.saveHTML();
				YmyEditor = myEditorHighlightCRM.get('element').value;
				$('#HighlightCRM').val(YmyEditor);
				YmyEditor = myEditorFocusAreaCRM.get('element').value;
				$('#FocusAreaCRM').val(YmyEditor);
				myEditorHighlightSOD.saveHTML();
				myEditorFocusAreaSOD.saveHTML();
				YmyEditor = myEditorHighlightSOD.get('element').value;
				$('#HighlightSOD').val(YmyEditor);
				YmyEditor = myEditorFocusAreaSOD.get('element').value;
				$('#FocusAreaSOD').val(YmyEditor);
			} else {
				myEditorHighlight.saveHTML();
				myEditorFocusArea.saveHTML();
				YmyEditor = myEditorHighlight.get('element').value;
				$('#Highlight').val(YmyEditor);
				YmyEditor = myEditorFocusArea.get('element').value;
				$('#FocusArea').val(YmyEditor);
			}
		} else {
			myEditorHighlight.saveHTML();
			myEditorFocusArea.saveHTML();
			YmyEditor = myEditorHighlight.get('element').value;
			$('#Highlight').val(YmyEditor);
			YmyEditor = myEditorFocusArea.get('element').value;
			$('#FocusArea').val(YmyEditor);
		}
		switch ($("input[name='parentdocsubtype']").val()) {
			case "Controllable Unit":
			case "Country Process":
				myEditorAsmtOtherConsiderations.saveHTML();
				YmyEditor = myEditorAsmtOtherConsiderations.get('element').value;
				$('#AsmtOtherConsiderations').val(YmyEditor);
				break;
			case "Business Unit":
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
				// Rich text fields for metrics
				var metrics = $("#opMetricIDs").val().split(',');
				var i;
				for (i = 0; i < metrics.length; ++i) {
					vars['myEditor'+metrics[i]+'Comment'].saveHTML();
					YmyEditor = vars['myEditor'+metrics[i]+'Comment'].get('element').value;
					$('#'+metrics[i]+'Comment').val(YmyEditor);
				}
				if ($("input[name='enteredbu']").val() == "GTS" && ($("input[name='parentdocsubtype']").val() !== "Global Process")) {
					// CRM rich text fields
					myEditorOverallAssessmentCommentsCRM.saveHTML();
					YmyEditor = myEditorOverallAssessmentCommentsCRM.get('element').value;
					$('#OverallAssessmentCommentsCRM').val(YmyEditor);
					myEditorKCFRTestingCommentsCRM.saveHTML();
					YmyEditor = myEditorKCFRTestingCommentsCRM.get('element').value;
					$('#KCFRTestingCommentsCRM').val(YmyEditor);
					myEditorKCOTestingCommentsCRM.saveHTML();
					YmyEditor = myEditorKCOTestingCommentsCRM.get('element').value;
					$('#KCOTestingCommentsCRM').val(YmyEditor);
					myEditorKCOTestingCommentsCRM.saveHTML();
					YmyEditor = myEditorKCOTestingCommentsCRM.get('element').value;
					$('#KCOTestingCommentsCRM').val(YmyEditor);
					myEditorCorpIACommentsCRM.saveHTML();
					YmyEditor = myEditorCorpIACommentsCRM.get('element').value;
					$('#CorpIACommentsCRM').val(YmyEditor);
					myEditorMissedRECommentsCRM.saveHTML();
					YmyEditor = myEditorMissedRECommentsCRM.get('element').value;
					$('#MissedRECommentsCRM').val(YmyEditor);
					myEditorMissedMSACCommentsCRM.saveHTML();
					YmyEditor = myEditorMissedMSACCommentsCRM.get('element').value;
					$('#MissedMSACCommentsCRM').val(YmyEditor);
					myEditorBoCCommentsCRM.saveHTML();
					YmyEditor = myEditorBoCCommentsCRM.get('element').value;
					$('#BoCCommentsCRM').val(YmyEditor);
					myEditorPerfOverviewOtherExplanationCRM.saveHTML();
					YmyEditor = myEditorPerfOverviewOtherExplanationCRM.get('element').value;
					$('#PerfOverviewOtherExplanationCRM').val(YmyEditor);
					myEditorPerfOverviewCriticaExplanationCRM.saveHTML();
					YmyEditor = myEditorPerfOverviewCriticaExplanationCRM.get('element').value;
					$('#PerfOverviewCriticaExplanationCRM').val(YmyEditor);
					// SOD rich text fields
					myEditorOverallAssessmentCommentsSOD.saveHTML();
					YmyEditor = myEditorOverallAssessmentCommentsSOD.get('element').value;
					$('#OverallAssessmentCommentsSOD').val(YmyEditor);
					myEditorKCFRTestingCommentsSOD.saveHTML();
					YmyEditor = myEditorKCFRTestingCommentsSOD.get('element').value;
					$('#KCFRTestingCommentsSOD').val(YmyEditor);
					myEditorKCOTestingCommentsSOD.saveHTML();
					YmyEditor = myEditorKCOTestingCommentsSOD.get('element').value;
					$('#KCOTestingCommentsSOD').val(YmyEditor);
					myEditorKCOTestingCommentsSOD.saveHTML();
					YmyEditor = myEditorKCOTestingCommentsSOD.get('element').value;
					$('#KCOTestingCommentsSOD').val(YmyEditor);
					myEditorCorpIACommentsSOD.saveHTML();
					YmyEditor = myEditorCorpIACommentsSOD.get('element').value;
					$('#CorpIACommentsSOD').val(YmyEditor);
					myEditorMissedRECommentsSOD.saveHTML();
					YmyEditor = myEditorMissedRECommentsSOD.get('element').value;
					$('#MissedRECommentsSOD').val(YmyEditor);
					myEditorMissedMSACCommentsSOD.saveHTML();
					YmyEditor = myEditorMissedMSACCommentsSOD.get('element').value;
					$('#MissedMSACCommentsSOD').val(YmyEditor);
					myEditorBoCCommentsSOD.saveHTML();
					YmyEditor = myEditorBoCCommentsSOD.get('element').value;
					$('#BoCCommentsSOD').val(YmyEditor);
					myEditorPerfOverviewOtherExplanationSOD.saveHTML();
					YmyEditor = myEditorPerfOverviewOtherExplanationSOD.get('element').value;
					$('#PerfOverviewOtherExplanationSOD').val(YmyEditor);
					myEditorPerfOverviewCriticaExplanationSOD.saveHTML();
					YmyEditor = myEditorPerfOverviewCriticaExplanationSOD.get('element').value;
					$('#PerfOverviewCriticaExplanationSOD').val(YmyEditor);
					// Rich text fields for metrics
					var metricsSOD = $("#opMetricIDsSOD").val().split(',');
					var i;
					for (i = 0; i < metricsSOD.length; ++i) {
						vars['myEditor'+metricsSOD[i]+'CommentSOD'].saveHTML();
						YmyEditor = vars['myEditor'+metricsSOD[i]+'CommentSOD'].get('element').value;
						$('#'+metricsSOD[i]+'CommentSOD').val(YmyEditor);
					}
				} else {
					myEditorBoCComments.saveHTML();
					YmyEditor = myEditorBoCComments.get('element').value;
					$('#BoCComments').val(YmyEditor);
					myEditorPerfOverviewOtherExplanation.saveHTML();
					YmyEditor = myEditorPerfOverviewOtherExplanation.get('element').value;
					$('#PerfOverviewOtherExplanation').val(YmyEditor);
					myEditorPerfOverviewCriticaExplanation.saveHTML();
					YmyEditor = myEditorPerfOverviewCriticaExplanation.get('element').value;
					$('#PerfOverviewCriticaExplanation').val(YmyEditor);
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
	if ( $("input[name='enteredbu']").val() == "GTS" ) {
		if ($("input[name='parentdocsubtype']").val() == "BU Reporting Group" || $("input[name='parentdocsubtype']").val() == "BU Country" || $("input[name='parentdocsubtype']").val() == "BU IMT" || $("input[name='parentdocsubtype']").val() == "BU IOT" || $("input[name='parentdocsubtype']").val() == "Business Unit") {
			myEditorHighlightCRM = new YAHOO.widget.SimpleEditor('HighlightCRM', myConfig);
			myEditorHighlightCRM.render();
			myEditorFocusAreaCRM = new YAHOO.widget.SimpleEditor('FocusAreaCRM', myConfig);
			myEditorFocusAreaCRM.render();
			myEditorHighlightSOD = new YAHOO.widget.SimpleEditor('HighlightSOD', myConfig);
			myEditorHighlightSOD.render();
			myEditorFocusAreaSOD = new YAHOO.widget.SimpleEditor('FocusAreaSOD', myConfig);
			myEditorFocusAreaSOD.render();
		} else {
			myEditorHighlight = new YAHOO.widget.SimpleEditor('Highlight', myConfig);
			myEditorHighlight.render();
			myEditorFocusArea = new YAHOO.widget.SimpleEditor('FocusArea', myConfig);
			myEditorFocusArea.render();
		}
	} else {
		myEditorHighlight = new YAHOO.widget.SimpleEditor('Highlight', myConfig);
		myEditorHighlight.render();
		myEditorFocusArea = new YAHOO.widget.SimpleEditor('FocusArea', myConfig);
		myEditorFocusArea.render();
	}
	switch ($("input[name='parentdocsubtype']").val()) {
		case "Controllable Unit":
		case "Country Process":
			myEditorAsmtOtherConsiderations = new YAHOO.widget.SimpleEditor('AsmtOtherConsiderations', myConfig);
			myEditorAsmtOtherConsiderations.render();
			break;
		case "Business Unit":
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
			// Rich text fields for metrics
			var metrics = $("#opMetricIDs").val().split(',');
			var i;
			var vars = {};
			for (i = 0; i < metrics.length; ++i) {
				vars['myEditor'+metrics[i]+'Comment'] = new YAHOO.widget.SimpleEditor(metrics[i]+'Comment', myConfig);
				vars['myEditor'+metrics[i]+'Comment'].render();
			}

			if ($("input[name='enteredbu']").val() == "GTS" && ($("input[name='parentdocsubtype']").val() !== "Global Process")) {
				// CRM rich text fields
				myEditorOverallAssessmentCommentsCRM = new YAHOO.widget.SimpleEditor('OverallAssessmentCommentsCRM', myConfig);
				myEditorOverallAssessmentCommentsCRM.render();
				myEditorKCFRTestingCommentsCRM = new YAHOO.widget.SimpleEditor('KCFRTestingCommentsCRM', myConfig);
				myEditorKCFRTestingCommentsCRM.render();
				myEditorKCOTestingCommentsCRM = new YAHOO.widget.SimpleEditor('KCOTestingCommentsCRM', myConfig);
				myEditorKCOTestingCommentsCRM.render();
				myEditorCorpIACommentsCRM = new YAHOO.widget.SimpleEditor('CorpIACommentsCRM', myConfig);
				myEditorCorpIACommentsCRM.render();
				myEditorMissedRECommentsCRM = new YAHOO.widget.SimpleEditor('MissedRECommentsCRM', myConfig);
				myEditorMissedRECommentsCRM.render();
				myEditorMissedMSACCommentsCRM = new YAHOO.widget.SimpleEditor('MissedMSACCommentsCRM', myConfig);
				myEditorMissedMSACCommentsCRM.render();
				myEditorBoCCommentsCRM = new YAHOO.widget.SimpleEditor('BoCCommentsCRM', myConfig);
				myEditorBoCCommentsCRM.render();
				myEditorPerfOverviewOtherExplanationCRM = new YAHOO.widget.SimpleEditor('PerfOverviewOtherExplanationCRM', myConfig);
				myEditorPerfOverviewOtherExplanationCRM.render();
				myEditorPerfOverviewCriticaExplanationCRM = new YAHOO.widget.SimpleEditor('PerfOverviewCriticaExplanationCRM', myConfig);
				myEditorPerfOverviewCriticaExplanationCRM.render();
				// SOD rich text fields
				myEditorOverallAssessmentCommentsSOD = new YAHOO.widget.SimpleEditor('OverallAssessmentCommentsSOD', myConfig);
				myEditorOverallAssessmentCommentsSOD.render();
				myEditorKCFRTestingCommentsSOD = new YAHOO.widget.SimpleEditor('KCFRTestingCommentsSOD', myConfig);
				myEditorKCFRTestingCommentsSOD.render();
				myEditorKCOTestingCommentsSOD = new YAHOO.widget.SimpleEditor('KCOTestingCommentsSOD', myConfig);
				myEditorKCOTestingCommentsSOD.render();
				myEditorCorpIACommentsSOD = new YAHOO.widget.SimpleEditor('CorpIACommentsSOD', myConfig);
				myEditorCorpIACommentsSOD.render();
				myEditorMissedRECommentsSOD = new YAHOO.widget.SimpleEditor('MissedRECommentsSOD', myConfig);
				myEditorMissedRECommentsSOD.render();
				myEditorMissedMSACCommentsSOD = new YAHOO.widget.SimpleEditor('MissedMSACCommentsSOD', myConfig);
				myEditorMissedMSACCommentsSOD.render();
				myEditorBoCCommentsSOD = new YAHOO.widget.SimpleEditor('BoCCommentsSOD', myConfig);
				myEditorBoCCommentsSOD.render();
				myEditorPerfOverviewOtherExplanationSOD = new YAHOO.widget.SimpleEditor('PerfOverviewOtherExplanationSOD', myConfig);
				myEditorPerfOverviewOtherExplanationSOD.render();
				myEditorPerfOverviewCriticaExplanationSOD = new YAHOO.widget.SimpleEditor('PerfOverviewCriticaExplanationSOD', myConfig);
				myEditorPerfOverviewCriticaExplanationSOD.render();
				// Rich text fields for metrics
				var metrics = $("#opMetricIDsSOD").val().split(',');
				var i;
				var varsSOD = {};
				for (i = 0; i < metrics.length; ++i) {
					varsSOD['myEditor'+metrics[i]+'CommentSOD'] = new YAHOO.widget.SimpleEditor(metrics[i]+'CommentSOD', myConfig);
					varsSOD['myEditor'+metrics[i]+'CommentSOD'].render();
				}
			} else {
				myEditorBoCComments = new YAHOO.widget.SimpleEditor('BoCComments', myConfig);
				myEditorBoCComments.render();
				myEditorPerfOverviewOtherExplanation = new YAHOO.widget.SimpleEditor('PerfOverviewOtherExplanation', myConfig);
				myEditorPerfOverviewOtherExplanation.render();
				myEditorPerfOverviewCriticaExplanation = new YAHOO.widget.SimpleEditor('PerfOverviewCriticaExplanation', myConfig);
				myEditorPerfOverviewCriticaExplanation.render();
			}
			break;
	}
	// --- end of rich text section --- //

});

function hide_divs(){
	$('div#ibm-navigation').hide();
};
