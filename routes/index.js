const router = require('express').Router();
require('../middlewares/passport');

router.use('/api/auth/', require('./auth-routes'));

router.use('/api/users/', require('./user-routes'));

router.use('/api/posts/', require('./post-routes'));

router.use('/api/comments/', require('./comment-routes'))

module.exports = router;