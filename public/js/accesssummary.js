function validateForm() {
    var x = document.forms["exportAllForm"]["searchEmail"].value;
    if (x == "") {
        alert("User name must be filled out");
        return false;
    }
}


$(document).ready(function() {
	t=url.indexOf("reportstaexc");
	

	$('input:checkbox').removeAttr('checked');

	$('#lnk_exportxls').click(function(){
		var fields = $.parseJSON($('textarea#dataForExport').val());
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
		var checkboxes=[];var array2=[]; var aux=0; var incremental =0; var limit=0;

		var name_table='input:checkbox[class=mira_checkbox_tree]';  
		$(name_table).each(function(index) {checkboxes.push( this.checked);});
		for (j=1;j<=checkboxes.length;j++){
			if (checkboxes[j] == true){
				array2[aux]=j;
				aux++;      
			}
		}
		
		

		table += "<th>"+$('#th1').text()+"</th>";   //construct the first row	
		table += "<th>"+$('#th2').text()+"</th>";	
		table += "<th>"+$('#th3').text()+"</th>";	
		table += "<th>"+$('#th4').text()+"</th>";	
		table += "<th>"+$('#th5').text()+"</th></tr>";	
	
		
			if ($('#mira_checkbox_tree').is(":checked")) //depending on single or multiple selection and extra row is added
			{  incremental = 1; limit =1; }
			else
			{ incremental = 2; limit =0; }
			
		try{

			for(j = 0; j<array2.length-limit; j++){ //iterates on the row to construct table 
				if(typeof fields[array2[j]-incremental]._id != 'undefined'  ){

				table += "<tr>";
				table += "<td>"+fields[array2[j]-incremental].Name+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Role+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Type+"</td>";
				table += "<td>"+fields[array2[j]-incremental].AssessableUnit+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Status+"</td>";
			
				table += "</tr>";

				}
			}
			
		}catch(e){alert(e); }

		//table += $("table#accesssummary_treeview").html();
		
		table += "</table>";

		
		fnReport($(this), table, "xls", $('h1#pageTitle').text());
		$('input:checkbox').removeAttr('checked');
		array2=[];
		
	});
	$('#lnk_exportods').click(function(){
		var fields = $.parseJSON($('textarea#dataForExport').val());
		var table="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
		var checkboxes=[];var array2=[]; var aux=0; var incremental =0; var limit=0;

		var name_table='input:checkbox[class=mira_checkbox_tree]';  
		$(name_table).each(function(index) {checkboxes.push( this.checked);});
		for (j=1;j<=checkboxes.length;j++){
			if (checkboxes[j] == true){
				array2[aux]=j;
				aux++;      
			}
		}

		table += "<th>"+$('#th1').text()+"</th>";   //construct the first row	
		table += "<th>"+$('#th2').text()+"</th>";	
		table += "<th>"+$('#th3').text()+"</th>";	
		table += "<th>"+$('#th4').text()+"</th>";	
		table += "<th>"+$('#th5').text()+"</th></tr>";	
	
		


			
			if ($('#mira_checkbox_tree').is(":checked")) //depending on single or multiple selection and extra row is added
			{  incremental = 1; limit =1; }
			else
			{ incremental = 2; limit =0; }
			
		try{

		

			for(j = 0; j<array2.length-limit; j++){ //iterates on the row to construct table 
				if(typeof fields[array2[j]-incremental]._id != 'undefined'  ){

				table += "<tr>";
				table += "<td>"+fields[array2[j]-incremental].Name+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Role+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Type+"</td>";
				table += "<td>"+fields[array2[j]-incremental].AssessableUnit+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Status+"</td>";
				
				table += "</tr>";

				}
			}
			
		}catch(e){alert(e); }

		//table += $("table#accesssummary_treeview").html();
		
		table += "</table>";
		fnReport($(this), table, "ods", $('h1#pageTitle').text());
		$('input:checkbox').removeAttr('checked');
		array2=[];
		
	});
$("#mira_checkbox_tree").click(function(){  //set for multi row selection
		$(".mira_checkbox_tree").prop('checked', $(this).prop('checked'));
	});
});