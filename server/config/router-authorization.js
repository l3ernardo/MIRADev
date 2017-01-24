/**************************************************************************************************
 *
 * Used by Restful Authentication - Basic Authentication
 * Developed by : Carlos Kenji Takata
 * Date:06 September 2016
 *
 */
var fs = require('fs');
 
module.exports = function isAuthorized(req, res, next) {
	if(req.session.isAuthenticated) {
		return next();
	} else {
		// Get login credentials, if supplied - used by Restful Authentications
		if(req.headers.authorization!=undefined) {
			var encoded = req.headers.authorization.split(" ");
			var buf = new Buffer(encoded[1], 'base64');
			var userinfo = buf.toString().split(":");
			req.body.username = userinfo[0];
			req.body.password = userinfo[1];
			var credentials = JSON.parse(fs.readFileSync('./APIProfile.json', 'utf8'));
			//console.log('Checking user...');
			if(userinfo[0]==credentials.username || userinfo[0]==credentials.username2) {	
				// if we have to test the user and pass, the code should be here
				// 'ldapjs' module seems to be the one, but it does not work as intended
				//console.log('Authorized!');
				return next();			
			} else {
				//console.log('Unauthorized!');
				req.logout();
				req.session.user = null;
				req.session.isAuthenticated = null;
				req.session.businessunit = null;
				res.setHeader('Content-Type', 'application/json');
				res.send({"status":401});		
			}
		} else {
			//console.log('Unauthorized!');
			req.logout();
			req.session.user = null;
			req.session.isAuthenticated = null;
			req.session.businessunit = null;
			res.setHeader('Content-Type', 'application/json');
			res.send({"status":401});			
		}
	}
};
