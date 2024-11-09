import { Component, Property } from "@wonderlandengine/api";
import { TrackedHandJointID, TrackedHandJointIDIndex } from "../input_types.js";
import { TrackedHandDrawJointComponent } from "./tracked_hand_draw_joint_component.js";

export class TrackedHandDrawAllJointsComponent extends Component {
    static TypeName = "pp-tracked-hand-draw-all-joints";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myHideMetacarpals: Property.bool(true),
        _myJointMesh: Property.mesh(),
        _myJointMaterial: Property.material()
    };

    start() {
        this._buildTrackedHandHierarchy();
    }

    _buildTrackedHandHierarchy() {
        this._myTrackedHandMeshObject = this.object.pp_addChild();

        this._myJointMeshObjectList = [];

        for (let jointIDKey in TrackedHandJointID) {
            let jointID = TrackedHandJointID[jointIDKey];
            if (!this._myHideMetacarpals ||
                (jointID != TrackedHandJointID.THUMB_METACARPAL &&
                    jointID != TrackedHandJointID.INDEX_FINGER_METACARPAL && jointID != TrackedHandJointID.MIDDLE_FINGER_METACARPAL &&
                    jointID != TrackedHandJointID.RING_FINGER_METACARPAL && jointID != TrackedHandJointID.PINKY_FINGER_METACARPAL)
            ) {
                let jointObject = this._myTrackedHandMeshObject.pp_addChild();
                this._myJointMeshObjectList[jointID] = jointObject;

                jointObject.pp_addComponent(TrackedHandDrawJointComponent,
                    {
                        "_myHandedness": this._myHandedness,
                        "_myJointID": TrackedHandJointIDIndex[jointIDKey],
                        "_myJointMesh": this._myJointMesh,
                        "_myJointMaterial": this._myJointMaterial
                    });

            }
        }
    }
}