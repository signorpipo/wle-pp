import { Emitter } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import { PluginUtils } from "../../../utils/plugin_utils.js";

import "./cursor_target_component_type_extension.js";

export function initCursorTargetComponentMod(): void {
    _initCursorTargetComponentModPrototype();
}

function _initCursorTargetComponentModPrototype(): void {

    const cursorTargetComponentMod: Record<string, unknown> = {

        // New Functions 

        init: function init(this: CursorTarget): void {
            this.onSingleClick = new Emitter();
            this.onDoubleClick = new Emitter();
            this.onTripleClick = new Emitter();

            this.onDownOnHover = new Emitter();

            this.onUpWithDown = new Emitter();
            this.onUpWithNoDown = new Emitter();

            this.isSurface = false;
        },

        start: function start(): void { },
        update: function update(dt: number): void { },
        onActivate: function onActivate(): void { },
        onDeactivate: function onDeactivate(): void { },
        onDestroy: function onDestroy(): void { },
    };



    PluginUtils.injectOwnProperties(cursorTargetComponentMod, CursorTarget.prototype, false, true, true);
}