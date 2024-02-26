import { Globals } from "../../pp/globals";

export let KeyID = {
    _0: "0",
    _1: "1",
    _2: "2",
    _3: "3",
    _4: "4",
    _5: "5",
    _6: "6",
    _7: "7",
    _8: "8",
    _9: "9",

    A: "A",
    B: "B",
    C: "C",
    D: "D",
    E: "E",
    F: "F",
    G: "G",
    H: "H",
    I: "I",
    J: "J",
    K: "K",
    L: "L",
    M: "M",
    N: "N",
    O: "O",
    P: "P",
    Q: "Q",
    R: "R",
    S: "S",
    T: "T",
    U: "U",
    V: "V",
    W: "W",
    X: "X",
    Y: "Y",
    Z: "Z",

    a: "a",
    b: "b",
    c: "c",
    d: "d",
    e: "e",
    f: "f",
    g: "g",
    h: "h",
    i: "i",
    j: "j",
    k: "k",
    l: "l",
    m: "m",
    n: "n",
    o: "o",
    p: "p",
    q: "q",
    r: "r",
    s: "s",
    t: "t",
    u: "u",
    v: "v",
    w: "w",
    x: "x",
    y: "y",
    z: "z",

    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",

    SPACE: " ",
    ENTER: "Enter",
    BACKSPACE: "Backspace",
    ESC: "Escape",

    SHIFT_LEFT: "ShiftLeft",
    SHIFT_RIGHT: "ShiftRight",
    CONTROL_LEFT: "ControlLeft",
    CONTROL_RIGHT: "ControlRight",
    ALT_LEFT: "AltLeft",
    ALT_RIGHT: "AltRight"
};

export class Keyboard {

    constructor(engine = Globals.getMainEngine()) {
        this._myEngine = engine;

        this._myKeyInfos = {};
        this._myKeyInfosIDs = [];
        for (let key in KeyID) {
            this.addKey(KeyID[key]);
        }

        this._myOnKeyDownEventListener = null;
        this._myOnKeyUpEventListener = null;

        this._myDestroyed = false;
    }

    isKeyPressed(keyID) {
        let pressed = false;

        if (this._myKeyInfos[keyID] != null) {
            pressed = this._myKeyInfos[keyID].myPressed;
        }

        return pressed;
    }

    isKeyPressStart(keyID) {
        let pressStart = false;

        if (this._myKeyInfos[keyID] != null) {
            pressStart = this._myKeyInfos[keyID].myPressStart;
        }

        return pressStart;
    }

    isKeyPressEnd(keyID) {
        let pressEnd = false;

        if (this._myKeyInfos[keyID] != null) {
            pressEnd = this._myKeyInfos[keyID].myPressEnd;
        }

        return pressEnd;
    }

    addKey(keyID) {
        this._myKeyInfos[keyID] = this._createKeyInfo();
        this._myKeyInfosIDs.push(keyID);
    }

    start() {
        this._myOnKeyDownEventListener = this._keyDown.bind(this);
        Globals.getWindow(this._myEngine).addEventListener("keydown", this._myOnKeyDownEventListener);
        this._myOnKeyUpEventListener = this._keyUp.bind(this);
        Globals.getWindow(this._myEngine).addEventListener("keyup", this._myOnKeyUpEventListener);
    }

    update(dt) {
        if (!Globals.getDocument(this._myEngine).hasFocus()) {

            for (let i = 0; i < this._myKeyInfosIDs.length; i++) {
                let id = this._myKeyInfosIDs[i];
                let keyInfo = this._myKeyInfos[id];
                if (keyInfo.myPressed) {
                    keyInfo.myPressed = false;
                    keyInfo.myPressEndToProcess = true;
                }
            }
        }

        for (let i = 0; i < this._myKeyInfosIDs.length; i++) {
            let id = this._myKeyInfosIDs[i];
            let keyInfo = this._myKeyInfos[id];
            keyInfo.myPressStart = keyInfo.myPressStartToProcess;
            keyInfo.myPressEnd = keyInfo.myPressEndToProcess;
            keyInfo.myPressStartToProcess = false;
            keyInfo.myPressEndToProcess = false;
        }
    }

    _keyDown(event) {
        this._keyPressedChanged(event.key, true);
        if (event.key != event.code) {
            this._keyPressedChanged(event.code, true);
        }
    }

    _keyUp(event) {
        this._keyPressedChanged(event.key, false);
        if (event.key != event.code) {
            this._keyPressedChanged(event.code, false);
        }
    }

    _keyPressedChanged(keyID, pressed) {
        if (this._myKeyInfos[keyID] != null) {
            let keyInfo = this._myKeyInfos[keyID];

            if (pressed) {
                keyInfo.myPressed = true;
                keyInfo.myPressStartToProcess = true;
            } else {
                keyInfo.myPressed = false;
                keyInfo.myPressEndToProcess = true;
            }
        }
    }

    _createKeyInfo() {
        return { myPressed: false, myPressStart: false, myPressStartToProcess: false, myPressEnd: false, myPressEndToProcess: false, };
    }

    destroy() {
        this._myDestroyed = true;

        Globals.getWindow(this._myEngine).removeEventListener("keydown", this._myOnKeyDownEventListener);
        Globals.getWindow(this._myEngine).removeEventListener("keyup", this._myOnKeyUpEventListener);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}