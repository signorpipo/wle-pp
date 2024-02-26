import { Globals } from "../../pp/globals";

// #TODO These are actually pretty useless, and I can stop using them honestly, maybe slowly removing them from the library too
// It's too hard to actually avoid using the main window directly, like when u do Math, u should do getWindow().Math if u wanted to support
// this completely
// It's harmless to use them, but also useless, so better to remove them at some point

export function getWindow(engine = Globals.getMainEngine()) {
    return window;
}

export function getNavigator(engine = Globals.getMainEngine()) {
    return getWindow(engine).navigator;
}

export function getDocument(engine = Globals.getMainEngine()) {
    return getWindow(engine).document;
}

export function getBody(engine = Globals.getMainEngine()) {
    return getDocument(engine).body;
}