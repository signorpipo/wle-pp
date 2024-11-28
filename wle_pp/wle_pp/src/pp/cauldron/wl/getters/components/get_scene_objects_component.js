import { Component, Property } from "@wonderlandengine/api";
import { Handedness } from "../../../../input/cauldron/input_types.js";
import { Globals } from "../../../../pp/globals.js";
import { SceneObjects } from "../scene_objects.js";

export class GetSceneObjectsComponent extends Component {
    static TypeName = "pp-get-scene-objects";
    static Properties = {
        _myRoot: Property.object(),

        _myScene: Property.object(),

        _myPlayer: Property.object(),
        _myReferenceSpace: Property.object(),   // If u don't have a pivot under the player you set this to null, by default will be the same as the player
        _myCameraNonXR: Property.object(),
        _myEyeLeft: Property.object(),
        _myEyeRight: Property.object(),
        _myHandLeft: Property.object(),
        _myHandRight: Property.object(),
        _myHead: Property.object()
    };

    start() {
        this._mySceneObjects = new SceneObjects();

        this._mySceneObjects.myRoot = this._myRoot;

        this._mySceneObjects.myScene = this._myScene;

        this._mySceneObjects.myPlayerObjects.myPlayer = this._myPlayer;
        this._mySceneObjects.myPlayerObjects.myReferenceSpace = this._myReferenceSpace;

        this._mySceneObjects.myPlayerObjects.myCameraNonXR = this._myCameraNonXR;

        this._mySceneObjects.myPlayerObjects.myEyeLeft = this._myEyeLeft;
        this._mySceneObjects.myPlayerObjects.myEyeRight = this._myEyeRight;

        this._mySceneObjects.myPlayerObjects.myHandLeft = this._myHandLeft;
        this._mySceneObjects.myPlayerObjects.myHandRight = this._myHandRight;

        this._mySceneObjects.myPlayerObjects.myEyes[Handedness.LEFT] = this._myEyeLeft;
        this._mySceneObjects.myPlayerObjects.myEyes[Handedness.RIGHT] = this._myEyeRight;

        this._mySceneObjects.myPlayerObjects.myHands[Handedness.LEFT] = this._myHandLeft;
        this._mySceneObjects.myPlayerObjects.myHands[Handedness.RIGHT] = this._myHandRight;

        this._mySceneObjects.myPlayerObjects.myHead = this._myHead;

        if (this._mySceneObjects.myPlayerObjects.myReferenceSpace == null) {
            this._mySceneObjects.myPlayerObjects.myReferenceSpace = this._mySceneObjects.myPlayerObjects.myPlayer;
        }

        this._mySceneObjects.myCauldron = this._mySceneObjects.myScene.pp_addChild();
        this._mySceneObjects.myCauldron.pp_setName("Cauldron");
        this._mySceneObjects.myDynamics = this._mySceneObjects.myScene.pp_addChild();
        this._mySceneObjects.myDynamics.pp_setName("Dynamics");
        this._mySceneObjects.myParticles = this._mySceneObjects.myScene.pp_addChild();
        this._mySceneObjects.myParticles.pp_setName("Particles");
        this._mySceneObjects.myVisualElements = this._mySceneObjects.myScene.pp_addChild();
        this._mySceneObjects.myVisualElements.pp_setName("Visual Elements");
        this._mySceneObjects.myTools = this._mySceneObjects.myScene.pp_addChild();
        this._mySceneObjects.myTools.pp_setName("Tools");

        this._mySceneObjects.myPlayerObjects.myCauldron = this._mySceneObjects.myPlayerObjects.myPlayer.pp_addChild();
        this._mySceneObjects.myPlayerObjects.myCauldron.pp_setName("Cauldron");
        this._mySceneObjects.myPlayerObjects.myHeadDebugs = this._mySceneObjects.myPlayerObjects.myHead.pp_addChild();
        this._mySceneObjects.myPlayerObjects.myHeadDebugs.pp_setName("Head Debugs");
    }

    onActivate() {
        if (!Globals.hasSceneObjects(this.engine)) {
            Globals.setSceneObjects(this._mySceneObjects, this.engine);
        }
    }

    onDeactivate() {
        if (this._mySceneObjects != null && Globals.getSceneObjects(this.engine) == this._mySceneObjects) {
            Globals.removeSceneObjects(this.engine);
        }
    }
}