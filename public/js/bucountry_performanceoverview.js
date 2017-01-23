

$(document).ready(function() {
	

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