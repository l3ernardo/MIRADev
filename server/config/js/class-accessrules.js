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
		var rules = {
			"editor":false,
			"admin":false,
			"grantaccess":false,
			"resetstatus":false,
			"cuadmin":false
		}
		var usr = "(" + req.session.user.mail + ")";
		var editor = false;
		if(fldlist.indexOf(usr) !== -1) {
			editor = true;
		}
		switch(req.session.user.groupName) {
			case "MIRA-ADMIN":
				var rules = {
					"editor":editor,
					"admin":true,
					"grantaccess":true,
					"resetstatus":true,
					"cuadmin":true
				}				
			break;
			case "MIRA-GRANT-ACCESS":
				var rules = {
					"editor":editor,
					"admin":false,
					"grantaccess":true,
					"resetstatus":false,
					"cuadmin":false
				}
				break;
			case "MIRA-RESET-STATUS":
				var rules = {
					"editor":editor,
					"admin":false,
					"grantaccess":false,
					"resetstatus":true,
					"cuadmin":false
				}
			break;
			case "MIRA-CU-ADMIN-DATA":
				var rules = {
					"editor":editor,
					"admin":false,
					"grantaccess":false,
					"resetstatus":false,
					"cuadmin":true
				}
			break;				
		}
		this.rules = rules;
	}			
};

module.exports = accessrules;