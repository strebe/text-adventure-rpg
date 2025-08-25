import { GameObject } from "../../engine/GameObject.js";
import { GameStrings } from "../../data/GameStrings.js";
import { Outcome } from "../../engine/Outcome.js";

export class RetractableLadder extends GameObject {
    constructor() {
        super(
            "escada retrátil",
            GameStrings.clockRoom.ladderDesc,
            GameStrings.clockRoom.ladderAction
        );
        this.lowered = false;
    }

    act(action, ctx) {
        const key = (action || '').toLowerCase();
        const ladderLowered = (ctx && ctx.ladderLowered) || this.lowered || this.actionDone;

        if (key === 'describe') {
            const text = ladderLowered ? (GameStrings.clockRoom.ladderDownDesc || GameStrings.clockRoom.ladderAction) : GameStrings.clockRoom.ladderDesc;
            return new Outcome({ text, success: true });
        }

        if (key === 'examine' || key === 'ver' || key === 'look' || key === 'inspecionar') {
            const text = ladderLowered ? (GameStrings.clockRoom.ladderDownAction || GameStrings.clockRoom.ladderAction) : GameStrings.clockRoom.ladderAction;
            return new Outcome({ text, success: true });
        }

        return new Outcome({ text: "Nada acontece.", success: false });
    }

    use(tool, object) {
        let toolName = null;
        if (typeof tool === 'string') toolName = tool.toLowerCase();
        else if (tool && tool.name) toolName = String(tool.name).toLowerCase();

        if (!toolName) return false;
        if (toolName === 'gancho' || toolName === 'hook' || toolName === 'longhook') {
            if (this.lowered) {
                // already lowered
                return new Outcome({ text: GameStrings.clockRoom.ladderDownAction || GameStrings.clockRoom.ladderAction, success: true });
            }
            this.lowered = true;
            try { this.actionDone = true; } catch (e) {}
            return new Outcome({ text: GameStrings.clockRoom.usingLongHook || GameStrings.clockRoom.ladderAction, success: true });
        }
        return false;
    }
}
