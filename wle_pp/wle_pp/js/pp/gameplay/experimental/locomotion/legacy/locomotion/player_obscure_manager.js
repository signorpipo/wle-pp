// Even if this can be sued to generally fade, it should be called collision obscure to hint that is meant for collision obscuring

import { Timer } from "../../../../../cauldron/cauldron/timer";
import { FSM } from "../../../../../cauldron/fsm/fsm";
import { EasingFunction } from "../../../../../cauldron/js/utils/math_utils";
import { MaterialUtils } from "../../../../../cauldron/utils/material_utils";
import { VisualMesh, VisualMeshParams } from "../../../../../cauldron/visual/elements/visual_mesh";
import { vec3_create, vec4_create } from "../../../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../../../pp/globals";

// Occlude
export class PlayerObscureManagerParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myPlayerTransformManager = null;

        this.myEnabled = true;

        this.myObscureObject = null;
        this.myObscureMaterial = null;
        this.myObscureRadius = 0;

        this.myObscureFadeOutSeconds = 0.1;
        this.myObscureFadeInSeconds = 0.1;

        this.myObscureFadeEasingFunction = EasingFunction.linear;

        this.myDistanceToStartObscureWhenHeadColliding = 0;
        this.myDistanceToStartObscureWhenBodyColliding = 0;
        this.myDistanceToStartObscureWhenFloating = 0;
        this.myDistanceToStartObscureWhenFar = 0;

        this.myRelativeDistanceToMaxObscureWhenHeadColliding = 0; // Relative to the start distance, 1 means that in 1 meters after it started it will be completely obscured
        this.myRelativeDistanceToMaxObscureWhenBodyColliding = 0;
        this.myRelativeDistanceToMaxObscureWhenFloating = 0;
        this.myRelativeDistanceToMaxObscureWhenFar = 0;

        this.myObscureLevelRelativeDistanceEasingFunction = EasingFunction.linear;

        this.myEngine = engine;
    }
}

export class PlayerObscureManager {

    constructor(params) {
        this._myParams = params;

        this._myObscureMaterial = null;
        this._myObscureParentObject = null;

        this._myCurrentObscureLevel = 0;
        this._myTargetObscureLevel = 0;
        this._myLastTargetObscureLevel = null;
        this._myLastIsFadingIn = null;

        this._myFadeTimer = new Timer(0, false);

        this._myFSM = new FSM();
        //this._myFSM.setLogEnabled(true, " Obscure");

        this._myFSM.addState("init");

        this._myFSM.addState("inactive");
        this._myFSM.addState("idle", this._idleUpdate.bind(this));
        this._myFSM.addState("fading", this._fadingUpdate.bind(this));

        this._myFSM.addTransition("init", "inactive", "end", this._setObscureLevel.bind(this, 0));

        this._myFSM.addTransition("inactive", "idle", "start");

        this._myFSM.addTransition("idle", "fading", "fade", this._startFading.bind(this));
        this._myFSM.addTransition("fading", "idle", "done", this._fadingDone.bind(this));

        this._myFSM.addTransition("inactive", "inactive", "stop", this._setObscureLevel.bind(this, 0));
        this._myFSM.addTransition("idle", "inactive", "stop", this._setObscureLevel.bind(this, 0));
        this._myFSM.addTransition("fading", "inactive", "stop", this._setObscureLevel.bind(this, 0));

        this._myFSM.init("init");

        this._setupVisuals();

        this._myFSM.perform("end");

        this._myDestroyed = false;
    }

    start() {
        this._myFSM.perform("start");
    }

    stop() {
        this._myFSM.perform("stop");
    }

    getParams() {
        return this._myParams;
    }

    update(dt) {
        this._myObscureParentObject.pp_resetTransformLocal();

        this._updateObscured();

        this._myFSM.update(dt);

        this._setObscureVisible(this.isObscured());
    }

    isStarted() {
        return !this._myFSM.isInState("inactive");
    }

    isObscured() {
        return this._myCurrentObscureLevel > 0;
    }

    isFading() {
        return this._myFSM.isInState("fading");
    }

    isFadingIn() {
        return this.isFading() && this._myCurrentObscureLevel > this._myTargetObscureLevel;
    }

    isFadingOut() {
        return this.isFading() && this._myCurrentObscureLevel <= this._myTargetObscureLevel;
    }

    getObscureLevel() {
        return this._myCurrentObscureLevel;
    }

    getTargetObscureLevel() {
        return this._myTargetObscureLevel;
    }

    getCurrentObscureLevel() {
        this._myCurrentObscureLevel;
    }

    overrideObscureLevel(obscureLevel, instantFade = false) {
        this._myObscureLevelOverride = obscureLevel;

        if (instantFade && this.isStarted()) {
            this._setObscureLevel(obscureLevel);
        }
    }

