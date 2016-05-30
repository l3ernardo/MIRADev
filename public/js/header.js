$(document).ready(function(){
	$.ajax({
		url: "/name",
		type: "GET",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function (response) {
			var name = response.uname;
			updateUserName(name);
		},
		error: function(e) {
			updateUserName('');
		}
	});
	$.ajax({
		url: "/getParameter?keyName=MIRAVersion",
		type: "GET",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function (response) {
			updateHeader(response.title, response.version);
		},
		error: function(e) {
			//updateUI('');
		}
	});
});
/* Update user name with login data*/
function updateUserName(name) {
	$('strong#username').text(name);
	if(name != '')
		$('div#ibm-profile-links').show();
	else
		$('div#ibm-profile-links').hide();
};
/* Update site name and version*/
function updateHeader(title, version) {
	$('p#ibm-site-title').html('<em>' + title + " " + version + '</em>');
};