var optCal = parent.location.href;
optCal = optCal.split('/');
optCal = optCal[optCal.length -1];
optCal = optCal.replace('?','').replace('=','');


$(document).ready(function() {
	if(optCal == "calendaridall"){
		$('#eventLinks').html('');
		$('h1#pageTitle').text("Integrated");
	}
	//meeting button event
	$('#btn_meeting').click(function() {
		clearFields();
		$('#eventType').attr('value', 'Meeting/Event');
		ibmweb.overlay.show('Overlay_Event');
	});

	$('#startDate').datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1,
		onClose: function () {
     $(this).focus();
    }
	});

	$('#startDate').change(function() {
		$('#endDate').val($(this).val());
	});

	//button submit
	$('#btn_submit').click(function() {
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

	//button copy
	$('#btn_copy').click(function() {
		if ($('#title').val() != '' && $('#startDate').val() != '') {
			//copy to a new event
			$('#id').val('');
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
					alert("Event copied successfully");
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
		events: {
			url:'/getEvents?id='+optCal,
			success: function(data){
				for (var i in data) {
					var objLink = eval("$('ul#calendar-options > li > a#" + data[i].ownerId + "')");
					var style = objLink.parent().attr("style");

					if(style!=undefined){
						style = style.split(": ")[1];
						style = style.split(" none")[0];
						data[i].color = style;
					}
				}
			}
		},

		eventRender: function (event, element) {
			element.attr('href', 'javascript:void(0);');
			element.click(function() {
				clearFields();
				//enable submit and cancel button if they are disabled
				$('#btn_cancel').prop("disabled", false);

				$('#creatorInfo').html('<span style="color: #5C87C4">Created by</span> ' + event.log[0].name + ' <span style="color: #5C87C4">on</span> ' + event.log[0].date +' <span style="color: #5C87C4">at</span> ' + event.log[0].time);
				$('#id').val(event._id);
				$('#rev').val(event._rev);
				$('#eventType').val(event.eventType);
				$('#ownerId').val(event.ownerId);

				$('#eventInfo').val(event.eventInfo);
				$('input[type=checkbox]').prop('checked', false);

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
							//Hide the owner one
							var lblOwner = eval("$('label[for="+this.value+"')");
							lblOwner.show();
							this.style = "";
						});
					}
					var lblOwner = eval("$('label[for="+event.ownerId+"')");
					lblOwner.hide();
					var idOwner = eval("$('input[value="+event.ownerId+"')");
					idOwner.hide();
				}
				if($('input[name=editmode]').val()==1){
					$('#btn_submit').prop("disabled", false);
					$('#btn_delete').prop("disabled", false);
					$('#title').val(event.title);
					$('#owner').val(event.owner);
					$('#startDate').val(event.start.format("MM/DD/YYYY"));
					$('#endDate').val(event.end.format("MM/DD/YYYY"));
					$('input[type=checkbox]').prop('disabled', false);

				}else{
					$('#title').html(event.title);
					$('#owner').html(event.owner);
					$('#startDate').html(event.start.format("MM/DD/YYYY"));
					$('input[type=checkbox]').prop('disabled', true);

				}
				ibmweb.overlay.show('Overlay_Event');
			});
		},

		eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) {
			var allow = $('input[name=editmode]').val();
			if(allow == "1"){
				if (!confirm(event.title + " was moved to: " + event.start.format("MM/DD/YYYY") + ". Are you sure about this change?")) {
					$('#calendar').fullCalendar('refetchEvents');
				}else{
					var aLink = jsEvent.target.parentElement.parentElement;
					var obj = eval("$('a#" + aLink.id + "')");
					obj.click();
					$('#btn_submit').click();
				}
			}else{
				alert("You are not allowed to move a Calendar Event.");
				$('#calendar').fullCalendar('eventRender');
			}
		},
		loading: function(bool) {
			$('#loading').toggle(bool);
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
				//Load other calendars
				arrTCalen.push(resp[i].name);
				arrTCalenIds.push(resp[i].id);
				if(url.indexOf(resp[i].link) >= 0){
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
	$('#id').val('');
	$('#rev').val('');
	$('#title').val('');
	$('#startDate').val('');
	$('#endDate').val('');
	$('#eventInfo').val('');
	$('input[type=checkbox]').prop('checked', false);

	$('input[type=checkbox]').each(function() {
		var lblOwner = eval("$('label[for="+this.id+"')");
		if(this.value == optCal){
			lblOwner.hide();
			this.style = "display:none";
		}else{
			lblOwner.show();
			this.style = "";
		}
	});

	$('#owner').val($('h1#pageTitle').text());
	$('#ownerId').val(optCal);

}

function loadTargetCalendars(names, ids) {
	var container = document.getElementById('divTarCal');
	var count = 1;
	var tbody = '';
	for (var i in names) {
		tbody += '<input id="' + ids[i] + '" name="chkTarCal" value="' + ids[i] + '" type="checkbox">';
		tbody += '<label for="' + ids[i] + '">'  + names[i] + '</label>';
		if ((count % 5) == 0) {
			tbody += '<br/>';
		}
		count++;
	}
	container.innerHTML = tbody;
}
