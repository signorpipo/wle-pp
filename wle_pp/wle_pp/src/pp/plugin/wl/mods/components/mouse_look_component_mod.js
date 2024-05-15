import { MouseLookComponent } from "@wonderlandengine/components";
import { Timer } from "../../../../cauldron/cauldron/timer.js";
import { Globals } from "../../../../pp/globals.js";
import { vec3_create } from "../../../js/extensions/array/vec_create_extension.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";

export function initMouseLookComponentMod() {
    _initMouseLookComponentModPrototype();
}

function _initMouseLookComponentModPrototype() {

    let mouseLookComponentMod = {};

    // Modified Functions

    mouseLookComponentMod.init = function init() {
        this.pointerId = null;
        this.prevMoveEvent = null;

        this.resetMovingDelay = 0.15;
        this.resetMovingTimer = new Timer(this.resetMovingDelay, false);
        this.isMoving = false;
        this.mouseDown = false;

        this.pointerMoveListener = this._onMove.bind(this);

        this.contextMenuListener = function (event) {
            if (this.active) {
                event.preventDefault();
            }
        }.bind(this);

        this.pointerDown = function (event) {
            if (this.active) {
                if (this.pointerId != null) return;

                if (!this.mouseDown) {
                    if (event.button == this.mouseButtonIndex) {
                        this.pointerId = event.pointerId;
                        this.mouseDown = true;
                        // Commenting cursor style change for now since it messes with Cursor Component cursor style, which is more important to have,
                        // since it provides a more important feedback, while here is mostly just a visual thing
                        //document.body.style.cursor = "grabbing"; 
                        if (event.button == 1) {
                            event.preventDefault(); // Prevent scrolling
                            return false;
                        }
                    }
                }
            }
        }.bind(this);

        this.pointerUp = function (event) {
            if (this.active) {
                if (event.pointerId != this.pointerId) return;

                if (this.mouseDown) {
                    if (event.button == this.mouseButtonIndex) {
                        this.mouseDown = false;
                        //document.body.style.cursor = "default";
                    }
                }
            }
        }.bind(this);

        this.pointerLeave = function (event) {
            if (this.active) {
                if (event.pointerId != this.pointerId) return;

                this.pointerId = null;
                this.prevMoveEvent = null;

                if (this.mouseDown) {
                    this.mouseDown = false;
                    //document.body.style.cursor = "default";
                }
            }
        }.bind(this);

        document.body.addEventListener("pointermove", this.pointerMoveListener);

        if (this.requireMouseDown) {
            if (this.mouseButtonIndex == 2) {
                Globals.getCanvas(this.engine).addEventListener("contextmenu", this.contextMenuListener, false);
            }

            Globals.getCanvas(this.engine).addEventListener("pointerdown", this.pointerDown);

            document.body.addEventListener("pointerup", this.pointerUp);
        }

        document.body.addEventListener("pointerleave", this.pointerLeave);
    };

    // New Functions

    mouseLookComponentMod.start = function start() { };
    mouseLookComponentMod.onActivate = function onActivate() { };

    mouseLookComponentMod.onDeactivate = function onDeactivate() {
        if (this.mouseDown) {
            //document.body.style.cursor = "default";
        }

        this.isMoving = false;
        this.mouseDown = false;

        this.pointerId = null;
        this.prevMoveEvent = null;
    };

    mouseLookComponentMod.onDestroy = function onDestroy() {
        document.body.removeEventListener("pointermove", this.pointerMoveListener);
        Globals.getCanvas(this.engine).removeEventListener("contextmenu", this.contextMenuListener);
        Globals.getCanvas(this.engine).removeEventListener("pointerdown", this.pointerDown);
        document.body.removeEventListener("pointerup", this.pointerUp);
        document.body.removeEventListener("pointerleave", this.pointerLeave);
    };

    mouseLookComponentMod.update = function update(dt) {
        if (this.resetMovingTimer.isRunning()) {
            this.resetMovingTimer.update(dt);
            if (this.resetMovingTimer.isDone()) {
                this.resetMovingTimer.reset();
                this.isMoving = false;
            }
        }

        if (!this.isMoving) {
            if (!this.requireMouseDown || !this.mouseDown) {
                this.pointerId = null;
            }

            this.prevMoveEvent = null;
        }
    };

    mouseLookComponentMod._onMove = function () {
        let viewForward = vec3_create();
        let viewUp = vec3_create();

        let referenceUp = vec3_create();
        let referenceUpNegate = vec3_create();
        let referenceRight = vec3_create();

        let newUp = vec3_create();
        return function _onMove(event) {
            if (this.active) {
                if (this.pointerId != null && event.pointerId != this.pointerId) return;

                if (this.mouseDown || !this.requireMouseDown) {

                    viewForward = this.object.pp_getBackward(viewForward); // The view "real" forward is actually the backward
                    viewUp = this.object.pp_getUp(viewUp);

                    referenceUp.vec3_set(0, 1, 0);
                    if (this.object.pp_getParent() != null) {
                        referenceUp = this.object.pp_getParent().pp_getUp(referenceUp);
                    }

                    referenceRight = viewForward.vec3_cross(referenceUp, referenceRight);

                    let minAngle = 1;
                    if (viewForward.vec3_angle(referenceUp) < minAngle) {
                        referenceRight = viewUp.vec3_negate(referenceRight).vec3_cross(referenceUp, referenceRight);
                    } else if (viewForward.vec3_angle(referenceUp.vec3_negate(referenceUpNegate)) < minAngle) {
                        referenceRight = viewUp.vec3_cross(referenceUp, referenceRight);
                    } else if (!viewUp.vec3_isConcordant(referenceUp)) {
                        referenceRight.vec3_negate(referenceRight);
                    }
                    referenceRight.vec3_normalize(referenceRight);

                    let movementX = event.movementX;
                    let movementY = event.movementY;

                    if (movementX == null || movementY == null) {
                        if (this.prevMoveEvent != null) {
                            movementX = event.pageX - this.prevMoveEvent.pageX;
                            movementY = event.pageY - this.prevMoveEvent.pageY;
                        } else {
                            movementX = 0;
                            movementY = 0;
                        }
                    }

                    this.rotationX = -this.sensitity * movementX;
                    this.rotationY = -this.sensitity * movementY;

                    this.object.pp_rotateAxis(this.rotationY, referenceRight);

                    let maxVerticalAngle = 89 - 0.001;
                    newUp = this.object.pp_getUp(newUp);
                    let angleWithUp = Math.pp_angleClamp(newUp.vec3_angleSigned(referenceUp, referenceRight));
                    if (Math.abs(angleWithUp) > maxVerticalAngle) {
                        let fixAngle = (Math.abs(angleWithUp) - maxVerticalAngle) * Math.pp_sign(angleWithUp);
                        this.object.pp_rotateAxis(fixAngle, referenceRight);
                    }

                    this.object.pp_rotateAxis(this.rotationX, referenceUp);

                    this.prevMoveEvent = event;
                    this.pointerId = event.pointerId;

                    this.resetMovingTimer.start(this.resetMovingDelay);
                    this.isMoving = true;
                }
            }
        };
    }();



    PluginUtils.injectOwnProperties(mouseLookComponentMod, MouseLookComponent.prototype, false, true, true);
}