let _myAnalyticsEnabled: boolean = false;

let _mySendDataCallback: ((...args: unknown[]) => void) | null = null;

const _myEventsSentOnce: string[] = [];

let _myDataLogEnabled: boolean = false;
let _myEventsLogEnabled: boolean = false;

let _myErrorsLogEnabled: boolean = false;

export function setAnalyticsEnabled(enabled: boolean): void {
    _myAnalyticsEnabled = enabled;
}

export function isAnalyticsEnabled(): boolean {
    return _myAnalyticsEnabled;
}

export function setSendDataCallback(callback: ((...args: unknown[]) => void) | null): void {
    _mySendDataCallback = callback;
}

export function sendData(...args: unknown[]): boolean {
    let dataSent = false;

    try {
        if (_myAnalyticsEnabled) {
            if (_myDataLogEnabled) {
                console.log("Analytics Data: " + args);
            }

            if (_mySendDataCallback != null) {
                _mySendDataCallback(...args);

                dataSent = true;
            } else if (_myErrorsLogEnabled) {
                console.error("You need to set the send data callback");
            }
        }
    } catch (error) {
        if (_myErrorsLogEnabled) {
            console.error(error);
        }

        dataSent = false;
    }

    return dataSent;
}

export function sendEvent(eventName: string, params?: Record<string, unknown>): boolean {
    let eventSent = false;

    try {
        if (_myAnalyticsEnabled) {
            if (_myEventsLogEnabled) {
                if (params != null) {
                    console.log("Analytics Event: " + eventName + " - Params:", params);
                } else {
                    console.log("Analytics Event: " + eventName);
                }
            }

            if (_mySendDataCallback != null) {
                if (params != null) {
                    _mySendDataCallback("event", eventName, params);
                } else {
                    _mySendDataCallback("event", eventName);
                }

                eventSent = true;
            } else if (_myErrorsLogEnabled) {
                console.error("Analytics Error: You need to set the send data callback");
            } else {
                console.warn("Analytics Error: You need to set the send data callback");
            }
        }
    } catch (error) {
        if (_myErrorsLogEnabled) {
            console.error(error);
        }

        eventSent = false;
    }

    return eventSent;
}

export function sendEventOnce(eventName: string, params?: Record<string, unknown>): boolean {
    let eventSent = false;

    if (_myAnalyticsEnabled) {
        if (!AnalyticsUtils.hasEventAlreadyBeenSent(eventName)) {
            eventSent = AnalyticsUtils.sendEvent(eventName, params);

            if (eventSent) {
                _myEventsSentOnce.pp_pushUnique(eventName);
            }
        }
    }

    return eventSent;
}

export function sendEventWithValue(eventName: string, value: number): boolean {
    return AnalyticsUtils.sendEvent(eventName, { "value": value });
}

export function sendEventOnceWithValue(eventName: string, value: number): boolean {
    return AnalyticsUtils.sendEventOnce(eventName, { "value": value });
}

export function clearEventSentOnceState(eventName: string): void {
    _myEventsSentOnce.pp_removeEqual(eventName);
}

export function clearAllEventsSentOnceState(): void {
    _myEventsSentOnce.pp_clear();
}

export function hasEventAlreadyBeenSent(eventName: string): boolean {
    return _myEventsSentOnce.pp_hasEqual(eventName);
}

export function getEventsAlreadyBeenSent(): string[] {
    return _myEventsSentOnce;
}

export function setDataLogEnabled(enabled: boolean): void {
    _myDataLogEnabled = enabled;
}

export function isDataLogEnabled(): boolean {
    return _myDataLogEnabled;
}

export function setEventsLogEnabled(enabled: boolean): void {
    _myEventsLogEnabled = enabled;
}

export function isEventsLogEnabled(): boolean {
    return _myEventsLogEnabled;
}

export function setErrorsLogEnabled(enabled: boolean): void {
    _myErrorsLogEnabled = enabled;
}

export function isErrorsLogEnabled(): boolean {
    return _myErrorsLogEnabled;
}

export const AnalyticsUtils = {
    setAnalyticsEnabled,
    isAnalyticsEnabled,
    setSendDataCallback,
    sendData,
    sendEvent,
    sendEventOnce,
    sendEventWithValue,
    sendEventOnceWithValue,
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
} as const;