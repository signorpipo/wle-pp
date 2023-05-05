import { ConsoleOriginalFunctions } from "./console_original_functions";

export class ConsoleVR {

    constructor() {
        this._myForwardToBrowserConsole = true;
    }

    log(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.getConsoleOriginalLog().apply(console, args);
        }
    }

    error(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.getConsoleOriginalError().apply(console, args);
        }
    }

    warn(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.getConsoleOriginalWarn().apply(console, args);
        }
    }

    info(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.getConsoleOriginalInfo().apply(console, args);
        }
    }

    debug(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.getConsoleOriginalDebug().apply(console, args);
        }
    }

    assert(...args) {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.getConsoleOriginalAssert().apply(console, args);
        }
    }

    clear() {
        if (this._myForwardToBrowserConsole) {
            ConsoleOriginalFunctions.getConsoleOriginalClear().apply(console);
        }
    }

    setForwardToBrowserConsole(forwardToBrowserConsole) {
        this._myForwardToBrowserConsole = forwardToBrowserConsole;
    }

    isForwardToBrowserConsole() {
        return this._myForwardToBrowserConsole;
    }
}