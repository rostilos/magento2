define([
    "ko",
    "uiComponent",
    "underscore",
    "Magento_Checkout/js/model/step-navigator",
    "Magento_Customer/js/model/customer",
], function (ko, Component, _, stepNavigator, customer) {
    "use strict";

    return Component.extend({
        defaults: {
            template: "Roadmap_RegisterCheckout/registerstep",
        },
        isCustomerLoggedIn: customer.isLoggedIn,
        isVisible: ko.observable(!customer.isLoggedIn()),
		stepCode: 'login',
		stepTitle: 'Login',

        /**
         *
         * @returns {*}
         */
        initialize: function () {
            window.loggedin = this.isCustomerLoggedIn();
            this._super();
            if (!customer.isLoggedIn()) {
                stepNavigator.registerStep(
                    this.stepCode,
                    null,
                    this.stepTitle,
                    this.isVisible,

                    _.bind(this.navigate, this),
                    5
                );
            }
            return this;
        },

        navigate: function () {},

        /**
         * @returns void
         */
        navigateToNextStep: function () {
            stepNavigator.next();
        },
    });
});
