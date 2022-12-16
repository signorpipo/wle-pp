//PP

require('./pp/pp');

//	PLUGIN
require('./pp/plugin/extensions/array_extension');
require('./pp/plugin/extensions/object_extension');
require('./pp/plugin/extensions/math_extension');
require('./pp/plugin/extensions/scene_extension');

require('./pp/plugin/component_mods/clone_component_mod');
require('./pp/plugin/component_mods/cursor_component_mod');
require('./pp/plugin/component_mods/cursor_target_component_mod');
require('./pp/plugin/component_mods/mouse_look_component_mod');

//	AUDIO
require('./pp/audio/spatial_audio_listener');
require('./pp/audio/audio_manager_component');
require('./pp/audio/audio_manager');
require('./pp/audio/audio_player');
require('./pp/audio/audio_setup');
require('./pp/audio/mute_everything');

//	CAULDRON
require('./pp/cauldron/benchmarks/max_physx');
require('./pp/cauldron/benchmarks/max_visible_triangles');

require('./pp/cauldron/cauldron/number_over_value');
require('./pp/cauldron/cauldron/object_pool_manager');
require('./pp/cauldron/cauldron/physx_collision_collector');
require('./pp/cauldron/cauldron/save_manager');
require('./pp/cauldron/cauldron/timer');

require('./pp/cauldron/components/clear_console_on_xr_session_start');
require('./pp/cauldron/components/set_active');
require('./pp/cauldron/components/adjust_hierarchy_physx_scale');
require('./pp/cauldron/components/get_player_objects');
require('./pp/cauldron/components/get_default_resources');
require('./pp/cauldron/components/show_fps');

require('./pp/cauldron/fsm/fsm');
require('./pp/cauldron/fsm/state');
require('./pp/cauldron/fsm/transition');
require('./pp/cauldron/fsm/states/timer_state');

require('./pp/cauldron/utils/ca_utils');
require('./pp/cauldron/utils/color_utils');
require('./pp/cauldron/utils/mesh_utils');
require('./pp/cauldron/utils/save_utils');
require('./pp/cauldron/utils/text_utils');
require('./pp/cauldron/utils/xr_utils');
require('./pp/cauldron/utils/browser_utils');

require('./pp/cauldron/physics/physics_utils');
require('./pp/cauldron/physics/physics_raycast_data');
require('./pp/cauldron/physics/physics_layer_flags');

require('./pp/cauldron/visual/visual_manager');

require('./pp/cauldron/visual/elements/visual_element_types');
require('./pp/cauldron/visual/elements/visual_line');
require('./pp/cauldron/visual/elements/visual_mesh');
require('./pp/cauldron/visual/elements/visual_point');
require('./pp/cauldron/visual/elements/visual_arrow');
require('./pp/cauldron/visual/elements/visual_text');
require('./pp/cauldron/visual/elements/visual_transform');
require('./pp/cauldron/visual/elements/visual_raycast');
require('./pp/cauldron/visual/elements/visual_torus');

require('./pp/cauldron/visual/components/visual_manager_component');

//	DEBUG
require('./pp/debug/debug_manager');
require('./pp/debug/debug_visual_manager');

require('./pp/debug/components/debug_transform_component');
require('./pp/debug/components/debug_manager_component');

//	GAMEPLAY
require('./pp/gameplay/cauldron/direction_2D_to_3D_converter');

require('./pp/gameplay/grab_throw/grabbable');
require('./pp/gameplay/grab_throw/grabber_hand');

//	INPUT
require('./pp/input/cauldron/finger_cursor');
require('./pp/input/cauldron/input_types');
require('./pp/input/cauldron/input_utils');
require('./pp/input/cauldron/keyboard');
require('./pp/input/cauldron/mouse');
require('./pp/input/cauldron/input_manager');
require('./pp/input/cauldron/input_manager_component');
require('./pp/input/cauldron/switch_hand_object');
require('./pp/input/cauldron/tracked_hand_draw_joint');
require('./pp/input/cauldron/tracked_hand_draw_all_joints');
require('./pp/input/cauldron/tracked_hand_draw_skin');

