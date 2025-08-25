import { Checklist } from "./Checklist.js";
import { SolarHand } from "./SolarHand.js";
import { BaseRoom } from "../../engine/BaseRoom.js";

export class MaintenanceRoom extends BaseRoom {
    constructor() {
        super('maintenanceRoom', 'maintenanceRoom');
        
        const checklist = new Checklist();
        const solarHand = new SolarHand();
        this.addObject(checklist.name, checklist);
        this.addTool(solarHand.name, solarHand);
    }
}
