import { initArrayExtension } from "./array_extension";
import { initMathExtension } from "./math_extension";
import { initNumberExtension } from "./number_extension";

export function initJSExtensions() {
    initMathExtension();
    initArrayExtension();
    initNumberExtension();
}