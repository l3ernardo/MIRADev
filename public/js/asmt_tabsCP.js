$(document).ready(function() {
	//---Start of Basics of Control Tab---//

	$('#BoCTargetCloseDate1').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1,
		onClose: function () {
     $(this).focus();
    }
	});
	$('#BoCTargetCloseDate2').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1,
		onClose: function () {
     $(this).focus();
    }
	});
	$('#BoCTargetCloseDate3').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1,
		onClose: function () {
     $(this).focus();
    }
	});
	$('#BoCTargetCloseDate4').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1,
		onClose: function () {
     $(this).focus();
    }
	});
	$('#BoCTargetCloseDate5').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1,
		onClose: function () {
     $(this).focus();
    }
	});
	if ($("input[name='editmode']").val() == "1") {
		$("input[name='BOCExceptionCount']").val(0);
		if( $('#BoCResponse1Yes').is(':checked') ) {
			$("#colBoCTargetCloseDate1").hide();
			$("#BoCTargetCloseDate1").val("");
		} else {
			if ($('#BoCResponse1No').is(':checked')) $("input[name='BOCExceptionCount']").val(1);
			$("#colBoCTargetCloseDate1").show();
		}
		if( $('#BoCResponse2Yes').is(':checked')) {
			$("#colBoCTargetCloseDate2").hide();
			$("#BoCTargetCloseDate2").val("");
		} else {
			if ($('#BoCResponse2No').is(':checked')) $("input[name='BOCExceptionCount']").val(1);
			$("#colBoCTargetCloseDate2").show();
		}
		if( $('#BoCResponse3Yes').is(':checked')) {
			$("#colBoCTargetCloseDate3").hide();
			$("#BoCTargetCloseDate3").val("");
		} else {
			if ($('#BoCResponse3No').is(':checked')) $("input[name='BOCExceptionCount']").val(1);
			$("#colBoCTargetCloseDate3").show();
		}
		if( $('#BoCResponse4Yes').is(':checked')) {
			$("#colBoCTargetCloseDate4").hide();
			$("#BoCTargetCloseDate4").val("");
		} else {
			if ($('#BoCResponse4No').is(':checked')) $("input[name='BOCExceptionCount']").val(1);
			$("#colBoCTargetCloseDate4").show();
		}
		if( $('#BoCResponse5Yes').is(':checked')) {
			$("#colBoCTargetCloseDate5").hide();
			$("#BoCTargetCloseDate5").val("");
		} else {
			if ($('#BoCResponse5No').is(':checked')) $("input[name='BOCExceptionCount']").val(1);
			$("#colBoCTargetCloseDate5").show();
		}
	}
	if ($("input[name='BOCExceptionCount']").val() == "1") $("#compguideboc").html('<p class="ibm-ind-caution mira-alert-sign">&nbsp;</p>');
	else $("#compguideboc").html('<p>&nbsp;</p>');

	if ($("input[name='ORMCMissedRisks']").val() == "1") $("#compguideormc").html('<p class="ibm-ind-caution mira-alert-sign">&nbsp;</p>');
	else $("#compguideormc").html('<p>&nbsp;</p>');

	//---on change events--//
	$("input[name='BoCResponse1']").click(function(){
		if( $('#BoCResponse1Yes').is(':checked')) {
			$("#BoCTargetCloseDate1").val("");
			$("#colBoCTargetCloseDate1").hide();
			if ( $('#BoCResponse2Yes').is(':checked') && $('#BoCResponse3Yes').is(':checked') && $('#BoCResponse4Yes').is(':checked') && $('#BoCResponse5Yes').is(':checked'))
				$("input[name='BOCExceptionCount']").val(0);
		} else {
			$("#colBoCTargetCloseDate1").show();
			if ($('#BoCResponse1No').is(':checked')) $("input[name='BOCExceptionCount']").val(1);
		}
		if ($("input[name='BOCExceptionCount']").val() == 1) $("#compguideboc").html('<p class="ibm-ind-caution mira-alert-sign">&nbsp;</p>');
		else $("#compguideboc").html('<p>&nbsp;</p>');
	});
	$("input[name='BoCResponse2']").click(function(){
		if( $('#BoCResponse2Yes').is(':checked')) {
			$("#colBoCTargetCloseDate2").hide();
			$("#BoCTargetCloseDate2").val("");
			if ( $('#BoCResponse1Yes').is(':checked') && $('#BoCResponse3Yes').is(':checked') && $('#BoCResponse4Yes').is(':checked') && $('#BoCResponse5Yes').is(':checked'))
				$("input[name='BOCExceptionCount']").val(0);
		} else {
			$("#colBoCTargetCloseDate2").show();
			if ($('#BoCResponse2No').is(':checked')) $("input[name='BOCExceptionCount']").val(1);
		}
		if ($("input[name='BOCExceptionCount']").val() == 1) $("#compguideboc").html('<p class="ibm-ind-caution mira-alert-sign">&nbsp;</p>');
		else $("#compguideboc").html('<p>&nbsp;</p>');
	});
	$("input[name='BoCResponse3']").click(function(){
		if( $('#BoCResponse3Yes').is(':checked')) {
			$("#colBoCTargetCloseDate3").hide();
			$("#BoCTargetCloseDate3").val("");
			if ( $('#BoCResponse1Yes').is(':checked') && $('#BoCResponse2Yes').is(':checked') && $('#BoCResponse4Yes').is(':checked') && $('#BoCResponse5Yes').is(':checked'))
				$("input[name='BOCExceptionCount']").val(0);
		} else {
			$("#colBoCTargetCloseDate3").show();
			if ($('#BoCResponse3No').is(':checked')) $("input[name='BOCExceptionCount']").val(1);
		}
		if ($("input[name='BOCExceptionCount']").val() == 1) $("#compguideboc").html('<p class="ibm-ind-caution mira-alert-sign">&nbsp;</p>');
		else $("#compguideboc").html('<p>&nbsp;</p>');
	});
	$("input[name='BoCResponse4']").click(function(){
		if( $('#BoCResponse4Yes').is(':checked')) {
			$("#colBoCTargetCloseDate4").hide();
			$("#BoCTargetCloseDate4").val("");
			if ( $('#BoCResponse1Yes').is(':checked') && $('#BoCResponse2Yes').is(':checked') && $('#BoCResponse3Yes').is(':checked') && $('#BoCResponse5Yes').is(':checked'))
				$("input[name='BOCExceptionCount']").val(0);
		} else {
			$("#colBoCTargetCloseDate4").show();
			if ($('#BoCResponse4No').is(':checked')) $("input[name='BOCExceptionCount']").val(1);
		}
		if ($("input[name='BOCExceptionCount']").val() == 1) $("#compguideboc").html('<p class="ibm-ind-caution mira-alert-sign">&nbsp;</p>');
		else $("#compguideboc").html('<p>&nbsp;</p>');
	});
	$("input[name='BoCResponse5']").click(function(){
		if( $('#BoCResponse5Yes').is(':checked')) {
			$("#colBoCTargetCloseDate5").hide();
			$("#BoCTargetCloseDate5").val("");
			if ( $('#BoCResponse1Yes').is(':checked') && $('#BoCResponse2Yes').is(':checked') && $('#BoCResponse3Yes').is(':checked') && $('#BoCResponse4Yes').is(':checked'))
				$("input[name='BOCExceptionCount']").val(0);
		} else {
			$("#colBoCTargetCloseDate5").show();
			if ($('#BoCResponse5No').is(':checked')) $("input[name='BOCExceptionCount']").val(1);
		}
		if ($("input[name='BOCExceptionCount']").val() == 1) $("#compguideboc").html('<p class="ibm-ind-caution mira-alert-sign">&nbsp;</p>');
		else $("#compguideboc").html('&nbsp;');
	});
	//---End of Basics of Control Tab---//

	//---Start of Audit Readiness Assessment---//
	$('#ARALLTarget2Sat').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1,
		onClose: function () {
     $(this).focus();
    }
	});
	if( $('#ARALLResponseYes').is(':checked')) {
		$("#ARALLQtrRating").show();
	} else {
		$("#ARALLQtrRating").hide();
		$("#ARALLQtrRating").val("");
	}
	if($("#ARALLQtrRating").val()=="Exposures found") {
		$("#colARALLTarget2Sat").show();
	}else{
		$("#colARALLTarget2Sat").hide();
		$("#ARALLTarget2Sat").val("");
	}
	//---on change events--//
	$("input[name='ARALLResponse']").click(function(){
		if( $('#ARALLResponseYes').is(':checked')) {
			$("#ARALLQtrRating").show();
		} else {
			$("#ARALLQtrRating").hide();
			$("#ARALLQtrRating").val("");
		}
	});
	$("#ARALLQtrRating").change(function(){
		if($("#ARALLQtrRating").val()=="Exposures found") {
			$("#colARALLTarget2Sat").show();
		}else{
			$("#colARALLTarget2Sat").hide();
			$("#ARALLTarget2Sat").val("");
		}
	});
	//---End of Audit Readiness Assessment---//

	//---Start of Operational Metrics---//
	// OMKID4 - metric key ID for Delivery
	if ( $("input[name='enteredbu']").val() == "GBS" || ( $("input[name='enteredbu']").val() == "GTS" && $("input[name='opmetrickey']").val() != "OMKID4" ) ) {
		var metrics = $("#opMetricIDs").val().split(',');
		var i;
		for (i = 0; i < metrics.length; ++i) {
			$("#"+metrics[i]+"TargetSatDate").datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 1,
				onClose: function () {
		     $(this).focus();
		    }
			});
			if($("#"+metrics[i]+"Rating").val() == "Marg" || $("#"+metrics[i]+"Rating").val() == "Unsat") {
				$("#colDate"+metrics[i]).show();
				$("#"+metrics[i]+"Finding").show();
				$("#"+metrics[i]+"Action").show();
			}else{
				$("#colDate"+metrics[i]).hide();
				$("#"+metrics[i]+"TargetSatDate").val("");
				if($("#"+metrics[i]+"Rating").val()=="") {
					$("#"+metrics[i]+"Finding").hide();
					$("#"+metrics[i]+"Action").hide();
				} else {
					$("#"+metrics[i]+"Finding").show();
					$("#"+metrics[i]+"Action").show();
				}
			}
		}
	} else {
		if ( $("input[name='enteredbu']").val() == "GTS" && $("input[name='opmetrickey']").val() == "OMKID4" ) {
			$('#OtherMetricDate').datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 1,
				onClose: function () {
		     $(this).focus();
		    }
			});
			if ( $("input[name='OtherMetricRating']").val() == "Marg" || $("input[name='OtherMetricRating']").val() == "Unsat" ) {
				$("#colOtherMetricDate").show();
			} else {
				$("#colOtherMetricDate").hide();
			}
		}
	}
	if ($("#opMetricException").val() == 1) $("#compguideom").html('<p class="ibm-ind-caution mira-alert-sign">&nbsp;</p>');
	else $("#compguideom").html('<p>&nbsp;</p>');

	//---on change events--//
	$('#opmetric_content').click(function(){
		$("#opMetricException").val(0);
		if ( $("input[name='enteredbu']").val() == "GBS" || ( $("input[name='enteredbu']").val() == "GTS" && $("input[name='opmetrickey']").val() != "OMKID4" ) ) {
			metrics = $("#opMetricIDs").val().split(',');
			for (i = 0; i < metrics.length; ++i) {
				$("#"+metrics[i]+"TargetSatDate").datepicker({
					defaultDate: "+1w",
					changeMonth: true,
					numberOfMonths: 1,
					onClose: function () {
			     $(this).focus();
			    }
				});
				if($("#"+metrics[i]+"Rating").val()=="Marg" || $("#"+metrics[i]+"Rating").val()=="Unsat") {
					$("#colDate"+metrics[i]).show();
					$("#"+metrics[i]+"Finding").show();
					$("#"+metrics[i]+"Action").show();
					$("#opMetricException").val(1);
				}else{
					$("#colDate"+metrics[i]).hide();
					$("#"+metrics[i]+"TargetSatDate").val("");
					if($("#"+metrics[i]+"Rating").val()=="") {
						$("#"+metrics[i]+"Finding").hide();
						$("#"+metrics[i]+"Action").hide();
					} else {
						$("#"+metrics[i]+"Finding").show();
						$("#"+metrics[i]+"Action").show();
					}
				}
			}
		} else {
			if ( $("input[name='enteredbu']").val() == "GTS" && $("input[name='opmetrickey']").val() == "OMKID4" ) {
				if($("#OtherMetricRating").val() == "Marg" || $("#OtherMetricRating").val() == "Unsat") {
					$("#colOtherMetricDate").show();
					$("#opMetricException").val(1);
				} else {
					$("#colOtherMetricDate").hide();
					$("#OtherMetricDate").val("");
				}
			}
		}
		if ($("#opMetricException").val() == 1) $("#compguideom").html('<p class="ibm-ind-caution mira-alert-sign">&nbsp;</p>');
		else $("#compguideom").html('<p>&nbsp;</p>');
	});
	//---End of Operational Metrics---//
});
