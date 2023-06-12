let _myConsoleOriginalLog = console.log;
let _myConsoleOriginalError = console.error;
let _myConsoleOriginalWarn = console.warn;
let _myConsoleOriginalInfo = console.info;
let _myConsoleOriginalDebug = console.debug;
let _myConsoleOriginalAssert = console.assert;
let _myConsoleOriginalClear = console.clear;

export function log(...args) {
    return ConsoleOriginalFunctions.getLog().apply(console, args);
}

export function error(...args) {
    return ConsoleOriginalFunctions.getError().apply(console, args);
}

export function warn(...args) {
    return ConsoleOriginalFunctions.getWarn().apply(console, args);
}

export function info(...args) {
    return ConsoleOriginalFunctions.getInfo().apply(console, args);
}

export function debug(...args) {
    return ConsoleOriginalFunctions.getDebug().apply(console, args);
}

export function assert(...args) {
    return ConsoleOriginalFunctions.getAssert().apply(console, args);
}

export function clear(...args) {
    return ConsoleOriginalFunctions.getClear().apply(console, args);
}

export function getLog() {
    return _myConsoleOriginalLog;
}

export function getError() {
    return _myConsoleOriginalError;
}

export function getWarn() {
    return _myConsoleOriginalWarn;
}

export function getInfo() {
    return _myConsoleOriginalInfo;
}

export function getDebug() {
    return _myConsoleOriginalDebug;
}

export function getAssert() {
    return _myConsoleOriginalAssert;
}

export function getClear() {
    return _myConsoleOriginalClear;
}

export let ConsoleOriginalFunctions = {
    log,
    error,
    warn,
    info,
    debug,
    assert,
    clear,
    getLog,
    getError,
    getWarn,
    getInfo,
    getDebug,
    getAssert,
    getClear
}