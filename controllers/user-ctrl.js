const chalk = require('chalk');
const APIError = require('../utilities/APIError');
const Promise = require('bluebird');

const db = require('../models');
const User = db.users;
const Role = db.roles;
const Post = db.posts;
const Comment = db.comments;
const log = console.log;

exports.createUser = async (req, res, next) => {
    try {
        const { email, password, first_name, last_name } = req.body;

        let user = await User.findOne({ where : { email } });
        if (user) 
            throw new APIError({ status : 400,  message : "User already exists!"});

        const role = await Role.findOne({ where : { name : 'user' }});
        if (!role) 
            throw new APIError({ message : "System roles are not generated yet."});

        let newUser = await User.create({ first_name, last_name, email, password, roleId : role.id });

        if (newUser) return res.status(200).json(newUser);

    } catch (error) {
        log(chalk.bgRedBright.bold("\n\t ", error.message, "\n "));
        return next(error)
    }
}


exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes : ['id', 'first_name', 'last_name', 'email'],
            include : [
                {
                    attributes : ['id','title', 'content'],
                    model : db.posts
                },
                {
                    attributes : ['id','comment'],
                    model : db.comments
                }
            ]
        });
        if (users) 
            return res.status(200).json({ status : 'success', data : users });
        else    
            return res.status(404).json({ status : 'fail', message : "No users were found!!" });

    } catch (error) {
        log(chalk.bgRedBright.bold("\n\t ", error.message, "\n "));
        return next(error)
    }
}

exports.getUser = async (req, res, next) => {
    try {
        
        const user = await User.findByPk(req.params.id, {
            attributes : ['id', 'first_name', 'last_name', 'email'],
            include : [
                {
                    attributes : ['id','title', 'content'],
                    model : db.posts
                },
                {
                    attributes : ['id','comment'],
                    model : db.comments
                }
            ]
        });
        if (user) 
            return res.status(200).json({ status : 'success', data : user });
        else    
            return res.status(404).json({ status : 'fail', message : "No user were found with given id!!" });

    } catch (error) {
        log(chalk.bgRedBright.bold("\n\t ", error.message, "\n "));
        return next(error)
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        
        if (req.user.id == req.params.id) {
            let user = await User.update({ ...req.body }, { where : { id : req.params.id }});
            if (user[0])
                return res.status(200).json({ status : 'success', message : "User updated Successfully." });
            else 
                return res.status(404).json({ status : "fail", message : "No user were found with given id to perform update."})
        } else
            throw new APIError({ status : 401, message : "You Can't update another user's details "});

    } catch (error) {
        log(chalk.bgRedBright.bold("\n\t ", error.message, "\n "));
        return next(error)
    }
}
exports.deleteUser = async (req, res, next) => {
    try {
        if (req.user.id == req.params.id || req.user.role == 'admin'){
            
            const posts = await Post.findAll({ 
                attributes: ['id'],
                where : { userId : req.params.id }
            })
            
            let pList = [];
            
            // gathering post id's of user.
            for (post of posts) {
                pList.push(post.id)
            }
            
            await Promise.mapSeries(pList, (item) => {
                Post.update({ deletedBy : req.user.id }, { where : { id : item }});
                Comment.update({ deletedBy : req.user.id }, { where : { postId : item } });
            });
            await Promise.mapSeries(pList, (item) => {
                Post.destroy({ where : { id : item }});
                Comment.destroy({ where : { postId : item} });
            });

            await Comment.update({ deletedBy : req.user.id }, { where : { userId : req.params.id }})
            await Comment.destroy({ where : { userId : req.params.id }})
            await User.update({ deletedBy : req.user.id }, { where : { id : req.params.id }});

            const user = await User.destroy({ where : { id : req.params.id } });
            if (user) {
                return res.status(200).json({ status : "fail", message : "User deleted successfully."});
            }
            else    
                return res.status(400).json({ status : "success", message : "NO user were found with given id to perfoem deletion."});
            } else 
            throw new APIError({ status : 401, message : "You can't delete another user's details! "});      

        } catch (error) {
            log(chalk.bgRedBright.bold("\n\t ", error.message, "\n "));
        return next(error)
    }
}









/*   user deletion */ 
    // /**** Setting deleted by as Owner itself */
    // await Post.update( { deletedBy : req.user.id }, { where : { userId : req.params.id  }});
    // await Comment.update({ deletedBy : req.user.id }, { where : { userId : req.params.id }});
    
    // /** Deleting the the post, comment, belong to user whose gonna delete now */
    // await Post.destroy({ where : { userId : req.params.id  }});
    // await Comment.destroy({ where : { userId : req.params.id }});