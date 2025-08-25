export class CommandParser {
    constructor() {
        this.commandMap = {
            'fim': 'end',
            'sair': 'end',
            'pegar': 'take',
            'pega': 'take',
            'inventario': 'inventory',
            'inventário': 'inventory',
            'inv': 'inventory',
            'mochila': 'inventory',
            'usar': 'use',
            'usa': 'use',
            'ver': 'use',
            'ler': 'use',
            'examinar': 'use',
            'inspecionar': 'use',
            'apertar': 'use',
            'ir': 'go',
            'vai': 'go',
        };
        this.commandRegex = /^(\w+)(?:\s+(\S+))?(?:\s+(\S+))?/i;
    }

    // normalize helper that removes diacritics and lowercases
    #normalize(s) {
        return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    }

    parse(input) {
        const match = this.commandRegex.exec(String(input || '').trim());
        if (!match) return { command: null, args: [] };
        let [ , rawCommand, arg1, arg2 ] = match;
        const verb = rawCommand ? this.#normalize(rawCommand) : null;
        const command = this.commandMap[verb] || verb;
        const args = [];
        if (arg1) args.push(this.#normalize(arg1));
        if (arg2) args.push(this.#normalize(arg2));
        return { command, args, verb };
    }
}
