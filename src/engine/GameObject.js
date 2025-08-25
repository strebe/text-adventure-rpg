import { validate } from "bycontract";
import { Outcome } from "./Outcome.js";

export class GameObject {
    #name;
    #descBeforeAction;
    #descAfterAction;
    #actionDone;
    #actions; // map of generic actions -> text

    constructor(name, descBeforeAction, descAfterAction, actions = {}) {
        // validate the three mandatory string args
        validate([name, descBeforeAction, descAfterAction], ["String", "String", "String"]);
        if (actions != null && typeof actions !== "object") validate(actions, "Object");

        this.#name = name;
        this.#descBeforeAction = descBeforeAction;
        this.#descAfterAction = descAfterAction;
        this.#actionDone = false;
        this.#actions = Object.assign({}, actions);
    }

    get name() {
        return this.#name;
    }

    get actionDone() {
        return this.#actionDone;
    }

    set actionDone(actionDone) {
        validate(actionDone, "Boolean");
        this.#actionDone = actionDone;
    }

    get description() {
        if (!this.actionDone) {
            return this.#descBeforeAction;
        } else {
            return this.#descAfterAction;
        }
    }

    // Needs override. Default behavior: nothing happens, return Outcome
    use(tool, object) {
        return new Outcome({ text: "Nada acontece.", success: false });
    }

    act(action, ctx) {
        if (typeof action !== "string") {
            return new Outcome({ text: "Nada acontece.", success: false });
        }
        const key = action.toLowerCase();
        if (Object.prototype.hasOwnProperty.call(this.#actions, key)) {
            const text = this.#actions[key];
            return new Outcome({ text: text, success: true });
        }
        if (key === "examine" || key === "look" || key === "inspect") {
            return new Outcome({ text: this.description, success: true });
        }
        return new Outcome({ text: "Nada acontece.", success: false });
    }
}