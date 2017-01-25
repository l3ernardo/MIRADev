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

	/*$('#RCTestData_table').DataTable({
		"scrollY":        "200px",
		"scrollCollapse": true,
		"paging":         false
	});*/

	//Code for Edit button
	$('#btn_edit').click(function() {
		window.location.href = "assessment?id=" + $("input[name='docid']").val() + "&edit";
	});
	//Code for Cancel button
	$('#btn_cancel').click(function() {
		window.location.href = $("li#breadcrumb > a").attr("href");
	});

	//Code for field validation     // jesus
	$('#btn_validate').click(function() {
		//window.location.href = $().
		validation();
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
				if (metrics != '') {
					var i;
					for (i = 0; i < metrics.length; ++i) {
						vars['myEditor'+metrics[i]+'Comment'].saveHTML();
						YmyEditor = vars['myEditor'+metrics[i]+'Comment'].get('element').value;
						$('#'+metrics[i]+'Comment').val(YmyEditor);
					}
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
					if (metricsSOD != '') {
						var i;
						for (i = 0; i < metricsSOD.length; ++i) {
							varsSOD['myEditor'+metricsSOD[i]+'CommentSOD'].saveHTML();
							YmyEditor = varsSOD['myEditor'+metricsSOD[i]+'CommentSOD'].get('element').value;
							$('#'+metricsSOD[i]+'CommentSOD').val(YmyEditor);
						}
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
		// call field validation for assessments
		if(valid_asmt()) {
       //submit the form
       		$("#assessment").submit();
    	} else {
       		evt.preventDefault();
   		 }
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
				if (metrics != '') {
					var i;
					for (i = 0; i < metrics.length; ++i) {
						vars['myEditor'+metrics[i]+'Comment'].saveHTML();
						YmyEditor = vars['myEditor'+metrics[i]+'Comment'].get('element').value;
						$('#'+metrics[i]+'Comment').val(YmyEditor);
					}
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
					if (metricsSOD != '') {
						var i;
						for (i = 0; i < metricsSOD.length; ++i) {
							varsSOD['myEditor'+metricsSOD[i]+'CommentSOD'].saveHTML();
							YmyEditor = varsSOD['myEditor'+metricsSOD[i]+'CommentSOD'].get('element').value;
							$('#'+metricsSOD[i]+'CommentSOD').val(YmyEditor);
						}
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
		if(valid_asmt()) {
       //submit the form
       		$("#assessment").submit();
    	} else {
       		evt.preventDefault();
   		 }
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
	myEditor.on('editorKeyUp',function(){counter(myEditor)},myEditor,true);
	myEditor.on('editorKeyPress',function(){counter(myEditor)},myEditor,true);
	myEditor.on('editorMouseUp',function(){counter(myEditor)},myEditor,true);
	myEditor.on('editorContentLoaded',function(){counter(myEditor)},myEditor,true);
	myEditorRatingSummary = new YAHOO.widget.SimpleEditor('RatingSummary', myConfig);
	myEditorRatingSummary.render();
	myEditorRatingSummary.on('editorKeyUp',function(){counter(myEditorRatingSummary)},myEditorRatingSummary,true);
	myEditorRatingSummary.on('editorKeyPress',function(){counter(myEditorRatingSummary)},myEditorRatingSummary,true);
	myEditorRatingSummary.on('editorMouseUp',function(){counter(myEditorRatingSummary)},myEditorRatingSummary,true);
	myEditorRatingSummary.on('editorContentLoaded',function(){counter(myEditorRatingSummary)},myEditorRatingSummary,true);
	if ( $("input[name='enteredbu']").val() == "GTS" ) {
		if ($("input[name='parentdocsubtype']").val() == "BU Reporting Group" || $("input[name='parentdocsubtype']").val() == "BU Country" || $("input[name='parentdocsubtype']").val() == "BU IMT" || $("input[name='parentdocsubtype']").val() == "BU IOT" || $("input[name='parentdocsubtype']").val() == "Business Unit") {
			myEditorHighlightCRM = new YAHOO.widget.SimpleEditor('HighlightCRM', myConfig);
			myEditorHighlightCRM.render();
			myEditorHighlightCRM.on('editorKeyUp',function(){counter(myEditorHighlightCRM)},myEditorHighlightCRM,true);
			myEditorHighlightCRM.on('editorKeyPress',function(){counter(myEditorHighlightCRM)},myEditorHighlightCRM,true);
			myEditorHighlightCRM.on('editorMouseUp',function(){counter(myEditorHighlightCRM)},myEditorHighlightCRM,true);
			myEditorHighlightCRM.on('editorKeyPress',function(){counter(myEditorHighlightCRM)},myEditorHighlightCRM,true);
			myEditor.on('editorContentLoaded',function(){counter(myEditor)},myEditor,true);
			myEditorFocusAreaCRM = new YAHOO.widget.SimpleEditor('FocusAreaCRM', myConfig);
			myEditorFocusAreaCRM.render();
			myEditorFocusAreaCRM.on('editorKeyUp',function(){counter(myEditorFocusAreaCRM)},myEditorFocusAreaCRM,true);
			myEditorFocusAreaCRM.on('editorKeyPress',function(){counter(myEditorFocusAreaCRM)},myEditorFocusAreaCRM,true);
			myEditorFocusAreaCRM.on('editorMouseUp',function(){counter(myEditorFocusAreaCRM)},myEditorFocusAreaCRM,true);
			myEditorFocusAreaCRM.on('editorContentLoaded',function(){counter(myEditorFocusAreaCRM)},myEditorFocusAreaCRM,true);
			myEditorHighlightSOD = new YAHOO.widget.SimpleEditor('HighlightSOD', myConfig);
			myEditorHighlightSOD.render();
			myEditorHighlightSOD.on('editorKeyUp',function(){counter(myEditorHighlightSOD)},myEditorHighlightSOD,true);
			myEditorHighlightSOD.on('editorKeyPress',function(){counter(myEditorHighlightSOD)},myEditorHighlightSOD,true);
			myEditorHighlightSOD.on('editorMouseUp',function(){counter(myEditorHighlightSOD)},myEditorHighlightSOD,true);
			myEditorHighlightSOD.on('editorContentLoaded',function(){counter(myEditorHighlightSOD)},myEditorHighlightSOD,true);
			myEditorFocusAreaSOD = new YAHOO.widget.SimpleEditor('FocusAreaSOD', myConfig);
			myEditorFocusAreaSOD.render();
			myEditorFocusAreaSOD.on('editorKeyUp',function(){counter(myEditorFocusAreaSOD)},myEditorFocusAreaSOD,true);
			myEditorFocusAreaSOD.on('editorKeyPress',function(){counter(myEditorFocusAreaSOD)},myEditorFocusAreaSOD,true);
			myEditorFocusAreaSOD.on('editorMouseUp',function(){counter(myEditorFocusAreaSOD)},myEditorFocusAreaSOD,true);
			myEditorFocusAreaSOD.on('editorContentLoaded',function(){counter(myEditorFocusAreaSOD)},myEditorFocusAreaSOD,true);
		} else {
			myEditorHighlight = new YAHOO.widget.SimpleEditor('Highlight', myConfig);
			myEditorHighlight.render();
			myEditorHighlight.on('editorKeyUp',function(){counter(myEditorHighlight)},myEditorHighlight,true);
			myEditorHighlight.on('editorKeyPress',function(){counter(myEditorHighlight)},myEditorHighlight,true);
			myEditorHighlight.on('editorMouseUp',function(){counter(myEditorHighlight)},myEditorHighlight,true);
			myEditorHighlight.on('editorContentLoaded',function(){counter(myEditorHighlight)},myEditorHighlight,true);
			myEditorFocusArea = new YAHOO.widget.SimpleEditor('FocusArea', myConfig);
			myEditorFocusArea.render();
			myEditorFocusArea.on('editorKeyUp',function(){counter(myEditorFocusArea)},myEditorFocusArea,true);
			myEditorFocusArea.on('editorKeyPress',function(){counter(myEditorFocusArea)},myEditorFocusArea,true);
			myEditorFocusArea.on('editorMouseUp',function(){counter(myEditorFocusArea)},myEditorFocusArea,true);
			myEditorFocusArea.on('editorContentLoaded',function(){counter(myEditorFocusArea)},myEditorFocusArea,true);
		}
	} else {
		myEditorHighlight = new YAHOO.widget.SimpleEditor('Highlight', myConfig);
		myEditorHighlight.render();
		myEditorHighlight.on('editorKeyUp',function(){counter(myEditorHighlight)},myEditorHighlight,true);
		myEditorHighlight.on('editorKeyPress',function(){counter(myEditorHighlight)},myEditorHighlight,true);
		myEditorHighlight.on('editorMouseUp',function(){counter(myEditorHighlight)},myEditorHighlight,true);
		myEditorHighlight.on('editorContentLoaded',function(){counter(myEditorHighlight)},myEditorHighlight,true);
		myEditorFocusArea = new YAHOO.widget.SimpleEditor('FocusArea', myConfig);
		myEditorFocusArea.render();
		myEditorFocusArea.on('editorKeyUp',function(){counter(myEditorFocusArea)},myEditorFocusArea,true);
		myEditorFocusArea.on('editorKeyPress',function(){counter(myEditorFocusArea)},myEditorFocusArea,true);
		myEditorFocusArea.on('editorMouseUp',function(){counter(myEditorFocusArea)},myEditorFocusArea,true);
		myEditorFocusArea.on('editorContentLoaded',function(){counter(myEditorFocusArea)},myEditorFocusArea,true);
	}
	switch ($("input[name='parentdocsubtype']").val()) {
		case "Controllable Unit":
		case "Country Process":
			myEditorAsmtOtherConsiderations = new YAHOO.widget.SimpleEditor('AsmtOtherConsiderations', myConfig);
			myEditorAsmtOtherConsiderations.render();
			myEditorAsmtOtherConsiderations.on('editorKeyPress',function(){counter(myEditorAsmtOtherConsiderations)},myEditorAsmtOtherConsiderations,true);
			break;
		case "Business Unit":
		case "BU Reporting Group":
		case "BU IOT":
		case "BU IMT":
		case "BU Country":
		case "Global Process":
			myEditorOverallAssessmentComments = new YAHOO.widget.SimpleEditor('OverallAssessmentComments', myConfig);
			myEditorOverallAssessmentComments.render();
			myEditorOverallAssessmentComments.on('editorKeyUp',function(){counter(myEditorOverallAssessmentComments)},myEditorOverallAssessmentComments,true);
			myEditorOverallAssessmentComments.on('editorKeyPress',function(){counter(myEditorOverallAssessmentComments)},myEditorOverallAssessmentComments,true);
			myEditorOverallAssessmentComments.on('editorMouseUp',function(){counter(myEditorOverallAssessmentComments)},myEditorOverallAssessmentComments,true);
			myEditorOverallAssessmentComments.on('editorContentLoaded',function(){counter(myEditorOverallAssessmentComments)},myEditorOverallAssessmentComments,true);
			myEditorKCFRTestingComments = new YAHOO.widget.SimpleEditor('KCFRTestingComments', myConfig);
			myEditorKCFRTestingComments.render();
			myEditorKCFRTestingComments.on('editorKeyUp',function(){counter(myEditorKCFRTestingComments)},myEditorKCFRTestingComments,true);
			myEditorKCFRTestingComments.on('editorKeyPress',function(){counter(myEditorKCFRTestingComments)},myEditorKCFRTestingComments,true);
			myEditorKCFRTestingComments.on('editorMouseUp',function(){counter(myEditorKCFRTestingComments)},myEditorKCFRTestingComments,true);
			myEditorKCFRTestingComments.on('editorContentLoaded',function(){counter(myEditorKCFRTestingComments)},myEditorKCFRTestingComments,true);
			myEditorKCOTestingComments = new YAHOO.widget.SimpleEditor('KCOTestingComments', myConfig);
			myEditorKCOTestingComments.render();
			myEditorKCOTestingComments.on('editorKeyUp',function(){counter(myEditorKCOTestingComments)},myEditorKCOTestingComments,true);
			myEditorKCOTestingComments.on('editorKeyPress',function(){counter(myEditorKCOTestingComments)},myEditorKCOTestingComments,true);
			myEditorKCOTestingComments.on('editorMouseUp',function(){counter(myEditorKCOTestingComments)},myEditorKCOTestingComments,true);
			myEditorKCOTestingComments.on('editorContentLoaded',function(){counter(myEditorKCOTestingComments)},myEditorKCOTestingComments,true);
			myEditorCorpIAComments = new YAHOO.widget.SimpleEditor('CorpIAComments', myConfig);
			myEditorCorpIAComments.render();
			myEditorCorpIAComments.on('editorKeyUp',function(){counter(myEditorCorpIAComments)},myEditorCorpIAComments,true);
			myEditorCorpIAComments.on('editorKeyPress',function(){counter(myEditorCorpIAComments)},myEditorCorpIAComments,true);
			myEditorCorpIAComments.on('editorMouseUp',function(){counter(myEditorCorpIAComments)},myEditorCorpIAComments,true);
			myEditorCorpIAComments.on('editorContentLoaded',function(){counter(myEditorCorpIAComments)},myEditorCorpIAComments,true);
			myEditorMissedREComments = new YAHOO.widget.SimpleEditor('MissedREComments', myConfig);
			myEditorMissedREComments.render();
			myEditorMissedREComments.on('editorKeyUp',function(){counter(myEditorMissedREComments)},myEditorMissedREComments,true);
			myEditorMissedREComments.on('editorKeyPress',function(){counter(myEditorMissedREComments)},myEditorMissedREComments,true);
			myEditorMissedREComments.on('editorMouseUp',function(){counter(myEditorMissedREComments)},myEditorMissedREComments,true);
			myEditorMissedREComments.on('editorContentLoaded',function(){counter(myEditorMissedREComments)},myEditorMissedREComments,true);
			myEditorMissedMSACComments = new YAHOO.widget.SimpleEditor('MissedMSACComments', myConfig);
			myEditorMissedMSACComments.render();
			myEditorMissedMSACComments.on('editorKeyUp',function(){counter(myEditorMissedMSACComments)},myEditorMissedMSACComments,true);
			myEditorMissedMSACComments.on('editorKeyPress',function(){counter(myEditorMissedMSACComments)},myEditorMissedMSACComments,true);
			myEditorMissedMSACComments.on('editorMouseUp',function(){counter(myEditorMissedMSACComments)},myEditorMissedMSACComments,true);
			myEditorMissedMSACComments.on('editorContentLoaded',function(){counter(myEditorMissedMSACComments)},myEditorMissedMSACComments,true);
			// Rich text fields for metrics
			var metrics = $("#opMetricIDs").val().split(',');
			var i;
			var vars = {};
			for (i = 0; i < metrics.length; ++i) {
				vars['myEditor'+metrics[i]+'Comment'] = new YAHOO.widget.SimpleEditor(metrics[i]+'Comment', myConfig);
				vars['myEditor'+metrics[i]+'Comment'].render();
				vars['myEditor'+metrics[i]+'Comment'].on('editorKeyUp',function(){counter(vars['myEditor'+metrics[i]+'Comment'])},vars['myEditor'+metrics[i]+'Comment'],true);
				vars['myEditor'+metrics[i]+'Comment'].on('editorKeyPress',function(){counter(vars['myEditor'+metrics[i]+'Comment'])},vars['myEditor'+metrics[i]+'Comment'],true);
				vars['myEditor'+metrics[i]+'Comment'].on('editorMouseUp',function(){counter(vars['myEditor'+metrics[i]+'Comment'])},vars['myEditor'+metrics[i]+'Comment'],true);
				vars['myEditor'+metrics[i]+'Comment'].on('editorContentLoaded',function(){counter(vars['myEditor'+metrics[i]+'Comment'])},vars['myEditor'+metrics[i]+'Comment'],true);
			}

			if ($("input[name='enteredbu']").val() == "GTS" && ($("input[name='parentdocsubtype']").val() !== "Global Process")) {
				// CRM rich text fields
				myEditorOverallAssessmentCommentsCRM = new YAHOO.widget.SimpleEditor('OverallAssessmentCommentsCRM', myConfig);
				myEditorOverallAssessmentCommentsCRM.render();
				myEditorOverallAssessmentCommentsCRM.on('editorKeyUp',function(){counter(myEditorOverallAssessmentCommentsCRM)},myEditorOverallAssessmentCommentsCRM,true);
				myEditorOverallAssessmentCommentsCRM.on('editorKeyPress',function(){counter(myEditorOverallAssessmentCommentsCRM)},myEditorOverallAssessmentCommentsCRM,true);
				myEditorOverallAssessmentCommentsCRM.on('editorMouseUp',function(){counter(myEditorOverallAssessmentCommentsCRM)},myEditorOverallAssessmentCommentsCRM,true);
				myEditorOverallAssessmentCommentsCRM.on('editorContentLoaded',function(){counter(myEditorOverallAssessmentCommentsCRM)},myEditorOverallAssessmentCommentsCRM,true);
				myEditorKCFRTestingCommentsCRM = new YAHOO.widget.SimpleEditor('KCFRTestingCommentsCRM', myConfig);
				myEditorKCFRTestingCommentsCRM.render();
				myEditorKCFRTestingCommentsCRM.on('editorKeyUp',function(){counter(myEditorKCFRTestingCommentsCRM)},myEditorKCFRTestingCommentsCRM,true);
				myEditorKCFRTestingCommentsCRM.on('editorKeyPress',function(){counter(myEditorKCFRTestingCommentsCRM)},myEditorKCFRTestingCommentsCRM,true);
				myEditorKCFRTestingCommentsCRM.on('editorMouseUp',function(){counter(myEditorKCFRTestingCommentsCRM)},myEditorKCFRTestingCommentsCRM,true);
				myEditorKCFRTestingCommentsCRM.on('editorContentLoaded',function(){counter(myEditorKCFRTestingCommentsCRM)},myEditorKCFRTestingCommentsCRM,true);
				myEditorKCOTestingCommentsCRM = new YAHOO.widget.SimpleEditor('KCOTestingCommentsCRM', myConfig);
				myEditorKCOTestingCommentsCRM.render();
				myEditorKCOTestingCommentsCRM.on('editorKeyUp',function(){counter(myEditorKCOTestingCommentsCRM)},myEditorKCOTestingCommentsCRM,true);
				myEditorKCOTestingCommentsCRM.on('editorKeyPress',function(){counter(myEditorKCOTestingCommentsCRM)},myEditorKCOTestingCommentsCRM,true);
				myEditorKCOTestingCommentsCRM.on('editorMouseUp',function(){counter(myEditorKCOTestingCommentsCRM)},myEditorKCOTestingCommentsCRM,true);
				myEditorKCOTestingCommentsCRM.on('editorContentLoaded',function(){counter(myEditorKCOTestingCommentsCRM)},myEditorKCOTestingCommentsCRM,true);
				myEditorCorpIACommentsCRM = new YAHOO.widget.SimpleEditor('CorpIACommentsCRM', myConfig);
				myEditorCorpIACommentsCRM.render();
				myEditorCorpIACommentsCRM.on('editorKeyUp',function(){counter(myEditorCorpIACommentsCRM)},myEditorCorpIACommentsCRM,true);
				myEditorCorpIACommentsCRM.on('editorKeyPress',function(){counter(myEditorCorpIACommentsCRM)},myEditorCorpIACommentsCRM,true);
				myEditorCorpIACommentsCRM.on('editorMouseUp',function(){counter(myEditorCorpIACommentsCRM)},myEditorCorpIACommentsCRM,true);
				myEditorCorpIACommentsCRM.on('editorContentLoaded',function(){counter(myEditorCorpIACommentsCRM)},myEditorCorpIACommentsCRM,true);
				myEditorMissedRECommentsCRM = new YAHOO.widget.SimpleEditor('MissedRECommentsCRM', myConfig);
				myEditorMissedRECommentsCRM.render();
				myEditorMissedRECommentsCRM.on('editorKeyUp',function(){counter(myEditorMissedRECommentsCRM)},myEditorMissedRECommentsCRM,true);
				myEditorMissedRECommentsCRM.on('editorKeyPress',function(){counter(myEditorMissedRECommentsCRM)},myEditorMissedRECommentsCRM,true);
				myEditorMissedRECommentsCRM.on('editorMouseUp',function(){counter(myEditorMissedRECommentsCRM)},myEditorMissedRECommentsCRM,true);
				myEditorMissedRECommentsCRM.on('editorContentLoaded',function(){counter(myEditorMissedRECommentsCRM)},myEditorMissedRECommentsCRM,true);
				myEditorMissedMSACCommentsCRM = new YAHOO.widget.SimpleEditor('MissedMSACCommentsCRM', myConfig);
				myEditorMissedMSACCommentsCRM.render();
				myEditorMissedMSACCommentsCRM.on('editorKeyUp',function(){counter(myEditorMissedMSACCommentsCRM)},myEditorMissedMSACCommentsCRM,true);
				myEditorMissedMSACCommentsCRM.on('editorKeyPress',function(){counter(myEditorMissedMSACCommentsCRM)},myEditorMissedMSACCommentsCRM,true);
				myEditorMissedMSACCommentsCRM.on('editorMouseUp',function(){counter(myEditorMissedMSACCommentsCRM)},myEditorMissedMSACCommentsCRM,true);
				myEditorMissedMSACCommentsCRM.on('editorContentLoaded',function(){counter(myEditorMissedMSACCommentsCRM)},myEditorMissedMSACCommentsCRM,true);
				myEditorBoCCommentsCRM = new YAHOO.widget.SimpleEditor('BoCCommentsCRM', myConfig);
				myEditorBoCCommentsCRM.render();
				myEditorBoCCommentsCRM.on('editorKeyUp',function(){counter(myEditorBoCCommentsCRM)},myEditorBoCCommentsCRM,true);
				myEditorBoCCommentsCRM.on('editorKeyPress',function(){counter(myEditorBoCCommentsCRM)},myEditorBoCCommentsCRM,true);
				myEditorBoCCommentsCRM.on('editorMouseUp',function(){counter(myEditorBoCCommentsCRM)},myEditorBoCCommentsCRM,true);
				myEditorBoCCommentsCRM.on('editorContentLoaded',function(){counter(myEditorBoCCommentsCRM)},myEditorBoCCommentsCRM,true);
				myEditorPerfOverviewOtherExplanationCRM = new YAHOO.widget.SimpleEditor('PerfOverviewOtherExplanationCRM', myConfig);
				myEditorPerfOverviewOtherExplanationCRM.render();
				myEditorPerfOverviewOtherExplanationCRM.on('editorKeyUp',function(){counter(myEditorPerfOverviewOtherExplanationCRM)},myEditorPerfOverviewOtherExplanationCRM,true);
				myEditorPerfOverviewOtherExplanationCRM.on('editorKeyPress',function(){counter(myEditorPerfOverviewOtherExplanationCRM)},myEditorPerfOverviewOtherExplanationCRM,true);
				myEditorPerfOverviewOtherExplanationCRM.on('editorMouseUp',function(){counter(myEditorPerfOverviewOtherExplanationCRM)},myEditorPerfOverviewOtherExplanationCRM,true);
				myEditorPerfOverviewOtherExplanationCRM.on('editorContentLoaded',function(){counter(myEditorPerfOverviewOtherExplanationCRM)},myEditorPerfOverviewOtherExplanationCRM,true);
				myEditorPerfOverviewCriticaExplanationCRM = new YAHOO.widget.SimpleEditor('PerfOverviewCriticaExplanationCRM', myConfig);
				myEditorPerfOverviewCriticaExplanationCRM.render();
				myEditorPerfOverviewCriticaExplanationCRM.on('editorKeyUp',function(){counter(myEditorPerfOverviewCriticaExplanationCRM)},myEditorPerfOverviewCriticaExplanationCRM,true);myEditorPerfOverviewCriticaExplanationCRM.on('editorKeyPress',function(){counter(myEditorPerfOverviewCriticaExplanationCRM)},myEditorPerfOverviewCriticaExplanationCRM,true);myEditorPerfOverviewCriticaExplanationCRM.on('editorMouseUp',function(){counter(myEditorPerfOverviewCriticaExplanationCRM)},myEditorPerfOverviewCriticaExplanationCRM,true);myEditorPerfOverviewCriticaExplanationCRM.on('editorContentLoaded',function(){counter(myEditorPerfOverviewCriticaExplanationCRM)},myEditorPerfOverviewCriticaExplanationCRM,true);
				// SOD rich text fields
				myEditorOverallAssessmentCommentsSOD = new YAHOO.widget.SimpleEditor('OverallAssessmentCommentsSOD', myConfig);
				myEditorOverallAssessmentCommentsSOD.render();
				myEditorOverallAssessmentCommentsSOD.on('editorKeyUp',function(){counter(myEditorOverallAssessmentCommentsSOD)},myEditorOverallAssessmentCommentsSOD,true);
				myEditorOverallAssessmentCommentsSOD.on('editorKeyPress',function(){counter(myEditorOverallAssessmentCommentsSOD)},myEditorOverallAssessmentCommentsSOD,true);
				myEditorOverallAssessmentCommentsSOD.on('editorMouseUp',function(){counter(myEditorOverallAssessmentCommentsSOD)},myEditorOverallAssessmentCommentsSOD,true);
				myEditorOverallAssessmentCommentsSOD.on('editorContentLoaded',function(){counter(myEditorOverallAssessmentCommentsSOD)},myEditorOverallAssessmentCommentsSOD,true);
				myEditorKCFRTestingCommentsSOD = new YAHOO.widget.SimpleEditor('KCFRTestingCommentsSOD', myConfig);
				myEditorKCFRTestingCommentsSOD.render();
				myEditorKCFRTestingCommentsSOD.on('editorKeyUp',function(){counter(myEditorKCFRTestingCommentsSOD)},myEditorKCFRTestingCommentsSOD,true);
				myEditorKCFRTestingCommentsSOD.on('editorKeyPress',function(){counter(myEditorKCFRTestingCommentsSOD)},myEditorKCFRTestingCommentsSOD,true);
				myEditorKCFRTestingCommentsSOD.on('editorMouseUp',function(){counter(myEditorKCFRTestingCommentsSOD)},myEditorKCFRTestingCommentsSOD,true);
				myEditorKCFRTestingCommentsSOD.on('editorContentLoaded',function(){counter(myEditorKCFRTestingCommentsSOD)},myEditorKCFRTestingCommentsSOD,true);
				myEditorKCOTestingCommentsSOD = new YAHOO.widget.SimpleEditor('KCOTestingCommentsSOD', myConfig);
				myEditorKCOTestingCommentsSOD.render();
				myEditorKCOTestingCommentsSOD.on('editorKeyUp',function(){counter(myEditorKCOTestingCommentsSOD)},myEditorKCOTestingCommentsSOD,true);
				myEditorKCOTestingCommentsSOD.on('editorKeyPress',function(){counter(myEditorKCOTestingCommentsSOD)},myEditorKCOTestingCommentsSOD,true);
				myEditorKCOTestingCommentsSOD.on('editorMouseUp',function(){counter(myEditorKCOTestingCommentsSOD)},myEditorKCOTestingCommentsSOD,true);
				myEditorKCOTestingCommentsSOD.on('editorContentLoaded',function(){counter(myEditorKCOTestingCommentsSOD)},myEditorKCOTestingCommentsSOD,true);
				myEditorCorpIACommentsSOD = new YAHOO.widget.SimpleEditor('CorpIACommentsSOD', myConfig);
				myEditorCorpIACommentsSOD.render();
				myEditorCorpIACommentsSOD.on('editorKeyUp',function(){counter(myEditorCorpIACommentsSOD)},myEditorCorpIACommentsSOD,true);
				myEditorCorpIACommentsSOD.on('editorKeyPress',function(){counter(myEditorCorpIACommentsSOD)},myEditorCorpIACommentsSOD,true);
				myEditorCorpIACommentsSOD.on('editorMouseUp',function(){counter(myEditorCorpIACommentsSOD)},myEditorCorpIACommentsSOD,true);
				myEditorCorpIACommentsSOD.on('editorContentLoaded',function(){counter(myEditorCorpIACommentsSOD)},myEditorCorpIACommentsSOD,true);
				myEditorMissedRECommentsSOD = new YAHOO.widget.SimpleEditor('MissedRECommentsSOD', myConfig);
				myEditorMissedRECommentsSOD.render();
				myEditorMissedRECommentsSOD.on('editorKeyUp',function(){counter(myEditorMissedRECommentsSOD)},myEditorMissedRECommentsSOD,true);
				myEditorMissedRECommentsSOD.on('editorKeyPress',function(){counter(myEditorMissedRECommentsSOD)},myEditorMissedRECommentsSOD,true);
				myEditorMissedRECommentsSOD.on('editorMouseUp',function(){counter(myEditorMissedRECommentsSOD)},myEditorMissedRECommentsSOD,true);
				myEditorMissedRECommentsSOD.on('editorContentLoaded',function(){counter(myEditorMissedRECommentsSOD)},myEditorMissedRECommentsSOD,true);
				myEditorMissedMSACCommentsSOD = new YAHOO.widget.SimpleEditor('MissedMSACCommentsSOD', myConfig);
				myEditorMissedMSACCommentsSOD.render();
				myEditorMissedMSACCommentsSOD.on('editorKeyUp',function(){counter(myEditorMissedMSACCommentsSOD)},myEditorMissedMSACCommentsSOD,true);
				myEditorMissedMSACCommentsSOD.on('editorKeyPress',function(){counter(myEditorMissedMSACCommentsSOD)},myEditorMissedMSACCommentsSOD,true);
				myEditorMissedMSACCommentsSOD.on('editorMouseUp',function(){counter(myEditorMissedMSACCommentsSOD)},myEditorMissedMSACCommentsSOD,true);
				myEditorMissedMSACCommentsSOD.on('editorContentLoaded',function(){counter(myEditorMissedMSACCommentsSOD)},myEditorMissedMSACCommentsSOD,true);
				myEditorBoCCommentsSOD = new YAHOO.widget.SimpleEditor('BoCCommentsSOD', myConfig);
				myEditorBoCCommentsSOD.render();
				myEditorBoCCommentsSOD.on('editorKeyUp',function(){counter(myEditorBoCCommentsSOD)},myEditorBoCCommentsSOD,true);
				myEditorBoCCommentsSOD.on('editorKeyPress',function(){counter(myEditorBoCCommentsSOD)},myEditorBoCCommentsSOD,true);
				myEditorBoCCommentsSOD.on('editorMouseUp',function(){counter(myEditorBoCCommentsSOD)},myEditorBoCCommentsSOD,true);
				myEditorBoCCommentsSOD.on('editorContentLoaded',function(){counter(myEditorBoCCommentsSOD)},myEditorBoCCommentsSOD,true);
				myEditorPerfOverviewOtherExplanationSOD = new YAHOO.widget.SimpleEditor('PerfOverviewOtherExplanationSOD', myConfig);
				myEditorPerfOverviewOtherExplanationSOD.render();
				myEditorPerfOverviewOtherExplanationSOD.on('editorKeyUp',function(){counter(myEditorPerfOverviewOtherExplanationSOD)},myEditorPerfOverviewOtherExplanationSOD,true);
				myEditorPerfOverviewOtherExplanationSOD.on('editorKeyPress',function(){counter(myEditorPerfOverviewOtherExplanationSOD)},myEditorPerfOverviewOtherExplanationSOD,true);
				myEditorPerfOverviewOtherExplanationSOD.on('editorMouseUp',function(){counter(myEditorPerfOverviewOtherExplanationSOD)},myEditorPerfOverviewOtherExplanationSOD,true);
				myEditorPerfOverviewOtherExplanationSOD.on('editorContentLoaded',function(){counter(myEditorPerfOverviewOtherExplanationSOD)},myEditorPerfOverviewOtherExplanationSOD,true);
				myEditorPerfOverviewCriticaExplanationSOD = new YAHOO.widget.SimpleEditor('PerfOverviewCriticaExplanationSOD', myConfig);
				myEditorPerfOverviewCriticaExplanationSOD.render();
				myEditorPerfOverviewCriticaExplanationSOD.on('editorKeyUp',function(){counter(myEditorPerfOverviewCriticaExplanationSOD)},myEditorPerfOverviewCriticaExplanationSOD,true);
				myEditorPerfOverviewCriticaExplanationSOD.on('editorKeyPress',function(){counter(myEditorPerfOverviewCriticaExplanationSOD)},myEditorPerfOverviewCriticaExplanationSOD,true);
				myEditorPerfOverviewCriticaExplanationSOD.on('editorMouseUp',function(){counter(myEditorPerfOverviewCriticaExplanationSOD)},myEditorPerfOverviewCriticaExplanationSOD,true);
				myEditorPerfOverviewCriticaExplanationSOD.on('editorContentLoaded',function(){counter(myEditorPerfOverviewCriticaExplanationSOD)},myEditorPerfOverviewCriticaExplanationSOD,true);
				// Rich text fields for metrics
				var metrics = $("#opMetricIDsSOD").val().split(',');
				var i;
				var varsSOD = {};
				for (i = 0; i < metrics.length; ++i) {
					varsSOD['myEditor'+metrics[i]+'CommentSOD'] = new YAHOO.widget.SimpleEditor(metrics[i]+'CommentSOD', myConfig);
					varsSOD['myEditor'+metrics[i]+'CommentSOD'].render();
					varsSOD['myEditor'+metrics[i]+'CommentSOD'].on('editorKeyUp',function(){counter(varsSOD['myEditor'+metrics[i]+'CommentSOD'])},varsSOD['myEditor'+metrics[i]+'CommentSOD'],true);
					varsSOD['myEditor'+metrics[i]+'CommentSOD'].on('editorKeyPress',function(){counter(varsSOD['myEditor'+metrics[i]+'CommentSOD'])},varsSOD['myEditor'+metrics[i]+'CommentSOD'],true);
					varsSOD['myEditor'+metrics[i]+'CommentSOD'].on('editorMouseUp',function(){counter(varsSOD['myEditor'+metrics[i]+'CommentSOD'])},varsSOD['myEditor'+metrics[i]+'CommentSOD'],true);
					varsSOD['myEditor'+metrics[i]+'CommentSOD'].on('editorContentLoaded',function(){counter(varsSOD['myEditor'+metrics[i]+'CommentSOD'])},varsSOD['myEditor'+metrics[i]+'CommentSOD'],true);
				}
			} else {
				myEditorBoCComments = new YAHOO.widget.SimpleEditor('BoCComments', myConfig);
				myEditorBoCComments.render();
				myEditorBoCComments.on('editorKeyUp',function(){counter(myEditorBoCComments)},myEditorBoCComments,true);
				myEditorBoCComments.on('editorKeyPress',function(){counter(myEditorBoCComments)},myEditorBoCComments,true);
				myEditorBoCComments.on('editorMouseUp',function(){counter(myEditorBoCComments)},myEditorBoCComments,true);
				myEditorBoCComments.on('editorContentLoaded',function(){counter(myEditorBoCComments)},myEditorBoCComments,true);
				myEditorPerfOverviewOtherExplanation = new YAHOO.widget.SimpleEditor('PerfOverviewOtherExplanation', myConfig);
				myEditorPerfOverviewOtherExplanation.render();
				myEditorPerfOverviewOtherExplanation.on('editorKeyUp',function(){counter(myEditorPerfOverviewOtherExplanation)},myEditorPerfOverviewOtherExplanation,true);
				myEditorPerfOverviewOtherExplanation.on('editorKeyPress',function(){counter(myEditorPerfOverviewOtherExplanation)},myEditorPerfOverviewOtherExplanation,true);
				myEditorPerfOverviewOtherExplanation.on('editorMouseUp',function(){counter(myEditorPerfOverviewOtherExplanation)},myEditorPerfOverviewOtherExplanation,true);
				myEditorPerfOverviewOtherExplanation.on('editorContentLoaded',function(){counter(myEditorPerfOverviewOtherExplanation)},myEditorPerfOverviewOtherExplanation,true);
				myEditorPerfOverviewCriticaExplanation = new YAHOO.widget.SimpleEditor('PerfOverviewCriticaExplanation', myConfig);
				myEditorPerfOverviewCriticaExplanation.render();
				myEditorPerfOverviewCriticaExplanation.on('editorKeyUp',function(){counter(myEditorPerfOverviewCriticaExplanation)},myEditorPerfOverviewCriticaExplanation,true);
				myEditorPerfOverviewCriticaExplanation.on('editorKeyPress',function(){counter(myEditorPerfOverviewCriticaExplanation)},myEditorPerfOverviewCriticaExplanation,true);
				myEditorPerfOverviewCriticaExplanation.on('editorMouseUp',function(){counter(myEditorPerfOverviewCriticaExplanation)},myEditorPerfOverviewCriticaExplanation,true);
				myEditorPerfOverviewCriticaExplanation.on('editorContentLoaded',function(){counter(myEditorPerfOverviewCriticaExplanation)},myEditorPerfOverviewCriticaExplanation,true);
			}
			break;
	}
	// --- end of rich text section --- //

});

function hide_divs(){
	$('div#ibm-navigation').hide();
};

//Field validation for assessment.
function valid_asmt() {
	var req_flds = "";
	if ($("#MIRAStatus").val() == "Final" && ($("#PeriodRating").val() == "NR" || $("#PeriodRating").val() == "Pending")) {
			alert("Holistic Rating is require.");
			$('#PeriodRating').focus();
			return false;
	}
		switch ($("input[name='parentdocsubtype']").val()) {
			case "Business Unit":
				if (($("#MIRAStatus").val() == "Final" && ($("#PeriodRating").val() == "Marg" || $("#PeriodRating").val() == "Unsat")) && $("input[name='Target2Sat']").val() == "") {
				req_flds = req_flds + "  - Target to Sat\n";
					alert("Fields with (*) are required!\n" + req_flds);
					$('#Target2Sat').focus();
					return false;
				}
				break;
			case "BU IOT":
				if (($("#MIRAStatus").val() == "Final" && ($("#PeriodRating").val() == "Marg" || $("#PeriodRating").val() == "Unsat")) && $("input[name='Target2Sat']").val() == "") {
				req_flds = req_flds + "  - Target to Sat\n";
					alert("Fields with (*) are required!\n" + req_flds);
					$('#Target2Sat').focus();
					return false;
				}
				break;
			case "BU IMT":
				if (($("#MIRAStatus").val() == "Final" && ($("#PeriodRating").val() == "Marg" || $("#PeriodRating").val() == "Unsat")) && $("input[name='Target2Sat']").val() == "") {
				req_flds = req_flds + "  - Target to Sat\n";
					alert("Fields with (*) are required!\n" + req_flds);
					$('#Target2Sat').focus();
					return false;
				}
				break;
			case "BU Country":
				if (($("#MIRAStatus").val() == "Final" && ($("#PeriodRating").val() == "Marg" || $("#PeriodRating").val() == "Unsat")) && $("input[name='Target2Sat']").val() == "") {
				req_flds = req_flds + "  - Target to Sat\n";
					alert("Fields with (*) are required!\n" + req_flds);
					$('#Target2Sat').focus();
					return false;
				}
				break;
			case "Controllable Unit":
				if (($("#MIRAStatus").val() == "Final" && ($("#PeriodRating").val() == "Marg" || $("#PeriodRating").val() == "Unsat")) && $("input[name='Target2Sat']").val() == "") {
				req_flds = req_flds + "  - Target to Sat\n";
					alert("Fields with (*) are required!\n" + req_flds);
					$('#Target2Sat').focus();
					return false;
				}
				break;
			case "BU Reporting Group":
				if (($("#MIRAStatus").val() == "Final" && ($("#PeriodRating").val() == "Marg" || $("#PeriodRating").val() == "Unsat")) && $("input[name='Target2Sat']").val() == "") {
				req_flds = req_flds + "  - Target to Sat\n";
					alert("Fields with (*) are required!\n" + req_flds);
					$('#Target2Sat').focus();
					return false;
				}
				break;
			case "Account":
				if (($("#MIRAStatus").val() == "Final" && ($("#PeriodRating").val() == "Marg" || $("#PeriodRating").val() == "Unsat")) && $("input[name='Target2Sat']").val() == "") {
				req_flds = req_flds + "  - Target to Sat\n";
					alert("Fields with (*) are required!\n" + req_flds);
					$('#Target2Sat').focus();
					return false;
				}
				break;
			case "Global Process":
				if (($("#MIRAStatus").val() == "Final" && ($("#PeriodRating").val() == "Marg" || $("#PeriodRating").val() == "Unsat")) && $("input[name='Target2Sat']").val() == "") {
				req_flds = req_flds + "  - Target to Sat\n";
					alert("Fields with (*) are required!\n" + req_flds);
					$('#Target2Sat').focus();
					return false;
				}
				break;
			case "Country Process":
				if (($("#MIRAStatus").val() == "Final" && ($("#PeriodRating").val() == "Marg" || $("#PeriodRating").val() == "Unsat")) && $("input[name='Target2Sat']").val() == "") {
				req_flds = req_flds + "  - Target to Sat\n";
					alert("Fields with (*) are required!\n" + req_flds);
					$('#Target2Sat').focus();
					return false;
				}
				break;
		}
		return true;
}

//character counter
function counter(name) {
  var string1=name.toString(),
  i=string1.indexOf("#")+1,
  f=string1.indexOf('_');
  use=string1.substring(i,f),
  html = name.saveHTML();
  data2= html.replace(/<\S[^><]*>/g, ''),
  data3= data2.replace(/&nbsp;/g,' ');
  charCount = ((data3.length) ? data3.length : 0),
  ndiv= "<div id='"+use+"_Char"+"'><span title='"+use+"_Char"+"'>Chars:"+charCount+"</span></div>",
  $newdiv1 =ndiv,
  rdiv="#"+use+"_Char",
  $(rdiv).remove(),
  rdiv2="#"+use+"_container";
  $(rdiv2).append($newdiv1);
};



//  Validation for the validation button
	function validation(){
	$('#validationmsg').focus();
	var req_flds = "";
	var frm = $("input[name='DocType']").val()

if (frm == "Assessment") {  // check if document ype = assessment.
	if ($("#PeriodRating").val() == "NR" || $("#PeriodRating").val() == "Pending") {
			//alert("Holistic Rating is require.");
			$("#validationmsg").text("");
			$("#validationmsg").append("<li>Rating field is require.</li>");
			$('#PeriodRating').focus();
			return false;
	}
if (($("#MIRAStatus").val() == "Draft" && ($("#PeriodRating").val() == "Marg" || $("#PeriodRating").val() == "Unsat")) && $("input[name='Target2Sat']").val() == "") {
	//req_flds = req_flds + "  - Target to Sat\n";
		//alert("Fields with (*) are required!\n" + req_flds);
		$("#validationmsg").text("");
		$("#validationmsg").append("<li>Target to Sat field is required.</li>");
		$('#Target2Sat').focus();
		return false;
}

// Basic of Control field validation.
		if (!$("#BoCResponse1Yes").is(':checked') && !$("#BoCResponse1No").is(':checked')){
				$("#validationmsg").text("");
				//$("#validationmsg").append('<li><span>Require entries on the Tab Basic of Controls (Row1) are incomplete. Click OK to continue checking.</span></li>');
					$("#validationmsg").append('<li class="valimesg">Require entries on the Tab Basics of Controls (Row1) are incomplete.<a class="validmsg">Click Here.</a></li>');
						$(".validmsg").on("click", function( e ) {
       						e.preventDefault();
       							$('#BoCResponse1Yes').focus();
    					});

				return false;
		}else{
			if ($('#BoCResponse1No').is(':checked')) {
				if (!$("#BoCTargetCloseDate1").val()) {
					$("#validationmsg").text("");
					//$("#validationmsg").append('<li><span>Target to close date (row 1) is require. Click OK to continue checking.</span></li>');
					//$('#BoCTargetCloseDate1').focus();
					$("#validationmsg").append('<li class="valimesg">Target to close date (row 1) is require.<a class="validmsg">Click Here.</a></li>');
						$(".validmsg").on("click", function( e ) {
       						e.preventDefault();
       							$('#BoCTargetCloseDate1').focus();
    					});
					return false;
				 }else{
					if (!$("#BoCComments1").val()) {
						$("#validationmsg").text("");
						//$("#validationmsg").append('<li><span>Comments (row 1) is require. Click OK to continue checking.</span></li>');
						//$("#BoCComments1").focus();
						$("#validationmsg").append('<li class="valimesg">Comments (row 1) is require.<a class="validmsg">Click Here.</a></li>');
							$(".validmsg").on("click", function( e ) {
       							e.preventDefault();
       								$('#BoCComments1').focus();
    					});
						 return false;
					}
				}
			}
		}
		if (!$("#BoCResponse2Yes").is(':checked') && !$("#BoCResponse2No").is(':checked')){
				$("#validationmsg").text("");
				$("#validationmsg").append('<li class="valimesg">Require entries on the Tab Basics of Controls (Row2) are incomplete.<a class="validmsg">Click Here.</a></li>');
						$(".validmsg").on("click", function( e ) {
       						e.preventDefault();
       							$('#BoCResponse2Yes').focus();
    					});
					return false;
		}else{
			if ($('#BoCResponse2No').is(':checked')) {
			 	if (!$("#BoCTargetCloseDate2").val()) {
					$("#validationmsg").text("");
					$("#validationmsg").append('<li class="valimesg">Target to close date (row 2) is require.<a class="validmsg">Click Here.</a></li>');
						$(".validmsg").on("click", function( e ) {
       						e.preventDefault();
       							$('#BoCTargetCloseDate2').focus();
    					});

					return false;
				}else{
					if (!$("#BoCComments2").val()) {
						$("#validationmsg").text("");
						$("#validationmsg").append('<li class="valimesg">Comments (row 2) is require.<a class="validmsg">Click Here.</a></li>');
							$(".validmsg").on("click", function( e ) {
       							e.preventDefault();
       								$('#BoCComments2').focus();
    					});
						return false;
					}
				}
		   	}
		}
		if (!$("#BoCResponse3Yes").is(':checked') && !$("#BoCResponse3No").is(':checked')){
		   	$("#validationmsg").text("");
				$("#validationmsg").append('<li class="valimesg">Require entries on the Tab Basics of Controls (Row3) are incomplete.<a class="validmsg">Click Here.</a></li>');
						$(".validmsg").on("click", function( e ) {
       						e.preventDefault();
       							$('#BoCResponse3Yes').focus();
    					});
				return false;
		}else{
			if ($('#BoCResponse3No').is(':checked')) {
				if (!$("#BoCTargetCloseDate3").val()) {
					$("#validationmsg").text("");
					$("#validationmsg").append('<li class="valimesg">Target to close date (row 3) is require.<a class="validmsg">Click Here.</a></li>');
						$(".validmsg").on("click", function( e ) {
       						e.preventDefault();
       							$('#BoCTargetCloseDate3').focus();
    					});
					return false;
			    }else{
					if (!$("#BoCComments3").val()) {
						$("#validationmsg").text("");
						$("#validationmsg").append('<li class="valimesg">Comments (row 3) is require.<a class="validmsg">Click Here.</a></li>');
							$(".validmsg").on("click", function( e ) {
       							e.preventDefault();
       								$('#BoCComments3').focus();
    					});
					}
				}
			}
		}
		if (!$("#BoCResponse4Yes").is(':checked') && !$("#BoCResponse4No").is(':checked')){
			  $("#validationmsg").text("");
				$("#validationmsg").append('<li class="valimesg">Require entries on the Tab Basics of Controls (Row4) are incomplete.<a class="validmsg">Click Here.</a></li>');
						$(".validmsg").on("click", function( e ) {
       						e.preventDefault();
       							$('#BoCResponse4Yes').focus();
    					});
					return false;
		}else{
			if ($('#BoCResponse4No').is(':checked')) {
			  if (!$("#BoCTargetCloseDate4").val()) {
					$("#validationmsg").text("");
					$("#validationmsg").append('<li class="valimesg">Target to close date (row 4) is require.<a class="validmsg">Click Here.</a></li>');
						$(".validmsg").on("click", function( e ) {
       						e.preventDefault();
       							$('#BoCTargetCloseDate4').focus();
    					});
					return false;
				}else{
					if (!$("#BoCComments4").val()) {
						$("#validationmsg").text("");
						$("#validationmsg").append('<li class="valimesg">Comments (row 4) is require.<a class="validmsg">Click Here.</a></li>');
							$(".validmsg").on("click", function( e ) {
       							e.preventDefault();
       								$('#BoCComments4').focus();
    					});
						return false;
					}
				}
			}
		}
		if (!$("#BoCResponse5Yes").is(':checked') && !$("#BoCResponse5No").is(':checked')){
				$("#validationmsg").text("");
				$("#validationmsg").append('<li class="valimesg">Require entries on the Tab Basics of Controls (Row5) are incomplete.<a class="validmsg">Click Here.</a></li>');
						$(".validmsg").on("click", function( e ) {
       						e.preventDefault();
       							$('#BoCResponse5Yes').focus();
    					});
					return false;
		}else{
			if ($('#BoCResponse5No').is(':checked')) {
				if (!$("#BoCTargetCloseDate5").val()) {
					$("#validationmsg").text("");
					$("#validationmsg").append('<li class="valimesg">Target to close date (row 5) is require.<a class="validmsg">Click Here.</a></li>');
						$(".validmsg").on("click", function( e ) {
       						e.preventDefault();
       							$('#BoCTargetCloseDate5').focus();
    					});
					return false;
				} else {
					if (!$("#BoCComments5").val()) {
						$("#validationmsg").text("");
						$("#validationmsg").append('<li class="valimesg">Comments (row 5) is require.<a class="validmsg">Click Here.</a></li>');
							$(".validmsg").on("click", function( e ) {
       							e.preventDefault();
       								$('#BoCComments5').focus();
    					});
						return false;
					}
				}
			}
		}

//Operational Metrics Table.

//Access Mgmt
	if ( $( "#OMID1Rating" ).length ) {
		console.log("entrou");
		if (!$('#OMID1Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on the Access Mgmt.</li>");
				$('#OMID1Rating').focus();
					return false;
			} else {
				if ($('#OMID1Rating').val() =='Marg' || $('#OMID1Rating').val() =='Unsat') {
					  if (!$("#OMID1TargetSatDate").val()) {
						//alert("Tab Operational Metrics: Target to Sat is required. Click OK to continue checking.");
						$("#validationmsg").text("");
						//$("#validationmsg").append("<li>Tab Operational Metrics: Target to Sat is required.</li>");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID1TargetSatDate').focus();
    							});
							return false;
				}else{
					if (!$("#OMID1Finding").val()) {
							//alert("Tab Operational Metrics: Finding is required. Click OK to continue checking.");
							$("#validationmsg").text("");
            				//$("#validationmsg").append("<a href="#pliip">Tab Operational Metrics: Finding is required.</a>");
            				$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID1Finding').focus();
    							});
							return false;
					} else {
						if (!$("#OMID1Action").val()) {
							 //alert("Tab Operational Metrics: Action is required. Click OK to continue checking.");
							 $("#validationmsg").text("");
							// $("#validationmsg").append("<li>Tab Operational Metrics: Action is required.</li>");
							 //$('#OMID1Action').focus();
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID1Action').focus();
    							});
							 return false;
						}
					}
				}
			}
		}
	}
//Audit Lessons Learned
if ( $( "#OMID2Rating" ).length ) {
		if (!$('#OMID2Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on the Audit Lessons Learned.</li>");
				$('#OMID2Rating').focus();
					return false;
			} else {
				if ($('#OMID2Rating').val() =='Marg' || $('#OMID2Rating').val() =='Unsat') {
				  if (!$("#OMID2TargetSatDate").val()) {
						//alert("Tab Operational Metrics: Target to Sat is required. Click OK to continue checking.");
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID2TargetSatDate').focus();
    							});
						 return false;
				} else {
					if (!$("#OMID2Finding").val()) {
						//alert("Tab Operational Metrics: Finding is required. Click OK to continue checking.");
						 $("#validationmsg").text("");
						    $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID2Finding').focus();
    							});
						  return false;
					} else {
						if (!$("#OMID2Action").val()) {
							//alert("Tab Operational Metrics: Action is required. Click OK to continue checking.");
							$("#validationmsg").text("");
							$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID2Action').focus();
    							});
							  return false;
						}
					}
				}
			}
		}
	}
