import { GameObject } from "../../engine/GameObject.js";
import { GameStrings } from "../../data/GameStrings.js";
import { Outcome } from "../../engine/Outcome.js";

export class StackedBoxes extends GameObject {
    constructor() {
        super(
            "caixas empilhadas",
            GameStrings.storage.stackedBoxesDesc,
            GameStrings.storage.stackedBoxesAction,
            { examine: GameStrings.storage.stackedBoxesAction }
        );
    }

    act(action, ctx) {
        const key = (action || '').toLowerCase();
        if (key === 'describe') {
            return new Outcome({ text: this.description, success: true });
        }
        // delegate to base for examine and others
        return super.act(action, ctx);
    }
}