    resetObscureLevelOverride() {
        this._myObscureLevelOverride = null;
    }

    _idleUpdate(dt) {
        if (Math.abs(this._myTargetObscureLevel - this._myCurrentObscureLevel) > Math.PP_EPSILON) {
            this._myFSM.perform("fade");
        }
    }

    _fadingUpdate(dt) {
        if (Math.abs(this._myTargetObscureLevel - this._myCurrentObscureLevel) <= Math.PP_EPSILON) {
            this._myFSM.perform("done");
            return;
        }

        if (this._myLastTargetObscureLevel != this._myTargetObscureLevel) {
            this._refreshFadeTimer();
            this._myLastTargetObscureLevel = this._myTargetObscureLevel;
        }

        this._myFadeTimer.update(dt);

        let newObscureLevel = this._myParams.myObscureFadeEasingFunction(this._myFadeTimer.getPercentage());

        let isFadingIn = this._myCurrentObscureLevel > this._myTargetObscureLevel;
        if (!isFadingIn) {
            newObscureLevel = Math.min(newObscureLevel, this._myTargetObscureLevel);
        } else {
            newObscureLevel = Math.pp_clamp(1 - newObscureLevel, 0, 1);
            newObscureLevel = Math.max(newObscureLevel, this._myTargetObscureLevel);
        }

        this._setObscureAlpha(newObscureLevel);
        this._myCurrentObscureLevel = newObscureLevel;

        if (Math.abs(this._myTargetObscureLevel - this._myCurrentObscureLevel) <= Math.PP_EPSILON || this._myFadeTimer.isDone()) {
            this._myFSM.perform("done");
        }
    }

    _startFading() {
        this._myLastTargetObscureLevel = null;
        this._myLastIsFadingIn = null;
    }

    _fadingDone() {
        this._setObscureLevel(this._myTargetObscureLevel);
    }

    _refreshFadeTimer() {
        let isFadingIn = this._myCurrentObscureLevel > this._myTargetObscureLevel;

        if (this._myLastIsFadingIn != isFadingIn) {
            this._setFadeTimerToObscureLevel(isFadingIn);
        }

        this._myLastIsFadingIn = isFadingIn;
    }

    _setFadeTimerToObscureLevel(isFadingIn) {
        let percentage = 0;
        let closestPercentage = 0;
        let steps = 1000;
        let increment = 1 / steps;

        while (percentage < 1) {
            if (Math.abs(this._myParams.myObscureFadeEasingFunction(percentage) - this._myCurrentObscureLevel) <
                Math.abs(this._myParams.myObscureFadeEasingFunction(closestPercentage) - this._myCurrentObscureLevel)) {
                closestPercentage = percentage;
            }

            percentage += increment;
        }

        if (Math.abs(this._myParams.myObscureFadeEasingFunction(1) - this._myCurrentObscureLevel) <
            Math.abs(this._myParams.myObscureFadeEasingFunction(closestPercentage) - this._myCurrentObscureLevel)) {
            closestPercentage = 1;
        }

        if (isFadingIn) {
            this._myFadeTimer.start(this._myParams.myObscureFadeInSeconds);
            this._myFadeTimer.setPercentage(Math.pp_clamp(1 - closestPercentage, 0, 1));
        } else {
            this._myFadeTimer.start(this._myParams.myObscureFadeOutSeconds);
            this._myFadeTimer.setPercentage(Math.pp_clamp(closestPercentage, 0, 1));
        }
    }

    _setObscureLevel(obscureLevel) {
        this._myTargetObscureLevel = obscureLevel;
        this._myCurrentObscureLevel = obscureLevel;
        this._setObscureAlpha(obscureLevel);
        this._setObscureVisible(this.isObscured());
    }

    _setObscureAlpha(alpha) {
        if (this._myParams.myObscureObject == null) {
            MaterialUtils.setAlpha(this._myObscureMaterial, alpha);
        } else {
            MaterialUtils.setObjectAlpha(this._myParams.myObscureObject, alpha);
        }
    }

