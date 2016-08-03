/**************************************************************************************************
 *
 * Developed by : Valdenir Alves (silvav@br.ibm.com)
 * Date:03 Aug 2016
 *
 */
 
module.exports = function simpleAuthentication(req, res, next) {
	console.log('simpleAuth')
	if (req.session.isAuthenticated) {
		return next();
	} else {
		res.redirect('/login');
	}
};