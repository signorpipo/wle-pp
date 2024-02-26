import { Globals } from "../../pp/globals.js";
import { BrowserUtils } from "./browser_utils.js";

export function getSession(engine = Globals.getMainEngine()) {
    let xr = Globals.getXR(engine);
    return xr != null ? xr.session : null;
}

export function getSessionMode(engine = Globals.getMainEngine()) {
    let xr = Globals.getXR(engine);
    return xr != null ? xr.sessionMode : null;
}

export function getReferenceSpace(engine = Globals.getMainEngine()) {
    let xr = Globals.getXR(engine);
    return xr != null ? xr.currentReferenceSpace : null;
}

export function getReferenceSpaceType(engine = Globals.getMainEngine()) {
    let type = "local";

    try {
        let xr = Globals.getXR(engine);
        type = xr != null ? xr.currentReferenceSpaceType : null;
    } catch (error) {
        // Do nothing
    }

    return type;
}

export function getFrame(engine = Globals.getMainEngine()) {
    let xr = Globals.getXR(engine);
    return xr != null ? xr.frame : null;
}

export function isSessionActive(engine = Globals.getMainEngine()) {
    return XRUtils.getSession(engine) != null;
}

export function isReferenceSpaceFloorBased(engine = Globals.getMainEngine()) {
    return XRUtils.getReferenceSpaceType(engine).includes("floor");
}

export function exitSession(engine = Globals.getMainEngine()) {
    let xrSession = XRUtils.getSession(engine);

    if (xrSession != null) {
        xrSession.end();
    }
}

export function registerSessionStartEventListener(id, listener, manuallyCallSessionStartIfSessionAlreadyActive = true, addManualCallFlagToStartListener = false, engine = Globals.getMainEngine()) {
    if (listener != null) {
        if (addManualCallFlagToStartListener) {
            engine.onXRSessionStart.add(listener.bind(undefined, false), { id: id, immediate: false });
        } else {
            engine.onXRSessionStart.add(listener, { id: id, immediate: false });
        }

        if (manuallyCallSessionStartIfSessionAlreadyActive && XRUtils.isSessionActive(engine)) {
            if (addManualCallFlagToStartListener) {
                listener(true, XRUtils.getSession(engine), XRUtils.getSessionMode(engine));
            } else {
                listener(XRUtils.getSession(engine), XRUtils.getSessionMode(engine));
            }
        }
    }
}

export function unregisterSessionStartEventListener(id, engine = Globals.getMainEngine()) {
    engine.onXRSessionStart.remove(id);
}

export function registerSessionEndEventListener(id, listener, engine = Globals.getMainEngine()) {
    if (listener != null) {
        engine.onXRSessionEnd.add(listener, { id: id });
    }
}

export function unregisterSessionEndEventListener(id, engine = Globals.getMainEngine()) {
    return engine.onXRSessionEnd.remove(id);
}

export function registerSessionStartEndEventListeners(id, startListener, endListener, manuallyCallSessionStartIfSessionAlreadyActive = true, addManualCallFlagToStartListener = false, engine = Globals.getMainEngine()) {
    XRUtils.registerSessionEndEventListener(id, endListener, engine);
    XRUtils.registerSessionStartEventListener(id, startListener, manuallyCallSessionStartIfSessionAlreadyActive, addManualCallFlagToStartListener, engine);
}

export function unregisterSessionStartEndEventListeners(id, engine = Globals.getMainEngine()) {
    XRUtils.unregisterSessionEndEventListener(id, engine);
    XRUtils.unregisterSessionStartEventListener(id, engine);
}

export function isXRSupported(engine = Globals.getMainEngine()) {
    return XRUtils.isVRSupported(engine) || XRUtils.isARSupported(engine);
}

export function isVRSupported(engine = Globals.getMainEngine()) {
    return engine.vrSupported;
}

export function isARSupported(engine = Globals.getMainEngine()) {
    return engine.arSupported;
}

export function isDeviceEmulated(onlyOnLocalhost = true) {
    let emulated = window.CustomWebXRPolyfill != null && (!onlyOnLocalhost || BrowserUtils.isLocalhost());
    return emulated;
}

export let XRUtils = {
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
};