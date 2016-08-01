$(document).ready(function() {

	//this is only for Raw Data submenu
	var url = parent.location.href;
	//$('#' + url.split('/')[url.split('/').length-1]).addClass('ibm-active');
	//

	//format process, log and rawdata tables style
	$('#reports_table').DataTable({
		select: true,
		"scrollY": 250,
		"scrollX": true
	});
/*
	//submit form
	$('#btn_submit').click(function(){
		if ($('#fldProcessName').val() != '') {
			$('#formProcess').submit();
		}else {
			alert('Please fill out all required fields!');
		}
	});

	//button cancel
	$('#btn_cancel').click(function() {
		$(':text').val('');
		$('textarea').val('');
		window.location.href='/process';
	});
*/

	//EXPORT BUTTON EVENT
	$('#button_export').click(function(e){
		var field4header = $.parseJSON($('#dataForTableHeader').val());
		var field4rows = $.parseJSON($('textarea#dataForTableRows').val());
		fnExcelReport(field4header, field4rows)
	});
	
	//Create schedule.
	$('#fldInterval').on('blur', function() {
	var vHrIni = $('#fldStartTime').val();
	var vHrEnd = $('#fldEndTime').val();
	var VHrInterval = parseInt($('#fldInterval').val());
	var array = [];

	    hrIni = vHrIni.split(':');
	    hrEnd = vHrEnd.split(':');
	 
	    hrTotal = parseInt(hrIni[0], 10)
	    mnTotal = parseInt(hrIni[1], 10)
	    
	    if(mnTotal < 10){
	      mnTotal = '0'+mnTotal;
	    }

	    t1=parseInt(hrIni[0]);
	    t2=parseInt(hrEnd[0]);

	     
	    for(var i=t1; i<t2; i++){         
	     array.push(hrTotal + ':' + mnTotal);
	     hrTotal += VHrInterval;
	    }

	    $('#fldScheduleTime').val(array);
	});

});

//set lower case characters to fields in process.hbs form
function minus(obj){
	obj.value = obj.value.toLowerCase();
}






/**************************************************************
this JS creates the table with raw data to be exported to excel
silvav@br.ibm.com
**************************************************************/
function fnExcelReport(tableheader, tablerows) {	
	var tab_text="<table id='rawdata_table' border='2px'><thead><tr bgcolor='#87AFC6'>";
	var line = "";
	for(var field in tableheader) {
		//for (var i = 0; i < data.length; i++) {
		line = line+"<th>"+field+"</th>"; //alert(line);
	};

	tab_text=tab_text+line+"</tr></thead><tbody>";

	for(var x=0; x<tablerows.length; x++) {
		var r1 = tablerows[x];
		line="<tr>";
		//gets the names of the fields in json
		for(var obj1 in r1) {
			var r2 = r1[obj1];
			if(typeof r2 === 'object') {
				for(var obj2 in r2) {
					var r3 = r2[obj2] //Get object doc{}
					if(typeof r3 === 'object') {
						for(var obj3 in r3) {
							var r4 = r3[obj3] //Get object row{}
							line = line+"<td>"+r4+"</td>";
						} //end for r3
					} //end typeof r3
				} //end for r2
			} //end typeof r2
		} //end for obj1
		tab_text=tab_text+line+"</tr>";
	} // end for x

	tab_text=tab_text+"</tbody></table>";

	name=encodeURIComponent(tab_text);

	sa=window.location.assign('data:application/vnd.ms-excel,'+ name);
	// sa=window.location.href='data:application/vnd.oasis.opendocument.spreadsheet,'+ name;
	// sa=window.location.href='data:application/vnd.ms-excel;base64,'+name;
	return (sa);

} //end fnExcelReport


