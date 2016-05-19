function init(){
    var url = parent.location.href;
     s=url.indexOf("calendars");
     r=url.indexOf("dashboards");
     t=url.indexOf("reports");
     u=url.indexOf("references");
     v=url.indexOf("archive");
	 w=url.indexOf("administrator");
	 
     if (s!=-1){
               obj= document.getElementById('calendar-options');
               if(obj){
                document.getElementById('calendar-options').style.display="";
                document.getElementById('calendars').className="ibm-active";
                //document.getElementById('calendar-options').style.display="";
              }
            }
    if (r!=-1){
        obj= document.getElementById('dashboards-options');
        if (obj){
               document.getElementById('dashboards-options').style.display="";
               document.getElementById('dashboards').className="ibm-active";
             }
   }
   if (t!=-1){
       obj= document.getElementById('reports-options');
       if (obj){
              document.getElementById('reports-options').style.display="";
              document.getElementById('reports').className="ibm-active";
            }
  }
  if (u!=-1){
      obj= document.getElementById('references-options');
      if (obj){
             document.getElementById('references-options').style.display="";
             document.getElementById('references').className="ibm-active";
           }
 }
  if (v!=-1){
      obj= document.getElementById('achive-options');
      if (obj){
             document.getElementById('achive-options').style.display="";
             document.getElementById('archive').className="ibm-active";
           }
 }
  if (w!=-1){
      obj= document.getElementById('administrator-options');
      if (obj){
             document.getElementById('administrator-options').style.display="";
             document.getElementById('administrator').className="ibm-active";
           }
 }
 
}
window.addEventListener("load", init());
