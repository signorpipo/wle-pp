import { Material, Mesh, MeshComponent, Object3D } from "@wonderlandengine/api";
import { Matrix4 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { mat4_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { AbstractVisualElement, AbstractVisualElementParams } from "./visual_element.js";
import { VisualElementDefaultType } from "./visual_element_types.js";

export class VisualMeshParams extends AbstractVisualElementParams<VisualMeshParams> {

    public readonly myType: unknown | VisualElementDefaultType = VisualElementDefaultType.MESH;

    public myTransform: Matrix4 = mat4_create();
    public myLocal: boolean = false;


    /** `null` means it will default to `Globals.getDefaultMeshes().mySphere` */
    public myMesh: Mesh | null = null;

    /** `null` means it will default to `Globals.getVisualResources().myDefaultMaterials.myMesh` */
    public myMaterial: Material | null = null;


    protected _copyHook(other: Readonly<VisualMeshParams>): void {
        this.myTransform.pp_copy(other.myTransform);

        if (other.myMesh != null) {
            this.myMesh = other.myMesh;
        } else {
            this.myMesh = null;
        }

        if (other.myMaterial != null) {
            this.myMaterial = other.myMaterial.clone();
        } else {
            this.myMaterial = null;
        }

        this.myLocal = other.myLocal;
    }

    protected _new(): VisualMeshParams {
        return new VisualMeshParams();
    }
}

/**
 * Example:
 * 
 * ```js  
 * const visualParams = new VisualMeshParams();
 * visualParams.myTransform = transform;
 * visualParams.myMesh = Globals.getDefaultMeshes().mySphere;
 * visualParams.myMaterial = Globals.getDefaultMaterials().myFlatOpaque.clone();
 * visualParams.myMaterial.color = vec4_create(1, 1, 1, 1);
 * 
 * const visualMesh = new VisualMesh(visualParams);
 * 
 * // OR
 * 
 * Globals.getVisualManager().draw(visualParams);
 * ```
 */
export class VisualMesh extends AbstractVisualElement<VisualMesh, VisualMeshParams> {

    private readonly _myMeshObject!: Object3D;
    private readonly _myMeshComponent!: MeshComponent;

    constructor(params: VisualMeshParams = new VisualMeshParams()) {
        super(params);
        this._prepare();
    }

    protected override _visibleChanged(): void {
        this._myMeshObject.pp_setActive(this._myVisible);
    }

    protected _build(): void {
        (this._myMeshObject as Object3D) = Globals.getSceneObjects(this._myParams.myParent.pp_getEngine())!.myVisualElements!.pp_addObject();

        (this._myMeshComponent as MeshComponent) = this._myMeshObject.pp_addComponent(MeshComponent)!;
    }

    protected _refresh(): void {
        this._myMeshObject.pp_setParent(this._myParams.myParent, false);

        if (this._myParams.myLocal) {
            this._myMeshObject.pp_setTransformLocal(this._myParams.myTransform);
        } else {
            this._myMeshObject.pp_setTransform(this._myParams.myTransform);
        }

        if (this._myParams.myMesh == null) {
            this._myMeshComponent.mesh = Globals.getDefaultMeshes(this._myParams.myParent.pp_getEngine())!.mySphere;
        } else {
            this._myMeshComponent.mesh = this._myParams.myMesh;
        }

        if (this._myParams.myMaterial == null) {
            this._myMeshComponent.material = Globals.getVisualResources(this._myParams.myParent.pp_getEngine())!.myDefaultMaterials.myMesh;
        } else {
            this._myMeshComponent.material = this._myParams.myMaterial;
        }
    }

    protected _new(params: VisualMeshParams): VisualMesh {
        return new VisualMesh(params);
    }

    protected override _destroyHook(): void {
        this._myMeshObject.pp_destroy();
    }
}