//Completion of Mandatory Data Privacy Training
	if ( $( "#OMID3Rating" ).length ) {
		if (!$('#OMID3Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on Completion of Mandatory Data Privacy Training.</li>");
					$('#OMID3Rating').focus();
					return false;
			} else {
				if ($('#OMID3Rating').val() =='Marg' || $('#OMID3Rating').val() =='Unsat') {
				  if (!$("#OMID3TargetSatDate").val()) {
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID3TargetSatDate').focus();
    							});
						return false;
				} else {
					if (!$("#OMID3Finding").val()) {
						 $("#validationmsg").text("");
						    $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID3Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID3Action").val()) {
							 $("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID3Action').focus();
    							});
							 return false;
						}
					}
				}
			}
		}
	}
//Current Asset Inventory
	if ( $( "#OMID4Rating" ).length ) {
		if (!$('#OMID4Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on Current Asset Inventory.</li>");
					$('#OMID4Rating').focus();
					return false;
			} else {
				if ($('#OMID4Rating').val() =='Marg' || $('#OMID4Rating').val() =='Unsat') {
				  if (!$("#OMID4TargetSatDate").val()) {
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID4TargetSatDate').focus();
    							});
						return false;
				} else {
					if (!$("#OMID4Finding").val()) {
						 $("#validationmsg").text("");
						    $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID1Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID4Action").val()) {
							 $("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID4Action').focus();
    							});
							 return false;
						}
					}
				}
			}
		}
	}
