import { Globals } from "../../pp/globals";

export function isMobile(engine = Globals.getMainEngine()) {
    return /Mobi/i.test(Globals.getNavigator(engine).userAgent);
}

export function isDesktop(engine = Globals.getMainEngine()) {
    return !BrowserUtils.isMobile(engine);
}

export let BrowserUtils = {
    isMobile,
    isDesktop
};