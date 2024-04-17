import { Component, MeshComponent, Property, ViewComponent } from "@wonderlandengine/api";
import { Cursor, CursorTarget } from "@wonderlandengine/components";
import { XRUtils } from "../../../cauldron/utils/xr_utils.js";
import { FingerCursorComponent } from "../../../input/cauldron/components/finger_cursor_component.js";
import { InputUtils } from "../../../input/cauldron/input_utils.js";
import { quat2_create, vec3_create, vec4_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";

export class ToolCursorComponent extends Component {
    static TypeName = "pp-tool-cursor";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myApplyDefaultCursorOffset: Property.bool(true),
        _myPulseOnHover: Property.bool(false),
        _myShowFingerCursor: Property.bool(false),
        _myUpdatePointerCursorStyle: Property.bool(true)
    };

    init() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);

        this._myCursorPositionDefaultOffset = vec3_create(0, -0.035, 0.05);
        this._myCursorRotationDefaultOffset = vec3_create(30, 0, 0);

        this._myCursorMeshScale = vec3_create(0.0025, 0.0025, 0.0025);
        this._myCursorColor = vec4_create(255 / 255, 255 / 255, 255 / 255, 1);

        this._myCursorTargetCollisionGroup = 7; // Keep this in sync with Widgets 

        this._myStarted = false;
    }

    start() {
        if (Globals.isToolEnabled(this.engine)) {
            this._myToolCursorObject = this.object.pp_addObject();

            this._myCursorObjectXR = this._myToolCursorObject.pp_addObject();

            if (this._myApplyDefaultCursorOffset) {
                this._myCursorObjectXR.pp_setPositionLocal(this._myCursorPositionDefaultOffset);
                this._myCursorObjectXR.pp_rotateObject(this._myCursorRotationDefaultOffset);
            }

            {
                this._myCursorMeshobject = this._myCursorObjectXR.pp_addObject();
                this._myCursorMeshobject.pp_setScale(this._myCursorMeshScale);

                let cursorMeshComponent = this._myCursorMeshobject.pp_addComponent(MeshComponent);
                cursorMeshComponent.mesh = Globals.getDefaultMeshes(this.engine).mySphere;
                cursorMeshComponent.material = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
                cursorMeshComponent.material.color = this._myCursorColor;

                this._myCursorComponentXR = this._myCursorObjectXR.pp_addComponent(Cursor, {
                    "collisionGroup": this._myCursorTargetCollisionGroup,
                    "handedness": this._myHandedness + 1,
                    "cursorObject": this._myCursorMeshobject,
                    "styleCursor": false
                });

                this._myCursorComponentXR.rayCastMode = 0; // Collision
                if (this._myPulseOnHover) {
                    this._myCursorComponentXR.globalTarget.onHover.add(this._pulseOnHover.bind(this), { id: this });
                }
            }

            this._myCursorObjectNonXR = this._myToolCursorObject.pp_addObject();

            {
                this._myCursorComponentNonXR = this._myCursorObjectNonXR.pp_addComponent(Cursor, {
                    "collisionGroup": this._myCursorTargetCollisionGroup,
                    "handedness": this._myHandedness + 1,
                    "styleCursor": this._myUpdatePointerCursorStyle
                });

                this._myCursorComponentNonXR.rayCastMode = 0; // Collision
                if (this._myPulseOnHover) {
                    this._myCursorComponentNonXR.globalTarget.onHover.add(this._pulseOnHover.bind(this), { id: this });
                }
                this._myCursorComponentNonXR.pp_setViewComponent(Globals.getPlayerObjects(this.engine).myCameraNonXR.pp_getComponent(ViewComponent));
            }

            let fingerCursorMeshObject = null;
            let fingerCollisionSize = 0.0125;

            if (this._myShowFingerCursor) {
                fingerCursorMeshObject = this._myToolCursorObject.pp_addObject();

                let meshComponent = fingerCursorMeshObject.pp_addComponent(MeshComponent);
                meshComponent.mesh = Globals.getDefaultMeshes(this.engine).mySphere;
                meshComponent.material = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
                meshComponent.material.color = this._myCursorColor;

                fingerCursorMeshObject.pp_setScale(fingerCollisionSize);
            }

            this._myFingerCursorObject = this._myToolCursorObject.pp_addObject();
            this._myFingerCursorComponent = this._myFingerCursorObject.pp_addComponent(FingerCursorComponent, {
                "_myHandedness": this._myHandedness,
                "_myMultipleClicksEnabled": true,
                "_myCollisionGroup": this._myCursorTargetCollisionGroup,
                "_myCollisionSize": fingerCollisionSize,
                "_myCursorObject": fingerCursorMeshObject
            });

            this._myCursorComponentXR.active = false;
            this._myCursorComponentNonXR.active = false;
            this._myFingerCursorComponent.active = false;

            this._myStarted = true;
        }
    }

    update(dt) {
        // Implemented outside class definition
    }

    _isUsingHand() {
        let usingHand = false;

        if (XRUtils.getSession(this.engine) && XRUtils.getSession(this.engine).inputSources != null) {
            for (let i = 0; i < XRUtils.getSession(this.engine).inputSources.length; i++) {
                let input = XRUtils.getSession(this.engine).inputSources[i];
                if (input.hand && input.handedness == this._myHandednessType) {
                    usingHand = true;
                    break;
                }
            }
        }

        return usingHand;
    }

    _pulseOnHover(object) {
        let targetComponent = object.pp_getComponent(CursorTarget);

        if (targetComponent && !targetComponent.isSurface) {
            if (this._myHandedness == 0) {
                if (Globals.getLeftGamepad(this.engine) != null) {
                    Globals.getLeftGamepad(this.engine).pulse(0.4, 0);
                }
            } else {
                if (Globals.getRightGamepad(this.engine) != null) {
                    Globals.getRightGamepad(this.engine).pulse(0.4, 0);
                }
            }
        }
    }

    onDestroy() {
        if (this._myStarted) {
            this._myCursorComponentXR.globalTarget.onHover.remove(this);
            this._myCursorComponentNonXR.globalTarget.onHover.remove(this);
        }
    }
}



// IMPLEMENTATION

ToolCursorComponent.prototype.update = function () {
    let transformQuat = quat2_create();
    return function update(dt) {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myStarted) {
                let usingHand = this._isUsingHand();

                this._myFingerCursorComponent.active = usingHand;

                if (usingHand) {
                    this._myCursorComponentXR.active = false;
                    this._myCursorComponentNonXR.active = false;
                } else {
                    if (XRUtils.isSessionActive(this.engine)) {
                        this._myCursorComponentXR.active = !usingHand;
                        this._myCursorComponentNonXR.active = false;
                    } else {
                        this._myCursorComponentNonXR.active = !usingHand;
                        this._myCursorComponentXR.active = false;

                        this._myCursorObjectNonXR.pp_setTransformQuat(Globals.getPlayerObjects(this.engine).myCameraNonXR.pp_getTransformQuat(transformQuat));
                    }
                }
            }
        }
    };
}();