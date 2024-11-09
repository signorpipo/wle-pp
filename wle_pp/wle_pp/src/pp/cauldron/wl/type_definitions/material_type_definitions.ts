import { Material } from "@wonderlandengine/api";
import { Vector4 } from "../../../cauldron/type_definitions/array_type_definitions.js";

export interface TextMaterial extends Material {
    color: Vector4;
    effetColor: Vector4;
}

export interface FlatMaterial extends Material {
    color: Vector4;
}

export interface PhongMaterial extends Material {
    ambientColor: Vector4;
    diffuseColor: Vector4,
    specularColor: Vector4;
    fogColor: Vector4,
}