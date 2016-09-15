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
		if ($("#PeriodRating").val() == "Sat") {
			$(".reviewComments").hide();
			$(".target2Sat").hide();
		} else {
			$(".reviewComments").show();
			$(".target2Sat").show();
		}
	});


});
