/*
let visualParams = new VisualTextParams();
visualParams.myText = text;
visualParams.myTransform.mat4_copy(transform);
visualParams.myMaterial = myDefaultResources.myMaterials.myText.clone();
visualParams.myMaterial.color = vec4_create(1, 1, 1, 1);
Globals.getVisualManager().draw(visualParams);

or

let visualText = new VisualText(visualParams);
*/

import { Alignment, Justification, TextComponent } from "@wonderlandengine/api";
import { mat4_create, vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { VisualElementType } from "./visual_element_types.js";

export class VisualTextParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myText = "";
        this.myAlignment = Alignment.Center;
        this.myJustification = Justification.Middle;

        this.myTransform = mat4_create();

        this.myMaterial = null;     // null means it will default on myDefaultResources.myMaterials.myDefaultTextMaterial

        this.myColor = null;        // If this is set and material is null, it will use the default text material with this color

        this.myParent = Globals.getSceneObjects(engine).myVisualElements;
        this.myLocal = false;

        this.myLookAtObject = null;

        this.myType = VisualElementType.TEXT;
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class VisualText {

    constructor(params = new VisualTextParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myTextObject = null;
        this._myTextComponent = null;

        this._myTextMaterial = null;

        this._myDestroyed = false;

        this._build();
        this.forceRefresh();

        this.setVisible(true);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myTextObject.pp_setActive(visible);
        }
    }

    setAutoRefresh(autoRefresh) {
        this._myAutoRefresh = autoRefresh;
    }

    getParams() {
        return this._myParams;
    }

    setParams(params) {
        this._myParams = params;
        this._markDirty();
    }

    copyParams(params) {
        this._myParams.copy(params);
        this._markDirty();
    }

    paramsUpdated() {
        this._markDirty();
    }

    refresh() {
        this.update(0);
    }

    forceRefresh() {
        this._refresh();
    }

    update(dt) {
        if (this._myDirty || this._myParams.myLookAtObject != null) {
            this._refresh();

            this._myDirty = false;
        }
    }

    _refresh() {
        // Implemented outside class definition
    }

    _build() {
        this._myTextObject = Globals.getSceneObjects(this._myParams.myParent.pp_getEngine()).myVisualElements.pp_addObject();
        this._myTextComponent = this._myTextObject.pp_addComponent(TextComponent);
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new VisualTextParams(this._myParams.myParent.pp_getEngine());
        clonedParams.copy(this._myParams);

        let clone = new VisualText(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }

    destroy() {
        this._myDestroyed = true;

        this._myTextObject.pp_destroy();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

VisualTextParams.prototype.copy = function copy(other) {
    this.myText = other.myText;
    this.myAlignment = other.myAlignment;
    this.myJustification = other.myJustification;

    this.myTransform.mat4_copy(other.myTransform);

    if (other.myMaterial != null) {
        this.myMaterial = other.myMaterial.clone();
    } else {
        this.myMaterial = null;
    }

    if (other.myColor != null) {
        if (this.myColor != null) {
            this.myColor.vec4_copy(other.myColor);
        } else {
            this.myColor = other.myColor.vec4_clone();
        }
    } else {
        this.myColor = null;
    }

    this.myParent = other.myParent;
    this.myLocal = other.myLocal;

    this.myLookAtObject = other.myLookAtObject;

    this.myType = other.myType;
};

VisualText.prototype._refresh = function () {
    let lookAtPosition = vec3_create();
    return function _refresh() {
        this._myTextObject.pp_setParent(this._myParams.myParent, false);

        if (this._myParams.myLocal) {
            this._myTextObject.pp_setTransformLocal(this._myParams.myTransform);
        } else {
            this._myTextObject.pp_setTransform(this._myParams.myTransform);
        }

        if (this._myParams.myLookAtObject != null) {
            this._myParams.myLookAtObject.pp_getPosition(lookAtPosition);
            this._myTextObject.pp_lookAt(lookAtPosition);
        }

        if (this._myParams.myMaterial == null) {
            if (this._myParams.myColor == null) {
                this._myTextComponent.material = Globals.getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myText;
            } else {
                if (this._myTextMaterial == null) {
                    this._myTextMaterial = Globals.getDefaultMaterials(this._myParams.myParent.pp_getEngine()).myText.clone();
                }
                this._myTextComponent.material = this._myTextMaterial;
                this._myTextMaterial.color = this._myParams.myColor;
            }
        } else {
            this._myTextComponent.material = this._myParams.myMaterial;
        }

        this._myTextComponent.text = this._myParams.myText;
        this._myTextComponent.alignment = this._myParams.myAlignment;
        this._myTextComponent.justification = this._myParams.myJustification;

        this._myDirty = false;
    };
}();