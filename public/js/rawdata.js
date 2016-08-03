function JSONEdit(fldname) {
  var container = document.getElementById('jsoneditor');
  var options = {
    mode: 'view',
  };

  var json = document.getElementById(fldname).innerHTML

  editor = new JSONEditor(container, options, JSON.parse(json));

var url = parent.location.href;
$('#' + url.split('/')[url.split('/').length-1]).addClass('ibm-active');
$('#rawdata-options').show();
$('#rawdata-main').addClass('ibm-active');
}