$(document).ready(function() {
	$('#reports_table').DataTable({
		select: true,
		"scrollY": 250,
		"scrollX": true
	});

	//button cancel
	$('#btn_cancel').click(function() {
		alert('close button');
		$('.ui-icon-closethick').click();
	});
});

function editParam(id) {
	//alert('id: ' + id);

    $.ajax({
        url: '/loadParam?id=' + id,
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
        }  
    }); 

    $('#paramContent').dialog({
        modal: true, 
        title: 'Parameter Details', 
        width: 750, 
        height: 'auto',
        position: 'center',
        open: function (event, ui) {
            $('#paramContent').css('overflow', 'hidden');
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

$(function() {
	//submit form
	$('#form').submit(function(e) {
		var form = $('#form')[0];
		var formData = new FormData(form);

		e.preventDefault();

		if ($('#fldname').val() != '' && $('#fldvalue').val() != '' && $('#flddesc').val() != '') {
			//$.blockUI({ message: $('#loader') });
			$.ajax({
				url: e.currentTarget.action,
				type: 'POST',
				data: formData,
				contentType: false,
				processData: false,
				success: function (response) {
					$('.ui-icon-closethick').click();
					//$.unblockUI();
					alert("Event saved successfully");
				},
				error: function() {
					//$.unblockUI();
					alert("There was an error when saving the Event");
				}
			});
		}
		else {
			alert('Please fill out all of the required fields!');
		}
	});

});