import { validate } from "bycontract";
import { Tool } from "./Tool.js";

export class Backpack {
    #tools;

    constructor() {
        this.#tools = [];
    }

    store(tool) {
        validate(tool, Tool);
        this.#tools.push(tool);
    }

    get(nameTool) {
        validate(arguments, ["String"]);
        let tool = this.#tools.find(t => t.name === nameTool);
        return tool;
    }

    has(nameTool) {
        validate(arguments, ["String"]);
        return this.#tools.some(t => t.name === nameTool);
    }

    inventory() {
        return this.#tools.map(obj => obj.name).join(", ");
    }
}