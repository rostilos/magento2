require(["jquery"], function ($) {
    // loadWchatScript(false);
    $(".fake-wchat-btn").one("click", function () {
        loadWchatScript(true);
    });

    function loadWchatScript(open = false) {
        $(".fake-wchat-btn-cover-spin").show();
        $(".fake-wchat-btn-icon").hide();

        function initFreshChat() {
            window.fcWidget.init({
                token: "8f5975a7-974c-40d8-a15a-806b0d78e92a",
                host: "https://wchat.eu.freshchat.com",
                open,
            });

            window.fcWidget.on("widget:loaded", function () {
                $(".fake-wchat-btn").hide()
            });
        }

        function initialize(i, t) {
            var e;
            i.getElementById(t)
                ? initFreshChat()
                : (((e = i.createElement("script")).id = t),
                    (e.async = !0),
                    (e.src = "https://wchat.eu.freshchat.com/js/widget.js"),
                    (e.onload = initFreshChat),
                    i.head.appendChild(e));
        }

        initialize(document, "Freshdesk Messaging-js-sdk");
    }
});
