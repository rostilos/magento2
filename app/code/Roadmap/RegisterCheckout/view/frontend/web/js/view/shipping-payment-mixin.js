define(
    [
        'ko',
		'Magento_Customer/js/model/customer'
    ], function (ko, customer) {
        'use strict';

        var mixin = {

            initialize: function () {
				if(!customer.isLoggedIn()) {
					this.isVisible = ko.observable(false);
					this.visible = ko.observable(false);
				}
					this._super();
				
                return this;
            }
        };

        return function (target) {
            return target.extend(mixin);
        };
    }
);
