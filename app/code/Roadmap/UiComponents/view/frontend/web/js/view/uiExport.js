
define(["uiComponent", "ko"], function (uiComponent, ko) {
    "use strict";

    return uiComponent.extend({
        defaults: {
            tracks: {
                email: true
            },
        },

        initialize() {
            this._super();
        },
    });
});

