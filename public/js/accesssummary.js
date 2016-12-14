$(document).ready(function() {
	t=url.indexOf("reportstaexc");
	
	
	 var listWithComa = function (list){
		  
	  		var newList='';
		try{	
			if(typeof list != 'undefined'){
				for(i=0; i<list.length; i++){

					if(list.charAt(i) != ',')
					newList += list.charAt(i);
					else
					newList += '</br>';


				}
			}
			
			}catch(e){alert("Error at listWithComa please contact administrator"+e);}

			return newList;
	  
	  }

		var getType = function(type){
			var response = "";
			
			switch(type){
			
				case "1": response = "Account";
				break;
				
				case "2": response = "BU Country";
				break;
				
				case "3": response = "BU IMT";
				break;
				
				case "4": response = "BU IOT";
				break;
				
				case "5": response = "BU Reporting Group";
				break;
				
				case "6": response = "Controllable Unit";
				break;
				
				case "7": response = "Country Process";
				break;
				
				case "8": response = "Global Process";
				break;
				
				case "9": response = "Sub-process";
				break;
				
				default: response = "Unknown Type";
				break;
				
			
			
			
			}
		
		
			return response;
			}

		var arrayLimits = [];
		
		//var tabs = JSON.parse('{{{tabs}}}');
	    var alldata = JSON.parse('{{{alldata}}}');
			
		
		$('h1#pageTitle').text("Explicit Access Summary");
		var data = [];
		
		
		
		//Create the links for pagination
		var tabsDiv = document.getElementById('pagination');
		
		var limits = "{{{limits}}}".split(',');
		
		for(var l=0;l<limits.length;l++){
			var objLimits = {};
			
			objLimits.start = limits[l].split("|")[0];
			objLimits.end = limits[l].split("|")[1];
			arrayLimits.push(objLimits);
		
			
		}
		
		
		for(var f=0; f < arrayLimits.length; f++){

			a = document.createElement('a');
			a.href = "../explicitAccessSummary?start="+arrayLimits[f].start+"&end="+arrayLimits[f].end+"&limits="+limits;
			a.innerHTML = f+1;
			a.style["line-height"] = "1em";
			a.style["padding"] = "8px";
			a.style["margin"] = "2px";
		
			tabsDiv.appendChild(a);
		}
		
		
		
		for ( var i=0 ; i<alldata.length ; i++ ) {
			data.push(["<input type='checkbox' id='invidual_checkbox_tree' class='mira_checkbox_tree'/>",alldata[i][1], getType(alldata[i][2]), "<a href='/assessableunit?id="+alldata[i][0]+"'>"+alldata[i][3]+"</a>", alldata[i][4], alldata[i][5], alldata[i][6], alldata[i][7], alldata[i][8], alldata[i][9], alldata[i][10], alldata[i][11], alldata[i][12], alldata[i][13], alldata[i][15], alldata[i][16],alldata[i][14]]);
		
	}
		
		$('#accesssummary_treeview').DataTable( {
	            data:  data,
	           	select: true,
	           	"ordering": false,
	           	"paging": false,
				"processing": true,
				"pageLength": 100,
				"scrollY": 250,
				"scrollX": true,
				"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
						$(nRow).attr('data-tt-id', aData[14]);//added tree id and parents for tree view
				        $(nRow).attr('data-tt-parent-id', aData[15]);//added tree id and parents for tree view
				    
				        $('td:eq(0)', nRow).html('<input type="checkbox" id="invidual_checkbox_tree" class="mira_checkbox_tree"/>');
				       		        
				      
				       
				        if(aData[16] == "W"){ //adding colors
				       
				        	$('td:eq(1)', nRow).attr('style', "background-color: #C0E1FF");
				        	$('td:eq(2)', nRow).attr('style', "background-color: #C0E1FF");
				        	$('td:eq(3)', nRow).attr('style', "background-color: #C0E1FF");
				        	$('td:eq(4)', nRow).attr('style', "background-color: #C0E1FF");
				        	$('td:eq(5)', nRow).attr('style', "background-color: #C0E1FF");
				        	$('td:eq(6)', nRow).attr('style', "background-color: #C0E1FF");
				        	$('td:eq(7)', nRow).attr('style', "background-color: #C0E1FF");
				        	$('td:eq(8)', nRow).attr('style', "background-color: #C0E1FF");
				        	$('td:eq(9)', nRow).attr('style', "background-color: #C0E1FF");
				        	$('td:eq(10)', nRow).attr('style', "background-color: #C0E1FF");
				        	$('td:eq(11)', nRow).attr('style', "background-color: #C0E1FF");
				        	$('td:eq(12)', nRow).attr('style', "background-color: #C0E1FF");
				        	$('td:eq(13)', nRow).attr('style', "background-color: #C0E1FF");
				        	} 
				        if(aData[16] == "M"){
				        	$('td:eq(1)', nRow).attr('style', "background-color: #C2FF91");
				        	$('td:eq(2)', nRow).attr('style', "background-color: #C2FF91");
				        	$('td:eq(3)', nRow).attr('style', "background-color: #C2FF91");
				        	$('td:eq(4)', nRow).attr('style', "background-color: #C2FF91");
				        	$('td:eq(5)', nRow).attr('style', "background-color: #C2FF91");
				        	$('td:eq(6)', nRow).attr('style', "background-color: #C2FF91");
				        	$('td:eq(7)', nRow).attr('style', "background-color: #C2FF91");
				        	$('td:eq(8)', nRow).attr('style', "background-color: #C2FF91");
				        	$('td:eq(9)', nRow).attr('style', "background-color: #C2FF91");
				        	$('td:eq(10)', nRow).attr('style', "background-color: #C2FF91");
				        	$('td:eq(11)', nRow).attr('style', "background-color: #C2FF91");
				        	$('td:eq(12)', nRow).attr('style', "background-color: #C2FF91");
				        	$('td:eq(13)', nRow).attr('style', "background-color: #C2FF91");
				        	}
				        
				        
				        
				},
				 "columnDefs": [
	            {
	                "targets": [ 14 ],
	                "visible": false,
	                "searchable": false
	            },
	              {
	                "targets": [ 16 ],
	                "visible": false,
	                "searchable": false
	            },
	             {
	                "targets": [ 15 ],
	                "visible": false,
	                "searchable": false
	            }]
	        } );
		
			$("#accesssummary_treeview").treetable({expandable: true });
		
	
	
	
	
	
	
	
	
	
	
	
	
	
	$('input:checkbox').removeAttr('checked');

	$('#lnk_exportxls').click(function(){
		alert("entra");
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
		table += "<th>"+$('#th5').text()+"</th>";	
		table += "<th>"+$('#th6').text()+"</th>";	
		table += "<th>"+$('#th7').text()+"</th>";	
		table += "<th>"+$('#th8').text()+"</th>";	
		table += "<th>"+$('#th9').text()+"</th>";	
		table += "<th>"+$('#th10').text()+"</th>";	
		table += "<th>"+$('#th11').text()+"</th>";	
		table += "<th>"+$('#th12').text()+"</th>";	
		table += "<th>"+$('#th13').text()+"</th></tr>";	
		
			if ($('#mira_checkbox_tree').is(":checked")) //depending on single or multiple selection and extra row is added
			{  incremental = 1; limit =1; }
			else
			{ incremental = 2; limit =0; }
			
		try{

			for(j = 0; j<array2.length-limit; j++){ //iterates on the row to construct table 
				if(typeof fields[array2[j]-incremental]._id != 'undefined'  ){

				table += "<tr>";
				table += "<td>"+fields[array2[j]-incremental].Name+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Type+"</td>";
				table += "<td>"+fields[array2[j]-incremental].AssessableUnit+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Status+"</td>";
				table += "<td>"+fields[array2[j]-incremental].AddionalEditors+"</td>";
				table += "<td>"+fields[array2[j]-incremental].AddionalReaders+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Owners+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Focals+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Coordinators+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Readers+"</td>";
				table += "<td>"+fields[array2[j]-incremental].IOT+"</td>";
				table += "<td>"+fields[array2[j]-incremental].IMT+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Country+"</td>";
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
		table += "<th>"+$('#th5').text()+"</th>";	
		table += "<th>"+$('#th6').text()+"</th>";	
		table += "<th>"+$('#th7').text()+"</th>";	
		table += "<th>"+$('#th8').text()+"</th>";	
		table += "<th>"+$('#th9').text()+"</th>";	
		table += "<th>"+$('#th10').text()+"</th>";	
		table += "<th>"+$('#th11').text()+"</th>";	
		table += "<th>"+$('#th12').text()+"</th>";	
		table += "<th>"+$('#th13').text()+"</th></tr>";	
		


			
			if ($('#mira_checkbox_tree').is(":checked")) //depending on single or multiple selection and extra row is added
			{  incremental = 1; limit =1; }
			else
			{ incremental = 2; limit =0; }
			
		try{

		

			for(j = 0; j<array2.length-limit; j++){ //iterates on the row to construct table 
				if(typeof fields[array2[j]-incremental]._id != 'undefined'  ){

				table += "<tr>";
				table += "<td>"+fields[array2[j]-incremental].Name+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Type+"</td>";
				table += "<td>"+fields[array2[j]-incremental].AssessableUnit+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Status+"</td>";
				table += "<td>"+fields[array2[j]-incremental].AddionalEditors+"</td>";
				table += "<td>"+fields[array2[j]-incremental].AddionalReaders+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Owners+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Focals+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Coordinators+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Readers+"</td>";
				table += "<td>"+fields[array2[j]-incremental].IOT+"</td>";
				table += "<td>"+fields[array2[j]-incremental].IMT+"</td>";
				table += "<td>"+fields[array2[j]-incremental].Country+"</td>";
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


