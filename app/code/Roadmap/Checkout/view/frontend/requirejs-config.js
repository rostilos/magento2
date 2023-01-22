var config = {
    map: {
        "*": {
            "Magento_Checkout/template/summary/item/details.html":
                "Roadmap_Checkout/template/summary/item/details.html",
        },
    },
    config: {
        mixins: {
            "Magento_Checkout/js/view/summary/item/details": {
                "Roadmap_Checkout/js/view/summary/item/details-mixin": true,
            },
        },
    },
};