//DS&P Overall Rating
	if ( $( "#OMID5Rating" ).length ) {
		if (!$('#OMID5Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on DS&P Overall Rating.</li>");
				$('#OMID5Rating').focus();
					return false;
			} else {
				if ($('#OMID5Rating').val() =='Marg' || $('#OMID5Rating').val() =='Unsat') {
					$("#validationmsg").text("");
					  if (!$("#OMID5TargetSatDate").val()) {
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID5TargetSatDate').focus();
    							});
							return false;
				} else {
					if (!$("#OMID5Finding").val()) {
						$("#validationmsg").text("");
						$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID5Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID5Action").val()) {
							$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID5Action').focus();
    							});
							 return false;
						}
					}
				}
			}
		}
	}
//IES Recertifications
	if ( $( "#OMID6Rating" ).length ) {
		if (!$('#OMID6Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on IES Recertifications.</li>");
				$('#OMID6Rating').focus();
					return false;
			} else {
				if ($('#OMID6Rating').val() =='Marg' || $('#OMID6Rating').val() =='Unsat') {
				  if (!$("#OMID6TargetSatDate").val()) {
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID6TargetSatDate').focus();
    							});
						return false;
				} else {
					if (!$("#OMID6Finding").val()) {
						 $("#validationmsg").text("");
						    $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID6Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID6Action").val()) {
							 $("#validationmsg").text("");
							 	$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
									$(".validmsg").on("click", function( e ) {
       									e.preventDefault();
       										$('#OMID6Action').focus();
    								});
							 return false;
						}
					}
				}
			}
		}
	}
