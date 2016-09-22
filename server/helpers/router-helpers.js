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
		ratingDisplay: function(rating, field) {
			var ratinghtml;
			if (rating == "Sat") {
				ratinghtml = '<span style="background-color:#00ff00; padding-left:3em; padding-right:3em">'+rating+'</span>';
			} else {
				if (rating == "Marg") {
					ratinghtml = '<span style="background-color: #ffff00; padding-left:3em; padding-right:3em">'+rating+'</span>';
				} else {
					if (rating == "Unsat") {
						ratinghtml = '<span style="background-color: #ff0000; padding-left:3em; padding-right:3em">'+rating+'</span>';
					} else {
						if (field = "NextQtrRating")
							ratinghtml = "NA";
						else
							ratinghtml = rating;
					}
				}
			}
			return ratinghtml;
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
