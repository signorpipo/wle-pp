import { Material } from "@wonderlandengine/api";
import { Vector4 } from "wle-pp";

export interface FlatMaterial extends Material {
    color: Vector4
}

export interface PhongMaterial extends Material {
    ambientColor: Vector4
    diffuseColor: Vector4
    specularColor: Vector4
    fogColor: Vector4
}