    _updateObscured() {
        this._myTargetObscureLevel = 0;

        if (this._myParams.myEnabled) {
            if (this._myObscureLevelOverride != null) {
                this._myTargetObscureLevel = this._myObscureLevelOverride;
            } else {
                // #TODO Check if VALID head is colliding, in that case use max obscure level
                // This prevent being able to see when resetting head to real even though real is colliding
                // For example if u stand up and go with the head in the ceiling and reset by moving
                // Add a setting for this though, since someone could prefer being able to see in this case,
                // so to be able to know where to move (since it might be resetting to this invalid position)
                if (this._myParams.myPlayerTransformManager.isHeadColliding()) {
                    let distance = this._myParams.myPlayerTransformManager.getDistanceToRealHead();
                    let relativeDistance = distance - this._myParams.myDistanceToStartObscureWhenHeadColliding;
                    if (relativeDistance >= 0) {
                        let relativeDistancePercentage = Math.pp_clamp(relativeDistance / this._myParams.myRelativeDistanceToMaxObscureWhenHeadColliding, 0, 1);
                        let targetObscureLevel = this._myParams.myObscureLevelRelativeDistanceEasingFunction(relativeDistancePercentage);
                        this._myTargetObscureLevel = Math.max(this._myTargetObscureLevel, targetObscureLevel);
                    }
                }

                if (this._myParams.myPlayerTransformManager.isBodyColliding()) {
                    let distance = this._myParams.myPlayerTransformManager.getDistanceToReal();
                    let relativeDistance = distance - this._myParams.myDistanceToStartObscureWhenBodyColliding;
                    if (relativeDistance >= 0) {
                        let relativeDistancePercentage = Math.pp_clamp(relativeDistance / this._myParams.myRelativeDistanceToMaxObscureWhenBodyColliding, 0, 1);
                        let targetObscureLevel = this._myParams.myObscureLevelRelativeDistanceEasingFunction(relativeDistancePercentage);
                        this._myTargetObscureLevel = Math.max(this._myTargetObscureLevel, targetObscureLevel);
                    }
                }

                if (this._myParams.myPlayerTransformManager.isFloating()) {
                    let distance = this._myParams.myPlayerTransformManager.getDistanceToReal();
                    let relativeDistance = distance - this._myParams.myDistanceToStartObscureWhenFloating;
                    if (relativeDistance >= 0) {
                        let relativeDistancePercentage = Math.pp_clamp(relativeDistance / this._myParams.myRelativeDistanceToMaxObscureWhenFloating, 0, 1);
                        let targetObscureLevel = this._myParams.myObscureLevelRelativeDistanceEasingFunction(relativeDistancePercentage);
                        this._myTargetObscureLevel = Math.max(this._myTargetObscureLevel, targetObscureLevel);
                    }
                }

                if (this._myParams.myPlayerTransformManager.isFar()) {
                    let distance = this._myParams.myPlayerTransformManager.getDistanceToReal();
                    let relativeDistance = distance - this._myParams.myDistanceToStartObscureWhenFar;
                    if (relativeDistance >= 0) {
                        let relativeDistancePercentage = Math.pp_clamp(relativeDistance / this._myParams.myRelativeDistanceToMaxObscureWhenFar, 0, 1);
                        let targetObscureLevel = this._myParams.myObscureLevelRelativeDistanceEasingFunction(relativeDistancePercentage);
                        this._myTargetObscureLevel = Math.max(this._myTargetObscureLevel, targetObscureLevel);
                    }
                }
            }
        }
    }

    _setupVisuals() {
        this._myObscureMaterial = null;
        if (this._myParams.myObscureMaterial != null) {
            this._myObscureMaterial = this._myParams.myObscureMaterial;
        } else {
            this._myObscureMaterial = Globals.getDefaultMaterials(this._myParams.myEngine).myFlatTransparentNoDepth.clone();
            this._myObscureMaterial.color = vec4_create(0, 0, 0, 1);
        }

        this._myObscureParentObject = Globals.getPlayerObjects(this._myParams.myEngine).myCauldron.pp_addObject();

        let obscureVisualParams = new VisualMeshParams(this._myParams.myEngine);
        obscureVisualParams.myMesh = Globals.getDefaultMeshes(this._myParams.myEngine).myInvertedSphere;
        obscureVisualParams.myMaterial = (this._myParams.myObscureMaterial != null) ? this._myParams.myObscureMaterial : this._myObscureMaterial;
        obscureVisualParams.myParent = this._myObscureParentObject;
        obscureVisualParams.myLocal = true;
        obscureVisualParams.myTransform.mat4_setScale(vec3_create(this._myParams.myObscureRadius, this._myParams.myObscureRadius, this._myParams.myObscureRadius));
        this._myObscureVisual = new VisualMesh(obscureVisualParams);

        if (this._myParams.myObscureObject != null) {
            this._myParams.myObscureObject.pp_setParent(this._myObscureParentObject, false);
            this._myParams.myObscureObject.pp_resetTransformLocal();
        }

        this._setObscureVisible(false);
    }

    _setObscureVisible(visible) {
        if (this._myParams.myObscureObject == null) {
            this._myObscureVisual.setVisible(visible);
        } else {
            this._myObscureVisual.setVisible(false);
            this._myParams.myObscureObject.pp_setActive(visible);
        }

        if (visible) {
            this._myObscureParentObject.pp_setParent(this._myParams.myPlayerTransformManager.getHead(), false);
        } else {
            this._myObscureParentObject.pp_setParent(Globals.getPlayerObjects(this._myParams.myEngine)?.myCauldron, false);
        }
    }

    destroy() {
        this._myDestroyed = true;

        this._myObscureVisual.destroy();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}