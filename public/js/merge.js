//*************************************************************
//*
//* Javascript Library to hold all functions for merge
//* Author: Carlos Kenji Takata
//* Date: Dec 30 2016
//*
//*************************************************************

// Collect all field with class "mira-field" and "for" attribute (for user friendly names)
function collect() {
	var mvar = [];
	try {
	  $(".mira-field").each(function() {
		var fld = (this.id.toString()+":"+$(this).attr("for"));
		mvar.push(fld);
	  });
	} catch(e) {
		console.log(e);
	} finally {
		$("#fieldslist").val(mvar);
	}
}