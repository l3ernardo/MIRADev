$(document).ready(function(){
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

  $('#btn_edit').click(function() {
    window.location.href = window.location.href+"&edit";
  });
  $('#btn_save_close').click(function() {
    myEditor.saveHTML();
    var YmyEditor = myEditor.get('element').value;
    $('#Notes').val(YmyEditor);
    $('#close').val("back");

    $("#internalauditform").submit();
  });
  $('#btn_save').click(function(evt) {
    myEditor.saveHTML();
    var YmyEditor = myEditor.get('element').value;
    $('#Notes').val(YmyEditor);
    $("#asmtcomponentform").submit();
  });
  $('#btn_cancel').click(function() {
    window.location.href = "/assessment?id="+$('#parentid').val();
  })
});
