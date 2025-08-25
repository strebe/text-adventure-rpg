import { GameStrings } from "../data/GameStrings.js";

export class BaseRoom {
    #name;
    #objects;
    #tools;
    #doors;

    constructor(roomKey, roomId) {
        this.#name = GameStrings[roomKey]?.name || 'Unknown Room';
        this.id = roomId;
        this.#objects = new Map();
        this.#tools = new Map();
        this.#doors = new Map();
    }

    get name() { return this.#name; }
    get objects() { return this.#objects; }
    get tools() { return this.#tools; }
    get doors() { return this.#doors; }

    addObject(key, object) {
        this.#objects.set(key, object);
    }

    addTool(key, tool) {
        this.#tools.set(key, tool);
    }

    addDoor(key, door) {
        this.#doors.set(key, door);
    }


    handleSpecialUse(tool, object, result) {
        return null; // Default: no special handling
    }

    onInteractionComplete(tool, object, result) {
        // Default: do nothing
    }
}
