/* Start of Business Unit Functions */
// Add listeners to the constinuents tabs
function addEventsConstituentBU(){
	document.getElementById('GlobalProcess-li').addEventListener('click',function()
	{
		document.getElementById('GlobalProcess').style.display="";
		document.getElementById('BUIOTs').style.display="none";
		document.getElementById('BUReportingGroups').style.display="none";
		document.getElementById('ControllableUnits').style.display="none";

		document.getElementById('GlobalProcess-li').className="ibm-active";
		document.getElementById('BUIOTs-li').className="";
		document.getElementById('BUReportingGroups-li').className="";
		document.getElementById('ControllableUnits-li').className="";
	},true);

	document.getElementById('BUIOTs-li').addEventListener('click',function()
	{
	  document.getElementById('GlobalProcess').style.display="none";
	  document.getElementById('BUIOTs').style.display="";
	  document.getElementById('BUReportingGroups').style.display="none";
	  document.getElementById('ControllableUnits').style.display="none";

	  document.getElementById('GlobalProcess-li').className="";
	  document.getElementById('BUIOTs-li').className="ibm-active";
	  document.getElementById('BUReportingGroups-li').className="";
	  document.getElementById('ControllableUnits-li').className="";
	},true);

	document.getElementById('BUReportingGroups-li').addEventListener('click',function()
	{
	  document.getElementById('GlobalProcess').style.display="none";
	  document.getElementById('BUIOTs').style.display="none";
	  document.getElementById('BUReportingGroups').style.display="";
	  document.getElementById('ControllableUnits').style.display="none";

	  document.getElementById('GlobalProcess-li').className="";
	  document.getElementById('BUIOTs-li').className="";
	  document.getElementById('BUReportingGroups-li').className="ibm-active";
	  document.getElementById('ControllableUnits-li').className="";
	},true);

	document.getElementById('ControllableUnits-li').addEventListener('click',function()
	{
	  document.getElementById('GlobalProcess').style.display="none";
	  document.getElementById('BUIOTs').style.display="none";
	  document.getElementById('BUReportingGroups').style.display="none";
	  document.getElementById('ControllableUnits').style.display="";

	  document.getElementById('GlobalProcess-li').className="";
	  document.getElementById('BUIOTs-li').className="";
	  document.getElementById('BUReportingGroups-li').className="";
	  document.getElementById('ControllableUnits-li').className="ibm-active";
	},true);
}
// Display the selected tab
function displaySelectedConstituentBU(){
  var url = parent.location.href;
  s=url.indexOf("GlobalProcess");
  if (s!=-1){
    obj= document.getElementById('GlobalProcess-li');
    if(obj){
      document.getElementById('GlobalProcess').style.display="";
    }
  }
  if (url.indexOf("BUIOTs")!=-1){
    obj= document.getElementById('BUIOTs-li');
    if(obj){
      document.getElementById('BUIOTs').style.display="";
    }
  }
  if (url.indexOf("BUReportingGroups")!=-1){
    obj= document.getElementById('BUReportingGroups-li');
    if(obj){
      document.getElementById('BUReportingGroups').style.display="";
    }
  }
  if (url.indexOf("ControllableUnits")!=-1){
  obj= document.getElementById('ControllableUnits-li');
    if(obj){
      document.getElementById('ControllableUnits').style.display="";
    }
  }
}
/* End of Business Unit Functions */

/* Start of BU IOT Functions */
// Add listeners to the constinuents tabs for BU IOT
function addEventsConstituentBUIOT(){
  document.getElementById('BUIMTs-li').addEventListener('click',function()
	{
	  document.getElementById('BUIMTs').style.display="";
	  document.getElementById('IOTCUs').style.display="none";

	  document.getElementById('BUIMTs-li').className="ibm-active";
	  document.getElementById('IOTCUs-li').className="";
	},true);
  document.getElementById('IOTCUs-li').addEventListener('click',function()
	{
	  document.getElementById('BUIMTs').style.display="none";
	  document.getElementById('IOTCUs').style.display="";

	  document.getElementById('BUIMTs-li').className="";
	  document.getElementById('IOTCUs-li').className="ibm-active";
	},true);
}

// Display the selected tab
function displaySelectedConstituentBUIOT(){
  var url = parent.location.href;
  if (url.indexOf("BUIMTs")!=-1){
    obj= document.getElementById('BUIMTs-li');
    if(obj){
      document.getElementById('BUIMTs').style.display="";
    }
  }
  if (url.indexOf("IOTCUs")!=-1){
    obj= document.getElementById('IOTCUs-li');
    if(obj){
      document.getElementById('IOTCUs').style.display="";
    }
  }
}
/* End of BU IOT Functions */

/* main */
$(document).ready(function() {
  switch ($("input[name='docsubtype']").val()) {
    case "Business Unit":
    	addEventsConstituentBU();
    	window.addEventListener("load", displaySelectedConstituentBU());
      break;
    case "BU IOT":
      addEventsConstituentBUIOT();
    	window.addEventListener("load", displaySelectedConstituentBUIOT());
      break;      
  }
});
