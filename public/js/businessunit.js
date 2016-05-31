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
	var container = $('#divBU');
	var count = 0;
	var tbody = '';
	
	tbody += '<select id="selectBU" class="ibm-styled">';
	
	for (var i in arrBU) {
		tbody += '<option value="' + arrBU[i] + '">' + arrBU[i] + '</option>';
		count++;
	}
	tbody += '</select>';
	container.html(tbody);
};

