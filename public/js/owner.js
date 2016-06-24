/*
http://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmperson/%28mail=rodrigok@br.ibm.com%29.search/byjson
Division: div
Department: dept
Job title: jobresponsibilities
Organization / Function: hrorganizationcode
External email address: mail
Phone: telephonenumber
Mobile Phone: mobile
Tie line: tieline
Is manager ? (Y/N): ismanager

(secretaryserialnumber)
http://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmperson/%28ibmserialnumber=114932%29.search/byjson
Assistant Name: cn
Assistant Notes ID: notesemail
Assistant Phone: telephonenumber
Assistant eMail address: mail

bpURL: 'https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmperson/(%f=%t).search/byjson',
bpOrgURL: 'http://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmorganization/hrOrganizationCode=%t.search/byjson',
bpDivURL: 'http://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmdivdept/dept=%t.search/byjson'
*/
function updateOwner() {
	var member = [];
	var email = $("#Owner").html().split("(")[1].split(")")[0];
	email = "rodrigok@br.ibm.com" // for test purposes
	if(email!="") {
		// Owner info
		var div = '';
		var dept = '';
		var jobresponsibilities = '';
		var hrorganizationcode = '';
		var mail = '';
		var telephonenumber = '';
		var mobile = '';
		var tieline = '';
		var ismanager = '';
		var secretaryserialnumber = '';
		// Assistant info (if available)
		var cn='';
		var notesemail = '';
		var stelephonenumber = '';
		var smail = '';  
		$.ajax({
			url: '/bpdata?field=mail&search=' + email,
			type: 'GET',
			success: function(resp) {
				if (resp) {
					//alert(JSON.stringify(resp));
					var doc = JSON.parse(resp);	
					for (var i = 0; i < doc.search.return.count; i++) {
						for(var j=0;j<doc.search.entry[i].attribute.length;j++) {
							//console.log(doc.search.entry[i].attribute.length);
							switch(doc.search.entry[i].attribute[j].name) {
								case 'div':
									div = doc.search.entry[i].attribute[j].value[0];
									break;
								case 'dept':
									dept = doc.search.entry[i].attribute[j].value[0];
									break;
								case 'jobresponsibilities':
									jobresponsibilities = doc.search.entry[i].attribute[j].value[0];
									break;
								case 'hrorganizationcode':
									hrorganizationcode = doc.search.entry[i].attribute[j].value[0];
									break;
								case 'mail':
									mail = doc.search.entry[i].attribute[j].value[0];
									break;
								case 'telephonenumber':
									telephonenumber = doc.search.entry[i].attribute[j].value[0];
									break;
								case 'mobile':
									mobile = doc.search.entry[i].attribute[j].value[0];
									break;
								case 'tieline':
									tieline = doc.search.entry[i].attribute[j].value[0];
									break;
								case 'ismanager':
									ismanager = doc.search.entry[i].attribute[j].value[0];
									break;
								case 'secretaryserialnumber':
									secretaryserialnumber = doc.search.entry[i].attribute[j].value[0];
									break;                
							}
						}
						if(secretaryserialnumber!="") {
							$.ajax({
								url: '/bpdata?field=ibmserialnumber&search=' + secretaryserialnumber,
								type: 'GET',
								success: function(resp) {
									if (resp) {
										var doc = JSON.parse(resp);	
										for (var i = 0; i < doc.search.return.count; i++) {
											for(var j=0;j<doc.search.entry[i].attribute.length;j++) {
												switch(doc.search.entry[i].attribute[j].name) {
													case 'cn':
														cn = doc.search.entry[i].attribute[j].value[0];
														break;
													case 'notesemail':
														notesemail = doc.search.entry[i].attribute[j].value[0];
														break; 
													case 'telephonenumber':
														stelephonenumber = doc.search.entry[i].attribute[j].value[0];
														break; 
													case 'mail':
														smail = doc.search.entry[i].attribute[j].value[0];
														break;                   
												}
											}
										}
										member.push({"fld":"Division","value":div})
										member.push({"fld":"Department","value":dept})
										member.push({"fld":"Job Title","value":jobresponsibilities})
										member.push({"fld":"Organization / Function","value":hrorganizationcode})
										member.push({"fld":"External email address","value":mail})
										member.push({"fld":"Phone","value":telephonenumber})
										member.push({"fld":"Phone mobile","value":mobile})
										member.push({"fld":"Tie Line","value":tieline})
										member.push({"fld":"Is Manager? (Y/N)","value":ismanager})
										member.push({"fld":"Assistant Name","value":cn})
										member.push({"fld":"Assistant Notes ID","value":notesemail})
										member.push({"fld":"Assistant Phone","value":stelephonenumber})
										member.push({"fld":"Assistant email","value":smail})
										loadCodes(member);									
									}
								},
								error: function(e) {
									return false;
								}  
							})
						} else {
							member.push({"fld":"Division","value":div})
							member.push({"fld":"Department","value":dept})
							member.push({"fld":"Job Title","value":jobresponsibilities})
							member.push({"fld":"Organization / Function","value":hrorganizationcode})
							member.push({"fld":"External email address","value":mail})
							member.push({"fld":"Phone","value":telephonenumber})
							member.push({"fld":"Phone mobile","value":mobile})
							member.push({"fld":"Tie Line","value":tieline})
							member.push({"fld":"Is Manager? (Y/N)","value":ismanager})
							member.push({"fld":"Assistant Name","value":cn})
							member.push({"fld":"Assistant Notes ID","value":notesemail})
							member.push({"fld":"Assistant Phone","value":stelephonenumber})
							member.push({"fld":"Assistant email","value":smail})
							loadCodes(member);
						}     
				}
			}},
			error: function(e) {
				return false;
			}  
		})
	}
}

