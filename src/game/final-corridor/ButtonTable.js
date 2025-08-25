import { GameObject } from "../../engine/GameObject.js";
import { GameStrings } from "../../data/GameStrings.js";
import { Outcome } from "../../engine/Outcome.js";

export class ButtonTable extends GameObject {
    constructor() {
        super(
            "mesa com botão",
            GameStrings.finalCorridor.buttonTableDesc,
            GameStrings.finalCorridor.buttonTableAction
        );
    }

    act(action, ctx) {
        const key = (action || '').toLowerCase();
        if (key === 'examine' || key === 'ver' || key === 'inspecionar' || key === 'apertar') {
            return { askDecision: true };
        }
        return new Outcome({ text: "Nada acontece.", success: false });
    }

    use(tool, object) {
        // if called as 'usar apertar mesa' or 'apertar mesa' (tool may be a string or Tool)
        let toolName = null;
        if (typeof tool === 'string') toolName = tool.toLowerCase();
        else if (tool && tool.name) toolName = String(tool.name).toLowerCase();

        const pressSyn = ['apertar', 'press', 'apertar botao', 'apertar botão', 'apertarbotao'];
        if (toolName && pressSyn.some(s => toolName.includes(s))) {
            return { askDecision: true };
        }
        return false;
    }
}
