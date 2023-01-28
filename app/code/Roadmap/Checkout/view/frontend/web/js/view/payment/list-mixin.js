define([
    "jquery",
    "underscore",
    "ko",
    "mageUtils",
    "uiComponent",
    "Magento_Checkout/js/model/payment/method-list",
    "Magento_Checkout/js/model/payment/renderer-list",
    "uiLayout",
    "Magento_Checkout/js/model/checkout-data-resolver",
    "mage/translate",
    "uiRegistry",
    "Magento_Checkout/js/action/select-payment-method",
    "Magento_Checkout/js/checkout-data",
    "Magento_Checkout/js/model/quote",
], function (
    $,
    _,
    ko,
    utils,
    Component,
    paymentMethods,
    rendererList,
    layout,
    checkoutDataResolver,
    $t,
    registry,
    selectPaymentMethodAction,
    checkoutData,
    quote
) {
    "use strict";

    var mixin = {
        defaults: {
            template: "Magento_Checkout/payment-methods/list",
            visible: paymentMethods().length > 0,
            configDefaultGroup: {
                name: "methodGroup",
                component: "Magento_Checkout/js/model/payment/method-group",
            },
            paymentGroupsList: [],
            defaultGroupTitle: $t("Select a new payment method"),
            selectOptionItemTemplate:
                "Roadmap_Checkout/payment-methods/select-option",
        },

        getPaymentMethods: function () {
            return paymentMethods();
        },

        /**
         * @return {Boolean}
         */
        selectPaymentMethod: function (obj, event) {
            const paymentMethod = JSON.parse(event.currentTarget.value);
            selectPaymentMethodAction(paymentMethod);

            checkoutData.setSelectedPaymentMethod(paymentMethod.method);

            return true;
        },

        setDefaultOption: function (element) {
            const optionElements = $('#payment-methods-select').children('option');
            const elValue = element.value;
            const selectedMethod = quote.paymentMethod() ? quote.paymentMethod().method : null;
            if(elValue){
                const isSelected = JSON.parse(elValue).method === selectedMethod;
                isSelected ? element.setAttribute('selected','selected') : null;
            }
        },
    };

    return function (target) {
        return target.extend(mixin);
    };
});
