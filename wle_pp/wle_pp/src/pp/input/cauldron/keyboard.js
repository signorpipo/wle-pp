import { Globals } from "../../pp/globals.js";

export let KeyID = {
    /** These are when the number is pressed in some way */
    Number0: "0",
    Number1: "1",
    Number2: "2",
    Number3: "3",
    Number4: "4",
    Number5: "5",
    Number6: "6",
    Number7: "7",
    Number8: "8",
    Number9: "9",

    /** These are just the numbers above the letters on the keyboard */
    Digit0: "Digit0",
    Digit1: "Digit1",
    Digit2: "Digit2",
    Digit3: "Digit3",
    Digit4: "Digit4",
    Digit5: "Digit5",
    Digit6: "Digit6",
    Digit7: "Digit7",
    Digit8: "Digit8",
    Digit9: "Digit9",

    /** These are just the numbers on the numpad, but works even is num lock is disabled */
    Numpad0: "Numpad0",
    Numpad1: "Numpad1",
    Numpad2: "Numpad2",
    Numpad3: "Numpad3",
    Numpad4: "Numpad4",
    Numpad5: "Numpad5",
    Numpad6: "Numpad6",
    Numpad7: "Numpad7",
    Numpad8: "Numpad8",
    Numpad9: "Numpad9",

    KeyA: "KeyA",
    KeyB: "KeyB",
    KeyC: "KeyC",
    KeyD: "KeyD",
    KeyE: "KeyE",
    KeyF: "KeyF",
    KeyG: "KeyG",
    KeyH: "KeyH",
    KeyI: "KeyI",
    KeyJ: "KeyJ",
    KeyK: "KeyK",
    KeyL: "KeyL",
    KeyM: "KeyM",
    KeyN: "KeyN",
    KeyO: "KeyO",
    KeyP: "KeyP",
    KeyQ: "KeyQ",
    KeyR: "KeyR",
    KeyS: "KeyS",
    KeyT: "KeyT",
    KeyU: "KeyU",
    KeyV: "KeyV",
    KeyW: "KeyW",
    KeyX: "KeyX",
    KeyY: "KeyY",
    KeyZ: "KeyZ",

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

    SPACE: "Space",
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
        window.addEventListener("keydown", this._myOnKeyDownEventListener);
        this._myOnKeyUpEventListener = this._keyUp.bind(this);
        window.addEventListener("keyup", this._myOnKeyUpEventListener);
    }

    update(dt) {
        if (!document.hasFocus()) {
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
        if (event.repeat) return;

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

            if (pressed != keyInfo.myPressed) {
                if (pressed) {
                    keyInfo.myPressed = true;
                    keyInfo.myPressStartToProcess = true;
                } else {
                    keyInfo.myPressed = false;
                    keyInfo.myPressEndToProcess = true;
                }
            }
        }
    }

    _createKeyInfo() {
        return { myPressed: false, myPressStart: false, myPressStartToProcess: false, myPressEnd: false, myPressEndToProcess: false, };
    }

    destroy() {
        this._myDestroyed = true;

        window.removeEventListener("keydown", this._myOnKeyDownEventListener);
        window.removeEventListener("keyup", this._myOnKeyUpEventListener);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}