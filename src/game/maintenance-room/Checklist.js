import { GameObject } from "../../engine/GameObject.js";
import { GameStrings } from "../../data/GameStrings.js";

export class Checklist extends GameObject {
    constructor() {
        super(
            "checklist",
            GameStrings.maintenanceRoom.checklistDesc,
            GameStrings.maintenanceRoom.checklistAction,
            { examine: GameStrings.maintenanceRoom.checklistAction }
        );
    }
}
