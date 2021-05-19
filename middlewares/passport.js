const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const { secretKeys } = require('../config');

const bcrypt = require('bcrypt');

const User = require('../models').users;
const Role = require('../models').roles;

passport.use('login', new localStrategy({
        usernameField : 'email',
        passwordField : 'password'
    },
    async (email, password, done) => {
        try {  
            const user = await User.findOne({ 
                where : { email : email }, 
                include : Role
            });
            if (!user)
                return done(null, false, "User doesn't exists!");
            let match = await user.isValidPassword(password);
            if (!match)
                return done(null, false, "Passwords do not match!");
            
            return done(null,user);
        } catch (err) {
            console.log(err)
            done (err);
        }
    })
)


passport.use(
    new jwtStrategy({
        jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey : secretKeys.jwt
    }, async(token, done) => {

        let user = await User.findOne({ 
            where : { id : token.user.id }, 
            include : Role
        });
        
        if (user) {
            token.user.roleId = token.user.role;
            token.user.role = user.role.name;
            return done(null, token.user);
        } else 
            done(null, false, { message : "Invalid token"}) ;
    })
)
