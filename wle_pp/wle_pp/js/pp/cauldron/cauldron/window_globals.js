import { Globals } from "../../pp/globals";

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