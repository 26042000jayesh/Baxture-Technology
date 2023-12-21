const CustomErrorHandler = require('../services/CustomErrorHandler');
const User = require('../models/user');
const { userRepository } = require('../repositories/userRepository');
const Joi = require('joi');

const paramCheckSchema = Joi.object({
    userId: Joi.string().uuid()
});

const UserSchema = Joi.object({
    username: Joi.string().required(),
    age: Joi.number().required(),
    hobbies: Joi.array().items(Joi.string()),
});

const userController = {

    async storeUser(req, res, next) {
        try {
            const { error } = UserSchema.validate(req.body);
            if (error) {
                return next(error);
            }
            const { username, age, hobbies } = req.body;
            const userDoc = User.objectToUser({ username, age, hobbies });
            await userRepository.createUser(userDoc);
            return res.status(201).json(userDoc);
        } catch (error) {
            return next(CustomErrorHandler.serverError(error.message));
        }
    },

    async getAllUsers(req, res, next) {
        try {
            let allUsers = await userRepository.findAllUsers();
            return res.status(200).json(allUsers);
        } catch (error) {
            return next(CustomErrorHandler.serverError(error.message));
        }
    },

    async getUserById(req, res, next) {
        try {
            const userId = req.params.userId;
            const { error } = paramCheckSchema.validate({ userId });
            if (error) {
                return next(error);
            }
            let user = await userRepository.findUserById(userId);
            if (!user) {
                return next(CustomErrorHandler.notFound());
            }
            return res.status(200).json(user);
        } catch (error) {
            return next(CustomErrorHandler.serverError(error.message));
        }
    },

    async updateUserById(req, res, next) {
        try {
            const userId = req.params.userId;
            let  error  = paramCheckSchema.validate({ userId }).error;
            if (error) {
                return next(error);
            }
            error = UserSchema.validate(req.body).error;
            if (error) {
                return next(error);
            }
            const { username, age, hobbies } = req.body;
            let user = await userRepository.findUserById(userId);
            if (!user) {
                return next(CustomErrorHandler.notFound());
            }
            const updatedUserDocument = await userRepository.updateUser(userId, { username, age, hobbies });
            return res.status(200).json(updatedUserDocument);
        } catch (error) {
            return next(CustomErrorHandler.serverError(error.message));
        }
    },

    async deleteUserById(req, res, next) {
        try {
            const userId = req.params.userId;
            const { error } = paramCheckSchema.validate({ userId });
            if (error) {
                return next(error);
            }
            let user = await userRepository.findUserById(userId);
            if (!user) {
                return next(CustomErrorHandler.notFound());
            }
            user = await userRepository.deleteUser(userId);
            return res.status(204).json(user);
        } catch (error) {
            return next(CustomErrorHandler.serverError(error.message));
        }
    }
}

module.exports = userController;