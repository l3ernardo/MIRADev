function tableToReport(table){

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

	for(j = 0; j<field4rows.length; j++){
		var r1 = field4rows[j];
		line="<tr>";
		line = line+"<td>"+r1['type']+"</td>"+"<td>"+r1['name']+"</td>"
		tab_text=tab_text+line+"</tr>";
	}

	tab_text=tab_text+"</tbody></table>";
	return (tab_text);
}
$(document).ready(function() {
	$("#geohierarchy_treeview").treetable({expandable: true });

	$('#lnk_exportxls').click(function(){
		tableReport = tableToReport('geohierarchy_treeview');
		fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
	});
	$('#lnk_exportods').click(function(){
		tableReport = tableToReport('geohierarchy_treeview');
		fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
	});
  $("#mira_checkbox_tree").click(function(){  //set for multi row selection
		$(".mira_checkbox_tree").prop('checked', $(this).prop('checked'));
	});
});
