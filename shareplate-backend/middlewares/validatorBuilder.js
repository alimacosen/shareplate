/**
 * @param {Array} handlers
 * @returns {Object} chainingHandlers
 * @description
 * This function is an abstract class used to compose many handlers into a chaining validator.
 */
class ValidatorBuilder {
    constructor() {
        this.handlers = [];
    }

    add(handler) {
        this.handlers.push(handler);
        return this;
    }

    getChainingHandlers(handlers) {
        if (handlers.length === 0) return null;
        for (let i = 0; i < handlers.length - 1; i++) {
            handlers[i].setNext(handlers[i + 1]);
        }
        return handlers[0].handle;
    }

    build() {
        return this.getChainingHandlers(this.handlers);
    }
}

export default ValidatorBuilder;
