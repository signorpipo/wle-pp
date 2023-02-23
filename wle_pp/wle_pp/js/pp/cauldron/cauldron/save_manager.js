PP.SaveManager = class SaveManager {
    constructor() {
        this._mySaveCache = new Map();
        this._myCacheEnabled = true;

        this._myCommitSavesDelayTimer = new PP.Timer(0, false);
        this._myDelaySavesCommit = true;
        this._myIDsToCommit = [];

        this._myCacheDefaultValueOnFail = true;

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));

        this._myClearCallbacks = new Map();                 // Signature: callback()
        this._myDeleteCallbacks = new Map();                // Signature: callback(id)
        this._myDeleteIDCallbacks = new Map();              // Signature: callback(id)
        this._mySaveCallbacks = new Map();                  // Signature: callback(id, value)
        this._mySaveValueChangedCallbacks = new Map();      // Signature: callback(id, value)
        this._mySaveIDCallbacks = new Map();                // Signature: callback(id, value)
        this._mySaveValueChangedIDCallbacks = new Map();    // Signature: callback(id, value)
        this._myCommitSaveCallbacks = new Map();            // Signature: callback(id, value, isCommitSaveDelayed, failed)
        this._myCommitSaveIDCallbacks = new Map();          // Signature: callback(id, value, isCommitSaveDelayed, failed)
        this._myCommitSavesCallbacks = new Map();           // Signature: callback(isCommitSavesDelayed, failed)

        this._myLoadCallbacks = new Map();                  // Signature: callback(id, value, loadFromCache, failed)
        this._myLoadIDCallbacks = new Map();                // Signature: callback(id, value, loadFromCache, failed)
    }

    setCommitSavesDelay(delay) {
        this._myCommitSavesDelayTimer.start(delay);
    }

    setDelaySavesCommit(delayed) {
        this._myDelaySavesCommit = delayed;
    }

    setCacheDefaultValueOnFail(cache) {
        this._myCacheDefaultValueOnFail = cache;
    }

    setCacheEnabled(enabled) {
        this._myCacheEnabled = enabled;
    }

    update(dt) {
        if (this._myCommitSavesDelayTimer.isRunning()) {
            this._myCommitSavesDelayTimer.update(dt);
            if (this._myCommitSavesDelayTimer.isDone()) {
                this.commitSaves();
            }
        }
    }

    save(id, value, overrideDelaySavesCommit = null, overrideCacheEnabled = null) {
        let sameValue = false;
        if (this._mySaveCache.has(id) && this._isCacheEnabled(overrideCacheEnabled)) {
            sameValue = this._mySaveCache.get(id) === value;
        }

        if (!sameValue) {
            this._mySaveCache.set(id, value);
            if ((this._myDelaySavesCommit && overrideDelaySavesCommit == null) || (overrideDelaySavesCommit != null && overrideDelaySavesCommit)) {
                this._myIDsToCommit.pp_pushUnique(id);
                if (!this._myCommitSavesDelayTimer.isRunning()) {
                    this._myCommitSavesDelayTimer.start();
                }
            } else {
                let failed = this._commitSave(id, false);

                if (this._myCommitSavesCallbacks.size > 0) {
                    let isCommitSaveDelayed = false;
                    this._myCommitSavesCallbacks.forEach(function (callback) { callback(isCommitSaveDelayed, failed); });
                }
            }
        }

        if (this._mySaveCallbacks.size > 0) {
            this._mySaveCallbacks.forEach(function (callback) { callback(id, value); });
        }

        if (this._mySaveIDCallbacks.size > 0) {
            let callbacks = this._mySaveIDCallbacks.get(id);
            if (callbacks != null) {
                callbacks.forEach(function (callback) { callback(id, value); });
            }
        }

        if (!sameValue) {
            if (this._mySaveValueChangedCallbacks.size > 0) {
                this._mySaveValueChangedCallbacks.forEach(function (callback) { callback(id, value); });
            }

            if (this._mySaveValueChangedIDCallbacks.size > 0) {
                let callbacks = this._mySaveValueChangedIDCallbacks.get(id);
                if (callbacks != null) {
                    callbacks.forEach(function (callback) { callback(id, value); });
                }
            }
        }
    }

    commitSaves() {
        if (this._myIDsToCommit.length > 0) {
            let failed = false;

            for (let id of this._myIDsToCommit) {
                if (this._mySaveCache.has(id)) {
                    let result = this._commitSave(id, true);
                    failed = failed || result;
                }
            }

            this._myIDsToCommit = [];

            if (this._myCommitSavesCallbacks.size > 0) {
                let isCommitSavesDelayed = true;
                this._myCommitSavesCallbacks.forEach(function (callback) { callback(isCommitSavesDelayed, failed); });
            }
        }
    }

    has(id, overrideCacheEnabled = null) {
        return (this._mySaveCache.has(id) && this._isCacheEnabled(overrideCacheEnabled)) || PP.SaveUtils.has(id);
    }

    delete(id) {
        this._mySaveCache.delete(id);
        PP.SaveUtils.delete(id);

        if (this._myDeleteCallbacks.size > 0) {
            this._myDeleteCallbacks.forEach(function (callback) { callback(id); });
        }

        if (this._myDeleteIDCallbacks.size > 0) {
            let callbacks = this._myDeleteIDCallbacks.get(id);
            if (callbacks != null) {
                callbacks.forEach(function (callback) { callback(id); });
            }
        }
    }

    clear() {
        this._mySaveCache.clear();
        PP.SaveUtils.clear();

        if (this._myClearCallbacks.size > 0) {
            this._myClearCallbacks.forEach(function (callback) { callback(); });
        }
    }

    load(id, defaultValue = null, overrideCacheEnabled = null) {
        return this._load(id, defaultValue, "load", overrideCacheEnabled);
    }

    loadString(id, defaultValue = null, overrideCacheEnabled = null) {
        return this._load(id, defaultValue, "loadString", overrideCacheEnabled);
    }

    loadNumber(id, defaultValue = null, overrideCacheEnabled = null) {
        return this._load(id, defaultValue, "loadNumber", overrideCacheEnabled);
    }

    loadBool(id, defaultValue = null, overrideCacheEnabled = null) {
        return this._load(id, defaultValue, "loadBool", overrideCacheEnabled);
    }

    getCommitSavesDelay() {
        return this._myCommitSavesDelayTimer.getDuration();
    }

    isDelaySavesCommit() {
        return this._myDelaySavesCommit;
    }

    isCacheDefaultValueOnFail() {
        return this._myCacheDefaultValueOnFail;
    }

    isCacheEnabled() {
        return this._myCacheEnabled;
    }

    _commitSave(id, isCommitSaveDelayed) {
        let value = this._mySaveCache.get(id);
        let failed = false;

        try {
            PP.SaveUtils.save(id, value);
        } catch (error) {
            failed = true;
        }

        if (this._myCommitSaveCallbacks.size > 0) {
            this._myCommitSaveCallbacks.forEach(function (callback) { callback(id, value, isCommitSaveDelayed, failed); });
        }

        if (this._myCommitSaveIDCallbacks.size > 0) {
            let callbacks = this._myCommitSaveIDCallbacks.get(id);
            if (callbacks != null) {
                callbacks.forEach(function (callback) { callback(id, value, isCommitSaveDelayed, failed); });
            }
        }

        return failed;
    }

    _load(id, defaultValue, functionName, overrideCacheEnabled = null) {
        let value = null;
        let failed = false;
        let loadFromCache = false;

        if (this._mySaveCache.has(id) && this._isCacheEnabled(overrideCacheEnabled)) {
            value = this._mySaveCache.get(id);

            if (value == null && defaultValue != null) {
                value = defaultValue;
                if (this._myCacheDefaultValueOnFail) {
                    this._mySaveCache.set(id, value);
                }
            }

            loadFromCache = true;
        } else {
            let saveResult = null;
            try {
                saveResult = PP.SaveUtils[functionName](id, null);
            } catch (error) {
                // Error is managed as if it worked but there was no value
                saveResult = null;
                failed = true;
            }

            if (saveResult == null) {
                value = defaultValue;
            } else {
                value = saveResult;
            }

            if (saveResult != null || this._myCacheDefaultValueOnFail) {
                this._mySaveCache.set(id, value);
            } else {
                this._mySaveCache.set(id, null);
            }
        }

        if (this._myLoadCallbacks.size > 0) {
            this._myLoadCallbacks.forEach(function (callback) { callback(id, value, loadFromCache, failed); });
        }

        if (this._myLoadIDCallbacks.size > 0) {
            let callbacks = this._myLoadIDCallbacks.get(id);
            if (callbacks != null) {
                callbacks.forEach(function (callback) { callback(id, value, loadFromCache, failed); });
            }
        }

        return value;
    }

    _onXRSessionStart(session) {
        session.addEventListener('visibilitychange', function (event) {
            if (event.session.visibilityState != "visible") {
                this._onXRSessionInterrupt();
            }
        }.bind(this));
    }

    _onXRSessionEnd() {
        this._onXRSessionInterrupt();
    }

    _onXRSessionInterrupt() {
        this.commitSaves();
    }

    registerClearEventListener(callbackID, callback) {
        this._myClearCallbacks.set(callbackID, callback);
    }

    unregisterClearEventListener(callbackID) {
        this._myClearCallbacks.delete(callbackID);
    }

    registerDeleteEventListener(callbackID, callback) {
        this._myDeleteCallbacks.set(callbackID, callback);
    }

    unregisterDeleteEventListener(callbackID) {
        this._myDeleteCallbacks.delete(callbackID);
    }

    registerDeleteIDEventListener(valueID, callbackID, callback) {
        let valueIDCallbacks = this._myDeleteIDCallbacks.get(valueID);
        if (valueIDCallbacks == null) {
            this._myDeleteIDCallbacks.set(valueID, new Map());
            valueIDCallbacks = this._myDeleteIDCallbacks.get(valueID);
        }

        valueIDCallbacks.set(callbackID, callback);
    }

    unregisterDeleteIDEventListener(valueID, callbackID) {
        let valueIDCallbacks = this._myDeleteIDCallbacks.get(valueID);
        if (valueIDCallbacks != null) {
            valueIDCallbacks.delete(callbackID);

            if (valueIDCallbacks.size <= 0) {
                this._myDeleteIDCallbacks.delete(valueID);
            }
        }
    }

    registerSaveEventListener(callbackID, callback) {
        this._mySaveCallbacks.set(callbackID, callback);
    }

    unregisterSaveEventListener(callbackID) {
        this._mySaveCallbacks.delete(callbackID);
    }

    registerSaveIDEventListener(valueID, callbackID, callback) {
        let valueIDCallbacks = this._mySaveIDCallbacks.get(valueID);
        if (valueIDCallbacks == null) {
            this._mySaveIDCallbacks.set(valueID, new Map());
            valueIDCallbacks = this._mySaveIDCallbacks.get(valueID);
        }

        valueIDCallbacks.set(callbackID, callback);
    }

    unregisterSaveIDEventListener(valueID, callbackID) {
        let valueIDCallbacks = this._mySaveIDCallbacks.get(valueID);
        if (valueIDCallbacks != null) {
            valueIDCallbacks.delete(callbackID);

            if (valueIDCallbacks.size <= 0) {
                this._mySaveIDCallbacks.delete(valueID);
            }
        }
    }

    registerSaveValueChangedEventListener(callbackID, callback) {
        this._mySaveValueChangedCallbacks.set(callbackID, callback);
    }

    unregisterSaveValueChangedEventListener(callbackID) {
        this._mySaveValueChangedCallbacks.delete(callbackID);
    }

    registerSaveValueChangedIDEventListener(valueID, callbackID, callback) {
        let valueIDCallbacks = this._mySaveValueChangedIDCallbacks.get(valueID);
        if (valueIDCallbacks == null) {
            this._mySaveValueChangedIDCallbacks.set(valueID, new Map());
            valueIDCallbacks = this._mySaveValueChangedIDCallbacks.get(valueID);
        }

        valueIDCallbacks.set(callbackID, callback);
    }

    unregisterSaveValueChangedIDEventListener(valueID, callbackID) {
        let valueIDCallbacks = this._mySaveValueChangedIDCallbacks.get(valueID);
        if (valueIDCallbacks != null) {
            valueIDCallbacks.delete(callbackID);

            if (valueIDCallbacks.size <= 0) {
                this._mySaveValueChangedIDCallbacks.delete(valueID);
            }
        }
    }

    registerCommitSavesEventListener(callbackID, callback) {
        this._myCommitSavesCallbacks.set(callbackID, callback);
    }

    unregisterCommitSavesEventListener(callbackID) {
        this._myCommitSavesCallbacks.delete(callbackID);
    }

    registerCommitSaveEventListener(callbackID, callback) {
        this._myCommitSaveCallbacks.set(callbackID, callback);
    }

    unregisterCommitSaveEventListener(callbackID) {
        this._myCommitSaveCallbacks.delete(callbackID);
    }

    registerCommitSaveIDEventListener(valueID, callbackID, callback) {
        let valueIDCallbacks = this._myCommitSaveIDCallbacks.get(valueID);
        if (valueIDCallbacks == null) {
            this._myCommitSaveIDCallbacks.set(valueID, new Map());
            valueIDCallbacks = this._myCommitSaveIDCallbacks.get(valueID);
        }

        valueIDCallbacks.set(callbackID, callback);
    }

    unregisterCommitSaveIDEventListener(valueID, callbackID) {
        let valueIDCallbacks = this._myCommitSaveIDCallbacks.get(valueID);
        if (valueIDCallbacks != null) {
            valueIDCallbacks.delete(callbackID);

            if (valueIDCallbacks.size <= 0) {
                this._myCommitSaveIDCallbacks.delete(valueID);
            }
        }
    }

    registerLoadEventListener(callbackID, callback) {
        this._myLoadCallbacks.set(callbackID, callback);
    }

    unregisterLoadEventListener(callbackID) {
        this._myLoadCallbacks.delete(callbackID);
    }

    registerLoadIDEventListener(valueID, callbackID, callback) {
        let valueIDCallbacks = this._myLoadIDCallbacks.get(valueID);
        if (valueIDCallbacks == null) {
            this._myLoadIDCallbacks.set(valueID, new Map());
            valueIDCallbacks = this._myLoadIDCallbacks.get(valueID);
        }

        valueIDCallbacks.set(callbackID, callback);
    }

    unregisterLoadIDEventListener(valueID, callbackID) {
        let valueIDCallbacks = this._myLoadIDCallbacks.get(valueID);
        if (valueIDCallbacks != null) {
            valueIDCallbacks.delete(callbackID);

            if (valueIDCallbacks.size <= 0) {
                this._myLoadIDCallbacks.delete(valueID);
            }
        }
    }

    _isCacheEnabled(overrideCacheEnabled = null) {
        return (this._myCacheEnabled && overrideCacheEnabled == null) || (overrideCacheEnabled != null && overrideCacheEnabled);
    }
};