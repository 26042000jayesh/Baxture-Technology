const uuid = require('uuid');

class User {

    constructor(username, age, hobbies, id = uuid.v4()) {
        this.id = id;
        this.username = username;
        this.age = age;
        this.hobbies = hobbies || [];
    }

    getId() {
        return this.id;
    }

    getUsername() {
        return this.username;
    }

    getAge() {
        return this.age;
    }

    getHoobbies() {
        return this.hobbies;
    }

    static objectToUser(object) {
        return new User(object.username, object.age, object.hobbies);
    }
}

module.exports = User;