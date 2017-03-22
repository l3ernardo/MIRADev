function add(elem) {
	var members = elem.val().split(",");
	var inList = false;
	for(var i=0;i<members.length;i++) {
		x = members[i].split(")")[0].split("(")[1];
		if(x != null){
			var select = $("#mySelect").find('option');
			for(var j=0;j<select.length;j++) {
				if(select[j].innerHTML.indexOf(x) !=-1){
					inList = true;
					break;
				}
			}
			if(!inList){
				$("#mySelect").append(new Option(members[i], x));
			}
		}
		else{
			alert("There are no users to add.");
		}			
	}
	elem.val("");
}

function del(elem) {
	if(elem.val() != null)
		$("#mySelect option[value='"+elem.val()+"']").remove();
	else
		alert("No username were selected to be removed.");
}

function submitForm(form) {
	var select = document.getElementById("mySelect");
	$("#finalmembers").val("");
	for(var i=0;i<select.length;i++) {
		if(document.getElementById("finalmembers").value == "") {
			document.getElementById("finalmembers").value = select.options[i].value;
		} else {
			document.getElementById("finalmembers").value = document.getElementById("finalmembers").value + ";" + select.options[i].value;
		}
	}
	//alert(document.getElementById("finalmembers").value)
	form.submit();
}

function tableReport(){
	var tab_text="<table border='2px' width='auto'><thead><tr bgcolor='#87AFC6'><th>"+$("#group").val()+"</th></tr></thead><tbody>";		
	var select = $("#mySelect").find('option');
	for(var j=0;j<select.length;j++) {
		tab_text+="<tr><td width='auto'>"+select[j].innerHTML+"</td></tr>";
	}
	tab_text+="</tbody></table>";
	
	return tab_text;
}

$(document).ready(function() {
	$('#lnk_exportxls').click(function(){
		fnReport($(this), tableReport(), "xls", $('h1#pageTitle').text());
	});
	$('#lnk_exportods').click(function(){
		fnReport($(this), tableReport(), "ods", $('h1#pageTitle').text());
	});
});