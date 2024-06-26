/**
 * #WARN this type extension is actually added at runtime only if you call `initNumberExtension`  
 * The `initPP` function, which is automatically called by the `pp-gateway` component, does this for you
 * 
 * -
 * 
 * 
 * This extension is needed to make it easier to use plain numbers for parameters that also accept `NumberOverFactor`
 */
export interface NumberExtension {
    get(factor?: number): number;
}

declare global {
    interface Number extends NumberExtension { }
}