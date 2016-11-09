/*Function to generate dashboard table to export*/
function tableToReport(table){
	var field4rows = $.parseJSON($('textarea#dataForExport').val());
	var table=table;
	var tab_text="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	var line = "";
	var tab = $(table);
	var theader=$('#'+table+' tr:eq(0) th');
	for (c=1;c<theader.length;c++){
		test='#'+table+' tr:eq(0) th:eq('+c+')';
		line=line+"<th>"+$(test).text()+"</th>";
	}
	tab_text=tab_text+line+"</tr>"+"</thead><tbody>";
	if(($("#mira_checkbox").is(':checked')) || ($("#mira_checkbox_flat").is(':checked'))){
		for(j = 0; j<=field4rows.length; j++){
			var r1 = field4rows[j];
			line="<tr>";
			for(var obj1 in r1){
				var r2 = r1[obj1];line = line+"<td>"+r2+"</td>";
			} //end for obj1
			tab_text=tab_text+line+"</tr>";
		}
	}
	else{
		var checkboxes=[];var array2=[]; var aux=0;
		if ((table=='process_dashboard_treeview') || (table=='geo_dashboard_treeview') || (table=='rg_dashboard_treeview') || (table=='subprocess_dashboard_treeview')){
			class_name='mira_checkbox_tree';
		}
		else{
			class_name='mira_checkbox_flat';
		}
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
				line = line+"<td>"+r2+"</td>";
			} //end for obj1
			tab_text=tab_text+line+"</tr>";
		}
	}
	tab_text=tab_text+"</tbody></table>";
	return (tab_text);
}

$(document).ready(function(){
	r=url.indexOf("processdashboard");
	s=url.indexOf("geodashboard");
	t=url.indexOf("reportingdashboard");
	u=url.indexOf("subprocessdashboard");
	
	$("#mira_checkbox_tree").click(function(){
		$(".mira_checkbox_tree").prop('checked', $(this).prop('checked'));
	});
	$("#mira_checkbox_flat").click(function(){
		$(".mira_checkbox_flat").prop('checked', $(this).prop('checked'));
	});
	$(".mira_checkbox_tree").prop('checked', false);
		$(".mira_checkbox_flat").prop('checked', false);

	$('#link-view').click(function(){
		if($(this).text()=='Flat View' &&  r!=-1 && u==-1){
			$('#process_dashboard_flatview').show();
			$('#process_dashboard_treeview').hide();
			$(this).text('Tree View');
		}
		else if($(this).text()=='Tree View' &&  r!=-1 && u==-1){
			$('#process_dashboard_treeview').show();
			$('#process_dashboard_flatview').hide();
			$(".mira_checkbox_tree").prop('checked', false);
			$(".mira_checkbox_flat").prop('checked', false);
			$(this).text('Flat View');
		}
		else if($(this).text()=='Flat View' &&  s!=-1){
			$('#geo_dashboard_flatview').show();
			$('#geo_dashboard_treeview').hide();
			$(this).text('Tree View');
		}
		else if($(this).text()=='Tree View' &&  s!=-1){
			$('#geo_dashboard_treeview').show();
			$('#geo_dashboard_flatview').hide();
			$(".mira_checkbox_tree").prop('checked', false);
			$(".mira_checkbox_flat").prop('checked', false);
			$(this).text('Flat View');
		}
		else if($(this).text()=='Flat View' &&  t!=-1){
			$('#rg_dashboard_flatview').show();
			$('#rg_dashboard_treeview').hide();
			$(this).text('Tree View');
		}
		else if($(this).text()=='Tree View' &&  t!=-1){
			$('#rg_dashboard_treeview').show();
			$('#rg_dashboard_flatview').hide();
			$(".mira_checkbox_tree").prop('checked', false);
			$(".mira_checkbox_flat").prop('checked', false);
			$(this).text('Flat View');
		}
		else if($(this).text()=='Flat View' &&  u!=-1 && r==-1){
			$('#subprocess_dashboard_flatview').show();
			$('#subprocess_dashboard_treeview').hide();
			$(this).text('Tree View');
		}
		else if($(this).text()=='Tree View' &&  u!=-1 && r==-1){
			$('#subprocess_dashboard_treeview').show();
			$('#subprocess_dashboard_flatview').hide();
			$(".mira_checkbox_tree").prop('checked', false);
			$(".mira_checkbox_flat").prop('checked', false);
			$(this).text('Flat View');
		}
});

$('#link-export').click(function(){
	if($('#link-view').text()=='Flat View' &&  r!=-1 &&  u==-1){
		tableReport = tableToReport('process_dashboard_treeview');
	}
	else if($('#link-view').text()=='Tree View' &&  r!=-1 &&  u==-1){
		tableReport = tableToReport('process_dashboard_flatview');
	}
	else if($('#link-view').text()=='Flat View' &&  s!=-1){
		tableReport = tableToReport('geo_dashboard_treeview');
	}
	else if($('#link-view').text()=='Tree View' &&  s!=-1){
		tableReport = tableToReport('geo_dashboard_flatview');
	}
	else if($('#link-view').text()=='Flat View' &&  t!=-1){
		tableReport = tableToReport('rg_dashboard_treeview');
	}
	else if($('#link-view').text()=='Tree View' &&  t!=-1){
		tableReport = tableToReport('rg_dashboard_flatview');
	}
	else if($('#link-view').text()=='Flat View' &&  u!=-1 ){
		tableReport = tableToReport('subprocess_dashboard_treeview');
	}
	else if($('#link-view').text()=='Tree View' &&  u!=-1){
		tableReport = tableToReport('subprocess_dashboard_flatview');
	}
	fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
});

$('#link-export2').click(function(){
	if($('#link-view').text()=='Flat View' &&  r!=-1 &&  u==-1){
		tableReport = tableToReport('process_dashboard_treeview');
	}
	else if($('#link-view').text()=='Tree View' &&  r!=-1 &&  u==-1){
		tableReport = tableToReport('process_dashboard_flatview');
	}
	else if($('#link-view').text()=='Flat View' &&  s!=-1){
		tableReport = tableToReport('geo_dashboard_treeview');
	}
	else if($('#link-view').text()=='Tree View' &&  s!=-1){
		tableReport = tableToReport('geo_dashboard_flatview');
	}
	else if($('#link-view').text()=='Flat View' &&  t!=-1){
		tableReport = tableToReport('rg_dashboard_treeview');
	}
	else if($('#link-view').text()=='Tree View' &&  t!=-1){
		tableReport = tableToReport('rg_dashboard_flatview');
	}
	else if($('#link-view').text()=='Flat View' &&  u!=-1 ){
		tableReport = tableToReport('subprocess_dashboard_treeview');
	}
	else if($('#link-view').text()=='Tree View' &&  u!=-1){
		tableReport = tableToReport('subprocess_dashboard_flatview');
	}
	fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
});
});
