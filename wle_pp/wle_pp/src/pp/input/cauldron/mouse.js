import { ViewComponent } from "@wonderlandengine/api";
import { Timer } from "../../cauldron/cauldron/timer.js";
import { RaycastResults } from "../../cauldron/physics/physics_raycast_params.js";
import { PhysicsUtils } from "../../cauldron/physics/physics_utils.js";
import { XRUtils } from "../../cauldron/utils/xr_utils.js";
import { mat4_create, quat_create, vec2_create, vec3_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../pp/globals.js";

export let MouseButtonID = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2
};

// #TODO Refactor Mouse/Keyboard/Gamepad and create a sort of parent ButtonHandler that have the base ButtonInfo and all of them inherit
export class Mouse {

    constructor(engine = Globals.getMainEngine()) {
        this._myEngine = engine;

        this._myButtonInfos = {};
        this._myButtonInfosIDs = [];
        for (let key in MouseButtonID) {
            this._myButtonInfos[MouseButtonID[key]] = this._createButtonInfo();
            this._myButtonInfosIDs.push(MouseButtonID[key]);
        }

        this._myPreventContextMenuEventListener = this._preventContextMenu.bind(this);
        this._myPreventMiddleButtonScrollEventListener = this._preventMiddleButtonScroll.bind(this);

        this._myInternalMousePosition = vec2_create();

        this._myScreenSize = vec2_create();

        this._myResetMovingDelay = 0.15;
        this._myResetMovingTimer = new Timer(this._myResetMovingDelay, false);
        this._myMoving = false;

        this._myInsideView = false;
        this._myValid = false;

        this._myPointerUpOnPointerLeave = true;

        this._myContextMenuActive = true;
        this._myMiddleButtonScrollActive = true;

        this._myPointerID = null;
        this._myLastValidPointerEvent = null;

        this._myPointerEventValidCallbacks = {};      // Signature: callback(event)
        this._myPointerEventValidCallbacksIDs = [];

        this._myPointerMoveEventListener = null;
        this._myPointerDownEventListener = null;
        this._myPointerUpEventListener = null;
        this._myPointerLeaveEventListener = null;
        this._myPointerEnterEventListener = null;
        this._myMouseDownEventListener = null;
        this._myMouseUpEventListener = null;

        this._myDestroyed = false;

        // Support Variables
        this._myProjectionMatrixInverse = mat4_create();
        this._myRotationQuat = quat_create();
        this._myOriginWorld = vec3_create();
        this._myDirectionWorld = vec3_create();
    }

    start() {
        this._myPointerMoveEventListener = this._onPointerAction.bind(this, this._onPointerMove.bind(this));
        document.body.addEventListener("pointermove", this._myPointerMoveEventListener);
        this._myPointerDownEventListener = this._onPointerAction.bind(this, this._onPointerDown.bind(this));
        document.body.addEventListener("pointerdown", this._myPointerDownEventListener);
        this._myPointerUpEventListener = this._onPointerAction.bind(this, this._onPointerUp.bind(this));
        document.body.addEventListener("pointerup", this._myPointerUpEventListener);
        this._myPointerLeaveEventListener = this._onPointerLeave.bind(this);
        document.body.addEventListener("pointerleave", this._myPointerLeaveEventListener);
        this._myPointerEnterEventListener = this._onPointerEnter.bind(this);
        document.body.addEventListener("pointerenter", this._myPointerEnterEventListener);

        // These are needed to being able to detect for example left and right click together, pointer only allow one down at a time
        this._myMouseDownEventListener = this._onMouseAction.bind(this, this._onPointerDown.bind(this));
        document.body.addEventListener("mousedown", this._myMouseDownEventListener);
        this._myMouseUpEventListener = this._onMouseAction.bind(this, this._onPointerUp.bind(this));
        document.body.addEventListener("mouseup", this._myMouseUpEventListener);

        this._updateScreenSize();
        this._myWindowResizeEventListener = this._updateScreenSize.bind(this);
        window.addEventListener("resize", this._myWindowResizeEventListener);
    }

