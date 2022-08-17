//PP

require('./pp/pp.js');

//	PLUGIN
require('./pp/plugin/component_mods/clone_component_mod.js');
require('./pp/plugin/component_mods/cursor_component_mod.js');
require('./pp/plugin/component_mods/cursor_target_component_mod.js');
require('./pp/plugin/component_mods/mouse_look_component_mod.js');

require('./pp/plugin/extensions/array_extension.js');
require('./pp/plugin/extensions/object_extension.js');
require('./pp/plugin/extensions/math_extension.js');

//	AUDIO
require('./pp/audio/spatial_audio_listener.js');
require('./pp/audio/audio_manager_component.js');
require('./pp/audio/audio_manager.js');
require('./pp/audio/audio_player.js');
require('./pp/audio/audio_setup.js');
require('./pp/audio/mute_all.js');

//	CAULDRON
require('./pp/cauldron/benchmarks/max_physx.js');
require('./pp/cauldron/benchmarks/max_visible_triangles.js');

require('./pp/cauldron/cauldron/number_over_value.js');
require('./pp/cauldron/cauldron/object_pool_manager.js');
require('./pp/cauldron/cauldron/physx_collision_collector.js');
require('./pp/cauldron/cauldron/save_manager.js');
require('./pp/cauldron/cauldron/timer.js');

require('./pp/cauldron/components/clear_console_on_session.js');
require('./pp/cauldron/components/set_active.js');
require('./pp/cauldron/components/adjust_hierarchy_physx_scale.js');

require('./pp/cauldron/fsm/fsm.js');
require('./pp/cauldron/fsm/state.js');
require('./pp/cauldron/fsm/transition.js');
require('./pp/cauldron/fsm/states/timer_state.js');

require('./pp/cauldron/utils/ca_utils.js');
require('./pp/cauldron/utils/color_utils.js');
require('./pp/cauldron/utils/mesh_utils.js');
require('./pp/cauldron/utils/save_utils.js');
require('./pp/cauldron/utils/text_utils.js');
require('./pp/cauldron/utils/xr_utils.js');

require('./pp/cauldron/physics/physics_utils.js');
require('./pp/cauldron/physics/physics_raycast_data.js');
require('./pp/cauldron/physics/physics_layer_flags.js');

//	DEBUG
require('./pp/debug/debug_manager.js');
require('./pp/debug/debug_transform.js');
require('./pp/debug/debug_line.js');
require('./pp/debug/debug_arrow.js');
require('./pp/debug/debug_point.js');
require('./pp/debug/debug_raycast.js');
require('./pp/debug/debug_text.js');
require('./pp/debug/components/debug_transform_component.js');
require('./pp/debug/components/debug_manager_component.js');

//	GAMEPLAY
require('./pp/gameplay/cauldron/direction_2D_to_3D_converter.js');

require('./pp/gameplay/grab_throw/grabbable.js');
require('./pp/gameplay/grab_throw/grabber_hand.js');

//	INPUT
require('./pp/input/cauldron/finger_cursor.js');
require('./pp/input/cauldron/input_types.js');
require('./pp/input/cauldron/input_utils.js');
require('./pp/input/cauldron/keyboard.js');
require('./pp/input/cauldron/mouse.js');

require('./pp/input/gamepad/gamepad_buttons.js');
require('./pp/input/gamepad/base_gamepad.js');
require('./pp/input/gamepad/universal_gamepad.js');
require('./pp/input/gamepad/gamepad_cores/gamepad_core.js');
require('./pp/input/gamepad/gamepad_cores/xr_gamepad_core.js');
require('./pp/input/gamepad/gamepad_cores/keyboard_gamepad_core.js');
require('./pp/input/gamepad/cauldron/gamepad_animator.js');
require('./pp/input/gamepad/cauldron/gamepad_manager_component.js');
require('./pp/input/gamepad/cauldron/gamepad_manager.js');
require('./pp/input/gamepad/cauldron/gamepad_utils.js');
require('./pp/input/gamepad/cauldron/gamepad_control_scheme.js');

require('./pp/input/pose/hand_pose.js');
require('./pp/input/pose/head_pose.js');
require('./pp/input/pose/components/set_player_height.js');
require('./pp/input/pose/components/set_hand_local_transform.js');
require('./pp/input/pose/components/set_head_local_transform.js');
require('./pp/input/pose/components/set_vr_head_local_transform.js');
require('./pp/input/pose/components/set_non_vr_head_local_transform.js');
require('./pp/input/pose/components/get_player_objects.js');
require('./pp/input/pose/components/copy_hand_transform.js');
require('./pp/input/pose/components/copy_head_transform.js');

//	TOOL
require('./pp/tool/cauldron/cauldron/tool_types.js');
require('./pp/tool/cauldron/components/tool_cursor.js');

require('./pp/tool/console_vr/console_vr_widget_setup.js');
require('./pp/tool/console_vr/console_vr_widget_ui.js');
require('./pp/tool/console_vr/console_vr_widget.js');
require('./pp/tool/console_vr/console_vr.js');

require('./pp/tool/easy_tune/easy_object_tuners/easy_object_tuner.js');
require('./pp/tool/easy_tune/easy_object_tuners/easy_light_attenuation.js');
require('./pp/tool/easy_tune/easy_object_tuners/easy_light_color.js');
require('./pp/tool/easy_tune/easy_object_tuners/easy_mesh_color.js');
require('./pp/tool/easy_tune/easy_object_tuners/easy_scale.js');
require('./pp/tool/easy_tune/easy_object_tuners/easy_set_tune_target_child_number.js');
require('./pp/tool/easy_tune/easy_object_tuners/easy_set_tune_target_grab.js');
require('./pp/tool/easy_tune/easy_object_tuners/easy_transform.js');

require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_bool_array_widget.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_bool_array_widget_ui.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_bool_array_widget_setup.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_bool_widget.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_none_widget.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_none_widget_ui.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_none_widget_setup.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_number_array_widget.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_number_array_widget_ui.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_number_array_widget_setup.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_number_widget.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_transform_widget.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_transform_widget_ui.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_transform_widget_setup.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_widget.js');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_widget_setup.js');

require('./pp/tool/easy_tune/easy_tune_variables.js');
require('./pp/tool/easy_tune/easy_tune.js');

require('./pp/tool/widget_frame/widget_frame_setup.js');
require('./pp/tool/widget_frame/widget_frame_ui.js');
require('./pp/tool/widget_frame/widget_frame.js');