let _myOriginalConsoleLog = console.log;
let _myOriginalConsoleError = console.error;
let _myOriginalConsoleWarn = console.warn;
let _myOriginalConsoleInfo = console.info;
let _myOriginalConsoleDebug = console.debug;
let _myOriginalConsoleAssert = console.assert;
let _myOriginalConsoleClear = console.clear;

export function getOriginalConsoleLog() {
    return _myOriginalConsoleLog;
}

export function getOriginalConsoleError() {
    return _myOriginalConsoleError;
}

export function getOriginalConsoleWarn() {
    return _myOriginalConsoleWarn;
}

export function getOriginalConsoleInfo() {
    return _myOriginalConsoleInfo;
}

export function getOriginalConsoleDebug() {
    return _myOriginalConsoleDebug;
}

export function getOriginalConsoleAssert() {
    return _myOriginalConsoleAssert;
}

export function getOriginalConsoleClear() {
    return _myOriginalConsoleClear;
}