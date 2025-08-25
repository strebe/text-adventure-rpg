import promptsync from 'prompt-sync';
const _defaultPrompt = promptsync({ sigint: true });

export class InteractionManager {
    constructor(promptFn = _defaultPrompt) {
        this._prompt = promptFn;
    }

    // Generic prompt for CLI input
    promptInput(text) {
        return this._prompt(text);
    }

    // Specific helper for the pointer question
    askPointer() {
        return this._prompt('Em que posição deve ficar o ponteiro? ');
    }

    // Generic decision prompt (question should include context). Returns raw answer.
    askDecision(question) {
        return this._prompt((question || '') + ' ');
    }
}
