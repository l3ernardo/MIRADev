/**************************************************************************************************
 *
 * Initial page store code for MIRA Web
 * Developed by : Carlos Kenji Takata
 * Date:28 June 2016
 *
 */
 
module.exports = function isAuthenticated(req, res, next) {
	if (req.session.isAuthenticated) {
		return next();
	} else {
		if(req.flash('url')=='') {
			// The pages listed below are not going to be cached
			var deniedURLs = ['/submenu','/login','/disclosure','/businessunit'];
			var initialURL = req.originalUrl || req.url;
			if(deniedURLs.indexOf(initialURL)==-1) {req.flash('url', initialURL)} else {req.flash('url', '/')};
		}
		if(typeof req.session.returnTo=='undefined') req.session.returnTo = req.flash('url');
		res.redirect('/login');	
	}
};
