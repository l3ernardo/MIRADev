function JSONEdit(fldname) {
  var container = document.getElementById('jsoneditor');
  var options = {
    mode: 'view',
  };

  var json = document.getElementById(fldname).innerHTML

  editor = new JSONEditor(container, options, JSON.parse(json));

}