function loadCodes(member) {
	var org = '';
	var dept = '';
	if(member) {
		for(var i=0;i<member.length;i++) {
			if(member[i].fld=='Organization / Function') {
				org = member[i].value
			}
			if(member[i].fld=='Department') {
				dept = member[i].value
			}			
		}
		$.ajax({
			url: '/bporg?search=' + org,
			type: 'GET',
			success: function(resp) {
				if (resp) {
					var doc = JSON.parse(resp);
					for (var i = 0; i < doc.search.return.count; i++) {
						for(var j=0;j<doc.search.entry[i].attribute.length;j++) {
							switch(doc.search.entry[i].attribute[j].name) {
								case 'hrorganizationdisplay':
									org = doc.search.entry[i].attribute[j].value[0];
									for(var k=0;k<member.length;k++) {
										if(member[k].fld=='Organization / Function') {
											member[k].value = org
										}
									}
									break;                
							}
						}
					}
					$.ajax({
						url: '/bpdiv?search=' + dept,
						type: 'GET',
						success: function(resp) {
							if (resp) {
								var doc = JSON.parse(resp);
								for (var i = 0; i < doc.search.return.count; i++) {
									for(var j=0;j<doc.search.entry[i].attribute.length;j++) {
										switch(doc.search.entry[i].attribute[j].name) {
											case 'title':
												dept = doc.search.entry[i].attribute[j].value[0];
												for(var k=0;k<member.length;k++) {
													if(member[k].fld=='Department') {
														member[k].value = dept
													}
												}
												break;                
										}
									}
								}
							}
						},
						error: function(e) {return false;}
					})
					displayOwnerInfo(member);
				}
			},
			error: function(e) {return false;}
		})
	}
}

function displayOwnerInfo(member) {
	var dummy = document.getElementById('Owner');
	$(dummy).after( "<br/><div class='ibm-ind-link'><a class='ibm-forward-em-link' onclick='showHide(document.getElementById(\"OwnerDetails\"))'>Details</a><div id='OwnerInfo'><br/></div>" );	
	var OwnerInfo = document.getElementById('OwnerInfo');
	var x = document.createElement("TABLE");
	x.setAttribute("cellspacing","0")
	x.setAttribute("cellpadding","0")
	x.setAttribute("border","0")
	x.setAttribute("class","ibm-data-table ibm-sortable-table")
    x.setAttribute("id", "OwnerDetails")
	x.setAttribute("style","display:none")
    OwnerInfo.appendChild(x);
	/*
	var y = document.createElement("THEAD");
	x.appendChild(y);
	var t = document.createElement("TR");
	y.appendChild(t);	
	var w = document.createElement("TH");
	t.appendChild(w);
	var w = document.createElement("TH");
	t.appendChild(w);
	*/
	var y = document.createElement("TBODY");
	x.appendChild(y);	
	for(var i=0;i<member.length;i++) {
		var t = document.createElement("TR");
		y.appendChild(t);
		var w = document.createElement("TD");
		var k = document.createTextNode(member[i].fld);
		w.appendChild(k);
		t.appendChild(w);
		var w = document.createElement("TD");
		var k = document.createTextNode(member[i].value);
		w.appendChild(k);
		t.appendChild(w);
	}
	//console.log(member);
}
function showHide(id) {
	if(id.style.display=="none") {
		id.style.display="block";
	} else {
		id.style.display="none";
	}
}