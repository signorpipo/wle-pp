import { Alignment, Component, Property, VerticalAlignment } from "@wonderlandengine/api";
import { Timer } from "../../cauldron/cauldron/timer.js";
import { vec3_create, vec4_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../pp/globals.js";

export class ShowFPSComponent extends Component {
    static TypeName = "pp-show-fps";
    static Properties = {
        _myRefreshSeconds: Property.float(0.25),
        _myScreenPositionX: Property.float(1),
        _myScreenPositionY: Property.float(-1),
        _myScreenPositionZ: Property.float(1),
        _myScale: Property.float(1.5),
        _myTextMaterial: Property.material()
    };

    start() {
        this._myColor = vec4_create(1, 1, 1, 1);
        if (this._myTextMaterial != null) {
            this._myColor.vec4_copy(this._myTextMaterial.color);
        }

        this._myScreenPosition = vec3_create(this._myScreenPositionX, this._myScreenPositionY, this._myScreenPositionZ);

        this._myCurrentFPS = 0;

        this._myTimer = new Timer(this._myRefreshSeconds);
        this._myTotalDT = 0;
        this._myFrames = 0;
    }

    update(dt) {
        if (Globals.isDebugEnabled(this.engine) && Globals.getDebugVisualManager(this.engine) != null) {
            this._myTotalDT += dt;
            this._myFrames++;

            this._myTimer.update(dt);
            if (this._myTimer.isDone()) {
                this._myTimer.start();

                this._myCurrentFPS = Math.round(this._myFrames / this._myTotalDT);

                this._myTotalDT = 0;
                this._myFrames = 0;
            }

            Globals.getDebugVisualManager(this.engine).drawUIText(0, this._myCurrentFPS.toFixed(0), this._myScreenPosition, this._myScale, this._myColor, Alignment.Right, VerticalAlignment.Bottom);
        }
    }
}