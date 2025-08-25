import { Painting } from "../shared-items/Painting.js";
import { BaseRoom } from "../../engine/BaseRoom.js";

export class CentralCorridor extends BaseRoom {
    constructor() {
        super('centralCorridor', 'centralCorridor');
        
        const painting = new Painting("centralCorridor");
        this.addObject("painting", painting);
    }
}
