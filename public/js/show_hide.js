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

function background_tabs(id,color){
     document.getElementById(id).style.background=color;
}

document.getElementById('GlobalProcess-li').addEventListener('click',function()
{
    document.getElementById('GlobalProcess').style.display="";
    document.getElementById('BUIOTs').style.display="none";
    document.getElementById('BUReportingGroups').style.display="none";
    document.getElementById('ControllableUnits').style.display="none";

    document.getElementById('GlobalProcess-li').className="mira-highlight-tab";
    document.getElementById('BUIOTs-li').className="mira-standard-tab";
    document.getElementById('BUReportingGroups-li').className="mira-standard-tab";
    document.getElementById('ControllableUnits-li').className="mira-standard-tab";
},true);

document.getElementById('BUIOTs-li').addEventListener('click',function()
{
  document.getElementById('GlobalProcess').style.display="none";
  document.getElementById('BUIOTs').style.display="";
  document.getElementById('BUReportingGroups').style.display="none";
  document.getElementById('ControllableUnits').style.display="none";

  document.getElementById('GlobalProcess-li').className="mira-standard-tab";
  document.getElementById('BUIOTs-li').className="mira-highlight-tab";
  document.getElementById('BUReportingGroups-li').className="mira-standard-tab";
  document.getElementById('ControllableUnits-li').className="mira-standard-tab";
},true);

document.getElementById('BUReportingGroups-li').addEventListener('click',function()
{
  document.getElementById('GlobalProcess').style.display="none";
  document.getElementById('BUIOTs').style.display="none";
  document.getElementById('BUReportingGroups').style.display="";
  document.getElementById('ControllableUnits').style.display="none";

  document.getElementById('GlobalProcess-li').className="mira-standard-tab";
  document.getElementById('BUIOTs-li').className="mira-standard-tab";
  document.getElementById('BUReportingGroups-li').className="mira-highlight-tab";
  document.getElementById('ControllableUnits-li').className="mira-standard-tab";
},true);

document.getElementById('ControllableUnits-li').addEventListener('click',function()
{
  document.getElementById('GlobalProcess').style.display="none";
  document.getElementById('BUIOTs').style.display="none";
  document.getElementById('BUReportingGroups').style.display="none";
  document.getElementById('ControllableUnits').style.display="";

  document.getElementById('GlobalProcess-li').className="mira-standard-tab";
  document.getElementById('BUIOTs-li').className="mira-standard-tab";
  document.getElementById('BUReportingGroups-li').className="mira-standard-tab";
  document.getElementById('ControllableUnits-li').className="mira-highlight-tab";
},true);

function init(){
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

//paint tabs on load event
  if(document.getElementById('GlobalProcess-li')){
    background_tabs('GlobalProcess-li','#4181C0');
  }
  if(document.getElementById('BUIOTs-li')){
    background_tabs('BUIOTs-li','#71B2CF');
  }
  if(document.getElementById('BUReportingGroups-li')){
    background_tabs('BUReportingGroups-li','#00C196');
  }
  if(document.getElementById('ControllableUnits-li')){
    background_tabs('ControllableUnits-li','#FF8080');
  }
}

window.addEventListener("load", init());
