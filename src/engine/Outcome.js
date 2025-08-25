export class Outcome {
    constructor({ text = "", tool = null, openDoor = null, success = false } = {}) {
        this.text = text;
        this.tool = tool;
        this.openDoor = openDoor;
        this.success = success;
    }
}
