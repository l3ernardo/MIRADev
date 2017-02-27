$(document).ready(function() {

	if( $('#CFYes').is(':checked') ) {
		$(".size").show();
		$(".CUCategory").show();
	} else {
		if( !$('#CFYes').is(':checked')) {
			$(".size").hide();
			$(".CUCategory").hide();
		}
	}

	if( $('#AFYes').is(':checked')) {
		$(".internal-audits").show();
	} else {
		$(".internal-audits").hide();
		if( !$('#AFYes').is(':checked')) {
			$(".internal-audits").hide();
		}
	}

	$("input[name='AuditableFlag']").click(function(){
		if($('#AFYes').is(':checked')) {
			$(".internal-audits").show();
		} else {
			$(".internal-audits").hide();
			if( !$('#AFYes').is(':checked')) {
				$(".internal-audits").hide();
			}
		}
	});

	$("input[name='CUFlag']").click(function(){
		if($('#CFYes').is(':checked')) {
			$(".size").show();
			$(".CUCategory").show();
		} else {
			if( !$('#CFYes').is(':checked')) {
				$(".size").hide();
				$(".CUCategory").hide();
			}
		}
	});

});
