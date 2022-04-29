if (_WL && _WL._componentTypes) {

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

}