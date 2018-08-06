// -----------------------------------------------------------------------------
clientId = "";
uChatChannel = "myChannel";
fChatChannel = "My channel for learning";

function getToken() {
    clientId = $("#username").val();
    return fetch(`/clientTokenGet.php?clientid=${clientId}`)
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error("- Network response was not ok.");
            })
            .catch(error => console.log("- Error fetching token: ", error) || error);

}

function doGetToken() {
    getToken().then(token => {
        console.log("+ Returned token :" + token + ":");
        return Twilio.Chat.Client.create(token, {logLevel: "debug"});
    }).then(client => {
        logger("getChannelDescriptor " + client);
        getChannelDescriptor(client)
                .then(channel => channel.getChannel())
                .then(channel => channel.join())
                .then(channel => {
                    chatSetupCompleted();
                    chatChannel = channel;
                    logger("chatChannel set.");
                    channel.on("messageAdded", onMessageAdded);
                });
    })
            .catch(
                    error =>
                console.log("- Error setting up twilio: ", error) || chatSetupFailed()
            );
}
// -----------------------------------------------------------------------------
function getChannelDescriptor(chatClient) {
    return chatClient
            .getPublicChannelDescriptors()
            .then(function (paginator) {
                if (paginator.items.length > 0)
                    return paginator.items[0];
                else {
                    chatClient
                            .createChannel({
                                uniqueName: uChatChannel,
                                friendlyName: fChatChannel
                            })
                            .then(function (newChannel) {
                                logger("+ Created general channel:");
                                console.log(newChannel);
                                return newChannel;
                            });
                }
            })
            .then(channel => channel)
            .catch(error => console.log("error getting channel", error) || error);
}

function chatSetupCompleted() {
    let template = $("#new-message").html();
    template = template.replace(
            "{{body}}",
            "<b>Chat Setup Completed. You can start chatting.</b>"
            );

    $(".chat").append(template);
}

function chatSetupFailed() {
    let template = $("#new-message").html();
    template = template.replace(
            "{{body}}",
            "<b>Chat Setup Failed. Please Contact Admin.</b>"
            );

    $(".chat").append(template);
}

function onMessageAdded(message) {
    let template = $("#new-message").html();
    template = template.replace(
            "{{body}}",
            `<b>${message.author}:</b> ${message.body}`
            );
    $(".chat").append(template);
}

function activateChatBox() {
    $("#message").removeAttr("disabled");
    $("#btn-start").click(function () {
        logger("Start...");
        if (clientId !== "") {
            doGetToken();
        }
    });
    $("#btn-stop").click(function () {
        logger("Stop no available, yet.");
    });
    $("#btn-chat").click(function () {
        const message = $("#message").val();
        $("#message").val("");
        chatChannel.sendMessage(message);
    });
    $("#message").on("keydown", function (e) {
        if (e.keyCode === 13) {
            $("#btn-chat").click();
        }
    });
}


// -----------------------------------------------------------------------------
function refresh() {
    // Since, programs cannot make an Ajax call to a remote resource,
    // Need to do an Ajax call to a local program that goes and gets the token.
    logger("Refresh the token using client id: " + clientId);
    //
    var jqxhr = $.get("clientTokenGet.php?clientid=" + clientId, function (theToken) {
        // logger("theToken :" + theToken + ":");
        logger("Token refreshed.");
        // -------------------------------
    }).fail(function () {
        logger("- Error refreshing the token.");
    });
}

function setClientId() {
    clientId = $("#username").val();
    if (clientId === "") {
        logger("Username: Required.");
    } else {
        logger("Username: " + clientId);
    }
}

function logger(message) {
    var log = document.getElementById('log');
    log.value += "\n> " + message;
    log.scrollTop = log.scrollHeight;
}
window.onload = function () {
    log.value = "+++ Start.";
    setClientId();
    // refresh();
    // doGetToken();
    activateChatBox();
};

// -----------------------------------------------------------------------------
