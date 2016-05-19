//***************
$(function() {
	//meeting button event
	$('#btn_meeting').click(function() {
		//enable submit and cancel button if they are disabled
		$('#btn_submit').prop("disabled", false);
		$('#btn_cancel').prop("disabled", false);
		$('#btn_delete').hide();
		$('#id').val('');
		$('#rev').val('');
		$('#title').val('');
		$('#startDate').val('');
		$('#endDate').val('');
		$('#eventInfo').val('');
		$('#eventType').attr('value', 'Meeting');
		$('input[type=checkbox]').prop('checked', false);
		$('#divUpload').empty();
		populateDownload(null, null);
		
		$(function(event) {
			$('#eventContent').dialog({
				modal: true, 
				title: 'Event Details', 
				width: 550, 
				height: 'auto',
				position: 'center',
				open: function (event, ui) {
					$('#eventContent').css('overflow', 'hidden');
				}
			});
		});
	});
					
	//milestone button event
	$('#btn_milestone').click(function() {
		//enable submit and cancel button if they are disabled
		$('#btn_submit').prop("disabled", false);
		$('#btn_cancel').prop("disabled", false);
		$('#btn_delete').hide();
		$('#id').val('');
		$('#rev').val('');
		$('#title').val('');
		$('#startDate').val('');
		$('#endDate').val('');
		$('#eventInfo').val('');
		$('#eventType').attr('value', 'Milestone');
		$('input[type=checkbox]').prop('checked', false) ;
		$('#divUpload').empty();
		populateDownload(null, null);

		$(function(event) {
			$('#eventContent').dialog({
				modal: true, 
				title: 'Event Details', 
				width: 550, 
				height: 'auto',
				position: 'center',
				open: function (event, ui) {
					$('#eventContent').css('overflow', 'hidden');
				}
			});
		});
	});

	$('#startDate').datepicker({
		changeMonth: true,
		numberOfMonths: 1
	});

	$('#startDate').change(function() {
		$('#endDate').val($(this).val());
	});

	//submit form
	$('#form').submit(function(e) {
		var form = $('#form')[0];
		var formData = new FormData(form);

		e.preventDefault();

		if ($('#title').val() != '' && $('#startDate').val() != '' && $('#eventInfo').val() != '') {
			$.blockUI({ message: $('#loader') });
			$.ajax({
				url: e.currentTarget.action,
				type: 'POST',
				data: formData,
				contentType: false,
				processData: false,
				success: function (response) {
					$('.ui-icon-closethick').click();
					$('#calendar').fullCalendar('refetchEvents');
					$.unblockUI();
					alert("Event saved successfully");
				},
				error: function() {
					$.unblockUI();
					alert("There was an error when saving the Event");
				}
			});
		}
		else {
			alert('Please fill out all of the required fields!');
		}
	});

	//button cancel
	$('#btn_cancel').click(function() {
		$('.ui-icon-closethick').click();
		$('#btn_submit').prop("disabled", true);
	});

	//button delete
	$('#btn_delete').click(function() {
		var r = confirm("Are you sure you want to delete the event?");
		
		if (r == true) {
			$.blockUI({ message: $('#loader') });
			$.ajax({
				url: "/deleteEvent",
				type: 'GET',
				data: { id: $('#id').val(), rev: $('#rev').val() },
				contentType: 'application/json',
				success: function (response) {
					$('.ui-icon-closethick').click();
					$('#calendar').fullCalendar('refetchEvents');
					$.unblockUI();
					alert("Event deleted successfully");
				},
				error: function() {
					$.unblockUI();
					alert("There was an error when deleting the Event");
				}
			});
		}
	});
});


