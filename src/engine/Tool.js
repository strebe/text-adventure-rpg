export class Tool {
    #name;

    constructor(name) {
        if (typeof name !== 'string') {
            throw new Error('Tool name must be a string');
        }
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    use() {
        return true;
    }
}