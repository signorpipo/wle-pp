export class VisualData {

    constructor() {
        this.myRootObject = null;
        this.myDefaultMaterials = new VisualDataMaterials();
    }
}

export class VisualDataMaterials {

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