//**************
$(document).ready(function() {
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
		events: ('/data'),

		eventRender: function (event, element) {
			element.attr('href', 'javascript:void(0);');
			element.click(function() {
				//enable submit and cancel button if they are disabled
				$('#btn_submit').prop("disabled", false);
				$('#btn_cancel').prop("disabled", false);
				$('#btn_delete').prop("disabled", false);
				$('#btn_delete').show();
				$('#eventContent').dialog({
					modal: true, 
					title: 'Event Details', 
					width: 550,
					height: 'auto',
					position: 'center',
					open: function (event, ui) {
						$('#eventContent').css('overflow', 'hidden');
					}
				});
				$('#id').val(event._id);
				$('#rev').val(event._rev);
				$('#title').val(event.title);
				$('#startDate').val(event.start.format("MM/DD/YYYY"));
				$('#endDate').val(event.end.format("MM/DD/YYYY"));
				$('#eventType').val(event.type);
				$('#eventInfo').val(event.description);
				$('#divDownload').empty();
				$('#divUpload').empty();
				$('input[type=checkbox]').prop('checked', false) ;
				
				if (event.regions) {
					var regions = event.regions;

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

				if (event._attachments) {
					var names = Object.keys(event._attachments);
					
					populateDownload(event._id, names);
				}
			});
		}
	}); //end var calendar

	$.ajax({
		url: '/loadRegions',
		type: 'GET',
		success: function(resp) {
			var arrRegions = [];

			for (var i in resp) {
				arrRegions.push(resp[i].country);
			}
			populateRegions(arrRegions);
		},
		error: function(e) {
			alert('error: ' + e);
		}  
	});

}); //document ready

function populateRegions(array) {
	var container = document.getElementById('divRegions');
	var count = 1;
	var tbody = '';
	tbody += '<p style="text-align:left" class="ibm-form-elem-grp">';
	tbody += '<label id="lblRegion" class="ibm-form-grp-lbl">Region:</label>';
	tbody += '<span class="ibm-input-group">';

	for (var i in array) {
		tbody += '<input id="region' + i + '" name="chkRegion" value="' + array[i] + '" type="checkbox">';
		tbody += '<label for="region' + i + '">'  + array[i] + '</label>';

		if ((count % 3) == 0) {
			tbody += '<br>';
		}

		count++;
	}

	tbody += '</span>';
	tbody += '</p>';
	container.innerHTML = tbody;
}

function addUpload() {
	var container = document.getElementById('divUpload');
	var node = document.createElement('input');
	var para = document.createElement('P');
	var span = document.createElement('span');

	para.style = 'text-align:left';
	
	node.class = 'ibm-btn-small';
	node.type = 'file';
	node.name = 'upload[]';
	node.multiple = 'multiple';
	
	container.appendChild(para).appendChild(span).appendChild(node);
}

function populateDownload(id, array) {
	var container = document.getElementById('divDownload');
	var tbody = '';
	var count = 1;

	tbody += '<p style="text-align:left">';
	tbody += '<label for="divDownload">Attachments:</label>';
	tbody += '<span>';

	if (!array) {
		tbody += 'None';
	}

	for (var i in array) {
		tbody += '<a class="ibm-download-link" id="downloadAttachment' + count + '" href="/download?id=' + id + '&filename=' + array[i] + '">' + array[i] + '</a>';
		tbody += '&nbsp;&nbsp;&nbsp;';
		tbody += '<a class="ibm-delete-link" id="deleteAttachment' + count + '" href="javascript:void(0)" onclick="deleteAttachment(' + count + ', \'' + id + '\', \'' + array[i] + '\')">Delete</a>';
		tbody += '<br>';
		count++;
	}

	tbody += '</span>';
	tbody += '</p>';
	tbody += '<div class="ibm-rule"><hr/></div>';

	container.innerHTML = tbody;
}

function deleteAttachment(index, id, filename) {
	var r = confirm("Are you sure you want to delete the attachment?");
	
	if (r == true) {
		$.blockUI({ message: $('#loader') });
		$.ajax({
			url: "/deleteAttachment",
			type: 'GET',
			data: { id: id, filename: filename },
			contentType: 'application/json',
			success: function (response) {
				$('#calendar').fullCalendar('refetchEvents');
				$('#downloadAttachment' + index).remove();
				$('#deleteAttachment' + index).remove();
				$.unblockUI();
				alert("Attachment deleted successfully");
			},
			error: function() {
				$.unblockUI();
				alert("There was an error when deleting the Attachment");
			}
		});
	}
}
