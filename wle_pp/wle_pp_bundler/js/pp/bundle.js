//PP

require("./pp/pp");

require("./pp/components/pp_gateway_component");
require("./pp/components/get_player_objects");
require("./pp/components/get_default_resources");

//	PLUGIN
require("./plugin/extensions/array_extension");
require("./plugin/extensions/math_extension");
require("./plugin/extensions/object_extension");
require("./plugin/extensions/scene_extension");

require("./plugin/component_mods/clone_component_mod");
require("./plugin/component_mods/cursor_component_mod");
require("./plugin/component_mods/cursor_target_component_mod");
require("./plugin/component_mods/mouse_look_component_mod");

//	AUDIO
require("./audio/spatial_audio_listener");
require("./audio/audio_manager_component");
require("./audio/audio_manager");
require("./audio/audio_player");
require("./audio/audio_setup");
require("./audio/mute_everything");
require("./audio/audio_utils");

require("./audio/howler/howler_audio_player");

//	CAULDRON
require("./cauldron/benchmarks/max_physx");
require("./cauldron/benchmarks/max_visible_triangles");

require("./cauldron/cauldron/object_pool");
require("./cauldron/cauldron/object_pools_manager");
require("./cauldron/cauldron/save_manager");
require("./cauldron/cauldron/timer");

require("./cauldron/components/clear_console_on_xr_session_start");
require("./cauldron/components/set_active");
require("./cauldron/components/adjust_hierarchy_physx_scale");
require("./cauldron/components/show_fps");

require("./cauldron/fsm/fsm");
require("./cauldron/fsm/state");
require("./cauldron/fsm/transition");
require("./cauldron/fsm/states/timer_state");

require("./cauldron/utils/color_utils");
require("./cauldron/utils/material_utils");
require("./cauldron/utils/mesh_utils");
require("./cauldron/utils/save_utils");
require("./cauldron/utils/text_utils");
require("./cauldron/utils/xr_utils");
require("./cauldron/utils/browser_utils");
require("./cauldron/utils/js_utils");

require("./cauldron/physics/physics_utils");
require("./cauldron/physics/physics_raycast_data");
require("./cauldron/physics/physics_layer_flags");
require("./cauldron/physics/physics_collision_collector");

require("./cauldron/visual/visual_manager");

require("./cauldron/visual/elements/visual_element_types");
require("./cauldron/visual/elements/visual_line");
require("./cauldron/visual/elements/visual_mesh");
require("./cauldron/visual/elements/visual_point");
require("./cauldron/visual/elements/visual_arrow");
require("./cauldron/visual/elements/visual_text");
require("./cauldron/visual/elements/visual_transform");
require("./cauldron/visual/elements/visual_raycast");
require("./cauldron/visual/elements/visual_torus");

require("./cauldron/visual/components/visual_manager_component");

//	DEBUG
require("./debug/debug_manager");
require("./debug/debug_visual_manager");

require("./debug/components/debug_transform_component");
require("./debug/components/debug_manager_component");

require("./debug/debug_functions_overwriter/debug_functions_overwriter");
require("./debug/debug_functions_overwriter/debug_functions_performance_analyzer/debug_functions_performance_analyzer");
require("./debug/debug_functions_overwriter/debug_functions_performance_analyzer/debug_functions_performance_analysis_results_logger");
require("./debug/debug_functions_overwriter/debug_functions_performance_analyzer/components/debug_functions_performance_analyzer_component");
require("./debug/debug_functions_overwriter/debug_functions_performance_analyzer/components/debug_pp_functions_performance_analyzer_component");
require("./debug/debug_functions_overwriter/debug_functions_performance_analyzer/components/debug_array_functions_performance_analyzer_component");
require("./debug/debug_functions_overwriter/debug_functions_performance_analyzer/components/debug_pp_array_creation_performance_analyzer_component");
require("./debug/debug_functions_overwriter/debug_functions_performance_analyzer/components/debug_wl_function_performance_analyzer_component");
require("./debug/debug_functions_overwriter/debug_functions_performance_analyzer/components/debug_wl_components_function_performance_analyzer_component.js");

