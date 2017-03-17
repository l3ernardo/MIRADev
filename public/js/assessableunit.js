$(document).ready(function(){
	//Hide left navigation
	//hide_divs();
	//display notes
 	$("#NotesReadOnly").html($("input[name='NotesRO']").val());
	//Code for Cancel button
	$('#btn_cancel').click(function() {
		window.location.href = $("li#breadcrumb > a").attr("href");
	});
	//Code for Save button
	$('#btn_save').click(function(evt) {
		if (valid_au() && validation()) {
			myEditor.saveHTML();
			var YmyEditor = myEditor.get('element').value;
			$('#Notes').val(YmyEditor);
			$("#assessableunit").submit();
		} else {
			evt.preventDefault();
			evt.stopPropagation();
		}
	});
	//Code for Save & Close button
	$('#btn_save_close').click(function(evt) {
		if (valid_au() && validation()) {
			myEditor.saveHTML();
			var YmyEditor = myEditor.get('element').value;
			$('#Notes').val(YmyEditor);
			$('#close').val($("li#breadcrumb > a").attr("href"));
			$("#assessableunit").submit();
		} else {
			evt.preventDefault();
			evt.stopPropagation();
		}
	});
	//Code for Edit button
	$('#btn_edit').click(function() {
		window.location.href = "assessableunit?id=" + $("input[name='docid']").val() + "&edit";
	});
	//Setup some private variables
	var Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event;
	//The SimpleEditor config
	var myConfig = {
		height: '200px',
		width: '100%',
		dompath: true,
		focusAtStart: true
	};
	//Load the SimpleEditor
	myEditor = new YAHOO.widget.SimpleEditor('Notes', myConfig);
	myEditor.render();
	//using character counter function	
	myEditor.on('editorKeyUp',function(){counter(myEditor)},myEditor,true);
	myEditor.on('editorKeyPress',function(){counter(myEditor)},myEditor,true);
	myEditor.on('editorMouseUp',function(){counter(myEditor)},myEditor,true);
	myEditor.on('editorContentLoaded', function () {counter(myEditor)},myEditor,true);
});

function hide_divs(){
	$('div#ibm-navigation').hide();
};

function valid_au() {
	var valid = true;
	var validEmail = true;
	var req_flds = "";
	switch ($("input[name='docsubtype']").val()) {
		case "Country Process":
			if (($("input[name='AuditableFlag']").val() == "Yes" || $("input[name='CUFlag']").val() == "Yes") && $("input[name='CUSize']").val() == "") {
				req_flds = req_flds + "  - Size\n";
				valid = false;
			}
			if ($("input[name='AuditableFlag']").val() == "Yes" && $("input[name='AuditProgram']").val() == "") {
				req_flds = req_flds + "  - Audit Program\n";
				valid = false;
			}
			break;
		case "Controllable Unit":
			if ($("input[name='Portfolio']").val() == "") {
				req_flds = req_flds + "  - Portfolio\n";
				valid = false;
			}
			if ($("input[name='CUSize']").val() == "") {
				req_flds = req_flds + "  - Size\n";
				valid = false;
			}
			if ($("input[name='AuditableFlag']").val() == "") {
				req_flds = req_flds + "  - Auditable Unit\n";
				valid = false;
			} else {
				if ($("input[name='AuditableFlag']").val() == "Yes" && $("input[name='AuditProgram']").val() == "") {
					req_flds = req_flds + "  - Auditable Program\n";
					valid = false;
				}
			}
			break;
		case "BU Reporting Group":
		case "BU IOT":
		case "BU IMT":
		case "BU Country":
		case "Account":
			var ownerName = $("#ownername").val();
			var emailFormat = /(\S+\ )+\(\S+@\S+\.\ibm.com\)/;
			valid = validEmail = emailFormat.test(ownerName);
			break;
		default:
			valid = true;
	}
	if (!validEmail) alert("Incorrect Owner name. Look for the name again and pick the correct one from the result list." + req_flds)
	else	if (!valid) alert("Fields with (*) are required!\n" + req_flds)
	return valid;
};

//character counter
function counter(name) { 
  var string1=name.toString(),
  i=string1.indexOf("#")+1,
  f=string1.indexOf('_');
  use=string1.substring(i,f),
  html = name.saveHTML();
  data2= html.replace(/<\S[^><]*>/g, ''),
  data3= data2.replace(/&nbsp;/g,' ');
  charCount = ((data3.length) ? data3.length : 0),
  ndiv= "<div id='"+use+"_Char"+"'><span title='"+use+"_Char"+"'>Chars:"+charCount+"</span></div>",
  $newdiv1 =ndiv,
  rdiv="#"+use+"_Char",
  $(rdiv).remove(),
  rdiv2="#"+use+"_container";
  $(rdiv2).append($newdiv1);
};
