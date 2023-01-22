define([
    "jquery",
    "uiComponent",
    "escaper",
    'Magento_Checkout/js/action/get-totals',
], function ($, Component, escaper, getTotalsAction) {
    "use strict";

    var mixin = {
        options: {
            url: {
                update: window.BASE_URL + "checkout/sidebar/updateItemQty",
            },
        },
        /**
         * @param {String} url - ajax url
         * @param {Object} data - post data for ajax call
         * @param {Object} elem - element that initiated the event
         * @param {Function} callback - callback method to execute after AJAX success
         */
        _ajax: function (url, data, elem, callback) {
            $.extend(data, {
                form_key: $.mage.cookies.get("form_key"),
            });

            $.ajax({
                url: url,
                data: data,
                type: "post",
                dataType: "json",
                context: this,

                /** @inheritdoc */
                beforeSend: function () {
                    elem.attr("disabled", "disabled");
                },

                /** @inheritdoc */
                complete: function () {
                    elem.attr("disabled", null);
                },
            })
                .done(function (response) {
                    var msg;

                    if (response.success) {
                        callback.call(this, elem, response);
                    } else {
                        msg = response["error_message"];

                        if (msg) {
                            alert({
                                content: msg,
                            });
                        }
                    }
                })
                .fail(function (error) {
                    console.log(JSON.stringify(error));
                });
        },

        /**
         * @private
         */
        hadleControlsClick: function (data, event) {
            // handle click on +- btns, set updated data to input val, call method to upd qty
            const inputEl = $(event.currentTarget).siblings(".cart-item-qty");
            const itemId = inputEl.data("cart-item");
            const currentValue = inputEl.val();
            let changedValue;
            if ($(event.currentTarget).hasClass("cart-item-qty-inc")) {
                changedValue = parseInt(currentValue) + 1;
            } else {
                if (parseInt(currentValue) > 1) {
                    changedValue = parseInt(currentValue) - 1;
                }
            }
            if (changedValue && changedValue !== currentValue) {
                inputEl.val(changedValue);
                this._updateCartAfterChangeQty(inputEl, itemId, changedValue);
            }
        },

        /**
         * @private
         */
         _updateCartAfterChangeQty: function (inputEl, itemId, changedValue) {
            //  call upd function only after .8s after last click on controls btns
            clearTimeout(this.updateCardTimer);
            this.updateCardTimer = setTimeout(() => {
                this._updateItemQty(inputEl, itemId, changedValue);
            }, 800);
        },
        /**
         * @param {HTMLElement} elem
         * @private
         */
        _updateItemQty: function (elem, itemId, qty) {
            // request to upd cart items qty
            this._ajax(
                this.options.url.update,
                {
                    item_id: itemId,
                    item_qty: qty,
                },
                elem,
                this._updateItemQtyAfter
            );
        },
        /**
         * Update content after update qty
         *
         * @param {HTMLElement} elem
         */
        _updateItemQtyAfter: function (elem) {
            // update cart items/customerData section
            $(document).trigger("ajax:updateCartItemQty");
            // update totals section
            var deferred = $.Deferred();
            getTotalsAction([], deferred);
        },

        
    };

    return function (target) {
        return target.extend(mixin);
    };
});
