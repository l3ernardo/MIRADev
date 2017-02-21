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
				if(listname==optsel || listvalue==optsel){
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

		ratingDisplayView: function(rating, percent) {
			var ratinghtml = '<td class="';
			if (rating == undefined) {
					ratinghtml += 'asmt-viewdata"'
					if(!isNaN(percent)){
						ratinghtml += ' width="'+percent+'%"';
					}
					ratinghtml += '></td>';
			} else {
				if (rating == "Sat" || rating == "Satisfactory" || rating == "Favorable" || rating == "Unqualified" || rating == "Positive")
					ratinghtml += 'asmt-viewdata-green" style="background-color: #00FF00; text-align: center; !important;"';
				else if (rating == "Marg" || rating == "Marginal")
					ratinghtml += 'asmt-viewdata-yellow"  style="background-color: yellow; text-align: center; !important;"';
				else if (rating == "Unsat" || rating == "Unsatisfactory" || rating == "Qualified" || rating == "Unfavorable" || rating == "Negative")
					ratinghtml += 'asmt-viewdata-red" style="background-color: red; color: #ffffff; text-align: center; !important;"';
				else
					ratinghtml += 'asmt-viewdata-centered" style="text-align: center; !important;"';
				if(!isNaN(percent)){
					ratinghtml += ' width="'+percent+'%"';
				}
				ratinghtml += '>'+rating+'</td>';
			}
			return ratinghtml;
		},
		compDocDRDisplayView: function(rating, field, percent) {
			var ratinghtml = '<td class="';
			if (rating == undefined) {
					ratinghtml += 'asmt-viewdata"';
					if(!isNaN(percent)) {
						ratinghtml += ' width="'+percent+'%"';
					}
					ratinghtml += '></td>';
			} else {
				if (rating == "Sat")
					ratinghtml += 'asmt-viewdata-green" style="background-color: #00FF00 !important;" width="'+percent+'%">'+field+'%</td>';
				else if (rating == "Marg")
					ratinghtml += 'asmt-viewdata-yellow"  style="background-color: yellow !important;" width="'+percent+'%">'+field+'%</td>';
				else if (rating == "Unsat")
					ratinghtml += 'asmt-viewdata-red"  style="background-color: red !important;" width="'+percent+'%">'+field+'%</td>';
				else
					ratinghtml += 'asmt-viewdata-centered" width="'+percent+'%"></td>';
			}
			return ratinghtml;
		},
		defectRateDisplayView: function(dr, margThreshold, unsatThreshold, percent) {
			var drhtml;
			if (dr == undefined || dr == "") {
				if(percent) drhtml = '<td class="asmt-viewdata-centered" width="'+percent+'%"></td>';
				else drhtml = '<td class="asmt-viewdata-centered"></td>';
			} else if (margThreshold == undefined || unsatThreshold ==  undefined) {
				if(percent) drhtml = '<td class="asmt-viewdata-centered" width="'+percent+'%">'+dr+'</td>';
				else drhtml = '<td class="asmt-viewdata-centered">'+dr+'</td>';
			} else {
				if (dr < margThreshold)
					if (percent) drhtml = '<td class="asmt-viewdata-green" width="'+percent+'%">'+dr+'</td>';
					else drhtml = '<td class="asmt-viewdata-green">'+dr+'</td>';
				else if (dr >= unsatThreshold)
					if(percent) drhtml = '<td class="asmt-viewdata-red" width="'+percent+'%">'+dr+'</td>';
					else drhtml = '<td class="asmt-viewdata-red">'+dr+'</td>';
				else
					if(percent) drhtml = '<td class="asmt-viewdata-yellow" width="'+percent+'%">'+dr+'</td>';
					else drhtml = '<td class="asmt-viewdata-yellow">'+dr+'</td>';
			}
			return drhtml;
		},
		defectRateDisplayViewNoDash: function(dr, margThreshold, unsatThreshold, percent) {
			var drhtml = '<td ';
			if (dr == undefined || dr == "") {
				drhtml += ' class="asmt-viewdata-centered" ';
				if(!isNaN(percent)){
					drhtml += ' width="'+percent+'%"';
					}
				drhtml += ' ></td>';
			} else if (margThreshold == undefined || unsatThreshold ==  undefined) {
				drhtml += ' class="asmt-viewdata-centered" ';
				if(!isNaN(percent)){
					drhtml += ' width="'+percent+'%" ';
					}
				drhtml += '>'+dr+'</td>';
			} else {
				if (dr < margThreshold){
					drhtml += ' class="asmt-viewdata-green" ';
				if(!isNaN(percent)){
					drhtml += ' width="'+percent+'%" ';
					}
				drhtml += '>'+dr+'</td>';
				}
				else if (dr >= unsatThreshold){
					drhtml += ' class="asmt-viewdata-red" ';
				if(!isNaN(percent)){
					drhtml += ' width="'+percent+'%" ';
					}
				drhtml += '>'+dr+'</td>';
				}
				else{
					drhtml += ' class="asmt-viewdata-yellow" ';
					if(!isNaN(percent)){
						drhtml += ' width="'+percent+'%" ';
						}
					drhtml += '>'+dr+'</td>';
				}
			}
			return drhtml;
		},

		/*
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
		*/
		TestingRatioDisplay: function(tr, margThresholdTR, unsatThresholdTR, percent) {
			var trhtml;
			if (tr == undefined || tr == "") {
				if(percent) trhtml = '<td class="asmt-viewdata-centered" width="'+percent+'%"></td>';
				else trhtml = '<td class="asmt-viewdata-centered"></td>';
			} else if (margThresholdTR == undefined || unsatThresholdTR ==  undefined) {
				if(percent) trhtml = '<td class="asmt-viewdata-centered" width="'+percent+'%">'+tr+'</td>';
				else trhtml = '<td class="asmt-viewdata-centered">'+tr+'</td>';
			} else {
				if (tr >= margThresholdTR) {
					if(percent) trhtml = '<td class="asmt-viewdata-green" width="'+percent+'%">'+tr+'</td>';
					else trhtml = '<td class="asmt-viewdata-green">'+tr+'</td>';
				}
				else if (tr < unsatThresholdTR) {
					if(percent) trhtml = '<td class="asmt-viewdata-red" width="'+percent+'%">'+tr+'</td>';
					else trhtml = '<td class="asmt-viewdata-red">'+tr+'</td>';
				}
				else {
					if(percent) trhtml = '<td class="asmt-viewdata-yellow" width="'+percent+'%">'+tr+'</td>';
					else trhtml = '<td class="asmt-viewdata-yellow">'+tr+'</td>';
				}
			}
			return trhtml;
		},
		MissedDataDisplay: function(field, bgcolor) {
			var fieldhtml;
			if (field == undefined ) {
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
				defhtml = '<td class="asmt-viewdata-centered"></td>';
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
		dateDisplayView: function(date) {
			var datehtml;
			if (date != undefined) {
				if (date == "") {
					datehtml = '<td class="asmt-viewdata">'+date+'</td>';
				} else {
					var currdate = new Date();
					var dateval = new Date(date);
					currdate.setHours(0,0,0,0);
					if(dateval >= currdate)
						datehtml = '<td class="asmt-viewdata">'+date+'</td>';
					else
						datehtml = '<td class="asmt-viewdata-red"  style="background-color: red !important;">'+date+'</td>';
				}
			} else {
				datehtml = '<td class="asmt-viewdata"></td>';
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
			if (date == undefined) {
				date = '';
			}
			if (open == undefined) {
			} else {
				if (open < 0) {
					datehtml = '<span style="padding-left:1em; padding-right:1em">$'+date+'</span>';
				} else {
					var currdate = new Date();
					var dateval = new Date(date);
					currdate.setHours(0,0,0,0);
					if(dateval < currdate)
						datehtml = '<span style="background-color: #ff0000; padding-left:1em; padding-right:1em; color: #ffffff">'+date+'</span>';
					else
						datehtml = '<span style="padding-left:1em; padding-right:1em;">'+date+'</span>';
					}
				}
			return datehtml;
		},
		statusRatingLclAdt: function(rating) {
				var rateHTML;
			if (rating == "Satisfactory" || rating == "Sat" || rating == "Favorable" || rating == "Positive" || rating == "Qualified") {
				rateHTML = '<span style="background-color: #00ff00; padding-left:1em; padding-right:1em">'+rating+'</span>';
			} else {
				if (rating == "Unsatisfactory" || rating == "unsat" || rating == "Unfavorable" || rating == "Negative" || rating == "Unqualified") {
					rateHTML = '<span style="background-color: #ff0000; padding-left:1em; padding-right:1em; color: #ffffff">'+rating+'</span>';
				} else {
					if (rating == "Marginal") {
						rateHTML = '<span style="background-color: yellow; padding-left:1em; padding-right:1em; color: #000000">'+rating+'</span>';
					} else {
						rateHTML = rating;
					}
				}
			}
			return rateHTML;
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

		if_less: function(a, b, opts) {

			if(isNaN(a))
				a = parseInt(a);
			if(isNaN(b))
				b = parseInt(b);

			if(a < b) return opts.fn(this);
     	else return opts.inverse(this);
		},

		if_greater: function(a, b, opts) {

			if(isNaN(a))
				a = parseInt(a);
			if(isNaN(b))
				b = parseInt(b);

			if(a > b) return opts.fn(this);
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
