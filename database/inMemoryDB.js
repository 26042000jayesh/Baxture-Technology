class InMemoryDB {
    static #instance;
    static #isInternalConstructing = false;
    #databse;
    constructor() {
        if (!InMemoryDB.#isInternalConstructing) {
            throw new TypeError("Private constructor is not constructable from outside.");
        }
        InMemoryDB.#isInternalConstructing = false;
        console.log("Constructing in-memory database");
        this.#databse = [];
        InMemoryDB.#instance = this;
    }

    static getInstance() {
        InMemoryDB.#isInternalConstructing = true;
        if (!InMemoryDB.#instance) {
            InMemoryDB.#instance = new InMemoryDB();
        }
        return InMemoryDB.#instance;
    }

    async getAll() {
        return this.#databse;
    }

    async getById(key, value) {
        return this.#databse.find(item => item[key] === value);
    }

    async add(item) {
        return this.#databse.push(item);
    }

    async update(key, value, updatedItem) {
        this.#databse = this.#databse.map(item => {
            if (item[key] === value) {
                return updatedItem;
            }
            return item;
        })
        return updatedItem;
    }


    async remove(key, value) {
        this.#databse = this.#databse.filter(item => item[key] !== value);
    }

    async clear() {
        this.#databse = [];
    }

}