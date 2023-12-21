const InMemoryDB = require("../database/inMemoryDB");
const User = require('../models/user');


class UserRepository {
    #dataStorage
    constructor(dataStorage) {
        this.#dataStorage = dataStorage;
    }

    async findAllUsers() {
        return await this.#dataStorage.getAll();
    }

    async findUserById(id) {
        return await this.#dataStorage.getById('id', id);
    }

    async createUser(user) {
        const userDoc = user instanceof User ? user : User.objectToUser(user);
        await this.#dataStorage.add(userDoc);
        return userDoc;
    }

    async updateUser(id, payload) {
        const updatedUserDoc = User.objectToUser(payload);
        return await this.#dataStorage.update('id', id, updatedUserDoc);
    }

    async deleteUser(id) {
        await this.#dataStorage.remove('id', id);
    }

    async deleteAllUsers() {
        await this.#dataStorage.clear();
    }

    async clearAll(){
        await this.#dataStorage.clear();
    }
}

const dataStorage = InMemoryDB.getInstance();
const userRepository = new UserRepository(dataStorage);

module.exports = { userRepository, UserRepository };