PP.MouseButtonID = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
};

PP.Mouse = class Mouse {
    constructor() {
        // #TODO refactor Mouse/Keyboard/Gamepad and create a sort of parent ButtonHandler that have the base ButtonInfo and all of them inherit

        this._myButtonInfos = new Map();
        for (let key in PP.MouseButtonID) {
            this._myButtonInfos.set(PP.MouseButtonID[key], this._createButtonInfo());
        }

        this._myPreventContextMenuCallback = this._preventContextMenu.bind(this);
        this._myPreventMiddleButtonScrollCallback = this._preventMiddleButtonScroll.bind(this);

        this._myInternalMousePosition = PP.vec2_create();
        this._myScreenSize = PP.vec2_create();
        this._updateScreenSize();

        this._myResetMovingDelay = 0.15;
        this._myResetMovingTimer = new PP.Timer(this._myResetMovingDelay, false);
        this._myIsMoving = false;

        this._myIsInsideView = false;
        this._myIsValid = false;

        this._myPointerUpOnPointerLeave = true;

        this._myContextMenuActive = true;
        this._myMiddleButtonScrollActive = true;

        this._myPointerID = null;
        this._myLastValidPointerEvent = null;

        this._myPointerEventValidCallbacks = new Map();      // Signature: callback(event)

        // Support Variables
        this._myProjectionMatrixInverse = PP.mat4_create();
        this._myRotationQuat = PP.quat_create();
        this._myOriginWorld = PP.vec3_create();
        this._myDirectionWorld = PP.vec3_create();
    }

    start() {
        this._myOnPointerMoveCallback = this._onPointerAction.bind(this, this._onPointerMove.bind(this));
        document.body.addEventListener("pointermove", this._myOnPointerMoveCallback);
        this._myOnPointerDownCallback = this._onPointerAction.bind(this, this._onPointerDown.bind(this));
        document.body.addEventListener("pointerdown", this._myOnPointerDownCallback);
        this._myOnPointerUpCallback = this._onPointerAction.bind(this, this._onPointerUp.bind(this));
        document.body.addEventListener("pointerup", this._myOnPointerUpCallback);
        this._myOnPointerLeaveCallback = this._onPointerLeave.bind(this);
        document.body.addEventListener("pointerleave", this._myOnPointerLeaveCallback);
        this._myOnPointerEnterCallback = this._onPointerEnter.bind(this);
        document.body.addEventListener("pointerenter", this._myOnPointerEnterCallback);

        // these are needed to being able to detect for example left and right click together, pointer only allow one down at a time
        this._myOnMouseDownCallback = this._onMouseAction.bind(this, this._onPointerDown.bind(this));
        document.body.addEventListener("mousedown", this._myOnMouseDownCallback);
        this._myOnMouseUpCallback = this._onMouseAction.bind(this, this._onPointerUp.bind(this));
        document.body.addEventListener("mouseup", this._myOnMouseUpCallback);
    }

    update(dt) {
        if (this._myResetMovingTimer.isRunning()) {
            this._myResetMovingTimer.update(dt);
            if (this._myResetMovingTimer.isDone()) {
                this._myResetMovingTimer.reset();
                this._myIsMoving = false;
            }
        }

        for (let buttonInfo of this._myButtonInfos.values()) {
            buttonInfo.myIsPressStart = buttonInfo.myIsPressStartToProcess;
            buttonInfo.myIsPressEnd = buttonInfo.myIsPressEndToProcess;
            buttonInfo.myIsPressStartToProcess = false;
            buttonInfo.myIsPressEndToProcess = false;
        }

        this._updateScreenSize();

        if (!this.isAnyButtonPressed() && !this._myIsMoving) {
            this._myPointerID = null;
        }

        if (this._myLastValidPointerEvent != null) {
            let isLastValidPointerEventStillValid = this._isPointerEventValid(this._myLastValidPointerEvent);
            if (!isLastValidPointerEventStillValid) {
                if (this._myIsInsideView) {
                    this._onPointerLeave(this._myLastValidPointerEvent);
                }

                this._myLastValidPointerEvent = null;
            }
        }
    }

    destroy() {
        document.body.removeEventListener("pointermove", this._myOnPointerMoveCallback);
        document.body.removeEventListener("pointerdown", this._myOnPointerDownCallback);
        document.body.removeEventListener("pointerup", this._myOnPointerUpCallback);
        document.body.removeEventListener("pointerleave", this._myOnPointerLeaveCallback);
        document.body.removeEventListener("pointerenter", this._myOnPointerEnterCallback);

        document.body.removeEventListener("mousedown", this._myOnMouseDownCallback);
        document.body.removeEventListener("mouseup", this._myOnMouseUpCallback);

        document.body.removeEventListener("contextmenu", this._myPreventContextMenuCallback);
        document.body.removeEventListener("mousedown", this._myPreventMiddleButtonScrollCallback);
    }

    isValid() {
        return this._myIsValid;
    }

    isButtonPressed(buttonID) {
        let isPressed = false;

        if (this._myButtonInfos.has(buttonID)) {
            isPressed = this._myButtonInfos.get(buttonID).myIsPressed;
        }

        return isPressed;
    }

    isAnyButtonPressed() {
        let isPressed = false;

        for (let buttonInfo of this._myButtonInfos.values()) {
            if (buttonInfo.myIsPressed) {
                isPressed = true;
                break;
            }
        }

        return isPressed;
    }

    isButtonPressStart(buttonID) {
        let isPressStart = false;

        if (this._myButtonInfos.has(buttonID)) {
            isPressStart = this._myButtonInfos.get(buttonID).myIsPressStart;
        }

        return isPressStart;
    }

    isButtonPressEnd(buttonID = null) {
        let isPressEnd = false;

        if (this._myButtonInfos.has(buttonID)) {
            isPressEnd = this._myButtonInfos.get(buttonID).myIsPressEnd;
        }

        return isPressEnd;
    }

    isMoving() {
        return this._myIsMoving;
    }

    isInsideView() {
        return this._myIsInsideView;
    }

    isTargetingRenderCanvas() {
        return this.isInsideView() && this._myLastValidPointerEvent != null && this._myLastValidPointerEvent.target == WL.canvas;
    }

    // the origin and direction are set by the mouse
    raycastWorld(raycastSetup, raycastResults = new PP.RaycastResults()) {
        this.getOriginWorld(raycastSetup.myOrigin);
        this.getDirectionWorld(raycastSetup.myDirection);
        raycastResults = PP.PhysicsUtils.raycast(raycastSetup, raycastResults);
        return raycastResults;
    }

    getPositionScreen(out = PP.vec2_create()) {
        let mousePosition = out;
        mousePosition[0] = this._myInternalMousePosition[0];
        mousePosition[1] = this._myScreenSize[1] - 1 - this._myInternalMousePosition[1];
        return mousePosition;
    }

    getPositionScreenNormalized(out = PP.vec2_create()) {
        let mousePosition = out;
        mousePosition[0] = (this._myScreenSize[0] == 0) ? 0 : ((this._myInternalMousePosition[0] / this._myScreenSize[0]) * 2 - 1);
        mousePosition[1] = (this._myScreenSize[1] == 0) ? 0 : (((this._myScreenSize[1] - 1 - this._myInternalMousePosition[1]) / this._myScreenSize[1]) * 2 - 1);
        return mousePosition;
    }

    getScreenSize() {
        return this._myScreenSize;
    }

    getPositionWorld(distanceFromCamera, out = PP.vec3_create()) {
        let originWorld = this.getOriginWorld(this._myOriginWorld);
        let directionWorld = this.getDirectionWorld(this._myDirectionWorld);

        out = originWorld.vec3_add(directionWorld.vec3_scale(distanceFromCamera, out), out);
        return out;
    }

    getOriginWorld(out = PP.vec3_create()) {
        if (PP.XRUtils.isSessionActive()) {
            PP.myPlayerObjects.myEyeLeft.pp_getPosition(out); // in theory mouse should not be used inside the session, but may make sense for AR which uses eye left
        } else {
            PP.myPlayerObjects.myNonVRCamera.pp_getPosition(out);
        }

        return out;
    }

    getDirectionWorld(out = PP.vec3_create()) {
        let right = this._myInternalMousePosition[0] / this._myScreenSize[0];
        let up = this._myInternalMousePosition[1] / this._myScreenSize[1];

        let directionLocal = out;
        directionLocal.vec3_set(right * 2 - 1, -up * 2 + 1, -1.0);

        let projectionMatrixInvert = this._myProjectionMatrixInverse;
        if (PP.XRUtils.isSessionActive()) {
            projectionMatrixInvert = PP.myPlayerObjects.myEyeLeft.pp_getComponentHierarchy("view").projectionMatrix.mat4_invert(projectionMatrixInvert);
        } else {
            projectionMatrixInvert = PP.myPlayerObjects.myNonVRCamera.pp_getComponentHierarchy("view").projectionMatrix.mat4_invert(projectionMatrixInvert);
        }

        directionLocal.vec3_transformMat4(projectionMatrixInvert, directionLocal);
        directionLocal.vec3_normalize(directionLocal);

        let directionWorld = directionLocal;
        if (PP.XRUtils.isSessionActive()) {
            directionWorld = directionLocal.vec3_transformQuat(PP.myPlayerObjects.myEyeLeft.pp_getRotationQuat(this._myRotationQuat), directionLocal);
        } else {
            directionWorld = directionLocal.vec3_transformQuat(PP.myPlayerObjects.myNonVRCamera.pp_getRotationQuat(this._myRotationQuat), directionLocal);
        }

        directionWorld.vec3_normalize(directionWorld);

        return out;
    }

    setTouchValid(touchValid) {
        let callbackID = "internal_touch_valid_callback";
        if (touchValid) {
            this.removePointerEventValidCallback(callbackID);
        } else {
            this.addPointerEventValidCallback(callbackID, function (event) {
                return event.pointerType == "mouse";
            });
        }
    }

    setTargetOnlyRenderCanvas(targetOnlyRenderCanvas) {
        let callbackID = "internal_target_only_render_canvas_callback";
        if (targetOnlyRenderCanvas) {
            this.addPointerEventValidCallback(callbackID, function (event) {
                return event.target == WL.canvas;
            });
        } else {
            this.removePointerEventValidCallback(callbackID);
        }
    }

    getLastValidPointerEvent() {
        return this._myLastValidPointerEvent;
    }

    // can be used to specify that only some pointerType are valid (eg: mouse, touch, pen) or just some target (eg: WL.canvas)
    addPointerEventValidCallback(id, callback) {
        this._myPointerEventValidCallbacks.set(id, callback);
    }

    removePointerEventValidCallback(id) {
        this._myPointerEventValidCallbacks.delete(id);
    }

    isPointerUpOnPointerLeave() {
        return this._myPointerUpOnPointerLeave;
    }

    setPointerUpOnPointerLeave(pointerUpOnPointerLeave) {
        this._myPointerUpOnPointerLeave = pointerUpOnPointerLeave;
    }

    isContextMenuActive() {
        return this._myContextMenuActive;
    }

    setContextMenuActive(active) {
        if (this._myContextMenuActive != active) {
            if (active) {
                document.body.removeEventListener("contextmenu", this._myPreventContextMenuCallback);
            } else {
                document.body.addEventListener("contextmenu", this._myPreventContextMenuCallback, false);
            }
            this._myContextMenuActive = active;
        }
    }

    isMiddleButtonScrollActive() {
        return this._myMiddleButtonScrollActive;
    }

    setMiddleButtonScrollActive(active) {
        if (this._myMiddleButtonScrollActive != active) {
            if (active) {
                document.body.removeEventListener("mousedown", this._myPreventMiddleButtonScrollCallback);
            } else {
                document.body.addEventListener("mousedown", this._myPreventMiddleButtonScrollCallback, false);
            }
            this._myMiddleButtonScrollActive = active;
        }
    }

    setResetMovingDelay(delay) {
        this._myResetMovingDelay = delay;
    }

    getResetMovingDelay() {
        return this._myResetMovingDelay;
    }

    _onPointerAction(actionCallback, event) {
        if (!this._isPointerEventIDValid(event)) return;

        if (!this._isPointerEventValid(event)) {
            if (this._myIsInsideView) {
                this._onPointerLeave(event);
            }
            return;
        }

        if (!this._myIsInsideView) {
            this._onPointerEnter(event);
        }

        actionCallback(event);

        this._updatePositionAndScreen(event);
        this._updatePointerData(event);
    }

    _onMouseAction(actionCallback, event) {
        if (!this._myIsInsideView) return;
        if (!this._isMouseAllowed()) return;
        if (!this._isPointerEventIDValid(this._myLastValidPointerEvent)) return;
        if (!this._isPointerEventValid(this._myLastValidPointerEvent)) return;

        actionCallback(event);
    }

    _onPointerMove(event) {
        this._myResetMovingTimer.start(this._myResetMovingDelay);
        this._myIsMoving = true;
    }

    _onPointerDown(event) {
        let buttonInfo = this._myButtonInfos.get(event.button);
        if (!buttonInfo.myIsPressed) {
            buttonInfo.myIsPressed = true;
            buttonInfo.myIsPressStartToProcess = true;
        }
    }

    _onPointerUp(event) {
        let buttonInfo = this._myButtonInfos.get(event.button);
        if (buttonInfo.myIsPressed) {
            buttonInfo.myIsPressed = false;
            buttonInfo.myIsPressEndToProcess = true;
        }
    }

    _onPointerLeave(event) {
        if (!this._myIsInsideView || this._myLastValidPointerEvent == null || event.pointerId != this._myLastValidPointerEvent.pointerId) return;

        this._myIsInsideView = false;

        this._myIsMoving = false;

        if (this._myPointerUpOnPointerLeave) {
            for (let buttonInfo of this._myButtonInfos.values()) {
                if (buttonInfo.myIsPressed) {
                    buttonInfo.myIsPressed = false;
                    buttonInfo.myIsPressEndToProcess = true;
                }
            }
        }

        this._myPointerID = null;
    }

    _onPointerEnter(event) {
        if ((this._myIsInsideView && this._myPointerID != null) || !this._isPointerEventIDValid(event) || !this._isPointerEventValid(event)) return;

        this._myIsInsideView = true;

        this._updatePositionAndScreen(event);
        this._updatePointerData(event);
    }

    _preventContextMenu(event) {
        if (!this._isPointerEventIDValid(event) || !this._isPointerEventValid(event)) return;

        event.preventDefault();
    }

    _preventMiddleButtonScroll(event) {
        if (!this._isPointerEventIDValid(event) || !this._isPointerEventValid(event)) return;

        if (event.button == 1) {
            event.preventDefault();
            return false;
        }
    }

    _updatePositionAndScreen(event) {
        this._updateScreenSize();
        this._myInternalMousePosition[0] = event.clientX;
        this._myInternalMousePosition[1] = event.clientY;

        this._myIsValid = true;
    }

    _updateScreenSize() {
        let bounds = document.body.getBoundingClientRect();
        this._myScreenSize[0] = bounds.width;
        this._myScreenSize[1] = bounds.height;
    }

    _updatePointerData(event) {
        this._myPointerID = event.pointerId;
        this._myLastValidPointerEvent = event;
    }

    _isPointerEventIDValid(event) {
        if (event == null) return false;

        return this._myPointerID == null || this._myPointerID == event.pointerId;
    }

    _isPointerEventValid(event) {
        if (event == null) return false;

        let isValid = true;

        for (let callback of this._myPointerEventValidCallbacks.values()) {
            if (!callback(event)) {
                isValid = false;
                break;
            };
        }

        return isValid;
    }

    _isMouseAllowed() {
        // mouse events are valid only if the last pointer event was a mouse (id==1)
        return this._myLastValidPointerEvent != null && this._myLastValidPointerEvent.pointerId == 1;
    }

    _createButtonInfo() {
        return { myIsPressed: false, myIsPressStart: false, myIsPressStartToProcess: false, myIsPressEnd: false, myIsPressEndToProcess: false, };
    }
};