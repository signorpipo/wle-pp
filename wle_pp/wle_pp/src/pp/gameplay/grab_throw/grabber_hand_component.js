import { Component, Emitter, PhysXComponent, Property } from "@wonderlandengine/api";
import { PhysicsCollisionCollector } from "../../cauldron/physics/physics_collision_collector.js";
import { EasingFunction } from "../../cauldron/utils/math_utils.js";
import { HandednessIndex } from "../../input/cauldron/input_types.js";
import { InputUtils } from "../../input/cauldron/input_utils.js";
import { GamepadButtonEvent, GamepadButtonID } from "../../input/gamepad/gamepad_buttons.js";
import { vec3_create, vec4_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../pp/globals.js";
import { GrabbableComponent } from "./grabbable_component.js";

export class GrabberHandComponent extends Component {
    static TypeName = "pp-grabber-hand";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myGrabButton: Property.enum(["Select", "Squeeze", "Both", "Both Exclusive"], "Squeeze"), // @"Both Exclusive" means u can use both buttons but you have to use the same button you grabbed with to throw
        _mySnapGrabbableOnOrigin: Property.bool(false),
        _myMaxNumberOfObjects: Property.int(1), // How many objects you can grab at the same time

        // ADVANCED SETTINGS
        _myThrowVelocitySource: Property.enum(["Hand", "Grabbable"], "Hand"),
        _myThrowLinearVelocityMultiplier: Property.float(1), // Multiply the overall throw speed, so slow throws will be multiplied too
        _myThrowMaxLinearSpeed: Property.float(15),
        _myThrowAngularVelocityMultiplier: Property.float(0.5),
        _myThrowMaxAngularSpeed: Property.float(1080), // @Degrees
        _myThrowLinearVelocityBoost: Property.float(1.75),   // This boost is applied from 0% to 100% based on how fast you throw, so slow throws are not affected
        _myThrowLinearVelocityBoostMinSpeedThreshold: Property.float(0.6),   // 0% boost is applied if plain throw speed is under this value
        _myThrowLinearVelocityBoostMaxSpeedThreshold: Property.float(2.5),   // 100% boost is applied if plain throw speed is over this value
    };

    init() {
        this._myGrabbables = [];

        this._myGamepad = null;

        this._myActiveGrabButton = null;

        this._myLinearVelocityHistorySize = 5;
        this._myLinearVelocityHistorySpeedAverageSamplesFromStart = 1;
        this._myLinearVelocityHistoryDirectionAverageSamplesFromStart = 3;
        this._myLinearVelocityHistoryDirectionAverageSkipFromStart = 0;

        this._myHandLinearVelocityHistory = new Array(this._myLinearVelocityHistorySize);
        this._myHandLinearVelocityHistory.fill(vec3_create());

        this._myAngularVelocityHistorySize = 1;
        this._myHandAngularVelocityHistory = new Array(this._myAngularVelocityHistorySize);
        this._myHandAngularVelocityHistory.fill(vec3_create());

        this._myThrowMaxAngularSpeedRadians = Math.pp_toRadians(this._myThrowMaxAngularSpeed);

        this._myGrabEmitter = new Emitter();      // Signature: listener(grabber, grabbable)
        this._myThrowEmitter = new Emitter();     // Signature: listener(grabber, grabbable)

        this._myDebugEnabled = false;
    }

    start() {
        if (this._myHandedness == HandednessIndex.LEFT) {
            this._myGamepad = Globals.getLeftGamepad(this.engine);
        } else {
            this._myGamepad = Globals.getRightGamepad(this.engine);
        }

        this._myPhysX = this.object.pp_getComponent(PhysXComponent);
        this._myCollisionsCollector = new PhysicsCollisionCollector(this._myPhysX, true);
    }

    update(dt) {
        this._myCollisionsCollector.update(dt);

        if (this._myGrabbables.length > 0) {
            this._updateLinearVelocityHistory();
            this._updateAngularVelocityHistory();
        }
    }

    grab(grabButton = null) {
        this._grab(grabButton);
    }

    throw(throwButton = null) {
        this._throw(throwButton);
    }

    getGamepad() {
        return this._myGamepad;
    }

    getHandedness() {
        return InputUtils.getHandednessByIndex(this._myHandedness);
    }

    registerGrabEventListener(id, listener) {
        this._myGrabEmitter.add(listener, { id: id });
    }

    unregisterGrabEventListener(id) {
        this._myGrabEmitter.remove(id);
    }

    registerThrowEventListener(id, listener) {
        this._myThrowEmitter.add(listener, { id: id });
    }

    unregisterThrowEventListener(id) {
        this._myThrowEmitter.remove(id);
    }

    onActivate() {
        if (this._myGamepad != null) {
            if (this._myGrabButton == 0) {
                this._myGamepad.registerButtonEventListener(GamepadButtonID.SELECT, GamepadButtonEvent.PRESS_START, this, this._grab.bind(this, GamepadButtonID.SELECT));
                this._myGamepad.registerButtonEventListener(GamepadButtonID.SELECT, GamepadButtonEvent.PRESS_END, this, this._throw.bind(this, GamepadButtonID.SELECT));
            } else if (this._myGrabButton == 1) {
                this._myGamepad.registerButtonEventListener(GamepadButtonID.SQUEEZE, GamepadButtonEvent.PRESS_START, this, this._grab.bind(this, GamepadButtonID.SQUEEZE));
                this._myGamepad.registerButtonEventListener(GamepadButtonID.SQUEEZE, GamepadButtonEvent.PRESS_END, this, this._throw.bind(this, GamepadButtonID.SQUEEZE));
            } else {
                this._myGamepad.registerButtonEventListener(GamepadButtonID.SQUEEZE, GamepadButtonEvent.PRESS_START, this, this._grab.bind(this, GamepadButtonID.SQUEEZE));
                this._myGamepad.registerButtonEventListener(GamepadButtonID.SQUEEZE, GamepadButtonEvent.PRESS_END, this, this._throw.bind(this, GamepadButtonID.SQUEEZE));

                this._myGamepad.registerButtonEventListener(GamepadButtonID.SELECT, GamepadButtonEvent.PRESS_START, this, this._grab.bind(this, GamepadButtonID.SELECT));
                this._myGamepad.registerButtonEventListener(GamepadButtonID.SELECT, GamepadButtonEvent.PRESS_END, this, this._throw.bind(this, GamepadButtonID.SELECT));
            }
        }
    }

    onDeactivate() {
        this.throw();

        if (this._myGamepad != null) {
            if (this._myGrabButton == 0) {
                this._myGamepad.unregisterButtonEventListener(GamepadButtonID.SELECT, GamepadButtonEvent.PRESS_START, this);
                this._myGamepad.unregisterButtonEventListener(GamepadButtonID.SELECT, GamepadButtonEvent.PRESS_END, this);
            } else if (this._myGrabButton == 1) {
                this._myGamepad.unregisterButtonEventListener(GamepadButtonID.SQUEEZE, GamepadButtonEvent.PRESS_START, this);
                this._myGamepad.unregisterButtonEventListener(GamepadButtonID.SQUEEZE, GamepadButtonEvent.PRESS_END, this);
            } else {
                this._myGamepad.unregisterButtonEventListener(GamepadButtonID.SQUEEZE, GamepadButtonEvent.PRESS_START, this);
                this._myGamepad.unregisterButtonEventListener(GamepadButtonID.SQUEEZE, GamepadButtonEvent.PRESS_END, this);

                this._myGamepad.unregisterButtonEventListener(GamepadButtonID.SELECT, GamepadButtonEvent.PRESS_START, this);
                this._myGamepad.unregisterButtonEventListener(GamepadButtonID.SELECT, GamepadButtonEvent.PRESS_END, this);
            }
        }
    }

    _grab(grabButton) {
        if (this._myGrabbables.length >= this._myMaxNumberOfObjects) {
            return;
        }

        if (this._myGrabButton == 2 || this._myActiveGrabButton == null || this._myActiveGrabButton == grabButton || grabButton == null) {
            let grabbablesToGrab = [];

            let collisions = this._myCollisionsCollector.getCollisions();
            for (let i = 0; i < collisions.length; i++) {
                let grabbable = collisions[i].pp_getComponent(GrabbableComponent);
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
                    let grabbableData = new _GrabberHandComponentGrabbableData(grabbableToGrab, this._myThrowVelocitySource == 1, this._myLinearVelocityHistorySize, this._myAngularVelocityHistorySize);
                    this._myGrabbables.push(grabbableData);
                    grabbableToGrab.grab(this.object);
                    grabbableToGrab.registerReleaseEventListener(this, this._onRelease.bind(this));

                    if (this._mySnapGrabbableOnOrigin) {
                        grabbableToGrab.object.pp_resetPositionLocal();
                    }

                    this._myGrabEmitter.notify(this, grabbableToGrab);
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
    }

    _throw(throwButton) {
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

                    this._myThrowEmitter.notify(this, grabbable);
                }

                this._myGrabbables = [];
            }

            this._myActiveGrabButton = null;
        }
    }

    _onRelease(grabber, grabbable) {
        grabbable.unregisterReleaseEventListener(this);
        this._myGrabbables.pp_remove(element => element.getGrabbable() == grabbable);

        if (this._myGrabbables.length <= 0) {
            this._myActiveGrabButton = null;
        }
    }

    _updateLinearVelocityHistory() {
        let handPose = this._myGamepad.getHandPose();
        this._myHandLinearVelocityHistory.unshift(handPose.getLinearVelocity());
        this._myHandLinearVelocityHistory.pop();

        for (let grabbable of this._myGrabbables) {
            grabbable.updateLinearVelocityHistory();
        }
    }

    _updateAngularVelocityHistory() {
        let handPose = this._myGamepad.getHandPose();
        this._myHandAngularVelocityHistory.unshift(handPose.getAngularVelocityRadians());
        this._myHandAngularVelocityHistory.pop();

        for (let grabbable of this._myGrabbables) {
            grabbable.updateAngularVelocityHistory();
        }
    }

    _computeReleaseLinearVelocity(linearVelocityHistory) {
        // Speed
        let speed = linearVelocityHistory[0].vec3_length();
        for (let i = 1; i < this._myLinearVelocityHistorySpeedAverageSamplesFromStart; i++) {
            speed += linearVelocityHistory[i].vec3_length();
        }
        speed /= this._myLinearVelocityHistorySpeedAverageSamplesFromStart;

        // This way I give an increasing and smooth boost to the throw so that when u want to perform a weak throw, the value is not changed, but if u put more speed
        // it will be boosted to make it easier and still feel good and natural (value does not increase suddenly)
        let speedEaseMultiplier = Math.pp_mapToRange(speed, this._myThrowLinearVelocityBoostMinSpeedThreshold, this._myThrowLinearVelocityBoostMaxSpeedThreshold, 0, 1);
        speedEaseMultiplier = EasingFunction.easeIn(speedEaseMultiplier);

        // Add the boost to the speed
        let extraSpeed = speed * (speedEaseMultiplier * this._myThrowLinearVelocityBoost);
        speed += extraSpeed;
        speed *= this._myThrowLinearVelocityMultiplier;
        speed = Math.pp_clamp(speed, 0, this._myThrowMaxLinearSpeed);

        if (this._myDebugEnabled && Globals.isDebugEnabled(this.engine)) {
            this._debugDirectionLines(linearVelocityHistory);
        }

        // Direction
        let directionCurrentWeight = this._myLinearVelocityHistoryDirectionAverageSamplesFromStart;
        let lastDirectionIndex = this._myLinearVelocityHistoryDirectionAverageSkipFromStart + this._myLinearVelocityHistoryDirectionAverageSamplesFromStart;
        let direction = vec3_create();
        for (let i = this._myLinearVelocityHistoryDirectionAverageSkipFromStart; i < lastDirectionIndex; i++) {
            let currentDirection = linearVelocityHistory[i];
            currentDirection.vec3_scale(directionCurrentWeight, currentDirection);
            direction.vec3_add(currentDirection, direction);

            directionCurrentWeight--;
        }
        direction.vec3_normalize(direction);

        direction.vec3_scale(speed, direction);

        return direction;
    }

    _computeReleaseAngularVelocity(angularVelocityHistory) {
        let angularVelocity = angularVelocityHistory[0];

        // Speed
        let speed = angularVelocity.vec3_length();

        speed = Math.pp_clamp(speed * this._myThrowAngularVelocityMultiplier, 0, this._myThrowMaxAngularSpeedRadians);

        // Direction
        let direction = angularVelocity;
        direction.vec3_normalize(direction);

        direction.vec3_scale(speed, direction);

        return direction;
    }

    _debugDirectionLines(linearVelocityHistory) {
        for (let j = this._myLinearVelocityHistoryDirectionAverageSkipFromStart + this._myLinearVelocityHistoryDirectionAverageSamplesFromStart; j > this._myLinearVelocityHistoryDirectionAverageSkipFromStart; j--) {

            let directionCurrentWeight = j - this._myLinearVelocityHistoryDirectionAverageSkipFromStart;
            let lastDirectionIndex = j - this._myLinearVelocityHistoryDirectionAverageSkipFromStart;
            let direction = vec3_create();
            for (let i = this._myLinearVelocityHistoryDirectionAverageSkipFromStart; i < lastDirectionIndex; i++) {
                let currentDirection = linearVelocityHistory[i].pp_clone();
                currentDirection.vec3_scale(directionCurrentWeight, currentDirection);
                direction.vec3_add(currentDirection, direction);

                directionCurrentWeight--;
            }
            direction.vec3_normalize(direction);

            let color = 1 / j;

            Globals.getDebugVisualManager(this.engine).drawLine(5, this.object.pp_getPosition(), direction, 0.2, vec4_create(color, color, color, 1));
        }
    }

    _isAlreadyGrabbed(grabbable) {
        let found = this._myGrabbables.pp_find(element => element.getGrabbable() == grabbable);
        return found != null;
    }
}

class _GrabberHandComponentGrabbableData {

    constructor(grabbable, useGrabbableAsVelocitySource, linearVelocityHistorySize, angularVelocityHistorySize) {
        this._myGrabbable = grabbable;
        this._myUseGrabbableAsVelocitySource = useGrabbableAsVelocitySource;

        if (this._myUseGrabbableAsVelocitySource) {
            this._myLinearVelocityHistory = new Array(linearVelocityHistorySize);
            this._myLinearVelocityHistory.fill(vec3_create());

            this._myAngularVelocityHistory = new Array(angularVelocityHistorySize);
            this._myAngularVelocityHistory.fill(vec3_create());
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

    onDestroy() {
        this._myCollisionsCollector.destroy();
    }
}