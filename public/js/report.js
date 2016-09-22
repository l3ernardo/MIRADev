$(document).ready(function() {
	$('#reports_table').DataTable({
		select: true,
		"paginate": false,
		"scrollX": true,
		"scrollY": 250,
	});
	$('#lnk_exportxls').click(function(){
		var table="<table border='2px'>"
		table += $("table#reports_table").html();
		table += "</table>"
		fnReport($(this), table, "xls", $('h1#pageTitle').text());
	});
	$('#lnk_exportods').click(function(){
		var table="<table border='2px'>"
		table += $("table#reports_table").html();
		table += "</table>"
		fnReport($(this), table, "ods", $('h1#pageTitle').text());
	});
});
