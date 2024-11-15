import { Handedness } from "wle-pp/input/cauldron/input_types.js";

/**
 * #WARN this type extension is actually added at runtime only if you call `initCursorComponentMod`  
 * The `initPP` function, which is automatically called by the `pp-gateway` component, does this for you
 */
export interface CursorExtension {
    handednessTyped: Handedness | null;
}

declare module "@wonderlandengine/components" {
    interface Cursor extends CursorExtension { }
}