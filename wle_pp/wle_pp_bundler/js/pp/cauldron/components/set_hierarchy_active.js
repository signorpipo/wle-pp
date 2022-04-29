WL.registerComponent('pp-set-hierarchy-active', {
    _myHierarchyActive: { type: WL.Type.Bool, default: true },
    _mySetActiveOn: { type: WL.Type.Enum, values: ['init', 'start', 'first_update'], default: 'init' },
}, {
    init: function () {
        if (this.active && this._mySetActiveOn == 0) {
            this.object.pp_setActiveHierarchy(this._myHierarchyActive);
        }
    },
    start: function () {
        if (this._mySetActiveOn == 1) {
            this.object.pp_setActiveHierarchy(this._myHierarchyActive);
        }
        this._myFirst = true;
    },
    update: function (dt) {
        if (this._mySetActiveOn == 2 && this._myFirst) {
            this._myFirst = false;
            this.object.pp_setActiveHierarchy(this._myHierarchyActive);
        }
    },
});