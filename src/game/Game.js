import { Engine } from "../engine/Engine.js";
import { CentralCorridor } from "./central-corridor/CentralCorridor.js";
import { Library } from "./library/Library.js";
import { Storage } from "./storage/Storage.js";
import { MaintenanceRoom } from "./maintenance-room/MaintenanceRoom.js";
import { ClockRoom } from "./clock-room/ClockRoom.js";
import { FinalCorridor } from "./final-corridor/FinalCorridor.js";
import { RoomController } from "../engine/RoomController.js";
import { ClockFront } from "./clock-front/ClockFront.js";

export class Game extends Engine {
    constructor(outputFn = console.log, interaction = null) {
        super(outputFn, interaction);
    }

    createScenario() {
        // Callbacks
        const onTakeTool = (tool) => {
            this.backpack.store(tool);
        };
        const onGo = (door, nextRoom) => {
            if (nextRoom) {
                this.currentRoom = nextRoom;
            }
            return nextRoom;
        };

        // Create rooms and wrap with controllers
        let corridor = new RoomController(new CentralCorridor(), { onTakeTool, onGo });
        let library = new RoomController(new Library(), { onTakeTool, onGo });
        let storage = new RoomController(new Storage(), { onTakeTool, onGo });
        let maintenance = new RoomController(new MaintenanceRoom(), { onTakeTool, onGo });
        let clock = new RoomController(new ClockRoom(), { onTakeTool, onGo });
        let clockFront = new RoomController(new ClockFront(), { onTakeTool, onGo });
        let finalCorridor = new RoomController(new FinalCorridor(), { onTakeTool, onGo });

        // Link
        corridor.doors.set(library.name, library);
        corridor.doors.set(storage.name, storage);
        corridor.doors.set(maintenance.name, maintenance);
        corridor.doors.set(clock.name, clock);

        library.doors.set(corridor.name, corridor);
        storage.doors.set(corridor.name, corridor);
        maintenance.doors.set(corridor.name, corridor);
        clock.doors.set(corridor.name, corridor);
        clock.doors.set(clockFront.name, clockFront);
        
        clockFront.doors.set(clock.name, clock);

        this._corridor = corridor;
        this._clock = clock;
        this._clockFront = clockFront;
        this._finalCorridor = finalCorridor;

        // Set initial room
        this.currentRoom = corridor;
    }

    // Called when the clock puzzle is solved to expose the final corridor
    unlockFinalCorridor() {
        if (this._corridor && this._finalCorridor) {
            this._corridor.doors.set(this._finalCorridor.name, this._finalCorridor);

            // inform player
            if (this.output) this.output('Um novo caminho foi desbloqueado no Corredor Central.');
        }
    }
}