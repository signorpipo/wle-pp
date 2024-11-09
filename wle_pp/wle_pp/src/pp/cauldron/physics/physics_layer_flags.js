import { PhysicsUtils } from "./physics_utils.js";

export class PhysicsLayerFlags {

    constructor() {
        this._myLayerMask = 0;
    }

    setFlagActive(indexOrName, active) {
        let index = indexOrName;
        if (isNaN(indexOrName)) {
            index = PhysicsUtils.getLayerFlagsNames().pp_findIndexEqual(indexOrName);
        }

        if (index >= 0 && index < PhysicsUtils.getLayerFlagsNames().length) {
            let mask = 1 << index;

            if (active) {
                this._myLayerMask = this._myLayerMask | mask;
            } else {
                this._myLayerMask = this._myLayerMask & ~mask;
            }
        }
    }

    isFlagActive(indexOrName) {
        let index = indexOrName;
        if (isNaN(indexOrName)) {
            index = PhysicsUtils.getLayerFlagsNames().pp_findIndexEqual(indexOrName);
        }

        let active = false;

        if (index >= 0 && index < PhysicsUtils.getLayerFlagsNames().length) {
            let mask = 1 << index;
            active = !!(this._myLayerMask & mask);
        }

        return active;
    }

    setAllFlagsActive(active) {
        if (!active) {
            this._myLayerMask = 0;
        } else {
            this._myLayerMask = Math.pow(2, PhysicsUtils.getLayerFlagsNames().length) - 1;
        }
    }

    add(layerFlags) {
        this._myLayerMask = this._myLayerMask | layerFlags.getMask();
    }

    remove(layerFlags) {
        this._myLayerMask = this._myLayerMask & ~(layerFlags.getMask());
    }

    intersect(layerFlags) {
        this._myLayerMask = this._myLayerMask & layerFlags.getMask();
    }

    copy(layerFlags) {
        this._myLayerMask = layerFlags._myLayerMask;
    }

    getMask() {
        return this._myLayerMask;
    }

    setMask(layerMask) {
        this._myLayerMask = layerMask;
    }

    equals(other) {
        return this._myLayerMask == other._myLayerMask;
    }
}