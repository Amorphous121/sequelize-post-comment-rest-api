const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const { bcryptSalt } = require('../config');

module.exports = (sequelize) => {

    const User = sequelize.define('user', {
        first_name : {
            type : DataTypes.STRING(50),
            allowNull : false,
            validate : {
                is : /^[a-zA-Z\s]+$/i,
                len : [3, 50],
            }
        },
        last_name : {
            type : DataTypes.STRING(50),
            allowNull : false,
            validate : {
                is : /^[a-zA-Z\s]+$/i,
                len : [3, 50],
            }
        },
        email : {
            type : DataTypes.STRING(50),
            allowNull : false,
            validate : {
                isEmail : true,
                len : [5, 50]
            }
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        deletedBy : {
            type : DataTypes.INTEGER,
        }
    }, {
        createdAt : false,
        updatedAt : false,
        paranoid : true
    });

    User.addHook('beforeCreate', async (user, options) => {
        user.password = await bcrypt.hash(user.password, 10);
    });

    User.prototype.isValidPassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    }

    return User;
}
