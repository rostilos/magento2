define(["uiComponent", "ko"], function (uiComponent, ko) {
    "use strict";

    return uiComponent.extend({
        defaults: {
            provider: 'example',
            tracks: {
                email: true
            },
            // imports: {
            //     email: '${ &.provider }:email',
            // },
        },

        initialize() {
            this._super();
        },
    });
});
