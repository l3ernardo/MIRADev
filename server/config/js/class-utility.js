	logDoc: function(req, olddoc, newdoc) {
		// this function will compare both documents and provide a list of changed fields
		var fldlist = [];
		if(olddoc=="") {
			var addlog = {
				"name": req.session.user.notesId,
				"date": module.exports.getDateTime("","date"),
				"time": module.exports.getDateTime("","time")
			};
			return {"Log": addlog, "fldlist": fldlist}			
		} else {
			for (fld in newdoc) {
				var cp1 = JSON.stringify(olddoc[fld]);
				var cp2 = JSON.stringify(newdoc[fld]);
				if(cp1!=cp2) {
					fldlist.push("Field (" + fld + "): " + cp1);
				}
			}
			if(fldlist.length>0 && fldlist[0]!="") {
				var addlog = {
					"name": req.session.user.notesId,
					"date": module.exports.getDateTime("","date"),
					"time": module.exports.getDateTime("","time")
				};
				var buff = olddoc["Log"];
				buff.push(addlog);
				return {"Log": buff, "fldlist": fldlist}
			} else {
				return {"Log": olddoc["Log"], "fldlist": ""}
			}
		}
	}
