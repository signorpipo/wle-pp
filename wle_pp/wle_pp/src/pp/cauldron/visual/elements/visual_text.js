import { Alignment, TextComponent, VerticalAlignment } from "@wonderlandengine/api";
import { mat4_create, vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { AbstractVisualElement, AbstractVisualElementParams } from "./visual_element.js";
import { VisualElementDefaultType } from "./visual_element_types.js";

export class VisualTextParams extends AbstractVisualElementParams {

    /**
     * TS type inference helper
     * 
     * @param {any} engine
     */
    constructor(engine = Globals.getMainEngine()) {
        super(engine);

        this.myText = "";
        this.myAlignment = Alignment.Center;
        this.myVerticalAlignment = VerticalAlignment.Middle;

        this.myTransform = mat4_create();

        this.myMaterial = null;     // null means it will default on myDefaultResources.myMaterials.myDefaultTextMaterial

        this.myColor = null;        // If this is set and material is null, it will use the default text material with this color

        this.myLocal = false;

        this.myLookAtObject = null;

        this.myType = VisualElementDefaultType.TEXT;
    }

    _copyHook(other, deepCopy) {
        // Implemented outside class definition
    }

    _new() {
        return new VisualTextParams(this.myParent.pp_getEngine());
    }

    _equalsHook(other) {
        return this.myText == other.myText &&
            this.myAlignment == other.myAlignment &&
            this.myVerticalAlignment == other.myVerticalAlignment &&
            this.myMaterial == other.myMaterial &&
            this.myLookAtObject == other.myLookAtObject &&
            this.myLocal == other.myLocal &&
            (this.myColor == other.myColor || (this.myColor != null && other.myColor != null && this.myColor.vec_equals(other.myColor))) &&
            this.myTransform.vec_equals(other.myTransform);
    }
}

/**
 * Example:
 * 
 * ```js  
 * const visualParams = new VisualTextParams();
 * visualParams.myText = text;
 * visualParams.myTransform.mat4_copy(transform);
 * visualParams.myMaterial = myDefaultResources.myMaterials.myText.clone();
 * visualParams.myMaterial.color = vec4_create(1, 1, 1, 1);
 * const visualText = new VisualText(visualParams);
 * 
 * // OR
 * 
 * Globals.getVisualManager().draw(visualParams);
 * ```
*/
export class VisualText extends AbstractVisualElement {

    constructor(params = new VisualTextParams()) {
        super(params);

        this._myTextObject = null;
        this._myTextComponent = null;

        this._myTextMaterial = null;

        this._prepare();
    }

    _visibleChanged() {
        this._myTextObject.pp_setActive(this._myVisible);
    }

    _build() {
        this._myTextObject = Globals.getSceneObjects(this._myParams.myParent.pp_getEngine()).myVisualElements.pp_addChild();
        this._myTextComponent = this._myTextObject.pp_addComponent(TextComponent);
    }

    _refreshHook() {
        // Implemented outside class definition
    }

    _new(params) {
        return new VisualText(params);
    }

    _destroyHook() {
        this._myTextObject.pp_destroy();
    }
}



// IMPLEMENTATION

VisualTextParams.prototype._copyHook = function _copyHook(other, deepCopy) {
    this.myText = other.myText;
    this.myAlignment = other.myAlignment;
    this.myVerticalAlignment = other.myVerticalAlignment;

    this.myTransform.mat4_copy(other.myTransform);

    if (other.myMaterial != null && deepCopy) {
        this.myMaterial = other.myMaterial.clone();
    } else {
        this.myMaterial = other.myMaterial;
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

    this.myLocal = other.myLocal;

    this.myLookAtObject = other.myLookAtObject;
};

VisualText.prototype._refreshHook = function () {
    let lookAtPosition = vec3_create();
    return function _refreshHook() {
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
        this._myTextComponent.verticalAlignment = this._myParams.myVerticalAlignment;

        this._myDirty = false;
    };
}();