import { GameStrings } from "../data/GameStrings.js";
import { normalizeStr } from "../utils/StringUtils.js";

export class RoomController {
    #room;
    #onTakeTool;
    #onGo;

    constructor(room, { onTakeTool = null, onGo = null } = {}) {
        this.#room = room;
        this.#onTakeTool = onTakeTool;
        this.#onGo = onGo;
        this.doors = room.doors;
        this.objects = room.objects;
        this.tools = room.tools;
    }

    get name() { return this.#room.name; }

    // optional id used to lookup localized entry description
    get id() { return this.#room.id || null; }

    // Resolve an object from the room by name (fuzzy lookup)
    #resolveObject(name) {
        if (!name) return null;
        if (this.objects.has(name)) return this.objects.get(name);
        const target = normalizeStr(name);
        for (const [k, v] of this.objects.entries()) {
            if (!v) continue;
            if (v.name && normalizeStr(v.name) === target) return v;
            if (v.name && normalizeStr(v.name).includes(target)) return v;
            if (normalizeStr(k) === target) return v;
            if (String(k).toLowerCase().includes(target)) return v;
        }
        return null;
    }

    #resolveTool(name) {
        if (!name) return null;
        if (this.tools?.has(name)) return this.tools.get(name);
        const target = normalizeStr(name);
        for (const [k, v] of this.tools?.entries() || []) {
            if (k && normalizeStr(k) === target) return v;
        }
        return name;
    }

    #isLadderLowered() {
        const ladder = [...this.objects.values()].find(o => 
            o?.name && (o.name.toLowerCase().includes('escada') || o.name.toLowerCase().includes('ladder'))
        );
        return ladder ? Boolean(ladder.actionDone || ladder.travada === false || ladder.lowered) : false;
    }

    #visibleDoors() {
        const ladderLowered = this.#isLadderLowered();
        return [...this.doors.values()].filter(r => 
            r && (r.id !== 'clockFront' || ladderLowered)
        );
    }

    descriptionText() {
        if (typeof this.#room.descriptionText === 'function') return this.#room.descriptionText();
        if (this.id && GameStrings[this.id]?.entryDesc) {
            return this._buildHeader() + GameStrings[this.id].entryDesc + "\n\n" + this._buildDetailsLines();
        }
        return this._buildHeader() + "\n" + this._buildDetailsLines();
    }

    _buildHeader() {
        return "Você está em: " + (this.name || 'sala desconhecida') + "\n";
    }

    _buildDetailsLines() {
        let description = "";
        const objs = [...this.objects.values()];
        const tools = [...this.tools.values()];
        const doors = this.#visibleDoors();
        const ctx = { ladderLowered: this.#isLadderLowered() };

        // Objects
        if (objs.length === 0) {
            description += "Não existem objetos nessa sala\n\n";
        } else {
            description += "Objetos:\n";
            objs.forEach(o => {
                let text = o?.description || '';
                const nameLower = o?.name?.toLowerCase() || '';
                if ((nameLower.includes('escada') || nameLower.includes('ladder') || 
                     nameLower.includes('relogio') || nameLower.includes('clock')) && 
                    typeof o.act === 'function') {
                    const res = o.act('describe', ctx);
                    text = res?.text || (typeof res === 'string' ? res : text);
                }
                description += ` - ${o.name}${text ? `: ${text}` : ''}\n`;
            });
            description += "\n";
        }

        // Tools
        if (tools.length === 0) {
            description += "Não existem ferramentas nessa sala\n\n";
        } else {
            description += "Ferramentas:\n";
            tools.forEach(t => description += ` - ${t.name}\n`);
            description += "\n";
        }

        // Doors
        description += doors.length === 0 ? "Portas: nenhum\n" : "Portas:\n";
        doors.forEach(r => description += ` - ${r.name}\n`);

        return description;
    }

    take(nameTool) {
        if (typeof this.#room.take === 'function') return this.#room.take(nameTool);
        if (!nameTool) return false;
        
        let key = this.tools?.has(nameTool) ? nameTool : null;
        if (!key) {
            const target = normalizeStr(nameTool);
            for (const k of this.tools?.keys() || []) {
                if (k && (normalizeStr(k) === target || k.toLowerCase().includes(target))) {
                    key = k;
                    break;
                }
            }
        }
        
        const tool = key ? this.tools.get(key) : null;
        if (tool) {
            this.#onTakeTool?.(tool);
            this.tools.delete(key);
            return true;
        }
        return false;
    }

    go(door) {
        if (!door) return null;
        
        let key = this.doors.has(door) ? door : null;
        if (!key) {
            const target = normalizeStr(door);
            for (const k of this.doors.keys()) {
                const nk = normalizeStr(k);
                if (nk === target || nk.includes(target) || k.toLowerCase().includes(target)) {
                    key = k;
                    break;
                }
            }
        }
        
        const dest = key ? this.doors.get(key) : null;
        if (dest?.id === 'clockFront' && !this.#isLadderLowered()) return null;
        
        if (typeof this.#room.go === 'function') return this.#room.go(key || door);
        return this.#onGo ? this.#onGo(key || door, dest) : dest;
    }

    use(tool, object) {
        if (typeof this.#room.use === 'function') return this.#room.use(tool, object);

        let toolName = tool;
        let objectName = object;
        if (objectName === undefined && typeof toolName === 'string') {
            objectName = toolName;
            toolName = null;
        }
        if (!objectName) return false;

        const targetObject = this.#resolveObject(objectName);
        if (!targetObject) return false;

        let result;
        if (toolName) {
            result = typeof targetObject.use === 'function' 
                ? targetObject.use(this.#resolveTool(toolName), objectName)
                : false;
        } else {
            result = typeof targetObject.act === 'function'
                ? targetObject.act('examine', { ladderLowered: this.#isLadderLowered() })
                : { text: targetObject.description || '', success: true };
        }

        const specialHandler = this.#room?.handleSpecialUse?.(tool, object, result);
        return specialHandler ? { ...result, specialHandler } : result;
    }
}
