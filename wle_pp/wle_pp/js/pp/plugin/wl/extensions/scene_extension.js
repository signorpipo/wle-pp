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
        return SceneUtils.getRoot(this);
    };

    sceneExtension.pp_addObject = function pp_addObject() {
        return SceneUtils.addObject(this);
    };

    sceneExtension.pp_getObjects = function pp_getObjects() {
        return SceneUtils.getObjects(this);
    };

    sceneExtension.pp_getObjectsBreadth = function pp_getObjectsBreadth() {
        return SceneUtils.getObjectsBreadth(this);
    };

    sceneExtension.pp_getObjectsDepth = function pp_getObjectsDepth() {
        return SceneUtils.getObjectsDepth(this);
    };

    // Get Component    

    sceneExtension.pp_getComponent = function pp_getComponent(typeOrClass, index = 0) {
        return SceneUtils.getComponent(this, typeOrClass, index);
    };

    sceneExtension.pp_getComponentBreadth = function pp_getComponentBreadth(typeOrClass, index = 0) {
        return SceneUtils.getComponentBreadth(this, typeOrClass, index);
    };

    sceneExtension.pp_getComponentDepth = function pp_getComponentDepth(typeOrClass, index = 0) {
        return SceneUtils.getComponentDepth(this, typeOrClass, index);
    };

    sceneExtension.pp_getComponents = function pp_getComponents(typeOrClass) {
        return SceneUtils.getComponents(this, typeOrClass);
    };

    sceneExtension.pp_getComponentsBreadth = function pp_getComponentsBreadth(typeOrClass) {
        return SceneUtils.getComponentsBreadth(this, typeOrClass);
    };

    sceneExtension.pp_getComponentsDepth = function pp_getComponentsDepth(typeOrClass) {
        return SceneUtils.getComponentsDepth(this, typeOrClass);
    };

    // Get Object By Name

    sceneExtension.pp_getObjectByName = function pp_getObjectByName(name, isRegex = false, index = 0) {
        return SceneUtils.getObjectByName(this, name, isRegex, index);
    };

    sceneExtension.pp_getObjectByNameBreadth = function pp_getObjectByNameBreadth(name, isRegex = false, index = 0) {
        return SceneUtils.getObjectByNameBreadth(this, name, isRegex, index);
    };

    sceneExtension.pp_getObjectByNameDepth = function pp_getObjectByNameDepth(name, isRegex = false, index = 0) {
        return SceneUtils.getObjectByNameDepth(this, name, isRegex, index);
    };

    sceneExtension.pp_getObjectsByName = function pp_getObjectsByName(name, isRegex = false) {
        return SceneUtils.getObjectsByName(this, name, isRegex);
    };

    sceneExtension.pp_getObjectsByNameBreadth = function pp_getObjectsByNameBreadth(name, isRegex = false) {
        return SceneUtils.getObjectsByNameBreadth(this, name, isRegex);
    };

    sceneExtension.pp_getObjectsByNameDepth = function pp_getObjectsByNameDepth(name, isRegex = false) {
        return SceneUtils.getObjectsByNameDepth(this, name, isRegex);
    };

    // Get Object By ID

    sceneExtension.pp_getObjectByID = function pp_getObjectByID(id) {
        return SceneUtils.getObjectByID(this, id);
    };

    sceneExtension.pp_getObjectByIDBreadth = function pp_getObjectByIDBreadth(id) {
        return SceneUtils.getObjectByIDBreadth(this, id);
    };

    sceneExtension.pp_getObjectByIDDepth = function pp_getObjectByIDDepth(id) {
        return SceneUtils.getObjectByIDDepth(this, id);
    };

    // To String

    sceneExtension.pp_toString = function pp_toString() {
        return SceneUtils.toString(this);
    };

    sceneExtension.pp_toStringCompact = function pp_toStringCompact() {
        return SceneUtils.toStringCompact(this);
    };

    sceneExtension.pp_toStringExtended = function pp_toStringExtended() {
        return SceneUtils.toStringExtended(this);
    };

    // Cauldron

    sceneExtension.pp_getComponentsAmountMap = function pp_getComponentsAmountMap(amountMap = new Map()) {
        return SceneUtils.getComponentsAmountMap(this, amountMap);
    };



    PluginUtils.injectProperties(sceneExtension, Scene.prototype, false, true, true);
}