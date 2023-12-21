const User = require("../../src/models/user.js");
const request = require('supertest');
const uuid = require('uuid');
const { userRepository } = require('../../src/repositories/userRepository');
const app = require('../../src/app');

beforeEach(() => {
    userRepository.clearAll();
})

//get all users
describe("GET /api/users", () => {

    it('returns 0 users when application starts', async () => {
        const response = await request(app).get('/api/users')
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    it('return stored users from the database', async () => {
        await userRepository.createUser(new User('Jayesh', 23, ['sleeping', 'eating']))
        await userRepository.createUser(new User('yogesh', 22, ['programming']))
        await userRepository.createUser(new User('Hari', 24, ['dating', 'hiking']))
        const response = await request(app).get('/api/users')
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
    })

})

//get paticular user
describe("GET /api/users/:userId", () => {

    it('returns 404 when user not found', async () => {
        const response = await request(app).get(`/api/users/${uuid.v4()}`)
        expect(response.status).toBe(404);
    });

    it('returns 400 when userId is invalid', async () => {
        const response = await request(app).get(`/api/users/invalid-userid`)
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "message": "\"userId\" must be a valid GUID"
        })
    });

    it('return found users from the database', async () => {
        const user = await userRepository.createUser(new User('Jayesh', 23, ['sleeping', 'eating']))
        await userRepository.createUser(new User('yogesh', 22, ['programming']))
        await userRepository.createUser(new User('Hari', 24, ['dating', 'hiking']))
        const response = await request(app).get(`/api/users/${user.getId()}`)
        expect(response.status).toBe(200);
        expect(response.body).toEqual(user);
    })

})

//post user
describe('POST /api/users', () => {
    it('store new user', async () => {
        const user = {
            username: 'tarun',
            age: 23,
            hobbies: ['playing'],
        }
        const response = await request(app).post(`/api/users`).send(user);
        expect(response.status).toBe(201);
        expect(uuid.validate(response.body.id)).toBeTruthy();
        const allUsers = await userRepository.findAllUsers();
        expect(allUsers.length).toEqual(1);
    })

    it('return 400 when username is missing in payload', async () => {
        const user = {
            age: 1,
            hobbies: ['playing'],
        }
        const response = await request(app).post(`/api/users`).send(user);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "message": "\"username\" is required"
        })
    });

    it('return 400 when age is missing in payload', async () => {
        const user = {
            username: 'tarun',
            hobbies: ['playing'],
        }
        const response = await request(app).post(`/api/users`).send(user);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "message": "\"age\" is required"
        })
    });

    it('return 400 when hobbies contains other datatypes other than string', async () => {
        const user = {
            username: 'tarun',
            age: 23,
            hobbies: ['playing', 1],
        }
        const response = await request(app).post(`/api/users`).send(user);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "message": "\"hobbies[1]\" must be a string"
        })
    });
})

//update particular result
describe("PUT /api/users/:userId", () => {

    it('returns 404 when user does not exist', async () => {
        const updatedUser = {
            username: 'tarun',
            age: 23,
            hobbies: ['playing'],
        }
        const response = await request(app).put(`/api/users/${uuid.v4()}`).send(updatedUser);
        expect(response.status).toBe(404);
    });

    it('returns 400 when userId is invalid', async () => {
        const updatedUser = {
            username: 'tarun',
            age: 23,
            hobbies: ['playing'],
        }
        const response = await request(app).put(`/api/users/invalid-userId`).send(updatedUser);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "message": "\"userId\" must be a valid GUID"
        })
    });


    it('update existing user', async () => {
        const user = await userRepository.createUser(new User('Jayesh', 23, ['sleeping', 'eating']))
        const updatedUser = {
            username: 'tarun',
            age: 23,
            hobbies: ['playing'],
        }
        const response = await request(app).put(`/api/users/${user.getId()}`).send(updatedUser);
        const { username, age, hobbies } = response.body;
        const receivedUser = { username, age, hobbies }
        expect(response.status).toBe(200);
        expect(receivedUser).toEqual(updatedUser)
    });

    it('return 400 when username is missing in payload', async () => {
        const user = await userRepository.createUser(new User('Jayesh', 23, ['sleeping', 'eating']))
        const updatedUser = {
            age: 23,
            hobbies: ['playing'],
        }
        const response = await request(app).put(`/api/users/${user.getId()}`).send(updatedUser);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "message": "\"username\" is required"
        })
    });

    it('return 400 when age is missing in payload', async () => {
        const user = await userRepository.createUser(new User('Jayesh', 23, ['sleeping', 'eating']))
        const updatedUser = {
            username: 'tarun',
            hobbies: ['playing'],
        }
        const response = await request(app).put(`/api/users/${user.getId()}`).send(updatedUser);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "message": "\"age\" is required"
        })
    });

    it('return 400 when hobbies contains other datatypes other than string', async () => {
        const user = await userRepository.createUser(new User('Jayesh', 23, ['sleeping', 'eating']))
        const updatedUser = {
            username: 'tarun',
            age: 1,
            hobbies: ['playing', 3, "eating"],
        }
        const response = await request(app).put(`/api/users/${user.getId()}`).send(updatedUser);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "message": "\"hobbies[1]\" must be a string"
        })
    });


})

//delete a user
describe('DELETE /api/users/:userId', () => {
    it('delete a stored user', async () => {
        const user = await userRepository.createUser(new User('Jayesh', 23, ['sleeping', 'eating'])) 
        const allUsers = await userRepository.findAllUsers();
        expect(allUsers.length).toEqual(1);
        const response = await request(app).delete(`/api/users/${user.getId()}`);
        expect(response.status).toBe(204);
        const allUsersAfterDeletion = await userRepository.findAllUsers();
        expect(allUsersAfterDeletion.length).toEqual(0);
    })
    it('returns 400 when userId is invalid', async () => {
        const response = await request(app).delete(`/api/users/invalid-userid`)
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "message": "\"userId\" must be a valid GUID"
        })
    });
    it('returns 404 when user not found', async () => {
        const response = await request(app).get(`/api/users/${uuid.v4()}`)
        expect(response.status).toBe(404);
    });
})

//non-existing route
describe('GET /strange-route', () => {
    it('return 404', async () => {
        const response = await request(app).get(`/api/strange-route`);
        expect(response.status).toBe(404);
    })
})