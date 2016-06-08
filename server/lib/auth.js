var express     = require('express'),
    passport    = require('passport'),
    router      = express.Router(),
    middleware    = require('./middleware.js')(passport),
    LdapStrategy  = require('passport-ldapauth'),
    bluegroup  = require('./bluegroups.js');


// =========================================================================
// passport session setup
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, {email:user.email});
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  done(null, obj);
});

// =========================================================================
// LDAP
// =========================================================================
passport.use(
  new LdapStrategy({
    server : {
      url : 'ldaps://bluepages.ibm.com:636',
      searchBase : 'o=ibm.com',
      searchFilter : '(&(mail={{username}})(objectclass=person))'

    },
    passReqToCallback:true
  },
  function(req, user, done) {
	var bg = [];
    console.info("[INFO] Received valid login for "+ req.body.username);
    //importar/require bluegroups y ejecutar getMembersByBG pasandole el user.
      bluegroup.getMembersByBG(req.body.username).then(function(data){

        if (data[0][0].msg == "Success"){

            user.hasAccess = true;
			for(var i=0;i<data.length;i++) {
				bg.push(data[i][0].groupName);
			}
			user.groupName = bg;
			
          }else{

            user.hasAccess = false;
        }
        // Will always have an authenticated user if we get here since passport will indicate the failure upstream.
          process.nextTick(function () {
            return done(null, user);
          });
      });

  })
);

module.exports = passport = router;