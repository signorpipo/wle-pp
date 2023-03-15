WL.registerComponent('pp-grabber-hand', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myGrabButton: { type: WL.Type.Enum, values: ['select', 'squeeze', 'both', 'both_exclusive'], default: 'squeeze' }, // both_exclusive means u can use both buttons but you have to use the same button you grabbed with to throw
    _mySnapOnPivot: { type: WL.Type.Bool, default: false },
    _myMaxNumberOfObjects: { type: WL.Type.Int, default: 1 }, // how many objects you can grab at the same time
    // ADVANCED SETTINGS
    _myThrowVelocitySource: { type: WL.Type.Enum, values: ['hand', 'grabbable'], default: 'hand' },
    _myThrowLinearVelocityMultiplier: { type: WL.Type.Float, default: 1 }, // multiply the overall throw speed, so slow throws will be multiplied too
    _myThrowMaxLinearSpeed: { type: WL.Type.Float, default: 15 },
    _myThrowAngularVelocityMultiplier: { type: WL.Type.Float, default: 0.5 },
    _myThrowMaxAngularSpeed: { type: WL.Type.Float, default: 1080 }, // degrees
    _myThrowLinearVelocityBoost: { type: WL.Type.Float, default: 1.75 },   // this boost is applied from 0% to 100% based on how fast you throw, so slow throws are not affected
    _myThrowLinearVelocityBoostMinSpeedThreshold: { type: WL.Type.Float, default: 0.6 },   // 0% boost is applied if plain throw speed is under this value
    _myThrowLinearVelocityBoostMaxSpeedThreshold: { type: WL.Type.Float, default: 2.5 },   // 100% boost is applied if plain throw speed is over this value
}, {
    init: function () {
        this._myGrabbables = [];

        this._myGamepad = null;

        this._myActiveGrabButton = null;

        this._myLinearVelocityHistorySize = 5;
        this._myLinearVelocityHistorySpeedAverageSamplesFromStart = 1;
        this._myLinearVelocityHistoryDirectionAverageSamplesFromStart = 3;
        this._myLinearVelocityHistoryDirectionAverageSkipFromStart = 0;

        this._myHandLinearVelocityHistory = new Array(this._myLinearVelocityHistorySize);
        this._myHandLinearVelocityHistory.fill(PP.vec3_create());

        this._myAngularVelocityHistorySize = 1;
        this._myHandAngularVelocityHistory = new Array(this._myAngularVelocityHistorySize);
        this._myHandAngularVelocityHistory.fill(PP.vec3_create());

        this._myThrowMaxAngularSpeedRadians = Math.pp_toRadians(this._myThrowMaxAngularSpeed);

        this._myGrabCallbacks = new Map();      // Signature: callback(grabber, grabbable)
        this._myThrowCallbacks = new Map();     // Signature: callback(grabber, grabbable)

        this._myDebugActive = false;
    },
    start: function () {
        if (this._myHandedness == PP.HandednessIndex.LEFT) {
            this._myGamepad = PP.myLeftGamepad;
        } else {
            this._myGamepad = PP.myRightGamepad;
        }

        this._myPhysX = this.object.pp_getComponent('physx');
        this._myCollisionsCollector = new PP.PhysicsCollisionCollector(this._myPhysX, true);
    },
    update: function (dt) {
        this._myCollisionsCollector.update(dt);

        if (this._myGrabbables.length > 0) {
            this._updateLinearVelocityHistory();
            this._updateAngularVelocityHistory();
        }
    },
    grab: function (grabButton = null) {
        this._grab(grabButton);
    },
    throw: function (throwButton = null) {
        this._throw(throwButton);
    },
    getGamepad() {
        return this._myGamepad;
    },
    getHandedness() {
        return PP.InputUtils.getHandednessByIndex(this._myHandedness);
    },
    registerGrabEventListener(id, callback) {
        this._myGrabCallbacks.set(id, callback);
    },
    unregisterGrabEventListener(id) {
        this._myGrabCallbacks.delete(id);
    },
    registerThrowEventListener(id, callback) {
        this._myThrowCallbacks.set(id, callback);
    },
    unregisterThrowEventListener(id) {
        this._myThrowCallbacks.delete(id);
    },
    onActivate() {
        if (this._myGamepad == null) {
            return;
        }

        if (this._myGrabButton == 0) {
            this._myGamepad.registerButtonEventListener(PP.GamepadButtonID.SELECT, PP.GamepadButtonEvent.PRESS_START, this, this._grab.bind(this, PP.GamepadButtonID.SELECT));
            this._myGamepad.registerButtonEventListener(PP.GamepadButtonID.SELECT, PP.GamepadButtonEvent.PRESS_END, this, this._throw.bind(this, PP.GamepadButtonID.SELECT));
        } else if (this._myGrabButton == 1) {
            this._myGamepad.registerButtonEventListener(PP.GamepadButtonID.SQUEEZE, PP.GamepadButtonEvent.PRESS_START, this, this._grab.bind(this, PP.GamepadButtonID.SQUEEZE));
            this._myGamepad.registerButtonEventListener(PP.GamepadButtonID.SQUEEZE, PP.GamepadButtonEvent.PRESS_END, this, this._throw.bind(this, PP.GamepadButtonID.SQUEEZE));
        } else {
            this._myGamepad.registerButtonEventListener(PP.GamepadButtonID.SQUEEZE, PP.GamepadButtonEvent.PRESS_START, this, this._grab.bind(this, PP.GamepadButtonID.SQUEEZE));
            this._myGamepad.registerButtonEventListener(PP.GamepadButtonID.SQUEEZE, PP.GamepadButtonEvent.PRESS_END, this, this._throw.bind(this, PP.GamepadButtonID.SQUEEZE));

            this._myGamepad.registerButtonEventListener(PP.GamepadButtonID.SELECT, PP.GamepadButtonEvent.PRESS_START, this, this._grab.bind(this, PP.GamepadButtonID.SELECT));
            this._myGamepad.registerButtonEventListener(PP.GamepadButtonID.SELECT, PP.GamepadButtonEvent.PRESS_END, this, this._throw.bind(this, PP.GamepadButtonID.SELECT));
        }
    },
    onDeactivate() {
        if (this._myGamepad == null) {
            return;
        }

        if (this._myGrabButton == 0) {
            this._myGamepad.unregisterButtonEventListener(PP.GamepadButtonID.SELECT, PP.GamepadButtonEvent.PRESS_START, this);
            this._myGamepad.unregisterButtonEventListener(PP.GamepadButtonID.SELECT, PP.GamepadButtonEvent.PRESS_END, this);
        } else if (this._myGrabButton == 1) {
            this._myGamepad.unregisterButtonEventListener(PP.GamepadButtonID.SQUEEZE, PP.GamepadButtonEvent.PRESS_START, this);
            this._myGamepad.unregisterButtonEventListener(PP.GamepadButtonID.SQUEEZE, PP.GamepadButtonEvent.PRESS_END, this);
        } else {
            this._myGamepad.unregisterButtonEventListener(PP.GamepadButtonID.SQUEEZE, PP.GamepadButtonEvent.PRESS_START, this);
            this._myGamepad.unregisterButtonEventListener(PP.GamepadButtonID.SQUEEZE, PP.GamepadButtonEvent.PRESS_END, this);

            this._myGamepad.unregisterButtonEventListener(PP.GamepadButtonID.SELECT, PP.GamepadButtonEvent.PRESS_START, this);
            this._myGamepad.unregisterButtonEventListener(PP.GamepadButtonID.SELECT, PP.GamepadButtonEvent.PRESS_END, this);
        }
    },
    _grab: function (grabButton) {
        if (this._myGrabbables.length >= this._myMaxNumberOfObjects) {
            return;
        }

        if (this._myGrabButton == 2 || this._myActiveGrabButton == null || this._myActiveGrabButton == grabButton || grabButton == null) {
            let grabbablesToGrab = [];

            let collisions = this._myCollisionsCollector.getCollisions();
            for (let i = 0; i < collisions.length; i++) {
                let grabbable = collisions[i].getComponent("pp-grabbable");
                if (grabbable && grabbable.active) {
                    grabbablesToGrab.push(grabbable);
                }
            }

            let grabberPosition = this.object.pp_getPosition();
            grabbablesToGrab.sort(function (first, second) {
                let firstPosition = first.object.pp_getPosition();
                let secondPosition = second.object.pp_getPosition();

                let firstDistance = firstPosition.vec3_distance(grabberPosition);
                let secondDistance = secondPosition.vec3_distance(grabberPosition);

                return Math.pp_sign(firstDistance - secondDistance, 0);
            });

            for (let grabbableToGrab of grabbablesToGrab) {
                if (!this._isAlreadyGrabbed(grabbableToGrab)) {
                    let grabbableData = new PP.GrabberHandGrabbableData(grabbableToGrab, this._myThrowVelocitySource == 1, this._myLinearVelocityHistorySize, this._myAngularVelocityHistorySize);
                    this._myGrabbables.push(grabbableData);
                    grabbableToGrab.grab(this.object);
                    grabbableToGrab.registerReleaseEventListener(this, this._onRelease.bind(this));

                    if (this._mySnapOnPivot) {
                        grabbableToGrab.object.resetTranslation();
                    }

                    this._myGrabCallbacks.forEach(function (callback) { callback(this, grabbableToGrab); }.bind(this));
                }

                if (this._myGrabbables.length >= this._myMaxNumberOfObjects) {
                    break;
                }
            }

            if (this._myGrabbables.length > 0) {
                if (this._myActiveGrabButton == null) {
                    this._myActiveGrabButton = grabButton;
                }
            }
        }
    },
    _throw: function (throwButton) {
        if (this._myGrabButton == 2 || this._myActiveGrabButton == null || this._myActiveGrabButton == throwButton || throwButton == null) {
            if (this._myGrabbables.length > 0) {
                let linearVelocity = null;
                let angularVelocity = null;

                if (this._myThrowVelocitySource == 0) {
                    linearVelocity = this._computeReleaseLinearVelocity(this._myHandLinearVelocityHistory);
                    angularVelocity = this._computeReleaseAngularVelocity(this._myHandAngularVelocityHistory);
                }

                for (let grabbableData of this._myGrabbables) {
                    let grabbable = grabbableData.getGrabbable();

                    grabbable.unregisterReleaseEventListener(this);

                    if (this._myThrowVelocitySource == 1) {
                        linearVelocity = this._computeReleaseLinearVelocity(grabbableData.getLinearVelocityHistory());
                        angularVelocity = this._computeReleaseAngularVelocity(grabbableData.getAngularVelocityHistory());
                    }

                    grabbable.throw(linearVelocity, angularVelocity);

                    this._myThrowCallbacks.forEach(function (callback) { callback(this, grabbable); }.bind(this));
                }

                this._myGrabbables = [];
            }

            this._myActiveGrabButton = null;
        }
    },
    _onRelease(grabber, grabbable) {
        grabbable.unregisterReleaseEventListener(this);
        this._myGrabbables.pp_remove(element => element.getGrabbable() == grabbable);

        if (this._myGrabbables.length <= 0) {
            this._myActiveGrabButton = null;
        }
    },
    _updateLinearVelocityHistory() {
        let handPose = this._myGamepad.getHandPose();
        this._myHandLinearVelocityHistory.unshift(handPose.getLinearVelocity().pp_clone());
        this._myHandLinearVelocityHistory.pop();

        for (let grabbable of this._myGrabbables) {
            grabbable.updateLinearVelocityHistory();
        }
    },
    _updateAngularVelocityHistory() {
        let handPose = this._myGamepad.getHandPose();
        this._myHandAngularVelocityHistory.unshift(handPose.getAngularVelocityRadians().pp_clone());
        this._myHandAngularVelocityHistory.pop();

        for (let grabbable of this._myGrabbables) {
            grabbable.updateAngularVelocityHistory();
        }
    },
    _computeReleaseLinearVelocity(linearVelocityHistory) {
        //speed
        let speed = linearVelocityHistory[0].vec3_length();
        for (let i = 1; i < this._myLinearVelocityHistorySpeedAverageSamplesFromStart; i++) {
            speed += linearVelocityHistory[i].vec3_length();
        }
        speed /= this._myLinearVelocityHistorySpeedAverageSamplesFromStart;

        // This way I give an increasing and smooth boost to the throw so that when u want to perform a weak throw, the value is not changed, but if u put more speed
        // it will be boosted to make it easier and still feel good and natural (value does not increase suddenly)
        let speedEaseMultiplier = Math.pp_mapToRange(speed, this._myThrowLinearVelocityBoostMinSpeedThreshold, this._myThrowLinearVelocityBoostMaxSpeedThreshold, 0, 1);
        speedEaseMultiplier = PP.EasingFunction.easeIn(speedEaseMultiplier);

        // Add the boost to the speed
        let extraSpeed = speed * (speedEaseMultiplier * this._myThrowLinearVelocityBoost);
        speed += extraSpeed;
        speed *= this._myThrowLinearVelocityMultiplier;
        speed = Math.pp_clamp(speed, 0, this._myThrowMaxLinearSpeed);

        if (this._myDebugActive) {
            this._debugDirectionLines(linearVelocityHistory);
        }

        //direction
        let directionCurrentWeight = this._myLinearVelocityHistoryDirectionAverageSamplesFromStart;
        let lastDirectionIndex = this._myLinearVelocityHistoryDirectionAverageSkipFromStart + this._myLinearVelocityHistoryDirectionAverageSamplesFromStart;
        let direction = PP.vec3_create();
        for (let i = this._myLinearVelocityHistoryDirectionAverageSkipFromStart; i < lastDirectionIndex; i++) {
            let currentDirection = linearVelocityHistory[i];
            currentDirection.vec3_scale(directionCurrentWeight, currentDirection);
            direction.vec3_add(currentDirection, direction);

            directionCurrentWeight--;
        }
        direction.vec3_normalize(direction);

        direction.vec3_scale(speed, direction);

        return direction;
    },
    _computeReleaseAngularVelocity(angularVelocityHistory) {
        let angularVelocity = angularVelocityHistory[0];

        //speed
        let speed = angularVelocity.vec3_length();

        speed = Math.pp_clamp(speed * this._myThrowAngularVelocityMultiplier, 0, this._myThrowMaxAngularSpeedRadians);

        //direction
        let direction = angularVelocity;
        direction.vec3_normalize(direction);

        direction.vec3_scale(speed, direction);

        return direction;
    },
    _debugDirectionLines(linearVelocityHistory) {
        for (let j = this._myLinearVelocityHistoryDirectionAverageSkipFromStart + this._myLinearVelocityHistoryDirectionAverageSamplesFromStart; j > this._myLinearVelocityHistoryDirectionAverageSkipFromStart; j--) {

            let directionCurrentWeight = j - this._myLinearVelocityHistoryDirectionAverageSkipFromStart;
            let lastDirectionIndex = j - this._myLinearVelocityHistoryDirectionAverageSkipFromStart;
            let direction = PP.vec3_create();
            for (let i = this._myLinearVelocityHistoryDirectionAverageSkipFromStart; i < lastDirectionIndex; i++) {
                let currentDirection = linearVelocityHistory[i].pp_clone();
                currentDirection.vec3_scale(directionCurrentWeight, currentDirection);
                direction.vec3_add(currentDirection, direction);

                directionCurrentWeight--;
            }
            direction.vec3_normalize(direction);

            let color = 1 / j;

            PP.myDebugVisualManager.drawLine(5, this.object.pp_getPosition(), direction, 0.2, PP.vec4_create(olor, color, color, 1));
        }
    },
    _isAlreadyGrabbed(grabbable) {
        let found = this._myGrabbables.pp_find(element => element.getGrabbable() == grabbable);
        return found != null;
    }
});

