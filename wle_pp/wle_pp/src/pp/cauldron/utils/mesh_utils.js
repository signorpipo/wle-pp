import { Mesh, MeshAttribute, MeshIndexType } from "@wonderlandengine/api";
import { vec2_create, vec3_create, vec4_create } from "../../plugin/js/extensions/array_extension";
import { Globals } from "../../pp/globals";

export class MeshCreationVertexParams {

    constructor() {
        this.myPosition = null;             // @Vec3
        this.myTextureCoordinates = null;   // @Vec2
        this.myNormal = null;               // @Vec3
        this.myColor = null;                // @Vec4
    }
}

export class MeshCreationTriangleParams {

    constructor() {
        this.myIndexes = new Uint32Array(3);
    }
}

export class MeshCreationParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myVertexes = [];
        this.myTriangles = [];

        this.myEngine = engine;
    }
}

export function create(meshCreationParams) {
    let indexData = [];
    for (let triangle of meshCreationParams.myTriangles) {
        indexData.push(triangle.myIndexes[0]);
        indexData.push(triangle.myIndexes[1]);
        indexData.push(triangle.myIndexes[2]);
    }

    let indexDataUnsignedInt = new Uint32Array(indexData.length);
    indexDataUnsignedInt.pp_copy(indexData);

    let vertexCount = meshCreationParams.myVertexes.length;
    let mesh = new Mesh(meshCreationParams.myEngine, {
        vertexCount: vertexCount,
        indexData: indexDataUnsignedInt,
        indexType: MeshIndexType.UnsignedInt,
    });

    let positionAttribute = null;
    let textureCoordinatesAttribute = null;
    let normalAttribute = null;
    let colorAttribute = null;

    try {
        positionAttribute = mesh.attribute(MeshAttribute.Position);
    } catch (error) {
        positionAttribute = null;
    }

    try {
        textureCoordinatesAttribute = mesh.attribute(MeshAttribute.TextureCoordinate);
    } catch (error) {
        textureCoordinatesAttribute = null;
    }

    try {
        normalAttribute = mesh.attribute(MeshAttribute.Normal);
    } catch (error) {
        normalAttribute = null;
    }

    try {
        colorAttribute = mesh.attribute(MeshAttribute.Color);
    } catch (error) {
        colorAttribute = null;
    }

    for (let i = 0; i < meshCreationParams.myVertexes.length; i++) {
        let vertex = meshCreationParams.myVertexes[i];
        if (positionAttribute != null && vertex.myPosition) {
            positionAttribute.set(i, vertex.myPosition);
        }
        if (textureCoordinatesAttribute != null && vertex.myTextureCoordinates) {
            textureCoordinatesAttribute.set(i, vertex.myTextureCoordinates);
        }
        if (normalAttribute != null && vertex.myNormal) {
            normalAttribute.set(i, vertex.myNormal);
        }
        if (colorAttribute != null && vertex.myColor) {
            colorAttribute.set(i, vertex.myColor);
        }
    }

    return mesh;
}

export let clone = function () {
    let position = vec3_create();
    let textureCoordinates = vec2_create();
    let normal = vec3_create();
    let color = vec4_create();

    return function clone(mesh) {
        if (mesh == null) {
            return null;
        }

        let clonedIndexData = mesh.indexData.pp_clone();

        let clonedMesh = new Mesh(mesh.engine, {
            vertexCount: mesh.vertexCount,
            indexData: clonedIndexData,
            indexType: MeshIndexType.UnsignedInt,
        });

        let positionAttribute = null;
        let textureCoordinatesAttribute = null;
        let normalAttribute = null;
        let colorAttribute = null;

        let clonedPositionAttribute = null;
        let clonedTextureCoordinatesAttribute = null;
        let clonedNormalAttribute = null;
        let clonedColorAttribute = null;


        try {
            positionAttribute = mesh.attribute(MeshAttribute.Position);
            clonedPositionAttribute = clonedMesh.attribute(MeshAttribute.Position);
        } catch (error) {
            positionAttribute = null;
            clonedPositionAttribute = null;
        }

        try {
            textureCoordinatesAttribute = mesh.attribute(MeshAttribute.TextureCoordinate);
            clonedTextureCoordinatesAttribute = clonedMesh.attribute(MeshAttribute.TextureCoordinate);
        } catch (error) {
            textureCoordinatesAttribute = null;
            clonedTextureCoordinatesAttribute = null;
        }

        try {
            normalAttribute = mesh.attribute(MeshAttribute.Normal);
            clonedNormalAttribute = clonedMesh.attribute(MeshAttribute.Normal);
        } catch (error) {
            normalAttribute = null;
            clonedNormalAttribute = null;
        }

        try {
            colorAttribute = mesh.attribute(MeshAttribute.Color);
            clonedColorAttribute = clonedMesh.attribute(MeshAttribute.Color);
        } catch (error) {
            colorAttribute = null;
            clonedColorAttribute = null;
        }

        for (let i = 0; i < mesh.vertexCount; i++) {
            if (positionAttribute != null && clonedPositionAttribute != null) {
                clonedPositionAttribute.set(i, positionAttribute.get(i, position));
            }
            if (textureCoordinatesAttribute != null && clonedTextureCoordinatesAttribute != null) {
                clonedTextureCoordinatesAttribute.set(i, textureCoordinatesAttribute.get(i, textureCoordinates));
            }
            if (normalAttribute != null && clonedNormalAttribute != null) {
                clonedNormalAttribute.set(i, normalAttribute.get(i, normal));
            }
            if (colorAttribute != null && clonedColorAttribute != null) {
                clonedColorAttribute.set(i, colorAttribute.get(i, color));
            }
        }

        return clonedMesh;
    };
}();

