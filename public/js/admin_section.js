$(document).ready(function() {
	$(".size").hide();

	$("input[name$='AuditableFlag']").click(function(){
	  var val = $("input[name$='AuditableFlag']").val();
	  if(val == "Yes")
	    $(".size").show();
	  else
	    $(".size").hide();
	});
});
