const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/users',userController.getAllUsers);
userRouter.get('/users/:userId',userController.getUserById);
userRouter.put('/users/:userId',userController.updateUserById);
userRouter.delete('/users/:userId',userController.deleteUserById);
userRouter.post('/users',userController.storeUser);

module.exports = userRouter;