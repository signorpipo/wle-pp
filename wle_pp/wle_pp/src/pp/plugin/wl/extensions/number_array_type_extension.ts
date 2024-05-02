import { ArrayLike } from "../../../cauldron/type_definitions/array_type_definitions.js";

declare module "@wonderlandengine/api" {
    interface NumberArray extends ArrayLike<number> { }
}