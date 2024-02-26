import { Globals } from "../../pp/globals.js";
import { ConsoleOriginalFunctions } from "./console_original_functions.js";

export class ConsoleVR {

    constructor(engine = Globals.getMainEngine()) {
        this._myEngine = engine;
        this._myForwardToBrowserConsole = true;
    }

    log(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.log(this._myEngine, ...args);
        }
    }

    error(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.error(this._myEngine, ...args);
        }
    }

    warn(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.warn(this._myEngine, ...args);
        }
    }

    info(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.info(this._myEngine, ...args);
        }
    }

    debug(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.debug(this._myEngine, ...args);
        }
    }

    assert(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.assert(this._myEngine, ...args);
        }
    }

    clear(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.clear(this._myEngine, ...args);
        }
    }

    setForwardToBrowserConsole(forwardToBrowserConsole) {
        this._myForwardToBrowserConsole = forwardToBrowserConsole;
    }

    isForwardToBrowserConsole() {
        return this._myForwardToBrowserConsole;
    }
}