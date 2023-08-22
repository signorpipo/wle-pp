import { Globals } from "../../pp/globals";
import { XRUtils } from "./xr_utils";

export let isMobile = function () {
    let checkMobileRegex = new RegExp("mobi", "i");
    return function isMobile(engine = Globals.getMainEngine()) {
        let userAgent = Globals.getNavigator(engine).userAgent;
        return userAgent != null && userAgent.match(checkMobileRegex) != null;
    };
}();

export function isDesktop(engine = Globals.getMainEngine()) {
    return !BrowserUtils.isMobile(engine);
}

export function openLink(url, newTab = true, exitXRSessionBeforeOpen = true, exitXRSessionOnSuccess = true, tryOpenLinkOnClickOnFailure = false, onSuccessCallback = null, onFailureCallback = null, engine = Globals.getMainEngine()) {
    let element = document.createElement("a");

    element.style.display = "none";

    document.body.appendChild(element);

    element.addEventListener("click", function () {
        let targetPage = undefined;
        if (newTab) {
            targetPage = "_blank";
        } else {
            targetPage = "_top";
        }

        let result = window.open(url, targetPage);

        if (result != null) {
            if (!exitXRSessionBeforeOpen && exitXRSessionOnSuccess) {
                XRUtils.exitSession(engine);
            }

            if (onSuccessCallback != null) {
                onSuccessCallback();
            }
        } else {
            if (tryOpenLinkOnClickOnFailure) {
                setTimeout(function () {
                    BrowserUtils.openLinkOnClick(url, newTab, exitXRSessionOnSuccess, onSuccessCallback, onFailureCallback);
                }, 100);
            } else if (onFailureCallback != null) {
                onFailureCallback();
            }
        }
    });

    if (exitXRSessionBeforeOpen) {
        XRUtils.exitSession(engine);
    }

    element.click();

    document.body.removeChild(element);
}

export function openLinkOnClick(url, newTab = true, exitXRSessionOnSuccess = true, onSuccessCallback = null, onFailureCallback = null, engine = Globals.getMainEngine()) {
    document.addEventListener("click", function () {
        let targetPage = undefined;
        if (newTab) {
            targetPage = "_blank";
        } else {
            targetPage = "_top";
        }

        let result = window.open(url, targetPage);

        if (result != null) {
            if (exitXRSessionOnSuccess) {
                XRUtils.exitSession(engine);
            }

            if (onSuccessCallback != null) {
                onSuccessCallback();
            }
        } else {
            if (onFailureCallback != null) {
                onFailureCallback();
            }
        }
    }, { once: true });
}

export let BrowserUtils = {
    isMobile,
    isDesktop,
    openLink,
    openLinkOnClick
};