//Labour Claiming
	if ( $( "#OMID7Rating" ).length ) {
		if (!$('#OMID7Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on Labour Claiming.</li>");
				$('#OMID7Rating').focus();
					return false;
			} else {
				if ($('#OMID7Rating').val() =='Marg' || $('#OMID7Rating').val() =='Unsat') {
				  if (!$("#OMID7TargetSatDate").val()) {
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID7TargetSatDate').focus();
    							});
						return false;
				} else {
					if (!$("#OMID7Finding").val()) {
						 $("#validationmsg").text("");
						             				$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID7Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID7Action").val()) {
							 $("#validationmsg").text("");
							  	$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
									$(".validmsg").on("click", function( e ) {
       									e.preventDefault();
       										$('#OMID7Action').focus();
    								});
							 return false;
						}
					}
				}
			}
		}
	}
//Proactive Reviews
	if ( $( "#OMID10Rating" ).length ) {
		if (!$('#OMID10Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on Proactive Reviews.</li>");
				$('#OMID10Rating').focus();
					return false;
			} else {
				if ($('#OMID10Rating').val() =='Marg' || $('#OMID10Rating').val() =='Unsat') {
				  if (!$("#OMID10TargetSatDate").val()) {
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID10TargetSatDate').focus();
    							});
						return false;
				} else {
					if (!$("#OMID10Finding").val()) {
						 $("#validationmsg").text("");
						             				$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID10Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID10Action").val()) {
							 $("#validationmsg").text("");
							 	$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
									$(".validmsg").on("click", function( e ) {
       									e.preventDefault();
       										$('#OMID10Action').focus();
    								});
							 return false;
						}
					}
				}
			}
		}
	}
