const routes = require('express').Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../services/auth');

routes.post('/register', userController.register);
routes.post('/login', userController.login);
routes.put('/', isAuthenticated, userController.editProfile);
routes.post('/transaction', isAuthenticated, userController.transaction);

module.exports = routes;