PP.GrabberHandGrabbableData = class GrabberHandGrabbableData {
    constructor(grabbable, useGrabbableAsVelocitySource, linearVelocityHistorySize, angularVelocityHistorySize) {
        this._myGrabbable = grabbable;
        this._myUseGrabbableAsVelocitySource = useGrabbableAsVelocitySource;

        if (this._myUseGrabbableAsVelocitySource) {
            this._myLinearVelocityHistory = new Array(linearVelocityHistorySize);
            this._myLinearVelocityHistory.fill(PP.vec3_create());

            this._myAngularVelocityHistory = new Array(angularVelocityHistorySize);
            this._myAngularVelocityHistory.fill(PP.vec3_create());
        }
    }

    getGrabbable() {
        return this._myGrabbable;
    }

    getLinearVelocityHistory() {
        return this._myLinearVelocityHistory;
    }

    getAngularVelocityHistory() {
        return this._myAngularVelocityHistory;
    }

    updateLinearVelocityHistory() {
        if (this._myUseGrabbableAsVelocitySource) {
            this._myLinearVelocityHistory.unshift(this._myGrabbable.getLinearVelocity());
            this._myLinearVelocityHistory.pop();
        }
    }

    updateAngularVelocityHistory() {
        if (this._myUseGrabbableAsVelocitySource) {
            this._myAngularVelocityHistory.unshift(this._myGrabbable.getAngularVelocityRadians());
            this._myAngularVelocityHistory.pop();
        }
    }
};