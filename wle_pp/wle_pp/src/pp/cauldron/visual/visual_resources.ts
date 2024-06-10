import { Material } from "@wonderlandengine/api";

export class VisualResources {

    public myDefaultMaterials: VisualResourcesMaterials = new VisualResourcesMaterials();
}

export class VisualResourcesMaterials {

    public myMesh: Material | null = null;
    public myText: Material | null = null;
    public myRight: Material | null = null;
    public myUp: Material | null = null;
    public myForward: Material | null = null;
    public myRay: Material | null = null;
    public myHitNormal: Material | null = null;
}