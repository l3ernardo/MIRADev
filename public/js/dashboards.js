/*Function to set color in dashboard views*/
function paint_td(table_name){
var table ='#'+table_name+' tr';
 for (var r = 1, n = $(table).length; r <= n; r++) {
	  cells_th=table+':nth-child('+r+') th';
      /*painting checkbox section*/	  
      for (var c = 0, m = $(cells_th).length; c <= m; c++) 
	  {
         if(r%2=="0" && $(cell).text()!='Marg' && $(cell).text()!='Sat' && $(cell).text()!='unsat')
		        {
					 $(cells_th).css("background-color", "#f4f4f5");
                }				    
      }
       rows=table+':nth-child('+r+') td';
      for (var c = 0, m = $(rows).length; c <= m; c++) {               
        cell=table+':eq('+r+') td:eq('+c+')';
            if(r%2=="1" && $(cell).text()=='Marg')
			    { 
                    $(cell).css("background-color", "yellow");
                }
			    else if(r%2=="1" && $(cell).text()=='Sat'){
					$(cell).css("background-color", "#01DF01");
                }
                 else if(r%2=="1" && $(cell).text()=='unsat'){
					 $(cell).css("background-color", "#FF0000");
                }
                else  if(r%2=="1" && $(cell).text()!='Marg' && $(cell).text()!='Sat' && $(cell).text()!='unsat'){
					 $(cell).css("background-color", "white"); 
                }
                else if(r%2=="0" && $(cell).text()=='Marg'){
					 $(cell).css("background-color", "yellow");
                }
                else if(r%2=="0" && $(cell).text()=='Sat'){
					 $(cell).css("background-color", "#01DF01");
                }
                 else if(r%2=="0" && $(cell).text()=='unsat'){
					  $(cell).css("background-color", "#FF0000");
                }
                else  if(r%2=="0" && $(cell).text()!='Marg' && $(cell).text()!='Sat' && $(cell).text()!='unsat'){
					 $(cell).css("background-color", "#f4f4f5");
                }					
          }
 }
}
/*Function to add icons in dashboard views*/
function add_icons(table_name){
  var table = '#'+table_name+' tr';
  for (var r = 1, n = $(table).length; r <= n; r++) 
  {   //index=r-1;
      rows=table+':nth-child('+r+') td';
      for (var c = 3, m = $(rows).length; c <m; c++) 
	  {               
           cell=table+':eq('+r+') td:eq('+c+')';
                    data=$(cell).text();
                if(data=='Draft'){
					 $(cell).text('');
				     $(cell).addClass('td_icon_edit');
                }
                else if(data=='Check'){
				     $(cell).text('');
				     $(cell).addClass('td_icon_check');
                }
                else if(data==''){
					 $(cell).text('');
				     $(cell).addClass('td_icon_empty');
               }
	  }
    }
}
/*Funciton to export dashboard views*/
 function fnExcelReport(table) {	
	var field4rows = $.parseJSON($('textarea#dataForExport').val());
	var table=table;
	var tab_text="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	var line = ""
	var tab = $(table); 
	var theader=$('#'+table+' tr:eq(0) th'); 
	for (c=1;c<theader.length;c++)
	{
			test='#'+table+' tr:eq(0) th:eq('+c+')';
			line=line+"<th>"+$(test).text()+"</th>";
	}
	tab_text=tab_text+line+"</tr>"+"</thead><tbody>";
	if(($("#mira_checkbox").is(':checked')) || ($("#mira_checkbox_flat").is(':checked'))) 
		{  
			for(j = 1; j<=field4rows.length; j++)
				{
					var r1 = field4rows[j];
					line="<tr>";
					for(var obj1 in r1)
						{
							var r2 = r1[obj1];line = line+"<td>"+r2+"</td>";
						} //end for obj1
						tab_text=tab_text+line+"</tr>";
				}
				tab_text=tab_text+"</tbody></table>";
		}
	 else
		 {              
			  var checkboxes=[];var array2=[]; var aux=0;
			  if ((table=='process_dashboard_treeview') || (table=='geo_dashboard_treeview') || (table=='rg_dashboard_treeview'))
				{
					class_name='mira_checkbox_tree';
				}
				else 
				{
					class_name='mira_checkbox_flat';
				}
				var name_table='input:checkbox[class='+class_name+']';
				$(name_table).each(function(index) {checkboxes.push( this.checked);});  
             for (j=1;j<=checkboxes.length;j++)
			   {
                      if (checkboxes[j] == true)
					    {  
                            array2[aux]=j;
                          aux++;      
                       }
               }
			   
			for(j = 1; j<=array2.length; j++)
            {        
		        var index=array2[j-1];
			    var r1= field4rows[index-1];
			    line="<tr>";
                for(var obj1 in r1)
					{ 
			                 var r2 = r1[obj1];
				             line = line+"<td>"+r2+"</td>";
	            	} //end for obj1           
                tab_text=tab_text+line+"</tr>"; 
		  }  
        }
    tab_text=tab_text+"</tbody></table>";	
    name=encodeURIComponent(tab_text);
	//sa=window.location.assign('data:application/vnd.oasis.opendocument.spreadsheet,'+ name);
	sa=window.location.assign('data:application/vnd.ms-excel,'+ name);
	return (sa);	
} 

