let _myAnalyticsEnabled = false;

let _mySendAnalyticsCallback = null;

let _myDataLogEnabled = false;
let _myEventsLogEnabled = false;

let _myErrorsLogEnabled = false;

export function setAnalyticsEnabled(enabled) {
    _myAnalyticsEnabled = enabled;
}

export function isAnalyticsEnabled() {
    return _myAnalyticsEnabled;
}

export function setSendAnalyticsCallback(callback) {
    _mySendAnalyticsCallback = callback;
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

export function sendData(...args) {
    try {
        if (_myAnalyticsEnabled) {
            if (_myDataLogEnabled) {
                console.log("Analytics data sent: " + args);
            }

            if (_mySendAnalyticsCallback != null) {
                _mySendAnalyticsCallback(...args);
            } else if (_myErrorsLogEnabled) {
                console.error("You need to set the send analytics callback");
            }
        }
    } catch (error) {
        if (_myErrorsLogEnabled) {
            console.error(error);
        }
    }
}

export function sendEvent(eventName, value = 1) {
    try {
        if (_myAnalyticsEnabled) {
            if (_myEventsLogEnabled) {
                console.log("Analytics event sent: " + eventName + " - Value: " + value);
            }

            if (_mySendAnalyticsCallback != null) {
                _mySendAnalyticsCallback("event", eventName, { "value": value });
            } else if (_myErrorsLogEnabled) {
                console.error("You need to set the send analytics callback");
            }
        }
    } catch (error) {
        if (_myErrorsLogEnabled) {
            console.error(error);
        }
    }
}

export let AnalyticsUtils = {
    setAnalyticsEnabled,
    isAnalyticsEnabled,
    setSendAnalyticsCallback,
    setDataLogEnabled,
    isDataLogEnabled,
    setEventsLogEnabled,
    isEventsLogEnabled,
    setErrorsLogEnabled,
    isErrorsLogEnabled,
    sendData,
    sendEvent
};