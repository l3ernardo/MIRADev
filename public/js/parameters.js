var editor;
$(document).ready(function() {

	$('h1#pageTitle').text("Parameter");
	$('#btn_submit').click(function(evt) {
		$('#fldvalue').val(JSON.stringify(editor.get(), null, 2));
		if ($('#fldname').val() != '' && $('#fldvalue').val() != '' && $('#flddesc').val() != '') {
			if (IsJsonString($('#fldvalue').val())) {
				$('#form').submit();
			}
			else {
				alert('Please check the JSON format in Value fields');
				evt.preventDefault();
				evt.stopPropagation();
			}
		}
		else {
			alert('Please fill up all of the fields!');
			evt.preventDefault();
			evt.stopPropagation();
		}
	});
	$('#reports_table').DataTable({
		select: true,
		"scrollY": 250,
		"scrollX": true
	});
	//button cancel
	$('#btn_cancel').click(function() {
		$('.dijitDialogCloseIcon').click();
	});
});
function newParam() {
	$('#id').val('');
	$('#rev').val('');
	$('#fldname').val('');
	$('#fldtrue').val('');
	$('#fldvalue').val('');
	$('#flddesc').val('');
	editor.set({});
}
function editParam(ractive) {
				//$('div#ibm-navigation').hide();
				JSONEdit("fldvalue");

				$('input[name=fldtrue]').each(function() {

					if (ractive == this.value) {
						this.click();
					}
				});
}

function JSONEdit(fldname) {

  var container = document.getElementById('jsoneditor');
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
  var json = document.getElementById(fldname).value;
  editor = new JSONEditor(container, options, JSON.parse(json));

}

function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
