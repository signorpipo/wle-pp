import { WonderlandEngine, type RetainListenerOptions } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { BrowserUtils } from "./browser_utils.js";

export function getSession(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): XRSession | null {
    const xr = Globals.getXR(engine);
    return xr != null ? xr.session : null;
}

export function getSessionMode(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): XRSessionMode | null {
    const xr = Globals.getXR(engine);
    return xr != null ? xr.sessionMode : null;
}

export function getReferenceSpace(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): XRReferenceSpace | null {
    const xr = Globals.getXR(engine);
    return xr != null ? xr.currentReferenceSpace : null;
}

export function getReferenceSpaceType(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): XRReferenceSpaceType | null {
    let type: XRReferenceSpaceType | null = "local";

    try {
        const xr = Globals.getXR(engine);
        type = xr != null ? xr.currentReferenceSpaceType : null;
    } catch (error) {
        // Do nothing
    }

    return type;
}

export function getFrame(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): XRFrame | null {
    const xr = Globals.getXR(engine);
    return xr != null ? xr.frame : null;
}

export function isSessionActive(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): boolean {
    return XRUtils.getSession(engine) != null;
}

export function isReferenceSpaceFloorBased(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): boolean {
    const referenceSpaceType = XRUtils.getReferenceSpaceType(engine);
    return referenceSpaceType != null ? referenceSpaceType.includes("floor") : false;
}

export function exitSession(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    const xrSession = XRUtils.getSession(engine);

    if (xrSession != null) {
        xrSession.end();
    }
}

export function registerSessionStartEventListener(id: unknown, listener: ((xrSession: XRSession, xrSessionMode: XRSessionMode) => void) | ((manualCall: boolean, xrSession: XRSession, xrSessionMode: XRSessionMode) => void), manuallyCallSessionStartIfSessionAlreadyActive = true, addManualCallFlagToStartListener = false, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    if (listener != null) {
        if (addManualCallFlagToStartListener) {
            const manualStartListener = listener as (manualCall: boolean, xrSession: XRSession, xrSessionMode: XRSessionMode) => void;
            engine.onXRSessionStart.add(manualStartListener.bind(undefined, false), { id: id, immediate: false } as RetainListenerOptions);
        } else {
            const standardListener = listener as (xrSession: XRSession, xrSessionMode: XRSessionMode) => void;
            engine.onXRSessionStart.add(standardListener, { id: id, immediate: false } as RetainListenerOptions);
        }

        if (manuallyCallSessionStartIfSessionAlreadyActive && XRUtils.isSessionActive(engine)) {
            if (addManualCallFlagToStartListener) {
                const manualStartListener = listener as (manualCall: boolean, xrSession: XRSession, xrSessionMode: XRSessionMode) => void;
                manualStartListener(true, XRUtils.getSession(engine)!, XRUtils.getSessionMode(engine)!);
            } else {
                const standardListener = listener as (xrSession: XRSession, xrSessionMode: XRSessionMode) => void;
                standardListener(XRUtils.getSession(engine)!, XRUtils.getSessionMode(engine)!);
            }
        }
    }
}

export function unregisterSessionStartEventListener(id: unknown, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    engine.onXRSessionStart.remove(id);
}

export function registerSessionEndEventListener(id: unknown, listener: () => void, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    if (listener != null) {
        engine.onXRSessionEnd.add(listener, { id: id });
    }
}

export function unregisterSessionEndEventListener(id: unknown, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    engine.onXRSessionEnd.remove(id);
}

export function registerSessionStartEndEventListeners(id: unknown, startListener: ((xrSession: XRSession, xrSessionMode: XRSessionMode) => void) | ((manualCall: boolean, xrSession: XRSession, xrSessionMode: XRSessionMode) => void), endListener: () => void, manuallyCallSessionStartIfSessionAlreadyActive = true, addManualCallFlagToStartListener = false, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    XRUtils.registerSessionEndEventListener(id, endListener, engine);
    XRUtils.registerSessionStartEventListener(id, startListener, manuallyCallSessionStartIfSessionAlreadyActive, addManualCallFlagToStartListener, engine);
}

export function unregisterSessionStartEndEventListeners(id: unknown, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    XRUtils.unregisterSessionEndEventListener(id, engine);
    XRUtils.unregisterSessionStartEventListener(id, engine);
}

export function isXRSupported(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): boolean {
    return XRUtils.isVRSupported(engine) || XRUtils.isARSupported(engine);
}

export function isVRSupported(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): boolean {
    return engine.vrSupported;
}

export function isARSupported(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): boolean {
    return engine.arSupported;
}

export function isDeviceEmulated(onlyOnLocalhost: boolean = true): boolean {
    const emulated = (window as unknown as { CustomWebXRPolyfill: unknown }).CustomWebXRPolyfill != null && (!onlyOnLocalhost || BrowserUtils.isLocalhost());
    return emulated;
}

export const XRUtils = {
    getSession,
    getSessionMode,
    getReferenceSpace,
    getReferenceSpaceType,
    getFrame,
    isSessionActive,
    exitSession,
    registerSessionStartEventListener,
    unregisterSessionStartEventListener,
    registerSessionEndEventListener,
    unregisterSessionEndEventListener,
    registerSessionStartEndEventListeners,
    unregisterSessionStartEndEventListeners,
    isReferenceSpaceFloorBased,
    isXRSupported,
    isVRSupported,
    isARSupported,
    isDeviceEmulated
} as const;