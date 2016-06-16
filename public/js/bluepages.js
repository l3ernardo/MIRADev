/**************************************************************************************************
 * 
 * Bluepages widget for MIRA Web
 * Developed by :                                                
 * Date:08 June 2016
 * 
 */
 
function bpLookup(fldInput,fldOutput) {
//$(function() {
	var fldInput = eval("$('"+fldInput+"')");
	var fldOutput = eval("$('"+fldOutput+"')" );
	fldInput.autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "/bplist",
				dataType: "json",
				data: {
					search: request.term + '*'
				},
				success: function( data ) {
					fldInput.removeClass('ui-autocomplete-loading');
					response( data );
				},
				error: function() {
					fldInput.removeClass('ui-autocomplete-loading');
				},
			});
		},
		minLength: 4,
		focus: function(event, ui) {
			// prevent autocomplete from updating the textbox
			event.preventDefault();
		},		  
		select: function( event, ui ) {
			// prevent autocomplete from updating the textbox
			event.preventDefault();
			// populate the field
			this.value = '';
			fldOutput.val( fldOutput.val()?( ( fldOutput.val()+","+ ui.item.label).split(",")) : ui.item.label );
			fldOutput.val( $.unique((fldOutput.val().split(',')).sort()) );
		},
		open: function() {
			$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
		},
		close: function() {
			$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
		}
	});
//});
}
function showSelectedValues(fldOutput) {
	//var fldOutput = $( "#bplist" );
	var array = [];
	var inputElements = document.getElementsByName('checkgrp');
	//console.log("Qtde elementos do checkbox: " + inputElements.length);
	for(var i=0;i<inputElements.length;i++) {
		if(inputElements[i].checked==false) {
			array.push(inputElements[i].value)
		}
	}
	fldOutput.val( array.toString() );
	ibmweb.overlay.hide('Overlay_Bluepages')
}
function removeItem(fldInput,fldOutput) {
	if(fldOutput.val()=='') return false;
	var templateString = '<div class="ibm-head"><p><a id="closeBtn" class="ibm-common-overlay-close" href="#close">Close [x]</a></p></div><div class="ibm-body"><div class="ibm-main"><div class="ibm-title ibm-subtitle"><h3>Select name(s) to remove</h3></div><div class="ibm-rule"><hr/></div><div class="ibm-container ibm-alternate ibm-buttons-last"><div class="ibm-container-body">';
	var templateStringEnd = '<div class="ibm-rule"><hr/></div><div class="ibm-buttons-row"><p><input class="ibm-btn-arrow-pri" type="button" id="btn_submit" value="OK" onclick="javascript:showSelectedValues($(\''+fldOutput.selector+'\'));"/><span class="ibm-sep"> </span><input class="ibm-btn-cancel-sec" type="button" id="btn_cancel" value="CANCEL" onclick="javascript:ibmweb.overlay.hide(\'Overlay_Bluepages\')"/></p></div></div></div></div></div>';
	
	var fld = fldOutput.val();
	var list = fld.split(',');
	var buffer = '';
	for(var i=0;i<list.length;i++) {
		if(buffer=='') {
			buffer = '<input type="checkbox" name="checkgrp" value="'+list[i]+'" id="'+list[i]+'"><label>'+list[i]+'</label><br>';
		} else {
			buffer = buffer + '<input type="checkbox" name="checkgrp" value="'+list[i]+'" id="'+list[i]+'"><label>'+list[i]+'</label><br>';
		}			
	}
	var dummy = document.getElementById('Overlay_Bluepages');
	var anchor = document.getElementById(fldInput.selector.substring(1,fldInput.selector.length));
	if(dummy==null) {
		var e = document.createElement('div');
		e.innerHTML = '<div class="ibm-common-overlay ibm-overlay-alt" id="Overlay_Bluepages">'+templateString+buffer+templateStringEnd+'</div>';
		while(e.firstChild) {
			anchor.appendChild(e.firstChild);
		}
	} else {
		dummy.innerHTML = templateString+buffer+templateStringEnd;
	}
	ibmweb.overlay.show('Overlay_Bluepages',anchor);
}	