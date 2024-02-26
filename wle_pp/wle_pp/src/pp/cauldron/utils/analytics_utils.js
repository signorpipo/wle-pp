let _myAnalyticsEnabled = false;

let _mySendDataCallback = null;

let _myEventsSentOnce = [];

let _myDataLogEnabled = false;
let _myEventsLogEnabled = false;

let _myErrorsLogEnabled = false;

export function setAnalyticsEnabled(enabled) {
    _myAnalyticsEnabled = enabled;
}

export function isAnalyticsEnabled() {
    return _myAnalyticsEnabled;
}

export function setSendDataCallback(callback) {
    _mySendDataCallback = callback;
}

export function sendData(...args) {
    try {
        if (_myAnalyticsEnabled) {
            if (_myDataLogEnabled) {
                console.log("Analytics Data: " + args);
            }

            if (_mySendDataCallback != null) {
                _mySendDataCallback(...args);
            } else if (_myErrorsLogEnabled) {
                console.error("You need to set the send data callback");
            }
        }
    } catch (error) {
        if (_myErrorsLogEnabled) {
            console.error(error);
        }
    }
}

export function sendEvent(eventName, value = null, sendOnce = false) {
    try {
        if (_myAnalyticsEnabled) {
            let sendEventAllowed = true;

            if (sendOnce) {
                sendEventAllowed = !AnalyticsUtils.hasEventAlreadyBeenSent(eventName);
            }

            if (sendEventAllowed) {
                if (_myEventsLogEnabled) {
                    if (value != null) {
                        console.log("Analytics Event: " + eventName + " - Value: " + value);
                    } else {
                        console.log("Analytics Event: " + eventName);
                    }
                }

                if (_mySendDataCallback != null) {
                    if (value != null) {
                        _mySendDataCallback("event", eventName, { "value": value });
                    } else {
                        _mySendDataCallback("event", eventName);
                    }

                    if (sendOnce) {
                        _myEventsSentOnce.pp_pushUnique(eventName);
                    }
                } else if (_myErrorsLogEnabled) {
                    console.error("You need to set the send data callback");
                }
            }
        }
    } catch (error) {
        if (_myErrorsLogEnabled) {
            console.error(error);
        }
    }
}

export function sendEventOnce(eventName, value = null) {
    AnalyticsUtils.sendEvent(eventName, value, true);
}

export function clearEventSentOnceState(eventName) {
    _myEventsSentOnce.pp_removeEqual(eventName);
}

export function clearAllEventsSentOnceState() {
    _myEventsSentOnce.pp_clear();
}

export function hasEventAlreadyBeenSent(eventName) {
    return _myEventsSentOnce.pp_hasEqual(eventName);
}

export function getEventsAlreadyBeenSent() {
    return _myEventsSentOnce;
}

export function setDataLogEnabled(enabled) {
    _myDataLogEnabled = enabled;
}

export function isDataLogEnabled() {
    return _myDataLogEnabled;
}

export function setEventsLogEnabled(enabled) {
    _myEventsLogEnabled = enabled;
}

export function isEventsLogEnabled() {
    return _myEventsLogEnabled;
}

export function setErrorsLogEnabled(enabled) {
    _myErrorsLogEnabled = enabled;
}

export function isErrorsLogEnabled() {
    return _myErrorsLogEnabled;
}

export let AnalyticsUtils = {
    setAnalyticsEnabled,
    isAnalyticsEnabled,
    setSendDataCallback,
    sendData,
    sendEvent,
    sendEventOnce,
    clearEventSentOnceState,
    clearAllEventsSentOnceState,
    hasEventAlreadyBeenSent,
    getEventsAlreadyBeenSent,
    setDataLogEnabled,
    isDataLogEnabled,
    setEventsLogEnabled,
    isEventsLogEnabled,
    setErrorsLogEnabled,
    isErrorsLogEnabled
};