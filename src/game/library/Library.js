import { Painting } from "../shared-items/Painting.js";
import { FadedBook } from "./FadedBook.js";
import { BaseRoom } from "../../engine/BaseRoom.js";

export class Library extends BaseRoom {
    constructor() {
        super('library', 'library');
        
        const painting = new Painting("library");
        const fadedBook = new FadedBook();
        this.addObject("painting", painting);
        this.addObject(fadedBook.name, fadedBook);
    }
}
