/* Start of Country Process and Standalone Controllable Unit Functions */
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
		$("#cabeza").css("display", "block");
		$("#cuerpo").css("display", "block");
		var height = $('#cuerpo').height();
		$("#cuerpo").css("height", height+"px");
		$("#cuerpo").css("max-height", height+"px");
		$("#cuerpo").css("overflow-y", "auto");
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

function addEventsCompAccount(){
	document.getElementById('summary-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="ibm-active";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
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
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="ibm-active";
		document.getElementById('auditreadyasmt-li').className="";
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
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="ibm-active";
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
		document.getElementById('auditreview').style.display="";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
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
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
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
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
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
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
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
/* End of Country Process and Standalone Controllable Unit Functions */

/* Start of Controllable Unit Hybrid Functions */
function addEventsCompCUHybrid(){
	document.getElementById('summary-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="ibm-active";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
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
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="ibm-active";
		document.getElementById('cprating-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('cprating-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('cprating').style.display="";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="ibm-active";
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
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
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
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
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
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
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
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
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
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
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
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('other').style.display="";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('other-li').className="ibm-active";
	},true);
}

// Display the selected tab
function displaySelectedCUHybridCompTab(){
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
	if (url.indexOf("cprating")!=-1){
    obj= document.getElementById('cprating-li');
    if(obj){
      document.getElementById('cprating').style.display="";
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
/* End of Controllable Unit Hybrid Functions */

/* Start of Portfolio Controllable Unit Functions */
function addEventsCompCUPortfolio(){
	document.getElementById('summary-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="ibm-active";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
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
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="ibm-active";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
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
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="ibm-active";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
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
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="ibm-active";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
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
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="ibm-active";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
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
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="ibm-active";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
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
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="ibm-active";
		document.getElementById('accountrating-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('accountrating-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('accountrating').style.display="";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="ibm-active";
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
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
		document.getElementById('other-li').className="ibm-active";
	},true);
}

// Display the selected tab
function displaySelectedCUPortfolioCompTab(){
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
	if (url.indexOf("accountrating")!=-1){
  obj= document.getElementById('accountrating-li');
    if(obj){
      document.getElementById('accountrating').style.display="";
    }
  }
	if (url.indexOf("other")!=-1){
  obj= document.getElementById('other-li');
    if(obj){
      document.getElementById('other').style.display="";
    }
  }
}
/* End of Portfolio Controllable Unit Functions */

/* Start of Controllable Unit Hybrid Portfolio Functions */
function addEventsCompCUHybridPortfolio(){
	document.getElementById('summary-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="ibm-active";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('basiccontrol-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="";
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="ibm-active";
		document.getElementById('cprating-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('cprating-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('cprating').style.display="";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="ibm-active";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('auditreadyasmt-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
		document.getElementById('auditreadyasmt-li').className="ibm-active";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('riskmsdcommit-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="ibm-active";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('auditreview-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="ibm-active";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('kctest-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="ibm-active";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('opmetric-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="";
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="ibm-active";
		document.getElementById('accountrating-li').className="";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('accountrating-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('accountrating').style.display="";
		document.getElementById('other').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="ibm-active";
		document.getElementById('other-li').className="";
	},true);
	document.getElementById('other-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('basiccontrol').style.display="none";
		document.getElementById('cprating').style.display="none";
		document.getElementById('auditreadyasmt').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('kctest').style.display="none";
		document.getElementById('opmetric').style.display="none";
		document.getElementById('accountrating').style.display="none";
		document.getElementById('other').style.display="";

		document.getElementById('summary-li').className="";
		document.getElementById('basiccontrol-li').className="";
		document.getElementById('cprating-li').className="";
		document.getElementById('auditreadyasmt-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('kctest-li').className="";
		document.getElementById('opmetric-li').className="";
		document.getElementById('accountrating-li').className="";
		document.getElementById('other-li').className="ibm-active";
	},true);
}

// Display the selected tab
function displaySelectedCUHybridPortfolioCompTab(){
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
	if (url.indexOf("cprating")!=-1){
    obj= document.getElementById('cprating-li');
    if(obj){
      document.getElementById('cprating').style.display="";
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
	if (url.indexOf("accountrating")!=-1){
  obj= document.getElementById('accountrating-li');
    if(obj){
      document.getElementById('accountrating').style.display="";
    }
  }
	if (url.indexOf("other")!=-1){
  obj= document.getElementById('other-li');
    if(obj){
      document.getElementById('other').style.display="";
    }
  }
}
/* End of Controllable Unit Hybrid Portfolio Functions */

/*Function to generate dashboard table to export*/
function tableToReport(table){
	var field4rows = $.parseJSON($('textarea#dataForExport').val());
	var table=table;
	var tab_text="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	var line = "";
	var tab = $(table);
	var theader=$('#'+table+' tr:eq(0) th');
	for (c=1;c<theader.length;c++){
		test='#'+table+' tr:eq(0) th:eq('+c+')';
		line=line+"<th>"+$(test).text()+"</th>";
	}
	tab_text=tab_text+line+"</tr>"+"</thead><tbody>";
	if(($("#openrisks_checkbox").is(':checked'))){
		for(j = 0; j<=field4rows.length; j++){
			var r1 = field4rows[j];
			line="<tr>";
			for(var obj1 in r1){
				alert(obj1);
				var r2 = r1[obj1];line = line+"<td>"+r2+"</td>";
			} //end for obj1
			tab_text=tab_text+line+"</tr>";
		}
	}
	else{
		var checkboxes=[];var array2=[]; var aux=0;
			class_name='openrisks_checkbox_tree';
		var name_table='input:checkbox[class='+class_name+']';
		$(name_table).each(function(index) {checkboxes.push( this.checked);});
		for (j=1;j<=checkboxes.length;j++){
			if (checkboxes[j] == true){
				array2[aux]=j;
				aux++;
			}
		}

		for(j = 1; j<=array2.length; j++){
			var index=array2[j-1];
			var r1= field4rows[index-1];
			line="<tr>";
			for(var obj1 in r1){
				var r2 = r1[obj1];
				line = line+"<td>"+r2+"</td>";
			} //end for obj1
			tab_text=tab_text+line+"</tr>";
		}
	}
	tab_text=tab_text+"</tbody></table>";
	return (tab_text);
}

/* main */
$(document).ready(function() {
	$("#openrisks_checkbox_tree").click(function(){
		$(".openrisks_checkbox_tree").prop('checked', $(this).prop('checked'));
	});
	$('#link-export').click(function(){
			tableReport = tableToReport('open_risks_treeview');
			fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
		});
	$('#link-export2').click(function(){
				tableReport = tableToReport('open_risks_treeview');
				fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
			});

  switch ($("input[name='parentdocsubtype']").val()) {
		case "Controllable Unit":
			if ($("input[name='enteredbu']").val() == "GTS Transformation") {
				addEventsCompCP();
				window.addEventListener("load", displaySelectedCPCompTab());
			} else {
				if ($("input[name='portfolio']").val() == "Yes") {
					if ($("input[name='hybrid']").val() == "Yes") {
						addEventsCompCUHybridPortfolio();
						window.addEventListener("load", displaySelectedCUHybridPortfolioCompTab());
					} else {
						addEventsCompCUPortfolio();
						window.addEventListener("load", displaySelectedCUPortfolioCompTab());
					}
				} else {
					if ($("input[name='hybrid']").val() == "Yes") {
						addEventsCompCUHybrid();
						window.addEventListener("load", displaySelectedCUHybridCompTab());
					} else {
						addEventsCompCP();
						window.addEventListener("load", displaySelectedCPCompTab());
					}
				}
			}
			break;
		case "Country Process":
        addEventsCompCP();
	    case "Account":
        addEventsCompAccount();
    	window.addEventListener("load", displaySelectedCPCompTab());
      break;
  }
});
