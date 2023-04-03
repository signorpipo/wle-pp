import { CursorTarget } from "@wonderlandengine/components";

export function initCursorTargetComponentMod() {
    initCursorTargetComponentModPrototype();
}

export function initCursorTargetComponentModPrototype() {
    // Modified Functions 

    CursorTarget.prototype.init = function init() {
        this.hoverFunctions = [];
        this.unHoverFunctions = [];
        this.clickFunctions = [];
        this.doubleClickFunctions = [];
        this.tripleClickFunctions = [];
        this.moveFunctions = [];
        this.downFunctions = [];
        this.upFunctions = [];
        this.downOnHoverFunctions = [];
        this.upWithNoDownFunctions = [];

        this.isSurface = false; // Just a way to specify if this target is just used as a surface between buttons 
    };

    CursorTarget.prototype.onHover = function onHover(object, cursor) {
        for (let f of this.hoverFunctions) f(object, cursor);
    };

    CursorTarget.prototype.onUnhover = function onUnhover(object, cursor) {
        for (let f of this.unHoverFunctions) f(object, cursor);
    };

    CursorTarget.prototype.onClick = function onClick(object, cursor) {
        for (let f of this.clickFunctions) f(object, cursor);
    };

    CursorTarget.prototype.onMove = function onMove(object, cursor) {
        for (let f of this.moveFunctions) f(object, cursor);
    };

    CursorTarget.prototype.onDown = function onDown(object, cursor) {
        for (let f of this.downFunctions) f(object, cursor);
    };

    CursorTarget.prototype.onUp = function onUp(object, cursor) {
        for (let f of this.upFunctions) f(object, cursor);
    };

    CursorTarget.prototype.addHoverFunction = function addHoverFunction(f) {
        this._validateCallback(f);
        this.hoverFunctions.push(f);
    };

    CursorTarget.prototype.removeHoverFunction = function removeHoverFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.hoverFunctions, f);
    };

    CursorTarget.prototype.addUnHoverFunction = function addUnHoverFunction(f) {
        this._validateCallback(f);
        this.unHoverFunctions.push(f);
    };

    CursorTarget.prototype.removeUnHoverFunction = function removeUnHoverFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.unHoverFunctions, f);
    };

    CursorTarget.prototype.addClickFunction = function addClickFunction(f) {
        this._validateCallback(f);
        this.clickFunctions.push(f);
    };

    CursorTarget.prototype.removeClickFunction = function removeClickFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.clickFunctions, f);
    };

    CursorTarget.prototype.addMoveFunction = function addMoveFunction(f) {
        this._validateCallback(f);
        this.moveFunctions.push(f);
    };

    CursorTarget.prototype.removeMoveFunction = function removeMoveFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.moveFunctions, f);
    };

    CursorTarget.prototype.addDownFunction = function addDownFunction(f) {
        this._validateCallback(f);
        this.downFunctions.push(f);
    };

    CursorTarget.prototype.removeDownFunction = function removeDownFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.downFunctions, f);
    };

    CursorTarget.prototype.addUpFunction = function addUpFunction(f) {
        this._validateCallback(f);
        this.upFunctions.push(f);
    };

    CursorTarget.prototype.removeUpFunction = function removeUpFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.upFunctions, f);
    };


    CursorTarget.prototype._removeItemOnce = function _removeItemOnce(arr, value) {
        let index = arr.indexOf(value);
        if (index > -1) arr.splice(index, 1);
        return arr;
    };

    CursorTarget.prototype._validateCallback = function _validateCallback(f) {
        if (typeof f !== "function") {
            throw new TypeError(this.object.pp_getName() + ".cursor-target: Argument needs to be a function");
        }
    };

    // New Functions 

    CursorTarget.prototype.start = function start() { };
    CursorTarget.prototype.update = function update(dt) { };
    CursorTarget.prototype.onActivate = function onActivate() { };
    CursorTarget.prototype.onDeactivate = function onDeactivate() { };
    CursorTarget.prototype.onDestroy = function onDestroy() { };

    CursorTarget.prototype.onDoubleClick = function onDoubleClick(object, cursor) {
        for (let f of this.doubleClickFunctions) f(object, cursor);
    };

    CursorTarget.prototype.addDoubleClickFunction = function addDoubleClickFunction(f) {
        this._validateCallback(f);
        this.doubleClickFunctions.push(f);
    };

    CursorTarget.prototype.removeDoubleClickFunction = function removeDoubleClickFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.doubleClickFunctions, f);
    };

    CursorTarget.prototype.onTripleClick = function onTripleClick(object, cursor) {
        for (let f of this.tripleClickFunctions) f(object, cursor);
    };

    CursorTarget.prototype.addTripleClickFunction = function addTripleClickFunction(f) {
        this._validateCallback(f);
        this.tripleClickFunctions.push(f);
    };

    CursorTarget.prototype.removeTripleClickFunction = function removeTripleClickFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.tripleClickFunctions, f);
    };

    CursorTarget.prototype.onDownOnHover = function onDownOnHover(object, cursor) {
        for (let f of this.downOnHoverFunctions) f(object, cursor);
    };

    CursorTarget.prototype.addDownOnHoverFunction = function addDownOnHoverFunction(f) {
        this._validateCallback(f);
        this.downOnHoverFunctions.push(f);
    };

    CursorTarget.prototype.removeDownOnHoverFunction = function removeDownOnHoverFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.downOnHoverFunctions, f);
    };

    CursorTarget.prototype.onUpWithNoDown = function onUpWithNoDown(object, cursor) {
        for (let f of this.upWithNoDownFunctions) f(object, cursor);
    };

    CursorTarget.prototype.addUpWithNoDownFunction = function addUpWithNoDownFunction(f) {
        this._validateCallback(f);
        this.upWithNoDownFunctions.push(f);
    };

    CursorTarget.prototype.removeUpWithNoDownFunction = function removeUpWithNoDownFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.upWithNoDownFunctions, f);
    };



    Object.defineProperty(CursorTarget.prototype, "start", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "update", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "onActivate", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "onDeactivate", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "onDestroy", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "onDoubleClick", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "addDoubleClickFunction", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "removeDoubleClickFunction", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "onTripleClick", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "addTripleClickFunction", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "removeTripleClickFunction", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "onDownOnHover", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "addDownOnHoverFunction", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "removeDownOnHoverFunction", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "onUpWithNoDown", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "addUpWithNoDownFunction", { enumerable: false });
    Object.defineProperty(CursorTarget.prototype, "removeUpWithNoDownFunction", { enumerable: false });
}