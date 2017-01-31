

$(document).ready(function() {
	
$('#POBUDelivery-link-export').click(function(){
		
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	
		table += $("table#CPCUPerformanceInDelivery_treeview").html();
		
		table += "</table>";

		fnReport($(this), table, "xls", $('span#CPCUPerformanceInDelivery_tittle').text());
	
		
	});
	
$('#POBUDelivery-link-export2').click(function(){
		
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	
		table += $("table#CPCUPerformanceInDelivery_treeview").html();
		
		table += "</table>";
		
		fnReport($(this), table, "ods", $('span#CPCUPerformanceInDelivery_tittle').text());
		
	});
	
	
	$('#POBUCRM-link-export').click(function(){
		
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	
		table += $("table#CPCUPerformanceInCRM_treeview").html();
		
		table += "</table>";

		fnReport($(this), table, "xls", $('span#CPCUPerformanceInCRM_tittle').text());
	
		
	});
	
$('#POBUCRM-link-export2').click(function(){
		
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	
		table += $("table#CPCUPerformanceInCRM_treeview").html();
		
		table += "</table>";
		
		fnReport($(this), table, "ods", $('span#CPCUPerformanceInCRM_tittle').text());
		
	});
	
	
	
	

	$('#POBU-link-export').click(function(){
		
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	
		table += $("table#CPCUPerformanceIn_treeview").html();
		
		table += "</table>";

		fnReport($(this), table, "xls", $('span#CPCUPerformanceIn_tittle').text());
	
		
	});
	
	
	$('#POBU-link-export2').click(function(){
		
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	
		table += $("table#CPCUPerformanceIn_treeview").html();
		
		table += "</table>";
		
		fnReport($(this), table, "ods", $('span#CPCUPerformanceIn_tittle').text());
		
	});
	
	
$('#POBUOTDelivery-link-export').click(function(){
		
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	
		table += $("table#CPCUPerformanceInOtherDelivery_treeview").html();
		
		table += "</table>";

		fnReport($(this), table, "xls", $('span#CPCUPerformanceInOthersDelivery_tittle').text());
	
		
	});
	
	
	$('#POBUOTDelivery-link-export2').click(function(){
		
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	
		table += $("table#CPCUPerformanceInOtherDelivery_treeview").html();
		
		table += "</table>";
		
		fnReport($(this), table, "ods", $('span#CPCUPerformanceInOthersDelivery_tittle').text());
		
	});
	
	
$('#POBUOTCRM-link-export').click(function(){
		
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	
		table += $("table#CPCUPerformanceInOtherCRM_treeview").html();
		
		table += "</table>";

		fnReport($(this), table, "xls", $('span#CPCUPerformanceInOthersCRM_tittle').text());
	
		
	});
	
	
	$('#POBUOTCRM-link-export2').click(function(){
		
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	
		table += $("table#CPCUPerformanceInOtherCRM_treeview").html();
		
		table += "</table>";
		
		fnReport($(this), table, "ods", $('span#CPCUPerformanceInOthersCRM_tittle').text());
		
	});
	
	
$('#POBUOT-link-export').click(function(){
		
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	
		table += $("table#CPCUPerformanceInOther_treeview").html();
		
		table += "</table>";

		fnReport($(this), table, "xls", $('span#CPCUPerformanceInOthers_tittle').text());
	
		
	});
	
	
	$('#POBUOT-link-export2').click(function(){
		
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	
		table += $("table#CPCUPerformanceInOther_treeview").html();
		
		table += "</table>";
		
		fnReport($(this), table, "ods", $('span#CPCUPerformanceInOthers_tittle').text());
		
	});
	
	
	

});