var config = {
    map: {
        "*": {
            "Magento_Checkout/template/summary/item/details.html":
                "Roadmap_Checkout/template/summary/item/details.html",
            "Magento_Checkout/template/shipping-address/shipping-method-list.html":
                "Roadmap_Checkout/template/shipping-address/shipping-method-list.html",
            "Magento_Checkout/template/shipping-address/shipping-method-item.html":
                "Roadmap_Checkout/template/shipping-address/shipping-method-item.html",
            "Magento_Checkout/template/payment-methods/list.html":
                "Roadmap_Checkout/template/payment-methods/list.html",
        },
    },
    config: {
        mixins: {
            "Magento_Checkout/js/view/summary/item/details": {
                "Roadmap_Checkout/js/view/summary/item/details-mixin": true,
            },
            "Magento_Checkout/js/view/shipping": {
                "Roadmap_Checkout/js/view/shipping-mixin": true,
            },
            "Magento_Checkout/js/view/payment/list" : {
                "Roadmap_Checkout/js/view/payment/list-mixin": true,
            }
        },
    },
};
