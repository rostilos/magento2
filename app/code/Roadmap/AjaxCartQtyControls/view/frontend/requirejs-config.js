var config = {
    config: {
        mixins: {
            "Magento_Checkout/js/sidebar": {
                "Roadmap_AjaxCartQtyControls/js/sidebar-mixin": true,
            },
        },
    },
    map: {
        "*": {
            "Magento_Checkout/template/minicart/item/default.html":
                "Roadmap_AjaxCartQtyControls/template/minicart/item/default.html",
            "Magento_Checkout/js/view/minicart":
                "Roadmap_AjaxCartQtyControls/js/view/minicart",
        },
    },
    
};