require('./pp/input/gamepad/gamepad_buttons');
require('./pp/input/gamepad/base_gamepad');
require('./pp/input/gamepad/universal_gamepad');
require('./pp/input/gamepad/gamepad_cores/gamepad_core');
require('./pp/input/gamepad/gamepad_cores/xr_gamepad_core');
require('./pp/input/gamepad/gamepad_cores/keyboard_gamepad_core');
require('./pp/input/gamepad/gamepad_cores/virtual_gamepad_gamepad_core');
require('./pp/input/gamepad/cauldron/gamepad_mesh_animator');
require('./pp/input/gamepad/cauldron/gamepad_manager');
require('./pp/input/gamepad/cauldron/gamepad_utils');
require('./pp/input/gamepad/cauldron/gamepad_control_scheme');

require('./pp/input/gamepad/virtual_gamepad/virtual_gamepad');
require('./pp/input/gamepad/virtual_gamepad/virtual_gamepad_component');
require('./pp/input/gamepad/virtual_gamepad/virtual_gamepad_params');
require('./pp/input/gamepad/virtual_gamepad/virtual_gamepad_virtual_button');
require('./pp/input/gamepad/virtual_gamepad/virtual_gamepad_virtual_thumbstick');
require('./pp/input/gamepad/virtual_gamepad/virtual_gamepad_icon');

require('./pp/input/pose/base_pose.js');
require('./pp/input/pose/hand_pose');
require('./pp/input/pose/head_pose');
require('./pp/input/pose/tracked_hand_joint_pose');
require('./pp/input/pose/tracked_hand_pose');
require('./pp/input/pose/components/set_player_height');
require('./pp/input/pose/components/set_hand_local_transform');
require('./pp/input/pose/components/set_head_local_transform');
require('./pp/input/pose/components/set_vr_head_local_transform');
require('./pp/input/pose/components/set_non_vr_head_local_transform');
require('./pp/input/pose/components/set_tracked_hand_joint_local_transform');
require('./pp/input/pose/components/copy_hand_transform');
require('./pp/input/pose/components/copy_head_transform');
require('./pp/input/pose/components/copy_player_transform');
require('./pp/input/pose/components/copy_player_pivot_transform');

//	TOOL
require('./pp/tool/cauldron/cauldron/tool_types');
require('./pp/tool/cauldron/components/tool_cursor');

require('./pp/tool/console_vr/console_vr_widget_setup');
require('./pp/tool/console_vr/console_vr_widget_ui');
require('./pp/tool/console_vr/console_vr_widget');
require('./pp/tool/console_vr/console_vr');
require('./pp/tool/console_vr/console_vr_component');

require('./pp/tool/easy_tune/easy_object_tuners/easy_object_tuner');
require('./pp/tool/easy_tune/easy_object_tuners/easy_light_attenuation');
require('./pp/tool/easy_tune/easy_object_tuners/easy_light_color');
require('./pp/tool/easy_tune/easy_object_tuners/easy_mesh_color');
require('./pp/tool/easy_tune/easy_object_tuners/easy_scale');
require('./pp/tool/easy_tune/easy_object_tuners/easy_set_tune_target_child_number');
require('./pp/tool/easy_tune/easy_object_tuners/easy_set_tune_target_grab');
require('./pp/tool/easy_tune/easy_object_tuners/easy_transform');

require('./pp/tool/easy_tune/easy_tune_widgets/base/easy_tune_base_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/base/easy_tune_base_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/base/easy_tune_base_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/bool/easy_tune_bool_array_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/bool/easy_tune_bool_array_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/bool/easy_tune_bool_array_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/bool/easy_tune_bool_array_widget_selector');
require('./pp/tool/easy_tune/easy_tune_widgets/none/easy_tune_none_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/none/easy_tune_none_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/none/easy_tune_none_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/number/easy_tune_number_array_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/number/easy_tune_number_array_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/number/easy_tune_number_array_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/number/easy_tune_number_widget_selector');
require('./pp/tool/easy_tune/easy_tune_widgets/transform/easy_tune_transform_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/transform/easy_tune_transform_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/transform/easy_tune_transform_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_widget_setup');

require('./pp/tool/easy_tune/easy_tune_variables');
require('./pp/tool/easy_tune/easy_tune_variable_types');
require('./pp/tool/easy_tune/easy_tune_globals');

require('./pp/tool/easy_tune/components/easy_tune_component');
require('./pp/tool/easy_tune/components/easy_tune_import_variables');

require('./pp/tool/widget_frame/widget_frame_setup');
require('./pp/tool/widget_frame/widget_frame_ui');
require('./pp/tool/widget_frame/widget_frame');