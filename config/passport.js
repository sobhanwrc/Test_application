var md5 = require('md5');
var LocalStrategy   = require('passport-local').Strategy;
// expose this function to our app using module.exports
module.exports = function(passport,admin) {
    var Admin = admin;
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(admin, done) {
        done(null, admin.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Admin.findById(id).then(function(admin) {
 
        if (admin) {
 
            done(null, admin.get());
 
        } else {
 
            done(admin.errors, null);
 
        }
 
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            
            var Admin = admin;
 
            var isValidPassword = function(userpass, password) {
                return  md5(password) == userpass;
                
            }

            Admin.findOne({
            where: {
                email: email
            }
            }).then(function(admin) {
     
                if (!admin) {
                    
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
     
                }
     
                if (!isValidPassword(admin.password, password)) {
                    
                    return done(null, false, req.flash('loginMessage', 'Oops wrong password.'));
     
                }
     
     
                var userinfo = admin.get();
                return done(null, userinfo);
     
     
            }).catch(function(err) {
     
                console.log("Error:", err);
     
                return done(null, false, req.flash('loginMessage', 'Something wrong.Please try again.'));
     
            });
        }
        ));
};