    update(dt) {
        if (this._myResetMovingTimer.isRunning()) {
            this._myResetMovingTimer.update(dt);
            if (this._myResetMovingTimer.isDone()) {
                this._myResetMovingTimer.reset();
                this._myMoving = false;
            }
        }

        for (let i = 0; i < this._myButtonInfosIDs.length; i++) {
            let id = this._myButtonInfosIDs[i];
            let buttonInfo = this._myButtonInfos[id];
            buttonInfo.myPressStart = buttonInfo.myPressStartToProcess;
            buttonInfo.myPressEnd = buttonInfo.myPressEndToProcess;
            buttonInfo.myPressStartToProcess = false;
            buttonInfo.myPressEndToProcess = false;
        }

        if (!this.isAnyButtonPressed() && !this._myMoving) {
            this._myPointerID = null;
        }

        if (this._myLastValidPointerEvent != null) {
            let lastValidPointerEventStillValid = this._isPointerEventValid(this._myLastValidPointerEvent);
            if (!lastValidPointerEventStillValid) {
                if (this._myInsideView) {
                    this._onPointerLeave(this._myLastValidPointerEvent);
                }

                this._myLastValidPointerEvent = null;
            }
        }
    }

    isValid() {
        return this._myValid;
    }

    isButtonPressed(buttonID) {
        let pressed = false;

        if (this._myButtonInfosIDs[buttonID] != null) {
            pressed = this._myButtonInfos[buttonID].myPressed;
        }

        return pressed;
    }

    isAnyButtonPressed() {
        let pressed = false;

        for (let i = 0; i < this._myButtonInfosIDs.length; i++) {
            let id = this._myButtonInfosIDs[i];
            let buttonInfo = this._myButtonInfos[id];
            if (buttonInfo.myPressed) {
                pressed = true;
                break;
            }
        }

        return pressed;
    }

    isButtonPressStart(buttonID) {
        let pressStart = false;

        if (this._myButtonInfosIDs[buttonID] != null) {
            pressStart = this._myButtonInfos[buttonID].myPressStart;
        }

        return pressStart;
    }

    isButtonPressEnd(buttonID = null) {
        let pressEnd = false;

        if (this._myButtonInfosIDs[buttonID] != null) {
            pressEnd = this._myButtonInfos[buttonID].myPressEnd;
        }

        return pressEnd;
    }

    isMoving() {
        return this._myMoving;
    }

    isInsideView() {
        return this._myInsideView;
    }

    isTargetingRenderCanvas() {
        return this.isInsideView() && this._myLastValidPointerEvent != null && this._myLastValidPointerEvent.target == Globals.getCanvas(this._myEngine);
    }

    // The origin and direction are set by the mouse
    raycastWorld(raycastParams, raycastResults = new RaycastResults()) {
        this.getOriginWorld(raycastParams.myOrigin);
        this.getDirectionWorld(raycastParams.myDirection);
        raycastResults = PhysicsUtils.raycast(raycastParams, raycastResults, Globals.getPhysics(this._myEngine));
        return raycastResults;
    }

    getPositionScreen(out = vec2_create()) {
        let mousePosition = out;
        mousePosition[0] = this._myInternalMousePosition[0];
        mousePosition[1] = this._myScreenSize[1] - 1 - this._myInternalMousePosition[1];
        return mousePosition;
    }

    getPositionScreenNormalized(out = vec2_create()) {
        let mousePosition = out;
        mousePosition[0] = (this._myScreenSize[0] == 0) ? 0 : ((this._myInternalMousePosition[0] / this._myScreenSize[0]) * 2 - 1);
        mousePosition[1] = (this._myScreenSize[1] == 0) ? 0 : (((this._myScreenSize[1] - 1 - this._myInternalMousePosition[1]) / this._myScreenSize[1]) * 2 - 1);
        return mousePosition;
    }

    getScreenSize() {
        return this._myScreenSize;
    }

