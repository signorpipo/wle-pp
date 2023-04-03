import { InputComponent, ViewComponent } from "@wonderlandengine/api";
import { Cursor, CursorTarget } from "@wonderlandengine/components";
import { XRUtils } from "../../../../cauldron/utils/xr_utils";
import { InputUtils } from "../../../../input/cauldron/input_utils";
import { vec3_create, quat_create, quat2_create, mat4_create } from "../../../js/extensions/array_extension";

export function initCursorComponentMod() {
    initCursorComponentModPrototype();
}

export function initCursorComponentModPrototype() {
    // Modified Functions

    Cursor.prototype.init = function init() {
        /* VR session cache, in case in VR */
        this.session = null;
        this.collisionMask = (1 << this.collisionGroup);
        this.maxDistance = 100;

        this.doubleClickTimer = 0;
        this.tripleClickTimer = 0;
        this.multipleClickObject = null;
        this.multipleClickDelay = 0.3;

        this.visible = false;

        this.onDestroyCallbacks = [];

        this.prevHitLocationLocalToTarget = vec3_create();

        this.pointerId = null;

        this.lastClientX = null;
        this.lastClientY = null;
        this.lastWidth = null;
        this.lastHeight = null;
    };

    Cursor.prototype.start = function start() {
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

        this.globalTarget = this.object.pp_addComponent(CursorTarget);

        this.transformQuat = quat2_create();
        this.rotationQuat = quat_create();
        this.transformMatrix = mat4_create();
        this.origin = vec3_create();
        this.cursorObjScale = vec3_create();
        this.direction = vec3_create();
        this.tempQuat = quat_create();
        this.setViewComponent(this.object.pp_getComponent(ViewComponent));
        this.isHovering = false;
        this.visible = true;
        this.isDown = false;
        this.lastIsDown = false;
        this.isUpWithNoDown = false;
        this.isRealDown = false;

        this.cursorPos = vec3_create();
        this.hoveringObject = null;

        XRUtils.registerSessionStartEventListener(this, this.setupVREvents.bind(this), this.engine);
        this.onDestroyCallbacks.push(() => {
            XRUtils.unregisterSessionStartEventListener(this, this.engine);
        });

        this.showRay = true;
        if (this.cursorRayObject) {
            this.cursorRayObject.pp_setActive(true);
            this.showRay = false;
            this.cursorRayOrigin = vec3_create();
            this.cursorRayScale = vec3_create();
            this.cursorRayScale.set(this.cursorRayObject.pp_getScaleLocal());

            /* Set ray to a good default distance of the cursor of 1m */
            this._setCursorRayTransform(null);
        }

        this._setCursorVisibility(false);
    };

    Cursor.prototype.onViewportResize = function onViewportResize() {
        if (!this.viewComponent) return;
        /* Projection matrix will change if the viewport is resized, which will affect the
         * projection matrix because of the aspect ratio. */
        this.viewComponent.projectionMatrix.mat4_invert(this.projectionMatrix);
    };

    Cursor.prototype._setCursorRayTransform = function _setCursorRayTransform(hitPosition) {
        if (!this.cursorRayObject) return;
        if (this.cursorRayScalingAxis != 4) {
            this.cursorRayObject.pp_resetScaleLocal();

            if (hitPosition != null) {
                this.cursorRayObject.pp_getPosition(this.cursorRayOrigin);
                let dist = this.cursorRayOrigin.vec3_distance(hitPosition);
                this.cursorRayScale[this.cursorRayScalingAxis] = dist;
                this.cursorRayObject.pp_scaleObject(this.cursorRayScale);
            }
        }
    };

    Cursor.prototype._setCursorVisibility = function _setCursorVisibility(visible) {
        this.visible = visible;
        if (!this.cursorObject) return;

        this.cursorObject.pp_setActive(visible);
    };

    Cursor.prototype.update = function update(dt) {
        if (this.doubleClickTimer > 0) {
            this.doubleClickTimer -= dt;
        }

        if (this.tripleClickTimer > 0) {
            this.tripleClickTimer -= dt;
        }

        this.doUpdate(false);
    };

    Cursor.prototype.doUpdate = function () {
        return function doUpdate(doClick) {
            /* If in VR, set the cursor ray based on object transform */
            if (this.session) {
                /* Since Google Cardboard tap is registered as arTouchDown without a gamepad, we need to check for gamepad presence */
                if (this.arTouchDown && this.input && XRUtils.getSession(this.engine).inputSources[0].handedness === "none" && XRUtils.getSession(this.engine).inputSources[0].gamepad) {
                    let p = XRUtils.getSession(this.engine).inputSources[0].gamepad.axes;
                    /* Screenspace Y is inverted */
                    this.direction.vec3_set(p[0], -p[1], -1.0);
                    this.updateDirection();
                } else {
                    this.object.pp_getPosition(this.origin);
                    this.object.pp_getForward(this.direction);
                }
                let rayHit = this.rayHit = (this.rayCastMode == 0) ?
                    this.engine.scene.rayCast(this.origin, this.direction, this.collisionMask) :
                    this.engine.physics.rayCast(this.origin, this.direction, this.collisionMask, this.maxDistance);

                if (rayHit.hitCount > 0) {
                    this.cursorPos.set(rayHit.locations[0]);
                } else {
                    this.cursorPos.fill(0);
                }

                this.hoverBehaviour(rayHit, doClick);
            } else {
                if (this.viewComponent != null && this.lastClientX != null) {
                    let rayHit = this.updateMousePos(this.lastClientX, this.lastClientY, this.lastWidth, this.lastHeight);
                    this.hoverBehaviour(rayHit, false);
                }
            }

            if (this.cursorObject) {
                if (this.hoveringObject && (this.cursorPos[0] != 0 || this.cursorPos[1] != 0 || this.cursorPos[2] != 0)) {
                    this._setCursorVisibility(true);
                    this.cursorObject.pp_setPosition(this.cursorPos);
                    this.cursorObject.pp_setTransformLocalQuat(this.cursorObject.pp_getTransformLocalQuat(this.transformQuat).quat2_normalize(this.transformQuat));
                    this._setCursorRayTransform(this.cursorPos);
                } else {
                    if (this.visible && this.cursorRayObject) {
                        this._setCursorRayTransform(null);
                    }

                    this._setCursorVisibility(false);
                }
            }

            if (this.cursorRayObject) {
                this.cursorRayObject.pp_setActive(true);
            }

            if (this.hoveringObject == null) {
                this.pointerId = null;
            }
        };
    }();

    Cursor.prototype.hoverBehaviour = function hoverBehaviour(rayHit, doClick, forceUnhover = false) {
        if (!forceUnhover && rayHit.hitCount > 0) {
            let hoveringObjectChanged = false;
            if (!this.hoveringObject || !this.hoveringObject.pp_equals(rayHit.objects[0])) {
                /* Unhover previous, if exists */
                if (this.hoveringObject) {
                    let cursorTarget = this.hoveringObject.pp_getComponent(CursorTarget);
                    if (cursorTarget) cursorTarget.onUnhover(this.hoveringObject, this);
                    this.globalTarget.onUnhover(this.hoveringObject, this);
                }

                hoveringObjectChanged = true;

                /* Hover new object */
                this.hoveringObject = rayHit.objects[0];
                if (this.styleCursor) document.body.style.cursor = "pointer";

                let cursorTarget = this.hoveringObject.pp_getComponent(CursorTarget);
                if (cursorTarget) {
                    cursorTarget.onHover(this.hoveringObject, this);
                }
                this.globalTarget.onHover(this.hoveringObject, this);

                if (!this._isDown() && this.isRealDown) {
                    this.isDown = false;
                    this.lastIsDown = false;
                    this.isUpWithNoDown = false;

                    if (cursorTarget) cursorTarget.onDownOnHover(this.hoveringObject, this);
                    this.globalTarget.onDownOnHover(this.hoveringObject, this);
                }
            }

            let cursorTarget = this.hoveringObject.pp_getComponent(CursorTarget);

            if (!hoveringObjectChanged && this._isMoving(rayHit.locations[0])) {
                if (cursorTarget) cursorTarget.onMove(this.hoveringObject, this);
                this.globalTarget.onMove(this.hoveringObject, this);
            }

            if (this._isDown()) {
                /* Cursor down */
                if (cursorTarget) cursorTarget.onDown(this.hoveringObject, this);
                this.globalTarget.onDown(this.hoveringObject, this);

                /* Click */
                if (this.tripleClickTimer > 0 && this.multipleClickObject && this.multipleClickObject.pp_equals(this.hoveringObject)) {
                    if (cursorTarget) cursorTarget.onTripleClick(this.hoveringObject, this);
                    this.globalTarget.onTripleClick(this.hoveringObject, this);

                    this.tripleClickTimer = 0;
                } else if (this.doubleClickTimer > 0 && this.multipleClickObject && this.multipleClickObject.pp_equals(this.hoveringObject)) {
                    if (cursorTarget) cursorTarget.onDoubleClick(this.hoveringObject, this);
                    this.globalTarget.onDoubleClick(this.hoveringObject, this);

                    this.tripleClickTimer = this.multipleClickDelay;
                    this.doubleClickTimer = 0;
                } else {
                    if (cursorTarget) cursorTarget.onClick(this.hoveringObject, this);
                    this.globalTarget.onClick(this.hoveringObject, this);

                    this.tripleClickTimer = 0;
                    this.doubleClickTimer = this.multipleClickDelay;
                    this.multipleClickObject = this.hoveringObject;
                }
            } else {
                /* Cursor up */
                if (!this.isUpWithNoDown && !hoveringObjectChanged && this._isUp()) {
                    if (cursorTarget) cursorTarget.onUp(this.hoveringObject, this);
                    this.globalTarget.onUp(this.hoveringObject, this);
                } else if (this.isUpWithNoDown || (hoveringObjectChanged && this._isUp())) {
                    if (cursorTarget) cursorTarget.onUpWithNoDown(this.hoveringObject, this);
                    this.globalTarget.onUpWithNoDown(this.hoveringObject, this);
                }
            }

            this.prevHitLocationLocalToTarget = this.hoveringObject.pp_convertPositionWorldToLocal(rayHit.locations[0], this.prevHitLocationLocalToTarget);
        } else if (this.hoveringObject && (forceUnhover || rayHit.hitCount == 0)) {
            let cursorTarget = this.hoveringObject.pp_getComponent(CursorTarget);
            if (cursorTarget) cursorTarget.onUnhover(this.hoveringObject, this);
            this.globalTarget.onUnhover(this.hoveringObject, this);

            this.hoveringObject = null;
            if (this.styleCursor) document.body.style.cursor = "default";
        }

        if (this.hoveringObject) {
            this.lastIsDown = this.isDown;
        } else {
            this.isDown = false;
            this.lastIsDown = false;
        }

        this.isUpWithNoDown = false;
    };

    Cursor.prototype.setupVREvents = function setupVREvents(s) {
        /* If in VR, one-time bind the listener */
        this.session = s;
        let onSessionEnd = function (e) {
            /* Reset cache once the session ends to rebind select etc, in case
             * it starts again */
            this.session = null;
        }.bind(this);
        s.addEventListener("end", onSessionEnd);

        let onSelect = this.onSelect.bind(this);
        s.addEventListener("select", onSelect);
        let onSelectStart = this.onSelectStart.bind(this);
        s.addEventListener("selectstart", onSelectStart);
        let onSelectEnd = this.onSelectEnd.bind(this);
        s.addEventListener("selectend", onSelectEnd);

        this.onDestroyCallbacks.push(() => {
            if (!this.session) return;
            s.removeEventListener("end", onSessionEnd);
            s.removeEventListener("select", onSelect);
            s.removeEventListener("selectstart", onSelectStart);
            s.removeEventListener("selectend", onSelectEnd);
        });

        /* After AR session was entered, the projection matrix changed */
        this.onViewportResize();
    };

    Cursor.prototype.onSelect = function onSelect(e) {
    };

    Cursor.prototype.onSelectStart = function onSelectStart(e) {
        if (this.active) {
            this.arTouchDown = true;
            if (e.inputSource.handedness == this.handedness) {
                this.isDown = true;
            }
        }

        if (e.inputSource.handedness == this.handedness) {
            this.isRealDown = true;
        }
    };

    Cursor.prototype.onSelectEnd = function onSelectEnd(e) {
        if (this.active) {
            this.arTouchDown = false;
            if (e.inputSource.handedness == this.handedness) {
                if (!this.isDown) {
                    this.isUpWithNoDown = true;
                }
                this.isDown = false;
            }
        }

        if (e.inputSource.handedness == this.handedness) {
            this.isRealDown = false;
        }
    };

    Cursor.prototype.onPointerMove = function onPointerMove(e) {
        if (this.active) {
            /* Don't care about secondary pointers */
            if (this.pointerId != null && this.pointerId != e.pointerId) return;

            let bounds = document.body.getBoundingClientRect();
            let rayHit = this.updateMousePos(e.clientX, e.clientY, bounds.width, bounds.height);

            this.hoverBehaviour(rayHit, false);

            if (this.hoveringObject != null) {
                this.pointerId = e.pointerId;
            } else {
                this.pointerId = null;
            }
        }
    };

    Cursor.prototype.onClick = function onClick(e) {
    };

    Cursor.prototype.onPointerDown = function onPointerDown(e) {
        /* Don't care about secondary pointers or non-left clicks */
        if ((this.pointerId != null && this.pointerId != e.pointerId) || e.button !== 0) return;

        if (this.active) {
            let bounds = document.body.getBoundingClientRect();
            let rayHit = this.updateMousePos(e.clientX, e.clientY, bounds.width, bounds.height);

            this.isDown = true;
            this.isRealDown = true;

            this.hoverBehaviour(rayHit, false);

            if (this.hoveringObject != null) {
                this.pointerId = e.pointerId;
            } else {
                this.pointerId = null;
            }
        } else {
            this.isRealDown = true;
        }
    };

    Cursor.prototype.onPointerUp = function onPointerUp(e) {
        /* Don't care about secondary pointers or non-left clicks */
        if ((this.pointerId != null && this.pointerId != e.pointerId) || e.button !== 0) return;

        if (this.active) {
            let bounds = document.body.getBoundingClientRect();
            let rayHit = this.updateMousePos(e.clientX, e.clientY, bounds.width, bounds.height);

            if (!this.isDown) {
                this.isUpWithNoDown = true;
            }

            this.isDown = false;
            this.isRealDown = false;

            this.hoverBehaviour(rayHit, false);

            if (this.hoveringObject != null) {
                this.pointerId = e.pointerId;
            } else {
                this.pointerId = null;
            }
        } else {
            this.isRealDown = false;
        }
    };

    Cursor.prototype.updateMousePos = function updateMousePos(clientX, clientY, w, h) {
        this.lastClientX = clientX;
        this.lastClientY = clientY;
        this.lastWidth = w;
        this.lastHeight = h;

        /* Get direction in normalized device coordinate space from mouse position */
        let left = clientX / w;
        let top = clientY / h;
        this.direction.vec3_set(left * 2 - 1, -top * 2 + 1, -1.0);
        return this.updateDirection();
    };

    Cursor.prototype.updateDirection = function () {
        let transformWorld = quat2_create();
        return function updateDirection() {
            this.object.pp_getPosition(this.origin);

            /* Reverse-project the direction into view space */
            this.direction.vec3_transformMat4(this.projectionMatrix, this.direction);
            this.direction.vec3_normalize(this.direction);
            this.direction.vec3_transformQuat(this.object.pp_getTransformQuat(transformWorld), this.direction);
            let rayHit = this.rayHit = (this.rayCastMode == 0) ?
                this.engine.scene.rayCast(this.origin, this.direction, this.collisionMask) :
                this.engine.physics.rayCast(this.origin, this.direction, this.collisionMask, this.maxDistance);

            if (rayHit.hitCount > 0) {
                this.cursorPos.set(rayHit.locations[0]);
            } else {
                this.cursorPos.fill(0);
            }

            return rayHit;
        };
    }();

    Cursor.prototype.onDeactivate = function onDeactivate() {
        if (this.hoveringObject) {
            let cursorTarget = this.hoveringObject.pp_getComponent(CursorTarget);
            if (cursorTarget) cursorTarget.onUnhover(this.hoveringObject, this);
            this.globalTarget.onUnhover(this.hoveringObject, this);
        }

        this.hoveringObject = null;
        if (this.styleCursor) document.body.style.cursor = "default";

        this.isDown = false;
        this.lastIsDown = false;
        this.isUpWithNoDown = false;

        this._setCursorVisibility(false);
        if (this.cursorRayObject) {
            this.cursorRayObject.pp_setActive(false);
        }

        this.pointerId = null;

        this.lastClientX = null;
        this.lastClientY = null;
        this.lastWidth = null;
        this.lastHeight = null;
    };

    Cursor.prototype.onActivate = function onActivate() {
        this.showRay = true;

        this.isDown = false;
        this.lastIsDown = false;
        this.isUpWithNoDown = false;
    };

    Cursor.prototype.onDestroy = function onDestroy() {
        for (let f of this.onDestroyCallbacks) f();
    };

    // New Functions 

    Cursor.prototype.setViewComponent = function setViewComponent(viewComponent) {
        this.viewComponent = viewComponent;
        /* If this object also has a view component, we will enable inverse-projected mouse clicks,
         * otherwise just use the objects transformation */
        if (this.viewComponent != null) {
            let onClick = this.onClick.bind(this);
            this.engine.canvas.addEventListener("click", onClick);
            let onPointerDown = this.onPointerDown.bind(this);
            this.engine.canvas.addEventListener("pointerdown", onPointerDown);
            let onPointerMove = this.onPointerMove.bind(this);
            this.engine.canvas.addEventListener("pointermove", onPointerMove);
            let onPointerUp = this.onPointerUp.bind(this);
            this.engine.canvas.addEventListener("pointerup", onPointerUp);
            let onPointerLeave = this.onPointerLeave.bind(this);
            this.engine.canvas.addEventListener("pointerleave", onPointerLeave);

            this.projectionMatrix = mat4_create();
            this.viewComponent.projectionMatrix.mat4_invert(this.projectionMatrix);
            let onViewportResize = this.onViewportResize.bind(this);
            window.addEventListener("resize", onViewportResize);

            this.onDestroyCallbacks.push(() => {
                this.engine.canvas.removeEventListener("click", onClick);
                this.engine.canvas.removeEventListener("pointerdown", onPointerDown);
                this.engine.canvas.removeEventListener("pointermove", onPointerMove);
                this.engine.canvas.removeEventListener("pointerup", onPointerUp);
                this.engine.canvas.removeEventListener("pointerleave", onPointerLeave);
                window.removeEventListener("resize", onViewportResize);
            });
        }
    };

    Cursor.prototype.onPointerLeave = function onPointerLeave(e) {
        if (this.pointerId == null || this.pointerId == e.pointerId) {
            if (this.active) {
                this.hoverBehaviour(null, false, true); // Trigger unhover
            }

            this.pointerId = null;

            this.lastClientX = null;
            this.lastClientY = null;
            this.lastWidth = null;
            this.lastHeight = null;
        }
    };

    Cursor.prototype._isDown = function _isDown() {
        return this.isDown !== this.lastIsDown && this.isDown;
    };

    Cursor.prototype._isUp = function _isUp() {
        return this.isDown !== this.lastIsDown && !this.isDown;
    };

    Cursor.prototype._isMoving = function () {
        let hitLocationLocalToTarget = vec3_create();
        return function _isMoving(hitLocation) {
            let isMoving = false;

            hitLocationLocalToTarget = this.hoveringObject.pp_convertPositionWorldToLocal(hitLocation, hitLocationLocalToTarget);

            if (!hitLocationLocalToTarget.vec_equals(this.prevHitLocationLocalToTarget, 0.0001)) {
                isMoving = true;
            }

            return isMoving;
        };
    }();



    Object.defineProperty(Cursor.prototype, "setViewComponent", { enumerable: false });
    Object.defineProperty(Cursor.prototype, "onPointerLeave", { enumerable: false });
    Object.defineProperty(Cursor.prototype, "_isDown", { enumerable: false });
    Object.defineProperty(Cursor.prototype, "_isMoving", { enumerable: false });
    Object.defineProperty(Cursor.prototype, "_isUp", { enumerable: false });
}