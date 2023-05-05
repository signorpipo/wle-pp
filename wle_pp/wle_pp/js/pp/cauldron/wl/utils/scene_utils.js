import { ObjectUtils } from "./object_utils";

export function getRoot(scene) {
    return ObjectUtils.wrapObject(0, scene.engine);
}

export function addObject(scene) {
    return ObjectUtils.addObject(SceneUtils.getRoot(scene));
}

export function getObjects(scene) {
    return SceneUtils.getObjectsBreadth(scene);
}

export function getObjectsBreadth(scene) {
    return ObjectUtils.getHierarchyBreadth(SceneUtils.getRoot(scene));
}

export function getObjectsDepth(scene) {
    return ObjectUtils.getHierarchyDepth(SceneUtils.getRoot(scene));
}

// Get Component    

export function getComponent(scene, typeOrClass, index = 0) {
    return SceneUtils.getComponentBreadth(scene, typeOrClass, index);
}

export function getComponentBreadth(scene, typeOrClass, index = 0) {
    return ObjectUtils.getComponentHierarchyBreadth(SceneUtils.getRoot(scene), typeOrClass, index);
}

export function getComponentDepth(scene, typeOrClass, index = 0) {
    return ObjectUtils.getComponentHierarchyDepth(SceneUtils.getRoot(scene), typeOrClass, index);
}

export function getComponents(scene, typeOrClass) {
    return SceneUtils.getComponentsBreadth(scene, typeOrClass);
}

export function getComponentsBreadth(scene, typeOrClass) {
    return ObjectUtils.getComponentsHierarchyBreadth(SceneUtils.getRoot(scene), typeOrClass);
}

export function getComponentsDepth(scene, typeOrClass) {
    return ObjectUtils.getComponentsHierarchyDepth(SceneUtils.getRoot(scene), typeOrClass);
}

// Get Object By Name

export function getObjectByName(scene, name, index = 0) {
    return SceneUtils.getObjectByNameBreadth(scene, name, index);
}

export function getObjectByNameBreadth(scene, name, index = 0) {
    return ObjectUtils.getObjectByNameHierarchyBreadth(SceneUtils.getRoot(scene), name, index);
}

export function getObjectByNameDepth(scene, name, index = 0) {
    return ObjectUtils.getObjectByNameHierarchyDepth(SceneUtils.getRoot(scene), name, index);
}

export function getObjectsByName(scene, name, index = 0) {
    return SceneUtils.getObjectsByNameBreadth(scene, name, index);
}

export function getObjectsByNameBreadth(scene, name, index = 0) {
    return ObjectUtils.getObjectsByNameHierarchyBreadth(SceneUtils.getRoot(scene), name, index);
}

export function getObjectsByNameDepth(scene, name, index = 0) {
    return ObjectUtils.getObjectsByNameHierarchyDepth(SceneUtils.getRoot(scene), name, index);
}

// Get Object By ID

export function getObjectByID(scene, id) {
    return SceneUtils.getObjectByIDBreadth(scene, id);
}

export function getObjectByIDBreadth(scene, id) {
    return ObjectUtils.getObjectByIDHierarchyBreadth(SceneUtils.getRoot(scene), id);
}

export function getObjectByIDDepth(scene, id) {
    return ObjectUtils.getObjectByIDHierarchyDepth(SceneUtils.getRoot(scene), id);
}

// To String

export function toString(scene) {
    return SceneUtils.toStringCompact(scene);
}

export function toStringCompact(scene) {
    return ObjectUtils.toStringCompact(SceneUtils.getRoot(scene));
}

export function toStringExtended(scene) {
    return ObjectUtils.toStringExtended(SceneUtils.getRoot(scene));
}

// Cauldron

export function getComponentsAmountMap(scene, amountMap = new Map()) {
    return ObjectUtils.getComponentsAmountMap(SceneUtils.getRoot(scene), amountMap);
}

export let SceneUtils = {
    getRoot,
    addObject,
    getObjects,
    getObjectsBreadth,
    getObjectsDepth,
    getComponent,
    getComponentBreadth,
    getComponentDepth,
    getComponents,
    getComponentsBreadth,
    getComponentsDepth,
    getObjectByName,
    getObjectByNameBreadth,
    getObjectByNameDepth,
    getObjectsByName,
    getObjectsByNameBreadth,
    getObjectsByNameDepth,
    getObjectByID,
    getObjectByIDBreadth,
    getObjectByIDDepth,
    toString,
    toStringCompact,
    toStringExtended,
    getComponentsAmountMap
};