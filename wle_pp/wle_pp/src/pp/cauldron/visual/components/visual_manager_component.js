import { Component } from "@wonderlandengine/api";
import { vec4_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { VisualManager } from "../visual_manager.js";
import { VisualResources } from "../visual_resources.js";

export class VisualManagerComponent extends Component {
    static TypeName = "pp-visual-manager";

    init() {
        this._myVisualManager = new VisualManager(this.engine);

        this._myVisualResources = new VisualResources();
    }

    start() {
        this._myVisualResources.myDefaultMaterials.myMesh = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();

        this._myVisualResources.myDefaultMaterials.myText = Globals.getDefaultMaterials(this.engine).myText.clone();

        this._myVisualResources.myDefaultMaterials.myRight = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
        this._myVisualResources.myDefaultMaterials.myRight.color = vec4_create(1, 0, 0, 1);
        this._myVisualResources.myDefaultMaterials.myUp = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
        this._myVisualResources.myDefaultMaterials.myUp.color = vec4_create(0, 1, 0, 1);
        this._myVisualResources.myDefaultMaterials.myForward = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
        this._myVisualResources.myDefaultMaterials.myForward.color = vec4_create(0, 0, 1, 1);

        this._myVisualResources.myDefaultMaterials.myRay = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
        this._myVisualResources.myDefaultMaterials.myRay.color = vec4_create(0, 1, 0, 1);
        this._myVisualResources.myDefaultMaterials.myHitNormal = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
        this._myVisualResources.myDefaultMaterials.myHitNormal.color = vec4_create(1, 0, 0, 1);

        this._myVisualManager.start();
    }

    update(dt) {
        if (Globals.getVisualManager(this.engine) == this._myVisualManager) {
            this._myVisualManager.update(dt);
        }
    }

    onActivate() {
        if (!Globals.hasVisualManager(this.engine)) {
            this._myVisualManager.setActive(true);

            Globals.setVisualManager(this._myVisualManager, this.engine);
        }

        if (!Globals.hasVisualResources(this.engine)) {
            Globals.setVisualResources(this._myVisualResources, this.engine);
        }
    }

    onDeactivate() {
        this._myVisualManager.setActive(false);

        if (Globals.getVisualManager(this.engine) == this._myVisualManager) {
            Globals.removeVisualManager(this.engine);
        }

        if (Globals.getVisualResources(this.engine) == this._myVisualResources) {
            Globals.removeVisualResources(this.engine);
        }
    }

    onDestroy() {
        if (this._myVisualManager != null) {
            this._myVisualManager.destroy();
        }
    }
}