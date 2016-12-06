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
		if (valid_au()) {
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
		if (valid_au()) {
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
	myEditor.on('editorKeyPress',function(){counter(myEditor)},myEditor,true);
});

function hide_divs(){
	$('div#ibm-navigation').hide();
};

function valid_au() {
	var valid = true;
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
		case "BU IOT":
			if ($("input[name='iotname']").val() == "") {
				req_flds = req_flds + "  - BU IOT\n";
				valid = false;
			}
			break;
		case "BU IMT":
			if ($("input[name='imtname']").val() == "") {
				req_flds = req_flds + "  - BU IMT\n";
				valid = false;
			}
			break;
		case "BU Country":
			if ($("input[name='countryname']").val() == "") {
				req_flds = req_flds + "  - Country\n";
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
		case "Account":
			if ($("input[name='Name']").val() == "") {
				req_flds = req_flds + "  - Name\n";
				valid = false;
			}
			break;
		default:
			valid = true;
	}
	if (!valid) alert("Fields with (*) are required!\n" + req_flds)
	return valid;
};

//character counter
function counter(name) { 
  var string1=name.toString(),
  i=string1.indexOf("#")+1,
  f=string1.indexOf('_');
  use=string1.substring(i,f),
  html = name.saveHTML();
  //data = html.toString(),
  data2= html.replace(/<\S[^><]*>/g, ''),
  data3= data2.replace(/&nbsp;/g,' ');
  charCount = ((data3.length) ? data3.length : 0),
  ndiv= "<div id='"+use+"'><span title='"+use+"'>Chars:"+charCount+"</span></div>",
  $newdiv1 =ndiv,
  rdiv="#"+use,
  $(rdiv).remove(),
  rdiv2="#"+use+"_container";
  $(rdiv2).append($newdiv1);
};
