export class EmptyFieldsException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Empty Fields";
    }
}