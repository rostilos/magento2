var config = {
'config': {
    'mixins': {
        'Magento_Checkout/js/view/shipping': {
            'Roadmap_RegisterCheckout/js/view/shipping-payment-mixin': true
        },
        'Magento_Checkout/js/view/payment': {
            'Roadmap_RegisterCheckout/js/view/shipping-payment-mixin': true
        }
    }
}
}