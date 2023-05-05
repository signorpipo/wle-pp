import { Component, PhysXComponent, Property } from "@wonderlandengine/api";

export class AdjustHierarchyPhysXScaleComponent extends Component {
    static TypeName = "pp-adjust-hierarchy-physx-scale";
    static Properties = {
        _myWhen: Property.enum(["Init", "Start", "First Update"], "Start")
    };

    init() {
        if (this.active && this._myWhen == 0) {
            this._adjustScale();
        }
    }

    start() {
        if (this._myWhen == 1) {
            this._adjustScale();
        }
        this._myFirst = true;
    }

    update(dt) {
        if (this._myWhen == 2 && this._myFirst) {
            this._myFirst = false;
            this._adjustScale();
        }
    }

    _adjustScale() {
        let scale = this.object.pp_getScale();
        let physXComponents = this.object.pp_getComponents(PhysXComponent);
        for (let physX of physXComponents) {
            physX.extents[0] = physX.extents[0] * scale[0];
            physX.extents[1] = physX.extents[1] * scale[1];
            physX.extents[2] = physX.extents[2] * scale[2];

            if (physX.active) {
                physX.active = false;
                physX.active = true;
            }
        }
    }
}