//Procurement Bypass (YTD)
	if ( $( "#OMID11Rating" ).length ) {
		if (!$('#OMID11Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on Procurement Bypass.</li>");
				$('#OMID11Rating').focus();
					return false;
			} else {
				if ($('#OMID11Rating').val() =='Marg' || $('#OMID11Rating').val() =='Unsat') {
				  if (!$("#OMID11TargetSatDate").val()) {
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID11TargetSatDate').focus();
    							});
						return false;
				} else {
					if (!$("#OMID11Finding").val()) {
						 $("#validationmsg").text("");
						    $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       										$('#OMID11Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID11Action").val()) {
							 $("#validationmsg").text("");
							 	$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
									$(".validmsg").on("click", function( e ) {
       									e.preventDefault();
       										$('#OMID11Action').focus();
    								});
							 return false;
						}
					}
				}
			}
		}
	}
// SOD
	if ( $( "#OMID12Rating" ).length ) {
		if (!$('#OMID12Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on SOD.</li>");
				$('#OMID12Rating').focus();
					return false;
			} else {
				if ($('#OMID12Rating').val() =='Marg' || $('#OMID12Rating').val() =='Unsat') {
				  if (!$("#OMID12TargetSatDate").val()) {
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID12TargetSatDate').focus();
    							});
						return false;
				} else {
					if (!$("#OMID12Finding").val()) {
						 $("#validationmsg").text("");
						 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       										$('#OMID12Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID12Action").val()) {
							 $("#validationmsg").text("");
							 	$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
									$(".validmsg").on("click", function( e ) {
       									e.preventDefault();
       										$('#OMID12Action').focus();
    								});
							 return false;
						}
					}
				}
			}
		}
	}
