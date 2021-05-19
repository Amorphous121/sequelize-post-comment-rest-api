module.exports = {
    dbUri : process.env.DB_URI,
    secretKeys : {
        jwt : process.env.TOKEN_SECRET
    },
    bcryptSalt : {
        salt : process.env.SALT
    }
}