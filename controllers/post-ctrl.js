const chalk = require('chalk');

const db = require('../models');
const APIError = require('../utilities/APIError');
const Post = db.posts;
const Comment = db.comments;
const log = console.log;

exports.createPost = async (req, res, next) => {
    try {
        const { content, title } = req.body;
        const post = await Post.create({ title , content, userId : req.user.id });
        if (post)
            return res.sendJson(201, post);
    } catch (error) {
        log(chalk.bgRedBright.bold(error.message));
        return next(error)
    }
}

exports.getPosts = async (req, res, next) => {
    try {
        let posts = await Post.findAll({
            attributes : ['id', 'title', 'content'],
            include : [
                {
                    attributes : ['id', 'first_name', 'last_name', 'email'],
                    model : db.users
                },
                {
                    attributes : ['id', 'comment', 'userId'],
                    model : db.comments,
                }
            ]
        });
        if (posts[0])
            return res.sendJson(200, posts);
        else 
            throw new APIError({ status : 404, message : "No posts were found!!"});
    } catch (error) {
        log(chalk.bgRedBright.bold(error.message));
        return next(error)
    }
}

exports.getPost = async (req, res, next) => {
    try {
        let post = await Post.findByPk(req.params.id, { 
            attributes : ['id', 'title', 'content'],
            include : [
                {
                    attributes : ['id', 'first_name', 'last_name', 'email'],
                    model : db.users
                },
                {
                    attributes : ['id', 'comment', 'userId'],
                    model : db.comments,
                }
            ]
        });
        if (post)
            return res.sendJson(200, post);
        else 
            throw new APIError({ status : 404, message : "No post were belong to given id!!"});
    } catch (error) {
        log(chalk.bgRedBright.bold(error.message));
        return next(error);
    }
}

exports.udpatePost = async (req, res, next) => {
    try {

        const postInfo = await Post.findByPk(req.params.id);
        if (postInfo.userId == req.user.id) {
            let post = await Post.update({ ...req.body }, { where : { id : req.params.id }});
            if(post[0])
            return res.sendJson(201, "Post Updated Successfully.");
        } else 
            throw new APIError({ status : 401, message : "You can't update someone's post!!"});
            
    } catch (error) {
        log(chalk.bgRedBright.bold(error.message));
        return next(error)
    }
}
exports.deletePost = async (req, res, next) => {
    try {
        
        const postInfo = await Post.findByPk(req.params.id);
        if (postInfo.userId == req.user.id || req.user.role == 'admin') {

            // Deleting Comments 
            await Comment.update({ deletedBy : req.user.id }, { where : { postId : req.params.id }});
            await Comment.destroy({ where : { postId : req.params.id }});
            // Deleting Post
            await Post.update({ deletedBy : req.user.id }, { where : { id : req.params.id }});
            let post = await Post.destroy({ where : { id : req.params.id }});
            
            if (post)
                return res.sendJson(200, "Post Deleted Successfully..")
            else    
                throw new APIError({ stauts : 400 , message : "Problem While deleting post."});
        } else 
            throw new APIError({ status : 401, message : "You can't delete someone else's post!"});
    } catch (error) {
        log(chalk.bgRedBright.bold(error.message));
        return next(error);
    }
}