//	GAMEPLAY

//    CAULDRON
require("./gameplay/cauldron/cauldron/direction_2D_to_3D_converter");
require("./gameplay/cauldron/cauldron/number_over_value");

//    GRAB & THROW
require("./gameplay/grab_throw/grabbable");
require("./gameplay/grab_throw/grabber_hand");

//    INTEGRATIONS
require("./gameplay/integrations/construct_arcade/ca_utils");
require("./gameplay/integrations/construct_arcade/ca_dummy_server");
require("./gameplay/integrations/construct_arcade/ca_display_leaderboard");

//    EXPERIMENTAL

//          CAULDRON
require("./gameplay/experimental/cauldron/player/player_head_controller");
require("./gameplay/experimental/cauldron/player/player_view_occlusion");
//require("./gameplay/experimental/cauldron/player/components/player_head_controller_component");
//require("./gameplay/experimental/cauldron/player/components/player_view_occlusion_component");

//          CHARACTER CONTROLLER
require("./gameplay/experimental/character_controller/collision/legacy/collision_check/collision_params");
require("./gameplay/experimental/character_controller/collision/legacy/collision_check/collision_check");
require("./gameplay/experimental/character_controller/collision/legacy/collision_check/collision_movement_check");
require("./gameplay/experimental/character_controller/collision/legacy/collision_check/collision_teleport_check");
require("./gameplay/experimental/character_controller/collision/legacy/collision_check/collision_position_check");
require("./gameplay/experimental/character_controller/collision/legacy/collision_check/horizontal_collision_check");
require("./gameplay/experimental/character_controller/collision/legacy/collision_check/horizontal_collision_sliding");
require("./gameplay/experimental/character_controller/collision/legacy/collision_check/horizontal_collision_movement_check");
require("./gameplay/experimental/character_controller/collision/legacy/collision_check/horizontal_collision_position_check");
require("./gameplay/experimental/character_controller/collision/legacy/collision_check/vertical_collision_check");
require("./gameplay/experimental/character_controller/collision/legacy/collision_check/collision_surface_check");

require("./gameplay/experimental/character_controller/collision/collision_check_bridge");
require("./gameplay/experimental/character_controller/collision/character_collider_setup");
require("./gameplay/experimental/character_controller/collision/character_collider_utils");
require("./gameplay/experimental/character_controller/collision/character_collision_results");
require("./gameplay/experimental/character_controller/collision/character_collision_system");
//require("./gameplay/experimental/character_controller/collision/components/character_collision_system_component");

require("./gameplay/experimental/character_controller/character_controller");
require("./gameplay/experimental/character_controller/synced_character_controller");
require("./gameplay/experimental/character_controller/character_controller_utils");

//require("./gameplay/experimental/character_controller/components/character_controller_component");

require("./gameplay/experimental/character_controller/player/player_character_controller");
require("./gameplay/experimental/character_controller/player/player_head_character_controller");
require("./gameplay/experimental/character_controller/player/player_hand_character_controller");

//require("./gameplay/experimental/character_controller/player/components/player_character_controller_component");
//require("./gameplay/experimental/character_controller/player/components/player_head_character_controller_component");
//require("./gameplay/experimental/character_controller/player/components/player_hand_character_controller_component");

//          LOCOMOTION
require("./gameplay/experimental/locomotion/components/global_gravity");

require("./gameplay/experimental/locomotion/player/player_locomotion_smooth");
require("./gameplay/experimental/locomotion/player/player_locomotion_rotate");
require("./gameplay/experimental/locomotion/player/player_locomotion_gravity");

require("./gameplay/experimental/locomotion/player/teleport/player_locomotion_teleport");

//require("./gameplay/experimental/locomotion/player/components/player_locomotion_teleport_component");
//require("./gameplay/experimental/locomotion/player/components/player_locomotion_smooth_component");
//require("./gameplay/experimental/locomotion/player/components/player_locomotion_rotate_component");
//require("./gameplay/experimental/locomotion/player/components/player_locomotion_gravity_component");

