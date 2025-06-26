import { Globals } from "../../pp/globals.js";
import { XRUtils } from "./xr_utils.js";

export let isMobile = function () {
    let checkMobileRegex = new RegExp("Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini", "i");
    return function isMobile() {
        let userAgent = navigator.userAgent;
        return userAgent != null && checkMobileRegex.test(userAgent);
    };
}();

export function isDesktop() {
    return !BrowserUtils.isMobile();
}

export let isLocalhost = function () {
    let localhostRegex = new RegExp("(localhost|127\\.0\\.0\\.1)(:(\\d{4}))?");
    return function isLocalhost(port = null, isRegex = false) {
        let isLocalhost = false;

        let localhostMatch = window.location.origin.match(localhostRegex);

        if (localhostMatch != null) {
            if (port == null) {
                isLocalhost = true;
            } else if (localhostMatch.length >= 4 && localhostMatch[3] != null) {
                let portMatch = localhostMatch[3];
                if (isRegex) {
                    isLocalhost = portMatch.match(port) != null;
                } else {
                    isLocalhost = portMatch == port;
                }
            }
        }

        return isLocalhost;
    };
}();

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
    isLocalhost,
    openLink,
    openLinkOnClick
};