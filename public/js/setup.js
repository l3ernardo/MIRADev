var editor;
var editorM;
$(document).ready(function(){
	$('h1#pageTitle').text("Setup");
    $('#btn_submit').click(function() {
		$('#fldvalue').val(JSON.stringify(editor.get(), null, 2));
		$('#fldvalueM').val(JSON.stringify(editorM.get(), null, 2));
        if ($('#fldname').val() != '' && $('#fldvalue').val() != '' && $('#flddesc').val() != '' && $('#fldnameM').val() != '' && $('#fldvalueM').val() != '' && $('#flddescM').val() != '') {
            if (IsJsonString($('#fldvalue').val()) && IsJsonString($('#fldvalueM').val())) {
                $('#formsetup').submit();
            }
            else {
                alert('Please check the JSON format in Value fields');
            }
        }
        else {
            alert('Please fill up all of the fields!');
        }
    });
});

function JSONEdit(fldname, type, container) {
  var container = document.getElementById(container);
  var options = {
    mode: 'text',
    modes: ['code', 'text', 'view'], // allowed modes
    onError: function (err) {
      alert(err.toString());
    },
    onModeChange: function (newMode, oldMode) {
      console.log('Mode switched from', oldMode, 'to', newMode);
    }
  };
  var json = document.getElementById(fldname).innerHTML
  if(type=="BU"){
	editor = new JSONEditor(container, options, json);
  }else{
	editorM = new JSONEditor(container, options, json);
  }
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function changeTabCM() {
    var divBU = document.getElementById('divBU');
    var divCM = document.getElementById('divCM');
    var tabBU = document.getElementById('tabBU');
    var tabCM = document.getElementById('tabCM');

    divBU.style = 'display:none';
    divCM.style = 'display:true';
    tabCM.setAttribute('class', 'ibm-highlight-tab');
    tabBU.setAttribute('class', '');
}

function changeTabBU() {
    var divBU = document.getElementById('divBU');
    var divCM = document.getElementById('divCM');
    var tabBU = document.getElementById('tabBU');
    var tabCM = document.getElementById('tabCM');

    divBU.style = 'display:true';
    divCM.style = 'display:none';
    tabBU.setAttribute('class', 'ibm-highlight-tab');
    tabCM.setAttribute('class', '');
}
