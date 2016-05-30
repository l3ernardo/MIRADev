$(document).ready(function(){
	hide_divs();
	
    $('#btn_submit').click(function() {
        if ($("#selectBU option:selected").text() != '')  {
				$('#selectedBU').val($( "#selectBU option:selected" ).text());
				$('#form').submit();
			
        }else {
            alert('Please select one Business Unit');
        }
    });

	 $.ajax({
		url: '/getParameter?keyName=BusinessUnit',
		type: 'GET',
		success: function(resp) {
		var arrBU = [];
			for (var i in resp) {
				arrBU.push(resp[i].businessUnit);
			}
			fillBU(arrBU);
		
		},
		error: function(e) {
			alert('error: ' + e);
		}
	}); 
});
function hide_divs(){
	$('div#ibm-leadspace-head').hide();
	$('div#ibm-navigation').hide();
};
function fillBU(arrBU) {
	var container = document.getElementById('divBU');
	var count = 0;
	var tbody = '';
	
	tbody += '<label id="lblBU">Business Unit:   </label>';
	tbody += '<select id="selectBU">';

	for (var i in arrBU) {
		tbody += '<option id="BU' + i + '" name="selBU" type="select">' + arrBU[i] + '</option>';
		count++;
	}
	tbody += '</select>';
	container.innerHTML = tbody;
};