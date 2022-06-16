WL.registerComponent("pp-get-player-objects", {
    _myPlayer: { type: WL.Type.Object },
    _myPlayerPivot: { type: WL.Type.Object },
    _myNonVRCamera: { type: WL.Type.Object },
    _myNonVRHead: { type: WL.Type.Object },
    _myHead: { type: WL.Type.Object },
    _myEyeLeft: { type: WL.Type.Object },
    _myEyeRight: { type: WL.Type.Object },
    _myHandLeft: { type: WL.Type.Object },
    _myHandRight: { type: WL.Type.Object }
}, {
    init: function () {
        PP.myPlayerObjects.myPlayer = this._myPlayer;
        PP.myPlayerObjects.myPlayerPivot = this._myPlayerPivot;
        PP.myPlayerObjects.myNonVRCamera = this._myNonVRCamera;
        PP.myPlayerObjects.myNonVRHead = this._myNonVRHead;
        PP.myPlayerObjects.myHead = this._myHead;
        PP.myPlayerObjects.myEyeLeft = this._myEyeLeft;
        PP.myPlayerObjects.myEyeRight = this._myEyeRight;
        PP.myPlayerObjects.myHandLeft = this._myHandLeft;
        PP.myPlayerObjects.myHandRight = this._myHandRight;

        PP.myPlayerObjects.myEyes = [];
        PP.myPlayerObjects.myEyes[PP.Handedness.LEFT] = this._myEyeLeft;
        PP.myPlayerObjects.myEyes[PP.Handedness.RIGHT] = this._myEyeRight;

        PP.myPlayerObjects.myHands = [];
        PP.myPlayerObjects.myHands[PP.Handedness.LEFT] = this._myHandLeft;
        PP.myPlayerObjects.myHands[PP.Handedness.RIGHT] = this._myHandRight;
    },
});

PP.myPlayerObjects = {
    myPlayer: null,
    myPlayerPivot: null,
    myNonVRCamera: null,
    myNonVRHead: null,
    myHead: null,
    myEyeLeft: null,
    myEyeRight: null,
    myEyes: [],
    myHandLeft: null,
    myHandRight: null,
    myHands: [],
};