//Unauth. Pricing Commitments (UPC)
	if ( $( "#OMID13Rating" ).length ) {
		if (!$('#OMID13Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on Unauth. Pricing Commitments.</li>");
				$('#OMID13Rating').focus();
					return false;
			} else {
				if ($('#OMID13Rating').val() =='Marg' || $('#OMID13Rating').val() =='Unsat') {
				  if (!$("#OMID13TargetSatDate").val()) {
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID13TargetSatDate').focus();
    							});
						return false;
				} else {
					if (!$("#OMID13Finding").val()) {
						 $("#validationmsg").text("");
						 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       										$('#OMID13Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID13Action").val()) {
							 $("#validationmsg").text("");
							 	$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
									$(".validmsg").on("click", function( e ) {
       									e.preventDefault();
       										$('#OMID13ction').focus();
    								});
							 return false;
						}
					}
				}
			}
		}
	}
//Work @ Risk (Pre-Contract Work)
	if ( $( "#OMID14Rating" ).length ) {
		if (!$('#OMID14Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on Work @ Risk .</li>");
				$('#OMID14Rating').focus();
					return false;
			} else {
				if ($('#OMID14Rating').val() =='Marg' || $('#OMID14Rating').val() =='Unsat') {
				  if (!$("#OMID14TargetSatDate").val()) {
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID14TargetSatDate').focus();
    							});
						return false;
				} else {
					if (!$("#OMID14Finding").val()) {
						 $("#validationmsg").text("");
						 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       										$('#OMID14Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID14Action").val()) {
							 $("#validationmsg").text("");
							 	$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
									$(".validmsg").on("click", function( e ) {
       									e.preventDefault();
       										$('#OMID14Action').focus();
    								});
							 return false;
						}
					}
				}
			}
		}
	}
