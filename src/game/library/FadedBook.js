import { GameObject } from "../../engine/GameObject.js";
import { GameStrings } from "../../data/GameStrings.js";

export class FadedBook extends GameObject {
    constructor() {
        super(
            "livro amarelado",
            GameStrings.library.fadedBookDesc,
            GameStrings.library.fadedBookAction,
            { examine: GameStrings.library.fadedBookAction }
        );
    }
}
