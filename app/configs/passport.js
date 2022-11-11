const serviceManageUser = require(__path_services_backend + `manageuser.service`);
const notify  		= require(__path_configs + 'notify');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = function(passport){
    passport.use('local.login',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },
        async function(req, username, password, done) {
            try {
                let checkUser = await serviceManageUser.getUserByEmail(username)
                if(checkUser){
                    let checkPassword = await bcrypt.compare(password,checkUser.password);
                    if(checkPassword){
                        if(checkUser.status === 'active'){
                            return done(null, checkUser);
                        }else{
                            return done(null, false, { message: notify.ERROR_USER_INACTIVE});
                        }
                    }else{
                        return done(null, false, { message: notify.ERROR_LOGIN_PASS});
                    }
                } else {
                    return done(null, false, { message: notify.ERROR_LOGIN_CHECKUSER});
                }
            } catch (error) {
                console.log(error)
                return done(null, false, { message: "Có lỗi xảy ra vui lòng thử lại"});
            }
        }
    ));

    passport.use('local.register',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },  async function(req, username, password, done) {
            try {
                let checkUser = await serviceManageUser.getUserByEmail(username)
                if(checkUser){
                    return done(null, false, { message: notify.ERROR_REGISTER_CHECKUSER});
                }
                let saveUser = await serviceManageUser.saveUser(req.body)
                let sendMail = await serviceManageUser.sendMailRegisterSuccess(req.body.email)
                return done(null, saveUser)
            } catch (error) {
                console.log(error)
                return done(null, false, { message: "Có lỗi xảy ra vui lòng thử lại"});
            }
        }
    ));
    
    passport.serializeUser(function(user, done) {
        done(null, user._id);     
    });
    
    passport.deserializeUser(async function(id, done) {
        let user = await serviceManageUser.getUserById(id)
        done(null, user);
    });
}
