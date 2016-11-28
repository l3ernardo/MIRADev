var register = function(Handlebars) {
	var helpers = {
		// put all of your helpers inside this object
		valuesToString: function(context) {
			return JSON.stringify(context);
		},
		foo: function(){
			return "FOO";
		},
		bar: function(){
			return "BAR";
		},
		multiSelect: function(idSpan, list, id, name, scope) {
			//console.log(list);
			var dataSel = list;
			//console.log(dataSel.length);
			var arr='';

			for(i=0;i<dataSel.length;i++){
				arr += '<br /><li><input type="checkbox" id="'+ idSpan + eval('dataSel[i].' + id) +'" name="'+eval('dataSel[i].'+name)+'" value="'+eval('dataSel[i].'+id)+'" />'+eval('dataSel[i].'+name)+'</li>';
			}

			var ddEle='<dl class="dropdown"><dt><a name="'+scope+'" href="javascript:void(0)"><span id="'+scope+'Sel" class="hida">Select</span><span id="'+idSpan+
				'" class="multiSel"></span></a></dt><dd>'+
				'<div class="mutliSelect"><ul id="'+scope+'">'+
				arr+
				'</ul></div></dd></dl>';
			return ddEle;
		},
		uniqueSelect: function(idSelect, list, optvalue, optname, optsel) {
			var dataSel = list;
			var arr='';
			var listvalue, listname;
			for(i=0;i<dataSel.length;i++){
				listvalue = eval('dataSel[i].' + optvalue);
				listname = eval('dataSel[i].' + optname);
				if(listname==optsel){
					arr += '<option value="' + listvalue + '" selected>' + listname + '</option>';
				}else{
					arr += '<option value="' + listvalue + '">' + listname + '</option>';
				}
			}

			var selElem = '<select id="'+idSelect+'" name="'+idSelect+'">'+
				arr +
				'</select>';

			return selElem;
		},
		//Display icon on Dashboards for each document based on the status field
		statusIcon:function(amstValue, statusValue){
			if(statusValue == "Retired"){
				return "td_icon_empty";
			}
			else{
				if(amstValue == "Draft"){
					return "td_icon_edit";
				}
				else if(amstValue == "Final"){
					return "td_icon_check";
				}
				else if(amstValue == "Ready for Review"){
					return "td_icon_readyreview";
				}
				else if(amstValue == ""){
					return "";
				}
			}
		},
		ratingDisplay: function(rating, field) {
			var ratinghtml;
			if (rating == undefined) {
					ratinghtml = "";
			} else {
				if (rating == "Sat") {
					ratinghtml = '<span style="background-color:#00ff00; padding-left:2em; padding-right:2em">&nbsp;'+rating+'&nbsp;</span>';
				} else {
					if (rating == "Marg") {
						ratinghtml = '<span style="background-color: #ffff00; padding-left:2em; padding-right:2em">'+rating+'</span>';
					} else {
						if (rating == "Unsat") {
							ratinghtml = '<span style="background-color: #ff0000; padding-left:2em; padding-right:2em; color: #ffffff">'+rating+'</span>';
						} else {
							if (field == "NextQtrRating")
								ratinghtml = "NA";
							else
								ratinghtml = rating;
						}
					}
				}
			}
			return ratinghtml;
		},
		auditsRatingDisplay: function(rating) {
			var ratinghtml;
			if (rating == undefined) {
					ratinghtml = "";
			} else {
				if (rating == "Satisfactory") {
					ratinghtml = '<span style="background-color:#00ff00; padding-left:2em; padding-right:2em">&nbsp;'+rating+'&nbsp;</span>';
				} else {
					if (rating == "Marginal") {
						ratinghtml = '<span style="background-color: #ffff00; padding-left:2em; padding-right:2em">'+rating+'</span>';
					} else {
						if (rating == "Unsatisfactory") {
							ratinghtml = '<span style="background-color: #ff0000; padding-left:2em; padding-right:2em; color: #ffffff">'+rating+'</span>';
						}
					}
				}
			}
			return ratinghtml;
		},
		ratingBGDisplay: function(rating, field) {
			var ratinghtml;
			if (rating == undefined) {
					ratinghtml = "";
			} else {
				if (rating == "Sat") {
					ratinghtml = '<span style="background-color:#00ff00; padding-left:1em; padding-right:1em"></span>';
				} else {
					if (rating == "Marg") {
						ratinghtml = '<span style="background-color: #ffff00; padding-left:1em; padding-right:1em"></span>';
					} else {
						if (rating == "Unsat") {
							ratinghtml = '<span style="background-color: #ff0000; padding-left:1em; padding-right:1em; color: #ffffff"></span>';
						} else {
							ratinghtml = "";
						}
					}
				}
			}
			return ratinghtml;
		},
		ratingDisplayView: function(rating, field) {
			var ratinghtml;
			if (rating == undefined) {
					ratinghtml = '<td class="asmt-viewdata"></td>';
			} else {
				if (rating == "Sat")
					ratinghtml = '<td class="asmt-viewdata-green">'+rating+'</td>';
				else if (rating == "Marg")
					ratinghtml = '<td class="asmt-viewdata-yellow">'+rating+'</td>';
				else if (rating == "Unsat")
					ratinghtml = '<td class="asmt-viewdata-red">'+rating+'</td>';
				else
					ratinghtml = '<td class="asmt-viewdata-centered">'+rating+'</td>';
			}
			return ratinghtml;
		},
		defectRateDisplayView: function(dr, margThreshold, unsatThreshold) {
			var drhtml;
			if (dr == undefined || dr == "") {
				drhtml = '<td class="asmt-viewdata-centered">-</td>';
			} else if (margThreshold == undefined || unsatThreshold ==  undefined) {
				drhtml = '<td class="asmt-viewdata-centered">'+dr+'</td>';
			} else {
				if (dr < margThreshold)
					drhtml = '<td class="asmt-viewdata-green">'+dr+'</td>';
				else if (dr >= unsatThreshold)
					drhtml = '<td class="asmt-viewdata-red">'+dr+'</td>';
				else
					drhtml = '<td class="asmt-viewdata-yellow">'+dr+'</td>';
			}
			return drhtml;
		},
		defectRateDisplayViewNoDash: function(dr, margThreshold, unsatThreshold) {
			var drhtml;
			if (dr == undefined || dr == "") {
				drhtml = '<td class="asmt-viewdata-centered"></td>';
			} else if (margThreshold == undefined || unsatThreshold ==  undefined) {
				drhtml = '<td class="asmt-viewdata-centered">'+dr+'</td>';
			} else {
				if (dr < margThreshold)
					drhtml = '<td class="asmt-viewdata-green">'+dr+'</td>';
				else if (dr >= unsatThreshold)
					drhtml = '<td class="asmt-viewdata-red">'+dr+'</td>';
				else
					drhtml = '<td class="asmt-viewdata-yellow">'+dr+'</td>';
			}
			return drhtml;
		},
		TestingRatioDisplay: function(tr, margThresholdTR, unsatThresholdTR) {
			var trhtml;
			if (tr == undefined || tr == "") {
				trhtml = '<td class="asmt-viewdata-centered">-</td>';
			} else if (margThresholdTR == undefined || unsatThresholdTR ==  undefined) {
				trhtml = '<td class="asmt-viewdata-centered">'+tr+'</td>';
			} else {
				if (tr >= margThresholdTR)
					trhtml = '<td class="asmt-viewdata-green">'+tr+'</td>';
				else if (tr < unsatThresholdTR)
					trhtml = '<td class="asmt-viewdata-red">'+tr+'</td>';
				else
					trhtml = '<td class="asmt-viewdata-yellow">'+tr+'</td>';
			}
			return trhtml;
		},
		MissedDataDisplay: function(field, bgcolor) {
			var fieldhtml;
			if (field == undefined || field == "") {
				field = "";
			}
			if (bgcolor == undefined || bgcolor ==  undefined) {
				fieldhtml = '<td class="asmt-viewdata-centered">'+field+'</td>';
			} else {
				if (bgcolor == "Green")
					fieldhtml = '<td class="asmt-viewdata-green">'+field+'</td>';
				else if (bgcolor == "Red")
					fieldhtml = '<td class="asmt-viewdata-red">'+field+'</td>';
				else if (bgcolor == "Yellow")
					fieldhtml = '<td class="asmt-viewdata-yellow">'+field+'</td>';
				else
					fieldhtml = '<td class="asmt-viewdata-centered">'+field+'</td>';
			}
			return fieldhtml;
		},
		UnremedDefectDisplay: function(defect) {
			var defhtml;
			if (defect == undefined || defect == "") {
				defhtml = '<td class="asmt-viewdata-centered">-</td>';
			} else {
				defhtml = '<td class="asmt-viewdata-centered">'+defect+'</td>';
			}
			return defhtml;
		},
		defectRateDisplayViewWpercent: function(dr, margThreshold, unsatThreshold) {
			var drhtml;
			if (dr == undefined || dr == "") {
				drhtml = '<td class="asmt-viewdata"></td>';
			} else if (margThreshold == undefined || unsatThreshold ==  undefined) {
				drhtml = '<td class="asmt-viewdata-centered">'+dr+'%</td>';
			} else {
				if (dr < margThreshold)
					drhtml = '<td class="asmt-viewdata-green">'+dr+'%</td>';
				else if (dr >= unsatThreshold)
					drhtml = '<td class="asmt-viewdata-red">'+dr+'%</td>';
				else
					drhtml = '<td class="asmt-viewdata-yellow">'+dr+'%</td>';
			}
			return drhtml;
		},
		findingDisplay: function(finding) {
			var findinghtml;
			if (finding == undefined) {
			} else {
				if (finding == "No exposures") {
					findinghtml = '<span style="background-color:#00ff00; padding-left:2em; padding-right:2em">'+finding+'</span>';
				} else {
					if (finding == "Exposures found") {
						findinghtml = '<span style="background-color: #ff0000; padding-left:1em; padding-right:1em; color: #ffffff">'+finding+'</span>';
					} else {
						findinghtml = finding;
					}
				}
			}
			return findinghtml;
		},
		dateDisplay: function(date) {
			var datehtml;
			if (date == undefined) {

			} else {
				if (date == "") {
					datehtml = '<span style="padding-left:1em; padding-right:1em">'+date+'</span>';
				} else {
					var currdate = new Date();
					var dateval = new Date(date);
					currdate.setHours(0,0,0,0);
					if(dateval >= currdate)
						datehtml = '<span style="padding-left:1em; padding-right:1em">'+date+'</span>';
					else
						datehtml = '<span style="background-color: #ff0000; padding-left:1em; padding-right:1em; color: #ffffff">'+date+'</span>';
				}
			}
			return datehtml;
		},
		moneyDisplay: function(money) {
			var moneyhtml;
			if (money == undefined) {

			} else {
				if (money == "") {
					moneyhtml = '<span style="padding-left:1em; padding-right:1em"><b>$'+money+'</b></span>';
				} else {

					if(money >= 0)
						moneyhtml = '<span style="padding-left:1em; padding-right:1em; color:#00ff00;"><b>$'+money+'</b></span>';
					else
						moneyhtml = '<span style="padding-left:1em; padding-right:1em; color: #ff0000"><b>$'+money+'</b></span>';
				}
			}
			return moneyhtml;
		},
		openRiskDisplay: function(open, date) {
			var datehtml;
			if (open == undefined) {

			} else {
				if (open < 0) {
					datehtml = '<span style="padding-left:1em; padding-right:1em">$'+date+'</span>';
				} else {
					var currdate = new Date();
					var dateval = new Date(date);
					currdate.setHours(0,0,0,0);
					if(dateval >= currdate)
						datehtml = '<span style="padding-right:1em">'+date+'</span>';
					else
						datehtml = '<span style="background-color: #ff0000; padding-left:1em; padding-right:1em; color: #ffffff">'+date+'</span>';
					}
				}
			return datehtml;
		},
		radioBtnVal: function(fieldName, fieldVal) {
			var radioBtnHtml;
			if (fieldVal == "Yes") {
				radioBtnHtml = '<input type="radio" name="'+fieldName+'" id="'+fieldName+'Yes'+'" value="Yes" checked>Yes<input type="radio" name="'+fieldName+'" id="'+fieldName+'No'+'" value="No">No';
			} else {
				if (fieldVal == "No")
					radioBtnHtml = '<input type="radio" name="'+fieldName+'" id="'+fieldName+'Yes'+'" value="Yes">Yes<input type="radio" name="'+fieldName+'" id="'+fieldName+'No'+'" value="No" checked>No';
				else
					radioBtnHtml = '<input type="radio" name="'+fieldName+'" id="'+fieldName+'Yes'+'" value="Yes">Yes<input type="radio" name="'+fieldName+'" id="'+fieldName+'No'+'" value="No">No'
			}
			return radioBtnHtml;
		},
		in_Count: function(fieldName, fieldId,fieldVal) {
			var nameHtml;
			if (fieldVal == "Total" || fieldVal == "Sat" || fieldVal == "Unsat" || fieldVal == "Marg"  || fieldVal == "Pending" || fieldVal == "Excempt"  || fieldVal == "NR"  ) {
				nameHtml = '';
			} else {
				nameHtml = '<a href="/assessableunit?id='+fieldId+'">'+fieldName+'</a>';
			}
			return nameHtml;
		},
		in_Type: function(fieldName, fieldVal) {
			var nameHtml;
			if (fieldVal == "Total" || fieldVal == "Sat" || fieldVal == "Unsat" || fieldVal == "Marg"  || fieldVal == "Pending" || fieldVal == "Excempt"  || fieldVal == "NR"  ) {
				nameHtml = '';
			} else {
				nameHtml = fieldName;
			}
			return nameHtml;
		},
		if_equal: function(a, b, opts) {
			if(a == b) return opts.fn(this);
     	else return opts.inverse(this);
		},
		if_not_equal: function(a, b, opts) {
			if(a != b) return opts.fn(this);
     	else return opts.inverse(this);
		},
		eq: function(a, b) {
			return a===b;
		},
		submenu: function () {
			if(app.locals.submenu) {
				return app.locals.submenu;
			}
		},
		listWithComa: function(list){
			var newList='';

		if(typeof list != 'undefined'){
			for(i=0; i<list.length; i++){

				if(list.charAt(i) != ',')
				newList += list.charAt(i);
				else
				newList += '</br>';


			}
		}

		return newList;
		},

		getSourceColor: function(option){

			if(option == "WWBCIT")
			return "background-color: #C0E1FF;"
			else return "background-color: #C2FF91;"

		}
	};

	if (Handlebars && typeof Handlebars.registerHelper === "function") {
		// register helpers
		for (var prop in helpers) {
			Handlebars.registerHelper(prop, helpers[prop]);
		}
	} else {
		// just return helpers object if we can't register helpers here
		return helpers;
	}

};

// client
if (typeof window !== "undefined") {
	register(Handlebars);
}
// server
else {
	module.exports.register = register;
	module.exports.helpers = register(null);
}