    getPositionWorld(distanceFromCamera, out = vec3_create()) {
        let originWorld = this.getOriginWorld(this._myOriginWorld);
        let directionWorld = this.getDirectionWorld(this._myDirectionWorld);

        out = originWorld.vec3_add(directionWorld.vec3_scale(distanceFromCamera, out), out);
        return out;
    }

    getOriginWorld(out = vec3_create()) {
        if (XRUtils.isSessionActive(this._myEngine)) {
            Globals.getPlayerObjects(this._myEngine).myEyeLeft.pp_getPosition(out); // In theory mouse should not be used inside the session, but may make sense for AR which uses eye left
        } else {
            Globals.getPlayerObjects(this._myEngine).myCameraNonXR.pp_getPosition(out);
        }

        return out;
    }

    getDirectionWorld(out = vec3_create()) {
        let right = this._myInternalMousePosition[0] / this._myScreenSize[0];
        let up = this._myInternalMousePosition[1] / this._myScreenSize[1];

        let directionLocal = out;
        directionLocal.vec3_set(right * 2 - 1, -up * 2 + 1, -1.0);

        let projectionMatrixInvert = this._myProjectionMatrixInverse;
        if (XRUtils.isSessionActive(this._myEngine)) {
            projectionMatrixInvert = Globals.getPlayerObjects(this._myEngine).myEyeLeft.pp_getComponent(ViewComponent).projectionMatrix.mat4_invert(projectionMatrixInvert);
        } else {
            projectionMatrixInvert = Globals.getPlayerObjects(this._myEngine).myCameraNonXR.pp_getComponent(ViewComponent).projectionMatrix.mat4_invert(projectionMatrixInvert);
        }

        directionLocal.vec3_transformMat4(projectionMatrixInvert, directionLocal);
        directionLocal.vec3_normalize(directionLocal);

        let directionWorld = directionLocal;
        if (XRUtils.isSessionActive(this._myEngine)) {
            directionWorld = directionLocal.vec3_transformQuat(Globals.getPlayerObjects(this._myEngine).myEyeLeft.pp_getRotationQuat(this._myRotationQuat), directionLocal);
        } else {
            directionWorld = directionLocal.vec3_transformQuat(Globals.getPlayerObjects(this._myEngine).myCameraNonXR.pp_getRotationQuat(this._myRotationQuat), directionLocal);
        }

        directionWorld.vec3_normalize(directionWorld);

        return out;
    }

    setTouchValid(touchValid) {
        let callbackID = "pp_internal_touch_valid_callback";
        if (touchValid) {
            this.removePointerEventValidCallback(callbackID);
        } else {
            this.addPointerEventValidCallback(callbackID, function (event) {
                return event.pointerType == "mouse";
            });
        }
    }

    setTargetOnlyRenderCanvas(targetOnlyRenderCanvas) {
        let callbackID = "pp_internal_target_only_render_canvas_callback";
        if (targetOnlyRenderCanvas) {
            this.addPointerEventValidCallback(callbackID, function (event) {
                return event.target == Globals.getCanvas(this._myEngine);
            });
        } else {
            this.removePointerEventValidCallback(callbackID);
        }
    }

    getLastValidPointerEvent() {
        return this._myLastValidPointerEvent;
    }

    // Can be used to specify that only some pointerType are valid (eg: mouse, touch, pen) or just some target (eg: Globals.getCanvas(this._myEngine))
    addPointerEventValidCallback(id, callback) {
        this._myPointerEventValidCallbacks[id] = callback;
        this._myPointerEventValidCallbacksIDs.push(id);
    }

    removePointerEventValidCallback(id) {
        delete this._myPointerEventValidCallbacks[id];
        this._myPointerEventValidCallbacksIDs.pp_removeEqual(id);
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
                document.body.removeEventListener("contextmenu", this._myPreventContextMenuEventListener);
            } else {
                document.body.addEventListener("contextmenu", this._myPreventContextMenuEventListener, false);
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
                document.body.removeEventListener("mousedown", this._myPreventMiddleButtonScrollEventListener);
            } else {
                document.body.addEventListener("mousedown", this._myPreventMiddleButtonScrollEventListener, false);
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
            if (this._myInsideView) {
                this._onPointerLeave(event);
            }
            return;
        }

