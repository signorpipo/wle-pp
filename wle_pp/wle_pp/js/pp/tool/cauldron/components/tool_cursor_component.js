import { Component, MeshComponent, Property, ViewComponent } from "@wonderlandengine/api";
import { Cursor, CursorTarget } from "@wonderlandengine/components";
import { XRUtils } from "../../../cauldron/utils/xr_utils";
import { FingerCursorComponent } from "../../../input/cauldron/components/finger_cursor_component";
import { getLeftGamepad, getRightGamepad } from "../../../input/cauldron/input_globals";
import { InputUtils } from "../../../input/cauldron/input_utils";
import { quat2_create, vec3_create, vec4_create } from "../../../plugin/js/extensions/array_extension";
import { getDefaultResources } from "../../../pp/default_resources_global";
import { getPlayerObjects } from "../../../pp/player_objects_global";

export class ToolCursorComponent extends Component {
    static TypeName = "pp-tool-cursor";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myApplyDefaultCursorOffset: Property.bool(true),
        _myPulseOnHover: Property.bool(false),
        _myShowFingerCursor: Property.bool(false)
    }

    init() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);

        this._myCursorPositionDefaultOffset = vec3_create(0, -0.035, 0.05);
        this._myCursorRotationDefaultOffset = vec3_create(30, 0, 0);

        this._myCursorMeshScale = vec3_create(0.0025, 0.0025, 0.0025);
        this._myCursorColor = vec4_create(255 / 255, 255 / 255, 255 / 255, 1);

        this._myCursorTargetCollisionGroup = 7;
    }

    start() {
        this._myToolCursorObject = this.object.pp_addObject();

        this._myCursorObjectVR = this._myToolCursorObject.pp_addObject();

        if (this._myApplyDefaultCursorOffset) {
            this._myCursorObjectVR.pp_setPositionLocal(this._myCursorPositionDefaultOffset);
            this._myCursorObjectVR.pp_rotateObject(this._myCursorRotationDefaultOffset);
        }

        {
            this._myCursorMeshobject = this._myCursorObjectVR.pp_addObject();
            this._myCursorMeshobject.pp_setScale(this._myCursorMeshScale);

            let cursorMeshComponent = this._myCursorMeshobject.pp_addComponent(MeshComponent);
            cursorMeshComponent.mesh = getDefaultResources(this.engine).myMeshes.mySphere;
            cursorMeshComponent.material = getDefaultResources(this.engine).myMaterials.myFlatOpaque.clone();
            cursorMeshComponent.material.color = this._myCursorColor;

            this._myCursorComponentVR = this._myCursorObjectVR.pp_addComponent(Cursor, {
                "collisionGroup": this._myCursorTargetCollisionGroup,
                "handedness": this._myHandedness + 1,
                "cursorObject": this._myCursorMeshobject
            });

            this._myCursorComponentVR.rayCastMode = 0; // Collision
            if (this._myPulseOnHover) {
                this._myCursorComponentVR.globalTarget.addHoverFunction(this._pulseOnHover.bind(this));
            }
        }

        this._myCursorObjectNonVR = this._myToolCursorObject.pp_addObject();

        {
            this._myCursorComponentNonVR = this._myCursorObjectNonVR.pp_addComponent(Cursor, {
                "collisionGroup": this._myCursorTargetCollisionGroup,
                "handedness": this._myHandedness + 1
            });

            this._myCursorComponentNonVR.rayCastMode = 0; // Collision
            if (this._myPulseOnHover) {
                this._myCursorComponentNonVR.globalTarget.addHoverFunction(this._pulseOnHover.bind(this));
            }
            this._myCursorComponentNonVR.setViewComponent(getPlayerObjects(this.engine).myCameraNonVR.pp_getComponent(ViewComponent));
        }

        let fingerCursorMeshObject = null;
        let fingerCollisionSize = 0.0125;

        if (this._myShowFingerCursor) {
            fingerCursorMeshObject = this._myToolCursorObject.pp_addObject();

            let meshComponent = fingerCursorMeshObject.pp_addComponent(MeshComponent);
            meshComponent.mesh = getDefaultResources(this.engine).myMeshes.mySphere;
            meshComponent.material = getDefaultResources(this.engine).myMaterials.myFlatOpaque.clone();
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

        this._myCursorComponentVR.active = false;
        this._myCursorComponentNonVR.active = false;
        this._myFingerCursorComponent.active = false;

    }

    update(dt) {
        // Implemented outside class definition
    }

    _isUsingHand() {
        let isUsingHand = false;

        if (XRUtils.getSession(this.engine) && XRUtils.getSession(this.engine).inputSources) {
            for (let i = 0; i < XRUtils.getSession(this.engine).inputSources.length; i++) {
                let input = XRUtils.getSession(this.engine).inputSources[i];
                if (input.hand && input.handedness == this._myHandednessType) {
                    isUsingHand = true;
                    break;
                }
            }
        }

        return isUsingHand;
    }

    _pulseOnHover(object) {
        let targetComponent = object.pp_getComponent(CursorTarget);

        if (targetComponent && !targetComponent.isSurface) {
            if (this._myHandedness == 0) {
                if (getLeftGamepad(this.engine) != null) {
                    getLeftGamepad(this.engine).pulse(0.4, 0);
                }
            } else {
                if (getRightGamepad(this.engine) != null) {
                    getRightGamepad(this.engine).pulse(0.4, 0);
                }
            }
        }
    }
}



// IMPLEMENTATION

ToolCursorComponent.prototype.update = function () {
    let transformQuat = quat2_create();
    return function update(dt) {
        let isUsingHand = this._isUsingHand();

        this._myFingerCursorComponent.active = isUsingHand;

        if (isUsingHand) {
            this._myCursorComponentVR.active = false;
            this._myCursorComponentNonVR.active = false;
        } else {
            if (XRUtils.isSessionActive(this.engine)) {
                this._myCursorComponentVR.active = !isUsingHand;
                this._myCursorComponentNonVR.active = false;
            } else {
                this._myCursorComponentNonVR.active = !isUsingHand;
                this._myCursorComponentVR.active = false;

                this._myCursorObjectNonVR.pp_setTransformQuat(getPlayerObjects(this.engine).myCameraNonVR.pp_getTransformQuat(transformQuat));
            }
        }
    };
}()