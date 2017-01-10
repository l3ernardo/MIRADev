/**************************************************************************************************
 *
 * MIRA Web identify all user access
 * Date: 06 July 2016
 *
 */

var accessrules = {
	rules: {},
	getRules: function(req, fldlist) {
		/*
			Add access roles and mode
			Format (example): var fldlist = doc[0].AdditionalReaders + doc[0].Owner + doc[0].Focals;
			As the email is the key, no need to concern about arrays; append them all as a single string
		*/
		var usr = "(" + req.session.user.mail + ")";
		var editor = false;
		var admin = false;
		var grantaccess = false;
		var resetstatus = false;
		var cuadmin = false;
		if(fldlist.indexOf(usr) !== -1) {
			editor = true;
		}
		var roles = ['MIRA-ADMIN','MIRA-GRANT-ACCESS','MIRA-RESET-STATUS','MIRA-CU-ADMIN-DATA'];
		for(var i=0;i<roles.length;i++) {
			if(req.session.user.groupName.indexOf(roles[i])!=-1) {
				switch (roles[i]) {
					case 'MIRA-ADMIN':
						admin = true;
						grantaccess = true;
						editor = true;
						break;
					case 'MIRA-GRANT-ACCESS':
						grantaccess = true;
						editor = true;
						break;
					case 'MIRA-RESET-STATUS':
						resetstatus = true;
						break;
					case 'MIRA-CU-ADMIN-DATA':
						cuadmin = true;
						break;
				}
			}
		}
		var rules = {
			"editor":editor,
			"admin":admin,
			"grantaccess":grantaccess,
			"resetstatus":resetstatus,
			"cuadmin":cuadmin
		}
		this.rules = rules;
	}
};

module.exports = accessrules;