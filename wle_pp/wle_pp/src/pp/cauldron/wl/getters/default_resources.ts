import { Material, Mesh } from "@wonderlandengine/api";

export class DefaultResources {

    public myMeshes: DefaultResourcesMeshes = new DefaultResourcesMeshes();
    public myMaterials: DefaultResourcesMaterials = new DefaultResourcesMaterials();
}

export class DefaultResourcesMeshes {

    public myPlane: Mesh | null = null;
    public myCube: Mesh | null = null;
    public mySphere: Mesh | null = null;
    public myCone: Mesh | null = null;
    public myCylinder: Mesh | null = null;
    public myCircle: Mesh | null = null;

    public myInvertedCube: Mesh | null = null;
    public myInvertedSphere: Mesh | null = null;
    public myInvertedCone: Mesh | null = null;
    public myInvertedCylinder: Mesh | null = null;

    public myDoubleSidedPlane: Mesh | null = null;
    public myDoubleSidedCube: Mesh | null = null;
    public myDoubleSidedSphere: Mesh | null = null;
    public myDoubleSidedCone: Mesh | null = null;
    public myDoubleSidedCylinder: Mesh | null = null;
    public myDoubleSidedCircle: Mesh | null = null;
}

export class DefaultResourcesMaterials {

    public myFlatOpaque: Material | null = null;
    /** For now, the pipeline associated to this material needs to be the last one to make it work properly */
    public myFlatTransparentNoDepth: Material | null = null;
    public myPhongOpaque: Material | null = null;
    public myText: Material | null = null;
}