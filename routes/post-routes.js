const router = require('express').Router();
const { validate } = require('express-validation');

const PostController = require('../controllers/post-ctrl');
const { create, update, remove, findOne, isExists } = require('../validations/post-validation');
const { hasAuth } = require('../middlewares/auth-middleware');

router.get('/', hasAuth(['admin', 'user']) , PostController.getPosts);

router.get('/:id', hasAuth(['admin', 'user']), validate(findOne), isExists, PostController.getPost);

router.post('/', hasAuth(['admin', 'user']), validate(create), PostController.createPost);

router.put('/:id', hasAuth(['user', 'admin']), validate(update), isExists, PostController.udpatePost);

router.delete('/:id', hasAuth(['admin', 'user']), validate(remove), isExists, PostController.deletePost);

module.exports = router;