if (_WL && _WL._componentTypes && _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]]) {

    // Modified Functions 

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.init = function init() {
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

        this.isSurface = false; // just a way to specify if this target is just used as a surface between buttons 
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onHover = function onHover(object, cursor) {
        for (let f of this.hoverFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onUnhover = function onUnhover(object, cursor) {
        for (let f of this.unHoverFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onClick = function onClick(object, cursor) {
        for (let f of this.clickFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onMove = function onMove(object, cursor) {
        for (let f of this.moveFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onDown = function onDown(object, cursor) {
        for (let f of this.downFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onUp = function onUp(object, cursor) {
        for (let f of this.upFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.addHoverFunction = function addHoverFunction(f) {
        this._validateCallback(f);
        this.hoverFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.removeHoverFunction = function removeHoverFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.hoverFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.addUnHoverFunction = function addUnHoverFunction(f) {
        this._validateCallback(f);
        this.unHoverFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.removeUnHoverFunction = function removeUnHoverFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.unHoverFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.addClickFunction = function addClickFunction(f) {
        this._validateCallback(f);
        this.clickFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.removeClickFunction = function removeClickFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.clickFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.addMoveFunction = function addMoveFunction(f) {
        this._validateCallback(f);
        this.moveFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.removeMoveFunction = function removeMoveFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.moveFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.addDownFunction = function addDownFunction(f) {
        this._validateCallback(f);
        this.downFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.removeDownFunction = function removeDownFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.downFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.addUpFunction = function addUpFunction(f) {
        this._validateCallback(f);
        this.upFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.removeUpFunction = function removeUpFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.upFunctions, f);
    };


    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype._removeItemOnce = function _removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) arr.splice(index, 1);
        return arr;
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype._validateCallback = function _validateCallback(f) {
        if (typeof f !== "function") {
            throw new TypeError(this.object.name + ".cursor-target: Argument needs to be a function");
        }
    };

    // New Functions 

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onDoubleClick = function onDoubleClick(object, cursor) {
        for (let f of this.doubleClickFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.addDoubleClickFunction = function addDoubleClickFunction(f) {
        this._validateCallback(f);
        this.doubleClickFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.removeDoubleClickFunction = function removeDoubleClickFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.doubleClickFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onTripleClick = function onTripleClick(object, cursor) {
        for (let f of this.tripleClickFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.addTripleClickFunction = function addTripleClickFunction(f) {
        this._validateCallback(f);
        this.tripleClickFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.removeTripleClickFunction = function removeTripleClickFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.tripleClickFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onDownOnHover = function onDownOnHover(object, cursor) {
        for (let f of this.downOnHoverFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.addDownOnHoverFunction = function addDownOnHoverFunction(f) {
        this._validateCallback(f);
        this.downOnHoverFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.removeDownOnHoverFunction = function removeDownOnHoverFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.downOnHoverFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onUpWithNoDown = function onUpWithNoDown(object, cursor) {
        for (let f of this.upWithNoDownFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.addUpWithNoDownFunction = function addUpWithNoDownFunction(f) {
        this._validateCallback(f);
        this.upWithNoDownFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.removeUpWithNoDownFunction = function removeUpWithNoDownFunction(f) {
        this._validateCallback(f);
        this._removeItemOnce(this.upWithNoDownFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.start = function start() { };
    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.update = function update(dt) { };
    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onActivate = function onActivate() { };
    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onDeactivate = function onDeactivate() { };
    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].prototype.onDestroy = function onDestroy() { };

} else {
    console.error("Wonderland Engine \"cursor-target\" component not found.\n Add the component to your project to avoid any issue with the PP bundle.");
}