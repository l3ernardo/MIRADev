$(document).ready(function() {
	$('h1#pageTitle').text("Parameter");
	$('#btn_submit').click(function(event) {
		if ($('#fldname').val() != '' && $('#fldvalue').val() != '' && $('#flddesc').val() != '') {
			if (IsJsonString($('#fldvalue').val())) {
				$('#form').submit();
			}
			else {
				alert('Please check the JSON format in Value fields');
				event.preventDefault();
				event.stopPropagation();
			}
		}
		else {
			alert('Please fill up all of the fields!');
			event.preventDefault();
			event.stopPropagation();
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
}
function editParam(id) {
	$.ajax({
		url: '/getParam?keyName=' + id,
		type: 'GET',
		success: function(resp) {
			if (resp) {
				//alert(JSON.stringify(resp));
				$('#id').val(resp._id);
				$('#rev').val(resp._rev);
				$('#fldname').val(resp.keyName);
				$('#fldtrue').val(resp.active);
				$('#fldvalue').val(JSON.stringify(resp.value));
				$('#flddesc').val(resp.description);
			}
		},
		error: function(e) {
			alert('error: ' + e);
			return false;
		}  
	}); 
}

function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}