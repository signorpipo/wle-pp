/*
    How to use

    On some of the functions u can specify if the algorithm should explore by Breadth/Depth, example:
        - pp_getObjectByNameBreadth
        - pp_getComponentsDepth
    By default the functions explore by Breadth

    List of functions:
        - pp_getRoot
        - pp_getObjects
        
        - pp_getComponent
        - pp_getComponents
        
        - pp_getObjectByName
        - pp_getObjectsByName
        
        - pp_toString / pp_toStringCompact / pp_toStringExtended

        - pp_getComponentAmountMap
*/

if (WL && WL.Scene) {

    WL.Scene.prototype.pp_getRoot = function () {
        return new WL.Object(0);
    }

    WL.Scene.prototype.pp_getObjects = function () {
        return this.pp_getObjectsBreadth();
    }

    WL.Scene.prototype.pp_getObjectsBreadth = function () {
        return this.pp_getRoot().pp_getHierarchyBreadth();
    }

    WL.Scene.prototype.pp_getObjectsDepth = function () {
        return this.pp_getRoot().pp_getHierarchyDepth();
    }

    //Get Component    

    WL.Scene.prototype.pp_getComponent = function (type, index = 0) {
        return this.pp_getComponentBreadth(type, index);
    }

    WL.Scene.prototype.pp_getComponentBreadth = function (type, index = 0) {
        return this.pp_getRoot().pp_getComponentHierarchyBreadth(type, index);
    }

    WL.Scene.prototype.pp_getComponentDepth = function (type, index = 0) {
        return this.pp_getRoot().pp_getComponentHierarchyDepth(type, index);
    }

    WL.Scene.prototype.pp_getComponents = function (type) {
        return this.pp_getComponentsBreadth(type);
    }

    WL.Scene.prototype.pp_getComponentsBreadth = function (type) {
        return this.pp_getRoot().pp_getComponentsHierarchyBreadth(type);
    }

    WL.Scene.prototype.pp_getComponentsDepth = function (type) {
        return this.pp_getRoot().pp_getComponentsHierarchyDepth(type);
    }

    //Get By Name

    WL.Scene.prototype.pp_getObjectByName = function (name) {
        return this.pp_getObjectByNameBreadth(name);
    }

    WL.Scene.prototype.pp_getObjectByNameBreadth = function (name) {
        return this.pp_getRoot().pp_getObjectByNameHierarchyBreadth(name);
    }

    WL.Scene.prototype.pp_getObjectByNameDepth = function (name) {
        return this.pp_getRoot().pp_getObjectByNameHierarchyDepth(name);
    }

    WL.Scene.prototype.pp_getObjectsByName = function (name) {
        return this.pp_getObjectsByNameBreadth(name);
    }

    WL.Scene.prototype.pp_getObjectsByNameBreadth = function (name) {
        return this.pp_getRoot().pp_getObjectsByNameHierarchyBreadth(name);
    }

    WL.Scene.prototype.pp_getObjectsByNameDepth = function (name) {
        return this.pp_getRoot().pp_getObjectsByNameHierarchyDepth(name);
    }

    //To String

    WL.Scene.prototype.pp_toString = function () {
        return this.pp_toStringCompact();
    }

    WL.Scene.prototype.pp_toStringCompact = function () {
        return this.pp_getRoot().pp_toStringCompact();
    }

    WL.Scene.prototype.pp_toStringExtended = function () {
        return this.pp_getRoot().pp_toStringExtended();
    }

    //Cauldron

    WL.Scene.prototype.pp_getComponentAmountMap = function (amountMap = new Map()) {
        return this.pp_getRoot().pp_getComponentAmountMapHierarchy(amountMap);
    }



    for (let key in WL.Scene.prototype) {
        let prefixes = ["pp_", "_pp_"];

        let found = false;
        for (let prefix of prefixes) {
            if (key.startsWith(prefix)) {
                found = true;
                break;
            }
        }

        if (found) {
            Object.defineProperty(WL.Scene.prototype, key, { enumerable: false });
        }
    }

}