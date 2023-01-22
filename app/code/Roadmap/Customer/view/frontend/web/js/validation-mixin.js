define(["jquery"], function ($) {
    "use strict";

    return function (target) {
        var dataForm = $('#form-validate');

        var options = {
            input: {
                field: '.customer-auth-input'
            }
        }
        $(document).on('input', options.input.field,function(e){
            $.validator.validateSingleElement(e.currentTarget)
            console.log($.validator.validateSingleElement);
        })
        $.validator.addMethod(
            "custom-validation",
            function (value, element) {
                // только знак дефиса и кириллица
                const regexp = /^[а-яА-Я-]+$/
                return value.match(regexp);
            },
            $.mage.__("Only hyphens and the cyrillic characters are allowed")
        );
        $.validator.addMethod(
            "custom-phone-validation",
            function (value, element) {
                // только украинские номера телефона в любых форматах
                // +380631234567
                // 0631234567
                // 80631234567
                
                const regexp = /^((\+?3)?8)?((0\(\d{2}\)?)|(\(0\d{2}\))|(0\d{2}))\d{7}$/
                return value.match(regexp);
            },
            $.mage.__("Only UA phone numbers are allowed")
        );
        return target;
    };
});
