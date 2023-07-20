define(["uiComponent", "ko"], function (uiComponent, ko) {
    "use strict";

    return uiComponent.extend({
        defaults: {
            tracks: {
                email: true
            },
            links: {
                email: "example:email",
            }
        },

        initialize() {
            this._super();
        },
    });
});