//Workplace Security - Violations
	if ( $( "#OMID16Rating" ).length ) {
		if (!$('#OMID16Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on Workplace Security.</li>");
				$('#OMID16Rating').focus();
					return false;
			} else {
				if ($('#OMID16Rating').val() =='Marg' || $('#OMID16Rating').val() =='Unsat') {
				  if (!$("#OMID16TargetSatDate").val()) {
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID16TargetSatDate').focus();
    							});
						return false;
				} else {
					if (!$("#OMID16Finding").val()) {
						 $("#validationmsg").text("");
						 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       										$('#OMID16Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID16Action").val()) {
							 $("#validationmsg").text("");
							 	$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
									$(".validmsg").on("click", function( e ) {
       									e.preventDefault();
       										$('#OMID16Action').focus();
    								});
							 return false;
						}
					}
				}
			}
		}
	}
//Workplace Security - Disciplinary Action
	if ( $( "#OMID15Rating" ).length ) {
		if (!$('#OMID15Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on Workplace Security.</li>");
				$('#OMID15Rating').focus();
					return false;
			} else {
				if ($('#OMID15Rating').val() =='Marg' || $('#OMID15Rating').val() =='Unsat') {
				  if (!$("#OMID15TargetSatDate").val()) {
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID15TargetSatDate').focus();
    							});
						return false;
				} else {
					if (!$("#OMID15Finding").val()) {
						 $("#validationmsg").text("");
						 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       										$('#OMID15Finding').focus();
    							});
						 return false;
					} else{
						if (!$("#OMID15Action").val()) {
							 $("#validationmsg").text("");
							 	$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
									$(".validmsg").on("click", function( e ) {
       									e.preventDefault();
       										$('#OMID15Action').focus();
    								});
							 return false;
						}
					}
				}
			}
		}
	}
