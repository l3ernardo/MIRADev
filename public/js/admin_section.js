$(document).ready(function() {

	if( $('#CFYes').is(':checked') ) {
		$(".size").show();
	} else {
		$(".size").hide();
	}

	if( $('#AFYes').is(':checked')) {
		$(".size").show();
		$(".internal-audits").show();
	} else {
		$(".size").hide();
		$(".internal-audits").hide();
	}

	$("input[name='AuditableFlag']").click(function(){
		if($('#AFYes').is(':checked')) {
			$(".size").show();
			$(".internal-audits").show();
		} else {
			$(".size").hide();
			$(".internal-audits").hide();
		}
	});

	$("input[name='CUFlag']").click(function(){
		if($('#CFYes').is(':checked')) {
			$(".size").show();
		} else {
			$(".size").hide();
		}
	});

});
