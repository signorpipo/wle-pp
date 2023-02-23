PP.MeshCreationVertexParams = class MeshCreationVertexParams {
    constructor() {
        this.myPosition = null;             // vec3
        this.myTextureCoordinates = null;   // vec2
        this.myNormal = null;               // vec3
        this.myColor = null;                // vec4
    }
};

PP.MeshCreationTriangleParams = class MeshCreationTriangleParams {
    constructor() {
        this.myIndexes = new Uint32Array(3);
    }
};

PP.MeshCreationParams = class MeshCreationParams {
    constructor() {
        this.myVertexes = [];
        this.myTriangles = [];
    }
};

PP.MeshUtils = {
    createPlaneMesh: function () {
        let vertexCount = 4;

        let meshParams = new PP.MeshCreationParams();

        for (let i = 0; i < vertexCount; ++i) {
            let vertexParams = new PP.MeshCreationVertexParams();

            vertexParams.myPosition = new PP.vec3_create();
            vertexParams.myPosition[0] = -1 + (i & 1) * 2;
            vertexParams.myPosition[1] = -1 + ((i & 2) >> 1) * 2; // this is a quick way to have positions (-1,-1) (1,-1) (1,-1) (1,1)
            vertexParams.myPosition[2] = 0;

            vertexParams.myTextureCoordinates = new PP.vec2_create();
            vertexParams.myTextureCoordinates[0] = (i & 1);
            vertexParams.myTextureCoordinates[1] = ((i & 2) >> 1);

            vertexParams.myNormal = new PP.vec3_create();
            vertexParams.myNormal[0] = 0;
            vertexParams.myNormal[1] = 0;
            vertexParams.myNormal[2] = 1;

            meshParams.myVertexes.push(vertexParams);
        }

        let firstTriangle = new PP.MeshCreationTriangleParams();
        firstTriangle.myIndexes[0] = 0;
        firstTriangle.myIndexes[1] = 1;
        firstTriangle.myIndexes[2] = 2;

        let secondTriangle = new PP.MeshCreationTriangleParams();
        secondTriangle.myIndexes[0] = 2;
        secondTriangle.myIndexes[1] = 1;
        secondTriangle.myIndexes[2] = 3;

        meshParams.myTriangles.push(firstTriangle);
        meshParams.myTriangles.push(secondTriangle);

        let mesh = PP.MeshUtils.createMesh(meshParams);

        return mesh;
    },
    createMesh: function (meshCreationParams) {
        let indexData = [];
        for (let triangle of meshCreationParams.myTriangles) {
            indexData.push(triangle.myIndexes[0]);
            indexData.push(triangle.myIndexes[1]);
            indexData.push(triangle.myIndexes[2]);
        }

        let indexDataUnsignedInt = new Uint32Array(indexData.length);
        indexDataUnsignedInt.pp_copy(indexData);

        let vertexCount = meshCreationParams.myVertexes.length;
        let mesh = new WL.Mesh({
            vertexCount: vertexCount,
            indexData: indexDataUnsignedInt,
            indexType: WL.MeshIndexType.UnsignedInt,
        });

        let positionAttribute = null;
        let textureCoordinatesAttribute = null;
        let normalAttribute = null;
        let colorAttribute = null;

        try {
            positionAttribute = mesh.attribute(WL.MeshAttribute.Position);
        } catch (error) {
            positionAttribute = null;
        }

        try {
            textureCoordinatesAttribute = mesh.attribute(WL.MeshAttribute.TextureCoordinate);
        } catch (error) {
            textureCoordinatesAttribute = null;
        }

        try {
            normalAttribute = mesh.attribute(WL.MeshAttribute.Normal);
        } catch (error) {
            normalAttribute = null;
        }

        try {
            colorAttribute = mesh.attribute(WL.MeshAttribute.Color);
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
    },
    cloneMesh: function () {
        let position = PP.vec3_create();
        let textureCoordinates = PP.vec2_create();
        let normal = PP.vec3_create();
        let color = PP.vec4_create();

        return function cloneMesh(mesh) {
            if (mesh == null) {
                return null;
            }

            let clonedIndexData = new Uint32Array(mesh.indexData.length);
            for (let i = 0; i < mesh.indexData.length; i++) {
                clonedIndexData[i] = mesh.indexData[i];
            }

            let clonedMesh = new WL.Mesh({
                vertexCount: mesh.vertexCount,
                indexData: clonedIndexData,
                indexType: WL.MeshIndexType.UnsignedInt,
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
                positionAttribute = mesh.attribute(WL.MeshAttribute.Position);
                clonedPositionAttribute = clonedMesh.attribute(WL.MeshAttribute.Position);
            } catch (error) {
                positionAttribute = null;
                clonedPositionAttribute = null;
            }

            try {
                textureCoordinatesAttribute = mesh.attribute(WL.MeshAttribute.TextureCoordinate);
                clonedTextureCoordinatesAttribute = clonedMesh.attribute(WL.MeshAttribute.TextureCoordinate);
            } catch (error) {
                textureCoordinatesAttribute = null;
                clonedTextureCoordinatesAttribute = null;
            }

            try {
                normalAttribute = mesh.attribute(WL.MeshAttribute.Normal);
                clonedNormalAttribute = clonedMesh.attribute(WL.MeshAttribute.Normal);
            } catch (error) {
                normalAttribute = null;
                clonedNormalAttribute = null;
            }

            try {
                colorAttribute = mesh.attribute(WL.MeshAttribute.Color);
                clonedColorAttribute = clonedMesh.attribute(WL.MeshAttribute.Color);
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
    }(),
    invertMesh: function () {
        let position = PP.vec3_create();
        let textureCoordinates = PP.vec2_create();
        let normal = PP.vec3_create();
        let color = PP.vec4_create();

        return function invertMesh(mesh) {
            if (mesh == null) {
                return null;
            }

            let invertedIndexData = new Uint32Array(mesh.indexData.length);
            for (let i = 0; i < mesh.indexData.length / 3; i++) {
                invertedIndexData[i * 3 + 0] = mesh.indexData[i * 3 + 2];
                invertedIndexData[i * 3 + 1] = mesh.indexData[i * 3 + 1];
                invertedIndexData[i * 3 + 2] = mesh.indexData[i * 3 + 0];
            }

            let invertedMesh = new WL.Mesh({
                vertexCount: mesh.vertexCount,
                indexData: invertedIndexData,
                indexType: WL.MeshIndexType.UnsignedInt,
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
                positionAttribute = mesh.attribute(WL.MeshAttribute.Position);
                invertedPositionAttribute = invertedMesh.attribute(WL.MeshAttribute.Position);
            } catch (error) {
                positionAttribute = null;
                invertedPositionAttribute = null;
            }

            try {
                textureCoordinatesAttribute = mesh.attribute(WL.MeshAttribute.TextureCoordinate);
                invertedTextureCoordinatesAttribute = invertedMesh.attribute(WL.MeshAttribute.TextureCoordinate);
            } catch (error) {
                textureCoordinatesAttribute = null;
                invertedTextureCoordinatesAttribute = null;
            }

            try {
                normalAttribute = mesh.attribute(WL.MeshAttribute.Normal);
                invertedNormalAttribute = invertedMesh.attribute(WL.MeshAttribute.Normal);
            } catch (error) {
                normalAttribute = null;
                invertedNormalAttribute = null;
            }

            try {
                colorAttribute = mesh.attribute(WL.MeshAttribute.Color);
                invertedColorAttribute = invertedMesh.attribute(WL.MeshAttribute.Color);
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
                    normalAttribute.get(i, normal)
                    normal.vec3_negate(normal);
                    invertedNormalAttribute.set(i, normal);
                }
                if (colorAttribute != null && invertedColorAttribute != null) {
                    invertedColorAttribute.set(i, colorAttribute.get(i, color));
                }
            }

            return invertedMesh;
        };
    }()
};