function validation (){
	var valid = true;
	$(':required').each(function(){
		if(this.value === ""){
			alert("Please enter all the required fields.");
			valid =  false;
			return false;
		}
	});
	return valid;
}

