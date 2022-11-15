PP.ConsoleVR = {
    _myRealLog: console.log,
    _myRealError: console.error,
    _myRealWarn: console.warn,
    _myRealInfo: console.info,
    _myRealDebug: console.debug,
    _myRealAssert: console.assert,
    _myRealClear: console.clear,
    _myForwardToBrowserConsole: true,

    log: function (...args) {
        if (this._myForwardToBrowserConsole) {
            this._myRealLog.apply(console, args);
        }
    },
    error: function (...args) {
        if (this._myForwardToBrowserConsole) {
            this._myRealError.apply(console, args);
        }
    },
    warn: function (...args) {
        if (this._myForwardToBrowserConsole) {
            this._myRealWarn.apply(console, args);
        }
    },
    info: function (...args) {
        if (this._myForwardToBrowserConsole) {
            this._myRealInfo.apply(console, args);
        }
    },
    debug: function (...args) {
        if (this._myForwardToBrowserConsole) {
            this._myRealDebug.apply(console, args);
        }
    },
    assert: function (...args) {
        if (this._myForwardToBrowserConsole) {
            this._myRealAssert.apply(console, args);
        }
    },
    clear: function () {
        if (this._myForwardToBrowserConsole) {
            this._myRealClear.apply(console);
        }
    },
    setForwardToBrowserConsole: function (forwardToBrowserConsole) {
        this._myForwardToBrowserConsole = forwardToBrowserConsole;
    },
    isForwardToBrowserConsole: function () {
        return this._myForwardToBrowserConsole;
    }
};