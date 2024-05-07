import { Component, Property } from "@wonderlandengine/api";
import { Timer } from "../../../../cauldron/cauldron/timer.js";
import { EasingFunction, MathUtils } from "../../../../cauldron/utils/math_utils.js";
import { ComponentUtils } from "../../../../cauldron/wl/utils/component_utils.js";
import { vec3_create } from "../../../../plugin/js/extensions/array/vec_create_extension.js";

export class ScaleOnSpawnComponent extends Component {
    static TypeName = "pp-scale-on-spawn";
    static Properties = {
        _myStartDelay: Property.float(0.0),
        _myScaleDuration: Property.float(0.0)
    };

    init() {
        this._myTargetScale = vec3_create(1, 1, 1);
    }

    start() {
        this.object.pp_setScale(MathUtils.EPSILON);

        this._myDelayTimer = new Timer(this._myStartDelay);
        this._myScaleDurationTimer = new Timer(this._myScaleDuration);
    }

    update(dt) {
        if (this._myDelayTimer.isRunning()) {
            this._myDelayTimer.update(dt);
        } else if (this._myScaleDurationTimer.isRunning()) {
            this._myScaleDurationTimer.update(dt);

            this.object.pp_setScale(this._myTargetScale.vec3_scale(EasingFunction.easeOut(this._myScaleDurationTimer.getPercentage())));
        }
    }

    onActivate() {
        this.start();
    }

    pp_clone(targetObject) {
        let clonedComponent = ComponentUtils.cloneDefault(this, targetObject);

        return clonedComponent;
    }
}