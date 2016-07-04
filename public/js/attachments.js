/**************************************************************************************************
 * 
 * Attachment widget for MIRA Web
 * Developed by: Wendy Villa - Valdenir Silva - Carlos Kenji Takata - Gabriela S. Pailiacho G.
 * Date: 20 June 2016
 * 
 */

var docs_id=[];
var names=[];
var result=[];

/* Create the attachment link  */
function linkAttachments(idSpan, idParent){
	var spanElement = document.getElementById(idSpan.toString());
	$(spanElement).after('<a id="link_attachments" class="ibm-add1-link" href="javascript:void(0)" onclick="addAttachments($(\'#' + idParent.toString() + '\').val(), this.id);">Add Attachments</a>');
	$(spanElement).before('<div id="divDownload"></div>');
};
/* Save the attachment to cloudant */
function saveAttach(){
	$('#formAttachment').submit(function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		var form = $('#formAttachment')[0];
		var formData = new FormData(form);

		$('input#upload').attr('disabled','disabled');
		$('input#btn_saveAttachment').attr('disabled','disabled');
		$('input#btn_cancelOverlay').attr('disabled','disabled');
		$('div#loadingImage').show();

		$.ajax({
			url: e.currentTarget.action,
			type: "POST",
			data: formData,
			contentType: false,
			processData: false,
			success: function (data) {
				$("#divUpload").val('');
				docs_id.push(data.attachId);
				names.push(data.attachName);
				result.push(data);
				$("#attachIDs").val(JSON.stringify(result));
				$('#upload').val('').clone(true);
				ibmweb.overlay.hide("Overlay_Attachments");
				$('input#upload').removeAttr("disabled");
				$('input#btn_saveAttachment').removeAttr("disabled");
				$('input#btn_cancelOverlay').removeAttr("disabled");
				$('div#loadingImage').hide();
				populateDownload(docs_id, names);
			},
			error: function() {
				alert("There was an error when saving the File");
			}
		});	
	});
};
/* Load the Attachments overlay after an idElement*/
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

		var templateString = '<div class="ibm-head"> <p><a id="closeBtn" class="ibm-common-overlay-close" href="#close">Close [x]</a></p></div><div class="ibm-body"><div class="ibm-main"><div class="ibm-container ibm-alternate ibm-buttons-last"><div class="ibm-container-body">';
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


		//show loading image while saving...
		var divLoading = document.createElement('div');
		$(divLoading).attr({
			'id':'loadingImage',
			'style':'display:none'
		})
		var spinnerImage = '<p class="ibm-spinner-large" href="#"></p><br><center><strong>Uploading...</strong></center>';
		$(divLoading).append(spinnerImage);
		$('#divUpload').after(divLoading);

	}

	ibmweb.overlay.show('Overlay_Attachments');
};
/* Fill in the main document the list of attached documents */
function populateDownload(id, array) {

	var container = document.getElementById('divDownload');
	var tbody = '';
	var count = 1;

	if (!array) {
		tbody += '';
	}

	for (var i in array) {
		tbody += '<p style="text-align:left">';
		tbody += '<a class="ibm-download-link" id="downloadAttachment' + count + '" href="/download?id=' + id[i] + '&filename=' + array[i] + '">' + array[i] + '</a>';
		tbody += '&nbsp;&nbsp;&nbsp;';
		tbody += '<a class="ibm-delete-link" id="deleteAttachment' + count + '" href="javascript:void(0)" onclick="deleteAttachment(' + count + ', \'' + id[i] + '\', \'' + array[i] + '\')">Delete</a>';
		tbody += '</p>';
		count++;
	}

	tbody += '<div class="ibm-rule"><hr/></div>';
	container.innerHTML = tbody;
};
/* Delete the selected attachment */
function deleteAttachment(index, id, filename) {
	var r = confirm("Are you sure you want to delete the attachment?");
	if (r == true) {
		$.ajax({
			url: "/deleteAttachment",
			type: 'GET',
			data: { id: id, filename: filename },
			contentType: 'application/json',
			success: function (response) {
				$('#downloadAttachment' + index).remove();
				$('#deleteAttachment' + index).remove();
                var index = docs_id.indexOf(id);
				if(index > -1){
					docs_id.splice(index,1);
					names.splice(index,1);
					result.splice(index,1);
					$("#attachIDs").val(JSON.stringify(result));
					populateDownload(docs_id, names);
				}
				
			},
			error: function() {
				alert("There was an error when deleting the Attachment");
			}
		});
	}
};
/* Load existant attachments */
function loadAttachments(idLinksJson){
	var linksJson = eval("$('#"+idLinksJson+"')");
	
	if(linksJson.val() != ''){
		var arrLinks = $.parseJSON( linksJson.val());
		for(i=0; i<arrLinks.length; i++){
			docs_id.push(arrLinks[i].attachId);
			names.push(arrLinks[i].attachName);
			result.push({"attachId": arrLinks[i].attachId, "attachName": arrLinks[i].attachName})
		}
		populateDownload(docs_id, names);
		linksJson.val(JSON.stringify(arrLinks));
	}
};
/**/
function resetAttachments(){
	docs_id=[];
	names=[];
	result=[];
}