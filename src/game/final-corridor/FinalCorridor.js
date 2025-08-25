import { Painting } from "../shared-items/Painting.js";
import { ButtonTable } from "./ButtonTable.js";
import { BaseRoom } from "../../engine/BaseRoom.js";
import { GameStrings } from "../../data/GameStrings.js";

export class FinalCorridor extends BaseRoom {
    constructor() {
        super('finalCorridor', 'finalCorridor');
        
        const painting = new Painting("finalCorridor");
        const buttonTable = new ButtonTable();
        this.addObject("painting", painting);
        this.addObject(buttonTable.name, buttonTable);
    }

    handleSpecialUse(tool, object, result) {
        if (result && typeof result === 'object' && result.askDecision) {
            return {
                type: 'askDecision',
                handler: (interaction, engine) => {
                    const ans = interaction.askDecision(GameStrings.finalCorridor.buttonTableDecision);
                    const normalized = ans ? ans.trim().toLowerCase() : '';
                    const yes = ['s', 'sim', 'y', 'yes'].includes(normalized);
                    
                    if (yes) {
                        if (GameStrings.finalCorridor.buttonTableAction) {
                            engine.output(GameStrings.finalCorridor.buttonTableAction);
                        }
                        if (GameStrings.finalDescription) {
                            engine.output(GameStrings.finalDescription);
                        }
                        engine.indicateEndOfGame();
                    } else {
                        // Nothing happens; refresh room (handled by engine)
                    }
                }
            };
        }
        return null;
    }
}
