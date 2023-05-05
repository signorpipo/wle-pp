let _myConsoleOriginalLog = console.log;
let _myConsoleOriginalError = console.error;
let _myConsoleOriginalWarn = console.warn;
let _myConsoleOriginalInfo = console.info;
let _myConsoleOriginalDebug = console.debug;
let _myConsoleOriginalAssert = console.assert;
let _myConsoleOriginalClear = console.clear;

export function getConsoleOriginalLog() {
    return _myConsoleOriginalLog;
}

export function getConsoleOriginalError() {
    return _myConsoleOriginalError;
}

export function getConsoleOriginalWarn() {
    return _myConsoleOriginalWarn;
}

export function getConsoleOriginalInfo() {
    return _myConsoleOriginalInfo;
}

export function getConsoleOriginalDebug() {
    return _myConsoleOriginalDebug;
}

export function getConsoleOriginalAssert() {
    return _myConsoleOriginalAssert;
}

export function getConsoleOriginalClear() {
    return _myConsoleOriginalClear;
}

export let ConsoleOriginalFunctions = {
    getConsoleOriginalLog,
    getConsoleOriginalError,
    getConsoleOriginalWarn,
    getConsoleOriginalInfo,
    getConsoleOriginalDebug,
    getConsoleOriginalAssert,
    getConsoleOriginalClear
}