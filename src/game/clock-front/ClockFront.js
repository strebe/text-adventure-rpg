import { BaseRoom } from "../../engine/BaseRoom.js";
import { ClockInside } from "./ClockInside.js";
import { GameStrings } from "../../data/GameStrings.js";
import { normalizeStr } from "../../utils/StringUtils.js";

export class ClockFront extends BaseRoom {
    constructor() {
        super('clockFront', 'clockFront');
        
        const clockInside = new ClockInside();
        this.addObject(clockInside.name, clockInside);
    }

    // Handle the special askPointer flow specific to ClockFront
    handleSpecialUse(tool, object, result) {
        if (result && typeof result === 'object' && result.askPointer) {
            return {
                type: 'askPointer',
                handler: (interaction, engine) => {
                    const pos = interaction.askPointer();
                    const normalized = pos ? pos.trim().toLowerCase() : '';
                    const ok = (normalized === '12' || normalized === '12:00' || normalized === '12h00');

                    // Find the clock-inside object
                    const clockObj = [...this.objects.values()].find(o => 
                        o && (o.name === 'clock_inside' || 
                             (o.name && normalizeStr(o.name).includes('clock')) || 
                             (o.name && normalizeStr(o.name).includes('relogio')))
                    );

                    if (ok) {
                        if (clockObj) {
                            try { clockObj.ponteiroColocado = true; } catch (e) { }
                            try { clockObj.actionDone = true; } catch (e) { }
                        }
                        if (typeof engine.unlockFinalCorridor === 'function') {
                            try { engine.unlockFinalCorridor(); } catch (e) { }
                        }
                        engine.output(GameStrings.clockFront.clockWithPointerAction || GameStrings.clockFront.clockEmptyAction);
                    } else {
                        engine.output(GameStrings.clockFront.clockErrorAction || 'Nada acontece.');
                    }
                }
            };
        }
        return null;
    }
}
