export abstract class BaseError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target!.prototype);
        this.name = new.target!.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, new.target);
        }
    }
}
