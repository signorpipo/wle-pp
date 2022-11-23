import { vec3, mat4 } from 'gl-matrix';

if (_WL && _WL._componentTypes && _WL._componentTypes[_WL._componentTypeIndices["cursor"]]) {

    // Modified Functions

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.init = function () {
        /* VR session cache, in case in VR */
        this.session = null;
        this.collisionMask = (1 << this.collisionGroup);
        this.maxDistance = 100;

        this.doubleClickTimer = 0;
        this.tripleClickTimer = 0;
        this.multipleClickObject = null;
        this.multipleClickDelay = 0.3;

        this.visible = false;

        const sceneLoaded = this.onDestroy.bind(this);
        WL.onSceneLoaded.push(sceneLoaded);
        this.onDestroyCallbacks = [() => {
            const index = WL.onSceneLoaded.indexOf(sceneLoaded);
            if (index >= 0) WL.onSceneLoaded.splice(index, 1);
        }];

        this.prevHitLocationLocalToTarget = [0, 0, 0];
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.start = function () {
        if (this.handedness == 0) {
            const inputComp = this.object.getComponent('input');
            if (!inputComp) {
                console.warn('cursor component on object', this.object.name,
                    'was configured with handedness "input component", ' +
                    'but object has no input component.');
            } else {
                this.handedness = inputComp.handedness;
                this.input = inputComp;
            }
        } else {
            this.handedness = ['left', 'right'][this.handedness - 1];
        }

        this.globalTarget = this.object.addComponent('cursor-target');

        this.origin = new Float32Array(3);
        this.cursorObjScale = new Float32Array(3);
        this.direction = [0, 0, 0];
        this.tempQuat = new Float32Array(4);
        this.setViewComponent(this.object.getComponent("view"));
        this.isHovering = false;
        this.visible = true;
        this.isDown = false;
        this.lastIsDown = false;
        this.isUpWithNoDown = false;
        this.isRealDown = false;

        this.cursorPos = new Float32Array(3);
        this.hoveringObject = null;

        const onXRSessionStart = this.setupVREvents.bind(this);
        WL.onXRSessionStart.push(onXRSessionStart);

        this.onDestroyCallbacks.push(() => {
            const index = WL.onXRSessionStart.indexOf(onXRSessionStart);
            if (index >= 0) WL.onXRSessionStart.splice(index, 1);
        });

        this.showRay = true;
        if (this.cursorRayObject) {
            this.cursorRayObject.pp_setActive(true);
            this.showRay = false;
            this.cursorRayOrigin = new Float32Array(3);
            this.cursorRayScale = new Float32Array(3);
            this.cursorRayScale.set(this.cursorRayObject.scalingLocal);

            /* Set ray to a good default distance of the cursor of 1m */
            this._setCursorRayTransform(null);
        }

        this._setCursorVisibility(false);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.setViewComponent = function (viewComponent) {
        this.viewComponent = viewComponent;
        /* If this object also has a view component, we will enable inverse-projected mouse clicks,
         * otherwise just use the objects transformation */
        if (this.viewComponent != null) {
            const onClick = this.onClick.bind(this);
            WL.canvas.addEventListener("click", onClick);
            const onPointerMove = this.onPointerMove.bind(this);
            WL.canvas.addEventListener("pointermove", onPointerMove);
            const onPointerDown = this.onPointerDown.bind(this);
            WL.canvas.addEventListener("pointerdown", onPointerDown);
            const onPointerUp = this.onPointerUp.bind(this);
            WL.canvas.addEventListener("pointerup", onPointerUp);

            this.projectionMatrix = new Float32Array(16);
            mat4.invert(this.projectionMatrix, this.viewComponent.projectionMatrix);
            const onViewportResize = this.onViewportResize.bind(this);
            window.addEventListener("resize", onViewportResize);

            this.onDestroyCallbacks.push(() => {
                WL.canvas.removeEventListener("click", onClick);
                WL.canvas.removeEventListener("pointermove", onPointerMove);
                WL.canvas.removeEventListener("pointerdown", onPointerDown);
                WL.canvas.removeEventListener("pointerup", onPointerUp);
                window.removeEventListener("resize", onViewportResize);
            });
        }
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.onViewportResize = function () {
        if (!this.viewComponent) return;
        /* Projection matrix will change if the viewport is resized, which will affect the
         * projection matrix because of the aspect ratio. */
        mat4.invert(this.projectionMatrix, this.viewComponent.projectionMatrix);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype._setCursorRayTransform = function (hitPosition) {
        if (!this.cursorRayObject) return;
        if (this.cursorRayScalingAxis != 4) {
            this.cursorRayObject.resetScaling();

            if (hitPosition != null) {
                this.cursorRayObject.getTranslationWorld(this.cursorRayOrigin);
                let dist = vec3.dist(this.cursorRayOrigin, hitPosition);
                this.cursorRayScale[this.cursorRayScalingAxis] = dist;
                this.cursorRayObject.scale(this.cursorRayScale);
            }
        }
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype._setCursorVisibility = function (visible) {
        this.visible = visible;
        if (!this.cursorObject) return;

        this.cursorObject.pp_setActive(visible);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.update = function (dt) {
        if (this.doubleClickTimer > 0) {
            this.doubleClickTimer -= dt;
        }

        if (this.tripleClickTimer > 0) {
            this.tripleClickTimer -= dt;
        }

        this.doUpdate(false);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.doUpdate = function (doClick) {
        /* If in VR, set the cursor ray based on object transform */
        if (this.session) {
            /* Since Google Cardboard tap is registered as arTouchDown without a gamepad, we need to check for gamepad presence */
            if (this.arTouchDown && this.input && WL.xrSession.inputSources[0].handedness === 'none' && WL.xrSession.inputSources[0].gamepad) {
                const p = WL.xrSession.inputSources[0].gamepad.axes;
                /* Screenspace Y is inverted */
                this.direction.vec3_set(p[0], -p[1], -1.0);
                this.updateDirection();
            } else {
                this.object.getTranslationWorld(this.origin);
                this.object.getForward(this.direction);
            }
            const rayHit = this.rayHit = (this.rayCastMode == 0) ?
                WL.scene.rayCast(this.origin, this.direction, this.collisionMask) :
                WL.physics.rayCast(this.origin, this.direction, this.collisionMask, this.maxDistance);

            if (rayHit.hitCount > 0) {
                this.cursorPos.set(rayHit.locations[0]);
            } else {
                this.cursorPos.fill(0);
            }

            this.hoverBehaviour(rayHit, doClick);
        } else {
            if (this.viewComponent != null && this._isPPMouseValid()) {
                PP.myMouse.getPositionScreenNormalized(this.direction);
                this.direction[2] = -1;

                const rayHit = this.updateDirection();
                this.hoverBehaviour(rayHit, false);
            }
        }

        if (this.cursorObject) {
            if (this.hoveringObject && (this.cursorPos[0] != 0 || this.cursorPos[1] != 0 || this.cursorPos[2] != 0)) {
                this._setCursorVisibility(true);
                this.cursorObject.setTranslationWorld(this.cursorPos);
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
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.hoverBehaviour = function (rayHit, doClick) {
        if (rayHit.hitCount > 0) {
            let hoveringObjectChanged = false;
            if (!this.hoveringObject || !this.hoveringObject.equals(rayHit.objects[0])) {
                /* Unhover previous, if exists */
                if (this.hoveringObject) {
                    let cursorTarget = this.hoveringObject.getComponent("cursor-target");
                    if (cursorTarget) cursorTarget.onUnhover(this.hoveringObject, this);
                    this.globalTarget.onUnhover(this.hoveringObject, this);
                }

                hoveringObjectChanged = true;

                /* Hover new object */
                this.hoveringObject = rayHit.objects[0];
                if (this.styleCursor) WL.canvas.style.cursor = "pointer";

                let cursorTarget = this.hoveringObject.getComponent("cursor-target");
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

            let cursorTarget = this.hoveringObject.getComponent("cursor-target");

            if (!hoveringObjectChanged && this._isMoving(rayHit.locations[0])) {
                if (cursorTarget) cursorTarget.onMove(this.hoveringObject, this);
                this.globalTarget.onMove(this.hoveringObject, this);
            }

            if (this._isDown()) {
                /* Cursor down */
                if (cursorTarget) cursorTarget.onDown(this.hoveringObject, this);
                this.globalTarget.onDown(this.hoveringObject, this);

                /* Click */
                if (this.tripleClickTimer > 0 && this.multipleClickObject && this.multipleClickObject.equals(this.hoveringObject)) {
                    if (cursorTarget) cursorTarget.onTripleClick(this.hoveringObject, this);
                    this.globalTarget.onTripleClick(this.hoveringObject, this);

                    this.tripleClickTimer = 0;
                } else if (this.doubleClickTimer > 0 && this.multipleClickObject && this.multipleClickObject.equals(this.hoveringObject)) {
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
        } else if (this.hoveringObject && rayHit.hitCount == 0) {
            let cursorTarget = this.hoveringObject.getComponent("cursor-target");
            if (cursorTarget) cursorTarget.onUnhover(this.hoveringObject, this);
            this.globalTarget.onUnhover(this.hoveringObject, this);

            this.hoveringObject = null;
            if (this.styleCursor) WL.canvas.style.cursor = "default";
        }

        if (this.hoveringObject) {
            this.lastIsDown = this.isDown;
        } else {
            this.isDown = false;
            this.lastIsDown = false;
        }

        this.isUpWithNoDown = false;
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.setupVREvents = function (s) {
        /* If in VR, one-time bind the listener */
        this.session = s;
        const onSessionEnd = function (e) {
            /* Reset cache once the session ends to rebind select etc, in case
             * it starts again */
            this.session = null;
        }.bind(this);
        s.addEventListener('end', onSessionEnd);

        const onSelect = this.onSelect.bind(this);
        s.addEventListener('select', onSelect);
        const onSelectStart = this.onSelectStart.bind(this);
        s.addEventListener('selectstart', onSelectStart);
        const onSelectEnd = this.onSelectEnd.bind(this);
        s.addEventListener('selectend', onSelectEnd);

        this.onDestroyCallbacks.push(() => {
            if (!this.session) return;
            s.removeEventListener('end', onSessionEnd);
            s.removeEventListener('select', onSelect);
            s.removeEventListener('selectstart', onSelectStart);
            s.removeEventListener('selectend', onSelectEnd);
        });

        /* After AR session was entered, the projection matrix changed */
        this.onViewportResize();
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.onSelect = function (e) {
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.onSelectStart = function (e) {
        if (this.active) {
            this.arTouchDown = true;
            if (e.inputSource.handedness == this.handedness) {
                this.isDown = true;
            }
        }
        this.isRealDown = true;
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.onSelectEnd = function (e) {
        if (this.active) {
            this.arTouchDown = false;
            if (e.inputSource.handedness == this.handedness) {
                if (!this.isDown) {
                    this.isUpWithNoDown = true;
                }
                this.isDown = false;
            }
        }
        this.isRealDown = false;
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.onPointerMove = function (e) {
        /* Don't care about secondary pointers */
        if (!e.isPrimary) return;

        if (this._isPPMouseValid()) {
            PP.myMouse.getPositionScreenNormalized(this.direction);
            this.direction[2] = -1;

            const rayHit = this.updateDirection();
            this.hoverBehaviour(rayHit, false);
        } else {
            const bounds = e.target.getBoundingClientRect();
            const rayHit = this.updateMousePos(e.clientX, e.clientY, bounds.width, bounds.height);

            this.hoverBehaviour(rayHit, false);
        }
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.onClick = function (e) {
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.onPointerDown = function (e) {
        if (this.active) {
            /* Don't care about secondary pointers or non-left clicks */
            if (!e.isPrimary || e.button !== 0) return;

            let rayHit = null;
            if (this._isPPMouseValid()) {
                PP.myMouse.getPositionScreenNormalized(this.direction);
                this.direction[2] = -1;

                rayHit = this.updateDirection();
            } else {
                const bounds = e.target.getBoundingClientRect();
                rayHit = this.updateMousePos(e.clientX, e.clientY, bounds.width, bounds.height);

                this.hoverBehaviour(rayHit, false); // simulate a move before the click, to clean previous hover/unhover
            }

            this.isDown = true;
            this.isRealDown = true;

            this.hoverBehaviour(rayHit, false);
        } else {
            this.isRealDown = true;
        }
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.onPointerUp = function (e) {
        if (this.active) {
            /* Don't care about secondary pointers or non-left clicks */
            if (!e.isPrimary || e.button !== 0) return;

            let rayHit = null;
            if (this._isPPMouseValid()) {
                PP.myMouse.getPositionScreenNormalized(this.direction);
                this.direction[2] = -1;

                rayHit = this.updateDirection();
            } else {
                const bounds = e.target.getBoundingClientRect();
                rayHit = this.updateMousePos(e.clientX, e.clientY, bounds.width, bounds.height);

                this.hoverBehaviour(rayHit, false); // simulate a move before the click, to clean previous hover/unhover
            }

            if (!this.isDown) {
                this.isUpWithNoDown = true;
            }

            this.isDown = false;
            this.isRealDown = false;

            this.hoverBehaviour(rayHit, false);
        } else {
            this.isRealDown = false;
        }
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.updateMousePos = function (clientX, clientY, w, h) {
        /* Get direction in normalized device coordinate space from mouse position */
        const left = clientX / w;
        const top = clientY / h;
        this.direction.vec3_set(left * 2 - 1, -top * 2 + 1, -1.0);
        return this.updateDirection();
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.updateDirection = function () {
        this.object.getTranslationWorld(this.origin);

        /* Reverse-project the direction into view space */
        vec3.transformMat4(this.direction, this.direction, this.projectionMatrix);
        vec3.normalize(this.direction, this.direction);
        vec3.transformQuat(this.direction, this.direction, this.object.transformWorld);
        const rayHit = this.rayHit = (this.rayCastMode == 0) ?
            WL.scene.rayCast(this.origin, this.direction, this.collisionMask) :
            WL.physics.rayCast(this.origin, this.direction, this.collisionMask, this.maxDistance);

        if (rayHit.hitCount > 0) {
            this.cursorPos.set(rayHit.locations[0]);
        } else {
            this.cursorPos.fill(0);
        }

        return rayHit;
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.onDeactivate = function () {
        if (this.hoveringObject) {
            const cursorTarget = this.hoveringObject.getComponent('cursor-target');
            if (cursorTarget) cursorTarget.onUnhover(this.hoveringObject, this);
            this.globalTarget.onUnhover(this.hoveringObject, this);
        }

        this.hoveringObject = null;
        if (this.styleCursor) WL.canvas.style.cursor = "default";

        this.isDown = false;
        this.lastIsDown = false;
        this.isUpWithNoDown = false;

        this._setCursorVisibility(false);
        if (this.cursorRayObject) {
            this.cursorRayObject.pp_setActive(false);
        }
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.onActivate = function () {
        this.showRay = true;

        this.isDown = false;
        this.lastIsDown = false;
        this.isUpWithNoDown = false;
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype.onDestroy = function () {
        for (const f of this.onDestroyCallbacks) f();
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype._isPPMouseValid = function () {
        return PP != null && PP.myMouse != null && PP.myMouse.isValid() && PP.myMouse.isInsideView();
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype._isDown = function () {
        return this.isDown !== this.lastIsDown && this.isDown;
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype._isUp = function () {
        return this.isDown !== this.lastIsDown && !this.isDown;
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor"]].prototype._isMoving = function () {
        let hitLocationLocalToTarget = [0, 0, 0];
        return function _isMoving(hitLocation) {
            let isMoving = false;

            hitLocationLocalToTarget = this.hoveringObject.pp_convertPositionWorldToLocal(hitLocation, hitLocationLocalToTarget);

            if (!hitLocationLocalToTarget.vec_equals(this.prevHitLocationLocalToTarget, 0.0001)) {
                isMoving = true;
            }

            return isMoving;
        };
    }();

} else {
    console.error("Wonderland Engine \"cursor\" component not found.\n Add the component to your project to avoid any issue with the PP bundle.");
}