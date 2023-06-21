// This is the base class for all handlers
class BaseHandler {
    constructor() {
        this.nextHandler = null;
    }

    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }

    handle(req, res, next) {
        if (!this.nextHandler) {
            return next();
        }
        return this.nextHandler.handle(req, res, next);
    }
}

export default BaseHandler;
