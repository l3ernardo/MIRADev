$(document).ready(function(){
	$('h1#pageTitle').text("Setup");
    $('#btn_submit').click(function() {
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
	 $.ajax({
		url: '/loadSetup',
		type: 'GET',
		success: function(resp) {
			if (resp[1]) {
				var BU = resp[1];
				$('#idBU').val(BU._id);
				$('#revBU').val(BU._rev);
				$('#fldname').val(BU.keyName);
				$('#fldtrue').val(BU.active);
				$('#fldvalue').val(JSON.stringify(BU.value));
				$('#flddesc').val(BU.description);
			}
			if (resp[0]) {
				var CM = resp[0];
				$('#idCM').val(CM._id);
				$('#revCM').val(CM._rev);
				$('#fldnameM').val(CM.keyName);
				$('#fldtrueM').val(CM.active);
				$('#fldvalueM').val(JSON.stringify(CM.value));
				$('#flddescM').val(CM.description);
			}
		},
		error: function(e) {
			alert('error: ' + e);
		}
	});
});

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
