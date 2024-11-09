
export class AnalyticsManager {

    private _myAnalyticsEnabled: boolean = true;

    private _mySendDataCallback: ((...args: unknown[]) => void) | null = null;

    private _myDefaultEventCooldown: number = 0;
    private _myEventCooldowns: Map<string, number> = new Map();

    private _myEventsSentOnce: string[] = [];

    private _myDataLogEnabled: boolean = false;
    private _myEventsLogEnabled: boolean = false;

    private _myErrorsLogEnabled: boolean = false;

    public update(dt: number): void {
        if (this._myEventCooldowns.size > 0) {
            for (const [eventName, eventCooldown] of this._myEventCooldowns.entries()) {
                const newCooldown = eventCooldown - dt;
                if (newCooldown <= 0) {
                    this._myEventCooldowns.delete(eventName);
                } else {
                    this._myEventCooldowns.set(eventName, newCooldown);
                }
            }
        }
    }

    public setAnalyticsEnabled(enabled: boolean): void {
        this._myAnalyticsEnabled = enabled;
    }

    public isAnalyticsEnabled(): boolean {
        return this._myAnalyticsEnabled;
    }

    public setSendDataCallback(callback: ((...args: unknown[]) => void) | null): void {
        this._mySendDataCallback = callback;
    }

    public sendData(...args: unknown[]): boolean {
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

    public sendEvent(eventName: string, params?: Record<string, unknown>): boolean {
        let eventSent = false;

        try {
            if (this._myAnalyticsEnabled) {
                if (this._myEventsLogEnabled) {
                    if (params != null) {
                        console.log("Analytics Event: " + eventName + " - Params:", params);
                    } else {
                        console.log("Analytics Event: " + eventName);
                    }
                }

                if (this._mySendDataCallback != null) {
                    if (params != null) {
                        this._mySendDataCallback("event", eventName, params);
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

    public sendEventOnce(eventName: string, params?: Record<string, unknown>): boolean {
        let eventSent = false;

        if (this._myAnalyticsEnabled) {
            if (!this.hasEventAlreadyBeenSent(eventName)) {
                eventSent = this.sendEvent(eventName, params);

                if (eventSent) {
                    this._myEventsSentOnce.pp_pushUnique(eventName);
                }
            }
        }

        return eventSent;
    }

    public sendEventWithValue(eventName: string, value: number): boolean {
        return this.sendEvent(eventName, { "value": value });
    }

    public sendEventOnceWithValue(eventName: string, value: number): boolean {
        return this.sendEventOnce(eventName, { "value": value });
    }

    public clearEventSentOnceState(eventName: string): void {
        this._myEventsSentOnce.pp_removeEqual(eventName);
    }

    public clearAllEventsSentOnceState(): void {
        this._myEventsSentOnce.pp_clear();
    }

    public hasEventAlreadyBeenSent(eventName: string): boolean {
        return this._myEventsSentOnce.pp_hasEqual(eventName);
    }

    public getEventsAlreadyBeenSent(): string[] {
        return this._myEventsSentOnce;
    }

    public sendEventWithCooldown(eventName: string, cooldownSeconds: number = this._myDefaultEventCooldown, params?: Record<string, unknown>): boolean {
        let eventSent = false;

        if (this._myAnalyticsEnabled) {
            if (this.getEventCooldown(eventName) <= 0) {
                eventSent = this.sendEvent(eventName, params);

                if (eventSent) {
                    this._myEventCooldowns.set(eventName, cooldownSeconds);
                }
            }
        }

        return eventSent;
    }

    public getDefaultEventCooldown(): number {
        return this._myDefaultEventCooldown;
    }

    public setDefaultEventCooldown(cooldownSeconds: number): void {
        this._myDefaultEventCooldown = cooldownSeconds;
    }

    public clearEventCooldown(eventName: string): void {
        this._myEventCooldowns.delete(eventName);
    }

    public clearAllEventCooldowns(): void {
        this._myEventCooldowns.clear();
    }

    public getEventCooldown(eventName: string): number {
        const eventCooldown = this._myEventCooldowns.get(eventName);

        if (eventCooldown != null) {
            return eventCooldown;
        }

        return 0;
    }

    public getEventCooldowns(): Map<string, number> {
        return this._myEventCooldowns;
    }

    public setDataLogEnabled(enabled: boolean): void {
        this._myDataLogEnabled = enabled;
    }

    public isDataLogEnabled(): boolean {
        return this._myDataLogEnabled;
    }

    public setEventsLogEnabled(enabled: boolean): void {
        this._myEventsLogEnabled = enabled;
    }

    public isEventsLogEnabled(): boolean {
        return this._myEventsLogEnabled;
    }

    public setErrorsLogEnabled(enabled: boolean): void {
        this._myErrorsLogEnabled = enabled;
    }

    public isErrorsLogEnabled(): boolean {
        return this._myErrorsLogEnabled;
    }
}