        if (!this._myInsideView) {
            this._onPointerEnter(event);
        }

        actionCallback(event);

        this._updatePosition(event);
        this._updatePointerData(event);
    }

    _onMouseAction(actionCallback, event) {
        if (!this._myInsideView) return;
        if (!this._isMouseAllowed()) return;
        if (!this._isPointerEventIDValid(this._myLastValidPointerEvent)) return;
        if (!this._isPointerEventValid(this._myLastValidPointerEvent)) return;

        actionCallback(event);
    }

    _onPointerMove(event) {
        this._myResetMovingTimer.start(this._myResetMovingDelay);
        this._myMoving = true;
    }

    _onPointerDown(event) {
        let buttonInfo = this._myButtonInfos[event.button];
        if (!buttonInfo.myPressed) {
            buttonInfo.myPressed = true;
            buttonInfo.myPressStartToProcess = true;
        }
    }

    _onPointerUp(event) {
        let buttonInfo = this._myButtonInfos[event.button];
        if (buttonInfo.myPressed) {
            buttonInfo.myPressed = false;
            buttonInfo.myPressEndToProcess = true;
        }
    }

    _onPointerLeave(event) {
        if (!this._myInsideView || this._myLastValidPointerEvent == null || event.pointerId != this._myLastValidPointerEvent.pointerId) return;

        this._myInsideView = false;

        this._myMoving = false;

        if (this._myPointerUpOnPointerLeave) {
            for (let i = 0; i < this._myButtonInfosIDs.length; i++) {
                let id = this._myButtonInfosIDs[i];
                let buttonInfo = this._myButtonInfos[id];
                if (buttonInfo.myPressed) {
                    buttonInfo.myPressed = false;
                    buttonInfo.myPressEndToProcess = true;
                }
            }
        }

        this._myPointerID = null;
    }

    _onPointerEnter(event) {
        if ((this._myInsideView && this._myPointerID != null) || !this._isPointerEventIDValid(event) || !this._isPointerEventValid(event)) return;

        this._myInsideView = true;

        this._updatePosition(event);
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

    _updatePosition(event) {
        this._myInternalMousePosition[0] = event.clientX;
        this._myInternalMousePosition[1] = event.clientY;

        this._myValid = true;
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

        let valid = true;

        for (let i = 0; i < this._myPointerEventValidCallbacksIDs.length; i++) {
            let id = this._myPointerEventValidCallbacksIDs[i];
            let callback = this._myPointerEventValidCallbacks[id];
            if (!callback(event)) {
                valid = false;
                break;
            }
        }

        return valid;
    }

    _isMouseAllowed() {
        // Mouse events are valid only if the last pointer event was a mouse (id==1)
        return this._myLastValidPointerEvent != null && this._myLastValidPointerEvent.pointerId == 1;
    }

    _createButtonInfo() {
        return { myPressed: false, myPressStart: false, myPressStartToProcess: false, myPressEnd: false, myPressEndToProcess: false, };
    }

    destroy() {
        this._myDestroyed = true;

        document.body.removeEventListener("pointermove", this._myPointerMoveEventListener);
        document.body.removeEventListener("pointerdown", this._myPointerDownEventListener);
        document.body.removeEventListener("pointerup", this._myPointerUpEventListener);
        document.body.removeEventListener("pointerleave", this._myPointerLeaveEventListener);
        document.body.removeEventListener("pointerenter", this._myPointerEnterEventListener);

        document.body.removeEventListener("mousedown", this._myMouseDownEventListener);
        document.body.removeEventListener("mouseup", this._myMouseUpEventListener);

        document.body.removeEventListener("contextmenu", this._myPreventContextMenuEventListener);
        document.body.removeEventListener("mousedown", this._myPreventMiddleButtonScrollEventListener);

        window.removeEventListener("resize", this._myWindowResizeEventListener);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}