WL.registerComponent('pp-adjust-hierarchy-physx-scale', {
}, {
    start() {
        let scale = this.object.pp_getScale();
        let physXComponents = this.object.pp_getComponentsHierarchy("physx");
        for (let physX of physXComponents) {
            physX.extents[0] = physX.extents[0] * scale[0];
            physX.extents[1] = physX.extents[1] * scale[1];
            physX.extents[2] = physX.extents[2] * scale[2];

            if (physX.active) {
                physX.active = false;
                physX.active = true;
            }
        }
    }
});