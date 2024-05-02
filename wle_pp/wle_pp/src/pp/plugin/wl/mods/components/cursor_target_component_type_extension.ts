/**
 * #WARN this type extension is actually added at runtime only if you call `initCursorTargetComponentMod`  
 * The `initPP` function, which is automatically called by the `pp-gateway` component, does this for you
 */

import { Emitter, Object3D } from "@wonderlandengine/api";
import { Cursor, type EventTypes } from "@wonderlandengine/components";

export interface CursorTargetExtension {
    onSingleClick: Emitter<[Object3D, Cursor, (EventTypes | undefined)?]>;
    onDoubleClick: Emitter<[Object3D, Cursor, (EventTypes | undefined)?]>;
    onTripleClick: Emitter<[Object3D, Cursor, (EventTypes | undefined)?]>;

    onDownOnHover: Emitter<[Object3D, Cursor, (EventTypes | undefined)?]>;

    onUpWithDown: Emitter<[Object3D, Cursor, (EventTypes | undefined)?]>;
    onUpWithNoDown: Emitter<[Object3D, Cursor, (EventTypes | undefined)?]>;

    /** Specify if this cursor target is just used as a surface and should not react to custom button logics 
        you have implemented, like making the gamepad pulse on hover only for buttons and not surfaces*/
    isSurface: boolean;
}

declare module "@wonderlandengine/components" {
    interface CursorTarget extends CursorTargetExtension { }
}