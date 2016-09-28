function add(elem) {
	var members = elem.val().split(",");
	for(var i=0;i<members.length;i++) {
		
		x = members[i].split(")")[0].split("(")[1];
		if(x != null){
		var select = document.getElementById("mySelect");
		select.options[select.options.length] = new Option(members[i], x);
		}
			
	}
	elem.val("");
}

function del(elem) {
	$("#mySelect option[value='"+elem.val()+"']").remove();
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
