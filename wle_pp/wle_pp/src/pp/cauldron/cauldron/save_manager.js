import { Emitter } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { SaveUtils } from "../utils/save_utils.js";
import { XRUtils } from "../utils/xr_utils.js";
import { Timer } from "./timer.js";

export class SaveManager {

    constructor(saveID, autoLoadSaves = true, engine = Globals.getMainEngine()) {
        this._myEngine = engine;

        this._mySaveID = saveID;

        this._myCommitSavesDelayTimer = new Timer(0, false);
        this._myDelaySavesCommit = true;
        this._myCommitSavesDirty = false;
        this._myCommitSavesDirtyClearOnFail = true;
        this._myCommitSavesOnInterrupt = true;
        this._myCommitSavesWhenLoadSavesFailed = false;
        this._myResetSaveObjectOnLoadSavesFail = false;

        this._mySaveObject = {};
        this._myLoadSavesSucceded = false;

        this._mySaveObjectLoadedOnce = false;
        this._myAtLeastOneValueSavedOnce = false;

        this._myClearEmitter = new Emitter();                   // Signature: listener()
        this._myDeleteEmitter = new Emitter();                  // Signature: listener(id)
        this._myDeleteIDEmitters = new Map();                   // Signature: listener(id)
        this._mySaveEmitter = new Emitter();                    // Signature: listener(id, value)
        this._mySaveValueChangedEmitter = new Emitter();        // Signature: listener(id, value)
        this._mySaveIDEmitters = new Map();                     // Signature: listener(id, value)
        this._mySaveValueChangedIDEmitters = new Map();         // Signature: listener(id, value)
        this._myCommitSavesEmitter = new Emitter();             // Signature: listener(succeeded)
        this._myLoadEmitter = new Emitter();                    // Signature: listener(id, value)
        this._myLoadIDEmitters = new Map();                     // Signature: listener(id, value)
        this._myLoadSavesEmitter = new Emitter();               // Signature: listener(loadSavesSucceded, saveObjectReset)

        if (autoLoadSaves) {
            this.loadSaves();
        }

        this._myXRVisibilityChangeEventListener = null;
        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, false, this._myEngine);

        this._myWindowVisibilityChangeEventListener = function () {
            if (document.visibilityState != "visible") {
                this._onInterrupt();
            }
        }.bind(this);
        window.addEventListener("visibilitychange", this._myWindowVisibilityChangeEventListener);

