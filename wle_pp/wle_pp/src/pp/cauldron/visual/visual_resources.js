export class VisualResources {

    constructor() {
        this.myDefaultMaterials = new VisualResourcesMaterials();
    }
}

export class VisualResourcesMaterials {

    constructor() {
        this.myMesh = null;
        this.myText = null;
        this.myRight = null;
        this.myUp = null;
        this.myForward = null;
        this.myRay = null;
        this.myHitNormal = null;
    }
}