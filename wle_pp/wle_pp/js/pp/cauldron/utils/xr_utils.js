import { Globals } from "../../pp/globals";

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

export function registerSessionStartEventListener(id, listener, manuallyCallSessionStartIfSessionAlreadyActive = false, addManualCallFlagToStartListener = false, engine = Globals.getMainEngine()) {
    if (listener != null) {
        if (manuallyCallSessionStartIfSessionAlreadyActive && XRUtils.isSessionActive(engine)) {
            if (addManualCallFlagToStartListener) {
                listener(true, XRUtils.getSession(engine), XRUtils.getSessionMode(engine));
            } else {
                listener(XRUtils.getSession(engine), XRUtils.getSessionMode(engine));
            }
        }

        if (addManualCallFlagToStartListener) {
            engine.onXRSessionStart.add(listener.bind(undefined, false), { id: id, immediate: false });
        } else {
            engine.onXRSessionStart.add(listener, { id: id, immediate: false });
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

export function registerSessionStartEndEventListeners(id, startListener, endListener, manuallyCallSessionStartIfSessionAlreadyActive = false, addManualCallFlagToStartListener = false, engine = Globals.getMainEngine()) {
    XRUtils.registerSessionStartEventListener(id, startListener, manuallyCallSessionStartIfSessionAlreadyActive, addManualCallFlagToStartListener, engine);
    XRUtils.registerSessionEndEventListener(id, endListener, engine);
}

export function unregisterSessionStartEndEventListeners(id, engine = Globals.getMainEngine()) {
    XRUtils.unregisterSessionStartEventListener(id, engine);
    XRUtils.unregisterSessionEndEventListener(id, engine);
}

export function isVRSupported(engine = Globals.getMainEngine()) {
    return engine.vrSupported;
}

export function isARSupported(engine = Globals.getMainEngine()) {
    return engine.arSupported;
}

export function isDeviceEmulated(engine = Globals.getMainEngine()) {
    let emulated = ("CustomWebXRPolyfill" in Globals.getWindow(engine));
    return emulated;
}

export let XRUtils = {
    getSession,
    getSessionMode,
    getReferenceSpace,
    getReferenceSpaceType,
    getFrame,
    isSessionActive,
    registerSessionStartEventListener,
    unregisterSessionStartEventListener,
    registerSessionEndEventListener,
    unregisterSessionEndEventListener,
    registerSessionStartEndEventListeners,
    unregisterSessionStartEndEventListeners,
    isReferenceSpaceFloorBased,
    isVRSupported,
    isARSupported,
    isDeviceEmulated
};