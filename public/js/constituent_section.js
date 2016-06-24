function font_white(searchText){
  var tags = document.getElementsByTagName("a");
  for (var i = 0; i < tags.length; i++) {
    var1=tags[i].textContent;
    if  (var1.indexOf(searchText)!=-1){
      tags[i].style.color='#ffffff';
      break;
    }
  }
}
// Add listeners to the constinuents tabs
function addEventsConstituent(){
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
function displaySelectedConstituent(){
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

$(document).ready(function() {
	addEventsConstituent();
	window.addEventListener("load", displaySelectedConstituent());
});