//Workstation Security - WST
	if ( $( "#OMID17Rating" ).length ) {
		if (!$('#OMID17Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on Workstation Security.</li>");
				$('#OMID17Rating').focus();
					return false;
			}else{
				if ($('#OMID17Rating').val() =='Marg' || $('#OMID17Rating').val() =='Unsat') {
					if (!$("#OMID17TargetSatDate").val()) {
							$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID17TargetSatDate').focus();
    							});
							return false;
				}else{
					if (!$("#OMID17Finding").val()) {
						 $("#validationmsg").text("");
						 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       										$('#OMID17Finding').focus();
    							});
						 return false;
					}else{
					   if (!$("#OMID17Action").val()) {
							 $("#validationmsg").text("");
							 	$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
									$(".validmsg").on("click", function( e ) {
       									e.preventDefault();
       										$('#OMID17Action').focus();
    								});
							 return false;
						}
					}
				}
			}
		}
	}
//Number DP Incidents
	if ( $( "#OMID8Rating" ).length ) {
		if (!$('#OMID8Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on Number DP Incidents.</li>");
				$('#OMID8Rating').focus();
					return false;
			} else {
				if ($('#OMID8Rating').val() =='Marg' || $('#OMID8Rating').val() =='Unsat') {
					  if (!$("#OMID8TargetSatDate").val()) {
							$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID8TargetSatDate').focus();
    							});
							return false;
				} else {
					if (!$("#OMID8Finding").val()) {
						 $("#validationmsg").text("");
						 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       										$('#OMID8Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID8Action").val()) {
							 $("#validationmsg").text("");
							 	$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
									$(".validmsg").on("click", function( e ) {
       									e.preventDefault();
       										$('#OMID8Action').focus();
    								});
							 return false;
						}
					}
				}
			}
		}
	}
//Other Metrics
	if ( $( "#OMID9Rating" ).length ) {
		if (!$('#OMID9Rating').val()) {
				//alert("Tab Operational Metrics: Require entries on the Tab Operational Metrics are Incomplete. Click OK to continue checking.");
				$("#validationmsg").text("");
				$("#validationmsg").append("<li>Tab Operational Metrics: Require entries on Other Metrics.</li>");
				$('#OMID9Rating').focus();
					return false;
			} else {
				if ($('#OMID9Rating').val() =='Marg' || $('#OMID9Rating').val() =='Unsat') {
				  if (!$("#OMID9TargetSatDate").val()) {
						$("#validationmsg").text("");
							 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Target to Sat is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       									$('#OMID9TargetSatDate').focus();
    							});
						return false;
				} else {
					if (!$("#OMID9Finding").val()) {
						 $("#validationmsg").text("");
						 $("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Finding is required.<a class="validmsg">Click Here.</a></li>');
								$(".validmsg").on("click", function( e ) {
       								e.preventDefault();
       										$('#OMID9Finding').focus();
    							});
						 return false;
					} else {
						if (!$("#OMID9Action").val()) {
							 $("#validationmsg").text("");
							 	$("#validationmsg").append('<li class="valimesg">Tab Operational Metrics: Action is required.<a class="validmsg">Click Here.</a></li>');
									$(".validmsg").on("click", function( e ) {
       									e.preventDefault();
       										$('#OMID9Action').focus();
    								});
							 return false;
						}
					}
				}
			}
		}
	}
		alert("Field validation passed.");
		return true;
	}
} // end form