$(document).ready(function(){ 
    r=url.indexOf("processdashboard");
    s=url.indexOf("geodashboard");
	t=url.indexOf("reportingdashboard");
    paint_td('process_dashboard_treeview');
	add_icons('process_dashboard_treeview');
	paint_td('process_dashboard_flatview');
	add_icons('process_dashboard_flatview');
	
	paint_td('geo_dashboard_treeview');
	add_icons('geo_dashboard_treeview');
	paint_td('geo_dashboard_flatview');
	add_icons('geo_dashboard_flatview');
	
	paint_td('rg_dashboard_treeview');
	add_icons('rg_dashboard_treeview');
	paint_td('rg_dashboard_flatview');
	add_icons('rg_dashboard_flatview');
	
    $("#mira_checkbox_tree").click(function(){
      $(".mira_checkbox_tree").prop('checked', $(this).prop('checked'));
      });
	$("#mira_checkbox_flat").click(function(){
      $(".mira_checkbox_flat").prop('checked', $(this).prop('checked'));
      });  
	$(".mira_checkbox_tree").prop('checked', false);
	$(".mira_checkbox_flat").prop('checked', false);
$('#button_view').click(function(){
		
	
		
	 if($('#button_view').val()=='Flat View' &&  r!=-1)
	 {   
		$('#process_dashboard_flatview').show();
		$('#process_dashboard_treeview').hide();
		$('#button_view').val('Tree View');
	 }
	 else if($('#button_view').val()=='Tree View' &&  r!=-1)
	 {  
		$('#process_dashboard_treeview').show();
		$('#process_dashboard_flatview').hide();
		$(".mira_checkbox_tree").prop('checked', false);
	    $(".mira_checkbox_flat").prop('checked', false);
		$('#button_view').val('Flat View');
		
	 }
	 else if($('#button_view').val()=='Flat View' &&  s!=-1)
	 {  
		$('#geo_dashboard_flatview').show();
		$('#geo_dashboard_treeview').hide();
		$('#button_view').val('Tree View');
		
	 }
	 else if($('#button_view').val()=='Tree View' &&  s!=-1)
	 {  
		$('#geo_dashboard_treeview').show();
		$('#geo_dashboard_flatview').hide();
		$(".mira_checkbox_tree").prop('checked', false);
	    $(".mira_checkbox_flat").prop('checked', false);
		$('#button_view').val('Flat View');		
	 }
	 else if($('#button_view').val()=='Flat View' &&  t!=-1)
	 {  
		$('#rg_dashboard_flatview').show();
		$('#rg_dashboard_treeview').hide();
		$('#button_view').val('Tree View');
		
	 }
	 else if($('#button_view').val()=='Tree View' &&  t!=-1)
	 {  
		$('#rg_dashboard_treeview').show();
		$('#rg_dashboard_flatview').hide();
		$(".mira_checkbox_tree").prop('checked', false);
	    $(".mira_checkbox_flat").prop('checked', false);
		$('#button_view').val('Flat View');		
	 }
});
   $('#button_export').click(function(){
	 if($('#button_view').val()=='Flat View' &&  r!=-1)
	 {   
		fnExcelReport('process_dashboard_treeview' );
	 }
	 else if($('#button_view').val()=='Tree View' &&  r!=-1)
	 {  
		 fnExcelReport('process_dashboard_flatview');
		
	 }
	 else if($('#button_view').val()=='Flat View' &&  s!=-1)
	 {   
		fnExcelReport('geo_dashboard_treeview' );
	 }
	 else if($('#button_view').val()=='Tree View' &&  s!=-1)
	 {  
		 fnExcelReport('geo_dashboard_flatview');		
	 }
	  else if($('#button_view').val()=='Flat View' &&  t!=-1)
	 {   
		fnExcelReport('rg_dashboard_treeview' );
	 }
	 else if($('#button_view').val()=='Tree View' &&  t!=-1)
	 {  
		 fnExcelReport('rg_dashboard_flatview');		
	 }
});
});