        this._myDestroyed = false;
    }

    setCommitSavesDelay(delay) {
        this._myCommitSavesDelayTimer.start(delay);
    }

    setDelaySavesCommit(delayed) {
        this._myDelaySavesCommit = delayed;
    }

    setCommitSavesDirty(dirty, startDelayTimer = true) {
        this._myCommitSavesDirty = dirty;
        if (dirty && startDelayTimer) {
            if (!this.startDelayTimer.isRunning()) {
                this._myCommitSavesDelayTimer.start();
            }
        } else {
            this._myCommitSavesDelayTimer.reset();
        }
    }

    setCommitSavesDirtyClearOnFail(clearOnFail) {
        this._myCommitSavesDirtyClearOnFail = clearOnFail;
    }

    setCommitSavesOnInterrupt(commitSavesOnInterrupt) {
        this._myCommitSavesOnInterrupt = commitSavesOnInterrupt;
    }

    setCommitSavesWhenLoadSavesFailed(commitSavesWhenLoadSavesFailed) {
        this._myCommitSavesWhenLoadSavesFailed = commitSavesWhenLoadSavesFailed;
    }

    setResetSaveObjectOnLoadSavesFail(resetSaveObjectOnLoadSavesFail) {
        this._myResetSaveObjectOnLoadSavesFail = resetSaveObjectOnLoadSavesFail;
    }

    getCommitSavesDelay() {
        return this._myCommitSavesDelayTimer.getDuration();
    }

    isDelaySavesCommit() {
        return this._myDelaySavesCommit;
    }

    isCommitSavesDirty() {
        return this._myCommitSavesDirty;
    }

    isCommitSavesDirtyClearOnFail() {
        return this._myCommitSavesDirtyClearOnFail;
    }

    isCommitSavesOnInterrupt() {
        return this._myCommitSavesOnInterrupt;
    }

    isCommitSavesWhenLoadSavesFailed() {
        return this._myCommitSavesWhenLoadSavesFailed;
    }

    isResetSaveObjectOnLoadSavesFail() {
        return this._myResetSaveObjectOnLoadSavesFail;
    }

    hasLoadSavesSucceded() {
        return this._myLoadSavesSucceded;
    }

    update(dt) {
        if (this._myCommitSavesDelayTimer.isRunning()) {
            this._myCommitSavesDelayTimer.update(dt);
            if (this._myCommitSavesDelayTimer.isDone()) {
                if (this._myCommitSavesDirty) {
                    this._commitSaves();
                }
            }
        } else {
            if (this._myCommitSavesDirty) {
                this._commitSaves();
            }
        }
    }

    has(id) {
        return id in this._mySaveObject;
    }

    save(id, value, delaySavesCommitOverride = null) {
        let sameValue = false;
        if (this.has(id)) {
            sameValue = this._mySaveObject[id] === value;
        }

        if (!sameValue) {
            this._mySaveObject[id] = value;

            if ((this._myDelaySavesCommit && delaySavesCommitOverride == null) || (delaySavesCommitOverride != null && delaySavesCommitOverride)) {
                this._myCommitSavesDirty = true;
                if (!this._myCommitSavesDelayTimer.isRunning()) {
                    this._myCommitSavesDelayTimer.start();
                }
            } else {
                this._commitSaves();
            }
        }

        this._myAtLeastOneValueSavedOnce = true;

        this._mySaveEmitter.notify(id, value);

        if (this._mySaveIDEmitters.size > 0) {
            let emitter = this._mySaveIDEmitters.get(id);
            if (emitter != null) {
                emitter.notify(id, value);
            }
        }

        if (!sameValue) {
            this._mySaveValueChangedEmitter.notify(id, value);

            if (this._mySaveValueChangedIDEmitters.size > 0) {
                let emitter = this._mySaveValueChangedIDEmitters.get(id);
                if (emitter != null) {
                    emitter.notify(id, value);
                }
            }
        }
    }

    delete(id, delaySavesCommitOverride = null) {
        if (this.has(id)) {
            delete this._mySaveObject[id];

            if ((this._myDelaySavesCommit && delaySavesCommitOverride == null) || (delaySavesCommitOverride != null && delaySavesCommitOverride)) {
                this._myCommitSavesDirty = true;
                if (!this._myCommitSavesDelayTimer.isRunning()) {
                    this._myCommitSavesDelayTimer.start();
                }
            } else {
                this._commitSaves();
            }
        }

        this._myAtLeastOneValueSavedOnce = true;

        this._myDeleteEmitter.notify(id);

        if (this._myDeleteIDEmitters.size > 0) {
            let emitter = this._myDeleteIDEmitters.get(id);
            if (emitter != null) {
                emitter.notify(id);
            }
        }
    }

    clear(delaySavesCommitOverride = null) {
        if (Object.keys(this._mySaveObject).length > 0) {
            this._mySaveObject = {};

            if ((this._myDelaySavesCommit && delaySavesCommitOverride == null) || (delaySavesCommitOverride != null && delaySavesCommitOverride)) {
                this._myCommitSavesDirty = true;
                if (!this._myCommitSavesDelayTimer.isRunning()) {
                    this._myCommitSavesDelayTimer.start();
                }
            } else {
                this._commitSaves();
            }
        }

        this._myAtLeastOneValueSavedOnce = true;

        this._myClearEmitter.notify();
    }

    load(id, defaultValue) {
        let value = this._mySaveObject[id];

        if (value == null && defaultValue != null) {
            value = defaultValue;
        }

        this._myLoadEmitter.notify(id, value);

        if (this._myLoadIDEmitters.size > 0) {
            let emitter = this._myLoadIDEmitters.get(id);
            if (emitter != null) {
                emitter.notify(id, value);
            }
        }

        return value;
    }

    commitSaves(commitSavesOnlyIfDirty = true) {
        if (this._myCommitSavesDirty || !commitSavesOnlyIfDirty) {
            this._commitSaves();
        }
    }

    _commitSaves() {
        let succeded = true;

        if (this._myLoadSavesSucceded || this._myCommitSavesWhenLoadSavesFailed) {
            try {
                let saveObjectStringified = JSON.stringify(this._mySaveObject);
                SaveUtils.save(this._mySaveID, saveObjectStringified);
            } catch (error) {
                succeded = false;
            }
        }

        if (succeded || this._myCommitSavesDirtyClearOnFail) {
            this._myCommitSavesDirty = false;
            this._myCommitSavesDelayTimer.reset();
        }

        this._myCommitSavesEmitter.notify(succeded);

        return succeded;
    }

    loadSaves() {
        let saveObject = {};
        let loadSavesSucceded = false;
        let saveObjectReset = false;

        let maxLoadObjectAttempts = 3;
        do {
            try {
                saveObject = SaveUtils.loadObject(this._mySaveID, {});
                loadSavesSucceded = true;
            } catch (error) {
                maxLoadObjectAttempts--;
            }
        } while (maxLoadObjectAttempts > 0 && !loadSavesSucceded);

        if (loadSavesSucceded) {
            this._mySaveObject = saveObject;
            this._myLoadSavesSucceded = true;
        } else if (this._myResetSaveObjectOnLoadSavesFail) {
            this._mySaveObject = {};
            this._myLoadSavesSucceded = false;

            saveObjectReset = true;
        }

        this._mySaveObjectLoadedOnce = true;

        this._myLoadSavesEmitter.notify(loadSavesSucceded, saveObjectReset);

        return loadSavesSucceded;
    }

    _onXRSessionStart(session) {
        this._myXRVisibilityChangeEventListener = function (event) {
            if (event.session.visibilityState != "visible") {
                this._onInterrupt();
            }
        }.bind(this);

        session.addEventListener("visibilitychange", this._myXRVisibilityChangeEventListener);
    }

    _onXRSessionEnd() {
        this._myXRVisibilityChangeEventListener = null;

        this._onInterrupt();
    }

    _onInterrupt() {
        if (this._myCommitSavesOnInterrupt && this._myCommitSavesDirty && (this._mySaveObjectLoadedOnce || this._myAtLeastOneValueSavedOnce)) {
            this.commitSaves();
        }
    }

    registerClearEventListener(listenerID, listener) {
        this._myClearEmitter.add(listener, { id: listenerID });
    }

    unregisterClearEventListener(listenerID) {
        this._myClearEmitter.remove(listenerID);
    }

    registerDeleteEventListener(listenerID, listener) {
        this._myDeleteEmitter.add(listener, { id: listenerID });
    }

    unregisterDeleteEventListener(listenerID) {
        this._myDeleteEmitter.remove(listenerID);
    }

    registerDeleteIDEventListener(valueID, listenerID, listener) {
        let valueIDEmitter = this._myDeleteIDEmitters.get(valueID);
        if (valueIDEmitter == null) {
            this._myDeleteIDEmitters.set(valueID, new Map());
            valueIDEmitter = this._myDeleteIDEmitters.get(valueID);
        }

        valueIDEmitter.add(listener, { id: listenerID });
    }

    unregisterDeleteIDEventListener(valueID, listenerID) {
        let valueIDEmitter = this._myDeleteIDEmitters.get(valueID);
        if (valueIDEmitter != null) {
            valueIDEmitter.remove(listenerID);

            if (valueIDEmitter.size <= 0) {
                this._myDeleteIDEmitters.delete(valueID);
            }
        }
    }

    registerSaveEventListener(listenerID, listener) {
        this._mySaveEmitter.add(listener, { id: listenerID });
    }

    unregisterSaveEventListener(listenerID) {
        this._mySaveEmitter.remove(listenerID);
    }

    registerSaveIDEventListener(valueID, listenerID, listener) {
        let valueIDEmitter = this._mySaveIDEmitters.get(valueID);
        if (valueIDEmitter == null) {
            this._mySaveIDEmitters.set(valueID, new Map());
            valueIDEmitter = this._mySaveIDEmitters.get(valueID);
        }

        valueIDEmitter.add(listener, { id: listenerID });
    }

    unregisterSaveIDEventListener(valueID, listenerID) {
        let valueIDEmitter = this._mySaveIDEmitters.get(valueID);
        if (valueIDEmitter != null) {
            valueIDEmitter.remove(listenerID);

            if (valueIDEmitter.size <= 0) {
                this._mySaveIDEmitters.delete(valueID);
            }
        }
    }

    registerSaveValueChangedEventListener(listenerID, listener) {
        this._mySaveValueChangedEmitter.add(listener, { id: listenerID });
    }

    unregisterSaveValueChangedEventListener(listenerID) {
        this._mySaveValueChangedEmitter.remove(listenerID);
    }

    registerSaveValueChangedIDEventListener(valueID, listenerID, listener) {
        let valueIDEmitter = this._mySaveValueChangedIDEmitters.get(valueID);
        if (valueIDEmitter == null) {
            this._mySaveValueChangedIDEmitters.set(valueID, new Map());
            valueIDEmitter = this._mySaveValueChangedIDEmitters.get(valueID);
        }

        valueIDEmitter.add(listener, { id: listenerID });
    }

    unregisterSaveValueChangedIDEventListener(valueID, listenerID) {
        let valueIDEmitter = this._mySaveValueChangedIDEmitters.get(valueID);
        if (valueIDEmitter != null) {
            valueIDEmitter.remove(listenerID);

            if (valueIDEmitter.size <= 0) {
                this._mySaveValueChangedIDEmitters.delete(valueID);
            }
        }
    }

    registerCommitSavesEventListener(listenerID, listener) {
        this._myCommitSavesEmitter.add(listener, { id: listenerID });
    }

    unregisterCommitSavesEventListener(listenerID) {
        this._myCommitSavesEmitter.remove(listenerID);
    }

    registerLoadEventListener(listenerID, listener) {
        this._myLoadEmitter.add(listener, { id: listenerID });
    }

    unregisterLoadEventListener(listenerID) {
        this._myLoadEmitter.remove(listenerID);
    }

    registerLoadIDEventListener(valueID, listenerID, listener) {
        let valueIDEmitter = this._myLoadIDEmitters.get(valueID);
        if (valueIDEmitter == null) {
            this._myLoadIDEmitters.set(valueID, new Map());
            valueIDEmitter = this._myLoadIDEmitters.get(valueID);
        }

        valueIDEmitter.add(listener, { id: listenerID });
    }

    unregisterLoadIDEventListener(valueID, listenerID) {
        let valueIDEmitter = this._myLoadIDEmitters.get(valueID);
        if (valueIDEmitter != null) {
            valueIDEmitter.remove(listenerID);

            if (valueIDEmitter.size <= 0) {
                this._myLoadIDEmitters.delete(valueID);
            }
        }
    }

    registerLoadSavesEventListener(listenerID, listener) {
        this._myLoadSavesEmitter.add(listener, { id: listenerID });
    }

    unregisterLoadSavesEventListener(listenerID) {
        this._myLoadSavesEmitter.remove(listenerID);
    }

    destroy() {
        this._myDestroyed = true;

        XRUtils.getSession(this._myEngine)?.removeEventListener("visibilitychange", this._myXRVisibilityChangeEventListener);
        XRUtils.unregisterSessionStartEndEventListeners(this, this._myEngine);

        window.removeEventListener("visibilitychange", this._myWindowVisibilityChangeEventListener);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}