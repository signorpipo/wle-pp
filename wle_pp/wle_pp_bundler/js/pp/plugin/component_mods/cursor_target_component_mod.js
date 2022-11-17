if (_WL && _WL._componentTypes && _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]]) {

    // Modified Functions 

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.init = function () {
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

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onHover = function (object, cursor) {
        for (let f of this.hoverFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onUnhover = function (object, cursor) {
        for (let f of this.unHoverFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onClick = function (object, cursor) {
        for (let f of this.clickFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onMove = function (object, cursor) {
        for (let f of this.moveFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onDown = function (object, cursor) {
        for (let f of this.downFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onUp = function (object, cursor) {
        for (let f of this.upFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.addHoverFunction = function (f) {
        this._validateCallback(f);
        this.hoverFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.removeHoverFunction = function (f) {
        this._validateCallback(f);
        this._removeItemOnce(this.hoverFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.addUnHoverFunction = function (f) {
        this._validateCallback(f);
        this.unHoverFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.removeUnHoverFunction = function (f) {
        this._validateCallback(f);
        this._removeItemOnce(this.unHoverFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.addClickFunction = function (f) {
        this._validateCallback(f);
        this.clickFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.removeClickFunction = function (f) {
        this._validateCallback(f);
        this._removeItemOnce(this.clickFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.addMoveFunction = function (f) {
        this._validateCallback(f);
        this.moveFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.removeMoveFunction = function (f) {
        this._validateCallback(f);
        this._removeItemOnce(this.moveFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.addDownFunction = function (f) {
        this._validateCallback(f);
        this.downFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.removeDownFunction = function (f) {
        this._validateCallback(f);
        this._removeItemOnce(this.downFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.addUpFunction = function (f) {
        this._validateCallback(f);
        this.upFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.removeUpFunction = function (f) {
        this._validateCallback(f);
        this._removeItemOnce(this.upFunctions, f);
    };


    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto._removeItemOnce = function (arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) arr.splice(index, 1);
        return arr;
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto._validateCallback = function (f) {
        if (typeof f !== "function") {
            throw new TypeError(this.object.name + ".cursor-target: Argument needs to be a function");
        }
    };

    // New Functions 

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onDoubleClick = function (object, cursor) {
        for (let f of this.doubleClickFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.addDoubleClickFunction = function (f) {
        this._validateCallback(f);
        this.doubleClickFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.removeDoubleClickFunction = function (f) {
        this._validateCallback(f);
        this._removeItemOnce(this.doubleClickFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onTripleClick = function (object, cursor) {
        for (let f of this.tripleClickFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.addTripleClickFunction = function (f) {
        this._validateCallback(f);
        this.tripleClickFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.removeTripleClickFunction = function (f) {
        this._validateCallback(f);
        this._removeItemOnce(this.tripleClickFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onDownOnHover = function (object, cursor) {
        for (let f of this.downOnHoverFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.addDownOnHoverFunction = function (f) {
        this._validateCallback(f);
        this.downOnHoverFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.removeDownOnHoverFunction = function (f) {
        this._validateCallback(f);
        this._removeItemOnce(this.downOnHoverFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onUpWithNoDown = function (object, cursor) {
        for (let f of this.upWithNoDownFunctions) f(object, cursor);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.addUpWithNoDownFunction = function (f) {
        this._validateCallback(f);
        this.upWithNoDownFunctions.push(f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.removeUpWithNoDownFunction = function (f) {
        this._validateCallback(f);
        this._removeItemOnce(this.upWithNoDownFunctions, f);
    };

    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.start = function () { };
    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.update = function (dt) { };
    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onActivate = function () { };
    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onDeactivate = function () { };
    _WL._componentTypes[_WL._componentTypeIndices["cursor-target"]].proto.onDestroy = function () { };

} else {
    console.error("Wonderland Engine \"cursor-target\" component not found.\n Add the component to your project to avoid any issue with the PP bundle.");
}