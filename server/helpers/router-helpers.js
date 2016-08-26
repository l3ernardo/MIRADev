var register = function(Handlebars) {
	var helpers = {
		// put all of your helpers inside this object
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
		if_equal: function(a, b, opts) {
			if(a == b) return opts.fn(this);
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
