define(["jquery", "mage/tabs", "Magento_Ui/js/model/messageList"], function (
    $,
    tabs,
    messageList
) {
    "use strict";

    return function (target) {
        $.validator.addMethod(
            "register-email-remote",
            function (value, element, param, method) {
                if (this.optional(element)) {
                    return "dependency-mismatch";
                }

                method = (typeof method === "string" && method) || "remote";

                var previous = this.previousValue(element, method),
                    validator,
                    data,
                    optionDataString;

                if (!this.settings.messages[element.name]) {
                    this.settings.messages[element.name] = {};
                }
                previous.originalMessage =
                    previous.originalMessage ||
                    this.settings.messages[element.name][method];
                this.settings.messages[element.name][method] = previous.message;

                param = (typeof param === "string" && { url: param }) || param;
                optionDataString = $.param(
                    $.extend({ data: value }, param.data)
                );
                if (previous.old === optionDataString) {
                    return previous.valid;
                }

                previous.old = optionDataString;
                validator = this;
                this.startRequest(element);
                data = {};
                data[element.name] = value;
                $.ajax(
                    $.extend(
                        true,
                        {
                            mode: "abort",
                            port: "validate" + element.name,
                            dataType: "json",
                            data: data,
                            context: validator.currentForm,
                            success: function (response) {
                                var valid =
                                        response === true ||
                                        response === "true",
                                    errors,
                                    message,
                                    submitted;

                                validator.settings.messages[element.name][
                                    method
                                ] = previous.originalMessage;
                                if (valid) {
                                    submitted = validator.formSubmitted;
                                    validator.resetInternals();
                                    validator.toHide =
                                        validator.errorsFor(element);
                                    validator.formSubmitted = submitted;
                                    validator.successList.push(element);
                                    validator.invalid[element.name] = false;
                                    validator.showErrors();
                                } else {
                                    errors = {};
                                    message =
                                        response ||
                                        validator.defaultMessage(element, {
                                            method: method,
                                            parameters: value,
                                        });
                                    errors[element.name] = previous.message =
                                        message;
                                    validator.invalid[element.name] = true;
                                    validator.showErrors(errors);
                                    backToLoginTab();
                                }
                                previous.valid = valid;
                                validator.stopRequest(element, valid);
                            },
                        },
                        param
                    )
                );
                return "pending";
            },
            $.mage.__("A user with this email has already registered")
        );

        function backToLoginTab() {
            if ($(".product.data.items").length) {
                $(".product.data.items").tabs("activate", 0);

                const regEmailValue = $("#email_address").val();
                $("input[name=login\\[username\\]]").val(regEmailValue);

                messageList.addErrorMessage({ message: "A user with this email has already registered" });
            }
        }

        return target;
    };
});
