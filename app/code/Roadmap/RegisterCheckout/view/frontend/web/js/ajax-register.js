// fetch register form
require(["jquery", "Magento_Customer/js/model/customer"], function (
    $,
    customer
) {
    function waitForElement(elementPath, callBack) {
        window.setTimeout(function () {
            if ($(elementPath).length) {
                callBack(elementPath, $(elementPath));
            } else {
                waitForElement(elementPath, callBack);
            }
        }, 500);
    }

    $.ajax({
        url: "/roadmapregister/index/register",
        type: "post",
        data: {
            cart: "yes",
        },
        success: function (response) {
            waitForElement("#registerblock", function () {
                $("#registerblock").html(response);
                $('#registerblock').trigger('contentUpdated');
            });
        },
        error: function (xhr) {},
    });
});
