$(document).ready(function() {

	if( $('#CFYes').is(':checked') ) {
		$(".size").show();
	} else {
		if( !$('#AFYes').is(':checked')) {
			$(".size").hide();
		}
	}

	if( $('#AFYes').is(':checked')) {
		$(".size").show();
		$(".internal-audits").show();
	} else {
		$(".internal-audits").hide();
		if( !$('#CFYes').is(':checked')) {
			$(".size").hide();
		}
	}

	$("input[name='AuditableFlag']").click(function(){
		if($('#AFYes').is(':checked')) {
			$(".size").show();
			$(".internal-audits").show();
		} else {
			$(".internal-audits").hide();
			if( !$('#CFYes').is(':checked')) {
				$(".size").hide();
			}
		}
	});

	$("input[name='CUFlag']").click(function(){
		if($('#CFYes').is(':checked')) {
			$(".size").show();
		} else {
			if( !$('#AFYes').is(':checked')) {
				$(".size").hide();
			}
		}
	});

});
