function hide_divs(){
	if (document.getElementById){
		document.getElementById('ibm-leadspace-head').style.display="none";
		document.getElementById('ibm-navigation').style.display="none";
	}
}
window.onload = function(){
	hide_divs();
	//document.getElementById('username').focus();
};

/*document.getElementById('username').addEventListener('focus',function()
{
    document.getElementById('ErrorLabel').style.display="none";
},true);

document.getElementById('username').addEventListener('click',function()
{
    document.getElementById('ErrorLabel').style.display="none";
},true);*/
