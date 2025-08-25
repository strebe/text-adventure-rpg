import { GameObject } from "../../engine/GameObject.js";
import { GameStrings } from "../../data/GameStrings.js";
import { Outcome } from "../../engine/Outcome.js";

export class MonumentalClock extends GameObject {
    constructor() {
        super(
            "relogio monumental",
            GameStrings.clockRoom.clockDesc,
            GameStrings.clockRoom.clockAction
        );
        this.ponteiroColocado = false;
    }

    act(action, ctx) {
        const key = (action || '').toLowerCase();
        const ladderLowered = (ctx && ctx.ladderLowered) || false;
        if (key === 'describe') {
            const text = ladderLowered ? (GameStrings.clockRoom.clockLadderDownDesc || this.examineText(true)) : GameStrings.clockRoom.clockDesc;
            return new Outcome({ text, success: true });
        }
        if (key === 'examine' || key === 'ver' || key === 'look' || key === 'inspecionar') {
            const text = ladderLowered ? (GameStrings.clockRoom.clockLadderDownAction || GameStrings.clockRoom.clockAction) : GameStrings.clockRoom.clockAction;
            return new Outcome({ text, success: true });
        }
        return false;
    }
}