export let invert = function () {
    let position = vec3_create();
    let textureCoordinates = vec2_create();
    let normal = vec3_create();
    let color = vec4_create();

    return function invert(mesh) {
        if (mesh == null) {
            return null;
        }

        let invertedIndexData = new Uint32Array(mesh.indexData.length);
        for (let i = 0; i < mesh.indexData.length / 3; i++) {
            invertedIndexData[i * 3 + 0] = mesh.indexData[i * 3 + 2];
            invertedIndexData[i * 3 + 1] = mesh.indexData[i * 3 + 1];
            invertedIndexData[i * 3 + 2] = mesh.indexData[i * 3 + 0];
        }

        let invertedMesh = new Mesh(mesh.engine, {
            vertexCount: mesh.vertexCount,
            indexData: invertedIndexData,
            indexType: MeshIndexType.UnsignedInt,
        });

        let positionAttribute = null;
        let textureCoordinatesAttribute = null;
        let normalAttribute = null;
        let colorAttribute = null;

        let invertedPositionAttribute = null;
        let invertedTextureCoordinatesAttribute = null;
        let invertedNormalAttribute = null;
        let invertedColorAttribute = null;

        try {
            positionAttribute = mesh.attribute(MeshAttribute.Position);
            invertedPositionAttribute = invertedMesh.attribute(MeshAttribute.Position);
        } catch (error) {
            positionAttribute = null;
            invertedPositionAttribute = null;
        }

        try {
            textureCoordinatesAttribute = mesh.attribute(MeshAttribute.TextureCoordinate);
            invertedTextureCoordinatesAttribute = invertedMesh.attribute(MeshAttribute.TextureCoordinate);
        } catch (error) {
            textureCoordinatesAttribute = null;
            invertedTextureCoordinatesAttribute = null;
        }

        try {
            normalAttribute = mesh.attribute(MeshAttribute.Normal);
            invertedNormalAttribute = invertedMesh.attribute(MeshAttribute.Normal);
        } catch (error) {
            normalAttribute = null;
            invertedNormalAttribute = null;
        }

        try {
            colorAttribute = mesh.attribute(MeshAttribute.Color);
            invertedColorAttribute = invertedMesh.attribute(MeshAttribute.Color);
        } catch (error) {
            colorAttribute = null;
            invertedColorAttribute = null;
        }

        for (let i = 0; i < mesh.vertexCount; i++) {
            if (positionAttribute != null && invertedPositionAttribute != null) {
                invertedPositionAttribute.set(i, positionAttribute.get(i, position));
            }

            if (textureCoordinatesAttribute != null && invertedTextureCoordinatesAttribute != null) {
                invertedTextureCoordinatesAttribute.set(i, textureCoordinatesAttribute.get(i, textureCoordinates));
            }

            if (normalAttribute != null && invertedNormalAttribute != null) {
                normalAttribute.get(i, normal);
                normal.vec3_negate(normal);
                invertedNormalAttribute.set(i, normal);
            }

            if (colorAttribute != null && invertedColorAttribute != null) {
                invertedColorAttribute.set(i, colorAttribute.get(i, color));
            }
        }

        return invertedMesh;
    };
}();

