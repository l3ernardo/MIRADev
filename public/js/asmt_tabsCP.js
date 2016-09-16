$(document).ready(function() {

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

});
