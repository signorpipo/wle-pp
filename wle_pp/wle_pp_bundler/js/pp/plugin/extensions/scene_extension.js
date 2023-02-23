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

        - pp_getComponentsAmountMap
*/

if (WL && WL.Scene) {

    WL.Scene.prototype.pp_getRoot = function pp_getRoot() {
        return new WL.Object(0);
    }

    WL.Scene.prototype.pp_getObjects = function pp_getObjects() {
        return this.pp_getObjectsBreadth();
    }

    WL.Scene.prototype.pp_getObjectsBreadth = function pp_getObjectsBreadth() {
        return this.pp_getRoot().pp_getHierarchyBreadth();
    }

    WL.Scene.prototype.pp_getObjectsDepth = function pp_getObjectsDepth() {
        return this.pp_getRoot().pp_getHierarchyDepth();
    }

    //Get Component    

    WL.Scene.prototype.pp_getComponent = function pp_getComponent(type, index = 0) {
        return this.pp_getComponentBreadth(type, index);
    }

    WL.Scene.prototype.pp_getComponentBreadth = function pp_getComponentBreadth(type, index = 0) {
        return this.pp_getRoot().pp_getComponentHierarchyBreadth(type, index);
    }

    WL.Scene.prototype.pp_getComponentDepth = function pp_getComponentDepth(type, index = 0) {
        return this.pp_getRoot().pp_getComponentHierarchyDepth(type, index);
    }

    WL.Scene.prototype.pp_getComponents = function pp_getComponents(type) {
        return this.pp_getComponentsBreadth(type);
    }

    WL.Scene.prototype.pp_getComponentsBreadth = function pp_getComponentsBreadth(type) {
        return this.pp_getRoot().pp_getComponentsHierarchyBreadth(type);
    }

    WL.Scene.prototype.pp_getComponentsDepth = function pp_getComponentsDepth(type) {
        return this.pp_getRoot().pp_getComponentsHierarchyDepth(type);
    }

    //Get By Name

    WL.Scene.prototype.pp_getObjectByName = function pp_getObjectByName(name) {
        return this.pp_getObjectByNameBreadth(name);
    }

    WL.Scene.prototype.pp_getObjectByNameBreadth = function pp_getObjectByNameBreadth(name) {
        return this.pp_getRoot().pp_getObjectByNameHierarchyBreadth(name);
    }

    WL.Scene.prototype.pp_getObjectByNameDepth = function pp_getObjectByNameDepth(name) {
        return this.pp_getRoot().pp_getObjectByNameHierarchyDepth(name);
    }

    WL.Scene.prototype.pp_getObjectsByName = function pp_getObjectsByName(name) {
        return this.pp_getObjectsByNameBreadth(name);
    }

    WL.Scene.prototype.pp_getObjectsByNameBreadth = function pp_getObjectsByNameBreadth(name) {
        return this.pp_getRoot().pp_getObjectsByNameHierarchyBreadth(name);
    }

    WL.Scene.prototype.pp_getObjectsByNameDepth = function pp_getObjectsByNameDepth(name) {
        return this.pp_getRoot().pp_getObjectsByNameHierarchyDepth(name);
    }

    //To String

    WL.Scene.prototype.pp_toString = function pp_toString() {
        return this.pp_toStringCompact();
    }

    WL.Scene.prototype.pp_toStringCompact = function pp_toStringCompact() {
        return this.pp_getRoot().pp_toStringCompact();
    }

    WL.Scene.prototype.pp_toStringExtended = function pp_toStringExtended() {
        return this.pp_getRoot().pp_toStringExtended();
    }

    //Cauldron

    WL.Scene.prototype.pp_getComponentsAmountMap = function pp_getComponentsAmountMap(amountMap = new Map()) {
        return this.pp_getRoot().pp_getComponentsAmountMapHierarchy(amountMap);
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