$(document).ready(function() {

	//---Start of Basics of Control Tab---//
	$('#BoCTargetCloseDate1').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1
	});
	$('#BoCTargetCloseDate2').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1
	});
	$('#BoCTargetCloseDate3').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1
	});
	$('#BoCTargetCloseDate4').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1
	});
	$('#BoCTargetCloseDate5').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1
	});

	if( $('#BoCResponse1Yes').is(':checked')) {
		$("#colBoCTargetCloseDate1").hide();
		$("#BoCTargetCloseDate1").val("");
	} else {
		$("#colBoCTargetCloseDate1").show();
	}
	if( $('#BoCResponse2Yes').is(':checked')) {
		$("#colBoCTargetCloseDate2").hide();
		$("#BoCTargetCloseDate2").val("");
	} else {
		$("#colBoCTargetCloseDate2").show();
	}
	if( $('#BoCResponse3Yes').is(':checked')) {
		$("#colBoCTargetCloseDate3").hide();
		$("#BoCTargetCloseDate3").val("");
	} else {
		$("#colBoCTargetCloseDate3").show();
	}
	if( $('#BoCResponse4Yes').is(':checked')) {
		$("#colBoCTargetCloseDate4").hide();
		$("#BoCTargetCloseDate4").val("");
	} else {
		$("#colBoCTargetCloseDate4").show();
	}
	if( $('#BoCResponse5Yes').is(':checked')) {
		$("#colBoCTargetCloseDate5").hide();
		$("#BoCTargetCloseDate5").val("");
	} else {
		$("#colBoCTargetCloseDate5").show();
	}

	//---on change events--//
	$("input[name='BoCResponse1']").click(function(){
		if( $('#BoCResponse1Yes').is(':checked')) {
			$("#BoCTargetCloseDate1").val("");
			$("#colBoCTargetCloseDate1").hide();
		} else {
			$("#colBoCTargetCloseDate1").show();
		}
	});
	$("input[name='BoCResponse2']").click(function(){
		if( $('#BoCResponse2Yes').is(':checked')) {
			$("#colBoCTargetCloseDate2").hide();
			$("#BoCTargetCloseDate2").val("");
		} else {
			$("#colBoCTargetCloseDate2").show();
		}
	});
	$("input[name='BoCResponse3']").click(function(){
		if( $('#BoCResponse3Yes').is(':checked')) {
			$("#colBoCTargetCloseDate3").hide();
			$("#BoCTargetCloseDate3").val("");
		} else {
			$("#colBoCTargetCloseDate3").show();
		}
	});
	$("input[name='BoCResponse4']").click(function(){
		if( $('#BoCResponse4Yes').is(':checked')) {
			$("#colBoCTargetCloseDate4").hide();
			$("#BoCTargetCloseDate4").val("");
		} else {
			$("#colBoCTargetCloseDate4").show();
		}
	});
	$("input[name='BoCResponse5']").click(function(){
		if( $('#BoCResponse5Yes').is(':checked')) {
			$("#colBoCTargetCloseDate5").hide();
			$("#BoCTargetCloseDate5").val("");
		} else {
			$("#colBoCTargetCloseDate5").show();
		}
	});
	//---End of Basics of Control Tab---//

	//---Start of Audit Readiness Assessment---//
	$('#ARALLTarget2Sat').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1
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
	var metrics = $("#opMetricIDs").val().split(',');
	var i;
	for (i = 0; i < metrics.length; ++i) {
		$("#"+metrics[i]+"TargetSatDate").datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1
		});
		if($("#"+metrics[i]+"Rating").val()=="Marg" || $("#"+metrics[i]+"Rating").val()=="Unsat") {
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
	//---on change events--//
	$('#opmetric_content').click(function(){
		metrics = $("#opMetricIDs").val().split(',');
		for (i = 0; i < metrics.length; ++i) {
			$("#"+metrics[i]+"TargetSatDate").datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 1
			});
			if($("#"+metrics[i]+"Rating").val()=="Marg" || $("#"+metrics[i]+"Rating").val()=="Unsat") {
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
	});
	//---End of Operational Metrics---//
});
