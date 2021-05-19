const chalk = require('chalk');

const db = require('../models');

const APIError = require('../utilities/APIError');
const Comment = db.comments;
const Post = db.posts;
const log = console.log;

exports.creatComment = async (req, res, next) => {
    try {

        const { comment, postId } = req.body;
        let data = await Comment.create({ comment , postId, userId : req.user.id });
        if (data)
            return res.sendJson(200, data);
        else    
            throw new APIError({ status : 400, message : "Error while creating comment "}); 
    } catch (error) {
        log(chalk.bgRedBright.bold(error.message));
        next(error)
    }
}


exports.getComments = async (req, res, next) => {
    try {
        const comments = await Comment.findAll({
            attributes : ['id', 'comment'],
            include : [
                {
                    attributes : ['id','first_name', 'last_name', 'email'],
                    model : db.users,
                },
                {
                    attributes : ['id', 'title', 'content'],
                    model : db.posts
                }
            ]
        });
        if(comments[0])
            return res.sendJson(200, comments);
    } catch (error) {
        log(chalk.bgRedBright.bold(error.message));
        next(error)
    }
}

exports.getComment = async (req, res, next) => {
    try {
        const comment = await Comment.findByPk(req.params.id, {
            attributes : ['id', 'comment'],
            include : [
                {
                    attributes : ['id','first_name', 'last_name', 'email'],
                    model : db.users,
                },
                {
                    attributes : ['id', 'title', 'content'],
                    model : db.posts
                }
            ]
        });
        if(comment)
            return res.sendJson(200, comment);
        else    
            throw new APIError({ status : 404, message : "No comment were found with given id!! "});
    } catch (error) {
        log(chalk.bgRedBright.bold(error));
        next(error)
    }
}

exports.updateComment = async (req, res, next) => {
    try {
        const commentInfo = await Comment.findByPk(req.params.id);
        if (commentInfo.userId == req.user.id) {
            const comment = await Comment.update({ ...req.body }, { where : { id : req.params.id }});
            if (comment[0])
                return res.sendJson(201, "Comment is updated Successfully!!");
            else
                throw new APIError({ status : 404, message : "No commnet were found with given id!! "});
        } else 
            throw new APIError({ status : 401, message : "You can't edit someone else's comment!"});
    } catch (error) {
        log(chalk.bgRedBright.bold(error.message));
        next(error)
    }
};
exports.deleteComment = async (req, res, next) => {
    try {
        
        const commentInfo = await Comment.findByPk(req.params.id);
        const postInfo = await Post.findByPk(commentInfo.postId);
        
        if (postInfo.userId == req.user.id || req.user.role == 'admin' || commentInfo.userId == req.user.id) {
            await Comment.update({ deletedBy : req.user.id }, { where : req.params.id });
            comment = await Comment.destroy({ where : { id : req.params.id }});
            if (comment)
                return res.sendJson(200, "Comment is deleted.");
            else 
                throw new APIError({ status : 400, message : "No comment were found with given id!!"});
        } else  
            throw new APIError({ status : 401, message : "You can't delete someone else's comment!"});

    } catch (error) {
        log(chalk.bgRedBright.bold(error.message));
        next(error)
    }
}