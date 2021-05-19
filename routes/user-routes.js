const router = require('express').Router();
const { validate } = require('express-validation');
const UserController = require('../controllers/user-ctrl');

const { hasAuth } = require('../middlewares/auth-middleware');
const { create, update, remove, findOne, isExists } = require('../validations/user-validation');

router.get('/', hasAuth(['user', 'admin']), UserController.getUsers);

router.get('/:id', hasAuth(['user', 'admin']), validate(findOne), isExists ,UserController.getUser);

router.post('/', validate(create) ,UserController.createUser);

router.put('/:id', hasAuth(['user','admin']), validate(update), isExists, UserController.updateUser);

router.delete('/:id', hasAuth(['user', 'admin']), validate(findOne), isExists, UserController.deleteUser);

module.exports = router;