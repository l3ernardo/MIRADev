$(document).ready(function() {
	//meeting button event
	$('#btn_meeting').click(function() {
		clearFields();
		$('#eTitle').text("Meeting/Event");
		$('#eventType').attr('value', 'Meeting/Event');
		ibmweb.overlay.show('Overlay_Event');
	});
					
	//milestone button event
	$('#btn_milestone').click(function() {
		clearFields();
		$('#eTitle').text('Milestone');
		$('#eventType').attr('value', 'Milestone');
		ibmweb.overlay.show('Overlay_Event');
	});

	$('#startDate').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1
	});

	$('#startDate').change(function() {
		$('#endDate').val($(this).val());
	});

	//button submit
	$('#btn_submit').click(function() {
		var opt = parent.location.href;
		if ($('#title').val() != '' && $('#startDate').val() != '') {
			ibmweb.overlay.show('divSavingImg');
			var form = $('#formCalendar');
			$.ajax({
				url: "/saveEvent",
				type: 'POST',
				data: form.serialize(),
				processData: false,
				success: function (data) {
					ibmweb.overlay.hide('divSavingImg');
					ibmweb.overlay.hide('Overlay_Event');
					$('#calendar').fullCalendar('refetchEvents');
					alert("Event saved successfully");
				},
				error: function() {
					ibmweb.overlay.hide('divSavingImg');
					alert("There was an error when saving the Event");
					e.preventDefault();
					e.stopImmediatePropagation();
				}
			});
		}else {
			alert('Please fill out all of the required fields.');
		}
	});
	
	//button cancel
	$('#btn_cancel').click(function() {
		ibmweb.overlay.hide('Overlay_Event');
		$('#btn_submit').prop("disabled", true);
	});

	//button delete
	$('#btn_delete').click(function() {
		var r = confirm("Are you sure you want to delete the event?");
		if (r == true) {
			ibmweb.overlay.show('divDeleteImg');
			$.ajax({
				url: "/deleteEvent",
				type: 'GET',
				data: { id: $('#id').val(), rev: $('#rev').val() },
				contentType: 'application/json',
				success: function (data) {
					ibmweb.overlay.hide('divDeleteImg');
					ibmweb.overlay.hide('Overlay_Event');
					$('#calendar').fullCalendar('refetchEvents');
					alert("Event deleted successfully");
				},
				error: function() {
					ibmweb.overlay.hide('divDeleteImg');
					alert("There was an error when deleting the Event");
				}
			});
		}
	});

	var opt = parent.location.href;
	opt = opt.split('?');
	opt = opt[opt.length -1];
	if(opt != "id=all"){
		$('#eventLinks').show();
	}
	
	$('#calendar').fullCalendar({
		schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
		header:	{
			left: 'today',
			center: 'prev title next',
			right: 'month,basicDay,basicWeek'
		},
		fixedWeekCount: false,
		defaultView: 'month',
		forceEventDuration: true,
		selectable: true,
		selectHelper: false,

		select: function(start, end) {
			$('#calendar').fullCalendar('unselect');
		},

		editable: true,
		events: ('/getEvents?'+opt),

		eventRender: function (event, element) {
			element.attr('href', 'javascript:void(0);');
			element.click(function() {
				clearFields();
				//enable submit and cancel button if they are disabled
				$('#btn_submit').prop("disabled", false);
				$('#btn_cancel').prop("disabled", false);
				$('#btn_delete').prop("disabled", false);
				$('#btn_delete').show();
				$('#id').val(event._id);
				$('#rev').val(event._rev);
				$('#title').val(event.title);
				$('#startDate').val(event.start.format("MM/DD/YYYY"));
				$('#endDate').val(event.end.format("MM/DD/YYYY"));
				$('#eventType').val(event.eventType);
				$('#eventInfo').val(event.eventInfo);
				$('#owner').val(event.owner);
				$('#ownerId').val(event.ownerId);
				// get creationBy and creationDate
				$('#attachIDs').val(event.attachIDs);
				$('input[type=checkbox]').prop('checked', false);
				$('#eTitle').text(event.eventType);
				if (event.targetCalendar) {
					var regions = event.targetCalendar;
					if (typeof regions === 'string') {
						regions = [regions];
					}
					for (var i in regions) {
						$('input[type=checkbox]').each(function() {
							if (regions[i] == this.value) {
								this.checked = true;
							}
							
						});
					}
				}
				loadAttachments('attachIDs');
				ibmweb.overlay.show('Overlay_Event');
			});
		}
	}); //end var calendar

	$.ajax({
		url: '/getTargetCalendars',
		type: 'GET',
		success: function(resp) {
			var arrTCalen = [];
			var arrTCalenIds = [];
			for (var i in resp) {
				var url = parent.location.href;
				//Load only the other calendars
				if(url.indexOf(resp[i].link) < 0){
					arrTCalen.push(resp[i].name);
					arrTCalenIds.push(resp[i].id);
				}
				else{
					$('#owner').val(resp[i].name);
					$('#ownerId').val(resp[i].id);
					$('h1#pageTitle').text(resp[i].name);
				}
					
				
				
			}
			loadTargetCalendars(arrTCalen, arrTCalenIds);
		},
		error: function(e) {
			alert('error: ' + e);
		}  
	});

}); //document ready

function clearFields(){
	$('#btn_submit').prop("disabled", false);
	$('#btn_cancel').prop("disabled", false);
	$('#btn_delete').hide();
	$('#id').val('');
	$('#rev').val('');
	$('#title').val('');
	$('#start').val('');
	$('#end').val('');
	$('#eventInfo').val('');
	$('#attachIDs').val('');
	$('#divDownload').html('');
	resetAttachments();
	$('input[type=checkbox]').prop('checked', false);
}

function loadTargetCalendars(names, ids) {
	var opt = parent.location.href;
	opt = opt.split('id=');
	opt = opt[opt.length -1];
	var container = document.getElementById('divTarCal');
	var count = 1;
	var tbody = '';
	for (var i in names) {
		if(ids[i] != opt){
			tbody += '<input id="' + ids[i] + '" name="chkTarCal" value="' + ids[i] + '" type="checkbox">';
			tbody += '<label for="' + ids[i] + '">'  + names[i] + '</label>';
			if ((count % 5) == 0) {
				tbody += '<br/>';
			}
			count++;
		}
	}
	container.innerHTML = tbody;
}