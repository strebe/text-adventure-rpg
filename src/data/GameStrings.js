import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const stringsPath = join(__dirname, 'strings_pt.json');
const stringsPt = JSON.parse(fs.readFileSync(stringsPath, 'utf8'));

function format(template, vars = {}) {
    if (typeof template !== 'string') return template;
    return template.replace(/\{(\w+)\}/g, (m, key) => {
        if (!(key in vars)) return m;
        const v = vars[key];
        return (v === null || v === undefined) ? '' : String(v);
    });
}

export const GameStrings = {
    ...stringsPt,
    engine: {
        ...stringsPt.engine,
        okAdded: (item) => format(stringsPt.engine.okAdded, { item }),
        notFound: (item) => format(stringsPt.engine.notFound, { item }),
        cantUse: (verb, tool, object) => {
            if (tool && tool.length > 0) {
                return format(stringsPt.engine.cantUseWithTool, { verb, tool, object });
            }
            return format(stringsPt.engine.cantUseNoTool, { verb, object });
        },
        unknownCommand: (command) => format(stringsPt.engine.unknownCommand, { command })
    }
};