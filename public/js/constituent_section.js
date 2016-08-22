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

/* Start of BU IMT Functions */
// Add listeners to the constinuents tabs for BU IMT
function addEventsConstituentBUIMT(){
  document.getElementById('BUCountries-li').addEventListener('click',function()
	{
	  document.getElementById('BUCountries').style.display="";
	  document.getElementById('IMTCUs').style.display="none";

	  document.getElementById('BUCountries-li').className="ibm-active";
	  document.getElementById('IMTCUs-li').className="";
	},true);
  document.getElementById('IMTCUs-li').addEventListener('click',function()
	{
	  document.getElementById('BUCountries').style.display="none";
	  document.getElementById('IMTCUs').style.display="";

	  document.getElementById('BUCountries-li').className="";
	  document.getElementById('IMTCUs-li').className="ibm-active";
	},true);
}

// Display the selected tab
function displaySelectedConstituentBUIMT(){
  var url = parent.location.href;
  if (url.indexOf("BUCountries")!=-1){
    obj= document.getElementById('BUCountries-li');
    if(obj){
      document.getElementById('BUCountries').style.display="";
    }
  }
  if (url.indexOf("IMTCUs")!=-1){
    obj= document.getElementById('IMTCUs-li');
    if(obj){
      document.getElementById('IMTCUs').style.display="";
    }
  }
}
/* End of BU IMT Functions */

/* Start of BU Country Functions */
// Add listeners to the constinuents tabs for BU Country
function addEventsConstituentBUCountry(){
  document.getElementById('CPs-li').addEventListener('click',function()
	{
	  document.getElementById('CPs').style.display="";
	  document.getElementById('CountryCUs').style.display="none";

	  document.getElementById('CPs-li').className="ibm-active";
	  document.getElementById('CountryCUs-li').className="";
	},true);
  document.getElementById('CountryCUs-li').addEventListener('click',function()
	{
	  document.getElementById('CPs').style.display="none";
	  document.getElementById('CountryCUs').style.display="";

	  document.getElementById('CPs-li').className="";
	  document.getElementById('CountryCUs-li').className="ibm-active";
	},true);
}

// Display the selected tab
function displaySelectedConstituentBUCountry(){
  var url = parent.location.href;
  if (url.indexOf("CPs")!=-1){
    obj= document.getElementById('CPs-li');
    if(obj){
      document.getElementById('CPs').style.display="";
    }
  }
  if (url.indexOf("CountryCUs")!=-1){
    obj= document.getElementById('CountryCUs-li');
    if(obj){
      document.getElementById('CountryCUs').style.display="";
    }
  }
}
/* End of BU Country Functions */

/* Start of BU Country Functions */
// Add listeners to the constinuents tabs for Country Process
function addEventsConstituentCP(){
  document.getElementById('CPKeyControls-li').addEventListener('click',function()
	{
	  document.getElementById('CPKeyControls').style.display="";
	  document.getElementById('CPCUs').style.display="none";

	  document.getElementById('CPKeyControls-li').className="ibm-active";
	  document.getElementById('CPCUs-li').className="";
	},true);
  document.getElementById('CPCUs-li').addEventListener('click',function()
	{
	  document.getElementById('CPKeyControls').style.display="none";
	  document.getElementById('CPCUs').style.display="";

	  document.getElementById('CPKeyControls-li').className="";
	  document.getElementById('CPCUs-li').className="ibm-active";
	},true);
}

// Display the selected tab
function displaySelectedConstituentCP(){
  var url = parent.location.href;
  if (url.indexOf("CPKeyControls")!=-1){
    obj= document.getElementById('CPKeyControls-li');
    if(obj){
      document.getElementById('CPKeyControls').style.display="";
    }
  }
  if (url.indexOf("CPCUs")!=-1){
    obj= document.getElementById('CPCUs-li');
    if(obj){
      document.getElementById('CPCUs').style.display="";
    }
  }
}
/* End of BU Country Functions */

/* Start of Global Process Functions */
// Add listeners to the constinuents tabs for BU IOT
function addEventsConstituentGP(){
  document.getElementById('CPs-li').addEventListener('click',function()
	{
	  document.getElementById('CPs').style.display="";
	  document.getElementById('SPs').style.display="none";

	  document.getElementById('CPs-li').className="ibm-active";
	  document.getElementById('SPs-li').className="";
	},true);
  document.getElementById('SPs-li').addEventListener('click',function()
	{
	  document.getElementById('CPs').style.display="none";
	  document.getElementById('SPs').style.display="";

	  document.getElementById('CPs-li').className="";
	  document.getElementById('SPs-li').className="ibm-active";
	},true);
}

// Display the selected tab
function displaySelectedConstituentGP(){
  var url = parent.location.href;
  if (url.indexOf("CPs")!=-1){
    obj= document.getElementById('CPs-li');
    if(obj){
      document.getElementById('CPs').style.display="";
    }
  }
  if (url.indexOf("SPs")!=-1){
    obj= document.getElementById('SPs-li');
    if(obj){
      document.getElementById('SPs').style.display="";
    }
  }
}
/* End of Global Process Functions */

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
	  case "BU IMT":
      addEventsConstituentBUIMT();
    	window.addEventListener("load", displaySelectedConstituentBUIMT());
      break;
		case "BU Country":
      addEventsConstituentBUCountry();
    	window.addEventListener("load", displaySelectedConstituentBUCountry());
      break;
		case "Country Process":
      addEventsConstituentCP();
    	window.addEventListener("load", displaySelectedConstituentCP());
      break;
		case "Global Process":
      addEventsConstituentGP();
    	window.addEventListener("load", displaySelectedConstituentGP());
      break;
  }
});
