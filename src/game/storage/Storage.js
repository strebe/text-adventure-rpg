import { StackedBoxes } from "./StackedBoxes.js";
import { LongHook } from "./LongHook.js";
import { BaseRoom } from "../../engine/BaseRoom.js";

export class Storage extends BaseRoom {
    constructor() {
        super('storage', 'storage');
        
        const stackedBoxes = new StackedBoxes();
        const longHook = new LongHook();
        this.addObject(stackedBoxes.name, stackedBoxes);
        this.addTool(longHook.name, longHook);
    }
}
