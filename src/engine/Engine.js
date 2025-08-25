import { Backpack } from "./Backpack.js";
import { GameStrings } from "../data/GameStrings.js";
import { CommandParser } from "./CommandParser.js";
import { InteractionManager } from "./InteractionManager.js";
import { normalizeStr } from "../utils/StringUtils.js";

export class Engine {
    #backpack;
    #currentRoom;
    #end;
    #outputFn;

    constructor(outputFn = console.log, interaction = null) {
        this.#backpack = new Backpack();
        this.#currentRoom = null;
        this.#end = false;
        this.commandParser = new CommandParser();
        this.#outputFn = outputFn;
        this._interaction = interaction || new InteractionManager();
        this.createScenario();
    }

    get backpack() { return this.#backpack; }
    get currentRoom() { return this.#currentRoom; }
    set currentRoom(room) {
        if (room && typeof room.descriptionText !== 'function') {
            throw new Error('currentRoom must implement descriptionText()');
        }
        this.#currentRoom = room;
    }
    
    indicateEndOfGame() { this.#end = true; }
    output(...args) { this.#outputFn?.(...args); }

    play() {
        if (GameStrings.initialDescription) {
            this.output(GameStrings.initialDescription);
        }
        
        while (!this.#end) {
            this.output(GameStrings.engine.separator);
            this.output(this.currentRoom.descriptionText());
            
            const input = this._interaction.promptInput(GameStrings.engine.prompt);
            const { command, args, verb } = this.commandParser.parse(input);
            this.handleAction(command, args, verb);
        }
    }

    handleAction(command, args, verb) {
        const handlers = {
            end: () => this.#end = true,
            take: () => this.#handleTake(args?.[0]),
            inventory: () => this.output(GameStrings.engine.inventory + this.#backpack.inventory()),
            use: () => this.handleUse(args?.[1] ? args[0] : null, args?.[1] || args?.[0], verb),
            go: () => this.#handleGo(args?.[0]),
        };
        
        const handler = handlers[command];
        if (handler) {
            handler();
        } else {
            this.output(GameStrings.engine.unknownCommand(command));
        }
    }

    #handleTake(item) {
        if (this.currentRoom.take(item)) {
            this.output(GameStrings.engine.okAdded(item));
        } else {
            this.output(GameStrings.engine.notFound(item));
        }
    }

    #handleGo(roomName) {
        const newRoom = this.currentRoom.go(roomName);
        if (newRoom) {
            this.#currentRoom = newRoom;
        } else {
            this.output(GameStrings.engine.unknownRoom);
        }
    }

    createScenario() {
        // Need override. 
    }

    handleUse(tool, object, verb) {
        if (!this.#validateToolAccess(tool)) return;

        const result = this.currentRoom.use(tool, object);
        
        if (result?.specialHandler?.handler) {
            result.specialHandler.handler(this._interaction, this);
            return;
        }

        this.#processResult(result, verb, tool, object);
    }

    #validateToolAccess(tool) {
        if (!tool || typeof tool !== 'string') return true;
        
        const normalizedTool = normalizeStr(tool);
        
        if (this.backpack.has(tool)) return true;
        
        if (normalizedTool === 'ponteiro') {
            this.output(GameStrings.engine.notFound(tool));
            return false;
        }

        const roomItems = [
            ...this.currentRoom.tools?.values() || [],
            ...this.currentRoom.objects?.values() || []
        ];
        
        const allowed = roomItems.some(item => 
            item?.name && (
                normalizeStr(item.name).includes(normalizedTool) || 
                normalizedTool.includes(normalizeStr(item.name))
            )
        );

        if (!allowed) {
            this.output(GameStrings.engine.notFound(tool));
            return false;
        }
        
        return true;
    }

    #processResult(result, verb, tool, object) {
        if (typeof result === 'boolean') {
            if (!result) {
                this.output(GameStrings.engine.cantUse(verb || 'usar', tool || '', object || ''));
            }
            return;
        }

        if (result && typeof result === 'object') {
            if (result.text) this.output(result.text);
            
            if (result.openDoor === 'climb') {
                this._onClimb?.();
                return;
            }

            if (result.tool) {
                this.#backpack.store(result.tool);
                const toolName = result.tool?.name || String(result.tool);
                this.output(GameStrings.engine.okAdded(toolName));
            }

            if (!result.success && !result.text && !result.tool) {
                this.output(GameStrings.engine.cantUse(verb || 'usar', tool || '', object || ''));
            }
            return;
        }

        this.output(GameStrings.engine.cantUse(verb || 'usar', tool || '', object || ''));
    }
}