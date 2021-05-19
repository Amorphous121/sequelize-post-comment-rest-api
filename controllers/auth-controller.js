const passport = require('passport');
const db = require('../models');
const chalk = require('chalk');

const { generateJwt } = require('../utilities/helper')

exports.login = async (req, res, next) => {
    try {
        passport.authenticate('login', async (err, user, info) => {
            if (err || !user || info)
                 return next(new Error(info));
            
            req.logIn(user, { session : false }, async (err) => {
                if (err)
                    return next(err);
                const body = { id : user.id, email : user.email, role : user.role.id };
                const token = generateJwt({ user : body });
                return res.sendJson(200, { token });
            })
        })(req, res, next);
    } catch (error) {
        log(chalk.bgRedBright.bold("\n\t ", error.message, "\n "));
        return next(error)
    }
}
