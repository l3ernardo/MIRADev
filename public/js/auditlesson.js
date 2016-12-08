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
	//using character counter function
	myEditor.on('editorKeyUp',function(){counter(myEditor)},myEditor,true);
	myEditor.on('editorKeyPress',function(){counter(myEditor)},myEditor,true);
	myEditor.on('editorMouseUp',function(){counter(myEditor)},myEditor,true);
	myEditor.on('editorContentLoaded', function () {counter(myEditor)},myEditor,true);
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

	if($("input[name='editmode']").val()){
		if ( $("input[name='globalProcess']").val() != "") {
			var units = $("input[name='globalProcess']").val().split(",");
			for (var i = 0; i < units.length; ++i) {
				var title = $("[id='processList"+units[i]+"']").prop('name') + ",";
				var html = '<span id="globalProcessList'+units[i]+'" title="' + title + '">' + title + '</span>';

			$("[id='processList']").append(html);
			$("[id='processList"+units[i]+"']").prop('checked', true);
			}
			$("#globalProcessListSel").hide();
			updateIDlist("globalProcess","processList","globalProcessList");
		};
	}
	//list Audit Lessons Learned Key - for CU-not GBS only
		if ( $("input[name='AuditLessonsKey']").val() != "") {
			var units = $("input[name='AuditLessonsKey']").val().split(",");
			for (var i = 0; i < units.length; ++i) {
				var title = $("#lessonsList" + units[i]).prop('name') + ",";
				var html = '<span id="scopeLessonsList'+units[i]+'" title="' + title + '">' + title + '</span>';
				$('#lessonsList').append(html);
				$("#lessonsList" + units[i]).prop('checked', true);
			}
			$("#scopeLessonsListSel").hide();
		}
		//click al elemento que sea
			$(document).bind('click', function(e) {
				var $clicked = $(e.target);
				if (!$clicked.parents().hasClass("dropdown")){
					myEditor.saveHTML();
					$(".dropdown dd ul").hide();}
			});
}

$('#scopeLessonsList input[type="checkbox"]').on('click', function() {
	var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
	title = $(this).attr('name') + ",";
	if ($(this).is(':checked')) {
		var html = '<span id="scopeLessonsList'+$(this).val()+'" title="' + title + '">' + title + '</span>';
		$('#lessonsList').append(html);
		$("#scopeLessonsListSel").hide();
	} else {
		$("[id='scopeLessonsList"+$(this).val()+"']").remove();
	}
	updateIDlist("AuditLessonsKey","lessonsList","scopeLessonsList");
});



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


});
function getSelectedValue(id) {
	return $("#" + id).find("dt a span.value").html();
}

function hide_divs(){
	$('div#ibm-navigation').hide();
}
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
