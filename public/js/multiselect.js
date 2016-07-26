/*
  Dropdown with Multiple checkbox select with jQuery - May 27, 2013
  (c) 2013 @ElmahdiMahmoud
  license: http://www.opensource.org/licenses/mit-license.php
*/

$(document).ready(function() {

  if ($("input[name='editmode']").val() == 1) {
    //list current BU Countries included in this assesment
    if ( $("input[name='BUCountryIOT']").val() != "") {
      var units = $("input[name='BUCountryIOT']").val().split(",");
      for (var i = 0; i < units.length; ++i) {
        var title = $("#buclist" + units[i]).prop('name') + ",";
        var html = '<span id="scopeBUC'+units[i]+'" title="' + title + '">' + title + '</span>';
        $('#buclist').append(html);
        $("#buclist" + units[i]).prop('checked', true);
      }
      $("#scopeBUCSel").hide();
    }
    //list current BU Reporting Groups
    if ( $("input[name='BRGMembership']").val() != "") {
      var units = $("input[name='BRGMembership']").val().split(",");
      for (var i = 0; i < units.length; ++i) {
        var title = $("#brglist" + units[i]).prop('name') + ",";
        var html = '<span id="scopeBRG'+units[i]+'" title="' + title + '">' + title + '</span>';
        $('#brglist').append(html);
        $("#brglist" + units[i]).prop('checked', true);
      }
      $("#scopeBRGSel").hide();
    }
    //list current BU Reporting Groups included in this assessment
    if ( $("input[name='RGRollup']").val() != "") {
      var units = $("input[name='RGRollup']").val().split(",");
      for (var i = 0; i < units.length; ++i) {
        var title = $("#rgrlist" + units[i]).prop('name') + ",";
        var html = '<span id="scopeRGR'+units[i]+'" title="' + title + '">' + title + '</span>';
        $('#rgrlist').append(html);
        $("#rgrlist" + units[i]).prop('checked', true);
      }
      $("#scopeRGRSel").hide();
    }
  }

  function updateIDlist(id, scope, selID) {
    var listItems = $("#"+selID+" input");
    var newlist = "";
    listItems.each(function(idx, cbx) {
      if ($("#"+ scope + $(this).val()).is(':checked')) {
        if (newlist == "") newlist = $(this).val();
        else newlist = newlist + "," + $(this).val();
      }
    });
    if (newlist == "") $("#"+selID+"Sel").show();
    $("input[name='" + id +"']").val(newlist)
  }

  $(".dropdown dt a").on('click', function() {
    $("#"+$(this).attr('name')).slideToggle('fast');
  });

  $(".dropdown dd ul li a").on('click', function() {
    $("#"+$(this).attr('name')).hide();
  });

  function getSelectedValue(id) {
    return $("#" + id).find("dt a span.value").html();
  }

  $(document).bind('click', function(e) {
    var $clicked = $(e.target);
    if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
  });

  // On click events for BU Country Field List
  $('#scopeBUC input[type="checkbox"]').on('click', function() {
    var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
    title = $(this).attr('name') + ",";
    if ($(this).is(':checked')) {
      var html = '<span id="scopeBUC'+$(this).val()+'" title="' + title + '">' + title + '</span>';
      $('#buclist').append(html);
      $("#scopeBUCSel").hide();
    } else {
      $("#scopeBUC"+$(this).val()).remove();
    }
    updateIDlist("BUCountryIOT","buclist","scopeBUC");
  });

  // On click events for BU Reporting Groups Field List
  $('#scopeBRG input[type="checkbox"]').on('click', function() {
    var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
    title = $(this).attr('name') + ",";
    if ($(this).is(':checked')) {
      var html = '<span id="scopeBRG'+$(this).val()+'" title="' + title + '">' + title + '</span>';
      $('#brglist').append(html);
      $("#scopeBRGSel").hide();
    } else {
      $("#scopeBRG"+$(this).val()).remove();
    }
    updateIDlist("BRGMembership","brglist","scopeBRG");
  });

  // On click events for BU Reporting Groups Included Field List
  $('#scopeRGR input[type="checkbox"]').on('click', function() {
    var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
    title = $(this).attr('name') + ",";
    if ($(this).is(':checked')) {
      var html = '<span id="scopeRGR'+$(this).val()+'" title="' + title + '">' + title + '</span>';
      $('#rgrlist').append(html);
      $("#scopeRGRSel").hide();
    } else {
      $("#scopeRGR"+$(this).val()).remove();
    }
    updateIDlist("RGRollup","rgrlist","scopeRGR");
  });

});
