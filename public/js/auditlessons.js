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
	if(($("#mira_checkbox").is(':checked'))){
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

			class_name='mira_checkbox_tree';


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
  $('#link-export').click(function(){

  		tableReport = tableToReport('audit_lessons_treeview');

  	fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
  });

  $('#link-export2').click(function(){

  		tableReport = tableToReport('audit_lessons_treeview');

  	fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
  });
$("#mira_checkbox_tree").click(function(){
  $(".mira_checkbox_tree").prop('checked', $(this).prop('checked'));
});

$(".mira_checkbox_tree").prop('checked', false);
});
