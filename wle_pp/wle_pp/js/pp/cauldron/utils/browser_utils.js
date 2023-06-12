import { Globals } from "../../pp/globals";
import { XRUtils } from "./xr_utils";

export function isMobile(engine = Globals.getMainEngine()) {
    return /Mobi/i.test(Globals.getNavigator(engine).userAgent);
}

export function isDesktop(engine = Globals.getMainEngine()) {
    return !BrowserUtils.isMobile(engine);
}

export function openLink(url, newTab = true, exitXRSession = true, onSuccessCallback = null, onFailureCallback = null, engine = Globals.getMainEngine()) {
    if (exitXRSession) {
        XRUtils.exitSession(engine);
    }

    let document = Globals.getDocument(engine);

    let element = document.createElement("a");

    element.style.display = "none";

    document.body.appendChild(element);

    element.addEventListener("click", function () {
        let targetPage = undefined;
        if (newTab) {
            targetPage = "_blank";
        }

        let result = window.open(url, targetPage);

        if (result != null) {
            if (onSuccessCallback != null) {
                onSuccessCallback();
            }
        } else {
            if (onFailureCallback != null) {
                onFailureCallback();
            }
        }
    });

    element.click();

    document.body.removeChild(element);
}

export function openLinkPersistent(url, newTab = true, exitXRSession = true, timeOutSeconds = null, onSuccessCallback = null, onFailureCallback = null, engine = Globals.getMainEngine()) {
    let totalSeconds = 0;
    let secondsTillNextAttempt = 0.5;
    let onPersistentFailureCallback = function (...args) {
        if (timeOutSeconds != null && totalSeconds >= timeOutSeconds) {
            if (onFailureCallback != null) {
                onFailureCallback(...args);
            }
        } else {
            totalSeconds += secondsTillNextAttempt;
            setTimeout(function () {
                BrowserUtils.openLink(url, newTab, exitXRSession, onSuccessCallback, onPersistentFailureCallback, engine);
            }, secondsTillNextAttempt * 1000);
        }
    };

    BrowserUtils.openLink(url, newTab, exitXRSession, onSuccessCallback, onPersistentFailureCallback, engine);
}

export let BrowserUtils = {
    isMobile,
    isDesktop,
    openLink,
    openLinkPersistent
};