/**************************************************************************************************
 * 
 * Section widget for MIRA Web
 * Developed by: Valdenir Silva                                                
 * Date: 20 June 2016
 * 
 */
 
function sectionWidget(bgroups) {

	$('.sectionwidget').each(function() {
		var divRole = $(this).attr('role');  //role in the div
		var bg = bgroups; //bluegroup member
		//call the function to compare roles
		if(compareArrays(divRole, bg) == false){
			var d = $(this);
			var t = $(this).find(':text');
			for(var i =0; i<t.length; i++){
				//create an <span> element and append the values from fields to it.
				var span = document.createElement("span");
				var text = document.createTextNode(t[i].value);
				span.appendChild(text);

				//append the text after the hidden fields
				$(t[i]).after(span);

				//hide the input text fields
				$(this).find(':text').hide();        
			}

			//disable elements
			$(this).find(':input').prop('disabled', true);
			//$(this).find('select').prop('disabled', true);
			$(this).find("a").attr("onclick", null);

		}//end if
	})
};

//function to checkif roles in the div mach in user's roles.
function compareArrays(divRole, bg) {
	var rtn = false;
	if(divRole.indexOf(",")) {
	  var arrayA = divRole.split(",");  
	} else {
	   var arrayA = new Array(divRole);
	}
	if(bg.indexOf(",")) {
	  var arrayB = bg.split(",");  
	} else {
	   var arrayB = new Array(bg);
	}			
	var resultA;
	var resultB;
  
	for(var x in arrayA){
		resultA = arrayA[x];	    
		for(y in arrayB){
			resultB =  arrayB[y];
			if(resultA == resultB){
				rtn = true;
			}
		}
	}

	return rtn;
}