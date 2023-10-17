import { InputComponent, ViewComponent } from "@wonderlandengine/api";
import { Cursor, CursorTarget, HitTestLocation } from "@wonderlandengine/components";
import { XRUtils } from "../../../../cauldron/utils/xr_utils";
import { Handedness } from "../../../../input/cauldron/input_types";
import { InputUtils } from "../../../../input/cauldron/input_utils";
import { Globals } from "../../../../pp/globals";
import { mat4_create, quat2_create, vec3_create } from "../../../js/extensions/array_extension";
import { PluginUtils } from "../../../utils/plugin_utils";

export function initCursorComponentMod() {
    initCursorComponentModPrototype();
}

export function initCursorComponentModPrototype() {
    let cursorComponentMod = {};

    // Modified Functions

    cursorComponentMod.init = function init() {
        this.maxDistance = 100;
        this.visible = false;
        this.globalTarget = this.object.pp_addComponent(CursorTarget);
        this.hitTestTarget = this.object.pp_addComponent(CursorTarget);
        this.hoveringObject = null;
        this.hoveringObjectTarget = null;

        this.cursorPos = vec3_create();

        this._collisionMask = (1 << this.collisionGroup);

        this._doubleClickTimer = 0;
        this._tripleClickTimer = 0;
        this._multipleClickObject = null;
        this._multipleClickDelay = 0.3;

        this._onDestroyCallbacks = [];

        this._prevHitLocationLocalToTarget = vec3_create();

        this._pointerID = null;

        this._updatePointerStyle = false;

        this._lastClientX = null;
        this._lastClientY = null;
        this._lastWidth = null;
        this._lastHeight = null;
        this._lastPointerID = null;

        this._lastOriginalMouseEvent = null;
        this._lastOriginalGamepadEvent = null;

        this._pointerLeaveToProcess = false;
        this._pointerLeaveMouseEvent = null;

        this._transformQuat = quat2_create();
        this._origin = vec3_create();
        this._direction = vec3_create();

        this._isHovering = false;

        this._isDown = false;
        this._lastIsDown = false;
        this._isRealDown = false;

        this._isDownForUpWithDown = false;
        this._isUpWithNoDown = false;

        this._tempVec = vec3_create();

        this._viewComponent = null;

        this._cursorRayOrigin = vec3_create();
        this._cursorRayScale = vec3_create();

        this._projectionMatrix = mat4_create();

        this._hitTestLocation = null;
        this._hitTestObject = null;

        this._rayHitLocation = vec3_create();
        this._hitObjectData = [null, null, null];

        this._myViewEventListenersRegistered = false;
    };

    cursorComponentMod.start = function start() {
        if (this.handedness == 0) {
            let inputComp = this.object.pp_getComponent(InputComponent);
            if (!inputComp) {
                console.warn("cursor component on object " + this.object.pp_getName() + " was configured with handedness \"input component\", " + "but object has no input component.");
            } else {
                this.handedness = inputComp.handedness;
                this.input = inputComp;
            }
        } else {
            this.handedness = InputUtils.getHandednessByIndex(this.handedness - 1);
        }

        this.pp_setViewComponent(this.object.pp_getComponent(ViewComponent));

        XRUtils.registerSessionStartEventListener(this, this.setupVREvents.bind(this), true, false, this.engine);
        this._onDestroyCallbacks.push(() => {
            XRUtils.unregisterSessionStartEventListener(this, this.engine);
        });

        if (this.cursorRayObject) {
            this.cursorRayObject.pp_setActive(false);
            this._cursorRayScale.set(this.cursorRayObject.pp_getScaleLocal());

            // Set ray to a good default distance of the cursor of 1m 
            this._setCursorRayTransform(null);
        }

        this._setCursorVisibility(false);

        if (this.useWebXRHitTest) {
            this._hitTestObject = this.object.pp_addObject();
            this._hitTestLocation = this.hitTestObject.pp_addComponent(HitTestLocation, { scaleObject: false, });
        }
    };

    cursorComponentMod.update = function update(dt) {
        if (this._doubleClickTimer > 0) {
            this._doubleClickTimer -= dt;
        }

        if (this._tripleClickTimer > 0) {
            this._tripleClickTimer -= dt;
        }

        // If in XR, set the cursor ray based on object transform
        // View Component not null is currently used as a way to specify this is cursor should only work for Non XR
        if (XRUtils.isSessionActive(this.engine) && this._viewComponent == null) {
            // Since Google Cardboard tap is registered as arTouchDown without a gamepad, we need to check for gamepad presence 
            if (this.arTouchDown && this._pp_isAR()) {
                let axes = XRUtils.getSession(this.engine).inputSources[0].gamepad.axes;
                // Screenspace Y is inverted 
                this._direction.vec3_set(axes[0], -axes[1], -1.0);
                this.updateDirection();
            } else {
                this.object.pp_getPosition(this._origin);
                this.object.pp_getForward(this._direction);
            }

            let hitObjectData = this._pp_rayCast();
            this._pp_hoverBehaviour(hitObjectData[0], hitObjectData[1], hitObjectData[2], this._lastOriginalGamepadEvent);
        } else if (!XRUtils.isSessionActive(this.engine) && this._viewComponent != null) {
            if (this._lastPointerID != null) {
                this._pp_updateMousePos(this._lastClientX, this._lastClientY, this._lastWidth, this._lastHeight);

                let hitObjectData = this._pp_rayCast();
                this._pp_hoverBehaviour(hitObjectData[0], hitObjectData[1], hitObjectData[2], this._lastOriginalMouseEvent);

                if (this.hoveringObject != null) {
                    this._pointerID = this._lastPointerID;
                } else {
                    this._pointerID = null;
                }
            } else if (this.hoveringObject != null) {
                this._pp_hoverBehaviour(null, null, null, this._lastOriginalMouseEvent, true); // Trigger Unhover
            }
        } else if (this.hoveringObject != null) {
            this._pp_hoverBehaviour(null, null, null, null, true); // Trigger Unhover
        }

        this._pp_processPointerLeave();

        if (this.hoveringObject != null && (this.cursorPos[0] != 0 || this.cursorPos[1] != 0 || this.cursorPos[2] != 0)) {
            if (this.cursorObject) {
                this._setCursorVisibility(true);

                this.cursorObject.pp_setPosition(this.cursorPos);
                this.cursorObject.pp_setTransformLocalQuat(this.cursorObject.pp_getTransformLocalQuat(this._transformQuat).quat2_normalize(this._transformQuat));
            }

            if (this.cursorRayObject) {
                this._setCursorRayTransform(this.cursorPos);
            }
        } else {
            if (this.cursorObject) {
                this._setCursorVisibility(false);
            }

            if (this.cursorRayObject) {
                this._setCursorRayTransform(null);
            }
        }

        if (this.cursorRayObject) {
            if ((XRUtils.isSessionActive(this.engine) && this._viewComponent == null) || (!XRUtils.isSessionActive(this.engine) && this._viewComponent != null && this.handedness != Handedness.LEFT && this.handedness != Handedness.RIGHT)) {
                this.cursorRayObject.pp_setActive(true);
            } else {
                this.cursorRayObject.pp_setActive(false);
            }
        }

        if (this.hoveringObject == null) {
            this._pointerID = null;
        }

        this._updatePointerStyle = false;

        this._lastOriginalMouseEvent = null;
        this._lastOriginalGamepadEvent = null;
    };

    cursorComponentMod.onActivate = function onActivate() {
        this._isDown = false;
        this._lastIsDown = false;

        this._isDownForUpWithDown = false;
        this._isUpWithNoDown = false;
    };

    cursorComponentMod.onDeactivate = function onDeactivate() {
        if (this.hoveringObject != null) {
            this._pp_hoverBehaviour(null, null, null, null, true); // Trigger Unhover
        }

        this.hoveringObject = null;
        this.hoveringObjectTarget = null;

        this._pp_updateCursorStyle();

        this._setCursorVisibility(false);
        if (this.cursorRayObject) {
            this.cursorRayObject.pp_setActive(false);
        }

        this._isDown = false;
        this._lastIsDown = false;
        this._isRealDown = false;

        this._isDownForUpWithDown = false;
        this._isUpWithNoDown = false;

        this._pointerID = null;

        this._lastPointerID = null;

        this._lastClientX = null;
        this._lastClientY = null;
        this._lastWidth = null;
        this._lastHeight = null;

        this._lastOriginalMouseEvent = null;
        this._lastOriginalGamepadEvent = null;

        this._pointerLeaveToProcess = false;
        this._pointerLeaveMouseEvent = null;
    };

    cursorComponentMod.onDestroy = function onDestroy() {
        if (this._hitTestObject != null) {
            this._hitTestObject.pp_destroy();
        }

        for (let callback of this._onDestroyCallbacks) {
            callback();
        }
    };

    cursorComponentMod.updateDirection = function () {
        let transformWorld = quat2_create();
        return function updateDirection() {
            this.object.pp_getPosition(this._origin);

            // Reverse-project the direction into view space 
            this._direction.vec3_transformMat4(this._projectionMatrix, this._direction);
            this._direction.vec3_normalize(this._direction);
            this._direction.vec3_transformQuat(this.object.pp_getTransformQuat(transformWorld), this._direction);
        };
    }();

    cursorComponentMod.setupVREvents = function setupVREvents(session) {
        // If in XR, one-time bind the listener 

        let onSelect = this.onSelect.bind(this);
        session.addEventListener("select", onSelect);
        let onSelectStart = this.onSelectStart.bind(this);
        session.addEventListener("selectstart", onSelectStart);
        let onSelectEnd = this.onSelectEnd.bind(this);
        session.addEventListener("selectend", onSelectEnd);

        this._onDestroyCallbacks.push(() => {
            if (!XRUtils.isSessionActive(this.engine)) return;

            let session = XRUtils.getSession(this.engine);
            session.removeEventListener("select", onSelect);
            session.removeEventListener("selectstart", onSelectStart);
            session.removeEventListener("selectend", onSelectEnd);
        });

        // After XR session was entered, the projection matrix changed 
        this._onViewportResize();
    };

    cursorComponentMod.onSelect = function onSelect(e) {
    };

    cursorComponentMod.onSelectStart = function onSelectStart(e) {
        if (this.active) {
            if (this._pp_isAR()) {
                this.arTouchDown = true;
                this._lastOriginalGamepadEvent = e;
            } else if (e.inputSource.handedness == this.handedness) {
                this._isDown = true;
                this._isRealDown = true;

                if (!this._lastIsDown) {
                    this._isDownForUpWithDown = true;
                }

                this._lastOriginalGamepadEvent = e;
            }
        }
    };

    cursorComponentMod.onSelectEnd = function onSelectEnd(e) {
        if (this.active) {
            if (this._pp_isAR()) {
                this.arTouchDown = false;
                this._lastOriginalGamepadEvent = e;
            } else if (e.inputSource.handedness == this.handedness) {
                if (!this._isDownForUpWithDown) {
                    this._isUpWithNoDown = true;
                }

                this._isDown = false;
                this._isRealDown = false;

                this._isDownForUpWithDown = false;

                this._lastOriginalGamepadEvent = e;
            }
        }
    };

    cursorComponentMod.onPointerMove = function onPointerMove(e) {
        if (this.active && !this._pointerLeaveToProcess) {
            // Don't care about secondary pointers 
            if (this._pointerID != null && this._pointerID != e.pointerId) return;

            let bounds = Globals.getBody(this.engine).getBoundingClientRect();
            this._pp_updateMouseData(e, e.clientX, e.clientY, bounds.width, bounds.height, e.pointerId);
        }
    };

    cursorComponentMod.onClick = function onClick(e) {
    };

    cursorComponentMod.onPointerDown = function onPointerDown(e) {
        if (this.active && !this._pointerLeaveToProcess) {
            // Don't care about secondary pointers or non-left clicks 
            if ((this._pointerID != null && this._pointerID != e.pointerId) || e.button !== 0) return;

            let bounds = Globals.getBody(this.engine).getBoundingClientRect();
            this._pp_updateMouseData(e, e.clientX, e.clientY, bounds.width, bounds.height, e.pointerId);

            this._isDown = true;
            this._isRealDown = true;

            if (!this._lastIsDown) {
                this._isDownForUpWithDown = true;
            }
        }
    };

    cursorComponentMod.onPointerUp = function onPointerUp(e) {
        if (this.active && !this._pointerLeaveToProcess) {
            // Don't care about secondary pointers or non-left clicks 
            if ((this._pointerID != null && this._pointerID != e.pointerId) || e.button !== 0) return;

            let bounds = Globals.getBody(this.engine).getBoundingClientRect();
            this._pp_updateMouseData(e, e.clientX, e.clientY, bounds.width, bounds.height, e.pointerId);

            if (!this._isDownForUpWithDown) {
                this._isUpWithNoDown = true;
            }

            this._isDown = false;
            this._isRealDown = false;

            this._isDownForUpWithDown = false;

            this._updatePointerStyle = true;
        }
    };

    cursorComponentMod._onViewportResize = function _onViewportResize() {
        if (!this._viewComponent) return;

        // Projection matrix will change if the viewport is resized, which will affect the
        // projection matrix because of the aspect ratio
        this._viewComponent.projectionMatrix.mat4_invert(this._projectionMatrix);
    };

    cursorComponentMod._setCursorRayTransform = function _setCursorRayTransform(hitPosition) {
        if (!this.cursorRayObject) return;
        if (this.cursorRayScalingAxis != 4) {
            this.cursorRayObject.pp_resetScaleLocal();

            if (hitPosition != null) {
                this.cursorRayObject.pp_getPosition(this._cursorRayOrigin);
                let dist = this._cursorRayOrigin.vec3_distance(hitPosition);
                this._cursorRayScale[this.cursorRayScalingAxis] = dist;
                this.cursorRayObject.pp_scaleObject(this._cursorRayScale);
            }
        }
    };

    cursorComponentMod._setCursorVisibility = function _setCursorVisibility(visible) {
        this.visible = visible;
        if (!this.cursorObject) return;

        this.cursorObject.pp_setActive(visible);
    };

    // New Functions 

    cursorComponentMod._pp_hoverBehaviour = function _pp_hoverBehaviour(hitObject, hitLocation, hitTestResults, originalEvent = null, forceUnhover = false) {
        if (!forceUnhover && hitObject != null) {
            let hoveringObjectChanged = false;
            if (this.hoveringObject == null || !this.hoveringObject.pp_equals(hitObject)) {
                // Unhover previous, if exists 
                if (this.hoveringObject != null) {
                    if (!this.hoveringReality) {
                        if (this.hoveringObjectTarget) this.hoveringObjectTarget.onUnhover.notify(this.hoveringObject, this, originalEvent);
                        this.globalTarget.onUnhover.notify(this.hoveringObject, this, originalEvent);
                    } else {
                        this.hitTestTarget.onUnhover.notify(null, this, originalEvent);
                    }
                }

                hoveringObjectChanged = true;

                // Hover new object 
                this.hoveringObject = hitObject;
                this.hoveringObjectTarget = this.hoveringObject.pp_getComponent(CursorTarget);

                if (!this.hoveringReality) {
                    if (this.hoveringObjectTarget) this.hoveringObjectTarget.onHover.notify(this.hoveringObject, this, originalEvent);
                    this.globalTarget.onHover.notify(this.hoveringObject, this, originalEvent);
                } else {
                    this.hitTestTarget.onHover.notify(hitTestResults, this, originalEvent);
                }

                this._pp_updateCursorStyle();

                if (!this._pp_isDownToProcess() && this._isRealDown) {
                    this._isDown = true;
                    this._lastIsDown = true;

                    this._isDownForUpWithDown = false;
                    this._isUpWithNoDown = false;

                    if (!this.hoveringReality) {
                        if (this.hoveringObjectTarget) this.hoveringObjectTarget.onDownOnHover.notify(this.hoveringObject, this, originalEvent);
                        this.globalTarget.onDownOnHover.notify(this.hoveringObject, this, originalEvent);
                    } else {
                        this.hitTestTarget.onDownOnHover.notify(hitTestResults, this, originalEvent);
                    }
                }
            }

            if (this._updatePointerStyle) {
                this._pp_updateCursorStyle();
            }

            if (!hoveringObjectChanged && this._pp_isMoving(hitLocation)) {

                if (!this.hoveringReality) {
                    if (this.hoveringObjectTarget) this.hoveringObjectTarget.onMove.notify(this.hoveringObject, this, originalEvent);
                    this.globalTarget.onMove.notify(this.hoveringObject, this, originalEvent);
                } else {
                    this.hitTestTarget.onMove.notify(hitTestResults, this, originalEvent);
                }
            }

            if (this._pp_isDownToProcess()) {
                // Cursor down 
                if (!this.hoveringReality) {
                    if (this.hoveringObjectTarget) this.hoveringObjectTarget.onDown.notify(this.hoveringObject, this, originalEvent);
                    this.globalTarget.onDown.notify(this.hoveringObject, this, originalEvent);
                } else {
                    this.hitTestTarget.onDown.notify(hitTestResults, this, originalEvent);
                }

                // Click 
                if (!this.hoveringReality) {
                    if (this.hoveringObjectTarget) this.hoveringObjectTarget.onClick.notify(this.hoveringObject, this, originalEvent);
                    this.globalTarget.onClick.notify(this.hoveringObject, this, originalEvent);
                } else {
                    this.hitTestTarget.onClick.notify(hitTestResults, this, originalEvent);
                }

                // Multiple Clicks 
                if (this._tripleClickTimer > 0 && this._multipleClickObject && this._multipleClickObject.pp_equals(this.hoveringObject)) {
                    if (!this.hoveringReality) {
                        if (this.hoveringObjectTarget) this.hoveringObjectTarget.onTripleClick.notify(this.hoveringObject, this, originalEvent);
                        this.globalTarget.onTripleClick.notify(this.hoveringObject, this, originalEvent);
                    } else {
                        this.hitTestTarget.onTripleClick.notify(hitTestResults, this, originalEvent);
                    }

                    this._tripleClickTimer = 0;
                } else if (this._doubleClickTimer > 0 && this._multipleClickObject && this._multipleClickObject.pp_equals(this.hoveringObject)) {
                    if (!this.hoveringReality) {
                        if (this.hoveringObjectTarget) this.hoveringObjectTarget.onDoubleClick.notify(this.hoveringObject, this, originalEvent);
                        this.globalTarget.onDoubleClick.notify(this.hoveringObject, this, originalEvent);
                    } else {
                        this.hitTestTarget.onDoubleClick.notify(hitTestResults, this, originalEvent);
                    }

                    this._tripleClickTimer = this._multipleClickDelay;
                    this._doubleClickTimer = 0;
                } else {
                    if (!this.hoveringReality) {
                        if (this.hoveringObjectTarget) this.hoveringObjectTarget.onSingleClick.notify(this.hoveringObject, this, originalEvent);
                        this.globalTarget.onSingleClick.notify(this.hoveringObject, this, originalEvent);
                    } else {
                        this.hitTestTarget.onSingleClick.notify(hitTestResults, this, originalEvent);
                    }

                    this._tripleClickTimer = 0;
                    this._doubleClickTimer = this._multipleClickDelay;
                    this._multipleClickObject = this.hoveringObject;
                }
            } else {
                // Cursor up 
                if (!this._isUpWithNoDown && !hoveringObjectChanged && this._pp_isUpToProcess()) {
                    if (!this.hoveringReality) {
                        if (this.hoveringObjectTarget) this.hoveringObjectTarget.onUp.notify(this.hoveringObject, this, originalEvent);
                        this.globalTarget.onUp.notify(this.hoveringObject, this, originalEvent);

                        if (this.hoveringObjectTarget) this.hoveringObjectTarget.onUpWithDown.notify(this.hoveringObject, this, originalEvent);
                        this.globalTarget.onUpWithDown.notify(this.hoveringObject, this, originalEvent);
                    } else {
                        this.hitTestTarget.onUp.notify(hitTestResults, this, originalEvent);

                        this.hitTestTarget.onUpWithDown.notify(hitTestResults, this, originalEvent);
                    }
                } else if (this._isUpWithNoDown || (hoveringObjectChanged && this._pp_isUpToProcess())) {
                    if (!this.hoveringReality) {
                        if (this.hoveringObjectTarget) this.hoveringObjectTarget.onUp.notify(this.hoveringObject, this, originalEvent);
                        this.globalTarget.onUp.notify(this.hoveringObject, this, originalEvent);

                        if (this.hoveringObjectTarget) this.hoveringObjectTarget.onUpWithNoDown.notify(this.hoveringObject, this, originalEvent);
                        this.globalTarget.onUpWithNoDown.notify(this.hoveringObject, this, originalEvent);
                    } else {
                        this.hitTestTarget.onUp.notify(hitTestResults, this, originalEvent);

                        this.hitTestTarget.onUpWithNoDown.notify(hitTestResults, this, originalEvent);
                    }
                }
            }

            this._prevHitLocationLocalToTarget = this.hoveringObject.pp_convertPositionWorldToLocal(hitLocation, this._prevHitLocationLocalToTarget);
        } else if (this.hoveringObject != null && (forceUnhover || hitObject == null)) {
            if (!this.hoveringReality) {
                if (this.hoveringObjectTarget) this.hoveringObjectTarget.onUnhover.notify(this.hoveringObject, this, originalEvent);
                this.globalTarget.onUnhover.notify(this.hoveringObject, this, originalEvent);
            } else {
                this.hitTestTarget.onUnhover.notify(null, this, originalEvent);
            }

            this.hoveringObject = null;
            this.hoveringObjectTarget = null;

            this._pp_updateCursorStyle();
        }

        if (this.hoveringObject != null) {
            this._lastIsDown = this._isDown;
        } else {
            this._isDown = false;
            this._lastIsDown = false;

            this._isDownForUpWithDown = false;
        }

        this._isUpWithNoDown = false;
    };

    cursorComponentMod._pp_rayCast = function _pp_rayCast() {
        let rayHit =
            this.rayCastMode == 0
                ? Globals.getScene(this.engine).rayCast(
                    this._origin,
                    this._direction,
                    this._collisionMask
                )
                : Globals.getPhysics(this.engine).rayCast(
                    this._origin,
                    this._direction,
                    this._collisionMask,
                    this.maxDistance
                );

        let rayHitCollisionDistanceValid = true;
        if (this.rayCastMode == 0 && rayHit.hitCount > 0 && rayHit.distances[0] > this.maxDistance) {
            rayHitCollisionDistanceValid = false;
        }

        this._hitObjectData[0] = null;
        this._hitObjectData[1] = null;
        this._hitObjectData[2] = null;

        let hitTestResultDistance = Infinity;
        if (this._hitTestLocation != null && this._hitTestLocation.visible) {
            this._hitTestObject.pp_getPositionWorld(this.cursorPos);
            this._rayHitLocation.vec3_copy(this.cursorPos);
            hitTestResultDistance = this.cursorPos.vec3_distance(this.object.pp_getPositionWorld(this._tempVec));

            this._hitObjectData[0] = this._hitTestObject;
            this._hitObjectData[1] = this._rayHitLocation;
        }

        this.hoveringReality = false;

        if (rayHit.hitCount > 0 && rayHitCollisionDistanceValid) {
            let rayHitDistance = rayHit.distances[0];
            if (rayHitDistance <= hitTestResultDistance) {
                // Overwrite cursorPos set by hit test location
                this.cursorPos.vec3_copy(rayHit.locations[0]);
                this._rayHitLocation.vec3_copy(this.cursorPos);

                this._hitObjectData[0] = rayHit.objects[0];
                this._hitObjectData[1] = this._rayHitLocation;
            } else {
                this.hoveringReality = true;
            }
        } else if (hitTestResultDistance == Infinity) {
            this.cursorPos.vec3_zero();

            this._hitObjectData[0] = null;
            this._hitObjectData[1] = null;
        }

        let xrFrame = XRUtils.getFrame(this.engine);
        if (this.hoveringReality && xrFrame != null) {
            this._hitObjectData[2] = this._hitTestLocation.getHitTestResults(xrFrame)[0];
        }

        return this._hitObjectData;
    };

    cursorComponentMod._pp_updateMouseData = function _pp_updateMouseData(e, clientX, clientY, w, h, pointerID) {
        this._lastClientX = clientX;
        this._lastClientY = clientY;
        this._lastWidth = w;
        this._lastHeight = h;
        this._lastPointerID = pointerID;

        this._lastOriginalMouseEvent = e;
    };

    cursorComponentMod._pp_updateMousePos = function _pp_updateMousePos(clientX, clientY, w, h) {
        // Get direction in normalized device coordinate space from mouse position 
        let left = clientX / w;
        let top = clientY / h;
        this._direction.vec3_set(left * 2 - 1, -top * 2 + 1, -1.0);

        this.updateDirection();
    };

    cursorComponentMod.pp_setViewComponent = function pp_setViewComponent(viewComponent) {
        this._viewComponent = viewComponent;

        // If this object also has a view component, we will enable inverse-projected mouse clicks,
        // otherwise just use the objects transformation
        if (this._viewComponent != null) {
            this._viewComponent.projectionMatrix.mat4_invert(this._projectionMatrix);

            if (!this._myViewEventListenersRegistered) {
                this._myViewEventListenersRegistered = true;

                let onClick = this.onClick.bind(this);
                Globals.getCanvas(this.engine).addEventListener("click", onClick);
                let onPointerDown = this.onPointerDown.bind(this);
                Globals.getCanvas(this.engine).addEventListener("pointerdown", onPointerDown);
                let onPointerMove = this.onPointerMove.bind(this);
                Globals.getCanvas(this.engine).addEventListener("pointermove", onPointerMove);
                let onPointerUp = this.onPointerUp.bind(this);
                Globals.getCanvas(this.engine).addEventListener("pointerup", onPointerUp);
                let onPointerLeave = this._pp_onPointerLeave.bind(this);
                Globals.getCanvas(this.engine).addEventListener("pointerleave", onPointerLeave);

                let onViewportResize = this._onViewportResize.bind(this);
                this.engine.onResize.add(onViewportResize);

                this._onDestroyCallbacks.push(() => {
                    Globals.getCanvas(this.engine).removeEventListener("click", onClick);
                    Globals.getCanvas(this.engine).removeEventListener("pointerdown", onPointerDown);
                    Globals.getCanvas(this.engine).removeEventListener("pointermove", onPointerMove);
                    Globals.getCanvas(this.engine).removeEventListener("pointerup", onPointerUp);
                    Globals.getCanvas(this.engine).removeEventListener("pointerleave", onPointerLeave);

                    this.engine.onResize.remove(onViewportResize);

                    this._myViewEventListenersRegistered = false;
                });
            }
        }
    };

    cursorComponentMod._pp_onPointerLeave = function _pp_onPointerLeave(e) {
        if (this._pointerID == null || this._pointerID == e.pointerId) {
            this._pointerLeaveToProcess = true;
            this._pointerLeaveMouseEvent = e;
        }
    };

    cursorComponentMod._pp_processPointerLeave = function _pp_processPointerLeave() {
        if (this._pointerLeaveToProcess) {
            this._pointerID = null;

            this._lastPointerID = null;

            this._lastClientX = null;
            this._lastClientY = null;
            this._lastWidth = null;
            this._lastHeight = null;

            this._lastOriginalMouseEvent = this._pointerLeaveMouseEvent;

            this._pointerLeaveToProcess = false;
            this._pointerLeaveMouseEvent = null;

            if (this.hoveringObject != null) {
                this._pp_hoverBehaviour(null, null, null, this._lastOriginalMouseEvent, true); // Trigger Unhover
            }

            this._isDown = false;
            this._lastIsDown = false;
            this._isRealDown = false;

            this._isDownForUpWithDown = false;
            this._isUpWithNoDown = false;
        }
    };

    cursorComponentMod._pp_isDownToProcess = function _pp_isDownToProcess() {
        return this._isDown !== this._lastIsDown && this._isDown;
    };

    cursorComponentMod._pp_isUpToProcess = function _pp_isUpToProcess() {
        return this._isDown !== this._lastIsDown && !this._isDown;
    };

    cursorComponentMod._pp_isMoving = function () {
        let hitLocationLocalToTarget = vec3_create();
        return function _pp_isMoving(hitLocation) {
            let moving = false;

            hitLocationLocalToTarget = this.hoveringObject.pp_convertPositionWorldToLocal(hitLocation, hitLocationLocalToTarget);

            if (!hitLocationLocalToTarget.vec_equals(this._prevHitLocationLocalToTarget, 0.0001)) {
                moving = true;
            }

            return moving;
        };
    }();

    cursorComponentMod._pp_isAR = function _pp_isAR() {
        let firstInputSource = XRUtils.getSession(this.engine).inputSources[0];
        return this.input != null && firstInputSource.handedness === "none" && firstInputSource.gamepad != null;
    };

    cursorComponentMod._pp_updateCursorStyle = function _pp_updateCursorStyle() {
        if (this.styleCursor) {
            if (this.hoveringObjectTarget != null && !this.hoveringObjectTarget.isSurface) {
                Globals.getBody(this.engine).style.cursor = "pointer";
            } else if (Globals.getBody(this.engine).style.cursor == "pointer") {
                Globals.getBody(this.engine).style.cursor = "default";
            }
        }
    };



    PluginUtils.injectProperties(cursorComponentMod, Cursor.prototype, false, true, true);
}