/* Start of Country Process Functions */
function addEventsCompCP(){
	document.getElementById('summary-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="ibm-active";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('basiccontrol-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="ibm-active";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('auditreadyasmt-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('auditreadyasmt').style.display="";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="ibm-active";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('riskmsdcommit-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="ibm-active";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('auditreview-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="ibm-active";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('kctest-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="ibm-active";
		document.getElementById('opmetric-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('opmetric-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="ibm-active";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('other-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('other-li').className="ibm-active";
	},true);
}

// Display the selected tab
function displaySelectedCPCompTab(){
  var url = parent.location.href;
  s=url.indexOf("summary");
  if (s!=-1){
    obj= document.getElementById('summary-li');
    if(obj){
      document.getElementById('summary').style.display="";
    }
  }
  if (url.indexOf("basiccontrol")!=-1){
    obj= document.getElementById('basiccontrol-li');
    if(obj){
      document.getElementById('basiccontrol').style.display="";
    }
  }
  if (url.indexOf("auditreadyasmt")!=-1){
    obj= document.getElementById('auditreadyasmt-li');
    if(obj){
      document.getElementById('auditreadyasmt').style.display="";
    }
  }
  if (url.indexOf("riskmsdcommit")!=-1){
  obj= document.getElementById('riskmsdcommit-li');
    if(obj){
      document.getElementById('riskmsdcommit').style.display="";
    }
  }
	if (url.indexOf("auditreview")!=-1){
  obj= document.getElementById('auditreview-li');
    if(obj){
      document.getElementById('auditreview').style.display="";
    }
  }
	if (url.indexOf("kctest")!=-1){
  obj= document.getElementById('kctest-li');
    if(obj){
      document.getElementById('kctest').style.display="";
    }
  }
	if (url.indexOf("opmetric")!=-1){
  obj= document.getElementById('opmetric-li');
    if(obj){
      document.getElementById('opmetric').style.display="";
    }
  }
	if (url.indexOf("other")!=-1){
  obj= document.getElementById('other-li');
    if(obj){
      document.getElementById('other').style.display="";
    }
  }
}
/* End of Country Process Functions */

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
		case "Country Process":
      addEventsCompCP();
    	window.addEventListener("load", displaySelectedCPCompTab());
      break;
		case "Global Process":
      addEventsCompGP();
    	window.addEventListener("load", displaySelectedGPCompTab());
      break;
  }
});
