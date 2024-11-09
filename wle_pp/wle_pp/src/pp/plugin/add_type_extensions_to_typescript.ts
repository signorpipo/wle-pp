/**
 * #WARN these type extensions are actually added at runtime only if you call their respective initialization function
 * The `initPP` function, which is automatically called by the `pp-gateway` component, does this for you
 */

import "./js/extensions/array/array_type_extension.js";
import "./js/extensions/array/mat4_type_extension.js";
import "./js/extensions/array/quat2_type_extension.js";
import "./js/extensions/array/quat_type_extension.js";
import "./js/extensions/array/vec2_type_extension.js";
import "./js/extensions/array/vec3_type_extension.js";
import "./js/extensions/array/vec4_type_extension.js";
import "./js/extensions/array/vec_type_extension.js";

import "./js/extensions/math_type_extension.js";

import "./js/extensions/number_type_extension.js";

import "./wl/extensions/number_array_type_extension.js";
import "./wl/extensions/object_type_extension.js";

import "./wl/mods/components/cursor_target_component_type_extension.js";

