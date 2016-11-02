$(document).ready(function(){
	//Hide left navigation
	//hide_divs();
	//Display notes
	$("#NotesReadOnly").html($("input[name='NotesRO']").val());
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
//click al droplist
	$(".dropdown dt a").on('click', function() {
		$("#"+$(this).attr('name')).slideToggle('fast');
	});

	$(".dropdown dd ul li a").on('click', function() {
		$("#"+$(this).attr('name')).hide();
	});

//click al elemento que sea
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("dropdown")){
			myEditor.saveHTML();
			$(".dropdown dd ul").hide();}
	});

	function updateIDlist(id, scope, selID) {

		var listItems = $("#"+selID+" input");
		var newlist = "";
		listItems.each(function(idx, cbx) {
			if ($("[id='"+scope+""+$(this).val()+"']").is(':checked')) {
				if (newlist == "") newlist = $(this).val();
				else newlist = newlist + "," + $(this).val();
			}
		});
		if (newlist == "") $("#"+selID+"Sel").show();
		$("input[name='" + id +"']").val(newlist);
	};
	$('#btn_save').click(function(evt) {
			myEditor.saveHTML();
			var YmyEditor = myEditor.get('element').value;
			$('#Notes').val(YmyEditor);
			$("#assessableunit").submit();
	});
	$('#btn_cancel').click(function() {
		window.location.href = "/auditlessons";
	});

	$('#btn_edit').click(function() {
		window.location.href = "auditlessonlearned?id="+$("input[name='_id']").val()+"&edit";
	});

		if ( $("input[name='globalProcess']").val() != "") {
			var units = $("input[name='globalProcess']").val().split(",");
			for (var i = 0; i < units.length; ++i) {
				var title = $("[id='processList"+units[0]+"']").prop('name') + ",";
				var html = '<span id="globalProcessList'+units[i]+'" title="' + title + '">' + title + '</span>';

			$("[id='processList']").append(html);
			$("[id='processList"+units[0]+"']").prop('checked', true);
			}
			$("#globalProcessListSel").hide();
			updateIDlist("globalProcess","processList","globalProcessList");
		};

//checar
$('#globalProcessList input[type="checkbox"]').on('click', function() {
	var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
	title = $(this).attr('name') + ",";
	if ($(this).is(':checked')) {
		var html = '<span id="globalProcessList'+$(this).val()+'" title="' + title + '">' + title + '</span>';
		$('#processList').append(html);
		$("#globalProcessListSel").hide();
	} else {
		$("[id='globalProcessList"+$(this).val()+"']").remove();
	}
	updateIDlist("globalProcess","processList","globalProcessList");
});

$('#country').on('change', function() {
	var tmp =  $.parseJSON($('textarea#dataForIOTIMTs').val());
	$('#IMT').val(tmp[this.value].IMT);
	$('#IOT').val(tmp[this.value].IOT);
});

function getSelectedValue(id) {
	return $("#" + id).find("dt a span.value").html();
};

function hide_divs(){
	$('div#ibm-navigation').hide();
};
});
