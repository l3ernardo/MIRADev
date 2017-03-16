function validation (){
	var valid = true;
	$(":required").each(function(){
		if(this.value === ""){
			alert("Fields with (*) are required!");
			valid =  false;
			return false;
		}
	});
	return valid;
}

