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
        
        - pp_getObjectByID
        
        - pp_toString / pp_toStringCompact / pp_toStringExtended

        - pp_getComponentsAmountMap
*/

import { Scene } from "@wonderlandengine/api";
import { SceneUtils } from "../../../cauldron/wl/utils/scene_utils";
import { PluginUtils } from "../../utils/plugin_utils";

export function initSceneExtension(engine) {
    initSceneExtensionPrototype();
}

export function initSceneExtensionPrototype() {

    let sceneExtension = {};

    sceneExtension.pp_getRoot = function pp_getRoot() {
        return SceneUtils.getRoot(this, ...arguments);
    }

    sceneExtension.pp_addObject = function pp_addObject() {
        return SceneUtils.addObject(this, ...arguments);
    }

    sceneExtension.pp_getObjects = function pp_getObjects() {
        return SceneUtils.getObjects(this, ...arguments);
    }

    sceneExtension.pp_getObjectsBreadth = function pp_getObjectsBreadth() {
        return SceneUtils.getObjectsBreadth(this, ...arguments);
    }

    sceneExtension.pp_getObjectsDepth = function pp_getObjectsDepth() {
        return SceneUtils.getObjectsDepth(this, ...arguments);
    }

    // Get Component    

    sceneExtension.pp_getComponent = function pp_getComponent(typeOrClass, index = 0) {
        return SceneUtils.getComponent(this, ...arguments);
    }

    sceneExtension.pp_getComponentBreadth = function pp_getComponentBreadth(typeOrClass, index = 0) {
        return SceneUtils.getComponentBreadth(this, ...arguments);
    }

    sceneExtension.pp_getComponentDepth = function pp_getComponentDepth(typeOrClass, index = 0) {
        return SceneUtils.getComponentDepth(this, ...arguments);
    }

    sceneExtension.pp_getComponents = function pp_getComponents(typeOrClass) {
        return SceneUtils.getComponents(this, ...arguments);
    }

    sceneExtension.pp_getComponentsBreadth = function pp_getComponentsBreadth(typeOrClass) {
        return SceneUtils.getComponentsBreadth(this, ...arguments);
    }

    sceneExtension.pp_getComponentsDepth = function pp_getComponentsDepth(typeOrClass) {
        return SceneUtils.getComponentsDepth(this, ...arguments);
    }

    // Get Object By Name

    sceneExtension.pp_getObjectByName = function pp_getObjectByName(name, index = 0) {
        return SceneUtils.getObjectByName(this, ...arguments);
    }

    sceneExtension.pp_getObjectByNameBreadth = function pp_getObjectByNameBreadth(name, index = 0) {
        return SceneUtils.getObjectByNameBreadth(this, ...arguments);
    }

    sceneExtension.pp_getObjectByNameDepth = function pp_getObjectByNameDepth(name, index = 0) {
        return SceneUtils.getObjectByNameDepth(this, ...arguments);
    }

    sceneExtension.pp_getObjectsByName = function pp_getObjectsByName(name, index = 0) {
        return SceneUtils.getObjectsByName(this, ...arguments);
    }

    sceneExtension.pp_getObjectsByNameBreadth = function pp_getObjectsByNameBreadth(name, index = 0) {
        return SceneUtils.getObjectsByNameBreadth(this, ...arguments);
    }

    sceneExtension.pp_getObjectsByNameDepth = function pp_getObjectsByNameDepth(name, index = 0) {
        return SceneUtils.getObjectsByNameDepth(this, ...arguments);
    }

    // Get Object By ID

    sceneExtension.pp_getObjectByID = function pp_getObjectByID(id) {
        return SceneUtils.getObjectByID(this, ...arguments);
    }

    sceneExtension.pp_getObjectByIDBreadth = function pp_getObjectByIDBreadth(id) {
        return SceneUtils.getObjectByIDBreadth(this, ...arguments);
    }

    sceneExtension.pp_getObjectByIDDepth = function pp_getObjectByIDDepth(id) {
        return SceneUtils.getObjectByIDDepth(this, ...arguments);
    }

    // To String

    sceneExtension.pp_toString = function pp_toString() {
        return SceneUtils.toString(this, ...arguments);
    }

    sceneExtension.pp_toStringCompact = function pp_toStringCompact() {
        return SceneUtils.toStringCompact(this, ...arguments);
    }

    sceneExtension.pp_toStringExtended = function pp_toStringExtended() {
        return SceneUtils.toStringExtended(this, ...arguments);
    }

    // Cauldron

    sceneExtension.pp_getComponentsAmountMap = function pp_getComponentsAmountMap(amountMap = new Map()) {
        return SceneUtils.getComponentsAmountMap(this, ...arguments);
    }



    PluginUtils.injectProperties(sceneExtension, Scene.prototype, false, true, true);
}