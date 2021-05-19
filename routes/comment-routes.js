const router = require('express').Router();
const { validate } = require('express-validation')
const { hasAuth } = require('../middlewares/auth-middleware');
const CommentController = require('../controllers/comment-ctrl');
const { create, remove, update, findOne, isExists } = require('../validations/comment-validation');

router.get('/', hasAuth(['admin', 'user']), CommentController.getComments);

router.get('/:id', hasAuth(['admin', 'user']), validate(findOne), isExists,CommentController.getComment);

router.post('/', hasAuth(['admin', 'user']), validate(create), CommentController.creatComment);

router.put('/:id', hasAuth(['admin', 'user']), validate(update), isExists, CommentController.updateComment);

router.delete('/:id', hasAuth(['admin', 'user']), validate(remove), isExists, CommentController.deleteComment);


module.exports = router;