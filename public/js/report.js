function generateReport(element, typeFile){
	var table="<table border='2px'>";
	if(t!=-1){
		table += $("table#reports_treeview1").html();
	}
	else if(v!=-1){
		table += $("table#reports_treeview2").html();
	}
	else{
		table += "<thead>";
		var header = $("table#reports_table > thead").html();
		header = header.replace(/height: 0px/g,"height: auto; width: auto;");
		header = header.replace(/<div class="dataTables_sizing" style="height:0;overflow:hidden;">/g,"");
		header = header.replace(/<\/div>/g,"");
		table += header + "</thead><tbody>";
		table += $("table#reports_table > tbody").html();
		table += "</tbody>";
	}
	table += "</table>";
	
	fnReport(element, table, typeFile, $('h1#pageTitle').text());
}
$(document).ready(function() {
	t=url.indexOf("reportstaexc");
	v=url.indexOf("reportaudunifile");
	$("#reports_treeview1").treetable({expandable: true });
	$("#reports_treeview2").treetable({expandable: true });
	
	$('#reports_treeview1').DataTable({
		select: true,
		"paginate": false,
		"scrollX": true,
		"scrollY": 250,
		order: [],
		 columnDefs: [ {
			targets: [0,1,2,3,6,7,8,9],
			orderable: false
		} ]
	});
	$('#reports_treeview2').DataTable({
		select: true,
		"paginate": false,
		"scrollX": true,
		"scrollY": 250,
		"ordering":false        
	});
	$('#reports_table').DataTable({
		select: true,
		"paginate": false,
		"scrollX": true,
		"scrollY": 250,
		"ordering":false
	});
	$('#lnk_exportxls').click(function(){
		generateReport($(this), "xls");
	});
	$('#lnk_exportods').click(function(){
		generateReport($(this), "ods");
	});
	
});