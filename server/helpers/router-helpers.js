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
		uniqueSelect: function(idSelect, list, value) {
			var dataSel = list[0].options;
			var arr='';

			for(i=0;i<dataSel.length;i++){
				arr += '<option value="' + eval('dataSel[i].' + value) + '">' + eval('dataSel[i].' + value) + '</option>';
			}
			
			var selElem = '<select id="'+idSelect+'">'+
				arr +
				'</select>';
			
			return selElem;
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
