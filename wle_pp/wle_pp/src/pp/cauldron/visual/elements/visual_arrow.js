import { MeshComponent } from "@wonderlandengine/api";
import { vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { AbstractVisualElement, AbstractVisualElementParams } from "./visual_element.js";
import { VisualElementDefaultType } from "./visual_element_types.js";
import { VisualLine, VisualLineParams } from "./visual_line.js";

export class VisualArrowParams extends AbstractVisualElementParams {

    /**
     * TS type inference helper
     * 
     * @param {any} engine
     */
    constructor(engine = Globals.getMainEngine()) {
        super(engine);

        this.myStart = vec3_create();
        this.myDirection = vec3_create(0, 0, 1);
        this.myLength = 0;

        this.myThickness = 0.005;

        this.myArrowThickness = null;   // null means this.myThickness * 1.5 will be used
        this.myArrowLength = null;      // null means this.myThickness * 3.5 will be used

        this.myShareArrowLengthWithLineWhenArrowLongerThanLength = true;

        this.myLineMesh = null;     // The mesh is scaled along up axis, null means it will default on myDefaultResources.myMeshes.myCylinder
        this.myArrowMesh = null;    // The mesh is scaled along up axis, null means it will default on myDefaultResources.myMeshes.myCone

        this.myMaterial = null;     // null means it will default on myDefaultResources.myMaterials.myFlatOpaque
        this.myColor = null;        // If this is set and material is null, it will use the default flat opaque material with this color

        this.myLocal = false;

        this.myType = VisualElementDefaultType.ARROW;
    }

    setStartEnd(start, end) {
        end.vec3_sub(start, this.myDirection);
        this.myLength = this.myDirection.vec3_length();
        this.myDirection.vec3_normalize(this.myDirection);
        this.myStart.vec3_copy(start);

        return this;
    }

    _copyHook(other) {
        // Implemented outside class definition
    }

    _new() {
        return new VisualArrowParams();
    }
}

/**
 * Example:
 * 
 * ```js  
 * const visualParams = new VisualArrowParams();
 * visualParams.myStart.vec3_copy(start);
 * visualParams.myDirection.vec3_copy(direction);
 * visualParams.myLength = 0.2;
 * visualParams.myMaterial = Globals.getDefaultMaterials().myFlatOpaque.clone();
 * visualParams.myMaterial.color = vec4_create(1, 1, 1, 1);
 * const visualArrow = new VisualArrow(visualParams);
 * Globals.getVisualManager().draw(visualParams);
 * 
 * // OR
 * 
 * Globals.getVisualManager().draw(visualParams);
 * ```
*/
export class VisualArrow extends AbstractVisualElement {

    constructor(params = new VisualArrowParams()) {
        super(params);

        this._myVisualLine = new VisualLine(new VisualLineParams(this._myParams.myParent.pp_getEngine()));
        this._myVisualLine.setAutoRefresh(false);

        this._myArrowParentObject = null;
        this._myArrowObject = null;
        this._myArrowMeshComponent = null;

        this._myFlatOpaqueMaterial = null;

        this._prepare();
    }

    _visibleChanged() {
        this._myVisualLine.setVisible(this._myVisible);
        this._myArrowParentObject.pp_setActive(this._myVisible);
    }

    _updateHook(dt) {
        this._myVisualLine.update(dt);
    }

    _build() {
        this._myArrowParentObject = Globals.getSceneObjects(this._myParams.myParent.pp_getEngine()).myVisualElements.pp_addObject();
        this._myArrowObject = this._myArrowParentObject.pp_addObject();

        this._myArrowMeshComponent = this._myArrowObject.pp_addComponent(MeshComponent);
    }

    _refresh() {
        // Implemented outside class definition
    }

    _new(params) {
        return new VisualArrow(params);
    }

    _destroyHook() {
        this._myVisualLine.destroy();
        this._myArrowParentObject.pp_destroy();
    }
}



// IMPLEMENTATION

VisualArrow.prototype._refresh = function () {
    let arrowPosition = vec3_create();
    let parentTranslate = vec3_create();
    let arrowScale = vec3_create();

    let forward = vec3_create(0, 1, 0);
    return function _refresh() {
        this._myArrowParentObject.pp_setParent(this._myParams.myParent, false);

        let arrowThickness = (this._myParams.myArrowThickness != null) ? this._myParams.myArrowThickness : this._myParams.myThickness * 1.5;
        let arrowLength = (this._myParams.myArrowLength != null) ? this._myParams.myArrowLength : this._myParams.myThickness * 3.5;

        if (this._myParams.myShareArrowLengthWithLineWhenArrowLongerThanLength && arrowLength > this._myParams.myLength / 2) {
            arrowLength = this._myParams.myLength / 2;
        }

        arrowLength = Math.min(arrowLength, this._myParams.myLength);

        arrowScale.vec3_set(arrowThickness, arrowLength / 2, arrowThickness);

        let lineLength = this._myParams.myLength - arrowLength;

        this._myParams.myDirection.vec3_scale(lineLength, arrowPosition);
        arrowPosition.vec3_add(this._myParams.myStart, arrowPosition);

        if (this._myParams.myLocal) {
            this._myArrowParentObject.pp_setPositionLocal(arrowPosition);
            this._myArrowParentObject.pp_setUpLocal(this._myParams.myDirection, forward);
        } else {
            this._myArrowParentObject.pp_setPosition(arrowPosition);
            this._myArrowParentObject.pp_setUp(this._myParams.myDirection, forward);
        }

        parentTranslate.vec3_set(0, (arrowLength / 2) - 0.00001, 0);
        this._myArrowParentObject.pp_translateObject(parentTranslate);

        if (this._myParams.myLocal) {
            this._myArrowObject.pp_setScaleLocal(arrowScale);
        } else {
            this._myArrowObject.pp_setScale(arrowScale);
        }

        if (this._myParams.myArrowMesh != null) {
            this._myArrowMeshComponent.mesh = this._myParams.myArrowMesh;
        } else {
            this._myArrowMeshComponent.mesh = Globals.getDefaultMeshes(this._myParams.myParent.pp_getEngine()).myCone;
        }

        if (this._myParams.myMaterial == null) {
            if (this._myParams.myColor == null) {
                this._myArrowMeshComponent.material = Globals.getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myMesh;
            } else {
                if (this._myFlatOpaqueMaterial == null) {
                    this._myFlatOpaqueMaterial = Globals.getDefaultMaterials(this._myParams.myParent.pp_getEngine()).myFlatOpaque.clone();
                }
                this._myArrowMeshComponent.material = this._myFlatOpaqueMaterial;
                this._myFlatOpaqueMaterial.color = this._myParams.myColor;
            }
        } else {
            this._myArrowMeshComponent.material = this._myParams.myMaterial;
        }

        let visualLineParams = this._myVisualLine.getParams();
        visualLineParams.myStart.vec3_copy(this._myParams.myStart);
        visualLineParams.myDirection.vec3_copy(this._myParams.myDirection);
        visualLineParams.myLength = lineLength;
        visualLineParams.myThickness = this._myParams.myThickness;
        visualLineParams.myMesh = this._myParams.myLineMesh;

        visualLineParams.myMaterial = this._myArrowMeshComponent.material;

        visualLineParams.myParent = this._myParams.myParent;
        visualLineParams.myLocal = this._myParams.myLocal;

        this._myVisualLine.paramsUpdated();
    };
}();

VisualArrowParams.prototype._copyHook = function _copyHook(other) {
    this.myStart.vec3_copy(other.myStart);
    this.myDirection.vec3_copy(other.myDirection);
    this.myLength = other.myLength;
    this.myThickness = other.myThickness;

    this.myArrowThickness = other.myArrowThickness;
    this.myArrowLength = other.myArrowLength;

    this.myShareArrowLengthWithLineWhenArrowLongerThanLength = other.myShareArrowLengthWithLineWhenArrowLongerThanLength;

    this.myArrowMesh = other.myArrowMesh;
    this.myLineMesh = other.myLineMesh;

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

    this.myLocal = other.myLocal;
};