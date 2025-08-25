import { Painting } from "../shared-items/Painting.js";
import { RetractableLadder } from "./RetractableLadder.js";
import { MonumentalClock } from "./MonumentalClock.js";
import { BaseRoom } from "../../engine/BaseRoom.js";

export class ClockRoom extends BaseRoom {
    constructor() {
        super('clockRoom', 'clockRoom');
        
        const painting = new Painting("clockRoom");
        const retractableLadder = new RetractableLadder();
        const monumentalClock = new MonumentalClock();
        this.addObject("painting", painting);
        this.addObject(retractableLadder.name, retractableLadder);
        this.addObject(monumentalClock.name, monumentalClock);
    }
}
