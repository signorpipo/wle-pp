import { getOriginalConsoleAssert, getOriginalConsoleClear, getOriginalConsoleDebug, getOriginalConsoleError, getOriginalConsoleInfo, getOriginalConsoleLog, getOriginalConsoleWarn } from "./console_original_functions";


export class ConsoleVR {

    constructor() {
        this._myForwardToBrowserConsole = true;
    }

    log(...args) {
        if (this._myForwardToBrowserConsole) {
            getOriginalConsoleLog().apply(console, args);
        }
    }

    error(...args) {
        if (this._myForwardToBrowserConsole) {
            getOriginalConsoleError().apply(console, args);
        }
    }

    warn(...args) {
        if (this._myForwardToBrowserConsole) {
            getOriginalConsoleWarn().apply(console, args);
        }
    }

    info(...args) {
        if (this._myForwardToBrowserConsole) {
            getOriginalConsoleInfo().apply(console, args);
        }
    }

    debug(...args) {
        if (this._myForwardToBrowserConsole) {
            getOriginalConsoleDebug().apply(console, args);
        }
    }

    assert(...args) {
        if (this._myForwardToBrowserConsole) {
            getOriginalConsoleAssert().apply(console, args);
        }
    }

    clear() {
        if (this._myForwardToBrowserConsole) {
            getOriginalConsoleClear().apply(console);
        }
    }

    setForwardToBrowserConsole(forwardToBrowserConsole) {
        this._myForwardToBrowserConsole = forwardToBrowserConsole;
    }

    isForwardToBrowserConsole() {
        return this._myForwardToBrowserConsole;
    }
}