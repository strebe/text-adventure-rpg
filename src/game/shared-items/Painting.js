import { GameObject } from "../../engine/GameObject.js";
import { GameStrings } from "../../data/GameStrings.js";

export class Painting extends GameObject {
    constructor(locationKey) {
        super(
            "quadro",
            GameStrings[locationKey].paintingTitle,
            GameStrings[locationKey].paintingLegend,
            { examine: GameStrings[locationKey].paintingLegend }
        );
    }
}
