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

/* Start of BU Country Functions */
// Add listeners to the constinuents tabs
function addEventsCompBUC(){
	document.getElementById('summary-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('sctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="ibm-active";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('sctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('perfoverview-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('sctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="ibm-active";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('sctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('auditreview-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('sctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="ibm-active";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('sctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('processrating-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('sctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="ibm-active";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('sctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('curating-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="";
		document.getElementById('rctest').style.display="none";
		document.getElementById('sctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="ibm-active";
		document.getElementById('rctest-li').className="";
		document.getElementById('sctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('rctest-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="";
		document.getElementById('sctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="ibm-active";
		document.getElementById('sctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('sctest-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('sctest').style.display="";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('sctest-li').className="ibm-active";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('riskmsdcommit-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('sctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('sctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="ibm-active";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('audituniverse-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('sctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('sctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="ibm-active";
	},true);
}

// Display the selected tab
function displaySelectedBUCCompTab(){
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
	if (url.indexOf("curating")!=-1){
  obj= document.getElementById('curating-li');
    if(obj){
      document.getElementById('curating').style.display="";
    }
  }
	if (url.indexOf("rctest")!=-1){
  obj= document.getElementById('rctest-li');
    if(obj){
      document.getElementById('rctest').style.display="";
    }
  }
	if (url.indexOf("sctest")!=-1){
  obj= document.getElementById('sctest-li');
    if(obj){
      document.getElementById('sctest').style.display="";
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
/* End of BU Country Functions */

/* Start of Business Unit */
// Add listeners to the constinuents tabs
function addEventsCompBU(){
	document.getElementById('summary-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="ibm-active";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('perfoverview-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="ibm-active";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('auditreview-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="ibm-active";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('processrating-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="ibm-active";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('curating-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="";
		document.getElementById('rctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="ibm-active";
		document.getElementById('rctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('rctest-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="ibm-active";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('riskmsdcommit-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="";
		document.getElementById('audituniverse').style.display="none";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="ibm-active";
		document.getElementById('audituniverse-li').className="";
	},true);
	document.getElementById('audituniverse-li').addEventListener('click',function()
	{
		document.getElementById('summary').style.display="none";
		document.getElementById('perfoverview').style.display="none";
		document.getElementById('auditreview').style.display="none";
		document.getElementById('processrating').style.display="none";
		document.getElementById('curating').style.display="none";
		document.getElementById('rctest').style.display="none";
		document.getElementById('riskmsdcommit').style.display="none";
		document.getElementById('audituniverse').style.display="";

		document.getElementById('summary-li').className="";
		document.getElementById('perfoverview-li').className="";
		document.getElementById('auditreview-li').className="";
		document.getElementById('processrating-li').className="";
		document.getElementById('curating-li').className="";
		document.getElementById('rctest-li').className="";
		document.getElementById('riskmsdcommit-li').className="";
		document.getElementById('audituniverse-li').className="ibm-active";
	},true);
}
function AllTableToReportMultiple(table, nameTable){
	var field4rows = $.parseJSON($('textarea#'+nameTable+'DataExport').val());
	var table=table;
	var tab_text="<table border='2px'><thead><tr bgcolor='#87AFC6'>";
	var line = "";
	var tab = $(table);
	var theader=$('#'+table+' tr:eq(0) th');
	for (c=0;c<theader.length;c++){
		test='#'+table+' tr:eq(0) th:eq('+c+')';
		line=line+"<th>"+$(test).text()+"</th>";
	}
	tab_text=tab_text+line+"</tr>"+"</thead><tbody>";
		for(j = 0; j<=field4rows.length; j++){
			var r1 = field4rows[j];
			line="<tr>";
			for(var obj1 in r1){
				var r2 = r1[obj1];line = line+"<td>"+r2+"</td>";
			} //end for obj1
			tab_text=tab_text+line+"</tr>";
		}

	tab_text=tab_text+"</tbody></table>";
	return (tab_text);
}
// Display the selected tab
function displaySelectedBUCompTab(){
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
	if (url.indexOf("curating")!=-1){
  obj= document.getElementById('curating-li');
    if(obj){
      document.getElementById('curating').style.display="";
    }
  }
	if (url.indexOf("rctest")!=-1){
  obj= document.getElementById('rctest-li');
    if(obj){
      document.getElementById('rctest').style.display="";
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
/* End of Business Unit */

/* main */
$(document).ready(function() {
	$('#OpenRisks-link-export').click(function(){
		tableReport = AllTableToReportMultiple('open_risks_treeview', "OpenRisks");
		fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
	});
	$('#OpenRisks-link-export2').click(function(){
		tableReport = AllTableToReportMultiple('open_risks_treeview', "OpenRisks");
		fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
	});
	$('#OpenRisks2-link-export').click(function(){
		tableReport = AllTableToReportMultiple('open_risks2_treeview', "OpenRisks2");
		fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
	});
	$('#OpenRisks2-link-export2').click(function(){
		tableReport = AllTableToReportMultiple('open_risks2_treeview', "OpenRisks2");
		fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
	});
	$('#KCTest1-link-export').click(function(){
		tableReport = AllTableToReportMultiple('KCT1_treeview', "KCTest1");
		fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
	});
	$('#KCTest1-link-export2').click(function(){
		tableReport = AllTableToReportMultiple('KCT1_treeview', "KCTest1");
		fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
	});
	$('#KCTest2-link-export').click(function(){
		tableReport = AllTableToReportMultiple('KCT2_treeview', "KCTest2");
		fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
	});
	$('#KCTest2-link-export2').click(function(){
		tableReport = AllTableToReportMultiple('KCT2_treeview', "KCTest2");
		fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
	});
	$('#KCTest3-link-export').click(function(){
		tableReport = AllTableToReportMultiple('KCT3_treeview', "KCTest3");
		fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
	});
	$('#KCTest3-link-export2').click(function(){
		tableReport = AllTableToReportMultiple('KCT3_treeview', "KCTest3");
		fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
	});
	$('#KC2Test1-link-export').click(function(){
		tableReport = AllTableToReportMultiple('KCT1_treeview', "KC2Test1");
		fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
	});
	$('#KC2Test1-link-export2').click(function(){
		tableReport = AllTableToReportMultiple('KCT1_treeview', "KC2Test1");
		fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
	});
	$('#KC2Test2-link-export').click(function(){
		tableReport = AllTableToReportMultiple('KCT2_treeview', "KC2Test2");
		fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
	});
	$('#KC2Test2-link-export2').click(function(){
		tableReport = AllTableToReportMultiple('KCT2_treeview', "KC2Test2");
		fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
	});
	$('#KC2Test3-link-export').click(function(){
		tableReport = AllTableToReportMultiple('KCT3_treeview', "KC2Test3");
		fnReport($(this), tableReport, "xls", $('h1#pageTitle').text());
	});
	$('#KC2Test3-link-export2').click(function(){
		tableReport = AllTableToReportMultiple('KCT3_treeview', "KC2Test3");
		fnReport($(this), tableReport, "ods", $('h1#pageTitle').text());
	});

  switch ($("input[name='parentdocsubtype']").val()) {
		case "Global Process":
      addEventsCompGP();
    	window.addEventListener("load", displaySelectedGPCompTab());
      break;
		case "Business Unit":
			addEventsCompBU();
			window.addEventListener("load", displaySelectedBUCompTab());
			break;
		case "BU Reporting Group":
		case "BU IOT":
		case "BU IMT":
		case "BU Country":
      addEventsCompBUC();
    	window.addEventListener("load", displaySelectedBUCCompTab());
      break;
  }
});
