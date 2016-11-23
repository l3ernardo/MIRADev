$(document).ready(function() {

	if ($("input[name='PeriodRating']").val() == "Sat") {
		$(".reviewComments").hide();
		$(".target2Sat").hide();
	} else {
		$(".reviewComments").show();
		$(".target2Sat").show();
	}

	// on change events
	$("#PeriodRating").change(function(){
		// $("#PeriodRating").val($("#PeriodRating").val());
		if ($("#PeriodRating").val() == "Sat") {
			$(".reviewComments").hide();
			$(".target2Sat").hide();
		} else {
			if ( $("#PeriodRating").val() == "Marg" || $("#PeriodRating").val() == "Unsat") {
				alert("All mandatory assessments with less than Satisfactory ratings must be supported by the appropriate issue documentation in WWBCIT. All other assessments can be documented in WWBCIT or retained locally. WWBCIT issue documentation includes sample documents, risk evaluations, internal and external audit findings/recommendations.")
			}
			$(".reviewComments").show();
			$(".target2Sat").show();
		}
	});

	$('#Target2Sat').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1,
		onClose: function () {
     $(this).focus();
    }
	});

});
