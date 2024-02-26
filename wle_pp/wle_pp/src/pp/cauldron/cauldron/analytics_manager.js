export class AnalyticsManager {
    constructor() {
        this._myAnalyticsEnabled = true;

        this._mySendDataCallback = null;

        this._myDefaultEventCooldown = 0;
        this._myEventCooldowns = new Map();

        this._myDataLogEnabled = false;
        this._myEventsLogEnabled = false;

        this._myErrorsLogEnabled = false;
    }

    update(dt) {
        if (this._myEventCooldowns.size > 0) {
            let eventNamesToUpdateCooldown = this._myEventCooldowns.keys();
            for (let eventName of eventNamesToUpdateCooldown) {
                let newCooldown = this._myEventCooldowns.get(eventName) - dt;
                if (newCooldown <= 0) {
                    this._myEventCooldowns.delete(eventName);
                } else {
                    this._myEventCooldowns.set(eventName, newCooldown);
                }
            }
        }
    }

    setAnalyticsEnabled(enabled) {
        this._myAnalyticsEnabled = enabled;
    }

    isAnalyticsEnabled() {
        return this._myAnalyticsEnabled;
    }

    setSendDataCallback(callback) {
        this._mySendDataCallback = callback;
    }

    sendData(...args) {
        let dataSent = false;

        try {
            if (this._myAnalyticsEnabled) {
                if (this._myDataLogEnabled) {
                    console.log("Analytics Data: " + args);
                }

                if (this._mySendDataCallback != null) {
                    this._mySendDataCallback(...args);

                    dataSent = true;
                } else if (this._myErrorsLogEnabled) {
                    console.error("Analytics Error: You need to set the send data callback");
                } else {
                    console.warn("Analytics Error: You need to set the send data callback");
                }
            }
        } catch (error) {
            if (this._myErrorsLogEnabled) {
                console.error(error);
            }

            dataSent = false;
        }

        return dataSent;
    }

    sendEvent(eventName, value = null) {
        let eventSent = false;

        try {
            if (this._myAnalyticsEnabled) {
                if (this._myEventsLogEnabled) {
                    if (value != null) {
                        console.log("Analytics Event: " + eventName + " - Value: " + value);
                    } else {
                        console.log("Analytics Event: " + eventName);
                    }
                }

                if (this._mySendDataCallback != null) {
                    if (value != null) {
                        this._mySendDataCallback("event", eventName, { "value": value });
                    } else {
                        this._mySendDataCallback("event", eventName);
                    }

                    eventSent = true;
                } else if (this._myErrorsLogEnabled) {
                    console.error("Analytics Error: You need to set the send data callback");
                } else {
                    console.warn("Analytics Error: You need to set the send data callback");
                }
            }
        } catch (error) {
            if (this._myErrorsLogEnabled) {
                console.error(error);
            }

            eventSent = false;
        }

        return eventSent;
    }

    sendEventOnce(eventName, value = null) {
        if (this._myAnalyticsEnabled) {
            if (!this.hasEventAlreadyBeenSent(eventName)) {
                let eventSent = this.sendEvent(eventName, value, true);

                if (eventSent) {
                    this._myEventsSentOnce.pp_pushUnique(eventName);
                }
            }
        }
    }

    clearEventSentOnceState(eventName) {
        this._myEventsSentOnce.pp_removeEqual(eventName);
    }

    clearAllEventsSentOnceState() {
        this._myEventsSentOnce.pp_clear();
    }

    hasEventAlreadyBeenSent(eventName) {
        return this._myEventsSentOnce.pp_hasEqual(eventName);
    }

    getEventsAlreadyBeenSent() {
        return this._myEventsSentOnce;
    }

    sendEventWithCooldown(eventName, value = null, cooldownSeconds = this._myDefaultEventCooldown) {
        if (this._myAnalyticsEnabled) {
            if (this.getEventCooldown(eventName) <= 0) {
                let eventSent = this.sendEvent(eventName, value, true);

                if (eventSent) {
                    this._myEventCooldowns.set(eventName, cooldownSeconds);
                }
            }
        }
    }

    getDefaultEventCooldown() {
        return this._myDefaultEventCooldown;
    }

    setDefaultEventCooldown(cooldownSeconds) {
        this._myDefaultEventCooldown = cooldownSeconds;
    }

    clearEventCooldown(eventName) {
        this._myEventCooldowns.delete(eventName);
    }

    clearAllEventCooldowns() {
        this._myEventCooldowns.clear();
    }

    getEventCooldown(eventName) {
        let eventCooldown = this._myEventCooldowns.get(eventName);

        if (eventCooldown != null) {
            return eventCooldown;
        }

        return 0;
    }

    getEventCooldowns() {
        return this._myEventCooldowns;
    }

    setDataLogEnabled(enabled) {
        this._myDataLogEnabled = enabled;
    }

    isDataLogEnabled() {
        return this._myDataLogEnabled;
    }

    setEventsLogEnabled(enabled) {
        this._myEventsLogEnabled = enabled;
    }

    isEventsLogEnabled() {
        return this._myEventsLogEnabled;
    }

    setErrorsLogEnabled(enabled) {
        this._myErrorsLogEnabled = enabled;
    }

    isErrorsLogEnabled() {
        return this._myErrorsLogEnabled;
    }
}