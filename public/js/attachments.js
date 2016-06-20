//***************
var s=0;
var docs_id=[];
var names=[];


function saveAttach(){
	$('#formAttachment').submit(function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		var form = $('#formAttachment')[0];
		var formData = new FormData(form);

		$.ajax({			
			url: e.currentTarget.action,
			type: "POST",
			data: formData,
			contentType: false,
			processData: false,			
			success: function (data) {
				s=0;
				$("#divUpload").empty();
				docs_id.push(data.attachId);
				names.push(data.attachName);
				populateDownload(docs_id, names);
				$("#attachIDs").val(JSON.stringify(data));
				$('#upload').val('').clone(true);
				ibmweb.overlay.hide("Overlay_Attachments");
			},
			error: function() {
				alert("There was an error when saving the File");
			}
		});	
	});
};

function addAttachments(parentIdValue, idElement){

	var divOverlay = document.getElementById('Overlay_Attachments');

	if(divOverlay==null){
		var linkAttach = document.getElementById(idElement.toString());
		$(linkAttach).after( "<div id='Overlay_Attachments'><form id='formAttachment'></form></div>" );
		
		divOverlay = document.getElementById('Overlay_Attachments');
		formOverlay = document.getElementById('formAttachment');
		
		$(divOverlay).attr({
			'class':'ibm-common-overlay ibm-overlay-alt'
		});

		$(formOverlay).attr({
			
			'name': 'formAttachment',
			'enctype':'multipart/form-data',
			'method': 'POST',
			'action': '/saveAttachment',
			'onsubmit':'return false;'
		})

		var parentIdValueField = document.createElement('input');
		$(parentIdValueField).attr({
			'id':'parentIdHidden',
			'name': 'parentIdHidden',
			'type':'hidden',
			'value': parentIdValue
		})

		var templateString = '<div class="ibm-head"><p><a id="closeBtn" class="ibm-common-overlay-close" href="#close">Close [x]</a></p></div><div class="ibm-body"><div class="ibm-main"><div class="ibm-container ibm-alternate ibm-buttons-last"><div class="ibm-container-body">';
		var templateStringEnd = '<div class="ibm-rule"><hr/></div><span class="ibm-sep"> </span></p></div></div></div></div>';
		var linkAdd = '<label for="btnAddFiles">Upload Files:</label><span> <br> <div id="divUpload"><input type="file" id="upload" name="upload" class="ibm-btn-small"></div></span>';
		var divBtns = '<div class="ibm-buttons-row"><p><input id="btn_saveAttachment"/><span class="ibm-sep">&nbsp;</span><input id="btn_cancelOverlay"/><span class="ibm-sep">&nbsp;</span></p></div>';
		
		$(formOverlay).append(templateString+linkAdd+templateStringEnd+divBtns, parentIdValueField);
		
		$('input#btn_saveAttachment').attr({
			'class':'ibm-btn-arrow-pri',
			'type':'submit',
			'value': 'SAVE',
			'onclick': 'saveAttach()'
		});
		
		$('input#btn_cancelOverlay').attr({
			'class':'ibm-btn-cancel-sec',
			'type':'button',
			'value': 'CANCEL',
			'onclick': 'ibmweb.overlay.hide(\'Overlay_Attachments\')'
		});
	}

	ibmweb.overlay.show('Overlay_Attachments');
};

function populateDownload(id, array) {

	var container = document.getElementById('divDownload');
	var tbody = '';
	var count = 1;

	tbody += '<p style="text-align:left">';
	tbody += '<label for="divDownload"><b>Attachments:</b></label></br></br>';
	tbody += '<span>';

	if (!array) {
		tbody += '';
	}

	for (var i in array) {
		tbody += '<a class="ibm-download-link" id="downloadAttachment' + count + '" href="/download?id=' + id[i] + '&filename=' + array[i] + '">' + array[i] + '</a>';
		tbody += '&nbsp;&nbsp;&nbsp;';
		tbody += '<a class="ibm-delete-link" id="deleteAttachment' + count + '" href="javascript:void(0)" onclick="deleteAttachment(' + count + ', \'' + id[i] + '\', \'' + array[i] + '\')">Delete</a>';
		tbody += '<br>';
		count++;
	}

	tbody += '</span>';
	tbody += '</p>';
	tbody += '<div class="ibm-rule"><hr/></div>';
	container.innerHTML = tbody;
};

function deleteAttachment(index, id, filename) {
	var r = confirm("Are you sure you want to delete the attachment?");
	if (r == true) {

		var fieldValue = $('#attachIDs').val().split(',');
		var index = fieldValue.indexOf(id);
			if(index > -1){
				fieldValue.splice(index,1);
        		$('#attachIDs').val(fieldValue);
			}

		$.ajax({
			url: "/deleteAttachment",
			type: 'GET',
			data: { id: id, filename: filename },
			contentType: 'application/json',
			success: function (response) {
				$('#downloadAttachment' + index).remove();
				$('#deleteAttachment' + index).remove();
                var index = names.indexOf(filename);
				if (index > -1) {
                      names.splice(index, 1);console.log(names);
                }
				var index2 = docs_id.indexOf(id);
				if (index2 > -1) {
                      docs_id.splice(index2, 1);console.log(docs_id);
                }
				populateDownload(docs_id, names);
			},
			error: function() {
				alert("There was an error when deleting the Attachment");
			}
		});
	}
};