export let makeDoubleSided = function () {
    let position = vec3_create();
    let textureCoordinates = vec2_create();
    let normal = vec3_create();
    let color = vec4_create();

    return function makeDoubleSided(mesh) {
        if (mesh == null) {
            return null;
        }

        let doubleSidedIndexData = new Uint32Array(mesh.indexData.length * 2);
        for (let i = 0; i < doubleSidedIndexData.length / 3; i++) {
            doubleSidedIndexData[i * 3 * 2 + 0] = mesh.indexData[i * 3 + 0] * 2;
            doubleSidedIndexData[i * 3 * 2 + 1] = mesh.indexData[i * 3 + 1] * 2;
            doubleSidedIndexData[i * 3 * 2 + 2] = mesh.indexData[i * 3 + 2] * 2;

            doubleSidedIndexData[i * 3 * 2 + 3] = mesh.indexData[i * 3 + 2] * 2 + 1;
            doubleSidedIndexData[i * 3 * 2 + 4] = mesh.indexData[i * 3 + 1] * 2 + 1;
            doubleSidedIndexData[i * 3 * 2 + 5] = mesh.indexData[i * 3 + 0] * 2 + 1;
        }

        let doubleSidedMesh = new Mesh(mesh.engine, {
            vertexCount: mesh.vertexCount * 2,
            indexData: doubleSidedIndexData,
            indexType: MeshIndexType.UnsignedInt,
        });

        let positionAttribute = null;
        let textureCoordinatesAttribute = null;
        let normalAttribute = null;
        let colorAttribute = null;

        let doubleSidedPositionAttribute = null;
        let doubleSidedTextureCoordinatesAttribute = null;
        let doubleSidedNormalAttribute = null;
        let doubleSidedColorAttribute = null;

        try {
            positionAttribute = mesh.attribute(MeshAttribute.Position);
            doubleSidedPositionAttribute = doubleSidedMesh.attribute(MeshAttribute.Position);
        } catch (error) {
            positionAttribute = null;
            doubleSidedPositionAttribute = null;
        }

        try {
            textureCoordinatesAttribute = mesh.attribute(MeshAttribute.TextureCoordinate);
            doubleSidedTextureCoordinatesAttribute = doubleSidedMesh.attribute(MeshAttribute.TextureCoordinate);
        } catch (error) {
            textureCoordinatesAttribute = null;
            doubleSidedTextureCoordinatesAttribute = null;
        }

        try {
            normalAttribute = mesh.attribute(MeshAttribute.Normal);
            doubleSidedNormalAttribute = doubleSidedMesh.attribute(MeshAttribute.Normal);
        } catch (error) {
            normalAttribute = null;
            doubleSidedNormalAttribute = null;
        }

        try {
            colorAttribute = mesh.attribute(MeshAttribute.Color);
            doubleSidedColorAttribute = doubleSidedMesh.attribute(MeshAttribute.Color);
        } catch (error) {
            colorAttribute = null;
            doubleSidedColorAttribute = null;
        }

        for (let i = 0; i < mesh.vertexCount; i++) {
            if (positionAttribute != null && doubleSidedPositionAttribute != null) {
                doubleSidedPositionAttribute.set(i * 2, positionAttribute.get(i, position));
                doubleSidedPositionAttribute.set(i * 2 + 1, positionAttribute.get(i, position));
            }

            if (textureCoordinatesAttribute != null && doubleSidedTextureCoordinatesAttribute != null) {
                doubleSidedTextureCoordinatesAttribute.set(i * 2, textureCoordinatesAttribute.get(i, textureCoordinates));
                doubleSidedTextureCoordinatesAttribute.set(i * 2 + 1, textureCoordinatesAttribute.get(i, textureCoordinates));
            }

            if (normalAttribute != null && doubleSidedNormalAttribute != null) {
                normalAttribute.get(i, normal);
                doubleSidedNormalAttribute.set(i * 2, normal);

                let invertedNormal = normal.vec3_negate();
                doubleSidedNormalAttribute.set(i * 2 + 1, invertedNormal);
            }

            if (colorAttribute != null && doubleSidedColorAttribute != null) {
                doubleSidedColorAttribute.set(i * 2, colorAttribute.get(i, color));
                doubleSidedColorAttribute.set(i * 2 + 1, colorAttribute.get(i, color));
            }
        }

        return doubleSidedMesh;
    };
}();

export function createPlane(engine = Globals.getMainEngine()) {
    let vertexCount = 4;

    let meshCreationParams = new MeshCreationParams(engine);

    for (let i = 0; i < vertexCount; ++i) {
        let vertexCreationParams = new MeshCreationVertexParams();

        vertexCreationParams.myPosition = new vec3_create();
        vertexCreationParams.myPosition[0] = -1 + (i & 1) * 2;
        vertexCreationParams.myPosition[1] = -1 + ((i & 2) >> 1) * 2; // This is a quick way to have positions (-1,-1) (1,-1) (1,-1) (1,1)
        vertexCreationParams.myPosition[2] = 0;

        vertexCreationParams.myTextureCoordinates = new vec2_create();
        vertexCreationParams.myTextureCoordinates[0] = (i & 1);
        vertexCreationParams.myTextureCoordinates[1] = ((i & 2) >> 1);

        vertexCreationParams.myNormal = new vec3_create();
        vertexCreationParams.myNormal[0] = 0;
        vertexCreationParams.myNormal[1] = 0;
        vertexCreationParams.myNormal[2] = 1;

        meshCreationParams.myVertexes.push(vertexCreationParams);
    }

    let firstTriangle = new MeshCreationTriangleParams();
    firstTriangle.myIndexes[0] = 0;
    firstTriangle.myIndexes[1] = 1;
    firstTriangle.myIndexes[2] = 2;

    let secondTriangle = new MeshCreationTriangleParams();
    secondTriangle.myIndexes[0] = 2;
    secondTriangle.myIndexes[1] = 1;
    secondTriangle.myIndexes[2] = 3;

    meshCreationParams.myTriangles.push(firstTriangle);
    meshCreationParams.myTriangles.push(secondTriangle);

    let mesh = MeshUtils.create(meshCreationParams);

    return mesh;
}

export let MeshUtils = {
    create,
    clone,
    invert,
    makeDoubleSided,
    createPlane
};