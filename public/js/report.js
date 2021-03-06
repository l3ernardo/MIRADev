/*Function to generate dashboard table to export*/
function tableToReport(table, isDatatable, rows){
	var field4rows = $.parseJSON($('textarea#dataForExport').val());
	var table=table;
	var tab_text="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	var line = "";
	var tab = $(table);
	var theader=$('#'+table+' tr:eq(0) th');
	for (c=0;c<theader.length;c++){
		test='#'+table+' tr:eq(0) th:eq('+c+')';
		line=line+"<th>"+$(test).text()+"</th>";
	}
	tab_text=tab_text+line+"</tr>"+"</thead><tbody>";
	//enf od header

		var checkboxes=[];var array2=[]; var aux=0;

			class_name='mira_checkbox_tree';

		if (isDatatable) {
			var name_table='input:checkbox[class='+class_name+']';
			rows.each(function(index) {
				if($('td input[type=checkbox]', index).prop("checked")){
					if (!isNaN($('td input[type=checkbox]', index).prop("value"))) {
						array2.push($('td input[type=checkbox]', index).prop("value"));
					}
				}
			});

		for(j = 0; j<array2.length; j++){
			var index=array2[j];
			var r1 = field4rows[index];
			line="<tr>";

			for(var obj1 in r1){
				var r2 = r1[obj1];
				if(r2 == "undefined"){
					r2="";
				}
				line = line+"<td>"+r2+"</td>";
			} //end for obj1
			tab_text=tab_text+line+"</tr>";
		}
		}else{
			var name_table='input:checkbox[class='+class_name+']';
			$(name_table).each(function(index) {checkboxes.push( this.checked);});
			for (j=1;j<=checkboxes.length;j++){
				if (checkboxes[j] == true){
					array2[aux]=j;
					aux++;
				}
			}

			for(j = 1; j<=array2.length; j++){
				var index=array2[j-1];
				var r1= field4rows[index-1];
				line="<tr>";

				for(var obj1 in r1){
					var r2 = r1[obj1];
					if(r2 == "undefined"){
						r2="";
					}
					line = line+"<td>"+r2+"</td>";
				} //end for obj1
				tab_text=tab_text+line+"</tr>";
			}
		}
	tab_text=tab_text+"</tbody></table>";
	return (tab_text);
}
/*function generateReport(element, typeFile){
	var table="<table border='2px'>";
	if(t!=-1){
		table += $("table#reports_treeview1").html();
	}
	else if(v!=-1){
		table += $("table#reports_treeview2").html();
	}
	else if(y!=-1){
		table += $("table#reports_table2").html();
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
	alert(JSON.stringify(element));
	alert(table);
	//fnReport(element, table, typeFile, $('h1#pageTitle').text());
}*/
$(document).ready(function() {
	t=url.indexOf("reportstaexc");
	v=url.indexOf("reportaudunifile");
	y=url.indexOf("reportcuauditlessons");
	$("#reports_treeview1").treetable({expandable: true });
	$("#reports_treeview2").treetable({expandable: true });
/*
	$('#reports_treeview1').DataTable({
		select: true,
		"paginate": false,
		"scrollX": true,
		//"scrollY": 250,
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
	});*/
	var table;
	table = $('#reports_table').DataTable({
		select: true,
		"scrollX": true,
		"ordering":false
	});
	if(y!=-1){
		table = $('#reports_table2').DataTable({
			select: true,
			"scrollX": true,
			"ordering":false
		});
	}
	var rows = table.rows({ 'search': 'applied' }).nodes();
	$('#lnk_exportxls').click(function(){
		if(t!=-1){
			tableReport = tableToReport('reports_treeview1');
		}
		else if(v!=-1){
			tableReport = tableToReport('reports_treeview2');
		}
		else if(y!=-1){
			rows = table.rows({ 'search': 'applied' }).nodes();
			tableReport = tableToReport('reports_table2',true, rows);
		}
		else{
		rows = table.rows({ 'search': 'applied' }).nodes();
			tableReport = tableToReport('reports_table',true, rows);
		}
		fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
		//generateReport($(this), "xls");
	});
	$('#lnk_exportods').click(function(){
		//generateReport($(this), "ods");
		if(t!=-1){
			tableReport = tableToReport('reports_treeview1');
		}
		else if(v!=-1){
			tableReport = tableToReport('reports_treeview2');
		}
		else if(y!=-1){
			rows = table.rows({ 'search': 'applied' }).nodes();
			tableReport = tableToReport('reports_table2', true, rows);
		}
		else{
			rows = table.rows({ 'search': 'applied' }).nodes();
		tableReport = tableToReport('reports_table', true, rows);
	}
	fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
});
	$("#mira_checkbox_tree").click(function(){
		if(v!=-1 || t!=-1){
			$(".mira_checkbox_tree").prop('checked', $(this).prop('checked'));
		}else{
			rows = table.rows({ 'search': 'applied' }).nodes();
	      // Check/uncheck checkboxes for all rows in the table
	      $('input[type="checkbox"]', rows).prop('checked', this.checked);
		}
	});
});
