import { Emitter } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import { PluginUtils } from "../../../utils/plugin_utils";

export function initCursorTargetComponentMod() {
    initCursorTargetComponentModPrototype();
}

export function initCursorTargetComponentModPrototype() {
    let cursorTargetComponentMod = {};

    // New Functions 

    cursorTargetComponentMod.init = function init() {
        this.onSingleClick = new Emitter();
        this.onDoubleClick = new Emitter();
        this.onTripleClick = new Emitter();

        this.onDownOnHover = new Emitter();

        this.onUpWithDown = new Emitter();
        this.onUpWithNoDown = new Emitter();

        this.isSurface = false; // Just a way to specify if this target is just used as a surface between buttons 
    };

    cursorTargetComponentMod.start = function start() { };
    cursorTargetComponentMod.update = function update(dt) { };
    cursorTargetComponentMod.onActivate = function onActivate() { };
    cursorTargetComponentMod.onDeactivate = function onDeactivate() { };
    cursorTargetComponentMod.onDestroy = function onDestroy() { };



    PluginUtils.injectProperties(cursorTargetComponentMod, CursorTarget.prototype, false, true, true);
}