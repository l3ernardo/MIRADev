$(document).ready(function() {

	if ($("input[name='editmode']").val() == 1) {

		// IOT name change
		$("#iotname").change(function(){
			$("#IOTid").val($(this).val());
			$("#IOT").val($("#iotname option:selected").text());
		});

		// IMT name change
		$("#imtname").change(function(){
			$("#IMTid").val($(this).val());
			$("#IMT").val($("#imtname option:selected").text());
		});

		// Country name change
		$("#countryname").change(function(){
			$("#Countryid").val($(this).val());
			$("#Country").val($("#countryname option:selected").text());
		});

	}

});
