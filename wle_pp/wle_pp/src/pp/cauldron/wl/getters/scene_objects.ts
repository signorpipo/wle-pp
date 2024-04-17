import { Object3D } from "@wonderlandengine/api";
import { Handedness } from "../../../input/cauldron/input_types.js";

export class SceneObjects {

    public myRoot: Object3D | null = null;

    public myScene: Object3D | null = null;

    public myCauldron: Object3D | null = null;
    public myDynamics: Object3D | null = null;
    public myParticles: Object3D | null = null;
    public myVisualElements: Object3D | null = null;
    public myTools: Object3D | null = null;

    public myPlayerObjects: PlayerObjects = new PlayerObjects();
}

export class PlayerObjects {

    public myPlayer: Object3D | null = null;

    public myCauldron: Object3D | null = null;
    public myReferenceSpace: Object3D | null = null;

    public myCameraNonXR: Object3D | null = null;

    public myEyes: Record<Handedness, Object3D | null> = { [Handedness.LEFT]: null, [Handedness.RIGHT]: null };
    public myEyeLeft: Object3D | null = null;
    public myEyeRight: Object3D | null = null;

    public myHands: Record<Handedness, Object3D | null> = { [Handedness.LEFT]: null, [Handedness.RIGHT]: null };
    public myHandLeft: Object3D | null = null;
    public myHandRight: Object3D | null = null;

    public myHead: Object3D | null = null;
    public myHeadDebugs: Object3D | null = null;
}