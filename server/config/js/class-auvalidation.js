/**************************************************************************************************
 *
 * MIRA Web validation of assessable unit required fieds
 * Date: 13 August 2016
 *
 */

var auvalidation = {
	validation: {},
	validate: function(req) {
		var valid = true;
		var msg = [];
		switch (req.body.docsubtype) {
			case "Business Unit":
			case "Global Process":
				valid = true;
				break;
			case "Country Process":
				if ((req.body.AuditableFlag == "Yes" || req.body.CUFlag == "Yes") && req.body.CUSize == "") msg.push("Size is required");
				if (req.body.AuditableFlag == "Yes" && req.body.AuditProgram == "") msg.push("Audit program is required");
				break;
			case "BU IOT":
				if (req.body.iotname == "") msg.push("BU IOT is required");
				break;
			case "BU IMT":
				if (req.body.imtname == "") msg.push("BU IMT is required");
				break;
			case "BU Country":
				if (req.body.countryname == "") msg.push("Country is required");
				break;
			case "Controllable Unit":
				if (req.body.Portfolio == "") msg.push("Portfolio is required");
				if (req.body.CUSize == "") msg.push("Size is required");
				if (req.body.AuditableFlag == "") {
					msg.push("Auditabe unit is required");
				} else {
					if (req.body.AuditableFlag == "Yes" && req.body.AuditProgram == "") msg.push("Audit program is required");
				}
				break;
			case "BU Reporting Group":
			case "Account":
				if (req.body.Name == "") msg.push("Name is required");
				break;
			default:
				valid = true;
		}
		if (msg.length > 0) valid = false;
		var validation = {
			"status": valid,
			"message": msg
		};
		this.validation = validation;
	}
};

module.exports = auvalidation;
