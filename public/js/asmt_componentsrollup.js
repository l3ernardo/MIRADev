/* Start of Global Process Functions */
// Add listeners to the constinuents tabs
function addEventsCompGP(){
	document.getElementById('summary-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('kctest1').style.display="none";
		document.getElementById('kctest2').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="ibm-active";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('kctest1-li').className="";
		document.getElementById('kctest2-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('perfoverview-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('kctest1').style.display="none";
		document.getElementById('kctest2').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="ibm-active";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('kctest1-li').className="";
		document.getElementById('kctest2-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('auditreview-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="";
		document.getElementById('processrating').style.display="none";
		document.getElementById('kctest1').style.display="none";
		document.getElementById('kctest2').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="ibm-active";
		document.getElementById('processrating-li').className="";
		document.getElementById('kctest1-li').className="";
		document.getElementById('kctest2-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('processrating-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="";
		document.getElementById('kctest1').style.display="none";
		document.getElementById('kctest2').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="ibm-active";
		document.getElementById('kctest1-li').className="";
		document.getElementById('kctest2-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('kctest1-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('kctest1').style.display="";
		document.getElementById('kctest2').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('kctest1-li').className="ibm-active";
		document.getElementById('kctest2-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('kctest2-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('kctest1').style.display="none";
		document.getElementById('kctest2').style.display="";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('kctest1-li').className="";
		document.getElementById('kctest2-li').className="ibm-active";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('riskmsdcommit-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('kctest1').style.display="none";
		document.getElementById('kctest2').style.display="none";
		document.getElementById('riskmsdcommit').style.display="";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('kctest1-li').className="";
		document.getElementById('kctest2-li').className="";
		document.getElementById('riskmsdcommit-li').className="ibm-active";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('audituniverse-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('kctest1').style.display="none";
		document.getElementById('kctest2').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('kctest1-li').className="";
		document.getElementById('kctest2-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="ibm-active";
	},true);
}

// Display the selected tab
function displaySelectedGPCompTab(){
  var url = parent.location.href;
  s=url.indexOf("summary");
  if (s!=-1){
    obj= document.getElementById('summary-li');
    if(obj){
      document.getElementById('summary').style.display="";
    }
  }
  if (url.indexOf("perfoverview")!=-1){
    obj= document.getElementById('perfoverview-li');
    if(obj){
      document.getElementById('perfoverview').style.display="";
    }
  }
  if (url.indexOf("auditreview")!=-1){
    obj= document.getElementById('auditreview-li');
    if(obj){
      document.getElementById('auditreview').style.display="";
    }
  }
  if (url.indexOf("processrating")!=-1){
  obj= document.getElementById('processrating-li');
    if(obj){
      document.getElementById('processrating').style.display="";
    }
  }
	if (url.indexOf("kctest1")!=-1){
  obj= document.getElementById('kctest1-li');
    if(obj){
      document.getElementById('kctest1').style.display="";
    }
  }
	if (url.indexOf("kctest2")!=-1){
  obj= document.getElementById('kctest2-li');
    if(obj){
      document.getElementById('kctest2').style.display="";
    }
  }
	if (url.indexOf("riskmsdcommit")!=-1){
  obj= document.getElementById('riskmsdcommit-li');
    if(obj){
      document.getElementById('riskmsdcommit').style.display="";
    }
  }
	if (url.indexOf("audituniverse")!=-1){
  obj= document.getElementById('audituniverse-li');
    if(obj){
      document.getElementById('audituniverse').style.display="";
    }
  }
}
/* End of Global Process Functions */

/* main */
$(document).ready(function() {
  switch ($("input[name='parentdocsubtype']").val()) {
		case "Global Process":
      addEventsCompGP();
    	window.addEventListener("load", displaySelectedGPCompTab());
      break;
  }
});
