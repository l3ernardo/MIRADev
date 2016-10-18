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


/* main */
$(document).ready(function() {
  switch ($("input[name='parentdocsubtype']").val()) {
		case "Controllable Unit":
			if ($("input[name='portfolio']").val() == "Yes") {
				if ($("input[name='country']").val() == undefined || $("input[name='country']").val() == "") {
					addEventsCompCUHybridPortfolio();
					window.addEventListener("load", displaySelectedCUHybridPortfolioCompTab());
				} else {
					addEventsCompCUPortfolio();
					window.addEventListener("load", displaySelectedCUPortfolioCompTab());
				}
			} else {
				if ($("input[name='country']").val() == undefined || $("input[name='country']").val() == "") {
					addEventsCompCUHybrid();
					window.addEventListener("load", displaySelectedCUHybridCompTab());
				} else {
					addEventsCompCP();
					window.addEventListener("load", displaySelectedCPCompTab());
				}
			}
			break;
		case "Country Process":
      addEventsCompCP();
    	window.addEventListener("load", displaySelectedCPCompTab());
      break;
  }
});
