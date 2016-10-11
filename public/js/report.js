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
		//"ordering":false,
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
		var table="<table border='2px'>";
		if(t!=-1){
		    table += $("table#reports_treeview").html();
	    }
		else if(v!=-1){
		    table += $("table#reports_treeview2").html();
	    }
		else{
		     table += $("table#reports_table").html();
		}
		table += "</table>";
		fnReport($(this), table, "xls", $('h1#pageTitle').text());
	});
	$('#lnk_exportods').click(function(){
		var table="<table border='2px'>";
		if(t!=-1){
		    table += $("table#reports_treeview").html();
	    }
		else if(v!=-1){
		    table += $("table#reports_treeview2").html();
	    }
		else{
		     table += $("table#reports_table").html();
		}
		table += "</table>";
		fnReport($(this), table, "ods", $('h1#pageTitle').text());
	});
});
