// -----------------------------------------------------------------

// Hardcode for testing
let username = "stacyhere";

function getToken() {
    return fetch(`/clientTokenGet.php?clientid=${username}`)
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error("- Network response was not ok.");
            })
            .catch(error => console.log("- Error fetching token: ", error) || error);
}
getToken()
        .then(token => {
            console.log("+ Returned token :" + token + ":");
            return Twilio.Chat.Client.create(token, {logLevel: "debug"});
        })
        .then(client => {
            getChannelDescriptor(client)
                    .then(channel => channel.getChannel())
                    .then(channel => channel.join())
                    .then(channel => {
                        chatSetupCompleted();
                        chatChannel = channel;
                        channel.on("messageAdded", onMessageAdded);
                        activateChatBox();
                    });
        })
        .catch(
                error =>
            console.log("- Error setting up twilio: ", error) || chatSetupFailed()
        );

// -----------------------------------------------------------------
function getChannelDescriptor(chatClient) {
    return chatClient
            .getPublicChannelDescriptors()
            .then(function (paginator) {
                if (paginator.items.length > 0)
                    return paginator.items[0];
                else {
                    chatClient
                            .createChannel({
                                uniqueName: "general",
                                friendlyName: "General Chat Channel"
                            })
                            .then(function (newChannel) {
                                console.log("Created general channel:");
                                console.log(newChannel);
                                return newChannel;
                            });
                }
            })
            .then(channel => channel)
            .catch(error => console.log("error getting channel", error) || error);
}

function chatSetupFailed() {
    let template = $("#new-message").html();
    template = template.replace(
            "{{body}}",
            "<b>Chat Setup Failed. Please Contact Admin.</b>"
            );

    $(".chat").append(template);
}
// -----------------------------------------------------------------
function onMessageAdded(message) {
    let template = $("#new-message").html();
    template = template.replace(
            "{{body}}",
            `<b>${message.author}:</b> ${message.body}`
            );

    $(".chat").append(template);
}

function chatSetupCompleted() {
    let template = $("#new-message").html();
    template = template.replace(
            "{{body}}",
            "<b>Chat Setup Completed. Start your conversation!</b>"
            );

    $(".chat").append(template);
}

function activateChatBox() {
    $("#message").removeAttr("disabled");
    $("#btn-chat").click(function () {
        const message = $("#message").val();
        $("#message").val("");

        //send message
        chatChannel.sendMessage(message);
    });

    $("#message").on("keydown", function (e) {
        if (e.keyCode === 13) {
            $("#btn-chat").click();
        }
    });
}

// -----------------------------------------------------------------
$(document).ready(function () {
    let chatChannel = "mychat";
//    let username = null;
//    while (!username) {
//        getUsername();
//    }
//    function getUsername() {
//        username = prompt("Enter a username");
//    }
});

