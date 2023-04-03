import { Component, Property } from "@wonderlandengine/api";
import { vec4_create } from "../../../plugin/js/extensions/array_extension";
import { getDefaultResources } from "../../../pp/default_resources_global";
import { VisualData } from "../visual_data";
import { getVisualData, getVisualManager, hasVisualData, hasVisualManager, removeVisualData, removeVisualManager, setVisualData, setVisualManager } from "../visual_globals";
import { VisualManager } from "../visual_manager";

export class VisualManagerComponent extends Component {
    static TypeName = "pp-visual-manager";
    static Properties = {};

    init() {
        this._myVisualManager = null;

        // Prevents double global from same engine
        if (!hasVisualManager(this.engine)) {
            this._myVisualManager = new VisualManager(this.engine);

            setVisualManager(this._myVisualManager, this.engine);
        }

        // Prevents double global from same engine
        if (!hasVisualData(this.engine)) {
            this._myVisualData = new VisualData();
            this._myVisualData.myRootObject = this.engine.scene.pp_addObject();

            setVisualData(this._myVisualData, this.engine);
        }
    }

    start() {
        if (this._myVisualData != null) {
            this._myVisualData.myDefaultMaterials.myMesh = getDefaultResources(this.engine).myMaterials.myFlatOpaque.clone();

            this._myVisualData.myDefaultMaterials.myText = getDefaultResources(this.engine).myMaterials.myText.clone();

            this._myVisualData.myDefaultMaterials.myRight = getDefaultResources(this.engine).myMaterials.myFlatOpaque.clone();
            this._myVisualData.myDefaultMaterials.myRight.color = vec4_create(1, 0, 0, 1);
            this._myVisualData.myDefaultMaterials.myUp = getDefaultResources(this.engine).myMaterials.myFlatOpaque.clone();
            this._myVisualData.myDefaultMaterials.myUp.color = vec4_create(0, 1, 0, 1);
            this._myVisualData.myDefaultMaterials.myForward = getDefaultResources(this.engine).myMaterials.myFlatOpaque.clone();
            this._myVisualData.myDefaultMaterials.myForward.color = vec4_create(0, 0, 1, 1);

            this._myVisualData.myDefaultMaterials.myRay = getDefaultResources(this.engine).myMaterials.myFlatOpaque.clone();
            this._myVisualData.myDefaultMaterials.myRay.color = vec4_create(0, 1, 0, 1);
            this._myVisualData.myDefaultMaterials.myHitNormal = getDefaultResources(this.engine).myMaterials.myFlatOpaque.clone();
            this._myVisualData.myDefaultMaterials.myHitNormal.color = vec4_create(1, 0, 0, 1);
        }

        if (this.myVisualManager != null) {
            this.myVisualManager.start();
        }
    }

    update(dt) {
        if (this.myVisualManager != null) {
            this.myVisualManager.update(dt);
        }
    }

    onDestroy() {
        if (this._myVisualManager != null && getVisualManager(this.engine) == this._myVisualManager) {
            removeVisualManager(this.engine);
        }

        if (this._myVisualData != null && getVisualData(this.engine) == this._myVisualData) {
            removeVisualData(this.engine);
        }
    }
}