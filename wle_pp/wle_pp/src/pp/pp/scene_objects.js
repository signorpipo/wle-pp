export class SceneObjects {

    constructor() {
        this.myScene = null;

        this.myCauldron = null;
        this.myDynamics = null;
        this.myParticles = null;
        this.myVisualElements = null;
        this.myTools = null;

        this.myPlayerObjects = new PlayerObjects();
    }
}

export class PlayerObjects {

    constructor() {
        this.myPlayer = null;

        this.myCauldron = null;
        this.myReferenceSpace = null;

        this.myCameraNonXR = null;

        this.myEyes = [];
        this.myEyeLeft = null;
        this.myEyeRight = null;

        this.myHands = [];
        this.myHandLeft = null;
        this.myHandRight = null;

        this.myHead = null;
        this.myHeadDebugs = null;
    }
}