require("./gameplay/experimental/locomotion/legacy/locomotion/locomotion_utils");
require("./gameplay/experimental/locomotion/legacy/locomotion/player_head_manager");
require("./gameplay/experimental/locomotion/legacy/locomotion/player_transform_manager");
require("./gameplay/experimental/locomotion/legacy/locomotion/player_locomotion_rotate");
require("./gameplay/experimental/locomotion/legacy/locomotion/player_locomotion_movement");
require("./gameplay/experimental/locomotion/legacy/locomotion/player_locomotion_smooth");
require("./gameplay/experimental/locomotion/legacy/locomotion/player_obscure_manager");
require("./gameplay/experimental/locomotion/legacy/locomotion/player_locomotion");
require("./gameplay/experimental/locomotion/legacy/locomotion/player_locomotion_component");

require("./gameplay/experimental/locomotion/legacy/locomotion/teleport/player_locomotion_teleport_parable");
require("./gameplay/experimental/locomotion/legacy/locomotion/teleport/player_locomotion_teleport_state");
require("./gameplay/experimental/locomotion/legacy/locomotion/teleport/player_locomotion_teleport_detection_visualizer");
require("./gameplay/experimental/locomotion/legacy/locomotion/teleport/player_locomotion_teleport_detection_state");
require("./gameplay/experimental/locomotion/legacy/locomotion/teleport/player_locomotion_teleport_detection_state_visibility");
require("./gameplay/experimental/locomotion/legacy/locomotion/teleport/player_locomotion_teleport_teleport_state");
require("./gameplay/experimental/locomotion/legacy/locomotion/teleport/player_locomotion_teleport_teleport_blink_state");
require("./gameplay/experimental/locomotion/legacy/locomotion/teleport/player_locomotion_teleport_teleport_shift_state");
require("./gameplay/experimental/locomotion/legacy/locomotion/teleport/player_locomotion_teleport");

require("./gameplay/experimental/locomotion/legacy/locomotion/cleaned/player_locomotion_cleaned");
require("./gameplay/experimental/locomotion/legacy/locomotion/cleaned/player_locomotion_smooth_cleaned");
require("./gameplay/experimental/locomotion/legacy/locomotion/cleaned/player_transform_manager_cleaned");

//	INPUT
require("./input/cauldron/finger_cursor");
require("./input/cauldron/input_types");
require("./input/cauldron/input_utils");
require("./input/cauldron/keyboard");
require("./input/cauldron/mouse");
require("./input/cauldron/input_manager");
require("./input/cauldron/input_manager_component");
require("./input/cauldron/switch_hand_object");
require("./input/cauldron/tracked_hand_draw_joint");
require("./input/cauldron/tracked_hand_draw_all_joints");
require("./input/cauldron/tracked_hand_draw_skin");

require("./input/gamepad/gamepad_buttons");
require("./input/gamepad/base_gamepad");
require("./input/gamepad/universal_gamepad");
require("./input/gamepad/gamepad_cores/gamepad_core");
require("./input/gamepad/gamepad_cores/xr_gamepad_core");
require("./input/gamepad/gamepad_cores/keyboard_gamepad_core");
require("./input/gamepad/gamepad_cores/virtual_gamepad_gamepad_core");
require("./input/gamepad/gamepad_cores/classic_gamepad_core");
require("./input/gamepad/cauldron/gamepad_mesh_animator");
require("./input/gamepad/cauldron/gamepads_manager");
require("./input/gamepad/cauldron/gamepad_utils");
require("./input/gamepad/cauldron/gamepad_control_scheme");

require("./input/gamepad/virtual_gamepad/virtual_gamepad");
require("./input/gamepad/virtual_gamepad/virtual_gamepad_component");
require("./input/gamepad/virtual_gamepad/virtual_gamepad_params");
require("./input/gamepad/virtual_gamepad/virtual_gamepad_virtual_button");
require("./input/gamepad/virtual_gamepad/virtual_gamepad_virtual_thumbstick");
require("./input/gamepad/virtual_gamepad/virtual_gamepad_icon");

