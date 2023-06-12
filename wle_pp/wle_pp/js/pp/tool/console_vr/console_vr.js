import { ConsoleOriginalFunctions } from "./console_original_functions";

export class ConsoleVR {

    constructor() {
        this._myForwardToBrowserConsole = true;
    }

    log(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.log(...args);
        }
    }

    error(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.error(...args);
        }
    }

    warn(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.warn(...args);
        }
    }

    info(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.info(...args);
        }
    }

    debug(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.debug(...args);
        }
    }

    assert(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.assert(...args);
        }
    }

    clear(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.clear(...args);
        }
    }

    setForwardToBrowserConsole(forwardToBrowserConsole) {
        this._myForwardToBrowserConsole = forwardToBrowserConsole;
    }

    isForwardToBrowserConsole() {
        return this._myForwardToBrowserConsole;
    }
}