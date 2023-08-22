import { Globals } from "../../pp/globals";

let _myConsoleOriginalLog = console.log;
let _myConsoleOriginalError = console.error;
let _myConsoleOriginalWarn = console.warn;
let _myConsoleOriginalInfo = console.info;
let _myConsoleOriginalDebug = console.debug;
let _myConsoleOriginalAssert = console.assert;
let _myConsoleOriginalClear = console.clear;

export function log(engine = Globals.getMainEngine(), ...args) {
    return ConsoleOriginalFunctions.getLog(engine).apply(console, args);
}

export function error(engine = Globals.getMainEngine(), ...args) {
    return ConsoleOriginalFunctions.getError(engine).apply(console, args);
}

export function warn(engine = Globals.getMainEngine(), ...args) {
    return ConsoleOriginalFunctions.getWarn(engine).apply(console, args);
}

export function info(engine = Globals.getMainEngine(), ...args) {
    return ConsoleOriginalFunctions.getInfo(engine).apply(console, args);
}

export function debug(engine = Globals.getMainEngine(), ...args) {
    return ConsoleOriginalFunctions.getDebug(engine).apply(console, args);
}

export function assert(engine = Globals.getMainEngine(), ...args) {
    return ConsoleOriginalFunctions.getAssert(engine).apply(console, args);
}

export function clear(engine = Globals.getMainEngine(), ...args) {
    return ConsoleOriginalFunctions.getClear(engine).apply(console, args);
}

export function getLog(engine = Globals.getMainEngine()) {
    return _myConsoleOriginalLog;
}

export function getError(engine = Globals.getMainEngine()) {
    return _myConsoleOriginalError;
}

export function getWarn(engine = Globals.getMainEngine()) {
    return _myConsoleOriginalWarn;
}

export function getInfo(engine = Globals.getMainEngine()) {
    return _myConsoleOriginalInfo;
}

export function getDebug(engine = Globals.getMainEngine()) {
    return _myConsoleOriginalDebug;
}

export function getAssert(engine = Globals.getMainEngine()) {
    return _myConsoleOriginalAssert;
}

export function getClear(engine = Globals.getMainEngine()) {
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