require("./input/pose/base_pose.js");
require("./input/pose/hand_pose");
require("./input/pose/head_pose");
require("./input/pose/tracked_hand_joint_pose");
require("./input/pose/tracked_hand_pose");
require("./input/pose/components/set_player_height");
require("./input/pose/components/set_hand_local_transform");
require("./input/pose/components/set_head_local_transform");
require("./input/pose/components/set_vr_head_local_transform");
require("./input/pose/components/set_non_vr_head_local_transform");
require("./input/pose/components/set_tracked_hand_joint_local_transform");
require("./input/pose/components/copy_hand_transform");
require("./input/pose/components/copy_head_transform");
require("./input/pose/components/copy_player_transform");
require("./input/pose/components/copy_player_pivot_transform");

//	TOOL
require("./tool/cauldron/cauldron/tool_types");
require("./tool/cauldron/components/tool_cursor");

require("./tool/console_vr/console_vr_widget_setup");
require("./tool/console_vr/console_vr_widget_ui");
require("./tool/console_vr/console_vr_widget");
require("./tool/console_vr/console_vr");
require("./tool/console_vr/console_vr_component");

require("./tool/easy_tune/easy_object_tuners/easy_object_tuner");
require("./tool/easy_tune/easy_object_tuners/easy_light_attenuation");
require("./tool/easy_tune/easy_object_tuners/easy_light_color");
require("./tool/easy_tune/easy_object_tuners/easy_mesh_color");
require("./tool/easy_tune/easy_object_tuners/easy_scale");
require("./tool/easy_tune/easy_object_tuners/easy_set_tune_target_child_number");
require("./tool/easy_tune/easy_object_tuners/easy_set_tune_target_grab");
require("./tool/easy_tune/easy_object_tuners/easy_transform");
require("./tool/easy_tune/easy_object_tuners/easy_mesh_ambient_factor");

require("./tool/easy_tune/easy_tune_widgets/base/easy_tune_base_widget");
require("./tool/easy_tune/easy_tune_widgets/base/easy_tune_base_widget_ui");
require("./tool/easy_tune/easy_tune_widgets/base/easy_tune_base_widget_setup");
require("./tool/easy_tune/easy_tune_widgets/bool/easy_tune_bool_array_widget");
require("./tool/easy_tune/easy_tune_widgets/bool/easy_tune_bool_array_widget_ui");
require("./tool/easy_tune/easy_tune_widgets/bool/easy_tune_bool_array_widget_setup");
require("./tool/easy_tune/easy_tune_widgets/bool/easy_tune_bool_array_widget_selector");
require("./tool/easy_tune/easy_tune_widgets/none/easy_tune_none_widget");
require("./tool/easy_tune/easy_tune_widgets/none/easy_tune_none_widget_ui");
require("./tool/easy_tune/easy_tune_widgets/none/easy_tune_none_widget_setup");
require("./tool/easy_tune/easy_tune_widgets/number/easy_tune_number_array_widget");
require("./tool/easy_tune/easy_tune_widgets/number/easy_tune_number_array_widget_ui");
require("./tool/easy_tune/easy_tune_widgets/number/easy_tune_number_array_widget_setup");
require("./tool/easy_tune/easy_tune_widgets/number/easy_tune_number_widget_selector");
require("./tool/easy_tune/easy_tune_widgets/transform/easy_tune_transform_widget");
require("./tool/easy_tune/easy_tune_widgets/transform/easy_tune_transform_widget_ui");
require("./tool/easy_tune/easy_tune_widgets/transform/easy_tune_transform_widget_setup");
require("./tool/easy_tune/easy_tune_widgets/easy_tune_widget");
require("./tool/easy_tune/easy_tune_widgets/easy_tune_widget_setup");

require("./tool/easy_tune/easy_tune_variables");
require("./tool/easy_tune/easy_tune_variable_types");
require("./tool/easy_tune/easy_tune_globals");

require("./tool/easy_tune/components/easy_tune_component");
require("./tool/easy_tune/components/easy_tune_import_variables");

require("./tool/widget_frame/widget_frame_setup");
require("./tool/widget_frame/widget_frame_ui");
require("./tool/widget_frame/widget_frame");