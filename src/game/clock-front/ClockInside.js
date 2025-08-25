import { GameObject } from "../../engine/GameObject.js";
import { GameStrings } from "../../data/GameStrings.js";
import { Outcome } from "../../engine/Outcome.js";

export class ClockInside extends GameObject {
    constructor() {
        super("relogio vazio", GameStrings.clockFront.clockEmptyDesc, GameStrings.clockFront.clockEmptyAction);
        this.ponteiroColocado = false;
    }

    act(action, ctx) {
        const key = (action || '').toLowerCase();
        if (key === 'describe' || key === 'examine' || key === 'ver') {
            const text = this.ponteiroColocado ? GameStrings.clockFront.clockEmptyAction : GameStrings.clockFront.clockEmptyDesc;
            return new Outcome({ text, success: true });
        }
        return new Outcome({ text: 'Nada acontece.', success: false });
    }

    use(tool, object) {
        let toolName = null;
        if (typeof tool === 'string') toolName = tool.toLowerCase();
        else if (tool && tool.name) toolName = String(tool.name).toLowerCase();

        if (!toolName) return false;
        if (toolName === 'ponteiro' || toolName === 'solarhand') {
            // ask pointer handled in Engine as before
            return { askPointer: true };
        }
        return false;
    }
}
