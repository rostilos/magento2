/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    "jquery",
    "underscore",
    "Magento_Ui/js/form/form",
    "ko",
    "Magento_Customer/js/model/customer",
    "Magento_Customer/js/model/address-list",
    "Magento_Checkout/js/model/address-converter",
    "Magento_Checkout/js/model/quote",
    "Magento_Checkout/js/action/create-shipping-address",
    "Magento_Checkout/js/action/select-shipping-address",
    "Magento_Checkout/js/model/shipping-rates-validator",
    "Magento_Checkout/js/model/shipping-address/form-popup-state",
    "Magento_Checkout/js/model/shipping-service",
    "Magento_Checkout/js/action/select-shipping-method",
    "Magento_Checkout/js/model/shipping-rate-registry",
    "Magento_Checkout/js/action/set-shipping-information",
    "Magento_Checkout/js/model/step-navigator",
    "Magento_Ui/js/modal/modal",
    "Magento_Checkout/js/model/checkout-data-resolver",
    "Magento_Checkout/js/checkout-data",
    "Magento_Catalog/js/price-utils",

    "uiRegistry",
    "mage/translate",
    "Magento_Checkout/js/model/shipping-rate-service",
], function (
    $,
    _,
    Component,
    ko,
    customer,
    addressList,
    addressConverter,
    quote,
    createShippingAddress,
    selectShippingAddress,
    shippingRatesValidator,
    formPopUpState,
    shippingService,
    selectShippingMethodAction,
    rateRegistry,
    setShippingInformationAction,
    stepNavigator,
    modal,
    checkoutDataResolver,
    checkoutData,
    priceUtils,
    registry,
    $t
) {
    "use strict";

    var mixin = {
        defaults: {
            template: "Magento_Checkout/shipping",
            shippingFormTemplate: "Magento_Checkout/shipping-address/form",
            shippingMethodListTemplate:
                "Magento_Checkout/shipping-address/shipping-method-list",
            shippingMethodItemTemplate:
                "Magento_Checkout/shipping-address/shipping-method-item",
            shippingMethodItemSelectedTemplate:
                "Roadmap_Checkout/shipping-address/shipping-method-item-selected",
            imports: {
                countryOptions:
                    "${ $.parentName }.shippingAddress.shipping-address-fieldset.country_id:indexedOptions",
            },
        },

        /**
         * @param {Object} shippingMethod
         * @return {Boolean}
         */
        selectShippingMethod: function (obj, event) {
            const shippingMethod = JSON.parse(event.currentTarget.value);

            selectShippingMethodAction(shippingMethod);
            checkoutData.setSelectedShippingRate(
                shippingMethod["carrier_code"] +
                    "_" +
                    shippingMethod["method_code"]
            );

            return true;
        },

        getSelectedShippingMethod: ko.computed(function () {
            var ratesList = shippingService.getShippingRates()();
            var selectedRateTitle = checkoutData.getSelectedShippingRate();
            var selectedRateArr;
            var selectedRate;
            var getCurency = window.getCurrency;
            if (Array.isArray(ratesList)) {
                selectedRateArr = ratesList.filter(function (rate) {
                    return (
                        `${rate.carrier_code}_${rate.method_code}` ===
                        selectedRateTitle
                    );
                });
            }
            if (selectedRateArr.length > 0) {
                selectedRate = selectedRateArr[0];
                return `${selectedRate.carrier_title}, ${priceUtils.formatPrice(
                    selectedRate.price_excl_tax,
                    quote.getPriceFormat()
                )}`;
            }
        }, this),
    };

    return function (target) {
        return target.extend(mixin);
    };
});
